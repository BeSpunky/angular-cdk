import { fromEvent, Observable         } from 'rxjs';
import { JQueryStyleEventEmitter       } from 'rxjs/internal/observable/fromEvent';
import { ElementRef                    } from '@angular/core';
import { DocumentRef                   } from '@bespunky/angular-zen';

import { useActivationSwitch           } from '@bespunky/angular-cdk/shared';
import { TouchEventName                } from '../types/touch-event';
import { TouchDirectionCodes           } from '../types/touch-direction';
import { TouchFeedWithRecognizerConfig } from '../feeds/touch-feed-config';

export function createReactiveTouchInputObservable<TEvent extends HammerInput>(element: ElementRef | DocumentRef, eventName: TouchEventName, recognizerName: string, config?: TouchFeedWithRecognizerConfig): Observable<TEvent>
{
    const { activationSwitch } = config || {};
    
    const nativeElement = element instanceof DocumentRef ? element.nativeDocument : element.nativeElement;
    
    const hammer            = new Hammer(nativeElement);
    const eventTarget       = hammer as unknown as JQueryStyleEventEmitter;
    const recognizer        = hammer.get(recognizerName);

    recognizer.set(extractNativeRecognizerOptions(config))
    
    let event = fromEvent<TEvent>(eventTarget, eventName);
    
    if (activationSwitch) event = event.pipe(useActivationSwitch(activationSwitch));

    return event;
}

function extractNativeRecognizerOptions(config?: TouchFeedWithRecognizerConfig): RecognizerOptions
{
    // activationSwitch is decounstructed even though not used to exclude it when deconstruction `...nativeRecognizerOptions`.
    // Ignoring lint:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { activationSwitch, direction, ...nativeRecognizerOptions } = config || {};

    const options = nativeRecognizerOptions as RecognizerOptions;

    if (direction) options.direction = TouchDirectionCodes[direction];
    
    return options;
}