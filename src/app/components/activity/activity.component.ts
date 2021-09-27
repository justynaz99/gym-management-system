import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";


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


  constructor(
    private activityService: ActivityDataService,
    private router: Router,
    private userService: UserService
  ) { }


  ngOnInit(): void {
    this.findAllActivities();
    this.currentUser = this.userService.currentUserValue;
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

  editActivityDialog(id: number) {
    this.findActivityById(id);
    this.displayEditActivityDialog = true;
  }

  deleteActivityDialog(id: number) {
    this.findActivityById(id);
    this.displayDeleteActivityDialog = true;
  }




  findActivityById(id: number) {
    this.activityService.findActivityById(id).subscribe(response => {
      this.activityTemp = response;
    })
  }

  addActivity() {
    this.activityService.addActivity(this.activityTemp).subscribe(data => {
        console.log("Dodano");
        window.location.reload();
      }, error => {
        console.log("Błąd");
      }
    );
  }

  updateActivity(id: number) {
    this.activityService.updateActivity(id, this.activityTemp)
      .subscribe(data => {
        window.location.reload();
      })
  }

  deleteActivityById(id: number) {
    this.activityService.deleteActivityById(id).subscribe(response => {
      console.log(response);
      window.location.reload();
    })
  }





}

