import {Component, OnInit} from '@angular/core';
import {TicketTypeService} from "../../service/data/ticket-type/ticket-type.service";
import {Router} from "@angular/router";
import {TicketType} from "../../model/ticket-type";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {User} from "../../model/user";
import {DialogModule} from 'primeng/dialog';
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ticket} from "../../model/ticket";
import {Observable} from "rxjs";
import {Role} from "../../model/role";
import {TicketService} from "../../service/data/ticket/ticket.service";


@Component({
  selector: 'app-tickets-list',
  templateUrl: './ticket-type.component.html',
  styleUrls: ['./ticket-type.component.css'],
  providers: [MessageService]
})
export class TicketTypeComponent implements OnInit {


  ticketTypes!: Array<TicketType>;
  currentUser!: User;
  newTicketTypeDialog: boolean = false;
  editTicketTypeDialog: boolean = false;
  deleteTicketTypeDialog: boolean = false;
  buyTicketDialog: boolean = false;
  ticketTypeTemp: TicketType = new TicketType();
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  ticket: Ticket = new Ticket();
  roles: String[] = [];
  usersTickets!: Ticket[];

  constructor(
    private ticketTypeService: TicketTypeService,
    private router: Router,
    private userService: UserAuthService,
    private primengConfig: PrimeNGConfig,
    private ticketService: TicketService,
    private messageService: MessageService
  ) {
  }


  ngOnInit(): void {

    this.findCurrentUser();

    this.findAllTicketTypes();

    this.primengConfig.ripple = true;

    this.form = new FormGroup({
      name: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),
      description: new FormControl('',
        [
          Validators.maxLength(255)
        ]),
      price: new FormControl('',
        [
          Validators.required,
          Validators.pattern(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)
        ])
    });
  }

  /**
   * method finds current user and pushes it's role's names to string list
   */
  findCurrentUser() {
    if (this.userService.currentUserValue !== null) {
      this.currentUser = this.userService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.roles.push(role.name);
      }
    } else {
      this.roles[0] = 'GUEST';
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * finds all records from TicketType table and assigns it to ticketTypes list
   */
  findAllTicketTypes() {
    this.ticketTypeService.findAllTicketTypes().subscribe(
      response => {
        this.ticketTypes = response;
      }
    )
  }

  displayNewTicketTypeDialog() {
    this.ticketTypeTemp = new TicketType();
    this.submitted = false;
    this.newTicketTypeDialog = true;
  }

  closeNewTicketTypeDialog() {
    this.newTicketTypeDialog = false;
  }

  displayEditTicketTypeDialog(id: number) {
    this.ticketTypeTemp = new TicketType();
    this.submitted = false;
    this.findTicketTypeById(id);
    this.editTicketTypeDialog = true;
  }

  closeEditTicketTypeDialog() {
    this.editTicketTypeDialog = false;
  }

  displayDeleteTicketTypeDialog(id: number) {
    this.findTicketTypeById(id);
    this.deleteTicketTypeDialog = true;
  }

  closeDeleteTicketTypeDialog() {
    this.deleteTicketTypeDialog = false;
  }

  displayBuyTicketDialog(id: number) {
    this.findTicketTypeById(id);
    this.buyTicketDialog = true;
  }

  closeBuyTicketDialog() {
    this.buyTicketDialog = false;
  }

  /**
   * finds ticket type with id from param and assigns it to ticketTypeTemp field
   * @param id
   */
  findTicketTypeById(id: number) {
    this.ticketTypeService.findTicketTypeById(id).subscribe(response => {
      this.ticketTypeTemp = response;
    })
  }

  /**
   * saves new ticket type to list
   */
  addTicketType() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.ticketTypeService.addTicketType(this.ticketTypeTemp).subscribe(data => {
        this.closeNewTicketTypeDialog();
        this.findAllTicketTypes();
        this.showSuccessAdd()
      }, error => {
      }
    );
  }

  /**
   * updates ticket type with id from param
   * @param id
   */
  updateTicketType(id: number) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.ticketTypeService.updateTicketType(id, this.ticketTypeTemp)
      .subscribe(data => {
        this.closeEditTicketTypeDialog();
        this.findAllTicketTypes();
        this.showSuccessEdit()
      }, error => {
      });
  }

  /**
   * deletes ticket type with id from param
   * @param id
   */
  deleteTicketTypeById(id: number) {
    this.ticketTypeService.deleteTicketTypeById(id).subscribe(response => {
      this.closeDeleteTicketTypeDialog();
      this.findAllTicketTypes();
      this.showSuccessDelete();
    })
  }


  /**
   * saves new ticket record with specific type
   * @param id
   */
  buyTicket(id: number) {
    let activationDate;
    let expirationDate;
    if (this.userService.isLoggedIn()) {

      activationDate = new Date();
      expirationDate = new Date();
      expirationDate.setDate(activationDate.getDate() + 30);
      this.ticket.activationDate = activationDate;
      this.ticket.expirationDate = expirationDate;
      this.ticket.idUser = this.currentUser.idUser;
      this.ticket.idClub = 1;
      this.ticket.idNetwork = 1;
      this.ticketTypeService.findTicketTypeById(id).subscribe(response => {
        this.ticketTypeTemp = response;
      })
      this.ticket.membershipTicketType = this.ticketTypeTemp;

      this.ticketService.findAllUsersTickets(this.currentUser.idUser).subscribe(
        response => {
          /**
           * if user doesn't have any tickets yet he can buy new ticket
           */
          if (response.length === 0) {
            this.ticketService.buyTicket(this.ticket).subscribe(response => {
              response.ticketName = response.membershipTicketType.name;
              this.ticketService.updateTicket(response).subscribe(response => {
                this.closeBuyTicketDialog();
                this.showSuccessBuy();
              })
            })
          } else {
            /**
             * else it needs to be checked if this user has active ticket or not
             */
            let date;
            let today = new Date;
            for (let ticket of response) {
              date = new Date(ticket.expirationDate);
              /**
               * if he has he ca;t buy another one
               */
              if (date.getTime() >= today.getTime()) {
                this.closeBuyTicketDialog();
                this.showErrorBuy();
                return;
                /**
                 * if he hasn't he can buy ticket
                 */
              } else {
                this.ticketService.buyTicket(this.ticket).subscribe(response => {
                  this.closeBuyTicketDialog();
                  this.showSuccessBuy()
                })
              }
            }
          }

        }
      )
    } else {
      console.log("not logged in");
      this.router.navigate(['/login']);
    }
  }

  showSuccessBuy() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Kupiłeś nowy karnet!'})
  }

  showErrorBuy() {
    this.messageService.add({severity: 'error', summary: 'Błąd', detail: 'Posiadasz już aktywny karnet'})
  }

  showSuccessAdd() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie dodano karnet!'})
  }

  showSuccessEdit() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano karnet!'})
  }

  showSuccessDelete() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto karnet!'})
  }


}


