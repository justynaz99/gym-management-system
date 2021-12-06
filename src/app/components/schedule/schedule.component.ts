import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";
import {DatePipe, registerLocaleData, Time} from "@angular/common";
import {Message, PrimeNGConfig} from "primeng/api";
import {ScheduleService} from "../../service/data/schedule/schedule.service";
import {ActivityPositionInSchedule} from "../../model/activity-position-in-schedule";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Enrollment} from "../../model/enrollment";
import {EnrollmentService} from "../../service/data/enrollment/enrollment.service";
import {RoleService} from "../../service/data/role/role.service";
import {Role} from "../../model/role";


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  activities: Activity[] = [];
  date: Date = new Date();
  day: Date = new Date();
  dateStr!: string | null;
  dayStr!: string | null;
  positions!: ActivityPositionInSchedule[];
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  addNewPositionDialog: boolean = false;
  editPositionDialog: boolean = false;
  deletePositionDialog: boolean = false;
  signUpDialog: boolean = false;
  signOutDialog: boolean = false;
  currentUser!: User;
  position: ActivityPositionInSchedule = new ActivityPositionInSchedule();
  pipe: DatePipe = new DatePipe('pl');
  enrollment: Enrollment = new Enrollment();
  usersEnrollments: Enrollment[] = [];
  positionEnrollments: Enrollment[] = [];
  usersPositionsId: number[] = [];
  usersRoles: String[] = [];




  constructor(
    private activityService: ActivityDataService,
    private scheduleService: ScheduleService,
    private router: Router,
    private config: PrimeNGConfig,
    private userService: UserService,
    private enrollmentService: EnrollmentService,

  ) { }


  ngOnInit(): void {

    this.form = new FormGroup({
      activity: new FormControl('',
        [
          Validators.required
        ]),
      startTime: new FormControl('',
        [
          Validators.required
        ]),
      finishTime: new FormControl('',
        [
          Validators.required
        ]),
      coach: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ]),
      maxParticipants: new FormControl('',
        [
          Validators.required
        ]),
    });

    this.findRoles();

    this.dateStr = this.pipe.transform(this.date, 'shortDate');
    this.dayStr = this.pipe.transform(this.day, 'EEEE')

    this.findAllPositionsByDate(this.dateStr);

    if (this.currentUser !== null)
      this.findAllEnrollmentsByIdUser(this.currentUser.idUser);

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  findRoles () {
    if (this.userService.currentUserValue !== null) {
      this.currentUser = this.userService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.usersRoles.push(role.name);
      }
    }
    else {
      this.usersRoles[0] = 'GUEST';
    }
  }

  prevDay() {
    this.date.setDate(this.date.getDate() - 1);
    this.day.setDate(this.day.getDate() - 1);
    this.dateStr = this.pipe.transform(this.date, 'shortDate');
    this.dayStr = this.pipe.transform(this.day, 'EEEE');
    this.findAllPositionsByDate(this.dateStr);

  }

  nextDay() {
    this.date.setDate(this.date.getDate() + 1);
    this.day.setDate(this.day.getDate() + 1);
    this.dateStr = this.pipe.transform(this.date, 'shortDate')
    this.dayStr = this.pipe.transform(this.day, 'EEEE')
    this.findAllPositionsByDate(this.dateStr);
  }

  findAllPositions() {
    this.scheduleService.findAllPositions().subscribe(response => {
      this.positions = response;
    })
  }

  findAllPositionsByDate(date: string | null) {
    this.scheduleService.findAllPositionsByDate(date).subscribe(response => {
      this.positions = response;
    })

  }

  findAllEnrollmentsByIdUser(id: number) {
    this.enrollmentService.findAllByIdUser(id).subscribe(response => {
      this.usersEnrollments = response;
      for (let i = 0; i < this.usersEnrollments.length; i++) {
        this.usersPositionsId[i] = this.usersEnrollments[i].position.idPosition;
      }
      console.log(this.usersPositionsId)
    })
  }

  findAllEnrollmentsByIdPosition(id: number) {
    this.enrollmentService.findAllByIdPosition(id).subscribe(response => {
      this.positionEnrollments = response;
    })
  }

  findPositionById(id: number) {
    this.scheduleService.findPositionById(id).subscribe(response => {
      this.position = response;
      let startTime = new Date(this.position.startTime)
      let finishTime = new Date(this.position.finishTime)
      this.position.startTime = startTime;
      this.position.finishTime = finishTime;
      // this.timeStr = this.pipe.transform(response.startTime, "hh:mm", 'pl');
    })
  }

  findEnrollmentById(id: number) {
    this.enrollmentService.findByIdEnrollment(id).subscribe(response => {
      this.enrollment = response;
    })
  }

  findEnrollmentByIdPositionAndIdUser(idPosition: number, idUser: number) {
    this.enrollmentService.findByIdPositionAndIdUser(idPosition, idUser).subscribe(response => {
      this.enrollment = response;
    })
  }



  displayAddNewPositionDialog() {
    this.position = new ActivityPositionInSchedule();
    this.submitted = false;
    this.findAllActivities();
    this.addNewPositionDialog = true;
  }

  closeAddNewPositionDialog() {
    this.addNewPositionDialog = false;
  }

  displayEditPositionDialog(id: number) {
    this.position = new ActivityPositionInSchedule();
    this.submitted = false;
    this.editPositionDialog = true;
    this.findAllActivities();
    this.findPositionById(id);
  }

  closeEditPositionDialog() {
    this.editPositionDialog = false;
  }

  displayDeletePositionDialog(id: number) {
    this.findPositionById(id);
    console.log(this.position);
    this.deletePositionDialog = true;
  }

  closeDeletePositionDialog() {
    this.deletePositionDialog = false;
  }

  displaySignUpDialog(id: number) {
    this.findPositionById(id);
    if (this.positionEnrollments.length !<= this.position.maxParticipants) {
      this.signUpDialog = true;
    }
  }

  closeSignUpDialog() {
    this.signUpDialog = false;
  }

  displaySignOutDialog1(idEnrollment: number) {
    this.findEnrollmentById(idEnrollment);
    this.signOutDialog = true;
  }

  displaySignOutDialog2(idPosition: number, idUser: number) {
    this.findEnrollmentByIdPositionAndIdUser(idPosition, idUser);
    this.signOutDialog = true;
  }

  closeSignOutDialog() {
    this.signOutDialog = false;
  }



  addPosition() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.position.date = this.date;

    this.scheduleService.addPosition(this.position).subscribe(data => {
        this.closeAddNewPositionDialog();
        this.findAllPositionsByDate(this.dateStr);
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano dane'}]
      }, error => {
      }
    );
  }

  updatePosition(id: number) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.scheduleService.updatePosition(id, this.position)
      .subscribe(data => {
        this.closeEditPositionDialog();
        this.findAllPositionsByDate(this.dateStr);
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane'}]
      })
  }

  deletePositionById(id: number) {
    this.scheduleService.deletePositionById(id).subscribe(response => {
      this.closeDeletePositionDialog();
      this.findAllPositionsByDate(this.dateStr);
      this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto dane'}]
    })
  }

  findAllActivities() {
    this.activityService.findAllActivities().subscribe(
      response => {
        this.activities = response;

      }
    )
  }

  signUpForPosition(id: number) {
    this.findPositionById(id);
    this.enrollment.position = this.position;
    this.enrollment.idActivity = this.position.activity.idActivity;
    this.enrollment.idClub = 1;
    this.enrollment.idNetwork = 1;
    this.enrollment.idUser = this.currentUser.idUser;
    this.enrollmentService.addEnrollment(this.enrollment).subscribe(response => {
      this.position.participantsQuantity++;
      this.scheduleService.updatePosition(id, this.position).subscribe(response => {
        this.findAllPositionsByDate(this.dateStr);
        this.findAllEnrollmentsByIdUser(this.currentUser.idUser);
        this.closeSignUpDialog();
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano na zajęcia'}]
      })
    })

  }

  signOutFromPosition(id: number) {
    this.findEnrollmentById(id);
    this.findPositionById(this.enrollment.position.idPosition);
    this.enrollmentService.deleteByIdEnrollment(id).subscribe(response => {
      this.position.participantsQuantity--;
      this.findAllEnrollmentsByIdUser(this.currentUser.idUser);
      this.scheduleService.updatePosition(id, this.position).subscribe(response => {
        this.findAllPositionsByDate(this.dateStr);
        this.closeSignOutDialog();
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie wypisano z zajęć'}]
      })
    })
  }



//TODO
  //lista użytkowników
  //role





}
