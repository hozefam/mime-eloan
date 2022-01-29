import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { Router, ActivatedRoute, ActivationEnd, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RCYRequestsService } from "../../services/rcyrequests.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'rcy-requests',
  templateUrl: './rcy-requests.component.html',
  styleUrls: ['./rcy-requests.component.scss']
})
export class RCYRequestsComponent implements OnInit {

  translate = this.commonService.returnTranslate();
  source: any = [];
  adminuser: any = {};

  constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, private rcyrequestsservice: RCYRequestsService,
    private customerProfileService: CustomerProfileService,
    protected localStorage: LocalStorage,
    private router: Router) { }

  ngOnInit() {
    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      this.adminuser = data;
      if (this.adminuser != null ) {
        this.getRCYRequests();
      }
      else {
        this.router.navigateByUrl('/admin-login');
      }
    });
  }

  settings = {
    hideSubHeader: true,

    noDataMessage: this.translate.instant('COMMON.NoLoanApplications'),
    mode: "external",
    edit: {
      editButtonContent: '<i class="nb-edit"  title="Edit"></i>',
    },
    
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: false
    },
    columns: {
      PreliminaryRequestNumber: {
        title: this.translate.instant('COMMON.RequestId'),
        type: "number",
        width: "12%",
        editable: false
      },
      ProjectName: {
        title: this.translate.instant('COMMON.ProjectName'),
        type: "string",
        width: "12%",
        editable: false
      },
      StatusAr: {
        title: this.translate.instant('COMMON.RequestStatus'),
        type: "string",
        editable: false
      },
      CreatedOn: {
        title: this.translate.instant('COMMON.CreatedDate'),
        type: "string",
        editable: false
      }
    }
  };

  getRCYRequests() {
    this.spinnerService.show();
    let serviceId = 10;
    var obj = {
      "serviceId": serviceId
    };
    try {
      this.rcyrequestsservice
        .GetRCYRequests(obj).then((requests) => {
          if (requests)
            this.source = requests;
            this.spinnerService.hide();

        }), err =>{ this.commonService.showFailureToast(err);
          this.spinnerService.hide();
        }
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  onEdit(event) {
    this.router.navigate(['/AdminArea/rcy-investerinformation'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(event.data.SIDFRequestNo)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(event.data.SysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(event.data.PreliminaryRequestNumber)) } });
  }
}
