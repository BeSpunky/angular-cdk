import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@bespunky/angular-zen/core';
import { TimelineCdkModule } from '@bespunky/angular-cdk/timeline';
import { RouteListComponent } from './routes-list/route-list.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
    declarations: [
        RouteListComponent,
        MainLayoutComponent
    ],
    exports: [RouteListComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        TimelineCdkModule,
    ]
})
export class TicketRoutesModule { }
