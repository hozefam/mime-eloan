import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcyActionComponent } from './rcy-action.component';

describe('RcyActionComponent', () => {
  let component: RcyActionComponent;
  let fixture: ComponentFixture<RcyActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcyActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
