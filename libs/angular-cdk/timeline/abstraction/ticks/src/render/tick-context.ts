import { TickData } from './tick-data';

export type TickContext = {
    $implicit     : TickData;
    bsTimelineTick: TickData;
} & TickData;