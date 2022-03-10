import { DatesBetweenGenerator, DayFactor, TickLabeler } from '@bespunky/angular-cdk/timeline/abstraction/ticks';
import { addMinutes, addSeconds, differenceInMinutes, differenceInSeconds, eachDayOfInterval, eachHourOfInterval, startOfMinute, startOfSecond, setHours, differenceInMilliseconds, eachYearOfInterval, eachMonthOfInterval, getDaysInMonth, getDaysInYear, addMilliseconds } from 'date-fns';
import { WellKnownTickId } from './types';
import { divideIntoParts, eachDateOfInterval } from './utils';

export const DayParts = ['Night', 'Morning', 'Noon', 'Evening'] as const;

export const DatesBetween: Record<WellKnownTickId, DatesBetweenGenerator> = {
    years       : (start: Date, end: Date) => eachYearOfInterval({ start, end }),
    months      : (start: Date, end: Date) => eachMonthOfInterval({ start, end}),
    days        : (start: Date, end: Date) => eachDayOfInterval({ start, end }),
    dayParts    : (start: Date, end: Date) => divideIntoParts(eachDayOfInterval({ start, end }), 24, DayParts.length, setHours),
    hours       : (start: Date, end: Date) => eachHourOfInterval({ start, end }),
    minutes     : (start: Date, end: Date) => eachDateOfInterval(start, end, differenceInMinutes, startOfMinute, addMinutes),
    seconds     : (start: Date, end: Date) => eachDateOfInterval(start, end, differenceInSeconds, startOfSecond, addSeconds),
    milliseconds: (start: Date, end: Date) => eachDateOfInterval(start, end, differenceInMilliseconds, startOfSecond, addMilliseconds),
} as const;

export const DayFactors: Record<WellKnownTickId, DayFactor> = {
    years       : getDaysInYear,
    months      : getDaysInMonth,
    days        : 1,
    dayParts    : 1 / 4,
    hours       : 1 / (24),
    minutes     : 1 / (24 * 60),
    seconds     : 1 / (24 * 60 * 60),
    milliseconds: 1 / (24 * 60 * 60 * 1000)
} as const;

export const DefaultLabels: Record<WellKnownTickId, TickLabeler> = {
    years       : (value: Date) => value.getFullYear(),
    months      : (value: Date) => value.getMonth(),
    days        : (value: Date) => value.getDate(),
    dayParts    : (value: Date) => DayParts[Math.floor(value.getHours() / 6)],
    hours       : (value: Date) => value.getHours(),
    minutes     : (value: Date) => value.getMinutes(),
    seconds     : (value: Date) => value.getSeconds(),
    milliseconds: (value: Date) => value.getMilliseconds()
} as const;
