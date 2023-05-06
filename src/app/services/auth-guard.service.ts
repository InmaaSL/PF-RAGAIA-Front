import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    public auth: AuthenticationService,
    public router: Router
  ) { }


  canActivate(route: ActivatedRouteSnapshot): boolean /*Observable<boolean>*/ {
    const token = localStorage.getItem('_cap_jwt-token');
    if (token) {
      return true;
    }
    this.router.navigateByUrl('login');
    return false;


    // const token = JSON.parse(localStorage.getItem('jwt-token'));
    // if (token) {
    //   this.rolesUrl = route.data?.roles;

    //   if(this.rolesUrl){
    //     this.rolesUser =  this.auth.getUserRoles();

    //     if(!this.rolesUser){
    //       this.router.navigateByUrl('/login');
    //       return false;
    //     }

    //     let access = false;
    //     this.rolesUrl.forEach(rol => {
    //       if(!access){
    //         access = this.rolesUser.includes(rol);
    //       }
    //     });

    //     if(access){
    //       return true;
    //     }
    //     this.router.navigateByUrl('/');
    //     return false;
    //   }
    // }
    // this.router.navigateByUrl('/login');
    // return false;

  }

}
