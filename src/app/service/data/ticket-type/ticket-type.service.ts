import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TicketType} from "../../../model/ticket-type";

let API_URL = "http://localhost:8080/api/ticket-type/";

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {

  constructor(private http: HttpClient) { }

  findAllTicketTypes() {
    return this.http.get<TicketType[]>(API_URL + 'all');
  }

  // deleteTicketType(id: number) {
  //   return this.http.delete(`${API_URL}/ticket-types/${id}`);
  // }
  //
  // retrieveTicketType(id: number) {
  //   return this.http.get<TicketType>(`${API_URL}/ticket-types/${id}`);
  // }
  //
  // updateTicketType(id: number, ticketType: TicketType) {
  //   return this.http.put(`${API_URL}/ticket-types/${id}`, ticketType);
  // }
  //
  // createActivity(ticketType: TicketType) {
  //   return this.http.post(`${API_URL}/ticket-types`, ticketType);
  // }


}
