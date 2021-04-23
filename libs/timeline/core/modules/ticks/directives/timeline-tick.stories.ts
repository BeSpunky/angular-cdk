import { CommonModule                                    } from '@angular/common';
import { componentWrapperDecorator, Meta, moduleMetadata } from '@storybook/angular';

import { TimelineCdkModule, TimelineConfigProvider, TimelineCameraProvider, TimelineTickDirective } from '@bespunky/angular-cdk/timeline';
import { createTickStory                                                                          } from './storybook/tick-helpers.stories';
import { yearsTick, monthsTick, daysTick                                                          } from './storybook/tick-definitions.stories';

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

export const Years    = createTickStory(yearsTick);
export const Months   = createTickStory(monthsTick);
export const Days     = createTickStory(daysTick);
export const Multiple = createTickStory(yearsTick, monthsTick, daysTick);