import { NgModule                     } from '@angular/core';
import { CommonModule                 } from '@angular/common';
import { TimelineCdkModule            } from '@bespunky/angular-cdk/timeline';

import { RoutesTimelineComponent      } from './routes-timeline.component';
import { RoutesTimelineTicksComponent } from './ticks/routes-timeline-ticks.component';
import { RoutesTimelineTikerComponent } from './tiker/routes-timeline-tiker.component';
import { RoutesTimelineTiketComponent } from './tiket/routes-timeline-tiket.component';

@NgModule({
    imports: [
        CommonModule,
        TimelineCdkModule
    ],
    declarations: [
        RoutesTimelineComponent,
        RoutesTimelineTicksComponent,
        RoutesTimelineTikerComponent,
        RoutesTimelineTiketComponent
    ],
    exports: [
        RoutesTimelineComponent
    ]
})
export class RoutesTimelineModule { }
