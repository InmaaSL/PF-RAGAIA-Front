import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-healthcare',
  templateUrl: './healthcare.component.html',
  styleUrls: ['./healthcare.component.css']
})
export class HealthcareComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public userId = '';
  public documentDataSource!: CommonDataSource;
  public restService!: RestService;

  public documentColumns: string[] = [
    'date',
    'type_consultation',
    'what_happens',
    'diagnostic',
    'treatment',
    'revision',
    'worker',
    'menu'
  ];

  constructor(
    private homeService: HomeService,
    private componentsService: ComponentsService,
    public dialog: MatDialog,
    private apiDocumentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
  ) {
    moment.locale('es');
  }

  ngOnInit() {
    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    this.getHealthRecord();
  }

  createHealthRecord(){
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
      this.documentDataSource.loadData();
    });
  }

  getHealthRecord(){
    this.restService = new RestService(this.http, this.changeDetectorRef);
    this.restService.url = 'v2/healthRecord';
    this.restService.filterDefault = [
      // new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('user_data.phone_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('email', 'like', null),
      // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('user', 'exact', this.userId),
      new Filtering('isDeleted', 'exact', '0')
    ];
    this.restService.filter = MainService.deepCopy(this.restService.filterDefault);
    this.restService.setPageCallBack = (r: any) => {
        // console.log('received data in users page', r);
    };

    this.documentDataSource = new CommonDataSource(this.restService);
    this.documentDataSource.paginator = this.paginator;
    this.documentDataSource.loadData();

    if(this.paginator && this.paginator.page){
      this.paginator.page.subscribe(
        (data) => {
          this.restService.page.limit = data.pageSize;
          this.restService.page.offset = data.pageIndex;
          this.documentDataSource.loadData();
        },
        (error) => {console.log(error)}
      );
    }
  }

  formatDate(date: string): string {
    return moment.utc(date).format('LLL');
  }

  editDocument(document: any){

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
      this.documentDataSource.loadData();
    });
  }

  deleteDocument(id: string){
    this.apiDocumentService.deleteHealthRecord(id).subscribe({
      complete: () => {
        console.log('Registro eliminado');
        this.documentDataSource.loadData();
      },
      error: (e) => console.log(e)
    });
  }

  viewRegister(document: any){
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
      this.documentDataSource.loadData();
    });
  }

  truncateText(text: string, limit: number) {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }


  goBack(){
    this.componentsService.updateSelectedUser(this.userId);
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

  close(){
    this.homeService.updateSelectedComponent('main');
  }

}
