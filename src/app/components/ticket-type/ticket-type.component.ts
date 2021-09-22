import { Component, OnInit } from '@angular/core';
import {TicketTypeService} from "../../service/data/ticket-type/ticket-type.service";
import {Router} from "@angular/router";
import {TicketType} from "../../model/ticket-type";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";
import {DialogModule} from 'primeng/dialog';
import {PrimeNGConfig} from "primeng/api";


@Component({
  selector: 'app-tickets-list',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.css']
})
export class TicketTypeComponent implements OnInit {


  ticketTypes!: Array<TicketType>;
  currentUser!: User;
  displayNewTicketDialog: boolean = false;
  displayEditTicketDialog: boolean = false;
  displayDeleteTicketDialog: boolean = false;
  ticketTypeTemp: TicketType = new TicketType();

  constructor(
    private ticketTypeService: TicketTypeService,
    private router: Router,
    private userService: UserService,
    private primengConfig: PrimeNGConfig
  ) { }


  ngOnInit(): void {
    this.findAllTicketTypes();
    this.currentUser = this.userService.currentUserValue;
    console.log(this.currentUser.role);
    this.primengConfig.ripple = true;
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

  addNewTicketDialog() {
    this.displayNewTicketDialog = true;
  }

  addTicketType() {
    this.ticketTypeService.addTicketType(this.ticketTypeTemp).subscribe(data => {
        console.log("Dodano");
        window.location.reload();
    }, error => {
      console.log("Błąd");
      }
    );
  }

  updateTicketType(id: number) {
    this.ticketTypeService.updateTicketType(id, this.ticketTypeTemp)
      .subscribe(data => {
        window.location.reload();
      })
  }

  findTicketTypeById(id: number) {
    this.ticketTypeService.findTicketTypeById(id).subscribe(response => {
      this.ticketTypeTemp = response;
    })
  }

  editTicketDialog(id: number) {
    this.findTicketTypeById(id);
    this.displayEditTicketDialog = true;
  }

  deleteTicketTypeById(id: number) {
    this.ticketTypeService.deleteTicketTypeById(id).subscribe(response => {
      console.log(response);
      window.location.reload();
    })
  }

  deleteTicketDialog(id: number) {
    this.findTicketTypeById(id);
    this.displayDeleteTicketDialog = true;
  }






}


