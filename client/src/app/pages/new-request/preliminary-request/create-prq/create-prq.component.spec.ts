import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrqComponent } from './create-prq.component';

describe('CreatePrqComponent', () => {
  let component: CreatePrqComponent;
  let fixture: ComponentFixture<CreatePrqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePrqComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
