import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveRequestCommunication } from './receive-request-communication.component';

describe('ReceiveRequestCommunication', () => {
  let component: ReceiveRequestCommunication;
  let fixture: ComponentFixture<ReceiveRequestCommunication>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveRequestCommunication ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveRequestCommunication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
