import { combineLatest, Observable, Subject                               } from 'rxjs';
import { map                                                              } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { TimelineCamera, TimelineConfig                                   } from '@bespunky/angular-cdk/timeline/abstraction';
import { ItemContext                                                      } from '@bespunky/angular-cdk/timeline/abstraction/items';
import { ItemData                                                         } from '@bespunky/angular-cdk/timeline/abstraction/items';
import { TimelineItem                                                     } from '@bespunky/angular-cdk/timeline/abstraction/items';
import { MillisecondsInADay, TimelineLocationService                      } from '@bespunky/angular-cdk/timeline/shared';
import { ViewBounds                                                       } from '@bespunky/angular-cdk/navigables/camera';

@Directive({
    selector: '[bsTimelineItem]',
    exportAs: 'timelineItem'
})
export class TimelineItemDirective extends TimelineItem
{
    @Input() public set bsTimelineItem        (date: Date   ) { this.date.next(date);      }
    @Input() public set bsTimelineItemDuration(value: number) { this.duration.next(value); }

    private date    : Subject<Date>   = new Subject();
    private duration: Subject<number> = new Subject();
    private view    : EmbeddedViewRef<ItemContext | null>;

    static ngTemplateContextGuard(directive: TimelineItemDirective, context: unknown): context is ItemContext { return true; }

    constructor(
        private viewContainer: ViewContainerRef,
        private template     : TemplateRef<ItemContext | null>,
        private camera       : TimelineCamera,
        private config       : TimelineConfig,
        private location     : TimelineLocationService
    )
    {
        super();

        this.view = this.viewContainer.createEmbeddedView(this.template, null);

        this.subscribe(this.contextFeed(), context => this.view.context = context);
    }

    private contextFeed(): Observable<ItemContext>
    {
        const { dayWidth, viewBounds, sizeUnit } = this.camera;

        return combineLatest([dayWidth, viewBounds, sizeUnit, this.date, this.duration]).pipe(
            map(([dayWidth, viewBounds, sizeUnit, date, duration]) => this.createViewContext(dayWidth, viewBounds, sizeUnit, date, duration))
        );
    }

    private createViewContext(dayWidth: number, viewBounds: ViewBounds, sizeUnit: number, date: Date, duration: number): ItemContext
    {
        const isVertical     = this.config.vertical.value;
        const position       = this.location.dateToPosition(dayWidth, date);
        const screenPosition = this.location.toScreenPosition(position, isVertical ? viewBounds.top : viewBounds.left);
        const size           = (duration / MillisecondsInADay) * sizeUnit;
        
        const data = new ItemData(position, screenPosition, size, viewBounds);

        return {
            $implicit     : data,
            bsTimelineItem: data,
            ...data
        };
    }
}
