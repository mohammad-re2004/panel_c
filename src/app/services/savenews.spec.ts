import { TestBed } from '@angular/core/testing';

import { Savenews } from './savenews';

describe('Savenews', () => {
  let service: Savenews;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Savenews);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
