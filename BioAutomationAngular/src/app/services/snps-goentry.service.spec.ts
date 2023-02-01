import { TestBed } from '@angular/core/testing';

import { SnpsGOEntryService } from './snps-goentry.service';

describe('SnpsGOEntryService', () => {
  let service: SnpsGOEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnpsGOEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
