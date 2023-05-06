import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SharedComponentsModule } from '../share-material/shared-components.module';
import { SharedMaterialsModule } from '../share-material/shared-materials.module';
import { LoginComponent } from '../components/login-components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedComponentsModule,
    SharedMaterialsModule,
  ],
  declarations: [
    LoginPage,
    LoginComponent
  ],
})
export class LoginPageModule {}
