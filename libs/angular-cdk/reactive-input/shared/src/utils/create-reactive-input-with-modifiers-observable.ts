import { Observable                    } from 'rxjs';
import { filter                        } from 'rxjs/operators';
import { ElementRef                    } from '@angular/core';
import { DocumentRef                   } from '@bespunky/angular-zen';

import { EventWithModifiers            } from '../types/event-with-modifiers';
import { KeyboardModifiers             } from '../types/keyboard-modifiers';
import { FeedWithModifiersConfig       } from '../feeds/feed-config';
import { createReactiveInputObservable } from './create-reactive-input-observable';

export function createReactiveInputWithModifiersObservable<TEvent extends EventWithModifiers>(element: ElementRef | DocumentRef, eventName: string, config?: FeedWithModifiersConfig): Observable<TEvent>
{
    const { modifiers } = config || {};
    
    let event = createReactiveInputObservable<TEvent>(element, eventName, config);

    if (modifiers)
    {
        event = event.pipe(
            filter(e => Object.keys(modifiers)
                              .every(modifier => e[modifier] === modifiers[modifier as keyof KeyboardModifiers]))
        );
    }

    return event;
}