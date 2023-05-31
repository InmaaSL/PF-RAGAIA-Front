import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public userId = '';
  public nnaName = '';

  public fileToUpload: File | undefined;
  public profilePictureToUpload: File | undefined;

  public documents : [] | undefined;

  public errorImagenPerfil = false;

  public documentColumns: string[] = [
    'file_name',
    'date',
    'menu'
  ];

  public documentDataSource!: CommonDataSource;
  public restService!: RestService;

  constructor(
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService,
    private apiDocumentService: DocumentService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
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

    this.getAllUserExpedientDocument(this.userId);
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

  public getAllUserExpedientDocument(user_id: string){
    this.restService = new RestService(this.http, this.changeDetectorRef);
    this.restService.url = 'v2/getAllUserExpedientDocument';
    this.restService.filterDefault = [
      // new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('user_data.phone_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('email', 'like', null),
      // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('user', 'exact', user_id)
    ];
    this.restService.filter = MainService.deepCopy(this.restService.filterDefault);
    this.restService.setPageCallBack = (r: any) => {
        console.log('received data in users page', r);
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
      error: (e) => console.log(e),
      complete: () => this.documentDataSource.loadData()
    })
  }

  public goBack(){
    this.componentsService.updateSelectedUser(this.userId);
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }

  public addProfilePicture(event: any) {
    this.fileToUpload = event.files.item(0);
    if (this.fileToUpload != null) {
      if (this.fileToUpload.type.split('/')[0] === 'image') {
        const pictureInfo: FormData = new FormData();
        pictureInfo.append(
          'profile_pic',
          this.fileToUpload,
          this.fileToUpload.name
        );
        this.apiDocumentService.setProfilePic(pictureInfo).subscribe(
          (data:any) => {
            if (data['error']) {
              this.errorImagenPerfil = true;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
          }
        );
      } else {
        alert('No es un pdf!');
      }
    }
  }

}
