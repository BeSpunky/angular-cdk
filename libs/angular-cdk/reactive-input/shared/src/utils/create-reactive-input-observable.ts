import { fromEvent, Observable   } from 'rxjs';
import { ElementRef              } from '@angular/core';
import { DocumentRef             } from '@bespunky/angular-zen';
import { useActivationSwitch     } from '@bespunky/rxjs/operators';

import { FeedConfig              } from '../feeds/feed-config';

export function createReactiveInputObservable<TEvent extends unknown>(element: ElementRef | DocumentRef, eventName: string, config?: FeedConfig): Observable<TEvent>
{
    const { activationSwitch } = config || {};
    
    const nativeElement = element instanceof DocumentRef ? element.nativeDocument : element.nativeElement;
    
    let event = fromEvent<TEvent>(nativeElement, eventName);
    
    if (activationSwitch) event = event.pipe(useActivationSwitch(activationSwitch));
    
    return event;
}