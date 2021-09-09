import { Observable } from 'rxjs';
import { map        } from 'rxjs/operators';

import { ObservableArray             } from '../types/arrays';
import { EmittedMapOf, ObservableMap } from '../types/maps';

/**
 * 
 *
 * @export
 * @template TObsMap 
 * @template TObsArray 
 * @param {TObsMap} input 
 * @param {(observables: TObsArray) => Observable<unknown[]>} observeArray 
 * @return {Observable<EmittedMapOf<TObsMap>>} 
 */
export function observeMapAsArray<TObsMap extends ObservableMap, TObsArray extends ObservableArray>(input: TObsMap, observeArray: (observables: TObsArray) => Observable<any[]>): Observable<EmittedMapOf<TObsMap>>
{
    const keyMap = Object.keys(input).reduce((map, key, index) =>
    {
        map[index] = key;
        return map;
    }, {} as { [index: number]: keyof TObsMap });

    const observables = Object.keys(input).map(key => input[key]) as TObsArray;

    return observeArray(observables).pipe(
        // TS is giving me a hard time here by not recognizing `values` as an array for some reason.
        // Can't figure it it out yet but the function works correctly. Silencing linter.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map(values => values.reduce((resolved: EmittedMapOf<TObsMap>, value, index) =>
        {
            resolved[keyMap[index]] = value;
            return resolved;
        }, {}))
    );
}