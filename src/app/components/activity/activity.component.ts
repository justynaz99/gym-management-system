import {Component, OnInit} from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";
import {User} from "../../model/user";
import {UserAuthenticationService} from "../../service/data/user-authentication/user-authentication.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message, MessageService} from "primeng/api";
import {Role} from "../../model/role";
import {UserService} from "../../service/data/user/user.service";


@Component({
  selector: 'app-classes-list',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  providers: [MessageService]
})

export class ActivityComponent implements OnInit {

  currentUser!: User;
  activities!: Array<Activity>;
  newActivityDialog: boolean = false;
  editActivityDialog: boolean = false;
  deleteActivityDialog: boolean = false;
  activityTemp: Activity = new Activity();
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];
  roles: String[] = [];

  constructor(
    private activityService: ActivityDataService,
    private router: Router,
    private userAuthService: UserAuthenticationService,
    private messageService: MessageService
  ) {
  }


  ngOnInit(): void {

    this.findAllActivities();

    this.findRoles();



    this.form = new FormGroup({
      name: new FormControl('',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ]),
      description: new FormControl('')
    });

  }

  findRoles () {
    if (this.userAuthService.currentUserValue !== null) {
      this.currentUser = this.userAuthService.currentUserValue;

      for (let role of this.currentUser.roles) {
        this.roles.push(role.name);
      }
    }
    else {
      this.roles[0] = 'GUEST';
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  findAllActivities() {
    this.activityService.findAllActivities().subscribe(
      response => {
        this.activities = response;
      }
    )
  }

  displayNewActivityDialog() {
    this.activityTemp = new Activity();
    this.submitted = false;
    this.newActivityDialog = true;
  }

  closeNewActivityDialog() {
    this.newActivityDialog = false;
  }

  displayEditActivityDialog(id: number) {
    this.activityTemp = new Activity();
    this.submitted = false;
    this.findActivityById(id);
    this.editActivityDialog = true;
  }

  closeEditActivityDialog() {
    this.editActivityDialog = false;
  }

  displayDeleteActivityDialog(id: number) {
    this.activityTemp = new Activity();
    this.submitted = false;
    this.findActivityById(id);
    this.deleteActivityDialog = true;
  }

  closeDeleteActivityDialog() {
    this.deleteActivityDialog = false;
  }


  findActivityById(id: number) {
    this.activityService.findActivityById(id).subscribe(response => {
      this.activityTemp = response;
    })
  }

  /**
   * @return
   */
  addActivity() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.activityService.addActivity(this.activityTemp).subscribe(data => {
      console.log(data)
      this.closeNewActivityDialog();
      this.findAllActivities();
      this.submitted = false;
      this.showSuccessAdd()
      }, error => {
      }
    );
  }

  updateActivity(id: number) {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.activityService.updateActivity(id, this.activityTemp)
      .subscribe(data => {
        this.closeEditActivityDialog();
        this.findAllActivities();
        this.submitted = false;
        this.showSuccessEdit()
      })
  }

  deleteActivityById(id: number) {
    this.activityService.deleteActivityById(id).subscribe(response => {
      if (response === null) {
        this.closeDeleteActivityDialog();
        this.findAllActivities();
        this.messages = [{severity: 'error', summary: 'Błąd', detail: 'Nie możesz usunąć tych zajęć, ponieważ znajdują się one w grafiku'}]
      } else {
        this.closeDeleteActivityDialog();
        this.findAllActivities();
        this.showSuccessDelete()
      }
    })
  }

  showSuccessAdd() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie dodano zajęcia!'})
  }

  showSuccessEdit() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano zajęcia!'})
  }

  showSuccessDelete() {
    this.messageService.add({severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto zajęcia!'})
  }


}

