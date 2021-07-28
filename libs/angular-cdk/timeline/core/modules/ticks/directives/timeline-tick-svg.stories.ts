import { createSVGTickTemplate, wrapStoryInSVGTimeline                                                             } from './storybook/svg/tick-template.stories';
import { createTickStory, createDynamicTickStory, createTickStoryMeta                       } from './storybook/tick-helpers.stories';
import { yearsTick, monthsTick, daysTick, dayPartsTick, hoursTick, minutesTick, secondsTick } from './storybook/tick-definitions.stories';

export default createTickStoryMeta('SVG', wrapStoryInSVGTimeline);

export const Years    = createDynamicTickStory(createSVGTickTemplate, yearsTick);
export const Months   = createDynamicTickStory(createSVGTickTemplate, monthsTick);
export const Days     = createDynamicTickStory(createSVGTickTemplate, daysTick);
export const Multiple = createTickStory(createSVGTickTemplate, yearsTick, monthsTick, daysTick);

const  zoomedMinutesTick = { ...minutesTick, minZoom: 140, maxZoom: 600 };
const  zoomedSecondsTick = { ...secondsTick, minZoom: 200, maxZoom: 600 };
export const Time        = createTickStory(createSVGTickTemplate, hoursTick, zoomedMinutesTick, zoomedSecondsTick);

const  zoomedDaysTick = { ...daysTick, minZoom: 30, maxZoom: 120 };
export const DayParts = createTickStory(createSVGTickTemplate, zoomedDaysTick, dayPartsTick);
