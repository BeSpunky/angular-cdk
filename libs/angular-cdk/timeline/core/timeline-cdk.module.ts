import { NgModule   } from '@angular/core';
import { CoreModule } from '@bespunky/angular-zen/core';

import { TimelineCdkTicksModule } from './modules/ticks/timeline-cdk-ticks.module';
import { TimelineCdkItemsModule } from './modules/items/timeline-cdk-items.module';
import { TimelineDirective      } from './directives/timeline.directive';

@NgModule({
    imports     : [TimelineCdkTicksModule, CoreModule, TimelineCdkItemsModule],
    declarations: [TimelineDirective],
    exports     : [TimelineDirective, TimelineCdkTicksModule],
})
export class TimelineCdkModule {}
