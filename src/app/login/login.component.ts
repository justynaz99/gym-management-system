import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";
import {HardcodedAuthenticationService} from "../service/hardcoded-authentication.service";
import {BasicAuthenticationService} from "../service/basic-authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  email : string = 'justynaz99';
  password : string = 'aaa';
  name: string = 'Justyna';
  invalidLogin = false;

  constructor(private router: Router, private messageService: MessageService,
              private hardcodedAuthenticationService: HardcodedAuthenticationService,
              private basicAuthenticationService: BasicAuthenticationService) { }

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

  handleBasicAuthLogin() {

    this.basicAuthenticationService.executeAuthenticationService(this.email, this.password)
      .subscribe(
        data => {
          console.log(data);
          this.invalidLogin = false;
          // this.router.navigate(['home', this.name]);
          window.location.reload();
          this.invalidLogin = false;

        },
        error => {
          console.log(error);
          this.invalidLogin = true;
        }
      )

    if (!this.invalidLogin) {
      this.router.navigate(['home', this.name]);
    }

  }

  handleJWTAuthLogin() {

    this.basicAuthenticationService.executeJWTAuthenticationService(this.email, this.password)
      .subscribe(
        data => {
          console.log(data);
          this.invalidLogin = false;
          console.log(this.invalidLogin);
          window.location.reload();
        },
        error => {
          console.log(error);
          this.invalidLogin = true;
          console.log(this.invalidLogin);
        }
      )



  }

  showSuccess() {
    this.messageService.add({key: 'key1', severity:'success', summary: 'Success', detail: 'Message Content'});
  }

}
