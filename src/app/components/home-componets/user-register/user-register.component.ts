import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
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
      .set('provincia', this.registerForm.value.inputProvincia ?? '' )
      .set('municipio', this.registerForm.value.inputMunicipio ?? '' )
      .set('postal_code', this.registerForm.value.inputCP ?? '' )
      .set('profesional_category', this.registerForm.value.profesionalCategory ?? '' )
      .set('centre', this.registerForm.value.centre ?? '' );

      console.log(infoUser);
      console.log(infoUserData);

      this.isLoading = false;
    }




  }

}
