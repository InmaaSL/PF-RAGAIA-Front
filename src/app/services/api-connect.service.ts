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

  urlSetPasswordNewUser = environment.API_URL + '/setPasswordNewUser';
  urlResetPassword = environment.API_URL + '/reset_password/request_reset';
  urlUserChangeHisPassword = environment.API_URL + '/user_change_his_password';
  urlSetNewPassword = environment.API_URL + '/reset_password/set_new';


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

  setPasswordNewUser(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlSetPasswordNewUser, postData, requestOptions);
  }

  resetPassword(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlResetPassword, postData, requestOptions);
  }

  setNewUserPassword(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlSetNewPassword, postData, requestOptions);
  }

  userChangeHisPassword(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlUserChangeHisPassword, postData, requestOptions);
  }


}
