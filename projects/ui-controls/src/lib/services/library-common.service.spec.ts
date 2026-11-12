import { TestBed } from '@angular/core/testing';

import { LibraryCommonService } from './library-common.service';

describe('LibraryCommonService', () => {
  let service: LibraryCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
