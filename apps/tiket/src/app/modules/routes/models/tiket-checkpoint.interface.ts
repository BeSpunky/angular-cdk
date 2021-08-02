import { TiketCheckpointType } from '../types/tiket-checkpoint-type.enum';

export interface ITiketCheckpoint
{
    type         : TiketCheckpointType
    date         : Date
    transitTime  : number
    executionTime: number
}
