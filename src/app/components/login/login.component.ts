import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {UserAuthenticationService} from "../../service/data/user-authentication/user-authentication.service";
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

  constructor(private userAuthService: UserAuthenticationService,
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

  login() {
    this.userAuthService.login(this.user).subscribe(data => {
      this.router.navigate(['/home']);
      this.currentUser = this.userAuthService.currentUserValue;
      this.app.loadMenuItems();
      this.showSuccess();
    }, err => {
      this.errorMessage = "Niepoprawny email lub hasło";
    });
  }

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
