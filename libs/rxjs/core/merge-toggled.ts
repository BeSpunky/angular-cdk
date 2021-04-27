import { Observable } from 'rxjs';
import { mergeAll   } from 'rxjs/operators';

import { Toggles, toggled } from './toggled';

export function mergeToggled<TWindowed, TOn, TOff>(observable: Observable<TWindowed>, config: Toggles<TOn, TOff>): Observable<TWindowed>
{
    return toggled(observable, config).pipe(mergeAll());
}
