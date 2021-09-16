import { Component, OnInit } from '@angular/core';
import {User} from "../../model/user";
import {UserService} from "../../service/data/user/user.service";
import {Router} from "@angular/router";
import {Message, MessageService, PrimeNGConfig} from "primeng/api";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-my-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser!: User;
  newPassword!: string;
  newPasswordControl!: string;

  messages!: Message[];

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
    this.userService.updateUser(this.currentUser.idUser, this.currentUser)
      .subscribe(data => {
        console.log(data)
        this.messages = [
          {severity:'success', summary:'Sukces', detail:'Poprawnie zapisano dane'},
        ];
      }, error => {
        this.messages = [
          {severity:'error', summary:'Błąd', detail:''}
        ];
      });
  }

  checkPassword(): Observable<boolean> {
    const result = new Subject<boolean>();
    this.userService.login(this.currentUser).subscribe(data => {
      result.next(true);
      result.complete();
      console.log("correct password");
    }, error => {
      result.next(false);
      result.complete();
      console.log("incorrect password");
    })
    return result.asObservable();
  }

  oldPass(event: any) {
    const target = event.target as HTMLInputElement;
    this.currentUser.password = target.value;
  }

  newPass(event: any) {
    const target = event.target as HTMLInputElement;
    this.newPassword = target.value;
  }

  newPass2(event: any) {
    const target = event.target as HTMLInputElement;
    this.newPasswordControl = target.value;
  }

  changePassword() {
    this.checkPassword().subscribe(data => {
      if (data) {
        console.log("old: " + this.currentUser.password);
        if (this.newPassword === this.newPasswordControl) {
          console.log("same passwords")
          this.currentUser.password = this.newPassword;
        }
        console.log("new: " + this.currentUser.password)
        this.userService.changePassword(this.currentUser.idUser, this.currentUser).subscribe(data => {
          console.log(data);
          console.log("password changed");
        })
      }
      else {
        console.log("password not changed")
      }
    })

  }


}



