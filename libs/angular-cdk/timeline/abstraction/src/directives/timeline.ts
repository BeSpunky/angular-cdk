import { Observable  } from 'rxjs';
import { Destroyable } from '@bespunky/angular-zen/core';

import { TimelineConfig } from '../services/timeline-config';
import { TimelineCamera } from '../services/timeline-camera';

export abstract class Timeline extends Destroyable
{
    public abstract readonly currentDate: Observable<Date>;
    public abstract readonly config     : TimelineConfig;
    public abstract readonly camera     : TimelineCamera;
}