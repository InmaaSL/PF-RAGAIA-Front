import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiConnectService } from './api-connect.service';
import { Router } from '@angular/router';
import { ApiUserService } from './api-user.service';

const TOKEN_KEY = 'jwt-token';
const REFRESH_TOKEN_KEY = 'jwt-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlApiLogin = environment.API_URL + '/login_check';
  urlApiRefresh = environment.API_URL + '/token/refresh';

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userRoles: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  private currentUserId: BehaviorSubject<any>;

  private userInfo: BehaviorSubject<JSON> = new BehaviorSubject<JSON>(null!);
  private userData: BehaviorSubject<JSON> = new BehaviorSubject<JSON>(null!);
  private roles: Array<string> | undefined;

  currentAccessToken: string | undefined;

  constructor(
    public http: HttpClient,
    public router: Router,
    public apiConnectService: ApiConnectService,
    public apiUserService: ApiUserService
  ) {
    this.loadToken();
    this.currentUserId = new BehaviorSubject<any>(null);
    this.userRoles.subscribe(
      (data) => {
      this.roles = data;
    });
  }

  async loadToken() {
    let tokenValue = localStorage.getItem('jwt-token');

    if(tokenValue) {
      const token = await JSON.parse(tokenValue);
      if (token) {
        this.currentAccessToken = token;
        this.isAuthenticated.next(true);
        this.getUserId();
        this.getUserInfoApi();
      } else {
        this.isAuthenticated.next(false);
      }
    }
  }

  setUserRoles(roles: string[]) {
    this.userRoles.next(roles);
  }

  getUserRoles() {
    return this.roles;
  }

  // Load the refresh token from storage
  // then attach it as the header for one specific API call
  getNewAccessToken() {
    // const refreshToken = from(Storage.get({ key: REFRESH_TOKEN_KEY }));
    // const refreshToken = JSON.parse(localStorage.getItem(REFRESH_TOKEN_KEY));
    const jwt_refresh_token = localStorage.getItem('jwt-refresh-token');
    if(jwt_refresh_token){
      const refreshToken = JSON.parse(jwt_refresh_token);
      return refreshToken.pipe(
        switchMap((token) => {
          if (token) {
            // const formData = new FormData();
            // formData.append('refresh_token', token );
            return this.http.post(this.urlApiRefresh, token);
          } else {
            // No stored refresh token
            return of(null);
          }
        })
      );
    }

  }

  getUserId() {
    this.apiConnectService.getUserId(). subscribe({
      next: (userId: any) => {
        this.currentUserId.next(userId);
      },
      error: (e) => console.log(e)
    });
  }

  getCurrentUserId() {
    return this.currentUserId.asObservable();
  }

  getUserInfoApi() {
    this.apiConnectService.getUserInfo().subscribe({
      next: (userInfo: any) => {
        this.setUserInfo(userInfo);
          if (userInfo.id) {
            this.getUserDataAPI(userInfo.id);
          }
      },
      error: (e) => console.log(e),
    })
  }

  setUserInfo(info: any) {
    this.userInfo.next(info);
    this.setUserRoles(info.roles);
  }

  getUserInfo() {
    return this.userInfo.asObservable();
  }

  getUserDataAPI(userId: string) {
    this.apiUserService.getUserData(userId).subscribe({
      next: (userData: any) => {
        if(userData){
          this.setUserData(userData);
        }
      },
      error: (e) => console.log(e)
    })
  }

  setUserData(data: any) {
    this.userData.next(data);
  }

  getUserData() {
    return this.userData.asObservable();
  }

  login(user: any, pass: any): Observable<any> {
    localStorage.setItem(
      'USER',
      JSON.stringify({ username: user })
    );

    return this.serverLogin(user, pass).pipe(
      switchMap((res: any) => {
        const storeAccess = localStorage.setItem(
          TOKEN_KEY,
          JSON.stringify(res['token'])
        );

        const storeRefresh  = localStorage.setItem(
          REFRESH_TOKEN_KEY,
          JSON.stringify(res['refresh_token'])
        );


        this.currentAccessToken = res['token'];

        // const storeRefresh = localStorage.setItem( REFRESH_TOKEN_KEY, JSON.stringify(res['refresh_token']));

        if(this.currentAccessToken) {
          this.setUserRoles(
            JSON.parse(atob(this.currentAccessToken.split('.')[1]))['roles']
          );
        }
        return from(Promise.all([storeAccess, storeRefresh]));
      }),
      tap((_: any) => {
        this.isAuthenticated.next(true);
        this.getUserId();
        this.getUserInfoApi();
      })
    );
  }

  storeAccessToken(accessToken: string | undefined) {
    this.currentAccessToken = accessToken;
    return from(localStorage['setIem'](TOKEN_KEY, JSON.stringify(accessToken)));
  }

  serverLogin(user: any, pass: any) {
    return this.http.post(this.urlApiLogin, { username: user, password: pass });
  }



  async logout(url = '/login') {
    this.currentAccessToken = '';
    // Remove all stored tokens
    this.isAuthenticated.next(false);
    this.clearLocalStorage(true);
    this.router.navigateByUrl(url);
  }

  clearLocalStorage(forced = false) {
    if (
      forced ||
      localStorage.getItem('saveSession') === 'false' ||
      localStorage.getItem('saveSession') === null ||
      localStorage.getItem('saveSession') === undefined
    ) {
      localStorage.clear();
    }
  }



















}
