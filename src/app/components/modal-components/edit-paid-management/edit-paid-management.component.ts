import { HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { PaidService } from 'src/app/services/paid.service';

@Component({
  selector: 'app-edit-paid-management',
  templateUrl: './edit-paid-management.component.html',
  styleUrls: ['./edit-paid-management.component.css']
})
export class EditPaidManagementComponent implements OnInit {

  public formGroup: FormGroup | any;


  constructor(
    private paidService: PaidService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      age: [this.data.paidManagement.age, Validators.required],
      age_min: [this.data.paidManagement.age_range[0], Validators.required],
      age_max: [this.data.paidManagement.age_range[1], Validators.required],
      max_pay: [this.data.paidManagement.max_pay, Validators.required],
      min_pay: [this.data.paidManagement.min_pay, Validators.required],
      incentive: [this.data.paidManagement.incentive, Validators.required]
    });
  }

  public saveItem() {
    if(this.formGroup.valid){
      const age_range = this.formGroup.value.age_min + ',' + this.formGroup.value.age_max;

      const info = new HttpParams()
      .set('age', this.formGroup.value.age ?? '' )
      .set('age_range', age_range )
      .set('max_pay', this.formGroup.value.max_pay ?? '' )
      .set('min_pay', this.formGroup.value.min_pay ?? '' )
      .set('incentive', this.formGroup.value.incentive ?? '' );

      this.paidService.savePaidManagement(this.data.paidManagement.id, info).subscribe({
        next: (paidManagement) => {
          this.alertService.setAlert('Registro guardado.', 'success');
        },
        error: (e) => {
          console.log(e);
          this.alertService.setAlert('Algo ha ocurrido al tratar de guardar el registro.', 'danger');
        },
        complete: () => this.dialog.closeAll()
      })
    }
  }


}
