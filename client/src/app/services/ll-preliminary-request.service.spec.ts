import { TestBed, inject } from '@angular/core/testing';

import { LlPreliminaryRequestService } from './ll-preliminary-request.service';

describe('LlPreliminaryRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LlPreliminaryRequestService]
    });
  });

  it('should be created', inject([LlPreliminaryRequestService], (service: LlPreliminaryRequestService) => {
    expect(service).toBeTruthy();
  }));
});
