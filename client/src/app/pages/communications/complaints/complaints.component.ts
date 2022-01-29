import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from "@angular/router";
import { CommunicationsService } from "../../../services/communications.service";
import { CommonService } from '../../../services/common.service';
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintsModalComponent } from "./complaints-modal/complaints-modal.component";
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})

export class ComplaintsComponent implements OnInit {

  source: any = [];

  translate: any;

  settings: any;

  customerName = "";

  activity_datalog: any = {};
  type_datalog: any = {};

  constructor(private spinnerService: Ng4LoadingSpinnerService, private CommunicationService: CommunicationsService, private router: Router,
    public commonService: CommonService, private translateService: TranslateService,
    protected localStorage: LocalStorage, private customerProfileService: CustomerProfileService, private modalService: NgbModal) {

  //  this.activity_datalog = this.commonService.dataLogKey.MyCases;
  //  this.type_datalog = this.commonService.dataLogKey.Type;

    this.translate = this.commonService.returnTranslate();
    this.initTableSettings();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {

      this.initTableSettings();
    });


  }

  ngOnDestroy() {
   // this.commonService.userDataLogging(this.activity_datalog.MYCASES, this.type_datalog.END, {});
  }

  ngOnInit() {

    this.localStorage.getItem('custDetails').subscribe((data) => {

      this.customerName = data.Name;
    });

    this.getComplaints();

  //  this.commonService.userDataLogging(this.activity_datalog.MYCASES, this.type_datalog.START, {});

  }

  // settings = {

  //   hideSubHeader: true,

  //   noDataMessage: "No Cases Found",

  //   actions: {
  //     add: false,
  //     edit: false,
  //     delete: false
  //   },

  //   columns: {

  //     ReqId: {
  //       title: "Case ID",
  //       type: "number",
  //       width: "10%",
  //       editable: false
  //     },
  //     ReqDesc: {
  //       title: "Case Description",
  //       type: "string",
  //       editable: false
  //     },
  //     StartDate: {
  //       title: "Case Start Date",
  //       type: "string",
  //       editable: false
  //     },
  //     EndDate: {
  //       title: "Case End Date",
  //       type: "string",
  //       editable: false
  //     },
  //     Status: {
  //       title: "Case Status",
  //       type: "string",
  //       editable: false
  //     }

  //   }

  // };

  // settings_ar = {

  //   hideSubHeader: true,

  //   noDataMessage: "لا توجد حالات",

  //   actions: {
  //     add: false,
  //     edit: false,
  //     delete: false
  //   },

  //   columns: {

  //     ReqId: {
  //       title: "قضية هوية شخصية",
  //       type: "number",
  //       width: "10%",
  //       editable: false
  //     },
  //     ReqDesc: {
  //       title: "وصف حالة",
  //       type: "string",
  //       editable: false
  //     },
  //     StartDate: {
  //       title: "تاريخ بدء القضية",
  //       type: "string",
  //       editable: false
  //     },
  //     EndDate: {
  //       title: "تاريخ انتهاء القضية",
  //       type: "string",
  //       editable: false
  //     },
  //     Status: {
  //       title: "وضع حالة",
  //       type: "string",
  //       editable: false
  //     }

  //   }

  // };

  initTableSettings(): void {

    this.settings = {

      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMUNICATION_TABLE_SETTING.NoCasesFound'),

      actions: {
        add: false,
        edit: false,
        delete: false
      },

      columns: {

        ReqId: {
          title: this.translate.instant('COMMUNICATION_TABLE_SETTING.CaseID'),
          type: "number",
          width: "10%",
          editable: false
        },
        ReqDesc: {
          title: this.translate.instant('COMMUNICATION_TABLE_SETTING.CaseDescription'),
          type: "string",
          editable: false
        },
        StartDate: {
          title: this.translate.instant('COMMUNICATION_TABLE_SETTING.CaseStartDate'),
          type: "string",
          editable: false,
          valuePrepareFunction: (value) => { return value ? this.commonService.returnDate_ddmmyyyyToyyyymmdd_WithSlash(value) : "" }
        },
        EndDate: {
          title: this.translate.instant('COMMUNICATION_TABLE_SETTING.CaseEndDate'),
          type: "string",
          editable: false,
          valuePrepareFunction: (value) => { return value ? this.commonService.returnDate_ddmmyyyyToyyyymmdd_WithSlash(value) : "" }
        },
        Status: {
          title: this.translate.instant('COMMUNICATION_TABLE_SETTING.CaseStatus'),
          type: "string",
          editable: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'Status', 'StatusAr');
          }
        }

      }

    };

  }

  getComplaints() {

    this.spinnerService.show();

    try {

      this.CommunicationService
        .getAllComplaints(this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then(complaints => (this.bindComplaints(complaints)), err => this.resolveError());

    }

    catch (error) {

      this.resolveError();

    }

  }

  bindComplaints(complaints) {

    if (complaints.MessType === 'E') {
      this.commonService.showFailureToast(this.commonService.returnTextBasedOnLangIfExist(complaints, 'MessText', 'MessTextAr'));
      this.spinnerService.hide();
      return
    }

    this.source = complaints.MyCasesStruct;
    this.spinnerService.hide();

  }

  createNewComplaintModel() {

    this.router.navigateByUrl('pages/communications/complaints/new-complaint/new-complaint.component');

   // this.commonService.userDataLogging(this.activity_datalog.MYCASES_CREATE, this.type_datalog.CLICK, {});

  }

  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

  onView(event) {


    let complaintsModalParams = {};

    complaintsModalParams = {

      header: this.translate.instant('COMMUNICATIONS.ViewCase') + event.data.ReqId,

      method: "view",

      inputs: [
        {
          id: "Name",
          name: this.translate.instant('COMMUNICATIONS.Name'),
          type: "text_disabled",
          value: this.customerName,

        },
        {
          id: "EmailId",
          name: this.translate.instant('COMMUNICATIONS.EmailID'),
          type: "text_disabled",
          value: event.data.Email,

        },
        {
          id: "MobileNo",
          name: this.translate.instant('COMMUNICATIONS.MobileNumber'),
          type: "text_disabled",
          value: event.data.PhoneNum,

        },
        {
          id: "Category",
          name: this.translate.instant('COMMUNICATIONS.Category'),
          type: "text_disabled",
          value: event.data.CatDesc,
          required: "true",
        },
        {
          id: "Subject",
          name: this.translate.instant('COMMUNICATIONS.Subject'),
          type: "text_disabled",
          value: event.data.ReqDesc,
        },
        // {
        //   id: "Country",
        //   name: this.translate.instant('CONTRACTORS.Country'),
        //   type: "text",
        //   value: event.data.Country,
        //   required: "true",
        // },
        // {
        //   id: "Attachment",
        //   name: this.translate.instant('CONTRACTORS.Attachment'),
        //   type: "text",
        //   value: event.data.Attachment,
        //   required: "true",
        // },
        // {
        //   id: "CreatedDate",
        //   name: "CreatedDate",
        //   type: "text",
        //   value: "",
        //   required: "true",
        // },
        // {
        //   id: "status",
        //   name: "status",
        //   type: "text",
        //   value: "",
        //   required: "true",
        // },
      ],
      buttons: []
    };

    let complaintsModal = this.modalService.open(ComplaintsModalComponent, this.commonService.modalOptions);
    complaintsModal.componentInstance.ComplaintsModalsForm = complaintsModalParams;

   // this.commonService.userDataLogging(this.activity_datalog.MYCASES_VIEW, this.type_datalog.CLICK, {});
  }

  resolveDate(Dateval) {

    var temp_Dateval = Dateval.replace(".", "").replace(/\//g, "").replace("-", "");

    var dateString = temp_Dateval.slice(0, 4) + "/" + temp_Dateval.slice(4, 6) + "/" + temp_Dateval.slice(6, 8);

    return dateString;
  }

}