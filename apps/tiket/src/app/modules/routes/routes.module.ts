import { NgModule                         } from '@angular/core';
import { CommonModule                     } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule                       } from '@bespunky/angular-zen/core';
import { TimelineCdkModule                } from '@bespunky/angular-cdk/timeline';

import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RouteListComponent  } from './routes-list/route-list.component';

@NgModule({
    declarations: [
        MainLayoutComponent,
        RouteListComponent,
    ],
    exports: [MainLayoutComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        TimelineCdkModule,
    ]
})
export class TicketRoutesModule { }
