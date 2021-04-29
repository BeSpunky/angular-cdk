import { CommonModule                                    } from '@angular/common';
import { componentWrapperDecorator, Meta, moduleMetadata } from '@storybook/angular';

import { TimelineCdkModule, TimelineConfigProvider, TimelineCameraProvider, TimelineTickDirective } from '@bespunky/angular-cdk/timeline';
import { createTickStory, createDynamicTickStory, wrapStoryInTimelineContainer                    } from './storybook/tick-helpers.stories';
import { yearsTick, monthsTick, daysTick, dayPartsTick, hoursTick, minutesTick, secondsTick       } from './storybook/tick-definitions.stories';

export default {
    title     : 'Timeline/*bsTimelineTick',
    component : TimelineTickDirective,
    decorators: [
        moduleMetadata({
            imports  : [CommonModule, TimelineCdkModule],
            providers: [TimelineCameraProvider, TimelineConfigProvider]
        }),
        componentWrapperDecorator(wrapStoryInTimelineContainer, { zoom: 100, now: new Date() })
    ],
    argTypes: {
        tickId      : { description: 'A unique id you can use to identify the tick later on in your code',   control: { type: 'text' } },
        minZoom     : { description: 'The lowest zoom level this tick should render on', defaultValue: -200, control: { type: 'range', min: -300, max: 300 } },
        maxZoom     : { description: 'The highest zoom level this tick should render on', defaultValue: 200, control: { type: 'range', min: -300, max: 300 } },
        dayFactor   : { description: 'Either a number or a function returning a number defining the relation between one day and this tick scale.', control: false },
        datesBetween: { description: 'A function(startDate, endDate) which returns an array with all the dates corresponding to the scale which are between the specified dates.', control: false },
    }
} as Meta;

export const Years    = createDynamicTickStory(yearsTick);
export const Months   = createDynamicTickStory(monthsTick);
export const Days     = createDynamicTickStory(daysTick);
export const Multiple = createTickStory(yearsTick, monthsTick, daysTick);

const zoomedDaysTick = { ...daysTick, minZoom: 30, maxZoom: 120 };
export const DayParts = createTickStory(zoomedDaysTick, dayPartsTick);