import { Component, OnInit } from '@angular/core';
import {TicketTypeService} from "../../service/data/ticket-type/ticket-type.service";
import {Router} from "@angular/router";
import {TicketType} from "../../model/ticket-type";
import {UserService} from "../../service/data/user/user.service";


@Component({
  selector: 'app-tickets-list',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.css']
})
export class TicketTypeComponent implements OnInit {


  constructor(
    private ticketTypeService: TicketTypeService,
    private router: Router,
    private userService: UserService
  ) { }

  ticketTypes!: Array<TicketType>;

  ngOnInit(): void {
    this.findAllTicketTypes();
  }

  findAllTicketTypes() {
    this.ticketTypeService.findAllTicketTypes().subscribe(
      response => {
        this.ticketTypes = response;
      }
    )
  }

  buyTicket() {
    if (this.userService.isLoggedIn()) {
      console.log("logged in");
      // redirect to payment page
    } else {
      console.log("not logged in");
      this.router.navigate(['/login']);
    }
  }


}


