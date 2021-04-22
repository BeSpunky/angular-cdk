import { NgModule } from '@angular/core';

import { TimelineCdkTicksModule } from './modules/ticks/timeline-cdk-ticks.module';
import { TimelineDirective      } from './directives/timeline.directive';

@NgModule({
    imports     : [TimelineCdkTicksModule],
    declarations: [TimelineDirective],
    exports     : [TimelineDirective, TimelineCdkTicksModule],
})
export class TimelineCdkModule {}
