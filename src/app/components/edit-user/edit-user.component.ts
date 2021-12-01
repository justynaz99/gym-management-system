import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message} from "primeng/api";
import {TicketService} from "../../service/data/ticket/ticket.service";
import {Ticket} from "../../model/ticket";
import {TicketType} from "../../model/ticket-type";
import {TicketTypeService} from "../../service/data/ticket-type/ticket-type.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userTemp: User = new User();
  idStr!: string | null;
  id!: number;
  editForm!: FormGroup;
  submitted: boolean = false;
  messages!: Message[];
  usersTickets!: Ticket[];
  addTicketDialog: boolean = false;
  deleteTicketDialog: boolean = false;
  ticketTypes!: TicketType[];
  date!: Date;
  ticket: Ticket = new Ticket();
  selectedTicketType!: TicketType;



  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private ticketService: TicketService,
              private ticketTypeService: TicketTypeService) {

  }

  ngOnInit(): void {

    //get id parameter from url, assign to id
    this.route.paramMap.subscribe(param => {
      if (param.has('id')) {
        this.idStr = param.get('id');
        if (this.idStr !== null) {
          this.id = +this.idStr;
        }
      }
    })

    if (this.id !== null) {
      this.userService.findUserById(this.id).subscribe(response => {
        this.userTemp = response;
      });
    }

    this.findAllUsersTickets();

    this.editForm = new FormGroup(
      {
        firstName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ]),
        lastName: new FormControl('',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ),
        birthDate: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
      });


  }

  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  updateUser() {
    this.submitted = true;

    if (this.editForm.invalid) {
      return
    } else {
      this.userService.updateUser(this.userTemp.idUser, this.userTemp)
        .subscribe(data => {
          this.userService.findUserById(this.userTemp.idUser).subscribe(response => {
            console.log(response);
          })
          this.messages = [
            {severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano dane'},
          ];
        }, error => {
          this.messages = [
            {severity: 'error', summary: 'Błąd', detail: ''}
          ];
        });
    }

  }

  //to get and display all user's tickets from database
  //don't know why I have to find user and assign to userTemp one more time even if it's already done in ngOnInit
  findAllUsersTickets() {

    if (this.id !== null) {
      this.userService.findUserById(this.id).subscribe(response => {
        this.userTemp = response;
        this.ticketService.findAllUsersTickets(this.userTemp.idUser).subscribe(
          response => {
            this.usersTickets = response;
            let date;
            let today = new Date;
            for(let ticket of this.usersTickets) {
              date = new Date(ticket.expirationDate);
              ticket.status = date.getTime() >= today.getTime();
            }
          }
        )
      });
    }
  }



  displayAddTicketDialog() {
    this.findAllTicketTypes();
    this.addTicketDialog = true;
  }

  closeAddTicketDialog() {
    this.addTicketDialog = false;
  }

  displayDeleteTicketDialog(id: number) {
    this.findTicketById(id);
    this.deleteTicketDialog = true;
  }

  closeDeleteTicketDialog() {
    this.deleteTicketDialog = false;
  }

  findTicketById(id: number) {
    this.ticketService.findTicketById(id).subscribe(response => {
      this.ticket = response;
    })
  }


  findAllTicketTypes() {
    this.ticketTypeService.findAllTicketTypes().subscribe(
      response => {
        this.ticketTypes = response;
      }
    )
  }

  addTicket() {
    let today;
    if (this.userService.isLoggedIn()) {

      this.date = new Date();
      this.date.setDate(this.date.getDate() + 30);
      this.ticket.expirationDate = this.date;
      today = new Date();
      this.ticket.status = this.ticket.expirationDate.getTime() > today.getTime();

      this.ticket.idUser = this.userTemp.idUser;
      this.ticket.idClub = 1;
      this.ticket.idNetwork = 1;


      this.ticketService.buyTicket(this.ticket).subscribe(response => {
        this.closeAddTicketDialog();
        this.findAllUsersTickets();
      })

    } else {
      console.log("not logged in");
      this.router.navigate(['/login']);
    }
  }

  deleteTicketById(id: number) {
    this.ticketService.deleteTicketById(id).subscribe(response => {
      this.closeDeleteTicketDialog();
      this.findAllUsersTickets();
      this.messages = [
        {severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto karnet'},
      ];
    })
  }

}

//TODO
//menu użytkownicy

