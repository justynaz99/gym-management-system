import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HardcodedAuthenticationService {

  constructor() { }

  authenticate(email: string, password: string) {
    if (email === 'justynaz@gmail.com' && password === 'aaa') {
      sessionStorage.setItem('authenticatedUser', email);
      return true;
    } else {
      return false;
    }



  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem('authenticatedUser');
    return user !== null;
  }

  logout() {
    sessionStorage.removeItem('authenticatedUser');
  }

}
