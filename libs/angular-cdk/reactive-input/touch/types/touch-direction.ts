import { DIRECTION_ALL, DIRECTION_DOWN, DIRECTION_HORIZONTAL, DIRECTION_LEFT, DIRECTION_NONE, DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_VERTICAL } from 'hammerjs';

export type TouchDirection = 'left' | 'right' | 'up' | 'down' | 'vertical' | 'horizontal' | 'all' | 'none';

export const TouchDirectionCodes: Record<TouchDirection, number> = {
    left      : DIRECTION_LEFT,
    right     : DIRECTION_RIGHT,
    up        : DIRECTION_UP,
    down      : DIRECTION_DOWN,
    vertical  : DIRECTION_VERTICAL,
    horizontal: DIRECTION_HORIZONTAL,
    all       : DIRECTION_ALL,
    none      : DIRECTION_NONE
};
    