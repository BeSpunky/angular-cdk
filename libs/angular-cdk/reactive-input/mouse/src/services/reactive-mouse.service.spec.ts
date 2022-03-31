import { TestBed } from '@angular/core/testing';

import { ReactiveMouseService } from './reactive-mouse.service';

describe('ReactiveMouseService', () => {
  let service: ReactiveMouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactiveMouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
