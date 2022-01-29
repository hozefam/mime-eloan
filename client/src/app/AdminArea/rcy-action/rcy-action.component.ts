import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { CustomerProfileService } from "../../services/customer-profile.service";
import { CommonService } from "../../services/common.service";
import { RCYRequestsService } from "../../services/rcyrequests.service";
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Location } from "@angular/common";
import { SampleService } from '../services/sample.service';
import { WINDOW } from '../window.providers';
import { NgForm } from '@angular/forms';


@Injectable()
@Component({
  selector: 'rcy-action',
  templateUrl: './rcy-action.component.html',
  styleUrls: ['./rcy-action.component.scss']
})
export class RcyActionComponent implements OnInit {
  adminuser: any = {};
  RCYPreliminaryRequestNumber: any = 0;
  RCYSysuserServiceId: any = 0;
  RCYLoanNumber: any = 0;
  isSubmitted = false;
  showReasonmessage = false;

  input = {
    "decesion": 0,
    "RejectionReason": null
  }

  constructor(@Inject(WINDOW) private window: Window, private llocation: Location, private customerProfileService: CustomerProfileService, private commonService: CommonService,
    private rcyRequestService: RCYRequestsService, private router: Router, protected localStorage: LocalStorage,
    private sampleService: SampleService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      var RCYLoanNumber = params['RCYLoanNumber'];
      var RCYSysuserServiceId = params['RCYSysuserServiceId'];
      var RCYPreliminaryRequestNumber = params['RCYPreliminaryRequestNumber'];

      if (RCYLoanNumber) {
        this.RCYLoanNumber = this.customerProfileService.getDecryptString(RCYLoanNumber);
        this.RCYSysuserServiceId = this.customerProfileService.getDecryptString(RCYSysuserServiceId);
        this.RCYPreliminaryRequestNumber = this.customerProfileService.getDecryptString(RCYPreliminaryRequestNumber);
      }
    })

    this.localStorage.getItem('AdminLoginData').subscribe((data) => {

      this.adminuser = data;
      if (this.adminuser == null) {
        this.router.navigateByUrl('/admin-login');
      }

    });
  }
  public href: string = "";
  // ExportToExcel() {

  //   var obj = {
  //     "PreliminaryRequestNumber": this.RCYPreliminaryRequestNumber
  //   }
  //   var hostname = this.sampleService.getHostname();
  //   var url = 'http://' + hostname + ':6444/API/LandLoanAPI/GetRCYClientDataINeXCEL?PreliminaryRequestNumber=' + this.RCYPreliminaryRequestNumber;
  //   this.window.open(url);
  //   console.log('routeeeer' + this.router);
  //   console.log("location", this.llocation);
  // }


  decisionform(form: NgForm) {
    this.isSubmitted = true;
    if (!form.valid) {
      return false;
    } else {
      alert(JSON.stringify(form.value))
    }
  }

  ApprovreReject() {
    if (this.input.decesion == null || this.input.decesion == undefined || this.input.decesion == 0)
      this.isSubmitted = true;
    else {
      if (this.input.decesion == 10) {
        var obj = {
          "SIDFPreliminaryID": this.RCYPreliminaryRequestNumber,
          "SIDFRequestNo": this.RCYLoanNumber,
          "StatusId": 10
        }
        this.rcyRequestService.UpdateStatusApproveReject(obj).then(response => {
          this.commonService.showSuccessToast("تم الموافقة على الطلب");
        }, err => (this.resolveError()))
      }
      else if (this.input.decesion == 9) {
        if (this.input.RejectionReason == null)
          this.showReasonmessage = true;
        else {
          this.showReasonmessage = false;
          var obj2 = {
            "SIDFPreliminaryID": this.RCYPreliminaryRequestNumber,
            "SIDFRequestNo": this.RCYLoanNumber,
            "StatusId": 9,
            "RejectionReason": this.input.RejectionReason
          }
          this.rcyRequestService.UpdateStatusApproveReject(obj2).then(response => {
            this.commonService.showFailureToast("تم رفض الطلب");
            this.router.navigateByUrl('/AdminArea/rcy-requests/10');
          }, err => (this.resolveError()))
        }

      }
    }

    //   var obj = {
    //     "SIDFPreliminaryID": this.RCYPreliminaryRequestNumber,
    //     "SIDFRequestNo": this.RCYLoanNumber,
    //     "StatusId": 10
    //   }
    //   this.rcyRequestService.UpdateStatusApproveReject(obj).then(response => {
    //     this.commonService.showSuccessToast("تم الموافقة على الطلب");
    //   }, err => (this.resolveError()))
    // }
    // else {
    //   var obj = {
    //     "SIDFPreliminaryID": this.RCYPreliminaryRequestNumber,
    //     "SIDFRequestNo": this.RCYLoanNumber,
    //     "StatusId": 9
    //   }
    //   this.rcyRequestService.UpdateStatusApproveReject(obj).then(response => {
    //     this.commonService.showFailureToast("تم رفض الطلب");
    //   }, err => (this.resolveError()))

  }
  resolveError() {
    this.commonService.showFailureToast("حدث خطأ الرجاء المحاولة في وقت آخر");
  }

  onClickLoanApplicationTab(tab_number) {

    switch (tab_number) {

      case 4:
        this.router.navigate(['/AdminArea/rcy-investerinformation'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;
      case 5:
        this.router.navigate(['/AdminArea/rcy-information'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;
      case 6:
        this.router.navigate(['/AdminArea/rcy-questionnaire'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;
      case 7:
        this.router.navigate(['/AdminArea/rcy-action'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;
    }

  }
}
