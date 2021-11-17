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


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  activities: Activity[] = [];
  date: Date = new Date();
  dateStr!: string | null;
  dateTemp: Date = new Date();
  positions!: ActivityPositionInSchedule[];
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  addNewPositionDialog: boolean = false;
  editPositionDialog: boolean = false;
  deletePositionDialog: boolean = false;
  currentUser!: User;
  positionTemp: ActivityPositionInSchedule = new ActivityPositionInSchedule();
  pipe: DatePipe = new DatePipe('pl');



  constructor(
    private activityService: ActivityDataService,
    private scheduleService: ScheduleService,
    private router: Router,
    private config: PrimeNGConfig,
    private userService: UserService
  ) { }


  ngOnInit(): void {

    this.dateStr = this.pipe.transform(this.date, 'yyy-MM-dd');
    this.findAllPositionsByDate(this.dateStr);
    this.findAllActivities();

    if (this.userService.currentUserValue !== null)
      this.currentUser = this.userService.currentUserValue;
    else
      this.currentUser = new User();

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

  prevDay() {
    this.dateTemp.setDate(this.date.getDate() - 1);
    this.date = this.dateTemp;

  }

  nextDay() {
    this.dateTemp.setDate(this.date.getDate() + 1);
    this.date = this.dateTemp;
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

  findPositionById(id: number) {
    this.scheduleService.findPositionById(id).subscribe(response => {
      this.positionTemp = response;
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
    this.findPositionById(id);
    this.scheduleService.deletePositionById(id).subscribe(response => {
      this.closeDeletePositionDialog();
      this.findAllPositions();
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








}
