import { EmbeddedViewRef } from '@angular/core';

import { TickContext } from './tick-context';
import { TickItem    } from './tick-item';
export interface RenderedTick
{
    item: TickItem;
    view: EmbeddedViewRef<TickContext>;
}