import { TestBed, inject } from '@angular/core/testing';

import { CustomerProfileService } from './customer-profile.service';

describe('CustomerProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerProfileService]
    });
  });

  it('should be created', inject([CustomerProfileService], (service: CustomerProfileService) => {
    expect(service).toBeTruthy();
  }));
});
