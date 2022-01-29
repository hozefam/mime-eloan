import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationRCJInformationComponent } from './rcj-information.component';

describe('LoanApplicationProjectInformationComponent', () => {
  let component: LoanApplicationRCJInformationComponent;
  let fixture: ComponentFixture<LoanApplicationRCJInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanApplicationRCJInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanApplicationRCJInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
