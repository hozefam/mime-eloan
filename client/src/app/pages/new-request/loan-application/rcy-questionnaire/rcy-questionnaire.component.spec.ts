import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcyQuestionnaireComponent } from './rcy-questionnaire.component';

describe('RcyQuestionnaireComponent', () => {
  let component: RcyQuestionnaireComponent;
  let fixture: ComponentFixture<RcyQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcyQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcyQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
