import { Key                         } from 'ts-key-enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom         } from 'rxjs/operators';
import { ElementRef, Injectable      } from '@angular/core';

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

    // Factors
    public readonly moveFactor             : BehaviorSubject<number>                  = new BehaviorSubject(3);
    public readonly keyboardModifierFactors: BehaviorSubject<KeyboardModifierFactors> = new BehaviorSubject(DefaultKeyboardModifierFactors);
        
    constructor(private element: ElementRef, private mouse: ReactiveMouseService, private keyboard: ReactiveKeyboardService)
    {
        super();
        
        this.hookZoomOnWheel();
        this.hookMoveOnWheel();
        this.hookZoomOnKeyboard();
        this.hookMoveOnKeyboard();
    }

    private hookZoomOnWheel(): void
    {
        const vWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaY' });
        
        this.hookZoom(
            vWheel,
            // Calculate the mouse position relative to the drawing (not the viewport).
            (e, viewBounds) => viewBounds.left + e.offsetX,
            // Reverse deltaY so zooming in is positive and out is negative.
            e               => -Math.sign(e.deltaY)
        );
    }

    private hookMoveOnWheel(): void
    {
        const hWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaX' });
        
        this.hookPosition(hWheel, e => Math.sign(e.deltaX) * this.moveFactor.value);
    }

    private hookZoomOnKeyboard(): void
    {
        const zoomIn  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowUp   });
        const zoomOut = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowDown });

        // There is no mouse point or anything so zoom around the center of the view
        this.hookZoom(zoomIn , (_, viewBounds) => viewBounds.viewCenter, () =>  1);
        this.hookZoom(zoomOut, (_, viewBounds) => viewBounds.viewCenter, () => -1);
    }

    private hookMoveOnKeyboard(): void
    {
        const moveLeft  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowLeft  });
        const moveRight = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowRight });

        this.hookPosition(moveLeft , () =>  this.moveFactor.value);
        this.hookPosition(moveRight, () => -this.moveFactor.value);
    }
    
    private hookPosition<T extends EventWithModifiers>(eventFeed: Observable<T>, getAmount: (event: T) => number): void
    {
        const move = eventFeed.pipe(
            accelerateWithKeyboard(getAmount, this.keyboardModifierFactors),
        );

        this.subscribe(move, ([amount]) => this.move(amount));
    }

    private hookZoom<T extends EventWithModifiers>(
        eventFeed  : Observable<T>,
        getPosition: (event: T, viewBounds: ViewBounds) => number,
        getAmount  : (event: T) => number
    ): void
    {
        const zoom = eventFeed.pipe(
            accelerateWithKeyboard(getAmount, this.keyboardModifierFactors),
            withLatestFrom(this.viewBounds),
            map(([[amount, e], viewBounds]) => [getPosition(e, viewBounds), amount]),
        );

        this.subscribe(zoom, ([position, amount]) => this.zoomOn(position, amount));
    }
}
