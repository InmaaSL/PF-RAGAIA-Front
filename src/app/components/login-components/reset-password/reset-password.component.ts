import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiConnectService } from 'src/app/services/api-connect.service';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent  implements OnInit {

  public passwordForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
  });

  saveSession = new FormControl();
  alertErrorLogin = false;


  constructor(
    private router: Router,
    private auth: AuthService,
    private homeService: HomeService,
    private apiConnectService: ApiConnectService
  ) { }

  ngOnInit() {}

  async resetPassword() {
    if(this.passwordForm.valid){
        const newPassword = new HttpParams()
        .set('email', this.passwordForm.value.email ?? '' );

        this.apiConnectService.resetPassword(newPassword).subscribe({
          error: (e) => console.log(e),
          complete: () => this.homeService.updateSelectedComponent('login')
        })
      }
  }

  public goBack(){
    this.homeService.updateSelectedComponent('login');

  }

}
