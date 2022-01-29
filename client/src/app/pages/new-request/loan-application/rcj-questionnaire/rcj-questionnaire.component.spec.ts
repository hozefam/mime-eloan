import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationRCJQuestionnaireComponent } from './rcj-questionnaire.component';

describe('LoanApplicationProjectInformationComponent', () => {
  let component: LoanApplicationRCJQuestionnaireComponent;
  let fixture: ComponentFixture<LoanApplicationRCJQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationRCJQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationRCJQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
