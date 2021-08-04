import { Component, Input                              } from '@angular/core'
import { DatesBetweenGenerator, DayFactor, TickLabeler } from '@bespunky/angular-cdk/timeline/abstraction/ticks'

import { formatPxCssSize                               } from '../_utils/_css-utils'

@Component({
    selector   : 'tt-routes-timeline-ticks',
    templateUrl: './routes-timeline-ticks.component.html',
    styleUrls  : ['./routes-timeline-ticks.component.scss']
})
export class RoutesTimelineTicksComponent
{
    @Input() public id     !: string
    @Input() public minZoom!: number
    @Input() public maxZoom!: number

    @Input() public dayFactor   !: DayFactor
    @Input() public datesBetween!: DatesBetweenGenerator
    @Input() public label       !: TickLabeler

    @Input() public top      : number | string = 5
    @Input() public height   : number | string = 15
    @Input() public thickness: number | string = 3
    @Input() public color                      = 'lightgray'
    
    @Input() public labelSize: number | string = 'normal'
    @Input() public labelColor                 = 'darkgray'
    
    public tickStyle(position: number)
    {
        const top = formatPxCssSize(this.top)

        return {
            'height'           : formatPxCssSize(this.height),
            'border-left-width': formatPxCssSize(this.thickness),
            'border-left-color': this.color,
            'transform'        : `translate(${ position }px, ${ top })`
        }
    }

    public labelStyle()
    {
        return {
            'font-size': formatPxCssSize(this.labelSize),
            'color'    : this.labelColor,
        }
    }
}
