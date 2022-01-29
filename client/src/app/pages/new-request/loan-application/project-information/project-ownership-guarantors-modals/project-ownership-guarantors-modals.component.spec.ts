import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOwnershipGuarantorsModalsComponent } from './project-ownership-guarantors-modals.component';

describe('ProjectOwnershipGuarantorsModalsComponent', () => {
  let component: ProjectOwnershipGuarantorsModalsComponent;
  let fixture: ComponentFixture<ProjectOwnershipGuarantorsModalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectOwnershipGuarantorsModalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOwnershipGuarantorsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
