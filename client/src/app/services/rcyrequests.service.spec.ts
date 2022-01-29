import { TestBed, inject } from '@angular/core/testing';

import { RCYRequestsService } from './rcyrequests.service';

describe('RCYRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RCYRequestsService]
    });
  });

  it('should be created', inject([RCYRequestsService], (service: RCYRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
