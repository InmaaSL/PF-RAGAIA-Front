import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentsService } from 'src/app/services/components.service';
import { HomeService } from 'src/app/services/home.service';
import { HealthRecordComponent } from '../../modal-components/health-record/health-record.component';
import { DocumentService } from 'src/app/services/document.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { RestService } from 'src/app/services/rest/Rest.Service';
import { HttpClient } from '@angular/common/http';
import { Filtering } from 'src/app/services/rest/Filtering';
import { MainService } from 'src/app/services/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { PrintHealthRecordComponent } from '../../modal-components/print-health-record/print-health-record.component';
import { ShowDocumentComponent } from '../../modal-components/show-document/show-document.component';

import * as moment from 'moment';
import 'moment/locale/es';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-healthcare',
  templateUrl: './healthcare.component.html',
  styleUrls: ['./healthcare.component.css']
})
export class HealthcareComponent implements OnInit, AfterViewInit {

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dPaginator',{read: MatPaginator}) dPaginator!: MatPaginator;
  @ViewChild('rPaginator',{read: MatPaginator}) rPaginator!: MatPaginator;

  public userId = '';
  public nnaName = '';

  public recordDataSource!: CommonDataSource;
  public restService!: RestService;

  public documentDataSource!: CommonDataSource;
  public restServiceDocument!: RestService;

  public recordColumns: string[] = [
    'date',
    'type_consultation',
    'what_happens',
    'diagnostic',
    'treatment',
    'revision',
    'worker',
    'menu'
  ];

  public documentColumns: string[] = [
    'file_name',
    'date',
    'menu'
  ];

  public profilePictureToUpload: File | undefined;

  constructor(
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService,
    public dialog: MatDialog,
    private apiDocumentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    moment.locale('es');
  }

  ngOnInit() {
    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    this.apiUserService.getUserData(this.userId).subscribe({
      next: (userData: any) => {
        this.nnaName = userData.name + ' ' + userData.surname;
      },
      error: (e) => console.log(e)
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getHealthRecord();
      this.getHealthDocument()
    });
  }

  public createHealthRecord(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {nna_id: this.userId};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(HealthRecordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.recordDataSource.loadData();
    });
  }

  public getHealthRecord(){
    this.restService = new RestService(this.http, this.changeDetectorRef);
    this.restService.url = 'v2/healthRecord';
    this.restService.filterDefault = [
      new Filtering('type_consultation', 'like', null),
      new Filtering('user', 'exact', this.userId),
      new Filtering('isDeleted', 'exact', '0')
    ];
    this.restService.filter = MainService.deepCopy(this.restService.filterDefault);
    this.restService.setPageCallBack = (r: any) => {
        // console.log('received data in users page', r);
    };

    this.recordDataSource = new CommonDataSource(this.restService);
    this.recordDataSource.paginator = this.rPaginator;
    this.recordDataSource.loadData();

    this.rPaginator.page.subscribe(
      (data) => {
        this.restService.page.limit = data.pageSize;
        this.restService.page.offset = data.pageIndex;
        this.recordDataSource.loadData();
      },
      (e) => {
        console.log(e);
        this.alertService.setAlert('Error al cargar los registros.', 'danger');
      }
    );
  }

  consultFilter(event: any) {
    this.restService.filter[0].value = event.target.value ? event.target.value : null;
    this.recordDataSource.loadData();
  }

  public getHealthDocument(){
    this.restServiceDocument = new RestService(this.http, this.changeDetectorRef);
    this.restServiceDocument.url = 'v2/getAllUserHealthDocument';
    this.restServiceDocument.filterDefault = [
      new Filtering('user', 'exact', this.userId)
    ];
    this.restServiceDocument.filter = MainService.deepCopy(this.restServiceDocument.filterDefault);
    this.restServiceDocument.setPageCallBack = (r: any) => {
        // console.log('received data in users page', r);
    };

    this.documentDataSource = new CommonDataSource(this.restServiceDocument);
    this.documentDataSource.paginator = this.dPaginator;
    this.documentDataSource.loadData();

    this.dPaginator.page.subscribe(
      (data) => {
        this.restServiceDocument.page.limit = data.pageSize;
        this.restServiceDocument.page.offset = data.pageIndex;
        this.documentDataSource.loadData();
      },
      (e) => {
        console.log(e);
        this.alertService.setAlert('Error al cargar los documentos.', 'danger');
      },
    );
  }

  public formatDate(date: string): string {
    return moment.utc(date).format('LLL');
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

    const dialogRef = this.dialog.open(HealthRecordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.recordDataSource.loadData();
    });
  }

  public deleteRecord(id: string){
    this.apiDocumentService.deleteHealthRecord(id).subscribe({
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

  public viewRegister(document: any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {document: document};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(PrintHealthRecordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      this.recordDataSource.loadData();
    });
  }

  public truncateText(text: string, limit: number) {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }

  public addExpedientDocument(event: any){
    this.profilePictureToUpload = event.files.item(0);

    if (this.profilePictureToUpload != null) {
      if (this.profilePictureToUpload.type.split('/')[0] === 'application') {
        let pictureInfo: FormData = new FormData();
        pictureInfo.append(
          'document',
          this.profilePictureToUpload,
          this.profilePictureToUpload.name
          );
          pictureInfo.append('file_name', this.profilePictureToUpload.name);

          this.apiDocumentService.setUserHealthDocument(this.userId, pictureInfo).subscribe(
            {
              next : (info) => {
                this.alertService.setAlert('Documento guardado con éxito.', 'success');
                this.documentDataSource.loadData();
              },
              error: (e) => {
                console.log(e);
                this.alertService.setAlert('Error al guardar el documento. Recuerde que ha de ser un archivo PDF.', 'danger');
              },
            }
          )
      }
    }
  }

  public showHealthDocument(id: string){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {document_id: id,
                        type_document: 'health'};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(ShowDocumentComponent, dialogConfig);
  }

  public deleteHealthDocument(id: string){
    this.apiDocumentService.deleteHealthDocument(id).subscribe({
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al eliminar el documento.', 'danger');
      },
      complete: () => {
        this.documentDataSource.loadData();
        this.alertService.setAlert('Documento eliminado.', 'success');
      }
    })
  }

  public goBack(){
    this.componentsService.updateSelectedUser(this.userId);
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }

}
