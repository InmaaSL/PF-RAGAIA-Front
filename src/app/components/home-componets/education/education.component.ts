import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ComponentsService } from 'src/app/services/components.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { HomeService } from 'src/app/services/home.service';
import { RestService } from 'src/app/services/rest/Rest.Service';
import { ShowDocumentComponent } from '../../modal-components/show-document/show-document.component';
import { DocumentService } from 'src/app/services/document.service';
import { HttpClient } from '@angular/common/http';
import { Filtering } from 'src/app/services/rest/Filtering';
import { MainService } from 'src/app/services/main.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import * as moment from 'moment';
import 'moment/locale/es';
import { EducationRecordComponent } from '../../modal-components/education-record/education-record.component';
import { PrintEducationRecordComponent } from '../../modal-components/print-education-record/print-education-record.component';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public userId = '';
  public nnaName = '';

  public recordDataSource!: CommonDataSource;
  public restService!: RestService;

  public documentDataSource!: CommonDataSource;
  public restServiceDocument!: RestService;

  public documentUpload: File | undefined;

  public documentColumns: string[] = [
    'file_name',
    'date',
    'menu'
  ];

  public recordColumns: string[] = [
    'date',
    'type_record',
    'description',
    'worker',
    'menu'
  ];

  constructor(
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService,
    private apiDocumentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    public dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    this.apiUserService.getUserData(this.userId).subscribe({
      next: (userData: any) => {
        this.nnaName = userData.name + ' ' + userData.surname;
      },
      error: (e) => console.log(e)
    });

    this.getAllUserEducationDocument(this.userId);
    this.getEducationRecord();

  }

  public addEducationDocument(event: any){
    this.documentUpload = event.files.item(0);

    if (this.documentUpload != null) {
      if (this.documentUpload.type.split('/')[0] === 'application') {
        let pictureInfo: FormData = new FormData();
        pictureInfo.append(
          'document',
          this.documentUpload,
          this.documentUpload.name
          );
          pictureInfo.append('file_name', this.documentUpload.name);

          this.apiDocumentService.setUserEducationDocument(this.userId, pictureInfo).subscribe(
            {
              next : (info) => {
                this.documentDataSource.loadData();
                this.alertService.setAlert('Documento guardado.', 'success');
              },
              error: (e) => {
                console.log(e);
                this.alertService.setAlert('Ha ocurrido un error guardando el documento. Revise que sea PDF.', 'danger');
              },
            }
          )
      }
    }
  }

  public getAllUserEducationDocument(user_id: string){
    this.restServiceDocument = new RestService(this.http, this.changeDetectorRef);
    this.restServiceDocument.url = 'v2/getAllUserEducationDocument';
    this.restServiceDocument.filterDefault = [
      // new Filtering('type_record', 'like', null),
      new Filtering('user', 'exact', user_id)
    ];
    this.restServiceDocument.filter = MainService.deepCopy(this.restServiceDocument.filterDefault);
    this.restServiceDocument.setPageCallBack = (r: any) => {
        // console.log('received data in users page', r);
    };

    this.documentDataSource = new CommonDataSource(this.restServiceDocument);
    this.documentDataSource.paginator = this.paginator;
    this.documentDataSource.loadData();

    if(this.paginator && this.paginator.page){
      this.paginator.page.subscribe(
        (data) => {
          this.restServiceDocument.page.limit = data.pageSize;
          this.restServiceDocument.page.offset = data.pageIndex;
          this.documentDataSource.loadData();
        },
        (error) => {
          console.log(error);
          this.alertService.setAlert('Error al cargar los regisrtos.', 'danger');
        }
      );
    }
  }

  public registerFilter(event: any) {
    this.restService.filter[0].value = event.target.value ? event.target.value : null;
    this.recordDataSource.loadData();
  }

  public showEducationDocument(id: string){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {document_id: id,
                        type_document: 'education'};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(ShowDocumentComponent, dialogConfig);
  }

  public deleteEducationDocument(id: string){
    this.apiDocumentService.deleteEducationDocument(id).subscribe({
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al eliminar el documento.', 'danger');
      },
      complete: () => {
        this.alertService.setAlert('Documento elimiando.', 'success');
        this.documentDataSource.loadData();
      }
    })
  }

  public createEducationRecord(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {nna_id: this.userId};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(EducationRecordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.recordDataSource.loadData();
    });
  }

  public getEducationRecord(){
    this.restService = new RestService(this.http, this.changeDetectorRef);
    this.restService.url = 'v2/educationRecord';
    this.restService.filterDefault = [
      new Filtering('type_record', 'like', null),
      new Filtering('user', 'exact', this.userId),
      new Filtering('isDeleted', 'exact', '0')
    ];
    this.restService.filter = MainService.deepCopy(this.restService.filterDefault);
    this.restService.setPageCallBack = (r: any) => {
        // console.log('received data in users page', r);
    };

    this.recordDataSource = new CommonDataSource(this.restService);
    this.recordDataSource.paginator = this.paginator;
    this.recordDataSource.loadData();

    if(this.paginator && this.paginator.page){
      this.paginator.page.subscribe(
        (data) => {
          this.restService.page.limit = data.pageSize;
          this.restService.page.offset = data.pageIndex;
          this.recordDataSource.loadData();
        },
        (error) => {
          console.log(error);
          this.alertService.setAlert('Error al cargar los regisrtos.', 'danger');
        }
      );
    }
  }

  public editRecord(document: any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {document: document};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(EducationRecordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.recordDataSource.loadData();
    });
  }

  public deleteRecord(id: string){
    this.apiDocumentService.deleteEducationRecord(id).subscribe({
      complete: () => {
        this.alertService.setAlert('Registro eliminado.', 'success');
        this.recordDataSource.loadData();
      },
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al eliminar el registro.', 'danger');
      },
    });
  }

  public viewRecord(document: any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {document: document};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(PrintEducationRecordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.recordDataSource.loadData();
    });
  }

  public formatDate(date: string): string {
    return moment.utc(date).format('LLL');
  }

  public truncateText(text: string, limit: number) {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }

  public goBack(){
    this.componentsService.updateSelectedUser(this.userId);
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }
}
