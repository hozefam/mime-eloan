import { TestBed, inject } from '@angular/core/testing';

import { Form5Service } from './form5.service';

describe('Form5Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Form5Service]
    });
  });

  it('should be created', inject([Form5Service], (service: Form5Service) => {
    expect(service).toBeTruthy();
  }));
});
