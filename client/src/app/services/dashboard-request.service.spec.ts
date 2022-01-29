import { TestBed, inject } from '@angular/core/testing';

import { DashboardRequestService } from './dashboard-request.service';

describe('DashboardRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardRequestService]
    });
  });

  it('should be created', inject([DashboardRequestService], (service: DashboardRequestService) => {
    expect(service).toBeTruthy();
  }));
});
