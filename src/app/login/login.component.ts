import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Message, MessageService} from "primeng/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  email : String = 'justynaz@gmail.com';
  password : String = '';
  invalidLogin = false;

  constructor(private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  handleLogin() {
    if (this.email === 'justynaz@gmail.com' && this.password === 'aaa') {
      this.router.navigate(['home'])
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
