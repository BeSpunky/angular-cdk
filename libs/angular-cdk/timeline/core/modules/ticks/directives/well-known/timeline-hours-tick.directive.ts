import { Directive, OnInit } from '@angular/core';

import { WellKnownTickId                } from '@bespunky/angular-cdk/timeline/shared';
import { TimelineWellKnownTickDirective } from './timeline-well-known-tick.directive';

@Directive({
    selector: '[bsTimelineHoursTick]'
})
export class TimelineHoursTickDirective extends TimelineWellKnownTickDirective implements OnInit
{
    protected readonly wellKnownTickId: WellKnownTickId = 'hours';
}
