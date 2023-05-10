import { Component, OnInit } from '@angular/core';
import { ApiConnectService } from 'src/app/services/api-connect.service';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent  implements OnInit {

  userName = '';

  constructor(
    private apiUserService: ApiUserService,
    private apiConnectService: ApiConnectService,
    private authService: AuthService,
    public homeService: HomeService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.authService.getUserData().subscribe({
      next: (userData:any) => {
        if(userData) {
          this.userName = userData['name'] + ' ' + userData['surname'];
        }
      }
    });
  }
}
