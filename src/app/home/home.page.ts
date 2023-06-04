import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  selectedComponent = '';
  public username = '';
  public roles = '';

  public activeCollapse: string | null = null;

  public menuItems = [
    {
      name: 'Home',
      value: 'main'
    },
    {
      name: 'Personal',
      value: '/personal',
      pages: [
        {name: 'Registro de Usuarios', value: 'user-register'},
        {name: 'Usuarios Registrados', value: 'user-management'},
      ]
    },
    {
      name: 'NNA',
      value: 'nna'
    },
    {
      name: 'Calendario',
      value: 'calendar'
    },
    {
      name: 'Foro',
      value: 'foro'
    },
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
    registerLocaleData(localeEs);

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

  toggleCollapse(collapseId: string): void {
    if (this.activeCollapse === collapseId) {
      this.activeCollapse = null;
    } else {
      this.activeCollapse = collapseId;
    }
  }

  closeCollapse(): void {
    this.activeCollapse = null;
  }


  logout(){
    this.authService.logout();
  }

  goTo(component: string) {
    if(component === 'logout'){
      this.logout();
    } else {
      this.activeCollapse = null;
      this.selectedComponent = component;
      this.homeService.updateSelectedComponent(component);
    }
  }



}
