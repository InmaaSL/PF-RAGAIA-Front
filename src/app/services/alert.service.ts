import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

	alertMessage: string | undefined;
	alertType: string = '';
	private showAlertSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	private showAlert = false;

	constructor(alertConfig: NgbAlertConfig) {
		alertConfig.type = 'success';
		alertConfig.dismissible = false;
	}

	setAlert(message: string, type: string){
		this.alertMessage = message;
		this.alertType = type;
		this.toggleAlert();
	}

	toggleAlert(): void {
		this.showAlertSubject.next(!this.showAlertSubject.value);
		setTimeout(() => {
			this.showAlertSubject.next(!this.showAlertSubject.value);
		}, 8000);
	}

	isAlertVisible(): Observable<boolean> {
		return this.showAlertSubject.asObservable();
	}

	setAlertMessage(message: string, type: string): void {
		this.alertMessage = message;
		this.alertType = type;
	}


}
