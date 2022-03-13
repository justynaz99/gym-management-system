import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../model/user";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message, MessageService} from "primeng/api";
import {TicketService} from "../../service/data/ticket/ticket.service";
import {Ticket} from "../../model/ticket";
import {TicketType} from "../../model/ticket-type";
import {TicketTypeService} from "../../service/data/ticket-type/ticket-type.service";
import {RoleService} from "../../service/data/role/role.service";
import {Role} from "../../model/role";
import {UserRoleService} from "../../service/data/user-role/user-role.service";
import {UserRole} from "../../model/user-role";
import {tick} from "@angular/core/testing";
import {DatePipe} from "@angular/common";
import {UserService} from "../../service/data/user/user.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [MessageService]
})
export class EditUserComponent implements OnInit {

  userTemp: User = new User();
  idStr!: string | null;
  id!: number;
  editForm!: FormGroup;
  submitted: boolean = false;
  messagesTickets: Message[] = [];
  usersTickets: Ticket[] = [];
  addTicketDialog: boolean = false;
  deleteTicketDialog: boolean = false;
  ticketTypes!: TicketType[];
  date!: Date;
  ticket: Ticket = new Ticket();
  roles: Role[] = [];
  role!: Role;
  pipe: DatePipe = new DatePipe('pl');
  currentUser!: User;
  currentUserRoles: String[] = [];
  usersRoles: string[] = [];
  roleName!: string;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private userAuthService: UserAuthService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private ticketService: TicketService,
              private ticketTypeService: TicketTypeService,
              private roleService: RoleService,
              private userRoleService: UserRoleService,
              private messageService: MessageService) {

  }

  ngOnInit(): void {

    /**
     * get id parameter from url, assign to id field
     */
    this.route.paramMap.subscribe(param => {
      if (param.has('id')) {
        this.idStr = param.get('id');
        if (this.idStr !== null) {
          this.id = +this.idStr;
        }
      }
    })

    if (this.id !== null) {
      this.findUserById(this.id);
      this.userTemp.roles = [];
    }

    this.findAllUsersTickets();

    this.findAllRoles();

    this.findCurrentUser();

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
        role: new FormControl('', Validators.required),
      });


  }

  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  /**
   * method finds current user and pushes it's role's names to string list
   */
  findCurrentUser () {
    if (this.userAuthService.currentUserValue !== null) {
      this.currentUser = this.userAuthService.currentUserValue;
      console.log(this.currentUser)

      for (let role of this.currentUser.roles) {
        this.currentUserRoles.push(role.name);
      }
    }
    else {
      this.currentUserRoles[0] = 'GUEST';
    }
  }


  /**
   * method to update user from param
   */
  updateUser(user: User) {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    } else {
      console.log(this.userTemp)
      this.userService.updateUser(user.idUser, user).subscribe(data => {
          this.userService.findUserById(user.idUser).subscribe(response => {
          })
          this.showSuccessEdit();
        });
    }
  }

  /**
   * method to find user with id from param
   * @param id
   */
  findUserById(id: number) {
    this.userService.findUserById(id).subscribe(response => {
      this.userTemp = response;
      this.findRoles(this.userTemp);
    });
  }

  findRoles(user: User) {
    for (let role of user.roles) {
      this.usersRoles.push(role.name);
    }
  }


  /**
   * method finds user with id from url
   * then finds all tickets of this user to display then in user's tickets panel
   */
  findAllUsersTickets() {
    if (this.id !== null) {
      this.userService.findUserById(this.id).subscribe(response => {
        this.userTemp = response;
        this.ticketService.findAllUsersTickets(this.userTemp.idUser).subscribe(
          response => {
            this.usersTickets = response;
            let date;
            let today = new Date;
            /**
             * checks ticket status according to today's date
             */
            for (let ticket of this.usersTickets) {
              date = new Date(ticket.expirationDate);
              ticket.status = date.getTime() >= today.getTime();
            }
          }
        )
      });
    }
  }

  /**
   * method finds all records from Role table and assign response to roles list
   */
  findAllRoles() {
    this.roleService.findAllRoles().subscribe(response => {
      this.roles = response;
      console.log(response)
    })
  }

  /**
   * method finds ticket with id from param and assign it to ticket field
   * @param id
   */
  findTicketById(id: number) {
    this.ticketService.findTicketById(id).subscribe(response => {
      this.ticket = response;
    })
  }

  /**
   * method finds all records from TicketType table and assign response to ticketTypes list
   */
  findAllTicketTypes() {
    this.ticketTypeService.findAllTicketTypes().subscribe(
      response => {
        this.ticketTypes = response;
      }
    )
  }


  displayAddTicketDialog() {
    this.ticket = new Ticket();
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


  /**
   * method to add new ticket for user by staff or admin
   *
   */
  addTicket() {
    let today;
    let date;
    /**
     * checks if user current user is logged in and if his role is STAFF or ADMIN
     */
    if (this.userAuthService.isLoggedIn() && ((this.currentUserRoles.includes("STAFF") || this.currentUserRoles.includes("ADMIN")))) {

      this.ticket.idUser = this.userTemp.idUser;
      this.ticket.idClub = 1;
      this.ticket.idNetwork = 1;

      this.ticketService.buyTicket(this.ticket).subscribe(response => {
        /**
         * set ticketName field in case ticketType would be deleted
         */
        response.ticketName = response.membershipTicketType.name;
        /**
         * set expiration date adding duration of ticket type to activation date (chosen by staff or admin)
         * set ticket status checking if expiration date is greater than today
         */
        date = new Date(response.activationDate);
        date.setDate(date.getDate() + 30);
        response.expirationDate = date;
        today = new Date();
        response.status = response.expirationDate.getTime() > today.getTime();
        this.ticketService.updateTicket(response).subscribe(response => {
          this.closeAddTicketDialog();
          this.findAllUsersTickets();
          this.showSuccessAddTicket();
        })

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
      this.messagesTickets = [
        {severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto karnet'},
      ];
    })
  }

  showSuccessEdit() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane użytkownika!'})
  }

  showSuccessAddTicket() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie dodano karnet!'})
  }


}

