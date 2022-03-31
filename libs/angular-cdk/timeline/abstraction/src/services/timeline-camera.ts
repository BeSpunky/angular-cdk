import { Observable } from 'rxjs';

import { ReactiveCamera } from '@bespunky/angular-cdk/navigables/camera/reactive';
import { dateToPosition, positionToDate, positionToScreenPosition } from '@bespunky/angular-cdk/timeline/shared';

export abstract class TimelineCamera extends ReactiveCamera<Date>
{
    public abstract readonly dayWidth: Observable<number>;

    public abstract readonly currentDayWidth: number;

    protected panToItem(date: Date): void
    {
        this.panToPosition(this.dateToPosition(date), 0);
    }

    protected zoomOnItem(date: Date, amount: number): void
    {
        this.zoomOnPosition(this.dateToPosition(date), 0, amount);
    }

    /**
     * Determines the date that a position on the timeline (in pixels) refers to.
     *
     * @param {number} position The position for which to calculate the date.
     * @returns {Date} The date corresponding to the position.
     */
    public positionToDate(position: number): Date
    {
        return positionToDate(this.currentDayWidth, position);
    }

    /**
     * Determines the position on the timeline (in pixels) that corresponds to a specific date.
     *
     * @param {number} y The year part of the date.
     * @param {number} [m] (Optional) The month part of the date. Default is 0 (January).
     * @param {number} [d] (Optional) The day part of the date. Default is 1.
     * @param {number} [h] (Optional) The hourpart of the date. Default is 0.
     * @param {number} [mm] (Optional) The minute part of the date. Default is 0.
     * @param {number} [s] (Optional) The second part of the date. Default is 0.
     * @param {number} [ms] (Optional) The millisecond part of the date. Default is 0.
     * @returns The position (in pixels) corresponding to the specified date.
     */
    public dateToPosition(y: number, m?: number, d?: number, h?: number, mm?: number, s?: number, ms?: number): number;
    /**
     * Determines the position on the timeline (in pixels) that corresponds to a specific date.
     *
     * @param {Date} date The date to convert to position.
     * @returns The position (in pixels) corresponding to the specified date.
     */
    public dateToPosition(date: Date): number;
    /**
     * Determines the position on the timeline (in pixels) that corresponds to a specific date.
     *
     * @param {(number | Date)} yOrDate 
     * @param {number} [m] (Optional) The month part of the date. Default is 0 (January).
     * @param {number} [d] (Optional) The day part of the date. Default is 1.
     * @param {number} [h] (Optional) The hourpart of the date. Default is 0.
     * @param {number} [mm] (Optional) The minute part of the date. Default is 0.
     * @param {number} [s] (Optional) The second part of the date. Default is 0.
     * @param {number} [ms] (Optional) The millisecond part of the date. Default is 0.
     * @returns The position (in pixels) corresponding to the specified date.
     */
    public dateToPosition(
        yOrDate: number | Date, m?: number, d?: number, h?: number, mm?: number, s?: number, ms?: number
    ): number
    {
        return dateToPosition(this.currentDayWidth, yOrDate, m, d, h, mm, s, ms);
    }

    public toScreenPosition(position: number, viewStart: number): number
    {
        return positionToScreenPosition(position, viewStart);
    }
}
