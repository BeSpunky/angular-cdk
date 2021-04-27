import { Key                                                                                             } from 'ts-key-enum';
import { animationFrameScheduler, BehaviorSubject, combineLatest, interval, merge, Observable            } from 'rxjs';
import { map, mergeMap, observeOn, pairwise, startWith, switchMap, takeUntil, takeWhile , withLatestFrom } from 'rxjs/operators';
import { ElementRef, Injectable                                                                          } from '@angular/core';
import { mergeToggled, toggled                                                                           } from '@bespunky/rxjs';
import { useActivationSwitch                                                                             } from '@bespunky/rxjs/operators';
import { DocumentRef                                                                                     } from '@bespunky/angular-zen/core';

import { EventWithModifiers, KeyboardModifiers                                                       } from '@bespunky/angular-cdk/reactive-input/shared';
import { ReactiveMouseService                                                                        } from '@bespunky/angular-cdk/reactive-input/mouse';
import { ReactiveKeyboardService                                                                     } from '@bespunky/angular-cdk/reactive-input/keyboard';
import { ReactiveTouchService                                                                        } from '@bespunky/angular-cdk/reactive-input/touch';
import { Camera                                                                                      } from '@bespunky/angular-cdk/navigables/camera';
import { accelerateWithKeyboard                                                                      } from '../rxjs/operators/accelerate-with-keyboard';
import { DefaultKeyboardModifierFactors, KeyboardModifierFactors                                     } from './keyboard-modifier-factors';
import { ActivationSwitch, ZoomConfig, PositionExtractor, PanDirection, AmountExtractor, FlickConfig } from './_util-types';

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
    public readonly swipeFlickFactor       : BehaviorSubject<number>                  = new BehaviorSubject(0.4);
    public readonly flickBreaksStrength    : BehaviorSubject<number>                  = new BehaviorSubject(1);
    public readonly flickSpeed             : BehaviorSubject<number>                  = new BehaviorSubject(30);
        
    constructor(private document: DocumentRef, private mouse: ReactiveMouseService, private keyboard: ReactiveKeyboardService, private touch: ReactiveTouchService, element: ElementRef)
    {
        super(element);
        
        this.hookZoomOnWheel();
        this.hookZoomOnKeyboard();
        this.hookZoomOnPinch();
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
        
        this.hookStandardZoom({
            eventFeed   : vWheel,
            // Calculate the mouse position relative to the drawing (not the viewport).
            getPositionX: (e, viewBounds) => viewBounds.left + e.offsetX,
            getPositionY: (e, viewBounds) => viewBounds.top  + e.offsetY,
            // Reverse deltaY so zooming in is positive and out is negative.
            getAmount   : e               => -Math.sign(e.deltaY)
        });
    }

    private hookZoomOnKeyboard(): void
    {
        const zoomIn  = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowUp  , modifiers: { shiftKey: true } });
        const zoomOut = this.keyboard.keydown(this.element, { activationSwitch: this.zoomOnKeyboard, key: Key.ArrowDown, modifiers: { shiftKey: true } });

        // There is no mouse point or anything so zoom around the center of the view.
        // As keyboard zoom is activated using the shift modifier, which is also used for keyboard acceleration, the camera behaved
        // in an unexpected manner. Hence the hooking without keyboard acceleration here.
        this.hookStandardZoom({ eventFeed: zoomIn , getPositionX: (_, viewBounds) => viewBounds.viewCenterX, getPositionY: (_, viewBounds) => viewBounds.viewCenterY, getAmount: () =>  1 });
        this.hookStandardZoom({ eventFeed: zoomOut, getPositionX: (_, viewBounds) => viewBounds.viewCenterX, getPositionY: (_, viewBounds) => viewBounds.viewCenterY, getAmount: () => -1 });
    }

    private hookZoomOnPinch(): void
    {
        const pinchmove   = this.touch.pinch(this.element, 'pinchmove'  , { activationSwitch: this.zoomOnPinch, enable: true, threshold: 0.05 });
        const pinchStart  = this.touch.pinch(this.element, 'pinchstart' , { activationSwitch: this.zoomOnPinch, enable: true });
        const pinchEnd    = this.touch.pinch(this.element, 'pinchend'   , { activationSwitch: this.zoomOnPinch, enable: true });
        const pinchCancel = this.touch.pinch(this.element, 'pinchcancel', { activationSwitch: this.zoomOnPinch, enable: true });
        // Pinching sometimes gets stuck. Seems like it happens when a finger leaves the element or the screen.
        // These compensate and abort pinching
        const pinchEndDoc    = this.touch.pinch(this.document, 'pinchend'   , { activationSwitch: this.zoomOnPinch, enable: true });
        const pinchCancelDoc = this.touch.pinch(this.document, 'pinchcancel', { activationSwitch: this.zoomOnPinch, enable: true });
        const panStartDoc    = this.touch.pan  (this.document, 'panstart'   , { activationSwitch: this.zoomOnPinch });
        
        const abortZoom = merge(pinchEnd, pinchCancel, pinchEndDoc, pinchCancelDoc, panStartDoc);
        const zoom      = mergeToggled(pinchmove, { on: pinchStart, off: abortZoom }).pipe(
            startWith({ scale: 0 }),
            pairwise(),
            map(([lastE, e]) => [Math.sign(e.scale - lastE.scale), e])
        ) as Observable<[number, HammerInput]>;

        this.hookZoom(
            zoom,
            (e, viewBounds) => viewBounds.left + e.center.x,
            (e, viewBounds) => viewBounds.top  + e.center.y
        );
    }

    private hookStandardZoom<TEvent>({ eventFeed, getPositionX, getPositionY, getAmount }: ZoomConfig<TEvent>): void
    {
        const zoomAmount = eventFeed.pipe(map(e => [getAmount(e), e] as [number, TEvent]));

        this.hookZoom(zoomAmount, getPositionX, getPositionY);
    }

    private hookZoom<TEvent>(eventFeed: Observable<[amount: number, event: TEvent]>, getPositionX: PositionExtractor<TEvent>, getPositionY: PositionExtractor<TEvent>): void
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
    
    private hookPanOnDrag(): void
    {
        // Mouse pan and up are registered with the document to allow detection when the mouse leaves the element and goes into another
        const dragStart = this.mouse.button(this.element , 'mousedown', { activationSwitch: this.panOnDrag, button: 'main' });
        const dragging  = this.mouse.button(this.document, 'mousemove', { activationSwitch: this.panOnDrag, button: 'main' });
        const dragEnd   = this.mouse.button(this.document, 'mouseup'  , { activationSwitch: this.panOnDrag, button: 'main' });
        
        // Listen for drag events, but only between drag start and drag end
        const pan = mergeToggled(dragging, { on: dragStart, off: dragEnd });

        // Reverse movement to match mouse pan and hook
        this.hookKeyboardAcceleratedPosition(pan, e => -e.movementX, 'horizontal');
        this.hookKeyboardAcceleratedPosition(pan, e => -e.movementY, 'vertical'  );
        // Finish panning with an ease out animation
        this.hookFlickOnMouseDrag(dragStart, dragging, dragEnd);
    }

    private hookPanOnWheel(): void
    {
        const hWheel = this.mouse.wheel(this.element, { activationSwitch: this.zoomOnWheel, direction: 'deltaX' });
        
        this.hookKeyboardAcceleratedPosition(hWheel, e => e.deltaX * this.wheelPanSpeedFactor.value, 'horizontal');
    }

    private hookPanOnKeyboard(): void
    {
        this.hookPanOnKey(Key.ArrowRight, () =>  this.keyboardPanSpeed.value, 'horizontal');
        this.hookPanOnKey(Key.ArrowLeft , () => -this.keyboardPanSpeed.value, 'horizontal');
        this.hookPanOnKey(Key.ArrowDown , () =>  this.keyboardPanSpeed.value, 'vertical'  , { shiftKey: false });
        this.hookPanOnKey(Key.ArrowUp   , () => -this.keyboardPanSpeed.value, 'vertical'  , { shiftKey: false });
    }

    private hookPanOnKey(key: Key, getAmount: AmountExtractor<KeyboardEvent>, direction: PanDirection, modifiers?: Partial<KeyboardModifiers>): void
    {
        const panning = this.keyboard.keydown(this.element, { activationSwitch: this.panOnKeyboard, key, modifiers });
        const panEnd  = this.keyboard.keyup  (this.element, { activationSwitch: this.panOnKeyboard, key, modifiers });
        
        this.hookKeyboardAcceleratedPosition(panning, getAmount, direction);

        this.hookFlick({ trigger: panEnd, abortOn: panning, getLastMoveAmount: getAmount, direction });
    }

    private hookPanOnTouch(): void
    {
        // Mouse pan and up are registered with the document to allow detection when the mouse leaves the element and goes into another
        const panStart = this.touch.pan(this.element , 'panstart', { activationSwitch: this.panOnTouch, ignoreMouse: true, direction: 'all', threshold: 1, velocity: 0 });
        const panning  = this.touch.pan(this.document, 'panmove' , { activationSwitch: this.panOnTouch, ignoreMouse: true, direction: 'all', threshold: 1, velocity: 0 });
        const panEnd   = this.touch.pan(this.document, 'panend'  , { activationSwitch: this.panOnTouch, ignoreMouse: true, direction: 'all', threshold: 1, velocity: 0 });
        
        // Hammerjs provides the *total* pan amount from the position panning started as the delta value.
        // As camera panning is done with differential amounts the delta must be calculated relatively to the last event.
        const pan = toggled(panning, { on: panStart, off: panEnd }).pipe(
            mergeMap(p => p.pipe(
                // Reset the first value on each pan start to make sure the delta is always calculated
                // relativly to the current pan session.
                startWith({ deltaX: 0, deltaY: 0 }),
                pairwise()
            ))
        );

        // Reverse movement to match mouse pan and hook
        this.hookStandardPosition(pan, ([lastE, e]) => lastE.deltaX - e.deltaX, 'horizontal');
        this.hookStandardPosition(pan, ([lastE, e]) => lastE.deltaY - e.deltaY, 'vertical');
        // Finish panning with an ease out animation
        this.hookFlickOnTouchSwipe(panStart);
    }

    private choosePanMethod(direction: PanDirection): (amount: number) => void
    {
        const method = direction === 'horizontal' ? this.panX : this.panY;

        return method.bind(this);
    }

    private choosePanFlickActivationSwitch(direction: PanDirection): Observable<boolean>
    {
        return direction === 'horizontal' ? this.flickX : this.flickY;
    }

    private hookStandardPosition<TEvent>(eventFeed: Observable<TEvent>, getAmount: AmountExtractor<TEvent>, direction: PanDirection): void
    {
        const movement = eventFeed.pipe(map(e => [getAmount(e), e] as [number, TEvent]));

        this.hookPosition(movement, direction);
    }

    private hookKeyboardAcceleratedPosition<TEvent extends EventWithModifiers>(eventFeed: Observable<TEvent>, getAmount: AmountExtractor<TEvent>, direction: PanDirection): void
    {
        const movement = eventFeed.pipe(accelerateWithKeyboard(getAmount, this.keyboardModifierFactors));

        this.hookPosition(movement, direction);
    }

    private hookPosition<TEvent>(eventFeed: Observable<[amount: number, event: TEvent]>, direction: PanDirection): void
    {
        const movement  = eventFeed.pipe(map(([amount]) => amount));
        const panCamera = this.choosePanMethod(direction);

        this.subscribe(movement, panCamera);
    }

    private hookFlickOnMouseDrag(dragStart: Observable<MouseEvent>, dragging: Observable<MouseEvent>, dragEnd: Observable<MouseEvent>)
    {
        // For every drag end, emit the lastest drag event to ensure movement amount is present
        const lastMovement = dragEnd.pipe(
            withLatestFrom(dragging),
            map(([, lastDragEvent]) => lastDragEvent)
        );

        this.hookFlick({ trigger: lastMovement, abortOn: dragStart, getLastMoveAmount: e => -e.movementX, direction: 'horizontal' });
        this.hookFlick({ trigger: lastMovement, abortOn: dragStart, getLastMoveAmount: e => -e.movementY, direction: 'vertical' });
    }

    private hookFlickOnTouchSwipe(panStart: Observable<HammerInput>): void
    {
        const swipeX = this.touch.swipe(this.element, 'swipe', { activationSwitch: this.panOnTouch, ignoreMouse: true, direction: 'horizontal', threshold: 3.5 });
        const swipeY = this.touch.swipe(this.element, 'swipe', { activationSwitch: this.panOnTouch, ignoreMouse: true, direction: 'vertical'  , threshold: 3.5 });

        this.hookFlick({ trigger: swipeX, abortOn: panStart, getLastMoveAmount: e => -e.deltaX * this.swipeFlickFactor.value, direction: 'horizontal' });
        this.hookFlick({ trigger: swipeY, abortOn: panStart, getLastMoveAmount: e => -e.deltaY * this.swipeFlickFactor.value, direction: 'vertical'   });
    }

    private hookFlick<TTrigger, TAbort>({ trigger, abortOn, direction, getLastMoveAmount }: FlickConfig<TTrigger, TAbort>): void
    {
        const flickSwitch = this.choosePanFlickActivationSwitch(direction);
        const panCamera   = this.choosePanMethod(direction);

        const lastMovement     = trigger.pipe(useActivationSwitch(flickSwitch));
        const easeOutAnimation = this.easeOutMouseMovement(lastMovement, abortOn, getLastMoveAmount);

        this.subscribe(easeOutAnimation, panCamera);
    }

    private easeOutMouseMovement<TEvent, TAbort>(lastMovement: Observable<TEvent>, abort: Observable<TAbort>, getMovement: AmountExtractor<TEvent>): Observable<number>
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

        return lastMovement.pipe(
            // Extract the movement amount from the mouse event
            map(getMovement),
            // Cancel any animation previously launched and create a new one with the new amount
            switchMap(easeOut)
        );
    }
}
