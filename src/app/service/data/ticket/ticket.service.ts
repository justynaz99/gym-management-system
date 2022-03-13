import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Ticket} from "../../../model/ticket";
import {Observable} from "rxjs";
import {tick} from "@angular/core/testing";
import {User} from "../../../model/user";
import {Router} from "@angular/router";

let API_URL = "http://localhost:8080/api/ticket/";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

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
   * @name findAllUsersTickets
   * @param idUser
   * method sends request to get all tickets of user with id from param
   */
  findAllUsersTickets(idUser: number) {
    return this.http.get<Ticket[]>(API_URL + 'all/' + idUser, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name findTicketById
   * @param idTicket
   * method sends request to get ticket with id from param
   */
  findTicketById(idTicket: number) {
    return this.http.get<Ticket>(API_URL + idTicket, {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name buyTicket
   * @param ticket
   * method sends request to save ticket from param
   */
  buyTicket(ticket: Ticket) : Observable<any> {
    return this.http.post( API_URL + 'save', JSON.stringify(ticket),
      {headers: this.getCurrentUserHeader()});
  }

  /**
   * @name deleteTicketById
   * @param idTicket
   * method sends request to delete ticket with id from param
   */
  deleteTicketById(idTicket: number) {
    return this.http.delete(API_URL + idTicket + '/delete', {headers: this.getCurrentUserHeader()})
  }

  /**
   * @name updateTicket
   * @param ticket
   * method sends request to update ticket with id from param
   */
  updateTicket(ticket: Ticket) {
    return this.http.put(API_URL + 'update', ticket, {headers: this.getCurrentUserHeader()});
  }
}
