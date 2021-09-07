import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTypeListComponent } from './ticket-type-list.component';

describe('TicketsListComponent', () => {
  let component: TicketTypeListComponent;
  let fixture: ComponentFixture<TicketTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
