import { Component, OnInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { ProjectOwnershipModalsComponent } from './project-ownership-modals/project-ownership-modals.component';
import { ProjInfoService } from '../../../../services/project-information.service';
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from '../../../../services/communications.service'
import { _ } from 'underscore';
import * as _l from 'lodash'; 
import { LocalStorage } from '@ngx-pwa/local-storage';

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
  selector: 'project-information',
  templateUrl: './project-information.component.html',
  styleUrls: ['./project-information.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class LoanApplicationProjectInformationComponent implements OnInit {

  tour_en: any;

  tour_ar: any;
  serviceId = 9;
  loanTypeValues = {
    loanType: "",
    selectedLoanType: {},
    selectedLoanTypeOperation: "",
    loanTypeList: [
      {
        "id": "0000000022",
        "prqTypeEn": "Housing Loan",
        "operation": "show_only",
        "sections": [1, 2]
      },
      {
        "id": "0000000027",
        "prqTypeEn": "Multipurpose",
        "operation": "show_only",
        "sections": [1, 2]
      },
      {
        "id": "0000000029",
        "prqTypeEn": "NCPP",
        "operation": "show_only",
        "sections": [1, 2]
      },
      {
        "id": "0000000033",
        "prqTypeEn": "EXIM (Export-Import)",
        "operation": "show_only",
        "sections": [1, 2]
      },
      {
        "id": "0000000031",
        "prqTypeEn": "EE",
        "operation": "hide_mkt"
      },
      {
        "id": "0000000032",
        "prqTypeEn": "IDT",
        "operation": "hide_mkt"
      },
      {
        "id": "0000000001",
        "prqTypeEn": "Corporate Financing",
        "operation": "no_change"
      },
      {
        "id": "0000000021",
        "prqTypeEn": "Agriculture Loan",
        "operation": "no_change"
      },
      {
        "id": "0000000023",
        "prqTypeEn": "Industrial Loan",
        "operation": "no_change"
      },
      {
        "id": "0000000024",
        "prqTypeEn": "Land Loan (Modon, RCJ, RCY,Spark)",
        "operation": "no_change"
      },
      {
        "id": "0000000025",
        "prqTypeEn": "Factory Loan",
        "operation": "no_change"
      },
      {
        "id": "0000000026",
        "prqTypeEn": "Working Capital",
        "operation": "no_change"
      },
      {
        "id": "0000000028",
        "prqTypeEn": "Nusaned – SABIC",
        "operation": "no_change"
      },
      {
        "id": "0000000030",
        "prqTypeEn": "NIDLP - Logistics",
        "operation": "no_change"
      },
      {
        "id": "0000000034",
        "prqTypeEn": "SME",
        "operation": "no_change"
      }
    ]
  };

  legalEntitySelectShow = false;

  commentsFrom = "";
  commentArray = {};
  commentArrayExists = false;

  general_information_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIGEN", commentDetails: {}, commentArray: [] };
  project_profile_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIPRO", commentDetails: {}, commentArray: [] };
  project_ownership_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIOWN", commentDetails: {}, commentArray: [] };
  guarantors_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIGUA", commentDetails: {}, commentArray: [] };
  real_estates_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIRES", commentDetails: {}, commentArray: [] };
  list_of_companies_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PICOM", commentDetails: {}, commentArray: [] };
  other_investments_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIINV", commentDetails: {}, commentArray: [] };
  bank_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIBNK", commentDetails: {}, commentArray: [] };
  kpmr_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIKEY", commentDetails: {}, commentArray: [] };

  project_name_vs = false;
  legal_entity_vs = false;
  telephone_number_vs = false;
  fax_no_vs = false;
  email_id_vs = false;
  type_vs = false;
  exp_pro_compl_date_vs = false;
  GenInfoProjCompStatus_vs = false;
  est_comm_startup_date_vs = false;
  il_date123_vs = false;
  il_date124_vs = false;

  ProjectProfile_vs = false;
  projectDescriptionDocuments_vs = false;

  @ViewChild('projectDescriptionDocuments') projectDescriptionDocuments: ElementRef;

  documents = {};
  prqDocuments = {};

  translate: any;

  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  ChecklistPer = 0;

  add_edit_delete_show = true;

  comments_show = false;

  settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Ownership Details Found",

    // mode: "external",

    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    // },

    actions: {
      position: "right",
      add: false,
      edit: false,
      delete: false,
      columnTitle: "Actions"
    },

    columns: {
      Name: {
        title: "Owner / Shareholder Name",
        type: "text",

      },
      Type: {
        title: "Type",
        type: "text"

      },
      Nationality: {
        title: "Nationality",
        type: "text"

      },
      Percentage: {
        title: "Percentage",
        type: "text"

      },
    }
  };

  settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على تفاصيل الملكية",

    // mode: "external",

    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    // },

    actions: {
      position: "right",
      add: false,
      edit: false,
      delete: false,
      columnTitle: "أفعال"
    },

    columns: {
      Name: {
        title: "اسم المالك / المساهم",
        type: "text",

      },
      Type: {
        title: "نوع",
        type: "text"

      },
      Nationality: {
        title: "جنسية",
        type: "text"

      },
      Percentage: {
        title: "النسبة المئوية",
        type: "text"

      },
    }
  };

  settings_real_est_en = {

    hideSubHeader: true,

    noDataMessage: "No Real Estate Details Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {
      Name: {
        title: "Owner / Shareholder Name",
        type: "text",
      },
      propertyTypeDesc: {
        title: "Description",
        type: "text",
      },
      PropertyType: {
        title: "Property Type",
        type: "text"
      },
      MarketValue: {
        title: "Market Value",
        type: "text"
      },
    }
  };

  settings_real_est_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على تفاصيل العقارات",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "أفعال"
    },

    columns: {
      Name: {
        title: "اسم المالك / المساهم",
        type: "text",
      },
      propertyTypeDesc: {
        title: "وصف",
        type: "text",
      },
      PropertyType: {
        title: "نوع الملكية",
        type: "text"
      },
      MarketValue: {
        title: "القيمة السوقية",
        type: "text"

      },
    }
  };

  settings_companies_en = {

    hideSubHeader: true,

    noDataMessage: "No Company Details Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },
    columns: {
      Name: {
        title: "Owner / Shareholder Name",
        type: "text",
      },
      CompanyName: {
        title: "Company / Establishment Name",
        type: "text"
      },
      SharePercentage: {
        title: "Shareholding Percentage",
        type: "text"
      },
      CrNumber: {
        title: "Commercial Registration Number",
        type: "text"
      },
    }
  };

  settings_companies_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على تفاصيل الشركة",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "أفعال"
    },
    columns: {
      Name: {
        title: "اسم المالك / المساهم",
        type: "text",
      },
      CompanyName: {
        title: "اسم الشركة / المؤسسة",
        type: "text"
      },
      SharePercentage: {
        title: "نسبة المساهمة",
        type: "text"
      },
      CrNumber: {
        title: "رقم السجل التجاري",
        type: "text"
      },
    }
  };

  settings_other_inv_en = {

    hideSubHeader: true,

    noDataMessage: "No Other Investment Details Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },
    columns: {
      Name: {
        title: "Owner / Shareholder Name",
        type: "text",
      },
      InvestTypeDesc: {
        title: "Description",
        type: "text"
      },
      InvestmentType: {
        title: "Investment Type",
        type: "text"
        // },
        // InvestmentValue: {
        //   title: "Investment Value",
        //   type: "text"
      }
    }
  };

  settings_other_inv_ar = {

    hideSubHeader: true,

    noDataMessage: "لا توجد تفاصيل استثمار أخرى موجودة",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "أفعال"
    },
    columns: {
      Name: {
        title: "اسم المالك / المساهم",
        type: "text",
      },
      InvestTypeDesc: {
        title: "وصف",
        type: "text"
      },
      InvestmentType: {
        title: "نوع الاستثمار",
        type: "text"
        // },
        // InvestmentValue: {
        //   title: "قيمة الاستثمار",
        //   type: "text"
      }
    }
  };

  settings_bank_info_en = {

    hideSubHeader: true,

    noDataMessage: "No Bank Details Found",

    // mode: "external",

    // edit: {
    //   editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
    // },

    actions: {
      position: "right",
      add: false,
      edit: false,
      delete: false,
      columnTitle: "Actions"
    },

    columns: {
      Name: {
        title: "Account Holder Name",
        type: "text"
      },
      AccountNumber: {
        title: "Bank Account Number",
        type: "text"
      },
      BankName: {
        title: "Bank Name",
        type: "text"
      },
      RepName: {
        title: "Representative Name",
        type: "text"
      }
    }

  };

  settings_bank_info_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على تفاصيل البنك",

    // mode: "external",

    // edit: {
    //   editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
    // },

    actions: {
      position: "right",
      add: false,
      edit: false,
      delete: false,
      columnTitle: "أفعال"
    },

    columns: {
      Name: {
        title: "اسم صاحب الحساب",
        type: "text"
      },
      AccountNumber: {
        title: "رقم الحساب المصرفي",
        type: "text"
      },
      BankName: {
        title: "اسم البنك",
        type: "text"
      },
      RepName: {
        title: "اسم الممثل",
        type: "text"
      }
    }

  };

  kpmr_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Key Professional Management Resource Details Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
    },

    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {
      BpPosition: {
        title: "Position",
        type: "text"
      },
      FirstName: {
        title: "First Name",
        type: "text"
      },
      Nationality: {
        title: "Nationality",
        type: "text"
      },
      Degree: {
        title: "Degree",
        type: "text"
      }
    }
  };

  kpmr_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على تفاصيل الموارد المهنية الرئيسية",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
    },

    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "أفعال"
    },

    columns: {
      BpPosition: {
        title: "موضع",
        type: "text"
      },
      FirstName: {
        title: "الاسم الاول",
        type: "text"
      },
      Nationality: {
        title: "جنسية",
        type: "text"
      },
      Degree: {
        title: "الدرجة العلمية",
        type: "text"
      }
    }
  };

  source_of_finance_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Guarantor Details Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
    },

    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {

      Externalid: {
        title: "ID Number",
        type: "text"
      },
      Percent: {
        title: "Guarantee Percentage",
        type: "text"
      },
      // Nationality: {
      //   title: "Nationality",
      //   type: "text"
      // },
      Position: {
        title: "Position",
        type: "text"
      },
      Type: {
        title: "Type of Guarantee",
        type: "text"
      }

    }
  };

  source_of_finance_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لا توجد تفاصيل الضامن وجدتx",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
    },

    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "أفعال"
    },

    columns: {

      Externalid: {
        title: "رقم الهوية",
        type: "text"
      },
      Percent: {
        title: "ضمان النسبة",
        type: "text"
      },
      // Nationality: {
      //   title: "Nationality",
      //   type: "text"
      // },
      Position: {
        title: "موضع",
        type: "text"
      },
      Type: {
        title: "نوع الضمان",
        type: "text"
      }

    }
  };

  settings_curr_vitae = {

    hideSubHeader: true,

    noDataMessage: "No Curriculum Vitae Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },
    columns: {
      name_own: {
        title: "Name of Owner / Shareholder",
        type: "text",

      },
      curr_vitae: {
        title: "Curriculum Vitae",
        type: "text"

      }
    }
  };

  settings_prop_loan_guar = {

    hideSubHeader: true,

    noDataMessage: "No Proposed Loan Guarantees Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },
    columns: {

      name_own: {
        title: "Name of Owner / Shareholder",
        type: "text",

      },
      nationality: {
        title: "Nationality",
        type: "text"

      },
      postion: {
        title: "Position",
        type: "text"
      },
      guar_perc: {
        title: "Guarantees Percentage",
        type: "text"

      },
      guar_type: {
        title: "Guarantees Type",
        type: "text"

      },
    }
  };

  settings_proj_doc = {

    hideSubHeader: true,

    noDataMessage: "No Project Documents Found",

    mode: "external",

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },

    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },
    columns: {

      doc_type: {
        title: "Document Type",
        type: "text",

      },
      file_name: {
        title: "File Name",
        type: "text"
      }
    }
  };

  projectProfileDocuments = { url: "", documentList: [] };

  realEstateTableDocuments = { url: "", documentList: [] };

  listOfCompaniesTableDocuments = { url: "", documentList: [] };

  otherInvestmentsTableDocuments = { url: "", documentList: [] };

  guarantorsTableDocuments = { url: "", documentList: [] };

  KPMRTableDocuments = { url: "", documentList: [] };

  inputs = {
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
    "FinPlanId": "",
    "GenPrqType": [{
      "PrqId": "",
      "PrqTypeId": "",
      "PrqTypeEn": ""
    }]
  };

  tables = {
    "CustomerId": "",
    "ProfileId": "",
    "Orgin": "CP",
    "Id": 0,
    "OperationType": "",
    "AssetRealEstate": [],
    "AssetShares": [],
    "AssetOtherInvestments": [],
    "AssetBankDetails": [],
    "AssetNetworth": []
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

  city_list = [];

  investment_type_list = [];

  investment_type_desc_list = [];

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
  // deleted_list_companies: any = [];
  deleted_other_investments: any = [];
  deleted_bank_details: any = [];
  deleted_project_ownerships: any = [];
  deleted_project_documents: any = [];
  deleted_curriculum_vitae: any = [];
  deleted_proposed_loan: any = [];
  deleted_kpmr: any = [];
  landloanrequeststatus: any = 0;

  deleteCancelModalReference: any;

  allPanelsExpanded = false;

  startedFilling = 0;

  requestId = 0;
  statusCode = "";

  ownersList = [];

  ownersListNames = [];

  nonSaudiOwnersListNames = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  lang:any='ar';

  constructor(private communicationsService: CommunicationsService, private spinnerService: Ng4LoadingSpinnerService, private calendar: NgbCalendar,
    private customerProfileService: CustomerProfileService, public commonService: CommonService, private projInfoService: ProjInfoService, private modalService: NgbModal, private router: Router, private localStorage: LocalStorage) {

    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 100, month: 12, day: 31 };

    this.translate = this.commonService.returnTranslate();
    this.lang=this.translate.currentLang ;
    this.tour_en = this.commonService.returnEnglishTour();
    this.tour_ar = this.commonService.returnArabicTour();

  }

  files: any = [];

  fileLength = 0;

  ngOnInit() {
    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
    this.localStorage.getItem("serviceId").subscribe(data => {
      this.serviceId = data;
      this.spinnerService.show();

      this.ExtidType_list = this.customerProfileService.loanDropdowns.ExtidType;

      this.BpRelations_list = this.customerProfileService.loanDropdowns.BpRelations;

      this.CofinsType_list = this.customerProfileService.loanDropdowns.GuarType;


      this.property_type_list = this.customerProfileService.loanDropdowns.PropertyType;

      this.legal_entity_list = this.customerProfileService.loanDropdowns.LegalEntity;

      this.project_status_list = this.customerProfileService.loanDropdowns.ProjectImpStatus;

      this.project_completion_status_list = this.customerProfileService.loanDropdowns.ProjectCurrCompletionStatus;

      this.country_list = this.customerProfileService.loanDropdowns.Country;

      this.position_list = this.customerProfileService.loanDropdowns.GuarPosition;

      this.investment_type_list = this.customerProfileService.loanDropdowns.InvType;

      for (var i = 0; i < this.investment_type_list.length; i++)
        this.investment_type_desc_list.push(this.lang==='en'?this.investment_type_list[i].Desc:this.investment_type_list[i].DescAr);

      this.city_list = this.customerProfileService.loanDropdowns.Cities;

      for (var i = 0; i < this.position_list.length; i++)
        this.position_desc_list.push(this.lang==='en'?this.position_list[i].Desc:this.position_list[i].DescAr);

      for (var i = 0; i < this.country_list.length; i++)
        this.country_name_list.push(this.lang==='en'?this.country_list[i].Name:this.country_list[i].DescAr);

      for (var i = 0; i < this.property_type_list.length; i++)
        this.property_type_desc_list.push(this.lang==='en'?this.property_type_list[i].Desc:this.property_type_list[i].DescAr);

      for (var i = 0; i < this.legal_entity_list.length; i++)
        this.legal_entity_desc_list.push(this.lang==='en'?this.legal_entity_list[i].Desc:this.legal_entity_list[i].DescAr);

      for (var i = 0; i < this.project_status_list.length; i++)
        this.project_status_desc_list.push(this.lang==='en'?this.project_status_list[i].Desc:this.project_status_list[i].DescAr);

      for (var i = 0; i < this.project_completion_status_list.length; i++)
        this.project_completion_status_desc_list.push(this.lang==='en'?this.project_completion_status_list[i].Desc:this.project_completion_status_list[i].DescAr);

      for (var i = 0; i < this.ExtidType_list.length; i++)
        this.ExtidType_Desc_list.push(this.lang==='en'?this.ExtidType_list[i].Desc:this.ExtidType_list[i].DescAr);

      for (var i = 0; i < this.BpRelations_list.length; i++)
        this.BpRelations_desc_list.push(this.lang==='en'?this.BpRelations_list[i].Desc:this.BpRelations_list[i].DescAr);

      for (var i = 0; i < this.CofinsType_list.length; i++)
        this.CofinsType_Desc_list.push(this.lang==='en'?this.CofinsType_list[i].Desc:this.CofinsType_list[i].DescAr);

      this.requestId = this.customerProfileService.loanRequestId;
      this.statusCode = this.customerProfileService.statusCode;

      this.commentsFrom = this.customerProfileService.commentsFrom;
      this.commentArrayExists = this.customerProfileService.commentArrayExists;
      this.commentArray = this.customerProfileService.commentArray;

      if (this.statusCode == 'P' || this.statusCode == 'A')
        this.add_edit_delete_show = false;

      else
        this.add_edit_delete_show = true;

      if (this.landloanrequeststatus == 41 || this.landloanrequeststatus == 40)
        this.add_edit_delete_show = true;
      else
        this.add_edit_delete_show = false;

      if (this.statusCode == 'Q')
        this.comments_show = true;

      else
        this.comments_show = false;


      this.settings_real_est_en.actions.edit = this.add_edit_delete_show;
      this.settings_real_est_en.actions.delete = this.add_edit_delete_show;

      this.settings_real_est_ar.actions.edit = this.add_edit_delete_show;
      this.settings_real_est_ar.actions.delete = this.add_edit_delete_show;


      this.settings_companies_en.actions.edit = this.add_edit_delete_show;
      this.settings_companies_en.actions.delete = this.add_edit_delete_show;

      this.settings_companies_ar.actions.edit = this.add_edit_delete_show;
      this.settings_companies_ar.actions.delete = this.add_edit_delete_show;


      this.settings_other_inv_en.actions.edit = this.add_edit_delete_show;
      this.settings_other_inv_en.actions.delete = this.add_edit_delete_show;

      this.settings_other_inv_ar.actions.edit = this.add_edit_delete_show;
      this.settings_other_inv_ar.actions.delete = this.add_edit_delete_show;


      // this.settings_bank_info_en.actions.edit = this.add_edit_delete_show;
      // this.settings_bank_info_en.actions.delete = this.add_edit_delete_show;

      // this.settings_bank_info_ar.actions.edit = this.add_edit_delete_show;
      // this.settings_bank_info_ar.actions.delete = this.add_edit_delete_show;


      this.kpmr_settings_en.actions.edit = this.add_edit_delete_show;
      this.kpmr_settings_en.actions.delete = this.add_edit_delete_show;

      this.kpmr_settings_ar.actions.edit = this.add_edit_delete_show;
      this.kpmr_settings_ar.actions.delete = this.add_edit_delete_show;


      this.source_of_finance_settings_en.actions.edit = this.add_edit_delete_show;
      this.source_of_finance_settings_en.actions.delete = this.add_edit_delete_show;

      this.source_of_finance_settings_ar.actions.edit = this.add_edit_delete_show;
      this.source_of_finance_settings_ar.actions.delete = this.add_edit_delete_show;


      if (this.requestId == 0)
        this.router.navigateByUrl('/pages/new-request/loan-application');

      else {

        this.real_estate_source = new LocalDataSource();
        this.list_companies_source = new LocalDataSource();
        this.other_investments_source = new LocalDataSource();
        this.bank_details_source = new LocalDataSource();
        this.kpmr_source = new LocalDataSource();
        this.project_ownership_source = new LocalDataSource();
        this.project_documents_source = new LocalDataSource();
        this.curriculum_vitae_source = new LocalDataSource();
        this.proposed_loan_source = new LocalDataSource();
        this.source_of_finance_source = new LocalDataSource();

        this.getProjectInformation();

      }

    });
  }

  getProjectInformation() {

    try {

      this.projInfoService
        .getProjectInformation(this.requestId, this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then((res) => (this.resolveProjectInformation(res)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

  resolveProjectInformation(res) {

    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();
    }

    else {

      try {

        this.startedFilling = 0;

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

        if (res.GenInfoGuarantors) {

          for (var i = 0; i < res.GenInfoGuarantors.length; i++) {
            res.GenInfoGuarantors[i]["Percent"] = res.GenInfoGuarantors[i].Percentage;
            res.GenInfoGuarantors[i]["Externalid"] = res.GenInfoGuarantors[i].ExtId;
            delete res.GenInfoGuarantors[i].Percentage;
            delete res.GenInfoGuarantors[i].ExtId;
          }

          this.source_of_finance_source.load(res.GenInfoGuarantors);

          this.source_of_finance_source.refresh();

          this.source_of_finance_source_length = res.GenInfoGuarantors.length;

        }  
        this.localStorage.setItem("crNumber", res.FactoryCr ? res.FactoryCr : "").subscribe();
        this.localStorage.setItem("expLicDate", res.IndLicDate ? res.IndLicDate : "").subscribe();
        this.localStorage.setItem("crDate",  res.CrDate ).subscribe(); 
        this.localStorage.setItem("projectName", res.ProjectName ? res.ProjectName : "").subscribe();
        this.inputs = {
          "Origin": "CP",
          "SentReqId": this.requestId,
          "Indicator": "SAVESUBMIT",
          "IsLoanSumbit": "D",
          "ProjProfile": res.ProjProfile,
          "ProjId": res.ProjId ? res.ProjId : 0,
          "PrqId": res.PrqId ? res.PrqId : "",
          "BpId": res.BpId ? res.BpId : "",
          "GuiId": res.GuiId ? res.GuiId : "",
          "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
          "CustomerId": res.CustomerId ? res.CustomerId : "",
          "IsPrivacySign": res.IsPrivacySign ? res.IsPrivacySign : "",
          "ProjectName": res.ProjectName ? res.ProjectName : "",
          "FactoryId": res.FactoryId ? res.FactoryId : "",
          "CrDate": res.CrDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.CrDate) : { year: 0, month: 0, day: 0 },
          "FactoryCr": res.FactoryCr ? res.FactoryCr : "",
          "CrStartDate": res.CrStartDate ? res.CrStartDate == "00000000" ? "" : this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.CrStartDate) : "",
          "IndLicDate": res.IndLicDate ? this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.IndLicDate) : { year: 0, month: 0, day: 0 },
          "ExpCompDate": res.ExpCompDate ? this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.ExpCompDate) : "",
          "TrailRunFrom": res.TrailRunFrom ? res.TrailRunFrom == "00000000" ? "" : this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.TrailRunFrom) : "",
          "TrailRunTo": res.TrailRunTo ? res.TrailRunTo == "00000000" ? "" : this.commonService.returnISODateStringFromDateStringWithoutHyphen(res.TrailRunTo) : "",
          "GenInfoProducts": res.GenInfoProducts ? res.GenInfoProducts : [],
          "GenInfoFactAddress": res.GenInfoFactAddress ?
            {
              "FactoryId": res.GenInfoFactAddress.FactoryId ? res.GenInfoFactAddress.FactoryId : "",
              "LandNum": res.GenInfoFactAddress.LandNum ? res.GenInfoFactAddress.LandNum : "",
              "City": res.GenInfoFactAddress.City ? res.GenInfoFactAddress.City : "",
              "ManageArea": res.GenInfoFactAddress.ManageArea ? res.GenInfoFactAddress.ManageArea : "",
              "PoBox": res.GenInfoFactAddress.PoBox ? res.GenInfoFactAddress.PoBox : "",
              "ProductArea": res.GenInfoFactAddress.ProductArea ? res.GenInfoFactAddress.ProductArea : "",
              "SameFactAddr": res.GenInfoFactAddress.SameFactAddr ? res.GenInfoFactAddress.SameFactAddr : "",
              "StoreArea": res.GenInfoFactAddress.StoreArea ? res.GenInfoFactAddress.StoreArea : "",
              "TotalArea": res.GenInfoFactAddress.TotalArea ? res.GenInfoFactAddress.TotalArea : "",
              "Website": res.GenInfoFactAddress.Website ? res.GenInfoFactAddress.Website : "",
              "CoX": res.GenInfoFactAddress.CoX ? res.GenInfoFactAddress.CoX : "",
              "CoY": res.GenInfoFactAddress.CoY ? res.GenInfoFactAddress.CoY : "",
              "Zip": res.GenInfoFactAddress.Zip ? res.GenInfoFactAddress.Zip : "",
              "Fax": res.GenInfoFactAddress.Fax ? res.GenInfoFactAddress.Fax : "",
              "Phone": res.GenInfoFactAddress.Phone ? res.GenInfoFactAddress.Phone : "",
              "Mail": res.GenInfoFactAddress.Mail ? res.GenInfoFactAddress.Mail : ""
            } :
            {
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
          "GenInfoLoanPurpose": res.GenInfoLoanPurpose ?
            {
              "LoanPurId": res.GenInfoLoanPurpose.LoanPurId ? res.GenInfoLoanPurpose.LoanPurId : "",
              "LoanPurDesc": res.GenInfoLoanPurpose.LoanPurDesc ? res.GenInfoLoanPurpose.LoanPurDesc : ""
            } :
            {
              "LoanPurId": "",
              "LoanPurDesc": ""
            },
          "GenInfoProjCompStatus": res.GenInfoProjCompStatus ?
            {
              "ProjCompStatusId": res.GenInfoProjCompStatus.ProjCompStatusId ? res.GenInfoProjCompStatus.ProjCompStatusId : "",
              "ProjCompStatusDesc": res.GenInfoProjCompStatus.ProjCompStatusDesc ? res.GenInfoProjCompStatus.ProjCompStatusDesc : this.project_completion_status_desc_list[0]
            } :
            {
              "ProjCompStatusId": "",
              "ProjCompStatusDesc": this.project_completion_status_desc_list[0]
            },
          "GenInfoProjImpStatus": res.GenInfoProjImpStatus ?
            {
              "ProjImpStatusId": res.GenInfoProjImpStatus.ProjImpStatusId ? res.GenInfoProjImpStatus.ProjImpStatusId : "",
              "ProjImpStatusDesc": res.GenInfoProjImpStatus.ProjImpStatusDesc ? res.GenInfoProjImpStatus.ProjImpStatusDesc : this.project_status_desc_list[0]
            } :
            {
              "ProjImpStatusId": "",
              "ProjImpStatusDesc": this.project_status_desc_list[0]
            },
          "GenInfoTypeProj": res.GenInfoTypeProj ?
            {
              "ProjTypeId": res.GenInfoTypeProj.ProjTypeId ? res.GenInfoTypeProj.ProjTypeId : "",
              "ProjTypeDesc": res.GenInfoTypeProj.ProjTypeDesc ? res.GenInfoTypeProj.ProjTypeDesc : ""
            } :
            {
              "ProjTypeId": "IN",
              "ProjTypeDesc": "Industrial"
            },
          "BussPartOwners": res.BussPartOwners ? res.BussPartOwners : [],
          "GetInfoLegalEntity": res.GetInfoLegalEntity ?
            {
              "LegalEntityId": res.GetInfoLegalEntity.LegalEntityId ? res.GetInfoLegalEntity.LegalEntityId : "",
              "LegalEntityDesc": res.GetInfoLegalEntity.LegalEntityDesc ? res.GetInfoLegalEntity.LegalEntityDesc : ""
            } :
            {
              "LegalEntityId": "",
              "LegalEntityDesc": ""
            },
          "FinPlanId": res.FinPlanId ? res.FinPlanId : "",
          "GenPrqType": res.GenPrqType && res.GenPrqType[0] ? [{
            "PrqId": res.GenPrqType[0].PrqId ? res.GenPrqType[0].PrqId : "",
            "PrqTypeId": res.GenPrqType[0].PrqTypeId ? res.GenPrqType[0].PrqTypeId : "",
            "PrqTypeEn": res.GenPrqType[0].PrqTypeEn ? res.GenPrqType[0].PrqTypeEn : ""
          }] : [{
            "PrqId": "",
            "PrqTypeId": "",
            "PrqTypeEn": ""
          }]
        };

        this.loanTypeValues.loanType = this.inputs.GenPrqType[0].PrqTypeEn;

        var loanType = this.loanTypeValues.loanTypeList.find((o) => o.id == this.inputs.GenPrqType[0].PrqTypeId);
        if (loanType) {

          loanType.prqTypeEn = this.loanTypeValues.loanType;
          this.loanTypeValues.selectedLoanType = loanType;
          this.loanTypeValues.selectedLoanTypeOperation = loanType.operation;

        }

        this.inputs.GetInfoLegalEntity.LegalEntityDesc == "" ? this.legalEntitySelectShow = true : this.legalEntitySelectShow = false;

        var legalEntity = this.legal_entity_list.find((o) => o.Id == this.inputs.GetInfoLegalEntity.LegalEntityId);
        if (legalEntity)
          this.inputs.GetInfoLegalEntity.LegalEntityDesc = legalEntity.Desc;

        var temp_array = {};

        temp_array = {
          "ProjId": this.inputs.ProjId,
          "PrqId": this.inputs.PrqId,
          "BpId": this.inputs.BpId,
          "SentReqId": this.inputs.SentReqId,
          "FactoryCr": this.inputs.FactoryCr,
          "ProjectName": this.inputs.ProjectName,
          "GenInfoProducts": this.inputs.GenInfoProducts,
          "FinPlanId": this.inputs.FinPlanId,
          "LoanPurpose": this.inputs.GenInfoLoanPurpose.LoanPurDesc,
          "LoanTypeValues": this.loanTypeValues
        };

        this.customerProfileService.setLoanArray(temp_array);

        this.project_ownership_source.load(this.inputs.BussPartOwners);

        this.project_ownership_source_length = this.inputs.BussPartOwners.length;

        for (var i = 0; i < this.project_ownership_source_length; i++) {

          this.ownersList.push({ Id: this.inputs.BussPartOwners[i].BpId, Name: this.inputs.BussPartOwners[i].Name });

          if (this.inputs.BussPartOwners[i].Nationality == "Saudi Arabia")
            this.ownersListNames.push(this.inputs.BussPartOwners[i].Name);

          else {

            this.ownersListNames.push(this.inputs.BussPartOwners[i].Name);
            this.nonSaudiOwnersListNames.push(this.inputs.BussPartOwners[i].Name);

          }

        }

        if (this.ownersList.length > 0) {

          if (res.Asset) {

            if (res.Asset[0].AssetRealEstate)
              for (var i = 0; i < res.Asset[0].AssetRealEstate.length; i++) {

                var Name = this.ownersList.find((o) => o.Id == res.Asset[0].AssetRealEstate[i].Id);
                if (Name)
                  res.Asset[0].AssetRealEstate[i]["Name"] = Name.Name;

                res.Asset[0].AssetRealEstate[i].PurchaseDate = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.Asset[0].AssetRealEstate[i].PurchaseDate);

                res.Asset[0].AssetRealEstate[i].MarketDate = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.Asset[0].AssetRealEstate[i].MarketDate);

                var propertyType = this.property_type_list.find((o) => o.Id == res.Asset[0].AssetRealEstate[i].PropertyType);
                if (propertyType)
                  res.Asset[0].AssetRealEstate[i].PropertyType = propertyType.Desc;

                var country = this.country_list.find((o) => o.Code == res.Asset[0].AssetRealEstate[i].Country);
                if (country)
                  res.Asset[0].AssetRealEstate[i].Country = country.Name;

                res.Asset[0].AssetRealEstate[i]["Operation"] = "";
                res.Asset[0].AssetRealEstate[i]["AppId"] = this.inputs.PrqId;
                res.Asset[0].AssetRealEstate[i]["SendReqId"] = this.inputs.SentReqId;

                res.Asset[0].AssetRealEstate[i]["MarketValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Asset[0].AssetRealEstate[i]["MarketValue"]);
                res.Asset[0].AssetRealEstate[i]["PurchasePrice"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Asset[0].AssetRealEstate[i]["PurchasePrice"]);

              }

            if (res.Asset[0].AssetShares)
              for (var i = 0; i < res.Asset[0].AssetShares.length; i++) {

                var Name = this.ownersList.find((o) => o.Id == res.Asset[0].AssetShares[i].Id);
                if (Name)
                  res.Asset[0].AssetShares[i]["Name"] = Name.Name;

                res.Asset[0].AssetShares[i].IssueDate = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.Asset[0].AssetShares[i].IssueDate);

                res.Asset[0].AssetShares[i]["Operation"] = "";
                res.Asset[0].AssetShares[i]["AppId"] = this.inputs.PrqId;
                res.Asset[0].AssetShares[i]["SendReqId"] = this.inputs.SentReqId;

                res.Asset[0].AssetShares[i]["ShareValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Asset[0].AssetShares[i]["ShareValue"]);

              }

            if (res.Asset[0].AssetOtherInvestments)
              for (var i = 0; i < res.Asset[0].AssetOtherInvestments.length; i++) {

                var Name = this.ownersList.find((o) => o.Id == res.Asset[0].AssetOtherInvestments[i].Id);
                if (Name)
                  res.Asset[0].AssetOtherInvestments[i]["Name"] = Name.Name;

                res.Asset[0].AssetOtherInvestments[i]["Operation"] = "";
                res.Asset[0].AssetOtherInvestments[i]["AppId"] = this.inputs.PrqId;
                res.Asset[0].AssetOtherInvestments[i]["SendReqId"] = this.inputs.SentReqId;

                var investmentType = this.investment_type_list.find((o) => o.Id == res.Asset[0].AssetOtherInvestments[i]["InvestmentType"]);
                if (investmentType)
                  res.Asset[0].AssetOtherInvestments[i]["InvestmentType"] = investmentType.Desc;

                res.Asset[0].AssetOtherInvestments[i]["InvestmentValue"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Asset[0].AssetOtherInvestments[i]["InvestmentValue"]);

                res.Asset[0].AssetOtherInvestments[i]["MarketPrice"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Asset[0].AssetOtherInvestments[i]["MarketPrice"]);
                res.Asset[0].AssetOtherInvestments[i]["TotMarkPrice"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Asset[0].AssetOtherInvestments[i]["TotMarkPrice"]);

              }

            if (res.Asset[0].AssetBankDetails)
              for (var i = 0; i < res.Asset[0].AssetBankDetails.length; i++) {

                var Name = this.ownersList.find((o) => o.Id == res.Asset[0].AssetBankDetails[i].Id);
                if (Name)
                  res.Asset[0].AssetBankDetails[i]["Name"] = Name.Name;

                res.Asset[0].AssetBankDetails[i]["Operation"] = "";
                res.Asset[0].AssetBankDetails[i]["AppId"] = this.inputs.PrqId;
                res.Asset[0].AssetBankDetails[i]["SendReqId"] = this.inputs.SentReqId;

              }

            this.tables = {
              "CustomerId": "",
              "ProfileId": "",
              "Orgin": "CP",
              "Id": res.Id ? res.Id : 0,
              "OperationType": "",
              "AssetRealEstate": res.Asset[0].AssetRealEstate ? res.Asset[0].AssetRealEstate : [],
              "AssetShares": res.Asset[0].AssetShares ? res.Asset[0].AssetShares : [],
              "AssetOtherInvestments": res.Asset[0].AssetOtherInvestments ? res.Asset[0].AssetOtherInvestments : [],
              "AssetBankDetails": res.Asset[0].AssetBankDetails ? res.Asset[0].AssetBankDetails : [],
              "AssetNetworth": res.Asset[0].AssetNetworth ? res.Asset[0].AssetNetworth : []
            };

            this.real_estate_source.load(this.tables.AssetRealEstate);
            this.real_estate_source_length = this.tables.AssetRealEstate.length;

            this.list_companies_source.load(this.tables.AssetShares);
            this.list_companies_source_length = this.tables.AssetShares.length;

            this.other_investments_source.load(this.tables.AssetOtherInvestments);
            this.other_investments_source_length = this.tables.AssetOtherInvestments.length;

            this.bank_details_source.load(this.tables.AssetBankDetails);
            this.bank_details_source_length = this.tables.AssetBankDetails.length;

            this.real_estate_source.refresh();
            this.list_companies_source.refresh();
            this.other_investments_source.refresh();
            this.bank_details_source.refresh();

            this.getProjectKPMRInformation();

          }

        }

        else
          this.getProjectKPMRInformation();

      }

      catch (err) {
        this.resolveError();
      }

    }

  }

  getProjectKPMRInformation() {

    try {

      this.projInfoService
        .getProjectKPMRInformation(this.inputs.BpId,
          this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then((res) => (this.resolveProjectKPMRInformation(res)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  resolveProjectKPMRInformation(res) {

    if (res.ResMessType === "E") {

      this.communicationsService.getDocumentService(this.requestId, "p")
        .then(requests => (this.resolveDocuments(requests)), err => this.resolveError());

    }

    else {

      var kpmr_source_data_array = [];

      if (res.BpManagePos)
        for (var i = 0; i < res.BpManagePos.length; i++) {

          res.BpManagePos[i].BpPosition = res.BpManagePos[i].BpPosition.PosDesc;

          res.BpManagePos[i].DateOfJoining = this.commonService.returnDateArrayFromDateStringWithoutHyphen(res.BpManagePos[i].DateOfJoining);
if( res.BpManagePos[i].Nationality)
          res.BpManagePos[i].Nationality = res.BpManagePos[i].Nationality.Nationality;

          kpmr_source_data_array.push(res.BpManagePos[i]);

          this.kpmr_source_length++;

        }

      this.kpmr_source.load(kpmr_source_data_array);
      this.kpmr_source.refresh();

      this.communicationsService.getDocumentService(this.requestId, "l")
        .then(requests => (this.resolveDocuments(requests)), err => this.resolveError());

    }

  }

  resolveDocuments(requests) {

    this.documents = this.commonService.returnViewDocumentJson(requests);


    this.projectProfileDocuments.url = this.documents["url"];

    this.guarantorsTableDocuments.url = this.documents["url"];

    this.KPMRTableDocuments.url = this.documents["url"];


    this.projectProfileDocuments.documentList = [];

    this.guarantorsTableDocuments.documentList = [];

    this.KPMRTableDocuments.documentList = [];


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

          if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.inputs.GuiId))
            this.projectProfileDocuments["documentList"].push(this.documents["documentList"][i]);

          else {

            for (var j = 0; j < kpmr_temp_source.length; j++)
              if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(kpmr_temp_source[j]["GuiId"]))
                this.KPMRTableDocuments["documentList"].push(this.documents["documentList"][i]);

            for (var j = 0; j < guarantors_temp_source.length; j++)
              if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(guarantors_temp_source[j]["Externalid"]))
                this.guarantorsTableDocuments["documentList"].push(this.documents["documentList"][i]);

          }

        }

      });

    });

    this.communicationsService.getDocumentService(this.inputs.PrqId, "p")
      .then(requests => (this.resolvePRQDocuments(requests)), err => this.resolveError());

  }

  resolvePRQDocuments(requests) {

    this.prqDocuments = this.commonService.returnViewDocumentJson(requests);


    this.realEstateTableDocuments.url = this.prqDocuments["url"];

    this.listOfCompaniesTableDocuments.url = this.prqDocuments["url"];

    this.otherInvestmentsTableDocuments.url = this.prqDocuments["url"];


    this.realEstateTableDocuments.documentList = [];

    this.listOfCompaniesTableDocuments.documentList = [];

    this.otherInvestmentsTableDocuments.documentList = [];


    for (var i = 0; i < this.prqDocuments["documentList"].length; i++) {

      this.prqDocuments["documentList"][i]["docUrl"] =
        this.prqDocuments["url"]
          .replace("entityId", this.prqDocuments["documentList"][i].EntityId)
          .replace("refId", this.prqDocuments["documentList"][i].RefId)
          .replace("documentId", this.prqDocuments["documentList"][i].DocumentId)
          .replace("fileName", this.prqDocuments["documentList"][i].FileName);

      for (var j = 0; j < this.tables.AssetRealEstate.length; j++)
        if (parseInt(this.prqDocuments["documentList"][i].RelatedEntityId) == parseInt(this.tables.AssetRealEstate[j]["GuiId"]))
          this.realEstateTableDocuments["documentList"].push(this.prqDocuments["documentList"][i]);

      for (var j = 0; j < this.tables.AssetOtherInvestments.length; j++)
        if (parseInt(this.prqDocuments["documentList"][i].RelatedEntityId) == parseInt(this.tables.AssetOtherInvestments[j]["GuiId"]))
          this.otherInvestmentsTableDocuments["documentList"].push(this.prqDocuments["documentList"][i]);

      for (var j = 0; j < this.tables.AssetShares.length; j++)
        if (parseInt(this.prqDocuments["documentList"][i].RelatedEntityId) == parseInt(this.tables.AssetShares[j]["GuiId"]))
          this.listOfCompaniesTableDocuments["documentList"].push(this.prqDocuments["documentList"][i]);

    }

    if (this.commentArrayExists)
      this.resolveCommonComments();

    else {

      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.ProjectInfoRetrieved'));

      this.spinnerService.hide();

    }
    
    if (this.statusCode == 'Q') {
      this.setEditableSectionsBasedOnCommunication();
      this.comments_show = true;
      this.add_edit_delete_show = false;
    }
    else
      this.comments_show = false;

  }

  resolveCommonComments() {

    try {

      var resolvedCommentArray = [], resolvedCommentArray_1 = [], resolvedCommentArray_2 = [];

      if (this.commentsFrom == "L") {

        resolvedCommentArray_1 = _.where(this.commentArray["RecReqComm"], { SentReqType: "NLOA", CommReqStatus: "O" });
        resolvedCommentArray_1 = resolvedCommentArray_1[0];

        resolvedCommentArray_2 = _.where(this.commentArray["RecReqComm"], { SentReqType: "NLOA", CommReqStatus: "C" });

        if (resolvedCommentArray_2 && resolvedCommentArray_2.length > 0) {

          resolvedCommentArray_2 = resolvedCommentArray_2[0];

          if (resolvedCommentArray_2["RecReqSection"] && resolvedCommentArray_2["RecReqSection"].length > 0)
            for (var i = 0; i < resolvedCommentArray_2["RecReqSection"].length; i++)
              resolvedCommentArray_1["RecReqSection"].push(resolvedCommentArray_2["RecReqSection"][i]);

        }

      }

      else {

        resolvedCommentArray_1 = _.where(this.commentArray["RecReqComm"], { SentReqType: "NLOA", CommReqStatus: "O" });
        resolvedCommentArray_1 = resolvedCommentArray_1[0];

      }

      resolvedCommentArray = resolvedCommentArray_1;

      if (resolvedCommentArray["RecReqSection"])
        for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSec == "LONPI" && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

            if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIGEN") {

              this.general_information_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.general_information_comments.SectionCode, ReqSubSec: this.general_information_comments.SubSectionCode });

              this.general_information_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.general_information_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.general_information_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.general_information_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.general_information_comments.commentDetails["DeadLineDate"] = this.general_information_comments.commentArray[0]["DeadLineDate"];
              this.general_information_comments.commentDetails["GuiId"] = this.general_information_comments.commentArray[0]["GuiId"];
              this.general_information_comments.commentDetails["ReqSec"] = this.general_information_comments.commentArray[0]["ReqSec"];
              this.general_information_comments.commentDetails["ReqSecDesc"] = this.general_information_comments.commentArray[0]["ReqSecDesc"];
              this.general_information_comments.commentDetails["ReqStatus"] = this.general_information_comments.commentArray[0]["ReqStatus"];
              this.general_information_comments.commentDetails["ReqStatusDesc"] = this.general_information_comments.commentArray[0]["ReqStatusDesc"];
              this.general_information_comments.commentDetails["ReqSubSec"] = this.general_information_comments.commentArray[0]["ReqSubSec"];
              this.general_information_comments.commentDetails["ReqSubSecDesc"] = this.general_information_comments.commentArray[0]["ReqSubSecDesc"];
              this.general_information_comments.commentDetails["SectionId"] = this.general_information_comments.commentArray[0]["SectionId"];

              var openComments = this.general_information_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.general_information_comments.anyOpenComments = true;
              else
                this.general_information_comments.anyOpenComments = false;

              this.general_information_comments.commentArray = this.general_information_comments.commentArray[0]["RecReqComment"];

              this.general_information_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIPRO") {

              this.project_profile_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.project_profile_comments.SectionCode, ReqSubSec: this.project_profile_comments.SubSectionCode });

              this.project_profile_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.project_profile_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.project_profile_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.project_profile_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.project_profile_comments.commentDetails["DeadLineDate"] = this.project_profile_comments.commentArray[0]["DeadLineDate"];
              this.project_profile_comments.commentDetails["GuiId"] = this.project_profile_comments.commentArray[0]["GuiId"];
              this.project_profile_comments.commentDetails["ReqSec"] = this.project_profile_comments.commentArray[0]["ReqSec"];
              this.project_profile_comments.commentDetails["ReqSecDesc"] = this.project_profile_comments.commentArray[0]["ReqSecDesc"];
              this.project_profile_comments.commentDetails["ReqStatus"] = this.project_profile_comments.commentArray[0]["ReqStatus"];
              this.project_profile_comments.commentDetails["ReqStatusDesc"] = this.project_profile_comments.commentArray[0]["ReqStatusDesc"];
              this.project_profile_comments.commentDetails["ReqSubSec"] = this.project_profile_comments.commentArray[0]["ReqSubSec"];
              this.project_profile_comments.commentDetails["ReqSubSecDesc"] = this.project_profile_comments.commentArray[0]["ReqSubSecDesc"];
              this.project_profile_comments.commentDetails["SectionId"] = this.project_profile_comments.commentArray[0]["SectionId"];

              var openComments = this.project_profile_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.project_profile_comments.anyOpenComments = true;
              else
                this.project_profile_comments.anyOpenComments = false;

              this.project_profile_comments.commentArray = this.project_profile_comments.commentArray[0]["RecReqComment"];

              this.project_profile_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIOWN") {

              this.project_ownership_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.project_ownership_comments.SectionCode, ReqSubSec: this.project_ownership_comments.SubSectionCode });

              this.project_ownership_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.project_ownership_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.project_ownership_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.project_ownership_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.project_ownership_comments.commentDetails["DeadLineDate"] = this.project_ownership_comments.commentArray[0]["DeadLineDate"];
              this.project_ownership_comments.commentDetails["GuiId"] = this.project_ownership_comments.commentArray[0]["GuiId"];
              this.project_ownership_comments.commentDetails["ReqSec"] = this.project_ownership_comments.commentArray[0]["ReqSec"];
              this.project_ownership_comments.commentDetails["ReqSecDesc"] = this.project_ownership_comments.commentArray[0]["ReqSecDesc"];
              this.project_ownership_comments.commentDetails["ReqStatus"] = this.project_ownership_comments.commentArray[0]["ReqStatus"];
              this.project_ownership_comments.commentDetails["ReqStatusDesc"] = this.project_ownership_comments.commentArray[0]["ReqStatusDesc"];
              this.project_ownership_comments.commentDetails["ReqSubSec"] = this.project_ownership_comments.commentArray[0]["ReqSubSec"];
              this.project_ownership_comments.commentDetails["ReqSubSecDesc"] = this.project_ownership_comments.commentArray[0]["ReqSubSecDesc"];
              this.project_ownership_comments.commentDetails["SectionId"] = this.project_ownership_comments.commentArray[0]["SectionId"];

              var openComments = this.project_ownership_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.project_ownership_comments.anyOpenComments = true;
              else
                this.project_ownership_comments.anyOpenComments = false;

              this.project_ownership_comments.commentArray = this.project_ownership_comments.commentArray[0]["RecReqComment"];

              this.project_ownership_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIGUA") {

              this.guarantors_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.guarantors_comments.SectionCode, ReqSubSec: this.guarantors_comments.SubSectionCode });

              this.guarantors_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.guarantors_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.guarantors_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.guarantors_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.guarantors_comments.commentDetails["DeadLineDate"] = this.guarantors_comments.commentArray[0]["DeadLineDate"];
              this.guarantors_comments.commentDetails["GuiId"] = this.guarantors_comments.commentArray[0]["GuiId"];
              this.guarantors_comments.commentDetails["ReqSec"] = this.guarantors_comments.commentArray[0]["ReqSec"];
              this.guarantors_comments.commentDetails["ReqSecDesc"] = this.guarantors_comments.commentArray[0]["ReqSecDesc"];
              this.guarantors_comments.commentDetails["ReqStatus"] = this.guarantors_comments.commentArray[0]["ReqStatus"];
              this.guarantors_comments.commentDetails["ReqStatusDesc"] = this.guarantors_comments.commentArray[0]["ReqStatusDesc"];
              this.guarantors_comments.commentDetails["ReqSubSec"] = this.guarantors_comments.commentArray[0]["ReqSubSec"];
              this.guarantors_comments.commentDetails["ReqSubSecDesc"] = this.guarantors_comments.commentArray[0]["ReqSubSecDesc"];
              this.guarantors_comments.commentDetails["SectionId"] = this.guarantors_comments.commentArray[0]["SectionId"];

              var openComments = this.guarantors_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.guarantors_comments.anyOpenComments = true;
              else
                this.guarantors_comments.anyOpenComments = false;

              this.guarantors_comments.commentArray = this.guarantors_comments.commentArray[0]["RecReqComment"];

              this.guarantors_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIRES") {

              this.real_estates_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.real_estates_comments.SectionCode, ReqSubSec: this.real_estates_comments.SubSectionCode });

              this.real_estates_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.real_estates_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.real_estates_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.real_estates_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.real_estates_comments.commentDetails["DeadLineDate"] = this.real_estates_comments.commentArray[0]["DeadLineDate"];
              this.real_estates_comments.commentDetails["GuiId"] = this.real_estates_comments.commentArray[0]["GuiId"];
              this.real_estates_comments.commentDetails["ReqSec"] = this.real_estates_comments.commentArray[0]["ReqSec"];
              this.real_estates_comments.commentDetails["ReqSecDesc"] = this.real_estates_comments.commentArray[0]["ReqSecDesc"];
              this.real_estates_comments.commentDetails["ReqStatus"] = this.real_estates_comments.commentArray[0]["ReqStatus"];
              this.real_estates_comments.commentDetails["ReqStatusDesc"] = this.real_estates_comments.commentArray[0]["ReqStatusDesc"];
              this.real_estates_comments.commentDetails["ReqSubSec"] = this.real_estates_comments.commentArray[0]["ReqSubSec"];
              this.real_estates_comments.commentDetails["ReqSubSecDesc"] = this.real_estates_comments.commentArray[0]["ReqSubSecDesc"];
              this.real_estates_comments.commentDetails["SectionId"] = this.real_estates_comments.commentArray[0]["SectionId"];

              var openComments = this.real_estates_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.real_estates_comments.anyOpenComments = true;
              else
                this.real_estates_comments.anyOpenComments = false;

              this.real_estates_comments.commentArray = this.real_estates_comments.commentArray[0]["RecReqComment"];

              this.real_estates_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PICOM") {

              this.list_of_companies_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.list_of_companies_comments.SectionCode, ReqSubSec: this.list_of_companies_comments.SubSectionCode });

              this.list_of_companies_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.list_of_companies_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.list_of_companies_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.list_of_companies_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.list_of_companies_comments.commentDetails["DeadLineDate"] = this.list_of_companies_comments.commentArray[0]["DeadLineDate"];
              this.list_of_companies_comments.commentDetails["GuiId"] = this.list_of_companies_comments.commentArray[0]["GuiId"];
              this.list_of_companies_comments.commentDetails["ReqSec"] = this.list_of_companies_comments.commentArray[0]["ReqSec"];
              this.list_of_companies_comments.commentDetails["ReqSecDesc"] = this.list_of_companies_comments.commentArray[0]["ReqSecDesc"];
              this.list_of_companies_comments.commentDetails["ReqStatus"] = this.list_of_companies_comments.commentArray[0]["ReqStatus"];
              this.list_of_companies_comments.commentDetails["ReqStatusDesc"] = this.list_of_companies_comments.commentArray[0]["ReqStatusDesc"];
              this.list_of_companies_comments.commentDetails["ReqSubSec"] = this.list_of_companies_comments.commentArray[0]["ReqSubSec"];
              this.list_of_companies_comments.commentDetails["ReqSubSecDesc"] = this.list_of_companies_comments.commentArray[0]["ReqSubSecDesc"];
              this.list_of_companies_comments.commentDetails["SectionId"] = this.list_of_companies_comments.commentArray[0]["SectionId"];

              var openComments = this.list_of_companies_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.list_of_companies_comments.anyOpenComments = true;
              else
                this.list_of_companies_comments.anyOpenComments = false;

              this.list_of_companies_comments.commentArray = this.list_of_companies_comments.commentArray[0]["RecReqComment"];

              this.list_of_companies_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIINV") {

              this.other_investments_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.other_investments_comments.SectionCode, ReqSubSec: this.other_investments_comments.SubSectionCode });

              this.other_investments_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.other_investments_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.other_investments_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.other_investments_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.other_investments_comments.commentDetails["DeadLineDate"] = this.other_investments_comments.commentArray[0]["DeadLineDate"];
              this.other_investments_comments.commentDetails["GuiId"] = this.other_investments_comments.commentArray[0]["GuiId"];
              this.other_investments_comments.commentDetails["ReqSec"] = this.other_investments_comments.commentArray[0]["ReqSec"];
              this.other_investments_comments.commentDetails["ReqSecDesc"] = this.other_investments_comments.commentArray[0]["ReqSecDesc"];
              this.other_investments_comments.commentDetails["ReqStatus"] = this.other_investments_comments.commentArray[0]["ReqStatus"];
              this.other_investments_comments.commentDetails["ReqStatusDesc"] = this.other_investments_comments.commentArray[0]["ReqStatusDesc"];
              this.other_investments_comments.commentDetails["ReqSubSec"] = this.other_investments_comments.commentArray[0]["ReqSubSec"];
              this.other_investments_comments.commentDetails["ReqSubSecDesc"] = this.other_investments_comments.commentArray[0]["ReqSubSecDesc"];
              this.other_investments_comments.commentDetails["SectionId"] = this.other_investments_comments.commentArray[0]["SectionId"];

              var openComments = this.other_investments_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.other_investments_comments.anyOpenComments = true;
              else
                this.other_investments_comments.anyOpenComments = false;

              this.other_investments_comments.commentArray = this.other_investments_comments.commentArray[0]["RecReqComment"];

              this.other_investments_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIBNK") {

              this.bank_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.bank_details_comments.SectionCode, ReqSubSec: this.bank_details_comments.SubSectionCode });

              this.bank_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.bank_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.bank_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.bank_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.bank_details_comments.commentDetails["DeadLineDate"] = this.bank_details_comments.commentArray[0]["DeadLineDate"];
              this.bank_details_comments.commentDetails["GuiId"] = this.bank_details_comments.commentArray[0]["GuiId"];
              this.bank_details_comments.commentDetails["ReqSec"] = this.bank_details_comments.commentArray[0]["ReqSec"];
              this.bank_details_comments.commentDetails["ReqSecDesc"] = this.bank_details_comments.commentArray[0]["ReqSecDesc"];
              this.bank_details_comments.commentDetails["ReqStatus"] = this.bank_details_comments.commentArray[0]["ReqStatus"];
              this.bank_details_comments.commentDetails["ReqStatusDesc"] = this.bank_details_comments.commentArray[0]["ReqStatusDesc"];
              this.bank_details_comments.commentDetails["ReqSubSec"] = this.bank_details_comments.commentArray[0]["ReqSubSec"];
              this.bank_details_comments.commentDetails["ReqSubSecDesc"] = this.bank_details_comments.commentArray[0]["ReqSubSecDesc"];
              this.bank_details_comments.commentDetails["SectionId"] = this.bank_details_comments.commentArray[0]["SectionId"];

              var openComments = this.bank_details_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.bank_details_comments.anyOpenComments = true;
              else
                this.bank_details_comments.anyOpenComments = false;

              this.bank_details_comments.commentArray = this.bank_details_comments.commentArray[0]["RecReqComment"];

              this.bank_details_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIKEY") {

              this.kpmr_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.kpmr_comments.SectionCode, ReqSubSec: this.kpmr_comments.SubSectionCode });

              this.kpmr_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.kpmr_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.kpmr_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.kpmr_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.kpmr_comments.commentDetails["DeadLineDate"] = this.kpmr_comments.commentArray[0]["DeadLineDate"];
              this.kpmr_comments.commentDetails["GuiId"] = this.kpmr_comments.commentArray[0]["GuiId"];
              this.kpmr_comments.commentDetails["ReqSec"] = this.kpmr_comments.commentArray[0]["ReqSec"];
              this.kpmr_comments.commentDetails["ReqSecDesc"] = this.kpmr_comments.commentArray[0]["ReqSecDesc"];
              this.kpmr_comments.commentDetails["ReqStatus"] = this.kpmr_comments.commentArray[0]["ReqStatus"];
              this.kpmr_comments.commentDetails["ReqStatusDesc"] = this.kpmr_comments.commentArray[0]["ReqStatusDesc"];
              this.kpmr_comments.commentDetails["ReqSubSec"] = this.kpmr_comments.commentArray[0]["ReqSubSec"];
              this.kpmr_comments.commentDetails["ReqSubSecDesc"] = this.kpmr_comments.commentArray[0]["ReqSubSecDesc"];
              this.kpmr_comments.commentDetails["SectionId"] = this.kpmr_comments.commentArray[0]["SectionId"];

              var openComments = this.kpmr_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.kpmr_comments.anyOpenComments = true;
              else
                this.kpmr_comments.anyOpenComments = false;

              this.kpmr_comments.commentArray = this.kpmr_comments.commentArray[0]["RecReqComment"];

              this.kpmr_comments.hasComments = true;

            }

          }

        }

      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.ProjectInfoRetrieved'));
      this.spinnerService.hide();

    }

    catch (err) {
      this.resolveError();
    }

  }

  onFileChange(event) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {

      format = this.files[i].name.split('.');

      format_length = format.length;

      if (this.files[i].size > 5242880) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.SizeOfFile'));
        event.target.value = '';

        this.fileLength = 0;
        this.projectDescriptionDocuments_vs = true;

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('COMMON.FormatOfFile'));
        event.target.value = '';

        this.fileLength = 0;
        this.projectDescriptionDocuments_vs = true;

        break;

      }

      else if (i === (this.files.length - 1)) {

        this.fileLength = this.files.length;
        this.projectDescriptionDocuments_vs = false;
        this.startedFilling = 1;

        break;

      }

    }

  }

  onAdd(table_name) {

    let projectOwnershipModalParams = {};

    if (table_name === 'proj_own') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.AddProjectOwnership'),

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Type",
            name: this.translate.instant('PROJECT_INFORMATION.Type'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Nationality",
            name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "Percentage",
            name: this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage'),
            type: "number",
            value: "",
            required: "true",
          },
          {
            id: "id_typ",
            name: this.translate.instant('PROJECT_INFORMATION.IdTypeOrCommercialRegister'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "addr",
            name: this.translate.instant('PROJECT_INFORMATION.Address'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "tel_no",
            name: this.translate.instant('PROJECT_INFORMATION.TelephoneNumber'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "fax_no",
            name: this.translate.instant('PROJECT_INFORMATION.FaxNumber'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "mob_no",
            name: "Mobile Number",
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "email_id",
            name: this.translate.instant('PROJECT_INFORMATION.EmailId'),
            type: "email",
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
              var project_ownership_source_data_array = [];
              var project_ownership_source_data = {
                Name: modal_data.inputs[0].selected, Type: modal_data.inputs[1].value, Nationality: modal_data.inputs[2].value,
                Percentage: parseFloat(modal_data.inputs[3].value).toFixed(4),
                id_typ: modal_data.inputs[4].value, addr: modal_data.inputs[5].value, tel_no: modal_data.inputs[6].value,
                fax_no: modal_data.inputs[7].value, mob_no: modal_data.inputs[8].value, email_id: modal_data.inputs[9].value
              };


              project_ownership_source_data_array.push(project_ownership_source_data);

              if (this.project_ownership_source_length == 0)
                this.project_ownership_source.load(project_ownership_source_data_array);

              else
                this.project_ownership_source.add(project_ownership_source_data);

              this.project_ownership_source_length++;

              this.project_ownership_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'proj_doc') {

      projectOwnershipModalParams = {

        header: "Add Project Documents",

        inputs: [
          {
            id: "doc_type",
            name: "Document Type",
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "file_name",
            name: "File Name",
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "upload_file",
            name: "Upload File",
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
              var project_documents_source_data_array = [];
              var project_documents_source_data = {
                doc_type: modal_data.inputs[0].value, file_name: modal_data.inputs[1].value,
                upload_file: modal_data.inputs[3].value
              };


              project_documents_source_data_array.push(project_documents_source_data);

              if (this.project_documents_source_length == 0)
                this.project_documents_source.load(project_documents_source_data_array);

              else
                this.project_documents_source.add(project_documents_source_data);

              this.project_documents_source_length++;

              this.project_documents_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'real_est') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.AddRealEstate'),

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "select",
            value: this.ownersListNames,
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

              var real_estate_source_data_array = [];

              var real_estate_source_data = {};

              var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);


              var propertyType = this.property_type_list.find((o) => o.DescAr == modal_data.inputs[2].selected|| o.Desc == modal_data.inputs[2].selected);

              var country = this.country_list.find((o) => o.DescAr == modal_data.inputs[4].selected|| o.Name == modal_data.inputs[4].selected);


              real_estate_source_data = {
                Id: selectedOwner.Id, AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected, PropertyType: propertyType.Id,
                propertyTypeDesc: modal_data.inputs[1].value, titleDeed: modal_data.inputs[3].value, Country: country.Code, City: modal_data.inputs[5].selected, Location: modal_data.inputs[6].value,
                Area: modal_data.inputs[7].value, PurchasePrice: parseFloat(modal_data.inputs[8].value).toFixed(4), PurchaseDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[9].value),
                MarketValue: parseFloat(modal_data.inputs[10].value).toFixed(4), MarketDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[11].value), Operation: "C",
                GuiId: this.commonService.returnRandomNumber()
              };

              real_estate_source_data_array.push(real_estate_source_data);

              var post_data = {
                "CustomerId": "",
                "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                "Orgin": "CP",
                "Id": this.inputs.PrqId,
                "OperationType": "ESTA",
                "AssetRealEstate": real_estate_source_data_array
              };

              this.projInfoService.postProjectAssetInformation(post_data)
                .then((res) => (this.onRealEstatePost(res, real_estate_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'list_comp') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.AddCompanies'),

        api: "owner_micro",

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "select",
            value: this.ownersListNames,
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

              var list_companies_source_data = {};

              var list_companies_source_data_array = [];

              var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);
  
              list_companies_source_data = {
                AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected, Id: selectedOwner.Id,
                CompanyName: modal_data.inputs[1].value,
                SharePercentage: parseFloat(modal_data.inputs[2].value).toFixed(4), ShareValue: parseFloat(modal_data.inputs[3].value).toFixed(4), IndustrialLicense: modal_data.inputs[4].value,
                CrNumber: modal_data.inputs[4].value,
                IssueDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(modal_data.inputs[5].value), Operation: "C",
                GuiId: this.commonService.returnRandomNumber()
              };

              list_companies_source_data_array.push(list_companies_source_data);

              var post_data = {
                "CustomerId": "",
                "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                "Orgin": "CP",
                "Id": this.inputs.PrqId,
                "OperationType": "COMP",
                "AssetShares": list_companies_source_data_array
              };

              this.projInfoService.postProjectAssetInformation(post_data)
                .then((res) => (this.onCompaniesPost(res, list_companies_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'other_inv') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.AddOtherInvestments'),

        form_number: 1,

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
            type: "select",
            value: this.ownersListNames,
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
            id: "InvestmentType",
            name: this.translate.instant('PROJECT_INFORMATION.InvestmentType'),
            type: "select",
            value: this.investment_type_desc_list,
            selected: "",
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

              var other_investments_source_data = {};

              var other_investments_source_data_array = [];

              var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);

              other_investments_source_data = {
                Id: selectedOwner.Id, AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected,
                InvestTypeDesc: modal_data.inputs[1].value, InvestmentType: modal_data.inputs[2].selected, InvestmentValue: modal_data.inputs[3].value,
                Quantity: modal_data.inputs[4].value,
                MarketPrice: modal_data.inputs[5].value, TotMarkPrice: modal_data.inputs[6].value,
                Operation: "C", GuiId: this.commonService.returnRandomNumber()
              };

              var investmentType = this.investment_type_list.find((o) => o.DescAr == other_investments_source_data["InvestmentType"]|| o.Desc == other_investments_source_data["InvestmentType"]);
              if (investmentType)
                other_investments_source_data["InvestmentType"] = investmentType.Id;

              other_investments_source_data_array.push(other_investments_source_data);

              var post_data = {
                "CustomerId": "",
                "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                "Orgin": "CP",
                "Id": this.inputs.PrqId,
                "OperationType": "INVE",
                "AssetOtherInvestments": other_investments_source_data_array
              };

              this.projInfoService.postProjectAssetInformation(post_data)
                .then((res) => (this.onOtherInvestmentsPost(res, other_investments_source_data, modal_data, "add", "", projectOwnershipModal)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'curr_vitae') {

      projectOwnershipModalParams = {

        header: "Add  curriculum Vitae of Owners / Shareholders / Guarantor",

        inputs: [
          {
            id: "name_own",
            name: "Name of Owner / Shareholder",
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "curr_vitae",
            name: this.translate.instant('PROJECT_INFORMATION.CurriculumVitae'),
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
              var curriculum_vitae_source_data_array = [];
              var curriculum_vitae_source_data = { name_own: modal_data.inputs[0].value, curr_vitae: modal_data.inputs[1].value };


              curriculum_vitae_source_data_array.push(curriculum_vitae_source_data);

              if (this.curriculum_vitae_source_length == 0)
                this.curriculum_vitae_source.load(curriculum_vitae_source_data_array);

              else
                this.curriculum_vitae_source.add(curriculum_vitae_source_data);

              this.curriculum_vitae_source_length++;

              this.curriculum_vitae_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'prop_loan_guar') {

      projectOwnershipModalParams = {

        header: "Add Proposed Loan Guarantees",

        inputs: [
          {
            id: "name_own",
            name: "Name of Owner / Shareholder",
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "nationality",
            name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "postion",
            name: this.translate.instant('PROJECT_INFORMATION.Position'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "guar_perc",
            name: this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage'),
            type: "number",
            value: "",
            required: "true",
          },
          {
            id: "guar_type",
            name: "Guarantee Type",
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
              var proposed_loan_source_data_array = [];
              // "name_own": "A", "nationality": "B", "postion": "C", "guar_perc": "D", "guar_type": "E"
              var proposed_loan_source_data = {
                name_own: modal_data.inputs[0].value, nationality: modal_data.inputs[1].value,
                postion: modal_data.inputs[2].value, guar_perc: parseFloat(modal_data.inputs[3].value).toFixed(4), guar_type: modal_data.inputs[4].value
              };


              proposed_loan_source_data_array.push(proposed_loan_source_data);

              if (this.proposed_loan_source_length == 0)
                this.proposed_loan_source.load(proposed_loan_source_data_array);

              else
                this.proposed_loan_source.add(proposed_loan_source_data);

              this.proposed_loan_source_length++;

              this.proposed_loan_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'bank_info') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.AddBankDetails'),

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.AccountHolderName'),
            type: "select",
            value: this.nonSaudiOwnersListNames,
            selected: "",
            required: "true"
          },
          {
            id: "AccountNumber",
            name: this.translate.instant('PROJECT_INFORMATION.BankAccountNumber'),
            type: "number_no_decimal",
            value: "",
            required: "true"
          },
          {
            id: "BankName",
            name: this.translate.instant('PROJECT_INFORMATION.BankName'),
            type: "text",
            value: "",
            required: "true"
          },
          {
            id: "RepName",
            name: this.translate.instant('PROJECT_INFORMATION.RepresentativeName'),
            type: "text",
            value: "",
            required: "true"
          },
          {
            id: "RepPos",
            name: this.translate.instant('PROJECT_INFORMATION.BankRepresentativePosition'),
            type: "text",
            value: "",
            required: "true"
          },
          {
            id: "RepMail",
            name: this.translate.instant('PROJECT_INFORMATION.RepresentativeEmailId'),
            type: "email",
            value: "",
            required: "true"
          },
          {
            id: "RepMobile",
            name: this.translate.instant('PROJECT_INFORMATION.RepresentativeMobileNumber'),
            type: "text",
            value: "",
            required: "true"
          },
          {
            id: "Branch",
            name: this.translate.instant('PROJECT_INFORMATION.Branch'),
            type: "text",
            value: "",
            required: "true"
          },
          {
            id: "City",
            name: this.translate.instant('PROJECT_INFORMATION.City'),
            type: "text",
            value: "",
            required: "true"
          },
          {
            id: "Country",
            name: this.translate.instant('PROJECT_INFORMATION.Country'),
            type: "select",
            value: this.country_name_list,
            selected: "",
            required: "true"
          },
          {
            id: "Address",
            name: this.translate.instant('PROJECT_INFORMATION.Address'),
            type: "textarea",
            value: "",
            required: "true"
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);

              var bank_details_source_data_array = [];

              var bank_details_source_data = {
                Id: selectedOwner.Id, AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected, AccountNumber: modal_data.inputs[1].value, BankName: modal_data.inputs[2].value,
                RepName: modal_data.inputs[3].value, RepPos: modal_data.inputs[4].value, RepMail: modal_data.inputs[5].value, RepMobile: modal_data.inputs[6].value, Branch: modal_data.inputs[7].value,
                City: modal_data.inputs[8].value, Country: modal_data.inputs[9].selected, Address: modal_data.inputs[10].value, updStatus: "C"
              };

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

                this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

              });

              this.startedFilling = 1;

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'kpmr') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.AddKeyProfessionalManagementResources'),

        inputs: [
          {
            id: "BpPosition",
            name: this.translate.instant('PROJECT_INFORMATION.Position'),
            type: "select",
            value: this.position_desc_list,
            selected: "",
            required: "true",
          },
          {
            id: "FirstName",
            name: this.translate.instant('PROJECT_INFORMATION.FirstName'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "LastName",
            name: this.translate.instant('PROJECT_INFORMATION.LastName'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "MiddleName",
            name: this.translate.instant('PROJECT_INFORMATION.MiddleName'),
            type: "text",
            value: "",
            required: "false",
          },
          {
            id: "DateOfJoining",
            name: this.translate.instant('PROJECT_INFORMATION.DateofJoining'),
            type: "greg_date",
            value: "",
            required: "true",
          },
          {
            id: "Nationality",
            name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
            type: "select",
            value: this.country_name_list,
            selected: "",
            required: "true",
          },
          {
            id: "Degree",
            name: this.translate.instant('PROJECT_INFORMATION.Degree'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "ProfCert",
            name: this.translate.instant('PROJECT_INFORMATION.ProfessionalCertificate'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "YearExp",
            name: this.translate.instant('PROJECT_INFORMATION.YearsofExperience'),
            type: "number",
            value: "",
            required: "true",
          },
          {
            id: "YearOverExp",
            name: this.translate.instant('PROJECT_INFORMATION.OverallExperience'),
            type: "number",
            value: "",
            required: "true",
          },
          {
            id: "CurriculumVitae",
            name: this.translate.instant('PROJECT_INFORMATION.CurriculumVitae'),
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

              var data = {
                documentDefId: 121,
                entityId: this.requestId,
                entityName: "Project",
                RelatedEntityId: this.commonService.returnRandomNumber(),
                RelatedEntityName: "bpManagement",
                operationType: "l"
              };

              this.spinnerService.show();

              this.communicationsService.uploadDocumentService(modal_data.inputs[10].file, data)
                .then(requests => (this.onKPMRTableUpload(requests, modal_data, "add", "", data.RelatedEntityId)), err => this.resolveError());

            }
          }
        ]
      };

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    if (table_name === 'source_of_finance_cofinancer') {

      var total_guar_percent = 0;

      var source_of_finance_temp_source = [];

      this.source_of_finance_source.getAll().then((res) => {

        source_of_finance_temp_source = res;

        for (var i = 0; i < source_of_finance_temp_source.length; i++)
          total_guar_percent += parseFloat(source_of_finance_temp_source[i].Percent);

        if (total_guar_percent == 100)
          this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.TotalGuaranteePercentage'));

        else {

          projectOwnershipModalParams = {

            header: this.translate.instant('PROJECT_INFORMATION.AddGuarantors'),

            filter: false,

            form_number: 1,

            total_guar_percent: total_guar_percent,

            inputs: [
              {
                id: "Externalid",
                name: this.translate.instant('PROJECT_INFORMATION.IdNumber'),
                type: "text",
                value: "",
                required: "true",
                form_number: 1,
              },
              {
                id: "Percent",
                name: this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage'),
                type: "number",
                value: "",
                required: "true",
                form_number: 2,
              },
              {
                id: "Position",
                name: this.translate.instant('PROJECT_INFORMATION.Position'),
                type: "select",
                value: this.position_desc_list,
                selected: "",
                required: "true",
                form_number: 2,
              },
              {
                id: "Type",
                name: this.translate.instant('PROJECT_INFORMATION.TypeofGuarantee'),
                type: "select",
                value: this.CofinsType_Desc_list,
                selected: "",
                required: "true",
                form_number: 2,
              },
              {
                id: "attachments",
                name: this.translate.instant('PROJECT_INFORMATION.Attachments'),
                type: "file_multiple",
                file: "",
                required: "false",
                form_number: 2,
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Next'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var TypeId_typecode = "", position_code = "";

                  var source_of_finance_source_data = {
                    Externalid: modal_data.inputs[0].value, Percent: parseFloat(modal_data.inputs[1].value).toFixed(4),
                    Position: modal_data.inputs[2].selected,
                    Type: modal_data.inputs[3].selected, Operation: "C"
                  };

                  var Position1 = this.position_list.find((o) => o.DescAr === modal_data.inputs[2].selected|| o.Desc === modal_data.inputs[2].selected);
                  if (Position1)
                    position_code = Position1.Id;

                  var cofin_type = this.CofinsType_list.find((o) => o.DescAr === modal_data.inputs[3].selected||o.Desc === modal_data.inputs[3].selected);
                  if (cofin_type)
                    TypeId_typecode = cofin_type.Id;

                  var source_of_finance_final_post_data = {

                    "Guarantors": [{

                      "_comment": "The below financing plan id is the loan id inputted in technical section under loan id field",
                      "Projectid": this.inputs.SentReqId,
                      "Externalid": modal_data.inputs[0].value,
                      "Percent": parseFloat(modal_data.inputs[1].value).toFixed(4),
                      "Type": { "Id": TypeId_typecode },
                      "Position": { "Id": position_code },
                      "Operation": "C"

                    }]

                  };

                  this.projInfoService
                    .postGuarantors(source_of_finance_final_post_data)
                    .then((res) => (this.postGuarantors(res, source_of_finance_source_data, modal_data, "add", "")), err => this.resolveError());

                }
              }
            ]
          };

          let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

        }

      });

    }

    // if (table_name === 'source_of_finance_new_partner') {

    //   projectOwnershipModalParams = {

    //     header: this.translate.instant('PROJECT_INFORMATION.AddNewPartner'),

    //     filter: false,

    //     inputs: [

    //       {
    //         id: "Externalid",
    //         name: this.translate.instant('PROJECT_INFORMATION.IdNumber'),
    //         type: "number",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Extidtype",
    //         name: this.translate.instant('PROJECT_INFORMATION.IdType'),
    //         type: "select",
    //         value: this.ExtidType_Desc_list,
    //         selected: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Firstname",
    //         name: this.translate.instant('PROJECT_INFORMATION.FirstName'),
    //         type: "text",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Lastname",
    //         name: this.translate.instant('PROJECT_INFORMATION.LastName'),
    //         type: "text",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Street",
    //         name: this.translate.instant('PROJECT_INFORMATION.Street'),
    //         type: "text",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Area",
    //         name: this.translate.instant('PROJECT_INFORMATION.Area'),
    //         type: "text",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "City",
    //         name: this.translate.instant('PROJECT_INFORMATION.City'),
    //         type: "text",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Country",
    //         name: this.translate.instant('PROJECT_INFORMATION.Country'),
    //         type: "select",
    //         value: this.country_name_list,
    //         selected: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Zip",
    //         name: this.translate.instant('PROJECT_INFORMATION.PostalCode'),
    //         type: "number",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Phone1",
    //         name: this.translate.instant('PROJECT_INFORMATION.PhoneNumber'),
    //         type: "number",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Fax",
    //         name: this.translate.instant('PROJECT_INFORMATION.FaxNumber'),
    //         type: "number",
    //         value: "",
    //         required: "true",
    //       },
    //       {
    //         id: "Mail",
    //         name: this.translate.instant('PROJECT_INFORMATION.EmailId'),
    //         type: "email",
    //         value: "",
    //         required: "true",
    //       }
    //     ],
    //     buttons: [
    //       {
    //         name: this.translate.instant('COMMON.Save'),
    //         type: "button",
    //         class: "btn-success",

    //         handler: (modal_data) => {

    //           var extidtype_desc = "", country_desc = "";

    //           var extidtype_list = this.ExtidType_list.find((o) => o.Desc === modal_data.inputs[1].selected);
    //           if (extidtype_list)
    //             extidtype_desc = extidtype_list.Id;

    //           var country_list = this.country_list.find((o) => o.Name === modal_data.inputs[7].selected);
    //           if (country_list)
    //             country_desc = country_list.Code;

    //           var source_of_finance_new_partner_source_data_array = {};

    //           var relations_source_data = { Externalidp: this.inputs.FactoryCr, Operation: "C", Relationtype: "SIDF04" };

    //           var source_of_finance_new_partner_source_data = {
    //             Externalid: modal_data.inputs[0].value, Extidtype: extidtype_desc, Firstname: modal_data.inputs[2].value, Lastname: modal_data.inputs[3].value, Street: modal_data.inputs[4].value,
    //             Area: modal_data.inputs[5].value, City: modal_data.inputs[6].value, Country: country_desc, Zip: modal_data.inputs[8].value, Phone1: modal_data.inputs[9].value, Fax: modal_data.inputs[10].value,
    //             Mail: modal_data.inputs[11].value, Relations: [relations_source_data], Operation: "C"
    //           };

    //           source_of_finance_new_partner_source_data_array = source_of_finance_new_partner_source_data;

    //           // this.source_of_finance_new_partner_source.load(source_of_finance_new_partner_source_data_array);

    //           //create NEW PARTNER 

    //           this.loanApplicationService
    //             .createBpRelation(source_of_finance_new_partner_source_data_array)
    //             .then((res) => (this.postcofinancier(res)), err => this.resolveError());

    //           //this.source_of_finance_source_length++;

    //           //this.commonService.showSuccessToast("Addition successful !");

    //         }
    //       }
    //     ]
    //   };

    //   let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    //   projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    // }

  }

  onRealEstatePost(result, real_estate_source_data, modal_data, method, event, projectOwnershipModal) {

    if (result.MessType == "S") {

      if (method == "add" || method == "edit") {

        real_estate_source_data["Sequence"] = result.AssetRealEstate[0].Sequence;

        var data = {
          documentDefId: 121,
          entityId: this.inputs.PrqId,
          entityName: "Project",
          RelatedEntityId: real_estate_source_data.GuiId,
          RelatedEntityName: "Reference",
          operationType: "p"
        };

        if (method == "add")
          this.communicationsService.uploadDocumentService(modal_data.inputs[12].file, data)
            .then(requests => (this.onRealEstateTableUpload(requests, real_estate_source_data, method, event, projectOwnershipModal)), err => this.resolveError());

        else if (method == "edit") {

          var temp_array = [];

          for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
            if (!(parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(event.data.GuiId)))
              temp_array.push(this.realEstateTableDocuments.documentList[i]);

          for (var i = 0; i < modal_data.documents.documentList.length; i++)
            temp_array.push(modal_data.documents.documentList[i]);

          this.realEstateTableDocuments.documentList = temp_array;

          if (modal_data.inputs[12].file && modal_data.inputs[12].file != "")
            this.communicationsService.uploadDocumentService(modal_data.inputs[12].file, data)
              .then(requests => (this.onRealEstateTableUpload(requests, real_estate_source_data, method, event, projectOwnershipModal)), err => this.resolveError());

          else
            this.onRealEstateTableUploadDataBind(real_estate_source_data, method, event, projectOwnershipModal);

        }

      }

      else if (method == "delete") {

        this.real_estate_source.remove(this.deleteCancelModalReference.event.data);

        this.real_estate_source.refresh();

        this.real_estate_source_length--;

        if (this.realEstateTableDocuments.documentList.length > 0)
          for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
            if (parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(this.deleteCancelModalReference.event.data.GuiId)) {

              this.communicationsService.deleteDocumentService
                ({
                  entityId: this.realEstateTableDocuments.documentList[i].EntityId, refId: this.realEstateTableDocuments.documentList[i].RefId,
                  documentId: this.realEstateTableDocuments.documentList[i].DocumentId, operationType: 'p'
                })
                .then(response => (response), err => err);

              this.onDeleteConfirmRealEstate(i);

            }

        this.spinnerService.hide();

      }

    }

    else {

      this.commonService.showFailureToast(result.MessText);
      this.spinnerService.hide();

    }

  }

  onCompaniesPost(result, list_companies_source_data, modal_data, method, event, projectOwnershipModal) {

    if (result.MessType == "S") {

      if (method == "add" || method == "edit") {

        list_companies_source_data["Sequence"] = result.AssetShares[0].Sequence;

        var data = {
          documentDefId: 121,
          entityId: this.inputs.PrqId,
          entityName: "Project",
          RelatedEntityId: list_companies_source_data.GuiId,
          RelatedEntityName: "Reference",
          operationType: "p"
        };

        if (method == "add")
          this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
            .then(requests => (this.onListOfCompaniesTableUpload(requests, list_companies_source_data, method, event, projectOwnershipModal)), err => this.resolveError());

        else if (method == "edit") {

          var temp_array = [];

          for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
            if (!(parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(event.data.GuiId)))
              temp_array.push(this.listOfCompaniesTableDocuments.documentList[i]);

          for (var i = 0; i < modal_data.documents.documentList.length; i++)
            temp_array.push(modal_data.documents.documentList[i]);

          this.listOfCompaniesTableDocuments.documentList = temp_array;

          if (modal_data.inputs[6].file && modal_data.inputs[6].file != "")
            this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
              .then(requests => (this.onListOfCompaniesTableUpload(requests, list_companies_source_data, method, event, projectOwnershipModal)), err => this.resolveError());

          else
            this.onListOfCompaniesTableUploadDataBind(list_companies_source_data, method, event, projectOwnershipModal);

        }

      }

      else if (method == "delete") {

        this.list_companies_source.remove(this.deleteCancelModalReference.event.data);

        this.list_companies_source.refresh();

        this.list_companies_source_length--;

        if (this.listOfCompaniesTableDocuments.documentList.length > 0)
          for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
            if (parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(this.deleteCancelModalReference.event.data.GuiId)) {

              this.communicationsService.deleteDocumentService
                ({
                  entityId: this.listOfCompaniesTableDocuments.documentList[i].EntityId, refId: this.listOfCompaniesTableDocuments.documentList[i].RefId,
                  documentId: this.listOfCompaniesTableDocuments.documentList[i].DocumentId, operationType: 'p'
                })
                .then(response => (response), err => err);

              this.onDeleteConfirmListOfCompanies(i);

            }

        this.spinnerService.hide();

      }

    }

    else {

      this.commonService.showFailureToast(result.MessText);
      this.spinnerService.hide();

    }

  }

  onOtherInvestmentsPost(result, other_investments_source_data, modal_data, method, event, projectOwnershipModal) {

    if (result.MessType == "S") {

      if (method == "add" || method == "edit") {

        other_investments_source_data["Sequence"] = result.AssetOtherInvestments[0].Sequence;

        var data = {
          documentDefId: 121,
          entityId: this.inputs.PrqId,
          entityName: "Project",
          RelatedEntityId: other_investments_source_data.GuiId,
          RelatedEntityName: "Reference",
          operationType: "p"
        };

        if (method == "add")
          this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
            .then(requests => (this.onOtherInvestmentsTableUpload(requests, other_investments_source_data, method, event, projectOwnershipModal)), err => this.resolveError());

        else if (method == "edit") {

          var temp_array = [];

          for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
            if (!(parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(event.data.GuiId)))
              temp_array.push(this.otherInvestmentsTableDocuments.documentList[i]);

          for (var i = 0; i < modal_data.documents.documentList.length; i++)
            temp_array.push(modal_data.documents.documentList[i]);

          this.otherInvestmentsTableDocuments.documentList = temp_array;

          if (modal_data.inputs[7].file && modal_data.inputs[7].file != "")
            this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
              .then(requests => (this.onOtherInvestmentsTableUpload(requests, other_investments_source_data, method, event, projectOwnershipModal)), err => this.resolveError());

          else
            this.onOtherInvestmentsTableUploadDataBind(other_investments_source_data, method, event, projectOwnershipModal);

        }

      }

      else if (method == "delete") {

        this.other_investments_source.remove(this.deleteCancelModalReference.event.data);

        this.other_investments_source.refresh();

        this.other_investments_source_length--;

        if (this.otherInvestmentsTableDocuments.documentList.length > 0)
          for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
            if (parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(this.deleteCancelModalReference.event.data.GuiId)) {

              this.communicationsService.deleteDocumentService
                ({
                  entityId: this.otherInvestmentsTableDocuments.documentList[i].EntityId, refId: this.otherInvestmentsTableDocuments.documentList[i].RefId,
                  documentId: this.otherInvestmentsTableDocuments.documentList[i].DocumentId, operationType: 'p'
                })
                .then(response => (response), err => err);

              this.onDeleteConfirmOtherInvestments(i);

            }

        this.spinnerService.hide();

      }

    }

    else {

      this.commonService.showFailureToast(result.MessText);
      this.spinnerService.hide();

    }

  }

  onEdit(event, table_name) {

    let projectOwnershipModalParams = {};

    if (table_name != 'source_of_finance_cofinancer') {

      if (table_name === 'proj_own') {

        projectOwnershipModalParams = {

          header: "Edit Project Ownership",

          inputs: [
            {
              id: "name_own",
              name: "Name of Owner / Shareholder",
              type: "text",
              value: event.data.name_own,
              required: "true",
            },
            {
              id: "legaleont_ind_llc",
              name: "Legal Entity / Individual / LLC",
              type: "text",
              value: event.data.legaleont_ind_llc,
              required: "true",
            },
            {
              id: "nationality",
              name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
              type: "text",
              value: event.data.nationality,
              required: "true",
            },
            {
              id: "shareholding",
              name: "Shareholding (Percentage)",
              type: "number",
              value: parseFloat(event.data.shareholding).toFixed(4),
              required: "true",
            },
            {
              id: "id_typ",
              name: this.translate.instant('PROJECT_INFORMATION.IdTypeOrCommercialRegister'),
              type: "text",
              value: event.data.id_typ,
              required: "true",
            },
            {
              id: "addr",
              name: this.translate.instant('PROJECT_INFORMATION.Address'),
              type: "text",
              value: event.data.addr,
              required: "true",
            },
            {
              id: "tel_no",
              name: this.translate.instant('PROJECT_INFORMATION.TelephoneNumber'),
              type: "text",
              value: event.data.tel_no,
              required: "true",
            },
            {
              id: "fax_no",
              name: this.translate.instant('PROJECT_INFORMATION.FaxNumber'),
              type: "text",
              value: event.data.fax_no,
              required: "true",
            },
            {
              id: "mob_no",
              name: "Mobile Number",
              type: "text",
              value: event.data.mob_no,
              required: "true",
            },
            {
              id: "email_id",
              name: this.translate.instant('PROJECT_INFORMATION.EmailId'),
              type: "email",
              value: event.data.email_id,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var project_ownership_source_data = {
                  name_own: modal_data.inputs[0].selected, legaleont_ind_llc: modal_data.inputs[1].value, nationality: modal_data.inputs[2].value,
                  shareholding: parseFloat(modal_data.inputs[3].value).toFixed(4),
                  id_typ: modal_data.inputs[4].value, addr: modal_data.inputs[5].value, tel_no: modal_data.inputs[6].value,
                  fax_no: modal_data.inputs[7].value, mob_no: modal_data.inputs[8].value, email_id: modal_data.inputs[9].value
                };

                this.project_ownership_source.update(event.data, project_ownership_source_data);

                this.project_ownership_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

              }
            }
          ]
        };
      }

      else if (table_name === 'proj_doc') {

        projectOwnershipModalParams = {

          header: "Edit Project Ownership",

          inputs: [
            {
              id: "doc_type",
              name: "Document Type",
              type: "text",
              value: event.data.doc_type,
              required: "true",
            },
            {
              id: "file_name",
              name: "File Name",
              type: "text",
              value: event.data.file_name,
              required: "true",
            },
            {
              id: "upload_file",
              name: "Upload File",
              type: "text",
              value: event.data.upload_file,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var project_ownership_source_data = {
                  doc_type: modal_data.inputs[0].value, file_name: modal_data.inputs[1].value,
                  upload_file: modal_data.inputs[2].value
                };


                this.project_ownership_source.update(event.data, project_ownership_source_data);

                this.project_ownership_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

              }
            }
          ]
        };
      }

      else if (table_name === 'real_est') {

        var temp_key = "";

        var temp_array = [];

        for (var i = 0; i < this.country_list.length; i++)
          if (this.country_list[i].Name === event.data.Country)
            temp_key = this.country_list[i].Code;

        for (var i = 0; i < this.city_list.length; i++)
          if (this.city_list[i].Country === temp_key)
            temp_array.push(this.city_list[i].City);


        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.realEstateTableDocuments.url;

        for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
          if (parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.GuiId))
            temp_documents.documentList.push(this.realEstateTableDocuments.documentList[i]);

        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditRealEstate'),

          documents: temp_documents,

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: this.ownersListNames,
              selected: event.data.Name,
              required: "true",
            },
            {
              id: "Description",
              name: this.translate.instant('PROJECT_INFORMATION.Description'),
              type: "text",
              value: event.data.propertyTypeDesc,
              required: "true",
            },
            {
              id: "PropertyType",
              name: this.translate.instant('PROJECT_INFORMATION.PropertyType'),
              type: "select",
              value: this.property_type_desc_list,
              selected: event.data.PropertyType,
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
              selected: event.data.Country,
              dropdown: this.country_list,
              required: "true",
            },
            {
              id: "City",
              name: this.translate.instant('PROJECT_INFORMATION.City'),
              type: "select",
              value: temp_array,
              selected: event.data.City,
              dropdown: this.city_list,
              required: "true",
            },
            {
              id: "Location",
              name: this.translate.instant('PROJECT_INFORMATION.Location'),
              type: "text",
              value: event.data.Location,
              required: "true",
            },
            {
              id: "Area",
              name: this.translate.instant('PROJECT_INFORMATION.Area'),
              type: "text",
              value: event.data.Area,
              required: "true",
            },
            {
              id: "PurchasePrice",
              name: this.translate.instant('PROJECT_INFORMATION.PurchasePrice'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.PurchasePrice.replace('SAR ', "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "PurchaseDate",
              name: this.translate.instant('PROJECT_INFORMATION.PurchaseDate'),
              type: "greg_date",
              value: this.commonService.returnGregDateStringFromDateArray(event.data.PurchaseDate),
              required: "true",
            },
            {
              id: "MarketValue",
              name: this.translate.instant('PROJECT_INFORMATION.MarketValue'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.MarketValue.replace('SAR ', "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "MarketDate",
              name: this.translate.instant('PROJECT_INFORMATION.MarketValuationDate'),
              type: "greg_date",
              value: this.commonService.returnGregDateStringFromDateArray(event.data.MarketDate),
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

                var real_estate_source_data = {};

                var real_estate_source_data_array = [];

                var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);


                var propertyType = this.property_type_list.find((o) => o.DescAr == modal_data.inputs[2].selected||o.Desc == modal_data.inputs[2].selected);

                var country = this.country_list.find((o) => o.DescAr == modal_data.inputs[4].selected||o.Name == modal_data.inputs[4].selected);


                real_estate_source_data = {
                  Id: selectedOwner.Id, AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected, PropertyType: propertyType.Id,
                  propertyTypeDesc: modal_data.inputs[1].value, titleDeed: modal_data.inputs[3].value, Country: country.Code, City: modal_data.inputs[5].selected, Location: modal_data.inputs[6].value,
                  Area: modal_data.inputs[7].value, PurchasePrice: parseFloat(modal_data.inputs[8].value).toFixed(4), PurchaseDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[9].value),
                  MarketValue: parseFloat(modal_data.inputs[10].value).toFixed(4), MarketDate: this.commonService.returnDateStringWithoutHyphenFromGregDateString(modal_data.inputs[11].value), Operation: "U",
                  GuiId: event.data.GuiId ? event.data.GuiId : this.commonService.returnRandomNumber(), Sequence: event.data.Sequence
                };

                real_estate_source_data_array.push(real_estate_source_data);

                var post_data = {
                  "CustomerId": "",
                  "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                  "Orgin": "CP",
                  "Id": this.inputs.PrqId,
                  "OperationType": "ESTA",
                  "AssetRealEstate": real_estate_source_data_array
                };

                this.projInfoService.postProjectAssetInformation(post_data)
                  .then((res) => (this.onRealEstatePost(res, real_estate_source_data, modal_data, "edit", event, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };
      }

      else if (table_name === 'list_comp') {

        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.listOfCompaniesTableDocuments.url;

        for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
          if (parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.GuiId))
            temp_documents.documentList.push(this.listOfCompaniesTableDocuments.documentList[i]);

        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditCompanies'),

          api: "owner_micro",

          documents: temp_documents,

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: this.ownersListNames,
              selected: event.data.Name,
              required: "true",
            },
            {
              id: "CompanyName",
              name: this.translate.instant('PROJECT_INFORMATION.CompanyOrEstablishmentName'),
              type: "text",
              value: event.data.CompanyName,
              required: "true",
            },
            {
              id: "SharePercentage",
              name: this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage'),
              type: "number",
              value: parseFloat(event.data.SharePercentage).toFixed(4),
              required: "true",
            },
            {
              id: "ShareValue",
              name: this.translate.instant('PROJECT_INFORMATION.ShareholdingValue'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.ShareValue.replace("SAR ", "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "IndustrialLicense",
              name: this.translate.instant('PROJECT_INFORMATION.CommercialRegistrationNumber'),
              type: "number_no_decimal",
              value: parseFloat(event.data.CrNumber).toFixed(0),
              required: "true",
            },
            {
              id: "IssueDate",
              name: this.translate.instant('PROJECT_INFORMATION.IssueDate'),
              type: "hijri_date",
              value: event.data.IssueDate,
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

                var list_companies_source_data = {};

                var list_companies_source_data_array = [];

                var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);

                list_companies_source_data = {
                  AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected, Id: selectedOwner.Id,
                  CompanyName: modal_data.inputs[1].value,
                  SharePercentage: parseFloat(modal_data.inputs[2].value).toFixed(4),
                  ShareValue: modal_data.inputs[3].value,
                  IndustrialLicense: modal_data.inputs[4].value, CrNumber: modal_data.inputs[4].value, IssueDate: this.commonService.returnDateStringWithoutHyphenFromDateArray(modal_data.inputs[5].value),
                  Operation: "U",
                  GuiId: event.data.GuiId ? event.data.GuiId : this.commonService.returnRandomNumber(), Sequence: event.data.Sequence
                };

                list_companies_source_data_array.push(list_companies_source_data);

                var post_data = {
                  "CustomerId": "",
                  "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                  "Orgin": "CP",
                  "Id": this.inputs.PrqId,
                  "OperationType": "COMP",
                  "AssetShares": list_companies_source_data_array
                };

                this.projInfoService.postProjectAssetInformation(post_data)
                  .then((res) => (this.onCompaniesPost(res, list_companies_source_data, modal_data, "edit", event, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };

      }

      else if (table_name === 'other_inv') {

        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.otherInvestmentsTableDocuments.url;

        for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
          if (parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.GuiId))
            temp_documents.documentList.push(this.otherInvestmentsTableDocuments.documentList[i]);

        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditOtherInvestments'),

          documents: temp_documents,

          form_number: 1,

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.OwnerOrShareholderName'),
              type: "select",
              value: this.ownersListNames,
              selected: event.data.Name,
              required: "true",
              form_number: 1,
            },
            {
              id: "Description",
              name: this.translate.instant('PROJECT_INFORMATION.Description'),
              type: "text",
              value: event.data.InvestTypeDesc,
              required: "true",
              form_number: 1,
            },
            {
              id: "InvestmentType",
              name: this.translate.instant('PROJECT_INFORMATION.InvestmentType'),
              type: "select",
              value: this.investment_type_desc_list,
              selected: event.data.InvestmentType,
              required: "true",
              form_number: 1,
            },
            {
              id: "InvestmentValue",
              name: this.translate.instant('PROJECT_INFORMATION.Investment'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.InvestmentValue.replace("SAR ", "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
              form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 2 : 1,
            },
            {
              id: "Quantity",
              name: this.translate.instant('PROJECT_INFORMATION.Quantity'),
              type: "number",
              value: parseFloat(event.data.Quantity).toFixed(0),
              required: "true",
              form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
            },
            {
              id: "MarketPrice",
              name: this.translate.instant('PROJECT_INFORMATION.MarketPrice'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.MarketPrice.replace('SAR ', "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
              form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
            },
            {
              id: "TotalMarketValue",
              name: this.translate.instant('PROJECT_INFORMATION.TotalMarketValue'),
              type: "text",
              value: this.commonService.numberWithCommasToNumber(event.data.TotMarkPrice.replace('SAR ', "")),
              required: "true",
              cost: "true",
              currency: "SAR ",
              form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
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

                var other_investments_source_data = {};

                var other_investments_source_data_array = [];

                var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);

                other_investments_source_data = {
                  Id: selectedOwner.Id, AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected,
                  InvestTypeDesc: modal_data.inputs[1].value, InvestmentType: modal_data.inputs[2].selected,
                  InvestmentValue: modal_data.inputs[3].value,
                  Quantity: modal_data.inputs[4].value, MarketPrice: modal_data.inputs[5].value,
                  TotMarkPrice: modal_data.inputs[6].value,
                  Operation: "U",
                  GuiId: event.data.GuiId ? event.data.GuiId : this.commonService.returnRandomNumber(), Sequence: event.data.Sequence
                };

                var investmentType = this.investment_type_list.find((o) => o.DescAr == other_investments_source_data["InvestmentType"]||o.Desc == other_investments_source_data["InvestmentType"]);
                if (investmentType)
                  other_investments_source_data["InvestmentType"] = investmentType.Id;

                other_investments_source_data_array.push(other_investments_source_data);

                var post_data = {
                  "CustomerId": "",
                  "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
                  "Orgin": "CP",
                  "Id": this.inputs.PrqId,
                  "OperationType": "INVE",
                  "AssetOtherInvestments": other_investments_source_data_array
                };

                this.projInfoService.postProjectAssetInformation(post_data)
                  .then((res) => (this.onOtherInvestmentsPost(res, other_investments_source_data, modal_data, "edit", event, projectOwnershipModal)), err => this.resolveError());

              }
            }
          ]
        };

      }

      else if (table_name === 'curr_vitae') {

        projectOwnershipModalParams = {

          header: "Edit  curriculum Vitae of Owners / Shareholders / Guarantor",

          inputs: [
            {
              id: "name_own",
              name: "Name of Owner / Shareholder",
              type: "text",
              value: event.data.name_own,
              required: "true",
            },
            {
              id: "curr_vitae",
              name: " curriculum Vitae",
              type: "text",
              value: event.data.curr_vitae,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var curriculum_vitae_source_data = { name_own: modal_data.inputs[0].value, curr_vitae: modal_data.inputs[1].value };

                this.curriculum_vitae_source.update(event.data, curriculum_vitae_source_data);

                this.curriculum_vitae_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

              }
            }
          ]
        };

      }

      else if (table_name === 'prop_loan_guar') {

        projectOwnershipModalParams = {

          header: "Edit  Proposed Loan Guarantees",

          inputs: [
            {
              id: "name_own",
              name: "Name of Owner / Shareholder",
              type: "text",
              value: event.data.name_own,
              required: "true",
            },
            {
              id: "nationality",
              name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
              type: "text",
              value: event.data.nationality,
              required: "true",
            },
            {
              id: "postion",
              name: this.translate.instant('PROJECT_INFORMATION.Position'),
              type: "text",
              value: event.data.postion,
              required: "true",
            },
            {
              id: "guar_perc",
              name: this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage'),
              type: "number",
              value: parseFloat(event.data.guar_perc).toFixed(4),
              required: "true",
            },
            {
              id: "guar_type",
              name: "Guarantee Type",
              type: "text",
              value: event.data.guar_type,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                // "name_own": "A", "nationality": "B", "postion": "C", "guar_perc": "D", "guar_type": "E"
                var proposed_loan_source_data = {
                  name_own: modal_data.inputs[0].value, nationality: modal_data.inputs[1].value,
                  postion: modal_data.inputs[2].value, guar_perc: parseFloat(modal_data.inputs[3].value).toFixed(4), guar_type: modal_data.inputs[4].value
                };

                this.proposed_loan_source.update(event.data, proposed_loan_source_data);

                this.proposed_loan_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

              }
            }
          ]
        };

      }

      else if (table_name === 'bank_info') {

        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditBankDetails'),

          inputs: [
            {
              id: "Name",
              name: this.translate.instant('PROJECT_INFORMATION.AccountHolderName'),
              type: "select",
              value: this.nonSaudiOwnersListNames,
              selected: event.data.Name,
              required: "true"
            },
            {
              id: "AccountNumber",
              name: this.translate.instant('PROJECT_INFORMATION.BankAccountNumber'),
              type: "number_no_decimal",
              value: event.data.AccountNumber,
              required: "true"
            },
            {
              id: "BankName",
              name: this.translate.instant('PROJECT_INFORMATION.BankName'),
              type: "text",
              value: event.data.BankName,
              required: "true"
            },
            {
              id: "RepName",
              name: this.translate.instant('PROJECT_INFORMATION.RepresentativeName'),
              type: "text",
              value: event.data.RepName,
              required: "true"
            },
            {
              id: "RepPos",
              name: this.translate.instant('PROJECT_INFORMATION.RepresentativePosition'),
              type: "text",
              value: event.data.RepPos,
              required: "true"
            },
            {
              id: "RepMail",
              name: this.translate.instant('PROJECT_INFORMATION.RepresentativeEmailId'),
              type: "email",
              value: event.data.RepMail,
              required: "true"
            },
            {
              id: "RepMobile",
              name: this.translate.instant('PROJECT_INFORMATION.RepresentativeMobileNumber'),
              type: "text",
              value: event.data.RepMobile,
              required: "true"
            },
            {
              id: "Branch",
              name: this.translate.instant('PROJECT_INFORMATION.Branch'),
              type: "text",
              value: event.data.Branch,
              required: "true"
            },
            {
              id: "City",
              name: this.translate.instant('PROJECT_INFORMATION.City'),
              type: "text",
              value: event.data.City,
              required: "true"
            },
            {
              id: "Country",
              name: this.translate.instant('PROJECT_INFORMATION.Country'),
              type: "select",
              value: this.country_name_list,
              selected: event.data.Country,
              required: "true"
            },
            {
              id: "Address",
              name: this.translate.instant('PROJECT_INFORMATION.Address'),
              type: "textarea",
              value: event.data.Address,
              required: "true"
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var selectedOwner = this.ownersList.find((o) => o.Name == modal_data.inputs[0].selected);

                var bank_details_source_data = {
                  Id: selectedOwner.Id, AppId: this.inputs.PrqId, SendReqId: this.inputs.SentReqId, Name: modal_data.inputs[0].selected, AccountNumber: modal_data.inputs[1].value, BankName: modal_data.inputs[2].value,
                  RepName: modal_data.inputs[3].value, RepPos: modal_data.inputs[4].value, RepMail: modal_data.inputs[5].value, RepMobile: modal_data.inputs[6].value, Branch: modal_data.inputs[7].value,
                  City: modal_data.inputs[8].value, Country: modal_data.inputs[9].selected, Address: modal_data.inputs[10].value, updStatus: event.data.updStatus == "C" ? "C" : "U"
                };

                this.bank_details_source.update(event.data, bank_details_source_data);

                this.bank_details_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

                this.startedFilling = 1;

              }
            }
          ]
        };

      }

      else if (table_name === 'kpmr') {

        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.KPMRTableDocuments.url;

        for (var i = 0; i < this.KPMRTableDocuments.documentList.length; i++)
          if (parseInt(this.KPMRTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.GuiId))
            temp_documents.documentList.push(this.KPMRTableDocuments.documentList[i]);

        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditKeyProfessionalManagementResources'),

          documents: temp_documents,

          inputs: [
            {
              id: "BpPosition",
              name: this.translate.instant('PROJECT_INFORMATION.Position'),
              type: "select",
              value: this.position_desc_list,
              selected: event.data.BpPosition,
              required: "true",
            },
            {
              id: "FirstName",
              name: this.translate.instant('PROJECT_INFORMATION.FirstName'),
              type: "text",
              value: event.data.FirstName,
              required: "true",
            },
            {
              id: "LastName",
              name: this.translate.instant('PROJECT_INFORMATION.LastName'),
              type: "text",
              value: event.data.LastName,
              required: "true",
            },
            {
              id: "MiddleName",
              name: this.translate.instant('PROJECT_INFORMATION.MiddleName'),
              type: "text",
              value: event.data.MiddleName,
              required: "false",
            },
            {
              id: "DateOfJoining",
              name: this.translate.instant('PROJECT_INFORMATION.DateofJoining'),
              type: "greg_date",
              value: this.commonService.returnGregDateStringFromDateArray(event.data.DateOfJoining),
              required: "true",
            },
            {
              id: "Nationality",
              name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
              type: "select",
              value: this.country_name_list,
              selected: event.data.Nationality,
              required: "true",
            },
            {
              id: "Degree",
              name: this.translate.instant('PROJECT_INFORMATION.Degree'),
              type: "text",
              value: event.data.Degree,
              required: "true",
            },
            {
              id: "ProfCert",
              name: this.translate.instant('PROJECT_INFORMATION.ProfessionalCertificate'),
              type: "text",
              value: event.data.ProfCert,
              required: "true",
            },
            {
              id: "YearExp",
              name: this.translate.instant('PROJECT_INFORMATION.YearsofExperience'),
              type: "number",
              value: event.data.YearExp,
              required: "true",
            },
            {
              id: "YearOverExp",
              name: this.translate.instant('PROJECT_INFORMATION.OverallExperience'),
              type: "number",
              value: event.data.YearOverExp,
              required: "true",
            },
            {
              id: "CurriculumVitae",
              name: this.translate.instant('PROJECT_INFORMATION.CurriculumVitae'),
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

                var temp_array = [];

                for (var i = 0; i < this.KPMRTableDocuments.documentList.length; i++)
                  if (!(parseInt(this.KPMRTableDocuments.documentList[i].RelatedEntityId) ==
                    parseInt(event.data.GuiId)))
                    temp_array.push(this.KPMRTableDocuments.documentList[i]);

                for (var i = 0; i < modal_data.documents.documentList.length; i++)
                  temp_array.push(modal_data.documents.documentList[i]);

                this.KPMRTableDocuments.documentList = temp_array;

                var data = {
                  documentDefId: 121,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: event.data.GuiId ? event.data.GuiId : this.commonService.returnRandomNumber(),
                  RelatedEntityName: "bpManagement",
                  operationType: "l"
                };

                this.spinnerService.show();

                if (modal_data.inputs[10].file && modal_data.inputs[10].file != "")
                  this.communicationsService.uploadDocumentService(modal_data.inputs[10].file, data)
                    .then(requests => (this.onKPMRTableUpload(requests, modal_data, "edit", event, data.RelatedEntityId)), err => this.resolveError());

                else
                  this.onKPMRTableUploadDataBind(modal_data, "edit", event, data.RelatedEntityId)

              }
            }
          ]
        };

      }

      let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

    }

    else if (table_name === 'source_of_finance_cofinancer') {

      var total_guar_percent = 0;

      var source_of_finance_temp_source = [];

      this.source_of_finance_source.getAll().then((res) => {

        source_of_finance_temp_source = res;

        for (var i = 0; i < source_of_finance_temp_source.length; i++)
          total_guar_percent += parseFloat(source_of_finance_temp_source[i].Percent);

        total_guar_percent = total_guar_percent - event.data.Percent;

        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.guarantorsTableDocuments.url;

        for (var i = 0; i < this.guarantorsTableDocuments.documentList.length; i++)
          if (parseInt(this.guarantorsTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.Externalid))
            temp_documents.documentList.push(this.guarantorsTableDocuments.documentList[i]);

        projectOwnershipModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.EditGuarantors'),

          documents: temp_documents,

          total_guar_percent: total_guar_percent,

          inputs: [
            {
              id: "Externalid",
              name: this.translate.instant('PROJECT_INFORMATION.IdNumber'),
              type: "text_disabled",
              value: event.data.Externalid,
              required: "true",
            },
            {
              id: "Percent",
              name: this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage'),
              type: "number",
              value: parseFloat(event.data.Percent).toFixed(4),
              required: "true",
            },
            {
              id: "Position",
              name: this.translate.instant('PROJECT_INFORMATION.Position'),
              type: "select",
              value: this.position_desc_list,
              selected: event.data.Position,
              required: "true",
            },
            {
              id: "Type",
              name: this.translate.instant('PROJECT_INFORMATION.TypeofGuarantee'),
              type: "select",
              value: this.CofinsType_Desc_list,
              selected: event.data.Type,
              required: "true",
            },
            {
              id: "attachments",
              name: this.translate.instant('PROJECT_INFORMATION.Attachments'),
              type: "file_multiple",
              file: "",
              required: "false",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var TypeId_typecode = "", position_code = "";

                var source_of_finance_source_data = {
                  Externalid: event.data.Externalid, Percent: parseFloat(modal_data.inputs[1].value).toFixed(4),
                  Position: modal_data.inputs[2].selected,
                  Type: modal_data.inputs[3].selected, Operation: "U"
                };

                var Position1 = this.position_list.find((o) => o.DescAr === modal_data.inputs[2].selected||o.Desc === modal_data.inputs[2].selected);
                if (Position1)
                  position_code = Position1.Id;

                var cofin_type = this.CofinsType_list.find((o) => o.DescAr === modal_data.inputs[3].selected||o.Desc === modal_data.inputs[3].selected);
                if (cofin_type)
                  TypeId_typecode = cofin_type.Id;

                var source_of_finance_final_post_data = {

                  "Guarantors": [{

                    "_comment": "The below financing plan id is the loan id inputted in technical section under loan id field",
                    "Projectid": this.inputs.SentReqId,
                    "Externalid": event.data.Externalid,
                    "Percent": parseFloat(modal_data.inputs[1].value).toFixed(4),
                    "Type": { "Id": TypeId_typecode },
                    "Position": { "Id": position_code },
                    "Operation": "U"

                  }]

                };

                this.projInfoService
                  .postGuarantors(source_of_finance_final_post_data)
                  .then((res) => (this.postGuarantors(res, source_of_finance_source_data, modal_data, "edit", event)), err => this.resolveError());

              }
            }
          ]
        };

        let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

      });

    }

  }

  onView(event, table_name) {

    let projectOwnershipModalParams = {};

    if (table_name === 'proj_own') {

      projectOwnershipModalParams = {

        header: "View Project Ownership",

        method: "view",

        inputs: [
          {
            id: "name_own",
            name: "Name of Owner / Shareholder",
            type: "text",
            value: event.data.name_own,
            required: "true",
          },
          {
            id: "legaleont_ind_llc",
            name: "Legal Entity / Individual / LLC",
            type: "text",
            value: event.data.legaleont_ind_llc,
            required: "true",
          },
          {
            id: "nationality",
            name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
            type: "text",
            value: event.data.nationality,
            required: "true",
          },
          {
            id: "shareholding",
            name: "Shareholding (Percentage)",
            type: "number",
            value: parseFloat(event.data.shareholding).toFixed(4),
            required: "true",
          },
          {
            id: "id_typ",
            name: this.translate.instant('PROJECT_INFORMATION.IdTypeOrCommercialRegister'),
            type: "text",
            value: event.data.id_typ,
            required: "true",
          },
          {
            id: "addr",
            name: this.translate.instant('PROJECT_INFORMATION.Address'),
            type: "text",
            value: event.data.addr,
            required: "true",
          },
          {
            id: "tel_no",
            name: this.translate.instant('PROJECT_INFORMATION.TelephoneNumber'),
            type: "text",
            value: event.data.tel_no,
            required: "true",
          },
          {
            id: "fax_no",
            name: this.translate.instant('PROJECT_INFORMATION.FaxNumber'),
            type: "text",
            value: event.data.fax_no,
            required: "true",
          },
          {
            id: "mob_no",
            name: "Mobile Number",
            type: "text",
            value: event.data.mob_no,
            required: "true",
          },
          {
            id: "email_id",
            name: this.translate.instant('PROJECT_INFORMATION.EmailId'),
            type: "email",
            value: event.data.email_id,
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'proj_doc') {

      projectOwnershipModalParams = {

        header: "View Project Documents",

        method: "view",

        inputs: [
          {
            id: "doc_type",
            name: "Document Type",
            type: "text",
            value: event.data.doc_type,
            required: "true",
          },
          {
            id: "file_name",
            name: "File Name",
            type: "text",
            value: event.data.file_name,
            required: "true",
          },
          {
            id: "upload_file",
            name: "Upload File",
            type: "text",
            value: event.data.upload_file,
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'real_est') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.realEstateTableDocuments.url;

      for (var i = 0; i < this.realEstateTableDocuments.documentList.length; i++)
        if (parseInt(this.realEstateTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.GuiId))
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
            value: event.data.propertyTypeDesc,
            required: "true",
          },
          {
            id: "PropertyType",
            name: this.translate.instant('PROJECT_INFORMATION.PropertyType'),
            type: "text",
            value: event.data.PropertyType,
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
            value: event.data.Country,
            required: "true",
          },
          {
            id: "City",
            name: this.translate.instant('PROJECT_INFORMATION.City'),
            type: "text",
            value: event.data.City,
            required: "true",
          },
          {
            id: "Location",
            name: this.translate.instant('PROJECT_INFORMATION.Location'),
            type: "text",
            value: event.data.Location,
            required: "true",
          },
          {
            id: "Area",
            name: this.translate.instant('PROJECT_INFORMATION.Area'),
            type: "text",
            value: event.data.Area,
            required: "true",
          },
          {
            id: "PurchasePrice",
            name: this.translate.instant('PROJECT_INFORMATION.PurchasePrice'),
            type: "text",
            value: event.data.PurchasePrice,
            required: "true",
          },
          {
            id: "PurchaseDate",
            name: this.translate.instant('PROJECT_INFORMATION.PurchaseDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.PurchaseDate),
            required: "true",
          },
          {
            id: "MarketValue",
            name: this.translate.instant('PROJECT_INFORMATION.MarketValue'),
            type: "text",
            value: event.data.MarketValue,
            required: "true",
          },
          {
            id: "MarketDate",
            name: this.translate.instant('PROJECT_INFORMATION.MarketValuationDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.MarketDate),
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'list_comp') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.listOfCompaniesTableDocuments.url;

      for (var i = 0; i < this.listOfCompaniesTableDocuments.documentList.length; i++)
        if (parseInt(this.listOfCompaniesTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.GuiId))
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
            value: event.data.CompanyName,
            required: "true",
          },
          {
            id: "SharePercentage",
            name: this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage'),
            type: "text",
            value: parseFloat(event.data.SharePercentage).toFixed(4),
            required: "true",
          },
          {
            id: "ShareValue",
            name: this.translate.instant('PROJECT_INFORMATION.ShareholdingValue'),
            type: "text",
            value: event.data.ShareValue,
            required: "true",
          },
          {
            id: "IndustrialLicense",
            name: this.translate.instant('PROJECT_INFORMATION.CommercialRegistrationNumber'),
            type: "text",
            value: event.data.CrNumber,
            required: "true",
          },
          {
            id: "IssueDate",
            name: this.translate.instant('PROJECT_INFORMATION.IssueDate'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.IssueDate),
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'other_inv') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.otherInvestmentsTableDocuments.url;

      for (var i = 0; i < this.otherInvestmentsTableDocuments.documentList.length; i++)
        if (parseInt(this.otherInvestmentsTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.GuiId))
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
            id: "Description",
            name: this.translate.instant('PROJECT_INFORMATION.Description'),
            type: "text",
            value: event.data.InvestTypeDesc,
            required: "true",
            form_number: 1,
          },
          {
            id: "InvestmentType",
            name: this.translate.instant('PROJECT_INFORMATION.InvestmentType'),
            type: "text",
            value: event.data.InvestmentType,
            required: "true",
            form_number: 1,
          },
          {
            id: "InvestmentValue",
            name: this.translate.instant('PROJECT_INFORMATION.InvestmentValue'),
            type: "text",
            value: event.data.InvestmentValue,
            required: "true",
            form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 2 : 1,
          },
          {
            id: "Quantity",
            name: this.translate.instant('PROJECT_INFORMATION.Quantity'),
            type: "text",
            value: event.data.Quantity,
            required: "true",
            form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
          },
          {
            id: "MarketPrice",
            name: this.translate.instant('PROJECT_INFORMATION.MarketPrice'),
            type: "text",
            value: event.data.MarketPrice,
            required: "true",
            form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
          },
          {
            id: "TotalMarketValue",
            name: this.translate.instant('PROJECT_INFORMATION.TotalMarketValue'),
            type: "text",
            value: event.data.TotMarkPrice,
            required: "true",
            form_number: event.data.InvestmentType == this.translate.instant('COMMON.Stock Options') ? 1 : 2,
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'curr_vitae') {

      projectOwnershipModalParams = {

        header: "View  curriculum Vitae of Owners / Shareholders / Guarantor",

        method: "view",

        inputs: [
          {
            id: "name_own",
            name: "Name of Owner / Shareholder",
            type: "text",
            value: event.data.name_own,
            required: "true",
          },
          {
            id: "curr_vitae",
            name: this.translate.instant('PROJECT_INFORMATION.CurriculumVitae'),
            type: "text",
            value: event.data.curr_vitae,
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'prop_loan_guar') {

      projectOwnershipModalParams = {

        header: "View Proposed Loan Guarantees",

        method: "view",

        inputs: [
          {
            id: "name_own",
            name: "Name of Owner / Shareholder",
            type: "text",
            value: event.data.name_own,
            required: "true",
          },
          {
            id: "nationality",
            name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
            type: "text",
            value: event.data.nationality,
            required: "true",
          },
          {
            id: "postion",
            name: this.translate.instant('PROJECT_INFORMATION.Position'),
            type: "text",
            value: event.data.postion,
            required: "true",
          },
          {
            id: "guar_perc",
            name: this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage'),
            type: "text",
            value: event.data.guar_perc,
            required: "true",
          },
          {
            id: "guar_type",
            name: "Guarantee Type",
            type: "text",
            value: event.data.guar_type,
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'bank_info') {

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.ViewBankDetails'),

        method: "view",

        inputs: [
          {
            id: "Name",
            name: this.translate.instant('PROJECT_INFORMATION.AccountHolderName'),
            type: "text",
            value: event.data.Name,
            required: "true"
          },
          {
            id: "AccountNumber",
            name: this.translate.instant('PROJECT_INFORMATION.BankAccountNumber'),
            type: "text",
            value: event.data.AccountNumber,
            required: "true"
          },
          {
            id: "BankName",
            name: this.translate.instant('PROJECT_INFORMATION.BankName'),
            type: "text",
            value: event.data.BankName,
            required: "true"
          },
          {
            id: "RepName",
            name: this.translate.instant('PROJECT_INFORMATION.RepresentativeName'),
            type: "text",
            value: event.data.RepName,
            required: "true"
          },
          {
            id: "RepPos",
            name: this.translate.instant('PROJECT_INFORMATION.RepresentativePosition'),
            type: "text",
            value: event.data.RepPos,
            required: "true"
          },
          {
            id: "RepMail",
            name: this.translate.instant('PROJECT_INFORMATION.RepresentativeEmailId'),
            type: "text",
            value: event.data.RepMail,
            required: "true"
          },
          {
            id: "RepMobile",
            name: this.translate.instant('PROJECT_INFORMATION.BankRepresentativePhone'),
            type: "text",
            value: event.data.RepMobile,
            required: "true"
          },
          {
            id: "Branch",
            name: this.translate.instant('PROJECT_INFORMATION.Branch'),
            type: "text",
            value: event.data.Branch,
            required: "true"
          },
          {
            id: "City",
            name: this.translate.instant('PROJECT_INFORMATION.City'),
            type: "text",
            value: event.data.City,
            required: "true"
          },
          {
            id: "Country",
            name: this.translate.instant('PROJECT_INFORMATION.Country'),
            type: "text",
            value: event.data.Country,
            required: "true"
          },
          {
            id: "Address",
            name: this.translate.instant('PROJECT_INFORMATION.Address'),
            type: "textarea_disabled",
            value: event.data.Address,
            required: "true"
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'kpmr') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.KPMRTableDocuments.url;

      for (var i = 0; i < this.KPMRTableDocuments.documentList.length; i++)
        if (parseInt(this.KPMRTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.GuiId))
          temp_documents.documentList.push(this.KPMRTableDocuments.documentList[i]);

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.ViewKeyProfessionalManagementResources'),

        method: "view",

        documents: temp_documents,

        inputs: [
          {
            id: "BpPosition",
            name: this.translate.instant('PROJECT_INFORMATION.Position'),
            type: "text",
            value: event.data.BpPosition,
            required: "true",
          },
          {
            id: "FirstName",
            name: this.translate.instant('PROJECT_INFORMATION.FirstName'),
            type: "text",
            value: event.data.FirstName,
            required: "true",
          },
          {
            id: "LastName",
            name: this.translate.instant('PROJECT_INFORMATION.LastName'),
            type: "text",
            value: event.data.LastName,
            required: "true",
          },
          {
            id: "MiddleName",
            name: this.translate.instant('PROJECT_INFORMATION.MiddleName'),
            type: "text",
            value: event.data.MiddleName,
            required: "false",
          },
          {
            id: "DateOfJoining",
            name: this.translate.instant('PROJECT_INFORMATION.DateofJoining'),
            type: "text",
            value: this.commonService.returnDateStringFromDateArray(event.data.DateOfJoining),
            required: "true",
          },
          {
            id: "Nationality",
            name: this.translate.instant('PROJECT_INFORMATION.Nationality'),
            type: "text",
            value: event.data.Nationality,
            required: "true",
          },
          {
            id: "Degree",
            name: this.translate.instant('PROJECT_INFORMATION.Degree'),
            type: "text",
            value: event.data.Degree,
            required: "true",
          },
          {
            id: "ProfCert",
            name: this.translate.instant('PROJECT_INFORMATION.ProfessionalCertificate'),
            type: "text",
            value: event.data.ProfCert,
            required: "true",
          },
          {
            id: "YearExp",
            name: this.translate.instant('PROJECT_INFORMATION.YearsofExperience'),
            type: "text",
            value: event.data.YearExp,
            required: "true",
          },
          {
            id: "YearOverExp",
            name: this.translate.instant('PROJECT_INFORMATION.OverallExperience'),
            type: "text",
            value: event.data.YearOverExp,
            required: "true",
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'source_of_finance_cofinancer') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.guarantorsTableDocuments.url;

      for (var i = 0; i < this.guarantorsTableDocuments.documentList.length; i++)
        if (parseInt(this.guarantorsTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.Externalid))
          temp_documents.documentList.push(this.guarantorsTableDocuments.documentList[i]);

      projectOwnershipModalParams = {

        header: this.translate.instant('PROJECT_INFORMATION.ViewGuarantors'),

        method: "view",

        documents: temp_documents,

        inputs: [
          {
            id: "Externalid",
            name: this.translate.instant('PROJECT_INFORMATION.IdNumber'),
            type: "text",
            value: event.data.Externalid,
            required: "true",
          },
          {
            id: "Percent",
            name: this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage'),
            type: "text",
            value: parseFloat(event.data.Percent).toFixed(4),
            required: "true",
          },
          {
            id: "Position",
            name: this.translate.instant('PROJECT_INFORMATION.Position'),
            type: "text",
            value: event.data.Position,
            required: "true",
          },
          {
            id: "Type",
            name: this.translate.instant('PROJECT_INFORMATION.TypeofGuarantee'),
            type: "text",
            value: event.data.Type,
            required: "true",
          }
        ],
        buttons: []

      };

    }

    let projectOwnershipModal = this.modalService.open(ProjectOwnershipModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    projectOwnershipModal.componentInstance.projectOwnershipModalsForm = projectOwnershipModalParams;

  }

  onDelete(delete_cancel_modal, event, table_name) {

    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
    this.deleteCancelModalReference.event = event;
    this.deleteCancelModalReference.table_name = table_name;
    this.deleteCancelModalReference.action = this.translate.instant('COMMON.Delete');
    this.deleteCancelModalReference.error = this.translate.instant('COMMON.AreYouSure');

    if (this.deleteCancelModalReference.table_name == 'real_est')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.RealEstate');

    else if (this.deleteCancelModalReference.table_name == 'list_comp')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.ListofCompanies');

    else if (this.deleteCancelModalReference.table_name == 'other_inv')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.OtherInvestments');

    else if (this.deleteCancelModalReference.table_name == 'bank_info')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.BankDetails');

    else if (this.deleteCancelModalReference.table_name == 'kpmr')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.KeyProfessionalManagementResources');

    else if (this.deleteCancelModalReference.table_name == 'source_of_finance_cofinancer')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('PROJECT_INFORMATION.Guarantors');

    // if (this.deleteCancelModalReference.table_name == 'proj_own')
    //   this.deleteCancelModalReference.table_name_display = 'Project Ownership';

    // if (this.deleteCancelModalReference.table_name == 'proj_doc')
    //   this.deleteCancelModalReference.table_name_display = 'Project Documents';

    // if (this.deleteCancelModalReference.table_name == 'curr_vitae')
    //   this.deleteCancelModalReference.table_name_display = 'Curriculum Vitae';

    // if (this.deleteCancelModalReference.table_name == 'prop_loan_guar')
    //   this.deleteCancelModalReference.table_name_display = 'Proposed Loan Guarantees';

  }

  onDeleteConfirmRealEstate(i) {

    var temp_array = [];

    for (var j = 0; j < this.realEstateTableDocuments.documentList.length; j++)
      if (i != j)
        temp_array.push(this.realEstateTableDocuments.documentList[j]);

    this.realEstateTableDocuments.documentList = temp_array;

  }

  onDeleteConfirmListOfCompanies(i) {

    var temp_array = [];

    for (var j = 0; j < this.listOfCompaniesTableDocuments.documentList.length; j++)
      if (i != j)
        temp_array.push(this.listOfCompaniesTableDocuments.documentList[j]);

    this.listOfCompaniesTableDocuments.documentList = temp_array;

  }

  onDeleteConfirmOtherInvestments(i) {

    var temp_array = [];

    for (var j = 0; j < this.otherInvestmentsTableDocuments.documentList.length; j++)
      if (i != j)
        temp_array.push(this.otherInvestmentsTableDocuments.documentList[j]);

    this.otherInvestmentsTableDocuments.documentList = temp_array;

  }

  onDeleteConfirmKPMR(i) {

    var temp_array = [];

    for (var j = 0; j < this.KPMRTableDocuments.documentList.length; j++)
      if (i != j)
        temp_array.push(this.KPMRTableDocuments.documentList[j]);

    this.KPMRTableDocuments.documentList = temp_array;

  }

  onDeleteConfirm() {

    if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.Delete')) {

      if (this.deleteCancelModalReference.table_name == 'real_est') {

        this.spinnerService.show();

        this.deleteCancelModalReference.event.data["Operation"] = "D";


        var propertyType = this.property_type_list.find((o) => o.DescAr == this.deleteCancelModalReference.event.data.PropertyType||o.Desc == this.deleteCancelModalReference.event.data.PropertyType);
        if (propertyType)
          this.deleteCancelModalReference.event.data.PropertyType = propertyType.Id;

        var country = this.country_list.find((o) => o.DescAr == this.deleteCancelModalReference.event.data.Country|| o.Name == this.deleteCancelModalReference.event.data.Country);
        if (country)
          this.deleteCancelModalReference.event.data.Country = country.Code;

        this.deleteCancelModalReference.event.data.PurchasePrice = parseFloat(this.deleteCancelModalReference.event.data.PurchasePrice.replace(/[^\d.-]/g, '')).toFixed(4) + "";

        this.deleteCancelModalReference.event.data.PurchaseDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data.PurchaseDate);

        this.deleteCancelModalReference.event.data.MarketValue = parseFloat(this.deleteCancelModalReference.event.data.MarketValue.replace(/[^\d.-]/g, '')).toFixed(4) + "";

        this.deleteCancelModalReference.event.data.MarketDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data.MarketDate);


        var real_estate_source_data_array = [];

        real_estate_source_data_array.push(this.deleteCancelModalReference.event.data);

        var post_data = {
          "CustomerId": "",
          "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
          "Orgin": "CP",
          "Id": this.inputs.PrqId,
          "OperationType": "ESTA",
          "AssetRealEstate": real_estate_source_data_array
        };

        this.projInfoService.postProjectAssetInformation(post_data)
          .then((res) => (this.onRealEstatePost(res, "", "", "delete", "", "")), err => this.resolveError());

      }

      if (this.deleteCancelModalReference.table_name == 'list_comp') {

        this.spinnerService.show();

        this.deleteCancelModalReference.event.data["Operation"] = "D";


        this.deleteCancelModalReference.event.data.ShareValue = parseFloat(this.deleteCancelModalReference.event.data.ShareValue.replace(/[^\d.-]/g, '')).toFixed(4) + "";

        this.deleteCancelModalReference.event.data.IssueDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data.IssueDate);


        var list_companies_source_data_array = [];

        list_companies_source_data_array.push(this.deleteCancelModalReference.event.data);

        var post_data_1 = {
          "CustomerId": "",
          "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
          "Orgin": "CP",
          "Id": this.inputs.PrqId,
          "OperationType": "COMP",
          "AssetShares": list_companies_source_data_array
        };

        this.projInfoService.postProjectAssetInformation(post_data_1)
          .then((res) => (this.onCompaniesPost(res, "", "", "delete", "", "")), err => this.resolveError());

      }

      if (this.deleteCancelModalReference.table_name == 'other_inv') {

        this.spinnerService.show();

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleteCancelModalReference.event.data.InvestmentValue = parseFloat(this.deleteCancelModalReference.event.data.InvestmentValue.replace(/[^\d.-]/g, '')).toFixed(4) + "";

        this.deleteCancelModalReference.event.data.MarketPrice = parseFloat(this.deleteCancelModalReference.event.data.MarketPrice.replace(/[^\d.-]/g, '')).toFixed(4) + "";
        this.deleteCancelModalReference.event.data.TotMarkPrice = parseFloat(this.deleteCancelModalReference.event.data.TotMarkPrice.replace(/[^\d.-]/g, '')).toFixed(4) + "";

        var investmentType = this.investment_type_list.find((o) => o.DescAr == this.deleteCancelModalReference.event.data["InvestmentType"]||o.Desc == this.deleteCancelModalReference.event.data["InvestmentType"]);
        if (investmentType)
          this.deleteCancelModalReference.event.data["InvestmentType"] = investmentType.Id;

        var other_investments_source_data_array = [];

        other_investments_source_data_array.push(this.deleteCancelModalReference.event.data);

        var post_data_2 = {
          "CustomerId": "",
          "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
          "Orgin": "CP",
          "Id": this.inputs.PrqId,
          "OperationType": "INVE",
          "AssetOtherInvestments": other_investments_source_data_array
        };

        this.projInfoService.postProjectAssetInformation(post_data_2)
          .then((res) => (this.onOtherInvestmentsPost(res, "", "", "delete", "", "")), err => this.resolveError());

      }

      if (this.deleteCancelModalReference.table_name == 'bank_info') {

        this.bank_details_source.remove(this.deleteCancelModalReference.event.data);

        this.bank_details_source.refresh();

        this.bank_details_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_bank_details.push(this.deleteCancelModalReference.event.data);

        this.startedFilling = 1;

      }

      if (this.deleteCancelModalReference.table_name == 'kpmr') {

        var bpPosId = "";

        var BpPosition = this.position_list.find((o) => o.DescAr == this.deleteCancelModalReference.event.data.BpPosition||o.Desc == this.deleteCancelModalReference.event.data.BpPosition);
        if (BpPosition)
          bpPosId = BpPosition.Id;

        var nationalityId = "", nationalityIMC = "", nationalityKey = "";

        var Nationality = this.country_list.find((o) => o.DescAr == this.deleteCancelModalReference.event.data.Nationality||o.Name == this.deleteCancelModalReference.event.data.Nationality);
        if (Nationality) {

          nationalityId = Nationality.Id;
          nationalityIMC = Nationality.IsMemberCountry;
          nationalityKey = Nationality.Code;

        }

        var post_data_3 = {

          "Origin": "CP",
          "BpId": this.inputs.BpId,
          "BpManagePos": [
            {
              "BpPosId": this.deleteCancelModalReference.event.data.BpPosId,
              "BpPosition": {
                "PosId": bpPosId,
                "PosDesc": this.deleteCancelModalReference.event.data.BpPosition
              },
              "FirstName": this.deleteCancelModalReference.event.data.FirstName,
              "LastName": this.deleteCancelModalReference.event.data.LastName,
              "MiddleName": this.deleteCancelModalReference.event.data.MiddleName,
              "DateOfJoining": this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleteCancelModalReference.event.data.DateOfJoining),
              "Nationality": {
                "Id": nationalityId,
                "IsMemberCountry": nationalityIMC,
                "Nationality": this.deleteCancelModalReference.event.data.Nationality,
                "CountryKey": nationalityKey
              },
              "Degree": this.deleteCancelModalReference.event.data.Degree,
              "ProfCert": this.deleteCancelModalReference.event.data.ProfCert,
              "YearExp": this.deleteCancelModalReference.event.data.YearExp,
              "YearOverExp": this.deleteCancelModalReference.event.data.YearOverExp,
              "AddDetail": "NIL",
              "Operation": "D"
            }
          ],
          "CustomerId": "",
          "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId
        };

        this.spinnerService.show();

        this.projInfoService.postProjectKPMRInformation(post_data_3)
          .then((res) => (this.resolvePostProjectKPMRInformation(res, post_data_3.BpManagePos[0].Operation, "", "")), err => this.resolveError());

      }

      if (this.deleteCancelModalReference.table_name == 'proj_own') {

        this.project_ownership_source.remove(this.deleteCancelModalReference.event.data);

        this.project_ownership_source_length--;

        this.project_ownership_source.refresh();

      }

      if (this.deleteCancelModalReference.table_name == 'proj_doc') {

        this.project_documents_source.remove(this.deleteCancelModalReference.event.data);

        this.project_documents_source_length--;

        this.project_documents_source.refresh();

      }

      if (this.deleteCancelModalReference.table_name == 'curr_vitae') {

        this.curriculum_vitae_source.remove(this.deleteCancelModalReference.event.data);

        this.curriculum_vitae_source_length--;

        this.curriculum_vitae_source.refresh();

      }

      if (this.deleteCancelModalReference.table_name == 'prop_loan_guar') {

        this.proposed_loan_source.remove(this.deleteCancelModalReference.event.data);

        this.proposed_loan_source_length--;

        this.proposed_loan_source.refresh();

      }

      if (this.deleteCancelModalReference.table_name == 'source_of_finance_cofinancer') {

        this.spinnerService.show();

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        var source_of_finance_final_delete_post_data = {

          "Guarantors": [{

            "_comment1": "The below financing plan id is the loan id inputted in technical section under loan id field",
            "Projectid": this.inputs.SentReqId,
            "Externalid": this.deleteCancelModalReference.event.data.Externalid,
            "Percent": this.deleteCancelModalReference.event.data.Percent,
            "Type": this.deleteCancelModalReference.event.data.Type,
            "Position": this.deleteCancelModalReference.event.data.Position,
            "Operation": "D"

          }]

        };

        this.projInfoService
          .postGuarantors(source_of_finance_final_delete_post_data)
          .then((res) => (this.postGuarantors(res, "", "", "delete", event)), err => this.resolveError());

      }

    }

    else if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.Switch')) {

      if (this.deleteCancelModalReference.error == this.translate.instant('COMMON.SwitchSectionError'))
        this.onClickLoanApplicationTabComplete(this.deleteCancelModalReference.event);

    }

    else if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.GoBack'))
      this.router.navigate(['/pages/new-request/loan-application']);

    this.deleteCancelModalReference.close();

  }

  onSave() {

    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var TrailRunFromDate = new Date(this.inputs.TrailRunFrom);
    var TrailRunToDate = new Date(this.inputs.TrailRunTo);
    var ExpCompDate = new Date(this.inputs.ExpCompDate);
    var CrStartDate = new Date(this.inputs.CrStartDate);

    if (this.inputs.ProjectName == "" || !this.inputs.ProjectName)
      this.project_name_vs = true;

    else
      this.project_name_vs = false;

    if (this.inputs.GetInfoLegalEntity.LegalEntityDesc == "" || !this.inputs.GetInfoLegalEntity.LegalEntityDesc)
      this.legal_entity_vs = true;

    else
      this.legal_entity_vs = false;

    if (this.inputs.GenInfoFactAddress.Phone == "" || !this.inputs.GenInfoFactAddress.Phone)
      this.telephone_number_vs = true;

    else
      this.telephone_number_vs = false;

    if (this.inputs.GenInfoFactAddress.Fax == "" || !this.inputs.GenInfoFactAddress.Fax)
      this.fax_no_vs = true;

    else
      this.fax_no_vs = false;

    if (this.inputs.GenInfoFactAddress.Mail == "" || !this.inputs.GenInfoFactAddress.Mail)
      this.email_id_vs = true;

    else
      this.email_id_vs = false;

    if (this.inputs.GenInfoProjImpStatus.ProjImpStatusDesc == "" || !this.inputs.GenInfoProjImpStatus.ProjImpStatusDesc)
      this.type_vs = true;

    else
      this.type_vs = false;

    if (this.inputs.ExpCompDate == "" || !this.inputs.ExpCompDate)
      this.exp_pro_compl_date_vs = true;

    else
      this.exp_pro_compl_date_vs = false;

    if (this.inputs.GenInfoProjCompStatus.ProjCompStatusDesc == "" || !this.inputs.GenInfoProjCompStatus.ProjCompStatusDesc)
      this.GenInfoProjCompStatus_vs = true;

    else
      this.GenInfoProjCompStatus_vs = false;

    if (this.inputs.CrStartDate == "" || !this.inputs.CrStartDate)
      this.est_comm_startup_date_vs = true;

    else
      this.est_comm_startup_date_vs = false;

    if (this.inputs.TrailRunFrom == "" || !this.inputs.TrailRunFrom)
      this.il_date123_vs = true;

    else
      this.il_date123_vs = false;

    if (this.inputs.TrailRunTo == "" || !this.inputs.TrailRunTo)
      this.il_date124_vs = true;

    else
      this.il_date124_vs = false;


    if (this.project_name_vs || this.legal_entity_vs || this.telephone_number_vs || this.fax_no_vs || this.email_id_vs ||
      this.type_vs || this.exp_pro_compl_date_vs || this.GenInfoProjCompStatus_vs || this.est_comm_startup_date_vs ||
      this.il_date123_vs || this.il_date124_vs) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EnterGenInfoDetails'));
      this.panelStep = 1;

    }

    else if (!emailRegex.test(this.inputs.GenInfoFactAddress.Mail)) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EnterFactoryEmail'));
      this.email_id_vs = true;
      this.panelStep = 1;

    }

    else if (CrStartDate <= ExpCompDate) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EstComStDate1'));
      this.est_comm_startup_date_vs = true;
      // this.exp_pro_compl_date_vs = true;
      this.panelStep = 1;

    }

    else if (TrailRunFromDate <= ExpCompDate) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.TrialRunFrom1'));
      this.il_date123_vs = true;
      // this.exp_pro_compl_date_vs = true;
      this.panelStep = 1;

    }

    else if (TrailRunFromDate >= CrStartDate) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EstComStDate2'));
      // this.il_date123_vs = true;
      this.est_comm_startup_date_vs = true;
      this.panelStep = 1;

    }

    else if (TrailRunFromDate >= TrailRunToDate) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.TrialRunTo'));
      // this.il_date123_vs = true;
      this.il_date124_vs = true;
      this.panelStep = 1;

    }

    else if (TrailRunToDate >= CrStartDate) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EstComStartGreater'));
      // this.il_date124_vs = true;
      this.est_comm_startup_date_vs = true;
      this.panelStep = 1;

    }

    else if (this.inputs.ProjProfile == "" || !this.inputs.ProjProfile) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EnterProjProf'));
      this.ProjectProfile_vs = true;
      this.panelStep = 2;

    }

    // else if (this.inputs.ProjProfile.length < 300 || this.inputs.ProjProfile.length > 500)
    //   this.commonService.showFailureToast("Project Profile wordcount which is currently " + this.inputs.ProjProfile.length + " must be between 300 and 500 !");

    else if (this.projectProfileDocuments.documentList.length == 0 && this.fileLength == 0) {

      this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.AttachProjDescDoc'));
      this.projectDescriptionDocuments_vs = true;
      this.panelStep = 2;

    }

    else {

      try {

        var data = {
          documentDefId: 121,
          entityId: this.requestId,
          entityName: "Project",
          RelatedEntityId: this.inputs.GuiId == "" ? this.commonService.returnRandomNumber() : this.inputs.GuiId,
          RelatedEntityName: "loanAppGenInfo",
          operationType: "l"
        };

        this.spinnerService.show();

        if (this.fileLength > 0)
          this.communicationsService.uploadDocumentService(this.files, data)
            .then(requests => (this.onProjectProfileUpload(requests, data.RelatedEntityId)), err => this.resolveError());

        else
          this.onProjectProfileUploadResolveData();

      }

      catch (err) {
        this.resolveError();
      }

    }
  }

  resolvePostProjectInformation(result) {

    if (result.MessType == "S") {

      this.GenInfoPer = parseFloat(result.GenInfoPer);

      this.customerProfileService.loanPercentageValues.GenInfoPer = this.GenInfoPer;

      this.ChecklistPer = (this.customerProfileService.loanPercentageValues.GenInfoPer +
        this.customerProfileService.loanPercentageValues.MarkInfoPer +
        this.customerProfileService.loanPercentageValues.TechInfoPer +
        this.customerProfileService.loanPercentageValues.FinInfoPer) / 4;

      this.customerProfileService.loanPercentageValues.ChecklistPer = this.ChecklistPer;

      // var real_estate_temp_source = [], other_investments_temp_source = [],
      // var bank_information_temp_source = [];

      // this.real_estate_source.getAll().then((res) => {

      //   real_estate_temp_source = res;

      //   this.other_investments_source.getAll().then((res) => {

      //     other_investments_temp_source = res;

      // this.bank_details_source.getAll().then((res) => {

      //   bank_information_temp_source = res;


      // for (var i = 0; i < real_estate_temp_source.length; i++) {

      //   real_estate_temp_source[i]["MarketValue"] = parseFloat(real_estate_temp_source[i]["MarketValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

      //   real_estate_temp_source[i]["PurchasePrice"] = parseFloat(real_estate_temp_source[i]["PurchasePrice"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

      //   real_estate_temp_source[i].PurchaseDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(real_estate_temp_source[i].PurchaseDate);

      //   real_estate_temp_source[i].MarketDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(real_estate_temp_source[i].MarketDate);

      //   var propertyType = this.property_type_list.find((o) => o.Desc == real_estate_temp_source[i].PropertyType);
      //   if (propertyType)
      //     real_estate_temp_source[i].PropertyType = propertyType.Id;

      //   var country = this.country_list.find((o) => o.Name == real_estate_temp_source[i].Country);
      //   if (country)
      //     real_estate_temp_source[i].Country = country.Code;

      // }

      // for (var i = 0; i < this.deleted_real_estate.length; i++) {

      //   this.deleted_real_estate[i]["MarketValue"] = parseFloat(this.deleted_real_estate[i]["MarketValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

      //   this.deleted_real_estate[i]["PurchasePrice"] = parseFloat(this.deleted_real_estate[i]["PurchasePrice"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

      //   this.deleted_real_estate[i].PurchaseDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleted_real_estate[i].PurchaseDate);

      //   this.deleted_real_estate[i].MarketDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.deleted_real_estate[i].MarketDate);

      // }


      // for (var i = 0; i < other_investments_temp_source.length; i++) {

      //   other_investments_temp_source[i]["InvestmentValue"] = parseFloat(other_investments_temp_source[i]["InvestmentValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

      // }

      // for (var i = 0; i < this.deleted_other_investments.length; i++) {

      //   this.deleted_other_investments[i]["InvestmentValue"] = parseFloat(this.deleted_other_investments[i]["InvestmentValue"].replace(/[^\d.-]/g, '')).toFixed(4) + "";

      // }

      // try {

      // var post_data = {
      //   "CustomerId": "",
      //   "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
      //   "Orgin": "CP",
      //   "Id": this.inputs.BpId,
      //   "OperationType": "C",
      //   "AssetBankDetails": bank_information_temp_source.concat(this.deleted_bank_details)
      // };

      // this.projInfoService.postProjectAssetInformation(post_data)
      //   .then((res) => (this.resolvePostProjectAssetInformation(res)), err => this.resolveError());

      this.commonService.showSuccessToast(result.MessText);

      this.startedFilling = 0;

      this.spinnerService.hide();

      // }

      // catch (err) {
      //   this.spinnerService.hide();
      //   this.resolveError();
      // }

      // });

      //   });

      // });

    }

    else {

      this.commonService.showFailureToast(result.MessText);
      this.spinnerService.hide();

    }

  }

  resolvePostProjectAssetInformation(result) {

    if (result.MessType == "S")
      this.bindAfterPostProjectAssetInformation(result);

    else {
      this.commonService.showFailureToast(result.MessText);
      this.spinnerService.hide();
    }

  }

  bindAfterPostProjectAssetInformation(res) {

    // if (res.AssetRealEstate)
    //   for (var i = 0; i < res.AssetRealEstate.length; i++) {

    //     var Name = this.ownersList.find((o) => o.Id == res.AssetRealEstate[i].Id);
    //     if (Name)
    //       res.AssetRealEstate[i]["Name"] = Name.Name;

    //     res.AssetRealEstate[i].PurchaseDate = this.commonService.returnDateArrayFromDateString(res.AssetRealEstate[i].PurchaseDate);

    //     res.AssetRealEstate[i].MarketDate = this.commonService.returnDateArrayFromDateString(res.AssetRealEstate[i].MarketDate);

    //     var propertyType = this.property_type_list.find((o) => o.Id == res.AssetRealEstate[i].PropertyType);
    //     if (propertyType)
    //       res.AssetRealEstate[i].PropertyType = propertyType.Desc;

    //     var country = this.country_list.find((o) => o.Code == res.AssetRealEstate[i].Country);
    //     if (country)
    //       res.AssetRealEstate[i].Country = country.Name;

    //     res.AssetRealEstate[i]["Operation"] = "";
    //     res.AssetRealEstate[i]["AppId"] = this.inputs.PrqId;
    //     res.AssetRealEstate[i]["SendReqId"] = this.inputs.SentReqId;


    //   }

    // if (res.AssetShares)
    //   for (var i = 0; i < res.AssetShares.length; i++) {

    //     var Name = this.ownersList.find((o) => o.Id == res.AssetShares[i].Id);
    //     if (Name)
    //       res.AssetShares[i]["Name"] = Name.Name;

    //     res.AssetShares[i].IssueDate = this.commonService.returnDateArrayFromDateString(res.AssetShares[i].IssueDate);

    //     res.AssetShares[i]["Operation"] = "";
    //     res.AssetShares[i]["AppId"] = this.inputs.PrqId;
    //     res.AssetShares[i]["SendReqId"] = this.inputs.SentReqId;

    //   }

    // if (res.AssetOtherInvestments)
    //   for (var i = 0; i < res.AssetOtherInvestments.length; i++) {

    //     var Name = this.ownersList.find((o) => o.Id == res.AssetOtherInvestments[i].Id);
    //     if (Name)
    //       res.AssetOtherInvestments[i]["Name"] = Name.Name;

    //     res.AssetOtherInvestments[i]["Operation"] = "";
    //     res.AssetOtherInvestments[i]["AppId"] = this.inputs.PrqId;
    //     res.AssetOtherInvestments[i]["SendReqId"] = this.inputs.SentReqId;

    //   }

    // if (res.AssetBankDetails)
    //   for (var i = 0; i < res.AssetBankDetails.length; i++) {

    //     var Name = this.ownersList.find((o) => o.Id == res.AssetBankDetails[i].Id);
    //     if (Name)
    //       res.AssetBankDetails[i]["Name"] = Name.Name;

    //     res.AssetBankDetails[i]["Operation"] = "";
    //     res.AssetBankDetails[i]["AppId"] = this.inputs.PrqId;
    //     res.AssetBankDetails[i]["SendReqId"] = this.inputs.SentReqId;

    //   }

    // this.tables = {
    //   "CustomerId": "",
    //   "ProfileId": "",
    //   "Orgin": "CP",
    //   "Id": res.Id ? res.Id : 0,
    //   "OperationType": "",
    //   "AssetRealEstate": this.tables.AssetRealEstate,
    //   "AssetShares": this.tables.AssetShares,
    //   "AssetOtherInvestments": this.tables.AssetOtherInvestments,
    //   "AssetBankDetails": res.AssetBankDetails ? res.AssetBankDetails : [],
    //   "AssetNetworth": res.AssetNetworth ? res.AssetNetworth : []
    // };

    // this.real_estate_source.load(this.tables.AssetRealEstate);

    // this.real_estate_source_length = this.tables.AssetRealEstate.length;

    // this.list_companies_source.load(this.tables.AssetShares);

    // this.list_companies_source_length = this.tables.AssetShares.length;

    // this.other_investments_source.load(this.tables.AssetOtherInvestments);

    // this.other_investments_source_length = this.tables.AssetOtherInvestments.length;

    // this.bank_details_source.load(this.tables.AssetBankDetails);

    // this.bank_details_source_length = this.tables.AssetBankDetails.length;

    // this.real_estate_source.refresh();
    // this.list_companies_source.refresh();
    // this.other_investments_source.refresh();
    // this.bank_details_source.refresh();

    // this.commonService.showSuccessToast(res.MessText == "Sucess" ? "Success" : res.MessText);

    // this.startedFilling = 0;

    // this.spinnerService.hide();

  }

  resolvePostProjectKPMRInformation(res, operation, event, kpmr_source_data) {

    if (res.ResMessType == "S") {

      if (operation == "C") {

        var kpmr_source_data_array = [];

        kpmr_source_data_array.push(kpmr_source_data);

        if (this.kpmr_source_length == 0)
          this.kpmr_source.load(kpmr_source_data_array);

        else
          this.kpmr_source.add(kpmr_source_data);

        this.kpmr_source_length++;

        this.kpmr_source.refresh();

        var kpmr_temp_source = [], kpmr_temp_source_1 = [];

        this.kpmr_source.getAll().then((res1) => {

          kpmr_temp_source = res1;

          kpmr_temp_source[this.kpmr_source_length - 1].BpPosId = res.BpManagePos[0].BpPosId;

          kpmr_temp_source_1.push(kpmr_temp_source[kpmr_temp_source.length - 1]);

          for (var i = 0; i < kpmr_temp_source.length - 1; i++)
            kpmr_temp_source_1.push(kpmr_temp_source[i]);

          this.kpmr_source.load(kpmr_temp_source_1);

          this.kpmr_source.refresh();

          this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

          // this.startedFilling = 1;

          this.spinnerService.hide();

        });

      }

      else if (operation == "U") {

        this.kpmr_source.update(event.data, kpmr_source_data);

        this.kpmr_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

        // this.startedFilling = 1;

        this.spinnerService.hide();

      }

      else if (operation == "D") {

        this.kpmr_source.remove(this.deleteCancelModalReference.event.data);

        this.kpmr_source_length--;

        this.kpmr_source.refresh();

        if (this.KPMRTableDocuments.documentList.length > 0)
          for (var i = 0; i < this.KPMRTableDocuments.documentList.length; i++)
            if (parseInt(this.KPMRTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(this.deleteCancelModalReference.event.data.GuiId)) {

              this.communicationsService.deleteDocumentService
                ({
                  entityId: this.KPMRTableDocuments.documentList[i].EntityId, refId: this.KPMRTableDocuments.documentList[i].RefId,
                  documentId: this.KPMRTableDocuments.documentList[i].DocumentId, operationType: 'l'
                })
                .then(response => (response), err => err);

              this.onDeleteConfirmKPMR(i);

            }

        this.spinnerService.hide();

        // this.startedFilling = 1;

      }

    }

    else {

      this.commonService.showFailureToast(this.lang=='en'? res.ResMessText: res.ResMessTextAr);
      this.spinnerService.hide();

    }

  }


  onProjectProfileUpload(requests, RelatedEntityId) {

    if (requests.MessType == "S") {

      this.inputs.GuiId = (this.inputs.GuiId == "" ? RelatedEntityId : this.inputs.GuiId);

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.projectProfileDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onProjectProfileUploadResolveData();

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onProjectProfileUploadResolveData() {

    this.files = [];

    this.fileLength = 0;

    this.projectDescriptionDocuments.nativeElement.value = "";

    var projImpStatus = this.project_status_list.find((o) =>  o.DescAr == this.inputs.GenInfoProjImpStatus.ProjImpStatusDesc||o.Desc == this.inputs.GenInfoProjImpStatus.ProjImpStatusDesc);
    if (projImpStatus)
      this.inputs.GenInfoProjImpStatus.ProjImpStatusId = projImpStatus.Id;

    var projCompStatus = this.project_completion_status_list.find((o) => o.DescAr == this.inputs.GenInfoProjCompStatus.ProjCompStatusDesc|| o.Desc == this.inputs.GenInfoProjCompStatus.ProjCompStatusDesc);
    if (projCompStatus)
      this.inputs.GenInfoProjCompStatus.ProjCompStatusId = projCompStatus.Id;

    var legalEntity = this.legal_entity_list.find((o) => o.DescAr == this.inputs.GetInfoLegalEntity.LegalEntityDesc || o.Desc == this.inputs.GetInfoLegalEntity.LegalEntityDesc);
    if (legalEntity)
      this.inputs.GetInfoLegalEntity.LegalEntityId = legalEntity.Id;

    var crStartDate = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.CrStartDate);
    var expCompDate = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.ExpCompDate);
    var trailRunFrom = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.TrailRunFrom);
    var trailRunTo = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.inputs.TrailRunTo);

    var crDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.CrDate);
    var indLicDate = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.inputs.IndLicDate);

    var post_data = {

      "Origin": this.inputs.Origin,
      "SentReqId": this.inputs.SentReqId,
      "Indicator": this.inputs.Indicator,
      "IsLoanSumbit": this.inputs.IsLoanSumbit,
      "ProjProfile": this.inputs.ProjProfile,
      "ProjId": this.inputs.ProjId,
      "PrqId": this.inputs.PrqId,
      "GuiId": this.inputs.GuiId,
      "BpId": this.inputs.BpId,
      "ProfileId": this.inputs.ProfileId,
      "CustomerId": this.inputs.CustomerId,
      "IsPrivacySign": this.inputs.IsPrivacySign,
      "ProjectName": this.inputs.ProjectName,
      "FactoryId": this.inputs.FactoryId,
      "CrDate": crDate,
      "FactoryCr": this.inputs.FactoryCr,
      "CrStartDate": crStartDate,
      "IndLicDate": indLicDate,
      "ExpCompDate": expCompDate,
      "TrailRunFrom": trailRunFrom,
      "TrailRunTo": trailRunTo,
      "GenInfoProducts": this.inputs.GenInfoProducts,
      "GenInfoFactAddress": this.inputs.GenInfoFactAddress,
      "GenInfoLoanPurpose": this.inputs.GenInfoLoanPurpose,
      "GenInfoProjCompStatus": this.inputs.GenInfoProjCompStatus,
      "GenInfoProjImpStatus": this.inputs.GenInfoProjImpStatus,
      "GenInfoTypeProj": this.inputs.GenInfoTypeProj,
      "BussPartOwners": this.inputs.BussPartOwners,
      "GetInfoLegalEntity": this.inputs.GetInfoLegalEntity,
      "FinPlanId": this.inputs.FinPlanId,
      "GenPrqType": this.inputs.GenPrqType

    };

    this.projInfoService.postProjectInformation(post_data)
      .then((res) => (this.resolvePostProjectInformation(res)), err => this.resolveError());

  }

  onKPMRTableUpload(requests, modal_data, method, event, RelatedEntityId) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.KPMRTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onKPMRTableUploadDataBind(modal_data, method, event, RelatedEntityId);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onKPMRTableUploadDataBind(modal_data, method, event, RelatedEntityId) {

    var kpmr_source_data = {
      BpPosId: "", BpPosition: "", FirstName: "",
      LastName: "", MiddleName: "", DateOfJoining: { year: 0, month: 0, day: 0 },
      Nationality: "", Degree: "", ProfCert: "",
      YearExp: "", YearOverExp: "", GuiId: ""
    };

    if (method == "add") {

      kpmr_source_data = {
        BpPosId: "", BpPosition: modal_data.inputs[0].selected, FirstName: modal_data.inputs[1].value,
        LastName: modal_data.inputs[2].value, MiddleName: modal_data.inputs[3].value, DateOfJoining: this.commonService.returnDateArrayFromGregDateString(modal_data.inputs[4].value),
        Nationality: modal_data.inputs[5].selected, Degree: modal_data.inputs[6].value, ProfCert: modal_data.inputs[7].value,
        YearExp: modal_data.inputs[8].value, YearOverExp: modal_data.inputs[9].value,
        GuiId: RelatedEntityId
      };

      var bpPosId = "";

      var BpPosition = this.position_list.find((o) => o.DescAr == kpmr_source_data.BpPosition||o.Desc == kpmr_source_data.BpPosition);
      if (BpPosition)
        bpPosId = BpPosition.Id;

      var nationalityId = "", nationalityIMC = "", nationalityKey = "";

      var Nationality = this.country_list.find((o) => o.DescAr == kpmr_source_data.Nationality||o.Name == kpmr_source_data.Nationality);
      if (Nationality) {

        nationalityId = Nationality.Id;
        nationalityIMC = Nationality.IsMemberCountry;
        nationalityKey = Nationality.Code;

      }

      var post_data = {

        "Origin": "CP",
        "BpId": this.inputs.BpId,
        "BpManagePos": [
          {
            "GuiId": kpmr_source_data.GuiId,
            "BpPosition": {
              "PosId": bpPosId,
              "PosDesc": kpmr_source_data.BpPosition
            },
            "FirstName": kpmr_source_data.FirstName,
            "LastName": kpmr_source_data.LastName,
            "MiddleName": kpmr_source_data.MiddleName,
            "DateOfJoining": this.commonService.returnDateStringWithoutHyphenFromDateArray(kpmr_source_data.DateOfJoining),
            "Nationality": {
              "Id": nationalityId,
              "IsMemberCountry": nationalityIMC,
              "Nationality": kpmr_source_data.Nationality,
              "CountryKey": nationalityKey
            },
            "Degree": kpmr_source_data.Degree,
            "ProfCert": kpmr_source_data.ProfCert,
            "YearExp": kpmr_source_data.YearExp,
            "YearOverExp": kpmr_source_data.YearOverExp,
            "AddDetail": "NIL",
            "Operation": "C"
          }
        ],
        "CustomerId": "",
        "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId
      };

      this.projInfoService.postProjectKPMRInformation(post_data)
        .then((res) => (this.resolvePostProjectKPMRInformation(res, post_data.BpManagePos[0].Operation, "", kpmr_source_data)), err => this.resolveError());

    }

    else if (method == "edit") {

      kpmr_source_data = {
        BpPosId: event.data.BpPosId, BpPosition: modal_data.inputs[0].selected, FirstName: modal_data.inputs[1].value,
        LastName: modal_data.inputs[2].value, MiddleName: modal_data.inputs[3].value, DateOfJoining: this.commonService.returnDateArrayFromGregDateString(modal_data.inputs[4].value),
        Nationality: modal_data.inputs[5].selected, Degree: modal_data.inputs[6].value, ProfCert: modal_data.inputs[7].value,
        YearExp: modal_data.inputs[8].value, YearOverExp: modal_data.inputs[9].value,
        GuiId: RelatedEntityId
      };

      var bpPosId = "";

      var BpPosition = this.position_list.find((o) => o.DescAr == kpmr_source_data.BpPosition||o.Desc == kpmr_source_data.BpPosition);
      if (BpPosition)
        bpPosId = BpPosition.Id;

      var nationalityId = "", nationalityIMC = "", nationalityKey = "";

      var Nationality = this.country_list.find((o) =>  o.DescAr == kpmr_source_data.Nationality||o.Name == kpmr_source_data.Nationality);
      if (Nationality) {

        nationalityId = Nationality.Id;
        nationalityIMC = Nationality.IsMemberCountry;
        nationalityKey = Nationality.Code;

      }

      var post_data_edit = {

        "Origin": "CP",
        "BpId": this.inputs.BpId,
        "BpManagePos": [
          {
            "BpPosId": kpmr_source_data.BpPosId,
            "GuiId": kpmr_source_data.GuiId,
            "BpPosition": {
              "PosId": bpPosId,
              "PosDesc": kpmr_source_data.BpPosition
            },
            "FirstName": kpmr_source_data.FirstName,
            "LastName": kpmr_source_data.LastName,
            "MiddleName": kpmr_source_data.MiddleName,
            "DateOfJoining": this.commonService.returnDateStringWithoutHyphenFromDateArray(kpmr_source_data.DateOfJoining),
            "Nationality": {
              "Id": nationalityId,
              "IsMemberCountry": nationalityIMC,
              "Nationality": kpmr_source_data.Nationality,
              "CountryKey": nationalityKey
            },
            "Degree": kpmr_source_data.Degree,
            "ProfCert": kpmr_source_data.ProfCert,
            "YearExp": kpmr_source_data.YearExp,
            "YearOverExp": kpmr_source_data.YearOverExp,
            "AddDetail": "NIL",
            "Operation": "U"
          }
        ],
        "CustomerId": "",
        "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId
      };

      this.projInfoService.postProjectKPMRInformation(post_data_edit)
        .then((res) => (this.resolvePostProjectKPMRInformation(res, post_data_edit.BpManagePos[0].Operation, event, kpmr_source_data)), err => this.resolveError());

    }

  }

  onOtherInvestmentsTableUpload(requests, other_investments_source_data, method, event, projectOwnershipModal) {

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

      this.onOtherInvestmentsTableUploadDataBind(other_investments_source_data, method, event, projectOwnershipModal);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onOtherInvestmentsTableUploadDataBind(other_investments_source_data, method, event, projectOwnershipModal) {

    var other_investments_source_data_array = [];

    other_investments_source_data["InvestmentValue"] = "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["InvestmentValue"]);

    other_investments_source_data["MarketPrice"] = "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["MarketPrice"]);
    other_investments_source_data["TotMarkPrice"] = "SAR " + this.commonService.numberToNumberWithCommas(other_investments_source_data["TotMarkPrice"]);

    var investmentType = this.investment_type_list.find((o) => o.Id == other_investments_source_data["InvestmentType"]);
    if (investmentType)
      other_investments_source_data["InvestmentType"] = investmentType.Desc;

    if (method == "add") {

      other_investments_source_data_array.push(other_investments_source_data);

      if (this.other_investments_source_length == 0)
        this.other_investments_source.load(other_investments_source_data_array);

      else
        this.other_investments_source.add(other_investments_source_data);

      this.other_investments_source.refresh();

      this.other_investments_source_length++;

      var other_investments_temp_source = [], other_investments_temp_source_1 = [];

      this.other_investments_source.getAll().then((res) => {

        other_investments_temp_source = res;

        other_investments_temp_source_1.push(other_investments_temp_source[other_investments_temp_source.length - 1]);

        for (var i = 0; i < other_investments_temp_source.length - 1; i++)
          other_investments_temp_source_1.push(other_investments_temp_source[i]);

        this.other_investments_source.load(other_investments_temp_source_1);

        this.other_investments_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

      });

      this.spinnerService.hide();

      projectOwnershipModal.close();

      // this.startedFilling = 1;

    }

    else if (method == "edit") {

      this.other_investments_source.update(event.data, other_investments_source_data);

      this.other_investments_source.refresh();

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

      projectOwnershipModal.close();

      // this.startedFilling = 1;

    }

  }

  onListOfCompaniesTableUpload(requests, list_companies_source_data, method, event, projectOwnershipModal) {

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

      this.onListOfCompaniesTableUploadDataBind(list_companies_source_data, method, event, projectOwnershipModal);

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }
  }

  onListOfCompaniesTableUploadDataBind(list_companies_source_data, method, event, projectOwnershipModal) {

    var list_companies_source_data_array = [];

    list_companies_source_data["ShareValue"] = "SAR " + this.commonService.numberToNumberWithCommas(list_companies_source_data["ShareValue"]);

    list_companies_source_data["IssueDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(list_companies_source_data["IssueDate"]);

    if (method == "add") {

      list_companies_source_data_array.push(list_companies_source_data);

      if (this.list_companies_source_length == 0)
        this.list_companies_source.load(list_companies_source_data_array);

      else
        this.list_companies_source.add(list_companies_source_data);

      this.list_companies_source.refresh();

      this.list_companies_source_length++;

      var list_companies_temp_source = [], list_companies_temp_source_1 = [];

      this.list_companies_source.getAll().then((res) => {

        list_companies_temp_source = res;

        list_companies_temp_source_1.push(list_companies_temp_source[list_companies_temp_source.length - 1]);

        for (var i = 0; i < list_companies_temp_source.length - 1; i++)
          list_companies_temp_source_1.push(list_companies_temp_source[i]);

        this.list_companies_source.load(list_companies_temp_source_1);

        this.list_companies_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

      });

      this.spinnerService.hide();

      projectOwnershipModal.close();

      // this.startedFilling = 1;

    }

    else if (method == "edit") {

      this.list_companies_source.update(event.data, list_companies_source_data);

      this.list_companies_source.refresh();

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

      projectOwnershipModal.close();

      // this.startedFilling = 1;

    }

  }

  onRealEstateTableUploadDataBind(real_estate_source_data, method, event, projectOwnershipModal) {

    var real_estate_source_data_array = [];


    var propertyType = this.property_type_list.find((o) => o.Id == real_estate_source_data["PropertyType"]);
    if (propertyType)
      real_estate_source_data["PropertyType"] = propertyType.Desc;

    var country = this.country_list.find((o) => o.Code == real_estate_source_data["Country"]);
    if (country)
      real_estate_source_data["Country"] = country.Name;


    real_estate_source_data["PurchasePrice"] = "SAR " + this.commonService.numberToNumberWithCommas(real_estate_source_data["PurchasePrice"]);

    real_estate_source_data["PurchaseDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(real_estate_source_data["PurchaseDate"]);

    real_estate_source_data["MarketValue"] = "SAR " + this.commonService.numberToNumberWithCommas(real_estate_source_data["MarketValue"]);

    real_estate_source_data["MarketDate"] = this.commonService.returnDateArrayFromDateStringWithoutHyphen(real_estate_source_data["MarketDate"]);


    if (method == "add") {

      real_estate_source_data_array.push(real_estate_source_data);

      if (this.real_estate_source_length == 0)
        this.real_estate_source.load(real_estate_source_data_array);

      else
        this.real_estate_source.add(real_estate_source_data);

      this.real_estate_source.refresh();

      this.real_estate_source_length++;

      var real_estate_temp_source = [], real_estate_temp_source_1 = [];

      this.real_estate_source.getAll().then((res) => {

        real_estate_temp_source = res;

        real_estate_temp_source_1.push(real_estate_temp_source[real_estate_temp_source.length - 1]);

        for (var i = 0; i < real_estate_temp_source.length - 1; i++)
          real_estate_temp_source_1.push(real_estate_temp_source[i]);

        this.real_estate_source.load(real_estate_temp_source_1);

        this.real_estate_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.AdditionSuccessful'));

      });

      this.spinnerService.hide();

      projectOwnershipModal.close();

      // this.startedFilling = 1;

    }

    else if (method == "edit") {

      this.real_estate_source.update(event.data, real_estate_source_data);

      this.real_estate_source.refresh();

      this.spinnerService.hide();

      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.EditSuccessful'));

      projectOwnershipModal.close();

      // this.startedFilling = 1;

    }

  }

  onRealEstateTableUpload(requests, real_estate_source_data, method, event, projectOwnershipModal) {

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

      this.onRealEstateTableUploadDataBind(real_estate_source_data, method, event, projectOwnershipModal);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  postGuarantors(res, source_of_finance_source_data, modal_data, method, event) {

    if (res.MessType == "E") {

      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();

    }

    else {

      if (method == "add" || method == "edit") {

        var data = {
          documentDefId: 121,
          entityId: this.inputs.SentReqId,
          entityName: "Project",
          RelatedEntityId: modal_data.inputs[0].value,
          RelatedEntityName: "Reference",
          operationType: "l"
        };

        if (method == "edit") {

          var temp_array = [];

          for (var i = 0; i < this.guarantorsTableDocuments.documentList.length; i++)
            if (!(parseInt(this.guarantorsTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(event.data.Externalid)))
              temp_array.push(this.guarantorsTableDocuments.documentList[i]);

          for (var i = 0; i < modal_data.documents.documentList.length; i++)
            temp_array.push(modal_data.documents.documentList[i]);

          this.guarantorsTableDocuments.documentList = temp_array;

        }

        if (modal_data.inputs[4].file && modal_data.inputs[4].file != "")
          this.communicationsService.uploadDocumentService(modal_data.inputs[4].file, data)
            .then(requests => (this.onPostGuarantorsUpload(requests, source_of_finance_source_data, method, event, res)), err => this.resolveError());

        else
          this.onPostGuarantorsUploadDataBind(source_of_finance_source_data, method, event, res);

      }

      else if (method == "delete") {

        this.source_of_finance_source.remove(this.deleteCancelModalReference.event.data);

        this.source_of_finance_source.refresh();

        this.source_of_finance_source_length--;

        if (this.guarantorsTableDocuments.documentList.length > 0)
          for (var i = 0; i < this.guarantorsTableDocuments.documentList.length; i++)
            if (parseInt(this.guarantorsTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(this.deleteCancelModalReference.event.data.Externalid)) {

              this.communicationsService.deleteDocumentService
                ({
                  entityId: this.guarantorsTableDocuments.documentList[i].EntityId, refId: this.guarantorsTableDocuments.documentList[i].RefId,
                  documentId: this.guarantorsTableDocuments.documentList[i].DocumentId, operationType: 'l'
                })
                .then(response => (response), err => err);

              this.onDeleteConfirmGuarantors(i);

            }

        this.spinnerService.hide();

      }

    }

  }

  onPostGuarantorsUpload(requests, source_of_finance_source_data, method, event, res) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.guarantorsTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onPostGuarantorsUploadDataBind(source_of_finance_source_data, method, event, res);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onPostGuarantorsUploadDataBind(source_of_finance_source_data, method, event, res) {

    if (method == "add") {

      var source_of_finance_source_data_array = [];

      source_of_finance_source_data_array.push(source_of_finance_source_data);

      if (this.source_of_finance_source_length == 0)
        this.source_of_finance_source.load(source_of_finance_source_data_array);

      else
        this.source_of_finance_source.add(source_of_finance_source_data);

      this.source_of_finance_source_length++;

      this.source_of_finance_source.refresh();

      var source_of_finance_temp_source = [], source_of_finance_temp_source_1 = [];

      this.source_of_finance_source.getAll().then((res) => {

        source_of_finance_temp_source = res;

        source_of_finance_temp_source_1.push(source_of_finance_temp_source[source_of_finance_temp_source.length - 1]);

        for (var i = 0; i < source_of_finance_temp_source.length - 1; i++)
          source_of_finance_temp_source_1.push(source_of_finance_temp_source[i]);

        this.source_of_finance_source.load(source_of_finance_temp_source_1);

        this.source_of_finance_source.refresh();

      });

    }

    else if (method == "edit") {

      this.source_of_finance_source.update(event.data, source_of_finance_source_data);

      this.source_of_finance_source.refresh();

    }

    this.commonService.showSuccessToast(res.MessText);
    this.spinnerService.hide();

  }

  onDeleteConfirmGuarantors(i) {

    var temp_array = [];

    for (var j = 0; j < this.guarantorsTableDocuments.documentList.length; j++)
      if (i != j)
        temp_array.push(this.guarantorsTableDocuments.documentList[j]);

    this.guarantorsTableDocuments.documentList = temp_array;

  }

  setPanelStep(index: number) {
    this.panelStep = index;
  }

  nextPanelStep(panel_number) {

    if (panel_number == 7 && this.nonSaudiOwnersListNames.length <= 0)
      this.panelStep += 2;

    else
      this.panelStep++;

  }

  prevPanelStep(panel_number) {

    if (panel_number == 9 && this.nonSaudiOwnersListNames.length <= 0)
      this.panelStep -= 2;

    else
      this.panelStep--;

  }

  expandAllPanels(mode) {

    this.panelStep = 0;

    if (mode == 0)
      this.allPanelsExpanded = true;

    else if (mode == 1)
      this.allPanelsExpanded = false;

  }

  onClickLoanApplicationTab(tab_number, delete_cancel_modal) {

    if (tab_number != 0) {

      if (this.startedFilling == 0)
        this.onClickLoanApplicationTabComplete(tab_number);

      else {

        this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
        this.deleteCancelModalReference.event = tab_number;
        this.deleteCancelModalReference.action = this.translate.instant('COMMON.Switch');
        this.deleteCancelModalReference.table_name_display = this.translate.instant('COMMON.Section');
        this.deleteCancelModalReference.error = this.translate.instant('COMMON.SwitchSectionError');

      }

    }

  }

  onClickLoanApplicationTabComplete(tab_number) {

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
        if (this.serviceId == 7||this.serviceId == 8)
          this.router.navigateByUrl('/pages/new-request/loan-application/land-form1');
          else   if (this.serviceId == 12)
          this.router.navigateByUrl('/pages/new-request/loan-application/land-logistic-form');
        else if (this.serviceId == 9 || this.serviceId == 13) 
          this.router.navigateByUrl('/pages/new-request/loan-application/rcj-information');
          else
          this.router.navigateByUrl('/pages/new-request/loan-application/rcy-information');
        break;

      case 6:
        if (this.serviceId == 7)
          this.router.navigateByUrl('/pages/new-request/loan-application/land-form2');
        else if (this.serviceId == 9 ||this.serviceId == 13) 
          this.router.navigateByUrl('/pages/new-request/loan-application/rcj-questionnaire');
          else
          this.router.navigateByUrl('/pages/new-request/loan-application/rcy-questionnaire');
        break;
      case 8:
        this.router.navigateByUrl('/pages/new-request/loan-application/factory-loan');
        break;

    }

  }

  onBack(delete_cancel_modal, action) {

    if (action == 1) {

      if (this.startedFilling == 0)
        this.router.navigate(['/pages/new-request/loan-application/' + this.serviceId]);

      else {

        this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
        this.deleteCancelModalReference.action = this.translate.instant('COMMON.GoBack');
        this.deleteCancelModalReference.table_name_display = "";
        this.deleteCancelModalReference.error = this.translate.instant('COMMON.BackError');

      }

    }

    else
      this.router.navigate(['/pages/new-request/loan-application/' + this.serviceId]);

  }

  onCloseDeleteCancelModal() {

    this.deleteCancelModalReference.close();

  }

  startTour() {

    this.allPanelsExpanded = true;

    if (this.commonService.defaultLanguage == 'en') {

      this.tour_en.setOption('steps', [
        {
          element: '#tourStep1',
          intro: "Navigate to Marketing Information"
        },
        {
          element: '#tourStep2',
          intro: "Navigate to Technical Information"
        },
        {
          element: '#tourStep3',
          intro: "Navigate to Financial Information"
        },
        {
          element: '#tourStep4',
          intro: "Navigate to Checklist"
        },
        {
          element: '#tourStep5',
          intro: "Enter the General Details"
        },
        {
          element: '#tourStep6',
          intro: "Enter the Project Profile Details"
        },
        {
          element: '#tourStep7',
          intro: "View the Ownership Details"
        },
        {
          element: '#tourStep8',
          intro: "Enter the Guarantor Details"
        },
        {
          element: '#tourStep9',
          intro: "Enter the Real Estate Details"
        },
        {
          element: '#tourStep10',
          intro: "Enter the Company Details"
        },
        {
          element: '#tourStep11',
          intro: "Enter the Other Investment Details"
        },
        {
          element: '#tourStep12',
          intro: "Enter the Bank Details (Only For Foreign Owners)"
        },
        {
          element: '#tourStep13',
          intro: "Enter the Key Professional Management Resource Details"
        },
        {
          element: '#tourStep14',
          intro: "Go Back"
        },
        {
          element: '#tourStep15',
          intro: "Save the details"
        }
      ]);

      this.tour_en.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

    else if (this.commonService.defaultLanguage == 'ar') {

      this.tour_ar.setOption('steps', [
        {
          element: '#tourStep1',
          intro: "انتقل إلى معلومات التسويق"
        },
        {
          element: '#tourStep2',
          intro: "انتقل إلى المعلومات الفنية"
        },
        {
          element: '#tourStep3',
          intro: "انتقل إلى المعلومات المالية"
        },
        {
          element: '#tourStep4',
          intro: "انتقل إلى قائمة التحقق"
        },
        {
          element: '#tourStep5',
          intro: "أدخل التفاصيل العامة"
        },
        {
          element: '#tourStep6',
          intro: "أدخل تفاصيل ملف المشروع"
        },
        {
          element: '#tourStep7',
          intro: "عرض تفاصيل الملكية"
        },
        {
          element: '#tourStep8',
          intro: "أدخل تفاصيل الضامن"
        },
        {
          element: '#tourStep9',
          intro: "أدخل التفاصيل العقارية"
        },
        {
          element: '#tourStep10',
          intro: "أدخل تفاصيل الشركة"
        },
        {
          element: '#tourStep11',
          intro: "أدخل تفاصيل الاستثمار الأخرى"
        },
        {
          element: '#tourStep12',
          intro: "أدخل تفاصيل البنك (فقط للمالكين الأجانب)"
        },
        {
          element: '#tourStep13',
          intro: "أدخل مفتاح تفاصيل إدارة الموارد المهنية"
        },
        {
          element: '#tourStep14',
          intro: "عد"
        },
        {
          element: '#tourStep15',
          intro: "حفظ التفاصيل"
        }
      ]);

      this.tour_ar.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

  }
  returnDisabledStateBasedOnCommunication(section) {
    if (this.statusCode == 'Q' && _l.get(section, 'hasComments')) {
      return false;
    } else {
      return !this.add_edit_delete_show;
    }
  }
  isSaveSubmitVisible() {
    if (this.statusCode == 'Q') {
      return true;
    } else if (this.statusCode != 'Q') {
      return this.add_edit_delete_show;
    } else {
      return false;
    }
  }

  handleOnExitTour() {

    window.location.hash = "#" + "startTour";
    this.allPanelsExpanded = false;
    this.panelStep = 1;

  }
  setEditableSectionsBasedOnCommunication() {

    if (this.guarantors_comments.hasComments) {
      this.source_of_finance_settings_en.actions.edit = true;
      this.source_of_finance_settings_en.actions.delete = true;
      
      this.source_of_finance_settings_ar.actions.edit = true;
      this.source_of_finance_settings_ar.actions.delete = true;
    } else {
      this.source_of_finance_settings_en.actions.edit = false;
      this.source_of_finance_settings_en.actions.delete = false;
      
      this.source_of_finance_settings_ar.actions.edit = false;
      this.source_of_finance_settings_ar.actions.delete = false;
    }
    this.source_of_finance_settings_en = Object.assign({}, this.source_of_finance_settings_en);

    this.source_of_finance_settings_ar = Object.assign({}, this.source_of_finance_settings_ar);
    if (this.real_estates_comments.hasComments) {
      this.settings_real_est_en.actions.edit = true;
      this.settings_real_est_en.actions.delete = true;
      this.settings_real_est_ar.actions.edit = true;
      this.settings_real_est_ar.actions.delete = true;
    } else {
      this.settings_real_est_en.actions.edit = false;
      this.settings_real_est_en.actions.delete = false;
      this.settings_real_est_ar.actions.edit = false;
      this.settings_real_est_ar.actions.delete = false;
    }
    this.settings_real_est_en = Object.assign({}, this.settings_real_est_en);
    
    this.settings_real_est_ar= Object.assign({}, this.settings_real_est_ar);

    if (this.list_of_companies_comments.hasComments) {
      this.settings_companies_en.actions.edit = true;
      this.settings_companies_en.actions.delete = true;
      
      this.settings_companies_ar.actions.edit = true;
      this.settings_companies_ar.actions.delete = true;
    } else {
      this.settings_companies_en.actions.edit = false;
      this.settings_companies_en.actions.delete = false;
      
      this.settings_companies_ar.actions.edit = false;
      this.settings_companies_ar.actions.delete = false;
    }
    this.settings_companies_en = Object.assign({}, this.settings_companies_en);
    this.settings_companies_ar = Object.assign({}, this.settings_companies_ar);

    if (this.other_investments_comments.hasComments) {
      this.settings_other_inv_en.actions.edit = true;
      this.settings_other_inv_en.actions.delete = true;
      
      this.settings_other_inv_ar.actions.edit = true;
      this.settings_other_inv_ar.actions.delete = true;
    } else {
      this.settings_other_inv_en.actions.edit = false;
      this.settings_other_inv_en.actions.delete = false;
      
      this.settings_other_inv_ar.actions.edit = false;
      this.settings_other_inv_ar.actions.delete = false;
    }
    this.settings_other_inv_en = Object.assign({}, this.settings_other_inv_en);
    
    this.settings_other_inv_ar = Object.assign({}, this.settings_other_inv_ar);

    if (this.kpmr_comments.hasComments) {
      this.kpmr_settings_en.actions.edit = true;
      this.kpmr_settings_en.actions.delete = true;
      
      this.kpmr_settings_ar.actions.edit = true;
      this.kpmr_settings_ar.actions.delete = true;
    } else {
      this.kpmr_settings_en.actions.edit = false;
      this.kpmr_settings_en.actions.delete = false;
      
      this.kpmr_settings_ar.actions.edit = false;
      this.kpmr_settings_ar.actions.delete = false;
    }
    this.kpmr_settings_en = Object.assign({}, this.kpmr_settings_en);
    
    this.kpmr_settings_ar = Object.assign({}, this.kpmr_settings_ar);

    if (this.project_profile_comments.hasComments) {
      this.projectProfileDocuments["method"] = 'edit';
    } else {
      this.projectProfileDocuments["method"] = 'view';
    }

   
  }


}