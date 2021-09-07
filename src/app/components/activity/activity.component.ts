import { Component, OnInit } from '@angular/core';
import {ActivityDataService} from "../../service/data/activity/activity-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export interface Activity {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  id: number = 1;
  activity: Activity = {id: this.id, name: '', description: ''};

  activityForm!: FormGroup;

  constructor(
    private activityService: ActivityDataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.activity = {id: this.id, name: '', description: ''};

    if (this.id != -1) {
      this.activityService.retrieveActivity(this.id)
        .subscribe(
          data => this.activity = data
        )
    }

    this.activityForm = new FormGroup({
      name: new FormControl(this.activity.name, [
        Validators.required,
        Validators.minLength(4)
      ])
    })
  }

  saveActivity() {
    if(this.id == -1) {
      this.activityService.createActivity(this.activity)
        .subscribe(
          data => {
            console.log(data);
            this.router.navigate(['activities-list']);
          }
        )
    } else {
      this.activityService.updateActivity(this.id, this.activity)
        .subscribe(
          data => {
            console.log(data);
            this.router.navigate(['activities-list']);
          }
        )
    }
  }


}
