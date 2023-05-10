import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiConnectService } from 'src/app/services/api-connect.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { HomeService } from 'src/app/services/home.service';

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
    private apiUserService: ApiUserService,
    public homeService: HomeService

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
  }

  submitRegister(){

    this.registerSubmitted = true;
    this.isLoading = true;

    if(this.registerForm.valid){

      let rol;
      switch (this.registerForm.value.profesionalCategory) {
        case '1':
          rol = ["ROLE_SUPERADMIN"];
          break;
        case '2':
          rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_PSYCHOLOGIST"];
        break;
        case '3':
          rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_SOCIAL_WORKER"];
          break;
        case '4':
          rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_EDUSOS_TICS_MEDIADORES"];
        break;
        case '5':
          rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_EDUSOS_TICS_MEDIADORES"];
          break;
        case '6':
          rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_EDUSOS_TICS_MEDIADORES"];
        break;
        case '7':
          rol = ["ROLE_WORKER", "DOMESTIC_SUPPORT"];
        break;
        case '8':
          rol = ["ROLE_WORKER", "ROLE_MANAGEMENT"];
        break;
        default:
          rol = ["NNA"];
          break;
      }

      const userRoles = new HttpParams()
      .set('roles', rol.join(','));

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

      this.apiConnectService.register(infoUser).subscribe({
        next: (newUser: any) => {
          this.apiUserService.setRoles(newUser['id'], userRoles).subscribe();
          this.apiUserService.registerUserData(newUser['id'], infoUserData).subscribe({
            next: (newUserData: any) => {},
            error: (e) => console.log(e),
            complete: () => this.homeService.updateSelectedComponent('user-management')
          });
        },
        error: (e) => console.log(e),
      })

      this.isLoading = false;
    } else {
      this.isLoading =  false;
      this.registerSubmitted = false;
    }




  }

}
