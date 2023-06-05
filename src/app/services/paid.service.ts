import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaidService {

  urlGetPaidManagements = environment.API_URL + '/getPaidManagement';
  urlGetPaidManagement = environment.API_URL + '/getPaidManagement/';

  urlSavePaidManagement = environment.API_URL + '/savePaidManagement/';


  constructor(
    public http: HttpClient
  ) { }

  getPaidManagements() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetPaidManagements, requestOptions);
  }

  getPaidManagement(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetPaidManagement + id, requestOptions);
  }

  savePaidManagement(id: string, postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlSavePaidManagement + id, postData, requestOptions);
  }
}
