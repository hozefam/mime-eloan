import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModonLandForm2Component } from './modon-land-form2.component';

describe('ModonLandForm2Component', () => {
  let component: ModonLandForm2Component;
  let fixture: ComponentFixture<ModonLandForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModonLandForm2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModonLandForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
