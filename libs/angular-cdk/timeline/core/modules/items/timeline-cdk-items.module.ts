import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineItemDirective } from './directive/timeline-item.directive';

@NgModule({
    imports     : [CommonModule],
    declarations: [TimelineItemDirective],
    exports     : [TimelineItemDirective]
})
export class TimelineCdkItemsModule { }
