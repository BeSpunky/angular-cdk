import { addDays } from 'date-fns';
import { CommonModule                                           } from '@angular/common';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';

import { TimelineTickDirective, TimelineCdkModule } from '@bespunky/angular-cdk/timeline';
import { dayFactors, datesBetween, label          } from './tick-context.stories';
import { TickStoryDefinition                      } from './tick-definitions.stories';

export function createTickStoryMeta(exampleGroupName: string, wrapStoryInTimelineContainer: (story: string) => string): Meta
{
    return {
        title     : `Timeline/*bsTimelineTick/${exampleGroupName}`,
        component : TimelineTickDirective,
        decorators: [
            moduleMetadata({ imports: [CommonModule, TimelineCdkModule] }),
            componentWrapperDecorator(wrapStoryInTimelineContainer, { zoom: 100, now: new Date(), yesterday: addDays(new Date(), -1) })
        ],
        argTypes: {
            minZoom: { description: 'The lowest zoom level this tick should render on' , defaultValue: -200, control: { type: 'range', min: -300, max: 300 } },
            maxZoom: { description: 'The highest zoom level this tick should render on', defaultValue:  200, control: { type: 'range', min: -300, max: 300 } }
        }
    } as Meta;
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

export function createTickStory(createTickTemplate: (tick: TickStoryDefinition) => string, ...ticks: TickStoryDefinition[]): Story<TickStoryDefinition>
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

export function createDynamicTickStory(createTickTemplate: (tick: TickStoryDefinition) => string, tick: TickStoryDefinition): Story<TickStoryDefinition>
{
    return (args) => ({
        props   : { ...tick, ...args, dayFactors, datesBetween, label },
        template: createTickTemplate(tick)
    });
}