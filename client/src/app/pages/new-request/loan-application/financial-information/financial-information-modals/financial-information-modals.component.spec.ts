import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInformationModalsComponent } from './financial-information-modals.component';

describe('FinancialInformationModalsComponent', () => {
  let component: FinancialInformationModalsComponent;
  let fixture: ComponentFixture<FinancialInformationModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialInformationModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInformationModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
