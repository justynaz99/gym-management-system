import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";
import {DatePipe, registerLocaleData, Time} from "@angular/common";
import localePL from "@angular/common/locales/pl";
import localePlExtra from "@angular/common/locales/extra/pl";
import {Message, PrimeNGConfig} from "primeng/api";
import {ScheduleService} from "../../service/data/schedule/schedule.service";
import {ActivityPositionInSchedule} from "../../model/activity-position-in-schedule";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Enrollment} from "../../model/enrollment";
import {EnrollmentService} from "../../service/data/enrollment/enrollment.service";
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
  currentUser!: User;
  positionTemp: ActivityPositionInSchedule = new ActivityPositionInSchedule();
  pipe: DatePipe = new DatePipe('pl');
  enrollment: Enrollment = new Enrollment();
  enrollments: Enrollment[] = [];
  enrollmentsNum!: number;
  timeStr!: string | null;
  guestRole: Role = new Role();



  constructor(
    private activityService: ActivityDataService,
    private scheduleService: ScheduleService,
    private router: Router,
    private config: PrimeNGConfig,
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) { }


  ngOnInit(): void {


    this.countEnrollmentsByIdPosition(22);

    this.dateStr = this.pipe.transform(this.date, 'shortDate');
    this.dayStr = this.pipe.transform(this.day, 'EEEE')
    this.findAllPositionsByDate(this.dateStr);
    this.findAllActivities();

    this.findCurrentUser();
    this.findAllEnrollmentsByIdUser(this.currentUser.idUser);

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
    });

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  findCurrentUser() {
    if (this.userService.currentUserValue !== null)
      this.currentUser = this.userService.currentUserValue;
    else {
      this.currentUser = new User();
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
      this.enrollments = response;
    })
  }

  findAllEnrollmentsByIdPosition(id: number) {
    this.enrollmentService.findAllByIdPosition(id).subscribe(response => {
      console.log(response);
    })
  }

  countEnrollmentsByIdPosition(id: number) {
    this.enrollmentService.findAllByIdPosition(id).subscribe(response => {
      this.enrollmentsNum = response.length;
    })
  }

  displayAddNewPositionDialog() {
    this.addNewPositionDialog = true;
  }

  closeAddNewPositionDialog() {
    this.addNewPositionDialog = false;
  }

  displayEditPositionDialog(id: number) {
    this.findPositionById(id);
    this.editPositionDialog = true;
  }

  closeEditPositionDialog() {
    this.editPositionDialog = false;
  }

  displayDeletePositionDialog(id: number) {
    this.findPositionById(id);
    console.log(this.positionTemp);
    this.deletePositionDialog = true;
  }

  closeDeletePositionDialog() {
    this.deletePositionDialog = false;
  }

  displaySignUpDialog(id: number) {
    this.findPositionById(id);
    this.signUpDialog = true;
  }

  closeSignUpDialog() {
    this.signUpDialog = false;
  }

  findPositionById(id: number) {
    this.scheduleService.findPositionById(id).subscribe(response => {
      this.positionTemp = response;
      this.timeStr = this.pipe.transform(response.startTime, "hh:mm", 'pl');
    })
  }

  addPosition() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.positionTemp.date = this.date;

    this.scheduleService.addPosition(this.positionTemp).subscribe(data => {
        this.closeAddNewPositionDialog();
        this.findAllPositions();
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

    this.scheduleService.updatePosition(id, this.positionTemp)
      .subscribe(data => {
        this.closeEditPositionDialog();
        this.findAllPositions();
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

  signUpForActivity(id: number) {
    this.enrollment.idPosition = id;
    this.enrollment.idActivity = this.positionTemp.activity.idActivity;
    this.enrollment.idClub = 1;
    this.enrollment.idNetwork = 1;
    this.enrollment.idUser = this.currentUser.idUser;

    console.log(this.enrollment)
    this.enrollmentService.signUpForActivity(this.enrollment).subscribe(response => {
      this.closeSignUpDialog();
      this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano na zajęcia'}]
    })

  }








}
