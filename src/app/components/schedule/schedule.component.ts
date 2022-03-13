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
import {UserAuthService} from "../../service/data/user-auth/user-auth.service";
import {Enrollment} from "../../model/enrollment";
import {EnrollmentService} from "../../service/data/enrollment/enrollment.service";
import {RoleService} from "../../service/data/role/role.service";
import {Role} from "../../model/role";
import {TicketService} from "../../service/data/ticket/ticket.service";
import {Ticket} from "../../model/ticket";
import {tick} from "@angular/core/testing";
import {UserService} from "../../service/data/user/user.service";


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
    private userAuthService: UserAuthService,
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

    this.findCurrentUser();

    this.dateStr = this.pipe.transform(this.date, 'shortDate');
    this.dayStr = this.pipe.transform(this.day, 'EEEE')

    this.findAllPositionsByDate(this.dateStr);

    if (this.currentUser !== null)
      this.findAllEnrollmentsByIdUser(this.currentUser.idUser);

  }



  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * method finds current user and pushes it's role's names to string list
   */
  findCurrentUser() {
    if (this.userAuthService.currentUserValue !== null) {
      this.currentUser = this.userAuthService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.usersRoles.push(role.name);
      }
    } else {
      this.usersRoles[0] = 'GUEST';
    }
  }

  /**
   * decrements date by 1 and finds positions from schedule by this date
   */
  prevDay() {
    this.date.setDate(this.date.getDate() - 1);
    this.day.setDate(this.day.getDate() - 1);
    this.dateStr = this.pipe.transform(this.date, 'shortDate');
    this.dayStr = this.pipe.transform(this.day, 'EEEE');
    this.findAllPositionsByDate(this.dateStr);

  }

  /**
   * increments date by 1 and finds positions from schedule by this date
   */
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

  /**
   * finds all positions from schedule by date from param
   * @param date
   */
  findAllPositionsByDate(date: string | null) {
    this.scheduleService.findAllPositionsByDate(date).subscribe(response => {
      if (response !== null) {
        /**
         * checks if start time is lower than now
         * if sign up button should be disabled or not
         */
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


  /**
   * finds all enrollments with user's id from param
   * only enrollments for positions which haven't stared yet are pushed to usersEnrollment list to display them in My Activities panel
   * @param id
   */
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

  /**
   * finds all enrollment for positions with id from param and assigns response to positions enrollments list
   * @param id
   */
  findAllEnrollmentsByIdPosition(id: number) {
    this.enrollmentService.findAllByIdPosition(id).subscribe(response => {
      this.positionEnrollments = response;
    })
  }

  /**
   * finds position with id from param and assigns it to position field
   * @param id
   */
  findPositionById(id: number) {
    this.scheduleService.findPositionById(id).subscribe(response => {
      this.position = response;
      let startTime = new Date(this.position.startTime)
      let finishTime = new Date(this.position.finishTime)
      this.position.startTime = startTime;
      this.position.finishTime = finishTime;
    })
  }

  /**
   * finds enrollment with id from param and assigns it to enrollment field
   * @param id
   */
  findEnrollmentById(id: number) {
    this.enrollmentService.findByIdEnrollment(id).subscribe(response => {
      this.enrollment = response;
    })
  }

  /**
   * finds enrollment with user id and position id from param
   * to find enrollment to sign out user from position
   * @param idPosition
   * @param idUser
   */
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

  /**
   * finds all records from User table and assigns response to users list
   */
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

  /**
   * displays only users which are not signed up for this position
   * to avoid adding users twice (creating the same enrollment twice)
   * @param idPosition
   */
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


  /**
   * saves new position
   */
  addPosition() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.position.date = this.date;

    this.scheduleService.addPosition(this.position).subscribe(data => {
      /**
       * need to set activityName field in case this activity will be deleted
       */
      data.activityName = data.activity.name;
      this.scheduleService.updatePosition(data.idPosition, data).subscribe(response => {
        this.closeAddNewPositionDialog();
        this.findAllPositionsByDate(this.dateStr);
        this.showSuccessAddPosition()
      })
      }, error => {
      }
    );
  }

  /**
   * updates position with id from param
   * @param id
   */
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

  /**
   * deletes position with id from param
   * @param id
   */
  deletePositionById(id: number) {
    this.scheduleService.deletePositionById(id).subscribe(response => {
      this.closeDeletePositionDialog();
      this.findAllPositionsByDate(this.dateStr);
      this.showSuccessDeletePosition();
    })
  }

  /**
   * finds all records from Activity database
   */
  findAllActivities() {
    this.activityService.findAllActivities().subscribe(
      response => {
        this.activities = response;

      }
    )
  }

  /**
   * saves new enrollment for position from param
   * @param idPosition
   */
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

  /**
   * deletes enrollment with id from param
   * @param idEnrollment
   */
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

  /**
   * saves new enrollment with id of user from param
   * to enable staff or admin sign up user for position
   * position which id should contain enrollment is saved in position field
   * @param user
   */
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


  /**
   * deletes enrollment with id from param
   *
   */
  signOutUserFromPosition() {
    this.enrollmentService.deleteByIdEnrollment(this.enrollment.idEnrollment).subscribe(response => {
      this.position.participantsQuantity--;
      /**
       * updates position after changing quantity of participants
       */
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
  //komunikaty przy logowaniu i rejestracji
  //zawieszenie karnetu i odwieszenie karnetu
  //security
  //komunikat przy opisach, długość opisu
  //długość karnetu


}
