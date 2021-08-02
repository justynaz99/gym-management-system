import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {ErrorComponent} from "./error/error.component";
import {HomeComponent} from "./home/home.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {ClassesListComponent} from "./classes-list/classes-list.component";
import {MembersListComponent} from "./members-list/members-list.component";
import {WorkoutPlannerComponent} from "./workout-planner/workout-planner.component";
import {TicketsListComponent} from "./tickets-list/tickets-list.component";
import {MyAccountComponent} from "./my-account/my-account.component";
import {AppComponent} from "./app.component";
import {LogoutComponent} from "./logout/logout.component";
import {RouteGuardService} from "./service/route-guard.service";
import {MemberComponent} from "./member/member.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:name', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent, },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'classes-list', component: ClassesListComponent },
  { path: 'members-list', component: MembersListComponent },
  { path: 'workout-planner', component: WorkoutPlannerComponent },
  { path: 'tickets-list', component: TicketsListComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [RouteGuardService] },
  { path: 'members/:id', component: MemberComponent, canActivate: [RouteGuardService] },
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
export class AppRoutingModule { }
