import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryRequestModalsComponent } from './preliminary-request-modals.component';

describe('PreliminaryRequestModalsComponent', () => {
  let component: PreliminaryRequestModalsComponent;
  let fixture: ComponentFixture<PreliminaryRequestModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreliminaryRequestModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminaryRequestModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
