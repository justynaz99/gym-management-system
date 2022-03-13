import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {LoginComponent} from "../login/login.component";
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {UserService} from "../../service/data/user/user.service";
import {User} from "../../model/user";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  name = '';
  currentUser!: User;
  roles: String[] = [];


  constructor(private route: ActivatedRoute,
              private messageService: MessageService,
              private primengConfig: PrimeNGConfig,
              private userAuthService: UserAuthService,
              private userService: UserService,
              private router: Router,
              private app: AppComponent,) {
  }

  ngOnInit(): void {
    this.name = this.route.snapshot.params['name'];
    this.primengConfig.ripple = true;

    this.findCurrentUser();

    this.app.loadMenuItems();

  }

  /**
   * method finds current user and pushes it's role's names to string list
   */
  findCurrentUser() {
    if (this.userAuthService.currentUserValue !== null) {
      this.currentUser = this.userAuthService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.roles.push(role.name);
      }
    } else {
      this.roles[0] = 'GUEST';
    }
  }








}
