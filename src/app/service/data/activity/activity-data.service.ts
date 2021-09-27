import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Activity} from "../../../model/activity";
import {Observable} from "rxjs";

let API_URL = "http://localhost:8080/api/activity/";

@Injectable({
  providedIn: 'root'
})
export class ActivityDataService {

  constructor(private http: HttpClient) { }

  findAllActivities() {
    return this.http.get<Activity[]>(API_URL + 'all');
  }

  findActivityById(id: number) {
    return this.http.get<Activity>(API_URL + id);
  }

  addActivity(activity: Activity): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(activity),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  updateActivity(id: number, activity: Activity) {
    return this.http.put(API_URL + id + '/edit', activity);
  }

  deleteActivityById(id: number) {
    return this.http.delete(API_URL + id + '/delete')
  }








}
