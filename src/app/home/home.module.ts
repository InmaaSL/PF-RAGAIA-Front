import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MainComponent } from '../components/home-componets/main/main.component';
import { UserRegisterComponent } from '../components/home-componets/user-register/user-register.component';
import { UserManagementComponent } from '../components/home-componets/user-management/user-management.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    MainComponent,
    UserRegisterComponent,
    UserManagementComponent
  ]
})
export class HomePageModule {}
