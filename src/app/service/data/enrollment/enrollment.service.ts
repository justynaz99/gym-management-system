import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivityPositionInSchedule} from "../../../model/activity-position-in-schedule";
import {Observable} from "rxjs";
import {Enrollment} from "../../../model/enrollment";
import {User} from "../../../model/user";
import {Router} from "@angular/router";

let API_URL = "http://localhost:8080/api/enrollment/";

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  headers!: HttpHeaders;
  currentUser!: User;

  constructor(private http: HttpClient, private router: Router) { }

  /**
   *
   * @name getCurrentUserHeader
   * @return headers
   * method to get current user from local storage and return headers for this user which contains token
   * to authorized current user
   *
   */
  private getCurrentUserHeader() : HttpHeaders{
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));

    if(!this.currentUser){
      this.router.navigate(['/login']);
    }
    this.headers = new HttpHeaders({
      authorization:'Bearer ' + this.currentUser.token,
      "Content-Type":"application/json; charset=UTF-8"
    });
    return this.headers;
  }

  /**
   * @name addEnrollment
   * @param enrollment
   * method sends request to save enrollment from param
   */
  addEnrollment(enrollment: Enrollment): Observable<any> {
    return this.http.post(API_URL + "sign_up", JSON.stringify(enrollment),
      {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name findAllByIdUser
   * @param id user
   * method sends request to get enrollments of user with id from param
   */
  findAllByIdUser(id: number) {
    return this.http.get<Enrollment[]>(API_URL + id + '/all_by_user', {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name findAllByIdPosition
   * @param id position
   * method sends request to get all enrollments for position with id from param
   */
  findAllByIdPosition(id: number) {
    return this.http.get<Enrollment[]>(API_URL + id + '/all_by_position', {headers: this.getCurrentUserHeader()})
  }

  /**
   * @name deleteByIdEnrollment
   * @param id enrollment
   * method sends request to delete enrollment with id from param
   */
  deleteByIdEnrollment(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name findByIdEnrollment
   * @param id enrollment
   * method sends request to get enrollment with id from param
   */
  findByIdEnrollment(id: number) {
    return this.http.get<Enrollment>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  /**
   *
   * @param idPosition
   * @param idUser
   * method sends request to get enrollment for position with id from param of user with id from param
   */
  findByIdPositionAndIdUser(idPosition: number, idUser: number){
    return this.http.get<Enrollment>(API_URL + idPosition + '/' + idUser, {headers: this.getCurrentUserHeader()});
  }


}
