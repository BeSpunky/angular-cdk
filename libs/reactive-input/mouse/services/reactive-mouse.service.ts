import { Observable             } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';
import { DocumentRef            } from '@bespunky/angular-zen';

import { createReactiveInputWithModifiersObservable } from '@bespunky/angular-cdk/reactive-input/shared';
import { MouseWheelFeedConfig                       } from '../feeds/mouse-wheel-feed-config';
import { MouseDownFeedConfig                        } from '../feeds/mouse-down-feed-config';
import { MouseEventName                             } from '../types/mouse-event';
import { MouseButtonNumbers                         } from '../types/mouse-buttons';

@Injectable({ providedIn: 'root' })
export class ReactiveMouseService
{
    public wheel(element: ElementRef | DocumentRef, config?: MouseWheelFeedConfig): Observable<WheelEvent>
    {
        const { direction } = config || {};

        let wheel = createReactiveInputWithModifiersObservable<WheelEvent>(element, 'wheel', config) as Observable<WheelEvent>;
        
        // A direction (i.e. deltaX, deltaY) different to zero means movement in that direction
        if (direction) wheel = wheel.pipe(filter(e => e[direction] !== 0));

        return wheel;
    }

    public button(element: ElementRef | DocumentRef, eventName: MouseEventName, config?: MouseDownFeedConfig): Observable<MouseEvent>
    {
        const { button } = config || {};

        let mouseButton = createReactiveInputWithModifiersObservable<MouseEvent>(element, eventName, config) as Observable<MouseEvent>;
        
        if (button)
        {
            const buttonNumber = typeof button === 'number' ? button : MouseButtonNumbers[button];

            mouseButton = mouseButton.pipe(filter(e => e.button === buttonNumber));
        }

        return mouseButton;
    }
}
