import { Observable } from 'rxjs';

import { ReactiveCamera } from '@bespunky/angular-cdk/navigables/camera/reactive';

export abstract class TimelineCamera extends ReactiveCamera<Date>
{
    abstract readonly dayWidth: Observable<number>;
}
