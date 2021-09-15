import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser!: User;

  constructor(private userService: UserService, private router: Router) {
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.userService.logOut().subscribe(data => {
      this.router.navigate(['/login']);
      window.location.reload();
    });
  }

  updateUser() {
    console.log(this.currentUser.idUser)
    this.userService.updateUser(this.currentUser.idUser, this.currentUser)
      .subscribe(data => console.log(data));
  }

}



