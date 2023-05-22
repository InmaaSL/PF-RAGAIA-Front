import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiUserService } from './api-user.service';
import { ApiConnectService } from './api-connect.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  private componentNavigationHistory: any = [];
  private idUserSelected = '';
  private userId = null;

  private selectedUser: BehaviorSubject<string> = new BehaviorSubject<string>('');


  constructor() {
    this.selectedUser.subscribe((data) => {
      this.idUserSelected = data;
    });
  }

  addComponentToNavigationHistory(component: any) {
    this.componentNavigationHistory.push(component);
  }

  getComponentNavigationHistory() {
    return this.componentNavigationHistory;
  }

  removeLastComponentFromNavigationHistory() {
    this.componentNavigationHistory.pop();
  }

  updateSelectedUser(user: string) {
    this.selectedUser.next(user);
  }

  getSelectedUser() {
    return this.idUserSelected;
  }

}

