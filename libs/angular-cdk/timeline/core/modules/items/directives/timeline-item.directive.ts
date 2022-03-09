import { combineLatest, Observable, Subject                               } from 'rxjs';
import { map, startWith                                                   } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { TimelineCamera, TimelineConfig      } from '@bespunky/angular-cdk/timeline/abstraction';
import { ItemContext, ItemData, TimelineItem } from '@bespunky/angular-cdk/timeline/abstraction/items';
import { MillisecondsInADay                  } from '@bespunky/angular-cdk/timeline/shared';
import { ViewBounds                          } from '@bespunky/angular-cdk/navigables/camera';

@Directive({
    selector: '[bsTimelineItem]',
    exportAs: 'timelineItem'
})
export class TimelineItemDirective extends TimelineItem
{
    // Empty string is what Angular passes-in when no value is assiged to the directive via microsyntax. This enables an optional
    // date value and allows *bsTimelineItem to be used simply to export context values
    @Input() public set bsTimelineItem        (date: Date | '') { this.date.next(date || new Date()); }
    @Input() public set bsTimelineItemDuration(value: number  ) { this.duration.next(value); }

    private date    : Subject<Date>   = new Subject();
    private duration: Subject<number> = new Subject();
    private view    : EmbeddedViewRef<ItemContext | null>;

    static ngTemplateContextGuard(directive: TimelineItemDirective, context: unknown): context is ItemContext { return true; }

    constructor(
        private viewContainer: ViewContainerRef,
        private template     : TemplateRef<ItemContext | null>,
        private camera       : TimelineCamera,
        private config       : TimelineConfig
    )
    {
        super();

        this.view = this.viewContainer.createEmbeddedView(this.template, null);

        this.subscribe(this.contextFeed(), context => this.view.context = context);
    }

    private contextFeed(): Observable<ItemContext>
    {
        // Allow combineLatest to emit with an optional date and/or duration
        const date                     = this.date    .pipe(startWith(new Date()));
        const duration                 = this.duration.pipe(startWith(0));
        const { viewBounds, sizeUnit } = this.camera;
        
        return combineLatest([date, duration, viewBounds, sizeUnit]).pipe(
            map(([date, duration, viewBounds, sizeUnit]) => this.createViewContext(date, duration, viewBounds, sizeUnit))
        );
    }

    private createViewContext(date: Date, duration: number, viewBounds: ViewBounds, sizeUnit: number): ItemContext
    {
        const isVertical     = this.config.vertical.value;
        const position       = this.camera.dateToPosition(date);
        const screenPosition = this.camera.toScreenPosition(position, isVertical ? viewBounds.top : viewBounds.left);
        const size           = (duration / MillisecondsInADay) * sizeUnit;
        
        const data = new ItemData(position, screenPosition, size, viewBounds, sizeUnit);

        return {
            $implicit     : data,
            bsTimelineItem: data,
            ...data
        };
    }
}
