import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, pairwise, shareReplay, startWith, tap, withLatestFrom           } from 'rxjs/operators';
import { ElementRef, Injectable                     } from '@angular/core';
import { Destroyable                                } from '@bespunky/angular-zen/core';

import { ViewPort   } from '../shared/view-port';
import { ViewBounds } from '../shared/view-bounds';
import { Property } from '@bespunky/typescript-utils';

function restrictLowerBound(center: number, lower: number | null, halfViewPort: number)
{
    if (lower !== null && center - halfViewPort < lower) return lower + halfViewPort;

    return center;
}

function restrictUpperBound(center: number, upper: number | null, halfViewPort: number)
{
    if (upper !== null && center + halfViewPort > upper) return upper - halfViewPort;

    return center;
}

/**
 * Applies a pipeline filter on values emitted from the source observable which are out of the
 * specified position bounds.
 *
 * @param {Observable<ViewBounds>} viewBounds The observable that emits the current view bounds.
 * @param {(Observable<number | null>)} lowerBound The observable that emits the lower bound of the view bounds. If `null` is emitted,
 * values will have no lower bound.
 * @param {(Observable<number | null>)} upperBound The observable that emits the upper bound of the view bounds. If `null` is emitted,
 * values will have no upper bound.
 * @param {Property<ViewPort, number>} viewPortLengthKey The key which holds the width or height of the view port
 * according to what the calling code is filtering (x position or y position).
 * @return {(source: Observable<number>) => Observable<number>} An observable which emits the source emitted value only
 * if it is withing the specified bounds.
 */
function keepPositionInRange(
    viewPort         : Observable<ViewPort>,
    lowerBound       : Observable<number | null>,
    upperBound       : Observable<number | null>,
    viewPortLengthKey: Property<ViewPort, number>,
): (source: Observable<number>) => Observable<number>
{
    return (source: Observable<number>) => source.pipe(
        pairwise(),
        map(([prevCenter, currCenter]) => ({
            center   : currCenter,
            direction: Math.sign(currCenter - prevCenter)
        })),
        withLatestFrom(viewPort, lowerBound, upperBound),
        map(([{ center, direction }, viewPort, lower, upper]) =>
        {
            // Calculate half the viewport size so it can be added/subtracted from the position (which refers to the center of the view bounds)
            const halfViewPort = viewPort[viewPortLengthKey] / 2;

            // If bounds exist, use them to determine if the value is in range. If it is not, return a new value sitting on the bounds exactly.
            if      (direction === -1) return restrictLowerBound(center, lower, halfViewPort);
            else if (direction ===  1) return restrictUpperBound(center, upper, halfViewPort);

            // No bounds or value is in range. Use the new center as-is.
            return center;
        })
    );
}

@Injectable()
export abstract class Camera<TItem> extends Destroyable
{
    private readonly zoomLevelInput  : BehaviorSubject<number> = new BehaviorSubject(0);
    private readonly viewCenterXInput: BehaviorSubject<number> = new BehaviorSubject(0);
    private readonly viewCenterYInput: BehaviorSubject<number> = new BehaviorSubject(0);
    
    public readonly zoomFactor: BehaviorSubject<number> = new BehaviorSubject(1.06);
    
    public readonly leftBound  : BehaviorSubject<number | null> = new BehaviorSubject(null as number | null);
    public readonly rightBound : BehaviorSubject<number | null> = new BehaviorSubject(null as number | null);
    public readonly topBound   : BehaviorSubject<number | null> = new BehaviorSubject(null as number | null);
    public readonly bottomBound: BehaviorSubject<number | null> = new BehaviorSubject(null as number | null);
    
    /**
     * A zoom dependant value to use as a unit for sizing elements on the screen.
     *
     * @type {Observable<number>}
     */
    public readonly viewPort   : Observable<ViewPort>;
    public readonly zoomLevel  : Observable<number>;
    public readonly sizeUnit   : Observable<number>;
    public readonly viewCenterX: Observable<number>;
    public readonly viewCenterY: Observable<number>;
    public readonly viewBounds : Observable<ViewBounds>;
    
    private _currentViewBounds: ViewBounds = new ViewBounds({ width: 0, height: 0 }, 0, 0);
    public get currentViewBounds(): ViewBounds { return this._currentViewBounds;}

    constructor(protected element: ElementRef)
    {
        super();
        
        this.viewPort    = this.viewPortFeed();
        this.zoomLevel   = this.zoomLevelFeed();
        this.sizeUnit    = this.sizeUnitFeed();
        this.viewCenterX = this.viewCenterXFeed();
        this.viewCenterY = this.viewCenterYFeed();
        this.viewBounds  = this.viewBoundsFeed();
    }
    
    protected viewPortFeed(): Observable<ViewPort>
    {
        return new Observable<ViewPort>(observer =>
        {
            const element: HTMLElement = this.element.nativeElement;
            const resize = new ResizeObserver(([{ contentRect: { width, height } }]) => observer.next({ width, height }));
            
            observer.next({ width: element.clientWidth, height: element.clientHeight });

            resize.observe(element)
        
            return () => resize.disconnect();
        });
    }

    protected zoomLevelFeed(): Observable<number>
    {
        return this.zoomLevelInput.asObservable();
    }
    
    protected sizeUnitFeed(): Observable<number>
    {
        return combineLatest([this.zoomFactor, this.zoomLevel]).pipe(
            map(([zoomFactor, zoomLevel]) => zoomFactor ** zoomLevel)
        );
    }

    protected viewCenterXFeed(): Observable<number>
    {
        return this.viewCenterXInput.pipe(
            keepPositionInRange(this.viewPort, this.leftBound, this.rightBound, 'width')
        );
    }

    protected viewCenterYFeed(): Observable<number>
    {
        return this.viewCenterYInput.pipe(
            keepPositionInRange(this.viewPort, this.topBound, this.bottomBound, 'height')
        );
    }

    protected viewBoundsFeed(): Observable<ViewBounds>
    {
        return combineLatest([this.viewPort, this.viewCenterX, this.viewCenterY]).pipe(
            map(([viewPort, viewCenterX, viewCenterY]) => new ViewBounds(viewPort, viewCenterX, viewCenterY)),
            tap(viewBounds => this._currentViewBounds = viewBounds),
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

    public panToX(position: number): void
    {
        this.viewCenterXInput.next(position);
    }
    
    public panToY(position: number): void
    {
        this.viewCenterYInput.next(position);
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
        this.viewCenterXInput.next(this.currentViewBounds.viewCenterX + amount);
    }

    public panY(amount: number): void
    {
        this.viewCenterYInput.next(this.currentViewBounds.viewCenterY + amount);
    }

    public pan(amountX: number, amountY: number): void
    {
        this.panX(amountX);
        this.panY(amountY);
    }
    
    protected panToPosition(positionX: number, positionY: number): void
    {
        this.panToX(positionX);
        this.panToY(positionY);
    }

    public zoom(amount: number): void
    {
        this.addAmount(this.zoomLevelInput, amount);
    }

    public setZoom(zoomLevel: number): void
    {
        this.zoomLevelInput.next(zoomLevel);
    }

    protected zoomOnPosition(positionX: number, positionY: number, amount: number): void
    {
        this.zoom(amount);

        const zoomedBy          = this.calculateZoomChangeInPixels(amount);
        const zoomedViewCenterX = this.calculateViewCenterZoomedToPosition(this.viewCenterXInput.value, positionX, zoomedBy);
        const zoomedViewCenterY = this.calculateViewCenterZoomedToPosition(this.viewCenterYInput.value, positionY, zoomedBy);

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
