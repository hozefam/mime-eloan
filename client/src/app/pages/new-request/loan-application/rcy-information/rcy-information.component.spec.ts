import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcyInformationComponent } from './rcy-information.component';

describe('RcyInformationComponent', () => {
  let component: RcyInformationComponent;
  let fixture: ComponentFixture<RcyInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcyInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
