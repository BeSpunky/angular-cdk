import { AfterViewInit, OnInit, ViewChild } from '@angular/core'
import { Component, Input } from '@angular/core'
import { ViewBounds } from '@bespunky/angular-cdk/navigables/camera'
import { Timeline, TimelineDirective, TimelineLocationService } from '@bespunky/angular-cdk/timeline'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import eachHourOfInterval from 'date-fns/eachHourOfInterval'


import { AssignedTiketsByTiker } from '../../../shared/services/routes-coordinator.service'
import { ITiketCheckpoint } from '../models/tiket-checkpoint.interface'

@Component({
    selector   : 'tt-route-list',
    templateUrl: './route-list.component.html',
    styleUrls  : ['./route-list.component.scss']
})
export class RouteListComponent implements AfterViewInit
{
    now  = new Date()
    zoom = 150

    @ViewChild(TimelineDirective) timeline!: Timeline;

    @Input() public assignedTikets: AssignedTiketsByTiker = []

    constructor(private location: TimelineLocationService) { }

    ngAfterViewInit()
    {
        console.log(this.timeline);
    }

    datesBetween = (start: Date, end: Date) => eachDayOfInterval({ start, end })
    label = (date: Date) => `${ date.getDate() }/${ date.getMonth() }`
    
    datesBetweenH = (start: Date, end: Date) => eachHourOfInterval({ start, end })
    labelH = (date: Date) => date.getHours()

    positionTicket({ date }: ITiketCheckpoint, dayWidth: number, viewBounds: ViewBounds | null): number
    {
        console.log(`Day Width: ${ dayWidth } view Bounds: ${ viewBounds }`);
        
        const pos = this.location.dateToPosition(dayWidth, date);

        const x = this.location.toScreenPosition(pos, viewBounds?.left ?? 0);

        console.log(x);

        return x;
    }
}
