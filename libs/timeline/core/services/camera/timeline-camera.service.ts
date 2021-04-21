import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, take    } from 'rxjs/operators';
import { ElementRef, Injectable    } from '@angular/core';

import { ReactiveMouseService           } from '@bespunky/angular-cdk/reactive-input/mouse';
import { ReactiveKeyboardService        } from '@bespunky/angular-cdk/reactive-input/keyboard';
import { TimelineConfig, TimelineCamera } from '@bespunky/angular-cdk/timeline/abstraction';
import { TimelineLocationService        } from '@bespunky/angular-cdk/timeline/shared';

@Injectable()
export class TimelineCameraService extends TimelineCamera
{
    public readonly dayWidth  : Observable<number>;

    constructor(
        private config  : TimelineConfig,
        private location: TimelineLocationService,
                mouse   : ReactiveMouseService,
                keyboard: ReactiveKeyboardService,
                element : ElementRef
    )
    {
        super(mouse, keyboard, element);

        this.dayWidth   = this.dayWidthFeed();
    }
    
    /**
     * Creates a stream that notifies of changes to the width of the one day in pixels.
     * The width is determined by `baseTickSize`, `zoom` and `zoomFactor`.
     * 
     * @see /skeleton/services/control/readme.md for more information about zooming.
     *
     * @private
     * @param {TimelineTick} tick The tick scale for which to create the stream.
     * @returns {Observable<number>} A stream that notifies of changes to the width of the one day in pixels.
     */
    private dayWidthFeed(): Observable<number>
    {
        return combineLatest([this.config.baseTickSize, this.zoomFactor, this.zoomLevel]).pipe(
            map(([baseTickSize, zoomFactor, zoomLevel]) => baseTickSize * Math.pow(zoomFactor, zoomLevel)),
            // Make this observable remember and stream the latest value to each new subscriber.
            // This way the width can be resolved instantly when the value is needed for some immidiate calcualtion
            // like in TimelineCamera.moveTo().
            shareReplay(1)
        );
    }
    
    protected moveToItem(date: Date): void
    {
        this.dateToPosition(date).subscribe(position => this.moveToPosition(position));
    }

    protected zoomOnItem(date: Date, amount: number): void
    {
        this.dateToPosition(date).subscribe(position => this.zoomOnPosition(position, amount));
    }

    private dateToPosition(date: Date): Observable<number>
    {
        return this.dayWidth.pipe(
            take(1),
            map(dayWidth => this.location.dateToPosition(dayWidth, date))
        );
    }
}
