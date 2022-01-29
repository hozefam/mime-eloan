import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModonLandLogisticFormComponent } from './modon-land-logistic-form.component';

describe('ModonLandLogisticFormComponent', () => {
  let component: ModonLandLogisticFormComponent;
  let fixture: ComponentFixture<ModonLandLogisticFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModonLandLogisticFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModonLandLogisticFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
