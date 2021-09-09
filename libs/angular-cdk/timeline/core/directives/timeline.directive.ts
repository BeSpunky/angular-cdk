import { combineLatest, Observable                } from 'rxjs';
import { first, map                                      } from 'rxjs/operators';
import { Directive, Input                         } from '@angular/core';

import { Timeline, TimelineConfig, TimelineCamera } from '@bespunky/angular-cdk/timeline/abstraction';
import { TimelineLocationService                  } from '@bespunky/angular-cdk/timeline/shared';
import { TimelineTickRendererProvider             } from '../modules/ticks/services/renderer/timeline-tick-renderer.provider';
import { TimelineConfigProvider                   } from '../services/config/timeline-config.provider';
import { TimelineCameraProvider                   } from '../services/camera/timeline-camera.provider';

const providers = [
    TimelineConfigProvider,
    TimelineCameraProvider,
    TimelineTickRendererProvider
];

/**
 * Adds timeline functionality to an element.
 *
 * @export
 * @class TimelineDirective
 * @extends {Destroyable}
 */
@Directive({
    selector : '[bsTimeline]',
    exportAs : 'timeline',
    providers: providers,
})
export class TimelineDirective extends Timeline
{
    public readonly currentDate: Observable<Date>;
    
    /**
     * Creates an instance of TimelineDirective.
     */
    constructor(
        public  readonly config  : TimelineConfig,
        public  readonly camera  : TimelineCamera,
        private readonly location: TimelineLocationService
    )
    {
        super();

        this.currentDate = combineLatest([this.camera.dayWidth, this.camera.viewCenterX]).pipe(
            map(([dayWidth, position]) => this.location.positionToDate(dayWidth, position))
        );
    }

    /**
     * The level of zoom to apply to when rendering the timeline. Default is 1.
     * A larger number means zooming-in; A smaller number means zooming-out.
     */
    @Input() public set zoom(value: number)
    {
        this.camera.setZoom(value);
    }

    @Input() public set positionX(value: number)
    {
        this.camera.panToX(value);
    }

    @Input() public set positionY(value: number)
    {
        this.camera.panToY(value);
    }

    @Input() public set minDate(value: Date)
    {
        // TODO: Modify to accomodate RTL timelines and vertical timelines. Currently this will only work for
        //       horizontal LTR timelines.
        this.subscribe(this.camera.dayWidth.pipe(first()), dayWidth => 
            this.camera.leftBound.next(this.location.dateToPosition(dayWidth, value))
        );
    }

    @Input() public set maxDate(value: Date)
    {
        // TODO: Modify to accomodate RTL timelines and vertical timelines. Currently this will only work for
        //       horizontal LTR timelines.
        this.subscribe(this.camera.dayWidth.pipe(first()), dayWidth => 
            this.camera.rightBound.next(this.location.dateToPosition(dayWidth, value))
        );
    }

    @Input() public set topBound(value: number)
    {
        // TODO: Modify to accomodate RTL timelines and vertical timelines. Currently this will only work for
        //       horizontal LTR timelines.
        this.camera.topBound.next(value)
    }

    @Input() public set bottomBound(value: number)
    {
        // TODO: Modify to accomodate RTL timelines and vertical timelines. Currently this will only work for
        //       horizontal LTR timelines.
        this.camera.bottomBound.next(value)
    }

    @Input() public set date(value: Date)
    {
        this.camera.panTo(value);
    }

    @Input() public set baseTickSize(value: number)
    {
        this.config.baseTickSize.next(value);
    }

    @Input() public set virtualizationBuffer(value: number)
    {
        this.config.virtualizationBuffer.next(value);
    }

    @Input() public set vertical(value: boolean)
    {
        this.config.vertical.next(value);
    }

    @Input() public set panOnKeyboard(value: boolean)
    {
        this.camera.panOnKeyboard.next(value);
    }

    @Input() public set panOnWheel(value: boolean)
    {
        this.camera.panOnWheel.next(value);
    }

    @Input() public set zoomDeltaFactor(value: number)
    {
        this.camera.zoomFactor.next(value);
    }

    @Input() public set zoomOnKeyboard(value: boolean)
    {
        this.camera.zoomOnKeyboard.next(value);
    }

    @Input() public set zoomOnWheel(value: boolean)
    {
        this.camera.zoomOnWheel.next(value);
    }
}