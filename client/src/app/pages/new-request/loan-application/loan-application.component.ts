import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, ActivationEnd, NavigationEnd } from '@angular/router';
import { CommonService } from "../../../services/common.service";
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from "../../../services/communications.service";
import { ProjInfoService } from "../../../services/project-information.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { filter } from 'rxjs/operators';
import { debug } from 'util';

import { CommonCommentsService } from '../../../services/common-comments.service';
@Component({
  selector: 'loan-application',
  templateUrl: './loan-application.component.html',
  styleUrls: ['./loan-application.component.scss']
})

export class LoanApplicationComponent implements OnInit {
  translate = this.commonService.returnTranslate();
  source: any = [];
  profileItems:any[]= [
    {id:'0000000024' ,prqTypeEn:'Land and Loan MODON' ,prqTypeAr:'أرض وقرض مدن',serviceId:7} ,
    {id:'0000000025',prqTypeEn:'Factory and Loan MODON' ,prqTypeAr:'مصنع وقرض مدن',serviceId:8},
    {id :'0000000038',prqTypeEn:'Land and loan of the Special Economic and Cities and Zones Authority',serviceId:11 ,prqTypeAr:'أرض وقرض هيئة المدن و المناطق الإقتصادية الخاصة' },
    {id:'0000000035' ,prqTypeEn:'Land and loan Jubail requests',prqTypeAr:'أرض وقرض الجبيل',serviceId:9},
    {id:'0000000036' ,prqTypeEn:'Land and loan Yanbu requests',prqTypeAr:'أرض وقرض ينبع',serviceId:10},
    {id:'0000000051' ,prqTypeEn:'Land and loan modon logistics',prqTypeAr:'أرض وقرض لوجيستي مدن',serviceId:12},
    {id:'0000000052' ,prqTypeEn:'Logistics Landloan Jubail',prqTypeAr:'أرض وقرض لوجيستي الجبيل',serviceId:13},
    {id:'0000000053' ,prqTypeEn:'Logistics Landloan Yanbu',prqTypeAr:'أرض وقرض لوجيستي ينبع',serviceId:14},
    {id:'0000000054' ,prqTypeEn:'Logistics Landloan ECZA/KAEC',prqTypeAr:'أرض وقرض لوجيستي هيئة المدن و المناطق الإقتصادية الخاصة',serviceId:15}
    ];
  RequestsStatus: any = [];
  PreliminaryData: any = [];
  customerProfileId: any = String;
  CurrentUserNationalIdLoanApplication = 0;
  urlRoute = "";
  constructor(private projectInformationService: ProjInfoService,private commonCommentsService: CommonCommentsService, private communicationsService: CommunicationsService, private toastr: ToastrService, private router: Router, private localStorage: LocalStorage,
    private customerProfileService: CustomerProfileService, public commonService: CommonService, private spinnerService: Ng4LoadingSpinnerService, private activatedRoute: ActivatedRoute) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((val) => { // event => event instanceof ActivationEnd) 
      console.log("triggered", val)
      if (val["url"] && val["url"] !== this.urlRoute && val["url"].match(/(loan-application)+\/+\d/)) //create-loan
      {
        this.urlRoute = val["url"];
        console.log(this.urlRoute);
        this.getRequest();
      }
    });

  }

  serviceId = 9;

  ngOnInit() {
    //  this.getRequest();
  }

  settings = {

    hideSubHeader: false,

    noDataMessage: this.translate.instant('COMMON.NoLoanApplications'),

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"  title="Edit"></i>',
    },

    actions: {
      columnTitle:"Actions",// this.translate.instant('COMMON.Actions'),
      position: "right",
      add: false,
      edit: true,
      delete: false
    },
    columns: {
      RequestId: {
        title:"Request Number",//this.translate.instant('COMMON.RequestId'),
        type: "number",
        width: "12%",
        editable: false
      },
      ProjectCode: {
        title:"Project Code",// this.translate.instant('COMMON.ProjectCode'),
        type: "text",
        editable: false, 
      },
      ProjProfId: {
        title:"Request Type",// this.translate.instant('COMMON.RequestType'),
        type: "string",
        editable: false,
        valuePrepareFunction: (value) => { 
          let item = this.profileItems.find(x=>x.id==value);
          if(item)
          return item.prqTypeEn;
          else
          return value;
        },
        filter:{
          type:"list",
          config:{
            selectText:"Select all",
            list:
            [
              {value:'0000000024' ,title:'Land and Loan MODON'} ,
              {value:'0000000025',title:'Factory and Loan MODON'},
              {value :'0000000038',title:'Land and loan of the Special Economic and Cities and Zones Authority' },
              {value:'0000000035' ,title:'Land and loan Jubail requests'},
              {value:'0000000036' ,title:'Land and loan Yanbu requests'},
              {value:'0000000051' ,title:'Land and loan logistics'},
              {value:'0000000052' ,title:'Land and loan logistics Jubail'},
              {value:'0000000053' ,title:'Land and loan logistics Yanbu'},
              {value:'0000000054' ,title:'Land and loan logistics of the Special Economic and Cities and Zones Authority'}
              ],
          }
        }
      },
      RequestStatus: {
        title: "Request Status",//this.translate.instant('COMMON.RequestStatus'),
        type: "string",
        editable: false
      },
      // RequestStatus: {
      //   title: this.translate.instant('COMMON.RequestStatus'),
      //   type: "string",
      //   editable: false
      // },
      CreatedDate: {
        title:"Creation Date",// this.translate.instant('COMMON.CreatedDate'),
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
    }
  };
  settingsAr = {

    hideSubHeader: false,

    noDataMessage: this.translate.instant('COMMON.NoLoanApplications'),

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"  title="Edit"></i>',
    },

    actions: {
      columnTitle: "إجراءات",
      position: "right",
      add: false,
      edit: true,
      delete: false
    },
    columns: {
      RequestId: {
        title:"رقم الطلب",// this.translate.instant('COMMON.RequestId'),
        type: "number",
        width: "12%",
        editable: false
      },
      ProjectCode: {
        title:"رمز المشروع",// this.translate.instant('COMMON.ProjectCode'),
        type: "text",
        editable: false, 
      },
      ProjProfId: {
        title:"نوع الطلب",// this.translate.instant('COMMON.RequestType'),
        type: "string",
        editable: false,
        valuePrepareFunction: (value) => { 
          let item = this.profileItems.find(x=>x.id==value);
          if(item)
          return item.prqTypeAr;
          else
          return value;
        },
        filter:{
          type:"list",
          config:{
            selectText:"اختر الكل",
            list:
            [
               
              {value:'0000000024' ,title:'أرض وقرض مدن'} ,
              {value:'0000000025' ,title:'مصنع وقرض مدن'},
              {value:'0000000038',title:'أرض وقرض هيئة المدن و المناطق الإقتصادية الخاصة' },
              {value:'0000000035' ,title:'أرض وقرض الجبيل'},
              {value:'0000000036' ,title:'أرض وقرض ينبع'},
              {value:'0000000051' ,title:'أرض وقرض مدن لوجيستي'},
              {value:'0000000052' ,title:'أرض وقرض لوجيستي الجبيل '},
              {value:'0000000053' ,title:'أرض وقرض لوجيستي ينبع '},
              {value:'0000000054' ,title:'أرض وقرض لوجيستي هيئة المدن والمناطق الإقتصادية الخاصة '}
              ]
              
              ,
          }
        }
      },
      RequestStatusAr: {
        title:"حالة الطلب",// this.translate.instant('COMMON.RequestStatus'),
        type: "string",
        editable: false
      },
      // RequestStatus: {
      //   title: this.translate.instant('COMMON.RequestStatus'),
      //   type: "string",
      //   editable: false
      // },
      CreatedDate: {
        title:"تاريخ إنشاء الطلب",// this.translate.instant('COMMON.CreatedDate'),
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
    }
  };

  createLoan() {
    this.router.navigateByUrl('/pages/new-request/loan-application/create-loan');
    let serviceId = this.activatedRoute.snapshot.paramMap.get("serviceId");
    this.localStorage.setItem("serviceId", serviceId);
  }

  getLoanRequests() {

    this.spinnerService.show();
    try {
     
      this.communicationsService
        .getSendRequestInfo(this.customerProfileService.currentCustomerProfile.customerProfileId, 'NLOA', this.serviceId)
        .then(requests => (this.bindLoanInfo(requests)), err => (this.showLoanInfoError(err)));
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  bindLoanInfo(requests) {
   // this.spinnerService.show();

    this.localStorage.getItem("CurrentUserNationalIdLoanApplication").subscribe((data) => {
      this.CurrentUserNationalIdLoanApplication = data;
    })
    if (this.CurrentUserNationalIdLoanApplication != 0) {
      var obj = {
        "nationalId": this.CurrentUserNationalIdLoanApplication,
        "serviceId": this.serviceId
      };
      this.communicationsService.GetRequestsStatusByNationalIdAndServiceId(obj)
        .then((rescrdata) => {
          this.spinnerService.hide();
          console.log(rescrdata);
          if (rescrdata) {

            this.source = requests;
            this.PreliminaryData = rescrdata;
            for (var i = 0; i < this.source.length; i++) {
              for (var r = 0; r < this.PreliminaryData.length; r++) {
                if (this.source[i].RequestId == this.PreliminaryData[r].LoanRequestNumber) {
                  this.source[i]['InternalRequestStatus'] =this.translate.currentLang =='ar'? this.PreliminaryData[r].StatusAr: this.PreliminaryData[r].StatusEn;
                  this.source[i]['InternalRequestStatusId'] = this.PreliminaryData[r].Id;
                  this.source[i]['LandLoanRequestStatus'] = this.PreliminaryData[r].RequestStatus;
                  this.source[i]['LastStatusId'] = this.PreliminaryData[r].LastStatus;
                  this.source[i]['PreliminaryRequestNumber'] = this.PreliminaryData[r].PreliminaryRequestNumber;
                }
              }
            }
          }
        }, err => (this.showLoanInfoError(err)))
      
    }
    
  }

  showLoanInfoError(err) {
    this.spinnerService.hide();
  }

  onEdit(event) {

    let item = this.profileItems.find(x=>x.id==event.data.ProjProfId);
    if(item)
    {
      this.serviceId=item.serviceId;
    this.localStorage.setItem("serviceId", this.serviceId).subscribe();
  } 
    this.customerProfileService.setLoanRequestId(event.data.RequestId);
    this.customerProfileService.setStatusCode(event.data.StatusCode);
    this.customerProfileService.setLanLoanRequestStatus(event.data.LandLoanRequestStatus);
    this.customerProfileService.setLandLoanRequestLastStatus(event.data.LastStatusId);
    this.customerProfileService.SetPreliminaryRequestNumber(event.data.PreliminaryRequestNumber);
    if (event.data.StatusCode == 'Q')
    this.getCommonComments("SENT", event.data.RequestId, event.data.RequestCode, event.data.StatusCode);
else{ 
    // alert( this.customerProfileService.getEncryptedString(String(event.data.RequestId)+","+event.data.StatusCode);
    
    this.router.navigateByUrl('/pages/new-request/loan-application/project-information');
}
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
      
    this.router.navigateByUrl('/pages/new-request/loan-application/project-information');


  }
  resolveError() {

    //this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }
  getLoanDropdowns() {
   // this.spinnerService.show();
    try {
      this.projectInformationService
        .getLoanDropdowns()
        .then((res) => (this.resolveLoanDropdowns(res)), err => this.commonService.showFailureToast(err));
    }
    catch (err) {
 //     this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  resolveLoanDropdowns(res) {
    if (!res.LegalEntity) {
      this.commonService.showFailureToast("Failed");
      //this.spinnerService.hide();
    }
    else {
      this.customerProfileService.setLoanDropdowns(res);
     this.getLoanRequests();
    }
  }

  getRequest() {
    this.spinnerService.show();
    this.serviceId = +this.activatedRoute.snapshot.paramMap.get("serviceId");

   /* if (this.serviceId) {
      this.localStorage.setItem("serviceId", this.serviceId).subscribe();
    } else
      this.localStorage.getItem("serviceId").subscribe((data) => {
        this.serviceId = data;
      })*/
    this.getLoanDropdowns();
    this.getLoanRequests();
    
  }
}