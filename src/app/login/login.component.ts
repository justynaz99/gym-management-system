import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {HardcodedAuthenticationService} from "../service/hardcoded-authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  email : string = 'justynaz@gmail.com';
  password : string = '';
  name: string = 'Justyna';
  invalidLogin = false;

  constructor(private router: Router, private messageService: MessageService, private hardcodedAuthenticationService: HardcodedAuthenticationService) { }

  ngOnInit(): void {
  }

  handleLogin() {

    if (this.hardcodedAuthenticationService.authenticate(this.email, this.password)) {
      // window.location.reload();
      this.router.navigate(['home', this.name]);
      this.invalidLogin = false;
    } else {
      this.invalidLogin = true;
      this.messageService.add({key: 'key1', severity:'error', summary: 'Błąd', detail: 'Message Content'});
    }

  }

  showSuccess() {
    this.messageService.add({key: 'key1', severity:'success', summary: 'Success', detail: 'Message Content'});
  }

}
