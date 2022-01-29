import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HijriCustomComponent } from './hijri-custom.component';

describe('HijriCustomComponent', () => {
  let component: HijriCustomComponent;
  let fixture: ComponentFixture<HijriCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HijriCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HijriCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
