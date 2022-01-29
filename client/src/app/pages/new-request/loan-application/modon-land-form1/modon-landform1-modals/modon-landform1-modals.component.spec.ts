import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLandForm1ModalsComponent } from './modon-landform1-modals.component';

describe('ModalLandForm1ModalsComponent', () => {
  let component: ModalLandForm1ModalsComponent;
  let fixture: ComponentFixture<ModalLandForm1ModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLandForm1ModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLandForm1ModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
