import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Mfe1RoutingModule } from './mfe-routing.module';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { LoaderComponent } from './loader/loader.component';
import "../../styles.css";

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Mfe1RoutingModule
  ]
})
export class MfeModule { }
