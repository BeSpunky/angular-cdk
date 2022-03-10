export function divideIntoParts(dates: Date[], intervalSize: number, partCount: number, setPart: (date: Date, partValue: number) => Date): Date[]
{
    const partPlaceholders = Array.from({ length: partCount })
    const partSize         = intervalSize / partCount

    return dates.reduce<Date[]>((parts, date) => [
        ...parts,
        ...partPlaceholders.map((_, index) => setPart(date, index * partSize))
    ], [])
}

export function eachDateOfInterval(start: Date, end: Date, differenceIn: (start: Date, end: Date) => number, startOf: (date: Date) => Date, add: (date: Date, amount: number) => Date): Date[]
{
    return Array.from({ length: Math.abs(differenceIn(start, end)) }, (_, unitIndex) => startOf(add(start, unitIndex)));
}
