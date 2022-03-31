import { EmbeddedViewRef } from '@angular/core';

import { TickContext } from './tick-context';
import { TickData    } from './tick-data';
export interface RenderedTick
{
    item: TickData;
    view: EmbeddedViewRef<TickContext>;
}