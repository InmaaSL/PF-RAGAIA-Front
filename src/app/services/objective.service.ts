import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

  urlObjectiveType = environment.API_URL + '/getObjectiveType/';
  urlSaveObjective = environment.API_URL + '/saveObjective/';
  urlGetObjectives= environment.API_URL + '/getObjectives/';


constructor(
    public http: HttpClient
) { }

  getObjectiveType() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlObjectiveType, requestOptions);
  }

  saveObjective(id: string, postData: any){
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlSaveObjective + id, postData, requestOptions);
  }

  getObjectives(id: string, postData: any){
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.post(this.urlGetObjectives + id, postData, requestOptions);
  }
}
