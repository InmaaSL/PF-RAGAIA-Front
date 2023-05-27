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

  constructor(
    private apiDocumentService: DocumentService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.apiDocumentService.getExpedientDocument(this.data.document_id).subscribe({
      next: (document: any) => {
        console.log(document);
        const url = DOCUMENTS_URL +  document['data'];
        this.urlDocument = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (e) => console.log(e)
    })
  }

}
