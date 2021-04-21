import { Observable } from 'rxjs';

import { ReactiveCamera } from '@bespunky/angular-cdk/navigables/automation';

export abstract class TimelineCamera extends ReactiveCamera<Date>
{
    abstract readonly dayWidth  : Observable<number>;
}
