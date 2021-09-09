import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function switchMapIf<T, U>(shouldSwitch: (value: T) => boolean, switchMapFn: (value: T) => Observable<U>)
{
    return (source: Observable<T>) => source.pipe(switchMap(value => shouldSwitch(value) ? switchMapFn(value) : source));
}