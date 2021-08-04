import { Component, Input } from '@angular/core'

import { DatesBetweenGenerator, DayFactor, TickLabeler } from '@bespunky/angular-cdk/timeline/abstraction/ticks'

function formatPxCssSize(size: number | string): string
{
    return typeof size === 'string' ? size : `${ size }px`;
}

@Component({
    selector   : 'tt-routes-timeline-ticks',
    templateUrl: './routes-timeline-ticks.component.html',
    styleUrls  : ['./routes-timeline-ticks.component.scss']
})
export class RoutesTimelineTicksComponent
{
    @Input() public id     !: string;
    @Input() public minZoom!: number;
    @Input() public maxZoom!: number;

    @Input() public dayFactor   !: DayFactor;
    @Input() public datesBetween!: DatesBetweenGenerator;
    @Input() public label       !: TickLabeler;

    @Input() public top      : number | string = 5;
    @Input() public height   : number | string = 15;
    @Input() public thickness: number | string = 3;
    @Input() public color                      = 'lightgray';
    
    @Input() public labelSize: number | string = 'normal';
    @Input() public labelColor                 = 'darkgray';
    
    public get staticTickStyle()
    {
        return {
            'height'           : formatPxCssSize(this.height),
            'border-left-width': formatPxCssSize(this.thickness),
            'border-left-color': this.color,
        };
    }

    public get staticLabelStyle()
    {
        return {
            'font-size': formatPxCssSize(this.labelSize),
            'color'    : this.labelColor,
        };
    }
    
    public transformedCssPosition(position: number): string
    {
        const top = formatPxCssSize(this.top);

        return `translate(${ position }px, ${ top })`;
    }
}
