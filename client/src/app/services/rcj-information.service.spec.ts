import { TestBed, inject } from '@angular/core/testing';

import { RCJInfoService } from './rcj-information.service';

describe('RCJInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RCJInfoService]
    });
  });

  it('should be created', inject([RCJInfoService], (service: RCJInfoService) => {
    expect(service).toBeTruthy();
  }));
});
