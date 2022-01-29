import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RCYRequestsComponent } from './rcy-requests.component';

describe('RCYRequestsComponent', () => {
  let component: RCYRequestsComponent;
  let fixture: ComponentFixture<RCYRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RCYRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RCYRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
