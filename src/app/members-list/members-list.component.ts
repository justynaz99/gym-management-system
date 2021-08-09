import {Component, OnInit} from '@angular/core';
import {MemberDataService} from "../service/data/member-data.service";
import {Router} from "@angular/router";
import {Member} from "../member/member.component";

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})

export class MembersListComponent implements OnInit {

  constructor(
    private memberService: MemberDataService,
    private router: Router
  ) {
  }

  members: Member[] = [];

  first = 0;
  rows = 10;


  ngOnInit(): void {
    this.refreshMembersList();
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
    return this.members ? this.first === (this.members.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.members ? this.first === 0 : true;
  }

  refreshMembersList() {
    this.memberService.retrieveAllMembers().subscribe(
      response => {
        this.members = response;
      }
    )
  }


  deleteMember(id: number) {
    console.log(`Delete member ${id}`);
    this.memberService.deleteMember(id).subscribe(
      response => {
        console.log(response);
        console.log(`Delete of member ${id} successful!`);
        this.refreshMembersList();
      }
    );
  }

  updateMember(id: number) {
    console.log(`Update ${id} member`)
    this.router.navigate(['members', id]);
  }

  addMember() {
    this.router.navigate(['members', -1]);
  }

}


