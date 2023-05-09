import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiConnectService } from 'src/app/services/api-connect.service';
import { ApiUserService } from 'src/app/services/api-user.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  registerForm = new FormGroup({
    inputName: new FormControl('', Validators.required),
    inputSurname: new FormControl('', Validators.required),
    inputDNI: new FormControl('', Validators.required),
    inputPhone: new FormControl('', Validators.required),
    inputEmail: new FormControl('', [Validators.required, Validators.email]),
    inputAddress: new FormControl('', Validators.required),
    inputProvincia: new FormControl('', Validators.required),
    inputMunicipio: new FormControl('', Validators.required),
    inputCP: new FormControl('', Validators.required),
    profesionalCategory: new FormControl('', Validators.required),
    centre: new FormControl('', Validators.required)
  });

  isLoading = false;
  registerSubmitted = false;

  profesionalCategories = [];
  centres = [];

  constructor(
    private apiConnectService: ApiConnectService,
    private apiUserService: ApiUserService
  ) { }

  ngOnInit() {
    this.apiUserService.getProfesionalCategories().subscribe({
      next: (e: any) => {
        this.profesionalCategories = e;
      }
    })

    this.apiUserService.getCentres().subscribe({
      next: (e: any) => {
        this.centres = e;
      }
    })

    this.apiUserService.getUserData('1').subscribe({
      next: (e) => console.log(e)
    })
  }

  submitRegister(){

    this.registerSubmitted = true;
    this.isLoading = true;

    if(this.registerForm.valid){

      const infoUser = new HttpParams()
      .set('email', this.registerForm.value.inputEmail ?? '')
      .set('password', ' ');

      const infoUserData = new HttpParams()
      .set('name', this.registerForm.value.inputName ?? '' )
      .set('surname', this.registerForm.value.inputSurname ?? '' )
      .set('dni', this.registerForm.value.inputDNI ?? '' )
      .set('phone', this.registerForm.value.inputPhone ?? '' )
      .set('email', this.registerForm.value.inputEmail ?? '' )
      .set('address', this.registerForm.value.inputAddress ?? '' )
      .set('province', this.registerForm.value.inputProvincia ?? '' )
      .set('town', this.registerForm.value.inputMunicipio ?? '' )
      .set('postal_code', this.registerForm.value.inputCP ?? '' )
      .set('profesional_category', this.registerForm.value.profesionalCategory ?? '' )
      .set('centre', this.registerForm.value.centre ?? '' );

      console.log(infoUser);
      console.log(infoUserData);

      this.apiConnectService.register(infoUser).subscribe({
        next: (newUser: any) => {
          console.log(newUser);
          this.apiUserService.registerUserData(newUser['id'], infoUserData).subscribe({
            next: (newUserData: any) => {
              console.log(newUserData);
            },
            error: (e) => console.log(e)
          });
        },
        error: (e) => console.log(e),
      })

      this.isLoading = false;
    }




  }

}
