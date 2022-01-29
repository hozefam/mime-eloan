import { CommonService } from './../../../../services/common.service';
import { Component, OnInit, Injectable } from '@angular/core';
import { PreliminaryRequestService } from "../../../../services/preliminary-request.service";
import { LocalDataSource } from 'ng2-smart-table';
import { NgbDateStruct, NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreliminaryRequestModalsComponent } from "../preliminary-request-modals/preliminary-request-modals.component";
import { ProjectOwnershipModalsComponent } from '../../loan-application/project-information/project-ownership-modals/project-ownership-modals.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from '../../../../services/communications.service'
import { LocalStorage } from '@ngx-pwa/local-storage';
import { _ } from 'underscore';
import {LlPreliminaryRequestService} from '../../../../services/ll-preliminary-request.service';
import { of as observableOf,  Observable } from 'rxjs';
import { Options } from 'selenium-webdriver/opera';
import { HttpHeaders } from "@angular/common/http";
import { ChangeDetectorRef } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ErrorsHandler } from '../../../../services/errors-handler.service';
import { CommonCommentsService } from '../../../../services/common-comments.service';
import { months } from 'moment';
import { createFalse } from 'typescript';
const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

const MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', // From Sultan
 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
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
  selector: 'create-prq',
  templateUrl: './create-prq.component.html',
  styleUrls: ['./create-prq.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class CreatePrqComponent implements OnInit {

  

   MONTHS_EN = ['Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 'Jumada al-awwal',
  'Jumada al-thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];

   MONTHS_AR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', // From Sultan
  'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
   WEEKDAYS_AR = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];//From reference PSW
   WEEKDAYS_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  PreliminaryRequestStatus: any = 0;

  prqRequestType: any;
  from_my_loans = false;
 
 isSagiaOrCr = false;

  isMEIM = false; 
  isHousingLogin = false;
  isLogisticsType = false;
  isLLFL=false;
  ProfileTypeID:any;
 typeHasBeenSelected = false;

 startedFilling = 0;
  tour_en: any;

  tour_ar: any;
  commentsFrom = "";
  commentArray = {};
  commentArrayExists = false;

  sector_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRSEC", SubSectionCode: "PRSEC", commentDetails: {}, commentArray: [] };
  license_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRLIC", SubSectionCode: "PRLIC", commentDetails: {}, commentArray: [] };
  company_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRCMD", SubSectionCode: "PRCMD", commentDetails: {}, commentArray: [] };
  product_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRPRO", SubSectionCode: "PRPRO", commentDetails: {}, commentArray: [] };
  ownership_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PROWN", SubSectionCode: "PROWN", commentDetails: {}, commentArray: [] };
  authorized_person_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRPER", SubSectionCode: "PRPER", commentDetails: {}, commentArray: [] };
  bank_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRBAN", SubSectionCode: "PRBAN", commentDetails: {}, commentArray: [] };
  real_estates_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRREL", SubSectionCode: "PRREL", commentDetails: {}, commentArray: [] };
  list_of_companies_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRCOM", SubSectionCode: "PRCOM", commentDetails: {}, commentArray: [] };
  other_investments_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRINV", SubSectionCode: "PRINV", commentDetails: {}, commentArray: [] };
  documents_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRDOC", SubSectionCode: "PRDOC", commentDetails: {}, commentArray: [] };

  allPanelsExpanded = false;

  panelStep = 1;

  property_type_list = [];

  property_type_desc_list = [];

  investment_type_list = [];

  investment_type_desc_list = [];

  legal_entity_list = [];

  legal_entity_en_desc_list = [];

  legal_entity_ar_desc_list = [];
  isPurposeOthers = false;
 
  industrial_license_id_vs = false;
  industrial_license_date_vs = false;
  customer_license_number_vs = false;
  customer_license_date_vs = false;
  meim_industrial_license_id_vs = false;
  meim_industrial_license_date_vs = false;
  cr_number_vs = false;
  cr_expiry_date_vs = false;
  issue_date_vs = false;
  profile_type_vs = false;
  other_purpose_vs = false;

  industrial_sector_vs = false;
  //category_vs = false;
  region_vs = false;
  type_vs = false;
  factory_name_vs = false;
  modonCity_vs=false;
  factory_name_ar_vs = false;
  request_amount_vs = false;
  cr_name_arabic_vs = false;
  cr_name_vs = false;
  cr_number_2_vs = false;
  cr_issue_place_vs = false;
  cr_issue_date_vs = false;
  cr_expiry_date_1_vs = false;
  cr_phone_vs = false;
  cr_address_vs = false;
  cr_zip_code_vs = false;
  cr_unit_no_vs = false;
  cr_building_no_vs = false;
  cr_additional_no_vs = false;
  legal_entity_vs = false;
  relationship_manager_vs = false;
  city_vs = false;
  // temp
  eca_license_vs = true;
  customerProfiles: any = [];
  source: any = [];
  screen_number = 1;
prevRequestId:any=0;
  documents = {};

  add_edit_delete_show = true;

  comments_show = false;

  ownersTableDocuments = { url: "", documentList: [] };

  documentsTableDocuments = { url: "", documentList: [] };

  realEstateTableDocuments = { url: "", documentList: [] };

  listOfCompaniesTableDocuments = { url: "", documentList: [] };

  otherInvestmentsTableDocuments = { url: "", documentList: [] };
   
  
  type_of_documents_list = [
    {
      "id": "367",
      "desc": "Article of Association",
      "descAr": "عقد التأسيس"
    },
    {
      "id": "368",
      "desc": "Industrial License",
      "descAr": "رخصة الصناعة"
    },
    {
      "id": "380",
      "desc": "ID Proof",
      "descAr": "اثبات هوية"
    },
    {
      "id": "121",
      "desc": "Others",
      "descAr": "اخرى"
    },
    //peter added
    {
      "id": "401",
      "desc": "No Objection Letter",
      "descAr": "خطاب عدم مماتعة"
    }
    //peter added
  ];

  type_of_documents_desc_list = [];

  dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

  preliminaryId = "";

  isProjectExist = "";

  isic_division_list = [];

  isic_division_name_list = [];

  isic_activity_list = [];

  isic_activity_name_list = [];

  unit_list = [];

  unit_code_list = [];

  country_list = [];

  country_name_list = [];

  city_list = [];

  city_name_list = [];
  city_saudi_name_list = [];
  industrial_sector_name_list = [];
  city_name_list2=[];
  share_holder_type_list = [
    {
      "id": "1",
      "type": "Individual",
      "typeAr":"فرد"
    },
    {
      "id": "2",
      "type": "Company",
      "typeAr":"شركة"
    }
  ];


  share_holder_type_code_list = [];

  investor_type_list = [
    {
      "id": "N",
      "type": "Saudi National",
      "typeAr":"سعودي"
    },
    {
      "id": "F",
      "type": "Foreigner",
      "typeAr":"أجنبي"
    },
    {
      "id": "R",
      "type": "Resident",
      "typeAr":"مقيم"
    }
  ];
  company_type_list = [
    {
      "id": "N",
      "type": "CR Number",
      "typeAr":"رقم السجل التجاري"
    },
    {
      "id": "S",
      "type": "SAGIA License",
      "typeAr":"ترخيص الهيئة"
    }
  ];
     
  
  
  investor_type_code_list = [];
  company_type_code_list = [];
  
  id_type_list = [
    {
      "id": "N",
      "type": "National ID",
      "typeAr":"رقم هوية"
    },
    {
      "id": "I",
      "type": "Iqama",
      "typeAr":"إقامة"
    },
    {
      "id": "S",
      "type": "Sagia License",
      "typeAr":"رخصة ساجيا"
    },
    {
      "id": "G",
      "type": "GCC ID",
      "typeAr":"رقم جي سي سي"
    }
  ];
  
  id_type_code_list = [];

  CommercialRegistrationdetails_final = [];
   initialLicense: any = "";
  finalLicense: any = "";
  meimInitialLicense: any = "";
  sagiaLicense: any = "";
  crNumberLicense: any = "";

  modonCities; 
  crCities;
  projectId="";
  inputs = {
    ModonCity :"", 
    ProjectCode: "",
    ProjectId: "",
    TypeOfLicense: this.isHousingLogin ? (this.initialLicense + "," +
      this.finalLicense + "," + this.meimInitialLicense +
      "," + this.crNumberLicense).split(",") : (this.initialLicense +
        "," + this.finalLicense + "," +
        this.meimInitialLicense).split(","),
    TypeOfLicenseOriginal: this.isHousingLogin ? (this.initialLicense + "," +
      this.finalLicense + "," + this.meimInitialLicense + "," +
      this.crNumberLicense).split(",") : (this.initialLicense + "," +
        this.finalLicense + "," + this.meimInitialLicense).split(","),
    TypeOfLicenseChecked: this.initialLicense,
    CustomerLicenseNumber: "",
    CustomerLicenseDate: { year: 0, month: 0, day: 0 },
    IndustrialLicenseId: "",
    IndustrialLicenseDate: "",//{ year: 0, month: 0, day: 0 },
    MEIMIndustrialLicenseId: "",
    MEIMIndustrialLicenseDate: "",
    CrNumber: "",
    CrExpiryDate: { year: 0, month: 0, day: 0 },
    IssueDate: { year: 0, month: 0, day: 0 },
    commercialRegistrationDetails:[{
      RegNumber: "" ,
      RegStartDate: "",
      RegEndDate: "",
      RegActivity:"",
      RegCompanyName: ""
    }],
    licenseDetails: [{
      preliminaryId: this.preliminaryId,
      licenseType: "",
      licenseId: "",
      crCity:"",
      licStartDate: { year: 0, month: 0, day: 0 },
      licEndDate: { year: 0, month: 0, day: 0 },
      licStartDateGreg: "",
      licEndDateGreg: "",
      crNumber: "",
      crIssueDate: { year: 0, month: 0, day: 0 },
      crExpiryDate: { year: 0, month: 0, day: 0 },
      crLocationAr: "",
      proCapital: "",
      factoryName: "",
      addressDesc: "",
      landNo: "",
      city: "",
      mngmntArea: "",
      poBox: "",
      storesArea: "",
      totalArea: "",
      longX: "",
      latitudeY: "",
      zipCode: "",
      crName: "",
      crCapital: "",
      crLeagalTypeEn: "",
      crLeagalTypeAr: "",
      crPhone: "",
      crFaxNo: "",
      crAddress: "",
      crBuildingNo: "",
      crAdditionalNo: "",
      crUnitNo: "",
      crZipCode: "",
      crNameAr: "",
      factoryNameAr: "",
      reqAmount: "",
      crDistrictArea: "",
      crLegalInd: ""
    }],
    // RmList: [],
    // RmListSelected: "",
    RmEmail: "",
    productDetails: [],
    ownersDetails: [],
    IndustrialSector: [],
    IndustrialSectorSelected: [{
      "preliminaryId": this.preliminaryId,
      "sectorId": "",
      "sectorMcatId": "",
      "name": "",
      "isActive": ""
    }],
    //Category: [],
    //CategorySelected: "",
    Region: [],
    RegionSelected: "",
    Type: [],
    TypeSelected: "",
    ProfileTypeList: [],
    ProfileType: "",
    ProfileTypeSelected: "",
    UpdStatus: "",
    OtherPurpose: "",
    //ECA License
    eca_license: ""

  }
  sysUserServiceId: 0

  industrial_sector_pop_up_array: any = [];
  harmonized_code_pop_up_array: any = [];

  searchText: string = "";

  proposed_products_source: LocalDataSource;
  proposed_ownerships_source: LocalDataSource;
  representatives_source: LocalDataSource;
  bank_details_source: LocalDataSource;

  real_estate_source: LocalDataSource;
  list_companies_source: LocalDataSource;
  other_investments_source: LocalDataSource;

  deleted_proposed_products: any = [];
  // deleted_proposed_ownerships: any = [];
  deleted_representatives: any = [];
  // deleted_bank_details: any = [];

  proposed_products_source_length = 0;
  proposed_ownerships_source_length = 0;
  representatives_source_length = 0;
  bank_details_source_length = 0;

  real_estate_source_length = 0;
  list_companies_source_length = 0;
  other_investments_source_length = 0;

  non_saudi_owners_list: any = [];

  deleteCancelModalReference: any;
  industrialSectorPopUpReference: any;
  requestId: String;
  rejectedId:String;
  requestStatus: String;

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  translate: any;
  services;
  proposed_products_settings_en: any;
  settings: any;
  rejected:any=-1;
  proposed_ownerships_settings_en: any;
  representatives_settings_en: any;
  bank_details_settings_en: any;
  settings_real_est_en: any;
  settings_companies_en: any;
  settings_other_inv_en: any;
  currentLang:any;
  rule:any;
  islogistic:boolean=false;
  profileItems:any[]= [
    {id:'24' ,prqTypeEn:'Land and Loan MODON' ,prqTypeAr:'أرض وقرض مدن'} ,
    {id:'25',prqTypeEn:'Factory and Loan MODON' ,prqTypeAr:'مصنع وقرض مدن'},
    {id :'38',prqTypeEn:'Land and loan of the Special Economic and Cities and Zones Authority' ,prqTypeAr:'أرض وقرض هيئة المدن و المناطق الإقتصادية الخاصة' },
    {id:'35' ,prqTypeEn:'Land and loan Jubail requests',prqTypeAr:'أرض وقرض الجبيل'},
    {id:'36' ,prqTypeEn:'Land and loan Yanbu requests',prqTypeAr:'أرض وقرض ينبع'}
    ];
  LogprofileItems:any[]=[
    {id:'51' ,prqTypeEn:'Logistics Landloan modon',prqTypeAr:'أرض وقرض خدمات لوجيستيه مدن'},
    {id:'52' ,prqTypeEn:'Logistics Landloan Jubail',prqTypeAr:'أرض وقرض خدمات لوجيستيه الجبيل'},
    {id:'53' ,prqTypeEn:'Logistics Landloan Yanbu',prqTypeAr:'أرض وقرض خدمات لوجيستيه ينبع'},
    {id:'54' ,prqTypeEn:'Logistics Landloan ECZA/KAEC',prqTypeAr:'أرض وقرض خدمات لوجيستيه هيئة المدن والمناطق الأقتصادية'}

  ]
  constructor(private cdref: ChangeDetectorRef,private errorsHandler: ErrorsHandler, protected localStorage: LocalStorage, private communicationsService: CommunicationsService, private route: ActivatedRoute, private calendar: NgbCalendar, private preliminaryRequestService: PreliminaryRequestService, private modalService: NgbModal,
    private router: Router, private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService, public commonService: CommonService , private llPreliminaryRequest:LlPreliminaryRequestService,private translateService: TranslateService, private commonCommentsService: CommonCommentsService) {

    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 100, month: 12, day: 31 };

    this.translate = this.commonService.returnTranslate();

    this.tour_en = this.commonService.returnEnglishTour();
    this.tour_ar = this.commonService.returnArabicTour();
    this.services = this.llPreliminaryRequest.Services ; 
     this.initTableSettings();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initTableSettings();
      
   
    });
    this.currentLang=this.translateService.currentLang;
    /*if (this.translateService.currentLang === 'ar') {
      this.MONTHS = this.MONTHS_AR;
      this.WEEKDAYS = this.WEEKDAYS_AR;
   }
   else {
      MONTHS = this.MONTHS_EN;
      WEEKDAYS = this.WEEKDAYS_EN;
   }*/

  }
  
  ngAfterContentChecked() {

    this.cdref.detectChanges();

  }
  ValidateFactoryLanguageAR(e){
    
    let value = e.target.value;
    var arabicregex = /[\u0600-\u06FF]/;
    let result = arabicregex.test(value);
    if(!arabicregex.test(value))
    return this.inputs.licenseDetails[0].factoryNameAr = '';
  }  
  ValidateFactoryLanguageEN(e){
    /*
    let value = e.target.value;
    var englishregex = /[^A-Za-z]/ig;
    let result = englishregex.test(value);
    if(englishregex.test(value))
    return this.inputs.licenseDetails[0].factoryName = '';*/

  }

  ValidateLanguageAR(e){
    
    let value = e.target.value;
    var arabicregex = /[\u0600-\u06FF]/;
    let result = arabicregex.test(value);
    if(!arabicregex.test(value))
    return this.inputs.licenseDetails[0].crNameAr = '';
  }
  ValidateLanguageEN(e){
    /*
    let value = e.target.value;
    var englishregex = /[^A-Za-z]/ig;
    let result = englishregex.test(value);
    if(englishregex.test(value))
    return this.inputs.licenseDetails[0].crName = '';*/

  }
  initTableSettings() {


    this.settings = {

      hideSubHeader: true,
  
      noDataMessage: this.translate.instant('COMMON.noPreliminary'),
  
      mode: "external",
  
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },
  
      actions: {
        columnTitle: this.translate.instant('COMMON.Actions'),
        position: "right",
        add: false,
        edit: false,
        delete: false
         
      },
      columns: {
         
        RequestId: {
          title: this.translate.instant('COMMON.RequestId'),
          type: "number",
          width: "12%",
          editable: false
        },
        ProjectCode: {
          title: this.translate.instant('COMMON.ProjectCode'),
          type: "string",
          editable: false
        },
        RequestStatus: {
           title: this.translate.instant('TECHNICAL_INFORMATION.requeststatus'),
           type: "string",
           editable: false
         },
      
         
        RequestDate: {
          title: this.translate.instant('TECHNICAL_INFORMATION.requestdate'),
          type: "date",
          editable: false
        }
      }
    };
  this.proposed_products_settings_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoProductDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
    },

    columns: {
      proInd: {
       title: this.translate.instant('PRELIMINARY_REQUEST.ProposedProduct'),
        type: "text"
      },
      productName: {
        title: this.translate.instant('PRELIMINARY_REQUEST.ProductName'),
        type: "text"
      },
      licCapacity: {
        title: this.translate.instant('PRELIMINARY_REQUEST.LicenseCapacity'),
        type: "text"
      },
      proCapacity: {
        title: this.translate.instant('PRELIMINARY_REQUEST.ProposedCapacity'),
        type: "text"
      }
    },
    rowClassFunction: (row) => {
      if (row.data.mciInd === "X")
        return 'highlight';
    }
  };

  this.proposed_ownerships_settings_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoOwnershipDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
      // custom: [{
      //   name: 'ownerBankDealing',
      //   title: '<i class="nb-compose"></i>'
      // }]
    },

    columns: {
      proInd: {
        title: this.translate.instant('PRELIMINARY_REQUEST.ProposedOwner'),
        type: "text"
      },
      name: {
        title: this.translate.instant('PRELIMINARY_REQUEST.Name'),
        type: "text"
      },
      percentage: {
        title: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
        type: "text"
      },
      proPercentage: {
        title: this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentage'),
        type: "text"
      }
    },
    rowClassFunction: (row) => {
      if (row.data.mciInd === "X")
        return 'highlight';
    }
  };

  this.representatives_settings_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoAuthorizedPersonDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
    },

    columns: {
      mciInd: {
        title: this.translate.instant('PRELIMINARY_REQUEST.Representative'),
        type: "text"
      },
      idType: {
        title: this.translate.instant('PRELIMINARY_REQUEST.IDType'),
        type: "text"
      },
      address: {
        title: this.translate.instant('PRELIMINARY_REQUEST.Name'),
        type: "text"
      },
      attachmentInd: {
        title: this.translate.instant('PRELIMINARY_REQUEST.DocumentAttached'),
        type: "text"
      }
    },
    rowClassFunction: (row) => {
      if (row.data.mciInd === "Yes")
        return 'highlight';
    }
  };

  this.bank_details_settings_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoBankDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
    },

    columns: {
      accHolder: {
        title: this.translate.instant('PRELIMINARY_REQUEST.AccountHolderName'),
        type: "text"
      },
      bnkAccNumber: {
        title: this.translate.instant('PRELIMINARY_REQUEST.BankAccountNumber'),
        type: "text"
      },
      bankName: {
        title: this.translate.instant('PRELIMINARY_REQUEST.BankName'),
        type: "text"
      },
      repName: {
        title: this.translate.instant('PRELIMINARY_REQUEST.BankRepresentativeName'),
        type: "text"
      }
    }
  };
this.settings_real_est_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoRealEstateDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
    },
    columns: {
      Name: {
        title: this.translate.instant('PRELIMINARY_REQUEST.OwnerOrShareholderName'),
        type: "text",
      },
      nameEn: {
        title: this.translate.instant('PRELIMINARY_REQUEST.Description'),
        type: "text",
      },
      propertyType: {
        title: this.translate.instant('PRELIMINARY_REQUEST.PropertyType'),
        type: "text"
      },
      currentMarketValue: {
        title: this.translate.instant('PRELIMINARY_REQUEST.MarketValue'),
        type: "text"
      },
    }
  };

  this.settings_companies_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoCompanyDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
    },
    columns: {
      Name: {
        title: this.translate.instant('PRELIMINARY_REQUEST.OwnerOrShareholderName'),
        type: "text",
      },
      nameEn: {
        title: this.translate.instant('PRELIMINARY_REQUEST.CompanyOrEstablishmentName'),
        type: "text"
      },
      sharePercentage: {
        title: this.translate.instant('PRELIMINARY_REQUEST.ShareholdingPercentage'),
        type: "text"
      },
      crNumber: {
        title: this.translate.instant('PRELIMINARY_REQUEST.CommercialRegistrationNumber'),
        type: "text"
      },
    }
  };

  this.settings_other_inv_en = {

    hideSubHeader: true,

    noDataMessage: this.translate.instant('PRELIMINARY_REQUEST.NoOtherInvestmentDetailsFound'),

    mode: "external",

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
      columnTitle: this.translate.instant('COMMON.Actions')
    },
    columns: {
      Name: {
        title: this.translate.instant('PRELIMINARY_REQUEST.OwnerOrShareholderName'),
        type: "text",
      },
      nameEn: {
        title: this.translate.instant('PRELIMINARY_REQUEST.Description'),
        type: "text"
      },
      investmentType: {
        title: this.translate.instant('PRELIMINARY_REQUEST.InvestmentType'),
        type: "text"
        // },
        // value: {
        //   title: "Investment Value",
        //   type: "text"
      }
    }
  };

   this.initialLicense = this.translate.instant('PRELIMINARY_REQUEST.Initial');
    this.finalLicense = this.translate.instant('PRELIMINARY_REQUEST.Final');
    this.meimInitialLicense = this.translate.instant('PRELIMINARY_REQUEST.MEIMInitial');
    this.sagiaLicense = this.translate.instant('PRELIMINARY_REQUEST.SagiaLicense');
    this.crNumberLicense = this.translate.instant('PRELIMINARY_REQUEST.CRNumber');

    this.inputs.TypeOfLicense = this.isHousingLogin ? (this.initialLicense + "," +
      this.finalLicense + "," + this.crNumberLicense +
      "," + this.crNumberLicense).split(",") : (this.initialLicense +
        "," + this.finalLicense + "," +
        this.meimInitialLicense+ "," +
        this.crNumberLicense).split(",");

    this.inputs.TypeOfLicenseOriginal = this.isHousingLogin ? (this.initialLicense + "," +
      this.finalLicense + "," + this.meimInitialLicense + "," +
      this.crNumberLicense).split(",") : (this.initialLicense + "," +
        this.finalLicense + "," + this.meimInitialLicense+ "," +
        this.crNumberLicense).split(",");

    this.inputs.TypeOfLicenseChecked = this.initialLicense;

}

  serviceId = 9;  
  getPrevPRQLoanDetForCopy() {

    try {
      console.log(this.customerProfileService.currentCustomerProfile.customerProfileId);
      this.spinnerService.show();
      this.communicationsService
        .getPrevPRQLoanDetForCopy(this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then(requests => (this.resolveRejected(requests)
          ), err => (this.resolveError()));

    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }
  getLicDetBasedOnPrevReq() {

    try {
      console.log(this.customerProfileService.currentCustomerProfile.customerProfileId);
      this.spinnerService.show();
      this.communicationsService
        .getLicDetBasedOnPrevReq(this.prevRequestId)
        .then(requests => (this.resolveCopy(requests)
          ), err => (this.resolveError()));

    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }
  ngOnInit() {
    
    this.PreliminaryRequestStatus = this.customerProfileService.PreliminaryRequestStatus;
    
    this.localStorage.getItem("serviceId").subscribe((data) => { 
      this.serviceId =data;      
      //this.serviceId = this.llPreliminaryRequest.Services.find(x=>x.CRM_code == this.inputs.ProfileTypeSelected.slice(-2)).LL_code;
      // console.log("this.serviceId: "+this.serviceId)
      if(this.serviceId == 11  || this.serviceId == 15){
        this.panelStep = 0;
        if(this.requestId != undefined)
        this.llPreliminaryRequest
        .getECARequest(this.requestId)
        .then((res) => (this.resolveECAInformation(res)), err => (this.resolveError()));

      } 

    }
    
    )
      
       
    for (var i = 0; i < this.type_of_documents_list.length; i++)
      this.type_of_documents_desc_list.push(this.translate.instant('COMMON.'+ this.type_of_documents_list[i].desc));
    for (var i = 0; i < this.share_holder_type_list.length; i++)
      this.share_holder_type_code_list.push(this.translate.instant('COMMON.'+ this.share_holder_type_list[i].type));

    for (var i = 0; i < this.investor_type_list.length; i++)
      this.investor_type_code_list.push(this.translate.instant('COMMON.'+ this.investor_type_list[i].type));
      for (var i = 0; i < this.company_type_list.length; i++)
      this.company_type_code_list.push(this.translate.instant('COMMON.'+ this.company_type_list[i].type));

    for (var i = 0; i < this.id_type_list.length; i++)
      this.id_type_code_list.push( this.translate.instant('COMMON.'+ this.id_type_list[i].type));

    this.proposed_products_source = new LocalDataSource();

    this.proposed_ownerships_source = new LocalDataSource();

    this.representatives_source = new LocalDataSource();

    this.bank_details_source = new LocalDataSource();

    this.real_estate_source = new LocalDataSource();
    this.list_companies_source = new LocalDataSource();
    this.other_investments_source = new LocalDataSource();

    this.route.queryParams.subscribe(params => {
  
      var requestId = params['requestId'];
      var islogistic = params['islogistic'];
      this.rejectedId = params['rejectedId'];
      var from = params['from'];
      var purpose = params['purpose'];
      var licenseType = params['licenseType'];
      var idNumber = params['idNumber'];
      var dob = params['dob'];
      if(islogistic)
      this.islogistic=true;
      
      if (requestId) {
        this.rejected=0;
        this.requestId = this.customerProfileService.getDecryptString(requestId);
        this.requestStatus = this.customerProfileService.getDecryptString(params['status']);
        
        this.customerProfileService.setStatusCode(this.requestStatus);
        this.screen_number = 2;

      }
      else
      {
        
        this.getPrevPRQLoanDetForCopy();
      }

      if (purpose){
        this.screen_number = 2;
        this.from_my_loans = true;
    }

      this.commentsFrom = this.customerProfileService.commentsFrom;
      this.commentArrayExists = this.customerProfileService.commentArrayExists;
      this.commentArray = this.customerProfileService.commentArray;
  
      if (this.requestStatus == undefined)
        this.add_edit_delete_show = true;

      else if (this.requestStatus == 'P' || this.requestStatus == 'A' || this.requestStatus == 'L' || this.PreliminaryRequestStatus == 42 || this.PreliminaryRequestStatus == 17 || this.PreliminaryRequestStatus == 111 || this.PreliminaryRequestStatus == 40)
        this.add_edit_delete_show = false;
       else
        this.add_edit_delete_show = true;

      if (this.PreliminaryRequestStatus == 41 || this.PreliminaryRequestStatus == 0) 
        this.add_edit_delete_show = true;
       
      if (this.requestStatus == 'Q')
        this.comments_show = true;

      else
        this.comments_show = false;


      this.proposed_products_settings_en.actions.edit = (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.product_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));
      this.proposed_products_settings_en.actions.delete = (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.product_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));

      this.proposed_ownerships_settings_en.actions.edit =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.ownership_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;
      this.proposed_ownerships_settings_en.actions.delete =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.ownership_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;

      // if (this.add_edit_delete_show)
      //   this.proposed_ownerships_settings.actions.custom = [{
      //     name: 'ownerBankDealing',
      //     title: '<i class="nb-compose"></i>'
      //   }];

      // else
      //   this.proposed_ownerships_settings.actions.custom = [];

      this.representatives_settings_en.actions.edit =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.authorized_person_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;
      this.representatives_settings_en.actions.delete = (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.authorized_person_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;

      this.bank_details_settings_en.actions.edit =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.bank_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;
      this.bank_details_settings_en.actions.delete =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.bank_details_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;

      this.settings_real_est_en.actions.edit =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.real_estates_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;
      this.settings_real_est_en.actions.delete =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.real_estates_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;

      this.settings_companies_en.actions.edit =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.list_of_companies_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;
      this.settings_companies_en.actions.delete =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.list_of_companies_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;

      this.settings_other_inv_en.actions.edit =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.other_investments_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;
      this.settings_other_inv_en.actions.delete =  (this.add_edit_delete_show&&this.PreliminaryRequestStatus!=41) ||  (this.other_investments_comments.anyOpenComments&&(this.PreliminaryRequestStatus===41));;

      this.getPreliminaryRequestInfo(from, purpose, licenseType, idNumber, dob);

    });

  }
  resolveECAInformation(res){
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();
    }

    else {
      if(res.ECALicense != null){
        this.eca_license_vs = true;
        this.inputs.eca_license = res.ECALicense;
        this.sysUserServiceId = res.SysUserServiceId;
    }}}
      
  getPreliminaryRequestInfo(from, purpose, licenseType, idNumber, dob) {

    this.spinnerService.show();

    try {

      this.preliminaryRequestService
        .getPreliminaryRequestInfo()
        .then((res) => (this.resolvePreliminaryRequestInfo(res, from, purpose, licenseType, idNumber, dob)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  resolvePreliminaryRequestInfo(res, from, purpose, licenseType, idNumber, dob) {

    try {
      this.preliminaryRequestService
      .GetCrCites()
      .then((res2) => { 
          this.crCities = res2;
        })
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.message);
     // this.spinnerService.hide();
    }

    else {

      this.localStorage.getItem('custDetails').subscribe((data) => {

        var custDetails = data;

        this.startedFilling = 0;

        this.isic_division_list = res["isicActivity"][0]["isicDivision"];

        for (var i = 0; i < this.isic_division_list.length; i++)
        {
          if(this.commonService.defaultLanguage === 'ar')  
        this.isic_division_name_list.push(this.isic_division_list[i].divisionNameAr);
        else
        this.isic_division_name_list.push(this.isic_division_list[i].divisionName);
        }
        this.isic_activity_list = res["isicActivity"][0]["isicActivity"];

        for (var i = 0; i < this.isic_activity_list.length; i++)
        {
          if(this.commonService.defaultLanguage === 'ar')
          this.isic_activity_name_list.push(this.isic_activity_list[i].activityNameAr);
          else
          this.isic_activity_name_list.push(this.isic_activity_list[i].activityName);
        }
        this.unit_list = res["UOMSearch"];

        for (var i = 0; i < this.unit_list.length; i++){
          if(this.commonService.defaultLanguage === 'ar')
          this.unit_code_list.push(this.unit_list[i].UOMTextAr);
          else
          this.unit_code_list.push(this.unit_list[i].UOMText);
        }
this.industrial_sector_name_list= res["industrialSector"];
        // for (var i = 0; i < res["industrialSector"].length; i++) {
        //   res["industrialSector"][i].preliminaryId = this.preliminaryId;
        //   this.inputs.IndustrialSector.push(res["industrialSector"][i]);
        // }

        // this.inputs.Category = res["sectorCategory"];

        this.inputs.Region = res["sectorRegions"];
        this.inputs.ProfileTypeList = [];

          var prqTypeHousing = res["prqTypesList"].find((o) => parseInt(o.id) == parseInt(custDetails.ProjectProfId));
        // var prqTypeNusaned = res["prqTypesList"].find((o) => parseInt(o.id) == parseInt(this.customerProfileService.projectProfileId));

        if (prqTypeHousing) {

          this.isHousingLogin = true;
          this.isSagiaOrCr = true;

        }

        //   this.inputs.ProfileTypeList.push(prqTypeHousing);

        // else if (prqTypeNusaned)
        //   this.inputs.ProfileTypeList.push(prqTypeNusaned);

        // else
        this.inputs.ProfileTypeList = res["prqTypesList"];
        
        // this.industrial_sector_pop_up_array = this.inputs.IndustrialSector;

        for (var i = 0; i < res["nationality"].length; i++) {
          this.country_list.push(res["nationality"][i]);
          if(this.commonService.defaultLanguage==='en')
          this.country_name_list.push(res["nationality"][i].nameEn);
          else
          this.country_name_list.push(res["nationality"][i].nameAr);
        }
        this.city_name_list2=res["cityList"];
        for (var i = 0; i < res["cityList"].length; i++) {
          this.city_list.push(res["cityList"][i]);
          if(this.commonService.defaultLanguage==='en')
          this.city_name_list.push(res["cityList"][i].cityNameEn);
          else
          this.city_name_list.push(res["cityList"][i].cityNameAr);

          if (res["cityList"][i].countryKey == "SA"){
            if(this.commonService.defaultLanguage==='en')
            this.city_saudi_name_list.push(res["cityList"][i].cityNameEn);
            else
            this.city_saudi_name_list.push(res["cityList"][i].cityNameAr);

          }
        }

        for (var i = 0; i < res["propertyTypeList"].length; i++) {
          this.property_type_list.push(res["propertyTypeList"][i]);
          if(this.commonService.defaultLanguage==='en')
          this.property_type_desc_list.push(res["propertyTypeList"][i].propertyTypeEn);
          else
          this.property_type_desc_list.push(res["propertyTypeList"][i].propertyTypeAr);
        }

        for (var i = 0; i < res["investTypeList"].length; i++) {
          this.investment_type_list.push(res["investTypeList"][i]);
          if(this.commonService.defaultLanguage === 'en')
          this.investment_type_desc_list.push(res["investTypeList"][i].investTypeEn);
          else
          this.investment_type_desc_list.push(res["investTypeList"][i].investTypeAr);
        }

        for (var i = 0; i < res["legalEntityList"].length; i++) {
          this.legal_entity_list.push(res["legalEntityList"][i]);
          this.legal_entity_en_desc_list.push(res["legalEntityList"][i].legalEntityEn);
          if (res["legalEntityList"][i].legalEntityAr)
            this.legal_entity_ar_desc_list.push(res["legalEntityList"][i].legalEntityAr);
        }

        if (from) {

          from = this.customerProfileService.getDecryptString(from);
          licenseType = this.customerProfileService.getDecryptString(licenseType);
          idNumber = this.customerProfileService.getDecryptString(idNumber);
          dob = this.customerProfileService.getDecryptString(dob);
          purpose = this.customerProfileService.getDecryptString(purpose);

          switch (licenseType) {

            case "I":

              this.inputs.TypeOfLicenseChecked = this.initialLicense;
              break;

               case "F":

              this.inputs.TypeOfLicenseChecked = this.finalLicense;
              break;

              case "MI":

              this.inputs.TypeOfLicenseChecked = this.meimInitialLicense;
                this.isMEIM = true;
                break;

            case "S":

              this.inputs.TypeOfLicenseChecked = this.sagiaLicense;
              this.isSagiaOrCr = true;
              break;

            case "C":

              this.inputs.TypeOfLicenseChecked = this.crNumberLicense;
              this.isSagiaOrCr = true;
              break;

            default:

              this.inputs.TypeOfLicenseChecked = "";
              break;

          }

          // this.inputs.TypeSelected = purpose;

          if (from == "my_loans")
            this.getMCIDetails(licenseType, idNumber, dob, purpose,from);

        }

        else {

          if (this.screen_number == 2)
            this.bindPRQDetailsByRequestId();

          else {

            this.preliminaryRequestService
              .getUserTypeInfo()
              .then((res) => (this.resolveUserTypeInfo(res)), err => this.resolveError());

          }

        }

      });

    }

  }
catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.ResolvingPreliminaryRequestInfoFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
    
}

  resolveHSCodeList(res, preliminaryRequestModalParams, event, from) {

    try {
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.message);
      this.spinnerService.hide();
    }

    else {

      this.harmonized_code_pop_up_array = res["hsCodeList"];

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.HSCodeRetrieved'));

      if (from == 0)
        this.callAddProductModal(preliminaryRequestModalParams);

      else if (from == 1 || from == 2)
        this.callEditProductModal(preliminaryRequestModalParams, event, from);

    }
  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.ResolvingHSCodeListFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }

  resolveUserTypeInfo(res) {

    if (res.MessType == "E")
      this.spinnerService.hide();

    else {

      if (res.UserIdType == "2") {

        this.inputs.TypeOfLicense = (this.initialLicense + "," +
          this.finalLicense + "," + this.meimInitialLicense +
          "," + this.sagiaLicense).split(",");

        this.inputs.TypeOfLicenseOriginal = (this.initialLicense + "," +
          this.finalLicense + "," + this.meimInitialLicense +
          "," + this.sagiaLicense).split(",");

        this.inputs.TypeOfLicenseChecked = this.sagiaLicense;

        this.isSagiaOrCr = true;

      }

      else
        this.inputs.TypeOfLicense = this.isHousingLogin ? (this.initialLicense + "," +
          this.finalLicense + "," + this.meimInitialLicense +
          "," + this.crNumberLicense).split(",") : this.inputs.TypeOfLicenseOriginal;

      this.spinnerService.hide();

    }

  }
  submitECA(ecaLicense, post_data, save_submit, proposed_products_temp_source, representatives_temp_source){
    this.spinnerService.show();
    this.llPreliminaryRequest
    .checkValidECA(ecaLicense)
    .then((res) => {
      if(res){
        this.eca_license_vs = true;
        console.log('submitLogic');
        this.submitLogic(post_data,save_submit,proposed_products_temp_source, representatives_temp_source);
        //post
    //     this.preliminaryRequestService.postPreliminaryRequest(post_data)
    //     .then((res) => {
    //       console.log("pre res2" , res );
    //       res['Product']= this.serviceId;
    //       if(this.serviceId == 11){
    //         res['ECALicense'] = this.inputs.eca_license;
    //       } 
    //       if (res["MsgId"] ==="S" && post_data.UpdStatus === "P"){ 

            
    //       this.llPreliminaryRequest.postLandLoanPreliminartyRequest(res).subscribe(response  => 
    //         {
    //           console.log("sub " ,response ); 
    //           if( JSON.parse(response.data).message != 'S'){

    //             this.onResult(res, save_submit, proposed_products_temp_source, representatives_temp_source)
    //           }
    //           else 
    //           this.resolveError()
    //       } ,
    //       error => console.log("error " , error) );
          
    //   }
    //   else{
    //     this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
    //     this.spinnerService.hide();
    //   }
    // }, err => {
    //   this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
    //     this.spinnerService.hide();
    // });
  }
  else{
    this.eca_license_vs = false;
    this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ECAInvalidShort'));
    this.spinnerService.hide();
  }
})}

  GetCRnformation(crnumber) {
    
  // if(this.serviceId == 9 && crnumber != "" )
  if((this.serviceId == 9 || this.serviceId == 10 || this.serviceId == 13 || this.serviceId == 14) && crnumber != "" )

  {
    //var crnumber = event.target.value;
    this.spinnerService.show();

    try {
      this.preliminaryRequestService.GetCRnformation({ "crnumber": crnumber })
        .then((rescrdata) => {

          if (rescrdata) {
            this.inputs.commercialRegistrationDetails[0].RegNumber = crnumber;
            this.inputs.commercialRegistrationDetails[0].RegStartDate = rescrdata["CreatedDate"];
            this.inputs.commercialRegistrationDetails[0].RegEndDate = rescrdata["ExpiredDate"];
            this.inputs.commercialRegistrationDetails[0].RegCompanyName  = rescrdata["Name"];
            this.inputs.commercialRegistrationDetails[0].RegActivity = rescrdata["Activities"];
            this.CommercialRegistrationdetails_final.push(this.inputs.commercialRegistrationDetails[0]);
            this.spinnerService.hide();
            return ;
          }
        
    })
  }
    catch (err) {
      this.spinnerService.hide();
            
            this.commonService.showFailureToast(this.translate.instant('COMMON.IndusterialCityNotAvailable'));
    }
  }
  }


  getMCIDetails(licenseType, idNumber, dob, purpose, from) {
    
    this.spinnerService.show();

    try {
      var purposeUpdate = from == "next" ? this.inputs.ProfileType : purpose;

      this.preliminaryRequestService
        .getMCIDetails(licenseType, idNumber, dob, purposeUpdate)
        .then((res) => (this.resolveMCIDetails(res, purpose , licenseType , idNumber )), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  resolveError() {
      this.spinnerService.hide();
      this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
  }

  resolveMCIDetails(res, purpose ,licenseType   ,idNumber ) {
    
    try {
    if (res) {
      this.preliminaryRequestService
      .GetCrCites()
      .then((res2) => { 
          this.crCities = res2;
        })
      if (idNumber.toString().length ===10 && idNumber.toString().startsWith('4') )
      { 
        this.isMEIM=true;
      }
      if (res.msgId) {

        if (res.msgId == "E") {

          this.commonService.showFailureToast(res.msgText);
          this.spinnerService.hide();

          if (purpose == "E")
            this.router.navigate(['/pages/my-loans']);

        }

        else { 
          try { 
              if (this.serviceId == 7) {
                let isInitial = licenseType == "F" ? false : true;

                this.preliminaryRequestService
                  .GetModonCites({ "isInitial": isInitial, "ILNumber": idNumber })
                  .then((res2) => {

                    if (res2["result"] === "Failur") {
                      this.spinnerService.hide();
                      this.commonService.showFailureToast(this.translate.instant('COMMON.IndusterialCityNotAvailable'));
                      return;
                    }
                  
                    else 
                      this.modonCities = res2;
                    })
                  }
                this.screen_number = 2;

            this.preliminaryId = res.preliminaryId ? res.preliminaryId : "";


            this.isProjectExist = res.isProjectExist ? res.isProjectExist : "";

            if (this.isProjectExist == "X") {
              this.checkType();

              this.inputs.ProfileType = res.prqTypesList ? res.prqTypesList[0] ? res.prqTypesList[0].id ? res.prqTypesList[0].id : "" : "" : "";
              this.inputs.ProfileTypeSelected = res.prqTypesList ? res.prqTypesList[0] ? res.prqTypesList[0].prqTypeEn ? res.prqTypesList[0].prqTypeEn : "" : "" : "";

            }
            console.log('papa');
            console.log( res.projectId );

            this.projectId=res.projectId;
            this.inputs = {
              ModonCity: res.ModonCity,
              ProjectCode: res.ProjectCode ? res.ProjectCode : res.projectCode ? res.projectCode : "",
              ProjectId: res.projectId ? res.projectId : "",
              TypeOfLicense: (this.initialLicense + "," +
                this.finalLicense + "," + this.meimInitialLicense +
                "," + this.sagiaLicense).split(","),
              TypeOfLicenseOriginal: (this.initialLicense + "," +
                this.finalLicense + "," + this.meimInitialLicense +
                "," + this.sagiaLicense).split(","),
              TypeOfLicenseChecked: res.licenseDetails ? res.licenseDetails[0].licenseType == "I" ?
                this.initialLicense : res.licenseDetails[0].licenseType == "F" ?
                  this.finalLicense : res.licenseDetails[0].licenseType == "MI" ?
                    this.meimInitialLicense : res.licenseDetails[0].licenseType == "S" ?
                      this.sagiaLicense : res.licenseDetails[0].licenseType == "C" ? this.crNumberLicense : this.inputs.TypeOfLicenseChecked : this.inputs.TypeOfLicenseChecked,
              CustomerLicenseNumber: "",  
              CustomerLicenseDate: { year: 0, month: 0, day: 0 },
              IndustrialLicenseId: "",
              IndustrialLicenseDate:"",// { year: 0, month: 0, day: 0 },
              MEIMIndustrialLicenseId: "",
              MEIMIndustrialLicenseDate: "",
              CrNumber: "",
              CrExpiryDate: { year: 0, month: 0, day: 0 },
              IssueDate: { year: 0, month: 0, day: 0 },
              commercialRegistrationDetails: [{
                RegNumber: res.commercialRegistrationDetails ? res.commercialRegistrationDetails[0].RegNumber ? res.commercialRegistrationDetails[0].RegNumber : "" : "",
                RegStartDate: res.commercialRegistrationDetails ? res.commercialRegistrationDetails[0].RegStartDate ? res.commercialRegistrationDetails[0].RegStartDate : "" : "",
                RegEndDate: res.commercialRegistrationDetails ? res.commercialRegistrationDetails[0].RegEndDate ? res.commercialRegistrationDetails[0].RegEndDate : "" : "",
                RegActivity: res.commercialRegistrationDetails ? res.commercialRegistrationDetails[0].RegActivity ? res.commercialRegistrationDetails[0].RegActivity : "" : "",
                RegCompanyName: res.commercialRegistrationDetails ? res.commercialRegistrationDetails[0].RegCompanyName ? res.commercialRegistrationDetails[0].RegCompanyName : "" : ""
              }],
              licenseDetails: [{
                preliminaryId: this.preliminaryId,
                licenseType: res.licenseDetails ? res.licenseDetails[0].licenseType ? res.licenseDetails[0].licenseType : "" : "",
                licenseId: res.licenseDetails ? res.licenseDetails[0].licenseId ? res.licenseDetails[0].licenseId : "" : "",
                licStartDate: !this.isMEIM ? res.licenseDetails ? res.licenseDetails[0].licStartDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.licenseDetails[0].licStartDate) : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 },
                licEndDate: !this.isMEIM ? res.licenseDetails ? res.licenseDetails[0].licEndDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.licenseDetails[0].licEndDate) : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 },
                licStartDateGreg: this.isMEIM ? res.licenseDetails ? res.licenseDetails[0].licStartDate ? this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.licenseDetails[0].licStartDate) : "" : "" : "",
                licEndDateGreg: this.isMEIM ? res.licenseDetails ? res.licenseDetails[0].licEndDate ? this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.licenseDetails[0].licEndDate) : "" : "" : "",
                crNumber: res.licenseDetails ? res.licenseDetails[0].crNumber ? res.licenseDetails[0].crNumber.replace(" ", "") : "" : "",
                crIssueDate: res.licenseDetails ? res.licenseDetails[0].crIssueDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.licenseDetails[0].crIssueDate) : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 },
                crExpiryDate: res.licenseDetails ? res.licenseDetails[0].crExpiryDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.licenseDetails[0].crExpiryDate) : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 },
                crLocationAr: res.licenseDetails ? res.licenseDetails[0].crLocationAr ? res.licenseDetails[0].crLocationAr : "" : "",
                proCapital: res.licenseDetails ? res.licenseDetails[0].proCapital ? res.licenseDetails[0].proCapital : "" : "",
                factoryName: res.licenseDetails ? res.licenseDetails[0].factoryName ? res.licenseDetails[0].factoryName : "" : "",
                crCity: res.licenseDetails ? res.licenseDetails[0].crCity ? res.licenseDetails[0].crCity : "" : "",
                addressDesc: res.licenseDetails ? res.licenseDetails[0].addressDesc ? res.licenseDetails[0].addressDesc : "" : "",
                landNo: res.licenseDetails ? res.licenseDetails[0].landNo ? res.licenseDetails[0].landNo : "" : "",
                city: res.licenseDetails ? res.licenseDetails[0].city ? res.licenseDetails[0].city : "" : "",
                mngmntArea: res.licenseDetails ? res.licenseDetails[0].mngmntArea ? res.licenseDetails[0].mngmntArea : "" : "",
                poBox: res.licenseDetails ? res.licenseDetails[0].poBox ? res.licenseDetails[0].poBox : "" : "",
                storesArea: res.licenseDetails ? res.licenseDetails[0].storesArea ? res.licenseDetails[0].storesArea : "" : "",
                totalArea: res.licenseDetails ? res.licenseDetails[0].totalArea ? res.licenseDetails[0].totalArea : "" : "",
                longX: res.licenseDetails ? res.licenseDetails[0].longX ? res.licenseDetails[0].longX : "" : "",
                latitudeY: res.licenseDetails ? res.licenseDetails[0].latitudeY ? res.licenseDetails[0].latitudeY : "" : "",
                zipCode: res.licenseDetails ? res.licenseDetails[0].zipCode ? res.licenseDetails[0].zipCode : "" : "",
                crName: res.licenseDetails ? res.licenseDetails[0].crName ? res.licenseDetails[0].crName : "" : "",
                crCapital: res.licenseDetails ? res.licenseDetails[0].crCapital ? res.licenseDetails[0].crCapital : "" : "",
                crLeagalTypeEn: res.licenseDetails ? res.licenseDetails[0].crLeagalTypeEn ? res.licenseDetails[0].crLeagalTypeEn : "" : "",
                crLeagalTypeAr: res.licenseDetails ? res.licenseDetails[0].crLeagalTypeAr ? res.licenseDetails[0].crLeagalTypeAr : "" : "",
                crPhone: res.licenseDetails ? res.licenseDetails[0].crPhone ? res.licenseDetails[0].crPhone : "" : "",
                crFaxNo: res.licenseDetails ? res.licenseDetails[0].crFaxNo ? res.licenseDetails[0].crFaxNo : "" : "",
                crAddress: res.licenseDetails ? res.licenseDetails[0].crAddress ? res.licenseDetails[0].crAddress : "" : "",
                crBuildingNo: res.licenseDetails ? res.licenseDetails[0].crBuildingNo ? res.licenseDetails[0].crBuildingNo : "" : "",
                crAdditionalNo: res.licenseDetails ? res.licenseDetails[0].crAdditionalNo ? res.licenseDetails[0].crAdditionalNo : "" : "",
                crUnitNo: res.licenseDetails ? res.licenseDetails[0].crUnitNo ? res.licenseDetails[0].crUnitNo : "" : "",
                crZipCode: res.licenseDetails ? res.licenseDetails[0].crZipCode ? res.licenseDetails[0].crZipCode : "" : "",
                crNameAr: res.licenseDetails ? res.licenseDetails[0].crNameAr ? res.licenseDetails[0].crNameAr : "" : "",
                factoryNameAr: res.licenseDetails ? res.licenseDetails[0].factoryNameAr ? res.licenseDetails[0].factoryNameAr : "" : "",
                reqAmount: res.licenseDetails ? res.licenseDetails[0].reqAmount ? res.licenseDetails[0].reqAmount.replace(" ", "") : "" : "",
                crDistrictArea: res.licenseDetails ? res.licenseDetails[0].crDistrictArea ? res.licenseDetails[0].crDistrictArea : "" : "",
                crLegalInd: res.licenseDetails ? res.licenseDetails[0].crLegalInd ? res.licenseDetails[0].crLegalInd : "" : ""
              }],
              // RmList: this.inputs.RmList,
              // RmListSelected: res.RmList ? (res.RmList[0].userId ? res.RmList[0].userId : "") : "", 
             RmEmail: res.RmList ? (res.RmList[0].rmEmailId ? res.RmList[0].rmEmailId : "") : "",
              productDetails: [],
              ownersDetails: [],
              IndustrialSector: this.inputs.IndustrialSector,
              IndustrialSectorSelected: res.industrialSector ? [{
                "preliminaryId": this.preliminaryId,
                "sectorId": res.industrialSector[0].sectorId ? res.industrialSector[0].sectorId : "",
                "sectorMcatId": res.industrialSector[0].sectorMcatId ? res.industrialSector[0].sectorMcatId : "",
                "name": res.industrialSector[0].name ? res.industrialSector[0].name : "",
                "isActive": res.industrialSector[0].isActive ? res.industrialSector[0].isActive : ""
              }] : [{
                "preliminaryId": this.preliminaryId,
                "sectorId": "",
                "sectorMcatId": "",
                "name": "",
                "isActive": ""
              }],
             // Category: this.inputs.Category,
             // CategorySelected: res.sectorCategory ? res.sectorCategory[0].id : "7",
              Region: this.inputs.Region,
              RegionSelected: res.sectorRegions ? res.sectorRegions[0].id : "",
              Type: this.inputs.Type,
              TypeSelected: this.inputs.TypeSelected,
              ProfileTypeList: this.inputs.ProfileTypeList,
              ProfileType: this.inputs.ProfileType == "" ? res.PrqTypesList ? res.PrqTypesList[0].id ? res.PrqTypesList[0].id : "" : "" : this.inputs.ProfileType,
              ProfileTypeSelected: this.inputs.ProfileTypeSelected == "" ? res.PrqTypesList ? res.PrqTypesList[0].prqTypeEn ? res.PrqTypesList[0].prqTypeEn : "" : "" : this.inputs.ProfileTypeSelected,
               UpdStatus: this.inputs.UpdStatus,
              eca_license: this.inputs.eca_license,
              OtherPurpose: this.inputs.OtherPurpose
              
               
            }


            this.prqRequestType = res.isProjectExist;

            if (res.productDetails) {

              for (var i = 0; i < res.productDetails.length; i++) {
                
                res.productDetails[i].preliminaryId = this.preliminaryId;
                  res.productDetails[i].updStatus = "";
                res.productDetails[i].proInd = res.productDetails[i].proInd ? (res.productDetails[i].proInd == "X" ? "Yes" : "No") : "No";
  


            


            if (res.productDetails[i].divisionId) {

              var division = this.isic_division_list.find((o) => o.id === res.productDetails[i].divisionId);
              if (division)
              {
                if(this.commonService.defaultLanguage === 'ar')  
                res.productDetails[i].divisionName = division.divisionNameAr;
                else
                res.productDetails[i].divisionName = division.divisionName;
              }
            }

            if (res.productDetails[i].activityId) {

              var activity = this.isic_activity_list.find((o) => o.activityId === res.productDetails[i].activityId);
              
              if(activity&&this.commonService.defaultLanguage === 'ar')
                res.productDetails[i].activityName = activity.activityNameAr;
                if(activity&&this.commonService.defaultLanguage === 'eb')
                res.productDetails[i].activityName = activity.activityName;
            }
            

              this.inputs.productDetails.push(res.productDetails[i]);

             

            }
          
              this.inputs.productDetails.sort(this.commonService.sortArray("-proInd"));

              this.proposed_products_source.load(this.inputs.productDetails);

              this.proposed_products_source.refresh();

              this.proposed_products_source_length = res.productDetails.length;

            }

            if (res.ownersDetails) {

              var bank_details_temp_source = [], real_estate_temp_source = [], companies_temp_source = [],
                other_investments_temp_source = [];

              for (var i = 0; i < res.ownersDetails.length; i++) {

                res.ownersDetails[i].preliminaryId = this.preliminaryId;
                res.ownersDetails[i].updStatus = "";
                res.ownersDetails[i].proInd = res.ownersDetails[i].proInd ? (res.ownersDetails[i].proInd == "X" ? "Yes" : "No") : "No";

                res.ownersDetails[i]["bankRelation"] = res.ownersDetails[i]["bankRelation"] ? (res.ownersDetails[i]["bankRelation"] == "X" ? true : false) : false;
                res.ownersDetails[i]["nonObjection"] = res.ownersDetails[i]["nonObjection"] ? (res.ownersDetails[i]["nonObjection"] == "X" ? true : false) : false;
                res.ownersDetails[i]["accessQawaem"] = res.ownersDetails[i]["accessQawaem"] ? (res.ownersDetails[i]["accessQawaem"] == "X" ? true : false) : false;
                res.ownersDetails[i]["acknowledgement"] = res.ownersDetails[i]["acknowledgement"] ? (res.ownersDetails[i]["acknowledgement"] == "X" ? true : false) : false;
                res.ownersDetails[i]["dealWithSidf"] = res.ownersDetails[i]["dealWithSidf"] ? (res.ownersDetails[i]["dealWithSidf"] == "X" ? true : false) : false;


                if (!res.ownersDetails[i].bankDetails)
                  res.ownersDetails[i].bankDetails = [];

                else {

                  for (var j = 0; j < res.ownersDetails[i].bankDetails.length; j++) {

                    var bankNationality = this.country_list.find((o) => o.countryKey == res.ownersDetails[i].bankDetails[j].country);
                     if(bankNationality&& this.commonService.defaultLanguage === 'en')
                      res.ownersDetails[i].bankDetails[j].country = bankNationality.nameEn;
                      else if(bankNationality&& this.commonService.defaultLanguage === 'ar')
                      res.ownersDetails[i].bankDetails[j].country = bankNationality.nameAr;

                    res.ownersDetails[i].bankDetails[j]["accHolder"] = res.ownersDetails[i].name;
                    bank_details_temp_source.push(res.ownersDetails[i].bankDetails[j]);

                  }

                }


                if (!res.ownersDetails[i].realEstateDetails)
                  res.ownersDetails[i].realEstateDetails = [];

                else {

                  for (var j = 0; j < res.ownersDetails[i].realEstateDetails.length; j++) {

                    var selectedOwner = res.ownersDetails.find((o) => o.buPartner == res.ownersDetails[i].realEstateDetails[j].buPartner);
                    if (selectedOwner)
                      res.ownersDetails[i].realEstateDetails[j]["Name"] = selectedOwner.name;

                    var propertyType = this.property_type_list.find((o) => o.id == res.ownersDetails[i].realEstateDetails[j]["propertyType"]);
                    
                    if(propertyType&&this.commonService.defaultLanguage==='en')
                      res.ownersDetails[i].realEstateDetails[j]["propertyType"] = propertyType.propertyTypeEn;
                    else if(propertyType&&this.commonService.defaultLanguage==='ar')
                      res.ownersDetails[i].realEstateDetails[j]["propertyType"] = propertyType.propertyTypeAr;
                    var country = this.country_list.find((o) => o.countryKey == res.ownersDetails[i].realEstateDetails[j].country);
                    if (country&&this.commonService.defaultLanguage==='en') 
                      res.ownersDetails[i].realEstateDetails[j].country = country.nameEn;
                      if (country&&this.commonService.defaultLanguage==='ar') 
                      res.ownersDetails[i].realEstateDetails[j].country = country.nameAr;

                    res.ownersDetails[i].realEstateDetails[j]["purchasePrice"] = "SAR " + this.commonService.numberToNumberWithCommas(res.ownersDetails[i].realEstateDetails[j]["purchasePrice"]);
                    res.ownersDetails[i].realEstateDetails[j]["currentMarketValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.ownersDetails[i].realEstateDetails[j]["currentMarketValue"]);

                    res.ownersDetails[i].realEstateDetails[j]["purchaseDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.ownersDetails[i].realEstateDetails[j]["purchaseDate"]);
                    res.ownersDetails[i].realEstateDetails[j]["currentMarketDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.ownersDetails[i].realEstateDetails[j]["currentMarketDate"]);

                    real_estate_temp_source.push(res.ownersDetails[i].realEstateDetails[j]);

                  }

                }


                if (!res.ownersDetails[i].companyDetails)
                  res.ownersDetails[i].companyDetails = [];

                else {

                  for (var j = 0; j < res.ownersDetails[i].companyDetails.length; j++) {

                    var selectedOwner = res.ownersDetails.find((o) => o.buPartner == res.ownersDetails[i].companyDetails[j].buPartner);
                    if (selectedOwner)
                      res.ownersDetails[i].companyDetails[j]["Name"] = selectedOwner.name;

                    res.ownersDetails[i].companyDetails[j]["shareValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.ownersDetails[i].companyDetails[j]["shareValue"]);

                    res.ownersDetails[i].companyDetails[j]["crIssueDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.ownersDetails[i].companyDetails[j]["crIssueDate"]);

                    companies_temp_source.push(res.ownersDetails[i].companyDetails[j]);

                  }

                }


                if (!res.ownersDetails[i].investmentDetails)
                  res.ownersDetails[i].investmentDetails = [];

                else {

                  for (var j = 0; j < res.ownersDetails[i].investmentDetails.length; j++) {

                    var selectedOwner = res.ownersDetails.find((o) => o.buPartner == res.ownersDetails[i].investmentDetails[j].buPartner);
                    if (selectedOwner)
                      res.ownersDetails[i].investmentDetails[j]["Name"] = selectedOwner.name;

                    var investmentType = this.investment_type_list.find((o) => o.id == res.ownersDetails[i].investmentDetails[j]["investmentType"]);
                    
                    if (investmentType&&this.commonService.defaultLanguage==='ar')
                      res.ownersDetails[i].investmentDetails[j]["investmentType"] = investmentType.investTypeAr;
                    if (investmentType&&this.commonService.defaultLanguage==='en')
                      res.ownersDetails[i].investmentDetails[j]["investmentType"] = investmentType.investTypeEn;

                    res.ownersDetails[i].investmentDetails[j]["value"] = res.ownersDetails[i].investmentDetails[j]["value"] ? "SAR " + this.commonService.numberToNumberWithCommas(res.ownersDetails[i].investmentDetails[j]["value"]) : "";

                    res.ownersDetails[i].investmentDetails[j]["marketPrice"] = res.ownersDetails[i].investmentDetails[j]["marketPrice"] ? "SAR " + this.commonService.numberToNumberWithCommas(res.ownersDetails[i].investmentDetails[j]["marketPrice"]) : "";
                    res.ownersDetails[i].investmentDetails[j]["totalMarketValue"] = res.ownersDetails[i].investmentDetails[j]["totalMarketValue"] ? "SAR " + this.commonService.numberToNumberWithCommas(res.ownersDetails[i].investmentDetails[j]["totalMarketValue"]) : "";

                    other_investments_temp_source.push(res.ownersDetails[i].investmentDetails[j]);

                  }

                }


                if (res.ownersDetails[i].date)
                  res.ownersDetails[i].date = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.ownersDetails[i].date);

                else
                  res.ownersDetails[i]["date"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen("00000000");

                var nationality = this.country_list.find((o) => o.countryKey == res.ownersDetails[i].nationality);
                if (nationality&&this.commonService.defaultLanguage==='en')
                  res.ownersDetails[i].nationality = nationality.nameEn;
                  if (nationality&&this.commonService.defaultLanguage==='ar')
                  res.ownersDetails[i].nationality = nationality.nameAr;

                var shareHolderType = this.share_holder_type_list.find((o) => o.id == res.ownersDetails[i].shareHolderType);
                if (shareHolderType)
                  res.ownersDetails[i].shareHolderType = shareHolderType.type;

                var investorType = this.investor_type_list.find((o) => o.id == res.ownersDetails[i].investorType);
                if (investorType)
                  res.ownersDetails[i].investorType = investorType.type;

                this.inputs.ownersDetails.push(res.ownersDetails[i]);

              }

              this.inputs.ownersDetails.sort(this.commonService.sortArray("-proInd"));

              this.proposed_ownerships_source.load(this.inputs.ownersDetails);

              this.proposed_ownerships_source.refresh();

              this.proposed_ownerships_source_length = res.ownersDetails.length;


              this.bank_details_source.load(bank_details_temp_source);

              this.bank_details_source_length = bank_details_temp_source.length;

              this.bank_details_source.refresh();


              this.real_estate_source.load(real_estate_temp_source);

              this.real_estate_source_length = real_estate_temp_source.length;

              this.real_estate_source.refresh();


              this.list_companies_source.load(companies_temp_source);

              this.list_companies_source_length = companies_temp_source.length;

              this.list_companies_source.refresh();


              this.other_investments_source.load(other_investments_temp_source);

              this.other_investments_source_length = other_investments_temp_source.length;

              this.other_investments_source.refresh();

              this.non_saudi_owners_list = [];

              for (var i = 0; i < this.inputs.ownersDetails.length; i++)
              { 
                if (this.inputs.ownersDetails[i].nationality  && this.inputs.ownersDetails[i].nationality != 'SA' && this.inputs.ownersDetails[i].nationality != 'Saudi Arabia' && this.inputs.ownersDetails[i].nationality != 'السعودية')
                  this.non_saudi_owners_list.push(this.inputs.ownersDetails[i].name);
              }

            }


            if (res.representativeDetails) {

              var representativeDetails = [];

              for (var i = 0; i < res.representativeDetails.length; i++) {

                res.representativeDetails[i].mciInd = res.representativeDetails[i].mciInd ? (res.representativeDetails[i].mciInd == "X" ? "Yes" : "No") : "No";

                res.representativeDetails[i].attachmentInd = res.representativeDetails[i].attachmentInd ? (res.representativeDetails[i].attachmentInd == "X" ? "Yes" : "No") : "No";

                var idType = this.id_type_list.find((o) => o.id == res.representativeDetails[i].idType);
                if (idType)
                  res.representativeDetails[i].idType = idType.type;

                res.representativeDetails[i].preliminaryId = this.preliminaryId,
                  res.representativeDetails[i].updStatus = "";

                if (res.representativeDetails[i].dob)
                  res.representativeDetails[i].dob = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.representativeDetails[i].dob);

                else
                  res.representativeDetails[i]["dob"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen("00000000");

                representativeDetails.push(res.representativeDetails[i]);
              }

              this.representatives_source.load(representativeDetails);

              this.representatives_source.refresh();

              this.representatives_source_length = res.representativeDetails.length;

             // this.spinnerService.hide();

            }

         //   else
           //   this.spinnerService.hide();

            this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.PRQMCIRetrieved'));
           if (this.from_my_loans)
             this.getPreliminaryRequestInfoSecond("", "", "", "", "from_my_loans");
 
          }

          catch (err) {
            this.resolveError();
          }

        }

      }

      else if (res.ErrorMessages) {

        if (res.ErrorMessages[0].Type === "error")
          this.commonService.showFailureToast(res.ErrorMessages[0].Message);

        this.spinnerService.hide();

        if (purpose == "E")
          this.router.navigate(['/pages/my-loans']);

      }

    }

    else {

      this.resolveError();

      if (purpose == "E")
        this.router.navigate(['/pages/my-loans']);

    }

    // if (this.serviceId == 9) {
      if (this.serviceId == 9 || this.serviceId == 10  || this.serviceId == 13 || this.serviceId == 14) {

      
      this.GetCRnformation(this.inputs.licenseDetails[0].crNumber)
    }
  }

    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.ResolvingMCIDetailsFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
    
  }

  callAddProductModal(preliminaryRequestModalParams) {

    preliminaryRequestModalParams = {

      header: this.translate.instant('PRELIMINARY_REQUEST.addProposedProducts'),

      form_number: 2,

      inputs: [
        {
          id: "divisionName",
          name: this.translate.instant('PRELIMINARY_REQUEST.mainActivity'),
          type: "harmonized_code_pop_up",
          selected: "",
          value: this.isic_division_list,
          required: "true",
          visible: true,
          form_number: 2,
          placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectMainActivity'),
          code: "mainActivity"
        },
        {
          id: "activityName",
          name: this.translate.instant('PRELIMINARY_REQUEST.subActivity'),
          type: "harmonized_code_pop_up",
          selected: "",
          value: this.isic_activity_list,
          required: "true",
          visible: true,
          form_number: 2,
          placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectSubActivity'),
          code: "subActivity"
        },
        {
          id: "hsCode",
          name: this.translate.instant('PRELIMINARY_REQUEST.harmonizedCode'),
          type: "harmonized_code_pop_up",
          selected: "",
          selectedId: "",
          value: this.harmonized_code_pop_up_array,
          required: "true",
          visible: true,
          form_number: 2,
          placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectHarmonizedCode'),
          code: "HSCode"
        },
        {
          id: "productName",
          name: this.translate.instant('PRELIMINARY_REQUEST.productName'),
          type: "text",
          product_type: "proposed",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "licCapacity",
          name: this.translate.instant('PRELIMINARY_REQUEST.licenseCapacity'),
          type: "number_three_decimal",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "unit",
          name: this.translate.instant('PRELIMINARY_REQUEST.unitOfMeasure'),
          type: "select",
          value: this.unit_code_list,
          selected: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "rawMaterials",
          name: this.translate.instant('PRELIMINARY_REQUEST.rawMaterials'),
          type: "text",
          value: "",
          required: "false",
          visible: true,
          form_number: 2
        },
        {
          id: "usage",
          name: this.translate.instant('PRELIMINARY_REQUEST.Usage'),
          type: "textarea",
          value: "",
          required: "false",
          visible: true,
          form_number: 2
        },
        {
          id: "applications",
          name: this.translate.instant('PRELIMINARY_REQUEST.Applications'),
          type: "text",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "users",
          name: this.translate.instant('PRELIMINARY_REQUEST.Users'),
          type: "text",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "weight",
          name: this.translate.instant('PRELIMINARY_REQUEST.Weight'),
          type: "number",
          value: "",
          required: "false",
          visible: true,
          form_number: 2,
          combo: true,
          id_unit: "weightUnit",
          name_unit: this.translate.instant('PRELIMINARY_REQUEST.WeightUnit'),
          selected_unit: "",
          type_unit: "select",
          dropdown_list_unit: this.unit_code_list,
        },
        {
          id: "size",
          name: this.translate.instant('PRELIMINARY_REQUEST.Size'),
          type: "number",
          value: "",
          required: "false",
          visible: true,
          form_number: 2,
          combo: true,
          id_unit: "sizeUnit",
          name_unit: this.translate.instant('PRELIMINARY_REQUEST.SizeUnit'),
          selected_unit: "",
          type_unit: "select",
          dropdown_list_unit: this.unit_code_list,
        },
        {
          id: "shelfLife",
          name: this.translate.instant('PRELIMINARY_REQUEST.ShelfLife'),
          type: "number",
          value: "",
          required: "false",
          visible: true,
          form_number: 2,
          combo: true,
          id_unit: "shelfLifeUnit",
          name_unit: this.translate.instant('PRELIMINARY_REQUEST.ShelfLifeUnit'),
          selected_unit: "",
          type_unit: "select",
          dropdown_list_unit: this.unit_code_list,
        },
        {
          id: "brandName",
          name: this.translate.instant('PRELIMINARY_REQUEST.BrandName'),
          type: "text",
          value: "",
          required: "false",
          visible: true,
          form_number: 2
        },
        {
          id: "substitutes",
          name: this.translate.instant('PRELIMINARY_REQUEST.Substitutes'),
          type: "text",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "annualPrdCap",
          name: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacity'),
          type: "number",
          value: "",
          required: "true",
          visible: true,
          form_number: 2,
          combo: true,
          id_unit: "annualPrdCapUnit",
          name_unit: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacityUnit'),
          selected_unit: "",
          type_unit: "select",
          dropdown_list_unit: this.unit_code_list,
        },
        {
          id: "licPrdCap",
          name: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacity'),
          type: "number",
          value: "",
          required: "false",
          visible: true,
          form_number: 2,
          combo: true,
          id_unit: "licPrdCapUnit",
          name_unit: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacityUnit'),
          selected_unit: "",
          type_unit: "select",
          dropdown_list_unit: this.unit_code_list,
        },
        {
          id: "startCommPrdYear",
          name: this.translate.instant('PRELIMINARY_REQUEST.StartCommercialProductionYear'),
          type: "number_no_decimal",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
        {
          id: "numTargetEndUsers",
          name: this.translate.instant('PRELIMINARY_REQUEST.NumberOfTargetedEndUsers'),
          type: "number",
          value: "",
          required: "true",
          visible: true,
          form_number: 2
        },
      ],
      buttons: [
        {
          name: this.translate.instant('COMMON.Next'),
          type: "button",
          class: "btn-info",
          form_number: 1
        },
        {
          name: this.translate.instant('COMMON.Save'),
          type: "button",
          class: "btn-success",
          form_number: 2,

          handler: (modal_data) => {

            var proposed_products_source_data_array = [];

            var proposed_products_source_data = {
              preliminaryId: this.preliminaryId,
               divisionName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "divisionName")].selected,
              activityName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "activityName")].selected, hsCode: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "hsCode")].selectedId,
              productName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "productName")].value, licCapacity: parseFloat(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licCapacity")].value).toFixed(3),
              unit: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "unit")].selected, mciInd: "", updStatus: "C", rawMaterial: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "rawMaterials")].value,
              usage: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "usage")].value, proInd: "Yes",
              proCapacity: parseFloat(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licCapacity")].value).toFixed(3),
              applications: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "applications")].value,
              users: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "users")].value,
              weight: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "weight")].value,
              weightUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "weight")].selected_unit),
              size: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "size")].value,
              sizeUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "size")].selected_unit),
              shelfLife: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "shelfLife")].value,
              shelfLifeUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "shelfLife")].selected_unit),
              brandName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "brandName")].value,
              substitutes: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "substitutes")].value,
              annualPrdCap: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "annualPrdCap")].value,
              annualPrdCapUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "annualPrdCap")].selected_unit),
              licPrdCap: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licPrdCap")].value,
              licPrdCapUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licPrdCap")].selected_unit),
              startCommPrdYear: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "startCommPrdYear")].value + "",
              numTargetEndUsers: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "numTargetEndUsers")].value + ""
            };

            proposed_products_source_data_array.push(proposed_products_source_data);
            var proposed_products_source_data_2 = _.clone(proposed_products_source_data);

            var unit = this.unit_list.find((o) => o.UOMText === proposed_products_source_data_2["unit"]);
            if (unit)
              proposed_products_source_data_2["unit"] = unit.UOMId;

            var isicActivity = this.isic_activity_list.find((o) =>  o.activityNameAr === proposed_products_source_data_2.activityName||o.activityName === proposed_products_source_data_2.activityName)
            if (isicActivity) {

              proposed_products_source_data_2["divisionId"] = isicActivity.divisionId;
              proposed_products_source_data_2["activityId"] = isicActivity.activityId;

            }

            proposed_products_source_data_2["proInd"] = proposed_products_source_data_2["proInd"] === "Yes" ? "X" : "";

            if (this.proposed_products_source_length == 0)
              this.proposed_products_source.load(proposed_products_source_data_array);

            else
              this.proposed_products_source.add(proposed_products_source_data);

            this.postProducts(proposed_products_source_data_2, event, proposed_products_source_data, "Add");

            // this.proposed_products_source_length++;

            // this.proposed_products_source.refresh();

            // this.startedFilling = 1;

            // var proposed_products_temp_source = [], proposed_products_temp_source_1 = [];

            // this.proposed_products_source.getAll().then((res) => {

            //   proposed_products_temp_source = res;

            //   proposed_products_temp_source_1.push(proposed_products_temp_source[proposed_products_temp_source.length - 1]);

            //   for (var i = 0; i < proposed_products_temp_source.length - 1; i++)
            //     proposed_products_temp_source_1.push(proposed_products_temp_source[i])

            //   proposed_products_temp_source_1.sort(this.commonService.sortArray("-proInd"));

            //   this.proposed_products_source.load(proposed_products_temp_source_1);

            //   this.proposed_products_source.refresh();

            //   // this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

            // });

          }
        }
      ]
    };

    let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
    preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

  }

  postProducts(postData, event, proposed_products_source_data, operation) {
    this.spinnerService.show();
    this.preliminaryRequestService.postPreliminaryRequestProducts(postData)
      .then((res) => (
        this.resolvePostProducts(res, event, proposed_products_source_data, operation),
        this.spinnerService.hide()
      ), err =>
        this.resolveError()
      );
  }

  resolvePostProducts(res, event, proposed_products_source_data, operation) {
    if (res.msgId === "S") {
      this.commonService.showSuccessToast(res["msgText"]);
      if(operation === "Edit"){
        this.proposed_products_source.update(event.data, proposed_products_source_data);

        this.proposed_products_source.refresh();

        this.startedFilling = 1;

        var proposed_products_temp_source = [];

        this.proposed_products_source.getAll().then((res) => {

          proposed_products_temp_source = res;

          proposed_products_temp_source.sort(this.commonService.sortArray("-proInd"));

          this.proposed_products_source.load(proposed_products_temp_source);

          this.proposed_products_source.refresh();

          // this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

        });
      } else if (operation === "Add") {
            this.proposed_products_source_length++;

            this.proposed_products_source.refresh();
            this.startedFilling = 1;
            var proposed_products_temp_source = [], proposed_products_temp_source_1 = [];

            this.proposed_products_source.getAll().then((res) => {

              proposed_products_temp_source = res;

              proposed_products_temp_source_1.push(proposed_products_temp_source[proposed_products_temp_source.length - 1]);

              for (var i = 0; i < proposed_products_temp_source.length - 1; i++)
                proposed_products_temp_source_1.push(proposed_products_temp_source[i])

              proposed_products_temp_source_1.sort(this.commonService.sortArray("-proInd"));

              this.proposed_products_source.load(proposed_products_temp_source_1);

              this.proposed_products_source.refresh();

              //this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

            });
      } else if (operation === "Delete") {
        this.proposed_products_source.remove(this.deleteCancelModalReference.event.data);

        this.proposed_products_source.refresh();

        this.proposed_products_source_length--;

        // this.deleteCancelModalReference.event.data["updStatus"] = "D";

        this.deleted_proposed_products.push(this.deleteCancelModalReference.event.data);

        this.startedFilling = 1;
          }
        }
    else if (res.msgId === "E")
      this.commonService.showFailureToast(res["msgText"]);
    else
      this.commonService.showWarningToast(res["msgText"] ? res["msgText"] : this.translate.instant('COMMON.SomethingWentWrong'));
    }
  findIdFromText(array, text) {
    var temp = _.where(array, { UOMText: text })
    return temp[0] ? temp[0].UOMId : "";
  }

  findTextFromId(array, id) {
    var temp = _.where(array, { UOMId: id });
    return temp[0] ? temp[0].UOMText : "";
  }

  onAdd(table_name) {
    console.log("Add in PRQ");

    let preliminaryRequestModalParams = {};

    let projectOwnershipModalParams = {};

    if (table_name === 'proposed_products') {

      var from = 0;

      if (this.harmonized_code_pop_up_array.length == 0) {

        // this.harmonized_code_pop_up_array = [{
        //   "hsCode": "0101101000",
        //   "hsDespEn": "PURE-BRED BREEDING HORSES OF ARABIC ORIGIN",
        //   "hsDespAr": "خيول من اصل عربي"
        // },
        // {
        //   "hsCode": "0101102000",
        //   "hsDespEn": "OTHER   ORIGINAL HORSES FOR HUMANS",
        //   "hsDespAr": "غيرها من خيول من اصل عربي"
        // },
        // {
        //   "hsCode": "0101109000",
        //   "hsDespEn": "OTHER PURE-BRED BREEDING HORSES OF ARABIC ORIGIN",
        //   "hsDespAr": "غيرها من خيول من أصل عربي"
        // }];

        this.spinnerService.show();

        this.preliminaryRequestService
          .getHSCodeList()
          .then((res) => (this.resolveHSCodeList(res, preliminaryRequestModalParams, [], from)), err => this.resolveError());

      }

      else
        this.callAddProductModal(preliminaryRequestModalParams);

    }

    else if (table_name === 'proposed_ownerships') {

      var proposed_ownerships_temp_source = [];

      var passport_number_list = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].shareHolderType ==  this.translate.instant('COMMON.Individual') &&
            proposed_ownerships_temp_source[i].investorType ==  this.translate.instant('COMMON.Foreigner'))
            passport_number_list.push(proposed_ownerships_temp_source[i].idNumber);

        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.addProposedOwnerships'),

          form_number: 1,

          method: "add",

          api: "owner_micro",

          passport_number_list: passport_number_list,

          inputs: [
            {
              id: "shareHolderType",
              name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderType'),
              type: "select",
              value: this.share_holder_type_code_list,
              selected: "",
              required: "true",
              visible: true,
              form_number: 1
            },
            {
              id: "investorType",
              name: this.translate.instant('PRELIMINARY_REQUEST.InvestorType'),
              type: "radio",
              value: this.investor_type_code_list ,
              selected: "",
              required: "true",
              visible: true,
              form_number: 2
            },
           
            {
              id: "nationalId",
              name: this.translate.instant('PRELIMINARY_REQUEST.NationalId'),
              type: "number_no_decimal",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "iqamaNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
              type: "number_no_decimal",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "date",
              name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
              type: "hijri_date",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "crNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.CompanyNumber'),
              type: "number_no_decimal",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "crIssueDate",
              name: this.translate.instant('PRELIMINARY_REQUEST.CompanyIssueDate'),
              type: "hijri_date",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "name",
              name: this.translate.instant('PRELIMINARY_REQUEST.name'),
              type: "text",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "nationality",
              name: this.translate.instant('PRELIMINARY_REQUEST.Nationality'),
              type: "cc_select",
              value: this.country_name_list,
              selected: "",
              required: "true",
              dropdown: this.country_list,
              visible: true,
              form_number: 2
            },
            {
              id: "percentage",
              name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
              type: "number",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "passportNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.PassportNumber'),
              type: "text",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "passportExpiryDate",
              name: this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDate'),
              type: "greg_date",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "street",
              name: this.translate.instant('PRELIMINARY_REQUEST.Street'),
              type: "text",
              value: "",
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "city",
              name: this.translate.instant('PRELIMINARY_REQUEST.City'),
              type: "select",
              value: "",
              selected: "",
              dropdown: this.city_list,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "districtArea",
              name: this.translate.instant('PRELIMINARY_REQUEST.DistrictArea'),
              type: "text",
              value: "",
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "unitNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.UnitNumber'),
              type: "number_no_decimal",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "buildingNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.BuildingNumber'),
              type: "number_no_decimal",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "additionalNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.AdditionalNumber'),
              type: "number_no_decimal",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "zipCode",
              name: this.translate.instant('PRELIMINARY_REQUEST.PostalCode'),
              type: "text",
              value: "",
              // postalCodeLength: 0,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "phoneNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.PhoneNumber'),
              type: "text",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "faxNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.FaxNumber'),
              type: "text",
              value: "",
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "emailId",
              name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
              type: "email",
              value: "",
              required: "true",
              visible: true,
              form_number: 2
            },
            // {
            //   id: "financialStatementAttachment",
            //   name: this.translate.instant('PRELIMINARY_REQUEST.FinancialStatement'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   form_number: 2
            // },
            // {
            //   id: "RealEstateAttachment",
            //   name: this.translate.instant('PRELIMINARY_REQUEST.RealEstateAttachment'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   form_number: 2
            // },
            // {
            //   id: "StockPortfolioAttachment",
            //   name: this.translate.instant('PRELIMINARY_REQUEST.StockPortfolioAttachment'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   form_number: 2
            // },
            {
              id: "NoObjectionLetter",
              name: this.translate.instant('PRELIMINARY_REQUEST.NoObjectionLetter'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              form_number: 2
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Next'),
              type: "button",
              class: "btn-info",
              form_number: 1
            },

            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",
              form_number: 2,

              handler: (modal_data) => {

                this.spinnerService.show();

                var idNumber_data = "", dob_data = { year: 0, month: 0, day: 0 };

                if (modal_data.inputs[0].selected == this.translate.instant('COMMON.Individual')) {
                  if (modal_data.inputs[1].selected ==  this.translate.instant('COMMON.Saudi National')) {
                    idNumber_data = modal_data.inputs[2].value;
                    dob_data = modal_data.inputs[4].value;
                  }
                  else if (modal_data.inputs[1].selected ==  this.translate.instant('COMMON.Foreigner')) {
                    idNumber_data = modal_data.inputs[10].value;
                    dob_data = this.commonService.returnDateArrayFromGregDateString(modal_data.inputs[11].value);
                  }
                  else {
                    idNumber_data = modal_data.inputs[3].value;
                    dob_data = modal_data.inputs[4].value;
                  }
                }

                else if (modal_data.inputs[0].selected ==   this.translate.instant('COMMON.Company')) {
                  idNumber_data = modal_data.inputs[5].value;
                  dob_data = modal_data.inputs[6].value;
                }

                var proposed_ownerships_source_data = {};

                proposed_ownerships_source_data = {
                  preliminaryId: this.preliminaryId, shareHolderType: modal_data.inputs[0].selected, 
                  investorType: modal_data.inputs[1].selected,  idNumber: idNumber_data,
                  nationality: modal_data.inputs[8].selected, name: modal_data.inputs[7].value,
                  percentage: parseFloat(modal_data.inputs[9].value).toFixed(4), date: dob_data, mciInd: "", updStatus: "C", bankDetails: [], proInd: "Yes", proPercentage: parseFloat(modal_data.inputs[9].value).toFixed(4),
                  city: modal_data.inputs[13].selected, phoneNo: modal_data.inputs[19].value, faxNo: modal_data.inputs[20].value, street: modal_data.inputs[12].value,
                  zipCode: modal_data.inputs[18].value, emailId: modal_data.inputs[21].value, districtArea: modal_data.inputs[14].value,
                  unitNo: modal_data.inputs[15].value, buildingNo: modal_data.inputs[16].value, additionalNo: modal_data.inputs[17].value,
                  nonObjection: false, accessQawaem: false, acknowledgement: false, guiId: this.commonService.returnRandomNumber()
                  //dealWithSidf: false
                };
 
                var shareHolderType = this.share_holder_type_list.find((o) => o.type == proposed_ownerships_source_data["shareHolderType"]|| o.typeAr == proposed_ownerships_source_data["shareHolderType"]);
                if (shareHolderType)
                  proposed_ownerships_source_data["shareHolderType"] = shareHolderType.id;

                var investorType = this.investor_type_list.find((o) => o.type == proposed_ownerships_source_data["investorType"]|| o.typeAr == proposed_ownerships_source_data["investorType"]);
                if (investorType)
                  proposed_ownerships_source_data["investorType"] = investorType.id;
                else 
                { //if(proposed_ownerships_source_data["investorType"]== this.translate.instant('COMMON.Company'))
                var investorType2 = this.company_type_list.find((o) => o.type == proposed_ownerships_source_data["investorType"]|| o.typeAr == proposed_ownerships_source_data["investorType"]);
              if(investorType2)
                proposed_ownerships_source_data["investorType"] = investorType2.id;
              
              }

                var nationality = this.country_list.find((o) => (o.nameEn == proposed_ownerships_source_data["nationality"]||o.nameAr == proposed_ownerships_source_data["nationality"]));
                if (nationality)
                  proposed_ownerships_source_data["nationality"] = nationality.countryKey;

                  console.log(proposed_ownerships_source_data["date"]);
                proposed_ownerships_source_data["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_source_data["date"]);

                proposed_ownerships_source_data["proInd"] = proposed_ownerships_source_data["proInd"] == "Yes" ? "X" : "";

                proposed_ownerships_source_data["bankRelation"] = proposed_ownerships_source_data["bankRelation"] == true ? "X" : "";
                proposed_ownerships_source_data["nonObjection"] = proposed_ownerships_source_data["nonObjection"] == true ? "X" : "";
                proposed_ownerships_source_data["accessQawaem"] = proposed_ownerships_source_data["accessQawaem"] == true ? "X" : "";
                proposed_ownerships_source_data["acknowledgement"] = proposed_ownerships_source_data["acknowledgement"] == true ? "X" : "";
                proposed_ownerships_source_data["dealWithSidf"] = proposed_ownerships_source_data["dealWithSidf"] == true ? "X" : "";

                this.preliminaryRequestService.postOwnersBP(proposed_ownerships_source_data)
                  .then((res) => (this.onOwnersBPUpdate("add", res, "", modal_data, preliminaryRequestModal)), err => this.resolveError());

              }
            }
          ]
        };

        let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
        preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

      });

    }

    else if (table_name === 'representatives') {

      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.addAuthorizedPerson'),

        form_number: 1,

        method: "add",

        inputs: [
          {
            id: "idType",
            name: this.translate.instant('PRELIMINARY_REQUEST.IdType'),
            type: "select",
            value: this.id_type_code_list,
            selected: "",
            required: "true",
            visible: true,
            form_number: 1
          },
          {
            id: "address",
            name: this.translate.instant('PRELIMINARY_REQUEST.name'),
            type: "text_disabled",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "idNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.IdNumber'),
            type: "number_no_decimal",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "dob",
            name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
            type: "hijri_date",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "email",
            name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
            type: "text_disabled",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "mobile",
            name: this.translate.instant('PRELIMINARY_REQUEST.Mobile'),
            type: "text_disabled",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "attachment",
            name: this.translate.instant('PRELIMINARY_REQUEST.Attachment'),
            type: "file_single",
            file: "",
            required: "false",
            visible: true,
            form_number: 2
          },
          {
            id: "dob",
            name: this.translate.instant('PRELIMINARY_REQUEST.LicenseDate'),
            type: "greg_date",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Next'),
            type: "button",
            class: "btn-info",
            form_number: 1
          },
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",
            form_number: 2,

            handler: (modal_data) => {

              var data = {
                documentDefId: 375,
                entityId: modal_data.buPartner,
                entityName: "Project",
                RelatedEntityId: "",
                RelatedEntityName: "Reference",
                operationType: "p"
              };

              this.spinnerService.show();

              if (modal_data.inputs[6].file && modal_data.inputs[6].file != "")
                this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
                  .then(requests => (this.onRepresentativesTableUpload(requests, modal_data, "add", "", data.entityId, "Yes")), err => this.resolveError());

              else
                this.onRepresentativesTableUploadDataBind(modal_data, "add", "", data.entityId, "No");

            }
          }
        ]
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }
    else if (table_name === 'bank_details') {

      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.addBankDetails'),

        form_number: 2,

        api: "owner_micro",

        inputs: [
          {
            id: "accHolder",
            name: this.translate.instant('PRELIMINARY_REQUEST.AccountHolderName'),
            type: "select",
            value: this.non_saudi_owners_list,
            selected: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "bnkAccNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.BankAccountNumber'),
            type: "number_no_decimal",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "bankName",
            name: this.translate.instant('PRELIMINARY_REQUEST.bankName'),
            type: "text",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repName",
            name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeName'),
            type: "text",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repPosition",
            name: this.translate.instant('PRELIMINARY_REQUEST.BankRepresentativePosition'),
            type: "text",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repEmail",
            name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeEmailId'),
            type: "email",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repMobile",
            name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeMobileNumber'),
            type: "text",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "street",
            name: this.translate.instant('PRELIMINARY_REQUEST.branch'),
            type: "text",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "city",
            name: this.translate.instant('PRELIMINARY_REQUEST.City'),
            type: "text",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "country",
            name: this.translate.instant('PRELIMINARY_REQUEST.Country'),
            type: "select",
            value: this.country_name_list,
            selected: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "address",
            name: this.translate.instant('PRELIMINARY_REQUEST.Address'),
            type: "textarea",
            value: "",
            required: "true",
            visible: true,
            form_number: 2
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Next'),
            type: "button",
            class: "btn-info",
            form_number: 1
          },
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",
            form_number: 2,

            handler: (modal_data) => {

              this.spinnerService.show();

              var bank_details_source_data = {
                preliminaryId: this.preliminaryId, accHolder: modal_data.inputs[0].selected, bnkAccNumber: modal_data.inputs[1].value, bankName: modal_data.inputs[2].value,
                repName: modal_data.inputs[3].value, repPosition: modal_data.inputs[4].value, repEmail: modal_data.inputs[5].value, repMobile: modal_data.inputs[6].value, street: modal_data.inputs[7].value,
                city: modal_data.inputs[8].value, country: modal_data.inputs[9].selected, address: modal_data.inputs[10].value, updStatus: "C"
              };

              var country = this.country_list.find((o) => o.nameEn == bank_details_source_data["country"]  ||  o.nameAr == bank_details_source_data["country"]);
              if (country)
                bank_details_source_data["country"] = country.countryKey;

              var proposed_ownerships_temp_source = [];

              this.proposed_ownerships_source.getAll().then((res) => {

                proposed_ownerships_temp_source = res;

                var ownerDetails = proposed_ownerships_temp_source.find((o) => o.name == bank_details_source_data.accHolder);


                var shareHolderType = this.share_holder_type_list.find((o) => o.type == ownerDetails["shareHolderType"]);
                if (shareHolderType)
                  ownerDetails["shareHolderType"] = shareHolderType.id;

                var investorType = this.investor_type_list.find((o) => o.type == ownerDetails["investorType"]);
                if (investorType)
                  ownerDetails["investorType"] = investorType.id;

                var nationality = this.country_list.find((o) => (o.nameEn == ownerDetails["nationality"]||o.nameAr == ownerDetails["nationality"]));
                if (nationality)
                  ownerDetails["nationality"] = nationality.countryKey;

                ownerDetails["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(ownerDetails["date"]);

                ownerDetails["proInd"] = ownerDetails["proInd"] == "Yes" ? "X" : "";

                ownerDetails["bankRelation"] = ownerDetails["bankRelation"] == true ? "X" : "";
                ownerDetails["nonObjection"] = ownerDetails["nonObjection"] == true ? "X" : "";
                ownerDetails["accessQawaem"] = ownerDetails["accessQawaem"] == true ? "X" : "";
                ownerDetails["acknowledgement"] = ownerDetails["acknowledgement"] == true ? "X" : "";
                ownerDetails["dealWithSidf"] = ownerDetails["dealWithSidf"] == true ? "X" : "";


                ownerDetails["bankDetails"] = ownerDetails["bankDetails"] ? ownerDetails["bankDetails"] : [];
                ownerDetails["bankDetails"].push(bank_details_source_data);
console.log('bank_details_source_data');
console.log(ownerDetails["bankDetails"]);
console.log(ownerDetails);

                this.preliminaryRequestService.postOwnersBP(ownerDetails)
                  .then((res1) => (this.onOwnersBPBankUpdate("add", res1, bank_details_source_data, "", preliminaryRequestModal)), err => this.resolveError());

              });

            }
          }
        ]
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else if (table_name === 'documents') {

      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.addDocuments'),

        form_number: 2,

        inputs: [
          {
            id: "type_of_document",
            name: this.translate.instant('PRELIMINARY_REQUEST.TypeofDocument'),
            type: "select",
            value: this.type_of_documents_desc_list,
            selected: "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "attachment",
            name: this.translate.instant('PRELIMINARY_REQUEST.Attachments'),
            type: "file_multiple",
            file: "",
            required: "true",
            visible: true,
            form_number: 2
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Next'),
            type: "button",
            class: "btn-info",
            form_number: 1
          },
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",
            form_number: 2,

            handler: (modal_data) => {

              var documentDefId = "";
 
              var typeOfDocument = this.type_of_documents_list.find((o) => o.descAr == modal_data.inputs[0].selected || o.desc == modal_data.inputs[0].selected);
              if (typeOfDocument)
                documentDefId = typeOfDocument.id;
 
              var data = {
                documentDefId: documentDefId,
                entityId: this.preliminaryId,
                entityName: "Project",
                RelatedEntityId: "",
                RelatedEntityName: "",
                operationType: "p"
              };

              this.spinnerService.show();

              this.communicationsService.uploadDocumentService(modal_data.inputs[1].file, data)
                .then(requests => (this.onDocumentsTableUpload(requests)), err => this.resolveError());

            }
          }
        ]
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else if (table_name === 'real_est') {

      var proposed_ownerships_temp_source = [];

      var bpOwnerList = [];

      var bpOwnerNameList = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner != "") {

            bpOwnerList.push(proposed_ownerships_temp_source[i]);
            bpOwnerNameList.push(proposed_ownerships_temp_source[i].name);

          }

        if (bpOwnerNameList.length > 0) {
        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.AddRealEstate'),

          api: "owner_micro",

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: bpOwnerNameList,
              selected: "",
              required: "true",
            },
            {
              id: "Description",
              name: this.translate.instant('PROJECT_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "PropertyType",
              name: this.translate.instant('PROJECT_INFORMATION.PropertyType'),
              type: "select",
              value: this.property_type_desc_list,
              selected: "",
              required: "true",
            },
            {
              id: "TitleDeed",
              name: this.translate.instant('PROJECT_INFORMATION.TitleDeed'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Country",
              name: this.translate.instant('PROJECT_INFORMATION.Country'),
              type: "cc_select",
              value: this.country_name_list,
              selected: "",
              dropdown: this.country_list,
              required: "true",
            },
            {
              id: "City",
              name: this.translate.instant('PROJECT_INFORMATION.City'),
              type: "select",
              value: "",
              selected: "",
              dropdown: this.city_list,
              required: "true",
            },
            {
              id: "Location",
              name: this.translate.instant('PROJECT_INFORMATION.Location'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Area",
              name: this.translate.instant('PROJECT_INFORMATION.Area'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "PurchasePrice",
              name: this.translate.instant('PROJECT_INFORMATION.PurchasePrice'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "PurchaseDate",
              name: this.translate.instant('PROJECT_INFORMATION.PurchaseDate'),
              type: "greg_date",
              value: "",
              required: "true",
            },
            {
              id: "MarketValue",
              name: this.translate.instant('PROJECT_INFORMATION.MarketValue'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "MarketDate",
              name: this.translate.instant('PROJECT_INFORMATION.MarketValuationDate'),
              type: "greg_date",
              value: "",
              required: "true",
            },
            {
              id: "LandDeedTitleDocument",
              name: this.translate.instant('PROJECT_INFORMATION.LandDeedTitleDocument'),
              type: "file_multiple",
              file: "",
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var selectedOwner = bpOwnerList.find((o) => o.name == modal_data.inputs[0].selected);

                var real_estate_source_data = {};

                real_estate_source_data = {
                  preliminaryId: this.preliminaryId, 
                  projectId: this.inputs.ProjectId, 
                  buPartner: selectedOwner.buPartner,
                  seqNo: selectedOwner.seqNo,
                  Name: modal_data.inputs[0].selected, nameEn: modal_data.inputs[1].value, propertyType: modal_data.inputs[2].selected,
                  country: modal_data.inputs[4].selected, city: modal_data.inputs[5].selected, location: modal_data.inputs[6].value,
                  area: modal_data.inputs[7].value, purchasePrice: modal_data.inputs[8].value,
                  purchaseDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[9].value),
                  currentMarketValue: modal_data.inputs[10].value, currentMarketDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[11].value),
                  titleDeed: modal_data.inputs[3].value,
                  guiId: this.commonService.returnRandomNumber(), updStatus: "C"
                };

                var propertyType = this.property_type_list.find((o) => o.propertyTypeEn == real_estate_source_data["propertyType"]||o.propertyTypeAr == real_estate_source_data["propertyType"]);
                if (propertyType)
                  real_estate_source_data["propertyType"] = propertyType.id;

                var country = this.country_list.find((o) => (o.nameEn == real_estate_source_data["country"]||o.nameAr == real_estate_source_data["country"]));
                if (country)
                  real_estate_source_data["country"] = country.countryKey;

                var post_data = {

                  "realEstateDetails": [{

                    "preliminaryId": real_estate_source_data["preliminaryId"],
                    "projectId": real_estate_source_data["projectId"],
                    "buPartner": real_estate_source_data["buPartner"],
                    
                    "nameEn": real_estate_source_data["nameEn"],
                    "propertyType": real_estate_source_data["propertyType"],
                    "country": real_estate_source_data["country"],
                    "city": real_estate_source_data["city"],
                    "location": real_estate_source_data["location"],
                    "area": real_estate_source_data["area"],
                    "purchasePrice": real_estate_source_data["purchasePrice"],
                    "purchaseDate": real_estate_source_data["purchaseDate"],
                    "currentMarketValue": real_estate_source_data["currentMarketValue"],
                    "currentMarketDate": real_estate_source_data["currentMarketDate"],
                    "titleDeed": real_estate_source_data["titleDeed"],
                    "guiId": real_estate_source_data["guiId"],
                    "updStatus": real_estate_source_data["updStatus"],
                    "seqNo": real_estate_source_data["seqNo"]

                  }]

                };

                this.preliminaryRequestService.postOwnersAddInfo(post_data)
                  .then((res) => (this.resolveRealEstatePost(res, "add", "", modal_data, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };

          let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
        projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;
      }
      else
      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterAtLeastOneOwnerDetails'));
      });

    }

    else if (table_name === 'list_comp') {

      var proposed_ownerships_temp_source = [];

      var bpOwnerList = [];

      var bpOwnerNameList = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner != "") {

            bpOwnerList.push(proposed_ownerships_temp_source[i]);
            bpOwnerNameList.push(proposed_ownerships_temp_source[i].name);

          }

        if (bpOwnerNameList.length > 0) {
        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.AddCompanies'),

          api: "owner_micro",

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: bpOwnerNameList,
              selected: "",
              required: "true",
            },
            {
              id: "CompanyName",
              name: this.translate.instant('PROJECT_INFORMATION.CompanyOrEstablishmentName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "SharePercentage",
              name: this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ShareValue",
              name: this.translate.instant('PROJECT_INFORMATION.ShareholdingValue'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "IndustrialLicense",
              name: this.translate.instant('PROJECT_INFORMATION.CommercialRegistrationNumber'),
              type: "number_no_decimal",
              value: "",
              required: "true",
            },
            {
              id: "IssueDate",
              name: this.translate.instant('PROJECT_INFORMATION.IssueDate'),
              type: "hijri_date",
              value: "",
              required: "true",
            },
            {
              id: "attachments",
              name: this.translate.instant('PROJECT_INFORMATION.Attachments'),
              type: "file_multiple",
              file: "",
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var selectedOwner = bpOwnerList.find((o) => o.name == modal_data.inputs[0].selected);

                var companies_source_data = {};

                companies_source_data = {
                  preliminaryId: this.preliminaryId, projectId: this.inputs.ProjectId,
                  buPartner: selectedOwner.buPartner,
                  seqNo: selectedOwner.seqNo,
                  Name: modal_data.inputs[0].selected, nameEn: modal_data.inputs[1].value, shareValue: modal_data.inputs[3].value,
                  sharePercentage: modal_data.inputs[2].value, crNumber: modal_data.inputs[4].value,
                  crIssueDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(modal_data.inputs[5].value),
                  guiId: this.commonService.returnRandomNumber(), updStatus: "C"
                };

                var post_data = {

                  "companyDetails": [{

                    "preliminaryId": companies_source_data["preliminaryId"],
                    "projectId": companies_source_data["projectId"],
                    "buPartner": companies_source_data["buPartner"],
                    "seqNo": companies_source_data["seqNo"],
                    "nameEn": companies_source_data["nameEn"],
                    "shareValue": companies_source_data["shareValue"],
                    "sharePercentage": companies_source_data["sharePercentage"],
                    "crNumber": companies_source_data["crNumber"],
                    "crIssueDate": companies_source_data["crIssueDate"],
                    "guiId": companies_source_data["guiId"],
                    "updStatus": companies_source_data["updStatus"]

                  }]

                };

                this.preliminaryRequestService.postOwnersAddInfo(post_data)
                  .then((res) => (this.resolveCompaniesPost(res, "add", "", modal_data, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };

          let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
        projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

      }
      else
          this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterAtLeastOneOwnerDetails'));
      });

    }

    else if (table_name === 'other_inv') {

      var proposed_ownerships_temp_source = [];

      var bpOwnerList = [];

      var bpOwnerNameList = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner != "") {

            bpOwnerList.push(proposed_ownerships_temp_source[i]);
            bpOwnerNameList.push(proposed_ownerships_temp_source[i].name);

          }

        if (bpOwnerNameList.length > 0) {
        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.AddOtherInvestments'),

          api: "owner_micro",

          form_number: 1,

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: bpOwnerNameList,
              selected: "",
              required: "true",
              form_number: 1,
            },        
            {
              id: "InvestmentType",
              name: this.translate.instant('PROJECT_INFORMATION.InvestmentType'),
              type: "select",
              value: this.investment_type_desc_list,
              selected: "",
              required: "true",
              form_number: 1,
            },
            {
              id: "Description",
              name: this.translate.instant('PROJECT_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
              form_number: 1,
            },
            {
              id: "InvestmentValue",
              name: this.translate.instant('PROJECT_INFORMATION.InvestmentValue'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
              form_number: 1,
            },
            {
              id: "Quantity",
              name: this.translate.instant('PROJECT_INFORMATION.Quantity'),
              type: "number",
              value: "",
              required: "true",
              form_number: 2,
            },
            {
              id: "MarketPrice",
              name: this.translate.instant('PROJECT_INFORMATION.MarketPrice'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
              form_number: 2,
            },
            {
              id: "TotalMarketValue",
              name: this.translate.instant('PROJECT_INFORMATION.TotalMarketValue'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
              form_number: 2,
            },
            {
              id: "InvestmentProof",
              name: this.translate.instant('PROJECT_INFORMATION.DocumentaryEvidence'),
              type: "file_multiple",
              file: "",
              required: "true",
              form_number: 1,
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var selectedOwner = bpOwnerList.find((o) => o.name == modal_data.inputs[0].selected);

                var other_investments_source_data = {};

                other_investments_source_data = {
                  preliminaryId: this.preliminaryId, projectId: this.inputs.ProjectId, 
                  buPartner: selectedOwner.buPartner,
                  seqNo: selectedOwner.seqNo,
                  Name: modal_data.inputs[0].selected, nameEn: modal_data.inputs[2].value, investmentType: modal_data.inputs[1].selected,
                  value: modal_data.inputs[3].value, quantity: modal_data.inputs[4].value, marketPrice: modal_data.inputs[5].value,
                  totalMarketValue: modal_data.inputs[6].value,
                  guiId: this.commonService.returnRandomNumber(), updStatus: "C"
                };

                var investmentType = this.investment_type_list.find((o) => o.investTypeEn == other_investments_source_data["investmentType"]|| o.investTypeAr == other_investments_source_data["investmentType"]);
                if (investmentType)
                  other_investments_source_data["investmentType"] = investmentType.id;

                var post_data = {

                  "investmentDetails": [{

                    "preliminaryId": other_investments_source_data["preliminaryId"],
                    "projectId": other_investments_source_data["projectId"],
                    "buPartner": other_investments_source_data["buPartner"],
                    "seqNo": other_investments_source_data["seqNo"],
                    "nameEn": other_investments_source_data["nameEn"],
                    "investmentType": other_investments_source_data["investmentType"],
                    "value": other_investments_source_data["value"],
                    "quantity": other_investments_source_data["quantity"],
                    "marketPrice": other_investments_source_data["marketPrice"],
                    "totalMarketValue": other_investments_source_data["totalMarketValue"],
                    "guiId": other_investments_source_data["guiId"],
                    "updStatus": other_investments_source_data["updStatus"]

                  }]

                };

                this.preliminaryRequestService.postOwnersAddInfo(post_data)
                  .then((res) => (this.resolveOtherInvestmentsPost(res, "add", "", modal_data, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };

          let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
        projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;
      }

        else
          this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterAtLeastOneOwnerDetails'));
      });

    }

  }

  checkType() {

    var temp_type = [];

    if (this.inputs.Type) {

      var expansion_type = this.inputs.Type.find((o) => o.id == "E");
      if (expansion_type)
        temp_type.push(expansion_type);

      var modernization_type = this.inputs.Type.find((o) => o.id == "M");
      if (modernization_type)
        temp_type.push(modernization_type);

      var cost_overrun_type = this.inputs.Type.find((o) => o.id == "C");
      if (cost_overrun_type)
        temp_type.push(cost_overrun_type);

      var working_capital_type = this.inputs.Type.find((o) => o.id == "WC");
      if (working_capital_type)
        temp_type.push(working_capital_type);

      var others_type = this.inputs.Type.find((o) => o.id == "OTH");
      if (others_type)
        temp_type.push(others_type);

    }

    if (temp_type.length > 0)
      this.inputs.Type = temp_type;

  }
  resolveRealEstatePost(res, method, event, modal_data, projectOwnershipModal) {

    try {
    if (res.realEstateDetails) {

      if (res.realEstateDetails[0].msgId == "E") {

        this.commonService.showFailureToast(res.realEstateDetails[0].msgText);
        this.spinnerService.hide();

      }

      else {

        if (method == "add" || method == "edit") {

          var data = {
            documentDefId: 121,
            entityId: this.preliminaryId,
            entityName: "Project",
            RelatedEntityId: res.realEstateDetails[0]["guiId"],
            RelatedEntityName: "Reference",
            operationType: "p"
          };

          res.realEstateDetails[0]["Name"] = modal_data.inputs[0].selected;

          if (method == "add") {

            this.communicationsService.uploadDocumentService(modal_data.inputs[12].file, data)
              .then(requests => (this.onRealEstateTableUpload(requests, res.realEstateDetails[0], method, event, projectOwnershipModal)), err => this.resolveError());

          }

          else if (method == "edit") {

            var temp_array = [];

            for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
              if (!(parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ==
                parseInt(event.data.guiId)))
                temp_array.push(this.realEstateTableDocuments.documentList[i]);

            for (var i = 0; i < modal_data.documents.documentList.length; i++)
              temp_array.push(modal_data.documents.documentList[i]);

            this.realEstateTableDocuments.documentList = temp_array;

            if (modal_data.inputs[12].file && modal_data.inputs[12].file != "")
              this.communicationsService.uploadDocumentService(modal_data.inputs[12].file, data)
                .then(requests => (this.onRealEstateTableUpload(requests, res.realEstateDetails[0], method, event, projectOwnershipModal)), err => this.resolveError());

            else
              this.onRealEstateTableUploadBind(res.realEstateDetails[0], method, event, projectOwnershipModal);

          }

        }

        else if (method == "delete") {

          var proposed_ownerships_temp_source = [];

          this.proposed_ownerships_source.getAll().then((res) => {

            proposed_ownerships_temp_source = res;

            var temp_array = [];

            for (var i = 0; i < proposed_ownerships_temp_source.length; i++) {

              if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == this.deleteCancelModalReference.event.data.buPartner)
                for (var j = 0; j < proposed_ownerships_temp_source[i]["realEstateDetails"].length; j++)
                  {if (!(proposed_ownerships_temp_source[i]["realEstateDetails"][j].nameEn == this.deleteCancelModalReference.event.data.nameEn))
                    temp_array.push(proposed_ownerships_temp_source[i]["realEstateDetails"][j]);
                    if (!(proposed_ownerships_temp_source[i]["realEstateDetails"][j].nameAr == this.deleteCancelModalReference.event.data.nameAr))
                    temp_array.push(proposed_ownerships_temp_source[i]["realEstateDetails"][j]);

            }
              proposed_ownerships_temp_source[i]["realEstateDetails"] = temp_array;

            }

            this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

            this.proposed_ownerships_source.refresh();

          });

          this.real_estate_source.remove(this.deleteCancelModalReference.event.data);

          this.real_estate_source.refresh();

          this.real_estate_source_length--;

          if (this.realEstateTableDocuments.documentList.length > 0)
            for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
              if (parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ==
                parseInt(this.deleteCancelModalReference.event.data.guiId)) {

                this.communicationsService.deleteDocumentService
                  ({
                    entityId: this.realEstateTableDocuments.documentList[i].EntityId, refId: this.realEstateTableDocuments.documentList[i].RefId,
                    documentId: this.realEstateTableDocuments.documentList[i].DocumentId, operationType: 'p'
                  })
                  .then(response => (response), err => this.resolveError());

                this.onDeleteConfirmRealEstate(i, this.realEstateTableDocuments);

              }

          this.spinnerService.hide();

        }

      }

    }

    else
      this.resolveError();

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.ResolvingRealEstatePostFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  onRealEstateTableUpload(requests, res, method, event, projectOwnershipModal) {

    try {
    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.realEstateTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onRealEstateTableUploadBind(res, method, event, projectOwnershipModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.RealEstateFileUploadFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  onRealEstateTableUploadBind(real_estate_source_data, method, event, projectOwnershipModal) {

    try {
    if (method == "add") {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == real_estate_source_data.buPartner) {
            if (!proposed_ownerships_temp_source[i]["realEstateDetails"])
              proposed_ownerships_temp_source[i]["realEstateDetails"] = [];

            proposed_ownerships_temp_source[i]["realEstateDetails"].push(real_estate_source_data);

          }

        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

      });

      real_estate_source_data["purchasePrice"] = "SAR " + this.commonService.numberToNumberWithCommas(real_estate_source_data["purchasePrice"]);

      real_estate_source_data["purchaseDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(real_estate_source_data["purchaseDate"]);

      real_estate_source_data["currentMarketValue"] = "SAR " + this.commonService.numberToNumberWithCommas(real_estate_source_data["currentMarketValue"]);

      real_estate_source_data["currentMarketDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(real_estate_source_data["currentMarketDate"]);

      var propertyType = this.property_type_list.find((o) => o.id == real_estate_source_data["propertyType"]);
      if(propertyType&&this.commonService.defaultLanguage==='en')
          real_estate_source_data["propertyType"] = propertyType.propertyTypeEn;
      else if(propertyType&&this.commonService.defaultLanguage==='ar')
          real_estate_source_data["propertyType"] = propertyType.propertyTypeAr;
                
        

      var country = this.country_list.find((o) => (o.countryKey == real_estate_source_data["country"]));
      if (country&&this.commonService.defaultLanguage==='en')
        real_estate_source_data["country"] = country.nameEn;
        if (country&&this.commonService.defaultLanguage==='ar')
        real_estate_source_data["country"] = country.nameAr;


      var real_estate_source_data_array = [];

      real_estate_source_data_array.push(real_estate_source_data);

      if (this.real_estate_source_length == 0)
        this.real_estate_source.load(real_estate_source_data_array);

      else
        this.real_estate_source.add(real_estate_source_data);

      this.real_estate_source_length++;

      this.real_estate_source.refresh();

      var real_estate_temp_source = [], real_estate_temp_source_1 = [];

      this.real_estate_source.getAll().then((res) => {

        real_estate_temp_source = res;

        real_estate_temp_source_1.push(real_estate_temp_source[real_estate_temp_source.length - 1]);

        for (var i = 0; i < real_estate_temp_source.length - 1; i++)
          real_estate_temp_source_1.push(real_estate_temp_source[i]);

        this.real_estate_source.load(real_estate_temp_source_1);

        this.real_estate_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

      });

      this.spinnerService.hide();

      projectOwnershipModal.close();

    }

    else if (method == "edit") {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == real_estate_source_data.buPartner)
            for (var j = 0; j < proposed_ownerships_temp_source[i]["realEstateDetails"].length; j++)
             {
                if (proposed_ownerships_temp_source[i]["realEstateDetails"][j].nameEn == real_estate_source_data.nameEn)
                proposed_ownerships_temp_source[i]["realEstateDetails"][j] = real_estate_source_data;
                if (proposed_ownerships_temp_source[i]["realEstateDetails"][j].nameAr == real_estate_source_data.nameAr)
                proposed_ownerships_temp_source[i]["realEstateDetails"][j] = real_estate_source_data;

      }
        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

      });

      real_estate_source_data["purchasePrice"] = "SAR " + this.commonService.numberToNumberWithCommas(real_estate_source_data["purchasePrice"]);

      real_estate_source_data["purchaseDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(real_estate_source_data["purchaseDate"]);

      real_estate_source_data["currentMarketValue"] = "SAR " + this.commonService.numberToNumberWithCommas(real_estate_source_data["currentMarketValue"]);

      real_estate_source_data["currentMarketDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(real_estate_source_data["currentMarketDate"]);

      var propertyType = this.property_type_list.find((o) => o.id == real_estate_source_data["propertyType"]);
    
        if(propertyType&&this.commonService.defaultLanguage==='en')
            real_estate_source_data["propertyType"] = propertyType.propertyTypeEn;
        else if(propertyType&&this.commonService.defaultLanguage==='ar')
             real_estate_source_data["propertyType"] = propertyType.propertyTypeAr;

                  
      var country = this.country_list.find((o) => (o.countryKey == real_estate_source_data["country"]));
      if (country&&this.commonService.defaultLanguage==='en')
        real_estate_source_data["country"] = country.nameEn;
        if (country&&this.commonService.defaultLanguage==='ar')
        real_estate_source_data["country"] = country.nameAr;


      this.real_estate_source.update(event.data, real_estate_source_data);

      this.real_estate_source.refresh();

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

      projectOwnershipModal.close();

    }

  }
  catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.RealEstateFileUploadBindFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  resolveCompaniesPost(res, method, event, modal_data, projectOwnershipModal) {

    try {
    if (res.companyDetails) {

      if (res.companyDetails[0].msgId == "E") {

        this.commonService.showFailureToast(res.companyDetails[0].msgText);
        this.spinnerService.hide();

      }

      else {

        if (method == "add" || method == "edit") {

          var data = {
            documentDefId: 121,
            entityId: this.preliminaryId,
            entityName: "Project",
            RelatedEntityId: res.companyDetails[0]["guiId"],
            RelatedEntityName: "Reference",
            operationType: "p"
          };

          res.companyDetails[0]["Name"] = modal_data.inputs[0].selected;

          if (method == "add") {

            this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
              .then(requests => (this.onCompaniesTableUpload(requests, res.companyDetails[0], method, event, projectOwnershipModal)), err => this.resolveError());

          }

          else if (method == "edit") {

            var temp_array = [];

            for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
              if (!(parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ==
                parseInt(event.data.guiId)))
                temp_array.push(this.listOfCompaniesTableDocuments.documentList[i]);

            for (var i = 0; i < modal_data.documents.documentList.length; i++)
              temp_array.push(modal_data.documents.documentList[i]);

            this.listOfCompaniesTableDocuments.documentList = temp_array;

            if (modal_data.inputs[6].file && modal_data.inputs[6].file != "")
              this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
                .then(requests => (this.onCompaniesTableUpload(requests, res.companyDetails[0], method, event, projectOwnershipModal)), err => this.resolveError());

            else
              this.onCompaniesTableUploadBind(res.companyDetails[0], method, event, projectOwnershipModal);

          }

        }

        else if (method == "delete") {

          var proposed_ownerships_temp_source = [];

          this.proposed_ownerships_source.getAll().then((res) => {

            proposed_ownerships_temp_source = res;

            var temp_array = [];

            for (var i = 0; i < proposed_ownerships_temp_source.length; i++) {

              if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == this.deleteCancelModalReference.event.data.buPartner)
                for (var j = 0; j < proposed_ownerships_temp_source[i]["companyDetails"].length; j++)
               {
                    if (!(proposed_ownerships_temp_source[i]["companyDetails"][j].nameEn == this.deleteCancelModalReference.event.data.nameEn))
                    temp_array.push(proposed_ownerships_temp_source[i]["companyDetails"][j]);
                    if (!(proposed_ownerships_temp_source[i]["companyDetails"][j].nameAr == this.deleteCancelModalReference.event.data.nameAr))
                    temp_array.push(proposed_ownerships_temp_source[i]["companyDetails"][j]);
 
                 }
              proposed_ownerships_temp_source[i]["companyDetails"] = temp_array;

            }

            this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

            this.proposed_ownerships_source.refresh();

          });

          this.list_companies_source.remove(this.deleteCancelModalReference.event.data);

          this.list_companies_source.refresh();

          this.list_companies_source_length--;

          if (this.listOfCompaniesTableDocuments.documentList.length > 0)
            for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
              if (parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ==
                parseInt(this.deleteCancelModalReference.event.data.guiId)) {

                this.communicationsService.deleteDocumentService
                  ({
                    entityId: this.listOfCompaniesTableDocuments.documentList[i].EntityId, refId: this.listOfCompaniesTableDocuments.documentList[i].RefId,
                    documentId: this.listOfCompaniesTableDocuments.documentList[i].DocumentId, operationType: 'p'
                  })
                  .then(response => (response), err => this.resolveError());

                this.onDeleteConfirmCompanies(i);

              }

          this.spinnerService.hide();

        }

      }

    }

    else
      this.resolveError();

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.ResolvingCompaniesPostFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  onCompaniesTableUpload(requests, res, method, event, projectOwnershipModal) {

    try {
    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.listOfCompaniesTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onCompaniesTableUploadBind(res, method, event, projectOwnershipModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }
  catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.CompaniesUploadFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  onCompaniesTableUploadBind(companies_source_data, method, event, projectOwnershipModal) {

    try {
    if (method == "add") {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == companies_source_data.buPartner) {
            if (!proposed_ownerships_temp_source[i]["companyDetails"])
              proposed_ownerships_temp_source[i]["companyDetails"] = [];

            proposed_ownerships_temp_source[i]["companyDetails"].push(companies_source_data);

          }

        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

      });

      companies_source_data["shareValue"] = "SAR " + this.commonService.numberToNumberWithCommas(companies_source_data["shareValue"]);

      companies_source_data["crIssueDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(companies_source_data["crIssueDate"]);

      var companies_source_data_array = [];

      companies_source_data_array.push(companies_source_data);

      if (this.list_companies_source_length == 0)
        this.list_companies_source.load(companies_source_data_array);

      else
        this.list_companies_source.add(companies_source_data);

      this.list_companies_source_length++;

      this.list_companies_source.refresh();

      var list_companies_temp_source = [], list_companies_temp_source_1 = [];

      this.list_companies_source.getAll().then((res) => {

        list_companies_temp_source = res;

        list_companies_temp_source_1.push(list_companies_temp_source[list_companies_temp_source.length - 1]);

        for (var i = 0; i < list_companies_temp_source.length - 1; i++)
          list_companies_temp_source_1.push(list_companies_temp_source[i]);

        this.list_companies_source.load(list_companies_temp_source_1);

        this.list_companies_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

      });

      this.spinnerService.hide();

      projectOwnershipModal.close();

    }

    else if (method == "edit") {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == companies_source_data.buPartner)
            for (var j = 0; j < proposed_ownerships_temp_source[i]["companyDetails"].length; j++)
                    {
                                    if (proposed_ownerships_temp_source[i]["companyDetails"][j].nameEn == companies_source_data.nameEn)
                proposed_ownerships_temp_source[i]["companyDetails"][j] = companies_source_data;
                    
                if (proposed_ownerships_temp_source[i]["companyDetails"][j].nameAr == companies_source_data.nameAr)
                proposed_ownerships_temp_source[i]["companyDetails"][j] = companies_source_data;

              }
        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

      });

      companies_source_data["shareValue"] = "SAR " + this.commonService.numberToNumberWithCommas(companies_source_data["shareValue"]);

      companies_source_data["crIssueDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(companies_source_data["crIssueDate"]);


      this.list_companies_source.update(event.data, companies_source_data);

      this.list_companies_source.refresh();

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

      projectOwnershipModal.close();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.CompaniesUploadBindFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  resolveOtherInvestmentsPost(res, method, event, modal_data, projectOwnershipModal) {

    try {
    if (res.investmentDetails) {

      if (res.investmentDetails[0].msgId == "E") {

        this.commonService.showFailureToast(res.investmentDetails[0].msgText);
        this.spinnerService.hide();

      }

      else {

        if (method == "add" || method == "edit") {

          var data = {
            documentDefId: 121,
            entityId: this.preliminaryId,
            entityName: "Project",
            RelatedEntityId: res.investmentDetails[0]["guiId"],
            RelatedEntityName: "Reference",
            operationType: "p"
          };

          res.investmentDetails[0]["Name"] = modal_data.inputs[0].selected;

          if (method == "add") {

            this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
              .then(requests => (this.onOtherInvestmentsTableUpload(requests, res.investmentDetails[0], method, event, projectOwnershipModal)), err => this.resolveError());

          }

          else if (method == "edit") {

            var temp_array = [];

            for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
              if (!(parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ==
                parseInt(event.data.guiId)))
                temp_array.push(this.otherInvestmentsTableDocuments.documentList[i]);

            for (var i = 0; i < modal_data.documents.documentList.length; i++)
              temp_array.push(modal_data.documents.documentList[i]);

            this.otherInvestmentsTableDocuments.documentList = temp_array;


            if (modal_data.inputs[7].file && modal_data.inputs[7].file != "")
              this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
                .then(requests => (this.onOtherInvestmentsTableUpload(requests, res.investmentDetails[0], method, event, projectOwnershipModal)), err => this.resolveError());

            else
              this.onOtherInvestmentsTableUploadDataBind(res.investmentDetails[0], method, event, projectOwnershipModal)

          }

        }

        else if (method == "delete") {

          var proposed_ownerships_temp_source = [];

          this.proposed_ownerships_source.getAll().then((res) => {

            proposed_ownerships_temp_source = res;

            var temp_array = [];

            for (var i = 0; i < proposed_ownerships_temp_source.length; i++) {

              if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == this.deleteCancelModalReference.event.data.buPartner)
                for (var j = 0; j < proposed_ownerships_temp_source[i]["investmentDetails"].length; j++)
                  {
                    if (!(proposed_ownerships_temp_source[i]["investmentDetails"][j].nameEn == this.deleteCancelModalReference.event.data.nameEn))
                    temp_array.push(proposed_ownerships_temp_source[i]["investmentDetails"][j]);

                    if (!(proposed_ownerships_temp_source[i]["investmentDetails"][j].nameAr == this.deleteCancelModalReference.event.data.nameAr))
                    temp_array.push(proposed_ownerships_temp_source[i]["investmentDetails"][j]);

            }
              proposed_ownerships_temp_source[i]["investmentDetails"] = temp_array;

            }

            this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

            this.proposed_ownerships_source.refresh();

          });

          this.other_investments_source.remove(this.deleteCancelModalReference.event.data);

          this.other_investments_source.refresh();

          this.other_investments_source_length--;

          if (this.otherInvestmentsTableDocuments.documentList.length > 0)
            for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
              if (parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ==
                parseInt(this.deleteCancelModalReference.event.data.guiId)) {

                this.communicationsService.deleteDocumentService
                  ({
                    entityId: this.otherInvestmentsTableDocuments.documentList[i].EntityId, refId: this.otherInvestmentsTableDocuments.documentList[i].RefId,
                    documentId: this.otherInvestmentsTableDocuments.documentList[i].DocumentId, operationType: 'p'
                  })
                  .then(response => (response), err => this.resolveError());

                this.onDeleteConfirmOtherInvestments(i);

              }

          this.spinnerService.hide();

        }

      }

    }

    else
      this.resolveError();

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.ResolveOtherInvestmentsPostFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }

  onOtherInvestmentsTableUpload(requests, res, method, event, projectOwnershipModal) {
    try {
    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.otherInvestmentsTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onOtherInvestmentsTableUploadDataBind(res, method, event, projectOwnershipModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.OtherInvestmentsUploadFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }

  onOtherInvestmentsTableUploadDataBind(other_investments_source_data, method, event, projectOwnershipModal) {
    try {
    if (method == "add") {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == other_investments_source_data.buPartner) {
            if (!proposed_ownerships_temp_source[i]["investmentDetails"])
              proposed_ownerships_temp_source[i]["investmentDetails"] = [];

            proposed_ownerships_temp_source[i]["investmentDetails"].push(other_investments_source_data);

          }

        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

      });

      var investmentType = this.investment_type_list.find((o) => o.id == other_investments_source_data["investmentType"]);
      if (investmentType)
        other_investments_source_data["investmentType"] = investmentType.investTypeEn;

        
      other_investments_source_data["value"] = other_investments_source_data["value"] ? "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["value"]) : "";

      other_investments_source_data["marketPrice"] = other_investments_source_data["marketPrice"] ? "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["marketPrice"]) : "";
      other_investments_source_data["totalMarketValue"] = other_investments_source_data["totalMarketValue"] ? "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["totalMarketValue"]) : "";

      var other_investments_source_data_array = [];

      other_investments_source_data_array.push(other_investments_source_data);

      if (this.other_investments_source_length == 0)
        this.other_investments_source.load(other_investments_source_data_array);

      else
        this.other_investments_source.add(other_investments_source_data);

      this.other_investments_source_length++;

      this.other_investments_source.refresh();

      var other_investments_temp_source = [], other_investments_temp_source_1 = [];

      this.other_investments_source.getAll().then((res) => {

        other_investments_temp_source = res;

        other_investments_temp_source_1.push(other_investments_temp_source[other_investments_temp_source.length - 1]);

        for (var i = 0; i < other_investments_temp_source.length - 1; i++)
          other_investments_temp_source_1.push(other_investments_temp_source[i]);

        this.other_investments_source.load(other_investments_temp_source_1);

        this.other_investments_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

      });

      this.spinnerService.hide();

      projectOwnershipModal.close();

    }

    else if (method == "edit") {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner == other_investments_source_data.buPartner)
            for (var j = 0; j < proposed_ownerships_temp_source[i]["investmentDetails"].length; j++)
            {
                if (proposed_ownerships_temp_source[i]["investmentDetails"][j].nameEn == other_investments_source_data.nameEn)
                proposed_ownerships_temp_source[i]["investmentDetails"][j] = other_investments_source_data;
                if (proposed_ownerships_temp_source[i]["investmentDetails"][j].nameAr == other_investments_source_data.nameAr)
                proposed_ownerships_temp_source[i]["investmentDetails"][j] = other_investments_source_data;
            }
        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

      });

      var investmentType = this.investment_type_list.find((o) => o.id == other_investments_source_data["investmentType"]);
      if (investmentType&&this.commonService.defaultLanguage === 'en') 
        other_investments_source_data["investmentType"] = investmentType.investTypeEn;
        if (investmentType&&this.commonService.defaultLanguage === 'ar') 
        other_investments_source_data["investmentType"] = investmentType.investTypeAr;

      other_investments_source_data["value"] = other_investments_source_data["value"] ? "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["value"]) : "";

      other_investments_source_data["marketPrice"] = other_investments_source_data["marketPrice"] ? "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["marketPrice"]) : "";
      other_investments_source_data["totalMarketValue"] = other_investments_source_data["totalMarketValue"] ? "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["totalMarketValue"]) : "";

      this.other_investments_source.update(event.data, other_investments_source_data);

      this.other_investments_source.refresh();

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

      projectOwnershipModal.close();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.OtherInvestmentsUploadBindFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }

  // onOwnerBankDealing(event) {

  //   let preliminaryRequestModalParams = {};

  //   preliminaryRequestModalParams = {

  //     header: "Edit MCI / Proposed Ownerships' Disclaimers",

  //     form_number: 2,

  //     method: "edit_owner_bank_dealing",

  //     inputs: [
  //       {
  //         id: "nonObjection",
  //         name: "Non Objection of Information Exchange",
  //         type: "checkbox",
  //         text: "I do here authorize the Saudi Industrial Development Fund (The Fund) to obtain information of all forms and types, as it deems necessary, for solvency creditworthiness assessment. I do also bind myself to provide the Fund with the information it requests me to furnish in the connection. I further confirm my prior knowledge of and consent to disclose and exchange of my information with Saudi Credit Bureau(SIMAH), and / or any other party duly recognized by the Saudi Monetary Agency (SAMA) including SAMA itself.",
  //         value: event.data.nonObjection,
  //         required: "true",
  //         visible: true,
  //         form_number: 2
  //       },
  //       {
  //         id: "accessQawaem",
  //         name: "Access Qawaem",
  //         type: "checkbox",
  //         text: "SIDF shall have the rights to access clients financial statements and information on the Ministry of Commerce and Industry (Qawaem)",
  //         value: event.data.accessQawaem,
  //         required: "true",
  //         visible: true,
  //         form_number: 2
  //       },
  //       {
  //         id: "acknowledgement",
  //         name: "Acknowledgement",
  //         type: "checkbox",
  //         text: "I do here authorize the Saudi Industrial Development Fund (The Fund) to obtain information of all forms and types, as it deems necessary, for solvency creditworthiness assessment. I do also bind myself to provide the Fund with the information it requests me to furnish in the connection. I further confirm my prior knowledge of and consent to disclose and exchange of my information with Saudi Credit Bureau(SIMAH), and / or any other party duly recognized by the Saudi Monetary Agency (SAMA) including SAMA itself",
  //         value: event.data.acknowledgement,
  //         required: "true",
  //         visible: true,
  //         form_number: 2
  //       },
  //       // {
  //       //   id: "dealWithSidf",
  //       //   name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
  //       //   type: "checkbox",
  //       //   text: "I Do have previous dealing with SIDF",
  //       //   value: event.data.nonObjection,
  //       //   required: "true",
  //       //   visible: true,
  //       //   form_number: 2
  //       // }
  //     ],
  //     buttons: [
  //       {
  //         name: this.translate.instant('COMMON.Next'),
  //         type: "button",
  //         class: "btn-info",
  //         form_number: 1
  //       },
  //       {
  //         name: this.translate.instant('COMMON.Save'),
  //         type: "button",
  //         class: "btn-success",
  //         form_number: 2,

  //         handler: (modal_data) => {

  //           var proposed_ownerships_source_data = {
  //             preliminaryId: this.preliminaryId, shareHolderType: event.data.shareHolderType, investorType: event.data.investorType,
  //             idNumber: event.data.idNumber,
  //             nationality: event.data.nationality, name: event.data.name, date: event.data.date,
  //             percentage: event.data.percentage, mciInd: event.data.mciInd == "X" ? "X" : "", updStatus: "U",
  //             proInd: event.data.proInd, proPercentage: event.data.proPercentage,
  //             city: event.data.city, phoneNo: event.data.phoneNo, faxNo: event.data.faxNo, street: event.data.street,
  //             zipCode: event.data.zipCode, emailId: event.data.emailId, districtArea: event.data.districtArea,
  //             unitNo: event.data.unitNo, buildingNo: event.data.buildingNo, additionalNo: event.data.additionalNo,
  //             nonObjection: modal_data.inputs[0].value, accessQawaem: modal_data.inputs[1].value, acknowledgement: modal_data.inputs[2].value,
  //             //dealWithSidf: modal_data.inputs[3].value
  //           };

  //           this.proposed_ownerships_source.update(event.data, proposed_ownerships_source_data);

  //           this.proposed_ownerships_source.refresh();

  //           var proposed_ownerships_temp_source = [];

  //           this.proposed_ownerships_source.getAll().then((res) => {

  //             proposed_ownerships_temp_source = res;

  //             proposed_ownerships_temp_source.sort(this.commonService.sortArray("-proInd"));

  //             this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

  //             this.proposed_ownerships_source.refresh();

  //             this.commonService.showSuccessToast("Edit successful !");

  //           });

  //         }
  //       }
  //     ]
  //   };

  //   let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
  //   preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

  // }

  onDocumentsTableUpload(requests) {
    try {
    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.documentsTableDocuments.documentList.push(requests.data["documentList"][i]);

      }
      this.startedFilling = 1;
      this.spinnerService.hide();

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.DocumentsUploadFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }
  onRepresentativesTableUploadDataBind(modal_data, method, event, EntityId, attachmentInd) {

    try {
    var representatives_source_data = {};

    var representatives_source_data_array = [];

    var dob_data = { year: 0, month: 0, day: 0 };

    if (method == "add") {

      if (modal_data.inputs[0].selected === this.translate.instant('COMMON.National ID')   || modal_data.inputs[0].selected === this.translate.instant('COMMON.Iqama') )
        dob_data = modal_data.inputs[3].value;

      else if (modal_data.inputs[0].selected === this.translate.instant('COMMON.Sagia License')  )
        dob_data = this.commonService.returnDateArrayFromGregDateString(modal_data.inputs[7].value);

      else if (modal_data.inputs[0].selected ===this.translate.instant('COMMON.GCC ID') )
        dob_data = { year: 1409, month: 12, day: 20 };

      representatives_source_data = {
        preliminaryId: this.preliminaryId, idType: modal_data.inputs[0].selected, address: modal_data.inputs[1].value,
        idNumber: modal_data.inputs[2].value, dob: dob_data, email: modal_data.inputs[4].value,
        mobile: modal_data.inputs[5].value, updStatus: "C", mciInd: "No", buPartner: EntityId, attachmentInd: attachmentInd
      };

      representatives_source_data_array.push(representatives_source_data);

      if (this.representatives_source_length == 0)
        this.representatives_source.load(representatives_source_data_array);

      else
        this.representatives_source.add(representatives_source_data);

      this.representatives_source_length++;

      this.representatives_source.refresh();
      this.startedFilling = 1;
            var representatives_temp_source = [], representatives_temp_source_1 = [];

      this.representatives_source.getAll().then((res) => {

        representatives_temp_source = res;

        representatives_temp_source_1.push(representatives_temp_source[representatives_temp_source.length - 1]);

        for (var i = 0; i < representatives_temp_source.length - 1; i++)
          representatives_temp_source_1.push(representatives_temp_source[i]);

        this.representatives_source.load(representatives_temp_source_1);

        this.representatives_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

      });

      this.spinnerService.hide();

    }

    else if (method == "edit") {

      representatives_source_data = {
        preliminaryId: this.preliminaryId, idType: event.data.idType, address: event.data.address,
        idNumber: event.data.idNumber, dob: event.data.dob, email: event.data.email,
        mobile: event.data.mobile, updStatus: event.data.updStatus == "C" ? "C" : "U",
        mciInd: event.data.mciInd == "Yes" ? "Yes" : "No", buPartner: EntityId, attachmentInd: attachmentInd
      };

      this.representatives_source.update(event.data, representatives_source_data);

      this.representatives_source.refresh();

      this.startedFilling = 1;
            this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

      this.spinnerService.hide();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.RepresentativesUploadBindFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }

  onRepresentativesTableUpload(requests, modal_data, method, event, EntityId, attachmentInd) {
    try {
    if (requests.MessType == "S")
      this.onRepresentativesTableUploadDataBind(modal_data, method, event, EntityId, attachmentInd);

    else {

      this.commonService.showFailureToast(requests.message);

      if (!EntityId)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.BUPartnerIDMissing'));

      this.spinnerService.hide();

    }

    }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.RepresentativesUploadFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }
  }

  onOwnersTableUploadDataBind(modal_data, method, event, proposed_ownerships_source_data, preliminaryRequestModal) {
    try {

      proposed_ownerships_source_data["updStatus"] = "";
    if (method == "add") {

      var proposed_ownerships_source_data_array = [];

      proposed_ownerships_source_data_array.push(proposed_ownerships_source_data);

      if (this.proposed_ownerships_source_length == 0)
        this.proposed_ownerships_source.load(proposed_ownerships_source_data_array);

      else
        this.proposed_ownerships_source.add(proposed_ownerships_source_data);

      this.proposed_ownerships_source_length++;

      this.proposed_ownerships_source.refresh();

      var proposed_ownerships_temp_source = [], proposed_ownerships_temp_source_1 = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        proposed_ownerships_temp_source_1.push(proposed_ownerships_temp_source[proposed_ownerships_temp_source.length - 1]);

        for (var i = 0; i < proposed_ownerships_temp_source.length - 1; i++)
          proposed_ownerships_temp_source_1.push(proposed_ownerships_temp_source[i])

        proposed_ownerships_temp_source_1.sort(this.commonService.sortArray("-proInd"));

        this.proposed_ownerships_source.load(proposed_ownerships_temp_source_1);

        this.proposed_ownerships_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

      });

      if (modal_data.inputs[8].selected != 'Saudi Arabia'&&modal_data.inputs[8].selected != 'SA'&&modal_data.inputs[8].selected != 'السعودية')
        this.non_saudi_owners_list.push(modal_data.inputs[7].value);

      this.spinnerService.hide();

      preliminaryRequestModal.close();

    }

    else if (method == "edit") {

      this.proposed_ownerships_source.update(event.data, proposed_ownerships_source_data);

      this.proposed_ownerships_source.refresh();

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        proposed_ownerships_temp_source.sort(this.commonService.sortArray("-proInd"));

        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

      });

      this.spinnerService.hide();

      preliminaryRequestModal.close();

    }

    else if (method == "edit_2") {

      if (modal_data.inputs[8].selected != 'Saudi Arabia'&&modal_data.inputs[8].selected != 'SA'&&modal_data.inputs[8].selected != 'السعودية')
        for (var i = 0; i < this.non_saudi_owners_list.length; i++)
          if (this.non_saudi_owners_list[i] == event.data.name)
            this.non_saudi_owners_list[i] = modal_data.inputs[7].value;

      this.proposed_ownerships_source.update(event.data, proposed_ownerships_source_data);

      this.proposed_ownerships_source.refresh();

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        proposed_ownerships_temp_source.sort(this.commonService.sortArray("-proInd"));

        this.proposed_ownerships_source.load(proposed_ownerships_temp_source);

        this.proposed_ownerships_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

      });

      this.spinnerService.hide();

      preliminaryRequestModal.close();

    }

  }
    catch (err) {

      this.spinnerService.hide();
      var errorMessage = this.translate.instant('PRELIMINARY_REQUEST.OwnersUploadPostFailed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);

    }

  }
  onOwnersBPUpdate(method, res, event, modal_data, preliminaryRequestModal) {

    if (res.msgId == "E") {

      this.commonService.showFailureToast(res.msgText);
      this.spinnerService.hide();

    }

    else {

      var shareHolderType = this.share_holder_type_list.find((o) => o.id == res["shareHolderType"]);
      if (shareHolderType)
        res["shareHolderType"] = shareHolderType.type;

      var investorType = this.investor_type_list.find((o) => o.id == res["investorType"]);
      if (investorType)
        res["investorType"] = investorType.type;

      var nationality = this.country_list.find((o) => (o.countryKey == res["nationality"]));
      if (nationality&&this.commonService.defaultLanguage === 'en')  
        res["nationality"] = nationality.nameEn;
        if (nationality&&this.commonService.defaultLanguage === 'ar')  
        res["nationality"] = nationality.nameAr;

      res["date"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res["date"]);

      res["proInd"] = res["proInd"] == "X" ? "Yes" : "No";

      res["bankRelation"] = res["bankRelation"] == "X" ? true : false;
      res["nonObjection"] = res["nonObjection"] == "X" ? true : false;
      res["accessQawaem"] = res["accessQawaem"] == "X" ? true : false;
      res["acknowledgement"] = res["acknowledgement"] == "X" ? true : false;
      res["dealWithSidf"] = res["dealWithSidf"] == "X" ? true : false;

      // var data_fs = {
      //   documentDefId: 372,
      //   entityId: this.preliminaryId,
      //   entityName: "Project",
      //   RelatedEntityId: res["guiId"],
      //   RelatedEntityName: "Reference",
      //   operationType: "p"
      // };

      // var data_rs = {
      //   documentDefId: 399,
      //   entityId: this.preliminaryId,
      //   entityName: "Project",
      //   RelatedEntityId: data_fs.RelatedEntityId,
      //   RelatedEntityName: "Reference",
      //   operationType: "p"
      // };

      // var data_sp = {
      //   documentDefId: 400,
      //   entityId: this.preliminaryId,
      //   entityName: "Project",
      //   RelatedEntityId: data_fs.RelatedEntityId,
      //   RelatedEntityName: "Reference",
      //   operationType: "p"
      // };

      var data_no = {
        documentDefId: 401,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: res["guiId"],
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      if (method == "add") {

        // if (modal_data.inputs[22].file && modal_data.inputs[22].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[22].file, data_fs)
        //     .then(requests => (this.onOwnersTableUpload1(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        // else if (modal_data.inputs[23].file && modal_data.inputs[23].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[23].file, data_rs)
        //     .then(requests => (this.onOwnersTableUpload2(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        // else if (modal_data.inputs[24].file && modal_data.inputs[24].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[24].file, data_sp)
        //     .then(requests => (this.onOwnersTableUpload3(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        if (modal_data.inputs[22].file && modal_data.inputs[22].file != "")
          this.communicationsService.uploadDocumentService(modal_data.inputs[22].file, data_no)
            .then(requests => (this.onOwnersTableUpload4(requests, modal_data, method, event, preliminaryRequestModal, res)), err => this.resolveError());

        else
          this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

      }

      else if (method == "edit") {

        var temp_array = [];

        for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
          if (!(parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.guiId)))
            temp_array.push(this.ownersTableDocuments.documentList[i]);

        for (var i = 0; i < modal_data.documents.documentList.length; i++)
          temp_array.push(modal_data.documents.documentList[i]);

        this.ownersTableDocuments.documentList = temp_array;

        // if (modal_data.inputs[24].file && modal_data.inputs[24].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[24].file, data_fs)
        //     .then(requests => (this.onOwnersTableUpload1(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        // else if (modal_data.inputs[25].file && modal_data.inputs[25].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[25].file, data_rs)
        //     .then(requests => (this.onOwnersTableUpload2(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        // else if (modal_data.inputs[26].file && modal_data.inputs[26].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[26].file, data_sp)
        //     .then(requests => (this.onOwnersTableUpload3(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        if (modal_data.inputs[24].file && modal_data.inputs[24].file != "")
          this.communicationsService.uploadDocumentService(modal_data.inputs[24].file, data_no)
            .then(requests => (this.onOwnersTableUpload4(requests, modal_data, method, event, preliminaryRequestModal, res)), err => this.resolveError());

        else
          this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

      }

      else if (method == "edit_2") {

        if ((event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ||
          (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ||
          (event.data.shareHolderType == "Company") || (event.data.shareHolderType == "شركة")) {

          var temp_array = [];

          for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
            if (!(parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(event.data.guiId)))
              temp_array.push(this.ownersTableDocuments.documentList[i]);

          for (var i = 0; i < modal_data.documents.documentList.length; i++)
            temp_array.push(modal_data.documents.documentList[i]);

          this.ownersTableDocuments.documentList = temp_array;

        }

        // if (modal_data.inputs[22].file && modal_data.inputs[22].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[22].file, data_fs)
        //     .then(requests => (this.onOwnersTableUpload1(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        // else if (modal_data.inputs[23].file && modal_data.inputs[23].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[23].file, data_rs)
        //     .then(requests => (this.onOwnersTableUpload2(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        // else if (modal_data.inputs[24].file && modal_data.inputs[24].file != "")
        //   this.communicationsService.uploadDocumentService(modal_data.inputs[24].file, data_sp)
        //     .then(requests => (this.onOwnersTableUpload3(requests, modal_data, method, event, data_fs.RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

        if (modal_data.inputs[22].file && modal_data.inputs[22].file != "")
          this.communicationsService.uploadDocumentService(modal_data.inputs[22].file, data_no)
            .then(requests => (this.onOwnersTableUpload4(requests, modal_data, method, event, preliminaryRequestModal, res)), err => this.resolveError());

        else
          this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

      }

    }

  }

  onOwnersBPBankUpdate(method, res, bank_details_source_data, event, preliminaryRequestModal) {

    if (res.MsgId == "E") {

      this.commonService.showSuccessToast(res.MsgText);
      this.spinnerService.hide();

    }

    else {

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        var ownerDetails = proposed_ownerships_temp_source.find((o) => o.name == bank_details_source_data.accHolder);

        var shareHolderType = this.share_holder_type_list.find((o) => o.id == ownerDetails["shareHolderType"]);
        if (shareHolderType)
          ownerDetails["shareHolderType"] = shareHolderType.type;

        var investorType = this.investor_type_list.find((o) => o.id == ownerDetails["investorType"]);
        if (investorType)
          ownerDetails["investorType"] = investorType.type;

        var nationality = this.country_list.find((o) => (o.countryKey == ownerDetails["nationality"]));
        if (nationality&&this.commonService.defaultLanguage === 'en')  
          ownerDetails["nationality"] = nationality.nameEn;
          if (nationality&&this.commonService.defaultLanguage === 'ar')  
          ownerDetails["nationality"] = nationality.nameAr;
        ownerDetails["date"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(ownerDetails["date"]);

        ownerDetails["proInd"] = ownerDetails["proInd"] == "X" ? "Yes" : "No";

        ownerDetails["bankRelation"] = ownerDetails["bankRelation"] == "X" ? true : false;
        ownerDetails["nonObjection"] = ownerDetails["nonObjection"] == "X" ? true : false;
        ownerDetails["accessQawaem"] = ownerDetails["accessQawaem"] == "X" ? true : false;
        ownerDetails["acknowledgement"] = ownerDetails["acknowledgement"] == "X" ? true : false;
        ownerDetails["dealWithSidf"] = ownerDetails["dealWithSidf"] == "X" ? true : false;

        bank_details_source_data["updStatus"] = "";
        if (method == "add") {

          var bank_details_source_data_array = [];

          var country = this.country_list.find((o) => o.countryKey == bank_details_source_data["country"]);
          if (country&&this.commonService.defaultLanguage === 'en')  
            bank_details_source_data["country"] = country.nameEn;
            if (country&&this.commonService.defaultLanguage === 'ar')  
            bank_details_source_data["country"] = country.nameAr;

          bank_details_source_data_array.push(bank_details_source_data);

          if (this.bank_details_source_length == 0)
            this.bank_details_source.load(bank_details_source_data_array);

          else
            this.bank_details_source.add(bank_details_source_data);

          this.bank_details_source_length++;

          this.bank_details_source.refresh();

          var bank_details_temp_source = [], bank_details_temp_source_1 = [];

          this.bank_details_source.getAll().then((res) => {

            bank_details_temp_source = res;

            bank_details_temp_source_1.push(bank_details_temp_source[bank_details_temp_source.length - 1]);

            for (var i = 0; i < bank_details_temp_source.length - 1; i++)
              bank_details_temp_source_1.push(bank_details_temp_source[i]);

            this.bank_details_source.load(bank_details_temp_source_1);

            this.bank_details_source.refresh();

            this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.AdditionSuccessful'));

          });

          this.spinnerService.hide();

          preliminaryRequestModal.close();

        }

        else if (method == "edit") {

          var country = this.country_list.find((o) => o.countryKey == bank_details_source_data["country"]);
          if (country&&this.commonService.defaultLanguage === 'en')
            bank_details_source_data["country"] = country.nameEn;
            if (country&&this.commonService.defaultLanguage === 'ar')
            bank_details_source_data["country"] = country.nameAr;

          this.bank_details_source.update(event.data, bank_details_source_data);

          this.bank_details_source.refresh();

          this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

          this.spinnerService.hide();

          preliminaryRequestModal.close();

        }

      });

    }

  }

  onOwnersTableUpload1(requests, modal_data, method, event, RelatedEntityId, preliminaryRequestModal, res) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.ownersTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      var data_rs = {
        documentDefId: 399,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: RelatedEntityId,
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      var data_sp = {
        documentDefId: 400,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: RelatedEntityId,
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      var data_no = {
        documentDefId: 401,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: RelatedEntityId,
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      var index = method == "edit" ? 25 : 23;

      if (modal_data.inputs[index].file && modal_data.inputs[index].file != "")
        this.communicationsService.uploadDocumentService(modal_data.inputs[index].file, data_rs)
          .then(requests1 => (this.onOwnersTableUpload2(requests1, modal_data, method, event, RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

      else if (modal_data.inputs[index + 1].file && modal_data.inputs[index + 1].file != "")
        this.communicationsService.uploadDocumentService(modal_data.inputs[index + 1].file, data_sp)
          .then(requests1 => (this.onOwnersTableUpload3(requests1, modal_data, method, event, RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

      else if (modal_data.inputs[index + 2].file && modal_data.inputs[index + 2].file != "")
        this.communicationsService.uploadDocumentService(modal_data.inputs[index + 2].file, data_no)
          .then(requests1 => (this.onOwnersTableUpload4(requests1, modal_data, method, event, preliminaryRequestModal, res)), err => this.resolveError());

      else
        this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }

  onOwnersTableUpload2(requests, modal_data, method, event, RelatedEntityId, preliminaryRequestModal, res) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.ownersTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      var data_sp = {
        documentDefId: 400,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: RelatedEntityId,
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      var data_no = {
        documentDefId: 401,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: RelatedEntityId,
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      var index = method == "edit" ? 26 : 24;

      if (modal_data.inputs[index].file && modal_data.inputs[index].file != "")
        this.communicationsService.uploadDocumentService(modal_data.inputs[index].file, data_sp)
          .then(requests1 => (this.onOwnersTableUpload3(requests1, modal_data, method, event, RelatedEntityId, preliminaryRequestModal, res)), err => this.resolveError());

      else if (modal_data.inputs[index + 1].file && modal_data.inputs[index + 1].file != "")
        this.communicationsService.uploadDocumentService(modal_data.inputs[index + 1].file, data_no)
          .then(requests1 => (this.onOwnersTableUpload4(requests1, modal_data, method, event, preliminaryRequestModal, res)), err => this.resolveError());

      else
        this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }

  onOwnersTableUpload3(requests, modal_data, method, event, RelatedEntityId, preliminaryRequestModal, res) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.ownersTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      var data_no = {
        documentDefId: 401,
        entityId: this.preliminaryId,
        entityName: "Project",
        RelatedEntityId: RelatedEntityId,
        RelatedEntityName: "Reference",
        operationType: "p"
      };

      var index = method == "edit" ? 27 : 25;

      if (modal_data.inputs[index].file && modal_data.inputs[index].file != "")
        this.communicationsService.uploadDocumentService(modal_data.inputs[index].file, data_no)
          .then(requests1 => (this.onOwnersTableUpload4(requests1, modal_data, method, event, preliminaryRequestModal, res)), err => this.resolveError());

      else
        this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }

  onOwnersTableUpload4(requests, modal_data, method, event, preliminaryRequestModal, res) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.ownersTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onOwnersTableUploadDataBind(modal_data, method, event, res, preliminaryRequestModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }

  callEditProductModal(preliminaryRequestModalParams, event, from) {

    var temp_id = "";

    var temp_array = [];

    var temp_selected_product_name = _.find(this.harmonized_code_pop_up_array, function (num) { return num.hsCode === event.data.hsCode });
    var temp_selected_desc_product_name = temp_selected_product_name ? temp_selected_product_name.hsDespEn : "";
    for (var i = 0; i < this.isic_division_list.length; i++)
      if (this.isic_division_list[i].divisionName === event.data.divisionName)
        temp_id = this.isic_division_list[i].id;

    for (var i = 0; i < this.isic_activity_list.length; i++)
      if (this.isic_activity_list[i].divisionId == temp_id)
        temp_array.push(this.isic_activity_list[i].activityName);
console.log(event.data);
    switch (from) {

      case 1:

        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.EditMCIProducts'),

          form_number: 2,

          inputs: [
            {
              id: "proInd",
              name: this.translate.instant('PRELIMINARY_REQUEST.ProposedProduct'),
              type: "select",
              value: "Yes,No".split(","),
              selected: event.data.proInd,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "divisionName",
              name: this.translate.instant('PRELIMINARY_REQUEST.mainActivity'),
              type: "harmonized_code_pop_up",
              value: this.isic_division_list,
              selected: event.data.divisionName,
              required: "true",
              visible: true,
              form_number: 2,
              placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectMainActivity'),
              code: "mainActivity",
              eventData: { divisionName: event.data.divisionNameAr, id: event.data.divisionId }
            },
            {
              id: "activityName",
              name: this.translate.instant('PRELIMINARY_REQUEST.subActivity'),
              type: "harmonized_code_pop_up",
              value: this.isic_activity_list,
              selected: event.data.activityName,
              required: "true",
              visible: true,
              form_number: 2,
              placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectSubActivity'),
              code: "subActivity"
            },
            {
              id: "hsCode",
              name: this.translate.instant('PRELIMINARY_REQUEST.harmonizedCode'),
              type: this.inputs.TypeOfLicenseChecked == this.finalLicense ? "text_disabled" : "harmonized_code_pop_up",
              selected: event.data.hsCode + " - " + temp_selected_desc_product_name,
              selectedId: event.data.hsCode,
              value: this.inputs.TypeOfLicenseChecked == this.finalLicense ? event.data.hsCode : this.harmonized_code_pop_up_array,
              required: "true",
              visible: true,
              form_number: 2,
              placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectHarmonizedCode'),
              code: "HSCode"
            },
            {
              id: "productName",
              name: this.translate.instant('PRELIMINARY_REQUEST.productName'),
              type: this.inputs.TypeOfLicenseChecked == this.finalLicense ? "text_disabled" : "text",
              product_type: "mci",
              value: event.data.productName,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "licCapacity",
              name: this.translate.instant('PRELIMINARY_REQUEST.licenseCapacity'),
              type: "number_three_decimal",
              value: parseFloat(event.data.licCapacity).toFixed(3),
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "proCapacity",
              name: this.translate.instant('PRELIMINARY_REQUEST.proposedCapacity'),
              type: "number_three_decimal",
              value: parseFloat(event.data.proCapacity).toFixed(3),
              required: "true",
              visible: true,
              form_number: event.data.proInd == "Yes" ? 2 : 1
            },
            {
              id: "unit",
              name: this.translate.instant('PRELIMINARY_REQUEST.unitOfMeasure'),
              type: "select",
              value: this.unit_code_list,
              selected: event.data.unit,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "rawMaterials",
              name: this.translate.instant('PRELIMINARY_REQUEST.rawMaterials'),
              type: "text",
              value: event.data.rawMaterial,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "usage",
              name: this.translate.instant('PRELIMINARY_REQUEST.Usage'),
              type: "textarea",
              value: event.data.usage,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "applications",
              name: this.translate.instant('PRELIMINARY_REQUEST.Applications'),
              type: "text",
              value: event.data.applications,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "users",
              name: this.translate.instant('PRELIMINARY_REQUEST.Users'),
              type: "text",
              value: event.data.users,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "weight",
              name: this.translate.instant('PRELIMINARY_REQUEST.Weight'),
              type: "number",
              value: +event.data.weight + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "weightUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.WeightUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.weightUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "size",
              name: this.translate.instant('PRELIMINARY_REQUEST.Size'),
              type: "number",
              value: +event.data.size + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "sizeUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.SizeUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.sizeUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "shelfLife",
              name: this.translate.instant('PRELIMINARY_REQUEST.ShelfLife'),
              type: "number",
              value: +event.data.shelfLife + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "shelfLifeUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.ShelfLifeUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.shelfLifeUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "brandName",
              name: this.translate.instant('PRELIMINARY_REQUEST.BrandName'),
              type: "text",
              value: event.data.brandName,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "substitutes",
              name: this.translate.instant('PRELIMINARY_REQUEST.Substitutes'),
              type: "text",
              value: event.data.substitutes,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "annualPrdCap",
              name: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacity'),
              type: "number",
              value: +event.data.annualPrdCap + "",
              required: "true",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "annualPrdCapUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacityUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.annualPrdCapUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            
            {
              id: "licPrdCap",
              name: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacity'),
              type: "number",
              value: +event.data.licPrdCap + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "licPrdCapUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacityUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.licPrdCapUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "startCommPrdYear",
              name: this.translate.instant('PRELIMINARY_REQUEST.StartCommercialProductionYear'),
              type: "number_no_decimal",
              value: event.data.startCommPrdYear,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "numTargetEndUsers",
              name: this.translate.instant('PRELIMINARY_REQUEST.NumberOfTargetedEndUsers'),
              type: "number",
              value: event.data.numTargetEndUsers,
              required: "true",
              visible: true,
              form_number: 2
            },
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Next'),
              type: "button",
              class: "btn-info",
              form_number: 1
            },
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",
              form_number: 2,

              handler: (modal_data) => {

                var proposed_products_source_data = {
                  preliminaryId: this.preliminaryId, divisionName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "divisionName")].selected,
                  activityName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "activityName")].selected, hsCode: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "hsCode")].selectedId,
                  productName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "productName")].value, licCapacity: parseFloat(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licCapacity")].value).toFixed(3),
                  unit: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "unit")].selected, mciInd: (event.data.mciInd == "X" ? "X" : ""), updStatus: "U",
                  proInd: modal_data.inputs[0].selected, proCapacity: parseFloat(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "proCapacity")].value).toFixed(3),
                  rawMaterial: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "rawMaterials")].value, usage: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "usage")].value,
                  applications: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "applications")].value,
                  users: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "users")].value,
                  weight: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "weight")].value,
                  weightUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "weight")].selected_unit),
                  size: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "size")].value,
                  sizeUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "size")].selected_unit),
                  shelfLife: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "shelfLife")].value,
                  shelfLifeUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "shelfLife")].selected_unit),
                  brandName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "brandName")].value,
                  substitutes: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "substitutes")].value,
                  annualPrdCap: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "annualPrdCap")].value,
                  annualPrdCapUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "annualPrdCap")].selected_unit),
                  licPrdCap: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licPrdCap")].value,
                  licPrdCapUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licPrdCap")].selected_unit),
                  startCommPrdYear: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "startCommPrdYear")].value + "",
                  numTargetEndUsers: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "numTargetEndUsers")].value + "",
                  seqNo: event.data.seqNo ? event.data.seqNo : ""
                };

                var proposed_products_source_data_2 = _.clone(proposed_products_source_data);

                var unit = this.unit_list.find((o) => o.UOMText === proposed_products_source_data_2["unit"]);
                if (unit)
                  proposed_products_source_data_2["unit"] = unit.UOMId;


                var isicActivity = this.isic_activity_list.find((o) => o.activityNameAr === proposed_products_source_data_2.activityName|| o.activityName === proposed_products_source_data_2.activityName)

                if (isicActivity) {

                  proposed_products_source_data_2["divisionId"] = isicActivity.divisionId;
                  proposed_products_source_data_2["activityId"] = isicActivity.activityId;

                }

                proposed_products_source_data_2["proInd"] = proposed_products_source_data_2["proInd"] === "Yes" ? "X" : "";

                this.postProducts(proposed_products_source_data_2, event, proposed_products_source_data, "Edit");

              }
            }
          ]
        };

        let preliminaryRequestModal1 = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
        preliminaryRequestModal1.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

        break;

      case 2:

        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.EditProposedProducts'),

          form_number: 2,

          inputs: [
            {
              id: "divisionName",
              name: this.translate.instant('PRELIMINARY_REQUEST.mainActivity'),
              type: "harmonized_code_pop_up",
              value: this.isic_division_list,
              selected: event.data.divisionName,
              required: "true",
              visible: true,
              form_number: 2,
              placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectMainActivity'),
              code: "mainActivity",
              eventData: { divisionName: event.data.divisionName, id: event.data.divisionId }
            },
            {
              id: "activityName",
              name: this.translate.instant('PRELIMINARY_REQUEST.subActivity'),
              type: "harmonized_code_pop_up",
              value: this.isic_activity_list,
              selected: event.data.activityName,
              required: "true",
              visible: true,
              form_number: 2,
              placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectSubActivity'),
              code: "subActivity"
            },
            {
              id: "hsCode",
              name: this.translate.instant('PRELIMINARY_REQUEST.harmonizedCode'),
              type: "harmonized_code_pop_up",
              selected: event.data.hsCode + " - " + temp_selected_desc_product_name,
              selectedId: event.data.hsCode,
              value: this.harmonized_code_pop_up_array,
              required: "true",
              visible: true,
              form_number: 2,
              placeholder: this.translate.instant('PRELIMINARY_REQUEST.SelectHarmonizedCode'),
              code: "HSCode"
            },
            {
              id: "productName",
              name: this.translate.instant('PRELIMINARY_REQUEST.productName'),
              type: "text",
              product_type: "proposed",
              value: event.data.productName,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "licCapacity",
              name: this.translate.instant('PRELIMINARY_REQUEST.licenseCapacity'),
              type: "number_three_decimal",
              value: parseFloat(event.data.licCapacity).toFixed(3),
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "unit",
              name: this.translate.instant('PRELIMINARY_REQUEST.unitOfMeasure'),
              type: "select",
              value: this.unit_code_list,
              selected: event.data.unit,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "rawMaterials",
              name: this.translate.instant('PRELIMINARY_REQUEST.rawMaterials'),
              type: "text",
              value: event.data.rawMaterial,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "usage",
              name: this.translate.instant('PRELIMINARY_REQUEST.Usage'),
              type: "textarea",
              value: event.data.usage,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "applications",
              name: this.translate.instant('PRELIMINARY_REQUEST.Applications'),
              type: "text",
              value: event.data.applications,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "users",
              name: this.translate.instant('PRELIMINARY_REQUEST.Users'),
              type: "text",
              value: event.data.users,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "weight",
              name: this.translate.instant('PRELIMINARY_REQUEST.Weight'),
              type: "number",
              value: +event.data.weight + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "weightUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.WeightUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.weightUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "size",
              name: this.translate.instant('PRELIMINARY_REQUEST.Size'),
              type: "number",
              value: +event.data.size + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "sizeUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.SizeUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.sizeUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "shelfLife",
              name: this.translate.instant('PRELIMINARY_REQUEST.ShelfLife'),
              type: "number",
              value: +event.data.shelfLife + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "shelfLifeUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.ShelfLifeUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.shelfLifeUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "brandName",
              name: this.translate.instant('PRELIMINARY_REQUEST.BrandName'),
              type: "text",
              value: event.data.brandName,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "substitutes",
              name: this.translate.instant('PRELIMINARY_REQUEST.Substitutes'),
              type: "text",
              value: event.data.substitutes,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "annualPrdCap",
              name: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacity'),
              type: "number",
              value: +event.data.annualPrdCap + "",
              required: "true",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "annualPrdCapUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacityUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.annualPrdCapUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "licPrdCap",
              name: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacity'),
              type: "number",
              value: +event.data.licPrdCap + "",
              required: "false",
              visible: true,
              form_number: 2,
              combo: true,
              id_unit: "licPrdCapUnit",
              name_unit: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacityUnit'),
              selected_unit: this.findTextFromId(this.unit_list, event.data.licPrdCapUnit),
              type_unit: "select",
              dropdown_list_unit: this.unit_code_list,
            },
            {
              id: "startCommPrdYear",
              name: this.translate.instant('PRELIMINARY_REQUEST.StartCommercialProductionYear'),
              type: "number_no_decimal",
              value: event.data.startCommPrdYear,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "numTargetEndUsers",
              name: this.translate.instant('PRELIMINARY_REQUEST.NumberOfTargetedEndUsers'),
              type: "number",
              value: event.data.numTargetEndUsers,
              required: "true",
              visible: true,
              form_number: 2
            },
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Next'),
              type: "button",
              class: "btn-info",
              form_number: 1
            },
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",
              form_number: 2,

              handler: (modal_data) => {

                var proposed_products_source_data = {
                  preliminaryId: this.preliminaryId, divisionName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "divisionName")].selected,
                  activityName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "activityName")].selected, hsCode: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "hsCode")].selectedId,
                  productName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "productName")].value, licCapacity: parseFloat(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licCapacity")].value).toFixed(3),
                  unit: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "unit")].selected, mciInd: (event.data.mciInd == "X" ? "X" : ""),
                  updStatus: event.data.updStatus == "C" ? "C" : "U", rawMaterial: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "rawMaterials")].value, usage: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "usage")].value,
                  proInd: "Yes", proCapacity: parseFloat(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licCapacity")].value).toFixed(3),
                  applications: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "applications")].value,
                  users: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "users")].value,
                  weight: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "weight")].value,
                  weightUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "weight")].selected_unit),
                  size: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "size")].value,
                  sizeUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "size")].selected_unit),
                  shelfLife: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "shelfLife")].value,
                  shelfLifeUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "shelfLife")].selected_unit),
                  brandName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "brandName")].value,
                  substitutes: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "substitutes")].value,
                  annualPrdCap: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "annualPrdCap")].value,
                  annualPrdCapUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "annualPrdCap")].selected_unit),
                  licPrdCap: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licPrdCap")].value,
                  licPrdCapUnit: this.findIdFromText(this.unit_list, modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "licPrdCap")].selected_unit),
                  startCommPrdYear: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "startCommPrdYear")].value + "",
                  numTargetEndUsers: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "numTargetEndUsers")].value + "",
                  seqNo: event.data.seqNo ? event.data.seqNo : ""
                };

                var proposed_products_source_data_2 = _.clone(proposed_products_source_data);

                var unit = this.unit_list.find((o) => o.UOMText === proposed_products_source_data_2["unit"]);
                if (unit)
                  proposed_products_source_data_2["unit"] = unit.UOMId;

                var isicActivity = this.isic_activity_list.find((o) =>o.activityNameAr === proposed_products_source_data_2.activityName|| o.activityName === proposed_products_source_data_2.activityName)
                if (isicActivity) {

                  proposed_products_source_data_2["divisionId"] = isicActivity.divisionId;
                  proposed_products_source_data_2["activityId"] = isicActivity.activityId;

                }

                proposed_products_source_data_2["proInd"] = proposed_products_source_data_2["proInd"] === "Yes" ? "X" : "";

                this.postProducts(proposed_products_source_data_2, event, proposed_products_source_data, "Edit");

                // this.proposed_products_source.update(event.data, proposed_products_source_data);

                // this.proposed_products_source.refresh();

                // this.startedFilling = 1;

                // var proposed_products_temp_source = [];

                // this.proposed_products_source.getAll().then((res) => {

                //   proposed_products_temp_source = res;

                //   proposed_products_temp_source.sort(this.commonService.sortArray("-proInd"));

                //   this.proposed_products_source.load(proposed_products_temp_source);

                //   this.proposed_products_source.refresh();

                //   // this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.EditSuccessful'));

                // });

              }
            }
          ]
        };

        let preliminaryRequestModal2 = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
        preliminaryRequestModal2.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

        break;

      default:

        break;

    }

  }

  onEdit(event, table_name) {
console.log(event);
    let preliminaryRequestModalParams = {};

    let projectOwnershipModalParams = {};

    if (event.data.mciInd == "X" && table_name === 'proposed_products') {

      var from = 1;

      if (this.harmonized_code_pop_up_array.length == 0) {

        // this.harmonized_code_pop_up_array = [{
        //   "hsCode": "0101101000",
        //   "hsDespEn": "PURE-BRED BREEDING HORSES OF ARABIC ORIGIN",
        //   "hsDespAr": "خيول من اصل عربي"
        // },
        // {
        //   "hsCode": "0101102000",
        //   "hsDespEn": "OTHER   ORIGINAL HORSES FOR HUMANS",
        //   "hsDespAr": "غيرها من خيول من اصل عربي"
        // },
        // {
        //   "hsCode": "0101109000",
        //   "hsDespEn": "OTHER PURE-BRED BREEDING HORSES OF ARABIC ORIGIN",
        //   "hsDespAr": "غيرها من خيول من أصل عربي"
        // }];

        this.spinnerService.show();

        this.preliminaryRequestService
          .getHSCodeList()
          .then((res) => (this.resolveHSCodeList(res, preliminaryRequestModalParams, event, from)), err => this.resolveError());

      }

      else
        this.callEditProductModal(preliminaryRequestModalParams, event, from);

    }

    // else if (event.data.mciInd == "X" && event.data.editInd && event.data.editInd == "X" && table_name === 'proposed_ownerships') {

    //   if ((event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ||
    //     (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ||
    //     (event.data.shareHolderType == "Company") || (event.data.shareHolderType == "شركة")) {

    //     var temp_documents = { url: "", documentList: [], method: "" };

    //     temp_documents.method = "edit";

    //     temp_documents.url = this.ownersTableDocuments.url;

    //     for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
    //       if (parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ==
    //         parseInt(event.data.guiId))
    //         temp_documents.documentList.push(this.ownersTableDocuments.documentList[i]);

    //     preliminaryRequestModalParams = {

    //       header: this.translate.instant('PRELIMINARY_REQUEST.EditMCIOwnerships'),

    //       form_number: 2,

    //       documents: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? temp_documents
    //         : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? temp_documents
    //           : (event.data.shareHolderType == "Company") ? temp_documents : (event.data.shareHolderType == "شركة") ? temp_documents : "no_documents",

    //       method: "edit",

    //       api: "owner_micro",

    //       inputs: [
    //         {
    //           id: "proInd",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.ProposedOwner'),
    //           type: "text_disabled",
    //           value: event.data.proInd,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "shareHolderType",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderType'),
    //           type: "text_disabled",
    //           value: event.data.shareHolderType,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "investorType",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.InvestorType'),
    //           type: "text_disabled",
    //           value: event.data.investorType,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual") ? 2 : 1
    //         },
    //         {
    //           id: "nationalId",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.NationalId'),
    //           type: "text_disabled",
    //           value: event.data.idNumber,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2 : 1,
    //         },
    //         {
    //           id: "iqamaNumber",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
    //           type: "text_disabled",
    //           value: event.data.idNumber,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Resident") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Resident") ? 2 : 1,
    //         },
    //         {
    //           id: "date",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
    //           type: "text_disabled",
    //           value: this.commonService.returnDateStringFromDateArray(event.data.date),
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2 : 1,
    //         },
    //         {
    //           id: "crNumber",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.CompanyNumber'),
    //           type: "text_disabled",
    //           value: event.data.idNumber,
    //           required: "false",
    //           visible: true,
    //           form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
    //         },
    //         {
    //           id: "crIssueDate",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.CompanyIssueDate'),
    //           type: "text_disabled",
    //           value: this.commonService.returnDateStringFromDateArray(event.data.date),
    //           required: "false",
    //           visible: true,
    //           form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
    //         },
    //         {
    //           id: "name",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.name'),
    //           type: "text_disabled",
    //           value: event.data.name,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "nationality",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.Nationality'),
    //           type: "text_disabled",
    //           value: event.data.nationality,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "percentage",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
    //           type: "text_disabled",
    //           value: parseFloat(event.data.percentage).toFixed(4),
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "proPercentage",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentage'),
    //           type: "text_disabled",
    //           value: parseFloat(event.data.proPercentage).toFixed(4),
    //           required: "false",
    //           visible: true,
    //           form_number: event.data.proInd == "Yes" ? 2 : 1
    //         },
    //         {
    //           id: "passportNumber",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.PassportNumber'),
    //           type: "text_disabled",
    //           value: event.data.idNumber,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 2 : 1,
    //         },
    //         {
    //           id: "passportExpiryDate",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDate'),
    //           type: "text_disabled",
    //           value: this.commonService.returnDateStringFromDateArray(event.data.date),
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 2 : 1,
    //         },
    //         {
    //           id: "street",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.Street'),
    //           type: "text_disabled",
    //           value: event.data.street,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "city",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.City'),
    //           type: "text_disabled",
    //           value: event.data.city,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "districtArea",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.DistrictArea'),
    //           type: "text_disabled",
    //           value: event.data.districtArea,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2,
    //         },
    //         {
    //           id: "unitNo",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.UnitNumber'),
    //           type: "text_disabled",
    //           value: event.data.unitNo,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
    //         },
    //         {
    //           id: "buildingNo",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.BuildingNumber'),
    //           type: "text_disabled",
    //           value: event.data.buildingNo,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
    //         },
    //         {
    //           id: "additionalNo",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.AdditionalNumber'),
    //           type: "text_disabled",
    //           value: event.data.additionalNo,
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
    //         },
    //         {
    //           id: "zipCode",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.PostalCode'),
    //           type: "text_disabled",
    //           value: event.data.zipCode,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "phoneNo",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.PhoneNumber'),
    //           type: "text_disabled",
    //           value: event.data.phoneNo,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "faxNo",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.FaxNumber'),
    //           type: "text_disabled",
    //           value: event.data.faxNo,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         {
    //           id: "emailId",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
    //           type: "text_disabled",
    //           value: event.data.emailId,
    //           required: "false",
    //           visible: true,
    //           form_number: 2
    //         },
    //         // {
    //         //   id: "financialStatementAttachment",
    //         //   name: this.translate.instant('PRELIMINARY_REQUEST.FinancialStatement'),
    //         //   type: "file_multiple",
    //         //   file: "",
    //         //   required: "false",
    //         //   visible: true,
    //         //   form_number: 2
    //         // },
    //         // {
    //         //   id: "RealEstateAttachment",
    //         //   name: this.translate.instant('PRELIMINARY_REQUEST.RealEstateAttachment'),
    //         //   type: "file_multiple",
    //         //   file: "",
    //         //   required: "false",
    //         //   visible: true,
    //         //   form_number: 2
    //         // },
    //         // {
    //         //   id: "StockPortfolioAttachment",
    //         //   name: this.translate.instant('PRELIMINARY_REQUEST.StockPortfolioAttachment'),
    //         //   type: "file_multiple",
    //         //   file: "",
    //         //   required: "false",
    //         //   visible: true,
    //         //   form_number: 2
    //         // },
    //         {
    //           id: "NoObjectionLetter",
    //           name: this.translate.instant('PRELIMINARY_REQUEST.NoObjectionLetter'),
    //           type: "file_multiple",
    //           file: "",
    //           required: "false",
    //           visible: true,
    //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? 2
    //             : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2
    //               : (event.data.shareHolderType == "Company") ? 2 : (event.data.shareHolderType == "شركة") ? 2 : 1,
    //         }
    //       ],
    //       buttons: [
    //         {
    //           name: this.translate.instant('COMMON.Next'),
    //           type: "button",
    //           class: "btn-info",
    //           form_number: 1
    //         },
    //         {
    //           name: this.translate.instant('COMMON.Save'),
    //           type: "button",
    //           class: "btn-success",
    //           form_number: 2,

    //           handler: (modal_data) => {

    //             this.spinnerService.show();

    //             event.data["proInd"] = "Yes";

    //             event.data["guiId"] = event.data.guiId ? event.data.guiId : this.commonService.returnRandomNumber();

    //             event.data["updStatus"] = "U";

    //             var proposed_ownerships_source_data = event.data;

    //             var shareHolderType = this.share_holder_type_list.find((o) => o.type == proposed_ownerships_source_data["shareHolderType"]);
    //             if (shareHolderType)
    //               proposed_ownerships_source_data["shareHolderType"] = shareHolderType.id;

    //             var investorType = this.investor_type_list.find((o) => o.type == proposed_ownerships_source_data["investorType"]);
    //             if (investorType)
    //               proposed_ownerships_source_data["investorType"] = investorType.id;

    //             var nationality = this.country_list.find((o) => (o.nameEn == proposed_ownerships_source_data["nationality"]));
    //             if (nationality)
    //               proposed_ownerships_source_data["nationality"] = nationality.countryKey;

    //             proposed_ownerships_source_data["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_source_data["date"]);

    //             proposed_ownerships_source_data["proInd"] = proposed_ownerships_source_data["proInd"] == "Yes" ? "X" : "";

    //             proposed_ownerships_source_data["bankRelation"] = proposed_ownerships_source_data["bankRelation"] == true ? "X" : "";
    //             proposed_ownerships_source_data["nonObjection"] = proposed_ownerships_source_data["nonObjection"] == true ? "X" : "";
    //             proposed_ownerships_source_data["accessQawaem"] = proposed_ownerships_source_data["accessQawaem"] == true ? "X" : "";
    //             proposed_ownerships_source_data["acknowledgement"] = proposed_ownerships_source_data["acknowledgement"] == true ? "X" : "";
    //             proposed_ownerships_source_data["dealWithSidf"] = proposed_ownerships_source_data["dealWithSidf"] == true ? "X" : "";

    //             this.preliminaryRequestService.postOwnersBP(proposed_ownerships_source_data)
    //               .then((res) => (this.onOwnersBPUpdate("edit", res, event, modal_data, preliminaryRequestModal)), err => this.resolveError());

    //           }
    //         }
    //       ]
    //     };

    //     let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    //     preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    //   }

    //   else
    //     this.commonService.showFailureToast("This Ownership's details cannot be edited !");

    // }

    else if (event.data.mciInd == "X" && table_name === 'proposed_ownerships') {

      var temp_key = "";

      var temp_array = [];

      // var postalCodeLength = 0;

      for (var i = 0; i < this.country_list.length; i++)
       { if (this.country_list[i].nameEn === event.data.nationality) {

          temp_key = this.country_list[i].countryKey;
        }
        if (this.country_list[i].nameAr === event.data.nationality) {

          temp_key = this.country_list[i].countryKey;
        }
      }
      for (var i = 0; i < this.city_list.length; i++){
        if (this.city_list[i].countryKey === temp_key){
          if(this.commonService.defaultLanguage === 'en')
          temp_array.push(this.city_list[i].cityNameEn);
          if(this.commonService.defaultLanguage === 'ar')
          temp_array.push(this.city_list[i].cityNameAr);
        }
      }


      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "edit";

      temp_documents.url = this.ownersTableDocuments.url;


      for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
        if (parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.guiId))
          temp_documents.documentList.push(this.ownersTableDocuments.documentList[i]);


      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.EditMCIOwnerships'),

        form_number: 2,

        documents: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? temp_documents
          : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? temp_documents
            : (event.data.shareHolderType == "Company") ? temp_documents : (event.data.shareHolderType == "شركة") ? temp_documents : "no_documents",

        method: "edit",

        api: "owner_micro",

        inputs: [
          {
            id: "proInd",
            name: this.translate.instant('PRELIMINARY_REQUEST.ProposedOwner'),
            type: "select",
            value: "Yes,No".split(","),
            selected: event.data.proInd,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "shareHolderType",
            name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderType'),
            type: this.inputs.TypeOfLicenseChecked == this.sagiaLicense ? "select" : "text_disabled",
            value: this.inputs.TypeOfLicenseChecked == this.sagiaLicense ? this.share_holder_type_code_list : event.data.shareHolderType,
            selected: event.data.shareHolderType,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "investorType",
            name: this.translate.instant('PRELIMINARY_REQUEST.InvestorType'),
            type: this.inputs.TypeOfLicenseChecked == this.sagiaLicense ? "radio" : "text_disabled",
            value: this.inputs.TypeOfLicenseChecked == this.sagiaLicense ? this.investor_type_code_list : event.data.investorType,
            selected: event.data.investorType,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == this.translate.instant('COMMON.Individual')) ? 2 : 1
          },
          {
            id: "nationalId",
            name: this.translate.instant('PRELIMINARY_REQUEST.NationalId'),
            type: this.inputs.TypeOfLicenseChecked == this.finalLicense ? "text_disabled" : "number_no_decimal",
            value: event.data.idNumber,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == this.translate.instant('COMMON.Individual') && event.data.investorType == this.translate.instant('COMMON.Saudi National')) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2 : 1,
          },
          {
            id: "iqamaNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
            type: this.inputs.TypeOfLicenseChecked == this.finalLicense ? "text_disabled" : "number_no_decimal",
            value: event.data.idNumber,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == this.translate.instant('COMMON.Individual') && event.data.investorType ==this.translate.instant('COMMON.Resident') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Resident") ? 2 : 1,
          },
          {
            id: "date",
            name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
            type: "hijri_date",
            value: event.data.date,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == this.translate.instant('COMMON.Individual') && event.data.investorType == this.translate.instant('COMMON.Saudi National')) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2 : 1,
          },
          {
            id: "crNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.CompanyNumber'),
            type: this.inputs.TypeOfLicenseChecked == this.finalLicense ? "text_disabled" : "number_no_decimal",
            value: event.data.idNumber,
            required: "true",
            visible: true,
            form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
          },
          {
            id: "crIssueDate",
            name: this.translate.instant('PRELIMINARY_REQUEST.CompanyIssueDate'),
            type: "hijri_date",
            value: event.data.date,
            required: "true",
            visible: true,
            form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
          },
          {
            id: "name",
            name: this.translate.instant('PRELIMINARY_REQUEST.name'),
            type: "text",
            value: event.data.name,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "nationality",
            name: this.translate.instant('PRELIMINARY_REQUEST.Nationality'),
            type: "cc_select",
            value: this.country_name_list,
            selected: event.data.nationality,
            dropdown: this.country_list,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "percentage",
            name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
            type: event.data.percentage ? "text_disabled" : "number",
            value: event.data.percentage ? parseFloat(event.data.percentage).toFixed(4) : "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "proPercentage",
            name: this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentage'),
            type: "number",
            value: parseFloat(event.data.proPercentage).toFixed(4),
            required: "true",
            visible: true,
            form_number: event.data.proInd == "Yes" ? 2 : 1
          },
          {
            id: "passportNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.PassportNumber'),
            type: this.inputs.TypeOfLicenseChecked == this.finalLicense ? "text_disabled" : "text",
            value: event.data.idNumber,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 2 : 1,
          },
          {
            id: "passportExpiryDate",
            name: this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDate'),
            type: "greg_date",
            value: this.commonService.returnGregDateStringFromDateArray(event.data.date),
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 2 : 1,
          },
          {
            id: "street",
            name: this.translate.instant('PRELIMINARY_REQUEST.Street'),
            type: "text",
            value: event.data.street,
            required: "false",
            visible: true,
            form_number: 2
          },
          {
            id: "city",
            name: this.translate.instant('PRELIMINARY_REQUEST.City'),
            type: "select",
            value: temp_array,
            selected: event.data.city,
            dropdown: this.city_list,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "districtArea",
            name: this.translate.instant('PRELIMINARY_REQUEST.DistrictArea'),
            type: "text",
            value: event.data.districtArea,
            required: "false",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : 2,
          },
          {
            id: "unitNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.UnitNumber'),
            type: "number_no_decimal",
            value: event.data.unitNo,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : 2
          },
          {
            id: "buildingNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.BuildingNumber'),
            type: "number_no_decimal",
            value: event.data.buildingNo,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : 2
          },
          {
            id: "additionalNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.AdditionalNumber'),
            type: "number_no_decimal",
            value: event.data.additionalNo,
            required: "true",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 1 : 2
          },
          {
            id: "zipCode",
            name: this.translate.instant('PRELIMINARY_REQUEST.PostalCode'),
            type: "text",
            value: event.data.zipCode,
            // postalCodeLength: postalCodeLength,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "phoneNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.PhoneNumber'),
            type: "text",
            value: event.data.phoneNo,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "faxNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.FaxNumber'),
            type: "text",
            value: event.data.faxNo,
            required: "false",
            visible: true,
            form_number: 2
          },
          {
            id: "emailId",
            name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
            type: "email",
            value: event.data.emailId,
            required: "true",
            visible: true,
            form_number: 2
          },
          // {
          //   id: "financialStatementAttachment",
          //   name: this.translate.instant('PRELIMINARY_REQUEST.FinancialStatement'),
          //   type: "file_multiple",
          //   file: "",
          //   required: "false",
          //   visible: true,
          //   form_number: 2
          // },
          // {
          //   id: "RealEstateAttachment",
          //   name: this.translate.instant('PRELIMINARY_REQUEST.RealEstateAttachment'),
          //   type: "file_multiple",
          //   file: "",
          //   required: "false",
          //   visible: true,
          //   form_number: 2
          // },
          // {
          //   id: "StockPortfolioAttachment",
          //   name: this.translate.instant('PRELIMINARY_REQUEST.StockPortfolioAttachment'),
          //   type: "file_multiple",
          //   file: "",
          //   required: "false",
          //   visible: true,
          //   form_number: 2
          // },
          {
            id: "NoObjectionLetter",
            name: this.translate.instant('PRELIMINARY_REQUEST.NoObjectionLetter'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == this.translate.instant('COMMON.Saudi National') ) ? 2
              : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Saudi National') ) ? 2
                : (event.data.shareHolderType == "Company") ? 2 : (event.data.shareHolderType == "شركة") ? 2 : 1,
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Next'),
            type: "button",
            class: "btn-info",
            form_number: 1
          },
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",
            form_number: 2,

            handler: (modal_data) => {

              this.spinnerService.show();

              var idNumber_data = "", dob_data = { year: 0, month: 0, day: 0 };

              if (modal_data.inputs[1].selected ==  this.translate.instant('COMMON.Individual') )
                if (modal_data.inputs[2].selected ==  this.translate.instant('COMMON.Saudi National')) {
                  idNumber_data = modal_data.inputs[3].value;
                  dob_data = modal_data.inputs[5].value;
                }
                else if (modal_data.inputs[2].selected ==  this.translate.instant('COMMON.Foreigner') ) {
                  idNumber_data = modal_data.inputs[12].value;
                  dob_data = this.commonService.returnDateArrayFromGregDateString(modal_data.inputs[13].value);
                }
                else {
                  idNumber_data = modal_data.inputs[4].value;
                  dob_data = modal_data.inputs[5].value;
                }

              else if (modal_data.inputs[1].selected ==  this.translate.instant('COMMON.Company')) {
                idNumber_data = modal_data.inputs[6].value;
                dob_data = modal_data.inputs[7].value;
              }

              var proposed_ownerships_source_data = {};

              proposed_ownerships_source_data = {
                preliminaryId: this.preliminaryId, shareHolderType: modal_data.inputs[1].selected, investorType: modal_data.inputs[2].selected, idNumber: idNumber_data,
                nationality: modal_data.inputs[9].selected, name: modal_data.inputs[8].value, date: dob_data,
                percentage: parseFloat(modal_data.inputs[10].value).toFixed(4), mciInd: "X", updStatus: "U", proInd: modal_data.inputs[0].selected, proPercentage: parseFloat(modal_data.inputs[11].value).toFixed(4),
                city: modal_data.inputs[15].selected, phoneNo: modal_data.inputs[21].value, faxNo: modal_data.inputs[22].value, street: modal_data.inputs[14].value,
                zipCode: modal_data.inputs[20].value, emailId: modal_data.inputs[23].value, districtArea: modal_data.inputs[16].value,
                unitNo: modal_data.inputs[17].value, buildingNo: modal_data.inputs[18].value, additionalNo: modal_data.inputs[19].value,
                nonObjection: event.data.nonObjection, accessQawaem: event.data.accessQawaem, acknowledgement: event.data.acknowledgement,
                guiId: event.data.guiId ? event.data.guiId : this.commonService.returnRandomNumber(), bankDetails: event.data.bankDetails ? event.data.bankDetails : [],
                 buPartner: event.data.buPartner ? event.data.buPartner : "",
                 seqNo: event.data.seqNo ? event.data.seqNo : ""
                //dealWithSidf: event.data.dealWithSidf
              };

              var shareHolderType = this.share_holder_type_list.find((o) => o.type == proposed_ownerships_source_data["shareHolderType"]);
              if (shareHolderType)
                proposed_ownerships_source_data["shareHolderType"] = shareHolderType.id;

              var investorType = this.investor_type_list.find((o) => o.type == proposed_ownerships_source_data["investorType"]);
              if (investorType)
                proposed_ownerships_source_data["investorType"] = investorType.id;

              var nationality = this.country_list.find((o) => (o.nameEn == proposed_ownerships_source_data["nationality"]||o.nameAr == proposed_ownerships_source_data["nationality"]));
              if (nationality)
                proposed_ownerships_source_data["nationality"] = nationality.countryKey;

              proposed_ownerships_source_data["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_source_data["date"]);

              proposed_ownerships_source_data["proInd"] = proposed_ownerships_source_data["proInd"] == "Yes" ? "X" : "";

              proposed_ownerships_source_data["bankRelation"] = proposed_ownerships_source_data["bankRelation"] == true ? "X" : "";
              proposed_ownerships_source_data["nonObjection"] = proposed_ownerships_source_data["nonObjection"] == true ? "X" : "";
              proposed_ownerships_source_data["accessQawaem"] = proposed_ownerships_source_data["accessQawaem"] == true ? "X" : "";
              proposed_ownerships_source_data["acknowledgement"] = proposed_ownerships_source_data["acknowledgement"] == true ? "X" : "";
              proposed_ownerships_source_data["dealWithSidf"] = proposed_ownerships_source_data["dealWithSidf"] == true ? "X" : "";

              this.preliminaryRequestService.postOwnersBP(proposed_ownerships_source_data)
                .then((res) => (this.onOwnersBPUpdate("edit", res, event, modal_data, preliminaryRequestModal)), err => this.resolveError());

            }
          }
        ]
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else {

      if (table_name === 'proposed_products') {

        var from = 2;

        if (this.harmonized_code_pop_up_array.length == 0) {

          // this.harmonized_code_pop_up_array = [{
          //   "hsCode": "0101101000",
          //   "hsDespEn": "PURE-BRED BREEDING HORSES OF ARABIC ORIGIN",
          //   "hsDespAr": "خيول من اصل عربي"
          // },
          // {
          //   "hsCode": "0101102000",
          //   "hsDespEn": "OTHER   ORIGINAL HORSES FOR HUMANS",
          //   "hsDespAr": "غيرها من خيول من اصل عربي"
          // },
          // {
          //   "hsCode": "0101109000",
          //   "hsDespEn": "OTHER PURE-BRED BREEDING HORSES OF ARABIC ORIGIN",
          //   "hsDespAr": "غيرها من خيول من أصل عربي"
          // }];

          this.spinnerService.show();

          this.preliminaryRequestService
            .getHSCodeList()
            .then((res) => (this.resolveHSCodeList(res, preliminaryRequestModalParams, event, from)), err => this.resolveError());

        }

        else
          this.callEditProductModal(preliminaryRequestModalParams, event, from);

      }

      // else if (event.data.editInd && event.data.editInd == "X" && table_name === 'proposed_ownerships') {

      //   if ((event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ||
      //     (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ||
      //     (event.data.shareHolderType == "Company") || (event.data.shareHolderType == "شركة")) {

      //     var temp_documents = { url: "", documentList: [], method: "" };

      //     temp_documents.method = "edit";

      //     temp_documents.url = this.ownersTableDocuments.url;

      //     for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
      //       if (parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ==
      //         parseInt(event.data.guiId))
      //         temp_documents.documentList.push(this.ownersTableDocuments.documentList[i]);

      //     preliminaryRequestModalParams = {

      //       header: this.translate.instant('PRELIMINARY_REQUEST.EditProposedOwnerships'),

      //       form_number: 2,

      //       method: "add",

      //       api: "owner_micro",

      //       documents: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? temp_documents
      //         : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? temp_documents
      //           : (event.data.shareHolderType == "Company") ? temp_documents : (event.data.shareHolderType == "شركة") ? temp_documents : "no_documents",

      //       inputs: [
      //         {
      //           id: "shareHolderType",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderType'),
      //           type: "text_disabled",
      //           value: event.data.shareHolderType,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "investorType",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.InvestorType'),
      //           type: "text_disabled",
      //           value: event.data.investorType,
      //           required: "false",
      //           visible: true,
      //           form_number: 2,
      //         },
      //         {
      //           id: "nationalId",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.NationalId'),
      //           type: "text_disabled",
      //           value: event.data.idNumber,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2 : 1,
      //         },
      //         {
      //           id: "iqamaNumber",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
      //           type: "text_disabled",
      //           value: event.data.idNumber,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Resident") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Resident") ? 2 : 1,
      //         },
      //         {
      //           id: "date",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
      //           type: "text_disabled",
      //           value: this.commonService.returnDateStringFromDateArray(event.data.date),
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2 : 1,
      //         },
      //         {
      //           id: "crNumber",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.CompanyNumber'),
      //           type: "text_disabled",
      //           value: event.data.idNumber,
      //           required: "false",
      //           visible: true,
      //           form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
      //         },
      //         {
      //           id: "crIssueDate",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.CompanyIssueDate'),
      //           type: "text_disabled",
      //           value: this.commonService.returnDateStringFromDateArray(event.data.date),
      //           required: "false",
      //           visible: true,
      //           form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
      //         },
      //         {
      //           id: "name",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.name'),
      //           type: "text_disabled",
      //           value: event.data.name,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "nationality",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.Nationality'),
      //           type: "text_disabled",
      //           value: event.data.nationality,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "percentage",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
      //           type: "text_disabled",
      //           value: parseFloat(event.data.percentage).toFixed(4),
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "passportNumber",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.PassportNumber'),
      //           type: "text_disabled",
      //           value: event.data.idNumber,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 2 : 1
      //         },
      //         {
      //           id: "passportExpiryDate",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDate'),
      //           type: "text_disabled",
      //           value: this.commonService.returnDateStringFromDateArray(event.data.date),
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 2 : 1
      //         },
      //         {
      //           id: "street",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.Street'),
      //           type: "text_disabled",
      //           value: event.data.street,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "city",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.City'),
      //           type: "text_disabled",
      //           value: event.data.city,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "districtArea",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.DistrictArea'),
      //           type: "text_disabled",
      //           value: event.data.districtArea,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
      //         },
      //         {
      //           id: "unitNo",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.UnitNumber'),
      //           type: "text_disabled",
      //           value: event.data.unitNo,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
      //         },
      //         {
      //           id: "buildingNo",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.BuildingNumber'),
      //           type: "text_disabled",
      //           value: event.data.buildingNo,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
      //         },
      //         {
      //           id: "additionalNo",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.AdditionalNumber'),
      //           type: "text_disabled",
      //           value: event.data.additionalNo,
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Foreigner") ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
      //         },
      //         {
      //           id: "zipCode",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.PostalCode'),
      //           type: "text_disabled",
      //           value: event.data.zipCode,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "phoneNo",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.PhoneNumber'),
      //           type: "text_disabled",
      //           value: event.data.phoneNo,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "faxNo",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.FaxNumber'),
      //           type: "text_disabled",
      //           value: event.data.faxNo,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         {
      //           id: "emailId",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
      //           type: "text_disabled",
      //           value: event.data.emailId,
      //           required: "false",
      //           visible: true,
      //           form_number: 2
      //         },
      //         // {
      //         //   id: "financialStatementAttachment",
      //         //   name: this.translate.instant('PRELIMINARY_REQUEST.FinancialStatement'),
      //         //   type: "file_multiple",
      //         //   file: "",
      //         //   required: "false",
      //         //   visible: true,
      //         //   form_number: 2
      //         // },
      //         // {
      //         //   id: "RealEstateAttachment",
      //         //   name: this.translate.instant('PRELIMINARY_REQUEST.RealEstateAttachment'),
      //         //   type: "file_multiple",
      //         //   file: "",
      //         //   required: "false",
      //         //   visible: true,
      //         //   form_number: 2
      //         // },
      //         // {
      //         //   id: "StockPortfolioAttachment",
      //         //   name: this.translate.instant('PRELIMINARY_REQUEST.StockPortfolioAttachment'),
      //         //   type: "file_multiple",
      //         //   file: "",
      //         //   required: "false",
      //         //   visible: true,
      //         //   form_number: 2
      //         // },
      //         {
      //           id: "NoObjectionLetter",
      //           name: this.translate.instant('PRELIMINARY_REQUEST.NoObjectionLetter'),
      //           type: "file_multiple",
      //           file: "",
      //           required: "false",
      //           visible: true,
      //           form_number: (event.data.shareHolderType == "Individual" && event.data.investorType == "Saudi National") ? 2
      //             : (event.data.shareHolderType == "فرد" && event.data.investorType == "Saudi National") ? 2
      //               : (event.data.shareHolderType == "Company") ? 2 : (event.data.shareHolderType == "شركة") ? 2 : 1,
      //         }
      //       ],
      //       buttons: [
      //         {
      //           name: this.translate.instant('COMMON.Next'),
      //           type: "button",
      //           class: "btn-info",
      //           form_number: 1
      //         },
      //         {
      //           name: this.translate.instant('COMMON.Save'),
      //           type: "button",
      //           class: "btn-success",
      //           form_number: 2,

      //           handler: (modal_data) => {

      //             this.spinnerService.show();

      //             event.data["updStatus"] = "U";

      //             var proposed_ownerships_source_data = event.data;

      //             var shareHolderType = this.share_holder_type_list.find((o) => o.type == proposed_ownerships_source_data["shareHolderType"]);
      //             if (shareHolderType)
      //               proposed_ownerships_source_data["shareHolderType"] = shareHolderType.id;

      //             var investorType = this.investor_type_list.find((o) => o.type == proposed_ownerships_source_data["investorType"]);
      //             if (investorType)
      //               proposed_ownerships_source_data["investorType"] = investorType.id;

      //             var nationality = this.country_list.find((o) => (o.nameEn == proposed_ownerships_source_data["nationality"]));
      //             if (nationality)
      //               proposed_ownerships_source_data["nationality"] = nationality.countryKey;

      //             proposed_ownerships_source_data["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_source_data["date"]);

      //             proposed_ownerships_source_data["proInd"] = proposed_ownerships_source_data["proInd"] == "Yes" ? "X" : "";

      //             proposed_ownerships_source_data["bankRelation"] = proposed_ownerships_source_data["bankRelation"] == true ? "X" : "";
      //             proposed_ownerships_source_data["nonObjection"] = proposed_ownerships_source_data["nonObjection"] == true ? "X" : "";
      //             proposed_ownerships_source_data["accessQawaem"] = proposed_ownerships_source_data["accessQawaem"] == true ? "X" : "";
      //             proposed_ownerships_source_data["acknowledgement"] = proposed_ownerships_source_data["acknowledgement"] == true ? "X" : "";
      //             proposed_ownerships_source_data["dealWithSidf"] = proposed_ownerships_source_data["dealWithSidf"] == true ? "X" : "";

      //             this.preliminaryRequestService.postOwnersBP(proposed_ownerships_source_data)
      //               .then((res) => (this.onOwnersBPUpdate("edit_2", res, event, modal_data, preliminaryRequestModal)), err => this.resolveError());

      //           }
      //         }
      //       ]
      //     };

      //     let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      //     preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

      //   }

      //   else
      //     this.commonService.showFailureToast("This Ownership's details cannot be edited !");

      // }

      else if (table_name === 'proposed_ownerships') {

        var temp_key = "";

        var temp_array = [];

        // var postalCodeLength = 0;

        for (var i = 0; i < this.country_list.length; i++){
          if (this.country_list[i].nameEn === event.data.nationality) {

            temp_key = this.country_list[i].countryKey;
          }
          if (this.country_list[i].nameAr === event.data.nationality) {

            temp_key = this.country_list[i].countryKey;
          }
        }

        for (var i = 0; i < this.city_list.length; i++)
          if (this.city_list[i].countryKey === temp_key){
            if(this.commonService.defaultLanguage === 'en')
            temp_array.push(this.city_list[i].cityNameEn);
            if(this.commonService.defaultLanguage === 'ar')
            temp_array.push(this.city_list[i].cityNameAr);
          }


        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.ownersTableDocuments.url;

        for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
          if (parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.guiId))
            temp_documents.documentList.push(this.ownersTableDocuments.documentList[i]);

        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.EditProposedOwnerships'),

          form_number: 2,

          method: "add",

          api: "owner_micro",

          documents: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual') && event.data.investorType == this.translate.instant('COMMON.Saudi National') ) ? temp_documents
            : (event.data.shareHolderType == "فرد" && event.data.investorType ==  this.translate.instant('COMMON.Saudi National')) ? temp_documents
              : (event.data.shareHolderType ==   this.translate.instant('COMMON.Company')) ? temp_documents : (event.data.shareHolderType == "شركة") ? temp_documents : "no_documents",

          inputs: [
            {
              id: "shareHolderType",
              name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderType'),
              type: "text_disabled",
              value: event.data.shareHolderType,
              selected: event.data.shareHolderType,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "investorType",
              name: this.translate.instant('PRELIMINARY_REQUEST.InvestorType'),
              type: "text_disabled",
              value: event.data.investorType,
              selected: event.data.investorType,
              required: "true",
              visible: true,
              form_number: 2,
            },
            {
              id: "nationalId",
              name: this.translate.instant('PRELIMINARY_REQUEST.NationalId'),
              type: "number_no_decimal",
              value: event.data.idNumber,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual') && event.data.investorType == this.translate.instant('COMMON.Saudi National')) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType ==   this.translate.instant('COMMON.Saudi National')) ? 2 : 1,
            },
            {
              id: "iqamaNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
              type: "number_no_decimal",
              value: event.data.idNumber,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual') && event.data.investorType ==this.translate.instant('COMMON.Resident') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType ==  this.translate.instant('COMMON.Resident')) ? 2 : 1,
            },
            {
              id: "date",
              name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
              type: "hijri_date",
              value: event.data.date,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ==  this.translate.instant('COMMON.Individual')&& event.data.investorType ==this.translate.instant('COMMON.Saudi National') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType == this.translate.instant('COMMON.Saudi National') ) ? 2 : 1,
            },
            {
              id: "crNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.CompanyNumber'),
              type: "number_no_decimal",
              value: event.data.idNumber,
              required: "true",
              visible: true,
              form_number: event.data.shareHolderType ==  this.translate.instant('COMMON.Company') ? 2 : event.data.shareHolderType == this.translate.instant('COMMON.Company')  ? 2 : 1,
            },
            {
              id: "crIssueDate",
              name: this.translate.instant('PRELIMINARY_REQUEST.CompanyIssueDate'),
              type: "hijri_date",
              value: event.data.date,
              required: "true",
              visible: true,
              form_number: event.data.shareHolderType == "Company" ? 2 : event.data.shareHolderType == "شركة" ? 2 : 1,
            },
            {
              id: "name",
              name: this.translate.instant('PRELIMINARY_REQUEST.name'),
              type: "text",
              value: event.data.name,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "nationality",
              name: this.translate.instant('PRELIMINARY_REQUEST.Nationality'),
              type: "cc_select",
              value: this.country_name_list,
              selected: event.data.nationality,
              dropdown: this.country_list,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "percentage",
              name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
              type: "number",
              value: parseFloat(event.data.percentage).toFixed(4),
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "passportNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.PassportNumber'),
              type: "text",
              value: event.data.idNumber,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual') && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType ==  this.translate.instant('COMMON.Foreigner') ) ? 2 : 1
            },
            {
              id: "passportExpiryDate",
              name: this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDate'),
              type: "greg_date",
              value: this.commonService.returnGregDateStringFromDateArray(event.data.date),
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual') && event.data.investorType == this.translate.instant('COMMON.Foreigner') ) ? 2 : (event.data.shareHolderType == "فرد" && event.data.investorType ==  this.translate.instant('COMMON.Foreigner') ) ? 2 : 1
            },
            {
              id: "street",
              name: this.translate.instant('PRELIMINARY_REQUEST.Street'),
              type: "text",
              value: event.data.street,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "city",
              name: this.translate.instant('PRELIMINARY_REQUEST.City'),
              type: "select",
              selected: event.data.city,
              value: temp_array,
              dropdown: this.city_list,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "districtArea",
              name: this.translate.instant('PRELIMINARY_REQUEST.DistrictArea'),
              type: "text",
              value: event.data.districtArea,
              required: "false",
              visible: true,
              form_number: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual')  && event.data.investorType ==  this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType == "فرد" && event.data.investorType == "Foreigner") ? 1 : 2
            },
            {
              id: "unitNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.UnitNumber'),
              type: "number_no_decimal",
              value: event.data.unitNo,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ==   this.translate.instant('COMMON.Individual')  && event.data.investorType === this.translate.instant('COMMON.Foreigner')  ) ? 1 : (event.data.shareHolderType === "فرد" && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? 1 : 2
            },
            {
              id: "buildingNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.BuildingNumber'),
              type: "number_no_decimal",
              value: event.data.buildingNo,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType === this.translate.instant('COMMON.Individual')  && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType === "فرد" && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? 1 : 2
            },
            {
              id: "additionalNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.AdditionalNumber'),
              type: "number_no_decimal",
              value: event.data.additionalNo,
              required: "true",
              visible: true,
              form_number: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual')  && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? 1 : (event.data.shareHolderType === "فرد" && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? 1 : 2
            },
            {
              id: "zipCode",
              name: this.translate.instant('PRELIMINARY_REQUEST.PostalCode'),
              type: "text",
              value: event.data.zipCode,
              // postalCodeLength: postalCodeLength,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "phoneNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.PhoneNumber'),
              type: "text",
              value: event.data.phoneNo,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "faxNo",
              name: this.translate.instant('PRELIMINARY_REQUEST.FaxNumber'),
              type: "text",
              value: event.data.faxNo,
              required: "false",
              visible: true,
              form_number: 2
            },
            {
              id: "emailId",
              name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
              type: "email",
              value: event.data.emailId,
              required: "true",
              visible: true,
              form_number: 2
            },
            // {
            //   id: "financialStatementAttachment",
            //   name: this.translate.instant('PRELIMINARY_REQUEST.FinancialStatement'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   form_number: 2
            // },
            // {
            //   id: "RealEstateAttachment",
            //   name: this.translate.instant('PRELIMINARY_REQUEST.RealEstateAttachment'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   form_number: 2
            // },
            // {
            //   id: "StockPortfolioAttachment",
            //   name: this.translate.instant('PRELIMINARY_REQUEST.StockPortfolioAttachment'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   form_number: 2
            // },
            {
              id: "NoObjectionLetter",
              name: this.translate.instant('PRELIMINARY_REQUEST.NoObjectionLetter'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              form_number: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType === this.translate.instant('COMMON.Saudi National') ) ? 2
                : (event.data.shareHolderType === "فرد" && event.data.investorType === "Saudi National") ? 2
                  : (event.data.shareHolderType === "Company") ? 2 : (event.data.shareHolderType === "شركة") ? 2 : 1,
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Next'),
              type: "button",
              class: "btn-info",
              form_number: 1
            },
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",
              form_number: 2,

              handler: (modal_data) => {

                this.spinnerService.show();

                var idNumber_data = "", dob_data = { year: 0, month: 0, day: 0 };

                if (modal_data.inputs[0].selected ===  this.translate.instant('COMMON.Individual'))
                  if (modal_data.inputs[1].selected === this.translate.instant('COMMON.Saudi National')) {
                    idNumber_data = modal_data.inputs[2].value;
                    dob_data = modal_data.inputs[4].value;
                  }
                  else if (modal_data.inputs[1].selected ===   this.translate.instant('COMMON.Foreigner')) {
                    idNumber_data = modal_data.inputs[10].value;
                    dob_data = this.commonService.returnDateArrayFromGregDateString(modal_data.inputs[11].value);
                  }
                  else {
                    idNumber_data = modal_data.inputs[3].value;
                    dob_data = modal_data.inputs[4].value;
                  }

                else if (modal_data.inputs[0].selected ===   this.translate.instant('COMMON.Company')) {
                  idNumber_data = modal_data.inputs[5].value;
                  dob_data = modal_data.inputs[6].value;
                }

                var proposed_ownerships_source_data = {};

                proposed_ownerships_source_data = {
                  preliminaryId: this.preliminaryId, shareHolderType: modal_data.inputs[0].selected, idNumber: idNumber_data,
                  nationality: modal_data.inputs[8].selected, name: modal_data.inputs[7].value,
                  percentage: parseFloat(modal_data.inputs[9].value).toFixed(4), date: dob_data, investorType: modal_data.inputs[1].selected, mciInd: "", updStatus: "U",
                  proInd: "Yes", proPercentage: parseFloat(modal_data.inputs[9].value).toFixed(4),
                  city: modal_data.inputs[13].selected, phoneNo: modal_data.inputs[19].value, faxNo: modal_data.inputs[20].value, street: modal_data.inputs[12].value,
                  zipCode: modal_data.inputs[18].value, emailId: modal_data.inputs[21].value, districtArea: modal_data.inputs[14].value,
                  unitNo: modal_data.inputs[15].value, buildingNo: modal_data.inputs[16].value, additionalNo: modal_data.inputs[17].value,
                  nonObjection: event.data.nonObjection, accessQawaem: event.data.accessQawaem, acknowledgement: event.data.acknowledgement,
                  guiId: event.data.guiId ? event.data.guiId : this.commonService.returnRandomNumber(), bankDetails: event.data.bankDetails ? event.data.bankDetails : [], 
                  buPartner: event.data.buPartner ? event.data.buPartner : "",
                  seqNo: event.data.seqNo ? event.data.seqNo : ""
                  //dealWithSidf: event.data.dealWithSidf
                };

                var shareHolderType = this.share_holder_type_list.find((o) => o.type === proposed_ownerships_source_data["shareHolderType"]);
                if (shareHolderType)
                  proposed_ownerships_source_data["shareHolderType"] = shareHolderType.id;

                var investorType = this.investor_type_list.find((o) => o.type === proposed_ownerships_source_data["investorType"]);
                if (investorType)
                  proposed_ownerships_source_data["investorType"] = investorType.id;

                var nationality = this.country_list.find((o) => (o.nameEn === proposed_ownerships_source_data["nationality"]||o.nameAr === proposed_ownerships_source_data["nationality"]));
                if (nationality)
                  proposed_ownerships_source_data["nationality"] = nationality.countryKey;

                proposed_ownerships_source_data["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_source_data["date"]);

                proposed_ownerships_source_data["proInd"] = proposed_ownerships_source_data["proInd"] === "Yes" ? "X" : "";

                proposed_ownerships_source_data["bankRelation"] = proposed_ownerships_source_data["bankRelation"] == true ? "X" : "";
                proposed_ownerships_source_data["nonObjection"] = proposed_ownerships_source_data["nonObjection"] == true ? "X" : "";
                proposed_ownerships_source_data["accessQawaem"] = proposed_ownerships_source_data["accessQawaem"] == true ? "X" : "";
                proposed_ownerships_source_data["acknowledgement"] = proposed_ownerships_source_data["acknowledgement"] == true ? "X" : "";
                proposed_ownerships_source_data["dealWithSidf"] = proposed_ownerships_source_data["dealWithSidf"] == true ? "X" : "";

                this.preliminaryRequestService.postOwnersBP(proposed_ownerships_source_data)
                  .then((res) => (this.onOwnersBPUpdate("edit_2", res, event, modal_data, preliminaryRequestModal)), err => this.resolveError());

              }
            }
          ]
        };

        let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
        preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

      }

      else if (table_name === 'representatives') {

        this.spinnerService.show();

        this.communicationsService.getDocumentService(event.data.buPartner, "p")
          .then(requests => (this.onGetRepresentativesDocuments(requests, event, "edit")), err => this.resolveError());

      }

      else if (table_name === 'bank_details') {

        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.EditBankDetails'),

          form_number: 2,

          api: "owner_micro",

          inputs: [
            {
              id: "accHolder",
              name: this.translate.instant('PRELIMINARY_REQUEST.AccountHolder'),
              type: "select",
              value: this.non_saudi_owners_list,
              selected: event.data.accHolder,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "bnkAccNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.BankAccountNumber'),
              type: "number_no_decimal",
              value: event.data.bnkAccNumber,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "bankName",
              name: this.translate.instant('PRELIMINARY_REQUEST.bankName'),
              type: "text",
              value: event.data.bankName,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "repName",
              name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeName'),
              type: "text",
              value: event.data.repName,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "repPosition",
              name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativePosition'),
              type: "text",
              value: event.data.repPosition,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "repEmail",
              name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeEmailId'),
              type: "email",
              value: event.data.repEmail,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "repMobile",
              name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeMobileNumber'),
              type: "text",
              value: event.data.repMobile,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "street",
              name: this.translate.instant('PRELIMINARY_REQUEST.Branch'),
              type: "text",
              value: event.data.street,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "city",
              name: this.translate.instant('PRELIMINARY_REQUEST.City'),
              type: "text",
              value: event.data.city,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "country",
              name: this.translate.instant('PRELIMINARY_REQUEST.Country'),
              type: "select",
              value: this.country_name_list,
              selected: event.data.country,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "address",
              name: this.translate.instant('PRELIMINARY_REQUEST.Address'),
              type: "textarea",
              value: event.data.address,
              required: "true",
              visible: true,
              form_number: 2
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Next'),
              type: "button",
              class: "btn-info",
              form_number: 1
            },
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",
              form_number: 2,

              handler: (modal_data) => {

                this.spinnerService.show();

                var proposed_ownerships_temp_source = [];

                var bank_details_source_data = {
                  preliminaryId: this.preliminaryId, accHolder: modal_data.inputs[0].selected, bnkAccNumber: modal_data.inputs[1].value, bankName: modal_data.inputs[2].value,
                  repName: modal_data.inputs[3].value, repPosition: modal_data.inputs[4].value, repEmail: modal_data.inputs[5].value, repMobile: modal_data.inputs[6].value, street: modal_data.inputs[7].value,
                  city: modal_data.inputs[8].value, country: modal_data.inputs[9].selected, address: modal_data.inputs[10].value, updStatus: "U"
                };

                var country = this.country_list.find((o) => o.nameEn === bank_details_source_data["country"]||o.nameAr === bank_details_source_data["country"]);
                if (country)
                  bank_details_source_data["country"] = country.countryKey;

                this.proposed_ownerships_source.getAll().then((res) => {

                  proposed_ownerships_temp_source = res;

                  var ownerDetails = proposed_ownerships_temp_source.find((o) => o.name === bank_details_source_data.accHolder);


                  var shareHolderType = this.share_holder_type_list.find((o) => o.type === ownerDetails["shareHolderType"]);
                  if (shareHolderType)
                    ownerDetails["shareHolderType"] = shareHolderType.id;

                  var investorType = this.investor_type_list.find((o) => o.type === ownerDetails["investorType"]);
                  if (investorType)
                    ownerDetails["investorType"] = investorType.id;

                  var nationality = this.country_list.find((o) => (o.nameEn === ownerDetails["nationality"]||o.nameAr === ownerDetails["nationality"]));
                  if (nationality)
                    ownerDetails["nationality"] = nationality.countryKey;

                  ownerDetails["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(ownerDetails["date"]);

                  ownerDetails["proInd"] = ownerDetails["proInd"] === "Yes" ? "X" : "";

                  ownerDetails["bankRelation"] = ownerDetails["bankRelation"] == true ? "X" : "";
                  ownerDetails["nonObjection"] = ownerDetails["nonObjection"] == true ? "X" : "";
                  ownerDetails["accessQawaem"] = ownerDetails["accessQawaem"] == true ? "X" : "";
                  ownerDetails["acknowledgement"] = ownerDetails["acknowledgement"] == true ? "X" : "";
                  ownerDetails["dealWithSidf"] = ownerDetails["dealWithSidf"] == true ? "X" : "";

console.log('bank_details_source_data2');
console.log(bank_details_source_data);
                  for (var i = 0; i < ownerDetails["bankDetails"].length; i++)
                    if (ownerDetails["bankDetails"][i].bnkAccNumber === event.data.bnkAccNumber)
                      ownerDetails["bankDetails"][i] = bank_details_source_data;

                  this.preliminaryRequestService.postOwnersBP(ownerDetails)
                    .then((res1) => (this.onOwnersBPBankUpdate("edit", res1, bank_details_source_data, event, preliminaryRequestModal)), err => this.resolveError());

                });

              }
            }
          ]
        };

        let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
        preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

      }

    else if (table_name === 'real_est') {

      var proposed_ownerships_temp_source = [];

      var bpOwnerList = [];

      var bpOwnerNameList = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
          if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner !== "") {

            bpOwnerList.push(proposed_ownerships_temp_source[i]);
            bpOwnerNameList.push(proposed_ownerships_temp_source[i].name);

          }

        var temp_key = "";

        var temp_array = [];

        for (var i = 0; i < this.country_list.length; i++)
        {  
          if (this.country_list[i].nameEn === event.data.country)
            temp_key = this.country_list[i].countryKey;
            if (this.country_list[i].nameAr === event.data.country)
            temp_key = this.country_list[i].countryKey;

        }
        for (var i = 0; i < this.city_list.length; i++)
          if (this.city_list[i].countryKey === temp_key){
            if(this.commonService.defaultLanguage === 'en')
            temp_array.push(this.city_list[i].cityNameEn);
            if(this.commonService.defaultLanguage === 'ar')
            temp_array.push(this.city_list[i].cityNameAr);
          }


        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.realEstateTableDocuments.url;

        for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
          if (parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ===
            parseInt(event.data.guiId))
            temp_documents.documentList.push(this.realEstateTableDocuments.documentList[i]);
        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditRealEstate'),
          documents: temp_documents,

          api: "owner_micro",

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: bpOwnerNameList,
              selected: event.data.Name,
              required: "true",
            },
            {
              id: "Description",
              name: this.translate.instant('PROJECT_INFORMATION.Description'),
              type: "text",
              value: event.data.nameEn,
              required: "true",
            },
            {
              id: "PropertyType",
              name: this.translate.instant('PROJECT_INFORMATION.PropertyType'),
              type: "select",
              value: this.property_type_desc_list,
              selected: event.data.propertyType,
              required: "true",
            },
            {
              id: "TitleDeed",
              name: this.translate.instant('PROJECT_INFORMATION.TitleDeed'),
              type: "text",
              value: event.data.titleDeed,
              required: "true",
            },
            {
              id: "Country",
              name: this.translate.instant('PROJECT_INFORMATION.Country'),
              type: "cc_select",
              value: this.country_name_list,
              selected: event.data.country,
              dropdown: this.country_list,
              required: "true",
            },
            {
              id: "City",
              name: this.translate.instant('PROJECT_INFORMATION.City'),
              type: "select",
              value: temp_array,
              selected: event.data.city,
              dropdown: this.city_list,
              required: "true",
            },
            {
              id: "Location",
              name: this.translate.instant('PROJECT_INFORMATION.Location'),
              type: "text",
              value: event.data.location,
              required: "true",
            },
            {
              id: "Area",
              name: this.translate.instant('PROJECT_INFORMATION.Area'),
              type: "text",
              value: event.data.area,
              required: "true",
            },
            
            {
              id: "PurchasePrice",
              name: this.translate.instant('PROJECT_INFORMATION.PurchasePrice'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.purchasePrice.replace('SAR ', "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "PurchaseDate",
              name: this.translate.instant('PROJECT_INFORMATION.PurchaseDate'),
              type: "greg_date",
              value: this.commonService.returnGregDateStringFromDateArray(event.data.purchaseDate),
              required: "true",
            },
            {
              id: "MarketValue",
              name: this.translate.instant('PROJECT_INFORMATION.MarketValue'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.currentMarketValue.replace('SAR ', "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "MarketDate",
              name: this.translate.instant('PROJECT_INFORMATION.MarketValuationDate'),
              type: "greg_date",
              value: this.commonService.returnGregDateStringFromDateArray(event.data.currentMarketDate),
              required: "true",
            },
            {
              id: "LandDeedTitleDocument",
              name: this.translate.instant('PROJECT_INFORMATION.LandDeedTitleDocument'),
              type: "file_multiple",
              file: "",
              required: "true",
            }
       
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var selectedOwner = bpOwnerList.find((o) => o.name == modal_data.inputs[0].selected);
console.log('asd');
console.log(modal_data);
                var real_estate_source_data = {};

                real_estate_source_data = {
                  preliminaryId: this.preliminaryId, projectId: this.inputs.ProjectId, 
                  buPartner: selectedOwner.buPartner,
                  seqNo: event.data.seqNo ? event.data.seqNo:"",
                  Name: modal_data.inputs[0].selected, nameEn: modal_data.inputs[1].value, propertyType: modal_data.inputs[2].selected,
                  country: modal_data.inputs[4].selected, city: modal_data.inputs[5].selected, location: modal_data.inputs[6].value,
                  area: modal_data.inputs[7].value, purchasePrice: modal_data.inputs[8].value,
                  purchaseDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[9].value),
                  currentMarketValue: modal_data.inputs[10].value, currentMarketDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[11].value),
                  titleDeed: modal_data.inputs[3].value,
                  guiId: event.data.guiId ? event.data.guiId : this.commonService.returnRandomNumber(), updStatus: "U"
                };

                var propertyType = this.property_type_list.find((o) => o.propertyTypeEn === real_estate_source_data["propertyType"]||o.propertyTypeAr === real_estate_source_data["propertyType"]);
                if (propertyType)
                  real_estate_source_data["propertyType"] = propertyType.id;

                var country = this.country_list.find((o) => (o.nameEn === real_estate_source_data["country"]||o.nameAr === real_estate_source_data["country"]));
                if (country)
                  real_estate_source_data["country"] = country.countryKey;

                var post_data = {

                  "realEstateDetails": [{

                    "preliminaryId": real_estate_source_data["preliminaryId"],
                    "projectId": real_estate_source_data["projectId"],
                    "buPartner": real_estate_source_data["buPartner"],
                    "nameEn": real_estate_source_data["nameEn"],
                    "propertyType": real_estate_source_data["propertyType"],
                    "country": real_estate_source_data["country"],
                    "city": real_estate_source_data["city"],
                    "location": real_estate_source_data["location"],
                    "area": real_estate_source_data["area"],
                    "purchasePrice": real_estate_source_data["purchasePrice"],
                    "purchaseDate": real_estate_source_data["purchaseDate"],
                    "currentMarketValue": real_estate_source_data["currentMarketValue"],
                    "currentMarketDate": real_estate_source_data["currentMarketDate"],
                    "titleDeed": real_estate_source_data["titleDeed"],
                    "guiId": real_estate_source_data["guiId"],
                    "updStatus": real_estate_source_data["updStatus"],
                    "seqNo": real_estate_source_data["seqNo"]

                  }]

                };
console.log(real_estate_source_data);
                this.preliminaryRequestService.postOwnersAddInfo(post_data)
                  .then((res) => (this.resolveRealEstatePost(res, "edit", event, modal_data, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };

        let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
        projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

      });

    }
      else if (table_name === 'list_comp') {

        var proposed_ownerships_temp_source = [];

        var bpOwnerList = [];

        var bpOwnerNameList = [];

        this.proposed_ownerships_source.getAll().then((res) => {

          proposed_ownerships_temp_source = res;

          for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
            if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner !== "") {

              bpOwnerList.push(proposed_ownerships_temp_source[i]);
              bpOwnerNameList.push(proposed_ownerships_temp_source[i].name);

            }

          var temp_documents = { url: "", documentList: [], method: "" };

          temp_documents.method = "edit";

          temp_documents.url = this.listOfCompaniesTableDocuments.url;

          for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
            if (parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ===
              parseInt(event.data.guiId))
              temp_documents.documentList.push(this.listOfCompaniesTableDocuments.documentList[i]);

          projectOwnershipModalParams = {

            header: this.translate.instant('PROJECT_INFORMATION.EditCompanies'),

            documents: temp_documents,

            api: "owner_micro",

            inputs: [
              {
                id: "Name",
                name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
                type: "select",
                value: bpOwnerNameList,
                selected: event.data.Name,
                required: "true",
              },
              {
                id: "CompanyName",
                name: this.translate.instant('PROJECT_INFORMATION.CompanyOrEstablishmentName'),
                type: "text",
                value: event.data.nameEn,
                required: "true",
              },
              {
                id: "SharePercentage",
                name: this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage'),
                type: "number",
                value: parseFloat(event.data.sharePercentage).toFixed(4),
                required: "true",
              },
              {
                id: "ShareValue",
                name: this.translate.instant('PROJECT_INFORMATION.ShareholdingValue'),
                type: "text",
                value: this.commonService.numberWithCommasToNumber(event.data.shareValue.replace('SAR ', "")),
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "IndustrialLicense",
                name: this.translate.instant('PROJECT_INFORMATION.CommercialRegistrationNumber'),
                type: "number_no_decimal",
                value: event.data.crNumber,
                required: "true",
              },
              {
                id: "IssueDate",
                name: this.translate.instant('PROJECT_INFORMATION.IssueDate'),
                type: "hijri_date",
                value: event.data.crIssueDate,
                required: "true",
              },
              {
                id: "attachments",
                name: this.translate.instant('PROJECT_INFORMATION.Attachments'),
                type: "file_multiple",
                file: "",
                required: "true",
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selectedOwner = bpOwnerList.find((o) => o.name === modal_data.inputs[0].selected);

                  var companies_source_data = {};

                  companies_source_data = {
                    preliminaryId: this.preliminaryId, projectId: this.inputs.ProjectId,
                     buPartner: selectedOwner.buPartner,
                     seqNo: event.data.seqNo ? event.data.seqNo:"",
                    Name: modal_data.inputs[0].selected, nameEn: modal_data.inputs[1].value, shareValue: modal_data.inputs[3].value,
                    sharePercentage: modal_data.inputs[2].value, crNumber: modal_data.inputs[4].value,
                    crIssueDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(modal_data.inputs[5].value),
                    guiId: event.data.guiId ? event.data.guiId : this.commonService.returnRandomNumber(), updStatus: "U"
                  };

                  var post_data = {

                    "companyDetails": [{

                      "preliminaryId": companies_source_data["preliminaryId"],
                      "projectId": companies_source_data["projectId"],
                      "buPartner": companies_source_data["buPartner"],
                      "nameEn": companies_source_data["nameEn"],
                      "shareValue": companies_source_data["shareValue"],
                      "sharePercentage": companies_source_data["sharePercentage"],
                      "crNumber": companies_source_data["crNumber"],
                      "crIssueDate": companies_source_data["crIssueDate"],
                      "guiId": companies_source_data["guiId"],
                      "updStatus": companies_source_data["updStatus"],
                      "seqNo": companies_source_data["seqNo"],

                    }]

                  };

                  this.preliminaryRequestService.postOwnersAddInfo(post_data)
                    .then((res) => (this.resolveCompaniesPost(res, "edit", event, modal_data, projectOwnershipModal)), err => this.resolveError());

                }
              }
            ]
          };

          let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
          projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

        });

      }

      else if (table_name === 'other_inv') {

        var proposed_ownerships_temp_source = [];

        var bpOwnerList = [];

        var bpOwnerNameList = [];

        this.proposed_ownerships_source.getAll().then((res) => {

          proposed_ownerships_temp_source = res;

          for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
            if (proposed_ownerships_temp_source[i].buPartner && proposed_ownerships_temp_source[i].buPartner !== "") {

              bpOwnerList.push(proposed_ownerships_temp_source[i]);
              bpOwnerNameList.push(proposed_ownerships_temp_source[i].name);

            }

          var temp_documents = { url: "", documentList: [], method: "" };

          temp_documents.method = "edit";

          temp_documents.url = this.otherInvestmentsTableDocuments.url;

          for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
            if (parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ===
              parseInt(event.data.guiId))
              temp_documents.documentList.push(this.otherInvestmentsTableDocuments.documentList[i]);

          projectOwnershipModalParams = {

            header: this.translate.instant('PROJECT_INFORMATION.EditOtherInvestments'),

            documents: temp_documents,

            api: "owner_micro",

            form_number: 1,

            inputs: [
              {
                id: "Name",
                name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
                type: "select",
                value: bpOwnerNameList,
                selected: event.data.Name,
                required: "true",
                form_number: 1,
              },      
              {
                id: "InvestmentType",
                name: this.translate.instant('PROJECT_INFORMATION.InvestmentType'),
                type: "select",
                value: this.investment_type_desc_list,
                selected: event.data.investmentType,
                required: "true",
                form_number: 1,
              },
              {
                id: "Description",
                name: this.translate.instant('PROJECT_INFORMATION.Description'),
                type: "text",
                value: event.data.nameEn,
                required: "true",
                form_number: 1,
              },
              {
                id: "InvestmentValue",
                name: this.translate.instant('PROJECT_INFORMATION.InvestmentValue'),
                type: "text",
                value: this.commonService.numberWithCommasToNumber(event.data.value.replace('SAR ', "")),
                required: "true",
                cost: "true",
                currency: "SAR ",
                form_number: event.data.investmentType === this.translate.instant('COMMON.Stock Options') ? 2 : 1,
              },
              {
                id: "Quantity",
                name: this.translate.instant('PROJECT_INFORMATION.Quantity'),
                type: "number",
                value: event.data.quantity,
                required: "true",
                form_number: event.data.investmentType === this.translate.instant('COMMON.Stock Options') ? 1 : 2,
              },
              {
                id: "MarketPrice",
                name: this.translate.instant('PROJECT_INFORMATION.MarketPrice'),
                type: "text",
                value: this.commonService.numberWithCommasToNumber(event.data.marketPrice.replace('SAR ', "")),
                required: "true",
                cost: "true",
                currency: "SAR ",
                form_number: event.data.investmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
              },
              {
                id: "TotalMarketValue",
                name: this.translate.instant('PROJECT_INFORMATION.TotalMarketValue'),
                type: "text",
                value: this.commonService.numberWithCommasToNumber(event.data.totalMarketValue.replace('SAR ', "")),
                required: "true",
                cost: "true",
                currency: "SAR ",
                form_number: event.data.investmentType === this.translate.instant('COMMON.Stock Options') ? 1 : 2,
              },
              {
                id: "InvestmentProof",
                name: this.translate.instant('PROJECT_INFORMATION.DocumentaryEvidence'),
                type: "file_multiple",
                file: "",
                required: "true",
                form_number: 1,
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selectedOwner = bpOwnerList.find((o) => o.name === modal_data.inputs[0].selected);

                  var other_investments_source_data = {};

                  other_investments_source_data = {
                    preliminaryId: this.preliminaryId, projectId: this.inputs.ProjectId,
                     buPartner: selectedOwner.buPartner,
                     seqNo: event.data.seqNo ? event.data.seqNo:"",
                    Name: modal_data.inputs[0].selected, nameEn: modal_data.inputs[2].value, investmentType: modal_data.inputs[1].selected,
                    value: modal_data.inputs[3].value, quantity: modal_data.inputs[4].value, marketPrice: modal_data.inputs[5].value,
                    totalMarketValue: modal_data.inputs[6].value,
                    guiId: event.data.guiId ? event.data.guiId : this.commonService.returnRandomNumber(), updStatus: "U"
                  };
                  
                  var investmentType = this.investment_type_list.find((o) => o.investTypeEn === other_investments_source_data["investmentType"]||o.investTypeAr === other_investments_source_data["investmentType"]);
                  if (investmentType)
                    other_investments_source_data["investmentType"] = investmentType.id;

                  var post_data = {

                    "investmentDetails": [{

                      "preliminaryId": other_investments_source_data["preliminaryId"],
                      "projectId": other_investments_source_data["projectId"],
                      "buPartner": other_investments_source_data["buPartner"],
                      "nameEn": other_investments_source_data["nameEn"],
                      "investmentType": other_investments_source_data["investmentType"],
                      "value": other_investments_source_data["value"],
                      "quantity": other_investments_source_data["quantity"],
                      "marketPrice": other_investments_source_data["marketPrice"],
                      "totalMarketValue": other_investments_source_data["totalMarketValue"],
                      "guiId": other_investments_source_data["guiId"],
                      "updStatus": other_investments_source_data["updStatus"],
                      "seqNo": event.data.seqNo ? event.data.seqNo : ""

                    }]

                  };

                  this.preliminaryRequestService.postOwnersAddInfo(post_data)
                    .then((res) => (this.resolveOtherInvestmentsPost(res, "edit", event, modal_data, projectOwnershipModal)), err => this.resolveError());

                }
              }
            ]
          };

          let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
          projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

        });

      }

    }

  }

  onGetRepresentativesDocuments(requests, event, method) {

    let preliminaryRequestModalParams = {};

    var temp_documents = { url: "", documentList: [], method: "" };

    if (requests.result) {
    var representativeDocuments = this.commonService.returnViewDocumentJson(requests);

    temp_documents.url = representativeDocuments["url"];

    for (var i = 0; i < representativeDocuments["documentList"].length; i++) {

      representativeDocuments["documentList"][i]["docUrl"] =
        representativeDocuments["url"]
          .replace("entityId", representativeDocuments["documentList"][i].EntityId)
          .replace("refId", representativeDocuments["documentList"][i].RefId)
          .replace("documentId", representativeDocuments["documentList"][i].DocumentId)
          .replace("fileName", representativeDocuments["documentList"][i].FileName);

      temp_documents.documentList.push(representativeDocuments["documentList"][i]);

    }
    }

    else if (!event.data.buPartner)
      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.BUPartnerIDMissing'));
    temp_documents.method = method;

    this.spinnerService.hide();

    if (method === "edit" || method === "view") {

      if (method === "edit")
        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.EditAuthorizedPerson'),

          form_number: 2,

          method: "edit",

          documents: temp_documents,

          inputs: [
            {
              id: "idType",
              name: this.translate.instant('PRELIMINARY_REQUEST.IdType'),
              type: "text_disabled",
              value: event.data.idType,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "address",
              name: this.translate.instant('PRELIMINARY_REQUEST.name'),
              type: "text_disabled",
              value: event.data.address,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "idNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.IdNumber'),
              type: "text_disabled",
              value: event.data.idNumber,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "dob",
              name: (event.data.idType !== "Sagia License") ? this.translate.instant('PRELIMINARY_REQUEST.DateofBirth') : this.translate.instant('PRELIMINARY_REQUEST.LicenseDate'),
              type: "text_disabled",
              value: this.commonService.returnDateStringFromDateArray(event.data.dob),
              required: "true",
              visible: event.data.idType !== "GCC ID" ? true : false,
              form_number: 2
            },
            {
              id: "email",
              name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
              type: "text_disabled",
              value: event.data.email,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "mobile",
              name: this.translate.instant('PRELIMINARY_REQUEST.Mobile'),
              type: "text_disabled",
              value: event.data.mobile,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "attachment",
              name: this.translate.instant('PRELIMINARY_REQUEST.Attachment'),
              type: "file_single",
              file: "",
              required: "false",
              visible: true,
              form_number: 2
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Next'),
              type: "button",
              class: "btn-info",
              form_number: 1
            },
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",
              form_number: 2,

              handler: (modal_data) => {

                this.spinnerService.show();

                var data = {
                  documentDefId: 375,
                  entityId: event.data.buPartner,
                  entityName: "Project",
                  RelatedEntityId: "",
                  RelatedEntityName: "Reference",
                  operationType: "p"
                };

                if (modal_data.inputs[6].file && modal_data.inputs[6].file !== "")
                  this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
                    .then(requests => (this.onRepresentativesTableUpload(requests, modal_data, "edit", event, data.entityId, "Yes")), err => this.resolveError());

                else
                  this.onRepresentativesTableUploadDataBind(modal_data, "edit", event, data.entityId, event.data.attachmentInd ? (event.data.attachmentInd === "Yes" ? modal_data.documents.documentList.length > 0 ? "Yes" : "No" : modal_data.documents.documentList.length > 0 ? "Yes" : "No") : "No");

              }
            }
          ]
        };

      else if (method === "view")
        preliminaryRequestModalParams = {

          header: this.translate.instant('PRELIMINARY_REQUEST.ViewAuthorizedPerson'),

          method: "view",

          documents: temp_documents,

          form_number: 2,

          inputs: [
            {
              id: "idType",
              name: this.translate.instant('PRELIMINARY_REQUEST.IdType'),
              type: "text",
              value: event.data.idType,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "address",
              name: this.translate.instant('PRELIMINARY_REQUEST.name'),
              type: "text",
              value: event.data.address,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "idNumber",
              name: this.translate.instant('PRELIMINARY_REQUEST.IdNumber'),
              type: "text",
              value: event.data.idNumber,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "dob",
              name: (event.data.idType !== "Sagia License") ? "Date of Birth" : "License Date",
              type: "text",
              value: this.commonService.returnDateStringFromDateArray(event.data.dob),
              required: "true",
              visible: (event.data.idType !== "GCC ID" ? true : false),
              form_number: 2
            },
            {
              id: "email",
              name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
              type: "text",
              value: event.data.email,
              required: "true",
              visible: true,
              form_number: 2
            },
            {
              id: "mobile",
              name: this.translate.instant('PRELIMINARY_REQUEST.Mobile'),
              type: "text",
              value: event.data.mobile,
              required: "true",
              visible: true,
              form_number: 2
            }
          ],
          buttons: []
        };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else if (method === "delete") {

      this.representatives_source.remove(this.deleteCancelModalReference.event.data);

      this.representatives_source_length--;

      this.representatives_source.refresh();

      this.deleteCancelModalReference.event.data["updStatus"] = "D";

      this.deleted_representatives.push(this.deleteCancelModalReference.event.data);

      this.spinnerService.show();

      for (var i = 0; i < temp_documents.documentList.length; i++) {

        this.communicationsService.deleteDocumentService
          ({
            entityId: temp_documents.documentList[i].EntityId, refId: temp_documents.documentList[i].RefId,
            documentId: temp_documents.documentList[i].DocumentId, operationType: 'p'
          })
          .then(response => (response), err => this.resolveError());

      }

      this.spinnerService.hide();
      
      this.startedFilling = 1;

    }

  }

  onDelete(delete_modal, event, table_name) {

    if (event.data.mciInd === "X" && table_name === 'proposed_products') {

      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ProductDetailsMCINoDeletion'));

    }

    else if (event.data.mciInd === "X" && table_name === 'proposed_ownerships') {

      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.OwnershipDetailsMCINoDeletion'));

    }

    // else if (event.data.editInd && event.data.editInd == "X" && table_name === 'proposed_ownerships') {

    //   this.commonService.showFailureToast("The details from this Ownership cannot be deleted !");

    // }

    else if (event.data.mciInd === "Yes" && table_name === 'representatives') {

      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.RepresentativeDetailsNoDeletion'));

    }

    else {
      let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
      delete options.size;
      this.deleteCancelModalReference = this.modalService.open(delete_modal, options);
      this.deleteCancelModalReference.event = event;
      this.deleteCancelModalReference.table_name = table_name;
      this.deleteCancelModalReference.action = this.translate.instant('COMMON.Delete');
      this.deleteCancelModalReference.error = this.translate.instant('COMMON.AreYouSure');

      if (this.deleteCancelModalReference.table_name === 'proposed_products')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PRELIMINARY_REQUEST.deleteProposedProduct');

      else if (this.deleteCancelModalReference.table_name === 'proposed_ownerships')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PRELIMINARY_REQUEST.deleteProposedOwner');

      else if (this.deleteCancelModalReference.table_name === 'representatives')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PRELIMINARY_REQUEST.authorizedPerson');

      else if (this.deleteCancelModalReference.table_name === 'bank_details')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PRELIMINARY_REQUEST.bankDetails');

      else if (this.deleteCancelModalReference.table_name === 'real_est')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.RealEstate');

      else if (this.deleteCancelModalReference.table_name === 'list_comp')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.ListofCompanies');

      else if (this.deleteCancelModalReference.table_name === 'other_inv')
        this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.OtherInvestments');

    }

  }

  onDeleteConfirmRealEstate(i, realEstateTableDocuments) {

    var temp_array = [];

    for (var j = 0; j < this.realEstateTableDocuments.documentList.length; j++)
      if (i !== j)
        temp_array.push(this.realEstateTableDocuments.documentList[j]);

    this.realEstateTableDocuments.documentList = temp_array;

  }

  onDeleteConfirmCompanies(i) {

    var temp_array = [];

    for (var j = 0; j < this.listOfCompaniesTableDocuments.documentList.length; j++)
      if (i !== j)
        temp_array.push(this.listOfCompaniesTableDocuments.documentList[j]);

    this.listOfCompaniesTableDocuments.documentList = temp_array;

  }

  onDeleteConfirmOtherInvestments(i) {

    var temp_array = [];

    for (var j = 0; j < this.otherInvestmentsTableDocuments.documentList.length; j++)
      if (i !== j)
        temp_array.push(this.otherInvestmentsTableDocuments.documentList[j]);

    this.otherInvestmentsTableDocuments.documentList = temp_array;

  }

  onDeleteConfirmOwner(res) {

    if (res.msgId === "E") {

      this.commonService.showFailureToast(res.msgText);
      this.spinnerService.hide();

    }

    else {

      this.proposed_ownerships_source.remove(this.deleteCancelModalReference.event.data);

      this.proposed_ownerships_source.refresh();

      this.proposed_ownerships_source_length--;

      if (this.deleteCancelModalReference.event.data.nationality)
        if (this.deleteCancelModalReference.event.data.nationality != 'Saudi Arabia' && this.deleteCancelModalReference.event.data.nationality != 'السعودية'&& this.deleteCancelModalReference.event.data.nationality != 'SA') {

          var non_saudi_owners_temp_list = [], bank_details_temp_source = [];

          this.bank_details_source.getAll().then((res) => {

            bank_details_temp_source = res;

            for (var i = 0; i < this.non_saudi_owners_list.length; i++)
              if (!(this.non_saudi_owners_list[i] === this.deleteCancelModalReference.event.data.name))
                non_saudi_owners_temp_list.push(this.non_saudi_owners_list[i]);

            this.non_saudi_owners_list = non_saudi_owners_temp_list;

            for (var i = 0; i < bank_details_temp_source.length; i++)

              if (bank_details_temp_source[i].accHolder === this.deleteCancelModalReference.event.data.name) {

                this.bank_details_source.remove(bank_details_temp_source[i]);

                this.bank_details_source_length--;

              }

            this.bank_details_source.refresh();

          });

        }

      if (this.ownersTableDocuments.documentList.length > 0)
        for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
          if (parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ===
            parseInt(this.deleteCancelModalReference.event.data.guiId)) {

            this.communicationsService.deleteDocumentService
              ({
                entityId: this.ownersTableDocuments.documentList[i].EntityId, refId: this.ownersTableDocuments.documentList[i].RefId,
                documentId: this.ownersTableDocuments.documentList[i].DocumentId, operationType: 'p'
              })
              .then(response => (response), err => this.resolveError());

            this.onDeleteConfirmOwnerDocument(i)

          }

      this.spinnerService.hide();

    }

  }

  onDeleteConfirmOwnerDocument(i) {

    var temp_array = [];

    for (var j = 0; j < this.ownersTableDocuments.documentList.length; j++)
      if (i !== j)
        temp_array.push(this.ownersTableDocuments.documentList[j]);

    this.ownersTableDocuments.documentList = temp_array;

  }

  resolveOwnersBPBankDelete(res1) {

    if (res1.msgId === "E") {

      this.commonService.showFailureToast(res1.msgText);
      this.spinnerService.hide();

    }

    else {

      this.bank_details_source.remove(this.deleteCancelModalReference.event.data);

      this.bank_details_source_length--;

      this.bank_details_source.refresh();

      // this.deleted_bank_details.push(this.deleteModalReference.event.data);

      var proposed_ownerships_temp_source = [];

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        var ownerDetails = proposed_ownerships_temp_source.find((o) => o.name === this.deleteCancelModalReference.event.data.accHolder);

        var shareHolderType = this.share_holder_type_list.find((o) => o.id === ownerDetails["shareHolderType"]);
        if (shareHolderType)
          ownerDetails["shareHolderType"] = shareHolderType.type;

        var investorType = this.investor_type_list.find((o) => o.id === ownerDetails["investorType"]);
        if (investorType)
          ownerDetails["investorType"] = investorType.type;

        var nationality = this.country_list.find((o) => (o.countryKey == ownerDetails["nationality"]));
        if (nationality&&this.commonService.defaultLanguage === 'en') 
          ownerDetails["nationality"] = nationality.nameEn;
          if (nationality&&this.commonService.defaultLanguage === 'ar') 
          ownerDetails["nationality"] = nationality.nameAr;

        ownerDetails["date"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(ownerDetails["date"]);

        ownerDetails["proInd"] = ownerDetails["proInd"] === "X" ? "Yes" : "No";

        ownerDetails["bankRelation"] = ownerDetails["bankRelation"] === "X" ? true : false;
        ownerDetails["nonObjection"] = ownerDetails["nonObjection"] === "X" ? true : false;
        ownerDetails["accessQawaem"] = ownerDetails["accessQawaem"] === "X" ? true : false;
        ownerDetails["acknowledgement"] = ownerDetails["acknowledgement"] === "X" ? true : false;
        ownerDetails["dealWithSidf"] = ownerDetails["dealWithSidf"] === "X" ? true : false;

      });

      this.spinnerService.hide();

    }

  }

  onDeleteCancelConfirm() {

    if (this.deleteCancelModalReference.action === this.translate.instant('COMMON.Delete')) {

      if (this.deleteCancelModalReference.table_name === 'proposed_products') {

        // this.proposed_products_source.remove(this.deleteCancelModalReference.event.data);

        // this.proposed_products_source.refresh();

        // this.proposed_products_source_length--;

        this.deleteCancelModalReference.event.data["updStatus"] = "D";

        // this.deleted_proposed_products.push(this.deleteCancelModalReference.event.data);

        // this.startedFilling = 1;

        this.postProducts(this.deleteCancelModalReference.event.data, event, [], "Delete");      
      }

      else if (this.deleteCancelModalReference.table_name === 'proposed_ownerships') {

        this.deleteCancelModalReference.event.data["updStatus"] = "D";

        if (this.deleteCancelModalReference.event.data.bankDetails)
          for (var i = 0; i < this.deleteCancelModalReference.event.data.bankDetails.length; i++)
            this.deleteCancelModalReference.event.data.bankDetails[i]["updStatus"] = "D";

        var shareHolderType = this.share_holder_type_list.find((o) => o.type === this.deleteCancelModalReference.event.data["shareHolderType"]);
        if (shareHolderType)
          this.deleteCancelModalReference.event.data["shareHolderType"] = shareHolderType.id;

        var investorType = this.investor_type_list.find((o) => o.type === this.deleteCancelModalReference.event.data["investorType"]);
        if (investorType)
          this.deleteCancelModalReference.event.data["investorType"] = investorType.id;

        var nationality = this.country_list.find((o) => (o.nameEn === this.deleteCancelModalReference.event.data["nationality"]||o.nameAr === this.deleteCancelModalReference.event.data["nationality"]));
        if (nationality)
          this.deleteCancelModalReference.event.data["nationality"] = nationality.countryKey;

        this.deleteCancelModalReference.event.data["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data["date"]);

        this.deleteCancelModalReference.event.data["proInd"] = this.deleteCancelModalReference.event.data["proInd"] === "Yes" ? "X" : "";

        this.deleteCancelModalReference.event.data["bankRelation"] = this.deleteCancelModalReference.event.data["bankRelation"] == true ? "X" : "";
        this.deleteCancelModalReference.event.data["nonObjection"] = this.deleteCancelModalReference.event.data["nonObjection"] == true ? "X" : "";
        this.deleteCancelModalReference.event.data["accessQawaem"] = this.deleteCancelModalReference.event.data["accessQawaem"] == true ? "X" : "";
        this.deleteCancelModalReference.event.data["acknowledgement"] = this.deleteCancelModalReference.event.data["acknowledgement"] == true ? "X" : "";
        this.deleteCancelModalReference.event.data["dealWithSidf"] = this.deleteCancelModalReference.event.data["dealWithSidf"] == true ? "X" : "";

        this.spinnerService.show();

        this.preliminaryRequestService.postOwnersBP(this.deleteCancelModalReference.event.data)
          .then((res1) => (this.onDeleteConfirmOwner(res1)), err => this.resolveError());

      }

      else if (this.deleteCancelModalReference.table_name === 'representatives') {

        this.spinnerService.show();

        this.communicationsService.getDocumentService(this.deleteCancelModalReference.event.data.buPartner, "p")
          .then(requests => (this.onGetRepresentativesDocuments(requests, event, "delete")), err => this.resolveError());

      }

      else if (this.deleteCancelModalReference.table_name == 'bank_details') {

        this.deleteCancelModalReference.event.data["updStatus"] = "D";

        var proposed_ownerships_temp_source = [];

        this.proposed_ownerships_source.getAll().then((res) => {

          proposed_ownerships_temp_source = res;

          var ownerDetails = proposed_ownerships_temp_source.find((o) => o.name == this.deleteCancelModalReference.event.data.accHolder);

          var shareHolderType = this.share_holder_type_list.find((o) => o.type == ownerDetails["shareHolderType"]);
          if (shareHolderType)
            ownerDetails["shareHolderType"] = shareHolderType.id;

          var investorType = this.investor_type_list.find((o) => o.type == ownerDetails["investorType"]);
          if (investorType)
            ownerDetails["investorType"] = investorType.id;

          var nationality = this.country_list.find((o) => (o.nameEn === ownerDetails["nationality"]||o.nameAr === ownerDetails["nationality"]));
          if (nationality)
            ownerDetails["nationality"] = nationality.countryKey;

          ownerDetails["date"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(ownerDetails["date"]);

          ownerDetails["proInd"] = ownerDetails["proInd"] === "Yes" ? "X" : "";

          ownerDetails["bankRelation"] = ownerDetails["bankRelation"] == true ? "X" : "";
          ownerDetails["nonObjection"] = ownerDetails["nonObjection"] == true ? "X" : "";
          ownerDetails["accessQawaem"] = ownerDetails["accessQawaem"] == true ? "X" : "";
          ownerDetails["acknowledgement"] = ownerDetails["acknowledgement"] == true ? "X" : "";
          ownerDetails["dealWithSidf"] = ownerDetails["dealWithSidf"] == true ? "X" : "";

          console.log("bankDetails1");
          console.log( ownerDetails["bankDetails"]);
          for (var i = 0; i < ownerDetails["bankDetails"].length; i++)
            if (ownerDetails["bankDetails"][i].bnkAccNumber === this.deleteCancelModalReference.event.data.bnkAccNumber)
              ownerDetails["bankDetails"][i] = this.deleteCancelModalReference.event.data;

              console.log("bankDetails2");
              console.log( ownerDetails["bankDetails"]);
          this.spinnerService.show();

          this.preliminaryRequestService.postOwnersBP(ownerDetails)
            .then((res1) => (this.resolveOwnersBPBankDelete(res1)), err => this.resolveError());

        });

      }

      else if (this.deleteCancelModalReference.table_name === 'real_est') {

        this.deleteCancelModalReference.event.data["updStatus"] = "D";

        this.deleteCancelModalReference.event.data["purchasePrice"] = parseFloat(this.deleteCancelModalReference.event.data["purchasePrice"].replace(/[^\d.-]/g, '')).toFixed(4) + "";
        this.deleteCancelModalReference.event.data["purchaseDate"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data["purchaseDate"]);

        this.deleteCancelModalReference.event.data["currentMarketValue"] = parseFloat(this.deleteCancelModalReference.event.data["currentMarketValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";
        this.deleteCancelModalReference.event.data["currentMarketDate"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data["currentMarketDate"]);

        var propertyType = this.property_type_list.find((o) => o.propertyTypeEn === this.deleteCancelModalReference.event.data["propertyType"]||o.propertyTypeAr === this.deleteCancelModalReference.event.data["propertyType"]);
        if (propertyType)
          this.deleteCancelModalReference.event.data["propertyType"] = propertyType.id;

        var country = this.country_list.find((o) => o.nameEn === this.deleteCancelModalReference.event.data["country"]||o.nameAr === this.deleteCancelModalReference.event.data["country"]);
        if (country)
          this.deleteCancelModalReference.event.data["country"] = country.countryKey;


        var post_data = {

          "realEstateDetails": [{

            "preliminaryId": this.deleteCancelModalReference.event.data["preliminaryId"],
            "projectId": this.deleteCancelModalReference.event.data["projectId"],
            "buPartner": this.deleteCancelModalReference.event.data["buPartner"],
            "nameEn": this.deleteCancelModalReference.event.data["nameEn"],
            "propertyType": this.deleteCancelModalReference.event.data["propertyType"],
            "country": this.deleteCancelModalReference.event.data["country"],
            "city": this.deleteCancelModalReference.event.data["city"],
            "location": this.deleteCancelModalReference.event.data["location"],
            "area": this.deleteCancelModalReference.event.data["area"],
            "purchasePrice": this.deleteCancelModalReference.event.data["purchasePrice"],
            "purchaseDate": this.deleteCancelModalReference.event.data["purchaseDate"],
            "currentMarketValue": this.deleteCancelModalReference.event.data["currentMarketValue"],
            "currentMarketDate": this.deleteCancelModalReference.event.data["currentMarketDate"],
            "titleDeed": this.deleteCancelModalReference.event.data["titleDeed"],
            "guiId": this.deleteCancelModalReference.event.data["guiId"],
            "updStatus": this.deleteCancelModalReference.event.data["updStatus"],
            "seqNo": this.deleteCancelModalReference.event.data["seqNo"] ?
              this.deleteCancelModalReference.event.data["seqNo"] :
              ""

          }]

        };

        this.spinnerService.show();

        this.preliminaryRequestService.postOwnersAddInfo(post_data)
          .then((res) => (this.resolveRealEstatePost(res, "delete", "", "", "")), err => this.resolveError());

      }

      else if (this.deleteCancelModalReference.table_name == 'list_comp') {

        this.deleteCancelModalReference.event.data["updStatus"] = "D";

        this.deleteCancelModalReference.event.data["shareValue"] = parseFloat(this.deleteCancelModalReference.event.data["shareValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

        this.deleteCancelModalReference.event.data["crIssueDate"] = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data["crIssueDate"]);

        var post_data_1 = {

          "companyDetails": [{

            "preliminaryId": this.deleteCancelModalReference.event.data["preliminaryId"],
            "projectId": this.deleteCancelModalReference.event.data["projectId"],
            "buPartner": this.deleteCancelModalReference.event.data["buPartner"],
            "nameEn": this.deleteCancelModalReference.event.data["nameEn"],
            "shareValue": this.deleteCancelModalReference.event.data["shareValue"],
            "sharePercentage": this.deleteCancelModalReference.event.data["sharePercentage"],
            "crNumber": this.deleteCancelModalReference.event.data["crNumber"],
            "crIssueDate": this.deleteCancelModalReference.event.data["crIssueDate"],
            "guiId": this.deleteCancelModalReference.event.data["guiId"],
            "updStatus": this.deleteCancelModalReference.event.data["updStatus"],
            "seqNo": this.deleteCancelModalReference.event.data["seqNo"] ?
              this.deleteCancelModalReference.event.data["seqNo"] :
              ""

          }]

        };

        this.spinnerService.show();

        this.preliminaryRequestService.postOwnersAddInfo(post_data_1)
          .then((res) => (this.resolveCompaniesPost(res, "delete", "", "", "")), err => this.resolveError());

      }

      else if (this.deleteCancelModalReference.table_name === 'other_inv') {

        this.deleteCancelModalReference.event.data["updStatus"] = "D";
        
        var investmentType = this.investment_type_list.find((o) => o.investTypeEn === this.deleteCancelModalReference.event.data["investmentType"]||o.investTypeAr === this.deleteCancelModalReference.event.data["investmentType"]);
        if (investmentType)
          this.deleteCancelModalReference.event.data["investmentType"] = investmentType.id;

        this.deleteCancelModalReference.event.data["value"] = parseFloat(this.deleteCancelModalReference.event.data["value"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

        this.deleteCancelModalReference.event.data["marketPrice"] = parseFloat(this.deleteCancelModalReference.event.data["marketPrice"].replace(/[^\d.-]/g, '')).toFixed(4) + "";
        this.deleteCancelModalReference.event.data["totalMarketValue"] = parseFloat(this.deleteCancelModalReference.event.data["totalMarketValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

        var post_data_2 = {

          "investmentDetails": [{

            "preliminaryId": this.deleteCancelModalReference.event.data["preliminaryId"],
            "projectId": this.deleteCancelModalReference.event.data["projectId"],
            "buPartner": this.deleteCancelModalReference.event.data["buPartner"],
            "nameEn": this.deleteCancelModalReference.event.data["nameEn"],
            "investmentType": this.deleteCancelModalReference.event.data["investmentType"],
            "value": this.deleteCancelModalReference.event.data["value"],
            "quantity": this.deleteCancelModalReference.event.data["quantity"],
            "marketPrice": this.deleteCancelModalReference.event.data["marketPrice"],
            "totalMarketValue": this.deleteCancelModalReference.event.data["totalMarketValue"],
            "guiId": this.deleteCancelModalReference.event.data["guiId"],
            "updStatus": this.deleteCancelModalReference.event.data["updStatus"]

          }]

        };

        this.spinnerService.show();

        this.preliminaryRequestService.postOwnersAddInfo(post_data_2)
          .then((res) => (this.resolveOtherInvestmentsPost(res, "delete", "", "", "")), err => this.resolveError());

      }

    }

    else if (this.deleteCancelModalReference.action === this.translate.instant('COMMON.GoBack')) {

      if (this.screen_number === 2) {

        if (this.preliminaryId == "") {

          this.spinnerService.show();

          var proposed_products_temp_source = [],
            // proposed_ownerships_temp_source = [], bank_details_temp_source = [], 
            representatives_temp_source = [];

          this.proposed_products_source.getAll().then((res) => {

            proposed_products_temp_source = res;

            // this.proposed_ownerships_source.getAll().then((res) => {

            //   proposed_ownerships_temp_source = res;

            this.representatives_source.getAll().then((res) => {

              representatives_temp_source = res;

              // this.bank_details_source.getAll().then((res) => {

              //   bank_details_temp_source = res;

              try {

               // var temp_category = [{ preliminaryId: "", id: "", category: "" }];
                var temp_region = [{ preliminaryId: "", id: "", region: "" }];
                var temp_type = [{ preliminaryId: "", id: "", type: "", others: "" }];
                var temp_profile_type = [{ preliminaryId: "", id: "", prqTypeEn: "" }];

                //temp_category[0].preliminaryId = this.preliminaryId;
                //temp_category[0].id = this.inputs.CategorySelected;

                //var resCategory = this.inputs.Category.find((o) => o.id === this.inputs.CategorySelected);
                //if (resCategory !== undefined)
                 // temp_category[0].category = resCategory.category;

                temp_region[0].preliminaryId = this.preliminaryId;
                temp_region[0].id = this.inputs.RegionSelected;
                var resRegion = this.inputs.Region.find((o) => o.id === this.inputs.RegionSelected);
                if (resRegion !== undefined)
                  temp_region[0].region = resRegion.region;

                temp_type[0].preliminaryId = this.preliminaryId;
                temp_type[0].id = this.inputs.TypeSelected;
                var resType = this.inputs.Type.find((o) => o.id === this.inputs.TypeSelected);
                if (resType !== undefined)
                  temp_type[0].type = resType.type;

                if (this.inputs.TypeSelected == "OTH")
                  temp_type[0].others = this.inputs.OtherPurpose;
                temp_profile_type[0].preliminaryId = this.preliminaryId; 
                temp_profile_type[0].id = this.inputs.ProfileType;
                temp_profile_type[0].prqTypeEn = this.inputs.ProfileTypeSelected;

                for (var i = 0; i < proposed_products_temp_source.length; i++) {

                  var unit = this.unit_list.find((o) => o.UOMText === proposed_products_temp_source[i].unit);
                  if (unit)
                    proposed_products_temp_source[i].unit = unit.UOMId;

                  var isicActivity = this.isic_activity_list.find((o) =>o.activityNameAr === proposed_products_temp_source[i].activityName || o.activityName === proposed_products_temp_source[i].activityName)
                  if (isicActivity) {

                    proposed_products_temp_source[i]["divisionId"] = isicActivity.divisionId;
                    proposed_products_temp_source[i]["activityId"] = isicActivity.activityId;

                  }

                  proposed_products_temp_source[i]["proInd"] = proposed_products_temp_source[i]["proInd"] === "Yes" ? "X" : "";

                }

                for (var i = 0; i < this.deleted_proposed_products.length; i++) {

                  var unit = this.unit_list.find((o) => o.UOMText === this.deleted_proposed_products[i].unit);
                  if (unit)
                    this.deleted_proposed_products[i].unit = unit.UOMId;

                  var isicActivity = this.isic_activity_list.find((o) =>o.activityNameAr === proposed_products_temp_source[i].activityName || o.activityName === this.deleted_proposed_products[i].activityName)
                  if (isicActivity) {

                    this.deleted_proposed_products[i]["divisionId"] = isicActivity.divisionId;
                    this.deleted_proposed_products[i]["activityId"] = isicActivity.activityId;

                  }

                  this.deleted_proposed_products[i]["proInd"] = this.deleted_proposed_products[i]["proInd"] === "Yes" ? "X" : "";

                }


                // for (var i = 0; i < proposed_ownerships_temp_source.length; i++) {

                //   var shareHolderType = this.share_holder_type_list.find((o) => o.type == proposed_ownerships_temp_source[i].shareHolderType);
                //   if (shareHolderType)
                //     proposed_ownerships_temp_source[i].shareHolderType = shareHolderType.id;

                //   var investorType = this.investor_type_list.find((o) => o.type == proposed_ownerships_temp_source[i].investorType);
                //   if (investorType)
                //     proposed_ownerships_temp_source[i].investorType = investorType.id;

                //   var nationality = this.country_list.find((o) => (o.nameEn == proposed_ownerships_temp_source[i].nationality));
                //   if (nationality)
                //     proposed_ownerships_temp_source[i].nationality = nationality.countryKey;

                //   if (proposed_ownerships_temp_source[i].date)
                //     proposed_ownerships_temp_source[i].date = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_temp_source[i].date);

                //   proposed_ownerships_temp_source[i]["proInd"] = proposed_ownerships_temp_source[i]["proInd"] == "Yes" ? "X" : "";

                // }

                // for (var i = 0; i < this.deleted_proposed_ownerships.length; i++) {

                //   var shareHolderType = this.share_holder_type_list.find((o) => o.type == this.deleted_proposed_ownerships[i].shareHolderType);
                //   if (shareHolderType)
                //     this.deleted_proposed_ownerships[i].shareHolderType = shareHolderType.id;

                //   var investorType = this.investor_type_list.find((o) => o.type == this.deleted_proposed_ownerships[i].investorType);
                //   if (investorType)
                //     this.deleted_proposed_ownerships[i].investorType = investorType.id;

                //   var nationality = this.country_list.find((o) => (o.nameEn == this.deleted_proposed_ownerships[i].nationality));
                //   if (nationality)
                //     this.deleted_proposed_ownerships[i].nationality = nationality.countryKey;

                //   if (this.deleted_proposed_ownerships[i].date)
                //     this.deleted_proposed_ownerships[i].date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleted_proposed_ownerships[i].date);

                //   this.deleted_proposed_ownerships[i]["proInd"] = this.deleted_proposed_ownerships[i]["proInd"] == "Yes" ? "X" : "";

                // };

                // bank_details_temp_source = bank_details_temp_source.concat(this.deleted_bank_details);

                // for (var i = 0; i < bank_details_temp_source.length; i++) {

                //   var country = this.country_list.find((o) => (o.nameEn == bank_details_temp_source[i].country));
                //   if (country)
                //     bank_details_temp_source[i].country = country.countryKey;

                // }

                // for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
                //   for (var j = 0; j < bank_details_temp_source.length; j++)
                //     if (JSON.parse(JSON.stringify(proposed_ownerships_temp_source[i])).name ===
                //       JSON.parse(JSON.stringify(bank_details_temp_source[j])).accHolder) {

                //       if (proposed_ownerships_temp_source[i].updStatus != "C" || proposed_ownerships_temp_source[i].updStatus != "")
                //         proposed_ownerships_temp_source[i].updStatus = "U";

                //       if (bank_details_temp_source[j].updStatus != "D") {

                //         var flag = 0;

                //         for (var k = 0; (k < proposed_ownerships_temp_source[i].bankDetails.length) && flag == 0; k++)
                //           if (bank_details_temp_source[j].accHolder == proposed_ownerships_temp_source[i].bankDetails[k].accHolder)
                //             flag = 1;

                //         if (flag == 0)
                //           proposed_ownerships_temp_source[i].bankDetails.push(bank_details_temp_source[j]);

                //       }

                //     }

                for (var i = 0; i < representatives_temp_source.length; i++) {

                  representatives_temp_source[i]["mciInd"] = representatives_temp_source[i]["mciInd"] === "Yes" ? "X" : "";

                  var idType = this.id_type_list.find((o) => o.type === representatives_temp_source[i].idType);
                  if (idType)
                    representatives_temp_source[i].idType = idType.id;

                  if (representatives_temp_source[i].dob)
                    representatives_temp_source[i].dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(representatives_temp_source[i].dob);

                }

                for (var i = 0; i < this.deleted_representatives.length; i++) {

                  this.deleted_representatives[i]["mciInd"] = this.deleted_representatives[i]["mciInd"] === "Yes" ? "X" : "";

                  var idType = this.id_type_list.find((o) => o.type === this.deleted_representatives[i].idType);
                  if (idType)
                    this.deleted_representatives[i].idType = idType.id;

                  if (this.deleted_representatives[i].dob)
                    this.deleted_representatives[i].dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleted_representatives[i].dob);

                }

                var post_data = {

                  "ProjectId": this.inputs.ProjectId,
                  "PreliminaryId": this.preliminaryId,
                  "UpdStatus": "L",
                  "IndustrialSector": this.inputs.IndustrialSectorSelected,
                  //"SectorCategory": temp_category,
                  "SectorRegions": temp_region,
                  "PreRequestType": temp_type,
                  "PrqTypesList": temp_profile_type,
                  "CommercialRegistrationdetails": 
                    this.CommercialRegistrationdetails_final
                    ,
                  "LicenseDetails": [{
                    preliminaryId: this.inputs.licenseDetails[0].preliminaryId,
                    licenseType: this.inputs.licenseDetails[0].licenseType,
                    licenseId: this.inputs.licenseDetails[0].licenseId,
                    licStartDate: !this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].licStartDate) : "",
                    licEndDate: !this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].licEndDate) : "",
                    licStartDateGreg: this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.licenseDetails[0].licStartDate) : "",
                    licEndDateGreg: this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.licenseDetails[0].licEndDate) : "",
                    crNumber: this.inputs.licenseDetails[0].crNumber,
                    crIssueDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].crIssueDate),
                    crExpiryDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].crExpiryDate),
                    crLocationAr: this.inputs.licenseDetails[0].crLocationAr,
                    proCapital: this.commonService.returnValueStringFromSARString(this.inputs.licenseDetails[0].proCapital),
                    factoryName: this.inputs.licenseDetails[0].factoryName,
                    crCity: this.inputs.licenseDetails[0].crCity,
                    addressDesc: this.inputs.licenseDetails[0].addressDesc,
                    landNo: this.inputs.licenseDetails[0].landNo,
                    city: this.inputs.licenseDetails[0].city,
                    mngmntArea: this.inputs.licenseDetails[0].mngmntArea,
                    poBox: this.inputs.licenseDetails[0].poBox,
                    storesArea: this.inputs.licenseDetails[0].storesArea,
                    totalArea: this.inputs.licenseDetails[0].totalArea,
                    longX: this.inputs.licenseDetails[0].longX,
                    latitudeY: this.inputs.licenseDetails[0].latitudeY,
                    zipCode: this.inputs.licenseDetails[0].zipCode,
                    crName: this.inputs.licenseDetails[0].crName,
                    crCapital: this.inputs.licenseDetails[0].crCapital,
                    crLeagalTypeEn: this.inputs.licenseDetails[0].crLeagalTypeEn,
                    crLeagalTypeAr: this.inputs.licenseDetails[0].crLeagalTypeAr,
                    crPhone: this.inputs.licenseDetails[0].crPhone,
                    crFaxNo: this.inputs.licenseDetails[0].crFaxNo,
                    crAddress: this.inputs.licenseDetails[0].crAddress,
                    crBuildingNo: this.inputs.licenseDetails[0].crBuildingNo,
                    crAdditionalNo: this.inputs.licenseDetails[0].crAdditionalNo,
                    crUnitNo: this.inputs.licenseDetails[0].crUnitNo,
                    crDistrictArea: this.inputs.licenseDetails[0].crDistrictArea,
                    crZipCode: this.inputs.licenseDetails[0].crZipCode,
                    crNameAr: this.inputs.licenseDetails[0].crNameAr,
                    factoryNameAr: this.inputs.licenseDetails[0].factoryNameAr,
                    reqAmount: this.commonService.returnValueStringFromSARString(this.inputs.licenseDetails[0].reqAmount),
                    crLegalInd: this.inputs.licenseDetails[0].crLegalInd
                  }],
                  RmList: [{
                    "preliminaryId": this.preliminaryId,
                    "rmEmailId": this.inputs.RmEmail,
                    "rmEmpId": "",
                    "rmNameAr": "",
                    "rmNameEn": "",
                    "userId": ""
                  }],
                  // "OwnersDetails": proposed_ownerships_temp_source.concat(this.deleted_proposed_ownerships),
                  // "ProductDetails": proposed_products_temp_source.concat(this.deleted_proposed_products),
                  "RepresentativeDetails": representatives_temp_source.concat(this.deleted_representatives),
                  "UserProfile": [
                    {
                      "profileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                      "customerNo": "",
                      "origin": "CP"
                    }
                  ]
                };
                
                this.preliminaryRequestService.postPreliminaryRequest(post_data) 
                  .then((res) => (this.onResult(res, 3, proposed_products_temp_source, representatives_temp_source)), err => this.resolveError());
              }

              catch (err) {

                this.resolveError();
                this.onResultRevert(proposed_products_temp_source, representatives_temp_source);

              }

            });

          });

          // });

          // });

        }

        else
          this.from_my_loans ? this.router.navigate(['/pages/my-loans']) : this.router.navigate(['/pages/new-request/preliminary-request']);

      }

      else
        this.from_my_loans ? this.router.navigate(['/pages/my-loans']) : this.router.navigate(['/pages/new-request/preliminary-request']);

    }

    this.deleteCancelModalReference.close();

  }

  onCloseDeleteCancelModal() {

    this.deleteCancelModalReference.close();

  }

  onOpenIndustrialSectorPopUp(industrial_sector_pop_up) {

    if (this.add_edit_delete_show) {

      this.searchText = "";

      this.industrial_sector_pop_up_array = this.inputs.IndustrialSector;

      let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
      delete options.size;

     this.industrialSectorPopUpReference = this.modalService.open(industrial_sector_pop_up, options);

    }

  }

  onSearchIndustrialSectorPopUpItem() {

    this.industrial_sector_pop_up_array = this.inputs.IndustrialSector;

    var temp_array = [];

    for (var i = 0; i < this.industrial_sector_pop_up_array.length; i++) {

      if (this.industrial_sector_pop_up_array[i].name.toLowerCase().includes(this.searchText.toLowerCase()))
        temp_array.push(this.industrial_sector_pop_up_array[i])

    }

    this.industrial_sector_pop_up_array = temp_array;

  }

  onResetIndustrialSectorPopUpSearch() {

    this.searchText = "";

    this.industrial_sector_pop_up_array = this.inputs.IndustrialSector;

  }

  onClickIndustrialSectorPopUpItem(industrial_sector_item) {

    this.inputs.IndustrialSectorSelected[0] = industrial_sector_item;

    this.industrial_sector_vs = false;
    this.startedFilling = 1;
    this.industrialSectorPopUpReference.close();

  }

  onCloseIndustrialSectorPopUp() {

    this.industrialSectorPopUpReference.close();

  }
  onSelect(event){
    console.log(event);
    this.prevRequestId=event.RequestId;
    
  }
  copyRequest(){
    this.getLicDetBasedOnPrevReq();
  }
  onView(event, table_name) {

    let preliminaryRequestModalParams = {};

    let projectOwnershipModalParams = {};

    var temp_selected_product_name = _.find(this.harmonized_code_pop_up_array, function (num) { return num.hsCode === event.data.hsCode });
    var temp_selected_desc_product_name = temp_selected_product_name ? temp_selected_product_name.hsDespEn : "";
    if (table_name === 'proposed_products') {

      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.ViewMciOrProposedProducts'),

        method: "view",

        form_number: 2,

        inputs: [
          {
            id: "divisionName",
            name: this.translate.instant('PRELIMINARY_REQUEST.mainActivity'),
            type: "text",
            value: event.data.divisionNameAr,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "activityName",
            name: this.translate.instant('PRELIMINARY_REQUEST.subActivity'),
            type: "text",
            value: event.data.activityName,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "hsCode",
            name: this.translate.instant('PRELIMINARY_REQUEST.harmonizedCode'),
            type: "text",
            value: event.data.hsCode + " - " + temp_selected_desc_product_name,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "productName",
            name: this.translate.instant('PRELIMINARY_REQUEST.productName'),
            type: "text",
            value: event.data.productName,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "licCapacity",
            name: this.translate.instant('PRELIMINARY_REQUEST.licenseCapacity'),
            type: "text",
            value: event.data.licCapacity,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "proInd",
            name: this.translate.instant('PRELIMINARY_REQUEST.CapacityProposed'),
            type: "text",
            value: event.data.proInd,
            required: "true",
            visible: event.data.mciInd === "X" ? true : false,
            form_number: 2
          },
          {
            id: "proCapacity",
            name: this.translate.instant('PRELIMINARY_REQUEST.proposedCapacity'),
            type: "text",
            value: event.data.proCapacity,
            required: "true",
            visible: (event.data.proInd === "Yes" && event.data.mciInd === "X") ? true : false,
            form_number: 2
          },
          {
            id: "unit",
            name: this.translate.instant('PRELIMINARY_REQUEST.unitOfMeasure'),
            type: "text",
            value: event.data.unit,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "rawMaterials",
            name: this.translate.instant('PRELIMINARY_REQUEST.rawMaterials'),
            type: "text",
            value: event.data.rawMaterial,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "usage",
            name: this.translate.instant('PRELIMINARY_REQUEST.Usage'),
            type: "textarea",
            value: event.data.usage,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "applications",
            name: this.translate.instant('PRELIMINARY_REQUEST.Applications'),
            type: "text",
            value: event.data.applications,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "users",
            name: this.translate.instant('PRELIMINARY_REQUEST.Users'),
            type: "text",
            value: event.data.users,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "weight",
            name: this.translate.instant('PRELIMINARY_REQUEST.Weight'),
            type: "number",
            value: +event.data.weight + "",
            required: "true",
            visible: true,
            form_number: 2,
            combo: true,
            id_unit: "weightUnit",
            name_unit: this.translate.instant('PRELIMINARY_REQUEST.WeightUnit'),
            selected_unit: this.findTextFromId(this.unit_list, event.data.weightUnit),
            type_unit: "text",
          },
          {
            id: "size",
            name: this.translate.instant('PRELIMINARY_REQUEST.Size'),
            type: "number",
            value: +event.data.size + "",
            required: "true",
            visible: true,
            form_number: 2,
            combo: true,
            id_unit: "sizeUnit",
            name_unit: this.translate.instant('PRELIMINARY_REQUEST.SizeUnit'),
            selected_unit: this.findTextFromId(this.unit_list, event.data.sizeUnit),
            type_unit: "text",
          },
          {
            id: "shelfLife",
            name: this.translate.instant('PRELIMINARY_REQUEST.ShelfLife'),
            type: "number",
            value: +event.data.shelfLife + "",
            required: "true",
            visible: true,
            form_number: 2,
            combo: true,
            id_unit: "shelfLifeUnit",
            name_unit: this.translate.instant('PRELIMINARY_REQUEST.ShelfLifeUnit'),
            selected_unit: this.findTextFromId(this.unit_list, event.data.shelfLifeUnit),
            type_unit: "text",
          },
          {
            id: "brandName",
            name: this.translate.instant('PRELIMINARY_REQUEST.BrandName'),
            type: "text",
            value: event.data.brandName,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "substitutes",
            name: this.translate.instant('PRELIMINARY_REQUEST.Substitutes'),
            type: "text",
            value: event.data.substitutes,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "annualPrdCap",
            name: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacity'),
            type: "number",
            value: +event.data.annualPrdCap + "",
            required: "true",
            visible: true,
            form_number: 2,
            combo: true,
            id_unit: "annualPrdCapUnit",
            name_unit: this.translate.instant('PRELIMINARY_REQUEST.AnnualProductionCapacityUnit'),
            selected_unit: this.findTextFromId(this.unit_list, event.data.annualPrdCapUnit),
            type_unit: "text",
          },
          {
            id: "licPrdCap",
            name: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacity'),
            type: "number",
            value: +event.data.licPrdCap + "",
            required: "true",
            visible: true,
            form_number: 2,
            combo: true,
            id_unit: "licPrdCapUnit",
            name_unit: this.translate.instant('PRELIMINARY_REQUEST.LicenseProductionCapacityUnit'),
            selected_unit: this.findTextFromId(this.unit_list, event.data.licPrdCapUnit),
            type_unit: "text",
          },
          {
            id: "startCommPrdYear",
            name: this.translate.instant('PRELIMINARY_REQUEST.StartCommercialProductionYear'),
            type: "text",
            value: event.data.startCommPrdYear,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "numTargetEndUsers",
            name: this.translate.instant('PRELIMINARY_REQUEST.NumberOfTargetedEndUsers'),
            type: "text",
            value: event.data.numTargetEndUsers,
            required: "true",
            visible: true,
            form_number: 2
          },
        ],
        buttons: []
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else if (table_name === 'proposed_ownerships') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.ownersTableDocuments.url;

      for (var i = 0; i < this.ownersTableDocuments.documentList.length; i++)
        if (parseInt(this.ownersTableDocuments.documentList[i].RelatedEntityId) ===
          parseInt(event.data.guiId))
          temp_documents.documentList.push(this.ownersTableDocuments.documentList[i]);

      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.ViewMciOrProposedOwnerships'),

        method: "view",

        form_number: 2,

        documents: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType === this.translate.instant('COMMON.Saudi National') ) ? temp_documents
          : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Saudi National') ) ? temp_documents
            : (event.data.shareHolderType ===   this.translate.instant('COMMON.Company')) ? temp_documents : (event.data.shareHolderType === "شركة") ? temp_documents : "no_documents",

        inputs: [
          {
            id: "shareHolderType",
            name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderType'),
            type: "text",
            value: event.data.shareHolderType,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "investorType",
            name: this.translate.instant('PRELIMINARY_REQUEST.InvestorType'),
            type: "text",
            value: event.data.investorType,
            required: "true",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual')) ? true : false,
            form_number: 2
          },
          {
            id: "nationalId",
            name: this.translate.instant('PRELIMINARY_REQUEST.NationalId'),
            type: "text",
            value: event.data.idNumber,
            required: "true",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType ===  this.translate.instant('COMMON.Saudi National') ) ? true : (event.data.shareHolderType === "فرد" && event.data.investorType === this.translate.instant('COMMON.Saudi National')) ? true : false,
            form_number: 2
          },
          {
            id: "iqamaNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.IqamaNumber'),
            type: "text",
            value: event.data.idNumber,
            required: "true",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType ===    this.translate.instant('COMMON.Resident')) ? true : (event.data.shareHolderType === "فرد" && event.data.investorType === this.translate.instant('COMMON.Resident')) ? true : false,
            form_number: 2
          },
          {
            id: "date",
            name: this.translate.instant('PRELIMINARY_REQUEST.DateofBirth'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.date),
            required: "true",
            visible: (event.data.shareHolderType === this.translate.instant('COMMON.Individual') && event.data.investorType ===  this.translate.instant('COMMON.Saudi National')) ? true : (event.data.shareHolderType === "فرد" && event.data.investorType ===this.translate.instant('COMMON.Saudi National')) ? true : false,
            form_number: 2
          },
          {
            id: "crNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.CompanyNumber'),
            type: "text",
            value: event.data.idNumber,
            required: "true",
            visible: event.data.shareHolderType === "Company" ? true : event.data.shareHolderType === "شركة" ? true : false,
            form_number: 2
          },
          {
            id: "crIssueDate",
            name: this.translate.instant('PRELIMINARY_REQUEST.CompanyIssueDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.date),
            required: "true",
            visible: event.data.shareHolderType === "Company" ? true : event.data.shareHolderType === "شركة" ? true : false,
            form_number: 2
          },
          {
            id: "name",
            name: this.translate.instant('PRELIMINARY_REQUEST.name'),
            type: "text",
            value: event.data.name,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "nationality",
            name: this.translate.instant('PRELIMINARY_REQUEST.Nationality'),
            type: "text",
            value: event.data.nationality,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "percentage",
            name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentage'),
            type: "text",
            value: event.data.percentage ? parseFloat(event.data.percentage).toFixed(4) : "",
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "proInd",
            name: this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentageProposed'),
            type: "text",
            value: event.data.proInd,
            required: "true",
            visible: event.data.mciInd === "X" ? true : false,
            form_number: 2
          },
          {
            id: "proPercentage",
            name: this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentage'),
            type: "text",
            value: parseFloat(event.data.proPercentage).toFixed(4),
            required: "true",
            visible: (event.data.proInd === "Yes" && event.data.mciInd === "X") ? true : false,
            form_number: 2
          },
          {
            id: "passportNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.PassportNumber'),
            type: "text",
            value: event.data.idNumber,
            required: "true",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType ===this.translate.instant('COMMON.Foreigner') ) ? true : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? true : false,
            form_number: 2
          },
          {
            id: "passportExpiryDate",
            name: this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.date),
            required: "true",
            visible: (event.data.shareHolderType === this.translate.instant('COMMON.Individual') && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? true : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? true : false,
            form_number: 2
          },
          {
            id: "street",
            name: this.translate.instant('PRELIMINARY_REQUEST.Street'),
            type: "text",
            value: event.data.street,
            required: "false",
            visible: true,
            form_number: 2
          },
          {
            id: "city",
            name: this.translate.instant('PRELIMINARY_REQUEST.City'),
            type: "text",
            value: event.data.city,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "districtArea",
            name: this.translate.instant('PRELIMINARY_REQUEST.DistrictArea'),
            type: "text",
            value: event.data.districtArea,
            required: "false",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? false : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? false : true,
            form_number: 2
          },
          {
            id: "unitNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.UnitNumber'),
            type: "text",
            value: event.data.unitNo,
            required: "true",
            visible: (event.data.shareHolderType ===   this.translate.instant('COMMON.Individual') && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? false : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? false : true,
            form_number: 2
          },
          {
            id: "buildingNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.BuildingNumber'),
            type: "text",
            value: event.data.buildingNo,
            required: "true",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? false : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? false : true,
            form_number: 2
          },
          {
            id: "additionalNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.AdditionalNumber'),
            type: "text",
            value: event.data.additionalNo,
            required: "true",
            visible: (event.data.shareHolderType ===  this.translate.instant('COMMON.Individual') && event.data.investorType === this.translate.instant('COMMON.Foreigner') ) ? false : (event.data.shareHolderType === "فرد" && event.data.investorType ===  this.translate.instant('COMMON.Foreigner')) ? false : true,
            form_number: 2
          },
          {
            id: "zipCode",
            name: this.translate.instant('PRELIMINARY_REQUEST.PostalCode'),
            type: "text",
            value: event.data.zipCode,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "phoneNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.PhoneNumber'),
            type: "text",
            value: event.data.phoneNo,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "faxNo",
            name: this.translate.instant('PRELIMINARY_REQUEST.FaxNumber'),
            type: "text",
            value: event.data.faxNo,
            required: "false",
            visible: true,
            form_number: 2
          },
          {
            id: "emailId",
            name: this.translate.instant('PRELIMINARY_REQUEST.EmailId'),
            type: "text",
            value: event.data.emailId,
            required: "true",
            visible: true,
            form_number: 2
          }
        ],
        buttons: []
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else if (table_name === 'representatives') {

      this.spinnerService.show();

      this.communicationsService.getDocumentService(event.data.buPartner, "p")
        .then(requests => (this.onGetRepresentativesDocuments(requests, event, "view")), err => this.resolveError());

    }

    else if (table_name === 'bank_details') {

      preliminaryRequestModalParams = {

        header: this.translate.instant('PRELIMINARY_REQUEST.ViewBankDetails'),

        method: "view",

        form_number: 2,

        inputs: [
          {
            id: "accHolder",
            name: this.translate.instant('PRELIMINARY_REQUEST.AccountHolder'),
            type: "text",
            value: event.data.accHolder,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "bnkAccNumber",
            name: this.translate.instant('PRELIMINARY_REQUEST.BankAccountNumber'),
            type: "text",
            value: event.data.bnkAccNumber,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "bankName",
            name: this.translate.instant('PRELIMINARY_REQUEST.bankName'),
            type: "text",
            value: event.data.bankName,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repName",
            name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeName'),
            type: "text",
            value: event.data.repName,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repPosition",
            name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativePosition'),
            type: "text",
            value: event.data.repPosition,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repEmail",
            name: this.translate.instant('PRELIMINARY_REQUEST.RepresentativeEmailId'),
            type: "text",
            value: event.data.repEmail,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "repMobile",
            name: "Bank Representative Phone",
            type: "text",
            value: event.data.repMobile,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "street",
            name: this.translate.instant('PRELIMINARY_REQUEST.Branch'),
            type: "text",
            value: event.data.street,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "city",
            name: this.translate.instant('PRELIMINARY_REQUEST.City'),
            type: "text",
            value: event.data.city,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "country",
            name: this.translate.instant('PRELIMINARY_REQUEST.Country'),
            type: "text",
            value: event.data.country,
            required: "true",
            visible: true,
            form_number: 2
          },
          {
            id: "address",
            name: this.translate.instant('PRELIMINARY_REQUEST.Address'),
            type: "textarea",
            value: event.data.address,
            required: "true",
            visible: true,
            form_number: 2
          }
        ],
        buttons: []
      };

      let preliminaryRequestModal = this.modalService.open(PreliminaryRequestModalsComponent, this.commonService.modalOptions);
      preliminaryRequestModal.componentInstance.PreliminaryRequestModalsForm = preliminaryRequestModalParams;

    }

    else if (table_name === 'real_est') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.realEstateTableDocuments.url;

      for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
        if (parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ===
          parseInt(event.data.guiId))
          temp_documents.documentList.push(this.realEstateTableDocuments.documentList[i]);

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.ViewRealEstate'),

        method: "view",

        documents: temp_documents,

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "text",
            value: event.data.Name,
            required: "true",
          },
          {
            id: "Description",
            name: this.translate.instant('PROJECT_INFORMATION.Description'),
            type: "text",
            value: event.data.nameEn,
            required: "true",
          },
          {
            id: "PropertyType",
            name: this.translate.instant('PROJECT_INFORMATION.PropertyType'),
            type: "text",
            value: event.data.propertyType,
            required: "true",
          },
          {
            id: "TitleDeed",
            name: this.translate.instant('PROJECT_INFORMATION.TitleDeed'),
            type: "text",
            value: event.data.titleDeed,
            required: "true",
          },
          {
            id: "Country",
            name: this.translate.instant('PROJECT_INFORMATION.Country'),
            type: "text",
            value: event.data.country,
            required: "true",
          },
          {
            id: "City",
            name: this.translate.instant('PROJECT_INFORMATION.City'),
            type: "text",
            value: event.data.city,
            required: "true",
          },
          {
            id: "Location",
            name: this.translate.instant('PROJECT_INFORMATION.Location'),
            type: "text",
            value: event.data.location,
            required: "true",
          },
          {
            id: "Area",
            name: this.translate.instant('PROJECT_INFORMATION.Area'),
            type: "text",
            value: event.data.area,
            required: "true",
          },
          {
            id: "PurchasePrice",
            name: this.translate.instant('PROJECT_INFORMATION.PurchasePrice'),
            type: "text",
            value: event.data.purchasePrice,
            required: "true",
          },
          {
            id: "PurchaseDate",
            name: this.translate.instant('PROJECT_INFORMATION.PurchaseDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.purchaseDate),
            required: "true",
          },
          {
            id: "MarketValue",
            name: this.translate.instant('PROJECT_INFORMATION.MarketValue'),
            type: "text",
            value: event.data.currentMarketValue,
            required: "true",
          },
          {
            id: "MarketDate",
            name: this.translate.instant('PROJECT_INFORMATION.MarketValuationDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.currentMarketDate),
            required: "true",
          }
        ],
        buttons: []
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    else if (table_name === 'list_comp') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.listOfCompaniesTableDocuments.url;

      for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
        if (parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ===
          parseInt(event.data.guiId))
          temp_documents.documentList.push(this.listOfCompaniesTableDocuments.documentList[i]);

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.ViewCompanies'),

        method: "view",

        documents: temp_documents,

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "text",
            value: event.data.Name,
            required: "true",
          },
          {
            id: "CompanyName",
            name: this.translate.instant('PROJECT_INFORMATION.CompanyOrEstablishmentName'),
            type: "text",
            value: event.data.nameEn,
            required: "true",
          },
          {
            id: "SharePercentage",
            name: this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage'),
            type: "text",
            value: parseFloat(event.data.sharePercentage).toFixed(4),
            required: "true",
          },
          {
            id: "ShareValue",
            name: this.translate.instant('PROJECT_INFORMATION.ShareholdingValue'),
            type: "text",
            value: event.data.shareValue,
            required: "true",
          },
          {
            id: "IndustrialLicense",
            name: this.translate.instant('PROJECT_INFORMATION.CommercialRegistrationNumber'),
            type: "text",
            value: event.data.crNumber,
            required: "true",
          },
          {
            id: "IssueDate",
            name: this.translate.instant('PROJECT_INFORMATION.IssueDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.crIssueDate),
            required: "true",
          }
        ],
        buttons: []
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    else if (table_name === 'other_inv') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.otherInvestmentsTableDocuments.url;

      for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
        if (parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ===
          parseInt(event.data.guiId))
          temp_documents.documentList.push(this.otherInvestmentsTableDocuments.documentList[i]);

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.ViewOtherInvestments'),

        method: "view",

        documents: temp_documents,

        form_number: 1,

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "text",
            value: event.data.Name,
            required: "true",
            form_number: 1,
          },
          {
            id: "InvestmentType",
            name: this.translate.instant('PROJECT_INFORMATION.InvestmentType'),
            type: "text",
            value: event.data.investmentType,
            required: "true",
            form_number: 1,
          },
          {
            id: "Description",
            name: this.translate.instant('PROJECT_INFORMATION.Description'),
            type: "text",
            value: event.data.nameEn,
            required: "true",
            form_number: 1,
          },     
          {
            id: "InvestmentValue",
            name: this.translate.instant('PROJECT_INFORMATION.InvestmentValue'),
            type: "text",
            value: event.data.value,
            required: "true",
            form_number: event.data.investmentType === this.translate.instant('COMMON.Stock Options') ? 2 : 1,
          },
          {
            id: "Quantity",
            name: this.translate.instant('PROJECT_INFORMATION.Quantity'),
            type: "text",
            value: event.data.quantity,
            required: "true",
            form_number: event.data.investmentType === this.translate.instant('COMMON.Stock Options') ? 1 : 2,
          },
          {
            id: "MarketPrice",
            name: this.translate.instant('PROJECT_INFORMATION.MarketPrice'),
            type: "text",
            value: event.data.marketPrice,
            required: "true",
            form_number: event.data.investmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
          },
          {
            id: "TotalMarketValue",
            name: this.translate.instant('PROJECT_INFORMATION.TotalMarketValue'),
            type: "text",
            value: event.data.totalMarketValue,
            required: "true",
            form_number: event.data.investmentType === this.translate.instant('COMMON.Stock Options') ? 1 : 2,
          }
        ],
        buttons: []
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, this.commonService.modalOptions);
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;
    }

  }

  save_submit(save_submit) {

    var documents_count_1 = 0;

    var representatives_flag_1 = 0;

    var owners_flag_3 = 0, owners_flag_4 = 0;

    // var owners_bank_dealing_flag = 0;

    var real_estate_flag_1 = 0, real_estate_flag_2 = 0;

    var companies_list_flag_1 = 0, companies_list_flag_2 = 0;

    var other_investments_flag_1 = 0, other_investments_flag_2 = 0;

    this.eca_license_vs = true;
    for (var i = 0; i < this.documentsTableDocuments.documentList.length; i++)
      if (this.documentsTableDocuments.documentList[i].DocumentDefId == 367)
        documents_count_1++;
    // else if (this.documentsTableDocuments.documentList[i].DocumentDefId == 368)
    //   documents_count_2++;
    // else if (this.documentsTableDocuments.documentList[i].DocumentDefId == 380)
    //   documents_count_3++;

    var emailRegex = /^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@sidf.gov.sa$/;

    var proposed_ownerships_total_percentage_text = "0";

    var proposed_ownerships_total_percentage = 0;

    var percentageProIndCount = 0, licCapacityProIndCount = 0;

    var proposed_products_temp_source = [], proposed_ownerships_temp_source = [], representatives_temp_source = [],
      real_estate_temp_source = [], companies_temp_source = [], other_investments_temp_source = [];

    try {

      this.proposed_ownerships_source.getAll().then((res) => {

        proposed_ownerships_temp_source = res;

        this.proposed_products_source.getAll().then((res) => {

          proposed_products_temp_source = res;

          this.representatives_source.getAll().then((res) => {

            representatives_temp_source = res;

            this.real_estate_source.getAll().then((res) => {

              real_estate_temp_source = res;

              this.list_companies_source.getAll().then((res) => {

                companies_temp_source = res;

                this.other_investments_source.getAll().then((res) => {

                  other_investments_temp_source = res;


                  for (var i = 0; i < this.proposed_products_source_length; i++)
                    if (proposed_products_temp_source[i].proInd === "Yes")
                      licCapacityProIndCount++;

                  // for (var i = 0; (i < representatives_temp_source.length) && representatives_flag_1 == 0; i++) {

                  //   representatives_flag_2 = 0;

                  //   for (var j = 0; (j < this.representativesTableDocuments.documentList.length) && representatives_flag_2 == 0; j++)
                  //     if (parseInt(representatives_temp_source[i].buPartner) == parseInt(this.representativesTableDocuments.documentList[j].entityId))
                  //       representatives_flag_2 = 1;
                  //     else
                  //       representatives_flag_2 = 0;

                  //   if (representatives_flag_2 == 0)
                  //     representatives_flag_1 = 1;

                  //   else
                  //     representatives_flag_1 = 0;

                  // }

                  for (var i = 0; (i < representatives_temp_source.length) && representatives_flag_1 === 0; i++) {

                    if (representatives_temp_source[i].attachmentInd === "Yes")
                      representatives_flag_1 = 0;

                    else
                      representatives_flag_1 = 1;

                  }

                  for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
                    if (proposed_ownerships_temp_source[i].proInd === "Yes") {
                      proposed_ownerships_total_percentage += parseFloat(proposed_ownerships_temp_source[i].proPercentage);
                      percentageProIndCount++;
                    }

                  proposed_ownerships_total_percentage_text = proposed_ownerships_total_percentage.toFixed(4);

                  // for (var i = 0; (i < proposed_ownerships_temp_source.length) && owners_bank_dealing_flag == 0; i++)
                  //   if (proposed_ownerships_temp_source[i].nonObjection == false ||
                  //     proposed_ownerships_temp_source[i].accessQawaem == false ||
                  //     //proposed_ownerships_temp_source[i].dealWithSidf == false ||
                  //     //proposed_ownerships_temp_source[i].bankRelation == false ||
                  //     proposed_ownerships_temp_source[i].acknowledgement == false)
                  //     owners_bank_dealing_flag = 1;

                  // var rmListSelected = this.inputs.RmList.find((o) => o.userId == this.inputs.RmListSelected);

                  // for (var i = 0; (i < proposed_ownerships_temp_source.length) && owners_flag_1 == 0; i++) {

                  //   owners_flag_2 = 0;

                  //   for (var j = 0; (j < this.ownersTableDocuments.documentList.length) && owners_flag_2 == 0; j++) {

                  //     if (proposed_ownerships_temp_source[i].proInd == "Yes" && proposed_ownerships_temp_source[i].guiId == this.ownersTableDocuments.documentList[j].RelatedEntityId &&
                  //       this.ownersTableDocuments.documentList[j].DocumentDefId == 372)
                  //       owners_flag_2 = 1;

                  //     else
                  //       owners_flag_2 = 0;

                  //   }

                  //   if (owners_flag_2 == 0)
                  //     owners_flag_1 = 1;

                  //   else {

                  //     owners_flag_2 = 0;

                  //     for (var j = 0; (j < this.ownersTableDocuments.documentList.length) && owners_flag_2 == 0; j++) {

                  //       if (proposed_ownerships_temp_source[i].proInd == "Yes" && proposed_ownerships_temp_source[i].guiId == this.ownersTableDocuments.documentList[j].RelatedEntityId &&
                  //         this.ownersTableDocuments.documentList[j].DocumentDefId == 399)
                  //         owners_flag_2 = 1;

                  //       else
                  //         owners_flag_2 = 0;

                  //     }

                  //     if (owners_flag_2 == 0)
                  //       owners_flag_1 = 1;

                  //     else {

                  //       owners_flag_2 = 0;

                  //       for (var j = 0; (j < this.ownersTableDocuments.documentList.length) && owners_flag_2 == 0; j++) {

                  //         if (proposed_ownerships_temp_source[i].proInd == "Yes" && proposed_ownerships_temp_source[i].guiId == this.ownersTableDocuments.documentList[j].RelatedEntityId &&
                  //           this.ownersTableDocuments.documentList[j].DocumentDefId == 400)
                  //           owners_flag_2 = 1;

                  //         else
                  //           owners_flag_2 = 0;

                  //       }

                  //       if (owners_flag_2 == 0)
                  //         owners_flag_1 = 1;

                  //       else
                  //         owners_flag_1 = 0;

                  //     }

                  //   }

                  // }

                  // for (var i = 0; (i < proposed_ownerships_temp_source.length) && owners_flag_1 == 0; i++) {

                  //   owners_flag_2 = 0;

                  //   for (var j = 0; (j < this.ownersTableDocuments.documentList.length) && owners_flag_2 == 0; j++) {

                  //     if (proposed_ownerships_temp_source[i].proInd == "Yes") {

                  //       if (parseInt(proposed_ownerships_temp_source[i].guiId) ==
                  //         parseInt(this.ownersTableDocuments.documentList[j].RelatedEntityId) &&
                  //         (this.ownersTableDocuments.documentList[j].DocumentDefId == 372 ||
                  //           this.ownersTableDocuments.documentList[j].DocumentDefId == 399 ||
                  //           this.ownersTableDocuments.documentList[j].DocumentDefId == 400))
                  //         owners_flag_2 = 1;

                  //       else
                  //         owners_flag_2 = 0;

                  //     }

                  //     else
                  //       owners_flag_2 = 1;

                  //   }

                  //   if (owners_flag_2 == 0)
                  //     owners_flag_1 = 1;

                  //   else
                  //     owners_flag_1 = 0;

                  // }


                  for (var i = 0; (i < real_estate_temp_source.length) && real_estate_flag_1 === 0; i++) {

                    real_estate_flag_2 = 0;

                    for (var j = 0; (j < this.realEstateTableDocuments.documentList.length) && real_estate_flag_2 === 0; j++) {

                      if (parseInt(real_estate_temp_source[i].guiId) ===
                        parseInt(this.realEstateTableDocuments.documentList[j].RelatedEntityId) &&
                        this.realEstateTableDocuments.documentList[j].DocumentDefId == 121)
                        real_estate_flag_2 = 1;

                      else
                        real_estate_flag_2 = 0;

                    }

                    if (real_estate_flag_2 === 0)
                      real_estate_flag_1 = 1;

                    else
                      real_estate_flag_1 = 0;

                  }

                  for (var i = 0; (i < companies_temp_source.length) && companies_list_flag_1 === 0; i++) {

                    companies_list_flag_2 = 0;

                    for (var j = 0; (j < this.listOfCompaniesTableDocuments.documentList.length) && companies_list_flag_2 === 0; j++) {

                      if (parseInt(companies_temp_source[i].guiId) ===
                        parseInt(this.listOfCompaniesTableDocuments.documentList[j].RelatedEntityId) &&
                        this.listOfCompaniesTableDocuments.documentList[j].DocumentDefId == 121)
                        companies_list_flag_2 = 1;

                      else
                        companies_list_flag_2 = 0;

                    }

                    if (companies_list_flag_2 === 0)
                      companies_list_flag_1 = 1;

                    else
                      companies_list_flag_1 = 0;

                  }

                  for (var i = 0; (i < other_investments_temp_source.length) && other_investments_flag_1 === 0; i++) {

                    other_investments_flag_2 = 0;

                    for (var j = 0; (j < this.otherInvestmentsTableDocuments.documentList.length) && other_investments_flag_2 === 0; j++) {

                      if (parseInt(other_investments_temp_source[i].guiId) ===
                        parseInt(this.otherInvestmentsTableDocuments.documentList[j].RelatedEntityId) &&
                        this.otherInvestmentsTableDocuments.documentList[j].DocumentDefId == 121)
                        other_investments_flag_2 = 1;

                      else
                        other_investments_flag_2 = 0;

                    }

                    if (other_investments_flag_2 === 0)
                      other_investments_flag_1 = 1;

                    else
                      other_investments_flag_1 = 0;

                  }


                  for (var i = 0; (i < proposed_ownerships_temp_source.length) && owners_flag_3 === 0; i++) {

                    owners_flag_4 = 0;

                    for (var j = 0; (j < this.ownersTableDocuments.documentList.length) && owners_flag_4 === 0; j++) {

                      if (proposed_ownerships_temp_source[i].proInd === "Yes") {

                        if (parseInt(proposed_ownerships_temp_source[i].guiId) ===
                          parseInt(this.ownersTableDocuments.documentList[j].RelatedEntityId) &&
                          this.ownersTableDocuments.documentList[j].DocumentDefId == 401 &&
                          (proposed_ownerships_temp_source[i].shareHolderType ===   this.translate.instant('COMMON.Company') ||
                            (proposed_ownerships_temp_source[i].shareHolderType === this.translate.instant('COMMON.Individual') &&
                              proposed_ownerships_temp_source[i].investorType ===  this.translate.instant('COMMON.Saudi National'))))
                          owners_flag_4 = 1;

                        else if (!(proposed_ownerships_temp_source[i].shareHolderType ===   this.translate.instant('COMMON.Company') ||
                          (proposed_ownerships_temp_source[i].shareHolderType ===    this.translate.instant('COMMON.Individual')&&
                            proposed_ownerships_temp_source[i].investorType ===   this.translate.instant('COMMON.Saudi National'))))
                          owners_flag_4 = 1;

                        else
                          owners_flag_4 = 0;

                      }

                      else
                        owners_flag_4 = 1;

                    }

                    if (owners_flag_4 === 0)
                      owners_flag_3 = 1;

                    else
                      owners_flag_3 = 0;

                  }

                  if (this.ownersTableDocuments.documentList.length === 0) {

                    var allProposedOwnersAreNotForeign = proposed_ownerships_temp_source.find((o) => o.proInd === "Yes" &&
                      (o.shareHolderType ===  this.translate.instant('COMMON.Company') ||
                        (o.shareHolderType ===  this.translate.instant('COMMON.Individual') && o.investorType === this.translate.instant('COMMON.Saudi National'))));
                    if (allProposedOwnersAreNotForeign)
                      owners_flag_3 = owners_flag_3;

                    else
                      owners_flag_3 = 0;

                  }

                  if (this.inputs.IndustrialSectorSelected[0].name === "" || this.inputs.IndustrialSectorSelected[0].name === null)
                    this.industrial_sector_vs = true;

                  else
                    this.industrial_sector_vs = false;

                  // if (this.inputs.CategorySelected === "" || this.inputs.CategorySelected === null)
                  //   this.category_vs = true;

                  // else
                  //   this.category_vs = false;

                  if (this.inputs.RegionSelected === "" || this.inputs.RegionSelected === null)
                    this.region_vs = true;

                  else
                    this.region_vs = false;

                  if (this.inputs.TypeSelected === "" || this.inputs.TypeSelected === null)
                    this.type_vs = true;

                  else
                    this.type_vs = false;
                  if (this.isPurposeOthers && (this.inputs.OtherPurpose === "" || this.inputs.OtherPurpose === null))
                    this.other_purpose_vs = true;
                  else
                    this.other_purpose_vs = false;

//  TODO: need to Be enabled when running ECA  
//                  if (!this.eca_license_vs || this.inputs.eca_license === ""  || this.inputs.eca_license == null) {
                     // this.eca_license_vs = false;
        //              this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterValidECA'));
 //                        this.panelStep = 0;
  // need to Be enabled when rynning ECA
                  if (this.serviceId==11 && (!this.eca_license_vs || this.inputs.eca_license === ""  || this.inputs.eca_license == null)) {
                    this.eca_license_vs = false;
                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterValidECA'));
                      this.panelStep = 0;
 

                  }
                  else
                    if (this.industrial_sector_vs || this.region_vs || this.type_vs || this.other_purpose_vs) {

                    this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterMandatoryGeneral'));
                    this.panelStep = 1;

                  }

                  else {

                    // else if(!this.dateRegex.test(this.inputs.licenseDetails[0].licStartDate))
                    //   this.commonService.showFailureToast("Enter the License Start Date !");

                    // else if(!this.dateRegex.test(this.inputs.licenseDetails[0].licEndDate))
                    //   this.commonService.showFailureToast("Enter the License End Date !");

                    // else if (this.inputs.licenseDetails[0].factoryNameAr === "" || this.inputs.licenseDetails[0].factoryNameAr === null)
                    //   this.commonService.showFailureToast("Enter the Factory Name Arabic !");

                    if (this.inputs.licenseDetails[0].factoryName === "" || this.inputs.licenseDetails[0].factoryName === null)
                      this.factory_name_vs = true;

                    else
                      this.factory_name_vs = false;

                      if (!this.isSagiaOrCr && (this.inputs.licenseDetails[0].factoryNameAr === "" || this.inputs.licenseDetails[0].factoryNameAr === null))
                        this.factory_name_ar_vs = true;

                      else
                        this.factory_name_ar_vs = false;

                        if ((this.inputs.ProfileType==='24' || this.inputs.ProfileType==='0000000024' || this.inputs.ProfileType==='52' || this.inputs.ProfileType==='53'|| this.inputs.ProfileType==='54'|| this.inputs.ProfileType==='51' || this.inputs.ProfileType==='0000000051' ||this.inputs.ProfileType==='0000000025' ||this.inputs.ProfileType==='25')&& (this.inputs.ModonCity === "" || this.inputs.ModonCity === undefined))
                        this.modonCity_vs = true;

                      else
                        this.modonCity_vs = false;
                    // else if(this.inputs.licenseDetails[0].proCapital === "" || this.inputs.licenseDetails[0].proCapital === null)
                    //   this.commonService.showFailureToast("Enter the Capital !");

                      if (!this.isSagiaOrCr && save_submit === 2 && (this.inputs.licenseDetails[0].reqAmount === "" || this.inputs.licenseDetails[0].reqAmount === null || parseFloat(this.inputs.licenseDetails[0].reqAmount) === 0))
                      this.request_amount_vs = true;

                    else
                      this.request_amount_vs = false;

                    if (this.inputs.licenseDetails[0].crNameAr === "" || this.inputs.licenseDetails[0].crNameAr === null)
                      this.cr_name_arabic_vs = true;

                    else
                      this.cr_name_arabic_vs = false;

                    if (this.inputs.licenseDetails[0].crName === "" || this.inputs.licenseDetails[0].crName === null)
                      this.cr_name_vs = true;

                    else
                      this.cr_name_vs = false;

                    if (this.inputs.licenseDetails[0].crNumber === "" || this.inputs.licenseDetails[0].crNumber === null)
                      this.cr_number_2_vs = true;

                    else
                      this.cr_number_2_vs = false;

                    if (this.inputs.licenseDetails[0].crLocationAr === "" || this.inputs.licenseDetails[0].crLocationAr === null)
                      this.cr_issue_place_vs = true;

                    else
                      this.cr_issue_place_vs = false;

                    if (!this.dateRegex.test(this.commonService.returnDateStringFromDateArray(this.inputs.licenseDetails[0].crIssueDate)))
                      this.cr_issue_date_vs = true;

                    else
                      this.cr_issue_date_vs = false;

                    if (!this.dateRegex.test(this.commonService.returnDateStringFromDateArray(this.inputs.licenseDetails[0].crExpiryDate)))
                      this.cr_expiry_date_1_vs = true;

                    else
                      this.cr_expiry_date_1_vs = false;

                    if (this.inputs.licenseDetails[0].crPhone === "" || this.inputs.licenseDetails[0].crPhone === null)
                      this.cr_phone_vs = true;

                    else
                      this.cr_phone_vs = false;

                    // else if (this.inputs.licenseDetails[0].crFaxNo === "" || this.inputs.licenseDetails[0].crFaxNo === null)
                    //   this.commonService.showFailureToast("Enter the Company Fax Number !");

                    if (this.inputs.licenseDetails[0].crAddress === "" || this.inputs.licenseDetails[0].crAddress === null)
                      this.cr_address_vs = true;

                    else
                      this.cr_address_vs = false;

                    if (this.inputs.licenseDetails[0].crZipCode === "" || this.inputs.licenseDetails[0].crZipCode === null)
                      this.cr_zip_code_vs = true;

                    else
                      this.cr_zip_code_vs = false;

                    // else if (this.inputs.licenseDetails[0].crDistrictArea === "" || this.inputs.licenseDetails[0].crDistrictArea === null)
                    //   this.commonService.showFailureToast("Enter the Company District Area !");

                    if (this.inputs.licenseDetails[0].crUnitNo === "" || this.inputs.licenseDetails[0].crUnitNo === null)
                      this.cr_unit_no_vs = true;

                    else
                      this.cr_unit_no_vs = false;

                    if (this.inputs.licenseDetails[0].crBuildingNo === "" || this.inputs.licenseDetails[0].crBuildingNo === null)
                      this.cr_building_no_vs = true;

                    else
                      this.cr_building_no_vs = false;

                    if (this.inputs.licenseDetails[0].crAdditionalNo === "" || this.inputs.licenseDetails[0].crAdditionalNo === null)
                      this.cr_additional_no_vs = true;

                    else
                      this.cr_additional_no_vs = false;

                      if (save_submit === 2 && this.inputs.licenseDetails[0].crLegalInd === '' &&
                      ((this.commonService.defaultLanguage === "en" && (this.inputs.licenseDetails[0].crLeagalTypeEn === "" || this.inputs.licenseDetails[0].crLeagalTypeEn === null)) ||
                        (this.commonService.defaultLanguage === "ar" && (this.inputs.licenseDetails[0].crLeagalTypeAr === "" || this.inputs.licenseDetails[0].crLeagalTypeAr === null))))
                      this.legal_entity_vs = true;

                    else
                      this.legal_entity_vs = false;
                      if (!this.isSagiaOrCr && (this.inputs.licenseDetails[0].city === "" || this.inputs.licenseDetails[0].city === null))
                      this.city_vs = true;
                      else
                      this.city_vs = false;
                      if (this.factory_name_vs/* || this.modonCity_vs */ || this.factory_name_ar_vs || this.request_amount_vs || this.legal_entity_vs || this.city_vs) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterMandatoryLicense'));
                      this.panelStep = 2;

                    }

                    else if (this.inputs.RmEmail !== "" && !emailRegex.test(this.inputs.RmEmail)) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterRelMgrEmail'));
                      this.relationship_manager_vs = true;
                      this.panelStep = 2;

                    }

                    else if (this.cr_name_arabic_vs || this.cr_name_vs || this.cr_number_2_vs || this.cr_issue_place_vs ||
                      this.cr_issue_date_vs || this.cr_expiry_date_1_vs || this.cr_phone_vs || this.cr_address_vs || this.cr_zip_code_vs ||
                      this.cr_unit_no_vs || this.cr_building_no_vs || this.cr_additional_no_vs) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterMandatoryCompany'));
                      this.panelStep = 3;

                    }

                    else if (this.inputs.licenseDetails[0].crZipCode.toString().length !== 5) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.CompanyPostalFiveDigits'));
                      this.cr_zip_code_vs = true;
                      this.panelStep = 3;

                    }

                    // else if (!rmListSelected)
                    //   this.commonService.showFailureToast("Select the Relationship Manager !");

                      else if (save_submit === 2 && licCapacityProIndCount === 0 && !this.isHousingLogin) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ProposedCapacityOneProduct'));
                      this.panelStep = 4;

                    }

                    else if (save_submit === 2 && percentageProIndCount === 0) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentageOneOwner'));
                      this.panelStep = 5;

                    }

                    else if (save_submit === 2 && parseFloat(proposed_ownerships_total_percentage_text) > 100.0000) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentageOfOwnerLess1') + proposed_ownerships_total_percentage_text + this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentageOfOwnerLess2'));
                      this.panelStep = 5;

                    }

                    else if (save_submit === 2 && parseFloat(proposed_ownerships_total_percentage_text) < 100.0000) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentageOfOwnerMore1') + proposed_ownerships_total_percentage_text + this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentageOfOwnerMore2'));
                      this.panelStep = 5;

                    }

                    // else if (save_submit == 2 && owners_bank_dealing_flag == 1)
                    //   this.commonService.showFailureToast("Accept the Owner Disclaimers of all the Owners !");

                    // else if (save_submit == 2 && owners_flag_1 == 1)
                    //   this.commonService.showFailureToast("Attach at least one Document for all the Proposed Owners !");

                    else if (save_submit === 2 && owners_flag_3 === 1) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.NOLForAllOwners'));
                      this.panelStep = 5;

                    }

                    else if (save_submit === 2 && real_estate_flag_1 === 1) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.LandDeedTitleDocumentForAllRE'));
                      this.panelStep = 6;

                    }

                    else if (save_submit === 2 && companies_list_flag_1 === 1) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.CRDocumentForAllCD'));
                      this.panelStep = 7;

                    }

                    else if (save_submit === 2 && other_investments_flag_1 === 1) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.DocumentaryEvidenceForOI'));
                      this.panelStep = 8;

                    }

                    else if (save_submit === 2 && this.non_saudi_owners_list.length > this.bank_details_source_length) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.BankDetailsForAllNonSaudi'));
                      this.panelStep = 9;

                    }

                    else if (save_submit === 2 && representatives_flag_1 === 1) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.DocumentForAllAuthorizedPersons'));
                      this.panelStep = 10;

                    }

                    else if (save_submit === 2 && documents_count_1 === 0) {

                      this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ArticleOfAssociationDocument'));
                      this.panelStep = 11;

                    }

                    // else if (save_submit == 2 && documents_count_2 == 0)
                    //   this.commonService.showFailureToast("Attach an Industrial License Document !");

                    // else if (save_submit == 2 && documents_count_3 == 0)
                    //   this.commonService.showFailureToast("Attach an ID Proof Document !");

                    else {

                      this.spinnerService.show();

                      // this.bank_details_source.getAll().then((res) => {

                      //   bank_details_temp_source = res;

                      try {

                        this.inputs.IndustrialSectorSelected[0].preliminaryId = this.preliminaryId;

                       // var temp_category = [{ preliminaryId: "", id: "", category: "" }];
                        var temp_region = [{ preliminaryId: "", id: "", region: "" }];
                        var temp_type = [{ preliminaryId: "", id: "", type: "", others: "" }];
                        var temp_profile_type = [{ preliminaryId: "", id: "", prqTypeEn: "" }];

                        //temp_category[0].preliminaryId = this.preliminaryId;
                       // temp_category[0].id = this.inputs.CategorySelected;

                       // var resCategory = this.inputs.Category.find((o) => o.id === this.inputs.CategorySelected);
                       // if (resCategory !== undefined)
                       //   temp_category[0].category = resCategory.category;

                        temp_region[0].preliminaryId = this.preliminaryId;
                        temp_region[0].id = this.inputs.RegionSelected;
                        var resRegion = this.inputs.Region.find((o) => o.id === this.inputs.RegionSelected);
                        if (resRegion !== undefined)
                          temp_region[0].region = resRegion.region;

                        temp_type[0].preliminaryId = this.preliminaryId;
                        temp_type[0].id = this.inputs.TypeSelected;
                        var resType = this.inputs.Type.find((o) => o.id === this.inputs.TypeSelected);
                        if (resType !== undefined)
                          temp_type[0].type = resType.type;
                        if (this.inputs.TypeSelected == "OTH")
                          temp_type[0].others = this.inputs.OtherPurpose;
                        temp_profile_type[0].preliminaryId = this.preliminaryId;
                        temp_profile_type[0].id =this.ProfileTypeID;// this.inputs.ProfileType;
                        temp_profile_type[0].prqTypeEn = this.inputs.ProfileTypeSelected;


                        for (var i = 0; i < proposed_products_temp_source.length; i++) {

                          var unit = this.unit_list.find((o) => o.UOMText === proposed_products_temp_source[i].unit);
                          if (unit)
                            proposed_products_temp_source[i].unit = unit.UOMId;

                          var isicActivity = this.isic_activity_list.find((o) => o.activityName === proposed_products_temp_source[i].activityName)
                          if (isicActivity) {

                            proposed_products_temp_source[i]["divisionId"] = isicActivity.divisionId;
                            proposed_products_temp_source[i]["activityId"] = isicActivity.activityId;

                          }

                          proposed_products_temp_source[i]["proInd"] = proposed_products_temp_source[i]["proInd"] === "Yes" ? "X" : "";

                        }

                        for (var i = 0; i < this.deleted_proposed_products.length; i++) {

                          var unit = this.unit_list.find((o) => o.UOMText === this.deleted_proposed_products[i].unit);
                          if (unit)
                            this.deleted_proposed_products[i].unit = unit.UOMId;

                          var isicActivity = this.isic_activity_list.find((o) => o.activityName === this.deleted_proposed_products[i].activityName)
                          if (isicActivity) {

                            this.deleted_proposed_products[i]["divisionId"] = isicActivity.divisionId;
                            this.deleted_proposed_products[i]["activityId"] = isicActivity.activityId;

                          }

                          this.deleted_proposed_products[i]["proInd"] = this.deleted_proposed_products[i]["proInd"] === "Yes" ? "X" : "";

                        }

                        // for (var i = 0; i < proposed_ownerships_temp_source.length; i++) {

                        //   var shareHolderType = this.share_holder_type_list.find((o) => o.type == proposed_ownerships_temp_source[i].shareHolderType);
                        //   if (shareHolderType)
                        //     proposed_ownerships_temp_source[i].shareHolderType = shareHolderType.id;

                        //   var investorType = this.investor_type_list.find((o) => o.type == proposed_ownerships_temp_source[i].investorType);
                        //   if (investorType)
                        //     proposed_ownerships_temp_source[i].investorType = investorType.id;

                        //   var nationality = this.country_list.find((o) => (o.nameEn == proposed_ownerships_temp_source[i].nationality));
                        //   if (nationality)
                        //     proposed_ownerships_temp_source[i].nationality = nationality.countryKey;

                        //   if (proposed_ownerships_temp_source[i].date)
                        //     proposed_ownerships_temp_source[i].date = this.commonService.returnDateStringWithoutHyphenFromDateArray(proposed_ownerships_temp_source[i].date);

                        //   proposed_ownerships_temp_source[i]["proInd"] = proposed_ownerships_temp_source[i]["proInd"] == "Yes" ? "X" : "";

                        //   proposed_ownerships_temp_source[i]["bankRelation"] = proposed_ownerships_temp_source[i]["bankRelation"] == true ? "X" : "";
                        //   proposed_ownerships_temp_source[i]["nonObjection"] = proposed_ownerships_temp_source[i]["nonObjection"] == true ? "X" : "";
                        //   proposed_ownerships_temp_source[i]["accessQawaem"] = proposed_ownerships_temp_source[i]["accessQawaem"] == true ? "X" : "";
                        //   proposed_ownerships_temp_source[i]["acknowledgement"] = proposed_ownerships_temp_source[i]["acknowledgement"] == true ? "X" : "";
                        //   proposed_ownerships_temp_source[i]["dealWithSidf"] = proposed_ownerships_temp_source[i]["dealWithSidf"] == true ? "X" : "";

                        // }

                        // for (var i = 0; i < this.deleted_proposed_ownerships.length; i++) {

                        //   var shareHolderType = this.share_holder_type_list.find((o) => o.type == this.deleted_proposed_ownerships[i].shareHolderType);
                        //   if (shareHolderType)
                        //     this.deleted_proposed_ownerships[i].shareHolderType = shareHolderType.id;

                        //   var investorType = this.investor_type_list.find((o) => o.type == this.deleted_proposed_ownerships[i].investorType);
                        //   if (investorType)
                        //     this.deleted_proposed_ownerships[i].investorType = investorType.id;

                        //   var nationality = this.country_list.find((o) => (o.nameEn == this.deleted_proposed_ownerships[i].nationality));
                        //   if (nationality)
                        //     this.deleted_proposed_ownerships[i].nationality = nationality.countryKey;

                        //   if (this.deleted_proposed_ownerships[i].date)
                        //     this.deleted_proposed_ownerships[i].date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleted_proposed_ownerships[i].date);

                        //   this.deleted_proposed_ownerships[i]["proInd"] = this.deleted_proposed_ownerships[i]["proInd"] == "Yes" ? "X" : "";

                        //   this.deleted_proposed_ownerships[i]["bankRelation"] = this.deleted_proposed_ownerships[i]["bankRelation"] == true ? "X" : "";
                        //   this.deleted_proposed_ownerships[i]["nonObjection"] = this.deleted_proposed_ownerships[i]["nonObjection"] == true ? "X" : "";
                        //   this.deleted_proposed_ownerships[i]["accessQawaem"] = this.deleted_proposed_ownerships[i]["accessQawaem"] == true ? "X" : "";
                        //   this.deleted_proposed_ownerships[i]["acknowledgement"] = this.deleted_proposed_ownerships[i]["acknowledgement"] == true ? "X" : "";
                        //   this.deleted_proposed_ownerships[i]["dealWithSidf"] = this.deleted_proposed_ownerships[i]["dealWithSidf"] == true ? "X" : "";

                        // };

                        // bank_details_temp_source = bank_details_temp_source.concat(this.deleted_bank_details);

                        // for (var i = 0; i < bank_details_temp_source.length; i++) {

                        //   var country = this.country_list.find((o) => (o.nameEn == bank_details_temp_source[i].country));
                        //   if (country)
                        //     bank_details_temp_source[i].country = country.countryKey;

                        // }

                        // for (var i = 0; i < proposed_ownerships_temp_source.length; i++)
                        //   for (var j = 0; j < bank_details_temp_source.length; j++)
                        //     if (JSON.parse(JSON.stringify(proposed_ownerships_temp_source[i])).name ===
                        //       JSON.parse(JSON.stringify(bank_details_temp_source[j])).accHolder) {

                        //       if (proposed_ownerships_temp_source[i].updStatus != "C" && proposed_ownerships_temp_source[i].updStatus != "")
                        //         proposed_ownerships_temp_source[i].updStatus = "U";

                        //       if (bank_details_temp_source[j].updStatus != "D") {

                        //         var flag = 0;

                        //         for (var k = 0; (k < proposed_ownerships_temp_source[i].bankDetails.length) && flag == 0; k++)
                        //           if (bank_details_temp_source[j].accHolder == proposed_ownerships_temp_source[i].bankDetails[k].accHolder)
                        //             flag = 1;

                        //         if (flag == 0)
                        //           proposed_ownerships_temp_source[i].bankDetails.push(bank_details_temp_source[j]);

                        //       }

                        //     }

                        for (var i = 0; i < representatives_temp_source.length; i++) {

                          representatives_temp_source[i]["mciInd"] = representatives_temp_source[i]["mciInd"] === "Yes" ? "X" : "";

                          representatives_temp_source[i]["attachmentInd"] = representatives_temp_source[i]["attachmentInd"] === "Yes" ? "X" : "";

                          var idType = this.id_type_list.find((o) => o.type === representatives_temp_source[i].idType);
                          if (idType)
                            representatives_temp_source[i].idType = idType.id;

                          if (representatives_temp_source[i].dob)
                            representatives_temp_source[i].dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(representatives_temp_source[i].dob);

                        }

                        for (var i = 0; i < this.deleted_representatives.length; i++) {

                          this.deleted_representatives[i]["mciInd"] = this.deleted_representatives[i]["mciInd"] === "Yes" ? "X" : "";

                          this.deleted_representatives[i]["attachmentInd"] = this.deleted_representatives[i]["attachmentInd"] === "Yes" ? "X" : "";

                          var idType = this.id_type_list.find((o) => o.type === this.deleted_representatives[i].idType);
                          if (idType)
                            this.deleted_representatives[i].idType = idType.id;

                          if (this.deleted_representatives[i].dob)
                            this.deleted_representatives[i].dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleted_representatives[i].dob);

                        } 
                       // alert(this.projectId);
                        var post_data = {

                          "ProjectId": this.projectId?this.projectId:this.inputs.ProjectId,
                          "PreliminaryId": this.preliminaryId,
                          "UpdStatus": save_submit === 1 ? "D" : save_submit === 2 ? "P" : "D",
                          "IndustrialSector": this.inputs.IndustrialSectorSelected,
                          // "SectorCategory": temp_category,
                          "SectorRegions": temp_region,
                          "PreRequestType": temp_type,
                          "PrqTypesList": temp_profile_type,
                          "ModonCity": this.inputs.ModonCity,
                          "CommercialRegistrationdetails":
                            this.CommercialRegistrationdetails_final
                          ,
                          "LicenseDetails": [{
                            preliminaryId: this.inputs.licenseDetails[0].preliminaryId,
                            licenseType: this.inputs.licenseDetails[0].licenseType,
                            licenseId: this.inputs.licenseDetails[0].licenseId,
                            licStartDate: !this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].licStartDate) : "",
                            licEndDate: !this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].licEndDate) : "",
                            licStartDateGreg: this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.licenseDetails[0].licStartDateGreg) : "",
                            licEndDateGreg: this.isMEIM ? this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.licenseDetails[0].licEndDateGreg) : "",
                            crNumber: this.inputs.licenseDetails[0].crNumber,
                            crIssueDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].crIssueDate),
                            crExpiryDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.licenseDetails[0].crExpiryDate),
                            crLocationAr: this.inputs.licenseDetails[0].crLocationAr,
                            proCapital: this.commonService.returnValueStringFromSARString(this.inputs.licenseDetails[0].proCapital),
                            factoryName: this.inputs.licenseDetails[0].factoryName,
                            crCity: this.inputs.licenseDetails[0].crCity,
                            addressDesc: this.inputs.licenseDetails[0].addressDesc,
                            landNo: this.inputs.licenseDetails[0].landNo,
                            city: this.inputs.licenseDetails[0].city,
                            mngmntArea: this.inputs.licenseDetails[0].mngmntArea,
                            poBox: this.inputs.licenseDetails[0].poBox,
                            storesArea: this.inputs.licenseDetails[0].storesArea,
                            totalArea: this.inputs.licenseDetails[0].totalArea,
                            longX: this.inputs.licenseDetails[0].longX,
                            latitudeY: this.inputs.licenseDetails[0].latitudeY,
                            zipCode: this.inputs.licenseDetails[0].zipCode,
                            crName: this.inputs.licenseDetails[0].crName,
                            crCapital: this.inputs.licenseDetails[0].crCapital,
                            crLeagalTypeEn: this.inputs.licenseDetails[0].crLeagalTypeEn,
                            crLeagalTypeAr: this.inputs.licenseDetails[0].crLeagalTypeAr,
                            crPhone: this.inputs.licenseDetails[0].crPhone,
                            crFaxNo: this.inputs.licenseDetails[0].crFaxNo,
                            crAddress: this.inputs.licenseDetails[0].crAddress,
                            crBuildingNo: this.inputs.licenseDetails[0].crBuildingNo,
                            crAdditionalNo: this.inputs.licenseDetails[0].crAdditionalNo,
                            crUnitNo: this.inputs.licenseDetails[0].crUnitNo,
                            crDistrictArea: this.inputs.licenseDetails[0].crDistrictArea,
                            crZipCode: this.inputs.licenseDetails[0].crZipCode,
                            crNameAr: this.inputs.licenseDetails[0].crNameAr,
                            factoryNameAr: this.inputs.licenseDetails[0].factoryNameAr,
                            reqAmount: this.commonService.returnValueStringFromSARString(this.inputs.licenseDetails[0].reqAmount),
                            crLegalInd: this.inputs.licenseDetails[0].crLegalInd
                          }],
                          RmList: [{
                            "preliminaryId": this.preliminaryId,
                            "rmEmailId": this.inputs.RmEmail,
                            "rmEmpId": "",
                            "rmNameAr": "",
                            "rmNameEn": "",
                            "userId": ""
                          }],
                         //  "OwnersDetails": proposed_ownerships_temp_source,
                          // "ProductDetails": proposed_products_temp_source.concat(this.deleted_proposed_products),
                          "RepresentativeDetails": representatives_temp_source.concat(this.deleted_representatives),
                          "UserProfile": [
                            {
                              "profileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                              "customerNo": "",
                              "origin": "CP"
                            }
                          ]
                        };

                        if (this.isMEIM) {

                          post_data.LicenseDetails[0].licStartDate = post_data.LicenseDetails[0].licStartDateGreg;
                          post_data.LicenseDetails[0].licEndDate = post_data.LicenseDetails[0].licEndDateGreg;

                        }
                        this.spinnerService.show();
                        console.log('submitLogic2');
                        console.log(
                          this.serviceId
                        );
                        //todo: check if ECA project validate ECA License before
                        switch(parseInt(this.serviceId.toString())){
                          case 11:
                           this.submitECA(this.inputs.eca_license, post_data, save_submit, proposed_products_temp_source, representatives_temp_source);
                          break;
                          default:
                          this.submitLogic(post_data,save_submit,proposed_products_temp_source, representatives_temp_source)
                          break;
                        }


                      
                     
                    }
                      catch (err) {

                        this.resolveError();
                        this.onResultRevert(proposed_products_temp_source, representatives_temp_source);
                        this.spinnerService.hide();

                      }

                      // });

                    }

                  }

                });

              });

            });

          });

        });

      });

    }

    catch (err) {
      this.resolveError();
    }

  }

  submitLogic(post_data, save_submit, proposed_products_temp_source, representatives_temp_source){
  
   console.log("post_data" , post_data );
    this.preliminaryRequestService.postPreliminaryRequest(post_data)
    .then((res) => {
      
      console.log("pre res1" , res );

      this.localStorage.getItem("CurrentUserNationalId").subscribe((data) => {
        res['LoginId'] = data;
      })
     
      if(this.serviceId == 7 || this.serviceId == 8 || this.serviceId == 12)
      res['ModonCity'] = post_data.ModonCity;

      // if(this.serviceId == 9){
        if(this.serviceId == 9 || this.serviceId == 10  || this.serviceId == 13  || this.serviceId == 14){

      res['RegNumber'] = post_data.CommercialRegistrationdetails[0].RegNumber;
      res['RegStartDate'] = post_data.CommercialRegistrationdetails[0].RegStartDate;
      res['RegEndDate'] = post_data.CommercialRegistrationdetails[0].RegEndDate;
      res['RegActivity'] = post_data.CommercialRegistrationdetails[0].RegActivity;
      res['RegCompanyName'] = post_data.CommercialRegistrationdetails[0].RegCompanyName;
      var ProductDetails = proposed_products_temp_source.concat(this.deleted_proposed_products);
      ProductDetails.forEach(product => {
        if (res['IndLicenseProducts'] == undefined || res['IndLicenseProducts'] == 'undefined'){
          res['IndLicenseProducts'] = product.productName;
        }
        else{
          res['IndLicenseProducts'] = res['IndLicenseProducts'] + "," + product.productName;
        }
      });

    }
      res['Product']= this.serviceId;
      if(this.serviceId == 11  || this.serviceId == 15){
        res['ECALicense'] = this.inputs.eca_license;
      } 

      if (this.PreliminaryRequestStatus == 41 && save_submit == 2)
        this.UpdatePreliminaryRequestStatus();

        
      if (res["MsgId"] ==="S" &&(/*this.rejectedId==="1"||*/ post_data.UpdStatus === "P")){ 
        console.log(JSON.stringify(res));

      this.llPreliminaryRequest.postLandLoanPreliminartyRequest(res).subscribe(response  => 
        {
          
          // console.log("sub " ,response );   // TODO: need to have rollback function in case of filure 
          // if( JSON.parse(response.data).message != 'S'){

          //   this.onResult(res, save_submit, proposed_products_temp_source, representatives_temp_source)
          // }
          // else 
          // this.resolveError()
           this.onResult(res, save_submit, proposed_products_temp_source, representatives_temp_source)
      } ,error => console.log("error " , error) );
      this.onResult(res, save_submit, proposed_products_temp_source, representatives_temp_source); 
      } 
      else { 
        this.onResult(res, save_submit, proposed_products_temp_source, representatives_temp_source);
      }
      //                                                                           error => console.log("error " , error) ))
      // if (res["MsgId"] ==="S" && post_data.UpdStatus === "P") { 
      //    post_data['Product']==
      //    this.llPreliminaryRequest.postLandLoanPreliminartyRequest().subscribe(response  => (console.log("sub " ,response   ) , 
      //                                                                           error => console.log("error " , error) ))

      // }
    }, err => this.resolveError());
  }

  updateProfile(UserProfile) {

    this.localStorage.getItem('custProfile').subscribe((data) => {

      this.customerProfiles = data;

      if (this.customerProfiles && this.customerProfiles.length > 0) {

        var bpProfile = this.customerProfiles.find((o) => o.BpNum === UserProfile[0].customerNo);
        if (!bpProfile) {

          this.customerProfiles.push({ BpName: UserProfile[0].origin, CustomerProfile: UserProfile[0].profileId, BpNum: UserProfile[0].customerNo });
          this.commonService.changeMessage(this.customerProfiles);

        }

      }

    });

    setTimeout(() => {

      this.localStorage.setItem('custProfile', this.customerProfiles).subscribe(() => { });

    }, 100);

  }


  onResult(result, save_submit, proposed_products_temp_source, representatives_temp_source) {
   
   if(save_submit===1)
    this.projectId= result.ProjectId;
     
    if (save_submit !== 3)
      this.preliminaryId = this.preliminaryId === "" ? result.PreliminaryId ? result.PreliminaryId : "" : this.preliminaryId;

    if (result.MsgId === "S") {
      this.startedFilling = 0;
      if (save_submit === 1) {

        this.commonService.showSuccessToast(result.MsgText);

        if (result.UserProfile && result.UserProfile.length !== 0)
          this.updateProfile(result.UserProfile);

        this.bindPRQInfo(result, 1);
      
      }

      else if (save_submit === 2) {

        this.commonService.showSuccessToast(result.MsgText);

        if (result.UserProfile && result.UserProfile.length !== 0)
          this.updateProfile(result.UserProfile);

        this.router.navigateByUrl('/pages/new-request/preliminary-request');
        this.spinnerService.hide();

      }

      else if (save_submit === 3) {

        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.PRQCancelled'));
        this.from_my_loans ? this.router.navigate(['/pages/my-loans']) : this.router.navigate(['/pages/new-request/preliminary-request']);
        this.spinnerService.hide();

      }

    }

    else {
      if (result['MsgId'] == "E" && result['MsgText'] == "RM Mail Id is not valid")
        this.commonService.showFailureToast(this.translate.instant("PRELIMINARY_REQUEST.EnterRelMgrEmail")); 
        
      this.commonService.showFailureToast(result.MsgText);
      this.onResultRevert(proposed_products_temp_source, representatives_temp_source);

    }

  }
  
  UpdatePreliminaryRequestStatus(){
    
    var obj = {
      "SIDFPreliminaryID": this.requestId,
      "SIDFRequestNo": 0 ,
      "StatusId": this.customerProfileService.PreliminaryRequestLastStatus
    }
    this.llPreliminaryRequest.UpdatePreliminaryRequestStatusByLastStatus(obj).then(response => {

    } , err => (this.resolveError()))
  }
  onResultRevert(proposed_products_temp_source, representatives_temp_source) {

    for (var i = 0; i < proposed_products_temp_source.length; i++) {

      var unit = this.unit_list.find((o) => o.UOMId === proposed_products_temp_source[i].unit);
      if (unit)
      {
        if(this.commonService.defaultLanguage === 'ar')
        proposed_products_temp_source[i].unit = unit.UOMTextAr;
        else
        proposed_products_temp_source[i].unit = unit.UOMText;
      }
      proposed_products_temp_source[i]["proInd"] = proposed_products_temp_source[i]["proInd"] === "X" ? "Yes" : "No";

    }

    this.proposed_products_source.load(proposed_products_temp_source);


    // for (var i = 0; i < proposed_ownerships_temp_source.length; i++) {

    //   var shareHolderType = this.share_holder_type_list.find((o) => o.id == proposed_ownerships_temp_source[i].shareHolderType);
    //   if (shareHolderType)
    //     proposed_ownerships_temp_source[i].shareHolderType = shareHolderType.type;

    //   var investorType = this.investor_type_list.find((o) => o.id == proposed_ownerships_temp_source[i].investorType);
    //   if (investorType)
    //     proposed_ownerships_temp_source[i].investorType = investorType.type;

    //   var nationality = this.country_list.find((o) => o.countryKey == proposed_ownerships_temp_source[i].nationality);
    //   if (nationality)
    //     proposed_ownerships_temp_source[i].nationality = nationality.nameEn;

    //   if (proposed_ownerships_temp_source[i].date)
    //     proposed_ownerships_temp_source[i].date = this.commonService.returnDateArrayFromDateString(proposed_ownerships_temp_source[i].date);

    //   proposed_ownerships_temp_source[i]["proInd"] = proposed_ownerships_temp_source[i]["proInd"] == "X" ? "Yes" : "No";

    //   proposed_ownerships_temp_source[i]["bankRelation"] = proposed_ownerships_temp_source[i]["bankRelation"] == "X" ? true : false;
    //   proposed_ownerships_temp_source[i]["nonObjection"] = proposed_ownerships_temp_source[i]["nonObjection"] == "X" ? true : false;
    //   proposed_ownerships_temp_source[i]["accessQawaem"] = proposed_ownerships_temp_source[i]["accessQawaem"] == "X" ? true : false;
    //   proposed_ownerships_temp_source[i]["acknowledgement"] = proposed_ownerships_temp_source[i]["acknowledgement"] == "X" ? true : false;
    //   proposed_ownerships_temp_source[i]["dealWithSidf"] = proposed_ownerships_temp_source[i]["dealWithSidf"] == "X" ? true : false;

    // }

    // this.proposed_ownerships_source.load(proposed_ownerships_temp_source);


    // for (var i = 0; i < bank_details_temp_source.length; i++) {

    //   var country = this.country_list.find((o) => o.countryKey == bank_details_temp_source[i].country);
    //   if (country)
    //     bank_details_temp_source[i].country = country.nameEn;

    //   if (bank_details_temp_source[i].updStatus == "D")
    //     delete bank_details_temp_source[i];

    // }

    // this.bank_details_source.load(bank_details_temp_source);


    for (var i = 0; i < representatives_temp_source.length; i++) {

      representatives_temp_source[i]["mciInd"] = representatives_temp_source[i]["mciInd"] === "X" ? "Yes" : "No";

      representatives_temp_source[i]["attachmentInd"] = representatives_temp_source[i]["attachmentInd"] === "X" ? "Yes" : "No";

      var idType = this.id_type_list.find((o) => o.id === representatives_temp_source[i].idType);
      if (idType)
        representatives_temp_source[i].idType = idType.type;

      if (representatives_temp_source[i].dob)
        representatives_temp_source[i].dob = this.commonService.returnDateArrayFromDateStringWithoutHyphen(representatives_temp_source[i].dob);

    }

    this.representatives_source.load(representatives_temp_source);

    this.spinnerService.hide();

  }

  next() {
   
    if (this.inputs.TypeOfLicenseChecked === this.initialLicense && (this.inputs.IndustrialLicenseId === "" || this.inputs.IndustrialLicenseId === null))
      this.industrial_license_id_vs = true;

    else
      this.industrial_license_id_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.initialLicense && this.inputs.IndustrialLicenseDate == "" && !this.inputs.IndustrialLicenseDate)
      this.industrial_license_date_vs = true;

    else
      this.industrial_license_date_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.finalLicense && (this.inputs.CustomerLicenseNumber === "" || this.inputs.CustomerLicenseNumber === null))
      this.customer_license_number_vs = true;

    else
      this.customer_license_number_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.finalLicense && ((this.inputs.CustomerLicenseDate.year === 0 && this.inputs.CustomerLicenseDate.month === 0 && this.inputs.CustomerLicenseDate.day === 0) || this.inputs.CustomerLicenseDate === null))
      this.customer_license_date_vs = true;
    else
      this.customer_license_date_vs = false;

      if (this.inputs.TypeOfLicenseChecked === this.meimInitialLicense && (this.inputs.MEIMIndustrialLicenseId === "" || this.inputs.MEIMIndustrialLicenseId === null))
      this.meim_industrial_license_id_vs = true;

    else
      this.meim_industrial_license_id_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.meimInitialLicense && this.inputs.MEIMIndustrialLicenseDate == "" && !this.inputs.MEIMIndustrialLicenseDate)
      this.meim_industrial_license_date_vs = true;

    else
      this.meim_industrial_license_date_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.sagiaLicense && (this.inputs.CrNumber === "" || this.inputs.CrNumber === null))
      this.cr_number_vs = true;

    else
      this.cr_number_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.sagiaLicense && ((this.inputs.CrExpiryDate.year === 0 && this.inputs.CrExpiryDate.month === 0 && this.inputs.CrExpiryDate.day === 0) || this.inputs.CrExpiryDate === null))
      this.cr_expiry_date_vs = true;

    else
      this.cr_expiry_date_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.crNumberLicense && (this.inputs.CrNumber === "" || this.inputs.CrNumber === null))
      this.cr_number_vs = true;

    else
      this.cr_number_vs = false;

    if (this.inputs.TypeOfLicenseChecked === this.crNumberLicense && ((this.inputs.IssueDate.year === 0 && this.inputs.IssueDate.month === 0 && this.inputs.IssueDate.day === 0) || this.inputs.IssueDate === null))
      this.issue_date_vs = true;

    else
      this.issue_date_vs = false;
    if (this.inputs.ProfileType === "" || this.inputs.ProfileType === null)
      this.profile_type_vs = true;

    else
      this.profile_type_vs = false;


    if (this.industrial_license_id_vs || this.industrial_license_date_vs || this.customer_license_number_vs ||
      this.customer_license_date_vs || this.meim_industrial_license_id_vs || this.meim_industrial_license_date_vs || this.cr_number_vs || this.cr_expiry_date_vs || this.issue_date_vs || this.profile_type_vs)
      this.commonService.showFailureToast(this.translate.instant('COMMON.EnterAllMandatoryFields'));

    else {

      var licenseType = "", idNumber = "", dob = "", purpose = "N";

      if (this.inputs.TypeOfLicenseChecked === this.initialLicense) {

        licenseType = "I";

        idNumber = this.inputs.IndustrialLicenseId;

        dob = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.IndustrialLicenseDate);

      }

      else if (this.inputs.TypeOfLicenseChecked === this.finalLicense) {

        licenseType = "F";

        idNumber = this.inputs.CustomerLicenseNumber;

        dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.CustomerLicenseDate);

      }
  
      else if (this.inputs.TypeOfLicenseChecked === this.meimInitialLicense) {

        licenseType = "MI";

        idNumber = this.inputs.MEIMIndustrialLicenseId;

        dob = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.MEIMIndustrialLicenseDate);

        this.isMEIM = true;

      }

      else if (this.inputs.TypeOfLicenseChecked === this.sagiaLicense) {

        licenseType = "S";

        idNumber = this.inputs.CrNumber;

        dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.CrExpiryDate);

        this.isSagiaOrCr = true;
      }

      else if (this.inputs.TypeOfLicenseChecked === this.crNumberLicense) {

        licenseType = "C";

        idNumber = this.inputs.CrNumber;

        dob = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.IssueDate);

        this.isSagiaOrCr = true;

      }
      this.getMCIDetails(licenseType, idNumber, dob, purpose, "Next");
      this.getPreliminaryRequestInfoSecond(licenseType, idNumber, dob, purpose, "next");

    }

  }
  getPreliminaryRequestInfoSecond(licenseType, idNumber, dob, purpose, from) {

    this.spinnerService.show();

    try {

      this.preliminaryRequestService
        .getPreliminaryRequestInfoSecond(this.inputs.ProfileType)
        .then((res) => (this.resolvePreliminaryRequestInfoSecond(res, licenseType, idNumber, dob, purpose, from)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  //// TODO: getting the sector and purpose from BackEnd  
  resolvePreliminaryRequestInfoSecond(res, licenseType, idNumber, dob, purpose, from) {

    if (res.MessType == "E") {

      this.commonService.showFailureToast(res.message);
      this.spinnerService.hide();

    }

    else {

      try {

        this.inputs.Type = res["preRequestType"] ? res["preRequestType"] : [];

        if (res["industrialSector"])
          for (var i = 0; i < res["industrialSector"].length; i++) {
            res["industrialSector"][i].preliminaryId = this.preliminaryId;
            this.inputs.IndustrialSector.push(res["industrialSector"][i]);
          }

        this.industrial_sector_pop_up_array = this.inputs.IndustrialSector;

        if (this.isProjectExist === "X")
          this.checkType();

        this.spinnerService.hide();

        if (from == "next")
          this.getMCIDetails(licenseType, idNumber, dob, purpose, from);

        else if (from == "from_my_loans")
          this.inputs.TypeSelected = this.inputs.TypeSelected == "" && this.prqRequestType && this.prqRequestType == "X" ? "E" : this.inputs.TypeSelected;

        else if (from == "bind_prq" && this.prqRequestType) {

          var type_name = this.prqRequestType[0].type ? this.prqRequestType[0].type : "";

          var type_id = "";

          var typeResult = this.inputs.Type.find((o) => o.type === type_name);
          if (typeResult)
            type_id = typeResult.id;
          if (type_id == "OTH" && this.prqRequestType[0].others) {

            var other_purpose = this.prqRequestType[0].others;
            this.isPurposeOthers = true;

          }

          else
            this.isPurposeOthers = false;
            this.inputs.TypeSelected = type_id;

            this.inputs.OtherPurpose = other_purpose;

        }

      }

      catch (err) {
        this.resolveError();
      }

    }

  }

  onBack(delete_cancel_modal, action) {

    if (action === 1) {
      if (this.startedFilling == 0)
        this.from_my_loans ? this.router.navigate(['/pages/my-loans']) : this.router.navigate(['/pages/new-request/preliminary-request']);

      else {
        let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
        delete options.size;
        this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal, options);
        this.deleteCancelModalReference.action = this.translate.instant('COMMON.GoBack');
        this.deleteCancelModalReference.table_name_display = "";
        this.deleteCancelModalReference.error = this.translate.instant('COMMON.BackError');

      }

    }

    else
      this.from_my_loans ? this.router.navigate(['/pages/my-loans']) : this.router.navigate(['/pages/new-request/preliminary-request'])

  }

  bindPRQDetailsByRequestId() {
    try {
  
      this.preliminaryRequestService.getPRQDetailsByRequestId(this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
        .then(requests => (this.bindPRQInfo(requests, 0)), err => this.resolveError());
 
    }

    catch (err) {
      this.resolveError();
    }

  }
  
  bindPRQInfo(res, from) {

    switch (res.PrqTypesList[0].id) {

      case '0000000024':
        this.serviceId = 7;
        break;
      case '0000000025':
        this.serviceId = 8;
        break;
      case '0000000035':
        this.serviceId = 9;
        break;
      case '0000000036':
          this.serviceId = 10;
          break;
      case '0000000038':
        this.serviceId = 11;
        break;
     case '0000000051':
        this.serviceId = 12;
        break;
        case '0000000052':
          this.serviceId = 13;
          break;
          case '0000000053':
            this.serviceId = 14;
            break;
            case '0000000054':
              this.serviceId = 15;
              break;
    }

    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.message);
      this.spinnerService.hide();
    }

    else {

      try {
        
        this.isMEIM = res.LicenseDetails[0].licenseType === "MI" ? true : false;
                 
        if (res.UpdStatus)
          this.inputs.UpdStatus = res.UpdStatus;

        console.log('details res = ', res);

        // if (this.serviceId == 7 || this.serviceId == 8 || this.serviceId == 9 || this.serviceId == 11) {
          if (this.serviceId == 7 || this.serviceId == 8 || this.serviceId == 9 || this.serviceId == 10 || this.serviceId == 11  || this.serviceId == 12  || this.serviceId == 13  || this.serviceId == 14  || this.serviceId == 15) {

          let isInitial = res["LicenseDetails"][0]["licenseType"] == "F" ? false : true;
          let idNumber = res["LicenseDetails"][0]["licenseId"];
          
          this.preliminaryRequestService
            .GetModonCites({ "isInitial": isInitial, "ILNumber": idNumber })
            .then((res2) => {

              if (res2["result"] === "Failur") {
                this.spinnerService.hide();
                this.commonService.showFailureToast(" لا توجد مدينة متاحة للأرض الصناعية ");
              }
              else
                this.modonCities = res2;


        })
//---------------------------------------

this.preliminaryId = res.PreliminaryId ? res.PreliminaryId : "";
            

this.isProjectExist = res.isProjectExist ? res.isProjectExist : (res.IsProjectExist ? res.IsProjectExist : "");

if (this.isProjectExist === "X")
  this.checkType();

if (res.SectorRegions) {

  var region_name = res.SectorRegions[0].region ? res.SectorRegions[0].region : "";

  var region_id = "";

  var regionResult = this.inputs.Region.find((o) => o.region === region_name);
  if (regionResult)
    region_id = regionResult.id;

}

this.prqRequestType = res.PreRequestType;


this.inputs = {
  ModonCity: res.ModonCity,  
  ProjectCode: res.ProjectCode ? res.ProjectCode : res.projectCode ? res.projectCode : "",
  ProjectId: res.ProjectId,
  TypeOfLicense: (this.initialLicense + "," +
        this.finalLicense + "," + this.meimInitialLicense +
        "," + this.sagiaLicense).split(","),
      TypeOfLicenseOriginal: (this.initialLicense + "," +
        this.finalLicense + "," + this.meimInitialLicense +
        "," + this.sagiaLicense).split(","),
  TypeOfLicenseChecked: this.initialLicense,
  CustomerLicenseNumber: "",        
  CustomerLicenseDate: { year: 0, month: 0, day: 0 },
  IndustrialLicenseId: "",
  IndustrialLicenseDate:"",// { year: 0, month: 0, day: 0 },
  MEIMIndustrialLicenseId: "",
  MEIMIndustrialLicenseDate: "", 
  CrNumber: "",
  CrExpiryDate: { year: 0, month: 0, day: 0 },
  IssueDate: { year: 0, month: 0, day: 0 },
  commercialRegistrationDetails: [{
    RegNumber: "",
    RegStartDate: "",
    RegEndDate: "",
    RegActivity: "",
    RegCompanyName: ""
  }],
  licenseDetails: [{
    preliminaryId: "",
    licenseType: "",
    licenseId: "",
    licStartDate: { year: 0, month: 0, day: 0 },
    licEndDate: { year: 0, month: 0, day: 0 },
    licStartDateGreg: "",
    licEndDateGreg: "",
    crNumber: "",
    crIssueDate: { year: 0, month: 0, day: 0 },
    crExpiryDate: { year: 0, month: 0, day: 0 },
    crLocationAr: "",
    proCapital: "",
    factoryName: "",
    crCity: "",
    addressDesc: "",
    landNo: "",
    city: "",
    mngmntArea: "",
    poBox: "",
    storesArea: "",
    totalArea: "",
    longX: "",
    latitudeY: "",
    zipCode: "",
    crName: "",
    crCapital: "",
    crLeagalTypeEn: "",
    crLeagalTypeAr: "",
    crPhone: "",
    crFaxNo: "",
    crAddress: "",
    crBuildingNo: "",
    crAdditionalNo: "",
    crUnitNo: "",
    crZipCode: "",
    crNameAr: "",
    factoryNameAr: "",
    reqAmount: "",
    crDistrictArea: "",
    crLegalInd: ""
  }],
  RmEmail: this.inputs.RmEmail,
  // RmList: this.inputs.RmList,
  // RmListSelected: "",
  productDetails: [],
  ownersDetails: [],
  IndustrialSector: this.inputs.IndustrialSector,
  IndustrialSectorSelected: [{
    "preliminaryId": "",
    "sectorId": "",
    "sectorMcatId": "",
    "name": "",
    "isActive": ""
  }],
 // Category: this.inputs.Category,
 // CategorySelected: category_id,
  Region: this.inputs.Region,
  RegionSelected: region_id,
  Type: this.inputs.Type,
  TypeSelected: this.inputs.TypeSelected,
  ProfileTypeList: this.inputs.ProfileTypeList,
  ProfileType: this.inputs.ProfileType === "" ? res.PrqTypesList ? res.PrqTypesList[0].id ? res.PrqTypesList[0].id : "" : "" : this.inputs.ProfileType,
  ProfileTypeSelected: this.inputs.ProfileTypeSelected === "" ? res.PrqTypesList ? res.PrqTypesList[0].prqTypeEn ? res.PrqTypesList[0].prqTypeEn : "" : "" : this.inputs.ProfileTypeSelected,
  UpdStatus: res.UpdStatus ? res.UpdStatus : "",
  eca_license: this.inputs.eca_license,
  OtherPurpose: this.inputs.OtherPurpose

}

// if (res.RmList)
//   this.inputs.RmListSelected = res.RmList[0].userId;

this.inputs.RmEmail = res.RmList ? (res.RmList[0].rmEmailId ? res.RmList[0].rmEmailId : "") : ""
   
if (res.LicenseDetails) {
  
  this.inputs.licenseDetails[0].preliminaryId = res.LicenseDetails[0].preliminaryId ? res.LicenseDetails[0].preliminaryId : "";
  this.inputs.licenseDetails[0].licenseType = res.LicenseDetails[0].licenseType ? res.LicenseDetails[0].licenseType : "";
  this.inputs.licenseDetails[0].licenseId = res.LicenseDetails[0].licenseId ? res.LicenseDetails[0].licenseId : "";
  this.inputs.licenseDetails[0].licStartDate = !this.isMEIM ? res.LicenseDetails[0].licStartDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.LicenseDetails[0].licStartDate) : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 };
  this.inputs.licenseDetails[0].licEndDate = !this.isMEIM ? res.LicenseDetails[0].licEndDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.LicenseDetails[0].licEndDate) : { year: 0, month: 0, day: 0 } : { year: 0, month: 0, day: 0 };
  this.inputs.licenseDetails[0].licStartDateGreg = this.isMEIM ? res.LicenseDetails[0].licStartDate ? this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.LicenseDetails[0].licStartDate) : "" : "";
  this.inputs.licenseDetails[0].licEndDateGreg = this.isMEIM ? res.LicenseDetails[0].licEndDate ? this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.LicenseDetails[0].licEndDate) : "" : "";
  this.inputs.licenseDetails[0].crNumber = res.LicenseDetails[0].crNumber ? res.LicenseDetails[0].crNumber : "";
  this.inputs.licenseDetails[0].crIssueDate = res.LicenseDetails[0].crIssueDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.LicenseDetails[0].crIssueDate) : { year: 0, month: 0, day: 0 };
  this.inputs.licenseDetails[0].crExpiryDate = res.LicenseDetails[0].crExpiryDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.LicenseDetails[0].crExpiryDate) : { year: 0, month: 0, day: 0 };
  this.inputs.licenseDetails[0].crLocationAr = res.LicenseDetails[0].crLocationAr ? res.LicenseDetails[0].crLocationAr : "";
  this.inputs.licenseDetails[0].proCapital = res.LicenseDetails[0].proCapital ? res.LicenseDetails[0].proCapital : "";
  this.inputs.licenseDetails[0].factoryName = res.LicenseDetails[0].factoryName ? res.LicenseDetails[0].factoryName : "";
  this.inputs.licenseDetails[0].crCity = res.LicenseDetails[0].crCity ? res.LicenseDetails[0].crCity : "";
  this.inputs.licenseDetails[0].addressDesc = res.LicenseDetails[0].addressDesc ? res.LicenseDetails[0].addressDesc : "";
  this.inputs.licenseDetails[0].landNo = res.LicenseDetails[0].landNo ? res.LicenseDetails[0].landNo : "";
  
  
  var crLocationAr= this.city_name_list2.find((o) =>o.cityNameEn === res.LicenseDetails[0].crLocationAr|| o.cityNameAr === res.LicenseDetails[0].crLocationAr);

  
  if(crLocationAr && this.commonService.defaultLanguage==='en')
  this.inputs.licenseDetails[0].crLocationAr =crLocationAr.cityNameEn;
  if(crLocationAr && this.commonService.defaultLanguage==='ar')
  this.inputs.licenseDetails[0].crLocationAr =crLocationAr.cityNameAr;
  

  
  var cind= this.city_name_list2.find((o) => o.cityNameEn === res.LicenseDetails[0].city|| o.cityNameAr === res.LicenseDetails[0].city);
  
  
  if(cind&&this.commonService.defaultLanguage==='en')
  this.inputs.licenseDetails[0].city =cind.cityNameEn;
  if(cind&&this.commonService.defaultLanguage==='ar')
  this.inputs.licenseDetails[0].city =cind.cityNameAr;
  
  this.inputs.licenseDetails[0].mngmntArea = res.LicenseDetails[0].mngmntArea ? res.LicenseDetails[0].mngmntArea : "";
  this.inputs.licenseDetails[0].poBox = res.LicenseDetails[0].poBox ? res.LicenseDetails[0].poBox : "";
  this.inputs.licenseDetails[0].storesArea = res.LicenseDetails[0].storesArea ? res.LicenseDetails[0].storesArea : "";
  this.inputs.licenseDetails[0].totalArea = res.LicenseDetails[0].totalArea ? res.LicenseDetails[0].totalArea : "";
  this.inputs.licenseDetails[0].longX = res.LicenseDetails[0].longX ? res.LicenseDetails[0].longX : "";
  this.inputs.licenseDetails[0].latitudeY = res.LicenseDetails[0].latitudeY ? res.LicenseDetails[0].latitudeY : "";
  this.inputs.licenseDetails[0].zipCode = res.LicenseDetails[0].zipCode ? res.LicenseDetails[0].zipCode : "";
  this.inputs.licenseDetails[0].crName = res.LicenseDetails[0].crName ? res.LicenseDetails[0].crName : "";
  this.inputs.licenseDetails[0].crCapital = res.LicenseDetails[0].crCapital ? res.LicenseDetails[0].crCapital : "";
  this.inputs.licenseDetails[0].crLeagalTypeEn = res.LicenseDetails[0].crLeagalTypeEn ? res.LicenseDetails[0].crLeagalTypeEn : "";
  this.inputs.licenseDetails[0].crLeagalTypeAr = res.LicenseDetails[0].crLeagalTypeAr ? res.LicenseDetails[0].crLeagalTypeAr : "";
  this.inputs.licenseDetails[0].crPhone = res.LicenseDetails[0].crPhone ? res.LicenseDetails[0].crPhone : "";
  this.inputs.licenseDetails[0].crFaxNo = res.LicenseDetails[0].crFaxNo ? res.LicenseDetails[0].crFaxNo : "";
  this.inputs.licenseDetails[0].crAddress = res.LicenseDetails[0].crAddress ? res.LicenseDetails[0].crAddress : "";
  this.inputs.licenseDetails[0].crBuildingNo = res.LicenseDetails[0].crBuildingNo ? res.LicenseDetails[0].crBuildingNo : "";
  this.inputs.licenseDetails[0].crAdditionalNo = res.LicenseDetails[0].crAdditionalNo ? res.LicenseDetails[0].crAdditionalNo : "";
  this.inputs.licenseDetails[0].crUnitNo = res.LicenseDetails[0].crUnitNo ? res.LicenseDetails[0].crUnitNo : "";
  this.inputs.licenseDetails[0].crDistrictArea = res.LicenseDetails[0].crDistrictArea ? res.LicenseDetails[0].crDistrictArea : "";
  this.inputs.licenseDetails[0].crZipCode = res.LicenseDetails[0].crZipCode ? res.LicenseDetails[0].crZipCode : "";
  this.inputs.licenseDetails[0].crLegalInd = res.LicenseDetails[0].crLegalInd ? res.LicenseDetails[0].crLegalInd : "";

  this.inputs.licenseDetails[0].crNameAr = res.LicenseDetails[0].crNameAr ? res.LicenseDetails[0].crNameAr : "";
  this.inputs.licenseDetails[0].factoryNameAr = res.LicenseDetails[0].factoryNameAr ? res.LicenseDetails[0].factoryNameAr : "";
  this.inputs.licenseDetails[0].reqAmount = res.LicenseDetails[0].reqAmount ? res.LicenseDetails[0].reqAmount : "";

  
  // if (this.inputs.licenseDetails[0].crNumber && this.serviceId == 9)
  if (this.inputs.licenseDetails[0].crNumber && (this.serviceId == 9 || this.serviceId == 10 || this.serviceId == 13 || this.serviceId == 14))

  {
    this.GetCRnformation(this.inputs.licenseDetails[0].crNumber);
  }

}

this.inputs.TypeOfLicenseChecked = res.LicenseDetails[0].licenseType === "I" ?
      this.initialLicense : res.LicenseDetails[0].licenseType === "F" ?
        this.finalLicense : res.LicenseDetails[0].licenseType === "MI" ?
          this.meimInitialLicense : res.LicenseDetails[0].licenseType === "S" ?
            this.sagiaLicense : res.LicenseDetails[0].licenseType === "C" ? this.crNumberLicense : "";

if (res.IndustrialSector) {

  this.inputs.IndustrialSectorSelected[0].preliminaryId = res.IndustrialSector[0].preliminaryId ? res.IndustrialSector[0].preliminaryId : "";
  this.inputs.IndustrialSectorSelected[0].sectorId = res.IndustrialSector[0].sectorId ? res.IndustrialSector[0].sectorId : "";
  this.inputs.IndustrialSectorSelected[0].sectorMcatId = res.IndustrialSector[0].sectorMcatId ? res.IndustrialSector[0].sectorMcatId : "";
 if(this.commonService.defaultLanguage==='en')
  this.inputs.IndustrialSectorSelected[0].name = res.IndustrialSector[0].name ? res.IndustrialSector[0].name : "";
  else if(res.IndustrialSector[0].name ){
  var ind= this.industrial_sector_name_list.find((o) => o.name === res.IndustrialSector[0].name);
  console.log('papaaa');
  
  if(ind)
  this.inputs.IndustrialSectorSelected[0].name =ind.nameAr;
  }
  

console.log(this.industrial_sector_pop_up_array);
  this.inputs.IndustrialSectorSelected[0].isActive = res.IndustrialSector[0].isActive ? res.IndustrialSector[0].isActive : "";

}

if (res.ProductDetails) {

  for (var i = 0; i < res.ProductDetails.length; i++) {
    res.ProductDetails[i].preliminaryId = this.preliminaryId;
    res.ProductDetails[i].proInd = res.ProductDetails[i].proInd ? (res.ProductDetails[i].proInd === "X" ? "Yes" : "No") : "No";
    res.ProductDetails[i].updStatus = "";

    var division = this.isic_division_list.find((o) => o.id === res.ProductDetails[i].divisionId);
    if (division)
      res.ProductDetails[i].divisionName = division.divisionName;

    var activity = this.isic_activity_list.find((o) => o.activityId === res.ProductDetails[i].activityId);
    if (activity)
      res.ProductDetails[i].activityName = activity.activityName;

    var unit = this.unit_list.find((o) => o.UOMId === res.ProductDetails[i].unit);
    if (unit)
      res.ProductDetails[i].unit = unit.UOMText;

    this.inputs.productDetails.push(res.ProductDetails[i]);
  }

  this.inputs.productDetails.sort(this.commonService.sortArray("-proInd"));

  this.proposed_products_source.load(this.inputs.productDetails);

  this.proposed_products_source_length = res.ProductDetails.length;

  this.proposed_products_source.refresh();

}

if (res.OwnersDetails) {

  var bank_details_temp_source = [], real_estate_temp_source = [], companies_temp_source = [],
    other_investments_temp_source = [];

  for (var i = 0; i < res.OwnersDetails.length; i++) {

    res.OwnersDetails[i].preliminaryId = this.preliminaryId;
    res.OwnersDetails[i].updStatus = "";
    res.OwnersDetails[i].proInd = res.OwnersDetails[i].proInd ? (res.OwnersDetails[i].proInd === "X" ? "Yes" : "No") : "No";

    res.OwnersDetails[i]["bankRelation"] = res.OwnersDetails[i]["bankRelation"] ? (res.OwnersDetails[i]["bankRelation"] === "X" ? true : false) : false;
    res.OwnersDetails[i]["nonObjection"] = res.OwnersDetails[i]["nonObjection"] ? (res.OwnersDetails[i]["nonObjection"] === "X" ? true : false) : false;
    res.OwnersDetails[i]["accessQawaem"] = res.OwnersDetails[i]["accessQawaem"] ? (res.OwnersDetails[i]["accessQawaem"] === "X" ? true : false) : false;
    res.OwnersDetails[i]["acknowledgement"] = res.OwnersDetails[i]["acknowledgement"] ? (res.OwnersDetails[i]["acknowledgement"] === "X" ? true : false) : false;
    res.OwnersDetails[i]["dealWithSidf"] = res.OwnersDetails[i]["dealWithSidf"] ? (res.OwnersDetails[i]["dealWithSidf"] === "X" ? true : false) : false;
console.log('aaaa');
console.log(res.OwnersDetails[i]);
console.log(res.OwnersDetails[i].bankDetails );
    if (!res.OwnersDetails[i].bankDetails)
      res.OwnersDetails[i].bankDetails = [];

    else {

      for (var j = 0; j < res.OwnersDetails[i].bankDetails.length; j++) {

        var bankNationality = this.country_list.find((o) => o.countryKey === res.OwnersDetails[i].bankDetails[j].country);
        if (bankNationality&&this.commonService.defaultLanguage==='ar') 
          res.OwnersDetails[i].bankDetails[j].country = bankNationality.nameAr;
          if (bankNationality&&this.commonService.defaultLanguage==='en') 
          res.OwnersDetails[i].bankDetails[j].country = bankNationality.nameEn;

        res.OwnersDetails[i].bankDetails[j]["accHolder"] = res.OwnersDetails[i].name;
        bank_details_temp_source.push(res.OwnersDetails[i].bankDetails[j]);

      }

    }


    if (!res.OwnersDetails[i].realEstateDetails)
      res.OwnersDetails[i].realEstateDetails = [];

    else {

      for (var j = 0; j < res.OwnersDetails[i].realEstateDetails.length; j++) {

        var selectedOwner = res.OwnersDetails.find((o) => o.buPartner === res.OwnersDetails[i].realEstateDetails[j].buPartner);
        if (selectedOwner)
          res.OwnersDetails[i].realEstateDetails[j]["Name"] = selectedOwner.name;

        var propertyType = this.property_type_list.find((o) => o.id === res.OwnersDetails[i].realEstateDetails[j]["propertyType"]);
        
          if(propertyType&&this.commonService.defaultLanguage==='en')
          res.OwnersDetails[i].realEstateDetails[j]["propertyType"] = propertyType.propertyTypeEn;
        else if(propertyType&&this.commonService.defaultLanguage==='ar')
        res.OwnersDetails[i].realEstateDetails[j]["propertyType"] = propertyType.propertyTypeAr;
  
        var country = this.country_list.find((o) => o.countryKey === res.OwnersDetails[i].realEstateDetails[j].country);
        if (country&&this.commonService.defaultLanguage==='en')
          res.OwnersDetails[i].realEstateDetails[j].country = country.nameEn;
          if (country&&this.commonService.defaultLanguage==='ar')
          res.OwnersDetails[i].realEstateDetails[j].country = country.nameAr;

        res.OwnersDetails[i].realEstateDetails[j]["purchasePrice"] = "SAR " + this.commonService.numberToNumberWithCommas(res.OwnersDetails[i].realEstateDetails[j]["purchasePrice"]);
        res.OwnersDetails[i].realEstateDetails[j]["currentMarketValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.OwnersDetails[i].realEstateDetails[j]["currentMarketValue"]);

        res.OwnersDetails[i].realEstateDetails[j]["purchaseDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.OwnersDetails[i].realEstateDetails[j]["purchaseDate"]);
        res.OwnersDetails[i].realEstateDetails[j]["currentMarketDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.OwnersDetails[i].realEstateDetails[j]["currentMarketDate"]);

        real_estate_temp_source.push(res.OwnersDetails[i].realEstateDetails[j]);

      }

    }


    if (!res.OwnersDetails[i].companyDetails)
      res.OwnersDetails[i].companyDetails = [];

    else {

      for (var j = 0; j < res.OwnersDetails[i].companyDetails.length; j++) {

        var selectedOwner = res.OwnersDetails.find((o) => o.buPartner === res.OwnersDetails[i].companyDetails[j].buPartner);
        if (selectedOwner)
          res.OwnersDetails[i].companyDetails[j]["Name"] = selectedOwner.name;

        res.OwnersDetails[i].companyDetails[j]["shareValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.OwnersDetails[i].companyDetails[j]["shareValue"]);

        res.OwnersDetails[i].companyDetails[j]["crIssueDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.OwnersDetails[i].companyDetails[j]["crIssueDate"]);

        companies_temp_source.push(res.OwnersDetails[i].companyDetails[j]);

      }

    }


    if (!res.OwnersDetails[i].investmentDetails)
      res.OwnersDetails[i].investmentDetails = [];

    else {

      for (var j = 0; j < res.OwnersDetails[i].investmentDetails.length; j++) {

        var selectedOwner = res.OwnersDetails.find((o) => o.buPartner === res.OwnersDetails[i].investmentDetails[j].buPartner);
        if (selectedOwner)
          res.OwnersDetails[i].investmentDetails[j]["Name"] = selectedOwner.name;

        var investmentType = this.investment_type_list.find((o) => o.id === res.OwnersDetails[i].investmentDetails[j]["investmentType"]);
        if (investmentType&&this.commonService.defaultLanguage === 'en')
          res.OwnersDetails[i].investmentDetails[j]["investmentType"] = investmentType.investTypeEn;
          if (investmentType&&this.commonService.defaultLanguage === 'ar')
          res.OwnersDetails[i].investmentDetails[j]["investmentType"] = investmentType.investTypeAr;

        res.OwnersDetails[i].investmentDetails[j]["value"] = res.OwnersDetails[i].investmentDetails[j]["value"] ? "SAR " + this.commonService.numberToNumberWithCommas(res.OwnersDetails[i].investmentDetails[j]["value"]) : "";

        res.OwnersDetails[i].investmentDetails[j]["marketPrice"] = res.OwnersDetails[i].investmentDetails[j]["marketPrice"] ? "SAR " + this.commonService.numberToNumberWithCommas(res.OwnersDetails[i].investmentDetails[j]["marketPrice"]) : "";
        res.OwnersDetails[i].investmentDetails[j]["totalMarketValue"] = res.OwnersDetails[i].investmentDetails[j]["totalMarketValue"] ? "SAR " + this.commonService.numberToNumberWithCommas(res.OwnersDetails[i].investmentDetails[j]["totalMarketValue"]) : "";

        other_investments_temp_source.push(res.OwnersDetails[i].investmentDetails[j]);

      }

    }


    if (res.OwnersDetails[i].date)
      res.OwnersDetails[i].date = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.OwnersDetails[i].date);

    else
      res.OwnersDetails[i].date = this.commonService.returnDateArrayFromDateStringWithoutHyphen("00000000");

    var nationality = this.country_list.find((o) => o.countryKey === res.OwnersDetails[i].nationality);
    if (nationality&&this.commonService.defaultLanguage==='en')
      res.OwnersDetails[i].nationality = nationality.nameEn;
      if (nationality&&this.commonService.defaultLanguage==='ar')
      res.OwnersDetails[i].nationality = nationality.nameAr;

    var shareHolderType = this.share_holder_type_list.find((o) => o.id === res.OwnersDetails[i].shareHolderType);
    if (shareHolderType)
      res.OwnersDetails[i].shareHolderType = shareHolderType.type;

    var investorType = this.investor_type_list.find((o) => o.id === res.OwnersDetails[i].investorType);
    if (investorType)
      res.OwnersDetails[i].investorType = investorType.type;

    this.inputs.ownersDetails.push(res.OwnersDetails[i]);

  }

  this.inputs.ownersDetails.sort(this.commonService.sortArray("-proInd"));

  this.proposed_ownerships_source.load(this.inputs.ownersDetails);

  this.proposed_ownerships_source_length = res.OwnersDetails.length;

  this.proposed_ownerships_source.refresh();


  this.bank_details_source.load(bank_details_temp_source);

  this.bank_details_source_length = bank_details_temp_source.length;

  this.bank_details_source.refresh();


  this.real_estate_source.load(real_estate_temp_source);

  this.real_estate_source_length = real_estate_temp_source.length;

  this.real_estate_source.refresh();


  this.list_companies_source.load(companies_temp_source);

  this.list_companies_source_length = companies_temp_source.length;

  this.list_companies_source.refresh();


  this.other_investments_source.load(other_investments_temp_source);

  this.other_investments_source_length = other_investments_temp_source.length;

  this.other_investments_source.refresh();

  this.non_saudi_owners_list = [];

  for (var i = 0; i < this.inputs.ownersDetails.length; i++)
    if (this.inputs.ownersDetails[i].nationality && this.inputs.ownersDetails[i].nationality != 'SA' && this.inputs.ownersDetails[i].nationality != 'Saudi Arabia' && this.inputs.ownersDetails[i].nationality != 'السعودية')
      this.non_saudi_owners_list.push(this.inputs.ownersDetails[i].name);


}

if (res.RepresentativeDetails) {

  var representatives_temp_source = [];

  for (var i = 0; i < res.RepresentativeDetails.length; i++) {

    res.RepresentativeDetails[i].mciInd = res.RepresentativeDetails[i].mciInd ? (res.RepresentativeDetails[i].mciInd === "X" ? "Yes" : "No") : "No";

    res.RepresentativeDetails[i].attachmentInd = res.RepresentativeDetails[i].attachmentInd ? (res.RepresentativeDetails[i].attachmentInd === "X" ? "Yes" : "No") : "No";

    var idType = this.id_type_list.find((o) => o.id === res.RepresentativeDetails[i].idType);
    if (idType)
      res.RepresentativeDetails[i].idType = idType.type;

    res.RepresentativeDetails[i].preliminaryId = this.preliminaryId;
    res.RepresentativeDetails[i].updStatus = "";

    if (res.RepresentativeDetails[i].dob)
      res.RepresentativeDetails[i].dob = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.RepresentativeDetails[i].dob);

    else
      res.RepresentativeDetails[i].dob = this.commonService.returnDateArrayFromDateStringWithoutHyphen("00000000");

    representatives_temp_source.push(res.RepresentativeDetails[i]);

  }

  this.representatives_source.load(representatives_temp_source);

  this.representatives_source_length = res.RepresentativeDetails.length;

  this.representatives_source.refresh();

}

this.communicationsService.getDocumentService(this.preliminaryId, "p")
  .then(requests => (this.resolveDocuments(requests, from)), err => this.resolveError());




      }
    }
      catch (err) {
        this.resolveError();
      }

    }

  }

  resolveDocuments(requests, from) {

    this.documents = this.commonService.returnViewDocumentJson(requests);
console.log(this.documents);

    this.ownersTableDocuments.url = this.documents["url"];

    this.documentsTableDocuments.url = this.documents["url"];

    this.realEstateTableDocuments.url = this.documents["url"];

    this.listOfCompaniesTableDocuments.url = this.documents["url"];

    this.otherInvestmentsTableDocuments.url = this.documents["url"];


    this.ownersTableDocuments.documentList = [];

    this.documentsTableDocuments.documentList = [];

    this.realEstateTableDocuments.documentList = [];

    this.listOfCompaniesTableDocuments.documentList = [];

    this.otherInvestmentsTableDocuments.documentList = [];


    var proposed_ownerships_temp_source = [],
      real_estate_temp_source = [], companies_temp_source = [],
      other_investments_temp_source = [];


    this.proposed_ownerships_source.getAll().then((res) => {

      proposed_ownerships_temp_source = res;

      this.real_estate_source.getAll().then((res) => {

        real_estate_temp_source = res;

        this.list_companies_source.getAll().then((res) => {

          companies_temp_source = res;

          this.other_investments_source.getAll().then((res) => {

            other_investments_temp_source = res;

            for (var i = 0; i < this.documents["documentList"].length; i++) {

              this.documents["documentList"][i]["docUrl"] =
                this.documents["url"]
                  .replace("entityId", this.documents["documentList"][i].EntityId)
                  .replace("refId", this.documents["documentList"][i].RefId)
                  .replace("documentId", this.documents["documentList"][i].DocumentId)
                  .replace("fileName", this.documents["documentList"][i].FileName);

              if (this.documents["documentList"][i].RelatedEntityId) {

                for (var j = 0; j < proposed_ownerships_temp_source.length; j++)
                  if (parseInt(proposed_ownerships_temp_source[j].guiId) === parseInt(this.documents["documentList"][i].RelatedEntityId))
                    this.ownersTableDocuments["documentList"].push(this.documents["documentList"][i]);

                for (var j = 0; j < real_estate_temp_source.length; j++)
                  if (parseInt(real_estate_temp_source[j].guiId) === parseInt(this.documents["documentList"][i].RelatedEntityId))
                    this.realEstateTableDocuments["documentList"].push(this.documents["documentList"][i]);

                for (var j = 0; j < companies_temp_source.length; j++)
                  if (parseInt(companies_temp_source[j].guiId) === parseInt(this.documents["documentList"][i].RelatedEntityId))
                    this.listOfCompaniesTableDocuments["documentList"].push(this.documents["documentList"][i]);

                for (var j = 0; j < other_investments_temp_source.length; j++)
                  if (parseInt(other_investments_temp_source[j].guiId) === parseInt(this.documents["documentList"][i].RelatedEntityId))
                    this.otherInvestmentsTableDocuments["documentList"].push(this.documents["documentList"][i]);

              }

              else {
                var that = this;
                if (this.preliminaryId && +this.preliminaryId > 1000009464) {
                  if (this.documents["documentList"][i]["RelatedEntityName"] === "CpPreliminaryRequest") {
                    this.documentsTableDocuments["documentList"].push(this.documents["documentList"][i]);
                  }
                } else if ((_.filter(this.type_of_documents_list, function (num) { return num["id"] } === that.documents["documentList"][i]["DocumentDefId"]) &&
                  (!this.documents["documentList"][i]["RelatedEntityName"] || this.documents["documentList"][i]["RelatedEntityName"] === "CpPreliminaryRequest")))
                  this.documentsTableDocuments["documentList"].push(this.documents["documentList"][i]);
              }

            }

          });

        });

      });

    });

    if (this.commentArrayExists)
      this.resolveCommonComments();

    else {

      if (from === 0) {
        this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.PRQRetrieved'));
        this.getPreliminaryRequestInfoSecond("", "", "", "", "bind_prq");
      }
      this.spinnerService.hide();

    }

  }
resolveRejected(requests:any){
  this.source=requests.RequestList?requests.RequestList:[];
  this.rejected=this.source.length>0?1:0;

}
resolveCopy(res:any)
{ 
  if (res.MsgType == "E") {

    this.commonService.showFailureToast(res.MsgText);
    this.spinnerService.hide();
 

  }
  else
  this.router.navigate(['/pages/new-request/preliminary-request/create-prq/create-prq'], {
     queryParams: {rejectedId:"1", requestId: this.customerProfileService.getEncryptedString(String(res.RequestId)),
      status: this.customerProfileService.getEncryptedString(res.StatusCode) } });
}
  resolveCommonComments() {

    try {

      var resolvedCommentArray = [], resolvedCommentArray_1 = [], resolvedCommentArray_2 = [];

      if (this.commentsFrom === "P") {

        resolvedCommentArray_1 = _.where(this.commentArray["RecReqComm"], { SentReqType: "NPRE", CommReqStatus: "O" });
        resolvedCommentArray_1 = resolvedCommentArray_1[0];

        resolvedCommentArray_2 = _.where(this.commentArray["RecReqComm"], { SentReqType: "NPRE", CommReqStatus: "C" });

        if (resolvedCommentArray_2 && resolvedCommentArray_2.length > 0) {

          resolvedCommentArray_2 = resolvedCommentArray_2[0];

          if (resolvedCommentArray_2["RecReqSection"] && resolvedCommentArray_2["RecReqSection"].length > 0)
            for (var i = 0; i < resolvedCommentArray_2["RecReqSection"].length; i++)
              resolvedCommentArray_1["RecReqSection"].push(resolvedCommentArray_2["RecReqSection"][i]);

        }

      }

      else {

        resolvedCommentArray_1 = _.where(this.commentArray["RecReqComm"], { SentReqType: "NPRE", CommReqStatus: "O" });
        resolvedCommentArray_1 = resolvedCommentArray_1[0];

      }

      resolvedCommentArray = resolvedCommentArray_1;

      if (resolvedCommentArray["RecReqSection"])
        for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

          if (resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

            if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRSEC" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRSEC") {

              this.sector_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.sector_details_comments.SectionCode, ReqSubSec: this.sector_details_comments.SubSectionCode });

              this.sector_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.sector_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.sector_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.sector_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.sector_details_comments.commentDetails["DeadLineDate"] = this.sector_details_comments.commentArray[0]["DeadLineDate"];
              this.sector_details_comments.commentDetails["GuiId"] = this.sector_details_comments.commentArray[0]["GuiId"];
              this.sector_details_comments.commentDetails["DefId"] = this.sector_details_comments.commentArray[0]["DefId"];
              this.sector_details_comments.commentDetails["ReqSec"] = this.sector_details_comments.commentArray[0]["ReqSec"];
              this.sector_details_comments.commentDetails["ReqSecDesc"] = this.sector_details_comments.commentArray[0]["ReqSecDesc"];
              this.sector_details_comments.commentDetails["ReqStatus"] = this.sector_details_comments.commentArray[0]["ReqStatus"];
              this.sector_details_comments.commentDetails["ReqStatusDesc"] = this.sector_details_comments.commentArray[0]["ReqStatusDesc"];
              this.sector_details_comments.commentDetails["ReqSubSec"] = this.sector_details_comments.commentArray[0]["ReqSubSec"];
              this.sector_details_comments.commentDetails["ReqSubSecDesc"] = this.sector_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.sector_details_comments.commentDetails["SectionId"] = this.sector_details_comments.commentArray[0]["SectionId"];

              var openComments = this.sector_details_comments.commentArray.find((o) => o.ReqStatus === "O");
 
              if (openComments)
                this.sector_details_comments.anyOpenComments = true;
              else
                this.sector_details_comments.anyOpenComments = false;

              this.sector_details_comments.commentArray = this.sector_details_comments.commentArray[0]["RecReqComment"];

              this.sector_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRLIC" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRLIC") {

              this.license_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.license_details_comments.SectionCode, ReqSubSec: this.license_details_comments.SubSectionCode });

              this.license_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.license_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.license_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.license_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.license_details_comments.commentDetails["DeadLineDate"] = this.license_details_comments.commentArray[0]["DeadLineDate"];
              this.license_details_comments.commentDetails["GuiId"] = this.license_details_comments.commentArray[0]["GuiId"];
              this.license_details_comments.commentDetails["DefId"] = this.license_details_comments.commentArray[0]["DefId"];
              this.license_details_comments.commentDetails["ReqSec"] = this.license_details_comments.commentArray[0]["ReqSec"];
              this.license_details_comments.commentDetails["ReqSecDesc"] = this.license_details_comments.commentArray[0]["ReqSecDesc"];
              this.license_details_comments.commentDetails["ReqStatus"] = this.license_details_comments.commentArray[0]["ReqStatus"];
              this.license_details_comments.commentDetails["ReqStatusDesc"] = this.license_details_comments.commentArray[0]["ReqStatusDesc"];
              this.license_details_comments.commentDetails["ReqSubSec"] = this.license_details_comments.commentArray[0]["ReqSubSec"];
              this.license_details_comments.commentDetails["ReqSubSecDesc"] = this.license_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.license_details_comments.commentDetails["SectionId"] = this.license_details_comments.commentArray[0]["SectionId"];

              var openComments = this.license_details_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.license_details_comments.anyOpenComments = true;
              else
                this.license_details_comments.anyOpenComments = false;

              this.license_details_comments.commentArray = this.license_details_comments.commentArray[0]["RecReqComment"];

              this.license_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRCMD" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRCMD") {

              this.company_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.license_details_comments.SectionCode, ReqSubSec: this.license_details_comments.SubSectionCode });

              this.company_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.company_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.company_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.company_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.company_details_comments.commentDetails["DeadLineDate"] = this.company_details_comments.commentArray[0]["DeadLineDate"];
              this.company_details_comments.commentDetails["GuiId"] = this.company_details_comments.commentArray[0]["GuiId"];
              this.company_details_comments.commentDetails["DefId"] = this.company_details_comments.commentArray[0]["DefId"];
              this.company_details_comments.commentDetails["ReqSec"] = this.company_details_comments.commentArray[0]["ReqSec"];
              this.company_details_comments.commentDetails["ReqSecDesc"] = this.company_details_comments.commentArray[0]["ReqSecDesc"];
              this.company_details_comments.commentDetails["ReqStatus"] = this.company_details_comments.commentArray[0]["ReqStatus"];
              this.company_details_comments.commentDetails["ReqStatusDesc"] = this.company_details_comments.commentArray[0]["ReqStatusDesc"];
              this.company_details_comments.commentDetails["ReqSubSec"] = this.company_details_comments.commentArray[0]["ReqSubSec"];
              this.company_details_comments.commentDetails["ReqSubSecDesc"] = this.company_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.company_details_comments.commentDetails["SectionId"] = this.company_details_comments.commentArray[0]["SectionId"];

              var openComments = this.company_details_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.company_details_comments.anyOpenComments = true;
              else
                this.company_details_comments.anyOpenComments = false;

              this.company_details_comments.commentArray = this.company_details_comments.commentArray[0]["RecReqComment"];

              this.company_details_comments.hasComments = true;

            }


            else if (resolvedCommentArray["RecReqSection"][i].ReqSec == "PRPRO" && resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PRPRO") {

              this.product_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.product_details_comments.SectionCode, ReqSubSec: this.product_details_comments.SubSectionCode });

              this.product_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.product_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.product_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.product_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.product_details_comments.commentDetails["DeadLineDate"] = this.product_details_comments.commentArray[0]["DeadLineDate"];
              this.product_details_comments.commentDetails["GuiId"] = this.product_details_comments.commentArray[0]["GuiId"];
              this.product_details_comments.commentDetails["DefId"] = this.product_details_comments.commentArray[0]["DefId"];
              this.product_details_comments.commentDetails["ReqSec"] = this.product_details_comments.commentArray[0]["ReqSec"];
              this.product_details_comments.commentDetails["ReqSecDesc"] = this.product_details_comments.commentArray[0]["ReqSecDesc"];
              this.product_details_comments.commentDetails["ReqStatus"] = this.product_details_comments.commentArray[0]["ReqStatus"];
              this.product_details_comments.commentDetails["ReqStatusDesc"] = this.product_details_comments.commentArray[0]["ReqStatusDesc"];
              this.product_details_comments.commentDetails["ReqSubSec"] = this.product_details_comments.commentArray[0]["ReqSubSec"];
              this.product_details_comments.commentDetails["ReqSubSecDesc"] = this.product_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.product_details_comments.commentDetails["SectionId"] = this.product_details_comments.commentArray[0]["SectionId"];

              var openComments = this.product_details_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.product_details_comments.anyOpenComments = true;
              else
                this.product_details_comments.anyOpenComments = false;

              this.product_details_comments.commentArray = this.product_details_comments.commentArray[0]["RecReqComment"];

              this.product_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec == "PROWN" && resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PROWN") {

              this.ownership_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.ownership_details_comments.SectionCode, ReqSubSec: this.ownership_details_comments.SubSectionCode });

              this.ownership_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.ownership_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.ownership_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.ownership_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.ownership_details_comments.commentDetails["DeadLineDate"] = this.ownership_details_comments.commentArray[0]["DeadLineDate"];
              this.ownership_details_comments.commentDetails["GuiId"] = this.ownership_details_comments.commentArray[0]["GuiId"];
              this.ownership_details_comments.commentDetails["DefId"] = this.ownership_details_comments.commentArray[0]["DefId"];
              this.ownership_details_comments.commentDetails["ReqSec"] = this.ownership_details_comments.commentArray[0]["ReqSec"];
              this.ownership_details_comments.commentDetails["ReqSecDesc"] = this.ownership_details_comments.commentArray[0]["ReqSecDesc"];
              this.ownership_details_comments.commentDetails["ReqStatus"] = this.ownership_details_comments.commentArray[0]["ReqStatus"];
              this.ownership_details_comments.commentDetails["ReqStatusDesc"] = this.ownership_details_comments.commentArray[0]["ReqStatusDesc"];
              this.ownership_details_comments.commentDetails["ReqSubSec"] = this.ownership_details_comments.commentArray[0]["ReqSubSec"];
              this.ownership_details_comments.commentDetails["ReqSubSecDesc"] = this.ownership_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.ownership_details_comments.commentDetails["SectionId"] = this.ownership_details_comments.commentArray[0]["SectionId"];

              var openComments = this.ownership_details_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.ownership_details_comments.anyOpenComments = true;
              else
                this.ownership_details_comments.anyOpenComments = false;

              this.ownership_details_comments.commentArray = this.ownership_details_comments.commentArray[0]["RecReqComment"];

              this.ownership_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRPER" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRPER") {

              this.authorized_person_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.authorized_person_details_comments.SectionCode, ReqSubSec: this.authorized_person_details_comments.SubSectionCode });

              this.authorized_person_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.authorized_person_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.authorized_person_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.authorized_person_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.authorized_person_details_comments.commentDetails["DeadLineDate"] = this.authorized_person_details_comments.commentArray[0]["DeadLineDate"];
              this.authorized_person_details_comments.commentDetails["GuiId"] = this.authorized_person_details_comments.commentArray[0]["GuiId"];
              this.authorized_person_details_comments.commentDetails["DefId"] = this.authorized_person_details_comments.commentArray[0]["DefId"];
              this.authorized_person_details_comments.commentDetails["ReqSec"] = this.authorized_person_details_comments.commentArray[0]["ReqSec"];
              this.authorized_person_details_comments.commentDetails["ReqSecDesc"] = this.authorized_person_details_comments.commentArray[0]["ReqSecDesc"];
              this.authorized_person_details_comments.commentDetails["ReqStatus"] = this.authorized_person_details_comments.commentArray[0]["ReqStatus"];
              this.authorized_person_details_comments.commentDetails["ReqStatusDesc"] = this.authorized_person_details_comments.commentArray[0]["ReqStatusDesc"];
              this.authorized_person_details_comments.commentDetails["ReqSubSec"] = this.authorized_person_details_comments.commentArray[0]["ReqSubSec"];
              this.authorized_person_details_comments.commentDetails["ReqSubSecDesc"] = this.authorized_person_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.authorized_person_details_comments.commentDetails["SectionId"] = this.authorized_person_details_comments.commentArray[0]["SectionId"];

              var openComments = this.authorized_person_details_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.authorized_person_details_comments.anyOpenComments = true;
              else
                this.authorized_person_details_comments.anyOpenComments = false;

              this.authorized_person_details_comments.commentArray = this.authorized_person_details_comments.commentArray[0]["RecReqComment"];

              this.authorized_person_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRBAN" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRBAN") {

              this.bank_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.bank_details_comments.SectionCode, ReqSubSec: this.bank_details_comments.SubSectionCode });

              this.bank_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.bank_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.bank_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.bank_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.bank_details_comments.commentDetails["DeadLineDate"] = this.bank_details_comments.commentArray[0]["DeadLineDate"];
              this.bank_details_comments.commentDetails["GuiId"] = this.bank_details_comments.commentArray[0]["GuiId"];
              this.bank_details_comments.commentDetails["DefId"] = this.bank_details_comments.commentArray[0]["DefId"];
              this.bank_details_comments.commentDetails["ReqSec"] = this.bank_details_comments.commentArray[0]["ReqSec"];
              this.bank_details_comments.commentDetails["ReqSecDesc"] = this.bank_details_comments.commentArray[0]["ReqSecDesc"];
              this.bank_details_comments.commentDetails["ReqStatus"] = this.bank_details_comments.commentArray[0]["ReqStatus"];
              this.bank_details_comments.commentDetails["ReqStatusDesc"] = this.bank_details_comments.commentArray[0]["ReqStatusDesc"];
              this.bank_details_comments.commentDetails["ReqSubSec"] = this.bank_details_comments.commentArray[0]["ReqSubSec"];
              this.bank_details_comments.commentDetails["ReqSubSecDesc"] = this.bank_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.bank_details_comments.commentDetails["SectionId"] = this.bank_details_comments.commentArray[0]["SectionId"];

              var openComments = this.bank_details_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.bank_details_comments.anyOpenComments = true;
              else
                this.bank_details_comments.anyOpenComments = false;

              this.bank_details_comments.commentArray = this.bank_details_comments.commentArray[0]["RecReqComment"];

              this.bank_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRREL" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRREL") {

              this.real_estates_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.real_estates_comments.SectionCode, ReqSubSec: this.real_estates_comments.SubSectionCode });

              this.real_estates_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.real_estates_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.real_estates_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.real_estates_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.real_estates_comments.commentDetails["DeadLineDate"] = this.real_estates_comments.commentArray[0]["DeadLineDate"];
              this.real_estates_comments.commentDetails["GuiId"] = this.real_estates_comments.commentArray[0]["GuiId"];
              this.real_estates_comments.commentDetails["DefId"] = this.real_estates_comments.commentArray[0]["DefId"];
              this.real_estates_comments.commentDetails["ReqSec"] = this.real_estates_comments.commentArray[0]["ReqSec"];
              this.real_estates_comments.commentDetails["ReqSecDesc"] = this.real_estates_comments.commentArray[0]["ReqSecDesc"];
              this.real_estates_comments.commentDetails["ReqStatus"] = this.real_estates_comments.commentArray[0]["ReqStatus"];
              this.real_estates_comments.commentDetails["ReqStatusDesc"] = this.real_estates_comments.commentArray[0]["ReqStatusDesc"];
              this.real_estates_comments.commentDetails["ReqSubSec"] = this.real_estates_comments.commentArray[0]["ReqSubSec"];
              this.real_estates_comments.commentDetails["ReqSubSecDesc"] = this.real_estates_comments.commentArray[0]["ReqSubSecDesc"];
              this.real_estates_comments.commentDetails["SectionId"] = this.real_estates_comments.commentArray[0]["SectionId"];

              var openComments = this.real_estates_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.real_estates_comments.anyOpenComments = true;
              else
                this.real_estates_comments.anyOpenComments = false;

              this.real_estates_comments.commentArray = this.real_estates_comments.commentArray[0]["RecReqComment"];

              this.real_estates_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRCOM" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRCOM") {

              this.list_of_companies_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.list_of_companies_comments.SectionCode, ReqSubSec: this.list_of_companies_comments.SubSectionCode });

              this.list_of_companies_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.list_of_companies_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.list_of_companies_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.list_of_companies_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.list_of_companies_comments.commentDetails["DeadLineDate"] = this.list_of_companies_comments.commentArray[0]["DeadLineDate"];
              this.list_of_companies_comments.commentDetails["GuiId"] = this.list_of_companies_comments.commentArray[0]["GuiId"];
              this.list_of_companies_comments.commentDetails["DefId"] = this.list_of_companies_comments.commentArray[0]["DefId"];
              this.list_of_companies_comments.commentDetails["ReqSec"] = this.list_of_companies_comments.commentArray[0]["ReqSec"];
              this.list_of_companies_comments.commentDetails["ReqSecDesc"] = this.list_of_companies_comments.commentArray[0]["ReqSecDesc"];
              this.list_of_companies_comments.commentDetails["ReqStatus"] = this.list_of_companies_comments.commentArray[0]["ReqStatus"];
              this.list_of_companies_comments.commentDetails["ReqStatusDesc"] = this.list_of_companies_comments.commentArray[0]["ReqStatusDesc"];
              this.list_of_companies_comments.commentDetails["ReqSubSec"] = this.list_of_companies_comments.commentArray[0]["ReqSubSec"];
              this.list_of_companies_comments.commentDetails["ReqSubSecDesc"] = this.list_of_companies_comments.commentArray[0]["ReqSubSecDesc"];
              this.list_of_companies_comments.commentDetails["SectionId"] = this.list_of_companies_comments.commentArray[0]["SectionId"];

              var openComments = this.list_of_companies_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.list_of_companies_comments.anyOpenComments = true;
              else
                this.list_of_companies_comments.anyOpenComments = false;

              this.list_of_companies_comments.commentArray = this.list_of_companies_comments.commentArray[0]["RecReqComment"];

              this.list_of_companies_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRINV" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRINV") {

              this.other_investments_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.other_investments_comments.SectionCode, ReqSubSec: this.other_investments_comments.SubSectionCode });

              this.other_investments_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.other_investments_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.other_investments_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.other_investments_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.other_investments_comments.commentDetails["DeadLineDate"] = this.other_investments_comments.commentArray[0]["DeadLineDate"];
              this.other_investments_comments.commentDetails["GuiId"] = this.other_investments_comments.commentArray[0]["GuiId"];
              this.other_investments_comments.commentDetails["DefId"] = this.other_investments_comments.commentArray[0]["DefId"];
              this.other_investments_comments.commentDetails["ReqSec"] = this.other_investments_comments.commentArray[0]["ReqSec"];
              this.other_investments_comments.commentDetails["ReqSecDesc"] = this.other_investments_comments.commentArray[0]["ReqSecDesc"];
              this.other_investments_comments.commentDetails["ReqStatus"] = this.other_investments_comments.commentArray[0]["ReqStatus"];
              this.other_investments_comments.commentDetails["ReqStatusDesc"] = this.other_investments_comments.commentArray[0]["ReqStatusDesc"];
              this.other_investments_comments.commentDetails["ReqSubSec"] = this.other_investments_comments.commentArray[0]["ReqSubSec"];
              this.other_investments_comments.commentDetails["ReqSubSecDesc"] = this.other_investments_comments.commentArray[0]["ReqSubSecDesc"];
              this.other_investments_comments.commentDetails["SectionId"] = this.other_investments_comments.commentArray[0]["SectionId"];

              var openComments = this.other_investments_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.other_investments_comments.anyOpenComments = true;
              else
                this.other_investments_comments.anyOpenComments = false;

              this.other_investments_comments.commentArray = this.other_investments_comments.commentArray[0]["RecReqComment"];

              this.other_investments_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSec === "PRDOC" && resolvedCommentArray["RecReqSection"][i].ReqSubSec === "PRDOC") {

              this.documents_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.documents_comments.SectionCode, ReqSubSec: this.documents_comments.SubSectionCode });

              this.documents_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.documents_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.documents_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.documents_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.documents_comments.commentDetails["DeadLineDate"] = this.documents_comments.commentArray[0]["DeadLineDate"];
              this.documents_comments.commentDetails["GuiId"] = this.documents_comments.commentArray[0]["GuiId"];
              this.documents_comments.commentDetails["DefId"] = this.documents_comments.commentArray[0]["DefId"];
              this.documents_comments.commentDetails["ReqSec"] = this.documents_comments.commentArray[0]["ReqSec"];
              this.documents_comments.commentDetails["ReqSecDesc"] = this.documents_comments.commentArray[0]["ReqSecDesc"];
              this.documents_comments.commentDetails["ReqStatus"] = this.documents_comments.commentArray[0]["ReqStatus"];
              this.documents_comments.commentDetails["ReqStatusDesc"] = this.documents_comments.commentArray[0]["ReqStatusDesc"];
              this.documents_comments.commentDetails["ReqSubSec"] = this.documents_comments.commentArray[0]["ReqSubSec"];
              this.documents_comments.commentDetails["ReqSubSecDesc"] = this.documents_comments.commentArray[0]["ReqSubSecDesc"];
              this.documents_comments.commentDetails["SectionId"] = this.documents_comments.commentArray[0]["SectionId"];

              var openComments = this.documents_comments.commentArray.find((o) => o.ReqStatus === "O");

              if (openComments)
                this.documents_comments.anyOpenComments = true;
              else
                this.documents_comments.anyOpenComments = false;

              this.documents_comments.commentArray = this.documents_comments.commentArray[0]["RecReqComment"];

              this.documents_comments.hasComments = true;

            }

          }

        }

        this.getPreliminaryRequestInfoSecond("", "", "", "", "bind_prq");
      this.commonService.showSuccessToast(this.translate.instant('PRELIMINARY_REQUEST.PRQInfoRetrieved'));
      this.spinnerService.hide();

    }

    catch (err) {
      this.resolveError();
    }

  }

  onPurposeChange() {

    this.type_vs = false;
    this.startedFilling = 1;

    if (this.inputs.TypeSelected == "OTH")
      this.isPurposeOthers = true;

    else
      this.isPurposeOthers = false;

  }
  onProfileTypeChange() { 
    this.rejected=0;
    this.profile_type_vs = false;
    this.ProfileTypeID=this.inputs.ProfileType;
    this.startedFilling = 1; 
    var resProfileType = this.inputs.ProfileTypeList.find((o) => o.id === this.inputs.ProfileType);
    if (resProfileType)
      this.inputs.ProfileTypeSelected = resProfileType.prqTypeEn;
    this.serviceId = this.services.find(x => x.CRM_code == this.inputs.ProfileType).LL_code;
    console.log("this.serviceId: " + this.serviceId);
    this.isLogisticsType = (this.inputs.ProfileType == "51" ||this.inputs.ProfileType == "52" || this.inputs.ProfileType == "53" ||  this.inputs.ProfileType == "54" ||this.inputs.ProfileType == "0000000051" ||this.inputs.ProfileType == "0000000052"  ||this.inputs.ProfileType == "0000000053"  ||this.inputs.ProfileType == "0000000054") ? true : false;
 this.isLLFL=(this.inputs.ProfileType =="24"||this.inputs.ProfileType =="25");
    //this.inputs.TypeOfLicense = this.isHousingLogin ? "Initial,Final,CR Number".split(",") : this.isSagiaOrCr && !this.isLogisticsType ? "Initial,Final,Sagia License".split(",") : this.isSagiaOrCr && this.isLogisticsType ? "Initial,Final,Sagia License,CR Number".split(",") : this.isLogisticsType ? "Initial,Final,CR Number".split(",") : this.inputs.TypeOfLicenseOriginal;
    this.inputs.TypeOfLicense =this.isLLFL ? (this.initialLicense + "," +
    this.finalLicense + "," + this.meimInitialLicense +
    "," + this.crNumberLicense).split(","): (this.initialLicense + "," +
    this.finalLicense + "," + this.meimInitialLicense+"," + this.crNumberLicense ).split(",");
    this.inputs.TypeOfLicense =this.isLogisticsType? ( this.crNumberLicense).split(","): (this.initialLicense + "," +
    this.finalLicense + "," + this.meimInitialLicense+"," + this.crNumberLicense ).split(",");
    
    this.inputs.TypeOfLicenseChecked=this.isLogisticsType?this.crNumberLicense:this.initialLicense;
   /* this.inputs.TypeOfLicense = this.isHousingLogin ? (this.initialLicense + "," +
      this.finalLicense + "," + this.meimInitialLicense +
      "," + this.crNumberLicense).split(",") : this.isSagiaOrCr && !this.isLogisticsType ?
        (this.initialLicense + "," + this.finalLicense + "," +
          this.meimInitialLicense + "," + this.sagiaLicense)
          .split(",") : this.isSagiaOrCr && this.isLogisticsType ? (this.initialLicense + "," +
            this.finalLicense + "," + this.meimInitialLicense +
            "," + this.sagiaLicense )
            .split(",") : this.isLogisticsType ? (this.initialLicense + "," + this.finalLicense + "," +
              this.meimInitialLicense + "," + this.crNumberLicense)
              .split(",") : this.inputs.TypeOfLicenseOriginal;*/

    this.typeHasBeenSelected = true;

  }

  onLegalEntityChange(language) {

    this.legal_entity_vs = false;

    this.startedFilling = 1;

    switch (language) {

      case 'en':

        var legalEntity = this.legal_entity_list.find((o) => o.legalEntityEn === this.inputs.licenseDetails[0].crLeagalTypeEn);
        if (legalEntity)
          this.inputs.licenseDetails[0].crLeagalTypeAr = legalEntity.legalEntityAr;

        break;

      case 'ar':

        var legalEntity = this.legal_entity_list.find((o) => o.legalEntityAr === this.inputs.licenseDetails[0].crLeagalTypeAr);
        if (legalEntity)
          this.inputs.licenseDetails[0].crLeagalTypeEn = legalEntity.legalEntityEn;

        break;

      default:
        break;

    }

  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;

  }

  parseTextToInt(field) {
    
    this.startedFilling = 1;

    var string_array = [];

    switch (field) {

      case "proCapital":

        this.inputs.licenseDetails[0].proCapital = this.inputs.licenseDetails[0].proCapital.replace(/,/g, "");

        string_array = this.inputs.licenseDetails[0].proCapital.split(" ");

        if (string_array[1])
          this.inputs.licenseDetails[0].proCapital = string_array[1];

        break;

      case "reqAmount":

        this.inputs.licenseDetails[0].reqAmount = this.inputs.licenseDetails[0].reqAmount.replace(/,/g, "");

        string_array = this.inputs.licenseDetails[0].reqAmount.split(" ");

        if (string_array[1])
          this.inputs.licenseDetails[0].reqAmount = string_array[1];

        break;

      default:
        break;

    }

  }

  setPanelStep(index: number) {
    this.panelStep = index;
  }  

  nextPanelStep(panel_number) {
    console.log("next click");
     if (panel_number === 1 && this.add_edit_delete_show) {
      if (this.sectorDetailsValidationNextPanel()) {
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterMandatoryGeneral'));
      } else {
        this.panelStep++;
      }

    } else if (panel_number === 2 && this.add_edit_delete_show) {
      if (this.licenseDetailsValidationNextPanel())
        this.panelStep++;
      else
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterMandatoryGeneral'));
    } else if (panel_number === 8 && this.non_saudi_owners_list.length <= 0) {
      this.panelStep += 2;
    } else if (panel_number === 3 && this.add_edit_delete_show) {
      this.save_submit(1);
      this.panelStep++;
    }
    // }else if(panel_number === 4 || panel_number === 5 || panel_number === 9){
    //   this.save_submit(1);
    //   this.panelStep++;
    // } 
      else {
      this.panelStep++;
    }
  }
    sectorDetailsValidationNextPanel() {
    var flag = 0;
    if (this.inputs.RegionSelected === "" || this.inputs.RegionSelected === null) { this.region_vs = true; flag += 1; }
    else
      this.region_vs = false;

    if (this.inputs.IndustrialSectorSelected[0].name === "" || this.inputs.IndustrialSectorSelected[0].name === null) {
       this.industrial_sector_vs = true; flag += 1; }

    else
      this.industrial_sector_vs = false;

    if (this.inputs.TypeSelected === "" || this.inputs.TypeSelected === null) { this.type_vs = true; flag += 1; }

    else
      this.type_vs = false;

    if (this.isPurposeOthers && (this.inputs.OtherPurpose === "" || this.inputs.OtherPurpose === null)) { this.other_purpose_vs = true; flag += 1; }

    else
      this.other_purpose_vs = false;

    return flag === 0 ? false : true;
  }
  licenseDetailsValidationNextPanel() {
    var flag = 0;
    if (this.inputs.licenseDetails[0].factoryName === "" || this.inputs.licenseDetails[0].factoryName === null) {
      this.factory_name_vs = true;
      flag += 1;
    }

    else
      this.factory_name_vs = false;

    if (!this.isSagiaOrCr && (this.inputs.licenseDetails[0].factoryNameAr === "" || this.inputs.licenseDetails[0].factoryNameAr === null)) {
      this.factory_name_ar_vs = true;
      flag += 1;
  }
    else
      this.factory_name_ar_vs = false;

    // else if(this.inputs.licenseDetails[0].proCapital === "" || this.inputs.licenseDetails[0].proCapital === null)
    //   this.commonService.showFailureToast("Enter the Capital !");
    //111
    if (!this.isSagiaOrCr && (this.inputs.licenseDetails[0].reqAmount === "" || this.inputs.licenseDetails[0].reqAmount === null || parseFloat(this.inputs.licenseDetails[0].reqAmount) === 0)) { this.request_amount_vs = true; flag += 1; }

    else
      this.request_amount_vs = false;

    // if (this.inputs.licenseDetails[0].crNameAr === "" || this.inputs.licenseDetails[0].crNameAr === null)
    //  { this.cr_name_arabic_vs = true;
    //   flag+=1;}

    // else
    //   this.cr_name_arabic_vs = false;

    // if (this.inputs.licenseDetails[0].crName === "" || this.inputs.licenseDetails[0].crName === null)
    //   {this.cr_name_vs = true;
    //     flag+=1;}

    // else
    //   this.cr_name_vs = false;

    // if (this.inputs.licenseDetails[0].crNumber === "" || this.inputs.licenseDetails[0].crNumber === null)
    //   {this.cr_number_2_vs = true;flag+=1;}

    // else
    //   this.cr_number_2_vs = false;

    // if (this.inputs.licenseDetails[0].crLocationAr === "" || this.inputs.licenseDetails[0].crLocationAr === null)
    //  { this.cr_issue_place_vs = true;flag+=1;}

    // else
    //   this.cr_issue_place_vs = false;

    // if (!this.dateRegex.test(this.commonService.returnDateStringFromDateArray(this.inputs.licenseDetails[0].crIssueDate)))
    //   {this.cr_issue_date_vs = true;flag+=1;}

    // else
    //   this.cr_issue_date_vs = false;

    // if (!this.dateRegex.test(this.commonService.returnDateStringFromDateArray(this.inputs.licenseDetails[0].crExpiryDate)))
    //   {this.cr_expiry_date_1_vs = true;flag+=1;}

    // else
    //   this.cr_expiry_date_1_vs = false;

    // if (this.inputs.licenseDetails[0].crPhone === "" || this.inputs.licenseDetails[0].crPhone === null)
    //  { this.cr_phone_vs = true;flag+=1;}

    // else
    //   this.cr_phone_vs = false;

    // else if (this.inputs.licenseDetails[0].crFaxNo === "" || this.inputs.licenseDetails[0].crFaxNo === null)
    //   this.commonService.showFailureToast("Enter the Company Fax Number !");

    // if (this.inputs.licenseDetails[0].crAddress === "" || this.inputs.licenseDetails[0].crAddress === null)
    //  { this.cr_address_vs = true;flag+=1;}

    // else
    //   this.cr_address_vs = false;

    // if (this.inputs.licenseDetails[0].crZipCode === "" || this.inputs.licenseDetails[0].crZipCode === null)
    //   {this.cr_zip_code_vs = true;flag+=1;}

    // else
    //   this.cr_zip_code_vs = false;

    // else if (this.inputs.licenseDetails[0].crDistrictArea === "" || this.inputs.licenseDetails[0].crDistrictArea === null)
    //   this.commonService.showFailureToast("Enter the Company District Area !");

    // if (this.inputs.licenseDetails[0].crUnitNo === "" || this.inputs.licenseDetails[0].crUnitNo === null)
    //  { this.cr_unit_no_vs = true;flag+=1;}

    // else
    //   this.cr_unit_no_vs = false;

    // if (this.inputs.licenseDetails[0].crBuildingNo === "" || this.inputs.licenseDetails[0].crBuildingNo === null)
    //   {this.cr_building_no_vs = true;flag+=1;}

    // else
    //   this.cr_building_no_vs = false;

    // if (this.inputs.licenseDetails[0].crAdditionalNo === "" || this.inputs.licenseDetails[0].crAdditionalNo === null)
    //  { this.cr_additional_no_vs = true;flag+=1;}

    // else
    //   this.cr_additional_no_vs = false;
    //111
    if (this.inputs.licenseDetails[0].crLegalInd === '' &&
      ((this.commonService.defaultLanguage === "en" && (this.inputs.licenseDetails[0].crLeagalTypeEn === "" || this.inputs.licenseDetails[0].crLeagalTypeEn === null)) ||
        (this.commonService.defaultLanguage === "ar" && (this.inputs.licenseDetails[0].crLeagalTypeAr === "" || this.inputs.licenseDetails[0].crLeagalTypeAr === null))))
      this.legal_entity_vs = true;

    else
      this.legal_entity_vs = false;

    if (!this.isSagiaOrCr && (this.inputs.licenseDetails[0].city === "" || this.inputs.licenseDetails[0].city === null)) { this.city_vs = true; flag += 1; }

    else
      this.city_vs = false;

    return flag === 0 ? true : false;
  }
      
  prevPanelStep(panel_number) {

    if (panel_number === 10 && this.non_saudi_owners_list.length <= 0)
      this.panelStep -= 2;

    else
      this.panelStep--;

  }

  expandAllPanels(mode) {

    this.panelStep = 0;

    if (mode === 0)
      this.allPanelsExpanded = true;

    else if (mode === 1)
      this.allPanelsExpanded = false;

  }

  startTour() {

    this.allPanelsExpanded = true;

    if (this.commonService.defaultLanguage === 'en') {

      if (this.screen_number === 1)
        this.tour_en.setOption('steps', [
           {
            element: '#tourStep1-s1',
            intro: "Select the Profile"
          },
          {
            element: '#tourStep2-s1',
            intro: "Select the Type of License"
          },
          {
            element: '#tourStep3-s1',
            intro: "Enter the License ID and License Start Date"
          },
          {
            element: '#tourStep4-s1',
            intro: "Go Back"
          },
          {
            element: '#tourStep5-s1',
            intro: "Retrieve the information corresponding to the above license details from MCI service"
          }
        ]);

      else if (this.screen_number === 2)
        this.tour_en.setOption('steps', [
          {
            element: '#tourStep1-s2',
            intro: "Enter the Sector Details"
          },
          {
            element: '#tourStep2-s2',
            intro: "Enter the License Details"
          },
          {
            element: '#tourStep3-s2',
            intro: "Enter the Basic Company Details"
          },
          {
            element: '#tourStep4-s2',
            intro: "Enter the Product Details"
          },
          {
            element: '#tourStep5-s2',
            intro: "Enter the Ownership Details"
          },
          {
            element: '#tourStep6-s2',
            intro: "Enter the Real Estate Details"
          },
          {
            element: '#tourStep7-s2',
            intro: "Enter the Company Details"
          },
          {
            element: '#tourStep8-s2',
            intro: "Enter the Other Investment Details"
          },
          {
            element: '#tourStep9-s2',
            intro: "Enter the Bank Details"
          },
          {
            element: '#tourStep10-s2',
            intro: "Enter the Authorized Person Details"
          },
          {
            element: '#tourStep11-s2',
            intro: "Upload the Documents"
          },
          {
            element: '#tourStep12-s2',
            intro: "Go Back"
          },
          {
            element: '#tourStep13-s2',
            intro: "Save the details"
          },
          {
            element: '#tourStep14-s2',
            intro: "Submit the details"
          }
        ]);

      this.tour_en.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

    else if (this.commonService.defaultLanguage === 'ar') {

      if (this.screen_number === 1)
        this.tour_ar.setOption('steps', [
          {
            element: '#tourStep1-s1',
            intro: "حدد ملف التعريف"
          },
          {
            element: '#tourStep2-s1',
            intro: "حدد نوع الترخيص"
          },
          {
            element: '#tourStep3-s1',
            intro: "أدخل معرف الترخيص وتاريخ بدء الترخيص"
          },
          {
            element: '#tourStep4-s1',
            intro: "عد"
          },
          {
            element: '#tourStep5-s1',
            intro: "استرجع المعلومات المطابقة لتفاصيل الترخيص أعلاه من خدمة MCI"
          }
        ]);

      else if (this.screen_number === 2)
        this.tour_ar.setOption('steps', [
          {
            element: '#tourStep1-s2',
            intro: "أدخل تفاصيل القطاع"
          },
          {
            element: '#tourStep2-s2',
            intro: "أدخل تفاصيل الترخيص"
          },
          {
            element: '#tourStep3-s2',
            intro: "أدخل تفاصيل الشركة الأساسية"
          },
          {
            element: '#tourStep4-s2',
            intro: "أدخل تفاصيل المنتج"
          },
          {
            element: '#tourStep5-s2',
            intro: "أدخل تفاصيل الملكية"
          },
          {
            element: '#tourStep6-s2',
            intro: "أدخل التفاصيل العقارية"
          },
          {
            element: '#tourStep7-s2',
            intro: "أدخل تفاصيل الشركة"
          },
          {
            element: '#tourStep8-s2',
            intro: "أدخل تفاصيل الاستثمار الأخرى"
          },
          {
            element: '#tourStep9-s2',
            intro: "أدخل تفاصيل البنك"
          },
          {
            element: '#tourStep10-s2',
            intro: "أدخل تفاصيل الشخص المفوض"
          },
          {
            element: '#tourStep11-s2',
            intro: "تحميل الوثائق"
          },
          {
            element: '#tourStep12-s2',
            intro: "عد"
          },
          {
            element: '#tourStep13-s2',
            intro: "حفظ التفاصيل"
          },
          {
            element: '#tourStep14-s2',
            intro: "تقديم التفاصيل"
          }
        ]);

      this.tour_ar.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

  }
  CheckRejected(id:any){
    this.rejected=id==1?2:3;
  }
  handleOnExitTour() {

    window.location.hash = "#" + (this.screen_number === 1 ? "startTour-s1" : "startTour-s2");
    this.allPanelsExpanded = false;
    this.panelStep = 1;

  }

}