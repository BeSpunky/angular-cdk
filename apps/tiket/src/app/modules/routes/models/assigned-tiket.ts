import { IAssignedTiket   } from './assigned-tiket.interface';
import { ITiketCheckpoint } from './tiket-checkpoint.interface';

export class AssignedTiket implements IAssignedTiket
{
    constructor(
        public readonly uid       : string,
        public readonly tiketId   : string,
        public readonly checkpoints: ITiketCheckpoint[],

        public readonly disabled  : boolean = false
    ) { }

    public addCheckpoint(checkpoint: ITiketCheckpoint): void
    {
        this.checkpoints.push(checkpoint);
    }

    public removeCheckpoint(checkpoint: ITiketCheckpoint): void
    {
        this.checkpoints.splice(this.checkpoints.indexOf(checkpoint), 1);
    }
}