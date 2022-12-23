import { TestBed } from '@angular/core/testing';

import { PredictSNPEntryService } from './predict-snpentry.service';

describe('PredictSNPEntryService', () => {
  let service: PredictSNPEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictSNPEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
