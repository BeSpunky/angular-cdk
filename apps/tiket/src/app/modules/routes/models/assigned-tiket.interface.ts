import { ITiketCheckpoint } from './tiket-checkpoint.interface';

export interface IAssignedTiket
{
    uid        : string
    tiketId    : string
    checkpoints: ITiketCheckpoint[]
    
    disabled  : boolean
}