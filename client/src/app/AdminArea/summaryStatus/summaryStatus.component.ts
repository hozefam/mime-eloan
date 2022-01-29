import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { Router, ActivatedRoute, ActivationEnd, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RCJRequestsService } from "../../services/rcjrequests.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DatePipe } from '@angular/common';
import { AdminDashboardService } from '../services/admin-dashboard.service';

@Component({
  selector: 'summaryStatus',
  templateUrl: './summaryStatus.component.html',
  styleUrls: ['./summaryStatus.component.scss']
})
export class SummaryStatusRequestsComponent implements OnInit {

  translate = this.commonService.returnTranslate();
  source: any = [];
  adminuser: any = {};
  selectedStatus: any;
  status: any = [];
  serviceId: any;
  constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, private adminDashboardService: AdminDashboardService,
    private customerProfileService: CustomerProfileService,
    protected localStorage: LocalStorage,
    private router: Router) { }

  ngOnInit() {
    this.getRequests();
  }

  settings = {
    hideSubHeader: true,
    actions: false,
    noDataMessage: this.translate.instant('COMMON.NoLoanApplications'),
    // mode: "external",

    columns: {
      StatusAr: {
        title: this.translate.instant('COMMON.RequestStatus'),
        type: "string",
        editable: false
      },
      StatusEN: {
        title: this.translate.instant('COMMON.RequestStatus'),
        type: "string",
        editable: false
      },

      StatusTEXT: {
        title: this.translate.instant('COMMON.RequestStatusWITH'),
        type: "string",
        editable: false
      },
      RequestCount: {
        title: this.translate.instant('COMMON.RequestCount'),
        type: "number",
        editable: false
      },


    }
  };

  getRequests() {


    this.spinnerService.show();
    try {
      this.adminDashboardService
        .GetRequestCountbyStatus().then((requests) => {
          if (requests) {

            this.source = requests;
            this.spinnerService.hide();
          }
        }), err => {
          this.commonService.showFailureToast(err);
          this.spinnerService.hide();
        };
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }



  date_diff_indays(date1, date2) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }
}
