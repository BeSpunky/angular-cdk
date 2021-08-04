import { Component, Input } from '@angular/core'

import { DatesBetweenGenerator, DayFactor, TickLabeler } from '@bespunky/angular-cdk/timeline/abstraction/ticks'
import { eachDayOfInterval } from 'date-fns';

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

    @Input() public top: number | string = 5;
    @Input() public height: number | string = 5;
    @Input() public thickness: number | string = 3;
    @Input() public color = 'lightgray';
    
    @Input() public labelSize: number | string = 'normal';
    @Input() public labelColor = 'darkgray';
    
    public get staticTickStyle()
    {
        return {
            height: this.height,
            borderLeftWidth: this.thickness,
            borderLeftColor: this.color,
        };
    }

    public get staticLabelStyle()
    {
        return {
            fontSize: this.labelSize,
            fontColor: this.labelColor,
        };
    }
    public asd(start: Date, end: Date)
    {
        return eachDayOfInterval({ start, end });
    }
    public transformedCssPosition(position: number): string
    {
        const top = typeof this.top === 'string' ? this.top : `${ this.top }px`;

        return `translate(${ position }px, ${ top })`;
    }
}
