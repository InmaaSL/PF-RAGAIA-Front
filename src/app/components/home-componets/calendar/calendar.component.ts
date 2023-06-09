import { AfterViewInit, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { endOfDay, format, isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { Subject, fromEvent } from 'rxjs';
import * as moment from 'moment/moment';
import { EventColor } from 'calendar-utils';
import { CalendarPopoverComponent } from './calendar-popover/calendar-popover.component';
import { PopoverController } from '@ionic/angular';
import { CalendarService } from 'src/app/services/calendar.service';
import { ComponentsService } from 'src/app/services/components.service';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';

moment.updateLocale('es', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0,
  },
});

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None,

})
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;

  public viewDate = new Date();

  public modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  public locale = 'es';

  public weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  public weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  public actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  public events: CalendarEvent[] = [];
  public event: any;
  public activeDayIsOpen: boolean = false;

  public refresh = new Subject<void>();

  public charging: boolean = false;
  public roles: string[] | undefined;

  public authorizedCreate = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private popoverController: PopoverController,
    private apiCalendarService: CalendarService,
    private componentsService: ComponentsService,
    public authService: AuthService,
    public homeService: HomeService
  ) { }

  ngOnInit() {
    this.event = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    if(this.event){
      this.presentPopover(null, new Date(this.event.entry_date), this.event.id);
    }

    this.getEvents();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkAuthorized();
    });
  }

  public setView(view: CalendarView) {
    this.view = view;
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public eventClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  public checkAuthorized() {
    const roles = this.authService.getUserRoles();

    if (roles?.includes('ROLE_WORKER')) {
        this.authorizedCreate = true;
      }
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.authorizedCreate) {
      this.presentPopover(events, date, null );
    }
  }

  public async presentPopover(ev: any, date: any, id: any) {
    const popover = await this.popoverController.create({
      component: CalendarPopoverComponent,
      cssClass: 'custom-popover',
      event: ev,
      translucent: true,
      componentProps: {
        data: { date: date,
                id: id },
      }
    });
    await popover.present();

    return popover.onDidDismiss().then((result) => {
      if(result.data && result.data.saved){
        if(result.data.editing){
          this.activeDayIsOpen = false;
        }
        this.getEvents();
      }

    }).catch((error) => {
      console.error('Error al cerrar el popover:', error);
    });

  }

  public getEvents() {
    this.charging = true;
    this.events = [];
    this.apiCalendarService.getCalendarEntry().subscribe({
      next: (calendarEntry: any) => {
        this.changeDetector.detectChanges();
        this.charging = false;

        calendarEntry.forEach((entry: {
          place: string;
          description: any;
          register_type: string;
          entry_time: moment.MomentInput;
          id: any; entry_date: moment.MomentInput; title: any;
        }) => {
          const dateMoment = moment(entry.entry_date);
          const timeMoment = moment(entry.entry_time);
          const joinDate = dateMoment.format('YYYY-MM-DD') + 'T' + timeMoment.format('HH:mm:ss');

          const color = this.colorEvent(entry.register_type);
          if(this.authorizedCreate){
            this.events = [
              ...this.events,
              {
                start: moment(joinDate).toDate(),
                end: moment(joinDate).add(2, 'hours').toDate(),
                title: entry.title + ' - ' + entry.description + ' (' + entry.place + ')',
                color: colors[color],
                actions: [
                  {
                    label: '<i class="fas fa-fw fa-pencil-alt"></i>',
                    onClick: ({ event }: { event: CalendarEvent }): void => {
                        this.presentPopover(null, new Date(joinDate), entry.id );
                    },
                  },
                  {
                    label: '<i class="fas fa-fw fa-trash-alt"></i>',
                    onClick: ({ event }: { event: CalendarEvent }): void => {
                      this.events = this.events.filter((iEvent) => iEvent !== event);
                      this.apiCalendarService.deleteCalendarEntry(entry.id).subscribe({
                        error: (e) => console.log(e),
                        complete: () =>{
                          this.getEvents();
                          this.activeDayIsOpen = false;
                        }
                      })
                    },
                  },
                ],

                meta: {
                  calendarID: entry.id
                },
              },
            ];
          } else {
            this.events = [
              ...this.events,
              {
                start: moment(joinDate).toDate(),
                end: moment(joinDate).add(2, 'hours').toDate(),
                title: entry.title + ' - ' + entry.description + ' (' + entry.place + ')',
                color: colors[color],
                meta: {
                  calendarID: entry.id
                },
              },
            ];
          }
        });
      },
      error: (e) => {
        this.changeDetector.detectChanges();
        this.charging = false;
        console.log(e);
      },
      complete: () => {
        this.changeDetector.detectChanges();
        this.charging = false;
      }
    })
  }

  public colorEvent(event: string){
    let color: string;

    switch (event) {
      case 'Tarea':
        color = 'red';
        break;
      case 'Evento':
        color = 'blue';
        break;
      case 'Recordatorio':
        color = 'yellow';
        break;
      default:
        color = 'red';
        break;
    }

    return color;
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };

    if (isSameMonth(event.start, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, event.start) && this.activeDayIsOpen === true)) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = event.start;
    }
  }

  public convertTime(t: any) {
    return new Date(t).toTimeString();
  }

  public convertDay(d: any) {
    return new Date(d).toLocaleString('en-us', {
      weekday: 'long',
    });
  }

  public eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

}
