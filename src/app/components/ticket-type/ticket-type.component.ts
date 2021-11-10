import {Component, OnInit} from '@angular/core';
import {TicketTypeService} from "../../service/data/ticket-type/ticket-type.service";
import {Router} from "@angular/router";
import {TicketType} from "../../model/ticket-type";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";
import {DialogModule} from 'primeng/dialog';
import {Message, PrimeNGConfig} from "primeng/api";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ticket} from "../../model/ticket";
import {Observable} from "rxjs";


@Component({
  selector: 'app-tickets-list',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.css']
})
export class TicketTypeComponent implements OnInit {


  ticketTypes!: Array<TicketType>;
  currentUser!: User;
  displayNewTicketTypeDialog: boolean = false;
  displayEditTicketTypeDialog: boolean = false;
  displayDeleteTicketTypeDialog: boolean = false;
  displayBuyTicketDialog: boolean = false;
  ticketTypeTemp: TicketType = new TicketType();
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  ticket: Ticket = new Ticket();
  date!: Date;

  constructor(
    private ticketTypeService: TicketTypeService,
    private router: Router,
    private userService: UserService,
    private primengConfig: PrimeNGConfig
  ) {
  }


  ngOnInit(): void {

    if (this.userService.currentUserValue !== null)
      this.currentUser = this.userService.currentUserValue;
    else
      this.currentUser = new User();

    console.log(this.currentUser.roles[0].name)


    this.findAllTicketTypes();
    this.primengConfig.ripple = true;

    this.form = new FormGroup({
      name: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),
      description: new FormControl(''),
      price: new FormControl('',
        [
          Validators.required,
          Validators.pattern(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)
        ])
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  findAllTicketTypes() {
    this.ticketTypeService.findAllTicketTypes().subscribe(
      response => {
        this.ticketTypes = response;
      }
    )
  }




  addNewTicketTypeDialog() {
    this.displayNewTicketTypeDialog = true;
  }

  closeNewTicketTypeDialog() {
    this.displayNewTicketTypeDialog = false;
  }

  editTicketTypeDialog(id: number) {
    this.findTicketTypeById(id);
    this.displayEditTicketTypeDialog = true;
  }

  closeEditTicketTypeDialog() {
    this.displayEditTicketTypeDialog = false;
  }

  deleteTicketTypeDialog(id: number) {
    this.findTicketTypeById(id);
    this.displayDeleteTicketTypeDialog = true;
  }

  closeDeleteTicketTypeDialog() {
    this.displayDeleteTicketTypeDialog = false;
  }

  buyTicketDialog(id: number) {
    this.findTicketTypeById(id);
    this.displayBuyTicketDialog = true;
  }

  closeBuyTicketDialog() {
    this.displayBuyTicketDialog = false;
  }


  findTicketTypeById(id: number) {
    this.ticketTypeService.findTicketTypeById(id).subscribe(response => {
      this.ticketTypeTemp = response;
    })
  }

  addTicketType() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.ticketTypeService.addTicketType(this.ticketTypeTemp).subscribe(data => {
        this.closeNewTicketTypeDialog();
        this.findAllTicketTypes();
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano dane'}]
      }, error => {
      }
    );
  }

  updateTicketType(id: number) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.ticketTypeService.updateTicketType(id, this.ticketTypeTemp)
      .subscribe(data => {
        this.closeEditTicketTypeDialog();
        this.findAllTicketTypes();
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane'}]
      }, error => {
      });
  }

  deleteTicketTypeById(id: number) {
    this.ticketTypeService.deleteTicketTypeById(id).subscribe(response => {
      this.closeDeleteTicketTypeDialog();
      this.findAllTicketTypes();
      this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto dane'}]
    })
  }

  buyTicket(id: number) {
    if (this.userService.isLoggedIn()) {
      this.date = new Date();
      this.ticket.activationDate = this.date;
      // this.ticket.expirationDate = this.date.setDate(this.date.getDate() + 30);
      this.ticket.idUser = this.currentUser.idUser;
      this.ticket.idClub = 1;
      this.ticket.idNetwork = 1;
      this.ticketTypeService.findTicketTypeById(id).subscribe(response => {
        this.ticketTypeTemp = response;
      })
      console.log(this.ticketTypeTemp);
      this.ticket.membershipTicketType = this.ticketTypeTemp;
      console.log(this.ticket);
      this.ticketTypeService.buyTicket(this.ticket, id).subscribe(response => {
        this.closeBuyTicketDialog();
      })
    } else {
      console.log("not logged in");
      this.router.navigate(['/login']);
    }
  }


}


