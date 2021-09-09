import { Observable } from 'rxjs';

/** Represents a type that extracts the type of value an observable emits. */
export type EmittedTypeOf<T> = T extends Observable<infer TResolved> ? TResolved : never;