import {Time} from "@angular/common";
import {Activity} from "./activity";

export class ActivityPositionInSchedule {
  idPosition!: number;
  date!: Date;
  startTime!: Date;
  finishTime!: Date;
  coach!: string;
  activity!: Activity;
  participantsQuantity!: number;
  maxParticipants!: number;
  started!: boolean;
}
