import { CommonModule                                           } from '@angular/common';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';

import { TimelineCdkModule, TimelineConfigProvider, TimelineCameraProvider, TimelineTickDirective } from '@bespunky/angular-cdk/timeline';
import { dayFactors, datesBetween, label, TickLabelerPreset, DayFactorPreset, DatesBetweenPreset  } from './storybook/timeline-tick-presets.stories';

export default {
    title     : 'Timeline Tick',
    component : TimelineTickDirective,
    decorators: [
        moduleMetadata({
            imports  : [CommonModule, TimelineCdkModule],
            providers: [TimelineCameraProvider, TimelineConfigProvider]
        }),
        componentWrapperDecorator(story => `<svg bsTimeline height="100vh" width="100vw">${story}</svg>`)
    ]
} as Meta;

class TickStoryDefinition
{
    /** A visual offset (in pixels) in case of multiple ticks in one story. See `createStory()` function. */
    public offset                 = 0;
    public minZoom                = 0;
    public maxZoom                = 20;
    public color                  = 'black';
    public width: number | string = 5;

    constructor(
        public readonly tickId         : string,
        public readonly labelKey       : keyof TickLabelerPreset,
        public readonly dayFactorKey   : keyof DayFactorPreset | number,
        public readonly datesBetweenKey: keyof DatesBetweenPreset,
    ) { }
};

function createTickTemplate({tickId, minZoom, maxZoom, labelKey, dayFactorKey, datesBetweenKey, color, width, offset}: TickStoryDefinition): string
{
    return `
    <g *bsTimelineTick="${tickId}; minZoom: ${minZoom}; maxZoom: ${maxZoom}; label: label['${labelKey}']; dayFactor: dayFactors['${dayFactorKey}']; datesBetween: datesBetween['${datesBetweenKey}']; let tick;">
        <line [attr.x1]="tick.screenPositionX | async" [attr.y1]="${offset}"
              [attr.x2]="tick.screenPositionX | async" [attr.y2]="tick.screenPositionY | async"
              stroke-width="${width}" stroke="${color}"
        ></line>

        <text [attr.x]="tick.screenPositionX | async" [attr.y]="tick.screenPositionY | async" dx="${offset}" dy="${offset}" font-size="20">{{tick.label | async}}</text>
    </g>
    `;
}

function offsetTick(tick: TickStoryDefinition, index: number): TickStoryDefinition
{
    const colors = ['black', 'green', 'blue', 'red', 'purple'];

    return {
        ...tick,
        offset : index * 30,
        minZoom: tick.minZoom + index * 10,
        maxZoom: tick.maxZoom + index * 10,
        color  : colors[index % colors.length]
    };
}

function createTickStory(...ticks: TickStoryDefinition[]): Story<TimelineTickDirective>
{
    const template = ticks.map(offsetTick).map(createTickTemplate).join(' ');
    
    return args => ({
        props   : { ...args, dayFactors, datesBetween, label },
        template
    });
}

const yearsTick  = new TickStoryDefinition('years', 'years', 'daysInYear', 'years');
const monthsTick = new TickStoryDefinition('months', 'months', 'daysInMonth', 'months');
const daysTick   = new TickStoryDefinition('days', 'days', 1, 'days');

export const Years    = createTickStory(yearsTick);
export const Months   = createTickStory(monthsTick);
export const Days     = createTickStory(daysTick);
export const Multiple = createTickStory(yearsTick, monthsTick, daysTick);