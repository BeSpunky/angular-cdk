import { KeyboardModifiers } from './keyboard-modifiers';

export type EventWithModifiers = KeyboardModifiers & { [value: string]: any };
