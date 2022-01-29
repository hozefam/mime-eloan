import { TestBed, inject } from '@angular/core/testing';

import { FactoryLoanService } from './factory-loan.service';

describe('FactoryLoanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactoryLoanService]
    });
  });

  it('should be created', inject([FactoryLoanService], (service: FactoryLoanService) => {
    expect(service).toBeTruthy();
  }));
});
