import { Component, OnInit } from '@angular/core';
import {User} from "../../../model/user";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  userId!: string | null;
  currentUser!: User;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.currentUser = JSON.parse(<string>localStorage.getItem('detailUser'));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      if (param.has('id')) {
        this.userId = param.get('id');
      }
    })
  }

}
