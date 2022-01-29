import { Component, OnInit } from "@angular/core";
import { CommunicationsService } from "../../../services/communications.service";
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../services/common.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { CommonCommentsService } from '../../../services/common-comments.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'send-request',
  templateUrl: './send-request.component.html',
  styleUrls: ['./send-request.component.scss']
})

export class SendRequestComponent implements OnInit {

  translate: any;
  source: any = [];
  customerProfileId: any = String;

  settings: any;

  activity_datalog: any = {};
  type_datalog: any = {};

  constructor(private spinnerService: Ng4LoadingSpinnerService, private router: Router, public commonService: CommonService, private communicationsService: CommunicationsService, private modalService: NgbModal, private toastr: ToastrService,
    private customerProfileService: CustomerProfileService, private translateService: TranslateService, private commonCommentsService: CommonCommentsService) {

   // this.activity_datalog = this.commonService.dataLogKey.SendReq;
    //this.type_datalog = this.commonService.dataLogKey.Type;

    this.translate = this.commonService.returnTranslate();
    this.initTableSettings();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {

      this.initTableSettings();
    });

  }

  ngOnDestroy() {
    //this.commonService.userDataLogging(this.activity_datalog.SEND_REQ, this.type_datalog.END, {});
  }
  
  ngOnInit() {

    this.getSendRequests();

  //  this.commonService.userDataLogging(this.activity_datalog.SEND_REQ, this.type_datalog.START, {});

  }


  // settings_ar = {

  //   hideSubHeader: true,

  //   noDataMessage: "لم يتم العثور على طلبات مرسلة",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: false,
  //     columnTitle: "إجراءات"
  //   },

  //   columns: {

  //     RequestId: {
  //       title: "Request ID",
  //       type: "number",
  //       width: "12%",
  //       editable: false
  //     },
  //     RequestType: {
  //       title: "Request Type",
  //       type: "string",
  //       editable: false
  //     },
  //     RequestStatus: {
  //       title: "Request Status",
  //       type: "string",
  //       editable: false
  //     },
  //     CreatedDate: {
  //       title: "Request Date",
  //       type: "string",
  //       editable: false
  //     }
  // ,
  // RequestDate: {
  //   title: "Request Date",
  //   type: "string",
  //   editable: false
  // }

  //   }

  // };

  initTableSettings(): void {

    this.settings = {

      hideSubHeader: true,

      noDataMessage: this.translate.instant('SEND_REQUEST.NoSentRequestsFound'),

      mode: "external",

      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: false,
        columnTitle: this.translate.instant('COMMON.Actions')
      },

      columns: {

        RequestId: {
          title: this.translate.instant('DASHBOARD.RequestID'),
          type: "number",
          width: "12%",
          editable: false
        },
        RequestType: {
          title: this.translate.instant('DASHBOARD.RequestDescription'),
          type: "string",
          editable: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'RequestType', 'RequestTypeAr');
          }
        },
        RequestStatus: {
          title: this.translate.instant('DASHBOARD.RequestStatus'),
          type: "string",
          editable: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'RequestStatus', 'RequestStatusAr');
          }
        },
        CreatedDate: {//Previously it was CreatedDate
          title: this.translate.instant('DASHBOARD.RequestDate'),
          type: "string",
          editable: false,
          valuePrepareFunction: (value) => { return value ? this.commonService.returnDate_ddmmyyyyToyyyymmdd_WithSlash(value) : "" }
        },
        RequestDate: {//Previously it was CreatedDate
          title: this.translate.instant('COMMON.SubmissionDate'),
          type: "string",
          editable: false,
          valuePrepareFunction: (value) => { return value ? this.commonService.returnDate_ddmmyyyyToyyyymmdd_WithSlash(value) : "" }
        }
        // ,
        // RequestDate: {
        //   title: "Request Date",
        //   type: "string",
        //   editable: false
        // }

      }

    };

  }

  getSendRequests() {

    this.spinnerService.show();

    this.communicationsService
      .getSendRequestInfo(this.customerProfileService.currentCustomerProfile.customerProfileId, 'ALL')
      .then(requests => (this.source = requests, this.spinnerService.hide()), err => this.resolveError());

  }

  onEdit(event) {

    //this.commonService.userDataLogging(this.activity_datalog.SEND_REQ_SEL, this.type_datalog.CLICK, {});

    if (event.data.RequestCode == "NPRE" || event.data.RequestCode == "NLOA") {

      this.customerProfileService.setLoanRequestId(event.data.RequestId);

      this.customerProfileService.setStatusCode(event.data.StatusCode);

      this.customerProfileService.setCommentsFrom(event.data.RequestCode == "NPRE" ? "P" : "L");

      if (event.data.StatusCode == 'Q')
        this.getCommonComments("SENT", event.data.RequestId, event.data.RequestCode, event.data.StatusCode);

      else {

        this.customerProfileService.setCommentArray({});
        this.customerProfileService.setCommentArrayExists(false);

        if (event.data.RequestCode == "NPRE")
          this.router.navigate(['/pages/new-request/preliminary-request/create-prq/create-prq'], { queryParams: { requestId: this.customerProfileService.getEncryptedString(String(event.data.RequestId)), status: this.customerProfileService.getEncryptedString(event.data.StatusCode) } });

        else if (event.data.RequestCode == "NLOA")
          this.router.navigateByUrl('/pages/new-request/loan-application/project-information');

      }

    }

    else if (event.data.RequestCode == "COMR")
      this.router.navigateByUrl('/pages/communications/receive-request');

  }

  getCommonComments(commentTypeCode, sentReqId, sentReqType, sentReqStatus) {

    this.spinnerService.show();

    try {

      this.commonCommentsService
        .getCommonComments(sentReqId, commentTypeCode)
        .then((res) => (this.resolveCommonComments(res, sentReqId, sentReqType, sentReqStatus)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  resolveCommonComments(res, sentReqId, sentReqType, sentReqStatus) {

    if (res.MessType === "S")
      this.customerProfileService.setCommentArray(res);

    else {

      this.customerProfileService.setCommentArray({});
      this.customerProfileService.setCommentArrayExists(false);

    }

    this.spinnerService.hide();

    if (sentReqType == "NPRE")
      this.router.navigate(['/pages/new-request/preliminary-request/create-prq/create-prq'], { queryParams: { requestId: this.customerProfileService.getEncryptedString(String(sentReqId)), status: this.customerProfileService.getEncryptedString(sentReqStatus) } });

    else if (sentReqType == "NLOA")
      this.router.navigateByUrl('/pages/new-request/loan-application/project-information');

  }

  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

}