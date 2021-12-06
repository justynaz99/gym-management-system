import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserRole} from "../../../model/user-role";
import {Observable} from "rxjs";

let API_URL = "http://localhost:8080/api/user_role/";

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) { }

  updateUserRole(id: number, userRole: UserRole) {
    return this.http.put(API_URL + id + '/update', userRole);
  }

  addUserRole(userRole: UserRole): Observable<any> {
    return this.http.post(API_URL + 'add', JSON.stringify(userRole),
      {headers: {"Content-Type":"application/json; charset=UTF-8"}});
  }

  findAllByIdUser(id: number) {
    return this.http.get<UserRole[]>(API_URL + id + '/all');
  }
}
