import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  errorMessage!: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if(this.userService.currentUserValue) {
      this.router.navigate(['/profile']);
      return;
    }
  }

  register() {
    this.userService.register(this.user).subscribe(data => {
      this.router.navigate(['/login']);
    }, err => {
      this.errorMessage = "Użytkownik o takim emailu już istnieje";
    });
  }

}

