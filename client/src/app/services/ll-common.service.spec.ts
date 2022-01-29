import { TestBed, inject } from '@angular/core/testing';

import { LLCommonService } from './ll-common.service';

describe('LLCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LLCommonService]
    });
  });

  it('should be created', inject([LLCommonService], (service: LLCommonService) => {
    expect(service).toBeTruthy();
  }));
});
