import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcyInvesterinformationComponent } from './rcy-investerinformation.component';

describe('RcyInvesterinformationComponent', () => {
  let component: RcyInvesterinformationComponent;
  let fixture: ComponentFixture<RcyInvesterinformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcyInvesterinformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcyInvesterinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
