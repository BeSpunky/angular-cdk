import { FeedWithModifiersConfig } from '@bespunky/angular-cdk/reactive-input/shared';
import { MouseButton             } from '../types/mouse-buttons';

export interface MouseDownFeedConfig extends FeedWithModifiersConfig
{
    button: MouseButton | number;
}