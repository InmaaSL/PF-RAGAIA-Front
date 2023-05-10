import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  selectedComponent = '';
  public username = '';
  public roles = '';

  menuItems = [
    {
      name: 'Home',
      value: 'main'
    },
    {
      name: 'SuperAdmin',
      value: 'super-admin',
      pages : [
        {name: 'Registro de usuarios', value: 'user-register'},
        {name: 'Gestión de usuarios', value: 'user-management'}
      ]
    },
    {
      name: 'Personal',
      value: '/personal',
      pages: [
        {name: 'Equipo de Atención Directa', value: 'direct-action'},
        {name: 'Servicio de Apoyo Doméstico', value: 'domestic-support'},
        {name: 'Administrador', value: 'management'}
      ]
    },
    {
      name: 'NNA',
      value: '/nna'},
    {
      name: 'Registros',
      value: '/registres',
      pages: [
        {name: 'Registro de Pagas', value: 'payment-register'},
        {name: 'Registro de Incentivos/Descuentos', value: 'incentives-discount-register'},
      ]
    },
    {
      name: 'Cuenta',
      value: '/account',
      pages: [
        {name: 'Mi cuenta', value: 'my-acount'},
        {name: 'Cerrar Sesión', value: 'logout'},
      ]
    }
  ]

  constructor(
    public authService: AuthService,
    public homeService: HomeService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    this.authService.clearLocalStorage();
  }

  ngOnInit() {
    this.loadData();

    this.homeService.getSelectedComponent()?.subscribe((value) => {
      this.selectedComponent = value;
    });

    this.homeService.updateSelectedComponent('main');
  }

  loadData() {
    const tk = localStorage.getItem('jwt-token');
    if(tk){
      const token = JSON.parse(tk);
      if (token) {
        this.authService.loadToken();
      }
    }
  }


  logout(){
    this.authService.logout();
  }

  goTo(component: string) {
    if(component === 'logout'){
      this.logout();
    } else {
      this.selectedComponent = component;
      this.homeService.updateSelectedComponent(component);
    }
  }



}
