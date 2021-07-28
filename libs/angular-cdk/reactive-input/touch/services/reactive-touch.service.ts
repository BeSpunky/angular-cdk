import { Observable             } from 'rxjs';
import { ElementRef, Injectable } from '@angular/core';
import { DocumentRef            } from '@bespunky/angular-zen';

import { createReactiveTouchInputObservable                                                          } from '../utils/create-reactive-touch-input-observable';
import { PanEventName, PinchEventName, PressEventName, RotateEventName, SwipeEventName, TapEventName } from '../types/touch-event';
import { TouchFeedWithRecognizerConfig                                                               } from '../feeds/touch-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveTouchService
{
    public pan(element: ElementRef | DocumentRef, eventName: PanEventName, config?: TouchFeedWithRecognizerConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, 'pan', config);
    }

    public pinch(element: ElementRef | DocumentRef, eventName: PinchEventName, config?: TouchFeedWithRecognizerConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, 'pinch', config);
    }

    public press(element: ElementRef | DocumentRef, eventName: PressEventName, config?: TouchFeedWithRecognizerConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, 'press', config);
    }

    public rotate(element: ElementRef | DocumentRef, eventName: RotateEventName, config?: TouchFeedWithRecognizerConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, 'rotate', config);
    }

    public swipe(element: ElementRef | DocumentRef, eventName: SwipeEventName, config?: TouchFeedWithRecognizerConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, 'swipe', config);
    }

    public tap(element: ElementRef | DocumentRef, eventName: TapEventName, config?: TouchFeedWithRecognizerConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, 'tap', config);
    }
}
