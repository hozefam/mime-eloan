import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBorrowCertComponent } from './no-borrow-cert.component';

describe('NoBorrowCertComponent', () => {
  let component: NoBorrowCertComponent;
  let fixture: ComponentFixture<NoBorrowCertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoBorrowCertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoBorrowCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
