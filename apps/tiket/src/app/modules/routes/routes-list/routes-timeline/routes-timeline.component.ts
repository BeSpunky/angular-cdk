import { Component, Input } from '@angular/core'
import { eachDayOfInterval, eachHourOfInterval, differenceInMinutes, differenceInSeconds, startOfSecond, startOfMinute, addMinutes, addSeconds, setHours, setMinutes, format } from 'date-fns'

import { AssignedTiketsByTiker } from '../../../../shared/services/routes-coordinator.service'

const DayParts       = ['Night', 'Morning', 'Noon', 'Evening']
const HourPartsCount = 3

function divideIntoParts(dates: Date[], intervalSize: number, partCount: number, setPart: (date: Date, partValue: number) => Date): Date[]
{
    const partPlaceholders = Array.from({ length: partCount })
    const partSize         = intervalSize / partCount

    return dates.reduce<Date[]>((parts, date) => [
        ...parts,
        ...partPlaceholders.map((_, index) => setPart(date, index * partSize))
    ], [])
}
@Component({
    selector   : 'tt-routes-timeline',
    templateUrl: './routes-timeline.component.html',
    styleUrls  : ['./routes-timeline.component.scss']
})
export class RoutesTimelineComponent
{    
    @Input() public assignedTikets: AssignedTiketsByTiker = []

    now = new Date()
    zoom = 122

    public dayFactors = {
        day         : 1,
        dayParts    : 1 / 4,
        hoursInDay  : 1 / (24),
        hourParts   : 1 / (24 * 60 * HourPartsCount),
        minutesInDay: 1 / (24 * 60),
        secondsInDay: 1 / (24 * 60 * 60)
    } as const

    public datesBetween = {
        days     : (start: Date, end: Date) => eachDayOfInterval ({ start, end }),
        dayParts : (start: Date, end: Date) => divideIntoParts(eachDayOfInterval({ start, end }), 24, DayParts.length, setHours),
        hours    : (start: Date, end: Date) => eachHourOfInterval({ start, end }),
        hourParts: (start: Date, end: Date) => divideIntoParts(eachHourOfInterval({ start, end }), 60, HourPartsCount, setMinutes),
        minutes  : (start: Date, end: Date) => Array.from({ length: Math.abs(differenceInMinutes(start, end)) }, (_, minIndex) => startOfMinute(addMinutes(start, minIndex))),
        seconds  : (start: Date, end: Date) => Array.from({ length: Math.abs(differenceInSeconds(start, end)) }, (_, secIndex) => startOfSecond(addSeconds(start, secIndex)))
    } as const
    
    public labels = {
        days     : (value: Date) => value.getDate(),
        dayParts : (value: Date) => DayParts[Math.floor(value.getHours() / 6)],
        hours    : (value: Date) => value.getHours(),
        hourParts: (value: Date) => format(value, 'hh:mm'),
        minutes  : (value: Date) => value.getMinutes(),
        seconds  : (value: Date) => value.getSeconds()
    } as const
}
