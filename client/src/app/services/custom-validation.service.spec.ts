import { TestBed, inject } from '@angular/core/testing';

import { CustomValidationService } from './custom-validation.service';

describe('CustomValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomValidationService]
    });
  });

  it('should be created', inject([CustomValidationService], (service: CustomValidationService) => {
    expect(service).toBeTruthy();
  }));
});
