import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {

  member1: Member = {
    name: 'Justyna',
    surname: 'Zadora',
    ticket: 'student',
    expirationDate: '30.06.2021'

  }
  members : Member[] = [this.member1];

  first = 0;
  rows = 10;

  constructor() { }

  ngOnInit(): void {
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.members ? this.first === (this.members.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.members ? this.first === 0 : true;
  }

}

export interface Member {
  name: string;
  surname: string;
  ticket: string;
  expirationDate: string;
}
