import { Component, Input } from '@angular/core'
import { ViewBounds } from '@bespunky/angular-cdk/navigables/camera'
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

    public tikerStyle(viewBounds: ViewBounds)
    {
        const top = (this.index + 1) * this.height - viewBounds.viewCenterY;
        
        return {
            'width'    : `${this.width}px`,
            'height'   : `${this.height}px`,
            'transform': `translateY(${top}px)`,
        }
    }
}
