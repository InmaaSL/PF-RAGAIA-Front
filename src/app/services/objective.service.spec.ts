/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ObjectiveService } from './objective.service';

describe('Service: Objective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectiveService]
    });
  });

  it('should ...', inject([ObjectiveService], (service: ObjectiveService) => {
    expect(service).toBeTruthy();
  }));
});
