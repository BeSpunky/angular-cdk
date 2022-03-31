import { NgModule     } from '@angular/core';

import { TimelineItemDirective } from './directives/timeline-item.directive';

@NgModule({
    declarations: [TimelineItemDirective],
    exports     : [TimelineItemDirective]
})
export class TimelineCdkItemsModule { }
