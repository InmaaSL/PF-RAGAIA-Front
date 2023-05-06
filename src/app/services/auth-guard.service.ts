import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public auth: AuthService,
    public router: Router
  ) { }


  canActivate(): boolean /*Observable<boolean>*/ {
    const token = localStorage.getItem('jwt-token');
    if (token) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }

}
