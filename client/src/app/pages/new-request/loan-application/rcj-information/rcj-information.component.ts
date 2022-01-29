import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { RCJInfoService } from '../../../../services/rcj-information.service';
import { LoanApplicationService } from '../../../../services/loan-application.service';
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from '../../../../services/communications.service'
import { RCJInformation } from './rcj-information';
import { Observable, Subscription, interval } from 'rxjs';
import { ProjInfoService } from "../../../../services/project-information.service";

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
// const MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
//   'ذو القعدة', 'ذو الحجة'];
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
  selector: 'rcj-information',
  templateUrl: './rcj-information.component.html',
  styleUrls: ['./rcj-information.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class LoanApplicationRCJInformationComponent implements OnInit {

  LandLoanRequestStatus: any = 0;
  model: RCJInformation;
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
  new_material_object = {
    RawMaterial: "",
    Unit: 0,
    Source: "",
    RCJ_RequestId: 0,
    SysUserServiceId: 0
  };
  new_product_object = {
    Description: "",
    Unit: 0,
    MarketDestination: "",
    RCJ_RequestId: 0,
    SysUserServiceId: 0
  };
  nonSaudiOwnersListNames = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  translate: any;

  constructor(private communicationsService: CommunicationsService, private spinnerService: Ng4LoadingSpinnerService, private calendar: NgbCalendar, private loanApplicationService: LoanApplicationService,
    private customerProfileService: CustomerProfileService, private commonService: CommonService, private rcjInfoService: RCJInfoService, private toastr: ToastrService, private modalService: NgbModal, private router: Router
    , private projectInformationService: ProjInfoService, ) {

    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 20, month: 12, day: 31 };
    this.translate = this.commonService.returnTranslate();

  }

  files: any = [];

  onFileChange(event) {

    this.files = event.target.files;

  }

  ngOnInit() {
    this.spinnerService.show();
    this.requestId = this.customerProfileService.loanRequestId;
    this.LandLoanRequestStatus = this.customerProfileService.LandLoanRequestStatus;

    this.model = new RCJInformation();
    //For testing
    //this.model.sysUserServiceId= 4347;
    //this.model.sysUserServiceId= this.customerProfileService.loanRequestId;
    this.material_object = [{
      RawMaterial: "",
      Unit: 0,
      Source: ""
    }];
    this.product_services_object = [{
      Description: "",
      Unit: 0,
      MarketDestination: ""
    }];

    this.Location = [{
      name: this.translate.instant('RCJ_Information.JIC'),
      value: false,
      code: 'LocationLaf$$1'
    },
    {
      name: this.translate.instant('RCJ_Information.RIC'),
      value: false,
      code: 'LocationLaf$$2'
    }
    ];
    this.countries = this.rcjInfoService.contries;

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
    console.log('testData', this.ProjectClassificationAll);

    this.requestId = this.customerProfileService.loanRequestId;
    this.statusCode = this.customerProfileService.statusCode;

    //if (this.statusCode == 'P' || this.statusCode == 'A' || this.LandLoanRequestStatus == 7 || this.LandLoanRequestStatus == 40 || this.LandLoanRequestStatus == 41)
    if (this.LandLoanRequestStatus == 7 || this.LandLoanRequestStatus == 40 || this.LandLoanRequestStatus == 41)
      this.add_edit_delete_show = false;

    else
      this.add_edit_delete_show = true;



    // if (this.model.sysUserServiceId == null || this.model.sysUserServiceId == 0)
    //   this.router.navigateByUrl('/pages/new-request/loan-application');
    if (this.requestId == null || this.requestId == 0)
      this.router.navigateByUrl('/pages/new-request/loan-application');

    else {

      // this.real_estate_source = new LocalDataSource();
      // this.list_companies_source = new LocalDataSource();
      // this.other_investments_source = new LocalDataSource();
      // this.bank_details_source = new LocalDataSource();
      // this.kpmr_source = new LocalDataSource();
      // this.project_ownership_source = new LocalDataSource();
      // this.project_documents_source = new LocalDataSource();
      // this.curriculum_vitae_source = new LocalDataSource();
      // this.proposed_loan_source = new LocalDataSource();
      // this.source_of_finance_source = new LocalDataSource();

      this.getRCJInformation();

    }



  }

  tempAttachments = {
    ConceptualSitePlan: ""

  };
  uploadFile(event, type) {
    try {
      this.inputs = this.inputs;
      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        if (file.size / 1024 / 1024 > 1) {
          this.commonService.showFailureToast(this.translate.instant('COMMON.SizeAttached1MB'));
          return false;
        }
        let attachmentType = file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.') + 1);
        if (this.rcjInfoService.AttachmentExtentionTypes.indexOf(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.') + 1)) === -1) {
          this.commonService.showFailureToast(this.translate.instant('COMMON.Incompatiblefileformat'));
          return false;
        }
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          let inputFile = reader.result.toString();
          this.inputs[type] = inputFile.split(',')[1];
          this.inputs[type + "Type"] = attachmentType;

          if (type === "ConceptualSitePlan") {
            this.model.ConceptualSitePlanType = this.inputs[type + "Type"];

            this.model.ConceptualSitePlan = this.inputs[type];
          }
        };
      }

    }
    catch (err) {
      console.log(err);
    }


    // let a = await this.llCommonService.getBase64Image(event).then(r=> r.);
    // console.log(a) ;

    // this.llCommonService.getBase64Image(event).then(res => {
    //   this.input.CopyOfResidencyNationalNumber = res.toString() ;
    //   console.log(this.input.CopyOfResidencyNationalNumber);
    // });
    //console.log(a);
  }

  getRCJInformation() {

    try {
      //this.model.sysUserServiceId = 4347;
      //TODO: get rcj info from DB
      //  this.projectInformationService
      //    .getProjectInformation(this.requestId, this.customerProfileService.currentCustomerProfile.customerProfileId)
      //    .then((res) => (this.resolveProjectInformation(res)), err => (this.getProjectInformationError(err)));
      var obj = {

        "requestId": this.requestId,

      };
      this.rcjInfoService
        .getRequest(obj)
        .then((res) => (this.resolveRCJInformation(res)), err => (this.getProjectInformationError(err)));
      this.projectInformationService
        .getProjectInformation(this.requestId, this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then((res) => (this.resolveProjectInformation(res)), err => (this.getProjectInformationError(err)));
    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  getProjectInformationError(err) {

    this.spinnerService.hide();
    this.commonService.showFailureToast(err);

  }
  onProjectClassificationSelect(test) {
    console.log(test);
  }
  resolveRCJInformation(res) {
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
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
      this.model.RCJ_Material = res.RCJ_Material;
      this.material_object = this.model.RCJ_Material;
      this.model.RCJ_ProductServices = res.RCJ_ProductServices;
      this.product_services_object = this.model.RCJ_ProductServices;
      this.new_product_object.RCJ_RequestId = res.Id;
      this.new_material_object.RCJ_RequestId = res.Id;
      this.new_product_object.SysUserServiceId = res.SysUserServiceId;
      this.new_material_object.SysUserServiceId = res.SysUserServiceId;
      // this.model.RCJ_Material.forEach(element => {
      //   element.Unit = this.commonService.returnDateArrayFromDateString(element.Unit);
      //   element.Unit.day = 1;
      //   element.Unit.month = 1;
      // });
      // this.model.RCJ_ProductServices.forEach(element => {
      //   debugger;
      //   element.Unit = this.commonService.returnDateArrayFromDateString(element.Unit);
      //   element.Unit.day = 1;
      //   element.Unit.month = 1;
      // });
      this.spinnerService.hide();
      this.commonService.showSuccessToast(this.translate.instant('RCJ_Information.Retrived'));


    }
  }
  resolveProjectInformation(res) {

    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();
    }

    else {

      try {

        this.GenInfoPer = parseFloat(res.GenInfoPer);
        this.MarkInfoPer = parseFloat(res.MarkInfoPer);
        this.TechInfoPer = parseFloat(res.TechInfoPer);
        this.FinInfoPer = parseFloat(res.FinInfoPer);
        this.ChecklistPer = (this.GenInfoPer + this.MarkInfoPer + this.TechInfoPer + this.FinInfoPer) / 4;

        var loanPercentageValues = {
          GenInfoPer: this.GenInfoPer,
          MarkInfoPer: this.MarkInfoPer,
          TechInfoPer: this.TechInfoPer,
          FinInfoPer: this.FinInfoPer,
          ChecklistPer: this.ChecklistPer
        }

        this.customerProfileService.setLoanPercentageValues(loanPercentageValues);


        var temp_array = {};

        temp_array = {
          "ProjId": this.inputs.ProjId,
          "PrqId": this.inputs.PrqId,
          "BpId": this.inputs.BpId,
          "FactoryCr": this.inputs.FactoryCr,
          "ProjectName": this.inputs.ProjectName,
          "GenInfoProducts": this.inputs.GenInfoProducts,
          "FinPlanId": this.inputs.FinPlanId
        };

        this.customerProfileService.setLoanArray(temp_array);




      }



      catch (err) {
        this.spinnerService.hide();
        this.commonService.showFailureToast(err);
      }

    }

  }

  onSave() {

    var valid = true;
    console.log('form', this.model);
    if (
      // this.model.InvesterTelephone == null || this.model.Position == null 
      this.model.HazardousWaste == null ||
      // this.model.Mobile== null  || this.model.Ext == null ||
      this.model.Power == null || this.model.ProjectClassification == null ||
      this.model.Location == null || this.model.TotalAreaRequired == null ||
      this.model.PotableWater == null || this.model.SanitaryWasteWater == null ||
      this.model.MunicipalWaste == null || this.model.IndustrialNonHazWaste == null ||
      this.model.ConceptualSitePlan == null
    ) {
      this.commonService.showFailureToast("Please Fill All the Required Fields");
      valid = false
    }
    else {
      try {
        //TODO: reset
        //this.model.sysUserServiceId = 4347;
        //this.model.sysUserServiceId = this.customerProfileService.loanRequestId;
        this.spinnerService.show();
        //prepare material and product
        this.material_object.forEach(element => {

          element.SysUserServiceId = this.model.sysUserServiceId;
          element.RCJ_RequestId = this.model.id;
          if (typeof element.Unit != "string") {
            var ngbDateStruct = { day: element.Unit.getUTCDay(), month: element.Unit.getUTCMonth(), year: element.Unit.getUTCFullYear() };
            element.Unit = ngbDateStruct.year;
          }

        });
        this.product_services_object.forEach(element => {
          element.SysUserServiceId = this.model.sysUserServiceId;
          element.RCJ_RequestId = this.model.id;
          if (typeof element.Unit != "string") {
            var ngbDateStruct = { day: element.Unit.getUTCDay(), month: element.Unit.getUTCMonth(), year: element.Unit.getUTCFullYear() };
            element.Unit = ngbDateStruct.year;
          }
          // element.Unit = this.commonService.returnDateArrayFromDateString(element.Unit).year;


        });
        this.model.RCJ_Material = this.material_object;
        this.model.RCJ_ProductServices = this.product_services_object;

        //this.timer = Observable.timer(5000); // 5000 millisecond means 5 seconds
        this.rcjInfoService.submitRequest(this.model).then(res => {
          console.log('resonse ' + res);
          this.getRCJInformation();
          this.spinnerService.hide();
          this.commonService.showSuccessToast("Addition successful !");
        });
        // this.subscription = this.timer.subscribe(() => {
        //   // set showloader to false to hide loading div from view after 5 seconds
        //   this.spinnerService.hide();
        //   this.commonService.showSuccessToast("Addition successful !");
        // });



      }

      catch (err) {
        this.spinnerService.hide();
        this.commonService.showFailureToast(err);
      }

    }
  }

  getProjectKPMRInformation() {

    try {
      //TODO: get rcj info from DB
      //   this.rcjInfoService
      //     .getProjectKPMRInformation(this.inputs.BpId,
      //       this.customerProfileService.currentCustomerProfile.customerProfileId)
      //     .then((res) => (this.resolveProjectKPMRInformation(res)), err => (this.getProjectInformationError(err)));

    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  resolveProjectKPMRInformation(res) {

    if (res.ResMessType === "E")
      this.spinnerService.hide();

    else {

      var kpmr_source_data_array = [];

      for (var i = 0; i < res.BpManagePos.length; i++) {

        var kpmr_source_data = {
          BpPosId: res.BpManagePos[i].BpPosId ? res.BpManagePos[i].BpPosId : "",
          BpPosition: res.BpManagePos[i].BpPosition ? res.BpManagePos[i].BpPosition.PosDesc : "",
          FirstName: res.BpManagePos[i].FirstName ? res.BpManagePos[i].FirstName : "",
          LastName: res.BpManagePos[i].LastName ? res.BpManagePos[i].LastName : "",
          MiddleName: res.BpManagePos[i].MiddleName ? res.BpManagePos[i].MiddleName : "",
          DateOfJoining: res.BpManagePos[i].DateOfJoining ? this.commonService.returnDateArrayFromDateString(res.BpManagePos[i].DateOfJoining) : "",
          Nationality: res.BpManagePos[i].Nationality ? res.BpManagePos[i].Nationality.Nationality : "",
          Degree: res.BpManagePos[i].Degree ? res.BpManagePos[i].Degree : "",
          ProfCert: res.BpManagePos[i].ProfCert ? res.BpManagePos[i].ProfCert : "",
          YearExp: res.BpManagePos[i].YearExp ? res.BpManagePos[i].YearExp : "",
          YearOverExp: res.BpManagePos[i].YearOverExp ? res.BpManagePos[i].YearOverExp : "",
          GuiId: res.BpManagePos[i].GuiId ? res.BpManagePos[i].GuiId : "",
        };

        kpmr_source_data_array.push(kpmr_source_data);

        this.kpmr_source_length++;

      }

      this.kpmr_source.load(kpmr_source_data_array);

      this.kpmr_source.refresh();

      this.communicationsService.getDocumentService(this.requestId, "p")
        .then(requests => (this.resolveDocuments(requests)), err => (this.commonService.showFailureToast(err)));

    }

  }

  // onGregDateChange(event) {

  //   this.cell.newValue = this.commonService.returnDateStringFromGregDateString(event);

  // }

  resolveDocuments(requests) {

    // this.documents = this.commonService.returnViewDocumentJson(requests);


    // this.projectProfileDocuments.url = this.documents["url"];

    // this.realEstateTableDocuments.url = this.documents["url"];

    // this.listOfCompaniesTableDocuments.url = this.documents["url"];

    // this.otherInvestmentsTableDocuments.url = this.documents["url"];

    // this.KPMRTableDocuments.url = this.documents["url"];


    // this.projectProfileDocuments.documentList = [];

    // this.realEstateTableDocuments.documentList = [];

    // this.listOfCompaniesTableDocuments.documentList = [];

    // this.otherInvestmentsTableDocuments.documentList = [];

    // this.KPMRTableDocuments.documentList = [];


    // var kpmr_temp_source = [];

    // this.kpmr_source.getAll().then((res) => {

    //   kpmr_temp_source = res;

    //   for (var i = 0; i < this.documents["documentList"].length; i++) {

    //     this.documents["documentList"][i]["docUrl"] =
    //       this.documents["url"]
    //         .replace("entityId", this.documents["documentList"][i].EntityId)
    //         .replace("refId", this.documents["documentList"][i].RefId)
    //         .replace("documentId", this.documents["documentList"][i].DocumentId)
    //         .replace("fileName", this.documents["documentList"][i].FileName);

    //     if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.inputs.GuiId))
    //       this.projectProfileDocuments["documentList"].push(this.documents["documentList"][i]);

    //     else {

    //       for (var j = 0; j < this.tables.AssetRealEstate.length; j++)
    //         if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.tables.AssetRealEstate[j]["GuiId"]))
    //           this.realEstateTableDocuments["documentList"].push(this.documents["documentList"][i]);

    //       for (var j = 0; j < this.tables.AssetOtherInvestments.length; j++)
    //         if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.tables.AssetOtherInvestments[j]["GuiId"]))
    //           this.otherInvestmentsTableDocuments["documentList"].push(this.documents["documentList"][i]);

    //       for (var j = 0; j < this.tables.AssetShares.length; j++)
    //         if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.tables.AssetShares[j]["GuiId"]))
    //           this.listOfCompaniesTableDocuments["documentList"].push(this.documents["documentList"][i]);

    //       for (var j = 0; j < kpmr_temp_source.length; j++)
    //         if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(kpmr_temp_source[j]["GuiId"]))
    //           this.KPMRTableDocuments["documentList"].push(this.documents["documentList"][i]);

    //     }

    //   }

    // });

    // this.commonService.showSuccessToast("Project Information retrieved successfully !");

    // this.spinnerService.hide();

  }
  addRowMaterial(material_object) {
    material_object.push({
      RawMaterial: "",
      Unit: 0,
      Source: "",
      RCJ_RequestId: 0,
      SysUserServiceId: 0
    });
  }
  addRowProduct(product_services_object) {
    product_services_object.push({
      Description: "",
      Unit: 0,
      MarketDestination: "",
      RCJ_RequestId: 0,
      SysUserServiceId: 0
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
          this.router.navigateByUrl('/pages/new-request/loan-application/rcj-information');
          break;

        case 6:
          this.router.navigateByUrl('/pages/new-request/loan-application/rcj-questionnaire');
          break;

      }

    }

    else {

      this.commonService.showFailureToast("Complete filling the rcj Information !");

    }

  }


}