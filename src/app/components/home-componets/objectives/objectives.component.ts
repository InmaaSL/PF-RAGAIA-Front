import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ApiUserService } from 'src/app/services/api-user.service';
import { ComponentsService } from 'src/app/services/components.service';
import { HomeService } from 'src/app/services/home.service';
import { ObjectiveService } from 'src/app/services/objective.service';

@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.css']
})
export class ObjectivesComponent implements OnInit {

  public userId = '';
  public nnaName = '';

  public selectedYear = 0;
  public selectedMonth = 0;
  public selectedMonthName = '';

  public years: number[] = [];
  public months: { value: number, name: string }[] = [];

  public objectiveType = [];
  public objectives = [];

  public editing = false;

  public dateForm: FormGroup | any;

  public objectiveInfo: HttpParams | undefined;

  constructor(
    private apiUserService: ApiUserService,
    private homeService: HomeService,
    private componentsService: ComponentsService,
    private objectiveService: ObjectiveService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.years = this.generateYears();
    this.months = this.generateMonths();

    this.userId = this.componentsService.getSelectedUser();
    this.componentsService.updateSelectedUser('');

    this.apiUserService.getUserData(this.userId).subscribe({
      next: (userData: any) => {
        this.nnaName = userData.name + ' ' + userData.surname;
      },
      error: (e) => console.log(e)
    });

    this.getObjectiveType();
    this.saveSelectedValues();

    this.dateForm = new FormGroup({
      year: new FormControl(),
      month: new FormControl(),
      objectives: new FormArray([])
    });
  }

  public addObjectiveFormControls() {
    const objectiveTypes: Array<{ id: number; name: string }> = this.objectiveType;

    const objectivesArray = this.dateForm?.get('objectives') as FormArray;

    if (objectivesArray.length !== objectiveTypes.length) {
      for (const objectiveType of objectiveTypes) {
        const objectiveGroup = new FormGroup({
          type: new FormControl(objectiveType.id),
          need_detected: new FormControl({ value: '', disabled: true }, Validators.required),
          objective: new FormControl({ value: '', disabled: true }, Validators.required),
          valuation: new FormControl({ value: '', disabled: true }),
          indicator: new FormControl({ value: '', disabled: true }),
          comment: new FormControl({ value: '', disabled: true }),
            });
        objectivesArray.push(objectiveGroup);
      }
    }
  }

  public patchObjectiveFormValues() {
    const objectivesArray = this.dateForm.get('objectives') as FormArray;

    this.objectives.sort((a, b) => {
      const typeA = a['type']['id'];
      const typeB = b['type']['id'];

      if (typeA < typeB) {
        return -1;
      } else if (typeA > typeB) {
        return 1;
      } else {
        return 0;
      }
    });

    for (let i = 0; i < objectivesArray.length; i++) {
      const objective = this.objectives[i];

      if (objective) {
        objectivesArray.at(i).patchValue({
          need_detected: objective['need_detected'],
          objective: objective['objective'],
          valuation: objective['valuation'],
          indicator: objective['indicator'],
          comment: objective['comment']
        });
      } else {
        objectivesArray.at(i).patchValue({
          need_detected: '',
          objective: '',
          valuation: '',
          indicator: '',
          comment: ''
        });

      }
    }
  }


  private generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
      years.push(year);
    }
    return years;
  }

  private generateMonths(): { value: number, name: string }[] {
    this.selectedMonth =  new Date().getMonth() + 1;

    const months = [
      { value: 1, name: 'Enero' },
      { value: 2, name: 'Febrero' },
      { value: 3, name: 'Marzo' },
      { value: 4, name: 'Abril' },
      { value: 5, name: 'Mayo' },
      { value: 6, name: 'Junio' },
      { value: 7, name: 'Julio' },
      { value: 8, name: 'Agosto' },
      { value: 9, name: 'Septiembre' },
      { value: 10, name: 'Octubre' },
      { value: 11, name: 'Noviembre' },
      { value: 12, name: 'Diciembre' }
    ];

    return months;
  }

  public onDateChange(event: any) {
    this.saveSelectedValues();
  }

  public saveSelectedValues(): void {
    this.getObjectives();

    this.months.forEach(m => {
      if(m.value == this.selectedMonth){
        this.selectedMonthName = m.name;
      }
    });
  }

  public getObjectiveType(){
    this.objectiveService.getObjectiveType().subscribe({
      next: (objectiveType: any) => {
        this.objectiveType = objectiveType;
      },
      error: (e) => console.log(e),
      complete: () => {
          this.getObjectives();
      }
    })
  }

  public createObjectiveRecord(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.height = '90%';
    dialogConfig.position = {
      top: '2rem',
    };
    dialogConfig.data = {nna_id: this.userId};
    dialogConfig.hasBackdrop = true;

    // const dialogRef = this.dialog.open(HealthRecordComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   this.recordDataSource.loadData();
    // });
  }

  public editObjectives(){
    this.editing = true;

    Object.keys(this.dateForm.controls).forEach(key => {
      this.dateForm.get(key).enable();
    });
  }

  public saveObjectives(){
    this.editing = false;

    const formData = this.dateForm.value;

    formData.objectives.forEach((element: any) => {
      this.objectiveInfo = new HttpParams()
      .set('year', this.selectedYear)
      .set('month', this.selectedMonth)
      .set('type', element.type)
      .set('need_detected', element.need_detected)
      .set('objective', element.objective)
      .set('valuation', element.valuation)
      .set('indicator', element.indicator)
      .set('comment', element.comment);

      this.objectiveService.saveObjective(this.userId, this.objectiveInfo).subscribe({
        error: (e) => console.log(e),
      })

    });

    Object.keys(this.dateForm.controls).forEach(key => {
      if (key !== 'year' && key !== 'month') {
        this.dateForm.get(key).disable();
      }
    });
  }

  public getObjectives(){
    const date = new HttpParams()
    .set('year', this.selectedYear)
    .set('month', this.selectedMonth);

    this.objectiveService.getObjectives(this.userId, date).subscribe({
      next: (obj: any) => {
        this.objectives = obj;
      },
      error: (e) => console.log(e),
      complete: () => {
        this.addObjectiveFormControls();
        this.patchObjectiveFormValues();
      }
    });

  }

  public generateDocument(){
    console.log('ya nos calentaremos la cabeza después');
  }

  public goBack(){
    this.componentsService.updateSelectedUser(this.userId);
    this.homeService.updateSelectedComponent('main-individual-nna');
  }

  public close(){
    this.homeService.updateSelectedComponent('main');
  }
}
