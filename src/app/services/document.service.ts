import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  urlSetProfilePic = environment.API_URL + '/user/profile_pic';
  urlSetExpedientDocument = environment.API_URL + '/setExpedientDocument/';
  urlSetHealthRecord = environment.API_URL + '/setHealthRecord/';
  urlEditHealthRecord = environment.API_URL + '/editHealthRecord/';
  urlSetHealthDocument = environment.API_URL + '/setHealthDocument/';

  urlGetExpedientDocument = environment.API_URL + '/getExpedientDocument/';
  urlGetHealthDocument = environment.API_URL + '/getHealthDocument/';

  urlDeleteExpedientDocument = environment.API_URL + '/deleteExpedientDocument/';
  urlDeleteHealthRecord = environment.API_URL + '/deleteHealthRecord/';
  urlDeleteHealthDocument = environment.API_URL + '/deleteHealthDocument/';

constructor(public http: HttpClient) { }


setUserExpedient(id: string, documentInfo: any) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(
    this.urlSetExpedientDocument + id,
    documentInfo
  );
}

setHealthRecord(id: string, postData: any){
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(this.urlSetHealthRecord + id, postData, requestOptions);
}

editHealthRecord(id: string, postData: any){
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(this.urlEditHealthRecord + id, postData, requestOptions);
}

getExpedientDocument(id: string) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.get(this.urlGetExpedientDocument + id, requestOptions);
}

deleteExpedientDocument(id: string) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.delete(this.urlDeleteExpedientDocument + id, requestOptions);
}

deleteHealthRecord(id: string) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(this.urlDeleteHealthRecord + id, requestOptions);
}

setUserHealthDocument(id: string, documentInfo: any) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(
    this.urlSetHealthDocument + id,
    documentInfo
  );
}

getHealthDocument(id: string) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.get(this.urlGetHealthDocument + id, requestOptions);
}

deleteHealthDocument(id: string) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.delete(this.urlDeleteHealthDocument + id, requestOptions);
}
// FOTO DE PERFIL, en PRUEBAS!!


setUserProfilePic(id: string, pictureInfo: any) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(
    this.urlSetProfilePic  + id,
    pictureInfo
  );
}

setProfilePic(pictureInfo: FormData) {
  const headers = new HttpHeaders()
    .set('Accept', 'application/x-www-form-urlencoded')
    .set('Content-Type', 'application/x-www-form-urlencoded');
  const requestOptions = { headers };
  return this.http.post(this.urlSetProfilePic, pictureInfo, requestOptions);
}



}
