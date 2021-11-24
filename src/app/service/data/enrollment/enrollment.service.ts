import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivityPositionInSchedule} from "../../../model/activity-position-in-schedule";
import {Observable} from "rxjs";
import {Enrollment} from "../../../model/enrollment";

let API_URL = "http://localhost:8080/api/enrollment/";

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  signUpForActivity(enrollment: Enrollment): Observable<any> {
    return this.http.post(API_URL + "sign_up", JSON.stringify(enrollment),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  findAllByIdUser(id: number) {
    return this.http.get<Enrollment[]>(API_URL + id + '/all_by_user');
  }

  findAllByIdPosition(id: number) {
    return this.http.get<Enrollment[]>(API_URL + id + '/all_by_position')
  }


}
