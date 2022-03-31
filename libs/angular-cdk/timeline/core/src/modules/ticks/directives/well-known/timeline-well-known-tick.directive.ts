import { Directive, OnInit } from '@angular/core';

import { DatesBetween, DayFactors, DefaultLabels, WellKnownTickId } from '@bespunky/angular-cdk/timeline/well-known';
import { TimelineTickDirective                                    } from '../timeline-tick.directive';

@Directive()
export abstract class TimelineWellKnownTickDirective extends TimelineTickDirective implements OnInit
{
    protected abstract readonly wellKnownTickId: WellKnownTickId;

    ngOnInit()
    {
        this.datesBetween.next(DatesBetween [this.wellKnownTickId]);
        this.dayFactor   .next(DayFactors   [this.wellKnownTickId]);
        this.label       .next(DefaultLabels[this.wellKnownTickId]);
    }
}
