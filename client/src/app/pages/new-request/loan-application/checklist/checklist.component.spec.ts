import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationChecklistComponent } from './checklist.component';

describe('LoanApplicationChecklistComponent', () => {
  let component: LoanApplicationChecklistComponent;
  let fixture: ComponentFixture<LoanApplicationChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
