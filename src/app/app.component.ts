import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute} from "@angular/router";
import {HardcodedAuthenticationService} from "./service/hardcoded-authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'gym-management-system';
  items: MenuItem[] = [];
  name = '';

  constructor(private route: ActivatedRoute, public hardcodedAuthenticationService: HardcodedAuthenticationService) { }

  ngOnInit(): void {

    this.name = this.route.snapshot.params['name'];

    this.items = [
      {label: 'Strona główna', icon: 'pi pi-fw pi-home', routerLink: ['/home'], },
      {label: 'Grafik', icon: 'pi pi-fw pi-calendar', routerLink: ['/schedule']},
      {label: 'Karnety', icon: 'pi pi-fw pi-wallet', routerLink: ['/tickets-list']},
      {label: 'Zajęcia', icon: 'pi pi-fw pi-list', routerLink: ['/activities-list']},
      {label: 'Klubowicze', icon: 'pi pi-fw pi-users', routerLink: ['/members-list']},
      {label: 'Plan zajęć', icon: 'pi pi-fw pi-book', routerLink: ['/workout-planner']},
      {label: 'Zaloguj', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'], styleClass: 'menu-right', visible: !this.hardcodedAuthenticationService.isUserLoggedIn()},
      {label: 'Zarejestruj', icon: 'pi pi-fw pi-user-plus', routerLink: ['/registration'], visible: !this.hardcodedAuthenticationService.isUserLoggedIn()},
      {label: 'Wyloguj', icon: 'pi pi-fw pi-sign-out', routerLink: ['/logout'], visible: this.hardcodedAuthenticationService.isUserLoggedIn()},
      {label: 'Moje konto', icon: 'pi pi-fw pi-user', routerLink: ['/my-account'], visible: !this.hardcodedAuthenticationService.isUserLoggedIn()},
    ];
  }
}
