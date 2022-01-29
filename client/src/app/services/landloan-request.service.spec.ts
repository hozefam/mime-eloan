import { TestBed, inject } from '@angular/core/testing';

import { LandloanRequestService } from './landloan-request.service';

describe('LandloanRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandloanRequestService]
    });
  });

  it('should be created', inject([LandloanRequestService], (service: LandloanRequestService) => {
    expect(service).toBeTruthy();
  }));
});
