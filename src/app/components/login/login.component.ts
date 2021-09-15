import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  user: User = new User();
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if(this.userService.currentUserValue) {
      this.router.navigate(['/home']);
      return;
    }
  }

  login() {
    this.userService.login(this.user).subscribe(data => {
      this.router.navigate(['/home']);
      window.location.reload();
    }, err => {
      this.errorMessage = "Niepoprawny email lub hasło";
    });
  }

}
