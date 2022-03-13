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
   * @name findAllPositions
   * method sends request to get all records from ActivityPositionInSchedule table
   */
  findAllPositions() {
    return this.http.get<ActivityPositionInSchedule[]>(API_URL + 'all');
  }

  /**
   * @name findPositionById
   * @param id position
   * method sends request to get position with id from param
   */
  findPositionById(id: number) {
    return this.http.get<ActivityPositionInSchedule>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name addPosition
   * @param position
   * method sends request to save position from param to ActivityPositionInSchedule table
   */
  addPosition(position: ActivityPositionInSchedule): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(position),
      {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name updatePosition
   * @param id of position
   * @param position
   * method sends request to update position from param
   */
  updatePosition(id: number, position: ActivityPositionInSchedule) {
    return this.http.put(API_URL + id + '/edit', position, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name deletePositionById
   * @param id position
   * method sends request to delete position with id from param
   */
  deletePositionById(id: number) {
    return this.http.delete(API_URL + id +'/delete', {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name findAllPositionsByDate
   * @param date
   * method sends request to get positions with specific date
   */
  findAllPositionsByDate(date: string | null) {
    return this.http.get<ActivityPositionInSchedule[]>(API_URL + date + '/all');
  }



}
