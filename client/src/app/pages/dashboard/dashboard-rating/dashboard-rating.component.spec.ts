import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRatingComponent } from './dashboard-rating.component';

describe('DashboardRatingComponent', () => {
  let component: DashboardRatingComponent;
  let fixture: ComponentFixture<DashboardRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
