import { Observable } from 'rxjs';

/** Represents a map of observable values. */
export type ObservableMap = { [key: string]: Observable<unknown> };

/**
 * Constructs a type out of an observable map, where keys are the same keys as the ones of an observable map, and values the
 * type of values emitted by the observable at the respective key.
 * 
 * For example:
 * 
 * ```ts
 * EmittedMapOf<{ x: Observable<number>, y: Observable<string> }>
 * ```
 * 
 * will create the following type:
 * ```ts
 * { x: number, y: string }
 * ```
 */
export type EmittedMapOf<T extends ObservableMap> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

export type TypesOfEmittedMap<T extends ObservableMap> = EmittedMapOf<T>[keyof T];

