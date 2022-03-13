import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {Router} from "@angular/router";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {Observable, Subject} from "rxjs";
import {TicketService} from "../../service/data/ticket/ticket.service";
import {Ticket} from "../../model/ticket";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MustMatch} from "../../helpers/must-match.validator";
import {tick} from "@angular/core/testing";
import {DatePipe} from "@angular/common";
import {TicketType} from "../../model/ticket-type";
import {UserService} from "../../service/data/user/user.service";

@Component({
  selector: 'app-my-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {

  currentUser!: User;
  newPassword!: string;
  newPasswordControl!: string;
  editForm!: FormGroup;
  editPasswordFrom!: FormGroup;
  submitted: boolean = false;
  correctPassword: boolean = true;
  passSubmitted: boolean = false;
  usersRoles: String[] = [];

  messages!: Message[];
  usersTickets!: Ticket[];

  constructor(private userAuthService: UserAuthService,
              private userService: UserService,
              private router: Router,
              private ticketService: TicketService,
              private formBuilder: FormBuilder,
              private config: PrimeNGConfig,
              private messageService: MessageService) {

    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }

    this.findAllUsersTickets(this.currentUser);


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

    this.editPasswordFrom = this.formBuilder.group(
      {
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

    this.findCurrentUser();
  }

  /**
   * method finds current user and pushes it's role's names to string list
   */
  findCurrentUser() {
    if (this.userAuthService.currentUserValue !== null) {
      this.currentUser = this.userAuthService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.usersRoles.push(role.name);
      }
    } else {
      this.usersRoles[0] = 'GUEST';
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.editPasswordFrom.controls;
  }

  /**
   * method to update user from param
   */
  updateUser(user: User) {
    this.submitted = true;

    if (this.editForm.invalid) {
      return
    } else {
      this.userService.updateUser(user.idUser, user)
        .subscribe(data => {
          this.userService.findUserById(this.currentUser.idUser).subscribe(response => {
            console.log(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
          })
          this.showSuccessEditData()
        }, error => {
          this.messages = [
            {severity: 'error', summary: 'Błąd', detail: ''}
          ];
        });
    }

  }

  /**
   * checks if entered password is the same as current password saved in database
   * refers to first field in change password panel
   */
  checkPassword(): Observable<boolean> {
    const result = new Subject<boolean>();
    this.userAuthService.login(this.currentUser).subscribe(data => {
      result.next(true);
      result.complete();
    }, error => {
      result.next(false);
      result.complete();
    })
    return result.asObservable();
  }

  oldPass(event: any) {
    const target = event.target as HTMLInputElement;
    this.currentUser.password = target.value;
  }

  newPass(event: any) {
    const target = event.target as HTMLInputElement;
    this.newPassword = target.value;
  }

  newPass2(event: any) {
    const target = event.target as HTMLInputElement;
    this.newPasswordControl = target.value;
  }

  /**
   * saves new password as user's password if it's entered correctly twice
   */
  changePassword() {
    this.passSubmitted = true;
    this.checkPassword().subscribe(data => {
      if (data) {
        this.correctPassword = true;
        this.currentUser.password = this.newPassword;
        this.userService.changePassword(this.currentUser.idUser, this.currentUser).subscribe(data => {
        })
        this.showSuccessEditPassword();
      } else {
        this.correctPassword = false;

      }
    })
  }

  /**
   * finds all tickets of user from param and assigns response to usersTickets list
   */
  findAllUsersTickets(user: User) {
    this.ticketService.findAllUsersTickets(user.idUser).subscribe(
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
  }

  showSuccessEditData() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane!'})
  }

  showSuccessEditPassword() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano hasło!'})
  }


}


