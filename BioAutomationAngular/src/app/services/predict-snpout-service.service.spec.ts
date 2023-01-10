import { TestBed } from '@angular/core/testing';

import { PredictSNPOutServiceService } from './predict-snpout-service.service';

describe('PredictSNPOutServiceService', () => {
  let service: PredictSNPOutServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictSNPOutServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
