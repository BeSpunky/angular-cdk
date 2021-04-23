import { FeedWithModifiersConfig } from '@bespunky/angular-cdk/reactive-input/shared';

export interface MouseWheelFeedConfig extends FeedWithModifiersConfig
{
    direction?: 'deltaX' | 'deltaY';
}