import { combineLatest, Observable                                                      } from 'rxjs';
import { filter, map, startWith, takeUntil                                              } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, ContentChildren, Directive, Input, QueryList } from '@angular/core';

import { Timeline, TimelineConfig, TimelineCamera } from '@bespunky/angular-cdk/timeline/abstraction';
import { TimelineTick, TimelineTickRenderer       } from '@bespunky/angular-cdk/timeline/abstraction/ticks';
import { TimelineLocationService                  } from '@bespunky/angular-cdk/timeline/shared';
import { TimelineTickDirective                    } from '../modules/ticks/directives/timeline-tick.directive';
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
 * @implements {AfterViewInit}
 */
@Directive({
    selector : '[bsTimeline]',
    exportAs : 'timeline',
    providers: providers,
})
export class TimelineDirective extends Timeline implements AfterViewInit
{
    @ContentChildren(TimelineTickDirective) private ticks!: QueryList<TimelineTick>;
    
    public readonly currentDate: Observable<Date>;
    
    /**
     * Creates an instance of TimelineDirective.
     * 
     * @param {ChangeDetectorRef} changes
     * @param {TimelineState} state The state of the timeline.
     * @param {TimelineControl} control
     * @param {TimelineRenderer} renderer
     * @param {TimelineTickRenderer} tickRenderer
     */
    constructor(
        public  readonly config      : TimelineConfig,
        public  readonly camera      : TimelineCamera,
        private readonly location    : TimelineLocationService,
        private readonly tickRenderer: TimelineTickRenderer,
        private readonly changes     : ChangeDetectorRef
    )
    {
        super();

        this.currentDate = combineLatest([this.camera.dayWidth, this.camera.position]).pipe(
            map(([dayWidth, position]) => this.location.positionToDate(dayWidth, position))
        );
    }

    ngAfterViewInit()
    {
        this.observeTicks();

        this.changes.detectChanges();
    }

    private observeTicks(): void
    {
        const tickUpdates = this.ticks.changes.pipe(startWith(0), map(() => this.ticks.toArray()));

        this.subscribe(tickUpdates, ticks =>
        {
            ticks.forEach((tick, index) => this.observeTick(tick, index));
        });
    }

    private observeTick(tick: TimelineTick, tickLevel: number): void
    {
        // If ticks were changes (e.g. an ngIf or ngFor creates them) then takeUntil will unsubscribe from the render observable
        const render = tick.itemsToRender.pipe(
            takeUntil(this.ticks.changes)
        );

        const unrender = tick.shouldRender.pipe(
            takeUntil(this.ticks.changes),
            filter(shouldRender => !shouldRender)
        );

        this.subscribe(render  , renderedItems => this.tickRenderer.renderTicks  (tick, tickLevel, renderedItems));
        this.subscribe(unrender, ()            => this.tickRenderer.unrenderTicks(tickLevel));
    }

    /**
     * The level of zoom to apply to when rendering the timeline. Default is 1.
     * A larger number means zooming-in; A smaller number means zooming-out.
     */
    @Input() public set zoom(value: number)
    {
        this.camera.setZoom(value);
    }

    @Input() public set position(dateOrPosition: number | Date)
    {
        this.camera.moveTo(dateOrPosition);
    }

    @Input() public set baseTickSize(value: number)
    {
        this.config.baseTickSize.next(value);
    }

    @Input() public set moveOnKeyboard(value: boolean)
    {
        this.camera.moveOnKeyboard.next(value);
    }

    @Input() public set moveOnWheel(value: boolean)
    {
        this.camera.moveOnWheel.next(value);
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

    @Input() public set virtualizationBuffer(value: number)
    {
        this.config.virtualizationBuffer.next(value);
    }
}