import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ComponentsService } from 'src/app/services/components.service';
import { DocumentService } from 'src/app/services/document.service';
import { HomeService } from 'src/app/services/home.service';
import { ShowDocumentComponent } from '../../modal-components/show-document/show-document.component';
import { MatPaginator } from '@angular/material/paginator';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { RestService } from 'src/app/services/rest/Rest.Service';
import { HttpClient } from '@angular/common/http';
import { Filtering } from 'src/app/services/rest/Filtering';
import { MainService } from 'src/app/services/main.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit, AfterViewInit {

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('ePaginator',{read: MatPaginator}) ePaginator!: MatPaginator;

  public userId = '';
  public nnaName = '';

  public fileToUpload: File | undefined;
  public profilePictureToUpload: File | undefined;

  public documentColumns: string[] = [
    'file_name',
    'date',
    'menu'
  ];

  public expedientDataSource!: CommonDataSource;
  public expedientRestService!: RestService;

  constructor(
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService,
    private apiDocumentService: DocumentService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    this.apiUserService.getUserData(this.userId).subscribe({
      next: (userData: any) => {
        this.nnaName = userData.name + ' ' + userData.surname;
        console.log(userData);
      },
      error: (e) => console.log(e)
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getAllUserExpedientDocument(this.userId);
    });
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

          this.apiDocumentService.setUserExpedient(this.userId, pictureInfo).subscribe(
            {
              next : (info) => {
                this.getAllUserExpedientDocument(this.userId);
                this.alertService.setAlert('Documento guardado.', 'success');
              },
              error: (e) => {
                console.log(e);
                this.alertService.setAlert('Error al guardar el documento. Compruebe que ha de ser PDF.', 'danger');
              },
            }
          )
      }
    }
  }

  public getAllUserExpedientDocument(user_id: string){
    this.expedientRestService = new RestService(this.http, this.changeDetectorRef);
    this.expedientRestService.url = 'v2/getAllUserExpedientDocument';
    this.expedientRestService.filterDefault = [
      new Filtering('user', 'exact', user_id)
    ];
    this.expedientRestService.filter = MainService.deepCopy(this.expedientRestService.filterDefault);
    this.expedientRestService.setPageCallBack = (r: any) => {
        // console.log('received data in users page', r);
    };

    this.expedientDataSource = new CommonDataSource(this.expedientRestService);
    this.expedientDataSource.paginator = this.ePaginator;
    this.expedientDataSource.loadData();

    this.ePaginator.page.subscribe(
      (data) => {
        this.expedientRestService.page.limit = data.pageSize;
        this.expedientRestService.page.offset = data.pageIndex;
        this.expedientDataSource.loadData();
      },
      (e) => {
        console.log(e);
        this.alertService.setAlert('Error al obtener los registros.', 'danger');
      }
    );
  }

  public showDocument(id: string){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {document_id: id,
                        type_document: 'expedient'};
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(ShowDocumentComponent, dialogConfig);
  }

  public deleteDocument(id: string){
    this.apiDocumentService.deleteExpedientDocument(id).subscribe({
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al eliminar el documento.', 'danger');
      },
      complete: () => {
        this.expedientDataSource.loadData();
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
