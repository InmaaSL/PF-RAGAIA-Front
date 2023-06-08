import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import 'moment/locale/es';
import * as momentRange from 'moment-range';
import { ApiUserService } from 'src/app/services/api-user.service';
import { PaidService } from 'src/app/services/paid.service';
import { parse } from 'path';
import { HttpParams } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.css']
})
export class PaidComponent implements OnInit  {

  public selectedYear = 0;
  public selectedMonth = 0;
  public selectedMonthName = '';
  public activeTabIndex: number = 0;
  public selectedWeeks: string = ''
  public currentWeekIndex: number = 0;

  public weeks: any[] = [];
  public years: number[] = [];
  public months: { value: number, name: string }[] = [];
  public paidManagement = [];

  public nna: any[] = [];
  public weekStart = '';
  public weekEnd = '';
  public dataRows: any[] = [];
  public payRegisters: any[] = [];

  public dateForm: FormGroup | any;

  public editing = false;

  public minPay = 0;
  public percentMeasure: number[] = [];
  public discount: number[] = [];

  public incentive: number[] = [];
  public study: number[] = [];
  public bedroom: number[] = [];

  constructor(
    private apiUserService: ApiUserService,
    private paidService: PaidService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.years = this.generateYears();
    this.months = this.generateMonths();
    this.activeTabIndex = 0;

    this.dateForm = new FormGroup({
      year: new FormControl(),
      month: new FormControl()
    });

    this.getWeeks();
    this.getPayRegisters();
    this.getNNA();
    this.getPaidManagement();
  }

  public getNNA(){
    this.apiUserService.getUsersDataType('nna').subscribe({
      next: (nna: any) => {
        this.nna = nna;

        if(this.payRegisters.length === 0){
          for (let i = 0; i < this.nna.length; i++) {
                    this.percentMeasure[i] = 0;
                    this.discount[i] = 0;
                    this.incentive[i] = 0;
                    this.study[i] = 0;
                    this.bedroom[i] = 0;
                  }
        }
      }
    })
  }

