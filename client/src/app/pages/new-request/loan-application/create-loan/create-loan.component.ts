import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from "../../../../services/communications.service";
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { ProjInfoService } from "../../../../services/project-information.service";
import { LandloanRequestService } from '../../../../services/landloan-request.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { LangChangeEvent,TranslateService } from '@ngx-translate/core';
declare var $ :any;
@Component({
  selector: 'create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {
  translate = this.commonService.returnTranslate();

  requestId = 0;

  screen_number = 1;

  approved_prql_source: any = [];
  approved_prql_settings:any;
  
  serviceId = 7;
  agreementAccepted: boolean = false;

  cancelModalReference: any;
  //translate: any;
  constructor(private projInfoService: ProjInfoService, private communicationsService: CommunicationsService, private toastr: ToastrService, private modalService: NgbModal, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService, private customerProfileService: CustomerProfileService, private commonService: CommonService, private landloanRequestService: LandloanRequestService, private localStorage: LocalStorage) {
    this.translate = this.commonService.returnTranslate();
    this.initTableSettings();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {

      this.initTableSettings();
    });


  }

  ngOnInit() {
    //   console.log(this.translate.instant('COMMON.SomethingWentWrong')); 
    console.log('first service id' + this.localStorage.getItem("serviceId"));
    console.log('second =' + this.serviceId);
    this.getApprovedRequests();


  }

  initTableSettings(): void {
    this.approved_prql_settings = {

      hideSubHeader: true,
  
      noDataMessage: this.translate.instant('COMMON.noPreliminary'),
  
      mode: "external",
  
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },
  
      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: false,
  columnTitle:this.translate.instant('COMMON.Actions')
  
      },
  
      columns: {
        RequestId: {
          title: this.translate.instant('COMMON.RequestId'),
          type: "number",
          width: "12%",
          editable: false
        },
        RequestType: {
          title: this.translate.instant('COMMON.RequestType'),
          type: "string",
          editable: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'RequestType', 'RequestTypeAr');
          }
  
        },
        RequestStatus: {
          title: this.translate.instant('COMMON.RequestStatus'),
          type: "string",
          editable: false,
          valuePrepareFunction: (cell, row) => {
            return this.commonService.returnTextBasedOnLangIfExist(row, 'RequestStatus', 'RequestStatusAr');
          }
        },
        CreatedDate: {
          title: this.translate.instant('COMMON.CreatedDate'),
          type: "string",
          editable: false
        },
        RequestDate: {
          title: this.translate.instant('COMMON.RequestDate'),
          type: "string",
          editable: false
        }
      }
    };

  }
  getApprovedPRQs() {

    try {
      this.spinnerService.show();
      this.communicationsService
        .getSendRequestInfo(this.customerProfileService.currentCustomerProfile.customerProfileId, 'APRE', this.serviceId)
        .then(requests => (this.resolveApprovedPRQs(requests)), err => (this.showPRQInfoError(err)));
    } catch (err) {
      this.spinnerService.hide();

      this.commonService.showFailureToast(err);

    }
  }

  resolveApprovedPRQs(requests) {
    this.approved_prql_source = requests;
    this.spinnerService.hide();
  }

  showPRQInfoError(err) {
    this.spinnerService.hide();
  }

  agreementCheck(event) {
//alert(event.returnValue);
    if (event.returnValue == false)
      this.agreementAccepted = true;

    else
      this.agreementAccepted = false;

      alert(this.agreementAccepted);

  }

  onEdit(event) {

    this.requestId = event.data.RequestId;

    this.screen_number = 2;

  }

  onAcceptAndContinue() {
    
    //if(this.agreementAccepted){
    var post_data = {
      "Origin": "CP",
      "CustomerId": "",
      "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
      "IsPrivacySign": "X",
      "SentReqId": this.requestId,
      "Indicator": "INITIATE"
    }

   this.spinnerService.show();

    this.projInfoService.initiateLoanApplication(post_data)
      .then((res) => (this.onResult(res)), err => this.onPRQSubmit(err));
    let serviceId = this.localStorage.getItem("serviceId");

    this.router.navigateByUrl('/pages/new-request/loan-application/' + this.serviceId);
  /*}
  else {  
    
    $(".customised-control-description").css("color","red");
}*/

  }

  onResult(result) {

    this.spinnerService.hide();

    if (result.MessType == "S") {




      //   this.commonService.showSuccessToast(result.MessText);

      //   this.customerProfileService.setLoanRequestId(result.SentReqId);

      //   this.customerProfileService.setStatusCode("D");

      //   this.router.navigateByUrl('/pages/new-request/loan-application/project-information');

      // }

      // here to call sysyUserService,
      let obj = {
        "Origin": "CP",
        "CustomerId": "",
        "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
        "IsPrivacySign": "X",
        "SentReqId": this.requestId,
        "Indicator": "INITIATE",
        "LoanRequestId": result.SentReqId
      };
      this.landloanRequestService.createLandLoanRequest(obj).subscribe(response => {
        if (JSON.parse(response.data).message != 'S') {
          this.commonService.showSuccessToast(result.MessText);

          this.customerProfileService.setLoanRequestId(result.SentReqId);

          this.customerProfileService.setStatusCode("D");

          this.router.navigateByUrl('/pages/new-request/loan-application/' + this.serviceId);
        }
        else {

          this.commonService.showFailureToast(response.message);
        }
      }, error => {

        this.onPRQSubmit(error)
      })


    }

    else
      this.commonService.showFailureToast(result.MessText);

  }

  onPRQSubmit(err) {

    this.spinnerService.hide();
    console.log(err);

  }

  onCancel(cancel_modal) {

    this.cancelModalReference = this.modalService.open(cancel_modal);
    this.cancelModalReference.action = "Cancel";
    this.cancelModalReference.table_name_display = "Loan Application";

  }

  onCancelConfirm() {

    if (this.screen_number == 1)
      this.router.navigateByUrl('/pages/client-dashboard');

    else if (this.screen_number == 2)
      this.screen_number = 1;

    this.commonService.showFailureToast("Loan Application cancelled !");

    this.cancelModalReference.close();

  }

  onCloseCancelModal() {

    if (this.cancelModalReference.action == 'Cancel')
      this.cancelModalReference.close();

  }
  onBack() {

    this.router.navigate(['/pages/new-request/loan-application/0']);

  }

  getApprovedRequests() {
    this.localStorage.getItem("serviceId").subscribe((data) => {
      this.serviceId =0;// data;
      this.getApprovedPRQs();
    })
  }
}