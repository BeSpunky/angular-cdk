import { NgModule                               } from '@angular/core';
import { CommonModule                           } from '@angular/common';
import { TimelineCdkModule                      } from '@bespunky/angular-cdk/timeline';

import { RoutesTimelineComponent                } from './routes-timeline.component';
import { RoutesTimelineTicksComponent           } from './ticks/routes-timeline-ticks.component';
import { RoutesTimelineTikerComponent           } from './tiker/routes-timeline-tiker.component';
import { RoutesTimelineTiketCheckpointComponent } from './tiket-checkpoint/routes-timeline-tiket-checkpoint.component';

@NgModule({
    imports: [
        CommonModule,
        TimelineCdkModule
    ],
    declarations: [
        RoutesTimelineComponent,
        RoutesTimelineTicksComponent,
        RoutesTimelineTikerComponent,
        RoutesTimelineTiketCheckpointComponent
    ],
    exports: [
        RoutesTimelineComponent
    ]
})
export class RoutesTimelineModule { }
