import { BehaviorSubject, Observable } from 'rxjs';
import { Property } from '@bespunky/typescript-utils';
import { ViewBounds } from '@bespunky/angular-cdk/navigables/camera';
import { ReactiveCamera } from './reactive-camera';

/**********************************************************************************************
 * This file is used internally by reactive-camera.ts and should not be exposed as public api.
 **********************************************************************************************/

export type PanDirection              = 'horizontal' | 'vertical';
export type ActivationSwitch<TItem>   = Property<ReactiveCamera<TItem>, BehaviorSubject<boolean>>;
export type AmountExtractor<TEvent>   = (event: TEvent) => number;
export type PositionExtractor<TEvent> = (event: TEvent, viewBounds: ViewBounds) => number;

export interface ZoomConfig<TEvent>
{
    eventFeed   : Observable<TEvent>;
    getPositionX: (event: TEvent, viewBounds: ViewBounds) => number;
    getPositionY: (event: TEvent, viewBounds: ViewBounds) => number;
    getAmount   : AmountExtractor<TEvent>;
}

export interface FlickConfig<TTrigger, TAbort>
{
    trigger          : Observable<TTrigger>;
    abortOn          : Observable<TAbort>;
    direction        : PanDirection;
    getLastMoveAmount: (e: TTrigger) => number;
}
