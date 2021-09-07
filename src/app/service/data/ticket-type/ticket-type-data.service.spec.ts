import { TestBed } from '@angular/core/testing';

import { TicketTypeDataService } from './ticket-type-data.service';

describe('TicketDataService', () => {
  let service: TicketTypeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketTypeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
