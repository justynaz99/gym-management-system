import {ActivityPositionInSchedule} from "./activity-position-in-schedule";
import {User} from "./user";

export class Enrollment {

  idEnrollment!: number;
  position!: ActivityPositionInSchedule;
  idActivity!: number;
  idClub!: number;
  idNetwork!: number;
  user!: User;

}
