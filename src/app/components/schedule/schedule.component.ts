import {Component, OnInit} from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";
import {DatePipe, registerLocaleData, Time} from "@angular/common";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {ScheduleService} from "../../service/data/schedule/schedule.service";
import {ActivityPositionInSchedule} from "../../model/activity-position-in-schedule";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Enrollment} from "../../model/enrollment";
import {EnrollmentService} from "../../service/data/enrollment/enrollment.service";
import {RoleService} from "../../service/data/role/role.service";
import {Role} from "../../model/role";
import {TicketService} from "../../service/data/ticket/ticket.service";
import {Ticket} from "../../model/ticket";
import {tick} from "@angular/core/testing";


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  providers: [MessageService]
})
export class ScheduleComponent implements OnInit {

  activities: Activity[] = [];
  date: Date = new Date();
  day: Date = new Date();
  dateStr!: string | null;
  dayStr!: string | null;
  positions: ActivityPositionInSchedule[] = [];
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  enrollmentsListDialogMessages: Message[] = [];
  addNewPositionDialog: boolean = false;
  editPositionDialog: boolean = false;
  deletePositionDialog: boolean = false;
  enrollmentsListDialog: boolean = false;
  signUpDialog: boolean = false;
  signOutDialog: boolean = false;
  addUserDialog: boolean = false;
  deleteUserDialog: boolean = false;
  currentUser!: User;
  position: ActivityPositionInSchedule = new ActivityPositionInSchedule();
  pipe: DatePipe = new DatePipe('pl');
  enrollment!: any;
  usersEnrollments: Enrollment[] = [];
  positionEnrollments: Enrollment[] = [];
  usersPositionsId: number[] = [];
  usersRoles: String[] = [];
  users: User[] = [];
  idPosition!: number;
  user!: User;
  notSignedUpUsers: User[] = [];


  constructor(
    private activityService: ActivityDataService,
    private scheduleService: ScheduleService,
    private router: Router,
    private config: PrimeNGConfig,
    private userService: UserService,
    private enrollmentService: EnrollmentService,
    private ticketService: TicketService,
    private messageService: MessageService
  ) {
  }


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

