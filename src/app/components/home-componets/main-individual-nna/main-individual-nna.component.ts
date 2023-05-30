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
  public showInfo = false;

  public folderItems = [
    {
      name: 'Expediente',
      icon: 'fa-solid fa-folder-open',
      component: 'nna-expedient'
    },
    {
      name: 'Sanidad',
      icon: 'fa-solid fa-briefcase-medical',
      component: 'nna-healthcare'
    },
    {
      name: 'Educación',
      icon: 'fa-solid fa-pencil',
      component: 'nna-education'
    },
    {
      name: 'Objetivos',
      icon: 'fa-solid fa-star-half-stroke',
      component: 'nna-expedient'
    },
    // {
    //   name: 'Ocio',
    //   icon: 'fa-solid fa-ranking-star',
    //   component: 'nna-expedient'
    // },
    // {
    //   name: 'Ropa',
    //   icon: 'fa-solid fa-shirt',
    //   component: 'nna-expedient'
    // },
    // {
    //   name: 'Tutorías',
    //   icon: 'fa-solid fa-comments',
    //   component: 'nna-expedient'
    // }
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
        this.showInfo = true;
        this.userData = userData;
      },
      error: (e) => console.log(e)
    })
  }

  public goToFolder(component: string ){
    this.componentsService.updateSelectedUser(this.userId);
    this.homeService.updateSelectedComponent(component);
  }

  goBack(){
    this.homeService.updateSelectedComponent('nna');
  }

  close(){
    this.homeService.updateSelectedComponent('main');
  }

}
