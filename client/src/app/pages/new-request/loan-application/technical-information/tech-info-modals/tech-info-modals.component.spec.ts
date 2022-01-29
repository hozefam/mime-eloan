import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechInfoModalsComponent } from './tech-info-modals.component';

describe('TechInfoModalsComponent', () => {
  let component: TechInfoModalsComponent;
  let fixture: ComponentFixture<TechInfoModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechInfoModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechInfoModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
