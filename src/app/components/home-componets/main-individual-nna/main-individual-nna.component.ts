import { Component, OnInit } from '@angular/core';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ComponentsService } from 'src/app/services/components.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-main-individual-nna',
  templateUrl: './main-individual-nna.component.html',
  styleUrls: ['./main-individual-nna.component.css']
})
export class MainIndividualNnaComponent implements OnInit {

  public userId = '';
  public userData: any;

  public folderItems = [
    {
      name: 'Expediente',
      icon: 'fa-solid fa-folder-open'
    },
    {
      name: 'Educación',
      icon: 'fa-solid fa-pencil'
    },
    {
      name: 'Sanidad',
      icon: 'fa-solid fa-briefcase-medical'
    },
    {
      name: 'Ocio',
      icon: 'fa-solid fa-ranking-star'
    },
    {
      name: 'Objetivos',
      icon: 'fa-solid fa-star-half-stroke'
    },
    {
      name: 'Ropa',
      icon: 'fa-solid fa-shirt'
    },
    {
      name: 'Tutorías',
      icon: 'fa-solid fa-comments'
    }
  ]


  constructor(
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService
  ) { }

  ngOnInit() {
    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');
    this.getUserData();
  }

  public getUserData(){
    this.apiUserService.getUserData(this.userId).subscribe({
      next: (userData: any) => {
        this.userData = userData;
      },
      error: (e) => console.log(e)
    })
  }

}
