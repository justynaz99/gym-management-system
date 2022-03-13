import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/user";
import {Activity} from "../../model/activity";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {MustMatch} from "../../helpers/must-match.validator";
import {Table} from "primeng/table";
import {DatePipe} from "@angular/common";
import {Role} from "../../model/role";
import {UserService} from "../../service/data/user/user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService]
})
export class UserComponent implements OnInit {

  currentUser!: User;
  users!: Array<User>;
  newUserDialog: boolean = false;
  editUserDialog: boolean = false;
  deleteUserDialog: boolean = false;
  userTemp: User = new User();
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  usernameTaken: boolean = false;
  cols!: any[];
  pipe: DatePipe = new DatePipe('pl');

  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private config: PrimeNGConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {

    this.findAllUsersByRoleName("USER");

    this.currentUser = this.userAuthService.currentUserValue;

    this.form = this.formBuilder.group(
      {
        firstName: ['',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        lastName: ['',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20)
          ]
        ],
        username: ['',
          [
            Validators.required,
            Validators.email
          ]
        ],
        birthDate: ['', Validators.required],
        phoneNumber: ['', [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]],
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
    return this.form.controls;
  }



  /**
   * finds all records from User table and assigns it to users list
   */
  findAllUsers() {
    this.userService.findAllUsers().subscribe(
      response => {
        this.users = response;
      }
    )
  }

  /**
   * finds all users with role with name from param
   * @param roleName
   */
  findAllUsersByRoleName(roleName: string) {
    this.userService.findAllUsersByRoleName(roleName).subscribe(response => {
      this.users = response;
    })

  }

  displayAddNewUserDialog() {
    this.newUserDialog = true;
  }

  closeAddNewUserDialog() {
    this.newUserDialog = false;
  }


  closeDeleteUserDialog() {
    this.deleteUserDialog = false;
  }

  /**
   * finds user with id from param and assigns it to userTemp field
   * @param id
   */
  findUserById(id: number) {
    this.userService.findUserById(id).subscribe(response => {
      this.userTemp = response;
      console.log(response);
    })
  }

  /**
   * method enables admin and employee register new user
   */
  addUser() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.userAuthService.register(this.userTemp).subscribe(data => {
        this.closeAddNewUserDialog();
      this.findAllUsersByRoleName("USER");
        this.showSuccessAdd();
      }, error => {
        this.usernameTaken = true;
      }
    );
  }

  /**
   * method enables admin and employee update user data
   * @param id
   */
  updateUser(id: number) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.userService.updateUser(id, this.userTemp)
      .subscribe(data => {
        this.findAllUsersByRoleName("USER");
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane'}]
      })
  }


  navigateToEditUserPage(id: number) {
    this.router.navigate(['/edit-user/' + id]);
  }

  showSuccessAdd() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie dodano użytkownika!'})
  }
}
