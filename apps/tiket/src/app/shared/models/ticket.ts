export class Ticket
{
    constructor(
        public readonly code        : number,
        public readonly state       : number,
        public readonly sla         : number,
        public readonly creationDate: Date = new Date(),
    ) { }
}