import { Story } from '@storybook/angular';

import { dayFactors, datesBetween, label } from './tick-context.stories';
import { TickStoryDefinition             } from './tick-definitions.stories';

export function wrapStoryInTimelineContainer(story: string)
{
    return /*html*/`
    <svg bsTimeline [zoom]="zoom" [date]="now" [positionY]="50" height="85vh" width="100vw">
        <line x1="50%" y1="0"
              x2="50%" y2="100%"
              stroke="purple" stroke-width="1"
        ></line>
        ${story}
    </svg>
    `;
}

export function createTickTemplate({ tickId, minZoom, maxZoom, labelKey, dayFactorKey, datesBetweenKey, color, width, offset }: TickStoryDefinition): string
{    
    return /*html*/`
    <g *bsTimelineTick="${tickId}; minZoom: ${minZoom}; maxZoom: ${maxZoom}; label: label['${labelKey}']; dayFactor: dayFactors['${dayFactorKey}']; datesBetween: datesBetween['${datesBetweenKey}']; let tick;">
        <line [attr.x1]="tick.screenPositionX | async" [attr.y1]="(tick.screenPositionY | async) + ${offset}"
              [attr.x2]="tick.screenPositionX | async" [attr.y2]="(tick.screenPositionY | async) + (tick.width | async) / 4"
              stroke-width="${width}" stroke="${color}"
        ></line>

        <text style="user-select: none" [attr.x]="tick.screenPositionX | async" [attr.y]="tick.screenPositionY | async" dx="4" dy="${offset}" font-size="20">{{tick.label | async}}</text>
    </g>
    `;
}

export function offsetTick(tick: TickStoryDefinition, index: number): TickStoryDefinition
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

export function createTickStory(...ticks: TickStoryDefinition[]): Story<TickStoryDefinition>
{
    const template = ticks.map(offsetTick).map(createTickTemplate).join(' ');
    
    const story: Story<TickStoryDefinition> = (args) => ({
        props: { ...args, dayFactors, datesBetween, label },
        template
    });

    story.argTypes = {
        tickId : { control: false },
        minZoom: { control: false },
        maxZoom: { control: false }
    };

    return story;
}

export function createDynamicTickStory(tick: TickStoryDefinition): Story<TickStoryDefinition>
{
    return (args) => ({
        props   : { ...tick, ...args, dayFactors, datesBetween, label },
        template: createTickTemplate(tick)
    });
}