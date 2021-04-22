import { BehaviorSubject } from 'rxjs';

import { TickItem } from './tick-item';

export class TickContext
{
    public readonly width          : BehaviorSubject<number>;
    public readonly positionX      : BehaviorSubject<number>;
    public readonly positionY      : BehaviorSubject<number>;
    public readonly screenPositionX: BehaviorSubject<number>;
    public readonly screenPositionY: BehaviorSubject<number>;
    public readonly label          : BehaviorSubject<string | number>;
    public readonly value          : BehaviorSubject<Date>;
    
    constructor(item: TickItem)
    {
        this.positionX       = new BehaviorSubject(item.positionX      );
        this.positionY       = new BehaviorSubject(item.positionY      );
        this.screenPositionX = new BehaviorSubject(item.screenPositionX);
        this.screenPositionY = new BehaviorSubject(item.screenPositionY);
        this.value           = new BehaviorSubject(item.value          );
        this.width           = new BehaviorSubject(item.width          );
        this.label           = new BehaviorSubject(item.label          );
    }

    public update(item: TickItem)
    {
        this.positionX      .next(item.positionX      );
        this.positionY      .next(item.positionY      );
        this.screenPositionY.next(item.screenPositionY);
        this.screenPositionX.next(item.screenPositionX);
        this.value          .next(item.value          );
        this.width          .next(item.width          );
        this.label          .next(item.label          );
    }
}

export type TickViewContext = { $implicit: TickContext } & Partial<TickContext>;
