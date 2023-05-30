import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from 'src/app/services/document.service';
import { DOCUMENTS_URL } from 'src/environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-document',
  templateUrl: './show-document.component.html',
  styleUrls: ['./show-document.component.css']
})
export class ShowDocumentComponent implements OnInit {

  public documentId : string | undefined;
  public urlDocument: SafeResourceUrl | undefined;
  public typeDocument: string | undefined;
  public nameDocument: string | undefined;

  constructor(
    private apiDocumentService: DocumentService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.typeDocument = this.data.type_document;

    switch (this.typeDocument) {
      case 'expedient':
        this.apiDocumentService.getExpedientDocument(this.data.document_id).subscribe({
          next: (document: any) => {
            console.log(document);
            this.nameDocument = document['data'].name_file;
            const url = DOCUMENTS_URL +  document['url'];
            this.urlDocument = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          },
          error: (e) => console.log(e)
        })
        break;
      case 'health':
        this.apiDocumentService.getHealthDocument(this.data.document_id).subscribe({
          next: (document: any) => {
            console.log(document);
            this.nameDocument = document['data'].name_file;
            const url = DOCUMENTS_URL +  document['url'];
            this.urlDocument = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          },
          error: (e) => console.log(e)
        })
        break;
      default:
        break;
    }

  }

}
