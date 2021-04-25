import { FeedConfig     } from '@bespunky/angular-cdk/reactive-input/shared';
import { TouchDirection } from '../types/touch-direction';

export interface TouchFeedConfig extends FeedConfig
{
    direction?: TouchDirection;
}