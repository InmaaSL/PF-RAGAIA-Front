import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  selectedComponent = '';
  public username = '';
  public roles = '';

  constructor(
    public auth: AuthService
  ) {}

  ngOnInit() {
    // this.loadData();
  }

  loadData() {
    const tk = localStorage.getItem('jwt-token');
    if(tk){
      const token = JSON.parse(tk);
      if (token) {
        this.auth.loadToken();
        this.auth.getUserInfo().subscribe({
          next: (data: any) => {
          if (data) {
            if (data['name']) {
              this.username = data['name'] + ' ' + data['surname'] ;
              console.log(this.username);
            }
            if (data['roles']) {
              this.roles = data['roles'];
              console.log(this.roles);
              // this.componentesPanelService.setUserRoles(this.roles);
            }
          }
        }});
      }
    }
  }


  logout(){
    this.auth.logout();
  }



}
