import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {User} from "../../model/user";
import {AppComponent} from "../../app.component";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../service/data/user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})

export class LoginComponent implements OnInit {

  user: User = new User();
  errorMessage: string = '';
  currentUser!: User;
  displayResetPasswordDialog: boolean = false;
  form!: FormGroup;
  submitted: boolean = false;
  resetPasswordEmail!: string;
  roles: String[] = [];

  constructor(private userAuthService: UserAuthService,
              private userService: UserService,
              private router: Router,
              private app: AppComponent,
              private messageService: MessageService) {
  }

  ngOnInit() {
    if (this.userAuthService.currentUserValue) {
      this.router.navigate(['/home']);
      return;
    }


    this.form = new FormGroup({
      username: new FormControl('',
        [
          Validators.required,
          Validators.email
        ])
    });

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * method finds current user and pushes it's role's names to string list
   */
  findCurrentUser() {
    if (this.userAuthService.currentUserValue !== null) {
      this.currentUser = this.userAuthService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.roles.push(role.name);
      }
    } else {
      this.roles[0] = 'GUEST';
    }
  }

  /**
   * checks if credentials entered by user are valid
   * if they are ok, set current user field and changes menu items
   */
  login() {
    this.userAuthService.login(this.user).subscribe(data => {
      this.router.navigate(['/home']);
      this.findCurrentUser();
      this.app.loadMenuItems();
      this.showSuccess();
    }, err => {
      this.errorMessage = "Niepoprawny email lub hasło";
    });
  }

  /**
   * sends email with link to page where user can change the password
   * sends it to email from parameter (email named as username)
   * @param username
   */
  sendEmailWithResetPasswordToken(username: String) {
    this.userService.sendResetPasswordToken(username).subscribe(response => {
      this.closeResetPasswordDialog();
      this.showSuccessSendResetPasswordEmail();
    });

  }


  resetPasswordDialog() {
    this.displayResetPasswordDialog = true;
  }

  closeResetPasswordDialog() {
    this.displayResetPasswordDialog = false;
  }

  showSuccess() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Message Content'});
  }

  showSuccessSendResetPasswordEmail() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sukces',
      detail: 'Wysłano email z linkiem do strony ze zmianą hasła!'
    })
  }


}



