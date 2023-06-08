import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiUserService } from 'src/app/services/api-user.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { MainService } from 'src/app/services/main.service';
import { Filtering } from 'src/app/services/rest/Filtering';
import { RestService } from 'src/app/services/rest/Rest.Service';
import { UpdateUserComponent } from '../../modal-components/update-user/update-user.component';
import { MatDialog } from '@angular/material/dialog';
import { HomeService } from 'src/app/services/home.service';
import { AlertService } from 'src/app/services/alert.service';
import { ApiConnectService } from 'src/app/services/api-connect.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit {

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('wPaginator',{read: MatPaginator}) wPaginator!: MatPaginator;
  @ViewChild('nPaginator',{read: MatPaginator}) nPaginator!: MatPaginator;
  // @ViewChild(MatPaginator) nnaPaginator!: MatPaginator;

  // @ViewChild('workerPaginator') workerPaginator!: MatPaginator;
  // @ViewChild('nnaPaginator') nnaPaginator!: MatPaginator;

  public displayedWorkerColumns: string[] = [
    'name',
    'phone',
    'email',
    'address',
    'dni',
    'professional_category',
    'centre',
    'menu'
  ];

  public displayedNNAColumns: string[] = [
    'name',
    'birthDate',
    'case_number',
    'custodyType',
    'dni',
    'centre',
    'menu'
  ];

  public workerDataSource!: CommonDataSource;
  public nnaDataSource!: CommonDataSource;

  public restServiceW!: RestService;
  public restServiceN!: RestService;

  constructor(
    private apiUserService: ApiUserService,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private homeService: HomeService,
    private alertService: AlertService,
    private apiConnectService: ApiConnectService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.getWorkers();
      this.getNNA();
    })
  }

  public getWorkers(){
    this.restServiceW = new RestService(this.http, this.changeDetectorRef);

    this.restServiceW.url = 'v2/user';

    this.restServiceW.filterDefault = [
      new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('user_data.phone:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('email', 'like', null),
      new Filtering('user_data.dni:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('roles', 'like', 'ROLE_WORKER'),
      new Filtering('deleted', 'exact', 0)
    ];

    this.restServiceW.filter = MainService.deepCopy(this.restServiceW.filterDefault);
    this.restServiceW.setPageCallBack = (r: any) => {
        console.log('received data in users page', r);
    };

    this.workerDataSource = new CommonDataSource(this.restServiceW);
    this.workerDataSource.paginator = this.wPaginator;
    this.workerDataSource.loadData();

    this.wPaginator.page.subscribe(
      (data) => {
        this.restServiceW.page.limit = data.pageSize;
        this.restServiceW.page.offset = data.pageIndex;
        this.workerDataSource.loadData();
      },
      (error) => {console.log(error)}
    );
  }

  public nameFilterW(event: any) {
    this.restServiceW.filter[0].value = event.target.value ? event.target.value : null;
    this.workerDataSource.loadData();
  }

  public phoneFilterW(event: any) {
    this.restServiceW.filter[1].value = event.target.value ? event.target.value : null;
    this.workerDataSource.loadData();
  }

  public emailFilterW(event: any) {
    this.restServiceW.filter[2].value = event.target.value ? event.target.value : null;
    this.workerDataSource.loadData();
  }

  public dniFilterW(event: any) {
    this.restServiceN.filter[3].value = event.target.value ? event.target.value : null;
    this.nnaDataSource.loadData();
  }

  public getNNA(){
    this.restServiceN = new RestService(this.http, this.changeDetectorRef);

    this.restServiceN.url = 'v2/user';

    this.restServiceN.filterDefault = [
      new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('user_data.case_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('user_data.dni:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('roles', 'like', 'ROLE_NNA'),
      new Filtering('deleted', 'exact', 0)
    ];

    this.restServiceN.filter = MainService.deepCopy(this.restServiceN.filterDefault);
    this.restServiceN.setPageCallBack = (r: any) => {
        //console.log('received data in users page', r);
    };

    this.nnaDataSource = new CommonDataSource(this.restServiceN);
    this.nnaDataSource.paginator = this.nPaginator;
    this.nnaDataSource.loadData();

    this.nPaginator.page.subscribe((data) => {
      this.restServiceN.page.limit = data.pageSize;
      this.restServiceN.page.offset = data.pageIndex;
      this.nnaDataSource.loadData();
    });
  }

  public nameFilterN(event: any) {
    this.restServiceN.filter[0].value = event.target.value ? event.target.value : null;
    console.log(this.restServiceN.filter[0].value)
    this.nnaDataSource.loadData();
  }

  public expedientFilterN(event: any) {
    this.restServiceN.filter[1].value = event.target.value ? event.target.value : null;
    this.nnaDataSource.loadData();
  }

  public dniFilterN(event: any) {
    this.restServiceN.filter[2].value = event.target.value ? event.target.value : null;
    this.nnaDataSource.loadData();
  }

  public updateUser(id: string){
    const dialogRef = this.dialog.open(
      UpdateUserComponent,
      {
        data: { userId: id }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.nnaDataSource.loadData();
      this.workerDataSource.loadData();
    });

  }

  public deleteUser(id: string){
    this.apiUserService.deleteUser(id).subscribe({
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al eliminar el registro.', 'danger');
      },
      complete: () => {
        this.alertService.setAlert('Usuario eliminado.', 'success');
        this.nnaDataSource.loadData();
        this.workerDataSource.loadData();
      }
    })
  }

  async resetPassword(email: string) {
    console.log(email)

    const emailÏnfo = new HttpParams()
    .set('email', email );

    this.apiConnectService.resetPassword(emailÏnfo).subscribe({
      error: (e) => console.log(e),
      complete: () => {
        this.alertService.setAlert('Se ha mandado un correo al usuario para que reestablezca su contraseña.', 'success');
      }
    })
  }

  public goBack(){
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

}
