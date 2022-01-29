import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { Router, ActivatedRoute, ActivationEnd, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RCJRequestsService } from "../../services/rcjrequests.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'rcj-requests',
  templateUrl: './rcj-requests.component.html',
  styleUrls: ['./rcj-requests.component.scss']
})
export class RCJRequestsComponent implements OnInit {

  translate = this.commonService.returnTranslate();
  source: any = [];
  adminuser: any = {};
  selectedStatus:any;
  status:any=[];
  serviceId:any;
  constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, private rcjrequestsservice: RCJRequestsService,
    private customerProfileService: CustomerProfileService,
    protected localStorage: LocalStorage,
    private router: Router) { }

  ngOnInit() {

     this.serviceId = 9;
    this.selectedStatus = this.activatedRoute.snapshot.paramMap.get("selectedStatus");

    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      this.adminuser = data;
   
      if (this.adminuser != null ) {
     
      this.getRequestStatus();
      this.getRCJRequests();
      }
      else {
        this.router.navigateByUrl('/admin-login');
      }
    });
  
  }

  settings = {
    hideSubHeader: true,
    actions: false,
    noDataMessage: this.translate.instant('COMMON.NoLoanApplications'),
   // mode: "external",
  
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
       // width: "12%",
        valuePrepareFunction: (date) => {
          if (date) {
          return new DatePipe('en-US').transform(date, 'yyyy-MM-dd')
          }
          return null;
          },
        editable: false
      },
      StatusUpdatedOn: {
        title: this.translate.instant('COMMON.StatusUpdatedOn'),
        type: "string",
        editable: false,
        //width: "12%",
        valuePrepareFunction: (date) => {
          if (date) {
          return new DatePipe('en-US').transform(date, 'yyyy-MM-dd')
          }
          return null;
          },
      },
      statuschangeDay: {
        title: this.translate.instant('COMMON.statuschangeDay'),
        type: "string",
        editable: false,
        valuePrepareFunction :(cell, row) =>{
          if(row.RequestStatus==44||row.RequestStatus==26)return null;
          var date1=row.CreatedOn;
          var date2=row.StatusUpdatedOn;
          if(!date2){date2=new Date();}
         else if(date2){date2=new Date(); date1=row.StatusUpdatedOn}
       //  return `<span [style.background-color]="'red'">${this.date_diff_indays(date1,date2)}</span>`;
         return  this.date_diff_indays(date1,date2);

     } 
     
      }
    }
  };
getRequestStatus(){
  var obj = {
    "serviceId": this.serviceId,
  };
  try {
    this.rcjrequestsservice
      .GetRCJRequestStatus(obj).then((status) => {
        if (status){
       
          this.status = status;
        }

      }), err => this.commonService.showFailureToast(err);
  } catch (err) {
    this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  } 
}
  getRCJRequests() {

    var obj = {
      "serviceId": this.serviceId,
      "statusId":this.selectedStatus
    };
    this.spinnerService.show();
    try {
      this.rcjrequestsservice
        .GetRCJRequests(obj).then((requests) => {
          if (requests){
        
            this.source = requests;
            this.spinnerService.hide();
          }
        }), err => {this.commonService.showFailureToast(err);
          this.spinnerService.hide();}

    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  
  }
  SearchData(){
    this.getRCJRequests();
    }
    Reset(){
      this.selectedStatus=null;
      this.getRCJRequests();
    }


    date_diff_indays (date1, date2) {
      const dt1 = new Date(date1);
      const dt2 = new Date(date2);
      return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
      }
}
