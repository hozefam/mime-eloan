import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConditionsComponent } from './service-conditions.component';

describe('ServiceConditionsComponent', () => {
  let component: ServiceConditionsComponent;
  let fixture: ComponentFixture<ServiceConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
