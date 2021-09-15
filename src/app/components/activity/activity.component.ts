import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";


@Component({
  selector: 'app-classes-list',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})

export class ActivityComponent implements OnInit {

  constructor(
    private activityService: ActivityDataService,
    private router: Router
  ) { }

  activities: Activity[] = [];

  ngOnInit(): void {
    this.findAllActivities();
  }

  findAllActivities() {
    this.activityService.findAllActivities().subscribe(
      response => {
        this.activities = response;
      }
    )
  }


  // deleteActivity(id: number) {
  //   console.log(`Delete member ${id}`);
  //   this.activityService.deleteActivity(id).subscribe(
  //     response => {
  //       console.log(response);
  //       console.log(`Delete of activity ${id} successful!`);
  //       this.refreshActivitiesList();
  //     }
  //   );
  // }
  //
  // updateActivity(id: number) {
  //   console.log(`Update ${id} activity`)
  //   this.router.navigate(['activities', id]);
  // }
  //
  // addActivity() {
  //   this.router.navigate(['activities', -1]);
  // }


}

