import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  ticketUser1 = {
    name: 'student',
    purchaseDay: '01.06.2021',
    expirationDay: '01.07.2021',
  }

  ticketsUser : TicketUser[] = [this.ticketUser1];

  constructor() { }

  ngOnInit(): void {
  }

}

export interface TicketUser {
  name: string;
  purchaseDay: string;
  expirationDay: string;
}
