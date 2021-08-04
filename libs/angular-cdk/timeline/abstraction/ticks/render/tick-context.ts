import { TickItem } from './tick-item';

export class TickContext
{
    public readonly width!          : number;
    public readonly positionX!      : number;
    public readonly positionY!      : number;
    public readonly screenPositionX!: number;
    public readonly screenPositionY!: number;
    public readonly label!          : string | number;
    public readonly value!          : Date;
    
    constructor(item: TickItem)
    {
        this.update(item);
    }

    public update(item: TickItem)
    {
        Object.assign(this, item);
    }
}

export type TickViewContext = { $implicit: TickContext } & Partial<TickContext>;
