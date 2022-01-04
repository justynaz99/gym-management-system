import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Ticket} from "../../../model/ticket";
import {Observable} from "rxjs";
import {tick} from "@angular/core/testing";

let API_URL = "http://localhost:8080/api/ticket/";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  findAllUsersTickets(idUser: number) {
    return this.http.get<Ticket[]>(API_URL + 'all/' + idUser);
  }

  findTicketById(idTicket: number) {
    return this.http.get<Ticket>(API_URL + idTicket);
  }

  buyTicket(ticket: Ticket) : Observable<any> {
    return this.http.post( API_URL + 'save', JSON.stringify(ticket),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  deleteTicketById(idTicket: number) {
    return this.http.delete(API_URL + idTicket + '/delete')
  }

  updateTicket(ticket: Ticket) {
    return this.http.put(API_URL + 'update', ticket);
  }
}
