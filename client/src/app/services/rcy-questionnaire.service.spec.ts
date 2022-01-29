import { TestBed, inject } from '@angular/core/testing';

import { RCYQuestService } from './rcy-questionnaire.service';

describe('RCYQuestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RCYQuestService]
    });
  });

  it('should be created', inject([RCYQuestService], (service: RCYQuestService) => {
    expect(service).toBeTruthy();
  }));
});
