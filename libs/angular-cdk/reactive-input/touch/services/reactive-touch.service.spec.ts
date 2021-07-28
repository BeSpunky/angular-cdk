import { TestBed } from '@angular/core/testing';

import { ReactiveTouchService } from './reactive-touch.service';

describe('ReactiveTouchService', () => {
  let service: ReactiveTouchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactiveTouchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
