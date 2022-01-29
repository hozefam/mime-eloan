import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCommentsComponent } from './common-comments.component';

describe('CommonCommentsComponent', () => {
  let component: CommonCommentsComponent;
  let fixture: ComponentFixture<CommonCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonCommentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});