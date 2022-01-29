import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationTechnicalInformationComponent } from './technical-information.component';

describe('LoanApplicationTechnicalInformationComponent', () => {
  let component: LoanApplicationTechnicalInformationComponent;
  let fixture: ComponentFixture<LoanApplicationTechnicalInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationTechnicalInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationTechnicalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
