import { Key                                                                           } from 'ts-key-enum';
import { animationFrameScheduler, BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { exhaustMap, map, observeOn, switchMap, takeUntil, takeWhile, withLatestFrom   } from 'rxjs/operators';
import { ElementRef, Injectable                                                        } from '@angular/core';
import { Property                                                                      } from '@bespunky/typescript-utils';
import { DocumentRef                                                                   } from '@bespunky/angular-zen/core';

import { useActivationSwitch     } from '@bespunky/angular-cdk/shared';
import { EventWithModifiers      } from '@bespunky/angular-cdk/reactive-input/shared';
import { ReactiveMouseService    } from '@bespunky/angular-cdk/reactive-input/mouse';
import { ReactiveKeyboardService } from '@bespunky/angular-cdk/reactive-input/keyboard';
import { Camera, ViewBounds      } from '@bespunky/angular-cdk/navigables/camera';
import { accelerateWithKeyboard  } from '../rxjs/operators/accelerate-with-keyboard';
import { KeyboardModifierFactors } from './keyboard-modifier-factors';

export const DefaultKeyboardModifierFactors: KeyboardModifierFactors = {
    alt  : 0.7,
    ctrl : 1.2,
    shift: 1.5
};

type ActivationSwitch<TItem> = Property<ReactiveCamera<TItem>, BehaviorSubject<boolean>>;

@Injectable()
export abstract class ReactiveCamera<TItem> extends Camera<TItem>
{
    // Control Switchs
    public readonly zoomOnWheel   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnWheel   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly zoomOnKeyboard: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnKeyboard: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly zoomOnPinch   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnFlick   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnDrag    : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly flickX        : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly flickY        : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);

    // Factors
    public readonly moveFactor             : BehaviorSubject<number>                  = new BehaviorSubject(3);
    public readonly flickBreaksStrength    : BehaviorSubject<number>                  = new BehaviorSubject(1);
    public readonly flickSpeed             : BehaviorSubject<number>                  = new BehaviorSubject(30);
    public readonly keyboardModifierFactors: BehaviorSubject<KeyboardModifierFactors> = new BehaviorSubject(DefaultKeyboardModifierFactors);
        
    constructor(private document: DocumentRef, private mouse: ReactiveMouseService, private keyboard: ReactiveKeyboardService, element: ElementRef)
    {
        super(element);
        
        this.hookZoomOnWheel();
        this.hookMoveOnWheel();
        this.hookMoveOnDrag();
        this.hookZoomOnKeyboard();
        this.hookMoveOnKeyboard();
    }
    
    public switchOn(switchName: ActivationSwitch<TItem>): void
    {
        this[switchName].next(true);
    }

    public switchOff(switchName: ActivationSwitch<TItem>): void
    {
        this[switchName].next(false);
    }

    public toggleSwitch(switchName: ActivationSwitch<TItem>): void
    {
        this[switchName].next(!this[switchName].value);
    }

    private hookZoomOnWheel(): void
    {
        const vWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaY' });
        
        this.hookZoom(
            vWheel,
            // Calculate the mouse position relative to the drawing (not the viewport).
            (e, viewBounds) => viewBounds.left + e.offsetX,
            (e, viewBounds) => viewBounds.top  + e.offsetY,
            // Reverse deltaY so zooming in is positive and out is negative.
            e               => -Math.sign(e.deltaY)
        );
    }

    private hookMoveOnWheel(): void
    {
        const hWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaX' });
        
        this.hookPosition(hWheel, e => Math.sign(e.deltaX) * this.moveFactor.value, 'horizontal');
    }

    private hookZoomOnKeyboard(): void
    {
        const zoomIn  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowUp  , modifiers: { shiftKey: true } });
        const zoomOut = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowDown, modifiers: { shiftKey: true } });

        // There is no mouse point or anything so zoom around the center of the view
        this.hookZoom(zoomIn , (_, viewBounds) => viewBounds.viewCenterX, (_, viewBounds) => viewBounds.viewCenterY, () =>  1);
        this.hookZoom(zoomOut, (_, viewBounds) => viewBounds.viewCenterX, (_, viewBounds) => viewBounds.viewCenterY, () => -1);
    }

    private hookMoveOnKeyboard(): void
    {
        const moveRight = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowRight });
        const moveLeft  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowLeft  });
        const moveDown  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowDown  });
        const moveUp    = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowUp  });

        this.hookPosition(moveRight, () =>  this.moveFactor.value, 'horizontal');
        this.hookPosition(moveLeft , () => -this.moveFactor.value, 'horizontal');
        this.hookPosition(moveDown , () =>  this.moveFactor.value, 'vertical');
        this.hookPosition(moveUp   , () => -this.moveFactor.value, 'vertical');
    }
    
    private hookMoveOnDrag(): void
    {
        // Mouse move and up are registered with the document to allow detection when the mouse leaves the element and goes into another
        const dragStart = this.mouse.mouseButton(this.element , 'mousedown', { activationSwitch: this.moveOnDrag, button: 'main' });
        const dragging  = this.mouse.mouseButton(this.document, 'mousemove', { activationSwitch: this.moveOnDrag, button: 'main' });
        const dragEnd   = this.mouse.mouseButton(this.document, 'mouseup'  , { activationSwitch: this.moveOnDrag, button: 'main' });
        
        // Listen for drag start, then switch it dragging until dragging ends
        const move = dragStart.pipe(
            exhaustMap(() => dragging.pipe(takeUntil(dragEnd))),
        );

        // Reverse movement to match mouse move and hook
        this.hookPosition(move, e => -e.movementX, 'horizontal');
        this.hookPosition(move, e => -e.movementY, 'vertical'  );

        this.hookFlick(dragging, dragEnd, e => -e.movementX, 'horizontal');
        this.hookFlick(dragging, dragEnd, e => -e.movementY, 'vertical');
    }

    private hookPosition<T extends EventWithModifiers>(eventFeed: Observable<T>, getAmount: (event: T) => number, direction: 'horizontal' | 'vertical'): void
    {
        const movement = eventFeed.pipe(
            accelerateWithKeyboard(getAmount, this.keyboardModifierFactors),
            map(([amount]) => amount)
        );

        direction === 'horizontal' ? this.subscribe(movement, amount => this.move(amount, 0)) :
                                     this.subscribe(movement, amount => this.move(0, amount));
    }

    private hookFlick(dragging: Observable<MouseEvent>, dragEnd: Observable<MouseEvent>, getAmount: (event: MouseEvent) => number, direction: 'horizontal' | 'vertical'): void
    {
        const flickSwitch = direction === 'horizontal' ? this.flickX : this.flickY;
            
        // For every drag end, emit the lastest drag event to ensure movement amount is present
        const lastMovement = dragEnd.pipe(
            useActivationSwitch(flickSwitch),
            withLatestFrom(dragging),
            map(([, lastDragEvent]) => lastDragEvent)
        );

        const easeOut = this.easeOutMouseMovement(lastMovement, getAmount);

        direction === 'horizontal' ? this.subscribe(easeOut, amount => this.move(amount, 0)) :
                                     this.subscribe(easeOut, amount => this.move(0, amount));
    }

    private easeOutMouseMovement<T extends MouseEvent>(eventFeed: Observable<T>, getMovement: (event: T) => number): Observable<number>
    {
        /**
         * The idea is to get the last mouse movement amount, then repeat the movement decreasing the amount each time
         * until the amount exceeds zero.
         */
        const animationInterval = interval(this.flickSpeed.value);

        // Combine the timer and the breaks strength to have both values when calculating the next movement amount
        const easeOut = (movement: number) => combineLatest([animationInterval, this.flickBreaksStrength]).pipe(
            observeOn(animationFrameScheduler),
            // Calculate how much to decrease the original amount on the next animation step.
            // To calculate the next decreased movement: acceleration * animationStep
            // To pull the next value closer to zero:    Math.sign(movement) * animation * animationStep
            // To prevent a first value of 0:            Math.sign(movement) * animation * (animationStep + 1)
            map(([animationStep, acceleration]) => Math.sign(movement) * acceleration * (animationStep + 1)),
            // Calculate the next decreased movement amount
            map(breaksStrength => movement - breaksStrength),
            // Take the direction into account and stop the animation when exceeding zero
            takeWhile(nextMove => movement > 0 ? nextMove > 0 : nextMove < 0)
        );

        return eventFeed.pipe(
            // Extract the movement amount from the mouse event
            map(getMovement),
            // Cancel any animation previously launched and create a new one with the new amount
            switchMap(easeOut)
        );
    }

    private hookZoom<T extends EventWithModifiers>(
        eventFeed   : Observable<T>,
        getPositionX: (event: T, viewBounds: ViewBounds) => number,
        getPositionY: (event: T, viewBounds: ViewBounds) => number,
        getAmount   : (event: T) => number
    ): void
    {
        const zoom = eventFeed.pipe(
            accelerateWithKeyboard(getAmount, this.keyboardModifierFactors),
            withLatestFrom(this.viewBounds),
            map(([[amount, e], viewBounds]) =>
                [
                    getPositionX(e, viewBounds),
                    getPositionY(e, viewBounds),
                    amount
                ]
            ),
        );

        this.subscribe(zoom, ([positionX, positionY, amount]) => this.zoomOn(positionX, positionY, amount));
    }
}
