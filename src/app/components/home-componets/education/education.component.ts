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

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public userId = '';

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
    'type_consultation',
    'what_happens',
    'diagnostic',
    'treatment',
    'revision',
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
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');
    this.getAllUserEducationDocument(this.userId);

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
              },
              error: (e) => {
                console.log(e)
                alert('Solo está permitido subir PDF!');
              }
            }
          )
      }
    }
  }

  public getAllUserEducationDocument(user_id: string){
    this.restServiceDocument = new RestService(this.http, this.changeDetectorRef);
    this.restServiceDocument.url = 'v2/getAllUserEducationDocument';
    this.restServiceDocument.filterDefault = [
      // new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('user_data.phone_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('email', 'like', null),
      // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('user', 'exact', user_id)
    ];
    this.restServiceDocument.filter = MainService.deepCopy(this.restServiceDocument.filterDefault);
    this.restServiceDocument.setPageCallBack = (r: any) => {
        console.log('received data in users page', r);
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
        (error) => {console.log(error)}
      );
    }
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
      error: (e) => console.log(e),
      complete: () => this.documentDataSource.loadData()
    })
  }

  public goBack(){
    this.homeService.updateSelectedComponent('nna');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }
}
