import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAreaLoginComponent } from './login.component';

describe('AdminAreaLoginComponent', () => {
  let component: AdminAreaLoginComponent;
  let fixture: ComponentFixture<AdminAreaLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAreaLoginComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAreaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
