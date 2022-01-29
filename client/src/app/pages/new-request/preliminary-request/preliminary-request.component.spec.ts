import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryRequestComponent } from './preliminary-request.component';

describe('PreliminaryRequestComponent', () => {
  let component: PreliminaryRequestComponent;
  let fixture: ComponentFixture<PreliminaryRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreliminaryRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminaryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
