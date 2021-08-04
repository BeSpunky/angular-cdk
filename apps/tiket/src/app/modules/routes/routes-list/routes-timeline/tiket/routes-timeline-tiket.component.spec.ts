import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTimelineTiketComponent } from './routes-timeline-tiket.component';

describe('RoutesTimelineTiketComponent', () => {
  let component: RoutesTimelineTiketComponent;
  let fixture: ComponentFixture<RoutesTimelineTiketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesTimelineTiketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTimelineTiketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
