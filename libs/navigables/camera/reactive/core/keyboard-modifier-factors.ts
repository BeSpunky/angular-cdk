export interface KeyboardModifierFactors
{
    alt  : number;
    ctrl : number;
    shift: number;
}

export const DefaultKeyboardModifierFactors: KeyboardModifierFactors = {
    alt  : 0.7,
    ctrl : 1.2,
    shift: 1.5
};