  public getPaidManagement(){
    this.paidService.getPaidManagements().subscribe({
      next: (paidManagement: any) => {
        this.paidManagement = paidManagement;
      },
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al obtener los datos de registro de pagas.', 'danger');
      },
    })
  }

  public getInitial(name: string): string {
    if (name && name.length > 0) {
      return name.charAt(0);
    }
    return '';
  }

  public generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
      years.push(year);
    }
    return years;
  }

  public generateMonths(): { value: number, name: string }[] {
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
    this.getWeeks();
    this.getPayRegisters();
  }

  public activateTab(index: number) {
    this.activeTabIndex = index;
    this.getPayRegisters();
  }

  public saveSelectedValues(): void {
    this.months.forEach(m => {
      if(m.value == this.selectedMonth){
        this.selectedMonthName = m.name;
      }
    });
  }

  public getWeeks(){
    this.weeks = [];

    const momentRangeObj = (momentRange as any).extendMoment(moment);

    const startOfMonth = momentRangeObj([this.selectedYear, this.selectedMonth - 1]);
    const endOfMonth = momentRangeObj(startOfMonth).endOf('month');
    const weeksInRange = Array.from(momentRangeObj.range(startOfMonth, endOfMonth).by('week'));

    const weeksArray = weeksInRange.map((week: any) => {
      this.weeks.push(week);
    });
  }

  public getStartOfWeek(week: any){
    this.weekStart = week.startOf('week').format('YYYY-MM-DD');
    return week.startOf('week').format('YYYY-MM-DD');
  }

  public getEndOfWeek(week: any){
    return week.endOf('week').format('YYYY-MM-DD');
  }

  public getAge(user: any){
    var birth_date = user.userData.birth_date;
    var today = new Date().toISOString().slice(0, 10);

    var anioInicio = parseInt(birth_date.slice(0, 4));
    var mesInicio = parseInt(birth_date.slice(5, 7));
    var diaInicio = parseInt(birth_date.slice(8, 10));

    var anioFin = parseInt(today.slice(0, 4));
    var mesFin = parseInt(today.slice(5, 7));
    var diaFin = parseInt(today.slice(8, 10));

    var age = anioFin - anioInicio;

    if (mesFin < mesInicio) {
      age--;
    } else if (mesFin === mesInicio && diaFin < diaInicio) {
      age--;
    }

    return age;
  }

  public getMinPay(user: any){
    const age = this.getAge(user);

    for (var i = 0; i < this.paidManagement.length; i++) {
      var age_range = this.paidManagement[i]['age_range'];

      if (age >= age_range[0] && age <= age_range[1]) {
        this.minPay = parseInt(this.paidManagement[i]['min_pay']);
        return this.paidManagement[i]['min_pay'];
      }
    }
    return 0;
  }

  public getMaxPay(user: any){
    const age = this.getAge(user);

    for (var i = 0; i < this.paidManagement.length; i++) {
      var age_range = this.paidManagement[i]['age_range'];

      if (age >= age_range[0] && age <= age_range[1]) {
        return this.paidManagement[i]['max_pay'];
      }
    }
    return null;
  }

  public getMaxIncentive(user: any, typeIncentive: string){
    const age = this.getAge(user);

    for (var i = 0; i < this.paidManagement.length; i++) {
      var age_range = this.paidManagement[i]['age_range'];

      const type: string = typeIncentive;
      switch (type) {
        case 'maxIncentives':
          if (age >= age_range[0] && age <= age_range[1]) {
            return this.paidManagement[i]['incentive'] * 10;
          }
          break;
          case 'maxTasks':
            if (age >= age_range[0] && age <= age_range[1]) {
              const maxIncetives = this.paidManagement[i]['incentive'] * 7
              return maxIncetives.toFixed(2);
            }
            break;
        default:
          break;
      }
    }
    return 0;
  }

  public calculateBase(payBase : number, percentMeasure: any, discount: number) {
    const total = Number(payBase) - Number(percentMeasure)/100*Number(payBase) - Number(discount);
    return total;
  }

  public incentiveTotal(incentive: any, study: any, bedroom: any){
    const total = Number(incentive) + Number(study) + Number(bedroom);
    return total;
  }

  public negativePay(payBase : number, percentMeasure: any, discount: number, incentive: any, study: any, bedroom: any){
    const total = (Number(payBase) - Number(percentMeasure)/100*Number(payBase) - (Number(discount)) - Number(incentive) + Number(study) + Number(bedroom));
    if(total < 0){
      return 'P.N';
    } else {
      return 'P.P';
    }
  }

  public totalPaid(payBase : number, percentMeasure: any, discount: number, incentive: any, study: any, bedroom: any){
    const total = (Number(payBase) - Number(percentMeasure)/100*Number(payBase) - (Number(discount)) - Number(incentive) + Number(study) + Number(bedroom));
    if(total < 0){
      return this.incentiveTotal(incentive, study, bedroom);
    } else {
      return this.incentiveTotal(incentive, study, bedroom) + this.calculateBase(payBase, percentMeasure, discount);
    }



  }

  public saveTable(): void {
    const activeTab: any = document.querySelector('.tab-pane.fade.show.active');
    const table: any = activeTab.querySelector('.table-paid');
    const rows = Array.from(table.querySelectorAll('tr')).slice(1);

    const headers = Array.from(table.querySelectorAll('th')).map((header: any) => {
      return header.textContent.trim();
    });

    rows.forEach((fila: any) => {
      const cells = fila.querySelectorAll('td');
      const dataRow: any = {};

      Array.from(cells).forEach((cell: any, index: number) => {
        const headerName = headers[index];
        const cellValue = cell.querySelector('input') ? cell.querySelector('input').value.trim() : cell.textContent.trim();
        dataRow[headerName] = cellValue;
      });

      this.savePay(dataRow);
      this.dataRows.push(dataRow);
    });
  }

  public savePay(row: any){
    const payInfo = new HttpParams()
    .set('week_start', (moment(row['Lunes'], 'DD/MM/YYYY')).format('YYYY-MM-DD'))
    .set('week_end', (moment(row['Domingo'], 'DD/MM/YYYY')).format('YYYY-MM-DD'))
    .set('base_pay', row['Paga Base'] ?? '0' )
    .set('max_pay', row['Paga Máxima'] ?? '0' )
    .set('percent_measure', row['% Medida'] ?? '0' )
    .set('discount', row['Descuentos'] ?? '0' )
    .set('base_pay_rest', row['Resto Paga Base'] ?? '0' )
    .set('max_incentive', row['Máximo Incentivos'] ?? '0' )
    .set('incentive', row['Incentivos'] ?? '0' )
    .set('max_study', row['Máximo Estudio'] ?? '0' )
    .set('study', row['Estudio'] ?? '0' )
    .set('max_bedroom', row['Máximo Habitación'] ?? '0' )
    .set('bedroom', row['Habitación'] ?? '0' )
    .set('total_incentive', row['Total Incentivos'] ?? '0' )
    .set('negative_pay', row['Paga negativa'] ?? '0' )
    .set('total_pay', row['Paga Total'] ?? '0' );

    this.paidService.savePayRegister(row['NNA ID'], payInfo).subscribe({
      next: (payInfo: any) => {
        this.alertService.setAlert('Registros guardados con éxito.', 'success');
      },
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Error al guardar el registros.', 'danger');
      },
    })
  }

  public getPayRegisters(){
    const weekStart = this.getStartOfWeek(this.weeks[this.activeTabIndex]);

    this.paidService.getPayRegisters(weekStart).subscribe({
      next: (payRegisters: any)=> {
        this.payRegisters = payRegisters['data'];

        if(this.payRegisters.length !== 0){
          for (let index = 0; index < this.payRegisters.length; index++) {
            this.percentMeasure[index] = this.payRegisters[index].percent_measure;
            this.discount[index] = this.payRegisters[index].discount;
            this.incentive[index] = this.payRegisters[index].incentive;
            this.study[index] = this.payRegisters[index].study;
            this.bedroom[index] = this.payRegisters[index].bedroom;
          }
        } else {
          for (let i = 0; i < this.nna.length; i++) {
            this.percentMeasure[i] = 0;
            this.discount[i] = 0;
            this.incentive[i] = 0;
            this.study[i] = 0;
            this.bedroom[i] = 0;
          }
        }
      },
      error: (e) => {
        console.log(e);
        this.alertService.setAlert('Algo ha ocurrido al cargar los registros.', 'warning');
      },
    })
  }
}
