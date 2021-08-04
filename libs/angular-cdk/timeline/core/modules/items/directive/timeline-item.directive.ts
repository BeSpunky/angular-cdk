import { combineLatest, Observable, Subject                               } from 'rxjs';
import { map                                                              } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { ViewBounds                                                       } from '@bespunky/angular-cdk/navigables/camera';
import { TimelineLocationService                                          } from '@bespunky/angular-cdk/timeline/shared';
import { Timeline                                                         } from '@bespunky/angular-cdk/timeline/abstraction';
import { ItemContext                                                      } from '@bespunky/angular-cdk/timeline/abstraction/items';
import { ItemData                                                         } from '@bespunky/angular-cdk/timeline/abstraction/items';
import { TimelineItem                                                     } from '@bespunky/angular-cdk/timeline/abstraction/items';

@Directive({
    selector: '[bsTimelineItem]',
    exportAs: 'timelineItem'
})
export class TimelineItemDirective extends TimelineItem
{
    @Input() public set timelineItem(date: Date) { this.date.next(date); }

    private date: Subject<Date> = new Subject();
    private view: EmbeddedViewRef<ItemContext | null>;

    static ngTemplateContextGuard(directive: TimelineItemDirective, context: unknown): context is ItemContext { return true; }

    constructor(private template: TemplateRef<ItemContext | null>, private viewContainer: ViewContainerRef, private timeline: Timeline, private location: TimelineLocationService)
    {
        super();

        this.view = this.viewContainer.createEmbeddedView(this.template, null);

        this.subscribe(this.contextFeed(), context => this.view.context = context);
    }

    private contextFeed(): Observable<ItemContext>
    {
        const { dayWidth, viewBounds } = this.timeline.camera;

        return combineLatest([dayWidth, viewBounds, this.date]).pipe(
            map(([dayWidth, viewBounds, date]) => this.createViewContext(dayWidth, viewBounds, date))
        );
    }

    private createViewContext(dayWidth: number, viewBounds: ViewBounds, date: Date): ItemContext
    {
        const isVertical     = this.timeline.config.vertical.value;
        const position       = this.location.dateToPosition(dayWidth, date);
        const screenPosition = this.location.toScreenPosition(position, isVertical ? viewBounds.top : viewBounds.left);

        const data = new ItemData(position, screenPosition, viewBounds)

        return {
            $implicit: data,
            bsTimelineItem: data,
            ...data
        };
    }
}
