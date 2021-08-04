import { Component, Input } from '@angular/core'
import { AssignedTiketsByTiker } from '../../../shared/services/routes-coordinator.service'

@Component({
    selector   : 'tt-route-list',
    templateUrl: './route-list.component.html',
    styleUrls  : ['./route-list.component.scss']
})
export class RouteListComponent
{
    @Input() public assignedTikets: AssignedTiketsByTiker = []
}
