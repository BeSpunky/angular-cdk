import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, tap     } from 'rxjs/operators';
import { ElementRef, Injectable    } from '@angular/core';
import { DocumentRef               } from '@bespunky/angular-zen';


import { ReactiveMouseService           } from '@bespunky/angular-cdk/reactive-input/mouse';
import { ReactiveKeyboardService        } from '@bespunky/angular-cdk/reactive-input/keyboard';
import { ReactiveTouchService           } from '@bespunky/angular-cdk/reactive-input/touch';
import { TimelineConfig, TimelineCamera } from '@bespunky/angular-cdk/timeline/abstraction';

@Injectable()
export class TimelineCameraService extends TimelineCamera
{
    public readonly dayWidth: Observable<number>;

    private _dayWidth = 1;

    public get currentDayWidth(): number { return this._dayWidth; }

    constructor(
        private config  : TimelineConfig,
                document: DocumentRef,
                mouse   : ReactiveMouseService,
                keyboard: ReactiveKeyboardService,
                touch   : ReactiveTouchService,
                element : ElementRef
    )
    {
        super(document, mouse, keyboard, touch, element);

        this.dayWidth = this.dayWidthFeed();
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
        return combineLatest([this.config.baseTickSize, this.sizeUnit]).pipe(
            map(([baseTickSize, sizeUnit]) => baseTickSize * sizeUnit),
            tap(dayWidth => this._dayWidth = dayWidth),
            // Make this observable remember and stream the latest value to each new subscriber.
            // This way the width can be resolved instantly when the value is needed for some immidiate calcualtion
            // like in TimelineCamera.moveTo().
            shareReplay(1)
        );
    }
}
