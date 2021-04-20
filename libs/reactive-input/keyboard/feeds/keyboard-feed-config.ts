import { Key } from 'ts-key-enum';

import { FeedConfig } from '@bespunky/angular-cdk/reactive-input/shared';

export interface KeyboardFeedConfig extends FeedConfig
{
    key: Key;
}