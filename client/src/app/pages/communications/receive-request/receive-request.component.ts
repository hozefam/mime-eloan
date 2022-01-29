import { Component, OnInit } from '@angular/core';
import { PreliminaryRequestService } from "../../../services/preliminary-request.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from "../../../services/communications.service";
import { ProjInfoService } from "../../../services/project-information.service";
import { CommonService } from "../../../services/common.service";
import { DocumentViewComponent } from './document-view/document-view.component';
import { LocalDataSource } from 'ng2-smart-table';
import { CommonCommentsService } from '../../../services/common-comments.service';
import { NavigationExtras } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { _ } from 'underscore';
import * as _l from 'lodash';
//import * as _s from 'underscore.string';

@Component({
  selector: 'receive-request',
  templateUrl: './receive-request.component.html',
  styleUrls: ['./receive-request.component.scss']
})

export class ReceiveRequestComponent implements OnInit {
  activeModal = 2;
  revealed_status = true;
  translate: any;
  source = new LocalDataSource;
  received_requests = [];
  customerProfileId: any = String;

  documentStructure = {};
  documentStructureArray = [];
  NumOfDocs = [];
  settings: any;

  activity_datalog: any = {};
  type_datalog: any = {};

  constructor(private translateService: TranslateService, private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService, public commonService: CommonService, private projectInformationService: ProjInfoService, private communicationsService: CommunicationsService, private modalService: NgbModal, private toastr: ToastrService, private router: Router,
    private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService,
    private commonCommentsService: CommonCommentsService) {

   // this.activity_datalog = this.commonService.dataLogKey.Inbox;
  //  this.type_datalog = this.commonService.dataLogKey.Type;

    this.translate = this.commonService.returnTranslate();
    this.initTableSettings();
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log(event.lang);
      this.initTableSettings();
    });

  }

  ngOnDestroy() {
   // this.commonService.userDataLogging(this.activity_datalog.INBOX, this.type_datalog.END, {});
  }

  ngOnInit() {
    console.log("RecReq");
    this.getLoanDropdowns();
    this.getCommunicationRequests();

  //  this.commonService.userDataLogging(this.activity_datalog.INBOX, this.type_datalog.START, {});
  }

  // settings = {

  //   hideSubHeader: true,

  //   noDataMessage: "No Received Requests Found",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<img src="assets/images/communications.png" class="icon-arrangement onhovertranitag" title="Communications">',
  //   },

  //   delete: {
  //     deleteButtonContent: '<i class="nb-edit" title="Communication Details"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },
  //   columns: {
  //     CommId: {
  //       title: "Communication ID",
  //       type: "number",
  //       width: "17%",
  //       editable: false
  //     },
  //     SentReqId: {
  //       title: "Request ID",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     },
  //     SentReqTypeDesc: {
  //       title: "Request Description",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     },
  //     CommReqStatusDesc: {
  //       title: "Communication Status",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     },
  //     SubDeadLine: {
  //       title: "Expected Completion Date",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     }
  //   }
  // };

  // settings_ar = {

  //   hideSubHeader: true,

  //   noDataMessage: "لم يتم العثور على طلبات مستلمة",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<img src="assets/images/communications.png" class="icon-arrangement onhovertranitag" title="التواصل">',
  //   },

  //   delete: {
  //     deleteButtonContent: '<i class="nb-edit" title="تفاصيل الاتصالات"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "إجراءات",
  //   },
  //   columns: {
  //     CommId: {
  //       title: "معرف الاتصال",
  //       type: "number",
  //       width: "17%",
  //       editable: false
  //     },
  //     SentReqId: {
  //       title: "طلب معرف",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     },
  //     SentReqTypeDesc: {
  //       title: "حالة الاتصال",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     },
  //     CommReqStatusDesc: {
  //       title: "الحالة",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     },
  //     SubDeadLine: {
  //       title: "تاريخ الإنتهاء المتوقع",
  //       type: "string",
  //       editable: false,
  //       filter: false
  //     }
  //   }
  // };




  initTableSettings(): void {
    this.settings = {

      hideSubHeader: true,

      noDataMessage: this.translate.instant('RECEIVE_REQUEST.NoReceivedRequestsFound'),

      mode: "external",

      edit: {
        editButtonContent: '<img src="assets/images/communications.png" class="icon-arrangement onhovertranitag" title="' + this.translate.instant('DASHBOARD.Communications') + '">',
      },

      delete: {
        deleteButtonContent: '<i class="nb-edit" title="' + this.translate.instant('RECEIVE_REQUEST.CommunicationDetails') + '"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('RECEIVE_REQUEST.Actions'),
      },

      columns: {
        CommId: {
          title: this.translate.instant('RECEIVE_REQUEST.CommId'),
          type: "number",
          width: "17%",
          editable: false
        },
        SentReqId: {
          title: this.translate.instant('RECEIVE_REQUEST.SentReqId'),
          type: "string",
          editable: false,
          filter: false
        },
        SentReqTypeDesc: {
          title: this.translate.instant('RECEIVE_REQUEST.SentReqTypeDesc'),
          type: "string",
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'SentReqTypeDesc', 'SentReqTypeDescAr');
          }
        },
        CommReqStatusDesc: {
          title: this.translate.instant('RECEIVE_REQUEST.CommReqStatusDesc'),
          type: "string",
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'CommReqStatusDesc', 'CommReqStatusDescAr');
          }
        },
        SubDeadLine: {
          title: this.translate.instant('RECEIVE_REQUEST.SubDeadLine'),
          type: "string",
          editable: false,
          filter: false,
          valuePrepareFunction: (value) => { return value ? this.commonService.returnDate_ddmmyyyyToyyyymmdd_WithSlash(value) : "" }
        }
      }
    };
  };

  onDoc(event) {
    console.log("onDoc");
    var temp = 0;
    let docListModal;
    this.Ng4LoadingSpinnerService.show();
    try {
      this.documentStructureArray = [];
      this.communicationsService.getDocumentService(event.data.CommId, "c").then(requests => {
        this.documentStructureArray.push(this.commonService.returnViewDocumentJson(requests));
        if (this.documentStructureArray.length != 0) {
          for (var i = 0; i < this.documentStructureArray.length; i++) {
            for (var j = 0; j < this.documentStructureArray[i].documentList.length; j++) {
              if (this.documentStructureArray[i].documentList[j].EntityId === parseInt(event.data.CommId)) {
                this.documentStructure = this.documentStructureArray[i];
                temp = 1;
              }
            }
          }
          if (temp === 1) {
            this.documentStructure["method"] = "view";
            docListModal = this.modalService.open(DocumentViewComponent, this.commonService.modalOptions);
            docListModal.componentInstance.docListModalsForm = this.documentStructure;
          }
        }
        else {
          this.documentStructure = {};
          this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.Nodocumentstoshow'));
        }
        if (docListModal === undefined) {
          this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.Nodocumentstoshow'));
        }
        this.Ng4LoadingSpinnerService.hide();
      });
    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.GettingDocumentsFailed'));
    }
  }

  getCommunicationRequests() {

    try {
      this.spinnerService.show();
      this.communicationsService
        .getReceivedRequest(this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then(requests => (this.bindReceivedRequestInfo(requests)), err => (this.showRequestInfoError(err)));

    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  bindReceivedRequestInfo(requests1) {
    if (requests1 != null) {
      if (requests1.MessType === "S") {
        if (requests1.RecReqComm != undefined) {
          this.received_requests = requests1.RecReqComm;
          this.source.data = requests1.RecReqComm;
          this.source.load(requests1.RecReqComm);
          this.deadlineDateFormatter();
        }
        this.commonService.showSuccessToast(this.commonService.returnTextBasedOnLangIfExist(requests1, 'MessText', 'MessTextAr'));
      }
      else if (requests1.MessType === "E") {
        this.commonService.showFailureToast(this.commonService.returnTextBasedOnLangIfExist(requests1, 'MessText', 'MessTextAr'));
      }

    }
    else {
      this.resolveErrorSomething();
    }
    this.spinnerService.hide();
  }

  deadlineDateFormatter() {
    for (var i = 0; i < this.source.data.length; i++) {
      this.source.data[i]["SubDeadLine"] = this.source.data[i]["SubDeadLine"] ? this.commonService.yyyymmddDateFormatter(this.source.data[i]["SubDeadLine"]) : "";
    }
  }

  showRequestInfoError(err) {
    this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  }

  onEdit(event) {
    console.log("onEdit");
    // var received_requests_selects = this.received_requests[event.index];
    var received_requests_selects = _.where(this.received_requests, { CommId: event.data.CommId });
    this.customerProfileService.setCommunication(received_requests_selects[0], event.index);
    this.getCommonComments2(event.data.CommId, "COMM", event.data.SentReqType, event.data.SentReqId, event.data.SentReqStatus, event);

   // this.commonService.userDataLogging(this.activity_datalog.INBOX_COMMENTS, this.type_datalog.CLICK, {});
  }

  onLoanApp(event) {

    console.log("onLoanApp");

    if (event.data.CommReqStatus === "C") {
      this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.RequestClosed'));
    } else {
      var flagIsNewType = false;
      if (event.data.SentReqType != "GENC" && event.data.SentReqType != "CLAI" && event.data.SentReqType != "NPRE" && event.data.SentReqType != "NLOA") {
        flagIsNewType = true;
      }
      if (event.data.SentReqId === undefined || (event.data.SentReqId && parseInt(event.data.SentReqId) === 0) || flagIsNewType === true) {
        this.onEdit(event);
      } else if (event.data.SentReqId && event.data.SentReqStatus) {

        this.customerProfileService.setLoanRequestId(event.data.SentReqId);

        this.customerProfileService.setStatusCode(event.data.SentReqStatus);

        this.customerProfileService.setCommentsFrom("R");

        if (event.data.SentReqStatus == 'Q') {
          if (event.data.SentReqType === 'CLAI') {

            this.customerProfileService.setmyLoanCurrentLoanSentRequestId(event.data.Origin);

            this.customerProfileService.setmyLoanCurrentProjectFinPlanId(event.data.FplanId);

            this.customerProfileService.setmyLoanCurrentLoanId(event.data.CmlLoanId);

            this.customerProfileService.setmyLoanCurrentClaimId(event.data.SentReqId);

          }
          this.getCommonComments(event.data.CommId, "COMM", event.data.SentReqType, event.data.SentReqId, event.data.SentReqStatus);
        }
        else {

          if (event.data.CommReqStatus === "C") {
            this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.RequestClosed'));
          } else {
            if (event.data.SentReqType == "NPRE")
              this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.ThisLoanApplicationhasnoComments'));

            else if (event.data.SentReqType == "NLOA")
              this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.ThisPreliminaryRequesthasnoComments'));
          }

        }

      }

      else {

        this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.Failed'));

      }

     // this.commonService.userDataLogging(this.activity_datalog.INBOX_REQ_OPEN, this.type_datalog.CLICK, {});

    }

  }

  getCommonComments(commentCommId, commentTypeCode, sentReqType, sentReqId, sentReqStatus) {

    this.spinnerService.show();

    try {

      this.commonCommentsService
        .getCommonComments(commentCommId, commentTypeCode)
        .then((res) => (this.resolveCommonComments(res, sentReqType, sentReqId, sentReqStatus)), err => (this.resolveError(err)));

    }

    catch (err) {

      this.spinnerService.hide();
      this.commonService.showFailureToast(err);

    }

  }

  getCommonComments2(commentCommId, commentTypeCode, sentReqType, sentReqId, sentReqStatus, event) {

    this.spinnerService.show();

    try {

      this.commonCommentsService
        .getCommonComments(commentCommId, commentTypeCode)
        .then((res) => (this.resolveCommonComments2(res, sentReqType, sentReqId, sentReqStatus, event)), err => (this.resolveError(err)));

    }

    catch (err) {

      this.spinnerService.hide();
      this.commonService.showFailureToast(err);

    }

  }


  resolveCommonComments(res, sentReqType, sentReqId, sentReqStatus) {

    if (res.MessType === "S")
      this.customerProfileService.setCommentArray(res);

    else {

      this.customerProfileService.setCommentArray({});
      this.customerProfileService.setCommentArrayExists(false);

    }

    this.spinnerService.hide();

    if (sentReqType == "NPRE")
      this.router.navigate(['/pages/new-request/preliminary-request/create-prq/create-prq'], {
        queryParams:
        {
          requestId: this.customerProfileService.getEncryptedString(String(sentReqId)),
          status: this.customerProfileService.getEncryptedString(sentReqStatus)
        }
      });

    else if (sentReqType == "NLOA")
      this.router.navigateByUrl('/pages/new-request/loan-application/project-information');

    else if (sentReqType == "CLAI") {
      this.router.navigateByUrl('/pages/my-loans/loan-claim-request');
    }

  }

  resolveCommonComments2(res, sentReqType, sentReqId, sentReqStatus, event) {

    if (res.MessType === "S")
      this.customerProfileService.setCommentArray(res);

    else {

      this.customerProfileService.setCommentArray({});
      this.customerProfileService.setCommentArrayExists(false);

    }

    this.spinnerService.hide();

    let navigationExtras: NavigationExtras = {
      queryParams: {
        'type': this.customerProfileService.getEncryptedString(event.data.SentReqType),
        'CommId': this.customerProfileService.getEncryptedString(event.data.CommId),
        'SentReqId': this.customerProfileService.getEncryptedString(event.data.SentReqId),
        'LoanId': this.customerProfileService.getEncryptedString(event.data.LoanId)
      }
    };
    this.router.navigate(['/pages/communications/receive-request/receive-request-communication/receive-request-communication'], navigationExtras);
  }

  resolveError(err) {
    this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  }

  getLoanDropdowns() {

    this.spinnerService.show();
    var err_temp;
    try {

      this.projectInformationService
        .getLoanDropdowns()
        .then((res) => (this.resolveLoanDropdowns(res)), err => err_temp = err);

    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  resolveLoanDropdowns(res) {
    this.spinnerService.hide();
    if (!res.LegalEntity) {
      this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.Failed'));
    }

    else {
      this.customerProfileService.setLoanDropdowns(res);
    }

  }
  resolveErrorSomething() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }
}
