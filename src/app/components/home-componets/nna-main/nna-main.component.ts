import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ComponentsService } from 'src/app/services/components.service';
import { CommonDataSource } from 'src/app/services/dataSources/common.datasource';
import { HomeService } from 'src/app/services/home.service';
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
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService
  ) { }

  ngOnInit() {}

  ngAfterViewInit(){
    setTimeout(() => {
      this.getNNA();
    })
  }

  public getNNA(){
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

  public getInitial(name: string): string {
    if (name && name.length > 0) {
      return name.charAt(0);
    }
    return '';
  }

  public goToNna(userId: any){
    this.componentsService.updateSelectedUser(userId);
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }

}
