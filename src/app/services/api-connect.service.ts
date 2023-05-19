import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectService {

  urlRegister = environment.API_URL + '/register';
  urlGetUserId = environment.API_URL + '/user/getUserId';
  urlGetUserInfo = environment.API_URL + '/user/getUserData';

  constructor(
    public http: HttpClient
  ) { }

  loginTest(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(environment.API_URL+ '/login_check', postData);
  }

  register(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlRegister, postData, requestOptions);
  }

  getUserId() {
    const requestOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.get(this.urlGetUserId);
  }

  getUserInfo() {
    const requestOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.get(this.urlGetUserInfo);
  }





}
