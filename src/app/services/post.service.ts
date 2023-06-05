import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  urlGetTopicPost = environment.API_URL + '/getTopicPost';
  urlGetAllPost = environment.API_URL + '/getAllPost';
  urlGetThisPost = environment.API_URL + '/getThisPost/';
  urlGetPostMessages = environment.API_URL + '/getPostMessages/';

  urlSavePost = environment.API_URL + '/savePost';
  urlSavePostMessage = environment.API_URL + '/savePostMessage/';

  urlDeletePost = environment.API_URL + '/deletePost/';

  constructor(
    public http: HttpClient
  ) { }

  getTopicPost() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetTopicPost, requestOptions);
  }

  getAllPost() {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetAllPost, requestOptions);
  }

  getThisPost(post_id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetThisPost + post_id, requestOptions);
  }

  getPostMessages(post_id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.get(this.urlGetPostMessages + post_id, requestOptions);
  }

  savePost(postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlSavePost, postData, requestOptions);
  }

  savePostMessage(post_id: string, postData: any) {
    const requestOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    };
    return this.http.post(this.urlSavePostMessage + post_id, postData, requestOptions);
  }

  deletePost(id: string) {
    const headers = new HttpHeaders()
      .set('Accept', 'application/x-www-form-urlencoded')
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const requestOptions = { headers };
    return this.http.delete(this.urlDeletePost + id, requestOptions);
  }

}
