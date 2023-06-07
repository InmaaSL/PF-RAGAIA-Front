import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiConnectService } from '../services/api-connect.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public confirmation_token: any = '' ;
  public password_request_token: any = '' ;

  public passwordForm = new FormGroup({
    new_password: new FormControl('', Validators.required),
    repeat_password: new FormControl('', Validators.required),
    confirmation_token: new FormControl(''),
  });

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private apiConnectService: ApiConnectService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.confirmation_token = params.get('confirmation_token');
      this.password_request_token = params.get('password_request_token');
      // Aquí puedes utilizar el token como necesites
      console.log(this.confirmation_token);
      console.log(this.password_request_token);
    });
  }

  async resetPassword() {
    if(this.passwordForm.valid){
      if(this.confirmation_token){
        if(this.passwordForm.controls.new_password.value === this.passwordForm.controls.repeat_password.value ){
          const newPassword = new HttpParams()
          .set('password', this.passwordForm.value.new_password ?? '' )
          .set('confirmationToken', this.confirmation_token );

          this.apiConnectService.setPasswordNewUser(newPassword).subscribe({
            error: (e) => console.log(e),
            complete: () => this.router.navigateByUrl('/login')
          })
        }
      }

      if(this.password_request_token){
        if(this.passwordForm.controls.new_password.value === this.passwordForm.controls.repeat_password.value ){
          const newPassword = new HttpParams()
          .set('password', this.passwordForm.value.new_password ?? '' )
          .set('token', this.password_request_token );

          this.apiConnectService.setNewUserPassword(newPassword).subscribe({
            error: (e) => console.log(e),
            complete: () => this.router.navigateByUrl('/login')
          })
        }

      }
    }






  }


}
