import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../../model/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Activity} from "../../../model/activity";

let API_URL = "http://localhost:8080/api/user/"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User> (JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

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

  logOut(): Observable<any> {
    return this.http.post(API_URL + "logout", {}).pipe(
      map(response => {
        localStorage.removeItem('currentUser');
        // @ts-ignore
        this.currentUserSubject.next(null);
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(API_URL + "registration", JSON.stringify(user),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  updateUser(id: number, user: User) {
    return this.http.put(API_URL + id + '/edit', user);
  }

  findUserById(id: number) {
    return this.http.get<User>(API_URL + id);
  }

  changePassword(id: number, user: User) {
    return this.http.put(API_URL + id + '/edit-password', user);
  }

  findAllUsers() {
    return this.http.get<User[]>(API_URL + 'all');
  }

  addUser(user: User): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(user),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  deleteUserById(id: number) {
    return this.http.delete(API_URL + id + '/delete')
  }


}
