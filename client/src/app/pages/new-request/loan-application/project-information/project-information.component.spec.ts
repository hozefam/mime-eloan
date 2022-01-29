import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationProjectInformationComponent } from './project-information.component';

describe('LoanApplicationProjectInformationComponent', () => {
  let component: LoanApplicationProjectInformationComponent;
  let fixture: ComponentFixture<LoanApplicationProjectInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationProjectInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationProjectInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
