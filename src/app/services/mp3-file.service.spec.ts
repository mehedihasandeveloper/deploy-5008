import { TestBed } from '@angular/core/testing';

import { Mp3FileService } from './mp3-file.service';

describe('Mp3FileService', () => {
  let service: Mp3FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mp3FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
