import { Component, OnInit } from '@angular/core';
import { PreliminaryRequestService } from "../../../services/preliminary-request.service";
import { LocalDataSource } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreliminaryRequestModalsComponent } from "./preliminary-request-modals/preliminary-request-modals.component";
import { LangChangeEvent,TranslateService } from '@ngx-translate/core';

import { CommonService } from "../../../services/common.service";
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from "../../../services/communications.service";
import { MENU_ITEMS } from '../../pages-menu';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators'; 
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CommonCommentsService } from '../../../services/common-comments.service';
@Component({
  selector: 'preliminary-request',
  templateUrl: './preliminary-request.component.html',
  styleUrls: ['./preliminary-request.component.scss']
})

export class PreliminaryRequestComponent implements OnInit {
  menu = MENU_ITEMS;
  source: any = [];
  settings: any;
  PreliminaryData: any = [];
  customerProfileId: any = String;
  CurrentUserNationalId = 0;
  CurrentUserNationalIdLoanApplication = 0;
  constructor(private communicationsService: CommunicationsService, private commonCommentsService: CommonCommentsService, private modalService: NgbModal, private router: Router,
    private translate: TranslateService, private commonService: CommonService, private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService, private activeRoute: ActivatedRoute, private localStorage: LocalStorage) {
    // this language will be used as a fallback when a translation isn't found in the current language
   /* this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('ar');
    this.localStorage.setItem('lang', 'ar').subscribe(() => {
      // Done
    }, (error) => {
      alert(error)
    });*/
    this.initTableSettings();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {

      this.initTableSettings();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log(event.url);
     // this.ngOnInit();
    });
  }

  ngOnInit() {

    console.log(this.customerProfileService.currentCustomerProfile.customerProfileId);
    //setTimeout(() => {
    this.getPRQRequests();
    //}, 500);

  }
  initTableSettings(): void {
    var Actions=this.translate.instant('COMMON.Actions');
  this.settings = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('COMMON.noPreliminary'),

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },

    actions: {
      columnTitle: Actions,
      position: "right",
      add: false,
      edit: true,
      delete: false
    },
    columns: {
      RequestId: {
        title: this.translate.instant('COMMON.RequestId'),
        type: "number",
        width: "12%",
        editable: false
      },
      RequestType: {
        title: this.translate.instant('TECHNICAL_INFORMATION.requesttype'),
        type: "string",
        editable: false,
        valuePrepareFunction: (cell, row) => {
          return this.commonService.returnTextBasedOnLangIfExist(row, 'RequestType', 'RequestTypeAr');
        }
      },
       RequestStatus: {
         title: this.translate.instant('TECHNICAL_INFORMATION.requeststatus'),
         type: "string",
         editable: false,  
         valuePrepareFunction: (cell, row) => {
          return this.commonService.returnTextBasedOnLangIfExist(row, 'RequestStatus', 'RequestStatusAr');
        }
      },
     /* InternalRequestStatus: {
        title: this.translate.instant('TECHNICAL_INFORMATION.requeststatus'),
        type: "string",
        editable: false,
      
      },*/
      CreatedDate: {
        title: this.translate.instant('TECHNICAL_INFORMATION.createddate'),
        type: "string",
        editable: false
      },
      RequestDate: {
        title: this.translate.instant('TECHNICAL_INFORMATION.requestdate'),
        type: "string",
        editable: false
      }
    }
  };
  }
  getPRQRequests() {

    try {
      var serviceId =+this.activeRoute.snapshot.paramMap.get("serviceId");
      let productType="L";
      if(serviceId!=12){
      serviceId=0;
      productType="I";
      }
      else
      serviceId=0;
      console.log(this.customerProfileService.currentCustomerProfile.customerProfileId);
      this.spinnerService.show();
      this.communicationsService
        .getSendRequestInfo(this.customerProfileService.currentCustomerProfile.customerProfileId, 'NPRE',serviceId,productType)
        .then(requests => (this.bindPRQInfo(requests)), err => (this.showPRQInfoError(err)));

    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }



  bindPRQInfo(requests) {
    this.spinnerService.show();
    this.localStorage.getItem("CurrentUserNationalId").subscribe((data) => {
      this.CurrentUserNationalId = data;
      
    if (this.CurrentUserNationalId != 0) {
      var obj = {
        "nationalId": this.CurrentUserNationalId
      };
      this.communicationsService.GetRequestsStatusByNationalId(obj)
        .then((rescrdata) => {
          console.log(rescrdata);
          if (rescrdata) {
            this.source = requests;
            this.PreliminaryData = rescrdata;
            for (var i = 0; i < this.source.length; i++) {
              for (var r = 0; r < this.PreliminaryData.length; r++) {
                if (this.source[i].RequestId == this.PreliminaryData[r].PreliminaryRequestNumber) {
                  this.source[i]['InternalRequestStatus'] = this.PreliminaryData[r].StatusAr;
                  this.source[i]['InternalRequestStatusId'] = this.PreliminaryData[r].Id;
                  this.source[i]['PreliminaryRequestStatus'] = this.PreliminaryData[r].RequestStatus;
                  this.source[i]['LastStatusId'] = this.PreliminaryData[r].LastStatus;

                }
              }
             // if (this.source[i].StatusCode == 'D')
                //this.source[i]['InternalRequestStatus'] = "حفظ كمسودة"
                //else
                if (this.translate.currentLang === 'ar') {
                this.source[i]['InternalRequestStatus'] = this.source[i]['RequestStatusAr'] ;
                }
                else
                this.source[i]['InternalRequestStatus'] = this.source[i]['RequestStatus'] ;

            }
          }
          this.spinnerService.hide();

        }, err => (this.showPRQInfoError(err)))
    }
    })

  }
  showPRQInfoError(err) {
    this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  }

  createPRQ() {
     
      var serviceId =+this.activeRoute.snapshot.paramMap.get("serviceId");
      
      if(serviceId==12)
      this.router.navigateByUrl('/pages/new-request/preliminary-request/create-prq/create-prq?islogistic=1');
      else
      this.router.navigateByUrl('/pages/new-request/preliminary-request/create-prq/create-prq');
  

    
  }

  onEdit(event) {
    //alert(event.data.LastStatusId);
    this.customerProfileService.setPreliminaryRequestStatus(event.data.PreliminaryRequestStatus);
    this.customerProfileService.setPreliminaryRequestLastStatus(event.data.LastStatusId);
    if (event.data.RequestCode == "NPRE" || event.data.RequestCode == "NLOA") {

      this.customerProfileService.setLoanRequestId(event.data.RequestId);

      this.customerProfileService.setStatusCode(event.data.StatusCode);

      this.customerProfileService.setCommentsFrom(event.data.RequestCode == "NPRE" ? "P" : "L");

      if (event.data.StatusCode == 'Q')
        this.getCommonComments("SENT", event.data.RequestId, event.data.RequestCode, event.data.StatusCode);
else{ 
        // alert( this.customerProfileService.getEncryptedString(String(event.data.RequestId)+","+event.data.StatusCode);
        this.router.navigate(['/pages/new-request/preliminary-request/create-prq/create-prq'], { queryParams: { requestId: this.customerProfileService.getEncryptedString(String(event.data.RequestId)), status: this.customerProfileService.getEncryptedString(event.data.StatusCode) } });
}

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

    //this.spinnerService.hide();
   
    // alert( this.customerProfileService.getEncryptedString(String(event.data.RequestId)+","+event.data.StatusCode);
    this.router.navigate(['/pages/new-request/preliminary-request/create-prq/create-prq'], { queryParams: { requestId: this.customerProfileService.getEncryptedString(String(sentReqId)), status: this.customerProfileService.getEncryptedString(sentReqStatus) } });


  }
  resolveError() {

    //this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }


}