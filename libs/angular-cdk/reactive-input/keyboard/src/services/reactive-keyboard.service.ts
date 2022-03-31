import { Observable             } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';
import { DocumentRef            } from '@bespunky/angular-zen';

import { createReactiveInputWithModifiersObservable } from '@bespunky/angular-cdk/reactive-input/shared';
import { KeyboardFeedConfig                         } from '../feeds/keyboard-feed-config';
import { KeyboardEventName                          } from '../types/keyboard-events';

@Injectable({ providedIn: 'root' })
export class ReactiveKeyboardService
{
    public keydown(element: ElementRef | DocumentRef, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        return this.key(element, 'keydown', config);
    }

    public keyup(element: ElementRef | DocumentRef, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        return this.key(element, 'keyup', config);
    }

    public keypress(element: ElementRef | DocumentRef, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        return this.key(element, 'keypress', config);
    }

    private key(element: ElementRef | DocumentRef, eventName: KeyboardEventName, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        const { key } = config || {};
        
        // TODO: Research making keyboard events work even without element focus, then replace document with element.
        let keydown = createReactiveInputWithModifiersObservable<KeyboardEvent>(new ElementRef(document), eventName, config);
        
        if (key) keydown = keydown.pipe(filter(e => e.key === key));

        return keydown;
    }
}
