import { ViewBounds } from '@bespunky/angular-cdk/navigables/camera';

export class ItemData
{
    constructor(
        public readonly position      : number,
        public readonly screenPosition: number,
        public readonly size          : number,
        public readonly viewBounds    : ViewBounds,
        public readonly sizeUnit      : number
    ) { }
}