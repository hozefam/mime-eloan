import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOwnershipModalsComponent } from './project-ownership-modals.component';

describe('ProjectOwnershipModalsComponent', () => {
  let component: ProjectOwnershipModalsComponent;
  let fixture: ComponentFixture<ProjectOwnershipModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectOwnershipModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOwnershipModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
