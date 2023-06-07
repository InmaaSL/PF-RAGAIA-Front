import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiConnectService } from 'src/app/services/api-connect.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { CalendarService } from 'src/app/services/calendar.service';
import { HomeService } from 'src/app/services/home.service';
import * as moment from 'moment';
import { ComponentsService } from 'src/app/services/components.service';


@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent  implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;


  public loading = false;
  public userName = '';
  public today = '';
  public events: any[] = [];

  constructor(
    private apiUserService: ApiUserService,
    private apiConnectService: ApiConnectService,
    private authService: AuthService,
    public homeService: HomeService,
    private apiCalendarService: CalendarService,
    private componentsService: ComponentsService
  ) { }

  ngOnInit() {
    this.today = moment().format('LL');


    this.authService.getUserInfo().subscribe({
      next: (next) => {
        console.log('userData');
        this.loadData();
      },
      error: (e) => console.log(e)
    });
  }

  public loadData(){
    this.apiConnectService.getUserInfo().subscribe(
      {
        next: (userData:any) => {
          if(userData) {
            this.loading = true;
            this.userName = userData.userData.name + ' ' + userData.userData.surname;
            this.getEvents();
          }
        }

      }
    )
    // this.authService.getUserData().subscribe({
    //   next: (userData:any) => {
    //     console.log(userData);
    //     if(userData) {
    //       this.userName = userData['name'] + ' ' + userData['surname'];
    //       this.getEvents();
    //     }
    //   }
    // });
  }

  public getEvents(){
    const date = moment(this.today, 'D [de] MMMM [de] YYYY');
    const convertedDate = date.format('YYYY-MM-DD');

    this.apiCalendarService.getDayCalendarEntry(convertedDate).subscribe({
      next: (events: any) => {
        this.events = events;
      }
    })


  }

  public async goToEvent(event: any) {
    this.componentsService.updateSelectedUser(event);
    this.homeService.updateSelectedComponent('calendar');

  }
}
