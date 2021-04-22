import { Observable, fromEvent  } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';

import { useActivationSwitch } from '@bespunky/angular-cdk/shared';
import { KeyboardModifiers   } from '@bespunky/angular-cdk/reactive-input/shared';
import { KeyboardFeedConfig  } from '../feeds/keyboard-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveKeyboardService
{
    public keydown({nativeElement}: ElementRef, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        const { activationSwitch, key, modifiers } = config || {};
        
        // TODO: Replace document with element and make it work even without focus
        let keydown = fromEvent<KeyboardEvent>(document, 'keydown')
        
        if (activationSwitch) keydown = keydown.pipe(useActivationSwitch(activationSwitch));
        if (key             ) keydown = keydown.pipe(filter(e => e.key === key));
        if (modifiers)
        {
            const allModifiers: KeyboardModifiers = { altKey: false, ctrlKey: false, shiftKey: false, ...modifiers };

            keydown = keydown.pipe(filter(e =>
                e.altKey   === allModifiers.altKey   &&
                e.ctrlKey  === allModifiers.ctrlKey  &&
                e.shiftKey === allModifiers.shiftKey
            ));
        }

        return keydown;
    }
}
