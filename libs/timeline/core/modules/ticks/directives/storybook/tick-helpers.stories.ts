import { Story } from '@storybook/angular';

import { TimelineTickDirective           } from '@bespunky/angular-cdk/timeline';
import { dayFactors, datesBetween, label } from './tick-presets.stories';
import { TickStoryDefinition             } from './tick-definitions.stories';

export function createTickTemplate({tickId, minZoom, maxZoom, labelKey, dayFactorKey, datesBetweenKey, color, width, offset}: TickStoryDefinition): string
{
    return `
    <g *bsTimelineTick="${tickId}; minZoom: ${minZoom}; maxZoom: ${maxZoom}; label: label['${labelKey}']; dayFactor: dayFactors['${dayFactorKey}']; datesBetween: datesBetween['${datesBetweenKey}']; let tick;">
        <line [attr.x1]="tick.screenPositionX | async" [attr.y1]="(tick.screenPositionY | async) + ${offset}"
              [attr.x2]="tick.screenPositionX | async" [attr.y2]="(tick.screenPositionY | async) + 50"
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

export function createTickStory(...ticks: TickStoryDefinition[]): Story<TimelineTickDirective>
{
    const template = ticks.map(offsetTick).map(createTickTemplate).join(' ');
    
    return args => ({
        props   : { ...args, dayFactors, datesBetween, label },
        template
    });
}
