import { ItemData } from './item-data';

export type ItemContext = ItemData & { $implicit: ItemData, bsTimelineItem: ItemData };