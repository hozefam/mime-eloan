import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoObliCertComponent } from './no-obli-cert.component';

describe('NoObliCertComponent', () => {
  let component: NoObliCertComponent;
  let fixture: ComponentFixture<NoObliCertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoObliCertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoObliCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
