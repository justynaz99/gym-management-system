import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./service/data/user/user.service";
import {User} from "./model/user";
import {Role} from "./model/role";
import {find} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'gym-management-system';
  items: MenuItem[] = [];
  name = '';
  currentUser!: User;
  roles: String[] = [];


  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {

    console.log("Zalogowano")

    this.currentUser = this.userService.currentUserValue;

    this.findRoles();

    this.loadMenuItems();

    this.name = this.route.snapshot.params['name'];

  }

  findRoles () {
    if (this.userService.currentUserValue !== null) {
      this.currentUser = this.userService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.roles.push(role.name);
      }
    }
    else {
      this.roles[0] = 'GUEST';
    }
  }


  loadMenuItems() {

    this.items = [
      // all
      {label: 'Strona główna', icon: 'pi pi-fw pi-home', routerLink: ['/home']},
      {label: 'Grafik', icon: 'pi pi-fw pi-calendar', routerLink: ['/schedule']},
      {label: 'Karnety', icon: 'pi pi-fw pi-wallet', routerLink: ['/ticket-type']},
      {label: 'Zajęcia', icon: 'pi pi-fw pi-list', routerLink: ['/activity']},
      // not logged in
      {label: 'Zaloguj', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login'], visible: !this.isUserLoggedIn()},
      {label: 'Zarejestruj', icon: 'pi pi-fw pi-user-plus', routerLink: ['/register'], visible: !this.isUserLoggedIn()},
      // staff
      {label: 'Użytkownicy', icon: 'pi pi-fw pi-users', routerLink: ['/user'], visible: (this.isUserLoggedIn() && (this.roles.includes('ADMIN')) || this.roles.includes('STAFF'))},
      // {label: 'Plan zajęć', icon: 'pi pi-fw pi-book', routerLink: ['/workout-planner']},
      // logged in
      {
        label: 'Moje konto', icon: 'pi pi-fw pi-user', visible: this.isUserLoggedIn(),
        items: [
          {label: 'Moje dane', icon: 'pi pi-fw pi-user', routerLink: ['/profile']},
          {
            label: 'Wyloguj', icon: 'pi pi-fw pi-power-off', command: (event: Event) => {
              this.logout()
            }
          }
        ]
      },

    ];
  }



  isUserLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  logout() {
    this.userService.logOut().subscribe(data => {
      this.findRoles();
      this.loadMenuItems();
      this.router.navigate(['/login']);
    });

  }




}
