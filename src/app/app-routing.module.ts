import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {WorkoutPlannerComponent} from "./components/workout-planner/workout-planner.component";
import {TicketTypeComponent} from "./components/ticket-type/ticket-type.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {ActivityComponent} from "./components/activity/activity.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {UnauthorizedComponent} from "./components/unauthorized/unauthorized.component";
import {AuthGuard} from "./guards/auth.guard";
import {Role} from "./model/role";
import {DetailComponent} from "./components/detail/detail/detail.component";
import {UserComponent} from "./components/user/user.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {EditUserComponent} from "./components/edit-user/edit-user.component";

const routes: Routes = [
  //public pages
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'ticket-type', component: TicketTypeComponent},
  {path: 'activity', component: ActivityComponent},
  //user + admin pages
  {path: 'home/:name', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'payment', component: PaymentComponent, canActivate: [AuthGuard]},
  //admin pages
  {path: 'detail/:id', component: DetailComponent, canActivate: [AuthGuard]},
  {path: 'workout-planner', component: WorkoutPlannerComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard]},
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
      this.router.navigate(['/404']);
    }
  }
}
