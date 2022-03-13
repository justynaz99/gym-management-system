import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HomeComponent } from './components/home/home.component';
import {AccordionModule} from 'primeng/accordion';
import {TabMenuModule} from 'primeng/tabmenu';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from 'primeng/card';
import {PasswordModule} from "primeng/password";
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import { RegisterComponent } from './components/register/register.component';
import {InputMaskModule} from "primeng/inputmask";
import { ScheduleComponent } from './components/schedule/schedule.component';
import {ToolbarModule} from "primeng/toolbar";
import {FileUploadModule} from "primeng/fileupload";
import {SortIcon, TableHeaderCheckbox, TableModule} from "primeng/table";
import {DividerModule} from "primeng/divider";
import { TicketTypeComponent } from './components/ticket-type/ticket-type.component';
import {OrderListModule} from 'primeng/orderlist';
import { ProfileComponent } from './components/profile/profile.component';
import { LogoutComponent } from './components/logout/logout.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ActivityComponent} from "./components/activity/activity.component";
import {FullCalendarModule} from 'primeng/fullcalendar';
import {TabViewModule} from 'primeng/tabview';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import {CalendarModule} from "primeng/calendar";
import {KeyFilterModule} from "primeng/keyfilter";
import {MenubarModule} from "primeng/menubar";
import {DialogModule} from "primeng/dialog";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {InputTextareaModule} from "primeng/inputtextarea";
import {AutoCompleteModule} from "primeng/autocomplete";
import {PanelModule} from "primeng/panel";
import {DropdownModule} from "primeng/dropdown";
import {FieldsetModule} from "primeng/fieldset";
import { UserComponent } from './components/user/user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

import localePl from '@angular/common/locales/pl'
import {CommonModule, registerLocaleData} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { StaffComponent } from './components/staff/staff.component';

registerLocaleData(localePl);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ScheduleComponent,
    TicketTypeComponent,
    ProfileComponent,
    LogoutComponent,
    ActivityComponent,
    NotFoundComponent,
    UnauthorizedComponent,
    UserComponent,
    EditUserComponent,
    ResetPasswordComponent,
    StaffComponent
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
    DividerModule,
    OrderListModule,
    HttpClientModule,
    FullCalendarModule,
    TabViewModule,
    CalendarModule,
    KeyFilterModule,
    MenubarModule,
    DialogModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    InputTextareaModule,
    AutoCompleteModule,
    PanelModule,
    DropdownModule,
    FieldsetModule,
    CommonModule,
    RippleModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

}
