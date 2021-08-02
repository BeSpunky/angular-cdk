import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'

import { IAssignedTiket } from '../../modules/routes/models/assigned-tiket.interface'
import { RoutesService } from './routes.service'

export type AssignedTiketsByTiker = { uid: string, assignedTikets: IAssignedTiket[] }[]

@Injectable({ providedIn: 'root' })
export class RoutesCoordinatorService
{
    constructor(private _routes: RoutesService) { }
        
    public tiketsByTikerFeed(/* TODO: Add query params */): Observable<AssignedTiketsByTiker>
    {
        return this._routes.assignedTiketsFeed(/* TODO: Add query params */).pipe(
            map(assignedTikets => this.mapAssignedTiketsToTikers(assignedTikets))
        )
    }

    private mapAssignedTiketsToTikers(assignedTikets: IAssignedTiket[]): AssignedTiketsByTiker
    {
        const tiketByTikerMap = assignedTikets.reduce((tiketsByTiker, tiket) =>
        {
            const tikets = tiketsByTiker.get(tiket.uid) ?? []

            return tiketsByTiker.set(tiket.uid, [...tikets, tiket])
        }, new Map<string, IAssignedTiket[]>())

        return Array.from(tiketByTikerMap.entries()).map(([uid, tikets]) => ({ uid, assignedTikets: tikets }))
    }
}
