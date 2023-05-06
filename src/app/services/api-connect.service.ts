import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectService {

  urlRegister = API_URL + '/register';
  urlGetUserId = API_URL + '/getId';
  urlGetUserInfo = API_URL + '/getInfo';
  constructor(
    public http: HttpClient
  ) { }

  loginTest(postData: any) {
    const requestOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(API_URL+ '/login_check', postData);
  }

  register(postData: any) {
    const requestOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlRegister, postData, requestOptions);
  }

  getUserId() {
    return this.http.get(this.urlGetUserId);
  }

  getUserInfo() {
    return this.http.get(this.urlGetUserInfo);
  }





}
