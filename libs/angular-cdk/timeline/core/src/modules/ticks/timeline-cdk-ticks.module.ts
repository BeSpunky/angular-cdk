import { NgModule } from '@angular/core';

import { TimelineTickDirective             } from './directives/timeline-tick.directive';
import { TimelineYearsTickDirective        } from './directives/well-known/timeline-years-tick.directive';
import { TimelineMonthsTickDirective       } from './directives/well-known/timeline-months-tick.directive';
import { TimelineDaysTickDirective         } from './directives/well-known/timeline-days-tick.directive';
import { TimelineDayPartsTickDirective     } from './directives/well-known/timeline-day-parts-tick.directive';
import { TimelineHoursTickDirective        } from './directives/well-known/timeline-hours-tick.directive';
import { TimelineMinutesTickDirective      } from './directives/well-known/timeline-minutes-tick.directive';
import { TimelineSecondsTickDirective      } from './directives/well-known/timeline-seconds-tick.directive';
import { TimelineMillisecondsTickDirective } from './directives/well-known/timeline-milliseconds-tick.directive';

@NgModule({
    declarations: [TimelineTickDirective, TimelineYearsTickDirective, TimelineMonthsTickDirective, TimelineDaysTickDirective, TimelineDayPartsTickDirective, TimelineHoursTickDirective, TimelineMinutesTickDirective, TimelineSecondsTickDirective, TimelineMillisecondsTickDirective],
    exports     : [TimelineTickDirective, TimelineYearsTickDirective, TimelineMonthsTickDirective, TimelineDaysTickDirective, TimelineDayPartsTickDirective, TimelineHoursTickDirective, TimelineMinutesTickDirective, TimelineSecondsTickDirective, TimelineMillisecondsTickDirective]
})
export class TimelineCdkTicksModule { }
