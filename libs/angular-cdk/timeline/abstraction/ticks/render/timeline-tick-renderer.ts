import { Destroyable } from '@bespunky/angular-zen/core';

import { TimelineTick } from '../core/timeline-tick';
import { TickData     } from './tick-data';
import { RenderedTick } from './rendered-tick';

/**
 * Provides the bases for a services that handles tick rendering.
 *
 * @export
 * @abstract
 * @class TimelineTickRenderer
 * @extends {Destroyable}
 */
export abstract class TimelineTickRenderer extends Destroyable
{
    /**
     * A map of all rendered tick views for each tick level. Used for view recycling.
     *
     * @type {{ [tickId: string]: RenderedTick[] }}
     */
    public readonly ticksInView: { [tickId: string]: RenderedTick[] } = {};
    
    abstract renderTicks(tick: TimelineTick, items: TickData[]): void;
    abstract unrenderTicks(tick: TimelineTick): void;
}