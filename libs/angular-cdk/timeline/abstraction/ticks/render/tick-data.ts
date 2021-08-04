export class TickData
{
    constructor(
        public readonly positionX      : number,
        public readonly positionY      : number,
        public readonly screenPositionX: number,
        public readonly screenPositionY: number,
        public readonly value          : Date,
        public readonly width          : number,
        public readonly label          : string | number
    ) { }
}
