import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "./service/data/user/user.service";
import {User} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'gym-management-system';
  items: MenuItem[] = [];
  name = '';



  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {

    this.name = this.route.snapshot.params['name'];

    this.items = [
      // all
      {label: 'Strona główna', icon: 'pi pi-fw pi-home', routerLink: ['/home'],},
      {label: 'Grafik', icon: 'pi pi-fw pi-calendar', routerLink: ['/schedule']},
      {label: 'Karnety', icon: 'pi pi-fw pi-wallet', routerLink: ['/ticket-type']},
      {label: 'Zajęcia', icon: 'pi pi-fw pi-list', routerLink: ['/activity']},
      // not logged in
      {label: 'Zaloguj', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'], visible: !this.isUserLoggedIn()},
      {label: 'Zarejestruj', icon: 'pi pi-fw pi-user-plus', routerLink: ['/register'], visible: !this.isUserLoggedIn()},
      // staff
      // {label: 'Klubowicze', icon: 'pi pi-fw pi-users', routerLink: ['/users-list']},
      // {label: 'Plan zajęć', icon: 'pi pi-fw pi-book', routerLink: ['/workout-planner']},
      // logged in
      {label: 'Moje konto', icon: 'pi pi-fw pi-user', routerLink: ['/profile'], visible: this.isUserLoggedIn()},
    ];

    console.log(this.isUserLoggedIn());
  }

  isUserLoggedIn(): boolean {
    return this.userService.isLoggedIn();
}



}
