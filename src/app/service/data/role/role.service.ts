import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Role} from "../../../model/role";
import {A} from "@angular/cdk/keycodes";

let API_URL = "http://localhost:8080/api/role/";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  /**
   * @name findAllRoles
   * method sends request to get all records from Role table
   */
  findAllRoles() {
    return this.http.get<Role[]>(API_URL + 'all');
  }

  /**
   *
   * @name findByName
   * @param name role
   * method sends request to get role with name from param
   */
  findByName(name: string) {
    return this.http.get<Role>(API_URL + name);
  }
}
