import { TickLabelerPreset, DayFactorPreset, DatesBetweenPreset } from './tick-presets.stories';

export class TickStoryDefinition
{
    /** A visual offset (in pixels) in case of multiple ticks in one story. See `createStory()` function. */
    public offset                 = 0;
    public minZoom                = 0;
    public maxZoom                = 120;
    public color                  = 'black';
    public width: number | string = 5;

    constructor(
        public readonly tickId         : string,
        public readonly labelKey       : keyof TickLabelerPreset,
        public readonly dayFactorKey   : keyof DayFactorPreset | number,
        public readonly datesBetweenKey: keyof DatesBetweenPreset,
    ) { }
};

export const yearsTick  = new TickStoryDefinition('years', 'years', 'daysInYear', 'years');
export const monthsTick = new TickStoryDefinition('months', 'months', 'daysInMonth', 'months');
export const daysTick   = new TickStoryDefinition('days', 'days', 1, 'days');

export const dayPartsTick = new TickStoryDefinition('dayParts', 'dayParts', 'dayParts', 'dayParts');

dayPartsTick.minZoom = 80;
dayPartsTick.maxZoom = 150;