import {TicketType} from "./ticket-type";
import {Observable} from "rxjs";

export class Ticket {
  idTicket!: number;
  ticketName!: string;
  activationDate!: Date;
  expirationDate!: Date;
  status!: boolean;
  membershipTicketType!: TicketType | null;
  idUser!: number;
  idClub!: number;
  idNetwork!: number;
}
