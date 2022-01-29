import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationFinancialInformationComponent } from './financial-information.component';

describe('LoanApplicationFinancialInformationComponent', () => {
  let component: LoanApplicationFinancialInformationComponent;
  let fixture: ComponentFixture<LoanApplicationFinancialInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationFinancialInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationFinancialInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
