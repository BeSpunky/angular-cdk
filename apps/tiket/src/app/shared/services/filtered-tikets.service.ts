import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket';

@Injectable({ providedIn: 'root' })
export class FilteredTiketsService
{
  /**
   * gets all unassigned Tikets filtered from the `<tiket-filters></tiket-filters>` component
   */
  public getFilteredUnassignedTickets(): Observable<Ticket[]>
  {
      return of([
          new Ticket(0, 0, Math.random() * 100),
          new Ticket(1, 0, Math.random() * 100),
          new Ticket(2, 0, Math.random() * 100),
          new Ticket(3, 0, Math.random() * 100),
      ]);
  }
}