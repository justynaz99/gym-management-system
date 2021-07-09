import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css']
})
export class TicketsListComponent implements OnInit {

  ticket1: Ticket = {
    name: 'Dzienny',
    price: 199,
    duration: '30 dni',
    description: 'wejście na zajęcia bez ograniczeń'
  }
  ticket2: Ticket = {
    name: 'Student',
    price: 129,
    duration: '30 dni',
    description: 'wejście na zajęcia bez ograniczeń'
  }
  tickets : Ticket[] = [this.ticket1, this.ticket2];

  constructor() { }

  ngOnInit(): void {
  }

}

export interface Ticket {
  name: string;
  price: number;
  duration: string;
  description: string;
}
