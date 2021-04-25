import { Observable             } from 'rxjs';
import { ElementRef, Injectable } from '@angular/core';
import { DocumentRef            } from '@bespunky/angular-zen';

import { createReactiveTouchInputObservable                                                          } from '../utils/create-reactive-touch-input-observable';
import { PanEventName, PinchEventName, PressEventName, RotateEventName, SwipeEventName, TapEventName } from '../types/touch-event';
import { TouchFeedConfig                                                                             } from '../feeds/touch-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveTouchService
{
    public pan(element: ElementRef | DocumentRef, eventName: PanEventName, config?: TouchFeedConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, config);
    }

    public pinch(element: ElementRef | DocumentRef, eventName: PinchEventName, config?: TouchFeedConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, config);
    }

    public press(element: ElementRef | DocumentRef, eventName: PressEventName, config?: TouchFeedConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, config);
    }

    public rotate(element: ElementRef | DocumentRef, eventName: RotateEventName, config?: TouchFeedConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, config);
    }

    public swipe(element: ElementRef | DocumentRef, eventName: SwipeEventName, config?: TouchFeedConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, config);
    }

    public tap(element: ElementRef | DocumentRef, eventName: TapEventName, config?: TouchFeedConfig): Observable<HammerInput>
    {
        return createReactiveTouchInputObservable<HammerInput>(element, eventName, config);
    }
}
