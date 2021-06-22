import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username : String = 'justynaz99';
  password : String = '';
  errorMessage = 'Invalid credentials';
  invalidLogin = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  handleLogin() {
    if (this.username === 'justynaz99' && this.password === 'aaa') {
      this.router.navigate(['welcome'])
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
    }
  }

}
