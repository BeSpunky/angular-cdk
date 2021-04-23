import { eachYearOfInterval, eachMonthOfInterval, eachHourOfInterval, eachDayOfInterval, differenceInMinutes, startOfMinute, addMinutes, differenceInSeconds, startOfSecond, addSeconds, getDaysInYear, getDaysInMonth } from 'date-fns';

import { DayFactor, DatesBetweenGenerator, TickLabeler } from '@bespunky/angular-cdk/timeline/abstraction/ticks';

export interface DayFactorPreset
{
    daysInYear  : DayFactor;
    daysInMonth : DayFactor;
    hoursInDay  : DayFactor;
    minutesInDay: DayFactor;
    secondsInDay: DayFactor;
}

interface StandardDatesPreset<T>
{
    years  : T;
    months : T;
    hours  : T;
    days   : T;
    minutes: T;
    seconds: T;
}

export type DatesBetweenPreset = StandardDatesPreset<DatesBetweenGenerator>;
export type TickLabelerPreset  = StandardDatesPreset<TickLabeler>;

// TODO: Day factors only affect tick width calculation. As the width is not being occupied in the example
// component, these were never tested. Test and adapt as needed.
export const dayFactors: DayFactorPreset = {
    daysInYear  : getDaysInYear,
    daysInMonth : getDaysInMonth,
    hoursInDay  : 1 / (24),
    minutesInDay: 1 / (24 * 60),
    secondsInDay: 1 / (24 * 60 * 60)
};

export const datesBetween: DatesBetweenPreset = {
    years  : (start, end) => eachYearOfInterval({start,end}),
    months : (start, end) => eachMonthOfInterval({start, end}),
    hours  : (start, end) => eachHourOfInterval({start, end}),
    days   : (start, end) => eachDayOfInterval({ start, end }),
    minutes: (start, end) => Array.from({ length: Math.abs(differenceInMinutes(start, end)) }, (_, minIndex) => startOfMinute(addMinutes(start, minIndex))),
    seconds: (start, end) => Array.from({ length: Math.abs(differenceInSeconds(start, end)) }, (_, secIndex) => startOfSecond(addSeconds(start, secIndex)))
};

export const label: TickLabelerPreset = {
    years  : (value: Date) => value.getFullYear(),
    months : (value: Date) => value.getMonth() + 1,
    days   : (value: Date) => value.getDate(),
    hours  : (value: Date) => value.getHours(),
    minutes: (value: Date) => value.getMinutes(),
    seconds: (value: Date) => value.getSeconds()
};