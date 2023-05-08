import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent  implements OnInit {

  userName = '';

  constructor(
    public authService: AuthService
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
        }
      }
    })
  }

}
