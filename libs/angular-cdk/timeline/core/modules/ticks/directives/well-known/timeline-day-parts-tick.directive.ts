import { Directive, OnInit } from '@angular/core';

import { WellKnownTickId                } from '@bespunky/angular-cdk/timeline/shared';
import { TimelineWellKnownTickDirective } from './timeline-well-known-tick.directive';

@Directive({
    selector: '[bsTimelineDayPartsTick]'
})
export class TimelineDayPartsTickDirective extends TimelineWellKnownTickDirective implements OnInit
{
    protected readonly wellKnownTickId: WellKnownTickId = 'dayParts';
}
