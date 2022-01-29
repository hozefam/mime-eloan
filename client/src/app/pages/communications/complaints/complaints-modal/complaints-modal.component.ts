import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonService } from "../../../../services/common.service";
import { DocumentListComponent } from '../../../../components/document-list/document-list.component';

@Component({
  selector: 'complaints-modal',
  templateUrl: './complaints-modal.component.html',
  styleUrls: ['./complaints-modal.component.scss']
})
export class ComplaintsModalComponent implements OnInit {

  ComplaintsModalsForm: any = {};

  constructor(public commonService: CommonService, private activeModal: NgbActiveModal, private router: Router, private spinnerService: Ng4LoadingSpinnerService) { }


  ngOnInit() {
  }

  
  onSubmit(){

  }

  onInputChange(id) {

  }

  onngmodelchange(input, ComplaintsModalsForm) {

  }
  
  closeModal() {
    this.activeModal.close();
  }

}
