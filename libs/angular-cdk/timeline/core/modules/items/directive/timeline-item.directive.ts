import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Timeline } from '@bespunky/angular-cdk/timeline/abstraction';
import { TimelineItem } from '@bespunky/angular-cdk/timeline/abstraction/items/timeline-item';

@Directive({
    selector: '[bsTimelineItem]',
    exportAs: 'timelineItem'
})
export class TimelineItemDirective extends TimelineItem
{
    constructor(private template: TemplateRef<any>, private viewContainer: ViewContainerRef, private timeline: Timeline)
    {
        super();

        this.viewContainer.createEmbeddedView(this.template,)
    }
}
