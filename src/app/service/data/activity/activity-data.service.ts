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

  constructor(private http: HttpClient, private router: Router) {}


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
   * @name findAllActivities
   * method sends request to backend rest api to get all records from Activity table
   */
  findAllActivities() {
    return this.http.get<Activity[]>(API_URL + 'all');
  }

  /**
   * @name findActivityById
   * @param id of activity
   * method sends request to get activity with id from param
   */
  findActivityById(id: number) {
    return this.http.get<Activity>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name addActivity
   * @param activity
   * method to sends request to save activity from param
   */
  addActivity(activity: Activity): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(activity),
      {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name updateActivity
   * @param id of activity
   * @param activity
   * method sends request to update activity from param
   *
   */
  updateActivity(id: number, activity: Activity) {
    return this.http.put(API_URL + id + '/edit', activity, {headers: this.getCurrentUserHeader()})
  }

  /**
   * @name deleteActivityById
   * @param id
   * method sends request to delete activity with id from param
   */
  deleteActivityById(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()})
  }








}
