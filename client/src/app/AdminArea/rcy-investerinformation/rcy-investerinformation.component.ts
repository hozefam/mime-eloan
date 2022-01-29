import { Component, OnInit, ElementRef, ViewChild, Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RCYInvesterInformation } from './rcy-InvesterInformation';
import { CustomerProfileService } from "../../services/customer-profile.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { RCYInfoService } from '../../services/rcy-information.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonService } from "../../services/common.service";
//import * as jspdf from 'jspdf';

import { WINDOW } from '../window.providers';
//import 'jspdf-autotable';
//import * as html2canvas from "html2canvas";
//import html2canvas from 'html2canvas';
@Injectable()
@Component({
  selector: 'rcy-investerinformation',
  templateUrl: './rcy-investerinformation.component.html',
  styleUrls: ['./rcy-investerinformation.component.scss']
})
export class RcyInvesterinformationComponent implements OnInit {
  model: RCYInvesterInformation;
  RCYSysuserServiceId: any = 0;
  adminuser: any = {};
  translate: any;
  item: any = {};
  showTable = false;
  RCYLoanNumber: any = 0;
  RCYPreliminaryRequestNumber: any = 0;
  @ViewChild('content') content: ElementRef;

  constructor(@Inject(WINDOW) private window: Window, private router: Router, private customerProfileService: CustomerProfileService,
    protected localStorage: LocalStorage, private rcyInfoService: RCYInfoService,
    private spinnerService: Ng4LoadingSpinnerService, private commonService: CommonService, private route: ActivatedRoute) {
    this.translate = this.commonService.returnTranslate();

  }

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

    this.model = new RCYInvesterInformation();
    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      this.adminuser = data;
      if (this.adminuser != null && this.adminuser.ServiceId == 10) {
        if (this.RCYSysuserServiceId == null || this.RCYSysuserServiceId == 0)
          this.router.navigateByUrl('/admin-login');
        else {
          this.getAdminRcyInvesterInformation(this.RCYSysuserServiceId);
        }
      }
      else {
        this.router.navigateByUrl('/admin-login');
      }

    });
  };

  getAdminRcyInvesterInformation(RCYSysuserServiceId) {

    try {
      var obj = {
        "RCYSysuserServiceId": RCYSysuserServiceId,
      };
      this.rcyInfoService
        .getAdminRcyInvesterInformation(obj)
        .then((res) => (this.resolveRCYInformation(res)));
    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  resolveRCYInformation(res) {
    if (res == null) {
      this.commonService.showFailureToast("لا يوجد طلبات");
      this.spinnerService.hide();
    }
    else {
      this.model.Email = res.Email;
      this.model.FirstName = res.FirstName;
      this.model.MiddleName = res.MiddleName;
      this.model.LastName = res.LastName;
      this.model.City = res.City;
      this.model.POBox = res.POBox;
      this.model.Nationality = res.Nationality;
      this.model.NationalId = res.NationalId;
      this.model.Phone = res.Phone;
      this.model.Mobile = res.Mobile;
      this.model.ComapnyName1025 = res.ComapnyName1025;
      this.model.JobTitle = res.JobTitle;
      this.model.WaselNumber = res.WaselNumber;
      this.model.RegNumber = res.RegNumber;
      this.model.RegActivity = res.RegActivity;
      this.model.CommercialId = res.CommercialId;
      this.model.FullName_ENG = res.FullName_ENG;
      this.spinnerService.hide();
      this.commonService.showSuccessToast(this.translate.instant('RCJ_Information.Retrived'));
    }
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
