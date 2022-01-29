import { TestBed, inject } from '@angular/core/testing';

import { UserRequestStatisticService } from './user-request-statistic.service';

describe('UserRequestStatisticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRequestStatisticService]
    });
  });

  it('should be created', inject([UserRequestStatisticService], (service: UserRequestStatisticService) => {
    expect(service).toBeTruthy();
  }));
});
