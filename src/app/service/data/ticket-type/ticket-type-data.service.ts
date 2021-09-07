import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../../app.constants";
import {TicketType} from "../../../components/ticket-type/ticket-type.component";

@Injectable({
  providedIn: 'root'
})
export class TicketTypeDataService {

  constructor(private http: HttpClient) { }

  retrieveAllTicketTypes() {
    return this.http.get<TicketType[]>(`${API_URL}/ticket-types`);
  }

  deleteTicketType(id: number) {
    return this.http.delete(`${API_URL}/ticket-types/${id}`);
  }

  retrieveTicketType(id: number) {
    return this.http.get<TicketType>(`${API_URL}/ticket-types/${id}`);
  }

  updateTicketType(id: number, ticketType: TicketType) {
    return this.http.put(`${API_URL}/ticket-types/${id}`, ticketType);
  }

  createActivity(ticketType: TicketType) {
    return this.http.post(`${API_URL}/ticket-types`, ticketType);
  }


}
