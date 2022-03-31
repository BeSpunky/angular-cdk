import { TestBed } from '@angular/core/testing';

import { ReactiveKeyboardService } from './reactive-keyboard.service';

describe('ReactiveKeyboardService', () => {
  let service: ReactiveKeyboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactiveKeyboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
