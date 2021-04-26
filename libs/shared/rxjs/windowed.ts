import { Observable             } from 'rxjs';
import { windowToggle, mergeAll } from 'rxjs/operators';

type WindowOff<TOn, TOff> = Observable<TOff> | ((value: TOn) => Observable<TOff>);

export function windowed<TWindowed, TOn, TOff>(observable: Observable<TWindowed>, on: Observable<TOn>, off: WindowOff<TOn, TOff>): Observable<TWindowed>
{
    const closingSelector = off instanceof Observable ? () => off : off;

    return observable.pipe(
        windowToggle(on, closingSelector),
        mergeAll()
    );
}