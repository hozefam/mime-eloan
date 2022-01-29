import { TestBed, inject } from '@angular/core/testing';

import { RCJQuestService } from './rcj-questionnaire.service';

describe('RCJQuestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RCJQuestService]
    });
  });

  it('should be created', inject([RCJQuestService], (service: RCJQuestService) => {
    expect(service).toBeTruthy();
  }));
});
