import { Directive, OnInit } from '@angular/core';

import { WellKnownTickId                } from '@bespunky/angular-cdk/timeline/well-known';
import { TimelineWellKnownTickDirective } from './timeline-well-known-tick.directive';

@Directive({
    selector: '[bsTimelineMinutesTick]'
})
export class TimelineMinutesTickDirective extends TimelineWellKnownTickDirective implements OnInit
{
    protected readonly wellKnownTickId: WellKnownTickId = 'minutes';
}
