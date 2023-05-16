import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {

  urlGetUserData = environment.API_URL + '/user/userData/';
  urlGetAllUserData = environment.API_URL + '/user/usersData';
  urlGetProfessionalCategories = environment.API_URL + '/getProfessionalCategories';
  urlGetCentres = environment.API_URL + '/getCentres';
  urlGetUserCentreProfessionalCategory = environment.API_URL + '/user/getUserCentreProfessionalCategory/';

  urlRegisterUserData = environment.API_URL + '/user/userData/';
  urlSetRole = environment.API_URL + '/user/roles/';
  urlSetUserCentre = environment.API_URL + '/setUserCentre/'; //Orientado a los NNA.
  urlSetUserProfessionalCategoryCentre = environment.API_URL + '/setUserProfessionalCategoryCentre/';
  urlUpdateUserProfessionalCategoryCentre = environment.API_URL + '/updateUserProfessionalCategoryCentre/';

  urlDeleteUser = environment.API_URL + '/user/delete/';
  urlDeleteUserProfessionalCategoryCentre = environment.API_URL + '/deleteUserProfessionalCategoryCentre/';

  constructor(
    public http: HttpClient,
  ) { }

  getUserData(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetUserData + id, requestOptions);
  }

  getProfessionalCategories() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetProfessionalCategories, requestOptions);
  }

  getCentres() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetCentres, requestOptions);
  }

  getUsersData() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetAllUserData, requestOptions);
  }

  getUserCentreProfessionalCategory(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetUserCentreProfessionalCategory + id, requestOptions);
  }

  registerUserData(id: string, postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlRegisterUserData + id, postData, requestOptions);
  }

  setRoles(id: string, postData: any){
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlSetRole + id, postData, requestOptions);
  }

  setUserCentre(id: string, postData: any){
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlSetUserCentre + id, postData, requestOptions);
  }

  setUserProfessionalCategoryCentre(id: string, postData: any){
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlSetUserProfessionalCategoryCentre + id, postData, requestOptions);
  }

  updateUserProfessionalCategoryCentre(id: string, postData: any){
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlUpdateUserProfessionalCategoryCentre + id, postData, requestOptions);
  }

  deleteUser(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlDeleteUser + id, requestOptions);
  }

  deleteUserProfessionalCategoryCentre(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.delete(this.urlDeleteUserProfessionalCategoryCentre + id, requestOptions);
  }

}
