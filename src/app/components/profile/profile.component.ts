import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Router} from "@angular/router";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {Observable, Subject} from "rxjs";
import {TicketService} from "../../service/data/ticket/ticket.service";
import {Ticket} from "../../model/ticket";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MustMatch} from "../../helpers/must-match.validator";
import {tick} from "@angular/core/testing";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-my-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
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

  messages!: Message[];
  passMessages!: Message[];
  usersTickets!: Ticket[];

  constructor(private userService: UserService,
              private router: Router,
              private ticketService: TicketService,
              private formBuilder: FormBuilder,
              private config: PrimeNGConfig) {

    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
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
  }

  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.editPasswordFrom.controls;
  }

  updateUser() {
    this.submitted = true;

    if (this.editForm.invalid) {
      return
    } else {
      this.userService.updateUser(this.currentUser.idUser, this.currentUser)
        .subscribe(data => {
          this.userService.findUserById(this.currentUser.idUser).subscribe(response => {
            console.log(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
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

  checkPassword(): Observable<boolean> {
    const result = new Subject<boolean>();
    this.userService.login(this.currentUser).subscribe(data => {
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

  changePassword() {
    this.passSubmitted = true;
    this.checkPassword().subscribe(data => {
      if (data) {
        this.correctPassword = true;
        console.log("correct pass")
        this.currentUser.password = this.newPassword;
        this.userService.changePassword(this.currentUser.idUser, this.currentUser).subscribe(data => {
        })
        this.passMessages = [
          {severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano dane'},
        ];
      } else {
        this.correctPassword = false;

      }
    })
  }

  findAllUsersTickets() {
    this.ticketService.findAllUsersTickets(this.currentUser.idUser).subscribe(
      response => {
        this.usersTickets = response;
        let date;
        let today = new Date;
        for(let ticket of this.usersTickets) {
          date = new Date(ticket.expirationDate);
          ticket.status = date.getTime() >= today.getTime();
        }
        console.log(response)
      }
    )
  }




}


