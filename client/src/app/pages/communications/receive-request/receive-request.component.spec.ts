import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveRequestComponent } from './receive-request.component';

describe('ReceiveRequestComponent', () => {
  let component: ReceiveRequestComponent;
  let fixture: ComponentFixture<ReceiveRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
