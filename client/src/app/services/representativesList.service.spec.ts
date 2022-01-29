import { TestBed, inject } from '@angular/core/testing';

import { RepresentativesListService } from './representativesList.service';

describe('MyLoansService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepresentativesListService],
    });
  });

  it('should be created', inject([RepresentativesListService], (service: RepresentativesListService) => {
    expect(service).toBeTruthy();
  }));
});
