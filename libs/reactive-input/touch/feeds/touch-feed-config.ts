import { FeedConfig     } from '@bespunky/angular-cdk/reactive-input/shared';
import { TouchDirection } from '../types/touch-direction';

export interface TouchFeedConfig extends FeedConfig
{
    ignoreMouse?: boolean;
    direction?  : TouchDirection;
}

export type TouchFeedWithRecognizerConfig = Omit<RecognizerOptions, 'direction'> & TouchFeedConfig;
