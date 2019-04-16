import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './_services';

import { routing } from './app.routing';
import { AuthGuardService, FakeBackendProvider } from './_services';
import { FakeBackendService } from './_services/fake-backend.service';
import { UserService } from './_services/user.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, routing ],
  declarations: [ AppComponent, LoginComponent, AdminComponent, HomeComponent ],
  bootstrap:    [ AppComponent ],
  providers: [AuthenticationService, AuthGuardService, FakeBackendProvider, UserService]
})
export class AppModule { }
