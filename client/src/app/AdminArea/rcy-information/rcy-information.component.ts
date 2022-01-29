import { Component, OnInit, Injectable } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { RCYInformation } from './rcy-information';
import { CustomerProfileService } from "../../services/customer-profile.service";
import { NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subscription, interval } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RCYInfoService } from '../../services/rcy-information.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjInfoService } from "../../services/project-information.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
//import * as jspdf from 'jspdf';
//import html2canvas from 'html2canvas';


const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = ['Muharram', 'Safar', "Rabi' I", "Rabi' al Thani", 'Jumada I', 'Jumada al-akhir', 'Rajab', "Sha'aban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", "Dhu al-Hijjah"];

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {

  getWeekdayShortName(weekday: number) {
    return WEEKDAYS[weekday - 1];

  }

  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'rcy-information',
  templateUrl: './rcy-information.component.html',
  styleUrls: ['./rcy-information.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class RcyInformationComponent implements OnInit {
  RCYLoanNumber: any = 0;
  LandLoanRequestStatus: any = 0;
  model: RCYInformation;
  ProjectClassificationAll = [];
  Location = [];
  private subscription: Subscription;
  private timer: Observable<any>;
  //files: any = [];
  documents = {};

  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  RCJInfoPer = 0;
  RCJQuesPer = 0;
  ChecklistPer = 0;

  add_edit_delete_show = true;


  inputs = {
    "ConceptualSitePlan": "",
    "ConceptualSitePlanType": "",
    "Origin": "CP",
    "SentReqId": 0,
    "Indicator": "SAVESUBMIT",
    "IsLoanSumbit": "D",
    "ProjProfile": "",
    "ProjId": 0,
    "PrqId": 0,
    "BpId": 0,
    "GuiId": "",
    "ProfileId": "",
    "CustomerId": "",
    "IsPrivacySign": "",
    "ProjectName": "",
    "FactoryId": "",
    "CrDate": { year: 0, month: 0, day: 0 },
    "FactoryCr": "",
    "CrStartDate": "",
    "IndLicDate": { year: 0, month: 0, day: 0 },
    "ExpCompDate": "",
    "TrailRunFrom": "",
    "TrailRunTo": "",
    "GenInfoProducts": [],
    "GenInfoFactAddress": {
      "FactoryId": 0,
      "LandNum": "",
      "City": "",
      "ManageArea": "",
      "PoBox": "",
      "ProductArea": "",
      "SameFactAddr": "",
      "StoreArea": "",
      "TotalArea": "",
      "Website": "",
      "CoX": "",
      "CoY": "",
      "Zip": "",
      "Fax": "",
      "Phone": "",
      "Mail": ""
    },
    "GenInfoLoanPurpose": {
      "LoanPurId": "",
      "LoanPurDesc": ""
    },
    "GenInfoProjImpStatus": {
      "ProjImpStatusId": "",
      "ProjImpStatusDesc": ""
    },
    "GenInfoProjCompStatus": {
      "ProjCompStatusId": "",
      "ProjCompStatusDesc": ""
    },
    "GenInfoTypeProj": {
      "ProjTypeId": "",
      "ProjTypeDesc": ""
    },
    "BussPartOwners": [],
    "GetInfoLegalEntity": {
      "LegalEntityId": "",
      "LegalEntityDesc": ""
    },
    "MessType": "",
    "MessText": "",
    "FinPlanId": ""
  };

  tables = {
    "CustomerId": "",
    "ProfileId": "",
    "Orgin": "CP",
    "Id": 0,
    "OperationType": "C",
    "AssetRealEstate": [],
    "AssetShares": [],
    "AssetOtherInvestments": [],
    "AssetBankDetails": [],
    "AssetNetworth": [],
    "MessType": "S",
    "MessText": "Sucess"
  };

  property_type_list = [];

  property_type_desc_list = [];

  legal_entity_list = [];

  legal_entity_desc_list = [];

  project_status_list = [];

  project_status_desc_list = [];

  project_completion_status_list = [];

  project_completion_status_desc_list = [];

  country_list = [];

  country_name_list = [];

  position_list = [];

  position_desc_list = [];

  ExtidType_list = [];

  ExtidType_Desc_list = [];

  BpRelations_list = [];

  BpRelations_desc_list = [];

  CofinsType_list = [];

  CofinsType_Desc_list = [];

  cofinbprelation = {};
  Cofinancers = [];
  relations_list = [];
  relations_externalidp_list = [];

  panelStep = 1;

  real_estate_source_length = 0;
  list_companies_source_length = 0;
  other_investments_source_length = 0;
  bank_details_source_length = 0;
  kpmr_source_length = 0;
  project_ownership_source_length = 0;
  project_documents_source_length = 0;
  curriculum_vitae_source_length = 0;
  proposed_loan_source_length = 0;
  source_of_finance_source_length = 0;

  real_estate_source: LocalDataSource;
  list_companies_source: LocalDataSource;
  other_investments_source: LocalDataSource;
  bank_details_source: LocalDataSource;
  kpmr_source: LocalDataSource;
  project_ownership_source: LocalDataSource;
  project_documents_source: LocalDataSource;
  curriculum_vitae_source: LocalDataSource;
  proposed_loan_source: LocalDataSource;
  source_of_finance_source: LocalDataSource;

  deleted_real_estate: any = [];
  deleted_list_companies: any = [];
  deleted_other_investments: any = [];
  deleted_bank_details: any = [];
  deleted_project_ownerships: any = [];
  deleted_project_documents: any = [];
  deleted_curriculum_vitae: any = [];
  deleted_proposed_loan: any = [];
  deleted_kpmr: any = [];

  deleteCancelModalReference: any;

  allPanelsExpanded = false;

  startedFilling = 0;

  requestId = 0;


  statusCode = "";

  ownersList = [];

  ownersListNames = [];
  material_object = [];
  product_services_object = [];
  countries = [];
  sources = [];
  new_material_object = {
    RawMaterial: "",
    Unit: 0,
    Source: "",
    Quantity: 0,
    RCY_RequestId: 0,
    SysUserServiceId: 0
  };
  new_product_object = {
    Description: "",
    Unit: 0,
    MarketDestination: "",
    Quantity: 0,
    RCY_RequestId: 0,
    SysUserServiceId: 0
  };
  nonSaudiOwnersListNames = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  translate: any;

  constructor(private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService,
    private calendar: NgbCalendar, private commonService: CommonService, private rcyInfoService: RCYInfoService,
    private router: Router, private projectInformationService: ProjInfoService, protected localStorage: LocalStorage,
    private route: ActivatedRoute) {
    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 20, month: 12, day: 31 };
    this.translate = this.commonService.returnTranslate();

  }
  adminuser: any = {};
  files: any = [];
  RCYPreliminaryRequestNumber: any = 0;
  RCYSysuserServiceId: any = 0;

  onFileChange(event) {

    this.files = event.target.files;

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

    //this.spinnerService.show();
    //this.RCYLoanNumber = this.customerProfileService.RCYLoanNumber;
    //this.requestId = this.customerProfileService.loanRequestId;
    //this.LandLoanRequestStatus = this.customerProfileService.LandLoanRequestStatus;

    this.localStorage.getItem('AdminLoginData').subscribe((data) => {

      this.adminuser = data;
      if (this.adminuser != null && this.adminuser.ServiceId == 10) {
        if (this.RCYLoanNumber != null || this.RCYLoanNumber != 0)
          this.getRCYInformation();
        else {
          this.router.navigateByUrl('/admin-login');
        }
      }
      else {
        this.router.navigateByUrl('/admin-login');
      }

    });


    this.model = new RCYInformation();

    this.material_object = [{
      RawMaterial: "",
      Unit: 0,
      Source: "",
      Quantity: 0,
    }];
    this.product_services_object = [{
      Description: "",
      Unit: 0,
      MarketDestination: "",
      Quantity: 0,
    }];

    this.Location = [{
      name: 'مدينة ينبع الصناعية',
      value: false,
      code: 'مدينة ينبع الصناعية'
    },
    {
      name: this.translate.instant('مدينة جازان للصناعات الاساسية والتحويلية'),
      value: false,
      code: 'مدينة جازان للصناعات الاساسية والتحويلية'
    }
    ];
    this.countries = this.rcyInfoService.contries;
    this.sources = this.rcyInfoService.sources;

    this.ProjectClassificationAll = [
      {
        name: this.translate.instant('RCJ_Information.Manufacturing'),
        value: false,
        code: 'ProjectClassificationLaf$$1'
      },
      {
        name: this.translate.instant('RCJ_Information.Services'),
        value: false,
        code: 'ProjectClassificationLaf$$2'
      },
      {
        name: this.translate.instant('RCJ_Information.Logistic'),
        value: false,
        code: 'ProjectClassificationLaf$$3'
      },
      {
        name: this.translate.instant('RCJ_Information.Waste_Management'),
        value: false,
        code: 'ProjectClassificationLaf$$4'
      },
      {
        name: this.translate.instant('RCJ_Information.Waste_Recycling'),
        value: false,
        code: 'ProjectClassificationLaf$$5'
      },
      {
        name: this.translate.instant('RCJ_Information.Other'),
        value: false,
        code: 'ProjectClassificationLaf$$6'

      }

    ];

  }


  getRCYInformation() {

    try {
      var obj = {

        "requestId": this.RCYLoanNumber,

      };
      this.rcyInfoService
        .getAdminRequest(obj)
        .then((res) => (this.resolveRCYInformation(res)), err => (this.getProjectInformationError(err)));

    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  resolveRCYInformation(res) {

    if (res.Id == 0) {
      this.commonService.showFailureToast("لا توجد بيانات");
      this.spinnerService.hide();
    }

    else {
      this.model.sysUserServiceId = res.SysUserServiceId;
      this.model.id = res.Id;
      this.model.Power = res.Power;
      this.model.ProjectClassification = res.ProjectClassification;
      this.model.Location = res.Location;
      this.model.HazardousWaste = res.HazardousWaste;
      this.model.IndustrialNonHazWaste = res.IndustrialNonHazWaste;
      this.model.MunicipalWaste = res.MunicipalWaste;
      this.model.PotableWater = res.PotableWater;
      this.model.TotalAreaRequired = res.TotalAreaRequired;
      this.model.SanitaryWasteWater = res.SanitaryWasteWater;
      this.model.RCY_Material = res.RCY_Material;
      this.material_object = this.model.RCY_Material;
      this.model.RCY_ProductServices = res.RCY_ProductServices;
      this.product_services_object = this.model.RCY_ProductServices;
      this.new_product_object.RCY_RequestId = res.Id;
      this.new_material_object.RCY_RequestId = res.Id;
      this.new_product_object.SysUserServiceId = res.SysUserServiceId;
      this.new_material_object.SysUserServiceId = res.SysUserServiceId;
      this.spinnerService.hide();
      this.commonService.showSuccessToast(this.translate.instant('RCJ_Information.Retrived'));


    }
  }

  getProjectInformationError(err) {

    this.spinnerService.hide();
    this.commonService.showFailureToast(err);

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
