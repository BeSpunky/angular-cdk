import { TickItem } from './tick-item';

export type TickContext = {
    $implicit     : TickItem;
    bsTimelineTick: TickItem;
} & TickItem;