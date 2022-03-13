import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TicketType} from "../../../model/ticket-type";
import {Observable} from "rxjs";
import {Ticket} from "../../../model/ticket";
import {User} from "../../../model/user";
import {Router} from "@angular/router";

let API_URL = "http://localhost:8080/api/ticket-type/";

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {

  headers!: HttpHeaders;
  currentUser!: User;

  constructor(private http: HttpClient, private router: Router) {

  }

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
   * @name findAllTicketTypes
   * method sends request to get all records from TicketType table
   */
  findAllTicketTypes() {
    return this.http.get<TicketType[]>(API_URL + 'all');
  }

  /**
   * @name findTicketTypeById
   * @param id of ticket type
   * method sends request to get ticket type with id from param
   */
  findTicketTypeById(id: number) {
    return this.http.get<TicketType>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name addTicketType
   * @param ticketType
   * method sends request to save ticket type from param
   */
  addTicketType(ticketType: TicketType): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(ticketType),
      {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name updateTicketType
   * @param id ticket type
   * @param ticketType
   * method sends request to save ticket type from param
   */
  updateTicketType(id: number, ticketType: TicketType) {
    return this.http.put(API_URL + id + '/edit', ticketType, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name deleteTicketTypeById
   * @param id ticket type
   * method sends request to delete ticket type with id from param
   */
  deleteTicketTypeById(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()});
  }




}
