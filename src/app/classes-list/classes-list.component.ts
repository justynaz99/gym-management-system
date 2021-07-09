import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classes-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css'],
})



export class ClassesListComponent implements OnInit {

  member1: Member = {
    name: 'Justyna',
    surname: 'Zadora'
  }
  members : Member[] = [this.member1];

  constructor() { }

  ngOnInit(): void {
  }

}

export interface Member {
  name: String;
  surname: String;
}
