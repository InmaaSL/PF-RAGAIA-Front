import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MainComponent } from '../components/home-componets/main/main.component';
import { UserRegisterComponent } from '../components/home-componets/user-register/user-register.component';
import { UserManagementComponent } from '../components/home-componets/user-management/user-management.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { UpdateUserComponent } from '../components/modal-components/update-user/update-user.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [
    HomePage,
    MainComponent,
    UserRegisterComponent,
    UserManagementComponent,
    UpdateUserComponent,
  ]
})
export class HomePageModule {}
