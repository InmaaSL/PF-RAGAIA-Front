import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { ApiConnectService } from '../services/api-connect.service';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  // Used for queued API calls while refreshing tokens
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null!);
  isRefreshingToken = false;

  urlApiLogin = environment.API_URL + '/login_check';
  urlApiRefresh = environment.API_URL + '/token/refresh';

  constructor(
    private apiService: ApiConnectService,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {}

  // Intercept every HTTP call
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if we need additional token logic or not
    if (this.isInBlockedList(request.url)) {
      return next.handle(request);
    } else {
      return next.handle(this.addToken(request)).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 0:
                return this.handle0Error(request, next);
              case 400:
                return this.handle400Error(err);
              case 402:
                return this.handle401Error(request, next);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        })
      );
    }
  }

  private isInBlockedList(url: string): boolean {
    // Example: Filter out our login and logout API call
    if (url === this.urlApiLogin || url === this.urlApiRefresh ) {
      return true;
    } else {
      return false;
    }
  }

  // Add our current access token from the service if present
  private addToken(req: HttpRequest<any>) {
    if (this.authService.currentAccessToken) {
      return req.clone({
        headers: new HttpHeaders({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${this.authService.currentAccessToken}`,
        }),
      });
    } else {
      return req;
    }
  }

  // We are not just authorized, we couldn't refresh token
  // or something else along the caching went wrong!
  private async handle400Error(err: HttpErrorResponse) {
    // Potentially check the exact error reason for the 400
    // then log out the user automatically
    const toast = await this.toastCtrl.create({
      message: 'Fallo de autorización (400)',
      duration: 2000,
    });
    toast.present();
    //this.apiService.logout();
    return of(null);
  }

  // Indicates our access token is invalid, try to load a new one
  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    // Check if another call is already using the refresh logic
    if (!this.isRefreshingToken) {
      // Set to null so other requests will wait
      // until we got a new token!
      this.tokenSubject.next('');
      this.isRefreshingToken = true;
      this.authService.currentAccessToken = '';

      // First, get a new access token
      return this.authService.getNewAccessToken().pipe(
        switchMap((token: any) => {
          if (token) {
            // Store the new token
            const accessToken = token.token;
            console.log(accessToken);
            return this.authService.storeAccessToken(accessToken).pipe(
              switchMap((_) => {
                // Use the subject so other calls can continue with the new token
                this.tokenSubject.next(accessToken);

                // Perform the initial request again with the new token
                return next.handle(this.addToken(request));
              })
            );
          } else {
            // No new token or other problem occurred
            return of(null);
          }
        }),
        finalize(() => {
          // Unblock the token reload logic when everything is done
          this.isRefreshingToken = false;
        })
      );
    } else {
      // "Queue" other calls while we load a new token
      return this.tokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) =>
          // Perform the request again now that we got a new token!
          next.handle(this.addToken(request))
        )
      );
    }
  }

  private handle0Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if(this.authService.currentAccessToken) {
      return next.handle(this.addToken(request));
    } else {
      return next.handle(request.clone());
    }
  }

}
