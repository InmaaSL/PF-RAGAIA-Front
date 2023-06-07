import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  urlSaveCalendarEntry = environment.API_URL + '/saveCalendarEntry';
  urlEditCalendarEntry = environment.API_URL + '/editCalendarEntry/';

  urlDeleteCalendarEntry = environment.API_URL + '/deleteCalendarEntry/';

  urlGetCalendarEntry = environment.API_URL + '/getCalendarEntry';
  urlGetSpecificCalendarEntry = environment.API_URL + '/getSpecificCalendarEntry/';
  urlGetDayCalendarEntry = environment.API_URL + '/getDayCalendarEntry/';


  constructor(
    public http: HttpClient,
  ) { }

  saveCalendarEntry(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlSaveCalendarEntry, postData, requestOptions);
  }

  editCalendarEntry(calendar_id: string,  postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlEditCalendarEntry + calendar_id, postData, requestOptions);
  }

  getSpecificCalendarEntry(calendar_id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetSpecificCalendarEntry + calendar_id , requestOptions);
  }

  getDayCalendarEntry(day: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetDayCalendarEntry + day , requestOptions);
  }

  getCalendarEntry() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetCalendarEntry, requestOptions);
  }

  deleteCalendarEntry(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.delete(this.urlDeleteCalendarEntry + id, requestOptions);
  }

}
