import {Role} from "./role";

export class User {
  id!: number;
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  password: string = "";
  birthDate!: Date;
  role!: Role;
  token: string = "";
}
