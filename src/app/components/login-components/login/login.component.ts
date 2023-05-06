import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent  implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
    password: new FormControl('', Validators.required),
  });

  guardarSesion = new FormControl();
  alertErrorLogin = false;


  constructor(
    private router: Router,
    private auth: AuthService,

  ) { }

  ngOnInit() {
  }

  async login() {

    this.auth.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      complete: () => {
        if (this.guardarSesion.value) {
          localStorage.setItem('guardarSesion', 'true');
        } else {
          localStorage.setItem('guardarSesion', 'false');
        }

        this.router.navigateByUrl('/home');
      },
      error: (e) => {
        console.log(e);
        this.alertErrorLogin = true;
      }
    });
  }



}
