import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivityPositionInSchedule} from "../../../model/activity-position-in-schedule";
import {Observable} from "rxjs";

let API_URL = "http://localhost:8080/api/schedule/";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) { }

  findAllPositions() {
    return this.http.get<ActivityPositionInSchedule[]>(API_URL + 'all');
  }

  findPositionById(id: number) {
    return this.http.get<ActivityPositionInSchedule>(API_URL + id);
  }

  addPosition(position: ActivityPositionInSchedule): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(position),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  updatePosition(id: number, position: ActivityPositionInSchedule) {
    return this.http.put(API_URL + id + '/edit', position);
  }

  deletePositionById(id: number) {
    return this.http.delete(API_URL + id +'/delete');
  }

  findAllPositionsByDate(date: string | null) {
    return this.http.get<ActivityPositionInSchedule[]>(API_URL + date + '/all');
  }



}
