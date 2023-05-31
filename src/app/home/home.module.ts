import { LOCALE_ID, NgModule } from '@angular/core';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { UpdateUserComponent } from '../components/modal-components/update-user/update-user.component';
import { NnaMainComponent } from '../components/home-componets/nna-main/nna-main.component';
import { MainIndividualNnaComponent } from '../components/home-componets/main-individual-nna/main-individual-nna.component';
import { ExpedientComponent } from '../components/home-componets/expedient/expedient.component';
import { ShowDocumentComponent } from '../components/modal-components/show-document/show-document.component';
import { HealthcareComponent } from '../components/home-componets/healthcare/healthcare.component';
import { HealthRecordComponent } from '../components/modal-components/health-record/health-record.component';
import { PrintHealthRecordComponent } from '../components/modal-components/print-health-record/print-health-record.component';
import { EducationComponent } from '../components/home-componets/education/education.component';
import { EducationRecordComponent } from '../components/modal-components/education-record/education-record.component';
import { PrintEducationRecordComponent } from '../components/modal-components/print-education-record/print-education-record.component';
import { ObjectivesComponent } from '../components/home-componets/objectives/objectives.component';
import { PrintObjectiveComponent } from '../components/modal-components/print-objective/print-objective.component';


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
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  declarations: [
    HomePage,
    MainComponent,
    UserRegisterComponent,
    UserManagementComponent,
    UpdateUserComponent,
    NnaMainComponent,
    MainIndividualNnaComponent,
    ExpedientComponent,
    ShowDocumentComponent,
    HealthcareComponent,
    HealthRecordComponent,
    PrintHealthRecordComponent,
    EducationComponent,
    EducationRecordComponent,
    PrintEducationRecordComponent,
    ObjectivesComponent,
    PrintObjectiveComponent
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class HomePageModule {}
