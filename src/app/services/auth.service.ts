import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, tap } from 'rxjs';
import { API_URL } from 'src/environments/environment';

const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlApiLogin = API_URL + '/login_check';

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  currentAccessToken = null;


  constructor(
    public http: HttpClient
  ) { }

  async loadToken() {
    const tokenValue = localStorage.getItem('jwt-token');
    if(tokenValue) {
      const token = await JSON.parse(tokenValue);
      if (token) {
        this.currentAccessToken = token;
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
    }
  }

  serverLogin(user: any, pass: any) {
    return this.http.post(this.urlApiLogin, { username: user, password: pass });
  }

  login(user: any, pass: any): Observable<any> {
    localStorage.setItem(
      'USER',
      JSON.stringify({ username: user, password: pass })
    );

    return this.serverLogin(user, pass).pipe(
      switchMap((res: any) => {
        const storeAccess = localStorage.setItem(
          TOKEN_KEY,
          JSON.stringify(res['token'])
        );

        this.currentAccessToken = res['token'];

        //const storeRefresh = localStorage.setItem( REFRESH_TOKEN_KEY, JSON.stringify(res['refresh_token']));

        // this.setUserRoles(
        //   JSON.parse(atob(this.currentAccessToken.split('.')[1]))['roles']
        // );
        return from(Promise.all([storeAccess]));
      }),
      tap((_: any) => {
        this.isAuthenticated.next(true);
        // this.getUserId();
        // this.getUserInfoApi();
      })
    );
  }
}
