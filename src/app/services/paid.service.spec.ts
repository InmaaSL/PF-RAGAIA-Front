/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaidService } from './paid.service';

describe('Service: Paid', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaidService]
    });
  });

  it('should ...', inject([PaidService], (service: PaidService) => {
    expect(service).toBeTruthy();
  }));
});
