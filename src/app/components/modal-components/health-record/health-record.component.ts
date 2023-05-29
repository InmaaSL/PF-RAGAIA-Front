import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { error } from 'console';
import { DocumentService } from 'src/app/services/document.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-health-record',
  templateUrl: './health-record.component.html',
  styleUrls: ['./health-record.component.css']
})
export class HealthRecordComponent implements OnInit {

  public myForm: FormGroup;
  public registerSubmitted = false;
  public healthRecordInfo: HttpParams | undefined;

  public document: any;

  constructor(
    private apiDocumentService: DocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.myForm = new FormGroup({
      type_consultation: new FormControl('', Validators.required),
      consultation_date: new FormControl('', Validators.required),
      what_happens: new FormControl('', Validators.required),
      treatment: new FormControl('', Validators.required),
      diagnostic: new FormControl('', Validators.required),
      revision: new FormControl('', Validators.required)
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
      .set('type_consultation', this.myForm.value.type_consultation ?? '' )
      .set('consultation_date', this.myForm.value.consultation_date ?? '' )
      .set('what_happens', this.myForm.value.what_happens ?? '' )
      .set('diagnostic', this.myForm.value.diagnostic ?? '' )
      .set('treatment', this.myForm.value.treatment ?? '' )
      .set('revision', this.myForm.value.revision ?? '' )

      if(this.document){
        this.apiDocumentService.editHealthRecord(this.document.id, this.healthRecordInfo).subscribe({
          error: (e) => console.log(e),
          complete: () => {
            this.dialog.closeAll();
          }
        })
      } else {
        this.apiDocumentService.setHealthRecord(this.data.nna_id, this.healthRecordInfo).subscribe({
          error: (e) => console.log(e),
          complete: () => {
            this.dialog.closeAll();
          }
        })
      }

    }
  }

  showInfo(document: any){
    this.myForm.patchValue(document);
    const date = this.myForm.value.consultation_date;
    this.myForm.patchValue({ consultation_date: date.slice(0, 16) });
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
