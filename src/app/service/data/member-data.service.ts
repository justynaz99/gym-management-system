import { Injectable } from '@angular/core';
import {HelloWorldBean} from "./welcome-data.service";
import {HttpClient} from "@angular/common/http";
import {Member} from "../../members-list/members-list.component";


@Injectable({
  providedIn: 'root'
})
export class MemberDataService {

  constructor(private http: HttpClient) {

  }

  retrieveAllMembers() {
    return this.http.get<Member[]>('http://localhost:8080/members');
  }

  deleteMember(id: number) {
    return this.http.delete(`http://localhost:8080/members/${id}`)
  }
}
