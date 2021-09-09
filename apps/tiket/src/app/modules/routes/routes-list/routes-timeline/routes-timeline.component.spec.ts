import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTimelineComponent } from './routes-timeline.component';

describe('RoutesTimelineComponent', () => {
  let component: RoutesTimelineComponent;
  let fixture: ComponentFixture<RoutesTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
