import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryLoanComponent } from './factory-loan.component';

describe('FactoryLoanComponent', () => {
  let component: FactoryLoanComponent;
  let fixture: ComponentFixture<FactoryLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
