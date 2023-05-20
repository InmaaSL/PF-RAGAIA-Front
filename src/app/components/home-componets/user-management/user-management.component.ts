import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiUserService } from 'src/app/services/api-user.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { MainService } from 'src/app/services/main.service';
import { Filtering } from 'src/app/services/rest/Filtering';
import { RestService } from 'src/app/services/rest/Rest.Service';
import { UpdateUserComponent } from '../../modal-components/update-user/update-user.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    public dialog: MatDialog
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
      // new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('user_data.phone_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('email', 'like', null),
      // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('roles', 'like', 'ROLE_WORKER'),
      new Filtering('deleted', 'exact', 0)
    ];

    this.restServiceW.filter = MainService.deepCopy(this.restServiceW.filterDefault);
    this.restServiceW.setPageCallBack = (r: any) => {
        //console.log('received data in users page', r);
    };

    this.workerDataSource = new CommonDataSource(this.restServiceW);
    this.workerDataSource.paginator = this.paginator;
    this.workerDataSource.loadData();

    this.paginator.page.subscribe(
      (data) => {
        this.restServiceW.page.limit = data.pageSize;
        this.restServiceW.page.offset = data.pageIndex;
        this.workerDataSource.loadData();
      },
      (error) => {console.log(error)}
    );
  }

  public getNNA(){
    this.restServiceN = new RestService(this.http, this.changeDetectorRef);

    this.restServiceN.url = 'v2/user';

    this.restServiceN.filterDefault = [
      // new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('user_data.phone_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      // new Filtering('email', 'like', null),
      // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
      new Filtering('roles', 'like', 'ROLE_NNA'),
      new Filtering('deleted', 'exact', 0)
    ];

    this.restServiceN.filter = MainService.deepCopy(this.restServiceN.filterDefault);
    this.restServiceN.setPageCallBack = (r: any) => {
        //console.log('received data in users page', r);
    };

    this.nnaDataSource = new CommonDataSource(this.restServiceN);
    this.nnaDataSource.paginator = this.paginator;
    this.nnaDataSource.loadData();

    this.paginator.page.subscribe((data) => {
      this.restServiceN.page.limit = data.pageSize;
      this.restServiceN.page.offset = data.pageIndex;
      this.nnaDataSource.loadData();
    });
  }

  updateUser(id: string){
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

  deleteUser(id: string){
    this.apiUserService.deleteUser(id).subscribe({
      error: (e) => console.log(e),
      complete: () => {
        this.nnaDataSource.loadData();
        this.workerDataSource.loadData();
      }
    })
  }

}
