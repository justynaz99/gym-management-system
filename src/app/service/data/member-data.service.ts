import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Member} from "../../member/member.component";
import {API_URL} from "../../app.constants";

@Injectable({
  providedIn: 'root'
})
export class MemberDataService {

  constructor(private http: HttpClient) {

  }

  retrieveAllMembers() {
    return this.http.get<Member[]>(`${API_URL}/members`);
  }

  deleteMember(id: number) {
    return this.http.delete(`${API_URL}/members/${id}`);
  }

  retrieveMember(id: number) {
    return this.http.get<Member>(`${API_URL}/members/${id}`);
  }

  updateMember(id: number, member: Member) {
    return this.http.put(`${API_URL}/members/${id}`, member);
  }

  createMember(member: Member) {
    return this.http.post(`${API_URL}/members`, member);
  }
}
