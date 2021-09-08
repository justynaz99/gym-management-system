import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'gym-management-system';
  items: MenuItem[] = [];
  name = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.name = this.route.snapshot.params['name'];

    this.items = [
      {label: 'Strona główna', icon: 'pi pi-fw pi-home', routerLink: ['/home'], },
      {label: 'Grafik', icon: 'pi pi-fw pi-calendar', routerLink: ['/schedule']},
      {label: 'Karnety', icon: 'pi pi-fw pi-wallet', routerLink: ['/ticket-type-list']},
      // {label: 'Zajęcia', icon: 'pi pi-fw pi-list', routerLink: ['/activities-list']},
      // {label: 'Klubowicze', icon: 'pi pi-fw pi-users', routerLink: ['/users-list']},
      // {label: 'Plan zajęć', icon: 'pi pi-fw pi-book', routerLink: ['/workout-planner']},
      {label: 'Zaloguj', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login']},
      {label: 'Zarejestruj', icon: 'pi pi-fw pi-user-plus', routerLink: ['/register']},
      {label: 'Moje konto', icon: 'pi pi-fw pi-user', routerLink: ['/profile']},
      {label: 'Wyloguj', icon: 'pi pi-fw pi-sign-out', routerLink: ['/logout']},
    ];
  }
}
