import { BehaviorSubject } from 'rxjs';
    
export abstract class TimelineConfig
{
    public readonly baseTickSize        : BehaviorSubject<number>  = new BehaviorSubject(1);
    public readonly virtualizationBuffer: BehaviorSubject<number>  = new BehaviorSubject(0.5);
    public readonly vertical            : BehaviorSubject<boolean> = new BehaviorSubject(false);
}
