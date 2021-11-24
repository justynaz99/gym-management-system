import {Component, OnInit} from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {Message} from "primeng/api";
import {Role} from "../../model/role";


@Component({
  selector: 'app-classes-list',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})

export class ActivityComponent implements OnInit {

  currentUser!: User;
  activities!: Array<Activity>;
  displayNewActivityDialog: boolean = false;
  displayEditActivityDialog: boolean = false;
  displayDeleteActivityDialog: boolean = false;
  activityTemp: Activity = new Activity();
  form!: FormGroup;
  submitted: boolean = false;
  messages: Message[] = [];

  constructor(
    private activityService: ActivityDataService,
    private router: Router,
    private userService: UserService
  ) {
  }


  ngOnInit(): void {
    this.findAllActivities();

    if (this.userService.currentUserValue !== null)
      this.currentUser = this.userService.currentUserValue;
    else
      this.currentUser = new User();

    console.log(this.currentUser)

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

  addNewActivityDialog() {
    this.displayNewActivityDialog = true;
  }

  closeAddNewActivityDialog() {
    this.displayNewActivityDialog = false;
  }

  editActivityDialog(id: number) {
    this.findActivityById(id);
    this.displayEditActivityDialog = true;
  }

  closeEditActivityDialog() {
    this.displayEditActivityDialog = false;
  }

  deleteActivityDialog(id: number) {
    this.findActivityById(id);
    this.displayDeleteActivityDialog = true;
  }

  closeDeleteActivityDialog() {
    this.displayDeleteActivityDialog = false;
  }


  findActivityById(id: number) {
    this.activityService.findActivityById(id).subscribe(response => {
      this.activityTemp = response;
    })
  }

  addActivity() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.activityService.addActivity(this.activityTemp).subscribe(data => {
      this.closeAddNewActivityDialog();
      this.findAllActivities();
      this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie zapisano dane'}]
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
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie edytowano dane'}]
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
        this.messages = [{severity: 'success', summary: 'Sukces', detail: 'Poprawnie usunięto dane'}]
      }
    })
  }


}

