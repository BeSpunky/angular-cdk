import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTimelineTickComponent } from './routes-timeline-tick.component';

describe('RoutesTimelineTickComponent', () => {
  let component: RoutesTimelineTickComponent;
  let fixture: ComponentFixture<RoutesTimelineTickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesTimelineTickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTimelineTickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
