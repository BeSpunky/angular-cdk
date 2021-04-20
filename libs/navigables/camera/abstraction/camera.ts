import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { map, startWith                         } from 'rxjs/operators';
import { ElementRef, Injectable                 } from '@angular/core';
import { Destroyable                            } from '@bespunky/angular-zen/core';

import { ViewPort   } from '../shared/view-port';
import { ViewBounds } from '../shared/view-bounds';

@Injectable()
export abstract class Camera<TItem> extends Destroyable
{
    public readonly zoomFactor: BehaviorSubject<number> = new BehaviorSubject(1.06);
    public readonly zoomLevel : BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly position  : BehaviorSubject<number> = new BehaviorSubject(0);
    
    public readonly viewPort: Observable<ViewPort>;
    
    public abstract readonly viewBounds: Observable<ViewBounds>;
    
    constructor(protected element: ElementRef)
    {
        super();
        
        this.viewPort = this.viewPortFeed();
    }
    
    protected viewPortFeed(): Observable<ViewPort>
    {
        const element: HTMLElement = this.element.nativeElement;

        return fromEvent<UIEvent>(element, 'resize').pipe(
            startWith({}),
            map(() => ({ width: element.clientWidth, height: element.clientHeight })),
        );
    }

    protected abstract moveToItem(item: TItem): void;
    protected abstract zoomOnItem(item: TItem, amount: number): void;
    
    public moveTo(item: TItem)                   : void;
    public moveTo(position: number)              : void;
    public moveTo(positionOrItem: number | TItem): void
    {
        typeof positionOrItem === 'number' ? this.moveToPosition(positionOrItem) : this.moveToItem(positionOrItem);
    }
    
    public zoomOn(item: TItem, amount: number)                   : void;
    public zoomOn(position: number, amount: number)              : void;
    public zoomOn(positionOrItem: number | TItem, amount: number): void
    {
        typeof positionOrItem === 'number' ? this.zoomOnPosition(positionOrItem, amount) : this.zoomOnItem(positionOrItem, amount);
    }

    public move(amount: number): void
    {
        this.addAmount(this.position, amount);
    }
    
    protected moveToPosition(position: number): void
    {
        this.position.next(position);
    }

    public zoom(amount: number): void
    {
        this.addAmount(this.zoomLevel, amount);
    }

    public setZoom(zoomLevel: number): void
    {
        this.zoomLevel.next(zoomLevel);
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
        const viewCenter = this.position.value;

        /** The distance between the position and the center before zooming. This should be kept after zoom. */
        const dxPositionToCenter = position - viewCenter;
        /** The new position of the pixel under the specified point AFTER zooming. */
        const newPosition        = position * zoomedBy;
        // The new center be relative to the new position after zooming
        return newPosition - dxPositionToCenter;
    }
}
