import { BehaviorSubject, Observable } from 'rxjs';
import { Destroyable } from '@bespunky/angular-zen/core';

import { ViewBounds } from '../shared/view-bounds';

export abstract class Camera<TItem> extends Destroyable
{
    public readonly moveFactor: BehaviorSubject<number> = new BehaviorSubject(3);
    public readonly zoomFactor: BehaviorSubject<number> = new BehaviorSubject(1.06);
    public readonly zoomLevel : BehaviorSubject<number> = new BehaviorSubject(0);
    
    public readonly viewCenter: BehaviorSubject<number> = new BehaviorSubject(0);
    
    abstract readonly viewBounds: Observable<ViewBounds>;
    
    abstract moveTo(item: TItem)                                   : void;
    abstract moveTo(position: number)                              : void;
    abstract moveTo(positionOrItem: number | TItem)                : void;
    abstract zoomOn(item: TItem, amount: number)                   : void;
    abstract zoomOn(position: number, amount: number)              : void;
    abstract zoomOn(positionOrItem: number | TItem, amount: number): void;
        
    public move(amount: number): void
    {
        this.addAmount(this.viewCenter, amount);
    }
    
    public zoom(amount: number): void
    {
        this.addAmount(this.zoomLevel, amount);
    }

    public setZoom(zoomLevel: number): void
    {
        this.zoomLevel.next(zoomLevel);
    }

    protected moveToPosition(position: number): void
    {
        this.viewCenter.next(position);
    }

    protected zoomOnPosition(position: number, amount: number): void
    {
        this.zoom(amount);

        const zoomedBy         = this.calculateZoomChangeInPixels(amount);
        const zoomedViewCenter = this.calculateViewCenterZoomedToPosition(position, zoomedBy);

        this.moveToPosition(zoomedViewCenter);
    }

    protected addAmount(subject: BehaviorSubject<number>, amount: number): void
    {
        subject.next(subject.value + amount);
    }
    
    protected calculateZoomChangeInPixels(amount: number): number
    {
        const zoomingOut = Math.sign(amount) > 0;
        let   zoomFactor = this.zoomFactor.value;
        
        // When zooming out, flip the factor to shrink instead of grow
        if (zoomingOut) zoomFactor = 1 / zoomFactor;
        
        // Multiply the factor (in pixels) by the zoom amount to get the increase/decrease in pixels (AKA `zoomedBy`)
        return zoomFactor * Math.abs(amount);
    }

    protected calculateViewCenterZoomedToPosition(position: number, zoomedBy: number): number
    {
        /** The idea is to:
         * 1. Calculate the current distance between the position and the viewCenter, so the same distance could be applied later-on.
         * 2. Calculate where the pixel that was under the position will be AFTER zooming.
         *    This will be the position multiplied by the factor.
         *    If the image grew by 15%, the pixel under the position did the same.
         * 3. Subtract the current distance from the new position to receive the new viewCenter.
         */

        /** The current center position of the viewbox relative to the complete drawing. */
        const viewCenter = this.viewCenter.value;

        /** The distance between the position and the center before zooming. This should be kept after zoom. */
        const dxPositionToCenter = position - viewCenter;
        /** The new position of the pixel under the specified point AFTER zooming. */
        const newPosition        = position * zoomedBy;
        // The new center be relative to the new position after zooming
        return newPosition - dxPositionToCenter;
    }
}
