import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ApiConnectService } from 'src/app/services/api-connect.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public userId = '';


  public passwordForm = new FormGroup({
    new_password: new FormControl('', Validators.required),
    repeat_password: new FormControl('', Validators.required),
  });


  constructor(
    private apiConnectService: ApiConnectService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.apiConnectService.getUserId().subscribe({
      next: (id: any) => {
        this.userId = id;
      }
    })
  }

  async resetPassword() {
    if(this.passwordForm.valid){

        if(this.passwordForm.controls.new_password.value === this.passwordForm.controls.repeat_password.value ){
          const newPassword = new HttpParams()
          .set('password', this.passwordForm.value.new_password ?? '' )
          .set('confirmPassword', this.passwordForm.value.repeat_password ?? '' );

          this.apiConnectService.userChangeHisPassword(newPassword).subscribe({
            error: (e) => {
              console.log(e);
              this.alertService.setAlert(e, 'danger');
            },
            complete: () => {
              this.passwordForm.reset();
              this.alertService.setAlert('Contraseña actualizada.', 'success');
            }
          })
        }

      }
    }

}
