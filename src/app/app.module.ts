import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './home/home.component';

import {AccordionModule} from 'primeng/accordion';
import {MenuItem} from 'primeng/api';
import {TabMenuModule} from 'primeng/tabmenu';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from 'primeng/card';
import {PasswordModule} from "primeng/password";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import { RegistrationComponent } from './registration/registration.component';
import {InputMaskModule} from "primeng/inputmask";
import { ScheduleComponent } from './schedule/schedule.component';
import { ClassesListComponent } from './classes-list/classes-list.component';
import { MembersListComponent } from './members-list/members-list.component';
import { WorkoutPlannerComponent } from './workout-planner/workout-planner.component';
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {SortIcon, TableHeaderCheckbox, TableModule} from "primeng/table";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    HomeComponent,
    RegistrationComponent,
    ScheduleComponent,
    ClassesListComponent,
    MembersListComponent,
    WorkoutPlannerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TabMenuModule,
    AccordionModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    PasswordModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    InputMaskModule,
    ToolbarModule,
    FileUploadModule,
    TableModule,



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
