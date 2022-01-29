import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModonLandForm1Component } from './modon-land-form1.component';

describe('ModonLandForm1Component', () => {
  let component: ModonLandForm1Component;
  let fixture: ComponentFixture<ModonLandForm1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModonLandForm1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModonLandForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
