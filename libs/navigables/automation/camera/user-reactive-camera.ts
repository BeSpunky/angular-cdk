import { BehaviorSubject } from 'rxjs';

import { Camera } from '@bespunky/angular-cdk/navigables/camera';
import { KeyboardModifierFactors } from './keyboard-modifier-factors';

export const DefaultKeyboardModifierFactors: KeyboardModifierFactors = {
    alt  : 0.7,
    ctrl : 1.2,
    shift: 1.5
};

export abstract class UserReactiveCamera<TItem> extends Camera<TItem>
{
    // Control Switchs
    public readonly zoomOnWheel   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnWheel   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly zoomOnKeyboard: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnKeyboard: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly zoomOnPinch   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);
    public readonly moveOnFlick   : BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);

    // Factors
    public readonly moveAmount             : BehaviorSubject<number>                  = new BehaviorSubject(3);
    public readonly keyboardModifierFactors: BehaviorSubject<KeyboardModifierFactors> = new BehaviorSubject(DefaultKeyboardModifierFactors);
}
