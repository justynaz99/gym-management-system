import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../../../model/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

let API_URL = "http://localhost:8080/api/user/"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  headers!: HttpHeaders;
  currentUser!: User;

  constructor(private http: HttpClient, private router: Router) {
  }

  private getCurrentUserHeader(): HttpHeaders {
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));

    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
    this.headers = new HttpHeaders({
      authorization: 'Bearer ' + this.currentUser.token,
      "Content-Type": "application/json; charset=UTF-8"
    });
    return this.headers;
  }


  updateUser(id: number, user: User) {
    return this.http.put(API_URL + id + '/edit', user, );
  }

  findUserById(id: number) {
    return this.http.get<User>(API_URL + id, );
  }

  changePassword(id: number, user: User) {
    return this.http.put(API_URL + id + '/edit-password', user, );
  }

  findAllUsers() {
    return this.http.get<User[]>(API_URL + 'all', {headers: this.getCurrentUserHeader()});
  }

  findAllUsersByRoleName(roleName: String) {
    return this.http.get<User[]>(API_URL + roleName + '/all_by_role', {headers: this.getCurrentUserHeader()})
  }

  addUser(user: User): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(user),
      {headers: this.getCurrentUserHeader()} );
  }

  deleteUserById(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()})
  }

  sendResetPasswordToken(username: String) {
    return this.http.get(API_URL + 'generate_reset_token/' + username);
  }

  checkIfTokenIsValid(token: string | null) {
    return this.http.get(API_URL + 'token_validation/' + token);
  }

  findUserByToken(token: string | null) {
    return this.http.get<User>(API_URL + 'find_by_token/' + token)
  }
}
