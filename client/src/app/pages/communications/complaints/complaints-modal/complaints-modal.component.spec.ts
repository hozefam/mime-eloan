import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsModalComponent } from './complaints-modal.component';

describe('ComplaintsModalComponent', () => {
  let component: ComplaintsModalComponent;
  let fixture: ComponentFixture<ComplaintsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
