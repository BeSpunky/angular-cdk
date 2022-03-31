import { Observable } from 'rxjs';

import { KeyboardModifiers } from "../types/keyboard-modifiers";

export interface FeedConfig
{
    activationSwitch?: Observable<boolean>;
}

export interface FeedWithModifiersConfig extends FeedConfig
{
    modifiers?: Partial<KeyboardModifiers>;
}