import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingInformationModalsComponent } from './marketing-information-modals.component';

describe('MarketingInformationModalsForm', () => {
  let component: MarketingInformationModalsComponent;
  let fixture: ComponentFixture<MarketingInformationModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingInformationModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingInformationModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
