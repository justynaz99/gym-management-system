import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MenuItem, MessageService, PrimeNGConfig} from "primeng/api";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {

  welcomeMessageFromService: string = '';
  name = '';


  constructor(private route: ActivatedRoute, private messageService: MessageService, private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
    this.name = this.route.snapshot.params['name'];
    this.primengConfig.ripple = true;

  }








}
