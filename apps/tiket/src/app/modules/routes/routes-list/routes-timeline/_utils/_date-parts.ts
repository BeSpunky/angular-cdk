export function divideIntoParts(dates: Date[], intervalSize: number, partCount: number, setPart: (date: Date, partValue: number) => Date): Date[]
{
    const partPlaceholders = Array.from({ length: partCount })
    const partSize         = intervalSize / partCount

    return dates.reduce<Date[]>((parts, date) => [
        ...parts,
        ...partPlaceholders.map((_, index) => setPart(date, index * partSize))
    ], [])
}