import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {AdminService} from "../../service/data/admin/admin.service";

@Component({
  selector: 'app-members-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})

export class UsersListComponent implements OnInit {

  userList!: Array<User>;

  first = 0;
  rows = 10;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    // this.refreshMembersList();
    this.findAllUsers();
  }

  findAllUsers() {
    this.adminService.findAllUsers().subscribe(data => {
      this.userList = data;
    });
  }

  detail(user: User) {
    localStorage.setItem("detailUser", JSON.stringify(user));
    this.router.navigate(['/detail', user.id]);
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
    return this.userList ? this.first === (this.userList.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.userList ? this.first === 0 : true;
  }

  // refreshMembersList() {
  //   this.memberService.retrieveAllMembers().subscribe(
  //     response => {
  //       this.members = response;
  //     }
  //   )
  // }
  //
  //
  // deleteMember(id: number) {
  //   console.log(`Delete member ${id}`);
  //   this.memberService.deleteMember(id).subscribe(
  //     response => {
  //       console.log(response);
  //       console.log(`Delete of member ${id} successful!`);
  //       this.refreshMembersList();
  //     }
  //   );
  // }
  //
  // updateMember(id: number) {
  //   console.log(`Update ${id} member`)
  //   this.router.navigate(['members', id]);
  // }
  //
  // addMember() {
  //   this.router.navigate(['members', -1]);
  // }

}


