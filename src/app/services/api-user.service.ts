import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  urlGetUserData = API_URL + '/user/userData';

  constructor(
    public http: HttpClient
  ) { }

  getUserData(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetUserData + '/' + id, requestOptions);
  }


}
