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
  public loadingCalendar = false;
  public userName = '';
  public today = '';
  public events: any[] = [];
  public authorizedCreate = false;

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
        if(next){
          this.getEvents();
          this.checkAuthorized();
          this.loading = true;
        }
      },
      error: (e) => console.log(e)
    });
  }

  public getEvents(){
    const date = moment(this.today, 'D [de] MMMM [de] YYYY');
    const convertedDate = date.format('YYYY-MM-DD');

    this.apiCalendarService.getDayCalendarEntry(convertedDate).subscribe({
      next: (events: any) => {
        this.loadingCalendar = true;
        this.events = events;
      }
    })
  }

  public async goToEvent(event: any) {
    if(this.authorizedCreate){
      this.componentsService.updateSelectedUser(event);
      this.homeService.updateSelectedComponent('calendar');
    }
  }

  public checkAuthorized() {
    const roles = this.authService.getUserRoles();

    if (roles?.includes('ROLE_WORKER')) {
        this.authorizedCreate = true;
      }
  }
}
