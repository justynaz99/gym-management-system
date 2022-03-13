import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../../model/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Activity} from "../../../model/activity";
import {Role} from "../../../model/role";

let API_URL = "http://localhost:8080/api/user-auth/"

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User> (JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * @name login
   * @param user
   * method creates token from entered username and password and sends request to find user with those values,
   * if found, save this user in local storage as current user
   */
  login(user: User): Observable<any> {
    const headers = new HttpHeaders(user ? {
      authorization:'Basic ' + btoa(user.username + ':' + user.password)
    }:{});

    return this.http.get<any> (API_URL + "login", {headers:headers}).pipe(
      map(response => {
        if(response) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
        return response;
      })
    );
  }

  /**
   * @name logOut
   * method sends request to logout user and remove him from local storage
   */
  logOut(): Observable<any> {
    return this.http.post(API_URL + "logout", {}).pipe(
      map(response => {
        localStorage.removeItem('currentUser');
        // @ts-ignore
        this.currentUserSubject.next(null);
      })
    );
  }

  /**
   * @name register
   * @param user
   * method sends request to register user with entered values
   */
  register(user: User): Observable<any> {
    return this.http.post(API_URL + "registration", JSON.stringify(user),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  /**
   * @name isLoggedIn
   * method checks if any user is log in
   * checks if there is any user saved in local storage
   */
  public isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }


}
