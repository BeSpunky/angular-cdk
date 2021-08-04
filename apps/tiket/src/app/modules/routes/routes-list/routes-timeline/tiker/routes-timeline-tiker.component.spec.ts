import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesTimelineTikerComponent } from './routes-timeline-tiker.component';

describe('RoutesTimelineTikerComponent', () => {
  let component: RoutesTimelineTikerComponent;
  let fixture: ComponentFixture<RoutesTimelineTikerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesTimelineTikerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesTimelineTikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
