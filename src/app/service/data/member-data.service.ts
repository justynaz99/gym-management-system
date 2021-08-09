import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Member} from "../../member/member.component";

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
    return this.http.delete(`http://localhost:8080/members/${id}`);
  }

  retrieveMember(id: number) {
    return this.http.get<Member>(`http://localhost:8080/members/${id}`);
  }

  updateMember(id: number, member: Member) {
    return this.http.put(`http://localhost:8080/members/${id}`, member);
  }

  createMember(member: Member) {
    return this.http.post(`http://localhost:8080/members`, member);
  }
}
