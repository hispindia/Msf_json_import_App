/*
    Created By Ahmed Ifhaam
    On 26-02-2018
    
*/

import { TestBed, inject } from '@angular/core/testing';

import { ResponseService } from './response-service.service';

describe('ResponseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponseService]
    });
  });

  it('should be created', inject([ResponseService], (service: ResponseService) => {
    expect(service).toBeTruthy();
  }));
});
