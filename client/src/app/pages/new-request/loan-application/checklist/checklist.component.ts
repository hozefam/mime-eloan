import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ProjInfoService } from "../../../../services/project-information.service";
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { LoanTechnicalService } from "../../../../services/loan-technical";
import { LandloanRequestService } from "../../../../services/landloan-request.service";
import { DocumentListComponent } from '../../../../components/document-list/document-list.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { LlPreliminaryRequestService } from '../../../../services/ll-preliminary-request.service';

@Component({
  selector: 'checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})

export class LoanApplicationChecklistComponent implements OnInit {

  panelStep = 1;

  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  RCJInfoPer = 0;
  RCJQuesPer = 0;
  ChecklistPer = 0;
lang:any='ar';
  LandLonRequestStatusId = 0;
  allPanelsExpanded = false;
  documents: any;
  checklist_source = [];
  @ViewChild('identifier') identifier: DocumentListComponent;
  setPanelStep(index: number) {
    this.panelStep = index;
  }

  nextPanelStep() {
    this.panelStep++;
  }

  prevPanelStep() {
    this.panelStep--;
  }

  expandAllPanels(mode) {

    this.panelStep = 0;

    if (mode == 0)
      this.allPanelsExpanded = true;

    else if (mode == 1)
      this.allPanelsExpanded = false;

  }

  deleteCancelModalReference: any;

  startedFilling = 0;

  constructor(private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService, private LoanTechnicalService: LoanTechnicalService, private projInfoService: ProjInfoService, private customerProfileService: CustomerProfileService,
    private commonService: CommonService, private toastr: ToastrService, private modalService: NgbModal, private router: Router, private localStorage: LocalStorage, private landloanRequestService: LandloanRequestService
    , private llPreliminaryRequest: LlPreliminaryRequestService) { }

  requestId = 0;
  projId = 0;
  statusCode = "";
  serviceId = 9;
  translate:any;
  ngOnInit() {
    this.translate = this.commonService.returnTranslate();
    this.lang=this.translate.currentLang ;
    this.LandLonRequestStatusId = this.customerProfileService.LandLoanRequestStatus;
    this.localStorage.getItem("serviceId").subscribe(data => {
      if (data)
        this.serviceId = data;


      //   this.documents={
      //     "url": "https://sidfpodev.sidf.gov.sa:50001/lms-service/rest/projects/entityId/checklist/SIDFPreparationDocuments/refId/documents/documentId/fileName",//replace getDoucment result downloanDocumentURL
      //     "documentList": [
      //         {
      //             "EntityId": 2000000375,
      //             "RefId": "1079",
      //             "DocumentId": "291",
      //             "FileName": "PAYMENT.txt"
      //         },
      //         {
      //             "EntityId": 2000000375,
      //             "RefId": "1080",
      //             "DocumentId": "293",
      //             "FileName": "angular translate.txt"
      //         }
      //     ]
      // };
      this.requestId = this.customerProfileService.loanRequestId;
      this.projId = this.customerProfileService.loanArray.ProjId;
      this.statusCode = this.customerProfileService.statusCode;

      if (this.requestId == 0)
        this.router.navigateByUrl('/pages/new-request/loan-application');
      var cust_prof_id = this.customerProfileService.currentCustomerProfile.customerProfileId;
      var loan_request_id = this.customerProfileService.loanRequestId;

      this.LoanTechnicalService.postChecklistRequest(cust_prof_id, loan_request_id)
        .then((res) => (this.setSource(res)), err => (this.commonService.showFailureToast(err)));
      //financeOperationalCostSource_temp.push({CompType: "Grand Total", TotalCost: "SAR " + totalcost_operation_temp.toFixed(2)});
    });
  }

  onClickLoanApplicationTab(tab_number) {

    if (this.startedFilling == 0) {

      switch (tab_number) {

        case 0:
          this.router.navigateByUrl('/pages/new-request/loan-application/project-information');
          break;

        case 1:
          this.router.navigateByUrl('/pages/new-request/loan-application/marketing-information');
          break;

        case 2:
          this.router.navigateByUrl('/pages/new-request/loan-application/technical-information');
          break;

        case 3:
          this.router.navigateByUrl('/pages/new-request/loan-application/financial-information');
          break;

        case 4:
          this.router.navigateByUrl('/pages/new-request/loan-application/checklist');
          break;

        case 5:
          if (this.serviceId == 7||this.serviceId == 8)
            this.router.navigateByUrl('/pages/new-request/loan-application/land-form1');
            else   if (this.serviceId == 12)
            this.router.navigateByUrl('/pages/new-request/loan-application/land-logistic-form');
            else if (this.serviceId == 9 || this.serviceId == 13)  
          this.router.navigateByUrl('/pages/new-request/loan-application/rcj-information');
          else
          this.router.navigateByUrl('/pages/new-request/loan-application/rcy-information');
          break;

        case 6:
          if (this.serviceId == 7)
            this.router.navigateByUrl('/pages/new-request/loan-application/land-form2');
            else if (this.serviceId == 9 || this.serviceId == 13)  
            this.router.navigateByUrl('/pages/new-request/loan-application/rcj-questionnaire');
            else
            this.router.navigateByUrl('/pages/new-request/loan-application/rcy-questionnaire');
          break;
        case 8:
          this.router.navigateByUrl('/pages/new-request/loan-application/factory-loan');
          break;
      }

    }

    else {

      this.commonService.showFailureToast("Complete filling the Technical Information !");

    }

  }

  onSubmit() {

    if (this.checklist_source.filter(c => c.Status === "F").length > 0) {
      this.commonService.showFailureToast(this.translate.instant('COMMON.PleaseCompleteRequest'));
      return;
    }

    this.Ng4LoadingSpinnerService.show();
    this.landloanRequestService.finalSubmit({ requestId: this.requestId }).subscribe(res => {

debugger;
      //this.commonService.showSuccessToast('تم ارسال الطلب برقم LoanRequestNumber' + res.LoanRequestNumber)

      if (this.customerProfileService.LandLoanRequestStatus == 41)
        this.UpdateLandLoanStatusByLastStatus();

      if (!res) { 
        this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
        this.Ng4LoadingSpinnerService.hide();
        return;
      }
      if (res.message && (res.code === "I" || res.code === "F")) {
        this.commonService.showFailureToast(res.message)
        this.Ng4LoadingSpinnerService.hide();
        return;
      }


      var post_data = {
        "Origin": "CP",
        "CustomerId": "",
        "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
        "SentReqId": this.requestId,
        "Indicator": "SAVESUBMIT",
        "IsLoanSumbit": "X"
      }

      this.projInfoService.submitLoanApplication(post_data)
        .then((res) => ((this.resolveSubmit(res), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide()));
      this.Ng4LoadingSpinnerService.hide();

    }, err => {
      debugger;
      //this.commonService.showFailureToast("حدث خطأ الرجاء المحاولة في وقت آخر 987")
      this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
      this.Ng4LoadingSpinnerService.hide();
    }
    )
  }

  UpdateLandLoanStatusByLastStatus() {

    var obj = {
      "SIDFPreliminaryID": this.customerProfileService.PreliminaryRequestNumber,
      "SIDFRequestNo": this.customerProfileService.loanRequestId,
      "StatusId": this.customerProfileService.LandLoanRequestLastStatus
    }
    this.llPreliminaryRequest.UpdateLandLoanStatusByLastStatus(obj).then(response => {

    }, err => (this.resolveError()))
  }
  resolveError() {
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
  }
  resolveSubmit(result) {

    console.log(result);
    if (result.MessType == "S") {
      this.commonService.showSuccessToast(result.MessText);
      this.commonService.showSuccessToast(this.translate.instant('COMMON.RequestSentNo')+ result.message);
    }

    else
      this.commonService.showFailureToast(result.MessText);

  }

  setSource(res) {

    this.GenInfoPer = this.customerProfileService.loanPercentageValues.GenInfoPer;
    this.MarkInfoPer = this.customerProfileService.loanPercentageValues.MarkInfoPer;
    this.TechInfoPer = this.customerProfileService.loanPercentageValues.TechInfoPer;
    this.FinInfoPer = this.customerProfileService.loanPercentageValues.FinInfoPer;
    this.ChecklistPer = this.customerProfileService.loanPercentageValues.ChecklistPer;

    if (res.CheckList.length > 0) {
      // var checklist_source_temp = [];
      // for(var i=0; i<res.CheckList.length; i++)
      // {
      //   checklist_source_temp.push({ItemId: res.CheckList[i].ItemId, ItemDesc: res.CheckList[i].ItemDesc, Status: "return <img scr='http://images.clipartpanda.com/tic-clipart-pi57LMXiB.png'/>" });
      // }
      //'https://i.gifer.com/no.gif'
      this.checklist_source = res.CheckList;
    }
  }

}