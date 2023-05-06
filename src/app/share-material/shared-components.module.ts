import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from '../components/login-components/reset-password/reset-password.component';
import { LoginComponent } from '../components/login-components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [
  ResetPasswordComponent,
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: components
})
export class SharedComponentsModule { }
