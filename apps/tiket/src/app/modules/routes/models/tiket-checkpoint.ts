import { TiketCheckpointType } from '../types/tiket-checkpoint-type.enum';
import { ITiketCheckpoint    } from './tiket-checkpoint.interface';

export class TiketCheckpoint implements ITiketCheckpoint
{
    constructor(
        public readonly type         : TiketCheckpointType,
        public readonly date         : Date,
        public readonly transitTime  : number,
        public readonly executionTime: number
    ) { }

    public get isJob      (): boolean { return this.type === TiketCheckpointType.Job       }
    public get isWarehouse(): boolean { return this.type === TiketCheckpointType.Warehouse }
    public get isOther    (): boolean { return this.type === TiketCheckpointType.Other     }
}