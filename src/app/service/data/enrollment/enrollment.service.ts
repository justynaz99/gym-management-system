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

  addEnrollment(enrollment: Enrollment): Observable<any> {
    return this.http.post(API_URL + "sign_up", JSON.stringify(enrollment),
      {headers: this.getCurrentUserHeader()});
  }

  findAllByIdUser(id: number) {
    return this.http.get<Enrollment[]>(API_URL + id + '/all_by_user', {headers: this.getCurrentUserHeader()});
  }

  findAllByIdPosition(id: number) {
    return this.http.get<Enrollment[]>(API_URL + id + '/all_by_position', {headers: this.getCurrentUserHeader()})
  }

  deleteByIdEnrollment(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()});
  }

  findByIdEnrollment(id: number) {
    return this.http.get<Enrollment>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  findByIdPositionAndIdUser(idPosition: number, idUser: number){
    return this.http.get<Enrollment>(API_URL + idPosition + '/' + idUser, {headers: this.getCurrentUserHeader()});
  }


}
