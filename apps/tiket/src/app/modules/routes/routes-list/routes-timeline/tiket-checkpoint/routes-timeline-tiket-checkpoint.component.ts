import { Component, Input } from '@angular/core'

import { ITiketCheckpoint } from '../../../models/tiket-checkpoint.interface'

@Component({
    selector   : 'tt-routes-timeline-tiket-checkpoint',
    templateUrl: './routes-timeline-tiket-checkpoint.component.html',
    styleUrls  : ['./routes-timeline-tiket-checkpoint.component.scss']
})
export class RoutesTimelineTiketCheckpointComponent
{
    @Input() public checkpoint!: ITiketCheckpoint
    @Input() public tikerIndex!: number

    @Input() public height = 50

    // Receiving `left` from template as it is created by the `*bsTimelineItem` directive
    public checkpointStyle(left: number)
    {
        const top = (this.tikerIndex + 1) * this.height

        return {
            'transform': `translate(${left}px, ${top}px)`
        }
    }
}
