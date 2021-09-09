import { tap } from 'rxjs/operators';

export function runIf<T>(shouldRun: (value: T) => boolean, run: (value: T) => void)
{
    return tap<T>(value => shouldRun(value) ? run(value) : void 0);
}