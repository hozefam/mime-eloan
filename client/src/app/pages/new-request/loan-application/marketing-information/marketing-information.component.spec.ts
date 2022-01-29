import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationMarketingInformationComponent } from './marketing-information.component';

describe('LoanApplicationMarketingInformationComponent', () => {
  let component: LoanApplicationMarketingInformationComponent;
  let fixture: ComponentFixture<LoanApplicationMarketingInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationMarketingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationMarketingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
