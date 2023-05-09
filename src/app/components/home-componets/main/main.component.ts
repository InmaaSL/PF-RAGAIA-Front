import { Component, OnInit } from '@angular/core';
import { ApiUserService } from 'src/app/services/api-user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent  implements OnInit {

  userName = '';

  constructor(
    public authService: AuthService,
    private apiUserService: ApiUserService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.authService.getUserData().subscribe({
      next: (userData:any) => {
        if(userData) {
          console.log(userData);
          this.userName = userData['name'] + ' ' + userData['surname'];
          // this.apiUserService.getCentres().subscribe({
          //   next: (e) => console.log(e)
          // })
        }
      }
    });
  }
}
