import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {UserAuthService} from "./service/data/user-auth/user-auth.service";
import {User} from "./model/user";
import {Role} from "./model/role";
import {find} from "rxjs/operators";
import {RoleService} from "./service/data/role/role.service";

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
  admin!: Role;
  staff! : Role;
  user!: Role;



  constructor(private route: ActivatedRoute, private userService: UserAuthService, private router: Router, private roleService: RoleService) {
  }

  ngOnInit(): void {

    this.loadMenuItems();

    this.name = this.route.snapshot.params['name'];


  }

  findCurrentUser() {
    if (this.userService.currentUserValue !== null) {
      this.currentUser = this.userService.currentUserValue;
      this.roles = [];

      for (let role of this.currentUser.roles) {
        this.roles.push(role.name);
      }
    } else {
      this.roles[0] = 'GUEST';
    }
  }


  loadMenuItems() {

    this.findCurrentUser();
    console.log(this.currentUser)

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
      {label: 'Klubowicze', icon: 'pi pi-fw pi-users', routerLink: ['/user'], visible: (this.isUserLoggedInAndAdmin() || this.isUserLoggedInAndStaff())},
      {label: 'Pracownicy', icon: 'pi pi-fw pi-users', routerLink: ['/staff'], visible: (this.isUserLoggedInAndAdmin())},
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
    console.log(this.roles)
    return this.userService.isLoggedIn();
  }

  isUserLoggedInAndAdmin(): boolean {
    return this.userService.isLoggedIn() && this.roles.includes("ADMIN");
  }

  isUserLoggedInAndStaff(): boolean {
    return this.userService.isLoggedIn() && this.roles.includes("STAFF");
  }


  logout() {
    this.userService.logOut().subscribe(data => {
      this.findCurrentUser();
      this.loadMenuItems();
      this.router.navigate(['/login']);
    });

  }




}
