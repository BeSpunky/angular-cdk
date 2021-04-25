import { BehaviorSubject, combineLatest, fromEvent, Observable } from 'rxjs';
import { map, shareReplay, startWith                           } from 'rxjs/operators';
import { ElementRef, Injectable                                } from '@angular/core';
import { Destroyable                                           } from '@bespunky/angular-zen/core';

import { ViewPort   } from '../shared/view-port';
import { ViewBounds } from '../shared/view-bounds';

@Injectable()
export abstract class Camera<TItem> extends Destroyable
{
    public readonly zoomFactor : BehaviorSubject<number> = new BehaviorSubject(1.06);
    public readonly zoomLevel  : BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly viewCenterX: BehaviorSubject<number> = new BehaviorSubject(0);
    public readonly viewCenterY: BehaviorSubject<number> = new BehaviorSubject(0);
    
    public readonly viewPort  : Observable<ViewPort>;
    public readonly viewBounds: Observable<ViewBounds>;
    
    constructor(protected element: ElementRef)
    {
        super();
        
        this.viewPort   = this.viewPortFeed();
        this.viewBounds = this.viewBoundsFeed();
    }
    
    protected viewPortFeed(): Observable<ViewPort>
    {
        const element: HTMLElement = this.element.nativeElement;

        return fromEvent<UIEvent>(element, 'resize').pipe(
            startWith({}),
            map(() => ({ width: element.clientWidth, height: element.clientHeight })),
        );
    }
    
    protected viewBoundsFeed(): Observable<ViewBounds>
    {
        return combineLatest([this.viewPort, this.viewCenterX, this.viewCenterY, this.zoomLevel]).pipe(
            map(([viewPort, viewCenterX, viewCenterY, zoomLevel]) => new ViewBounds(viewPort, viewCenterX, viewCenterY, zoomLevel)),
            shareReplay(1)
        );
    }
    
    protected abstract panToItem(item: TItem): void;
    protected abstract zoomOnItem(item: TItem, amount: number): void;
    
    public panTo(item: TItem)                         : void;
    public panTo(positionX: number, positionY: number): void;
    public panTo(arg1: number | TItem, arg2?: number) : void
    {
        if (typeof arg1 === 'number')
        {
            if (typeof arg2 !== 'number') throw new Error(`Expected numeric y view position (got ${typeof arg2}). Provide a numeric y value or use another overload.`);
            
            this.panToPosition(arg1, arg2)
        }
        else this.panToItem(arg1);
    }
    
    public zoomOn(item: TItem, amount: number)                         : void;
    public zoomOn(positionX: number, positionY: number, amount: number): void;
    public zoomOn(arg1: number | TItem, arg2: number, arg3?: number)   : void
    {
        if (typeof arg1 === 'number')
        {
            if (typeof arg2 !== 'number') throw new Error(`Expected numeric y view position (got ${typeof arg2}). Provide a numeric y value or use another overload.`);
            if (typeof arg3 !== 'number') throw new Error(`Expected numeric zoom amount (got ${typeof arg3}).`);

            this.zoomOnPosition(arg1, arg2, arg3);
        }
        else this.zoomOnItem(arg1, arg2);   
    }

    public panX(amount: number): void
    {
        this.addAmount(this.viewCenterX, amount);
    }

    public panY(amount: number): void
    {
        this.addAmount(this.viewCenterY, amount);
    }

    public pan(amountX: number, amountY: number): void
    {
        this.panX(amountX);
        this.panY(amountY);
    }
    
    protected panToPosition(positionX: number, positionY: number): void
    {
        this.viewCenterX.next(positionX);
        this.viewCenterY.next(positionY);
    }

    public zoom(amount: number): void
    {
        this.addAmount(this.zoomLevel, amount);
    }

    public setZoom(zoomLevel: number): void
    {
        this.zoomLevel.next(zoomLevel);
    }

    protected zoomOnPosition(positionX: number, positionY: number, amount: number): void
    {
        this.zoom(amount);

        const zoomedBy          = this.calculateZoomChangeInPixels(amount);
        const zoomedViewCenterX = this.calculateViewCenterZoomedToPosition(this.viewCenterX.value, positionX, zoomedBy);
        const zoomedViewCenterY = this.calculateViewCenterZoomedToPosition(this.viewCenterY.value, positionY, zoomedBy);

        this.panToPosition(zoomedViewCenterX, zoomedViewCenterY);
    }

    protected addAmount(subject: BehaviorSubject<number>, amount: number): void
    {
        subject.next(subject.value + amount);
    }
    
    private calculateZoomChangeInPixels(amount: number): number
    {
        const zoomingOut = Math.sign(amount) < 0;
        let   zoomFactor = this.zoomFactor.value;
        
        // When zooming out, flip the factor to shrink instead of grow
        if (zoomingOut) zoomFactor = 1 / zoomFactor;
        
        // Multiply the factor (in pixels) by the zoom amount to get the increase/decrease in pixels (AKA `zoomedBy`)
        return zoomFactor * Math.abs(amount);
    }

    /**
     *
     *
     * @private
     * @param {number} currentViewCenter The current center position of the viewbox relative to the complete drawing.
     * @param {number} position
     * @param {number} zoomedBy
     * @returns {number}
     */
    private calculateViewCenterZoomedToPosition(currentViewCenter: number, position: number, zoomedBy: number): number
    {
        /** The idea is to:
         * 1. Calculate the current distance between the position and the viewCenter, so the same distance could be applied later-on.
         * 2. Calculate where the pixel that was under the position will be AFTER zooming.
         *    This will be the position multiplied by the factor.
         *    If the image grew by 15%, the pixel under the position did the same.
         * 3. Subtract the current distance from the new position to receive the new viewCenter.
         */

        /** The distance between the position and the center before zooming. This should be kept after zoom. */
        const deltaPositionToCenter = position - currentViewCenter;
        /** The new position of the pixel under the specified point AFTER zooming. */
        const newPosition           = position * zoomedBy;
        // The new center be relative to the new position after zooming
        return newPosition - deltaPositionToCenter;
    }
}
