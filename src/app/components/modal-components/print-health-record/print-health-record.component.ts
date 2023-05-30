import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import * as moment from 'moment';
import 'moment/locale/es';

@Component({
  selector: 'app-print-health-record',
  templateUrl: './print-health-record.component.html',
  styleUrls: ['./print-health-record.component.css']
})
export class PrintHealthRecordComponent implements OnInit {

  public document: any;
  public pages = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    moment.locale('es');
  }

  ngOnInit() {
    if(this.data){
      this.document = this.data.document;
    }
  }

  formatDate(date: string): string {
    return moment.utc(date).format('LLL');
  }

  generatePDF() {
    const DATA: any = document.getElementById('to-print');
    const doc = new jsPDF();

    // Obtener el contenido HTML como una cadena de texto
    const htmlContent = DATA.innerHTML;

    // Establecer los estilos CSS para ajustar el tamaño de la fuente
    const styles = `
      <style>
        body {
          font-size: 12px; /* Tamaño de fuente deseado */
        }
      </style>
    `;


  // Combinar los estilos CSS con el contenido HTML
  const fullHtml = styles + htmlContent;

  // Generar PDF a partir del HTML
  html2canvas(DATA, { scale: 2 }) // Ajusta la escala según tus necesidades
    .then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
      doc.save('archivo.pdf');
    })
    .catch((error) => {
      console.error('Error al generar el PDF:', error);
    });
  }


}
