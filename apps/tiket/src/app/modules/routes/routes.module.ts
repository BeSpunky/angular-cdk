import { NgModule                         } from '@angular/core';
import { CommonModule                     } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule                       } from '@bespunky/angular-zen/core';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RouteListComponent  } from './routes-list/route-list.component';
import { RoutesTimelineModule } from './routes-list/routes-timeline/routes-timeline.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        RoutesTimelineModule,
    ],
    declarations: [
        MainLayoutComponent,
        RouteListComponent,
    ],
    exports: [MainLayoutComponent],
})
export class TicketRoutesModule { }
