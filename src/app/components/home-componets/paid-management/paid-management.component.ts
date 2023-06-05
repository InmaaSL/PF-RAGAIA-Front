import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaidService } from 'src/app/services/paid.service';
import { EditPaidManagementComponent } from '../../modal-components/edit-paid-management/edit-paid-management.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-paid-management',
  templateUrl: './paid-management.component.html',
  styleUrls: ['./paid-management.component.css']
})
export class PaidManagementComponent implements OnInit {

  public paidManagement = [];

  public edit: boolean = false;
  public formGroup: FormGroup | any;

  constructor(
    private paidService: PaidService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getPaidManagement();
  }

  public getPaidManagement(){
    this.paidService.getPaidManagements().subscribe({
      next: (paidManagement: any) => {
        this.paidManagement = paidManagement;
        console.log(this.paidManagement);
      },
      error: (e) => console.log(e)
    })
  }


  public editItem(item: any) {
    item.editing = true;
    console.log('Edit item:', item);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '55%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {
      paidManagement: item
    }
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(EditPaidManagementComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.getPaidManagement();
      this.saveItem(item);
    });

  }

  public saveItem(item: any) {
    item.editing = false;
    console.log('Edit item:', item);
  }

}
