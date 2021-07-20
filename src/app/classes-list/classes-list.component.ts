import { Component, OnInit } from '@angular/core';
import {Member} from "../member/member.component";


@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css'],
})

export class ClassesListComponent implements OnInit {

  member1: Member = {
    id: 1,
    name: 'Justyna',
    surname: 'Zadora',
    ticket: 'student',
    expirationDate: new Date()
  }
  members : Member[] = [this.member1];

  constructor() { }

  ngOnInit(): void {
  }

}

