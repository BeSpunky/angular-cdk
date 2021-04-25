import { fromEvent, Observable   } from 'rxjs';
import { filter                  } from 'rxjs/operators';
import { ElementRef              } from '@angular/core';
import { DocumentRef             } from '@bespunky/angular-zen';

import { useActivationSwitch     } from '@bespunky/angular-cdk/shared';
import { EventWithModifiers      } from '../types/event-with-modifiers';
import { KeyboardModifiers       } from '../types/keyboard-modifiers';
import { FeedWithModifiersConfig } from '../feeds/feed-config';

export function createReactiveInputObservable<TEvent extends EventWithModifiers>(element: ElementRef | DocumentRef, eventName: string, config?: FeedWithModifiersConfig): Observable<TEvent>
{
    const { activationSwitch, modifiers } = config || {};
    
    const nativeElement = element instanceof DocumentRef ? element.nativeDocument : element.nativeElement;
    
    let event = fromEvent<TEvent>(nativeElement, eventName);
    
    if (activationSwitch) event = event.pipe(useActivationSwitch(activationSwitch));
    if (modifiers)
    {
        event = event.pipe(
            filter(e => Object.keys(modifiers)
                              .every(modifier => e[modifier] === modifiers[modifier as keyof KeyboardModifiers]))
        );
    }

    return event;
}