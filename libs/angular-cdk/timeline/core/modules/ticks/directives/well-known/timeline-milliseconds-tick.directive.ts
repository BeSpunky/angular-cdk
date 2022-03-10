import { Directive, OnInit } from '@angular/core';

import { WellKnownTickId                } from '@bespunky/angular-cdk/timeline/well-known';
import { TimelineWellKnownTickDirective } from './timeline-well-known-tick.directive';

@Directive({
    selector: '[bsTimelineMillisecondsTick]'
})
export class TimelineMillisecondsTickDirective extends TimelineWellKnownTickDirective implements OnInit
{
    protected readonly wellKnownTickId: WellKnownTickId = 'milliseconds';
}
