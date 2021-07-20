import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MenuItem} from "primeng/api";
import {HelloWorldBean, WelcomeDataService} from "../service/data/welcome-data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  welcomeMessageFromService: string = '';
  name = '';


  constructor(private route: ActivatedRoute, private service: WelcomeDataService) {
  }

  ngOnInit(): void {
    this.name = this.route.snapshot.params['name'];
  }

  getWelcomeMessageWithParameter() {
    this.service.executeHelloWorldBeanServiceWithPathVariable(this.name).subscribe(
      response => this.handleSuccessfulResponse(response),
      error => this.handleErrorResponse(error)
    );
  }

  handleSuccessfulResponse(response: HelloWorldBean) {

    this.welcomeMessageFromService = response.message;
    console.log(response.message);

  }

  handleErrorResponse(error: HelloWorldBean) {

    this.welcomeMessageFromService = error.message;

  }

}
