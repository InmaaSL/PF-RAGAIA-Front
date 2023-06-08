import { Component, OnInit } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  showAlert = false;

  constructor(
    public alertService: AlertService,
    alertConfig: NgbAlertConfig
  ) {
    alertConfig.dismissible = true;
  }

  ngOnInit() {
    this.alertService.isAlertVisible().subscribe(showAlert => {
      this.showAlert = showAlert;
    });
  }

  closeAlert(): void {
    this.alertService.toggleAlert();
  }


}
