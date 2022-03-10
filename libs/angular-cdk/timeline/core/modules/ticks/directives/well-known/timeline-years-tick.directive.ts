import { Directive, OnInit } from '@angular/core';

import { WellKnownTickId                } from '@bespunky/angular-cdk/timeline/well-known';
import { TimelineWellKnownTickDirective } from './timeline-well-known-tick.directive';

@Directive({
    selector: '[bsTimelineYearsTick]'
})
export class TimelineYearsTickDirective extends TimelineWellKnownTickDirective implements OnInit
{
    protected readonly wellKnownTickId: WellKnownTickId = 'years';
}
