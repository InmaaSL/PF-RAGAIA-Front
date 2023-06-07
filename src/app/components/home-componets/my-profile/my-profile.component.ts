import { Component, OnInit } from '@angular/core';
import { ApiConnectService } from 'src/app/services/api-connect.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public userId = '';

  constructor(
    private apiConnectService: ApiConnectService

  ) { }

  ngOnInit() {
    this.apiConnectService.getUserId().subscribe({
      next: (id: any) => {
        this.userId = id;
      }
    })
  }

}
