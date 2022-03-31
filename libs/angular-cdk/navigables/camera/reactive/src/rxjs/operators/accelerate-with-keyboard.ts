import { Observable, pipe    } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { EventWithModifiers      } from '@bespunky/angular-cdk/reactive-input/shared';
import { KeyboardModifierFactors } from '../../core/keyboard-modifier-factors';

export type EventWithModifierFactors<TEvent extends EventWithModifiers> = [TEvent, KeyboardModifierFactors];
export type AcceleratedEvent        <TEvent extends EventWithModifiers> = [number, TEvent];

export function accelerateWithKeyboard<T extends EventWithModifiers>(getAmount: (event: T) => number, modifierFactors: Observable<KeyboardModifierFactors>)
{
    return pipe(
        withLatestFrom(modifierFactors),
        map<EventWithModifierFactors<T>, AcceleratedEvent<T>>(([event, factors]) =>
        {
            let amount = getAmount(event);

            if (event.altKey  ) amount *= factors.alt;
            if (event.ctrlKey ) amount *= factors.ctrl;
            if (event.shiftKey) amount *= factors.shift;
            
            return [amount, event];
        })
    );
}