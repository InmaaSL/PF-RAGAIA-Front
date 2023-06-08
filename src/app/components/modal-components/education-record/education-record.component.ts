import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-education-record',
  templateUrl: './education-record.component.html',
  styleUrls: ['./education-record.component.css']
})
export class EducationRecordComponent implements OnInit {

  public myForm: FormGroup;
  public registerSubmitted = false;
  public healthRecordInfo: HttpParams | undefined;

  public document: any;

  constructor(
    private apiDocumentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.myForm = new FormGroup({
      type_record: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });

  }

  ngOnInit() {
    if(this.data.document){
      this.document = this.data.document;
      this.showInfo(this.document);
    }
  }

  onSubmit() {
    this.registerSubmitted = true;
    if (this.myForm.valid) {
      this.registerSubmitted = false;

      this.healthRecordInfo = new HttpParams()
      .set('type_record', this.myForm.value.type_record ?? '' )
      .set('description', this.myForm.value.description ?? '' )

      if(this.document){
        this.apiDocumentService.editEducationRecord(this.document.id, this.healthRecordInfo).subscribe({
          error: (e) => {
            console.log(e);
            this.alertService.setAlert('Error al guardar el registro.', 'danger');
          },
          complete: () => {
            this.alertService.setAlert('Registro guardado con éxito.', 'success');
            this.dialog.closeAll();
          }
        })
      } else {
        this.apiDocumentService.setUserEducationRecord(this.data.nna_id, this.healthRecordInfo).subscribe({
          error: (e) => {
            console.log(e);
            this.alertService.setAlert('Error al guardar el registro.', 'danger');
          },
          complete: () => {
            this.alertService.setAlert('Registro guardado con éxito.', 'success');
            this.dialog.closeAll();
          }
        })
      }

    }
  }

  showInfo(document: any){
    this.myForm.patchValue(document);
    // const date = this.myForm.value.date;
    // this.myForm.patchValue({ consultation_date: date.slice(0, 16) });
  }

  public getDate(date: string){
    let stringDate;
    if (!date) {
      stringDate = new Date();
    } else {
      stringDate = new Date(date);
    }

    const day = stringDate.getDate();
    const month = stringDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const year = stringDate.getFullYear();
    const hours = stringDate.getHours();
    const minutes = stringDate.getMinutes();
    const seconds = stringDate.getSeconds();

    const typeDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return typeDateTime;

  }


  public print(){
    window.print();
  }


}
