import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AssignedTiket } from '../../modules/routes/models/assigned-tiket';
import { IAssignedTiket } from '../../modules/routes/models/assigned-tiket.interface';
import { TiketCheckpoint } from '../../modules/routes/models/tiket-checkpoint';
import { TiketCheckpointType } from '../../modules/routes/types/tiket-checkpoint-type.enum';
import addHours from 'date-fns/addHours';

@Injectable({ providedIn: 'root' })
export class RoutesService
{
    public assignedTiketsFeed(/* TODO: Add query params */): Observable<IAssignedTiket[]>
    {
        return of([
            new AssignedTiket('SHY', '111', [
                new TiketCheckpoint(TiketCheckpointType.Warehouse, new Date, 100, 30),
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 1), 10, 30),
            ]),
            new AssignedTiket('SHY', '222', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 2), 10, 30),
            ]),
            new AssignedTiket('CHRIS', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), 10, 30),
            ])
        ]);
    }

    public assignTiket(assignedTiket: IAssignedTiket): Observable<void>
    {
        return throwError(`not implemented`);
    }

    public unassignTiket(assignedTiket: IAssignedTiket): Observable<void>
    {
        return throwError(`not implemented`);
    }

    public reassignTiket(/* TODO: What's going to be the API? */): Observable<void>
    {
        return throwError(`not implemented`);
    }
}