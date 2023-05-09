import { Component, OnInit } from '@angular/core';
import { ApiUserService } from 'src/app/services/api-user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  constructor(
    private apiUserService: ApiUserService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(){
    this.apiUserService.getAllUsersData().subscribe({
      next: (allUsersData: any) => {
        console.log(allUsersData);
      }
    })
  }

}
