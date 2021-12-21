import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/user";
import {Activity} from "../../model/activity";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message, PrimeNGConfig} from "primeng/api";
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {UserService} from "../../service/data/user/user.service";
import {MustMatch} from "../../helpers/must-match.validator";
import {Table} from "primeng/table";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
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

  constructor(
    private router: Router,
    private userService: UserService,
    private config: PrimeNGConfig,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.findAllUsers();
    this.currentUser = this.userService.currentUserValue;

    this.config.setTranslation({
      "monthNames": ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
    })

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
        phoneNumber: ['', Validators.required],
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

    this.cols = [
      { field: 'vin', header: 'Vin' },
      { field: 'year', header: 'Year' },
      { field: 'brand', header: 'Brand' },
      { field: 'color', header: 'Color' }
    ];

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }




  findAllUsers() {
    this.userService.findAllUsers().subscribe(
      response => {
        this.users = response;
      }
    )
  }

  displayAddNewUserDialog() {
    this.newUserDialog = true;
  }

  closeAddNewUserDialog() {
    this.newUserDialog = false;
  }



  displayDeleteUserDialog(id: number) {
    this.findUserById(id);
    this.deleteUserDialog = true;
  }

  closeDeleteUserDialog() {
    this.deleteUserDialog = false;
  }


  findUserById(id: number) {
    this.userService.findUserById(id).subscribe(response => {
      this.userTemp = response;
      console.log(response);
    })
  }

  addUser() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.userService.register(this.userTemp).subscribe(data => {
        this.closeAddNewUserDialog();
        this.findAllUsers();
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano dane'}]
      }, error => {
        this.usernameTaken = true;
      }
    );
  }

  updateUser(id: number) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.userService.updateUser(id, this.userTemp)
      .subscribe(data => {
        this.findAllUsers();
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane'}]
      })
  }

  deleteUserById(id: number) {
    this.userService.deleteUserById(id).subscribe(response => {
      this.closeDeleteUserDialog();
      this.findAllUsers();
      this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto dane'}]
    })
  }

  navigateToEditUserPage(id: number) {
    this.router.navigate(['/edit-user/' + id]);
  }
}
