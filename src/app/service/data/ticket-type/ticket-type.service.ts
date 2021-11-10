import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TicketType} from "../../../model/ticket-type";
import {Observable} from "rxjs";
import {Ticket} from "../../../model/ticket";

let API_URL = "http://localhost:8080/api/ticket-type/";

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {

  constructor(private http: HttpClient) { }

  findAllTicketTypes() {
    return this.http.get<TicketType[]>(API_URL + 'all');
  }

  findTicketTypeById(id: number) {
    return this.http.get<TicketType>(API_URL + id);
  }

  addTicketType(ticketType: TicketType): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(ticketType),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  updateTicketType(id: number, ticketType: TicketType) {
    return this.http.put(API_URL + id + '/edit', ticketType);
  }

  deleteTicketTypeById(id: number) {
    return this.http.delete(API_URL + id + '/delete')
  }

  buyTicket(ticket: Ticket, id: number) {
    return this.http.post("http://localhost:8080/api/ticket/buy", JSON.stringify(ticket),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }


}
