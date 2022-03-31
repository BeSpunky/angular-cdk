import { Key } from 'ts-key-enum';

import { FeedWithModifiersConfig } from '@bespunky/angular-cdk/reactive-input/shared';

export interface KeyboardFeedConfig extends FeedWithModifiersConfig
{
    key: Key;
}