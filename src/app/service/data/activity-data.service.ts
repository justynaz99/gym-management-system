import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Activity} from "../../activity/activity.component";
import {Member} from "../../member/member.component";

@Injectable({
  providedIn: 'root'
})
export class ActivityDataService {

  constructor(private http: HttpClient) { }

  retrieveAllActivities() {
    return this.http.get<Activity[]>('http://localhost:8080/activities');
  }

  deleteActivity(id: number) {
    return this.http.delete(`http://localhost:8080/activities/${id}`);
  }

  retrieveActivity(id: number) {
    return this.http.get<Activity>(`http://localhost:8080/activities/${id}`);
  }

  updateActivity(id: number, activity: Activity) {
    return this.http.put(`http://localhost:8080/activities/${id}`, activity);
  }

  createActivity(activity: Activity) {
    return this.http.post(`http://localhost:8080/activities`, activity);
  }






}
