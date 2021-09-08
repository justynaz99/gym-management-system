import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {RegisterComponent} from "./components/register/register.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {ActivitiesListComponent} from "./components/activities-list/activities-list.component";
import {UsersListComponent} from "./components/users-list/users-list.component";
import {WorkoutPlannerComponent} from "./components/workout-planner/workout-planner.component";
import {TicketTypeListComponent} from "./components/ticket-type-list/ticket-type-list.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {ActivityComponent} from "./components/activity/activity.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {UnauthorizedComponent} from "./components/unauthorized/unauthorized.component";
import {AuthGuard} from "./guards/auth.guard";
import {Role} from "./model/role";
import {DetailComponent} from "./components/detail/detail/detail.component";

const routes: Routes = [
  //public pages
  // {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'ticket-type-list', component: TicketTypeListComponent},
  {path: 'activities-list', component: ActivitiesListComponent},
  {path: 'activities/:id', component: ActivityComponent},
  //user + admin pages
  {path: 'home/:name', component: HomeComponent, canActivate: [AuthGuard], data: {roles: [Role.USER, Role.ADMIN]}},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: {roles: [Role.USER, Role.ADMIN]}},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard], data: {roles: [Role.USER, Role.ADMIN]}},
  //admin pages
  {path: 'users-list', component: UsersListComponent, canActivate: [AuthGuard], data: {roles: [Role.ADMIN]}},
  {path: 'detail/:id', component: DetailComponent, canActivate: [AuthGuard], data: {roles: [Role.ADMIN]}},
  {path: 'workout-planner', component: WorkoutPlannerComponent, canActivate: [AuthGuard], data: {roles: [Role.ADMIN]}},
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
