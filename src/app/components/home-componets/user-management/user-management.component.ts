import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiUserService } from 'src/app/services/api-user.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { RestService } from 'src/app/services/rest/Rest.Service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'address',
    'dni',
    'profesional_category',
    'centre',
    'menu'
  ];

  dataSource!: CommonDataSource;
  public restService!: RestService;

  constructor(
    private apiUserService: ApiUserService,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,

  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.restService = new RestService(this.http, this.changeDetectorRef);

      this.restService.url = 'v2/user';

      this.dataSource = new CommonDataSource(this.restService);
      this.dataSource.paginator = this.paginator;
      this.dataSource.loadData();

      this.paginator.page.subscribe((data) => {
        this.restService.page.limit = data.pageSize;
        this.restService.page.offset = data.pageIndex;
        this.dataSource.loadData();
      });

    })
  }

  updateUser(id: string){
    console.log('editemos el usuario');
  }

  deleteUser(id: string){
    console.log('eliminemos el usuario');
  }

}
