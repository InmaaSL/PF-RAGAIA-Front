import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HomeService } from '../services/home.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ApiConnectService } from '../services/api-connect.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  selectedComponent = '';
  public username = '';
  public roles = '';

  public activeMenuItem: string = '';
  public activeCollapse: string | null = null;

  public menuItems = [
    {
      name: 'Home',
      value: 'main',
      icon: 'fa-solid fa-rainbow'
    },
    {
      name: 'Personal',
      value: '/personal',
      icon: 'fa-solid fa-users',
      pages: [
        {name: 'Registro de Usuarios', value: 'user-register'},
        {name: 'Usuarios Registrados', value: 'user-management'},
      ]
    },
    {
      name: 'NNA',
      value: 'nna',
      icon: 'fa-solid fa-children'
    },
    {
      name: 'Calendario',
      value: 'calendar',
      icon: 'fa-solid fa-calendar-day'
    },
    {
      name: 'Foro',
      value: 'foro',
      icon: 'fa-solid fa-message'
    },
    {
      name: 'Registros',
      value: '/registres',
      icon: 'fa-solid fa-folder-open',
      pages: [
        {name: 'Gestión de Pagas', value: 'paid-management'},
        {name: 'Registro de Pagas', value: 'paid'},
        // {name: 'Registro de Incentivos/Descuentos', value: 'incentives-discount-register'},
      ]
    },
    {
      name: 'Cuenta',
      value: '/account',
      icon: 'fa fa-heart',
      pages: [
        {name: 'Mi cuenta', value: 'my-profile'},
        {name: 'Cerrar Sesión', value: 'logout'},
      ]
    }
  ]

  public loading = false;
  public userName = '';

  constructor(
    public authService: AuthService,
    public homeService: HomeService,
    private apiConnectService: ApiConnectService,
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage() {
    this.authService.clearLocalStorage();
  }

  ngOnInit() {
    registerLocaleData(localeEs);

    this.activeMenuItem = this.menuItems[0].value;

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
        this.authService.getUserInfo().subscribe({
          next: (next: any) => {
            this.loading = true;
            if(next){
              this.userName = next.userData.name + ' ' + next.userData.surname;
            }
          },
          error: (e) => console.log(e)
        });
      }
    }
  }

  toggleCollapse(collapseId: string): void {
    this.activeMenuItem = collapseId;
    if (this.activeCollapse === collapseId) {
      this.activeCollapse = 'null';
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
      this.homeService.updateSelectedComponent('login');
      this.logout();
    } else {
      this.activeCollapse = null;
      this.selectedComponent = 'component';
      this.homeService.updateSelectedComponent(component);
    }
  }



}
