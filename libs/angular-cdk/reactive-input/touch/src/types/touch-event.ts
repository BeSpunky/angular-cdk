export type PanEventName    = 'pan' | 'panstart' | 'panmove' | 'panend' | 'pancancel' | 'panleft' | 'panright' | 'panup' | 'pandown';

export type PinchEventName  = 'pinch' | 'pinchstart' | 'pinchmove' | 'pinchend' | 'pinchcancel' | 'pinchin' | 'pinchout';

export type PressEventName  = 'press' | 'pressup';

export type RotateEventName = 'rotate' | 'rotatestart' | 'rotatemove' | 'rotateend' | 'rotatecancel';

export type SwipeEventName  = 'swipe' | 'swipeleft' | 'swiperight' | 'swipeup' | 'swipedown';

export type TapEventName    = 'tap';

export type TouchEventName  = PanEventName | PinchEventName | PressEventName | RotateEventName | SwipeEventName | TapEventName;