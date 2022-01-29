import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveRequestCommunicationModalComponent } from './receive-request-communication-modal.component';

describe('ReceiveRequestCommunicationModalComponent', () => {
  let component: ReceiveRequestCommunicationModalComponent;
  let fixture: ComponentFixture<ReceiveRequestCommunicationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveRequestCommunicationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveRequestCommunicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
