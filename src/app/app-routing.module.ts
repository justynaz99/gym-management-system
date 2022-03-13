import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {TicketTypeComponent} from "./components/ticket-type/ticket-type.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {ActivityComponent} from "./components/activity/activity.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {UnauthorizedComponent} from "./components/unauthorized/unauthorized.component";
import {AuthGuard} from "./service/guards/auth.guard";
import {UserComponent} from "./components/user/user.component";
import {EditUserComponent} from "./components/edit-user/edit-user.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {StaffComponent} from "./components/staff/staff.component";
import {RoleEnum} from "./model/role-enum";

const routes: Routes = [
  //public pages
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'ticket-type', component: TicketTypeComponent},
  {path: 'activity', component: ActivityComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: {roles: [RoleEnum.ADMIN, RoleEnum.STAFF, RoleEnum.USER]}},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard], data: {roles: [RoleEnum.ADMIN, RoleEnum.STAFF]}},
  {path: 'staff', component: StaffComponent, canActivate: [AuthGuard], data: {roles: [RoleEnum.ADMIN]}},
  {path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard], data: {roles: [RoleEnum.ADMIN, RoleEnum.STAFF]}},
  //public error pages
  {path: '404', component: NotFoundComponent},
  {path: '401', component: UnauthorizedComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      console.log(error)
      this.router.navigate(['/404']);
    }
  }
}
