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

  findAllTicketTypes() {
    return this.http.get<TicketType[]>(API_URL + 'all');
  }

  findTicketTypeById(id: number) {
    return this.http.get<TicketType>(API_URL + id, {headers: this.getCurrentUserHeader()});
  }

  addTicketType(ticketType: TicketType): Observable<any> {
    return this.http.post(API_URL + "add", JSON.stringify(ticketType),
      {headers: this.getCurrentUserHeader()});
  }

  updateTicketType(id: number, ticketType: TicketType) {
    return this.http.put(API_URL + id + '/edit', ticketType, {headers: this.getCurrentUserHeader()});
  }

  deleteTicketTypeById(id: number) {
    return this.http.delete(API_URL + id + '/delete', {headers: this.getCurrentUserHeader()});
  }




}
