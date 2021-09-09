import { Component, OnInit } from '@angular/core';
import { Destroyable } from '@bespunky/angular-zen/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user.service';
import { FilteredTiketsService } from '../../../shared/services/filtered-tikets.service';
import { Ticket } from '../../../shared/models/ticket';
import { RoutesService } from '../../../shared/services/routes.service';
import { AssignedTiketsByTiker, RoutesCoordinatorService } from '../../../shared/services/routes-coordinator.service';

@Component({
    selector   : 'tt-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls  : ['./main-layout.component.scss']
})
export class MainLayoutComponent extends Destroyable
{
  public unassignedTikets: Observable<Ticket[]>
  public assignedTikets  : Observable<AssignedTiketsByTiker>

  constructor(
    private _filteredTiketsService: FilteredTiketsService,
    private _users                : UserService,
    private _routes               : RoutesService,
    private _coordinator          : RoutesCoordinatorService
  )
  {
    super();
    
    this.unassignedTikets = this._filteredTiketsService.getFilteredUnassignedTickets().pipe(share());
    this.assignedTikets   = this._coordinator.tiketsByTikerFeed().pipe(share());
  }

}
