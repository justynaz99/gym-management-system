import {Role} from "./role";

export class User {
  idUser!: number;
  firstName: string = "";
  lastName: string = "";
  username: string = "";
  password: string = "";
  birthDate!: Date;
  phoneNumber: string = "";
  token: string = "";
  roles!: Role[];
}
