import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Activity} from "../../../model/activity";

let API_URL = "http://localhost:8080/api/activity/";

@Injectable({
  providedIn: 'root'
})
export class ActivityDataService {

  constructor(private http: HttpClient) { }

  findAllActivities() {
    return this.http.get<Activity[]>(API_URL + 'all');
  }

  // deleteActivity(id: number) {
  //   return this.http.delete(`${API_URL}/activities/${id}`);
  // }
  //
  // retrieveActivity(id: number) {
  //   return this.http.get<Activity>(`${API_URL}/activities/${id}`);
  // }
  //
  // updateActivity(id: number, activity: Activity) {
  //   return this.http.put(`${API_URL}/activities/${id}`, activity);
  // }
  //
  // createActivity(activity: Activity) {
  //   return this.http.post(`${API_URL}/activities`, activity);
  // }






}
