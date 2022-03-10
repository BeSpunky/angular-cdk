import { BehaviorSubject, combineLatest, merge, Observable                } from 'rxjs';
import { map                                      } from 'rxjs/operators';
import { Directive, Input                         } from '@angular/core';

import { Timeline, TimelineConfig, TimelineCamera } from '@bespunky/angular-cdk/timeline/abstraction';
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
    
    protected readonly minDate$    : BehaviorSubject<Date | null>   = new BehaviorSubject(null as Date | null);
    protected readonly maxDate$    : BehaviorSubject<Date | null>   = new BehaviorSubject(null as Date | null);
    protected readonly topBound$   : BehaviorSubject<number | null> = new BehaviorSubject(null as number | null);
    protected readonly bottomBound$: BehaviorSubject<number | null> = new BehaviorSubject(null as number | null);

    /**
     * Creates an instance of TimelineDirective.
     */
    constructor(
        public readonly config: TimelineConfig,
        public readonly camera: TimelineCamera
    )
    {
        super();

        this.currentDate = this.camera.viewCenterX.pipe(
            map(position => this.camera.positionToDate(position))
        );

    
        // TODO: Modify to accomodate RTL timelines and vertical timelines. Currently this will only work for
        //       horizontal LTR timelines.
        this.subscribe(merge(this.minDate$, this.camera.dayWidth), () => this.camera.leftBound .next(this.minDate ? this.camera.dateToPosition(this.minDate) : null));
        this.subscribe(merge(this.maxDate$, this.camera.dayWidth), () => this.camera.rightBound.next(this.maxDate ? this.camera.dateToPosition(this.maxDate) : null));
        // TODO: How will zooming affect the top and bottom bounds?
        this.subscribe(merge(this.topBound$,    this.camera.dayWidth), () => this.camera.topBound.next(this.topBound));
        this.subscribe(merge(this.bottomBound$, this.camera.dayWidth), () => this.camera.bottomBound.next(this.bottomBound));
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

             public get minDate(    ): Date | null  { return this.minDate$.value; }
    @Input() public set minDate(value: Date | null) { this.minDate$.next(value);  }

             public get maxDate(    ): Date | null  { return this.maxDate$.value; }
    @Input() public set maxDate(value: Date | null) { this.maxDate$.next(value);  }

             public get topBound(    ): number | null  { return this.topBound$.value; }
    @Input() public set topBound(value: number | null) { this.topBound$.next(value);  }

             public get bottomBound(    ): number | null  { return this.bottomBound$.value; }
    @Input() public set bottomBound(value: number | null) { this.bottomBound$.next(value);  }
    
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

    @Input() public set panAxisOnZoom(value: 'x' | 'y' | 'both')
    {
        this.camera.panAxisOnZoom = value;
    }
}