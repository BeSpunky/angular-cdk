import { Observable, fromEvent  } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';

import { createReactiveInputObservable } from '@bespunky/angular-cdk/reactive-input/shared';
import { MouseWheelFeedConfig          } from '../feeds/mouse-wheel-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveMouseService
{
    public wheel(element: ElementRef, config?: MouseWheelFeedConfig): Observable<WheelEvent>
    {
        const { direction } = config || {};

        let wheel = createReactiveInputObservable<WheelEvent>(element, 'wheel', config);

        // A direction (i.e. deltaX, deltaY) different to zero means movement in that direction
        if (direction) wheel = wheel.pipe(filter(e => e[direction] !== 0));
        
        return wheel;
    }
}
