import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {User} from "../../model/user";
import {UserAuthService} from "../data/user-auth/user-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  currentUser!: User;
  constructor(private router: Router, private userService: UserAuthService) {
    this.userService.currentUser.subscribe(data => {
      this.currentUser = data;
    });
  }

  /**
   * @name canActivate
   * @param route
   * @param state
   * checks if user is logged in and his roles
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.currentUser) {
      if(route.data.roles && route.data.roles.indexOf(this.currentUser.roles[0].name) === -1){
        this.router.navigate(['/401']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
