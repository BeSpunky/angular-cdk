import { Component, Input } from '@angular/core'
import { TimelineDirective } from '@bespunky/angular-cdk/timeline'
import { User } from '../../../../../shared/models/user'
import { formatPxCssSize } from '../_utils/_css-utils'

@Component({
    selector   : 'tt-routes-timeline-tiker',
    templateUrl: './routes-timeline-tiker.component.html',
    styleUrls  : ['./routes-timeline-tiker.component.scss']
})
export class RoutesTimelineTikerComponent
{
    @Input() public tiker!: any     // TODO: Pass User object
    @Input() public index!: number

    @Input() public width  = 50
    @Input() public height = 50

    constructor(public readonly timeline: TimelineDirective) { }

    public get staticTikerStyle()
    {
        const top = (this.index + 1) * this.height;
        
        return {
            'width'    : formatPxCssSize(this.width),
            'height'   : formatPxCssSize(this.height),
            'transform': `translateY(${top}px)`,
        }
    }
}
