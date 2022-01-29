import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachQuotModalsComponent } from './machinery-quotation-modals.component';

describe('MachQuotModalsComponent', () => {
  let component: MachQuotModalsComponent;
  let fixture: ComponentFixture<MachQuotModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachQuotModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachQuotModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
