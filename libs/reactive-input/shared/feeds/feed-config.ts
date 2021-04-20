import { Observable } from 'rxjs';

export interface FeedConfig
{
    activationSwitch?: Observable<boolean>;
}