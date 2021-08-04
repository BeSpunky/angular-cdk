import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTimelineTiketCheckpointComponent } from './routes-timeline-tiket-checkpoint.component';

describe('RoutesTimelineTiketCheckpointComponent', () => {
  let component: RoutesTimelineTiketCheckpointComponent;
  let fixture: ComponentFixture<RoutesTimelineTiketCheckpointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesTimelineTiketCheckpointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTimelineTiketCheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
