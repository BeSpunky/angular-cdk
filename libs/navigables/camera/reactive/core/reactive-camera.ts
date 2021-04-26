import { Key                                                                                   } from 'ts-key-enum';
import { animationFrameScheduler, BehaviorSubject, combineLatest, interval, merge, Observable         } from 'rxjs';
import { exhaustMap, map, observeOn, pairwise, switchMap, takeUntil, takeWhile, withLatestFrom } from 'rxjs/operators';
import { ElementRef, Injectable                                                                } from '@angular/core';
import { Property                                                                              } from '@bespunky/typescript-utils';
import { useActivationSwitch                                                                                           } from '@bespunky/rxjs/operators';

import { useActivationSwitch     } from '@bespunky/angular-cdk/shared';
import { EventWithModifiers      } from '@bespunky/angular-cdk/reactive-input/shared';
import { ReactiveMouseService    } from '@bespunky/angular-cdk/reactive-input/mouse';
import { ReactiveKeyboardService } from '@bespunky/angular-cdk/reactive-input/keyboard';
import { ReactiveTouchService    } from '@bespunky/angular-cdk/reactive-input/touch';
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
    public readonly zoomOnKeyboard: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly zoomOnPinch   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly panOnDrag     : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly panOnWheel    : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly panOnKeyboard : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly panOnTouch    : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly flickX        : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly flickY        : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);

    // Factors
    public readonly wheelPanSpeedFactor    : BehaviorSubject<number>                  = new BehaviorSubject(1);
    public readonly keyboardPanSpeed       : BehaviorSubject<number>                  = new BehaviorSubject(30);
    public readonly keyboardModifierFactors: BehaviorSubject<KeyboardModifierFactors> = new BehaviorSubject(DefaultKeyboardModifierFactors);
    public readonly flickBreaksStrength    : BehaviorSubject<number>                  = new BehaviorSubject(1);
    public readonly flickSpeed             : BehaviorSubject<number>                  = new BehaviorSubject(30);
        
    constructor(private document: DocumentRef, private mouse: ReactiveMouseService, private keyboard: ReactiveKeyboardService, private touch: ReactiveTouchService, element: ElementRef)
    {
        super(element);
        
        this.hookZoomOnWheel();
        this.hookZoomOnKeyboard();
        this.hookPanOnDrag();
        this.hookPanOnWheel();
        this.hookPanOnKeyboard();
        this.hookPanOnTouch();
    }

    public switchOn    (switchName: ActivationSwitch<TItem>): void { this[switchName].next(true);                    }
    public switchOff   (switchName: ActivationSwitch<TItem>): void { this[switchName].next(false);                   }
    public toggleSwitch(switchName: ActivationSwitch<TItem>): void { this[switchName].next(!this[switchName].value); }

    private hookZoomOnWheel(): void
    {
        const vWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaY' });
        
        this.hookKeyboardAcceleratedZoom(
            vWheel,
            // Calculate the mouse position relative to the drawing (not the viewport).
            (e, viewBounds) => viewBounds.left + e.offsetX,
            (e, viewBounds) => viewBounds.top  + e.offsetY,
            // Reverse deltaY so zooming in is positive and out is negative.
            e               => -Math.sign(e.deltaY)
        );
    }

    private hookZoomOnKeyboard(): void
    {
        const zoomIn  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowUp  , modifiers: { shiftKey: true } });
        const zoomOut = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowDown, modifiers: { shiftKey: true } });

        // There is no mouse point or anything so zoom around the center of the view.
        // As keyboard zoom is activated using the shift modifier, which is also used for keyboard acceleration, the camera behaved
        // in an unexpected manner. Hence the hooking without keyboard acceleration here.
        this.hookStandardZoom(zoomIn , (_, viewBounds) => viewBounds.viewCenterX, (_, viewBounds) => viewBounds.viewCenterY, () =>  1);
        this.hookStandardZoom(zoomOut, (_, viewBounds) => viewBounds.viewCenterX, (_, viewBounds) => viewBounds.viewCenterY, () => -1);
    }
    
    private hookPanOnDrag(): void
    {
        // Mouse pan and up are registered with the document to allow detection when the mouse leaves the element and goes into another
        const dragStart = this.mouse.button(this.element , 'mousedown', { activationSwitch: this.panOnDrag, button: 'main' });
        const dragging  = this.mouse.button(this.document, 'mousemove', { activationSwitch: this.panOnDrag, button: 'main' });
        const dragEnd   = this.mouse.button(this.document, 'mouseup'  , { activationSwitch: this.panOnDrag, button: 'main' });
        
        // Listen for drag start, then switch it dragging until dragging ends
        const pan = dragStart.pipe(
            exhaustMap(() => dragging.pipe(takeUntil(dragEnd)))
        );

        // Reverse movement to match mouse pan and hook
        this.hookKeyboardAcceleratedPosition(pan, e => -e.movementX, 'horizontal');
        this.hookKeyboardAcceleratedPosition(pan, e => -e.movementY, 'vertical'  );

        this.hookFlick(dragStart, dragging, dragEnd, e => -e.movementX, 'horizontal');
        this.hookFlick(dragStart, dragging, dragEnd, e => -e.movementY, 'vertical');
    }

    private hookPanOnWheel(): void
    {
        const hWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaX' });
        
        this.hookKeyboardAcceleratedPosition(hWheel, e => e.deltaX * this.wheelPanSpeedFactor.value, 'horizontal');
    }

    private hookPanOnKeyboard(): void
    {
        const panRight = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowRight });
        const panLeft  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowLeft  });
        const panDown  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowDown , modifiers: { shiftKey: false } });
        const panUp    = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowUp   , modifiers: { shiftKey: false } });

        this.hookKeyboardAcceleratedPosition(panRight, () =>  this.keyboardPanSpeed.value, 'horizontal');
        this.hookKeyboardAcceleratedPosition(panLeft , () => -this.keyboardPanSpeed.value, 'horizontal');
        this.hookKeyboardAcceleratedPosition(panDown , () =>  this.keyboardPanSpeed.value, 'vertical'  );
        this.hookKeyboardAcceleratedPosition(panUp   , () => -this.keyboardPanSpeed.value, 'vertical'  );
    }

    private hookPanOnTouch(): void
    {
        // Mouse pan and up are registered with the document to allow detection when the mouse leaves the element and goes into another
        const panStart = this.touch.pan(this.element , 'panstart', { activationSwitch: this.panOnTouch, direction: 'all', threshold: 1, velocity: 0 });
        const panning  = this.touch.pan(this.document, 'panmove' , { activationSwitch: this.panOnTouch, direction: 'all', threshold: 1, velocity: 0 });
        const panEnd   = this.touch.pan(this.document, 'panend'  , { activationSwitch: this.panOnTouch, direction: 'all', threshold: 1, velocity: 0 });
        
        // Listen for drag start, then switch it dragging until dragging ends
        const pan = panStart.pipe(
            exhaustMap(() => panning.pipe(
                takeUntil(panEnd),
                pairwise()
            ))
        );

        // Reverse movement to match mouse pan and hook
        this.hookStandardPosition(pan, ([lastE, e]) => lastE.deltaX - e.deltaX, 'horizontal');
        this.hookStandardPosition(pan, ([lastE, e]) => lastE.deltaY - e.deltaY, 'vertical'  );

        const swipeX = this.touch.swipe(this.element, 'swipe', { activationSwitch: this.panOnTouch, direction: 'horizontal', threshold: 5 });
        const swipeY = this.touch.swipe(this.element, 'swipe', { activationSwitch: this.panOnTouch, direction: 'vertical'  , threshold: 5 });

        const abortEase = merge(panStart, panEnd);

        // TODO: Replace fixed factors with subjets
        this.subscribe(this.easeOutMouseMovement(swipeX, abortEase, e => -e.deltaX * 0.4), amount => this.panX(amount));
        this.subscribe(this.easeOutMouseMovement(swipeY, abortEase, e => -e.deltaY * 0.4), amount => this.panY(amount));
    }

    private panCamera(amount: number, direction: 'horizontal' | 'vertical'): void
    {
        direction === 'horizontal' ? this.panX(amount) : this.panY(amount);
    }

    private hookStandardPosition<TEvent>(eventFeed: Observable<TEvent>, getAmount: (event: TEvent) => number, direction: 'horizontal' | 'vertical'): void
    {
        const movement = eventFeed.pipe(map(e => [getAmount(e), e] as [number, TEvent]));

        this.hookPosition(movement, direction);
    }

    private hookKeyboardAcceleratedPosition<T extends EventWithModifiers>(eventFeed: Observable<T>, getAmount: (event: T) => number, direction: 'horizontal' | 'vertical'): void
    {
        const movement = eventFeed.pipe(accelerateWithKeyboard(getAmount, this.keyboardModifierFactors));

        this.hookPosition(movement, direction);
    }

    private hookPosition<TEvent>(eventFeed: Observable<[amount: number, event: TEvent]>, direction: 'horizontal' | 'vertical'): void
    {
        const movement = eventFeed.pipe(map(([amount]) => amount));

        this.subscribe(movement, amount => this.panCamera(amount, direction));
    }

    private hookFlick<TEvent>(dragStart: Observable<TEvent>, dragging: Observable<TEvent>, dragEnd: Observable<TEvent>, getAmount: (event: TEvent) => number, direction: 'horizontal' | 'vertical'): void
    {
        const flickSwitch = direction === 'horizontal' ? this.flickX : this.flickY;
            
        // For every drag end, emit the lastest drag event to ensure movement amount is present
        const lastMovement = dragEnd.pipe(
            useActivationSwitch(flickSwitch),
            withLatestFrom(dragging),
            map(([, lastDragEvent]) => lastDragEvent)
        );

        this.subscribe(
            this.easeOutMouseMovement(lastMovement, dragStart, getAmount),
            amount => this.panCamera(amount, direction)
        );
    }

    private easeOutMouseMovement<TEvent, TAbort>(eventFeed: Observable<TEvent>, abort: Observable<TAbort>, getMovement: (event: TEvent) => number): Observable<number>
    {
        /**
         * The idea is to get the last mouse movement amount, then repeat the movement decreasing the amount each time
         * until the amount exceeds zero.
         */
        const animationInterval = interval(this.flickSpeed.value);

        // Combine the timer and the breaks strength to have both values when calculating the next movement amount
        const easeOut = (movement: number) => combineLatest([animationInterval, this.flickBreaksStrength]).pipe(
            // Allow aborting the animation with another observable
            takeUntil(abort),
            // Only process on browser animation rerender
            observeOn(animationFrameScheduler),
            // Calculate how much to decrease the original amount on the next animation step.
            // To calculate the next decreased movement: acceleration * animationStep
            // To pull the next value closer to zero:    Math.sign(movement) * animation * animationStep
            // To prevent a first value of 0:            Math.sign(movement) * animation * (animationStep + 1)
            map(([animationStep, acceleration]) => Math.sign(movement) * acceleration * (animationStep + 1)),
            // Calculate the next decreased movement amount
            map(breaksStrength => movement - breaksStrength),
            // Take the direction into account and stop the animation when exceeding zero
            takeWhile(nextPan => movement > 0 ? nextPan > 0 : nextPan < 0)
        );

        return eventFeed.pipe(
            // Extract the movement amount from the mouse event
            map(getMovement),
            // Cancel any animation previously launched and create a new one with the new amount
            switchMap(easeOut)
        );
    }

    private hookStandardZoom<TEvent>(
        eventFeed   : Observable<TEvent>,
        getPositionX: (event: TEvent, viewBounds: ViewBounds) => number,
        getPositionY: (event: TEvent, viewBounds: ViewBounds) => number,
        getAmount   : (event: TEvent) => number
    )
    {
        const zoomAmount = eventFeed.pipe(map(e => [getAmount(e), e] as [number, TEvent]));

        this.hookZoom(zoomAmount, getPositionX, getPositionY);
    }

    private hookKeyboardAcceleratedZoom<T extends EventWithModifiers>(
        eventFeed   : Observable<T>,
        getPositionX: (event: T, viewBounds: ViewBounds) => number,
        getPositionY: (event: T, viewBounds: ViewBounds) => number,
        getAmount   : (event: T) => number
    )
    {
        const zoomAmount = eventFeed.pipe(accelerateWithKeyboard(getAmount, this.keyboardModifierFactors));

        this.hookZoom(zoomAmount, getPositionX, getPositionY);
    }

    private hookZoom<TEvent>(
        eventFeed   : Observable<[amount: number, event: TEvent]>,
        getPositionX: (event: TEvent, viewBounds: ViewBounds) => number,
        getPositionY: (event: TEvent, viewBounds: ViewBounds) => number
    ): void
    {
        const zoom = eventFeed.pipe(
            withLatestFrom(this.viewBounds),
            map(([[amount, e], viewBounds]) =>
                [
                    getPositionX(e, viewBounds),
                    getPositionY(e, viewBounds),
                    amount
                ]
            )
        );

        this.subscribe(zoom, ([positionX, positionY, amount]) => this.zoomOn(positionX, positionY, amount));
    }
}
