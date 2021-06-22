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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    HomeComponent
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
    ToastModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
