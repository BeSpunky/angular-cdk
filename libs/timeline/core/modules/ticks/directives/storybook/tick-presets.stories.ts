import { eachYearOfInterval, eachMonthOfInterval, eachHourOfInterval, eachDayOfInterval, differenceInMinutes, startOfMinute, addMinutes, differenceInSeconds, startOfSecond, addSeconds, getDaysInYear, getDaysInMonth, setHours } from 'date-fns';

import { DayFactor, DatesBetweenGenerator, TickLabeler } from '@bespunky/angular-cdk/timeline/abstraction/ticks';

export interface DayFactorPreset
{
    daysInYear  : DayFactor;
    daysInMonth : DayFactor;
    hoursInDay  : DayFactor;
    minutesInDay: DayFactor;
    secondsInDay: DayFactor;
    dayParts    : DayFactor;
}

interface StandardDatesPreset<T>
{
    years   : T;
    months  : T;
    hours   : T;
    days    : T;
    dayParts: T;
    minutes : T;
    seconds : T;
}

export type DatesBetweenPreset = StandardDatesPreset<DatesBetweenGenerator>;
export type TickLabelerPreset  = StandardDatesPreset<TickLabeler>;

// TODO: Day factors only affect tick width calculation. As the width is not being occupied in the example
//       component, these were never tested. Test and adapt as needed.
export const dayFactors: DayFactorPreset = {
    daysInYear  : getDaysInYear,
    daysInMonth : getDaysInMonth,
    dayParts    : 1 / 4,
    hoursInDay  : 1 / (24),
    minutesInDay: 1 / (24 * 60),
    secondsInDay: 1 / (24 * 60 * 60)
};

export const datesBetween: DatesBetweenPreset = {
    years   : (start, end) => eachYearOfInterval({start,end}),
    months  : (start, end) => eachMonthOfInterval({start, end}),
    days    : (start, end) => eachDayOfInterval({ start, end }),
    dayParts: (start, end) => eachDayOfInterval({ start, end }).reduce<Date[]>((parts, date) => [...parts, date, setHours(date, 6), setHours(date, 12), setHours(date, 18)], []),
    hours   : (start, end) => eachHourOfInterval({start, end}),
    minutes : (start, end) => Array.from({ length: Math.abs(differenceInMinutes(start, end)) }, (_, minIndex) => startOfMinute(addMinutes(start, minIndex))),
    seconds : (start, end) => Array.from({ length: Math.abs(differenceInSeconds(start, end)) }, (_, secIndex) => startOfSecond(addSeconds(start, secIndex)))
};

export const dayParts = ['Night', 'Morning', 'Noon', 'Evening'];

export const label: TickLabelerPreset = {
    years   : (value: Date) => value.getFullYear(),
    months  : (value: Date) => value.getMonth() + 1,
    days    : (value: Date) => value.getDate(),
    dayParts: (value: Date) => dayParts[Math.floor(value.getHours() / 6)],
    hours   : (value: Date) => value.getHours(),
    minutes : (value: Date) => value.getMinutes(),
    seconds : (value: Date) => value.getSeconds()
};
