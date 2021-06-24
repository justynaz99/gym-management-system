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
      {label: 'Strona główna', icon: 'pi pi-fw pi-home'},
      {label: 'Grafik', icon: 'pi pi-fw pi-calendar'},
      {label: 'Karnety', icon: 'pi pi-fw pi-wallet'},
      {label: 'Zajęcia', icon: 'pi pi-fw pi-list'},
      {label: 'Klubowicze', icon: 'pi pi-fw pi-users'},
      {label: 'Plan zajęć', icon: 'pi pi-fw pi-book'}
    ];
  }
}
