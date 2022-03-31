import { DayFactors } from '@bespunky/angular-cdk/timeline/well-known';

export class TickStoryDefinition
{
    /** A visual offset (in pixels) in case of multiple ticks in one story. See `createStory()` function. */
    public offset                 = 0;
    public minZoom                = -200;
    public maxZoom                = 220;
    public color                  = 'black';
    public width: number | string = 5;

    constructor(public readonly tickId: keyof typeof DayFactors) { }
};

export const yearsTick   = new TickStoryDefinition('years');
export const monthsTick  = new TickStoryDefinition('months');
export const daysTick    = new TickStoryDefinition('days');
export const hoursTick   = new TickStoryDefinition('hours');
export const minutesTick = new TickStoryDefinition('minutes');
export const secondsTick = new TickStoryDefinition('seconds');

export const dayPartsTick = new TickStoryDefinition('dayParts');

dayPartsTick.minZoom = 80;
dayPartsTick.maxZoom = 150;