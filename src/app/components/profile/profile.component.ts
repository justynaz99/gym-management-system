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
  tempUser: User = new User();

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
      console.log("true");
    }, error => {
      result.next(false);
      result.complete();
      console.log("not true");
    })
    return result.asObservable();
  }

  onKeyUp(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    this.currentUser.password = target.value;
  }

  changePassword() {
    this.checkPassword().subscribe(data => {
      if (data) {
        console.log("changed")
        console.log(this.tempUser.password);
      }
      else {
        console.log("not changed")
      }
    })

  }


}



