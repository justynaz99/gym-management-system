import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivityPositionInSchedule} from "../../../model/activity-position-in-schedule";
import {Observable} from "rxjs";
import {User} from "../../../model/user";
import {Router} from "@angular/router";

let API_URL = "http://localhost:8080/api/schedule/";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  headers!: HttpHeaders;
  currentUser!: User;

  constructor(private http: HttpClient, private router: Router) {

  }

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

  findAllPositions() {
    return this.http.get<ActivityPositionInSchedule[]>(API_URL + 'all');
  }

  findPositionById(id: number) {
    return this.http.get<ActivityPositionInSchedule>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  addPosition(position: ActivityPositionInSchedule): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(position),
      {headers: this.getCurrentUserHeader()});
  }

  updatePosition(id: number, position: ActivityPositionInSchedule) {
    return this.http.put(API_URL + id + '/edit', position, {headers: this.getCurrentUserHeader()});
  }

  deletePositionById(id: number) {
    return this.http.delete(API_URL + id +'/delete', {headers: this.getCurrentUserHeader()});
  }

  findAllPositionsByDate(date: string | null) {
    return this.http.get<ActivityPositionInSchedule[]>(API_URL + date + '/all');
  }



}
