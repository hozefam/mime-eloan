import { Component, OnInit, Injectable, Input } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";
import { PreliminaryRequestService } from "../../../../services/preliminary-request.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { LocalDataSource } from "ng2-smart-table";
import { RCJInfoService } from "../../../../services/rcj-information.service";
import { LoanApplicationService } from "../../../../services/loan-application.service";
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { CommunicationsService } from "../../../../services/communications.service"
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ModalLandForm1ModalsComponent } from './modon-landform1-modals/modon-landform1-modals.component';
import { Observable, Subscription, interval } from "rxjs";
import { ProjInfoService } from "../../../../services/project-information.service";
import { Form5Service } from '../../../../services/form5.service';
import { LLCommonService } from '../../../../services/ll-common.service';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

const MONTHS = ["Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani",
  "Jumada al-awwal", "Jumada al-thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal",
  "Dhu al-Qi'dah", "Dhu al-Hijjah"];

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
  selector: "land-form1",
  templateUrl: "./modon-land-form1.component.html",
  styleUrls: ["./modon-land-form1.component.scss"],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class ModonLandForm1Component implements OnInit {

  contries;
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
  settings_equipmentdetails_en:any;
  settings_equipmentdetails_ar:any;

  equipment_details_source_length = 0;
  equipment_details_source: LocalDataSource;

  settings_importingdetails_en:any;
  settings_importingdetails_ar:any;

  importing_details_source_length = 0;
  importing_details_source: LocalDataSource;

  settings_rawmaterialdetails_en:any;
  settings_rawmaterialdetails_ar:any;

  rawmaterial_details_source_length = 0;
  rawmaterial_details_source: LocalDataSource;

  settings_contactdetails_en:any;
  settings_contactdetails_ar:any;

  contact_details_source_length = 0;
  contact_details_source: LocalDataSource;

  settings_productdetails_en:any;
  settings_productdetails_ar:any;

  product_details_source_length = 0;
  product_details_source: LocalDataSource;

  settings_documentdetails_en:any;
  settings_documentdetails_ar:any;

  document_details_source_length = 0;
  document_details_source: LocalDataSource;




  add_edit_delete_show = true;
  serviceId = 7; 
   panelsVisible = [
    {
      panel: 0,
      panelName: "ProductDetails",
      panelStep: 0,
      visible: true
    },
    {
      panel: 1,
      panelName: "ProposedServicesAndApplications",
      panelStep: 1,
      visible: true
    },
    {
      panel: 2,
      panelName: "DetailedDescriptionsForEachProposedTransportMethod",
      panelStep: 2,
      visible: true
    },
    {
      panel: 3,
      panelName: "SponsorProductSales",
      panelStep: 3,
      visible: true
    },
    {
      panel: 4,
      panelName: "TargetMarketRegionOrCountries",
      panelStep: 4,
      visible: true
    },
    {
      panel: 5,
      panelName: "TargetMarketSegments",
      panelStep: 5,
      visible: true
    },
    {
      panel: 6,
      panelName: "ActivitiesOfProjectOwnersOtherThanProject",
      panelStep: 6,
      visible: true
    },
    {
      panel: 7,
      panelName: "FactoriesinTargetMarketRegionOrCountries",
      panelStep: 7,
      visible: true
    },
    {
      panel: 8,
      panelName: "ImportCompetitorsinTargetMarketRegionOrCountries",
      panelStep: 8,
      visible: true
    },
    {
      panel: 9,
      panelName: "HistoricalProductDemand",
      panelStep: 9,
      visible: true
    },
    {
      panel: 10,
      panelName: "FactorsAffectingFutureDemand",
      panelStep: 10,
      visible: true
    },
    {
      panel: 11,
      panelName: "ExpectedSalesVolume",
      panelStep: 11,
      visible: true
    }
  ];

  ManufacturingTechnologymodel:any[];
  productlistmodel:any[];
  exportingcountriesmodel:any[];
  hasil:boolean=false;
  input = {
    Id: "",
    SysUserServiceId: "",
    LoanRequestNo: "", 
    //asd
    "IsApplybyCR":false,
    "SAGIANumber":"",
    "ModonCity":"",
    "IndustrialLicenseNumber":"",
    "productId":"",
    "requestReason":"",
    "Oldcontractnumber":"",
    "TypeOfIdentity_applicant":"",
    "Products_List":[],
    "IdentityNumber_applicant":"",
    "Email_applicant":"",
    "ManufacturingDescription":"",
    "Mobile_applicant":"",
    "FirstName_applicant":"",
    "SecondName_applicant":"",
    "ThirdName_applicant":"",
    "FourthName_applicant":"",
    "IndustryType":"",
    "ManufactureTechId":"",
    "ProductionCityId":"",
    "TypeOfIdentity_delegator":"",
    "NumberOfUnits":"",
    "IdentityNumber_delegator":"",
    "Email_delegator":"",
    "Mobile_delegator":"",
    "FirstName_delegator":"",
    "SecondName_delegator":"",
    "ThirdName_delegator":"",
    "FourthName_delegator":"",
    "HasAuthorizedToSignTheContractPerson":false,
    "IndustryMethodology":"",
    "ManufacturingTechnology":[],
    "IsConsumersAgreement":false,
    "ConsumersAgreementInfo":"",
    "HasTechPartnership":false,
    "TechPartnerInfo":"",
    "InternalDistributors":false,
    "ConstructionAmountValue":"",
    "IsInternalProduction":false, 
    "HaveOtherFactories":false,
    "InvestmentAmountValue":"",
    "IsRelatedToIndustry":false,
    "Factories":"",
    "IsForeignInvestor":"", 
    "ImportInvestmentAmount":"", 
    "LendingBankPercentage":"",
    "RelatedIndustriesInfo":"",
    "SidfPercentage":"",
    "IsExporting":false,
    "ExportingCountries":[],
    "ExportingPercentage":"",
    "ExportingAmount":"",
    "TechnicianNumber":"",
    "HavePrevProjects":false,
    "RequestedAreaNumber":"",
    "YearlyStoringAmount":"",
    "IsImporting":false,
    "AdministratorsNumber":"",
    "EngineersNumbers":"",
    "OperatorsNumber":"",
    "SaudiAdministratorsNumber":"",
    "SaudiEngineersNumbers":"",
    "SaudiOperatorsNumber":"",
    "SaudiTechnicianNumber":"",
    "RequestedAreaWithoutSetbacks":"",
    "RequestedAreaWithSetbacks":"",
    "RequestedSetbacksArea":"",
    "WarehouseArea":"",
    "ProductionArea":"",
    "ServicesArea":"",
    "ElectricalLoadsWatt":"",
    "NeededGas":"",
    "NeededIndustrialWater":"",
    "NeededPureWater":"",
    "NeededSewage":"",
    "CompanyBio":"",
    
    //DelegateIDCopy: "",
    FactoryLayoutAttachment: "",
    "CRNumber":"",
    CRIssuedDate:"",
    CRExpDate:"",
    "CRName":"",

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

  panelStep = 0;

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

  landloanrequeststatus: any = 0;
  statusCode = "";

  ownersList = [];

  ownersListNames = [];
  material_object = [];
  product_services_object = [];


  countries;
  pollutionType;
  IndustryType;
  ManufacturingMethod;
  Supplier;
  ManufactureTechId;
  Activities;
  SubActivities;
  TypeOfIdentity_applicants;
  nonSaudiOwnersListNames = [];
LRequestReason=[];
  LTypeofIdentity=[];
  LIndustrytype=[];
  LIndustryMethodology=[];
  LExportingCountries=[];
  LIndustrial_Cities_Land=[];
  LIndustrial_Cities_Factory=[];
  LProduct_Attachments=[];
  LProductId=[{code:4,title:" مصنع جاهز 1500",titleEn:"مصنع جاهز 1500"},{code:5,title:" مصنع جاهز 700",titleEn:"مصنع جاهز 700"}];
  LMeasuringUnit=[];
  LManufacturingTechnology=[];
  LCity=[];
  LNumberofunits=[];
  LProduct_Type=[];
  Contact_Details= [];
Documents= [];
Equipment= [];
ExportingCountries= [];
ImportingDetails= [];
ManufacturingTechnology= [];
ProductsDetails= [];
Products_List= [];
RawMaterialsDetails=[];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  translate: any;


  constructor(private preliminaryRequestService: PreliminaryRequestService,
    protected localStorage: LocalStorage,private communicationsService: CommunicationsService,private translateService: TranslateService,  private spinnerService: Ng4LoadingSpinnerService, private calendar: NgbCalendar, private loanApplicationService: LoanApplicationService,
    private customerProfileService: CustomerProfileService, private commonService: CommonService, private rcjInfoService: RCJInfoService, private toastr: ToastrService, private modalService: NgbModal, private router: Router
    , private projectInformationService: ProjInfoService, private form5Service: Form5Service, private llCommonService: LLCommonService) {
    this.contries = this.form5Service.contries;
    this.Activities = this.form5Service.activeties;
    this.pollutionType = this.form5Service.PollutionType;
    this.countries = this.form5Service.contries;
    this.IndustryType = this.form5Service.IndustryType;
    this.ManufacturingMethod = this.form5Service.ManufacturingMethod;
    this.ManufactureTechId = this.form5Service.ManufacturingId;
    this.Supplier = this.form5Service.Supplier;
    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 20, month: 12, day: 31 };
    this.translate = this.commonService.returnTranslate();

  }

  files: any = [];

  onFileChange(event) {

    this.files = event.target.files;

  }
  getMODONLookUP() { 
    
    try {

      this.form5Service
        .Get_MODONLookUP(this.requestId)
        .then((res) => (this.resolvegetMODONLookUP(res)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }
  resolveGetMimProducts(res){
    this.LProduct_Type=res.getMimProductsRs.body.Content;
  }
  GetMimProducts() {
    
      this.localStorage.getItem("crNumber").subscribe(data => {
        try {
          this.form5Service.GetMimProducts(data,this.commonService.defaultLanguage == 'ar'?"ARABIC":"ENGLISH")
        .then((res) => (this.resolveGetMimProducts(res)), err => this.resolveError());

    }
    catch (err) {
      this.resolveError();
    }
      });
   

  }
  getMODONData() {

    try {

      this.form5Service
        .Get_MODONTableAll(this.requestId)
        .then((res) => (this.resolveGet_MODONTableAll(res)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }
  GetModonLandForm1() {

    try {
      this.spinnerService.show();

      this.form5Service
        .GetModonLandForm1(this.requestId)
        .then((res) => (this.resolveGetModonLandForm1(res)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }
  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }
  
  resolveGetModonLandForm1(res){
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();
    } 
    this.spinnerService.hide();
     
    this.input ={
      Id: res.Id,
      SysUserServiceId: res.SysUserServiceId,
      LoanRequestNo: res.LoanRequestNo,  
      "IsApplybyCR":res.IsApplybyCR,
      "SAGIANumber":res.SAGIANumber,
      "ModonCity":res.ModonCity,
      "IndustrialLicenseNumber":res.IndustrialLicenseNumber,
      "Products_List":[],
      "productId":res.productId,
      "requestReason":res.requestReason,
      "Oldcontractnumber":res.Oldcontractnumber,
      "TypeOfIdentity_applicant":res.typeOfIdentity_applicant,
      "IdentityNumber_applicant":res.identityNumber_applicant,
      "Email_applicant":res.email_applicant,
      "ManufacturingDescription":res.manufacturingDescription,
      "Mobile_applicant":res.mobile_applicant,
      "FirstName_applicant":res.firstName_applicant,
      "SecondName_applicant":res.secondName_applicant,
      "ThirdName_applicant":res.thirdName_applicant,
      "FourthName_applicant":res.fourthName_applicant,
      "ProductionCityId":res.productionCityId,
      "NumberOfUnits":res.numberOfUnits,
      "TypeOfIdentity_delegator":res.typeOfIdentity_delegator,
      "IdentityNumber_delegator":res.identityNumber_delegator,
      "Email_delegator":res.email_delegator,
      "Mobile_delegator":res.mobile_delegator,
      "FirstName_delegator":res.firstName_delegator,
      "SecondName_delegator":res.secondName_delegator,
      "ThirdName_delegator":res.thirdName_delegator,
      "FourthName_delegator":res.fourthName_delegator,
      "HasAuthorizedToSignTheContractPerson":res.HasAuthorizedToSignTheContractPerson,
      "IndustryMethodology":res.industryMethodology,
      "ManufactureTechId":res.manufactureTechId,
      "ManufacturingTechnology":res.manufacturingTechnology!=null?res.manufacturingTechnology.split(','):"",
      "IsConsumersAgreement":res.isConsumersAgreement,
      "ConsumersAgreementInfo":res.consumersAgreementInfo,
      "HasTechPartnership":res.hasTechPartnership,
      "TechPartnerInfo":res.techPartnerInfo,
      "InternalDistributors":res.internalDistributors,
      "ConstructionAmountValue":res.constructionAmountValue,
      "IsInternalProduction":res.isInternalProduction, 
      "HaveOtherFactories":res.haveOtherFactories,
      "InvestmentAmountValue":res.investmentAmountValue,
      "IsRelatedToIndustry":res.isRelatedToIndustry,
      "Factories":res.factories,
      "IsForeignInvestor":res.isForeignInvestor,
      "ImportInvestmentAmount":res.ImportInvestmentAmount, 
      "LendingBankPercentage":res.lendingBankPercentage,
      "RelatedIndustriesInfo":res.relatedIndustriesInfo,
      "SidfPercentage":res.sidfPercentage,
      "IsExporting":res.isExporting,
      "ExportingCountries":res.exportingCountries!=null?res.exportingCountries.split(','):"",
      "ExportingPercentage":res.exportingPercentage,
      "ExportingAmount":res.exportingAmount,
      "TechnicianNumber":res.technicianNumber,
      "HavePrevProjects":res.havePrevProjects,
      "RequestedAreaNumber":res.requestedAreaNumber,
      "YearlyStoringAmount":res.yearlyStoringAmount,
      "IsImporting":res.isImporting,
      "AdministratorsNumber":res.administratorsNumber,
      "EngineersNumbers":res.engineersNumbers,
      "OperatorsNumber":res.operatorsNumber,
      "SaudiAdministratorsNumber":res.saudiAdministratorsNumber,
      "SaudiEngineersNumbers":res.saudiEngineersNumbers,
      "SaudiOperatorsNumber":res.saudiOperatorsNumber,
      "SaudiTechnicianNumber":res.saudiTechnicianNumber,
      "RequestedAreaWithoutSetbacks":res.requestedAreaWithoutSetbacks,
      "RequestedAreaWithSetbacks":res.requestedAreaWithSetbacks,
      "RequestedSetbacksArea":res.requestedSetbacksArea,
      "WarehouseArea":res.warehouseArea,
      "IndustryType":res.industryType,
      "ProductionArea":res.productionArea,
      "ServicesArea":res.servicesArea,
      "ElectricalLoadsWatt":res.electricalLoadsWatt,
      "NeededGas":res.neededGas,
      "NeededIndustrialWater":res.neededIndustrialWater,
      "NeededPureWater":res.neededPureWater,
      "NeededSewage":res.neededSewage,
      "CompanyBio":res.cCompanyBio,
       //DelegateIDCopy: "",
       FactoryLayoutAttachment: "",
      "CRNumber":res.CRNumber, 
      "CRIssuedDate":res.CRIssuedDate,
      "CRExpDate":res.CRExpDate,
      "CRName":res.CRName
    
    }; 
     
    this.setHasil(res.IsApplybyCR);
       this.localStorage.getItem('CurrentUserNationalId').subscribe((data) => {
        console.log(data);
        
    this.form5Service.GetClientDetails(data)
    .then((res) => (this.resolveClientDetailse(res)), err => this.resolveError());
       
      });
    this.input = Object.assign({}, this.input);
  }
  resolveClientDetailse(res){
    this.input.TypeOfIdentity_applicant="2";
    this.input.IdentityNumber_applicant=res.NationalId;
    this.input.Email_applicant=res.Email;
   // this.input.Mobile_applicant=res.mobile_applicant;
    this.input.FirstName_applicant=res.FirstName;
    this.input.SecondName_applicant=res.MiddleName;
    this.input.ThirdName_applicant=res.LastName;
  //  this.input.FourthName_applicant=res.fourthName_applicant;

  }
  resolveGet_MODONTableAll(res,type=1){
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      
      this.spinnerService.hide();
    }
    //Contact_Details,Documents,Equipment,ExportingCountries,ImportingDetails,ManufacturingTechnology,
    //ProductsDetails,Products_List,RawMaterialsDetails
    if(type==1)
    this.GetModonLandForm1();

    this.document_details_source.empty();
    this.document_details_source_length=0;
    
    this.document_details_source.load(res.Documents);

    this.document_details_source_length = res.Documents.length;
    this.document_details_source.refresh();

    this.equipment_details_source.empty();
    this.equipment_details_source_length=0;
    
    this.equipment_details_source.load(res.Equipment);

    this.equipment_details_source_length = res.Equipment.length;
    this.equipment_details_source.refresh();

    this.importing_details_source.empty();
    this.importing_details_source_length=0;
    
    this.importing_details_source.load(res.ImportingDetails);

    this.importing_details_source_length = res.ImportingDetails.length;
    this.importing_details_source.refresh();

    this.product_details_source.empty();
    this.product_details_source_length=0;
    
    this.product_details_source.load(res.ProductsDetails);

    this.product_details_source_length = res.ProductsDetails.length;
    this.product_details_source.refresh();

    this.contact_details_source.empty();
    this.contact_details_source_length=0;
    
    this.contact_details_source.load(res.Contact_Details);

    this.contact_details_source_length = res.Contact_Details.length;
    this.contact_details_source.refresh();

    this.rawmaterial_details_source.empty();
    this.rawmaterial_details_source_length=0;
    
    this.rawmaterial_details_source.load(res.RawMaterialsDetails);

    this.rawmaterial_details_source_length = res.RawMaterialsDetails.length;
    this.rawmaterial_details_source.refresh();
  
    setTimeout(() => {
      let arr=[];
      for (let val of res.ManufacturingTechnology) { 
        arr.push(val.value);
      }
    this.input["ManufacturingTechnology"]=arr;
    this.ManufacturingTechnologymodel=arr;
     arr=[];
    for (let val of res.ExportingCountries) { 
      arr.push(val.value);
    } 
      
    this.input["ExportingCountries"]=arr;
    this.exportingcountriesmodel=arr;
    arr=[];
    for (let val of res.Products_List) { 
      arr.push(val.value);
    } 
      
    this.input["Products_List"]=arr;
    this.productlistmodel=arr;
    this.input = Object.assign({}, this.input);
    }, 5000);
  }
  getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      return reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
  resolvegetMODONLookUP(res) {
    this.LIndustrytype=res.filter((o)=>o.LookUpType=="Industrytype");
    this.LTypeofIdentity=res.filter((o)=>o.LookUpType=="TypeofIdentity");
    this.LRequestReason=res.filter((o)=>o.LookUpType=="RequestReason");
    this.LIndustryMethodology=res.filter((o)=>o.LookUpType=="IndustryMethodology");
    this.LExportingCountries=res.filter((o)=>o.LookUpType=="ExportingCountries");
    this.LProduct_Attachments=res.filter((o)=>o.LookUpType=="Product_Attachments");
    this.LMeasuringUnit=res.filter((o)=>o.LookUpType=="MeasuringUnit");
    this.LManufacturingTechnology=res.filter((o)=>o.LookUpType=="ManufacturingTechnology");
    this.LCity=res.filter((o)=>o.LookUpType=="KSACity");
    this.LNumberofunits=res.filter((o)=>o.LookUpType=="Numberofunits");
    this.LIndustrial_Cities_Factory=res.filter((o)=>o.LookUpType=="Industrial_Cities_Factory");
    this.LIndustrial_Cities_Land=res.filter((o)=>o.LookUpType=="Industrial_Cities_Land");
    
   // this.LProduct_Type=res.filter((o)=>o.LookUpType=="Product_Type");
    console.log('asd');
    console.log(this.LCity);
    this.getMODONData();
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();
    } 

  }
  bindPRQDetailsByRequestId() {
    try {
  
      this.preliminaryRequestService.getPRQDetailsByRequestId(this.customerProfileService.currentCustomerProfile.customerProfileId, "2000005884")
        .then(requests => (this.bindPRQInfo(requests, 0)), err => this.resolveError());
 
    }

    catch (err) {
      this.resolveError();
    }

  }
  bindPRQInfo(res, from) {

  }
  ngOnInit() {
    this.localStorage.getItem("serviceId").subscribe(data => {
      this.serviceId = data;
    });
//this.bindPRQDetailsByRequestId();
    this.input = this.input;
    this.spinnerService.show();
    this.requestId = this.customerProfileService.loanRequestId;
    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
    this.getMODONLookUP();
    this.GetMimProducts();
    //For testing
    //this.model.sysUserServiceId= 4347;
    //this.model.sysUserServiceId= this.customerProfileService.loanRequestId;
    this.initTableSettings();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initTableSettings(); 
    });

    console.log("testData", this.ProjectClassificationAll);

    this.requestId = this.customerProfileService.loanRequestId;
    this.statusCode = this.customerProfileService.statusCode;

    if (this.statusCode == "P" || this.statusCode == "A")
      this.add_edit_delete_show = false;

    else
      this.add_edit_delete_show = true;

    if (this.landloanrequeststatus == 3 || this.landloanrequeststatus == 40 || this.landloanrequeststatus == 41)
      this.add_edit_delete_show = false;

    else
      this.add_edit_delete_show = true;

    // if (this.model.sysUserServiceId == null || this.model.sysUserServiceId == 0)
    //   this.router.navigateByUrl("/pages/new-request/loan-application");
    if (this.requestId == null || this.requestId == 0)
      this.router.navigateByUrl("/pages/new-request/loan-application");
 
  }
  initTableSettings(){
    this.equipment_details_source=new LocalDataSource();
    this.settings_equipmentdetails_en = {
      hideSubHeader: true,
      noDataMessage: this.translate.instant('COMMON.NoDataFound'),
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
      },
      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions'),
      },
      columns: {
        ProductionLinesNumber: {
          title: this.translate.instant('ModonLandForm.ProductionLinesNumber'),
          type: "string",
        },
        Name: {
          title: this.translate.instant('ModonLandForm.Name'),
          type: "string"
        },
        Source: {
          title: this.translate.instant('ModonLandForm.Source'),
          type: "string"
        }
      }
    };

    this.importing_details_source=new LocalDataSource();
    this.settings_importingdetails_en = {
      hideSubHeader: true,
      noDataMessage: this.translate.instant('COMMON.NoDataFound'),
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
      },
      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions'),
      },
      columns: {
        YearlyGoodVolume: {
          title: this.translate.instant('ModonLandForm.YearlyGoodVolume'),
          type: "string",
        },
       
        Source: {
          title: this.translate.instant('ModonLandForm.Source'),
          type: "string"
        }
      }
    };

    this.product_details_source=new LocalDataSource();
    this.settings_productdetails_en = {
      hideSubHeader: true,
      noDataMessage: this.translate.instant('COMMON.NoDataFound'),
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
      },
      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions'),
      },
      columns: {
        FinalProduct: {
          title: this.translate.instant('ModonLandForm.FinalProduct'),
          type: "string",
        },
        ProductionVolume: {
          title: this.translate.instant('ModonLandForm.ProductionVolume'),
          type: "string"
        },
        Symbol: {
          title: this.translate.instant('ModonLandForm.Symbol'),
          type: "string"
        }
        ,
        Unit: {
          title: this.translate.instant('ModonLandForm.Unit'),
          type: "select"
        }
      }
    };

    this.rawmaterial_details_source=new LocalDataSource();
    this.settings_rawmaterialdetails_en = {
      hideSubHeader: true,
      noDataMessage: this.translate.instant('COMMON.NoDataFound'),
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
      },
      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions'),
      },
      columns: {
        Type: {
          title: this.translate.instant('ModonLandForm.Type'),
          type: "string",
        },
        Quantity: {
          title: this.translate.instant('ModonLandForm.Quantity'),
          type: "string"
        },
        Unit: {
          title: this.translate.instant('ModonLandForm.Unit'),
          type: "string"
        },
        Source: {
          title: this.translate.instant('ModonLandForm.Source'),
          type: "string"
        }
      }
    };

    this.contact_details_source=new LocalDataSource();
    this.settings_contactdetails_en = {
      hideSubHeader: true,
      noDataMessage: this.translate.instant('COMMON.NoDataFound'),
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
      },
      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions'),
      },
      columns: {
     
        Name: {
          title: this.translate.instant('ModonLandForm.Name'),
          type: "string"
        },
        Email: {
          title: this.translate.instant('ModonLandForm.Email'),
          type: "string",
        },
        Mobile: {
          title: this.translate.instant('ModonLandForm.Mobile'),
          type: "string",
        },
        JobRole: {
          title: this.translate.instant('ModonLandForm.JobRole'),
          type: "string"
        }
      }
    };

    this.document_details_source=new LocalDataSource();
    this.settings_documentdetails_en = {
      hideSubHeader: true,
      noDataMessage: this.translate.instant('COMMON.NoDataFound'),
      mode: "external",
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
      },
      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions'),
      },
      columns: {
        fileName: {
          title: this.translate.instant('ModonLandForm.FileName'),
          type: "string",
        },
        documentTemplate: {
          title: this.translate.instant('ModonLandForm.DocumentTemplate'),
          type: "string"
        } 
      }
    };
  }

  tempAttachments = {
    // NationalAttachment: "",
    TimePlanAttachment: "",
    //DelegateIDCopy: "",
    FactoryLayoutAttachment: ""

  };
  uploadFile(event, type) {
    try {
      this.input = this.input;
      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        if (file.size / 1024 / 1024 > 1) {
          
          this.commonService.showFailureToast(this.translate.instant('COMMON.SizeAttached1MB'));
          return false;
        }
        let attachmentType = file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.') + 1);
        if (this.form5Service.AttachmentExtentionTypes.indexOf(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.') + 1)) === -1) {
          this.commonService.showFailureToast(this.translate.instant('COMMON.Incompatiblefileformat'));
          return false;
        }
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          let inputFile = reader.result.toString();
          this.input[type] = inputFile.split(',')[1];
          this.input[type + "Type"] = attachmentType;
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

  invalidForm() { 
    this.commonService.showFailureToast(this.translate.instant('COMMON.FillRequiredData'));
  }
  getModonSubActivety(obj) {
   /* console.log(obj);
    this.form5Service.GetModonSubActivities(this.input.Activitie).then(res => {
      console.log(res);
      this.SubActivities = res;
      this.commonService.showSuccessToast(this.translate.instant('ModonLandForm.MainActRetrieved'));
      console.log(this.input.SubActivitie)
    }
    ).catch()*/
  }
  setHasil(obj){
   // alert(obj);
    this.hasil=obj;
  }
  HaveOtherFactories(obj){
    // alert(obj);
     if(obj==false)
     this.input["Factories"]=null;
   }
  getProjectInformationError(err) {
    this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  }
  onProjectClassificationSelect(test) {
    console.log(test);
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

        this.customerProfileService.setLoanArray(temp_array);
      }

      catch (err) {
        this.spinnerService.hide();
        this.commonService.showFailureToast(err);
      }

    }

  }
saveManutech(){
  this.input.ManufacturingTechnology=[];
  console.log(this.ManufacturingTechnologymodel);
  for (const val of this.ManufacturingTechnologymodel) { // You can use `let` instead of `const` if you like
  var post_data = {
    "Id":"0",
    "LoanRequestNo": this.requestId.toString(),
    "SysUserServiceId": "0",
    "value":val
  };
  this.input.ManufacturingTechnology.push(post_data);
}
}
SetDelegator(value:boolean){
if(value){
  this.input["TypeOfIdentity_delegator"]=this.input["TypeOfIdentity_applicant"];
  this.input["IdentityNumber_delegator"]=this.input["IdentityNumber_applicant"];
  this.input["Mobile_delegator"]=this.input["Mobile_applicant"];
  this.input["Email_delegator"]=this.input["Email_applicant"];
  this.input["FirstName_delegator"]=this.input["FirstName_applicant"];
  this.input["SecondName_delegator"]=this.input["SecondName_applicant"];
  this.input["ThirdName_delegator"]=this.input["ThirdName_applicant"];
  this.input["FourthName_delegator"]=this.input["FourthName_applicant"];
}
else{
  this.input["TypeOfIdentity_delegator"]=null;
  this.input["IdentityNumber_delegator"]=null;
  this.input["Mobile_delegator"]=null;
  this.input["Email_delegator"]=null;
  this.input["FirstName_delegator"]=null;
  this.input["SecondName_delegator"]=null;
  this.input["ThirdName_delegator"]=null;
  this.input["FourthName_delegator"]=null;
}

}
saveProducts_List(){
  this.input.Products_List=[];
  for (const val of this.productlistmodel) { // You can use `let` instead of `const` if you like
  var post_data = {
    "Id":"0",
    "LoanRequestNo": this.requestId.toString(),
    "SysUserServiceId": "0",
    "value":val
  };
 // this.input["Products_List"]=post_data;
 this.input.Products_List.push(post_data);
 }
}
savExportingcountries(){
  
  this.input.ExportingCountries=[];
  for (const val of this.exportingcountriesmodel) { // You can use `let` instead of `const` if you like
  var post_data = {
    "Id":"0",
    "LoanRequestNo": this.requestId.toString(),
    "SysUserServiceId": "0",
    "value":val
  };
  this.input.ExportingCountries.push(post_data);
  
}
}
  onSave() {
    if(!this.input["HaveOtherFactories"])
    this.input["Factories"]="";
   if(!this.input["LendingBankPercentage"]||!this.input["SidfPercentage"]){
    this.panelStep=1;
     this.invalidForm();
     return;
   }
   if(!this.input["ImportInvestmentAmount"]){
    this.panelStep=4;
     this.invalidForm();
     return;
   }
   if(!this.input["RequestedAreaNumber"]){
    this.panelStep=4;
     this.invalidForm();
     return;
   }
    var totalPercentage=Number(this.input["SidfPercentage"])+Number(this.input["LendingBankPercentage"]);//+Number(this.input["SidfPercentage"])+Number(this.input["SidfPercentage"])+Number(this.input["SidfPercentage"]);
    if(Number(this.input["SidfPercentage"])>75){
    this.commonService.showFailureToast(this.translate.instant('ModonLandForm.SIDFPercentageMax75'));
    this.panelStep=1;
    return;
    }
    if(totalPercentage>100)
    {
    this.commonService.showFailureToast(this.translate.instant('ModonLandForm.SIDFPercentageMax100'));
    this.panelStep=1;
    return;
    }
    if(this.product_details_source_length<=0)
    {
      this.commonService.showFailureToast(this.translate.instant('ModonLandForm.ProductDetailsRequired'));
      this.panelStep=6;
      return;
    }
    if(this.rawmaterial_details_source_length<=0)
    {
      this.commonService.showFailureToast(this.translate.instant('ModonLandForm.RawMaterialsRequired'));
      this.panelStep=7;
      return;
    }
    if(this.equipment_details_source_length<=0)
    {
      this.commonService.showFailureToast(this.translate.instant('ModonLandForm.EquipmentDetailsRequired'));
      this.panelStep=5;
      return;
    }
    if(this.document_details_source_length<=0)
    {
      this.commonService.showFailureToast(this.translate.instant('ModonLandForm.DocumentDetailsRequired'));
      this.panelStep=9;
      return;
    }
    if(this.contact_details_source_length<=0)
    {

      this.commonService.showFailureToast(this.translate.instant('ModonLandForm.ContactRequired'));
      this.panelStep=8;
      return;
    }
    
    this.input.LoanRequestNo = this.requestId.toString();
    this.input["sysUserServiceId"]=0;
    if(this.serviceId==7){
    this.input["productSubFamilyId"]="3";
    this.input["productId"]=null;
    }
    else
    this.input["productSubFamilyId"]="2";
   // this.input["IsApplybyCR"]=!this.hasil;
    this.spinnerService.show();
    console.log(this.input["ManufacturingTechnology"]);
    this.saveManutech();
    this.savExportingcountries();
    this.saveProducts_List(); 
    
    this.localStorage.getItem("crNumber").subscribe(data => {this.input["CRNumber"]=data;});
    this.localStorage.getItem("crDate").subscribe(data => {this.input["CRIssuedDate"]=data;});
    this.localStorage.getItem("expLicDate").subscribe(data => {this.input["CRExpDate"]=data;});
    this.localStorage.getItem("projectName").subscribe(data => {this.input["CRName"]=data;});
    setTimeout(() => {  
    
    this.form5Service
      .SaveModonLandForm1(this.input)
      .then(res => {
        this.spinnerService.hide();
        if (!res["message"] || res["message"] !== "F") {
          //this.input.Id = res.toString();
          this.commonService.showSuccessToast(this.translate.instant('COMMON.Saved'));
        }
        else 
          this.commonService.showFailureToast(this.translate.instant('COMMON.NotSaved'));
      
      
      }),
      err => this.commonService.showFailureToast(err);
       
    }, 1000);
  
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
  onCloseDeleteCancelModal() {

    this.deleteCancelModalReference.close();

  }
  deleteData(eventdata,type)
  { 
    try {
this.spinnerService.show()
      this.form5Service
        .DeleteData(type,eventdata.Id)
        .then((res) => (this.resolveDeleteData(eventdata,res,type)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }
  }
  resolveDeleteData(eventdata,res,type)
  {
    if(type== "Modon_Equipment")
    { this.equipment_details_source.remove(eventdata);

      this.equipment_details_source.refresh();

      this.equipment_details_source_length--; 
    }
    if(type== "Modon_ImportingDetails")
    { this.importing_details_source.remove(eventdata);

      this.importing_details_source.refresh();

      this.importing_details_source_length--; 
    }
    if(type== "Modon_ProductsDetails")
    { this.product_details_source.remove(eventdata);

      this.product_details_source.refresh();

      this.product_details_source_length--; 
    }
    if(type== "Modon_Contact_Details")
    { this.contact_details_source.remove(eventdata);

      this.contact_details_source.refresh();

      this.contact_details_source_length--; 
    }
    if(type== "Modon_RawMaterialsDetails")
    { this.rawmaterial_details_source.remove(eventdata);

      this.rawmaterial_details_source.refresh();

      this.rawmaterial_details_source_length--; 
    }
    if(type== "Modon_Documents")
    {
      this.document_details_source.remove(eventdata);
      this.document_details_source.refresh();
      this.document_details_source_length--; 
    }
    this.deleteCancelModalReference.close();
  this.spinnerService.hide();
  }
  onDeleteCancelConfirm() {

    if (this.deleteCancelModalReference.action === this.translate.instant('COMMON.Delete')) {

      if (this.deleteCancelModalReference.table_name === 'equipment') { 
 
        this.deleteData(this.deleteCancelModalReference.event.data, "Modon_Equipment");    
       
      }
      if (this.deleteCancelModalReference.table_name === 'importing') { 
 
        this.deleteData(this.deleteCancelModalReference.event.data, "Modon_ImportingDetails");    
       
      }
      if (this.deleteCancelModalReference.table_name === 'productsdetails') { 
 
        this.deleteData(this.deleteCancelModalReference.event.data, "Modon_ProductsDetails");    
       
      }
      if (this.deleteCancelModalReference.table_name === 'rawmaterials') { 
 
        this.deleteData(this.deleteCancelModalReference.event.data, "Modon_RawMaterialsDetails");    
       
      }
      if (this.deleteCancelModalReference.table_name === 'contactdetails') { 
 
        this.deleteData(this.deleteCancelModalReference.event.data, "Modon_Contact_Details");    
       
      }
      if (this.deleteCancelModalReference.table_name === 'documents') { 
 
        this.deleteData(this.deleteCancelModalReference.event.data, "Modon_Documents");    
       
      }
    }
  }
  onDelete(delete_modal, event, table_name) {
    this.deleteCancelModalReference = this.modalService.open(delete_modal);
    this.deleteCancelModalReference.event = event;
    this.deleteCancelModalReference.table_name = table_name;
    this.deleteCancelModalReference.action = this.translate.instant('COMMON.Delete');
    this.deleteCancelModalReference.error = this.translate.instant('COMMON.AreYouSure');

    if (this.deleteCancelModalReference.table_name == 'documents')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('ModonLandForm.Documents');
    if (this.deleteCancelModalReference.table_name == 'equipment')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('ModonLandForm.EquipmentDetails');
      
    if (this.deleteCancelModalReference.table_name == 'importing')
    this.deleteCancelModalReference.table_name_display = this.translate.instant('ModonLandForm.ImportingDetails');
    if (this.deleteCancelModalReference.table_name == 'productsdetails')
    this.deleteCancelModalReference.table_name_display = this.translate.instant('ModonLandForm.ListOfProductDetails');
    if (this.deleteCancelModalReference.table_name == 'rawmaterials')
    this.deleteCancelModalReference.table_name_display = this.translate.instant('ModonLandForm.ListOfRawMaterials');
    if (this.deleteCancelModalReference.table_name == 'contactdetails')
    this.deleteCancelModalReference.table_name_display = this.translate.instant('ModonLandForm.ContactDetails');

  }
  onEdit(event, table_name) {
    console.log(event);
    let modonaldnformModalsFormParams = {};

    if (event.data.Id>0&&table_name === 'equipment') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddEquipmentDetails'),

        inputs: [
          
          {
            id: "ProductionLinesNumber",
            name: this.translate.instant('ModonLandForm.ProductionLinesNumber'),
            type: "text",
            value: event.data.ProductionLinesNumber,
            required: "true",
          },
          {
            id: "Name",
            name: this.translate.instant('ModonLandForm.Name'),
            type: "text",
            value: event.data.Name,
            required: "true",
          },
          
          {
            id: "Source",
            name: this.translate.instant('ModonLandForm.Source'),
            type: "select",
            selected: event.data.Source,
            value:this.LExportingCountries,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var equipment_source_data_array = [];
              var equipment_source_data = {
                
                ProductionLinesNumber: modal_data.inputs[0].value,
                 Name: modal_data.inputs[1].value,
                  Source: modal_data.inputs[2].selected,
              };


              equipment_source_data_array.push(equipment_source_data);
 
                this.equipment_details_source.update(event.data, equipment_source_data);
              this.equipment_details_source.refresh();

              
              var post_data = {
                "Id":event.data.Id,
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Source": modal_data.inputs[2].selected, 
                "Name": modal_data.inputs[1].value,
                "ProductionLinesNumber":  modal_data.inputs[0].value
              };

              this.form5Service.SubmitModon_Equipment(post_data)
                .then((res) => (this.onDataPost(res, equipment_source_data, modal_data, "edit", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
    
    if (event.data.Id>0&&table_name === 'rawmaterials') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddRawMaterials'),

        inputs: [
          
          {
            id: "Type",
            name: this.translate.instant('ModonLandForm.Type'),
            type: "text",
            value: event.data.Type,
            required: "true",
          },
          {
            id: "Quantity",
            name: this.translate.instant('ModonLandForm.Quantity'),
            type: "text",
            value: event.data.Quantity,
            required: "true",
          },
          {
            id: "Unit",
            name: this.translate.instant('ModonLandForm.Unit'),
            type: "select",
            selected: event.data.Unit,
            value:this.LMeasuringUnit,
            required: "true",
          },
          {
            id: "Source",
            name: this.translate.instant('ModonLandForm.Source'),
            type: "select",
            selected: event.data.Source,
            value:this.LExportingCountries,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var rawmaterials_source_data_array = [];
              var rawmaterials_source_data = {
                
                Type: modal_data.inputs[0].value,
                 Quantity: modal_data.inputs[1].value,
                 Unit: modal_data.inputs[2].selected,
                  Source: modal_data.inputs[3].selected,
              };


              rawmaterials_source_data_array.push(rawmaterials_source_data);
 
                this.rawmaterial_details_source.update(event.data, rawmaterials_source_data);
              this.rawmaterial_details_source.refresh();

              
              var post_data = {
                "Id":event.data.Id,
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Source": modal_data.inputs[3].selected, 
                "Type": modal_data.inputs[0].value,
                "Quantity":  modal_data.inputs[1].value,
                "Unit":  modal_data.inputs[2].selected
              };

              this.form5Service.SubmitModon_RawMaterialsDetails(post_data)
                .then((res) => (this.onDataPost(res, rawmaterials_source_data, modal_data, "edit", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
    if (event.data.Id>0&&table_name === 'contactdetails') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddContactDetails'),

        inputs: [
          
          {
            id: "Name",
            name: this.translate.instant('ModonLandForm.Name'),
            type: "text",
            value: event.data.Type,
            required: "false",
          },
          {
            id: "Email",
            name: this.translate.instant('ModonLandForm.Email'),
            type: "text",
            value: event.data.Email,
            required: "false",
          },
          {
            id: "Mobile",
            name: this.translate.instant('ModonLandForm.Mobile'),
            type: "text",
            value: event.data.Mobile,
            required: "false",
          },
          {
            id: "JobRole",
            name: this.translate.instant('ModonLandForm.JobRole'),
            type: "text",
            value: event.data.JobRole,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var contactdetails_source_data_array = [];
              var contactdetails_source_data = {
                
                Name: modal_data.inputs[0].value,
                 Email: modal_data.inputs[1].value,
                 Mobile: modal_data.inputs[2].value,
                 JobRole: modal_data.inputs[3].value,
              };


              contactdetails_source_data_array.push(contactdetails_source_data);
 
                this.rawmaterial_details_source.update(event.data, contactdetails_source_data);
              this.rawmaterial_details_source.refresh();

              
              var post_data = {
                "Id":event.data.Id,
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Name": modal_data.inputs[0].value, 
                "Email": modal_data.inputs[1].value,
                "Mobile":  modal_data.inputs[2].value,
                "JobRole":  modal_data.inputs[3].value
              };

              this.form5Service.SubmitModon_Contact_Details(post_data)
                .then((res) => (this.onDataPost(res, contactdetails_source_data, modal_data, "edit", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }

    if (event.data.Id>0&&table_name === 'importing') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddImportingDetails'),

        inputs: [
          
          {
            id: "YearlyGoodVolume",
            name: this.translate.instant('ModonLandForm.YearlyGoodVolume'),
            type: "text",
            value: event.data.YearlyGoodVolume,
            required: "true",
          },
          
          
          {
            id: "Source",
            name: this.translate.instant('ModonLandForm.Source'),
            type: "select",
            selected: event.data.Source,
            value:this.LExportingCountries,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var importing_source_data_array = [];
              var importing_source_data = { 
                YearlyGoodVolume: modal_data.inputs[0].value, 
                  Source: modal_data.inputs[1].selected,
              };


              importing_source_data_array.push(importing_source_data);
 
                this.importing_details_source.update(event.data, importing_source_data);
              this.importing_details_source.refresh();

              
              var post_data = {
                "Id":event.data.Id,
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0", 
                "YearlyGoodVolume": modal_data.inputs[0].value, 
                 "Source": modal_data.inputs[1].selected
              };

              this.form5Service.SubmitModon_ImportingDetails(post_data)
                .then((res) => (this.onDataPost(res, importing_source_data, modal_data, "edit", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
  
    if (event.data.Id>0&&table_name === 'productsdetails') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddProductsDetails'),

        inputs: [
          
          {
            id: "FinalProduct",
            name: this.translate.instant('ModonLandForm.FinalProduct'),
            type: "text",
            value: event.data.FinalProduct,
            required: "true",
          },
          {
            id: "ProductionVolume",
            name: this.translate.instant('ModonLandForm.ProductionVolume'),
            type: "text",
            value: event.data.ProductionVolume,
            required: "true",
          },
          
          {
            id: "Symbol",
            name: this.translate.instant('ModonLandForm.Symbol'),
            type: "text",
            value: event.data.Symbol,
            required: "true",
          }
          ,
          
          {
            id: "Unit",
            name: this.translate.instant('ModonLandForm.Unit'),
            type: "select",
            value:this.LMeasuringUnit,
            selected: event.data.Unit,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var productdetails_source_data_array = [];
              var productdetails_source_data = {
                
                FinalProduct: modal_data.inputs[0].value,
                ProductionVolume: modal_data.inputs[1].value,
                Symbol: modal_data.inputs[2].value,
                Unit: modal_data.inputs[3].selected
              };


              productdetails_source_data_array.push(productdetails_source_data);
 
                this.product_details_source.update(event.data, productdetails_source_data);
              this.product_details_source.refresh();

              
              var post_data = {
                "Id":event.data.Id,
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "FinalProduct": modal_data.inputs[0].value, 
                "ProductionVolume": modal_data.inputs[1].value,
                "Symbol":  modal_data.inputs[2].value,
                "Unit":  modal_data.inputs[3].selected
              };

              this.form5Service.SubmitModon_Productdetails(post_data)
                .then((res) => (this.onDataPost(res, productdetails_source_data, modal_data, "edit", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }

  } 
  onAdd(table_name) {

    let modonaldnformModalsFormParams = {};

    if (table_name === 'equipment') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddEquipmentDetails'),

        inputs: [
          
          {
            id: "ProductionLinesNumber",
            name: this.translate.instant('ModonLandForm.ProductionLinesNumber'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Name",
            name: this.translate.instant('ModonLandForm.Name'),
            type: "text",
            value: "",
            required: "true",
          },
          
          {
            id: "Source",
            name: this.translate.instant('ModonLandForm.Source'),
            type: "select",
            value: this.LExportingCountries,
            selected:"",
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var equipment_source_data_array = [];
              var equipment_source_data = {
                ProductionLinesNumber: modal_data.inputs[0].value,
                 Name: modal_data.inputs[1].value,
                  Source: modal_data.inputs[2].selected,
              };
              equipment_source_data_array.push(equipment_source_data);

              if (this.equipment_details_source_length == 0)
                this.equipment_details_source.load(equipment_source_data_array);

              else
                this.equipment_details_source.add(equipment_source_data);

              this.equipment_details_source_length++;

              this.equipment_details_source.refresh();

              
              var post_data = {
                "Id":"0",
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Source": modal_data.inputs[2].selected, 
                "Name": modal_data.inputs[1].value,
                "ProductionLinesNumber":  modal_data.inputs[0].value
              };

              this.form5Service.SubmitModon_Equipment(post_data)
                .then((res) => (this.onDataPost(res, equipment_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
  
    if (table_name === 'importing') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddImportingDetails'),

        inputs: [
          
          {
            id: "YearlyGoodVolume",
            name: this.translate.instant('ModonLandForm.YearlyGoodVolume'),
            type: "text",
            value: "",
            required: "true",
          },
          
          
          {
            id: "Source",
            name: this.translate.instant('ModonLandForm.Source'),
            type: "select",
            value: this.LExportingCountries,
            selected:"",
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var importing_source_data_array = [];
              var importing_source_data = {
                YearlyGoodVolume: modal_data.inputs[0].value, 
                  Source: modal_data.inputs[1].selected,
              };
              importing_source_data_array.push(importing_source_data);

              if (this.importing_details_source_length == 0)
                this.importing_details_source.load(importing_source_data_array);

              else
                this.importing_details_source.add(importing_source_data);

              this.importing_details_source_length++;

              this.importing_details_source.refresh();

              
              var post_data = {
                "Id":"0",
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Source": modal_data.inputs[1].selected,  
                "YearlyGoodVolume":  modal_data.inputs[0].value
              };

              this.form5Service.SubmitModon_ImportingDetails(post_data)
                .then((res) => (this.onDataPost(res, importing_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
    
    if (table_name === 'rawmaterials') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddRawMaterials'),

        inputs: [
          
          {
            id: "Type",
            name: this.translate.instant('ModonLandForm.Type'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Quantity",
            name: this.translate.instant('ModonLandForm.Quantity'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Unit",
            name: this.translate.instant('ModonLandForm.Unit'),
            type: "select",
            selected: "",
            value: this.LMeasuringUnit,
            required: "true",
          },
          {
            id: "Source",
            name: this.translate.instant('ModonLandForm.Source'),
            type: "select",
            selected: "",
            value: this.LExportingCountries,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var rawmaterials_source_data_array = [];
              var rawmaterials_source_data = {
                
                Type: modal_data.inputs[0].value,
                 Quantity: modal_data.inputs[1].value,
                 Unit: modal_data.inputs[2].selected,
                  Source: modal_data.inputs[3].selected,
              };

              rawmaterials_source_data_array.push(rawmaterials_source_data);

              if (this.rawmaterial_details_source_length == 0)
                this.rawmaterial_details_source.load(rawmaterials_source_data_array);

              else
                this.rawmaterial_details_source.add(rawmaterials_source_data);

              this.rawmaterial_details_source_length++;

              this.rawmaterial_details_source.refresh();

              var post_data = {
                "Id":"0",
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Source": modal_data.inputs[3].selected, 
                "Type": modal_data.inputs[0].value,
                "Quantity":  modal_data.inputs[1].value,
                "Unit":  modal_data.inputs[2].selected
              };

              this.form5Service.SubmitModon_RawMaterialsDetails(post_data)
                .then((res) => (this.onDataPost(res, rawmaterials_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
    if (table_name === 'contactdetails') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddContactDetails'),

        inputs: [
          
          {
            id: "Name",
            name: this.translate.instant('ModonLandForm.Name'),
            type: "text",
            value:"",
            required: "false",
          },
          {
            id: "Email",
            name: this.translate.instant('ModonLandForm.Email'),
            type: "text",
            value: "",
            required: "false",
          },
          {
            id: "Mobile",
            name: this.translate.instant('ModonLandForm.Mobile'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "JobRole",
            name: this.translate.instant('ModonLandForm.JobRole'),
            type: "text",
            value: "",
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var contactdetails_source_data_array = [];
              var contactdetails_source_data = {
                
                Name: modal_data.inputs[0].value,
                 Email: modal_data.inputs[1].value,
                 Mobile: modal_data.inputs[2].value,
                 JobRole: modal_data.inputs[3].value,
              };



              contactdetails_source_data_array.push(contactdetails_source_data);

              if (this.contact_details_source_length == 0)
                this.contact_details_source.load(contactdetails_source_data_array);

              else
                this.contact_details_source.add(contactdetails_source_data);

              this.contact_details_source_length++;

              this.contact_details_source.refresh();

              var post_data = {
                "Id":"0",
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "Name": modal_data.inputs[0].value, 
                "Email": modal_data.inputs[1].value,
                "Mobile":  modal_data.inputs[2].value,
                "JobRole":  modal_data.inputs[3].value
              };

              this.form5Service.SubmitModon_Contact_Details(post_data)
                .then((res) => (this.onDataPost(res, contactdetails_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }

 
    if (table_name === 'productsdetails') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddProductsDetails'),

        inputs: [
          
          {
            id: "FinalProduct",
            name: this.translate.instant('ModonLandForm.FinalProduct'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "ProductionVolume",
            name: this.translate.instant('ModonLandForm.ProductionVolume'),
            type: "text",
            value: "",
            required: "true",
          },
          
          {
            id: "Symbol",
            name: this.translate.instant('ModonLandForm.Symbol'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Unit",
            name: this.translate.instant('ModonLandForm.Unit'),
            type: "select",
            value: this.LMeasuringUnit,
            selected:"",
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
              var productdetails_source_data_array = [];
              var productdetails_source_data = {
                
                FinalProduct: modal_data.inputs[0].value,
                ProductionVolume: modal_data.inputs[1].value,
                Symbol: modal_data.inputs[2].value,
                Unit: modal_data.inputs[3].selected
              };

              productdetails_source_data_array.push(productdetails_source_data);

              if (this.product_details_source_length == 0)
                this.product_details_source.load(productdetails_source_data_array);

              else
                this.product_details_source.add(productdetails_source_data);

              this.product_details_source_length++;

              this.product_details_source.refresh();
              var post_data = {
                "Id":"0",
                "LoanRequestNo": this.requestId.toString(),
                "SysUserServiceId": "0",
                "FinalProduct": modal_data.inputs[0].value, 
                "ProductionVolume": modal_data.inputs[1].value,
                "Symbol":  modal_data.inputs[2].value,
                "Unit":  modal_data.inputs[3].selected
              };

              this.form5Service.SubmitModon_Productdetails(post_data)
                .then((res) => (this.onDataPost(res, productdetails_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
    
    if (table_name === 'documents') {

      modonaldnformModalsFormParams = {

        header: this.translate.instant('ModonLandForm.AddDocuments'),

        inputs: [
          
          {
            id: "documentTemplate",
            name: this.translate.instant('ModonLandForm.DocumentTemplate'),
            type: "selectattachment",
            value: this.LProduct_Attachments,
            selected:"",
            required: "true",
          },
          {
            id: "fileBase64Data",
            name: this.translate.instant('ModonLandForm.File'),
            type: "file_single",
            value: "",
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {
              console.log('modal_data');
              console.log(modal_data)
            
              var reader = new FileReader();
              let file=modal_data.inputs[1].file[0];
              reader.readAsDataURL(file);
              reader.onload =  () =>{
                let inputFile = reader.result.toString(); 
                                
                let last_dot = file.name.lastIndexOf('.');
                let ext = file.name.slice(last_dot + 1);
                let name = file.name.slice(0, last_dot);
                var post_data = {
                  "Id":"0",
                  "LoanRequestNo": this.requestId.toString(),
                  "SysUserServiceId": "0",
                  "documentTemplate": modal_data.inputs[0].selected,  
                  "fileBase64Data":inputFile.split(',')[1],
                  "fileExtension":ext.toString(),
                  "fileName":file.name.toString()
                };

                var documents_source_data_array = [];
                var documents_source_data = {
                  documentTemplate: modal_data.inputs[0].selected,
                  fileName: file.name.toString()
                };
  
                documents_source_data_array.push(documents_source_data);
  
                if (this.document_details_source_length == 0)
                  this.document_details_source.load(documents_source_data_array);
  
                else
                  this.document_details_source.add(documents_source_data);
  
                this.document_details_source_length++;

                this.document_details_source.refresh();

                this.form5Service.SaveModon_Documents(post_data)
                  .then((res) => (this.onDataPost(res, documents_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());
  
              };
              reader.onerror = function (error) {
                console.log('Error: ', error);
              };
           
            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ModalLandForm1ModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.modonaldnformModalsForm = modonaldnformModalsFormParams;

    }
  }
    onDataPost(res, real_estate_source_data, modal_data, method, event, projectOwnershipModal) {
      if(res.message=="S")
      this.commonService.showSuccessToast(this.translate.instant('ModonLandForm.AdditionSuccessful'));
      else
      this.commonService.showFailureToast(this.translate.instant('ModonLandForm.SaveingFailed'));
    }
  onClickLoanApplicationTab(tab_number) {

    if (this.startedFilling == 0) {

      switch (tab_number) {

        case 0:
          this.router.navigateByUrl("/pages/new-request/loan-application/project-information");
          break;

        case 1:
          this.router.navigateByUrl("/pages/new-request/loan-application/marketing-information");
          break;

        case 2:
          this.router.navigateByUrl("/pages/new-request/loan-application/technical-information");
          break;

        case 3:
          this.router.navigateByUrl("/pages/new-request/loan-application/financial-information");
          break;

        case 4:
          this.router.navigateByUrl("/pages/new-request/loan-application/checklist");
          break;

        case 5:
          this.router.navigateByUrl('/pages/new-request/loan-application/land-form1');
          break;

        case 6:
          this.router.navigateByUrl('/pages/new-request/loan-application/land-form2');
          break;

      }

    }

    else {

      this.commonService.showFailureToast("Complete filling the MODON Information !"); // identity theft

    }

  }
  setPanelStep(index: number, logIndex: number) {
    this.panelStep = index;
 
  }

  expandAllPanels(mode) {

    this.panelStep = -1;

    if (mode == 0) {
      this.allPanelsExpanded = true;
      
    }

    else if (mode == 1) {
      this.allPanelsExpanded = false;
      
    }

  }
  prevPanelStep(logPanelNum) {

    this.panelStep--;
 

  }
  nextPanelStep(panel_number, logPanelNum) { 
   
    this.panelStep++;
    }
  resolveDocuments(requests) {

    this.documents = this.commonService.returnViewDocumentJson(requests);

    var kpmr_temp_source = [], guarantors_temp_source = [];

    this.kpmr_source.getAll().then((res) => {

      kpmr_temp_source = res;

      this.source_of_finance_source.getAll().then((res) => {

        guarantors_temp_source = res;

        for (var i = 0; i < this.documents["documentList"].length; i++) {

          this.documents["documentList"][i]["docUrl"] =
            this.documents["url"]
              .replace("entityId", this.documents["documentList"][i].EntityId)
              .replace("refId", this.documents["documentList"][i].RefId)
              .replace("documentId", this.documents["documentList"][i].DocumentId)
              .replace("fileName", this.documents["documentList"][i].FileName);

        

        }

      });

    });

   // this.communicationsService.getDocumentService(this.inputs.PrqId, "p")
     // .then(requests => (this.resolvePRQDocuments(requests)), err => this.resolveError());

  }



}