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

  /**
   *
   * @name getCurrentUserHeader
   * @return headers
   * method to get current user from local storage and return headers for this user which contains token
   * to authorized current user
   *
   */
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


  /**
   * @name updateUser
   * @param id user
   * @param user
   * method sends request to update user from param
   */
  updateUser(id: number, user: User) {
    return this.http.put(API_URL + id + '/edit', user);
  }

  /**
   * @name findUserById
   * @param id user
   * method sends request to get user with id from param
   */
  findUserById(id: number) {
    return this.http.get<User>(API_URL + id, );
  }

  /**
   * @name changePassword
   * @param id user
   * @param user
   * method sends request to change password field in user record from param
   */
  changePassword(id: number, user: User) {
    return this.http.put(API_URL + id + '/edit-password', user, );
  }

  /**
   * @name findAllUsers
   * method sends request to get all records from User table
   */
  findAllUsers() {
    return this.http.get<User[]>(API_URL + 'all', {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name findAllUsersByRoleName
   * @param roleName
   * method sends request to get all users with specific role name
   */
  findAllUsersByRoleName(roleName: String) {
    return this.http.get<User[]>(API_URL + roleName + '/all_by_role', {headers: this.getCurrentUserHeader()})
  }

  /**
   * @name addUser
   * @param user
   * method sends request to save user from param
   */
  addUser(user: User): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(user),
      {headers: this.getCurrentUserHeader()} );
  }

  /**
   * @name deleteUserById
   * @param id user
   * method sends request to delete user with id from param
   */
  deleteUserById(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()})
  }

  /**
   * @name sendResetPasswordToken
   * @param username
   * method sends request to generate and send email with reset password token
   */
  sendResetPasswordToken(username: String) {
    return this.http.get(API_URL + 'generate_reset_token/' + username);
  }

  /**
   * @name checkIfTokenIsValid
   * @param token
   * method sends request to check if reset password token is in database
   */
  checkIfTokenIsValid(token: string | null) {
    return this.http.get(API_URL + 'token_validation/' + token);
  }

  /**
   * @name findUserByToken
   * @param token
   * method sends request to find user by token from param
   */
  findUserByToken(token: string | null) {
    return this.http.get<User>(API_URL + 'find_by_token/' + token)
  }
}
