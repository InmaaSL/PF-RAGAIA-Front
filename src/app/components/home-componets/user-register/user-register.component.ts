import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiConnectService } from 'src/app/services/api-connect.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  @Input() toEdit: { edit: boolean; userId: any; }[] | undefined; //Componente padre update-user

  public registerForm = new FormGroup({
    mainRole: new FormControl(true, Validators.required),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', Validators.required),
    DNI: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    address: new FormControl(''),
    province: new FormControl(''),
    town: new FormControl(''),
    postal_code: new FormControl(''),
    birthDate: new FormControl(''),
    admissionDate: new FormControl(''),
    custodyType: new FormControl(''),
    professionalCategory: new FormControl(''),
    centre: new FormControl('', Validators.required),
  });

  public phoneRequired = true;
  public emailRequired = true;
  public professionalCategoryRequired = true;
  public birthDateRequired = false;
  public admissionDateRequired = false;
  public custodyTypeRequired = false;

  public isLoading = false;
  public registerSubmitted = false;
  public workerRole = true;

  public editingUpcc = false;
  public isEmpty = false;

  public professionalCategories = [];
  public centres = [];
  public userProfessionalCategoryCenter = [];
  public userId: string = '';

  public upcc = [];
  public infoUserData: HttpParams | undefined;
  public centreSelected = '';
  public professionalCategorySelected = '';
  public upccBeingEdited: any = null;

  constructor(
    private apiConnectService: ApiConnectService,
    private apiUserService: ApiUserService,
    public homeService: HomeService,
    public dialog: MatDialog

  ) { }

  ngOnInit() {
    this.apiUserService.getProfessionalCategories().subscribe({
      next: (e: any) => this.professionalCategories = e,
      error: (e) => console.log(e),
    })

    this.apiUserService.getCentres().subscribe({
      next: (e: any) => this.centres = e
    })

    if(this.toEdit){
      this.userId = this.toEdit[0]['userId'];
      this.showUserInfo(this.userId);

      this.registerForm.get('professionalCategory')?.clearValidators();
      document.getElementById('professionalCategory')?.removeAttribute('required');
      this.registerForm.get('centre')?.clearValidators();
      document.getElementById('centre')?.removeAttribute('required');
    }
  }

  public onMainRoleChange(event: any){
    const isChecked = event.target.checked;

    if (isChecked) {
      this.workerRole = true;

      this.registerForm.get('phone')?.setValidators([Validators.required]);
      document.getElementById('phone')?.setAttribute('required', '');
      this.registerForm.get('email')?.setValidators([Validators.email, Validators.required]);
      document.getElementById('email')?.setAttribute('required', '');
      this.registerForm.get('professionalCategory')?.setValidators([Validators.required]);
      document.getElementById('professionalCategory')?.setAttribute('required', '');

      this.registerForm.get('birthDate')?.clearValidators();
      document.getElementById('birthDate')?.removeAttribute('required');
      this.registerForm.get('admissionDate')?.clearValidators();
      document.getElementById('admissionDate')?.removeAttribute('required');
      this.registerForm.get('custodyType')?.clearValidators();
      document.getElementById('custodyType')?.removeAttribute('required');

      this.phoneRequired = true;
      this.emailRequired = true;
      this.professionalCategoryRequired = true;
      this.birthDateRequired = false;
      this.admissionDateRequired = false;
      this.custodyTypeRequired = false;

    } else {
      this.workerRole = false;

      this.registerForm.get('email')?.setValidators([Validators.email]);
      this.registerForm.get('phone')?.clearValidators();
      document.getElementById('phone')?.removeAttribute('required');
      this.registerForm.get('professionalCategory')?.clearValidators();
      document.getElementById('professionalCategory')?.removeAttribute('required');

      this.registerForm.get('birthDate')?.setValidators([Validators.required]);
      document.getElementById('birthDate')?.setAttribute('required', '');
      this.registerForm.get('admissionDate')?.setValidators([Validators.required]);
      document.getElementById('admissionDate')?.setAttribute('required', '');
      this.registerForm.get('custodyType')?.setValidators([Validators.required]);
      document.getElementById('custodyType')?.setAttribute('required', '');

      this.phoneRequired = false;
      this.emailRequired = false;
      this.professionalCategoryRequired = false;
      this.birthDateRequired = true;
      this.admissionDateRequired = true;
      this.custodyTypeRequired = true;
    }

    this.registerForm.get('email')?.updateValueAndValidity();
    this.registerForm.get('phone')?.updateValueAndValidity();
    this.registerForm.get('professionalCategory')?.updateValueAndValidity();
    this.registerForm.get('birthDate')?.updateValueAndValidity();
    this.registerForm.get('admissionDate')?.updateValueAndValidity();
    this.registerForm.get('custodyType')?.updateValueAndValidity();

  }

  public submitRegister(){
    this.registerSubmitted = true;
    this.isLoading = true;

    if(this.registerForm.valid){
      // let rol;
      // switch (this.registerForm.value.profesionalCategory) {
      //   case '1':
      //     rol = ["ROLE_SUPERADMIN"];
      //     break;
      //   case '2':
      //     rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_PSYCHOLOGIST"];
      //   break;
      //   case '3':
      //     rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_SOCIAL_WORKER"];
      //     break;
      //   case '4':
      //     rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_EDUSOS_TICS_MEDIADORES"];
      //   break;
      //   case '5':
      //     rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_EDUSOS_TICS_MEDIADORES"];
      //     break;
      //   case '6':
      //     rol = ["ROLE_WORKER", "ROLE_DIRECT_ACTION", "ROLE_EDUSOS_TICS_MEDIADORES"];
      //   break;
      //   case '7':
      //     rol = ["ROLE_WORKER", "DOMESTIC_SUPPORT"];
      //   break;
      //   case '8':
      //     rol = ["ROLE_WORKER", "ROLE_MANAGEMENT"];
      //   break;
      //   default:
      //     rol = ["ROLE_NNA"];
      //     break;
      // }

      // const userRoles = new HttpParams()
      // .set('roles', rol.join(','));

      const mainRole =  this.registerForm.get('mainRole')?.value;
      let userRoles: any;
      if(mainRole){
        userRoles = new HttpParams()
        .set('roles', 'ROLE_WORKER');
      } else {
        userRoles = new HttpParams()
        .set('roles', 'ROLE_NNA');
      }

      const infoProfessionalCategoryCentre = new HttpParams()
      .set('professionalCategoryId', this.registerForm.value.professionalCategory ?? '' )
      .set('centreId', this.registerForm.value.centre ?? '' );

      const infoCentre = new HttpParams()
      .set('centreId', this.registerForm.value.centre ?? '' );


      if(this.workerRole){
        this.infoUserData = new HttpParams()
        .set('name', this.registerForm.value.name ?? '' )
        .set('surname', this.registerForm.value.surname ?? '' )
        .set('dni', this.registerForm.value.DNI ?? '' )
        .set('phone', this.registerForm.value.phone ?? '' )
        .set('email', this.registerForm.value.email ?? '' )
        .set('address', this.registerForm.value.address ?? '' )
        .set('province', this.registerForm.value.province ?? '' )
        .set('town', this.registerForm.value.town ?? '' )
        .set('postal_code', this.registerForm.value.postal_code ?? '' );
      } else {
        this.infoUserData = new HttpParams()
        .set('name', this.registerForm.value.name ?? '' )
        .set('surname', this.registerForm.value.surname ?? '' )
        .set('dni', this.registerForm.value.DNI ?? '' )
        .set('phone', this.registerForm.value.phone ?? '' )
        .set('email', this.registerForm.value.email ?? '' )
        .set('address', this.registerForm.value.address ?? '' )
        .set('province', this.registerForm.value.province ?? '' )
        .set('town', this.registerForm.value.town ?? '' )
        .set('postal_code', this.registerForm.value.postal_code ?? '' )
        .set('birth_date', this.registerForm.value.birthDate ?? '' )
        .set('admission_date', this.registerForm.value.admissionDate ?? '' )
        .set('custody_id', this.registerForm.value.custodyType ?? '' );
      }

      if(this.userId){
        // Editamos el usuario:
        this.apiUserService.setRoles(this.userId, userRoles).subscribe({
          next: () =>{
            this.apiUserService.registerUserData(this.userId, this.infoUserData).subscribe({
              next: () => {
                this.apiUserService.getUserCentreProfessionalCategory(this.userId).subscribe({
                  next: (register: any) => {
                    if(register.length == 0){
                      if(mainRole){
                        this.apiUserService.setUserProfessionalCategoryCentre(this.userId, infoProfessionalCategoryCentre).subscribe({
                          error: (e) => console.log(e),
                          complete: () =>{
                            this.dialog.closeAll();
                          }
                        });
                      } else {
                        this.apiUserService.setUserCentre(this.userId, infoCentre).subscribe({
                          error: (e) => console.log(e),
                          complete: () =>{
                            this.dialog.closeAll();
                          }
                        });
                      }
                    } else {
                      this.dialog.closeAll();
                    }
                  }
                })
              },
              error: (e) => console.log(e)
            })
          }
        })
      } else {
        //Creamos un usuario nuevo:
        const infoUser = new HttpParams()
        .set('email', this.registerForm.value.email ?? '')
        .set('password', ' ');

        // Creamos el usuario:
          this.apiConnectService.register(infoUser).subscribe({
            next: (newUser: any) =>
            //Le asignamos los roles:
              this.apiUserService.setRoles(newUser['id'], userRoles).subscribe({
                complete: () =>
                {//Introducimos el resto de información valiosa:
                  this.apiUserService.registerUserData(newUser['id'], this.infoUserData).subscribe({
                    next: (_newUserData: any) => {
                      if(mainRole){
                        this.apiUserService.setUserProfessionalCategoryCentre(newUser['id'], infoProfessionalCategoryCentre).subscribe({
                          error: (e) => console.log(e),
                          complete: () => {
                            this.homeService.updateSelectedComponent('user-management');
                          }
                        })
                      } else {
                        this.apiUserService.setUserCentre(newUser['id'], infoCentre).subscribe({
                          complete: () => {
                            this.homeService.updateSelectedComponent('user-management');
                          }
                        });
                      }
                    },
                    error: (e) => console.log(e)
                  })}
              }),
            error: (e) => console.log(e),
          })
      }
      this.isLoading = false;
    } else {
      this.isLoading =  false;
      this.registerSubmitted = false;
    }
  }

  public showUserInfo(id: string){
    this.apiUserService.getUserData(id).subscribe({
      next: (userData: any) => {
        this.registerForm.patchValue({ name: userData.name });
        this.registerForm.patchValue({ surname: userData.surname });
        this.registerForm.patchValue({ DNI: userData.dni });
        this.registerForm.patchValue({ phone: userData.phone });
        this.registerForm.patchValue({ email: userData.email });
        this.registerForm.patchValue({ address: userData.address });
        this.registerForm.patchValue({ province: userData.province });
        this.registerForm.patchValue({ postal_code: userData.postal_code });
        this.registerForm.patchValue({ town: userData.town });

        //Vamos a obtener los centros y categorías profesionales del usuario:
        this.apiUserService.getUserCentreProfessionalCategory(id).subscribe({
          next: (userCentreCategory: any) => {
            this.userProfessionalCategoryCenter = userCentreCategory;
            console.log(this.userProfessionalCategoryCenter);
            if(this.userProfessionalCategoryCenter.length == 0){
              this.isEmpty = true;
            }
            console.log(this.isEmpty);
          }
        })
        if(userData.roles.includes('ROLE_WORKER')){
          this.workerRole = true;
          this.registerForm.get('mainRole')?.setValue(true);
        } else {
          this.registerForm.get('mainRole')?.setValue(false);
          this.workerRole = false;
        }
      },
      error: (e) => console.log(e)
    })
  }

  public editUserProfessionalCategoryCenter(upcc: any){
    this.editingUpcc = true;
    this.upccBeingEdited = upcc;

    if(upcc.centre){
      this.centreSelected = upcc.centre.id;
    } else {
      this.centreSelected = '1';
    }

    if(upcc.professionalCategory){
      this.professionalCategorySelected = upcc.professionalCategory.id;
    } else {
      this.professionalCategorySelected = '1';
    }
  }

  public deleteUserProfessionalCategoryCenter(upcc: any){
    this.editingUpcc = true;

    this.apiUserService.deleteUserProfessionalCategoryCentre(upcc.id).subscribe({
      error: (e) => console.log(e),
      complete: () => {
          this.apiUserService.getUserCentreProfessionalCategory(this.userId).subscribe({
            next: (userCentreCategory: any) => {
              this.userProfessionalCategoryCenter = userCentreCategory;
              console.log(this.userProfessionalCategoryCenter);
              if(this.userProfessionalCategoryCenter.length == 0){
                this.isEmpty = true;
              }
            }
          })
      },
    })
  }

  public saveUserProfessionalCategoryCenter(upcc: any){
    this.upcc = upcc;
    this.editingUpcc = false;

    const infoProfessionalCategoryCentre = new HttpParams()
    .set('userId', this.userId )
    .set('professionalCategoryId', this.registerForm.value.professionalCategory ?? '' )
    .set('centreId', this.registerForm.value.centre ?? '' );

    const infoCentre = new HttpParams()
    .set('userId', this.userId )
    .set('professionalCategoryId', '' )
    .set('centreId', this.registerForm.value.centre ?? '' );

    console.log(upcc);
    if(this.workerRole){
      this.apiUserService.updateUserProfessionalCategoryCentre(upcc.id, infoProfessionalCategoryCentre).subscribe({
        error: (e) => console.log(e),
        complete: () => {
          this.apiUserService.getUserCentreProfessionalCategory(this.userId).subscribe({
            next: (userCentreCategory: any) => {
              this.userProfessionalCategoryCenter = userCentreCategory;
              console.log(this.userProfessionalCategoryCenter);
              if(this.userProfessionalCategoryCenter.length == 0){
                this.isEmpty = true;
              }
            }
          })
        }
      })
    } else {
      console.log(upcc.id);
      this.apiUserService.updateUserProfessionalCategoryCentre(upcc.id, infoCentre).subscribe({
        error: (e) => console.log(e),
        complete: () => {
          this.apiUserService.getUserCentreProfessionalCategory(this.userId).subscribe({
            next: (userCentreCategory: any) => {
              this.userProfessionalCategoryCenter = userCentreCategory;
              console.log(this.userProfessionalCategoryCenter);
              if(this.userProfessionalCategoryCenter.length == 0){
                this.isEmpty = true;
              }
            }
          })
        }
      });
    }
  }
}
