import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiUserService } from 'src/app/services/api-user.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { MainService } from 'src/app/services/main.service';
import { Filtering } from 'src/app/services/rest/Filtering';
import { RestService } from 'src/app/services/rest/Rest.Service';

@Component({
  selector: 'app-nna-main',
  templateUrl: './nna-main.component.html',
  styleUrls: ['./nna-main.component.css']
})
export class NnaMainComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public restServiceN!: RestService;
  public nnaDataSource!: CommonDataSource;

  nna = [];

  constructor(
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private apiUserService: ApiUserService,
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.getNNA();
    })
  }

  public getNNA(){
    // this.restServiceN = new RestService(this.http, this.changeDetectorRef);

    // this.restServiceN.url = 'v2/user';

    // this.restServiceN.filterDefault = [
    //   // new Filtering('user_data.name+user_data.surname:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
    //   // new Filtering('user_data.phone_number:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
    //   // new Filtering('email', 'like', null),
    //   // new Filtering('user_data.address:user:App\\Entity\\UserData', 'reverseEntityFieldLike', null),
    //   new Filtering('roles', 'like', 'ROLE_NNA'),
    //   new Filtering('deleted', 'exact', 0)
    // ];

    // this.restServiceN.filter = MainService.deepCopy(this.restServiceN.filterDefault);
    // this.restServiceN.setPageCallBack = (r: any) => {
    //     //console.log('received data in users page', r);
    // };

    // this.nnaDataSource = new CommonDataSource(this.restServiceN);
    // this.nnaDataSource.loadData();
    this.apiUserService.getUsersDataType('nna').subscribe({
      next: (nna: any) => {

        this.nna = nna.map((element: any) => {
          const birth_date = new Date(element.userData.birth_date);
          const today: Date = new Date();
          const difference: number = today.getTime() - birth_date.getTime();
          const age: number = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
          return { ...element, age };
        });
      }
    })

  }

  getInitial(name: string): string {
    if (name && name.length > 0) {
      return name.charAt(0);
    }
    return '';
  }


}
