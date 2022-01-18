import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Activity} from "../../../model/activity";
import {Observable} from "rxjs";
import {User} from "../../../model/user";
import {Router} from "@angular/router";

let API_URL = "http://localhost:8080/api/activity/";

@Injectable({
  providedIn: 'root'
})
export class ActivityDataService {

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


  findAllActivities() {
    return this.http.get<Activity[]>(API_URL + 'all');
  }

  findActivityById(id: number) {
    return this.http.get<Activity>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  addActivity(activity: Activity): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(activity),
      {headers: this.getCurrentUserHeader()});
  }

  updateActivity(id: number, activity: Activity) {
    return this.http.put(API_URL + id + '/edit', activity, {headers: this.getCurrentUserHeader()});
  }

  deleteActivityById(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()})
  }








}
