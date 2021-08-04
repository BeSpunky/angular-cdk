import { Component, Input } from '@angular/core'
import { TimelineDirective } from '@bespunky/angular-cdk/timeline'
import { User } from '../../../../../shared/models/user'

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

    public tikerStyle()
    {
        const top = (this.index + 1) * this.height;
        
        return {
            'width'    : `${this.width}px`,
            'height'   : `${this.height}px`,
            'transform': `translateY(${top}px)`,
        }
    }
}
