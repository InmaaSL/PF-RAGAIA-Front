import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, PopoverController } from '@ionic/angular';
import { CalendarEvent } from 'angular-calendar';
import { AlertService } from 'src/app/services/alert.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar-popover',
  templateUrl: './calendar-popover.component.html',
  styleUrls: ['./calendar-popover.component.css']
})
export class CalendarPopoverComponent implements OnInit {

  public appointmentForm!: FormGroup;
  public defaultDate: string | undefined;
  public defaultTime: string | undefined;

  public nna = [];
  public workers = [];
  public events: CalendarEvent[] = [];

  public register_id = '';

  constructor(
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private apiUserService: ApiUserService,
    private apiCalendarService: CalendarService,
    private popoverController: PopoverController,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const date = this.navParams.get('data').date;
    this.register_id = this.navParams.get('data').id;

    if(this.register_id){
      this.showInfo(this.register_id);
    }

    this.defaultDate = this.formatDate(date);
    const currentDate = new Date();
    this.defaultTime = this.formatTime(currentDate);

    this.appointmentForm = this.formBuilder.group({
      entry_date: [this.defaultDate, Validators.required],
      entry_time: [this.defaultTime, Validators.required],
      allDay: [false],
      register_type: ['Tarea'],
      title: ['', Validators.required],
      description: [''],
      nna: [''],
      worker: [''],
      place: [''],
      remember: [false]
    });

    this.getNNA();
    this.getWorkers();
  }

  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  public formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  public saveAppointment() {
    if (this.appointmentForm?.valid) {
      const calendarEntry = new HttpParams()
      .set('entry_date', this.appointmentForm.value.entry_date ?? '' )
      .set('entry_time', this.appointmentForm.value.entry_time ?? '' )
      .set('allDay', this.appointmentForm.value.allDay ?? '' )
      .set('register_type', this.appointmentForm.value.register_type ?? '' )
      .set('title', this.appointmentForm.value.title ?? '' )
      .set('description', this.appointmentForm.value.description ?? '' )
      .set('user_id', this.appointmentForm.value.nna ?? '' )
      .set('worker', this.appointmentForm.value.worker ?? '' )
      .set('place', this.appointmentForm.value.place ?? '' )
      .set('remember', this.appointmentForm.value.remember ?? '' );

      if(this.register_id){
        this.apiCalendarService.editCalendarEntry(this.register_id ,calendarEntry).subscribe({
          next: (entry) => {
            this.alertService.setAlert('Registro editado con éxito.', 'success');
            this.popoverController.dismiss({
              editing: true,
              saved: true
            });
          },
          error: (e) => {
            console.log(e);
            this.alertService.setAlert('Error al editar el registro.', 'danger');
          },
        })
      } else {
        this.apiCalendarService.saveCalendarEntry(calendarEntry).subscribe({
          next: (entry) => {
            this.alertService.setAlert('Registro guardado con éxito.', 'success');
            this.popoverController.dismiss({
              editing: true,
              saved: true
            });

          },
          error: (e) => {
            console.log(e);
            this.alertService.setAlert('Error al guardar el registro.', 'danger');
          },
        })
      }
    }
  }

  public getNNA(){
    this.apiUserService.getUsersDataType('nna').subscribe({
      next: (nna: any) => {
        this.nna = nna;
      }
    })
  }

  public getWorkers(){
    this.apiUserService.getUsersDataType('worker').subscribe({
      next: (worker: any) => {
        this.workers = worker;
      }
    })
  }

  public showInfo(id: string){
    this.apiCalendarService.getSpecificCalendarEntry(id).subscribe({
      next: (entry: any) => {
        this.appointmentForm.patchValue({
          entry_date: this.defaultDate,
          entry_time: this.formatTime(new Date(entry.entry_time)),
          allDay: entry.all_day ? entry.all_day : false,
          register_type: entry.register_type,
          title: entry.title ?? '',
          description: entry.description ?? '',
          nna: entry.user ? entry.user.id : '',
          worker: entry.worker ? entry.worker.id : '' ,
          place: entry.place ?? '',
          remember: entry.remember ? entry.remember : false
        })
      }
    })

  }

}