  findRoles() {
    if (this.userService.currentUserValue !== null) {
      this.currentUser = this.userService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.usersRoles.push(role.name);
      }
    } else {
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
      if (response !== null) {
        let now = new Date();
        let startTime;
        for (let position of response) {
          startTime = new Date(position.startTime);
          position.started = startTime.getTime() < now.getTime();
        }
        this.positions = response;
      } else
        this.positions = [];
    })
  }


  findAllEnrollmentsByIdUser(id: number) {
    this.enrollmentService.findAllByIdUser(id).subscribe(response => {
      let now = new Date();
      let startTime;
      for (let enrollment of response) {
        startTime = new Date(enrollment.position.startTime);
        enrollment.position.started = startTime.getTime() < now.getTime();
        if (!enrollment.position.started) {
          this.usersEnrollments.push(enrollment);
          this.usersPositionsId.push(enrollment.position.idPosition);
        }
      }
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

  findLatestTicketByIdUser(idUser: number): Ticket {
    let ticket = new Ticket();
    let date;
    let today = new Date();
    this.ticketService.findAllUsersTickets(idUser).subscribe(response => {

      ticket = response[0];
      date = new Date(ticket.expirationDate);
      ticket.status = date.getTime() >= today.getTime();
    })
    return ticket;
  }

  findAllUsers() {
    this.userService.findAllUsers().subscribe(response => {
      this.users = response;
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
    this.deletePositionDialog = true;
  }

  closeDeletePositionDialog() {
    this.deletePositionDialog = false;
  }

  displaySignUpDialog(id: number) {
    this.findPositionById(id);
    if (this.positionEnrollments.length ! <= this.position.maxParticipants) {
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

  displaySignOutDialog2(idPosition: number) {
    this.findEnrollmentByIdPositionAndIdUser(idPosition, this.currentUser.idUser);
    this.signOutDialog = true;
  }

  closeSignOutDialog() {
    this.signOutDialog = false;
  }

  displayEnrollmentsListDialog(idPosition: number) {
    this.enrollmentsListDialogMessages = [];
    this.positionEnrollments = [];
    this.idPosition = idPosition;
    this.findAllEnrollmentsByIdPosition(idPosition);
    this.enrollmentsListDialog = true;
    this.findAllUsers();
  }

  displayAddUserDialog(idPosition: number) {

    this.notSignedUpUsers = [];

    this.findPositionById(idPosition);
    let signedUpUsersIds = [];

    for (let enrollment of this.positionEnrollments) {
      signedUpUsersIds.push(enrollment.user.idUser);
    }

    for (let user of this.users) {
      if (!signedUpUsersIds.includes(user.idUser)) {
        this.notSignedUpUsers.push(user);
      }
    }

    this.addUserDialog = true;
  }

  closeAddUserDialog() {
    this.usersEnrollments = [];
    this.addUserDialog = false;
  }

  displayDeleteUserDialog(idPosition: number, user: User) {
    this.findPositionById(idPosition);
    this.findEnrollmentByIdPositionAndIdUser(idPosition, user.idUser);
    this.deleteUserDialog = true;
  }

  closeDeleteUserDialog() {
    this.deleteUserDialog = false;
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

        this.showSuccessAddPosition()
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
        this.showSuccessEditPosition()
      })
  }

  deletePositionById(id: number) {
    this.scheduleService.deletePositionById(id).subscribe(response => {
      this.closeDeletePositionDialog();
      this.findAllPositionsByDate(this.dateStr);
      this.showSuccessDeletePosition();
    })
  }

  findAllActivities() {
    this.activityService.findAllActivities().subscribe(
      response => {
        this.activities = response;

      }
    )
  }

  signUpForPosition(idPosition: number) {
    this.findPositionById(idPosition);
    this.enrollment = new Enrollment();
    this.enrollment.position = this.position;
    this.enrollment.idActivity = this.position.activity.idActivity;
    this.enrollment.idClub = 1;
    this.enrollment.idNetwork = 1;
    this.enrollment.user = this.currentUser;
    this.enrollmentService.addEnrollment(this.enrollment).subscribe(response => {
      this.position.participantsQuantity++;
      this.scheduleService.updatePosition(idPosition, this.position).subscribe(response => {
        this.ngOnInit();
        this.closeSignUpDialog();
        this.showSuccessSignedUp()
      })
    })
  }

  signOutFromPosition(idEnrollment: number) {
    this.findEnrollmentById(idEnrollment);
    this.findPositionById(this.enrollment.position.idPosition);
    this.enrollmentService.deleteByIdEnrollment(idEnrollment).subscribe(response => {
      this.position.participantsQuantity--;
      this.scheduleService.updatePosition(this.position.idPosition, this.position).subscribe(response => {
        this.usersPositionsId.splice(this.usersPositionsId.indexOf(this.position.idPosition));
        this.usersEnrollments.splice(this.usersEnrollments.indexOf(this.enrollment));
        this.ngOnInit();
        this.closeSignOutDialog();
        this.showSuccessSignedOut();
      })
    })
  }

  checkIfThisEnrollmentExists(idUser: number, idPosition: number) {
    this.enrollment = null;
    this.findEnrollmentByIdPositionAndIdUser(idPosition, idUser);
    return this.enrollment !== null;

  }

  signUpUserForPosition(user: User) {
    this.enrollment = new Enrollment();
    this.enrollment.position = this.position;
    this.enrollment.idActivity = this.position.activity.idActivity;
    this.enrollment.idClub = 1;
    this.enrollment.idNetwork = 1;
    this.enrollment.user = user;
    this.enrollmentService.addEnrollment(this.enrollment).subscribe(response => {
      this.position.participantsQuantity++;
      this.scheduleService.updatePosition(this.position.idPosition, this.position).subscribe(response => {
        this.ngOnInit();
        this.findAllEnrollmentsByIdPosition(this.position.idPosition);
        this.closeAddUserDialog();
        this.showSuccessUserSignedUp()
      })
    })
  }



  signOutUserFromPosition() {
    this.enrollmentService.deleteByIdEnrollment(this.enrollment.idEnrollment).subscribe(response => {
      this.position.participantsQuantity--;
      this.scheduleService.updatePosition(this.position.idPosition, this.position).subscribe(response => {
        this.ngOnInit();
        this.findAllEnrollmentsByIdPosition(this.position.idPosition);
        this.closeDeleteUserDialog();
        this.showSuccessUserSignedOut()
      })
    })
  }

  showSuccessSignedUp() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano na zajęcia!'})
  }

  showSuccessSignedOut() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie wypisano z zajęć'})
  }

  showSuccessUserSignedUp() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano użytkownika!'})
  }

  showSuccessUserSignedOut() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie wypisano użytkownika'})
  }

  showSuccessDeletePosition() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto pozycję'})
  }

  showSuccessEditPosition() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano pozycję'})
  }

  showSuccessAddPosition() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie dodano pozycję'})
  }


//TODO
  //zmienić komunikaty na toasty
  //komunikaty przy logowaniu i rejestracji
  //zawieszenie karnetu i odwieszenie karnetu
  //security
  //resetowanie hasła


}
