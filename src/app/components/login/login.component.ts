import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";
import {AppComponent} from "../../app.component";

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

  constructor(private userService: UserService, private router: Router, private app: AppComponent) { }

  ngOnInit() {
    if(this.userService.currentUserValue) {
      this.router.navigate(['/home']);
      return;
    }
  }

  login() {
    this.userService.login(this.user).subscribe(data => {
      this.router.navigate(['/home']);
      this.currentUser = this.userService.currentUserValue;
      this.app.loadMenuItems();
    }, err => {
      this.errorMessage = "Niepoprawny email lub hasło";
    });
  }

}
