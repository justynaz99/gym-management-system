import { TestBed } from '@angular/core/testing';

import { MemberDataService } from './member-data.service';

describe('UserDataService', () => {
  let service: MemberDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
