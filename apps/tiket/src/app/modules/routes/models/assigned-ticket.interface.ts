import { ITiketCheckpoint } from './tiket-checkpoint.interface';

export interface IAssignedTiket
{
    uid       : string
    tiketId   : string
    checkpoint: ITiketCheckpoint[]
    
    disabled  : boolean
}