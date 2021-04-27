import { ViewPort } from './view-port';

export class ViewBounds
{
    public readonly left  : number;
    public readonly top   : number;
    public readonly right : number;
    public readonly bottom: number;

    public readonly width : number;
    public readonly height: number;
    
    public readonly screenCenterX: number;
    public readonly screenCenterY: number;

    constructor(
        public readonly viewPort   : ViewPort,
        public readonly viewCenterX: number,
        public readonly viewCenterY: number,
    )
    {
        this.left   = viewCenterX - viewPort.width  / 2;
        this.top    = viewCenterY - viewPort.height / 2;
        this.width  = viewPort.width;
        this.height = viewPort.height;
        this.right  = this.left + this.width;
        this.bottom = this.top  + this.height;

        this.screenCenterX = viewPort.width  / 2;
        this.screenCenterY = viewPort.height / 2;
    }
}