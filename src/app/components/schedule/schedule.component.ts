import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/activity";


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
  }



}
