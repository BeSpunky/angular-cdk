import { Observable             } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';
import { DocumentRef            } from '@bespunky/angular-zen';

import { createReactiveInputWithModifiersObservable } from '@bespunky/angular-cdk/reactive-input/shared';
import { KeyboardFeedConfig                         } from '../feeds/keyboard-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveKeyboardService
{
    public keydown(element: ElementRef | DocumentRef, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        const { key } = config || {};
        
        // TODO: Replace document with element and make it work even without focus
        let keydown = createReactiveInputWithModifiersObservable<KeyboardEvent>(new ElementRef(document), 'keydown', config);
        
        if (key) keydown = keydown.pipe(filter(e => e.key === key));

        return keydown;
    }
}
