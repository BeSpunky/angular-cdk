import { Observable, fromEvent  } from 'rxjs';
import { filter                 } from 'rxjs/operators';
import { ElementRef, Injectable } from '@angular/core';

import { useActivationSwitch  } from '@bespunky/angular-cdk/shared';
import { MouseWheelFeedConfig } from '../feeds/wheel-feed-config';

@Injectable({ providedIn: 'root' })
export class ReactiveMouseService
{
    public wheel({ nativeElement }: ElementRef, config?: MouseWheelFeedConfig): Observable<WheelEvent>
    {
        const { activationSwitch, direction } = config || {};

        let wheel = fromEvent<WheelEvent>(nativeElement, 'wheel');

        if (activationSwitch) wheel = wheel.pipe(useActivationSwitch(activationSwitch));
        if (direction       ) wheel = wheel.pipe(filter(e => e[direction] !== 0));
        
        return wheel;
    }
}
