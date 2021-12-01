import {TicketType} from "./ticket-type";
import {Observable} from "rxjs";

export class Ticket {
  idTicket!: number;
  activationDate!: Date;
  expirationDate!: Date;
  status!: boolean;
  membershipTicketType!: any;
  idUser!: number;
  idClub!: number;
  idNetwork!: number;
}
