import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  message: string = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.message = "";
    if(this.userService.currentUserValue) {
      this.router.navigate(['/profile']);
      return;
    }
  }

  register() {
    this.message = "";
    this.userService.register(this.user).subscribe(data => {
      this.router.navigate(['/login']);
    }, err => {
      this.message = 'Użytkownik o takim emailu już istnieje';
    });
  }

}

