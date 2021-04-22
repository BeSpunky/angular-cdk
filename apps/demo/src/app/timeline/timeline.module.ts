import { NgModule     } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineCdkModule    } from '@bespunky/angular-cdk/timeline/core';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
    imports     : [CommonModule, TimelineCdkModule],
    declarations: [TimelineComponent],
    exports     : [TimelineComponent]
})
export class TimelineModule { }
