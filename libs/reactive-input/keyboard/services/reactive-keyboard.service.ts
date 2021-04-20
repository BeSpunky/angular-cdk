import { Observable, fromEvent  } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';

import { useActivationSwitch } from '@bespunky/angular-cdk/shared';
import { KeyboardFeedConfig } from '../feeds/keyboard-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveKeyboardService
{
    public keydown({nativeElement}: ElementRef, config?: KeyboardFeedConfig): Observable<KeyboardEvent>
    {
        const { activationSwitch, key } = config || {};

        // TODO: Replace document with element and make it work even without focus
        let keydown = fromEvent<KeyboardEvent>(document, 'keydown')

        if (activationSwitch) keydown = keydown.pipe(useActivationSwitch(activationSwitch));
        if (key             ) keydown = keydown.pipe(filter(e => e.key === key));
        
        return keydown;
    }
}
