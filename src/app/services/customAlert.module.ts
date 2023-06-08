import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from '../components/modal-components/alert/alert.component';

@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgbModule,
  ],
  exports: [AlertComponent],
})
export class CustomAlertModule { }
