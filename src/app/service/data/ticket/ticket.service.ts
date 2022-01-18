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

  findAllUsersTickets(idUser: number) {
    return this.http.get<Ticket[]>(API_URL + 'all/' + idUser, {headers: this.getCurrentUserHeader()});
  }

  findTicketById(idTicket: number) {
    return this.http.get<Ticket>(API_URL + idTicket, {headers: this.getCurrentUserHeader()});
  }

  buyTicket(ticket: Ticket) : Observable<any> {
    return this.http.post( API_URL + 'save', JSON.stringify(ticket),
      {headers: this.getCurrentUserHeader()});
  }

  deleteTicketById(idTicket: number) {
    return this.http.delete(API_URL + idTicket + '/delete', {headers: this.getCurrentUserHeader()})
  }

  updateTicket(ticket: Ticket) {
    return this.http.put(API_URL + 'update', ticket, {headers: this.getCurrentUserHeader()});
  }
}
