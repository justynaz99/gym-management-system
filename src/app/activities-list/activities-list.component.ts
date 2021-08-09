import { Component, OnInit } from '@angular/core';
import {Activity} from "../activity/activity.component";
import {ActivityDataService} from "../service/data/activity-data.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-classes-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.css'],
})

export class ActivitiesListComponent implements OnInit {

  constructor(
    private activityService: ActivityDataService,
    private router: Router
  ) { }

  activities: Activity[] = [];

  ngOnInit(): void {
    this.refreshActivitiesList();
  }

  refreshActivitiesList() {
    this.activityService.retrieveAllActivities().subscribe(
      response => {
        this.activities = response;
      }
    )
  }

  deleteActivity(id: number) {
    console.log(`Delete member ${id}`);
    this.activityService.deleteActivity(id).subscribe(
      response => {
        console.log(response);
        console.log(`Delete of activity ${id} successful!`);
        this.refreshActivitiesList();
      }
    );
  }

  updateActivity(id: number) {
    console.log(`Update ${id} activity`)
    this.router.navigate(['activities', id]);
  }

  addActivity() {
    this.router.navigate(['activities', -1]);
  }


}

