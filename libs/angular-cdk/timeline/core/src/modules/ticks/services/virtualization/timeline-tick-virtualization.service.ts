import { animationFrameScheduler, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, observeOn               } from 'rxjs/operators';
import { Injectable                                         } from '@angular/core';
import { useActivationSwitch, valueInRange                  } from '@bespunky/rxjs';

import { ViewBounds                                                                  } from '@bespunky/angular-cdk/navigables/camera';
import { TimelineTick, DatesBetweenGenerator, TickData, TickLabeler, WidthCalculator } from '@bespunky/angular-cdk/timeline/abstraction/ticks';
import { dateToPosition, positionToDate, positionToScreenPosition                    } from '@bespunky/angular-cdk/timeline/shared';

/**
 * Provides methods for virtualizing tick rendering. This service is designed to determine what ticks should
 * be displayed on the screen according to screen size, zoom, view center and other factors.
 *
 * @export
 * @class TimelineTickVirtualizationService
 */
@Injectable({ providedIn: 'root' })
export class TimelineTickVirtualizationService
{
    /**
     * Creates a stream that notifies subscribers when the specified tick scale should render or unrender.
     * Render state is determined by the current zoom level and the min/max zoom defined for the tick scale.
     *
     * @param {TimelineTick} tick The tick scale for which to create the stream.
     * @returns {Observable<boolean>} An observable that notifies subscribers when to render and unrender the tick.
     */
    public shouldRenderFeed(tick: TimelineTick): Observable<boolean>
    {
        return combineLatest([tick.camera.zoomLevel, tick.minZoom, tick.maxZoom]).pipe(
            valueInRange(),
            distinctUntilChanged()
        );
    }

    public widthFeed(tick: TimelineTick): Observable<WidthCalculator>
    {
        return combineLatest([tick.dayFactor, tick.camera.dayWidth]).pipe(
            map(([dayFactor, dayWidth]) => dayFactor instanceof Function 
                                            ? (date: Date) => dayFactor(date) * dayWidth
                                            : () => dayWidth
            )
        );
    }

    /**
     * Creates a stream that notifies subscribers when the ticks that should be displayed on the screen have changed.
     * A new item array will be generated any time one of the following occurs:
     * - The tick label function has been replaced
     * - The tick dateBetween function has been replaced
     * - The tick dayFactor has been updated
     * - The timeline zoom level has changed
     * - The timeline view center has changed
     * - The timeline virtualization buffer size has changed
     *
     * @param {TimelineTick} tick The tick scale for which to create the stream.
     * @returns {Observable<TickData[]>} A stream that notifies subscribers when the ticks that should
     * be displayed on the screen have changed.
     */
    public itemsToRenderFeed(tick: TimelineTick): Observable<TickData[]>
    {
        return combineLatest([tick.label, tick.datesBetween, tick.width, tick.camera.dayWidth, tick.camera.viewBounds, tick.camera.sizeUnit, tick.config.virtualizationBuffer]).pipe(
            // As item generation depends on multiple subjects, generation might be triggered multiple times for the same change.
            // When zooming, for example, viewBounds + width are changed causing at least 2 notifications.
            // The animationFrameScheduler calculates changes just before next browser content repaint, which prevents flickering and hangs,
            // creating a smoother animation.
            observeOn(animationFrameScheduler),
            useActivationSwitch(tick.shouldRender),
            map(([label, datesBetween, width, dayWidth, viewBounds, sizeUnit, virtualizationBuffer]) =>
            {
                const bufferWidth   = viewBounds.width * virtualizationBuffer;
                const startPosition = viewBounds.left  - bufferWidth;
                const endPosition   = viewBounds.right + bufferWidth;
                
                return this.ticksOnScreen(viewBounds, sizeUnit, dayWidth, width, startPosition, endPosition, datesBetween, label);
            })
        );
    }

    /**
     * Generates an array of tick items representing the ticks that should be displayed on the screen given
     * the specified state.
     *
     * @param {ViewBounds} viewBounds The current bounds of the view on the timeline's camera.
     * @param {number} dayWidth The width (in pixels) representing one single day on the timeline.
     * @param {WidthCalculator} width A function that calculates the width of a single tick.
     * @param {number} startPosition The start position (in pixels) from which ticks should start. This should include any buffer width.
     * @param {number} endPosition The end position (in pixels) from which ticks should end. This should include any buffer width.
     * @param {DatesBetweenGenerator} datesBetween The function that generates all tick scale-level dates between two given dates.
     * @param {TickLabeler} label The function to use for labeling the items.
     * @returns {TickData[]} An array of tick items representing the ticks that should be displayed on the screen.
     */
    public ticksOnScreen(viewBounds: ViewBounds, sizeUnit: number, dayWidth: number, width: WidthCalculator, startPosition: number, endPosition: number, datesBetween: DatesBetweenGenerator, label: TickLabeler): TickData[]
    {
        // Find the dates corresponding to the bounds of the screen
        const start = positionToDate(dayWidth, startPosition);
        const end   = positionToDate(dayWidth, endPosition);

        // Generate all scale-level dates inside the screen bounds and create a tick item for each
        return datesBetween(start, end).map(date =>
        {
            const position        = dateToPosition(dayWidth, date);
            const screenPositionX = positionToScreenPosition(position, viewBounds.left);
            const screenPositionY = positionToScreenPosition(0       , viewBounds.top);

            return new TickData(position, 0, screenPositionX, screenPositionY, date, width(date), label(date), sizeUnit);
        });
    };
}