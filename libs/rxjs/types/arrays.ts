import { Observable } from 'rxjs';

/** Represents an array of observables. */
export type ObservableArray = Observable<unknown>[];

/**
 * Constructs an tuple of the extracted emitted types in the received observable array.
 * This is is the reversed version of {@link ObservableTupleOf}.
 * 
 * For example, the following:
 * ```ts
 * EmittedArrayTypesOf<[Observable<number>, Observable<string>, Observable<boolean>]>
 * ```
 * 
 * Will produce the following type:
 * ```ts
 * [number, string, boolean]
 * ```
 **/
export type EmittedArrayTypesOf<T extends ObservableArray> =
    T extends [Observable<infer T0>, ...(infer TRest)]
        ? TRest['length'] extends 0
            ? [T0]
            // For some reason TS doesn't recognize TRest as ObservableArray automatically even though T extends ObservableArray
            // so it must be verified here again
            : TRest extends ObservableArray 
                ? [T0, ...EmittedArrayTypesOf<TRest>]
                : never
        : never;

/**
 * Constructs a tuple type where each element type wrapped with an observable.
 * This is is the reversed version of {@link EmittedArrayTypesOf}.
 * 
 * For example, the following:
 * ```ts
 * ObservableTupleOf<[number, string, boolean]>
 * ```
 * 
 * Will produce the following type:
 * ```ts
 * [Observable<number>, Observable<string>, Observable<boolean>]
 * ```
 */
export type ObservableTupleOf<T extends unknown[]> =
    T extends [infer T0, ...(infer TRest)]
        ? TRest['length'] extends 0
            ? [Observable<T0>] 
            : [Observable<T0>, ...ObservableTupleOf<TRest>]
        : never;