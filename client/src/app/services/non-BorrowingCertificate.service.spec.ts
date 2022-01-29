import { TestBed, inject } from '@angular/core/testing';

import { nonBorrowingCertificateService } from './non-BorrowingCertificate.service';

describe('nonBorrowingCertificateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [nonBorrowingCertificateService],
    });
  });

  it('should be created', inject([nonBorrowingCertificateService], (service: nonBorrowingCertificateService) => {
    expect(service).toBeTruthy();
  }));
});
