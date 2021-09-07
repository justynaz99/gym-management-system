import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Activity} from "../../../components/activity/activity.component";
import {API_URL} from "../../../app.constants";

@Injectable({
  providedIn: 'root'
})
export class ActivityDataService {

  constructor(private http: HttpClient) { }

  retrieveAllActivities() {
    return this.http.get<Activity[]>(`${API_URL}/activities`);
  }

  deleteActivity(id: number) {
    return this.http.delete(`${API_URL}/activities/${id}`);
  }

  retrieveActivity(id: number) {
    return this.http.get<Activity>(`${API_URL}/activities/${id}`);
  }

  updateActivity(id: number, activity: Activity) {
    return this.http.put(`${API_URL}/activities/${id}`, activity);
  }

  createActivity(activity: Activity) {
    return this.http.post(`${API_URL}/activities`, activity);
  }






}
