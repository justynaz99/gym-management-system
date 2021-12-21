import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";
import {AppComponent} from "../../app.component";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

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

  constructor(private userService: UserService, private router: Router, private app: AppComponent, private messageService: MessageService) { }

  ngOnInit() {
    if(this.userService.currentUserValue) {
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
    this.userService.login(this.user).subscribe(data => {
      this.router.navigate(['/home']);
      this.currentUser = this.userService.currentUserValue;
      this.app.loadMenuItems();
      this.showSuccess();
    }, err => {
      this.errorMessage = "Niepoprawny email lub hasło";
    });
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
  }

  resetPasswordDialog() {
    this.displayResetPasswordDialog = true;
  }

  closeResetPasswordDialog() {
    this.displayResetPasswordDialog = false;
  }

}
