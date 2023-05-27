import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  urlSetProfilePic = environment.API_URL + '/user/profile_pic';
  urlSetExpedientDocument = environment.API_URL + '/setExpedientDocument/';

  urlGetExpedientDocument = environment.API_URL + '/getExpedientDocument/';

  urlDeleteExpedientDocument = environment.API_URL + '/deleteExpedientDocument/';

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
