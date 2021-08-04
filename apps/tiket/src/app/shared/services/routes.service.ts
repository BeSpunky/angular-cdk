import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AssignedTiket } from '../../modules/routes/models/assigned-tiket';
import { IAssignedTiket } from '../../modules/routes/models/assigned-tiket.interface';
import { TiketCheckpoint } from '../../modules/routes/models/tiket-checkpoint';
import { TiketCheckpointType } from '../../modules/routes/types/tiket-checkpoint-type.enum';
import addHours from 'date-fns/addHours';

const _30Minutes = 1000 * 60 * 30;
const _10Minutes = 1000 * 60 * 10;

@Injectable({ providedIn: 'root' })
export class RoutesService
{
    public assignedTiketsFeed(/* TODO: Add query params */): Observable<IAssignedTiket[]>
    {
        return of([
            new AssignedTiket('SHY', '111', [
                new TiketCheckpoint(TiketCheckpointType.Warehouse, new Date, _10Minutes,  _30Minutes),
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 1), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('SHY', '222', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 2),  _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS1', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS2', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS3', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS4', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS5', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS6', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS7', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS8', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS11', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS111', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS222', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS123', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
            ]),
            new AssignedTiket('CHRIS321', '333', [
                new TiketCheckpoint(TiketCheckpointType.Job, addHours(new Date, 0.4), _10Minutes, _30Minutes),
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