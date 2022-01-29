import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentationLetterComponent } from './representation-letter.component';

describe('RepresentationLetterComponent', () => {
  let component: RepresentationLetterComponent;
  let fixture: ComponentFixture<RepresentationLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentationLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentationLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
