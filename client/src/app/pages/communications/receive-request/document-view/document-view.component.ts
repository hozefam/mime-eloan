import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
// import { LoanApplicationTechnicalInformationComponent } from '../technical-information.component'
// import { CommonService } from './../../../../../services/common.service';
// import { CommunicationsService } from '../../../../../services/communications.service'


@Component({
  selector: 'document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})

export class DocumentViewComponent implements OnInit {

  // documents = {};
  docListModalsForm={};

  constructor(private activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit() {

  }
  closeModal() {
    this.activeModal.close();
  }


}