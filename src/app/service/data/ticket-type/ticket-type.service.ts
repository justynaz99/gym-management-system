import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TicketType} from "../../../model/ticket-type";
import {Observable} from "rxjs";

let API_URL = "http://localhost:8080/api/ticket-type/";

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {

  constructor(private http: HttpClient) { }

  findAllTicketTypes() {
    return this.http.get<TicketType[]>(API_URL + 'all');
  }

  addTicketType(ticketType: TicketType): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(ticketType),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  updateTicketType(id: number, ticketType: TicketType) {
    return this.http.put(API_URL + id + '/edit', ticketType);
  }

  findTicketTypeById(id: number) {
    return this.http.get<TicketType>(API_URL + id);
  }

  deleteTicketTypeById(id: number) {
    return this.http.delete(API_URL + id + '/delete')
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
