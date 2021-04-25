import { Observable                    } from 'rxjs';
import { filter                        } from 'rxjs/operators';
import { ElementRef                    } from '@angular/core';
import { DocumentRef                   } from '@bespunky/angular-zen';

import { TouchEventName                } from '../types/touch-event';
import { TouchDirectionCodes           } from '../types/touch-direction';
import { TouchFeedConfig               } from '../feeds/touch-feed-config';
import { createReactiveInputObservable } from '@bespunky/angular-cdk/reactive-input/shared/utils/create-reactive-input-observable';

export function createReactiveTouchInputObservable<TEvent extends HammerInput>(element: ElementRef | DocumentRef, eventName: TouchEventName, config?: TouchFeedConfig): Observable<TEvent>
{
    const { direction } = config || {};
    
    let event = createReactiveInputObservable(element, eventName, config) as Observable<TEvent>;

    if (direction) event = event.pipe(filter(e => e.direction === TouchDirectionCodes[direction]));

    return event;
}