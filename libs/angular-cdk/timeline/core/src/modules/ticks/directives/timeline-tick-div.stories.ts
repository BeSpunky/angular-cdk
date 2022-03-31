import { createDivTickTemplate, wrapStoryInDivTimeline                                      } from './storybook/div/tick-template.stories';
import { createTickStory, createDynamicTickStory, createTickStoryMeta                       } from './storybook/tick-helpers.stories';
import { yearsTick, monthsTick, daysTick, dayPartsTick, hoursTick, minutesTick, secondsTick } from './storybook/tick-definitions.stories';

export default createTickStoryMeta('Div', wrapStoryInDivTimeline);

export const Years    = createDynamicTickStory(createDivTickTemplate, yearsTick);
export const Months   = createDynamicTickStory(createDivTickTemplate, monthsTick);
export const Days     = createDynamicTickStory(createDivTickTemplate, daysTick);
export const Multiple = createTickStory(createDivTickTemplate, yearsTick, monthsTick, daysTick);

const  zoomedMinutesTick = { ...minutesTick, minZoom: 140, maxZoom: 600 };
const  zoomedSecondsTick = { ...secondsTick, minZoom: 200, maxZoom: 600 };
export const Time        = createTickStory(createDivTickTemplate, hoursTick, zoomedMinutesTick, zoomedSecondsTick);

const  zoomedDaysTick = { ...daysTick, minZoom: 30, maxZoom: 120 };
export const DayParts = createTickStory(createDivTickTemplate, zoomedDaysTick, dayPartsTick);
