import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommunicationsService } from '../../services/communications.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CustomerProfileService } from '../../services/customer-profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})

export class DocumentListComponent implements AfterViewInit {

  deleteModalReference: any;

  statusCode = '';

  method = '';

  @Input() documents: any;

  translate: any;

  constructor(private modalService: NgbModal, private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService,
    public commonService: CommonService, private CommunicationsService: CommunicationsService) {

    this.translate = this.commonService.returnTranslate();

  }

  ngOnInit() {

    this.statusCode = this.customerProfileService.statusCode;

    if (this.documents.method)
      this.method = this.documents.method;

  }

  ngAfterViewInit() { }

  documentView(document) {
    try {
      // console.log(document.docUrl);
      // window.location.assign(document.docUrl);
      window.open(document.docUrl);
      // window.location.href = document.docUrl;
    } catch (err) {

    }
    // this.CommunicationsService.downloadDocumentService(document.EntityId,
    //   document.RefId, document.DocumentId,'l',document.FileName )
    //   .then(response => (this.commonService.downLoadFile(response, "application/octet-stream", document.FileName)), err => this.commonService.showFailureToast(err));
  }

  deleteDocument(delete_modal, document) {

    this.deleteModalReference = this.modalService.open(delete_modal);
    this.deleteModalReference.event = document;

  }

  onDeleteConfirm() {

    this.deleteModalReference.close();

    this.spinnerService.show();

    this.CommunicationsService.deleteDocumentService({
      entityId: this.deleteModalReference.event.EntityId,
      refId: this.deleteModalReference.event.RefId, documentId: this.deleteModalReference.event.DocumentId, operationType: 'p',
    })
      .then(response => (this.showResult(response, this.deleteModalReference.event)), err => this.commonService.showFailureToast(err));

  }

  showResult(response, document) {

    if (response.MessType == 'S') {

      let temp_documents = [];

      for (let i = 0; i < this.documents.documentList.length; i++)
        if (!(parseInt(this.documents.documentList[i].DocumentId) === parseInt(document.DocumentId)))
          temp_documents.push(this.documents.documentList[i]);

      this.documents.documentList = temp_documents;

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('COMMON.DocumentDeletionSuccessful'));

    }

    else {

      this.commonService.showFailureToast(this.translate.instant('COMMON.DocumentDeletionFailed'));

      this.spinnerService.hide();

    }

  }

  onCloseDeleteModal() {

    this.deleteModalReference.close();

  }

}
