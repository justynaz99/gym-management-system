import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'gym-management-system';

  items: MenuItem[] = [];


  constructor() { }

  ngOnInit(): void {
    this.items = [
      {label: 'Strona główna', icon: 'pi pi-fw pi-home', routerLink: ['/home']},
      {label: 'Grafik', icon: 'pi pi-fw pi-calendar', routerLink: ['/schedule']},
      {label: 'Karnety', icon: 'pi pi-fw pi-wallet', routerLink: ['/tickets-list']},
      {label: 'Zajęcia', icon: 'pi pi-fw pi-list', routerLink: ['/classes-list']},
      {label: 'Klubowicze', icon: 'pi pi-fw pi-users', routerLink: ['/members-list']},
      {label: 'Plan zajęć', icon: 'pi pi-fw pi-book', routerLink: ['/workout-planner']},
      {label: 'Moje konto', icon: 'pi pi-fw pi-user', routerLink: ['/my-account']},
    ];
  }
}
