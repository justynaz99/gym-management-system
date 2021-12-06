import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Role} from "../../../model/role";

let API_URL = "http://localhost:8080/api/role/";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  findAllRoles() {
    return this.http.get<Role[]>(API_URL + 'all');
  }
}
