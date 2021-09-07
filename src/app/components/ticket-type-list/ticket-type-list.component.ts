import { Component, OnInit } from '@angular/core';
import {TicketTypeDataService} from "../../service/data/ticket-type/ticket-type-data.service";
import {Router} from "@angular/router";
import {TicketType} from "../ticket-type/ticket-type.component";


@Component({
  selector: 'app-tickets-list',
  templateUrl: './ticket-type-list.component.html',
  styleUrls: ['./ticket-type-list.component.css']
})
export class TicketTypeListComponent implements OnInit {


  constructor(
    private ticketTypeService: TicketTypeDataService,
    private router: Router
  ) { }

  ticketTypes: TicketType[] = [];

  ngOnInit(): void {
    this.refreshTicketTypesList();
  }

  refreshTicketTypesList() {
    this.ticketTypeService.retrieveAllTicketTypes().subscribe(
      response => {
        this.ticketTypes = response;
      }
    )
  }

}


