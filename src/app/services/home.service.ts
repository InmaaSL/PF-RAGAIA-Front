import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Events } from './events.service';
import * as e from 'cors';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private selectedComponent: BehaviorSubject<string> | undefined;

  private userRoles: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  private roles: Array<string> = [];


  constructor(
    private eventsService: Events
  ) {
    this.selectedComponent = new BehaviorSubject<string>('main');
    this.userRoles.subscribe({
      next: (roles) => {
        if(roles){
          this.roles = roles;
        }
      },
      error: (e) => console.log(e)
    })
  }

  updateSelectedComponent(component: string) {
    console.log(component);
    this.selectedComponent?.next(component);
    this.eventsService.publish('global:changedComponent', {component});
  }

  getSelectedComponent() {
    return this.selectedComponent?.asObservable();
  }

  updateUserRoles(roles: Array<string>) {
    this.userRoles.next(roles);
  }
}
