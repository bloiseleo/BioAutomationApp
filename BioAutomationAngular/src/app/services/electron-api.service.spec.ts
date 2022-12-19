import { TestBed } from '@angular/core/testing';

import { ElectronAPIService } from './electron-api.service';

describe('ElectronAPIService', () => {
  let service: ElectronAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
