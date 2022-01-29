import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from "../../../../../services/common.service";
import * as _l from 'lodash';
import { _ } from 'underscore';

export interface pendingDocsListTable {
  Id: string;
  Desc: string;
  Operation: string;
  Key: string;
  Type: string
}

@Component({
  selector: 'receive-request-communication-modal',
  templateUrl: './receive-request-communication-modal.component.html',
  styleUrls: ['./receive-request-communication-modal.component.scss']
})
export class ReceiveRequestCommunicationModalComponent implements OnInit {

  translate: any;

  ReceiveRequestCommunicationModalsForm: any = {};
  noDocumentsIndicator: boolean;

  displayedColumns: string[] = ["Key", "Id", "Desc"];

  constructor(public commonService: CommonService, private activeModal: NgbActiveModal) {

    this.translate = this.commonService.returnTranslate();

  }

  ngOnInit() {
    console.log("Pending documents list");
    if (this.ReceiveRequestCommunicationModalsForm.unique.length > 0) {
      this.noDocumentsIndicator = false;
      this.setPendingDocsListInTable();
    }
    else {
      this.noDocumentsIndicator = true;
    }
  }

  setPendingDocsListInTable() {
    let that = this;
    that['_l'] = _l;
    let groupedObject = {}
    _.forEach(this.ReceiveRequestCommunicationModalsForm.unique, function (num) {
      groupedObject[num.Operation] = that.ReceiveRequestCommunicationModalsForm.grouped[num.Operation];
      let docsListPayment = _l.filter(that.ReceiveRequestCommunicationModalsForm.grouped[num.Operation], function (num) {
        return num.Type == 'Payment';
      });
      let docsListContract = _l.filter(that.ReceiveRequestCommunicationModalsForm.grouped[num.Operation], function (num) {
        return num.Type == 'Contract';
      });
      var ELEMENT_DATA_PAYM: pendingDocsListTable[] = _l.cloneDeep(docsListPayment);
      var ELEMENT_DATA_CONT: pendingDocsListTable[] = _l.cloneDeep(docsListContract);
      groupedObject[num.Operation]['docsListForTablePaym'] = _l.cloneDeep(ELEMENT_DATA_PAYM);
      groupedObject[num.Operation]['docsListForTableCont'] = _l.cloneDeep(ELEMENT_DATA_CONT);
    })
    // var ELEMENT_DATA: pendingDocsListTable[] = [
    //   { Id: "1", Desc: "Desc1", Operation: "1", Key: "asdf", Type: "asdf" },
    //   { Id: "2", Desc: "Desc2", Operation: "1", Key: "asdf", Type: "asdf" }
    // ];
    // this.dataSource = ELEMENT_DATA;
  }

  closeModal() {
    this.activeModal.close();
  }

  openPaymentBasedonOnId(element_data) {
    this.ReceiveRequestCommunicationModalsForm.buttons[0].handler(element_data);
  }

  openContractBasedOnId(element_data) {
    this.ReceiveRequestCommunicationModalsForm.buttons[1].handler(element_data);
    this.activeModal.close();
  }

}
