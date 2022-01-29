import { TestBed, inject } from '@angular/core/testing';

import { ProjInfoService } from './project-information.service';

describe('ProjInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjInfoService]
    });
  });

  it('should be created', inject([ProjInfoService], (service: ProjInfoService) => {
    expect(service).toBeTruthy();
  }));
});
