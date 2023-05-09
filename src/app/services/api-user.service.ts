import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  urlGetUserData = environment.API_URL + '/user/userData';
  urlGetAllUserData = environment.API_URL + '/user/usersData';
  urlGetProfesionalCategories = environment.API_URL + '/getProfesionalCategories'
  urlGetCentres = environment.API_URL + '/getCentres'

  urlRegisterUserData = environment.API_URL + '/user/userData'

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

  getProfesionalCategories() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetProfesionalCategories, requestOptions);
  }

  getCentres() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetCentres, requestOptions);
  }

  getAllUsersData() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetAllUserData, requestOptions);
  }

  registerUserData(id: string, postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlRegisterUserData + '/' + id, postData, requestOptions);
  }

}
