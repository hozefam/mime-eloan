import { TestBed, inject } from '@angular/core/testing';

import { RCYInfoService } from './rcy-information.service';

describe('RCYInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RCYInfoService]
    });
  });

  it('should be created', inject([RCYInfoService], (service: RCYInfoService) => {
    expect(service).toBeTruthy();
  }));
});
