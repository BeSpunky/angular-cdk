import { FeedConfig } from '@bespunky/angular-cdk/reactive-input/shared';

export interface MouseWheelFeedConfig extends FeedConfig
{
    direction?: 'deltaX' | 'deltaY';
}