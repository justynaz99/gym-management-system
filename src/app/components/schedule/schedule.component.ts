import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../activity/activity.component";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {


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

}
