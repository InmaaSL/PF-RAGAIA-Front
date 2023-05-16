import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApiConnectService } from './api-connect.service';

describe('ApiConnectService', () => {
  let service: ApiConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
