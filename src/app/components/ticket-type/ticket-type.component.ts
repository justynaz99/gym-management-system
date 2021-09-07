import { Component, OnInit } from '@angular/core';
import {TicketTypeDataService} from "../../service/data/ticket-type/ticket-type-data.service";
import {ActivatedRoute, Router} from "@angular/router";

export interface TicketType {
  id: number;
  price: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-ticket-type',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.css']
})
export class TicketTypeComponent implements OnInit {

  // id: number = 1;
  // ticketType : TicketType = {id: this.id, name: '', price: 0, description: ''}

  constructor(
    private ticketTypeService: TicketTypeDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  //   this.id = this.route.snapshot.params['id'];
  //   this.ticketType = {id: this.id, name: '', price: 0, description: ''};
  //
  //   if (this.id != -1) {
  //     this.ticketTypeService.retrieveTicketType(this.id)
  //       .subscribe(
  //         data => this.ticketType = data
  //       )
  //   }
  }

}
