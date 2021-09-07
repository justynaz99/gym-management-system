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

  ngOnInit(): void {
    if (this.userService.currentUserValue) {
      this.router.navigate(['/home']);
      return;
    }
  }

  register() {
    this.userService.register(this.user).subscribe(data => {
      this.router.navigate(['/login']);
    }, error => {
      this.errorMessage = "Użytkownik o takim emailu już istnieje";
      console.log("register error")
    });
  }

}
