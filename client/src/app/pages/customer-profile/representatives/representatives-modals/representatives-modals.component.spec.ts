import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativesModalsComponent } from './representatives-modals.component';

describe('RepresentativesModalsComponent', () => {
  let component: RepresentativesModalsComponent;
  let fixture: ComponentFixture<RepresentativesModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentativesModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentativesModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
