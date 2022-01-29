import { Component, OnInit, ViewChild, ElementRef, Input,ChangeDetectorRef  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LocalDataSource, DefaultEditor, ViewCell } from 'ng2-smart-table';
import { LoanApplicationService } from "../../../../services/loan-application.service";
import { MarketingInformationModalsComponent } from "./marketing-information-modals/marketing-information-modals.component";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from '../../../../services/communications.service';
import { CommonCommentsService } from '../../../../services/common-comments.service';
import { _ } from 'underscore';
import * as _l from 'lodash'; 

import { BsLocaleService } from 'ngx-bootstrap/datepicker'; // Added By PSW for arabic calendar gregorian
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'smart-table-datepicker',
  templateUrl: '../../../../components/smart-table-datepicker/smart-table-datepicker.component.html',
  styleUrls: ['../../../../components/smart-table-datepicker/smart-table-datepicker.component.scss']
})

export class SmartTableDatepickerComponent extends DefaultEditor implements OnInit {
  gregDateString: any;
  
  constructor(private commonService: CommonService, private customerProfileService: CustomerProfileService) {
    super();
  }

  ngOnInit() {
   

    this.gregDateString = this.cell.newValue ? this.commonService.returnGregDateStringFromDateString(this.cell.newValue) : "";

  }

  onGregDateChange(event) {

    this.cell.newValue = this.commonService.returnDateStringFromGregDateString(event);

  }

}

@Component({
  template: `{{ value }}`,
})

export class SmartTableDatepickerRenderComponent implements ViewCell, OnInit {

  @Input() value: string;
  @Input() rowData: any;

  constructor() { }

  ngOnInit() { }

}

@Component({
  selector: 'marketing-information',
  templateUrl: './marketing-information.component.html',
  styleUrls: ['./marketing-information.component.scss']
})

export class LoanApplicationMarketingInformationComponent implements OnInit {

  tour_en: any;

  tour_ar: any;

  loanTypeValues = {
    loanType: "",
    selectedLoanType: {},
    selectedLoanTypeOperation: "",
    loanTypeList: []
  };

  panelsVisible = [
    {
      panel: 1,
      visible: false
    },
    {
      panel: 2,
      visible: false
    },
    {
      panel: 3,
      visible: false
    },
    {
      panel: 4,
      visible: false
    },
    {
      panel: 5,
      visible: false
    },
    {
      panel: 6,
      visible: false
    },
    {
      panel: 7,
      visible: false
    },
    {
      panel: 8,
      visible: false
    },
    {
      panel: 9,
      visible: false
    },
    {
      panel: 10,
      visible: false
    },
    {
      panel: 11,
      visible: false
    },
    {
      panel: 12,
      visible: false
    },
    {
      panel: 13,
      visible: false
    }
  ];

  commentsFrom = "";
  commentArray = {};
  commentArrayExists = false;

  product_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIPRO", commentDetails: {}, commentArray: [] };
  sponsor_product_sales__comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MISPO", commentDetails: {}, commentArray: [] };
  target_market_region_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MITAR", commentDetails: {}, commentArray: [] };
  target_market_segments_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MITMS", commentDetails: {}, commentArray: [] };
  factories_target_market_region_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIFAC", commentDetails: {}, commentArray: [] };
  import_competitors_market_region_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIIMP", commentDetails: {}, commentArray: [] };
  historical_product_demand_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIPDE", commentDetails: {}, commentArray: [] };
  expected_sales_volume_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIEXS", commentDetails: {}, commentArray: [] };
  targeted_end_users_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIENU", commentDetails: {}, commentArray: [] };
  sponsor_proposed_price_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIPRI", commentDetails: {}, commentArray: [] };
  major_competitor_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MICOM", commentDetails: {}, commentArray: [] };
  distribution_and_marketing_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIDIS", commentDetails: {}, commentArray: [] };

  Description_vs = false;
  Applications_vs = false;
  Users_vs = false;
  Substitutes_vs = false;
  // Weight_vs = false;
  // WeightUnit_vs = false;
  // Size_vs = false;
  // SizeUnit_vs = false;
  AnnualProductionCap_vs = false;
  AnnualPrdCapUOM_vs = false;
  CommercialProjYear_vs = false;
  NumberOfClients_vs = false;
  ProductBrochures_vs = false;
  FactorsAffectingDemand_vs = false;
  ExpectedSalesDocuments_vs = false;
  ProposedProductAdCampaign_vs = false;

  @ViewChild('productBrochuresFileField') productBrochuresFileField: ElementRef;
  @ViewChild('expectedSalesFileField') expectedSalesFileField: ElementRef;

  panelStep = 1;

  projId = 0;
  loanPurpose = "";

  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  ChecklistPer = 0;
  RCJInfoPer = 0;
  RCJQuesPer = 0;

  add_edit_delete_show = true;

  comments_show = false;

  selected_unit_name = "";

  documents = {};

  MyLoanComm: any = {};

  productBrochuresDocuments = { url: "", documentList: [] };

  expectedSalesDocuments = { url: "", documentList: [] };

  clientsTableDocuments = { url: "", documentList: [] };

  allPanelsExpanded = false;

  deleteCancelModalReference: any;

  startedFilling = 0;

  product_list = [];

  selected_product = {};

  unit_list = [];

  unit_name_list = [];

  market_type_list = [];

  market_type_desc_list = [];

  market_region_type_list = [];

  market_region_type_desc_list = [];

  market_type_selected_desc_list = [];

  machineries_list = [];

  machineries_desc_list = [];

  country_list = [];
  lang=this.commonService.defaultLanguage;
  

  country_name_list = [];

  current_year = "";

  year_list = "1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|");

  year_minus_3_list = [];

  year_last_3_list = [];

  com_proj_plus_5_list = [];

  client_6_year_list = [];

  month_till_date_list = [];

  monthList = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];


    local_competitors_sales_volume_settings_en: any;

    additional_capacity_settings_en: any;
  
    import_competitors_sales_volume_settings_en: any;
  
    expected_sales_volume_export_settings_en: any;
  
    expected_sales_volume_import_settings_en: any;
  
    activity_of_owners_details_settings_en: any;
  
    product_sales_volume_settings_en: any;
  
    main_competitive_sales_volume_settings_en: any;
  
    expected_sales_volume_settings_en: any;
  
  
    product_sales_settings_en: any;
  
    target_market_settings_en: any;
  
    target_market_region_settings_en: any;
  
    local_competitors_settings_en: any;
  
    import_competitors_settings_en: any;
  
    product_demand_settings_en: any;
  
    expected_sales_settings_en: any;
  
    clients_settings_en: any;
  
    proposed_selling_price_settings_en: any;
  
    major_competitors_settings_en: any;
  
  
    proposed_transport_settings_en: any;
  
    activities_of_owners_settings_en: any;
    local_competitors_sales_volume_settings_ar:any;
    
  additional_capacity_settings_ar:any;
  import_competitors_sales_volume_settings_ar:any;
  expected_sales_volume_export_settings_ar:any;
  Product_Production_Lines_Section_settings_ar:any;
  product_sales_settings_ar:any;
  target_market_settings_ar:any;
  target_market_region_settings_ar:any;
  local_competitors_settings_ar:any;
  import_competitors_settings_ar:any;
  product_demand_settings_ar:any;
  expected_sales_settings_ar:any;
  clients_settings_ar:any;
  proposed_selling_price_settings_ar:any;
  major_competitors_settings_ar:any;
  manufacturing_stages_settings_ar:any;
  production_lines_settings_ar:any;
  production_lines_settings_en:any;
  Product_Production_Lines_Section_settings_en:any;
  manufacturing_stages_settings_en:any;
  //asd
  inputs = {

    ProductName: "",
    HSCODE: "",
    ISIC: "",
    GuiId: "",
    Description: "",
    Users: "",
    User: "",
    Substitutes: "",
    Weight: "",
    WeightUnit: "",
    Size: "",
    SizeUnit: "",
    ShelfLife: "",
    ShelfLifeUnit: "",
    Brand: "",
    AnnualProductionCap: "",
    AnnualPrdCapUOM: "",
    LicensedProductionCap: "",
    LicensedProductionCapUnit: "",
    CommercialProjYear: "",
    NumberOfClients: "",
    ProposedProductAdCampagin: "",
    FactorsAffectingDemand: "",
    Sales: [],
    TargetMarket: [],
    TargetMarketRegion: [],
    LocalCompetitors: [],
    ImportCompetitors: [],
    Demand: [],
    ExpectedSales: [],
    Clients: [],
    ProposedSellingPrice: [],
    MajorCompetitor: [],
    ManufacturingStages: [],
    ProductionLines: [],
    ExpectedSalesDocumentsFlag: false
  }

  product_sales_source: LocalDataSource;
  target_market_source: LocalDataSource;
  target_market_region_source: LocalDataSource;
  local_competitors_source: LocalDataSource;
  import_competitors_source: LocalDataSource;
  product_demand_source: LocalDataSource;
  expected_sales_source: LocalDataSource;
  clients_source: LocalDataSource;
  proposed_selling_price_source: LocalDataSource;
  major_competitors_source: LocalDataSource;
  manufacturing_stages_source: LocalDataSource;
  production_lines_source: LocalDataSource;

  product_sales_source_length = 0;
  target_market_source_length = 0;
  target_market_region_source_length = 0;
  local_competitors_source_length = 0;
  import_competitors_source_length = 0;
  product_demand_source_length = 0;
  expected_sales_source_length = 0;
  clients_source_length = 0;
  proposed_selling_price_source_length = 0;
  major_competitors_source_length = 0;
  manufacturing_stages_source_length = 0;
  production_lines_source_length = 0;

  deleted_product_sales: any = [];
  deleted_target_market: any = [];
  deleted_target_market_region: any = [];
  deleted_local_competitors: any = [];
  deleted_local_competitors_sales_volume: any = [];
  deleted_additional_capacity: any = [];
  deleted_import_competitors: any = [];
  deleted_import_competitors_sales_volume: any = [];
  deleted_expected_sales_volume_export_volume: any = [];
  deleted_product_demand: any = [];
  deleted_expected_sales: any = [];
  deleted_clients: any = [];
  deleted_proposed_selling_price: any = [];
  deleted_major_competitors: any = [];
  deleted_manufacturing_stages: any = [];
  deleted_production_lines: any = [];
  landloanrequeststatus: any = 0;

  constructor(private ref: ChangeDetectorRef,private communicationsService: CommunicationsService, private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService, private modalService: NgbModal, private router: Router,
    private loanApplicationService: LoanApplicationService, protected localStorage: LocalStorage,
    private customerProfileService: CustomerProfileService,
    private translateService: TranslateService, private bsLocaleService: BsLocaleService,
    public commonService: CommonService, private commonCommentsService: CommonCommentsService) {

    this.translate = this.commonService.returnTranslate();

    this.tour_en = this.commonService.returnEnglishTour();
    this.tour_ar = this.commonService.returnArabicTour();
    this.initTableSettings();

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.initTableSettings();
      this.returnEnOrArForCalendar();
    });

  }
  returnEnOrArForCalendar() {

    if (this.commonService.defaultLanguage === undefined || this.commonService.defaultLanguage === 'ar') {
      this.bsLocaleService.use('ar');
    } else if (this.commonService.defaultLanguage === 'en') {
      this.bsLocaleService.use('en');
    } else {
      this.bsLocaleService.use('en');
    }

  }

  initTableSettings(){
  
  this.local_competitors_sales_volume_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Local Competitors Sales Volume Found",

    add: {
      addButtonContent: '<i class="nb-plus" title="Add"></i>',
      createButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {
      Type: {
        title: "Target Market",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      Year: {
        title: "Year",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      LocalQuantity: {
        title: "Quantity",
        type: "number",
        filter: false
      },
      QuantityUOM: {
        title: 'Quantity Unit of Measure',
        type: 'html',
        defaultValue: '',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      }
    }
  };
  
  this.local_competitors_sales_volume_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على حجم مبيعات المنافسين المحليين",

    add: {
      addButtonContent: '<i class="nb-plus" title="إضافة"></i>',
      createButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      Year: {
        title: "عام",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      LocalQuantity: {
        title: "كمية",
        type: "number",
        filter: false
      },
      QuantityUOM: {
        title: 'وحدة كمية القياس',
        type: 'html',
        defaultValue: '',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      }
    }
  };

  this.additional_capacity_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Additional Capacity Found",

    add: {
      addButtonContent: '<i class="nb-plus" title="Add"></i>',
      createButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {
      Name: {
        title: "Name",
        type: "text",
        filter: false
      },
      Capacity: {
        title: "Capacity",
        type: "number",
        filter: false
      },
      Date: {
        title: 'Date of Implementation',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      }
    }
  };
  this.additional_capacity_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لا توجد قدرة إضافية",

    add: {
      addButtonContent: '<i class="nb-plus" title="إضافة"></i>',
      createButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "اجراءات"
    },

    columns: {
      Name: {
        title: "اسم",
        type: "text",
        filter: false
      },
      Capacity: {
        title: "سعة",
        type: "number",
        filter: false
      },
      Date: {
        title: 'تاريخ التنفيذ',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: SmartTableDatepickerComponent,
        }
      }
    }
  };

  this.import_competitors_sales_volume_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Import Competitors Sales Volume Found",

    add: {
      addButtonContent: '<i class="nb-plus" title="Add"></i>',
      createButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {
      Year: {
        title: "Year",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      Quantity: {
        title: "Quantity",
        type: "number",
        filter: false
      },
      QuantityUOM: {
        title: 'Quantity Unit of Measure',
        type: 'html',
        defaultValue: '',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      }
    }
  };

  this.import_competitors_sales_volume_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لا يوجد حجم استيراد المنافسين حجم المبيعات",

    add: {
      addButtonContent: '<i class="nb-plus" title="إضافة"></i>',
      createButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "اجراءات"
    },

    columns: {
      Year: {
        title: "عام",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      Quantity: {
        title: "كمية",
        type: "number",
        filter: false
      },
      QuantityUOM: {
        title: 'وحدة كمية القياس',
        type: 'html',
        defaultValue: '',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      }
    }
  };

  this.expected_sales_volume_export_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Export Volume Found",

    add: {
      addButtonContent: '<i class="nb-plus" title="Add"></i>',
      createButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {
      Region: {
        title: "Region / Countries",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      Export: {
        title: "Quantity",
        type: "number",
        filter: false
      }
    }
  };

  this.expected_sales_volume_export_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على حجم التصدير",

    add: {
      addButtonContent: '<i class="nb-plus" title="إضافة"></i>',
      createButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "اجراءات"
    },

    columns: {
      Region: {
        title: "المنطقة / الدول",
        type: 'html',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      Export: {
        title: "كمية",
        type: "number",
        filter: false
      }
    }
  };

  this.Product_Production_Lines_Section_settings_en = {

    noDataMessage: "No Product Production Lines Section Found",

    add: {
      addButtonContent: '<i class="nb-plus" title="Add"></i>',
      createButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="Confirm"></i>',
      cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "Actions"
    },

    columns: {

      Description: {
        title: "Description",
        type: "text",
        filter: false
      },
      Rate: {
        title: "Rate",
        type: "number",
        filter: false
      },
      RateUnit: {
        title: "Rate Unit of Measure",
        type: "number",
        filter: false
      },
      MeasurementUnit: {
        title: 'Measurement Unit of Measure',
        type: 'html',
        defaultValue: '',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      ShifHours: {
        title: "Shift Hours",
        type: "number",
        filter: false
      },
      ShiftPerDay: {
        title: "Shift Per Day",
        type: "number",
        filter: false
      },
      DaysPerYear: {
        title: "Days Per Year",
        type: "number",
        filter: false
      },
      PercentageEfficiency: {
        title: "Percentage Efficiency",
        type: "number",
        filter: false
      },
    }
  };

  this.Product_Production_Lines_Section_settings_ar = {

    noDataMessage: "لم يتم العثور على قسم خطوط إنتاج المنتجات",

    add: {
      addButtonContent: '<i class="nb-plus" title="إضافة"></i>',
      createButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="تصحيح"></i>',
      saveButtonContent: '<i class="nb-checkmark" title="تؤكد"></i>',
      cancelButtonContent: '<i class="nb-close" title="إلغاء"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
      confirmDelete: true,
    },

    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
      columnTitle: "اجراءات"
    },

    columns: {

      Description: {
        title: "وصف",
        type: "text",
        filter: false
      },
      Rate: {
        title: "معدل",
        type: "number",
        filter: false
      },
      RateUnit: {
        title: "وحدة قياس القياسات",
        type: "number",
        filter: false
      },
      MeasurementUnit: {
        title: 'وحدة قياس القياس',
        type: 'html',
        defaultValue: '',
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        filter: false
      },
      ShifHours: {
        title: "ساعات التحول",
        type: "number",
        filter: false
      },
      ShiftPerDay: {
        title: "تحول في اليوم",
        type: "number",
        filter: false
      },
      DaysPerYear: {
        title: "أيام في السنة",
        type: "number",
        filter: false
      },
      PercentageEfficiency: {
        title: "نسبة النسبة",
        type: "number",
        filter: false
      },
    }
  };


  this.product_sales_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Sponsor Product Sales Found",

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
      Year: {
        title: "Year",
        type: "text"
      },
      LocalQuantity: {
        title: "Local Quantity",
        type: "text",
      },
      ExportQuantity: {
        title: "Export Quantity",
        type: "text"
      },
      Value: {
        title: "Total Quantity",
        type: "text"
      }
    }
  };

  this.product_sales_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على مبيعات المنتجات الراعية",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Year: {
        title: "سنة",
        type: "text"
      },
      LocalQuantity: {
        title: "الكمية المحلية",
        type: "text",
      },
      ExportQuantity: {
        title: "كبية التصدير",
        type: "text"
      },
      Value: {
        title: "مجموع العدد",
        type: "text"
      }
    }
  };

  this.target_market_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Target Market Segments Found",

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
      Type: {
        title: "Target Market",
        type: "text",
      },
      Percent: {
        title: "Percentage",
        type: "text"
      }
    }
  };

  this.target_market_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على شرائح السوق المستهدفة",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: "text",
      },
      Percent: {
        title: "النسبة المئوية",
        type: "text"
      }
    }
  };

  this.target_market_region_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Target Market Region / Countries Found",

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
      Type: {
        title: "Target Market",
        type: "text",
      },
      Percent: {
        title: "Percentage",
        type: "text"
      }
    }
  };

  this.target_market_region_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على منطقة مستهدفة للمنطقة / البلدان",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: "text",
      },
      Percent: {
        title: "النسبة المئوية",
        type: "text"
      }
    }
  };

  this.local_competitors_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Factories in Target Market Region / Countries Found",

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
      Type: {
        title: "Target Market",
        type: "text",
      },
      FactoryName: {
        title: "Factory",
        type: "text",
      },
      ProductionCapacity: {
        title: "Production Capacity",
        type: "text"
      },
      ProductionUOM: {
        title: "Production Capacity Unit of Measure",
        type: "text"
      }
    }
  };

  this.local_competitors_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لا توجد مصانع في منطقة السوق المستهدفة / البلدان التي تم العثور عليها",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: "text",
      },
      FactoryName: {
        title: "مصنع",
        type: "text",
      },
      ProductionCapacity: {
        title: "القدرة الانتاجية",
        type: "text"
      },
      ProductionUOM: {
        title: "وحدة القدرة الإنتاجية للقياس",
        type: "text"
      }
    }
  };

  this.import_competitors_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Import Competitors in Target Market Region / Countries Found",

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
      Orgin: {
        title: "Target Market",
        type: "text",
      },
      FactoryName: {
        title: "Trader",
        type: "text",
      }
    }
  };

  this.import_competitors_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لا توجد منافسين استيراد في منطقة السوق المستهدفة / البلدان وجدت",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Orgin: {
        title: "السوق المستهدف",
        type: "text",
      },
      FactoryName: {
        title: "تاجر",
        type: "text",
      }
    }
  };

  this.product_demand_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Historical Product Demand Found",

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
      Type: {
        title: "Target Market",
        type: "text",
      },
      Year: {
        title: "Year",
        type: "text",
      },
      LocalQuantity: {
        title: "Local Quantity",
        type: "text"
      },
      ImportQuantity: {
        title: "Import Quantity",
        type: "text",
      },
      ExportQuantity: {
        title: "Demand",
        type: "text",
      }
    }
  };

  this.product_demand_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لا يوجد طلب منتج تاريخي",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: "text",
      },
      Year: {
        title: "عام",
        type: "text",
      },
      LocalQuantity: {
        title: "الكمية المحلية",
        type: "text"
      },
      ImportQuantity: {
        title: "الكمبية المستوردة",
        type: "text",
      },
      ExportQuantity: {
        title: "الطلب",
        type: "text",
      }
    }
  };

  this.expected_sales_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Sales Forecast Found",

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
      Year: {
        title: "Year",
        type: "text",
      },
      Local: {
        title: "Local",
        type: "text"
      },
      TotalExport: {
        title: "Export",
        type: "text",
      },
      Value: {
        title: "Total",
        type: "text",
      }
    }
  };
  
  this.expected_sales_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على توقعات المبيعات",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Year: {
        title: "عام",
        type: "text",
      },
      Local: {
        title: "محلي",
        type: "text"
      },
      TotalExport: {
        title: "تصدير",
        type: "text",
      },
      Value: {
        title: "مجموع",
        type: "text",
      }
    }
  };

  this.clients_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Targeted End Users Found",

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
      Year: {
        title: "Year",
        type: "text",
      },
      ClientName: {
        title: "End User Name",
        type: "text"
      },
      ClientLocation: {
        title: "End User Location",
        type: "text"
      },
      ConsumptionQuantity: {
        title: "Consumption Quantity",
        type: "text",
      }
    }
  };

  
  this.clients_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على مستخدم نهائي مستهدف",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Year: {
        title: "عام",
        type: "text",
      },
      ClientName: {
        title: "اسم المستخدم النهائي",
        type: "text"
      },
      ClientLocation: {
        title: "موقع المستخدم النهائي",
        type: "text"
      },
      ConsumptionQuantity: {
        title: "كمية الاستهلاك",
        type: "text",
      }
    }
  };

  this.proposed_selling_price_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Sponsor Proposed Price Found",

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
      Type: {
        title: "Target Market",
        type: "text"
      },
      MarketType: {
        title: "Market Type",
        type: "text"
      },
      ProposedPrice: {
        title: "Proposed Price",
        type: "text",
      },
      CompetitorPrice: {
        title: "Competitor Price Range",
        type: "text",
      },
      ImporterPrice: {
        title: "Importer Price Range",
        type: "text",
      }
    }
  };

  this.proposed_selling_price_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على السعر المقترح",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: "text"
      },
      MarketType: {
        title: "نوع السوق",
        type: "text"
      },
      ProposedPrice: {
        title: "السعر المقترح",
        type: "text",
      },
      CompetitorPrice: {
        title: "نطاق منافس السعر",
        type: "text",
      },
      ImporterPrice: {
        title: "نطاق المستورد",
        type: "text",
      }
    }
  };

  this.major_competitors_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Major Competitor Market Share Found",

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
      Type: {
        title: "Target Market",
        type: "text"
      },
      CompetitorName: {
        title: "Competitor Name",
        type: "text"
      },
      MarketShare: {
        title: "Market Share Percentage",
        type: "text",
      }
    }
  };

  this.major_competitors_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على منافس كبير في السوق",

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
      columnTitle: "اجراءات"
    },

    columns: {
      Type: {
        title: "السوق المستهدف",
        type: "text"
      },
      CompetitorName: {
        title: "اسم المنافس",
        type: "text"
      },
      MarketShare: {
        title: "نسبة حصة السوق",
        type: "text",
      }
    }
  };

  this.manufacturing_stages_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Manufacturing Stages Found",

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

      StageSequence: {
        title: "Stage Sequence",
        type: "text",
      },
      MachineId: {
        title: "Machine ID",
        type: "text",
      },
      MachineName: {
        title: "Machine Name",
        type: "text"
      },
      Operators: {
        title: "Number of Operators",
        type: "text",
      },
      // ProductionRate: {
      //   title: "Production Rate",
      //   type: "text",
      // },
      // ProductionUom: {
      //   title: "Production Unit of Measure",
      //   type: "text",
      // },
      // StageName: {
      //   title: "Stage Name",
      //   type: "text"
      // },

    }
  };

  

  this.manufacturing_stages_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على مراحل التصنيع",

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
      columnTitle: "اجراءات"
    },

    columns: {

      StageSequence: {
        title: "سلسلة المرحلة",
        type: "text",
      },
      MachineId: {
        title: "هوية الالة",
        type: "text",
      },
      MachineName: {
        title: "اسم الالة",
        type: "text"
      },
      Operators: {
        title: "عدد المشغلين",
        type: "text",
      },
      // ProductionRate: {
      //   title: "Production Rate",
      //   type: "text",
      // },
      // ProductionUom: {
      //   title: "Production Unit of Measure",
      //   type: "text",
      // },
      // StageName: {
      //   title: "Stage Name",
      //   type: "text"
      // },

    }
  };

  this.production_lines_settings_en = {

    hideSubHeader: true,

    noDataMessage: "No Production Lines Found",

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
      ProductionLinesDesc: {
        title: "Production Lines Description",
        type: "text",
      }
    }
  };

  this.production_lines_settings_ar = {

    hideSubHeader: true,

    noDataMessage: "لم يتم العثور على خطوط إنتاج",

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
      columnTitle: "اجراءات"
    },

    columns: {
      ProductionLinesDesc: {
        title: "وصف خطوط الانتاج",
        type: "text",
      }
    }
  };


}
  requestId = 0;

  statusCode = "";

  productBrochuresFiles: any = [];

  productBrochuresFileLength = 0;


  expectedSalesFiles: any = [];

  expectedSalesFileLength = 0;


  translate: any;
  serviceId = 9;
  ngOnInit() {
    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
    this.localStorage.getItem("serviceId").subscribe(data => {
      if (data)
        this.serviceId = data;

      var current_date = new Date();


      var current_year = current_date.getFullYear();

      this.current_year = current_year.toString();


      var current_month = current_date.getMonth() + 1;

      var month_value = current_month - 1;

      for (var i = 0; i < month_value; i++)
        this.month_till_date_list.push(this.monthList[i]);

      if (current_month == 1) {

        var year_value = current_year - 1;

        for (var i = 0; i < 3; i++) {

          this.year_minus_3_list.push(year_value.toString());

          year_value--;

        }

      }

      else {

        var year_value = current_year;

        for (var i = 0; i < 4; i++) {

          this.year_minus_3_list.push(year_value.toString());

          year_value--;

        }

      }


      var year_value = current_year - 1;

      for (var i = 0; i < 3; i++) {

        this.year_last_3_list.push(year_value.toString());

        year_value--;

      }

      this.requestId = this.customerProfileService.loanRequestId;
      this.statusCode = this.customerProfileService.statusCode;

      this.projId = this.customerProfileService.loanArray.ProjId;
      this.loanPurpose = this.customerProfileService.loanArray.LoanPurpose;

      this.loanTypeValues = this.customerProfileService.loanArray.LoanTypeValues;

      if (this.loanTypeValues.selectedLoanTypeOperation == "show_only") {

        for (var i = 0; i < this.loanTypeValues.selectedLoanType["sections"].length; i++)
          for (var j = 0; j < this.panelsVisible.length; j++)
            if (this.loanTypeValues.selectedLoanType["sections"][i] == this.panelsVisible[j].panel)
              this.panelsVisible[j].visible = true;

      }

      else {

        for (var i = 0; i < this.panelsVisible.length; i++)
          this.panelsVisible[i].visible = true;

      }

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

      this.local_competitors_sales_volume_settings_en.actions.add = this.add_edit_delete_show;
      this.local_competitors_sales_volume_settings_en.actions.edit = this.add_edit_delete_show;
      this.local_competitors_sales_volume_settings_en.actions.delete = this.add_edit_delete_show;

      this.local_competitors_sales_volume_settings_ar.actions.add = this.add_edit_delete_show;
      this.local_competitors_sales_volume_settings_ar.actions.edit = this.add_edit_delete_show;
      this.local_competitors_sales_volume_settings_ar.actions.delete = this.add_edit_delete_show;

      this.import_competitors_sales_volume_settings_en.actions.add = this.add_edit_delete_show;
      this.import_competitors_sales_volume_settings_en.actions.edit = this.add_edit_delete_show;
      this.import_competitors_sales_volume_settings_en.actions.delete = this.add_edit_delete_show;

      this.import_competitors_sales_volume_settings_ar.actions.add = this.add_edit_delete_show;
      this.import_competitors_sales_volume_settings_ar.actions.edit = this.add_edit_delete_show;
      this.import_competitors_sales_volume_settings_ar.actions.delete = this.add_edit_delete_show;

      this.expected_sales_volume_export_settings_en.actions.add = this.add_edit_delete_show;
      this.expected_sales_volume_export_settings_en.actions.edit = this.add_edit_delete_show;
      this.expected_sales_volume_export_settings_en.actions.delete = this.add_edit_delete_show;

      this.expected_sales_volume_export_settings_ar.actions.add = this.add_edit_delete_show;
      this.expected_sales_volume_export_settings_ar.actions.edit = this.add_edit_delete_show;
      this.expected_sales_volume_export_settings_ar.actions.delete = this.add_edit_delete_show;

      this.Product_Production_Lines_Section_settings_en.actions.add = this.add_edit_delete_show;
      this.Product_Production_Lines_Section_settings_en.actions.edit = this.add_edit_delete_show;
      this.Product_Production_Lines_Section_settings_en.actions.delete = this.add_edit_delete_show;

      this.Product_Production_Lines_Section_settings_ar.actions.add = this.add_edit_delete_show;
      this.Product_Production_Lines_Section_settings_ar.actions.edit = this.add_edit_delete_show;
      this.Product_Production_Lines_Section_settings_ar.actions.delete = this.add_edit_delete_show;


      this.product_sales_settings_en.actions.edit = this.add_edit_delete_show;
      this.product_sales_settings_en.actions.delete = this.add_edit_delete_show;

      this.product_sales_settings_ar.actions.edit = this.add_edit_delete_show;
      this.product_sales_settings_ar.actions.delete = this.add_edit_delete_show;


      this.target_market_settings_en.actions.edit = this.add_edit_delete_show;
      this.target_market_settings_en.actions.delete = this.add_edit_delete_show;

      this.target_market_settings_ar.actions.edit = this.add_edit_delete_show;
      this.target_market_settings_ar.actions.delete = this.add_edit_delete_show;


      this.target_market_region_settings_en.actions.edit = this.add_edit_delete_show;
      this.target_market_region_settings_en.actions.delete = this.add_edit_delete_show;

      this.target_market_region_settings_ar.actions.edit = this.add_edit_delete_show;
      this.target_market_region_settings_ar.actions.delete = this.add_edit_delete_show;


      this.local_competitors_settings_en.actions.edit = this.add_edit_delete_show;
      this.local_competitors_settings_en.actions.delete = this.add_edit_delete_show;

      this.local_competitors_settings_ar.actions.edit = this.add_edit_delete_show;
      this.local_competitors_settings_ar.actions.delete = this.add_edit_delete_show;


      this.import_competitors_settings_en.actions.edit = this.add_edit_delete_show;
      this.import_competitors_settings_en.actions.delete = this.add_edit_delete_show;

      this.import_competitors_settings_ar.actions.edit = this.add_edit_delete_show;
      this.import_competitors_settings_ar.actions.delete = this.add_edit_delete_show;


      // this.product_demand_settings_en.actions.edit = this.add_edit_delete_show;
      // this.product_demand_settings_en.actions.delete = this.add_edit_delete_show;

      // this.product_demand_settings_ar.actions.edit = this.add_edit_delete_show;
      // this.product_demand_settings_ar.actions.delete = this.add_edit_delete_show;


      this.expected_sales_settings_en.actions.edit = this.add_edit_delete_show;
      this.expected_sales_settings_en.actions.delete = this.add_edit_delete_show;

      this.expected_sales_settings_ar.actions.edit = this.add_edit_delete_show;
      this.expected_sales_settings_ar.actions.delete = this.add_edit_delete_show;


      this.clients_settings_en.actions.edit = this.add_edit_delete_show;
      this.clients_settings_en.actions.delete = this.add_edit_delete_show;

      this.clients_settings_ar.actions.edit = this.add_edit_delete_show;
      this.clients_settings_ar.actions.delete = this.add_edit_delete_show;


      this.proposed_selling_price_settings_en.actions.edit = this.add_edit_delete_show;
      this.proposed_selling_price_settings_en.actions.delete = this.add_edit_delete_show;

      this.proposed_selling_price_settings_ar.actions.edit = this.add_edit_delete_show;
      this.proposed_selling_price_settings_ar.actions.delete = this.add_edit_delete_show;


      this.major_competitors_settings_en.actions.edit = this.add_edit_delete_show;
      this.major_competitors_settings_en.actions.delete = this.add_edit_delete_show;

      this.major_competitors_settings_ar.actions.edit = this.add_edit_delete_show;
      this.major_competitors_settings_ar.actions.delete = this.add_edit_delete_show;


      this.manufacturing_stages_settings_en.actions.edit = this.add_edit_delete_show;
      this.manufacturing_stages_settings_en.actions.delete = this.add_edit_delete_show;

      this.manufacturing_stages_settings_ar.actions.edit = this.add_edit_delete_show;
      this.manufacturing_stages_settings_ar.actions.delete = this.add_edit_delete_show;


      this.production_lines_settings_en.actions.edit = this.add_edit_delete_show;
      this.production_lines_settings_en.actions.delete = this.add_edit_delete_show;

      this.production_lines_settings_ar.actions.edit = this.add_edit_delete_show;
      this.production_lines_settings_ar.actions.delete = this.add_edit_delete_show;


      if (this.requestId == 0)
        this.router.navigateByUrl('/pages/new-request/loan-application');

      else {

        this.loanApplicationService
          .getLoanMachineryDropdown(this.customerProfileService.loanArray.FinPlanId)
          .then((res) => (this.getMachineryDropdown(res)), err => this.resolveError());

        this.unit_list = this.customerProfileService.loanDropdowns.UnitOfMeasure;;

        this.market_type_list = this.customerProfileService.loanDropdowns.TargetMarketType;

        this.market_region_type_list = this.customerProfileService.loanDropdowns.TargetMarketRegion;

        this.country_list = this.customerProfileService.loanDropdowns.Country;

        for (var i = 0; i < this.country_list.length; i++)
          this.country_name_list.push(this.lang == 'ar'?this.country_list[i].DescAr:this.country_list[i].Name);

        for (var i = 0; i < this.unit_list.length; i++)
          this.unit_name_list.push(this.lang == 'ar'?this.unit_list[i].NameAr:this.unit_list[i].Name); 
        if(this.market_type_list)
        for (var i = 0; i < this.market_type_list.length; i++)
          this.market_type_desc_list.push(this.lang == 'ar'?this.market_type_list[i].DescAr:this.market_type_list[i].Desc);

        for (var i = 0; i < this.market_region_type_list.length; i++)
          this.market_region_type_desc_list.push(this.lang == 'ar'?this.market_region_type_list[i].DescAr:this.market_region_type_list[i].Desc);

        for (var i = 0; i < this.machineries_list.length; i++)
          this.machineries_desc_list.push(this.lang == 'ar'?this.machineries_list[i].DescAr:this.machineries_list[i].Desc);

        this.product_list = this.customerProfileService.loanArray.GenInfoProducts;

        var product_list_length = this.product_list.length;

        if (product_list_length > 0) {

          for (var i = 0; i < product_list_length; i++)
            if (i == 0)
              this.product_list[i]["selected"] = true;
            else
              this.product_list[i]["selected"] = false;

          this.selected_product = this.product_list[0];

          this.product_sales_source = new LocalDataSource();
          this.target_market_source = new LocalDataSource();
          this.target_market_region_source = new LocalDataSource();
          this.local_competitors_source = new LocalDataSource();
          this.import_competitors_source = new LocalDataSource();
          this.product_demand_source = new LocalDataSource();
          this.expected_sales_source = new LocalDataSource();
          this.clients_source = new LocalDataSource();
          this.proposed_selling_price_source = new LocalDataSource();
          this.major_competitors_source = new LocalDataSource();
          this.manufacturing_stages_source = new LocalDataSource();
          this.production_lines_source = new LocalDataSource();

          var unit_list = [];

          for (var i = 0; i < this.unit_name_list.length; i++)
            unit_list.push({ value: this.unit_name_list[i], title: this.unit_name_list[i] });

          var year_list = [];

          var year_last_3_list = [];

          var target_market_type = [];

          for (var i = 0; i < this.year_list.length; i++)
            year_list.push({ value: this.year_list[i], title: this.year_list[i] });

          for (var i = 0; i < this.year_last_3_list.length; i++)
            year_last_3_list.push({ value: this.year_last_3_list[i], title: this.year_last_3_list[i] });

          target_market_type.push({ value: "Local", title: "Local" });
          target_market_type.push({ value: "Export", title: "Export" });

          this.local_competitors_sales_volume_settings_en.columns.QuantityUOM.editor.config.list = unit_list;
          this.local_competitors_sales_volume_settings_en.columns.Year.editor.config.list = year_last_3_list;
          this.local_competitors_sales_volume_settings_en.columns.Type.editor.config.list = target_market_type;

          this.local_competitors_sales_volume_settings_ar.columns.QuantityUOM.editor.config.list = unit_list;
          this.local_competitors_sales_volume_settings_ar.columns.Year.editor.config.list = year_last_3_list;
          this.local_competitors_sales_volume_settings_ar.columns.Type.editor.config.list = target_market_type;

          this.import_competitors_sales_volume_settings_en.columns.QuantityUOM.editor.config.list = unit_list;
          this.import_competitors_sales_volume_settings_en.columns.Year.editor.config.list = year_last_3_list;

          this.import_competitors_sales_volume_settings_ar.columns.QuantityUOM.editor.config.list = unit_list;
          this.import_competitors_sales_volume_settings_ar.columns.Year.editor.config.list = year_last_3_list;

          this.Product_Production_Lines_Section_settings_en.columns.MeasurementUnit.editor.config.list = unit_list;
          this.Product_Production_Lines_Section_settings_ar.columns.MeasurementUnit.editor.config.list = unit_list;

          this.getLoanApplicationMarketingInformation();

        }

        else
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.ProductListEmpty'));

      }
    });
  }

  getLoanApplicationMarketingInformation() {

    this.spinnerService.show();

    try {

      this.loanApplicationService
        .getMarketingInformation(this.selected_product["ProductId"], this.customerProfileService.currentCustomerProfile.customerProfileId)
        .then((res) => (this.resolveLoanApplicationMarketingInformation(res, 0)), err => this.resolveError());

    }

    catch (err) {
      this.resolveError();
    }

  }

  resolveLoanApplicationMarketingInformation(res, from) {

    this.startedFilling = 0;

    this.market_type_selected_desc_list = [];

    this.GenInfoPer = this.customerProfileService.loanPercentageValues.GenInfoPer;
    this.MarkInfoPer = this.customerProfileService.loanPercentageValues.MarkInfoPer;
    this.TechInfoPer = this.customerProfileService.loanPercentageValues.TechInfoPer;
    this.FinInfoPer = this.customerProfileService.loanPercentageValues.FinInfoPer;
    this.ChecklistPer = this.customerProfileService.loanPercentageValues.ChecklistPer;

    this.product_sales_source.empty();
    this.inputs.Sales = [];
    this.product_sales_source_length = 0;
    this.deleted_product_sales = [];

    this.production_lines_source.empty();
    this.inputs.ProductionLines = [];
    this.production_lines_source_length = 0;
    this.deleted_production_lines = [];

    this.manufacturing_stages_source.empty();
    this.inputs.ManufacturingStages = [];
    this.manufacturing_stages_source_length = 0;
    this.deleted_manufacturing_stages = [];

    this.major_competitors_source.empty();
    this.inputs.MajorCompetitor = [];
    this.major_competitors_source_length = 0;
    this.deleted_major_competitors = [];

    this.proposed_selling_price_source.empty();
    this.inputs.ProposedSellingPrice = [];
    this.proposed_selling_price_source_length = 0;
    this.deleted_proposed_selling_price = [];

    this.clients_source.empty();
    this.inputs.Clients = [];
    this.clients_source_length = 0;
    this.deleted_clients = [];

    this.expected_sales_source.empty();
    this.inputs.ExpectedSales = [];
    this.expected_sales_source_length = 0;
    this.deleted_expected_sales = [];
    this.deleted_expected_sales_volume_export_volume = [];

    this.product_demand_source.empty();
    this.inputs.Demand = [];
    this.product_demand_source_length = 0;
    this.deleted_product_demand = [];

    this.import_competitors_source.empty();
    this.inputs.ImportCompetitors = [];
    this.import_competitors_source_length = 0;
    this.deleted_import_competitors = [];
    this.deleted_import_competitors_sales_volume = [];

    this.local_competitors_source.empty();
    this.inputs.LocalCompetitors = [];
    this.local_competitors_source_length = 0;
    this.deleted_local_competitors = [];
    this.deleted_local_competitors_sales_volume = [];
    this.deleted_additional_capacity = [];

    this.target_market_region_source.empty();
    this.inputs.TargetMarketRegion = [];
    this.target_market_region_source_length = 0;
    this.deleted_target_market_region = [];

    this.target_market_source.empty();
    this.inputs.TargetMarket = [];
    this.target_market_source_length = 0;
    this.deleted_target_market = [];

    this.inputs.ProductName = res.ProductName;
    this.inputs.HSCODE = res.HSCODE;
    this.inputs.GuiId = res.GuiId ? res.GuiId : "";
    this.inputs.ISIC = res.ISIC;
    this.inputs.Description = res.Description;
    this.inputs.Users = res.Users;
    this.inputs.User = res.User;
    this.inputs.Substitutes = res.Substitutes;
    this.inputs.CommercialProjYear = res.CommercialProjYear;

    if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

      this.com_proj_plus_5_list = [];

      var year_value = parseInt(this.inputs.CommercialProjYear);

      for (var i = 0; i < 5; i++) {

        this.com_proj_plus_5_list.push(year_value.toString());

        year_value++;

      }


      this.client_6_year_list = [];

      var current_date = new Date();

      var current_year = current_date.getFullYear();

      var year_value = current_year - 1;

      for (var i = 0; i < 3; i++) {

        this.client_6_year_list.push(year_value.toString());

        year_value--;

      }

      var year_value = parseInt(this.inputs.CommercialProjYear);

      for (var i = 0; i < 3; i++) {

        var year_value_1 = year_value.toString();

        var client_year_value = this.client_6_year_list.find((o) => o == year_value_1);
        if (!client_year_value)
          this.client_6_year_list.push(year_value_1);

        year_value++;

      }

    }

    this.client_6_year_list = this.client_6_year_list.sort((n1, n2) => n1 - n2);


    this.inputs.NumberOfClients = res.NumberOfClients;


    this.inputs.Weight = res.Weight;

    this.inputs.WeightUnit = res.WeightUOM ? (res.WeightUOM[0].Desc ? res.WeightUOM[0].Desc : "") : "";


    this.inputs.Size = res.Size;

    this.inputs.SizeUnit = res.SizeUOM ? (res.SizeUOM[0].Desc ? res.SizeUOM[0].Desc : "") : "";


    this.inputs.ShelfLife = res.ShelfLife;

    this.inputs.ShelfLifeUnit = res.ShelfLifeUOM ? (res.ShelfLifeUOM[0].Desc ? res.ShelfLifeUOM[0].Desc : "") : "";


    this.inputs.Brand = res.Brand;

    //ADDED BY JAI

    this.inputs.AnnualProductionCap = res.AnnualProductionCap;

    this.inputs.AnnualPrdCapUOM = res.AnnualPrdCapUOM ? (res.AnnualPrdCapUOM[0].Desc ? res.AnnualPrdCapUOM[0].Desc : "") : "";

    this.selected_unit_name = res.AnnualPrdCapUOM ? (res.AnnualPrdCapUOM[0].Desc ? res.AnnualPrdCapUOM[0].Desc : "") : "";


    this.inputs.LicensedProductionCap = res.LicensedProductionCap;

    this.inputs.LicensedProductionCapUnit = res.LicensedProdCapUOM ? (res.LicensedProdCapUOM[0].Desc ? res.LicensedProdCapUOM[0].Desc : "") : "";


    this.inputs.ProposedProductAdCampagin = res.ProposedProductAdCampagin ? res.ProposedProductAdCampagin : "";

    this.inputs.FactorsAffectingDemand = res.FactorsAffectingDemand ? res.FactorsAffectingDemand : "";


    if (res.Sales) {

      for (var i = 0; i < res.Sales.length; i++) {

        res.Sales[i]["Operation"] = "";

        var quantity_unit = this.unit_list.find((o) => o.Code == res.Sales[i].QuantityUOM);
        if (quantity_unit)
          res.Sales[i].QuantityUOM = quantity_unit.Name;

        this.inputs.Sales.push(res.Sales[i]);
        delete this.inputs.Sales[i].Orgin;
        delete this.inputs.Sales[i].UserId;

      }

      this.product_sales_source.load(this.inputs.Sales);

      this.product_sales_source_length = res.Sales.length;

    }


    if (res.TargetMarket) {

      for (var i = 0; i < res.TargetMarket.length; i++) {

        res.TargetMarket[i]["Operation"] = "";

        var target_market_type = this.market_type_list.find((o) => o.Id == res.TargetMarket[i].Type);
        if (target_market_type)
          res.TargetMarket[i].Type = target_market_type.Desc;

        this.market_type_selected_desc_list.push(res.TargetMarket[i].Type);

        this.inputs.TargetMarket.push(res.TargetMarket[i]);
        delete this.inputs.TargetMarket[i].Orgin;
        delete this.inputs.TargetMarket[i].UserId;

      }

      this.target_market_source.load(this.inputs.TargetMarket);

      this.target_market_source_length = res.TargetMarket.length;

    }


    if (res.TargetMarketRegion) {

      var export_percentage_sum = 0;

      for (var i = 0; i < res.TargetMarketRegion.length; i++) {

        res.TargetMarketRegion[i]["Operation"] = "";

        var target_market_region_type = this.market_region_type_list.find((o) => o.Id == res.TargetMarketRegion[i].Type);
        if (target_market_region_type)
          res.TargetMarketRegion[i].Type = target_market_region_type.Desc;

        var target_market_region_region = this.country_list.find((o) => o.Code == res.TargetMarketRegion[i].Region);
        if (target_market_region_region)
          res.TargetMarketRegion[i].Region = target_market_region_region.Name;

        if (res.TargetMarketRegion[i].Type == "Export")
          export_percentage_sum += parseFloat(res.TargetMarketRegion[i].Percent);

        this.inputs.TargetMarketRegion.push(res.TargetMarketRegion[i]);
        delete this.inputs.TargetMarketRegion[i].Orgin;
        delete this.inputs.TargetMarketRegion[i].UserId;

      }

      this.target_market_region_source.load(this.inputs.TargetMarketRegion);

      this.target_market_region_source_length = res.TargetMarketRegion.length;

      if (export_percentage_sum < 30)
        this.market_region_type_desc_list = ["Local"];

      else
        this.market_region_type_desc_list = ["Local", "Export"];

    }


    if (res.LocalCompetitors) {

      for (var i = 0; i < res.LocalCompetitors.length; i++) {

        res.LocalCompetitors[i]["Operation"] = "";

        var local_competitors_unit = this.unit_list.find((o) => o.Code == res.LocalCompetitors[i].ProductionUOM);
        if (local_competitors_unit)
          res.LocalCompetitors[i].ProductionUOM = local_competitors_unit.Name;

        if (res.LocalCompetitors[i].Region) {

          var local_competitors_region = this.country_list.find((o) => o.Code == res.LocalCompetitors[i].Region);
          if (local_competitors_region)
            res.LocalCompetitors[i].Region = local_competitors_region.Name;

        }

        if (res.LocalCompetitors[i].Type) {

          var local_competitors_type = this.market_region_type_list.find((o) => o.Id == res.LocalCompetitors[i].Type);
          if (local_competitors_type)
            res.LocalCompetitors[i].Type = local_competitors_type.Desc;

        }

        if (res.LocalCompetitors[i]["LocalCompSalesVolume"])
          for (var j = 0; j < res.LocalCompetitors[i]["LocalCompSalesVolume"].length; j++) {

            var local_competitors_sales_volume_unit = this.unit_list.find((o) => o.Code == res.LocalCompetitors[i]["LocalCompSalesVolume"][j].QuantityUOM);
            if (local_competitors_sales_volume_unit)
              res.LocalCompetitors[i]["LocalCompSalesVolume"][j].QuantityUOM = local_competitors_sales_volume_unit.Name;

            var local_competitors_sales_volume_type = this.market_region_type_list.find((o) => o.Id == res.LocalCompetitors[i]["LocalCompSalesVolume"][j].Type);
            if (local_competitors_sales_volume_type)
              res.LocalCompetitors[i]["LocalCompSalesVolume"][j].Type = local_competitors_sales_volume_type.Desc;

            res.LocalCompetitors[i]["LocalCompSalesVolume"][j]["Operation"] = "";

          }

        if (res.LocalCompetitors[i]["AdditionalCapacity"])
          for (var j = 0; j < res.LocalCompetitors[i]["AdditionalCapacity"].length; j++)
            res.LocalCompetitors[i]["AdditionalCapacity"][j].Date = this.commonService.returnDateStringFromDateStringWithoutHyphen(res.LocalCompetitors[i]["AdditionalCapacity"][j].Date);

        this.inputs.LocalCompetitors.push(res.LocalCompetitors[i]);
        delete this.inputs.LocalCompetitors[i].Orgin;
        delete this.inputs.LocalCompetitors[i].UserId;

      }

      this.local_competitors_source.load(this.inputs.LocalCompetitors);

      this.local_competitors_source_length = res.LocalCompetitors.length;

    }


    if (res.ImportCompetitors) {

      for (var i = 0; i < res.ImportCompetitors.length; i++) {

        res.ImportCompetitors[i]["Operation"] = "";

        // var import_competitors_unit = this.unit_list.find((o) => o.Code == res.ImportCompetitors[i].ProductionUOM);
        // if (import_competitors_unit)
        //   res.ImportCompetitors[i].ProductionUOM = import_competitors_unit.Name;

        if (res.ImportCompetitors[i]["ImportSalesVolume"])
          for (var j = 0; j < res.ImportCompetitors[i]["ImportSalesVolume"].length; j++) {

            var import_competitors_sales_volume_unit = this.unit_list.find((o) => o.Code == res.ImportCompetitors[i]["ImportSalesVolume"][j].QuantityUOM);
            if (import_competitors_sales_volume_unit)
              res.ImportCompetitors[i]["ImportSalesVolume"][j].QuantityUOM = import_competitors_sales_volume_unit.Name;

            res.ImportCompetitors[i]["ImportSalesVolume"][j]["Operation"] = "";

          }


        if (res.ImportCompetitors[i].Region) {

          var import_competitors_region = this.country_list.find((o) => o.Code == res.ImportCompetitors[i].Region);
          if (import_competitors_region)
            res.ImportCompetitors[i].Region = import_competitors_region.Name;

        }

        if (res.ImportCompetitors[i].Orgin) {

          var import_competitors_type = this.market_region_type_list.find((o) => o.Id == res.ImportCompetitors[i].Orgin);
          if (import_competitors_type)
            res.ImportCompetitors[i].Orgin = import_competitors_type.Desc;

        }

        this.inputs.ImportCompetitors.push(res.ImportCompetitors[i]);
        // delete this.inputs.ImportCompetitors[i].Orgin;
        delete this.inputs.ImportCompetitors[i].UserId;

      }

      this.import_competitors_source.load(this.inputs.ImportCompetitors);

      this.import_competitors_source_length = res.ImportCompetitors.length;

    }


    if (res.Demand) {

      for (var i = 0; i < res.Demand.length; i++) {

        res.Demand[i]["Operation"] = "";

        var product_demand_unit = this.unit_list.find((o) => o.Code == res.Demand[i].QuantityUOM);
        if (product_demand_unit)
          res.Demand[i].QuantityUOM = product_demand_unit.Name;

        if (res.Demand[i].Region) {

          var demand_region = this.country_list.find((o) => o.Code == res.Demand[i].Region);
          if (demand_region)
            res.Demand[i].Region = demand_region.Name;

        }

        if (res.Demand[i].Type) {

          var demand_type = this.market_region_type_list.find((o) => o.Id == res.Demand[i].Type);
          if (demand_type)
            res.Demand[i].Type = demand_type.Desc;

        }

        this.inputs.Demand.push(res.Demand[i]);
        delete this.inputs.Demand[i].Orgin;
        delete this.inputs.Demand[i].UserId;

      }

      this.product_demand_source.load(this.inputs.Demand);

      this.product_demand_source_length = res.Demand.length;

    }


    if (res.ExpectedSales) {

      for (var i = 0; i < res.ExpectedSales.length; i++) {

        if (res.ExpectedSales[i]["ProductExpectedSalesExport"])
          for (var j = 0; j < res.ExpectedSales[i]["ProductExpectedSalesExport"].length; j++) {

            var expected_sales_export_region = this.country_list.find((o) => o.Code == res.ExpectedSales[i]["ProductExpectedSalesExport"][j].Region);
            if (expected_sales_export_region)
              res.ExpectedSales[i]["ProductExpectedSalesExport"][j].Region = expected_sales_export_region.Name;

            res.ExpectedSales[i]["ProductExpectedSalesExport"][j]["Operation"] = "";

          }

        res.ExpectedSales[i]["Operation"] = "";
        this.inputs.ExpectedSales.push(res.ExpectedSales[i]);
        delete this.inputs.ExpectedSales[i].Orgin;
        delete this.inputs.ExpectedSales[i].UserId;

      }

      this.expected_sales_source.load(this.inputs.ExpectedSales);

      this.expected_sales_source_length = res.ExpectedSales.length;

    }


    if (res.Clients) {

      for (var i = 0; i < res.Clients.length; i++) {

        res.Clients[i]["Operation"] = "";

        var clients_unit = this.unit_list.find((o) => o.Code == res.Clients[i].ConsumptionUOM);
        if (clients_unit)
          res.Clients[i].ConsumptionUOM = clients_unit.Name;

        var clients_location = this.country_list.find((o) => o.Code == res.Clients[i].ClientLocation);
        if (clients_location)
          res.Clients[i].ClientLocation = clients_location.Name;

        this.inputs.Clients.push(res.Clients[i]);
        delete this.inputs.Clients[i].Orgin;
        delete this.inputs.Clients[i].UserId;

      }

      this.clients_source.load(this.inputs.Clients);

      this.clients_source_length = res.Clients.length;

    }


    if (res.ProposedSellingPrice) {

      for (var i = 0; i < res.ProposedSellingPrice.length; i++) {

        res.ProposedSellingPrice[i]["Operation"] = "";

        var proposed_selling_price_type = this.market_type_list.find((o) => o.Id == res.ProposedSellingPrice[i].MarketType);
        if (proposed_selling_price_type)
          res.ProposedSellingPrice[i].MarketType = proposed_selling_price_type.Desc;

        if (res.ProposedSellingPrice[i].ProposedPrice)
          res.ProposedSellingPrice[i].ProposedPrice = "SAR " + this.commonService.numberToNumberWithCommas(res.ProposedSellingPrice[i].ProposedPrice);

        if (res.ProposedSellingPrice[i].CompetitorPriceFrom)
          res.ProposedSellingPrice[i].CompetitorPriceFrom = "SAR " + this.commonService.numberToNumberWithCommas(res.ProposedSellingPrice[i].CompetitorPriceFrom);

        if (res.ProposedSellingPrice[i].CompetitorPriceTo)
          res.ProposedSellingPrice[i].CompetitorPriceTo = "SAR " + this.commonService.numberToNumberWithCommas(res.ProposedSellingPrice[i].CompetitorPriceTo);

        if (res.ProposedSellingPrice[i].CompetitorPriceFrom || res.ProposedSellingPrice[i].CompetitorPriceTo)
          res.ProposedSellingPrice[i].CompetitorPrice = res.ProposedSellingPrice[i].CompetitorPriceFrom +
            " - " + res.ProposedSellingPrice[i].CompetitorPriceTo;

        if (res.ProposedSellingPrice[i].ImporterPriceFrom)
          res.ProposedSellingPrice[i].ImporterPriceFrom = "SAR " + this.commonService.numberToNumberWithCommas(res.ProposedSellingPrice[i].ImporterPriceFrom);

        if (res.ProposedSellingPrice[i].ImporterPriceTo)
          res.ProposedSellingPrice[i].ImporterPriceTo = "SAR " + this.commonService.numberToNumberWithCommas(res.ProposedSellingPrice[i].ImporterPriceTo);

        if (res.ProposedSellingPrice[i].ImporterPriceFrom || res.ProposedSellingPrice[i].ImporterPriceTo)
          res.ProposedSellingPrice[i].ImporterPrice = res.ProposedSellingPrice[i].ImporterPriceFrom +
            " - " + res.ProposedSellingPrice[i].ImporterPriceTo;


        if (res.ProposedSellingPrice[i].Region) {

          var proposed_selling_price_region = this.country_list.find((o) => o.Code == res.ProposedSellingPrice[i].Region);
          if (proposed_selling_price_region)
            res.ProposedSellingPrice[i].Region = proposed_selling_price_region.Name;

        }

        if (res.ProposedSellingPrice[i].Type) {

          var proposed_selling_price_type = this.market_region_type_list.find((o) => o.Id == res.ProposedSellingPrice[i].Type);
          if (proposed_selling_price_type)
            res.ProposedSellingPrice[i].Type = proposed_selling_price_type.Desc;

        }


        var proposed_price_unit = this.unit_list.find((o) => o.Code == res.ProposedSellingPrice[i].ProposedPriceUOM);
        if (proposed_price_unit)
          res.ProposedSellingPrice[i].ProposedPriceUOM = proposed_price_unit.Name;

        var competitor_price_unit = this.unit_list.find((o) => o.Code == res.ProposedSellingPrice[i].CompetitorPriceUOM);
        if (competitor_price_unit)
          res.ProposedSellingPrice[i].CompetitorPriceUOM = competitor_price_unit.Name;

        var importer_price_unit = this.unit_list.find((o) => o.Code == res.ProposedSellingPrice[i].ImporterPriceUOM);
        if (importer_price_unit)
          res.ProposedSellingPrice[i].ImporterPriceUOM = importer_price_unit.Name;

        this.inputs.ProposedSellingPrice.push(res.ProposedSellingPrice[i]);

        delete this.inputs.ProposedSellingPrice[i].Orgin;
        delete this.inputs.ProposedSellingPrice[i].UserId;

      }

      this.proposed_selling_price_source.load(this.inputs.ProposedSellingPrice);

      this.proposed_selling_price_source_length = res.ProposedSellingPrice.length;

    }


    if (res.MajorCompetitor) {

      for (var i = 0; i < res.MajorCompetitor.length; i++) {

        res.MajorCompetitor[i]["Operation"] = "";

        if (res.MajorCompetitor[i].Region) {

          var major_competitor_region = this.country_list.find((o) => o.Code == res.MajorCompetitor[i].Region);
          if (major_competitor_region)
            res.MajorCompetitor[i].Region = major_competitor_region.Name;

        }

        if (res.MajorCompetitor[i].Type) {

          var major_competitor_type = this.market_region_type_list.find((o) => o.Id == res.MajorCompetitor[i].Type);
          if (major_competitor_type)
            res.MajorCompetitor[i].Type = major_competitor_type.Desc;

        }

        this.inputs.MajorCompetitor.push(res.MajorCompetitor[i]);
        delete this.inputs.MajorCompetitor[i].Orgin;
        delete this.inputs.MajorCompetitor[i].UserId;

      }

      this.major_competitors_source.load(this.inputs.MajorCompetitor);

      this.major_competitors_source_length = res.MajorCompetitor.length;
    }


    if (res.ManufacturingStages) {

      for (var i = 0; i < res.ManufacturingStages.length; i++) {

        res.ManufacturingStages[i]["Operation"] = "";

        var manufacturing_machinery_list = this.machineries_list.find((o) => o.Id == res.ManufacturingStages[i].MachineId);
        if (manufacturing_machinery_list)
          res.ManufacturingStages[i].MachineId = manufacturing_machinery_list.Desc;

        var manufacturing_production_unit = this.unit_list.find((o) => o.Code == res.ManufacturingStages[i].ProductionUom);
        if (manufacturing_production_unit)
          res.ManufacturingStages[i].ProductionUom = manufacturing_production_unit.Name;

        this.inputs.ManufacturingStages.push(res.ManufacturingStages[i]);
        delete this.inputs.ManufacturingStages[i].Orgin;
        delete this.inputs.ManufacturingStages[i].UserId;

      }

      this.manufacturing_stages_source.load(this.inputs.ManufacturingStages);

      this.manufacturing_stages_source_length = res.ManufacturingStages.length;
    }


    if (res.ProductionLines) {

      for (var i = 0; i < res.ProductionLines.length; i++) {

        res.ProductionLines[i]["Operation"] = "";

        for (var j = 0; j < res.ProductionLines[i]["ProductProductionLinesSection"].length; j++) {

          var Product_Production_Lines_Section_unit = this.unit_list.find((o) => o.Code == res.ProductionLines[i]["ProductProductionLinesSection"][j].MeasurementUnit);
          if (Product_Production_Lines_Section_unit)
            res.ProductionLines[i]["ProductProductionLinesSection"][j].MeasurementUnit = Product_Production_Lines_Section_unit.Name;

        }

        this.inputs.ProductionLines.push(res.ProductionLines[i]);
        delete this.inputs.ProductionLines[i].Orgin;
        delete this.inputs.ProductionLines[i].UserId;

      }

      this.production_lines_source.load(this.inputs.ProductionLines);

      this.production_lines_source_length = res.ProductionLines.length;

    }

    this.product_sales_source.refresh();
    this.production_lines_source.refresh();
    this.manufacturing_stages_source.refresh();
    this.major_competitors_source.refresh();
    this.proposed_selling_price_source.refresh();
    this.clients_source.refresh();
    this.expected_sales_source.refresh();
    this.product_demand_source.refresh();
    this.import_competitors_source.refresh();
    this.local_competitors_source.refresh();
    this.target_market_region_source.refresh();
    this.target_market_source.refresh();

    this.communicationsService.getDocumentService(this.requestId, "p")
      .then(requests => (this.resolveDocuments(requests, from)), err => this.resolveError());

  }

  resolveDocuments(requests, from) {

    this.documents = this.commonService.returnViewDocumentJson(requests);


    this.productBrochuresDocuments.url = this.documents["url"];

    this.expectedSalesDocuments.url = this.documents["url"];

    this.clientsTableDocuments.url = this.documents["url"];


    this.productBrochuresDocuments.documentList = [];

    this.expectedSalesDocuments.documentList = [];

    this.clientsTableDocuments.documentList = [];


    var clients_temp_source = [];

    this.clients_source.getAll().then((res) => {

      clients_temp_source = res;

      for (var i = 0; i < this.documents["documentList"].length; i++) {

        this.documents["documentList"][i]["docUrl"] =
          this.documents["url"]
            .replace("entityId", this.documents["documentList"][i].EntityId)
            .replace("refId", this.documents["documentList"][i].RefId)
            .replace("documentId", this.documents["documentList"][i].DocumentId)
            .replace("fileName", this.documents["documentList"][i].FileName);

        if (parseInt(this.documents["documentList"][i].DocumentDefId) == 121 &&
          parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.inputs.GuiId))
          this.productBrochuresDocuments["documentList"].push(this.documents["documentList"][i]);

        else if (parseInt(this.documents["documentList"][i].DocumentDefId) == 402 &&
          parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(this.inputs.GuiId))
          this.expectedSalesDocuments["documentList"].push(this.documents["documentList"][i]);

        else
          for (var j = 0; j < clients_temp_source.length; j++)
            if (parseInt(this.documents["documentList"][i].RelatedEntityId) == parseInt(clients_temp_source[j]["GuiId"]))
              this.clientsTableDocuments["documentList"].push(this.documents["documentList"][i]);

      }

      if (this.expectedSalesDocuments.documentList.length > 0)
        this.inputs.ExpectedSalesDocumentsFlag = true;

      if (from == 0) {

        if (this.commentArrayExists)
          this.resolveCommonComments();

        else {

          this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.PDTMKTRetrieved'));
          this.spinnerService.hide();

        }

      }

      else
        this.spinnerService.hide();

    });

  }

  onAdd(table_name) {

    let marketingInformationModalParams = {};

    if (table_name === 'Sales') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.AddSponsorProductSales'),

        val_indices: [2, 3, 4],

        inputs: [
          {
            id: "Year",
            name: this.translate.instant('MARKETING_INFORMATION.Year'),
            type: "select",
            value: this.year_minus_3_list,
            selected: "",
            required: "true",
            visible: true
          },
          {
            id: "Month",
            name: this.translate.instant('MARKETING_INFORMATION.Month'),
            type: "select",
            value: this.month_till_date_list,
            selected: "",
            required: "true",
            visible: false
          },
          {
            id: "LocalQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.LocalQuantity'),
            type: "number",
            value: "",
            required: "true",
          },
          {
            id: "ExportQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.ExportQuantity'),
            type: "number",
            value: "",
            required: "true",
          },
          {
            id: "Value",
            name: this.translate.instant('MARKETING_INFORMATION.TotalQuantity'),
            type: "number_disabled",
            value: "",
            required: "true",
          },
          {
            id: "QuantityUOM",
            name: this.translate.instant('MARKETING_INFORMATION.QuantityUnitofMeasure'),
            type: "select",
            value: this.unit_name_list,
            selected: this.selected_unit_name,
            required: "true",
            visible: true
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var product_sales_source_data_array = [];

              var product_sales_source_data = {
                ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[0].selected, Month: modal_data.inputs[1].selected, LocalQuantity: modal_data.inputs[2].value,
                ExportQuantity: modal_data.inputs[3].value, QuantityUOM: modal_data.inputs[5].selected, Value: modal_data.inputs[4].value,
                Operation: "C"
              };

              product_sales_source_data_array.push(product_sales_source_data);

              if (this.product_sales_source_length == 0)
                this.product_sales_source.load(product_sales_source_data_array);

              else
                this.product_sales_source.add(product_sales_source_data);

              this.product_sales_source_length++;

              this.product_sales_source.refresh();

              var product_sales_temp_source = [], product_sales_temp_source_1 = [];

              this.product_sales_source.getAll().then((res) => {

                product_sales_temp_source = res;

                product_sales_temp_source_1.push(product_sales_temp_source[product_sales_temp_source.length - 1]);

                for (var i = 0; i < product_sales_temp_source.length - 1; i++)
                  product_sales_temp_source_1.push(product_sales_temp_source[i]);

                this.product_sales_source.load(product_sales_temp_source_1);

                this.product_sales_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

              });

              this.startedFilling = 1;

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

    else if (table_name === 'TargetMarket') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.AddTargetMarketSegments'),

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.SegmentsType'),
            type: "select",
            value: this.market_type_desc_list,
            selected: "",
            required: "true",
            visible: true
          },
          {
            id: "Percent",
            name: this.translate.instant('MARKETING_INFORMATION.Percentage'),
            type: "number",
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

              var target_market_source_data_array = [];

              var target_market_source_data = {
                ProductId: this.selected_product["ProductId"], Type: modal_data.inputs[0].selected,
                Percent: parseFloat(modal_data.inputs[1].value).toFixed(4), Operation: "C"
              };

              target_market_source_data_array.push(target_market_source_data);

              if (this.target_market_source_length == 0)
                this.target_market_source.load(target_market_source_data_array);

              else
                this.target_market_source.add(target_market_source_data);

              this.target_market_source_length++;

              this.target_market_source.refresh();

              var target_market_temp_source = [], target_market_temp_source_1 = [];

              this.target_market_source.getAll().then((res) => {

                target_market_temp_source = res;

                target_market_temp_source_1.push(target_market_temp_source[target_market_temp_source.length - 1]);

                for (var i = 0; i < target_market_temp_source.length - 1; i++)
                  target_market_temp_source_1.push(target_market_temp_source[i]);

                this.target_market_source.load(target_market_temp_source_1);

                this.target_market_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

              });

              this.startedFilling = 1;

              var flag = 0;

              for (var i = 0; i < this.market_type_selected_desc_list.length && flag == 0; i++)
                if (this.market_type_selected_desc_list[i] == modal_data.inputs[0].selected)
                  flag = 1;

              if (flag == 0)
                this.market_type_selected_desc_list.push(modal_data.inputs[0].selected);

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

    else if (table_name === 'TargetMarketRegion') {

      var target_market_region_temp_source = [];

      var market_region_type_desc_list = [];

      var local_flag = 0;

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Local")
            local_flag = 1;

        if (local_flag == 0)
          market_region_type_desc_list.push("Local");

        market_region_type_desc_list.push("Export");

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddTargetMarketRegionOrCountries'),

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              value: market_region_type_desc_list,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: "",
              value: this.country_name_list,
              required: "true",
              visible: false
            },
            {
              id: "Percent",
              name: this.translate.instant('MARKETING_INFORMATION.Percentage'),
              type: "number",
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

                var target_market_region_source_data_array = [];

                var target_market_region_source_data = {
                  ProductId: this.selected_product["ProductId"], Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                  Percent: parseFloat(modal_data.inputs[2].value).toFixed(4), Operation: "C"
                };

                target_market_region_source_data_array.push(target_market_region_source_data);

                if (this.target_market_region_source_length == 0)
                  this.target_market_region_source.load(target_market_region_source_data_array);

                else
                  this.target_market_region_source.add(target_market_region_source_data);

                this.target_market_region_source_length++;

                this.target_market_region_source.refresh();

                this.startedFilling = 1;

                var target_market_region_temp_source_1 = [], target_market_region_temp_source_2 = [];

                var export_percentage_sum = 0;

                this.target_market_region_source.getAll().then((res1) => {

                  target_market_region_temp_source_1 = res1;

                  for (var i = 0; i < target_market_region_temp_source_1.length; i++)
                    if (target_market_region_temp_source_1[i].Type == "Export")
                      export_percentage_sum += parseFloat(target_market_region_temp_source_1[i].Percent);

                  if (export_percentage_sum < 30)
                    this.market_region_type_desc_list = ["Local"];

                  else
                    this.market_region_type_desc_list = ["Local", "Export"];

                  target_market_region_temp_source_2.push(target_market_region_temp_source_1[target_market_region_temp_source_1.length - 1]);

                  for (var i = 0; i < target_market_region_temp_source_1.length - 1; i++)
                    target_market_region_temp_source_2.push(target_market_region_temp_source_1[i]);

                  this.target_market_region_source.load(target_market_region_temp_source_2);

                  this.target_market_region_source.refresh();

                  this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                });

              }

            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'LocalCompetitors') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        var local_competitors_sales_volume_source: LocalDataSource;

        local_competitors_sales_volume_source = new LocalDataSource();

        var additional_capacity_source: LocalDataSource;

        additional_capacity_source = new LocalDataSource();

        this.local_competitors_sales_volume_settings_en.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        this.local_competitors_sales_volume_settings_ar.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddFactoriesinTargetMarketRegionOrCountries'),

          tables: [
            {
              heading: this.translate.instant('MARKETING_INFORMATION.LocalCompetitorsSalesVolume'),
              settings: this.lang == 'en' ? this.local_competitors_sales_volume_settings_en : this.local_competitors_sales_volume_settings_ar,
              source: local_competitors_sales_volume_source,
              required: "true",
              visible: true
            },
            {
              heading: this.translate.instant('MARKETING_INFORMATION.AdditionalCapacity'),
              settings: this.lang == 'en' ? this.additional_capacity_settings_en : this.additional_capacity_settings_ar,
              source: additional_capacity_source,
              required: "true",
              visible: false
            }
          ],

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              selected: "",
              value: this.market_region_type_desc_list,
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: "",
              value: region_list,
              required: "true",
              visible: false
            },
            {
              id: "FactoryName",
              name: this.translate.instant('MARKETING_INFORMATION.Factory'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "ProductionCapacity",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionCapacity'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ProductionUOM",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionCapacityUnitofMeasure'),
              type: "select",
              selected: this.selected_unit_name,
              value: this.unit_name_list,
              required: "true",
              visible: true
            },
            {
              id: "AdditionalCapacity",
              name: this.translate.instant('MARKETING_INFORMATION.AdditionalCapacity'),
              type: "checkbox",
              value: false,
              required: "false",
              visible: true
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var local_competitors_sales_volume_temp_source = [];

                var additional_capacity_temp_source = [];

                modal_data.tables[0].source.getAll().then((res) => {

                  local_competitors_sales_volume_temp_source = res;

                  if (modal_data.inputs[5].value == true) {

                    modal_data.tables[1].source.getAll().then((res) => {

                      additional_capacity_temp_source = res;

                      if (additional_capacity_temp_source.length > 0)
                        for (var i = 0; i < additional_capacity_temp_source.length; i++)
                          additional_capacity_temp_source[i]["Operation"] = "C";

                      this.onAddLocalCompetitor(modal_data, local_competitors_sales_volume_temp_source,
                        additional_capacity_temp_source);

                    });

                  }

                  else
                    this.onAddLocalCompetitor(modal_data, local_competitors_sales_volume_temp_source,
                      additional_capacity_temp_source);

                });

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'ImportCompetitors') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        var import_competitors_sales_volume_source: LocalDataSource;

        import_competitors_sales_volume_source = new LocalDataSource();

        this.import_competitors_sales_volume_settings_en.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        this.import_competitors_sales_volume_settings_ar.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddImportCompetitorsinTargetMarketRegionOrCountries'),

          tables: [
            {
              heading: this.translate.instant('MARKETING_INFORMATION.ImportCompetitorsSalesVolume'),
              settings: this.lang == 'en' ? this.import_competitors_sales_volume_settings_en : this.import_competitors_sales_volume_settings_ar,
              source: import_competitors_sales_volume_source,
              required: "true",
              visible: true
            }
          ],

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              selected: "",
              value: this.market_region_type_desc_list,
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: "",
              value: region_list,
              required: "true",
              visible: false
            },
            {
              id: "FactoryName",
              name: this.translate.instant('MARKETING_INFORMATION.Trader'),
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

                var import_competitors_sales_volume_temp_source = [];

                modal_data.tables[0].source.getAll().then((res) => {

                  import_competitors_sales_volume_temp_source = res;

                  for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++)
                    import_competitors_sales_volume_temp_source[i]["Operation"] = "C";

                  var import_competitors_source_data_array = [];

                  var import_competitors_source_data = {
                    ProductId: this.selected_product["ProductId"], Orgin: modal_data.inputs[0].selected,
                    Region: modal_data.inputs[1].selected,
                    FactoryName: modal_data.inputs[2].value,
                    ImportSalesVolume: import_competitors_sales_volume_temp_source, Operation: "C"
                  };

                  import_competitors_source_data_array.push(import_competitors_source_data);

                  if (this.import_competitors_source_length == 0)
                    this.import_competitors_source.load(import_competitors_source_data_array);

                  else
                    this.import_competitors_source.add(import_competitors_source_data);

                  this.import_competitors_source_length++;

                  this.import_competitors_source.refresh();

                  var import_competitors_temp_source = [], import_competitors_temp_source_1 = [];

                  this.import_competitors_source.getAll().then((res) => {

                    import_competitors_temp_source = res;

                    import_competitors_temp_source_1.push(import_competitors_temp_source[import_competitors_temp_source.length - 1]);

                    for (var i = 0; i < import_competitors_temp_source.length - 1; i++)
                      import_competitors_temp_source_1.push(import_competitors_temp_source[i]);

                    this.import_competitors_source.load(import_competitors_temp_source_1);

                    this.import_competitors_source.refresh();

                    this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                  });

                  this.startedFilling = 1;

                  this.productDemandCalculation();

                });

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'Demand') {

      var local_competitors_temp_source = [], import_competitors_temp_source = [];

      var year_list = [], region_list = [],
        year_local_local_list = [], year_export_local_list = [],
        year_local_import_list = [], year_export_import_list = [];

      var local_competitors_sales_volume_temp_source = [], import_competitors_sales_volume_temp_source = [];

      this.local_competitors_source.getAll().then((res) => {

        local_competitors_temp_source = res;

        this.import_competitors_source.getAll().then((res) => {

          import_competitors_temp_source = res;

          for (var i = 0; i < local_competitors_temp_source.length; i++)
            if (local_competitors_temp_source[i].LocalCompSalesVolume)
              for (var j = 0; j < local_competitors_temp_source[i].LocalCompSalesVolume.length; j++) {

                local_competitors_temp_source[i].LocalCompSalesVolume[j]["MarketType"] = local_competitors_temp_source[i].Type;

                if (local_competitors_temp_source[i].Type == "Export")
                  local_competitors_temp_source[i].LocalCompSalesVolume[j]["Region"] = local_competitors_temp_source[i].Region;
                else
                  local_competitors_temp_source[i].LocalCompSalesVolume[j]["Region"] = "";

                local_competitors_sales_volume_temp_source.push(local_competitors_temp_source[i].LocalCompSalesVolume[j]);

              }

          for (var i = 0; i < import_competitors_temp_source.length; i++)
            if (import_competitors_temp_source[i].ImportSalesVolume)
              for (var j = 0; j < import_competitors_temp_source[i].ImportSalesVolume.length; j++) {

                import_competitors_temp_source[i].ImportSalesVolume[j]["MarketType"] = import_competitors_temp_source[i].Orgin;

                if (import_competitors_temp_source[i].Orgin == "Export")
                  import_competitors_temp_source[i].ImportSalesVolume[j]["Region"] = import_competitors_temp_source[i].Region;
                else
                  import_competitors_temp_source[i].ImportSalesVolume[j]["Region"] = "";

                import_competitors_sales_volume_temp_source.push(import_competitors_temp_source[i].ImportSalesVolume[j]);

              }

          for (var i = 0; i < local_competitors_sales_volume_temp_source.length; i++) {

            var flag = 0;

            for (var j = 0; (j < year_list.length) && flag == 0; j++)
              if (local_competitors_sales_volume_temp_source[i].Year == year_list[j])
                flag = 1;
              else
                flag = 0;

            if (flag == 0)
              year_list.push(local_competitors_sales_volume_temp_source[i].Year);

          }

          for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

            var flag = 0;

            for (var j = 0; (j < year_list.length) && flag == 0; j++)
              if (import_competitors_sales_volume_temp_source[i].Year == year_list[j])
                flag = 1;
              else
                flag = 0;

            if (flag == 0)
              year_list.push(import_competitors_sales_volume_temp_source[i].Year);

          }

          for (var i = 0; i < local_competitors_sales_volume_temp_source.length; i++) {

            if (local_competitors_sales_volume_temp_source[i].Region != "") {

              var flag = 0;

              for (var j = 0; (j < region_list.length) && flag == 0; j++)
                if (local_competitors_sales_volume_temp_source[i].Region == region_list[j])
                  flag = 1;
                else
                  flag = 0;

              if (flag == 0)
                region_list.push(local_competitors_sales_volume_temp_source[i].Region);

            }

          }

          for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

            if (import_competitors_sales_volume_temp_source[i].Region != "") {

              var flag = 0;

              for (var j = 0; (j < region_list.length) && flag == 0; j++)
                if (import_competitors_sales_volume_temp_source[i].Region == region_list[j])
                  flag = 1;
                else
                  flag = 0;

              if (flag == 0)
                region_list.push(import_competitors_sales_volume_temp_source[i].Region);

            }

          }

          for (var i = 0; i < year_list.length; i++) {

            var sum_local = 0;

            for (var j = 0; j < local_competitors_sales_volume_temp_source.length; j++)
              if (local_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                local_competitors_sales_volume_temp_source[j].MarketType == "Local" &&
                local_competitors_sales_volume_temp_source[j].Type == "Local")
                sum_local += parseInt(local_competitors_sales_volume_temp_source[j].LocalQuantity);

            year_local_local_list.push({ year: year_list[i], sum: sum_local });

            for (var k = 0; k < region_list.length; k++) {

              var sum_import = 0;

              for (var j = 0; j < local_competitors_sales_volume_temp_source.length; j++)
                if (local_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                  local_competitors_sales_volume_temp_source[j].MarketType == "Export" &&
                  local_competitors_sales_volume_temp_source[j].Type == "Local" &&
                  local_competitors_sales_volume_temp_source[j].Region == region_list[k])
                  sum_import += parseInt(local_competitors_sales_volume_temp_source[j].LocalQuantity);

              year_local_import_list.push({ year: year_list[i], region: region_list[k], sum: sum_import });

            }

          }

          for (var i = 0; i < year_list.length; i++) {

            var sum_local = 0;

            for (var j = 0; j < import_competitors_sales_volume_temp_source.length; j++)
              if (import_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                import_competitors_sales_volume_temp_source[j].MarketType == "Local")
                sum_local += parseInt(import_competitors_sales_volume_temp_source[j].Quantity);

            year_export_local_list.push({ year: year_list[i], sum: sum_local });

            for (var k = 0; k < region_list.length; k++) {

              var sum_import = 0;

              for (var j = 0; j < import_competitors_sales_volume_temp_source.length; j++)
                if (import_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                  import_competitors_sales_volume_temp_source[j].MarketType == "Export" &&
                  import_competitors_sales_volume_temp_source[j].Region == region_list[k])
                  sum_import += parseInt(import_competitors_sales_volume_temp_source[j].Quantity);

              year_export_import_list.push({ year: year_list[i], region: region_list[k], sum: sum_import });

            }

          }

          marketingInformationModalParams = {

            header: this.translate.instant('MARKETING_INFORMATION.AddHistoricalProductDemand'),

            inputs: [
              {
                id: "Type",
                name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
                type: "select",
                selected: "",
                value: this.market_region_type_desc_list,
                required: "true",
                visible: true
              },
              {
                id: "Region",
                name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
                type: "select",
                selected: "",
                value: region_list,
                required: "true",
                visible: false
              },
              {
                id: "Year",
                name: this.translate.instant('MARKETING_INFORMATION.Year'),
                type: "select",
                value: year_list,
                selected: "",
                required: "true",
                visible: true
              },
              {
                id: "LocalQuantity",
                name: this.translate.instant('MARKETING_INFORMATION.LocalQuantity'),
                type: "number_disabled",
                value: "",
                sum_local: year_local_local_list,
                sum_import: year_local_import_list,
                required: "true",
              },
              {
                id: "ImportQuantity",
                name: this.translate.instant('MARKETING_INFORMATION.ImportQuantity'),
                type: "number_disabled",
                value: "",
                sum_local: year_export_local_list,
                sum_import: year_export_import_list,
                required: "true",
              },
              {
                id: "ExportQuantity",
                name: this.translate.instant('MARKETING_INFORMATION.Demand'),
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "QuantityUOM",
                name: this.translate.instant('MARKETING_INFORMATION.QuantityUnitofMeasure'),
                type: "select",
                value: this.unit_name_list,
                selected: this.selected_unit_name,
                required: "true",
                visible: true
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  var product_demand_source_data_array = [];

                  var product_demand_source_data = {
                    ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[2].selected, LocalQuantity: modal_data.inputs[3].value,
                    Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                    ImportQuantity: modal_data.inputs[4].value, ExportQuantity: modal_data.inputs[5].value, QuantityUOM: modal_data.inputs[6].selected,
                    Operation: "C"
                  };

                  product_demand_source_data_array.push(product_demand_source_data);

                  if (this.product_demand_source_length == 0)
                    this.product_demand_source.load(product_demand_source_data_array);

                  else
                    this.product_demand_source.add(product_demand_source_data);

                  this.product_demand_source_length++;

                  this.product_demand_source.refresh();

                  this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                  this.startedFilling = 1;

                }
              }
            ]
          };

          let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

        });

      });

    }

    else if (table_name === 'ExpectedSales') {

      if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

        var target_market_region_temp_source = [];

        var region_list_1 = [];

        this.target_market_region_source.getAll().then((res) => {

          target_market_region_temp_source = res;

          for (var i = 0; i < target_market_region_temp_source.length; i++)
            if (target_market_region_temp_source[i].Type == "Export")
              region_list_1.push({ value: target_market_region_temp_source[i].Region, title: target_market_region_temp_source[i].Region });

          var expected_sales_volume_export_source: LocalDataSource;

          expected_sales_volume_export_source = new LocalDataSource();

          this.expected_sales_volume_export_settings_en.columns.Region.editor.config.list = region_list_1;

          this.expected_sales_volume_export_settings_ar.columns.Region.editor.config.list = region_list_1;

          marketingInformationModalParams = {

            header: this.translate.instant('MARKETING_INFORMATION.AddExpectedSalesVolume'),

            val_indices: [1, 3, 4],

            inputs: [
              {
                id: "Year",
                name: this.translate.instant('MARKETING_INFORMATION.Year'),
                type: "select",
                value: this.com_proj_plus_5_list,
                selected: "",
                required: "true",
                visible: true
              },
              {
                id: "Local",
                name: this.translate.instant('MARKETING_INFORMATION.Local'),
                type: "number",
                value: "",
                required: "true",
              },
              {
                id: "Export",
                type: "table",
                heading: this.translate.instant('MARKETING_INFORMATION.Export'),
                settings: this.lang == 'en' ? this.expected_sales_volume_export_settings_en : this.expected_sales_volume_export_settings_ar,
                source: expected_sales_volume_export_source,
                source_length: 0,
                required: region_list_1.length > 0 ? "true" : "false",
                visible: true
              },
              {
                id: "TotalExport",
                name: this.translate.instant('MARKETING_INFORMATION.TotalExport'),
                type: "number_disabled",
                value: region_list_1.length > 0 ? "" : "0",
                required: "true",
              },
              {
                id: "Value",
                name: this.translate.instant('MARKETING_INFORMATION.Total'),
                type: "number_disabled",
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

                  var expected_sales_source_data_array = [];

                  var expected_sales_volume_export_temp_source = [];

                  modal_data.inputs[2].source.getAll().then((res) => {

                    expected_sales_volume_export_temp_source = res;

                    for (var i = 0; i < expected_sales_volume_export_temp_source.length; i++)
                      expected_sales_volume_export_temp_source[i]["Operation"] = "C";

                    var expected_sales_source_data = {
                      ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[0].selected,
                      Local: modal_data.inputs[1].value, ProductExpectedSalesExport: expected_sales_volume_export_temp_source, TotalExport: modal_data.inputs[3].value,
                      Value: modal_data.inputs[4].value, Operation: "C"
                    };

                    expected_sales_source_data_array.push(expected_sales_source_data);

                    if (this.expected_sales_source_length == 0)
                      this.expected_sales_source.load(expected_sales_source_data_array);

                    else
                      this.expected_sales_source.add(expected_sales_source_data);

                    this.expected_sales_source_length++;

                    this.expected_sales_source.refresh();

                    var expected_sales_temp_source = [], expected_sales_temp_source_1 = [];

                    this.expected_sales_source.getAll().then((res) => {

                      expected_sales_temp_source = res;

                      expected_sales_temp_source_1.push(expected_sales_temp_source[expected_sales_temp_source.length - 1]);

                      for (var i = 0; i < expected_sales_temp_source.length - 1; i++)
                        expected_sales_temp_source_1.push(expected_sales_temp_source[i]);

                      this.expected_sales_source.load(expected_sales_temp_source_1);

                      this.expected_sales_source.refresh();

                      this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                    });

                    this.startedFilling = 1;

                  });

                }
              }
            ]
          };

          let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

        });

      }

      else
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYear'));

    }

    else if (table_name === 'Clients') {

      if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddTargetedEndUsers'),

          inputs: [
            {
              id: "Year",
              name: this.translate.instant('MARKETING_INFORMATION.Year'),
              type: "select",
              value: this.client_6_year_list,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "ClientName",
              name: this.translate.instant('MARKETING_INFORMATION.EndUserName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "ClientLocation",
              name: this.translate.instant('MARKETING_INFORMATION.EndUserLocation'),
              type: "select",
              value: this.country_name_list,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "ConsumptionQuantity",
              name: this.translate.instant('MARKETING_INFORMATION.ConsumptionQuantity'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ConsumptionUOM",
              name: this.translate.instant('MARKETING_INFORMATION.ConsumptionUnitofMeasure'),
              type: "select",
              value: this.unit_name_list,
              selected: this.selected_unit_name,
              required: "true",
              visible: true
            },
            {
              id: "ClientAgreements",
              name: this.translate.instant('MARKETING_INFORMATION.EndUserAgreements'),
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

                var data = {
                  documentDefId: 121,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: this.commonService.returnRandomNumber(),
                  RelatedEntityName: "product",
                  operationType: "l"
                };

                this.spinnerService.show();

                if (modal_data.inputs[5].file && modal_data.inputs[5].file != "")
                  this.communicationsService.uploadDocumentService(modal_data.inputs[5].file, data)
                    .then(requests => (this.onClientsTableUpload(requests, modal_data, "add", "", data.RelatedEntityId)), err => this.resolveError());

                else
                  this.onClientsTableUploadDataBind(modal_data, "add", "", data.RelatedEntityId);

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      }

      else
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYear'));

    }

    else if (table_name === 'ProposedSellingPrice') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddSponsorProposedPrice'),

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              selected: "",
              value: this.market_region_type_desc_list,
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: "",
              value: region_list,
              required: "true",
              visible: false
            },
            {
              id: "MarketType",
              name: this.translate.instant('MARKETING_INFORMATION.MarketType'),
              type: "select",
              value: this.market_type_selected_desc_list,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "ProposedPrice",
              name: this.translate.instant('MARKETING_INFORMATION.ProposedPrice'),
              type: "text_cost",
              value: "",
              UOM_id: "ProposedPriceUOM",
              UOM_value: this.unit_name_list,
              UOM_selected: this.selected_unit_name,
              required: "true",
            },
            {
              id_1: "CompetitorPriceFrom",
              name: this.translate.instant('MARKETING_INFORMATION.CompetitorPriceRange'),
              type: "text_cost_range",
              value_1: "",
              id_2: "CompetitorPriceTo",
              value_2: "",
              UOM_id: "CompetitorPriceUOM",
              UOM_value: this.unit_name_list,
              UOM_selected: this.selected_unit_name,
              required: "true",
            },
            {
              id_1: "ImporterPriceFrom",
              name: this.translate.instant('MARKETING_INFORMATION.ImporterPriceRange'),
              type: "text_cost_range",
              value_1: "",
              id_2: "ImporterPriceTo",
              value_2: "",
              UOM_id: "ImporterPriceUOM",
              UOM_value: this.unit_name_list,
              UOM_selected: this.selected_unit_name,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var proposed_selling_price_source_data_array = [];

                var proposed_selling_price_source_data = {
                  ProductId: this.selected_product["ProductId"], MarketType: modal_data.inputs[2].selected,
                  Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                  ProposedPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[3].value), ProposedPriceUOM: modal_data.inputs[3].UOM_selected,
                  CompetitorPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_1) + " - " + "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_2),
                  CompetitorPriceFrom: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_1), CompetitorPriceTo: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_2), CompetitorPriceUOM: modal_data.inputs[4].UOM_selected,
                  ImporterPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_1) + " - " + "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_2),
                  ImporterPriceFrom: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_1), ImporterPriceTo: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_2), ImporterPriceUOM: modal_data.inputs[5].UOM_selected,
                  Operation: "C"
                };

                proposed_selling_price_source_data_array.push(proposed_selling_price_source_data);

                if (this.proposed_selling_price_source_length == 0)
                  this.proposed_selling_price_source.load(proposed_selling_price_source_data_array);

                else
                  this.proposed_selling_price_source.add(proposed_selling_price_source_data);

                this.proposed_selling_price_source_length++;

                this.proposed_selling_price_source.refresh();

                var proposed_selling_price_temp_source = [], proposed_selling_price_temp_source_1 = [];

                this.proposed_selling_price_source.getAll().then((res) => {

                  proposed_selling_price_temp_source = res;

                  proposed_selling_price_temp_source_1.push(proposed_selling_price_temp_source[proposed_selling_price_temp_source.length - 1]);

                  for (var i = 0; i < proposed_selling_price_temp_source.length - 1; i++)
                    proposed_selling_price_temp_source_1.push(proposed_selling_price_temp_source[i]);

                  this.proposed_selling_price_source.load(proposed_selling_price_temp_source_1);

                  this.proposed_selling_price_source.refresh();

                  this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                });

                this.startedFilling = 1;

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'MajorCompetitor') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        var local_competitors_temp_source = [], local_competitor_factory_names = [],
          export_competitor_factory_names = [];

        this.local_competitors_source.getAll().then((res) => {

          local_competitors_temp_source = res;

          for (var i = 0; i < local_competitors_temp_source.length; i++)
            if (local_competitors_temp_source[i].Type == "Local")
              local_competitor_factory_names.push(local_competitors_temp_source[i].FactoryName)
            else if (local_competitors_temp_source[i].Type == "Export")
              export_competitor_factory_names.push(local_competitors_temp_source[i].FactoryName)

          marketingInformationModalParams = {

            header: this.translate.instant('MARKETING_INFORMATION.AddMajorCompetitorMarketShare'),

            inputs: [
              {
                id: "Type",
                name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
                type: "select",
                selected: "",
                value: this.market_region_type_desc_list,
                required: "true",
                visible: true
              },
              {
                id: "Region",
                name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
                type: "select",
                selected: "",
                value: region_list,
                required: "true",
                visible: false
              },
              {
                id: "CompetitorName",
                name: this.translate.instant('MARKETING_INFORMATION.CompetitorName'),
                type: "select",
                value: [],
                dropdown_1: local_competitor_factory_names,
                dropdown_2: export_competitor_factory_names,
                selected: "",
                required: "true",
                visible: true
              },
              {
                id: "MarketShare",
                name: this.translate.instant('MARKETING_INFORMATION.MarketSharePercentage'),
                type: "number",
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

                  var major_competitors_source_data_array = [];

                  var major_competitors_source_data = {
                    ProductId: this.selected_product["ProductId"], CompetitorName: modal_data.inputs[2].selected,
                    Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                    MarketShare: modal_data.inputs[3].value, Operation: "C"
                  };

                  major_competitors_source_data_array.push(major_competitors_source_data);

                  if (this.major_competitors_source_length == 0)
                    this.major_competitors_source.load(major_competitors_source_data_array);

                  else
                    this.major_competitors_source.add(major_competitors_source_data);

                  this.major_competitors_source_length++;

                  this.major_competitors_source.refresh();

                  var major_competitors_temp_source = [], major_competitors_temp_source_1 = [];

                  this.major_competitors_source.getAll().then((res) => {

                    major_competitors_temp_source = res;

                    major_competitors_temp_source_1.push(major_competitors_temp_source[major_competitors_temp_source.length - 1]);

                    for (var i = 0; i < major_competitors_temp_source.length - 1; i++)
                      major_competitors_temp_source_1.push(major_competitors_temp_source[i]);

                    this.major_competitors_source.load(major_competitors_temp_source_1);

                    this.major_competitors_source.refresh();

                    this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                  });

                  this.startedFilling = 1;

                }
              }
            ]
          };

          let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

        });

      });

    }

    else if (table_name === 'ManufacturingStages') {

      if (this.machineries_desc_list.length != 0) {

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddManufacturingStages'),

          inputs: [

            {
              id: "StageSequence",
              name: this.translate.instant('MARKETING_INFORMATION.StageSequence'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "MachineId",
              name: this.translate.instant('MARKETING_INFORMATION.MachineID'),
              type: "select",
              value: this.machineries_desc_list,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "MachineName",
              name: this.translate.instant('MARKETING_INFORMATION.MachineName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Operators",
              name: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ProductionRate",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionRate'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ProductionUom",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
              type: "select",
              value: this.unit_name_list,
              selected: this.selected_unit_name,
              required: "true",
              visible: true
            },
            {
              id: "StageName",
              name: this.translate.instant('MARKETING_INFORMATION.StageName'),
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

                var manufacturing_stages_source_data_array = [];

                var manufacturing_stages_source_data = {
                  ProductId: this.selected_product["ProductId"], StageSequence: modal_data.inputs[0].value, MachineId: modal_data.inputs[1].selected, MachineName: modal_data.inputs[2].value, Operators: modal_data.inputs[3].value,
                  ProductionRate: modal_data.inputs[4].value, ProductionUom: modal_data.inputs[5].selected, StageName: modal_data.inputs[6].value, Operation: "C"
                };

                manufacturing_stages_source_data_array.push(manufacturing_stages_source_data);

                if (this.manufacturing_stages_source_length == 0)
                  this.manufacturing_stages_source.load(manufacturing_stages_source_data_array);

                else
                  this.manufacturing_stages_source.add(manufacturing_stages_source_data);

                this.manufacturing_stages_source_length++;

                this.manufacturing_stages_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                this.startedFilling = 1;

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;
      }
      else {
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.FillMachineryDetails'));
      }

    }

    else if (table_name === 'ProductionLines') {

      var Product_Production_Lines_Section_source: LocalDataSource;

      Product_Production_Lines_Section_source = new LocalDataSource();

      this.Product_Production_Lines_Section_settings_en.columns.MeasurementUnit.defaultValue = this.selected_unit_name;
      this.Product_Production_Lines_Section_settings_ar.columns.MeasurementUnit.defaultValue = this.selected_unit_name;

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.AddProductionLines'),

        tables: [
          {
            heading: this.translate.instant('MARKETING_INFORMATION.ProductProductionLinesSection'),
            settings: this.lang == 'en' ? this.Product_Production_Lines_Section_settings_en : this.Product_Production_Lines_Section_settings_ar,
            source: Product_Production_Lines_Section_source,
            required: "true",
            visible: true
          }
        ],

        inputs: [
          {
            id: "ProductionLinesDesc",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionLinesDescription'),
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

              var Product_Production_Lines_Section_temp_source = [];

              modal_data.tables[0].source.getAll().then((res) => {

                Product_Production_Lines_Section_temp_source = res;

                for (var i = 0; i < Product_Production_Lines_Section_temp_source.length; i++) {

                  Product_Production_Lines_Section_temp_source[i]["Value"] = parseInt(Product_Production_Lines_Section_temp_source[i].Description) + parseInt(Product_Production_Lines_Section_temp_source[i].Rate) + parseInt(Product_Production_Lines_Section_temp_source[i].RateUnit) +
                    parseInt(Product_Production_Lines_Section_temp_source[i].ShifHours) + parseInt(Product_Production_Lines_Section_temp_source[i].ShiftPerDay) + parseInt(Product_Production_Lines_Section_temp_source[i].DaysPerYear) + parseInt(Product_Production_Lines_Section_temp_source[i].PercentageEfficiency);
                  Product_Production_Lines_Section_temp_source[i]["Operation"] = "C";

                }

                var production_lines_source_data_array = [];

                var production_lines_source_data = {
                  ProductId: this.selected_product["ProductId"], ProductionLinesDesc: modal_data.inputs[0].value,
                  ProductProductionLinesSection: Product_Production_Lines_Section_temp_source, Operation: "C"
                };

                production_lines_source_data_array.push(production_lines_source_data);

                if (this.production_lines_source_length == 0)
                  this.production_lines_source.load(production_lines_source_data_array);

                else
                  this.production_lines_source.add(production_lines_source_data);

                this.production_lines_source_length++;

                this.production_lines_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

                this.startedFilling = 1;

              });

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

  }

  onAddLocalCompetitor(modal_data, local_competitors_sales_volume_temp_source, additional_capacity_temp_source) {

    for (var i = 0; i < local_competitors_sales_volume_temp_source.length; i++)
      local_competitors_sales_volume_temp_source[i]["Operation"] = "C";

    var local_competitors_source_data_array = [];

    var local_competitors_source_data = {
      ProductId: this.selected_product["ProductId"], Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected, FactoryName: modal_data.inputs[2].value,
      ProductionCapacity: modal_data.inputs[3].value, ProductionUOM: modal_data.inputs[4].selected,
      LocalCompSalesVolume: local_competitors_sales_volume_temp_source, AdditionalCapacity: additional_capacity_temp_source, Operation: "C"
    };

    local_competitors_source_data_array.push(local_competitors_source_data);

    if (this.local_competitors_source_length == 0)
      this.local_competitors_source.load(local_competitors_source_data_array);

    else
      this.local_competitors_source.add(local_competitors_source_data);

    this.local_competitors_source_length++;

    this.local_competitors_source.refresh();

    var local_competitors_temp_source = [], local_competitors_temp_source_1 = [];

    this.local_competitors_source.getAll().then((res) => {

      local_competitors_temp_source = res;

      local_competitors_temp_source_1.push(local_competitors_temp_source[local_competitors_temp_source.length - 1]);

      for (var i = 0; i < local_competitors_temp_source.length - 1; i++)
        local_competitors_temp_source_1.push(local_competitors_temp_source[i]);

      this.local_competitors_source.load(local_competitors_temp_source_1);

      this.local_competitors_source.refresh();

      this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

    });

    this.startedFilling = 1;

    this.productDemandCalculation();

  }

  productDemandCalculation() {

    var product_demand_temp_source = [], product_demand_temp_source_ids = [], product_demand_temp_source_id_index = 0;

    this.product_demand_source.getAll().then((res) => {

      product_demand_temp_source = res;


      for (var i = 0; i < product_demand_temp_source.length; i++)
        if (product_demand_temp_source[i].DemandId && product_demand_temp_source[i].DemandId != "")
          product_demand_temp_source_ids.push(product_demand_temp_source[i].DemandId);


      this.product_demand_source.load([]);

      this.product_demand_source_length = 0;

      this.product_demand_source.refresh();


      var local_competitors_temp_source = [], import_competitors_temp_source = [];

      var year_list = [], region_list = [],
        year_local_local_list = [], year_export_local_list = [],
        year_local_import_list = [], year_export_import_list = [];

      var local_competitors_sales_volume_temp_source_1 = [], import_competitors_sales_volume_temp_source = [];

      this.local_competitors_source.getAll().then((res) => {

        local_competitors_temp_source = res;

        this.import_competitors_source.getAll().then((res) => {

          import_competitors_temp_source = res;

          for (var i = 0; i < local_competitors_temp_source.length; i++)
            if (local_competitors_temp_source[i].LocalCompSalesVolume)
              for (var j = 0; j < local_competitors_temp_source[i].LocalCompSalesVolume.length; j++) {

                local_competitors_temp_source[i].LocalCompSalesVolume[j]["MarketType"] = local_competitors_temp_source[i].Type;

                if (local_competitors_temp_source[i].Type == "Export")
                  local_competitors_temp_source[i].LocalCompSalesVolume[j]["Region"] = local_competitors_temp_source[i].Region;
                else
                  local_competitors_temp_source[i].LocalCompSalesVolume[j]["Region"] = "";

                local_competitors_sales_volume_temp_source_1.push(local_competitors_temp_source[i].LocalCompSalesVolume[j]);

              }

          for (var i = 0; i < import_competitors_temp_source.length; i++)
            if (import_competitors_temp_source[i].ImportSalesVolume)
              for (var j = 0; j < import_competitors_temp_source[i].ImportSalesVolume.length; j++) {

                import_competitors_temp_source[i].ImportSalesVolume[j]["MarketType"] = import_competitors_temp_source[i].Orgin;

                if (import_competitors_temp_source[i].Orgin == "Export")
                  import_competitors_temp_source[i].ImportSalesVolume[j]["Region"] = import_competitors_temp_source[i].Region;
                else
                  import_competitors_temp_source[i].ImportSalesVolume[j]["Region"] = "";

                import_competitors_sales_volume_temp_source.push(import_competitors_temp_source[i].ImportSalesVolume[j]);

              }

          for (var i = 0; i < local_competitors_sales_volume_temp_source_1.length; i++) {

            var flag = 0;

            for (var j = 0; (j < year_list.length) && flag == 0; j++)
              if (local_competitors_sales_volume_temp_source_1[i].Year == year_list[j])
                flag = 1;
              else
                flag = 0;

            if (flag == 0)
              year_list.push(local_competitors_sales_volume_temp_source_1[i].Year);

          }

          for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

            var flag = 0;

            for (var j = 0; (j < year_list.length) && flag == 0; j++)
              if (import_competitors_sales_volume_temp_source[i].Year == year_list[j])
                flag = 1;
              else
                flag = 0;

            if (flag == 0)
              year_list.push(import_competitors_sales_volume_temp_source[i].Year);

          }

          for (var i = 0; i < local_competitors_sales_volume_temp_source_1.length; i++) {

            if (local_competitors_sales_volume_temp_source_1[i].Region != "") {

              var flag = 0;

              for (var j = 0; (j < region_list.length) && flag == 0; j++)
                if (local_competitors_sales_volume_temp_source_1[i].Region == region_list[j])
                  flag = 1;
                else
                  flag = 0;

              if (flag == 0)
                region_list.push(local_competitors_sales_volume_temp_source_1[i].Region);

            }

          }

          for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

            if (import_competitors_sales_volume_temp_source[i].Region != "") {

              var flag = 0;

              for (var j = 0; (j < region_list.length) && flag == 0; j++)
                if (import_competitors_sales_volume_temp_source[i].Region == region_list[j])
                  flag = 1;
                else
                  flag = 0;

              if (flag == 0)
                region_list.push(import_competitors_sales_volume_temp_source[i].Region);

            }

          }

          for (var i = 0; i < year_list.length; i++) {

            var sum_local = 0;

            for (var j = 0; j < local_competitors_sales_volume_temp_source_1.length; j++)
              if (local_competitors_sales_volume_temp_source_1[j].Year == year_list[i] &&
                local_competitors_sales_volume_temp_source_1[j].MarketType == "Local" &&
                local_competitors_sales_volume_temp_source_1[j].Type == "Local")
                sum_local += parseFloat(local_competitors_sales_volume_temp_source_1[j].LocalQuantity);

            year_local_local_list.push({ year: year_list[i], sum: sum_local });

            for (var k = 0; k < region_list.length; k++) {

              var sum_import = 0;

              for (var j = 0; j < local_competitors_sales_volume_temp_source_1.length; j++)
                if (local_competitors_sales_volume_temp_source_1[j].Year == year_list[i] &&
                  local_competitors_sales_volume_temp_source_1[j].MarketType == "Export" &&
                  local_competitors_sales_volume_temp_source_1[j].Type == "Local" &&
                  local_competitors_sales_volume_temp_source_1[j].Region == region_list[k])
                  sum_import += parseFloat(local_competitors_sales_volume_temp_source_1[j].LocalQuantity);

              year_local_import_list.push({ year: year_list[i], region: region_list[k], sum: sum_import });

            }

          }

          for (var i = 0; i < year_list.length; i++) {

            var sum_local = 0;

            for (var j = 0; j < import_competitors_sales_volume_temp_source.length; j++)
              if (import_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                import_competitors_sales_volume_temp_source[j].MarketType == "Local")
                sum_local += parseFloat(import_competitors_sales_volume_temp_source[j].Quantity);

            year_export_local_list.push({ year: year_list[i], sum: sum_local });

            for (var k = 0; k < region_list.length; k++) {

              var sum_import = 0;

              for (var j = 0; j < import_competitors_sales_volume_temp_source.length; j++)
                if (import_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                  import_competitors_sales_volume_temp_source[j].MarketType == "Export" &&
                  import_competitors_sales_volume_temp_source[j].Region == region_list[k])
                  sum_import += parseFloat(import_competitors_sales_volume_temp_source[j].Quantity);

              year_export_import_list.push({ year: year_list[i], region: region_list[k], sum: sum_import });

            }

          }


          for (var i = 0; i < year_list.length; i++) {

            var type = "Local";

            var local_local_value = 0, export_local_value = 0, sum_local_value = 0;

            var year_local_local_value = year_local_local_list.find((o) => o.year == year_list[i]);
            if (year_local_local_value)
              local_local_value = year_local_local_value.sum;

            var year_export_local_value = year_export_local_list.find((o) => o.year == year_list[i]);
            if (year_export_local_value)
              export_local_value = year_export_local_value.sum;

            sum_local_value = local_local_value + export_local_value;

            var product_demand_source_data_array = [];

            var product_demand_source_data = {
              DemandId: product_demand_temp_source_ids[product_demand_temp_source_id_index] ?
                product_demand_temp_source_ids[product_demand_temp_source_id_index] : "", ProductId: this.selected_product["ProductId"],
              Year: year_list[i], LocalQuantity: local_local_value, Type: type, Region: "",
              ImportQuantity: export_local_value, ExportQuantity: sum_local_value, QuantityUOM: this.selected_unit_name,
              Operation: product_demand_temp_source_ids[product_demand_temp_source_id_index] ? "U" : "C"
            };

            product_demand_source_data_array.push(product_demand_source_data);

            if (product_demand_source_data.ExportQuantity > 0) {

              if (this.product_demand_source_length == 0)
                this.product_demand_source.load(product_demand_source_data_array);

              else
                this.product_demand_source.add(product_demand_source_data);

              this.product_demand_source_length++;

              this.product_demand_source.refresh();

              product_demand_temp_source_id_index++;

            }

          }


          for (var i = 0; i < year_list.length; i++) {

            for (var j = 0; j < region_list.length; j++) {

              var type = "Export";

              var local_import_value = 0, export_import_value = 0, sum_import_value = 0;

              var year_local_import_value = year_local_import_list.find((o) => o.year == year_list[i] && o.region == region_list[j]);
              if (year_local_import_value)
                local_import_value = year_local_import_value.sum;

              var year_export_import_value = year_export_import_list.find((o) => o.year == year_list[i] && o.region == region_list[j]);
              if (year_export_import_value)
                export_import_value = year_export_import_value.sum;

              sum_import_value = local_import_value + export_import_value;

              var product_demand_source_data_array = [];

              var product_demand_source_data_1 = {
                DemandId: product_demand_temp_source_ids[product_demand_temp_source_id_index] ?
                  product_demand_temp_source_ids[product_demand_temp_source_id_index] : "", ProductId: this.selected_product["ProductId"],
                Year: year_list[i], LocalQuantity: local_import_value, Type: type, Region: region_list[j],
                ImportQuantity: export_import_value, ExportQuantity: sum_import_value, QuantityUOM: this.selected_unit_name,
                Operation: product_demand_temp_source_ids[product_demand_temp_source_id_index] ? "U" : "C"
              };

              product_demand_source_data_array.push(product_demand_source_data_1);

              if (product_demand_source_data_1.ExportQuantity > 0) {

                if (this.product_demand_source_length == 0)
                  this.product_demand_source.load(product_demand_source_data_array);

                else
                  this.product_demand_source.add(product_demand_source_data_1);

                this.product_demand_source_length++;

                this.product_demand_source.refresh();

                product_demand_temp_source_id_index++;

              }

            }

          }


          var product_demand_current_temp_source = [];

          this.product_demand_source.getAll().then((res) => {

            product_demand_current_temp_source = res;

            if (product_demand_temp_source_ids.length > product_demand_current_temp_source.length) {

              while (product_demand_temp_source_id_index < product_demand_temp_source_ids.length) {

                var product_demand_source_data_2 = {
                  DemandId: product_demand_temp_source_ids[product_demand_temp_source_id_index], ProductId: this.selected_product["ProductId"],
                  Year: "", LocalQuantity: "", Type: type, Region: "",
                  ImportQuantity: "", ExportQuantity: "", QuantityUOM: this.selected_unit_name,
                  Operation: "D"
                };

                this.deleted_product_demand.push(product_demand_source_data_2);

                product_demand_temp_source_id_index++;

              }

            }

          });

        });

      });

    });

  }

  onClientsTableUpload(requests, modal_data, method, event, RelatedEntityId) {

    if (requests.MessType == "S") {

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.clientsTableDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onClientsTableUploadDataBind(modal_data, method, event, RelatedEntityId);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onClientsTableUploadDataBind(modal_data, method, event, RelatedEntityId) {

    var clients_source_data_array = [];

    var clients_source_data = {};

    if (method == "add") {

      clients_source_data = {
        ClientId: "", ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[0].selected,
        ClientName: modal_data.inputs[1].value, ClientLocation: modal_data.inputs[2].selected, ConsumptionQuantity: modal_data.inputs[3].value,
        ConsumptionUOM: modal_data.inputs[4].selected, GuiId: RelatedEntityId, Operation: "C"
      };

      clients_source_data_array.push(clients_source_data);

      if (this.clients_source_length == 0)
        this.clients_source.load(clients_source_data_array);

      else
        this.clients_source.add(clients_source_data);

      this.clients_source_length++;

      this.clients_source.refresh();

      var clients_temp_source = [], clients_temp_source_1 = [];

      this.clients_source.getAll().then((res) => {

        clients_temp_source = res;

        clients_temp_source_1.push(clients_temp_source[clients_temp_source.length - 1]);

        for (var i = 0; i < clients_temp_source.length - 1; i++)
          clients_temp_source_1.push(clients_temp_source[i]);

        this.clients_source.load(clients_temp_source_1);

        this.clients_source.refresh();

        this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.AdditionSuccessful'));

      });

      this.startedFilling = 1;

      this.spinnerService.hide();

    }

    else if (method == "edit") {

      clients_source_data = {
        ClientId: event.data.ClientId, ProductId: this.selected_product["ProductId"],
        Year: modal_data.inputs[0].selected, ClientName: modal_data.inputs[1].value,
        ClientLocation: modal_data.inputs[2].selected, ConsumptionQuantity: modal_data.inputs[3].value,
        ConsumptionUOM: modal_data.inputs[4].selected, GuiId: RelatedEntityId, Operation: event.data.Operation == "C" ? "C" : "U"
      };

      this.clients_source.update(event.data, clients_source_data);

      this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

      this.startedFilling = 1;

      this.clients_source.refresh();

      this.spinnerService.hide();

    }

  }

  onEdit(event, table_name) {

    let marketingInformationModalParams = {};

    if (table_name === 'Sales') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.EditSponsorProductSales'),

        val_indices: [2, 3, 4],

        inputs: [
          {
            id: "Year",
            name: this.translate.instant('MARKETING_INFORMATION.Year'),
            type: "select",
            value: this.year_minus_3_list,
            selected: event.data.Year,
            required: "true",
            visible: true
          },
          {
            id: "Month",
            name: this.translate.instant('MARKETING_INFORMATION.Month'),
            type: "select",
            value: this.month_till_date_list,
            selected: event.data.Month,
            required: "true",
            visible: event.data.Year == this.current_year ? true : false
          },
          {
            id: "LocalQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.LocalQuantity'),
            type: "number",
            value: event.data.LocalQuantity,
            required: "true",
          },
          {
            id: "ExportQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.ExportQuantity'),
            type: "number",
            value: event.data.ExportQuantity,
            required: "true",
          },
          {
            id: "Value",
            name: this.translate.instant('MARKETING_INFORMATION.TotalQuantity'),
            type: "number_disabled",
            value: parseFloat(event.data.Value).toFixed(4),
            required: "true",
          },
          {
            id: "QuantityUOM",
            name: this.translate.instant('MARKETING_INFORMATION.QuantityUnitofMeasure'),
            type: "select",
            value: this.unit_name_list,
            selected: event.data.QuantityUOM,
            required: "true",
            visible: true
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var product_sales_source_data = {
                SalesId: event.data.SalesId, ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[0].selected,
                Month: modal_data.inputs[1].selected, LocalQuantity: modal_data.inputs[2].value,
                ExportQuantity: modal_data.inputs[3].value, QuantityUOM: modal_data.inputs[5].selected, Value: modal_data.inputs[4].value,
                Operation: event.data.Operation == "C" ? "C" : "U"
              };

              this.product_sales_source.update(event.data, product_sales_source_data);

              this.product_sales_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

              this.startedFilling = 1;

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

    else if (table_name === 'TargetMarket') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.EditTargetMarketSegment'),

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.SegmentsType'),
            type: "select",
            value: this.market_type_desc_list,
            selected: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Percent",
            name: this.translate.instant('MARKETING_INFORMATION.Percentage'),
            type: "number",
            value: parseFloat(event.data.Percent).toFixed(4),
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var target_market_source_data = {
                TargetMarketID: event.data.TargetMarketID, ProductId: this.selected_product["ProductId"], Type: modal_data.inputs[0].selected,
                Percent: parseFloat(modal_data.inputs[1].value).toFixed(4), Operation: event.data.Operation == "C" ? "C" : "U"
              };

              this.target_market_source.update(event.data, target_market_source_data);

              this.target_market_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

              this.startedFilling = 1;

              for (var i = 0; i < this.market_type_selected_desc_list.length; i++)
                if (this.market_type_selected_desc_list[i] == event.data.Type)
                  this.market_type_selected_desc_list[i] = modal_data.inputs[0].selected;

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

    else if (table_name === 'TargetMarketRegion') {

      var market_region_type_desc_list = [];

      market_region_type_desc_list.push(event.data.Type);

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.EditTargetMarketRegionOrCountries'),

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "select",
            value: market_region_type_desc_list,
            selected: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "select",
            selected: event.data.Region,
            value: this.country_name_list,
            required: "true",
            visible: event.data.Type == "Local" ? false : true
          },
          {
            id: "Percent",
            name: this.translate.instant('MARKETING_INFORMATION.Percentage'),
            type: "number",
            value: parseFloat(event.data.Percent).toFixed(4),
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var target_market_region_source_data = {
                TargetMarketRegionId: event.data.TargetMarketRegionId, ProductId: this.selected_product["ProductId"],
                Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                Percent: parseFloat(modal_data.inputs[2].value).toFixed(4), Operation: event.data.Operation == "C" ? "C" : "U"
              };

              this.target_market_region_source.update(event.data, target_market_region_source_data);

              this.target_market_region_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

              this.startedFilling = 1;

              var target_market_region_temp_source_1 = [];

              var export_percentage_sum = 0;

              this.target_market_region_source.getAll().then((res1) => {

                target_market_region_temp_source_1 = res1;

                for (var i = 0; i < target_market_region_temp_source_1.length; i++)
                  if (target_market_region_temp_source_1[i].Type == "Export")
                    export_percentage_sum += parseFloat(target_market_region_temp_source_1[i].Percent);

                if (export_percentage_sum < 30)
                  this.market_region_type_desc_list = ["Local"];

                else
                  this.market_region_type_desc_list = ["Local", "Export"];

              });

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

    else if (table_name === 'LocalCompetitors') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        var local_competitors_sales_volume_source: LocalDataSource;

        local_competitors_sales_volume_source = new LocalDataSource();

        var additional_capacity_source: LocalDataSource;

        additional_capacity_source = new LocalDataSource();

        local_competitors_sales_volume_source.load(event.data.LocalCompSalesVolume);

        if (event.data.AdditionalCapacity && event.data.AdditionalCapacity != [])
          additional_capacity_source.load(event.data.AdditionalCapacity);

        this.local_competitors_sales_volume_settings_en.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        this.local_competitors_sales_volume_settings_ar.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.EditFactoriesinTargetMarketRegionOrCountries'),

          tables: [
            {
              heading: this.translate.instant('MARKETING_INFORMATION.LocalCompetitorsSalesVolume'),
              settings: this.lang == 'en' ? this.local_competitors_sales_volume_settings_en : this.local_competitors_sales_volume_settings_ar,
              source: local_competitors_sales_volume_source,
              required: "true",
              visible: true
            },
            {
              heading: this.translate.instant('MARKETING_INFORMATION.AdditionalCapacity'),
              settings: this.lang == 'en' ? this.additional_capacity_settings_en : this.additional_capacity_settings_ar,
              source: additional_capacity_source,
              required: "true",
              visible: event.data.AdditionalCapacity ? (event.data.AdditionalCapacity.length > 0 ? true : false) : false
            }
          ],

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              selected: event.data.Type,
              value: this.market_region_type_desc_list,
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: event.data.Region,
              value: region_list,
              required: "true",
              visible: event.data.Type == "Local" ? false : true
            },
            {
              id: "FactoryName",
              name: this.translate.instant('MARKETING_INFORMATION.Factory'),
              type: "text",
              value: event.data.FactoryName,
              required: "true",
            },
            {
              id: "ProductionCapacity",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionCapacity'),
              type: "number",
              value: event.data.ProductionCapacity,
              required: "true",
            },
            {
              id: "ProductionUOM",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionCapacityUnitofMeasure'),
              type: "select",
              selected: event.data.ProductionUOM,
              value: this.unit_name_list,
              required: "true",
              visible: true
            },
            {
              id: "AdditionalCapacity",
              name: "Additional Capacity",
              type: "checkbox",
              value: event.data.AdditionalCapacity ? (event.data.AdditionalCapacity.length > 0 ? true : false) : false,
              required: "false",
              visible: true
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var local_competitors_sales_volume_temp_source = [];

                var additional_capacity_temp_source = [];

                modal_data.tables[0].source.getAll().then((res) => {

                  local_competitors_sales_volume_temp_source = res;

                  if (modal_data.inputs[5].value == true) {

                    modal_data.tables[1].source.getAll().then((res) => {

                      additional_capacity_temp_source = res;

                      var flag = 0;

                      for (var i = 0; i < event.data.AdditionalCapacity.length; i++) {

                        flag = 0;

                        for (var j = 0; (j < additional_capacity_temp_source.length) && flag == 0; j++)
                          if (additional_capacity_temp_source[j].AdditionalCapacityId)
                            if (event.data.AdditionalCapacity[i].AdditionalCapacityId == additional_capacity_temp_source[j].AdditionalCapacityId)
                              flag = 1;

                        if (flag == 0 && event.data.AdditionalCapacity[i].AdditionalCapacityId) {

                          event.data.AdditionalCapacity[i]["Operation"] = "D";
                          this.deleted_additional_capacity.push(event.data.AdditionalCapacity[i]);

                        }

                      }

                      for (var i = 0; i < additional_capacity_temp_source.length; i++) {

                        if (additional_capacity_temp_source[i].AdditionalCapacityId == undefined)
                          additional_capacity_temp_source[i].Operation = additional_capacity_temp_source[i].Operation == "C" ? "C" :
                            !additional_capacity_temp_source[i].Operation ? "C" : "U";

                        else
                          additional_capacity_temp_source[i]["Operation"] = "U";

                      }

                      this.onEditLocalCompetitor(modal_data, event, local_competitors_sales_volume_temp_source,
                        additional_capacity_temp_source);

                    });

                  }

                  else
                    this.onEditLocalCompetitor(modal_data, event, local_competitors_sales_volume_temp_source,
                      additional_capacity_temp_source);

                });

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'ImportCompetitors') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        var import_competitors_sales_volume_source: LocalDataSource;

        import_competitors_sales_volume_source = new LocalDataSource();

        import_competitors_sales_volume_source.load(event.data.ImportSalesVolume);

        this.import_competitors_sales_volume_settings_en.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        this.import_competitors_sales_volume_settings_ar.columns.QuantityUOM.defaultValue = this.selected_unit_name;

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.EditImportCompetitorsinTargetMarketRegionOrCountries'),

          tables: [
            {
              heading: this.translate.instant('MARKETING_INFORMATION.ImportCompetitorsSalesVolume'),
              settings: this.lang == 'en' ? this.import_competitors_sales_volume_settings_en : this.import_competitors_sales_volume_settings_ar,
              source: import_competitors_sales_volume_source,
              required: "true",
              visible: true
            }
          ],

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              selected: event.data.Orgin,
              value: this.market_region_type_desc_list,
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: event.data.Region,
              value: region_list,
              required: "true",
              visible: event.data.Orgin == "Local" ? false : true
            },
            {
              id: "FactoryName",
              name: this.translate.instant('MARKETING_INFORMATION.Trader'),
              type: "text",
              value: event.data.FactoryName,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var import_competitors_sales_volume_temp_source = [];

                modal_data.tables[0].source.getAll().then((res) => {

                  import_competitors_sales_volume_temp_source = res;

                  var flag = 0;

                  for (var i = 0; i < event.data.ImportSalesVolume.length; i++) {

                    flag = 0;

                    for (var j = 0; (j < import_competitors_sales_volume_temp_source.length) && flag == 0; j++)
                      if (import_competitors_sales_volume_temp_source[j].ImportCompetitorsSalesId)
                        if (event.data.ImportSalesVolume[i].ImportCompetitorsSalesId == import_competitors_sales_volume_temp_source[j].ImportCompetitorsSalesId)
                          flag = 1;

                    if (flag == 0 && event.data.ImportSalesVolume[i].ImportCompetitorsSalesId) {

                      event.data.ImportSalesVolume[i]["Operation"] = "D";
                      this.deleted_import_competitors_sales_volume.push(event.data.ImportSalesVolume[i]);

                    }

                  }

                  for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

                    if (import_competitors_sales_volume_temp_source[i].ImportCompetitorsSalesId == undefined)
                      import_competitors_sales_volume_temp_source[i].Operation = import_competitors_sales_volume_temp_source[i].Operation == "C" ? "C" :
                        !import_competitors_sales_volume_temp_source[i].Operation ? "C" : "U";

                    else
                      import_competitors_sales_volume_temp_source[i]["Operation"] = "U";

                  }

                  var import_competitors_source_data = {
                    ImportCompetitorsId: event.data.ImportCompetitorsId, ProductId: this.selected_product["ProductId"],
                    Orgin: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                    FactoryName: modal_data.inputs[2].value,
                    ImportSalesVolume: import_competitors_sales_volume_temp_source, Operation: event.data.Operation == "C" ? "C" : "U"
                  };

                  this.import_competitors_source.update(event.data, import_competitors_source_data);

                  this.import_competitors_source.refresh();

                  this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

                  this.startedFilling = 1;

                  this.productDemandCalculation();

                });

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'Demand') {

      var local_competitors_temp_source = [], import_competitors_temp_source = [];

      var year_list = [], region_list = [],
        year_local_local_list = [], year_export_local_list = [],
        year_local_import_list = [], year_export_import_list = [];

      var local_competitors_sales_volume_temp_source = [], import_competitors_sales_volume_temp_source = [];

      this.local_competitors_source.getAll().then((res) => {

        local_competitors_temp_source = res;

        this.import_competitors_source.getAll().then((res) => {

          import_competitors_temp_source = res;

          for (var i = 0; i < local_competitors_temp_source.length; i++)
            if (local_competitors_temp_source[i].LocalCompSalesVolume)
              for (var j = 0; j < local_competitors_temp_source[i].LocalCompSalesVolume.length; j++) {

                local_competitors_temp_source[i].LocalCompSalesVolume[j]["MarketType"] = local_competitors_temp_source[i].Type;

                if (local_competitors_temp_source[i].Type == "Export")
                  local_competitors_temp_source[i].LocalCompSalesVolume[j]["Region"] = local_competitors_temp_source[i].Region;
                else
                  local_competitors_temp_source[i].LocalCompSalesVolume[j]["Region"] = "";

                local_competitors_sales_volume_temp_source.push(local_competitors_temp_source[i].LocalCompSalesVolume[j]);

              }

          for (var i = 0; i < import_competitors_temp_source.length; i++)
            if (import_competitors_temp_source[i].ImportSalesVolume)
              for (var j = 0; j < import_competitors_temp_source[i].ImportSalesVolume.length; j++) {

                import_competitors_temp_source[i].ImportSalesVolume[j]["MarketType"] = import_competitors_temp_source[i].Orgin;

                if (import_competitors_temp_source[i].Orgin == "Export")
                  import_competitors_temp_source[i].ImportSalesVolume[j]["Region"] = import_competitors_temp_source[i].Region;
                else
                  import_competitors_temp_source[i].ImportSalesVolume[j]["Region"] = "";

                import_competitors_sales_volume_temp_source.push(import_competitors_temp_source[i].ImportSalesVolume[j]);

              }

          for (var i = 0; i < local_competitors_sales_volume_temp_source.length; i++) {

            var flag = 0;

            for (var j = 0; (j < year_list.length) && flag == 0; j++)
              if (local_competitors_sales_volume_temp_source[i].Year == year_list[j])
                flag = 1;
              else
                flag = 0;

            if (flag == 0)
              year_list.push(local_competitors_sales_volume_temp_source[i].Year);

          }

          for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

            var flag = 0;

            for (var j = 0; (j < year_list.length) && flag == 0; j++)
              if (import_competitors_sales_volume_temp_source[i].Year == year_list[j])
                flag = 1;
              else
                flag = 0;

            if (flag == 0)
              year_list.push(import_competitors_sales_volume_temp_source[i].Year);

          }

          for (var i = 0; i < local_competitors_sales_volume_temp_source.length; i++) {

            if (local_competitors_sales_volume_temp_source[i].Region != "") {

              var flag = 0;

              for (var j = 0; (j < region_list.length) && flag == 0; j++)
                if (local_competitors_sales_volume_temp_source[i].Region == region_list[j])
                  flag = 1;
                else
                  flag = 0;

              if (flag == 0)
                region_list.push(local_competitors_sales_volume_temp_source[i].Region);

            }

          }

          for (var i = 0; i < import_competitors_sales_volume_temp_source.length; i++) {

            if (import_competitors_sales_volume_temp_source[i].Region != "") {

              var flag = 0;

              for (var j = 0; (j < region_list.length) && flag == 0; j++)
                if (import_competitors_sales_volume_temp_source[i].Region == region_list[j])
                  flag = 1;
                else
                  flag = 0;

              if (flag == 0)
                region_list.push(import_competitors_sales_volume_temp_source[i].Region);

            }

          }

          for (var i = 0; i < year_list.length; i++) {

            var sum_local = 0;

            for (var j = 0; j < local_competitors_sales_volume_temp_source.length; j++)
              if (local_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                local_competitors_sales_volume_temp_source[j].MarketType == "Local" &&
                local_competitors_sales_volume_temp_source[j].Type == "Local")
                sum_local += parseInt(local_competitors_sales_volume_temp_source[j].LocalQuantity);

            year_local_local_list.push({ year: year_list[i], sum: sum_local });

            for (var k = 0; k < region_list.length; k++) {

              var sum_import = 0;

              for (var j = 0; j < local_competitors_sales_volume_temp_source.length; j++)
                if (local_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                  local_competitors_sales_volume_temp_source[j].MarketType == "Export" &&
                  local_competitors_sales_volume_temp_source[j].Type == "Local" &&
                  local_competitors_sales_volume_temp_source[j].Region == region_list[k])
                  sum_import += parseInt(local_competitors_sales_volume_temp_source[j].LocalQuantity);

              year_local_import_list.push({ year: year_list[i], region: region_list[k], sum: sum_import });

            }

          }

          for (var i = 0; i < year_list.length; i++) {

            var sum_local = 0;

            for (var j = 0; j < import_competitors_sales_volume_temp_source.length; j++)
              if (import_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                import_competitors_sales_volume_temp_source[j].MarketType == "Local")
                sum_local += parseInt(import_competitors_sales_volume_temp_source[j].Quantity);

            year_export_local_list.push({ year: year_list[i], sum: sum_local });

            for (var k = 0; k < region_list.length; k++) {

              var sum_import = 0;

              for (var j = 0; j < import_competitors_sales_volume_temp_source.length; j++)
                if (import_competitors_sales_volume_temp_source[j].Year == year_list[i] &&
                  import_competitors_sales_volume_temp_source[j].MarketType == "Export" &&
                  import_competitors_sales_volume_temp_source[j].Region == region_list[k])
                  sum_import += parseInt(import_competitors_sales_volume_temp_source[j].Quantity);

              year_export_import_list.push({ year: year_list[i], region: region_list[k], sum: sum_import });

            }

          }

          marketingInformationModalParams = {

            header: this.translate.instant('MARKETING_INFORMATION.EditHistoricalProductDemand'),

            inputs: [
              {
                id: "Type",
                name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
                type: "select",
                selected: event.data.Type,
                value: this.market_region_type_desc_list,
                required: "true",
                visible: true
              },
              {
                id: "Region",
                name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
                type: "select",
                selected: event.data.Region,
                value: region_list,
                required: "true",
                visible: event.data.Type == "Local" ? false : true
              },
              {
                id: "Year",
                name: this.translate.instant('MARKETING_INFORMATION.Year'),
                type: "select",
                value: year_list,
                selected: event.data.Year,
                required: "true",
                visible: true
              },
              {
                id: "LocalQuantity",
                name: this.translate.instant('MARKETING_INFORMATION.LocalQuantity'),
                type: "number_disabled",
                value: event.data.LocalQuantity,
                sum_local: year_local_local_list,
                sum_import: year_local_import_list,
                required: "true",
              },
              {
                id: "ImportQuantity",
                name: this.translate.instant('MARKETING_INFORMATION.ImportQuantity'),
                type: "number_disabled",
                value: event.data.ImportQuantity,
                sum_local: year_export_local_list,
                sum_import: year_export_import_list,
                required: "true",
              },
              {
                id: "ExportQuantity",
                name: this.translate.instant('MARKETING_INFORMATION.Demand'),
                type: "number_disabled",
                value: event.data.ExportQuantity,
                required: "true",
              },
              {
                id: "QuantityUOM",
                name: this.translate.instant('MARKETING_INFORMATION.QuantityUnitofMeasure'),
                type: "select",
                value: this.unit_name_list,
                selected: event.data.QuantityUOM,
                required: "true",
                visible: true
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  var product_demand_source_data = {
                    DemandId: event.data.DemandId, ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[2].selected, LocalQuantity: modal_data.inputs[3].value,
                    Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                    ImportQuantity: modal_data.inputs[4].value, ExportQuantity: modal_data.inputs[5].value, QuantityUOM: modal_data.inputs[6].selected,
                    Operation: event.data.Operation == "C" ? "C" : "U"
                  };

                  this.product_demand_source.update(event.data, product_demand_source_data);

                  this.product_demand_source.refresh();

                  this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

                  this.startedFilling = 1;

                }
              }
            ]
          };

          let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

        });

      });

    }

    else if (table_name === 'ExpectedSales') {

      if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

        var target_market_region_temp_source = [];

        var region_list_1 = [];

        this.target_market_region_source.getAll().then((res) => {

          target_market_region_temp_source = res;

          for (var i = 0; i < target_market_region_temp_source.length; i++)
            if (target_market_region_temp_source[i].Type == "Export")
              region_list_1.push({ value: target_market_region_temp_source[i].Region, title: target_market_region_temp_source[i].Region });

          var expected_sales_volume_export_source: LocalDataSource;

          expected_sales_volume_export_source = new LocalDataSource();

          expected_sales_volume_export_source.load(event.data.ProductExpectedSalesExport);

          this.expected_sales_volume_export_settings_en.columns.Region.editor.config.list = region_list_1;

          this.expected_sales_volume_export_settings_ar.columns.Region.editor.config.list = region_list_1;

          marketingInformationModalParams = {

            header: this.translate.instant('MARKETING_INFORMATION.EditExpectedSalesVolume'),

            val_indices: [1, 3, 4],

            inputs: [
              {
                id: "Year",
                name: this.translate.instant('MARKETING_INFORMATION.Year'),
                type: "select",
                value: this.com_proj_plus_5_list,
                selected: event.data.Year,
                required: "true",
                visible: true
              },
              {
                id: "Local",
                name: this.translate.instant('MARKETING_INFORMATION.Local'),
                type: "number",
                value: event.data.Local,
                required: "true",
              },
              {
                id: "Export",
                type: "table",
                heading: this.translate.instant('MARKETING_INFORMATION.Export'),
                settings: this.lang == 'en' ? this.expected_sales_volume_export_settings_en : this.expected_sales_volume_export_settings_ar,
                source: expected_sales_volume_export_source,
                source_length: event.data.ProductExpectedSalesExport.length,
                required: region_list_1.length > 0 ? "true" : "false",
                visible: true
              },
              {
                id: "TotalExport",
                name: this.translate.instant('MARKETING_INFORMATION.TotalExport'),
                type: "number_disabled",
                value: region_list_1.length > 0 ? event.data.TotalExport : "0",
                required: "true",
              },
              {
                id: "Value",
                name: this.translate.instant('MARKETING_INFORMATION.Total'),
                type: "number_disabled",
                value: event.data.Value,
                required: "true",
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  var expected_sales_volume_export_temp_source = [];

                  modal_data.inputs[2].source.getAll().then((res) => {

                    expected_sales_volume_export_temp_source = res;

                    var flag = 0;

                    for (var i = 0; i < event.data.ProductExpectedSalesExport.length; i++) {

                      flag = 0;

                      for (var j = 0; (j < expected_sales_volume_export_temp_source.length) && flag == 0; j++)
                        if (expected_sales_volume_export_temp_source[j].ExpectedExportID)
                          if (event.data.ProductExpectedSalesExport[i].ExpectedExportID == expected_sales_volume_export_temp_source[j].ExpectedExportID)
                            flag = 1;

                      if (flag == 0 && event.data.ProductExpectedSalesExport[i].ExpectedExportID) {

                        event.data.ProductExpectedSalesExport[i]["Operation"] = "D";
                        this.deleted_expected_sales_volume_export_volume.push(event.data.ProductExpectedSalesExport[i]);

                      }

                    }

                    for (var i = 0; i < expected_sales_volume_export_temp_source.length; i++) {

                      if (expected_sales_volume_export_temp_source[i].ExpectedExportID == undefined)
                        expected_sales_volume_export_temp_source[i].Operation = expected_sales_volume_export_temp_source[i].Operation == "C" ? "C" :
                          !expected_sales_volume_export_temp_source[i].Operation ? "C" : "U";

                      else
                        expected_sales_volume_export_temp_source[i]["Operation"] = "U";

                    }

                    var expected_sales_source_data = {
                      ExpectedSalesID: event.data.ExpectedSalesID, ProductId: this.selected_product["ProductId"], Year: modal_data.inputs[0].selected,
                      Local: modal_data.inputs[1].value, ProductExpectedSalesExport: expected_sales_volume_export_temp_source, TotalExport: modal_data.inputs[3].value,
                      Value: modal_data.inputs[4].value, Operation: event.data.Operation == "C" ? "C" : "U"
                    };

                    this.expected_sales_source.update(event.data, expected_sales_source_data);

                    this.expected_sales_source.refresh();

                    this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

                    this.startedFilling = 1;

                  });

                }
              }
            ]
          };

          let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

        });

      }

      else
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYear'));

    }

    else if (table_name === 'Clients') {

      if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

        var temp_documents = { url: "", documentList: [], method: "" };

        temp_documents.method = "edit";

        temp_documents.url = this.clientsTableDocuments.url;

        for (var i = 0; i < this.clientsTableDocuments.documentList.length; i++)
          if (parseInt(this.clientsTableDocuments.documentList[i].RelatedEntityId) ==
            parseInt(event.data.GuiId))
            temp_documents.documentList.push(this.clientsTableDocuments.documentList[i]);

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.EditTargetedEndUsers'),

          documents: temp_documents,

          inputs: [
            {
              id: "Year",
              name: this.translate.instant('MARKETING_INFORMATION.Year'),
              type: "select",
              value: this.client_6_year_list,
              selected: event.data.Year,
              required: "true",
              visible: true
            },
            {
              id: "ClientName",
              name: this.translate.instant('MARKETING_INFORMATION.EndUserName'),
              type: "text",
              value: event.data.ClientName,
              required: "true",
            },
            {
              id: "ClientLocation",
              name: this.translate.instant('MARKETING_INFORMATION.EndUserLocation'),
              type: "select",
              value: this.country_name_list,
              selected: event.data.ClientLocation,
              required: "true",
              visible: true
            },
            {
              id: "ConsumptionQuantity",
              name: this.translate.instant('MARKETING_INFORMATION.ConsumptionQuantity'),
              type: "number",
              value: event.data.ConsumptionQuantity,
              required: "true",
            },
            {
              id: "ConsumptionUOM",
              name: this.translate.instant('MARKETING_INFORMATION.ConsumptionUnitofMeasure'),
              type: "select",
              value: this.unit_name_list,
              selected: event.data.ConsumptionUOM,
              required: "true",
              visible: true
            },
            {
              id: "ClientAgreements",
              name: this.translate.instant('MARKETING_INFORMATION.EndUserAgreements'),
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

                var temp_array = [];

                for (var i = 0; i < this.clientsTableDocuments.documentList.length; i++)
                  if (!(parseInt(this.clientsTableDocuments.documentList[i].RelatedEntityId) ==
                    parseInt(event.data.GuiId)))
                    temp_array.push(this.clientsTableDocuments.documentList[i]);

                for (var i = 0; i < modal_data.documents.documentList.length; i++)
                  temp_array.push(modal_data.documents.documentList[i]);

                this.clientsTableDocuments.documentList = temp_array;

                var data = {
                  documentDefId: 121,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: event.data.GuiId ? event.data.GuiId : this.commonService.returnRandomNumber(),
                  RelatedEntityName: "product",
                  operationType: "l"
                };

                this.spinnerService.show();

                if (modal_data.inputs[5].file && modal_data.inputs[5].file != "")
                  this.communicationsService.uploadDocumentService(modal_data.inputs[5].file, data)
                    .then(requests => (this.onClientsTableUpload(requests, modal_data, "edit", event, data.RelatedEntityId)), err => this.resolveError());

                else
                  this.onClientsTableUploadDataBind(modal_data, "edit", event, data.RelatedEntityId);

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      }

      else
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYear'));

    }

    else if (table_name === 'ProposedSellingPrice') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        marketingInformationModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.EditSponsorProposedPrice'),

          inputs: [
            {
              id: "Type",
              name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
              type: "select",
              selected: event.data.Type,
              value: this.market_region_type_desc_list,
              required: "true",
              visible: true
            },
            {
              id: "Region",
              name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
              type: "select",
              selected: event.data.Region,
              value: region_list,
              required: "true",
              visible: event.data.Type == "Local" ? false : true
            },
            {
              id: "MarketType",
              name: this.translate.instant('MARKETING_INFORMATION.MarketType'),
              type: "select",
              value: this.market_type_selected_desc_list,
              selected: event.data.MarketType,
              required: "true",
              visible: true
            },
            {
              id: "ProposedPrice",
              name: this.translate.instant('MARKETING_INFORMATION.ProposedPrice'),
              type: "text_cost",
              value: this.commonService.numberWithCommasToNumber(event.data.ProposedPrice.replace('SAR ', "")),
              UOM_id: "ProposedPriceUOM",
              UOM_value: this.unit_name_list,
              UOM_selected: event.data.ProposedPriceUOM,
              required: "true",
            },
            {
              id_1: "CompetitorPriceFrom",
              name: this.translate.instant('MARKETING_INFORMATION.CompetitorPriceRange'),
              type: "text_cost_range",
              value_1: this.commonService.numberWithCommasToNumber(event.data.CompetitorPriceFrom.replace('SAR ', "")),
              id_2: "CompetitorPriceTo",
              value_2: this.commonService.numberWithCommasToNumber(event.data.CompetitorPriceTo.replace('SAR ', "")),
              UOM_id: "CompetitorPriceUOM",
              UOM_value: this.unit_name_list,
              UOM_selected: event.data.CompetitorPriceUOM,
              required: "true",
            },
            {
              id_1: "ImporterPriceFrom",
              name: this.translate.instant('MARKETING_INFORMATION.ImporterPriceRange'),
              type: "text_cost_range",
              value_1: this.commonService.numberWithCommasToNumber(event.data.ImporterPriceFrom.replace('SAR ', "")),
              id_2: "ImporterPriceTo",
              value_2: this.commonService.numberWithCommasToNumber(event.data.ImporterPriceTo.replace('SAR ', "")),
              UOM_id: "ImporterPriceUOM",
              UOM_value: this.unit_name_list,
              UOM_selected: event.data.ImporterPriceUOM,
              required: "true",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var proposed_selling_price_source_data = {
                  ProposedSellingID: event.data.ProposedSellingID, ProductId: this.selected_product["ProductId"],
                  Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                  MarketType: modal_data.inputs[2].selected, ProposedPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[3].value),
                  ProposedPriceUOM: modal_data.inputs[3].UOM_selected,
                  CompetitorPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_1) + " - " + "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_2),
                  CompetitorPriceFrom: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_1), CompetitorPriceTo: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value_2), CompetitorPriceUOM: modal_data.inputs[4].UOM_selected,
                  ImporterPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_1) + " - " + "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_2),
                  ImporterPriceFrom: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_1), ImporterPriceTo: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value_2), ImporterPriceUOM: modal_data.inputs[5].UOM_selected,
                  Operation: event.data.Operation == "C" ? "C" : "U"
                };

                this.proposed_selling_price_source.update(event.data, proposed_selling_price_source_data);

                this.proposed_selling_price_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

                this.startedFilling = 1;

              }
            }
          ]
        };

        let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

      });

    }

    else if (table_name === 'MajorCompetitor') {

      var target_market_region_temp_source = [];

      var region_list = [];

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          if (target_market_region_temp_source[i].Type == "Export")
            region_list.push(target_market_region_temp_source[i].Region)

        var local_competitors_temp_source = [], local_competitor_factory_names = [],
          export_competitor_factory_names = [];

        this.local_competitors_source.getAll().then((res) => {

          local_competitors_temp_source = res;

          for (var i = 0; i < local_competitors_temp_source.length; i++)
            if (local_competitors_temp_source[i].Type == "Local")
              local_competitor_factory_names.push(local_competitors_temp_source[i].FactoryName)
            else if (local_competitors_temp_source[i].Type == "Export")
              export_competitor_factory_names.push(local_competitors_temp_source[i].FactoryName)

          marketingInformationModalParams = {

            header: this.translate.instant('MARKETING_INFORMATION.EditMajorCompetitorMarketShare'),

            inputs: [
              {
                id: "Type",
                name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
                type: "select",
                selected: event.data.Type,
                value: this.market_region_type_desc_list,
                required: "true",
                visible: true
              },
              {
                id: "Region",
                name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
                type: "select",
                selected: event.data.Region,
                value: region_list,
                required: "true",
                visible: event.data.Type == "Local" ? false : true
              },
              {
                id: "CompetitorName",
                name: this.translate.instant('MARKETING_INFORMATION.CompetitorName'),
                type: "select",
                value: event.data.Type == "Local" ? local_competitor_factory_names : export_competitor_factory_names,
                dropdown_1: local_competitor_factory_names,
                dropdown_2: export_competitor_factory_names,
                selected: event.data.CompetitorName,
                required: "true",
                visible: true
              },
              {
                id: "MarketShare",
                name: this.translate.instant('MARKETING_INFORMATION.MarketSharePercentage'),
                type: "number",
                value: event.data.MarketShare,
                required: "true",
              }
            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "button",
                class: "btn-success",

                handler: (modal_data) => {

                  var major_competitors_source_data = {
                    CompetitorId: event.data.CompetitorId, ProductId: this.selected_product["ProductId"],
                    Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected,
                    CompetitorName: modal_data.inputs[2].selected,
                    MarketShare: modal_data.inputs[3].value, Operation: event.data.Operation == "C" ? "C" : "U"
                  };

                  this.major_competitors_source.update(event.data, major_competitors_source_data);

                  this.major_competitors_source.refresh();

                  this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

                  this.startedFilling = 1;

                }
              }
            ]
          };

          let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

        });

      });

    }

    else if (table_name === 'ManufacturingStages') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.EditManufacturingStages'),

        inputs: [
          {
            id: "StageSequence",
            name: this.translate.instant('MARKETING_INFORMATION.StageSequence'),
            type: "number",
            value: event.data.StageSequence,
            required: "true",
          },
          {
            id: "MachineId",
            name: this.translate.instant('MARKETING_INFORMATION.MachineId'),
            type: "select",
            value: this.machineries_desc_list,
            selected: event.data.MachineId,
            required: "true",
            visible: true
          },
          {
            id: "MachineName",
            name: this.translate.instant('MARKETING_INFORMATION.MachineName'),
            type: "text",
            value: event.data.MachineName,
            required: "true",
          },
          {
            id: "Operators",
            name: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
            type: "number",
            value: event.data.Operators,
            required: "true",
          },
          {
            id: "ProductionRate",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionRate'),
            type: "number",
            value: event.data.ProductionRate,
            required: "true",
          },
          {
            id: "ProductionUom",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
            type: "select",
            value: this.unit_name_list,
            selected: event.data.ProductionUom,
            required: "true",
            visible: true
          },
          {
            id: "StageName",
            name: this.translate.instant('MARKETING_INFORMATION.StageName'),
            type: "text",
            value: event.data.StageName,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var manufacturing_stages_source_data = {
                ManufacturingStagesId: event.data.ManufacturingStagesId, ProductId: this.selected_product["ProductId"], StageSequence: modal_data.inputs[0].value, MachineId: modal_data.inputs[1].selected, MachineName: modal_data.inputs[2].value, Operators: modal_data.inputs[3].value,
                ProductionRate: modal_data.inputs[4].value, ProductionUom: modal_data.inputs[5].selected, StageName: modal_data.inputs[6].value, Operation: event.data.Operation == "C" ? "C" : "U"
              };

              this.manufacturing_stages_source.update(event.data, manufacturing_stages_source_data);

              this.manufacturing_stages_source.refresh();

              this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

              this.startedFilling = 1;

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

    else if (table_name === 'ProductionLines') {

      var Product_Production_Lines_Section_source: LocalDataSource;

      Product_Production_Lines_Section_source = new LocalDataSource();

      Product_Production_Lines_Section_source.load(event.data.ProductProductionLinesSection);

      this.Product_Production_Lines_Section_settings_en.columns.MeasurementUnit.defaultValue = this.selected_unit_name;

      this.Product_Production_Lines_Section_settings_ar.columns.MeasurementUnit.defaultValue = this.selected_unit_name;

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.EditProductionLines'),

        tables: [
          {
            heading: this.translate.instant('MARKETING_INFORMATION.ProductProductionLinesSection'),
            settings: this.lang == 'en' ? this.Product_Production_Lines_Section_settings_en : this.Product_Production_Lines_Section_settings_ar,
            source: Product_Production_Lines_Section_source,
            required: "true",
            visible: true
          }
        ],

        inputs: [
          {
            id: "ProductionLinesDesc",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionLinesDescription'),
            type: "text",
            value: event.data.ProductionLinesDesc,
            required: "true",
          }
        ],
        buttons: [
          {
            name: this.translate.instant('COMMON.Save'),
            type: "button",
            class: "btn-success",

            handler: (modal_data) => {

              var Product_Production_Lines_Section_temp_source = [];

              modal_data.tables[0].source.getAll().then((res) => {

                Product_Production_Lines_Section_temp_source = res;

                for (var i = 0; i < Product_Production_Lines_Section_temp_source.length; i++) {

                  Product_Production_Lines_Section_temp_source[i]["Value"] = parseInt(Product_Production_Lines_Section_temp_source[i].Description) + parseInt(Product_Production_Lines_Section_temp_source[i].Rate) + parseInt(Product_Production_Lines_Section_temp_source[i].RateUnit) +
                    parseInt(Product_Production_Lines_Section_temp_source[i].ShifHours) + parseInt(Product_Production_Lines_Section_temp_source[i].ShiftPerDay) + parseInt(Product_Production_Lines_Section_temp_source[i].DaysPerYear) +
                    parseInt(Product_Production_Lines_Section_temp_source[i].PercentageEfficiency);
                  Product_Production_Lines_Section_temp_source[i]["Operation"] = event.data.Operation == "C" ? "C" : "U";

                }

                var production_lines_source_data = {
                  ProductionLinesId: event.data.ProductionLinesId, ProductId: this.selected_product["ProductId"], ProductionLinesDesc: modal_data.inputs[0].value,
                  ProductProductionLinesSection: Product_Production_Lines_Section_temp_source, Operation: event.data.Operation == "C" ? "C" : "U"
                };

                this.production_lines_source.update(event.data, production_lines_source_data);

                this.production_lines_source.refresh();

                this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

                this.startedFilling = 1;

              });

            }
          }
        ]
      };

      let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
      marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

    }

  }

  onEditLocalCompetitor(modal_data, event, local_competitors_sales_volume_temp_source,
    additional_capacity_temp_source) {

    var flag = 0;

    for (var i = 0; i < event.data.LocalCompSalesVolume.length; i++) {

      flag = 0;

      for (var j = 0; (j < local_competitors_sales_volume_temp_source.length) && flag == 0; j++)
        if (local_competitors_sales_volume_temp_source[j].LocalCompSalesId)
          if (event.data.LocalCompSalesVolume[i].LocalCompSalesId == local_competitors_sales_volume_temp_source[j].LocalCompSalesId)
            flag = 1;

      if (flag == 0 && event.data.LocalCompSalesVolume[i].LocalCompSalesId) {

        event.data.LocalCompSalesVolume[i]["Operation"] = "D";
        this.deleted_local_competitors_sales_volume.push(event.data.LocalCompSalesVolume[i]);

      }

    }

    for (var i = 0; i < local_competitors_sales_volume_temp_source.length; i++) {

      if (local_competitors_sales_volume_temp_source[i].LocalCompSalesId == undefined)
        local_competitors_sales_volume_temp_source[i].Operation = local_competitors_sales_volume_temp_source[i].Operation == "C" ? "C" :
          !local_competitors_sales_volume_temp_source[i].Operation ? "C" : "U";

      else
        local_competitors_sales_volume_temp_source[i]["Operation"] = "U";

    }

    var local_competitors_source_data = {};

    if (additional_capacity_temp_source == [])
      local_competitors_source_data = {
        LocalCompetitorID: event.data.LocalCompetitorID, ProductId: this.selected_product["ProductId"],
        Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected, FactoryName: modal_data.inputs[2].value,
        AdditionalCapacity: additional_capacity_temp_source, ProductionCapacity: modal_data.inputs[3].value, ProductionUOM: modal_data.inputs[4].selected, LocalCompSalesVolume: local_competitors_sales_volume_temp_source, Operation: event.data.Operation == "C" ? "C" : "U"
      };

    else
      local_competitors_source_data = {
        LocalCompetitorID: event.data.LocalCompetitorID, ProductId: this.selected_product["ProductId"],
        Type: modal_data.inputs[0].selected, Region: modal_data.inputs[1].selected, FactoryName: modal_data.inputs[2].value,
        ProductionCapacity: modal_data.inputs[3].value, ProductionUOM: modal_data.inputs[4].selected,
        AdditionalCapacity: additional_capacity_temp_source, LocalCompSalesVolume: local_competitors_sales_volume_temp_source, Operation: event.data.Operation == "C" ? "C" : "U"
      };

    this.local_competitors_source.update(event.data, local_competitors_source_data);

    this.local_competitors_source.refresh();

    this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.EditSuccessful'));

    this.startedFilling = 1;

    this.productDemandCalculation();

  }

  onView(event, table_name) {

    let marketingInformationModalParams = {};

    if (table_name === 'Sales') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewSponsorProductSales'),

        method: "view",

        inputs: [
          {
            id: "Year",
            name: this.translate.instant('MARKETING_INFORMATION.Year'),
            type: "text",
            value: event.data.Year,
            required: "true",
            visible: true
          },
          {
            id: "Month",
            name: this.translate.instant('MARKETING_INFORMATION.Month'),
            type: "text",
            value: event.data.Month,
            required: "true",
            visible: event.data.Year == this.current_year ? true : false
          },
          {
            id: "LocalQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.LocalQuantity'),
            type: "text",
            value: event.data.LocalQuantity,
            required: "true",
            visible: true
          },
          {
            id: "ExportQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.ExportQuantity'),
            type: "text",
            value: event.data.ExportQuantity,
            required: "true",
            visible: true
          },
          {
            id: "Value",
            name: this.translate.instant('MARKETING_INFORMATION.TotalQuantity'),
            type: "text",
            value: event.data.Value,
            required: "true",
            visible: true
          },
          {
            id: "QuantityUOM",
            name: this.translate.instant('MARKETING_INFORMATION.QuantityUnitofMeasure'),
            type: "text",
            value: event.data.QuantityUOM,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'TargetMarket') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewTargetMarketSegment'),

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.SegmentsType'),
            type: "text",
            value: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Percent",
            name: this.translate.instant('MARKETING_INFORMATION.Percentage'),
            type: "text",
            value: event.data.Percent,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'TargetMarketRegion') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewTargetMarketRegionOrCountries'),

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "text",
            value: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "text",
            value: event.data.Region,
            required: "true",
            visible: event.data.Type == "Local" ? false : true
          },
          {
            id: "Percent",
            name: this.translate.instant('MARKETING_INFORMATION.Percentage'),
            type: "text",
            value: event.data.Percent,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'LocalCompetitors') {

      var local_competitors_sales_volume_source: LocalDataSource;

      local_competitors_sales_volume_source = new LocalDataSource();

      local_competitors_sales_volume_source.load(event.data.LocalCompSalesVolume);

      var additional_capacity_source: LocalDataSource;

      additional_capacity_source = new LocalDataSource();

      if (event.data.AdditionalCapacity)
        additional_capacity_source.load(event.data.AdditionalCapacity);

      var local_competitors_sales_volume_settings_en = {

        hideSubHeader: true,

        noDataMessage: "No Local Competitors Sales Volume Found",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false
        },

        columns: {
          Type: {
            title: "Target Market",
            type: "text"
          },
          Year: {
            title: "Year",
            type: "text"
          },
          LocalQuantity: {
            title: "Quantity",
            type: "number"
          },
          QuantityUOM: {
            title: 'Quantity Unit of Measure',
            type: "text"
          }
        }
      };

      var local_competitors_sales_volume_settings_ar = {

        hideSubHeader: true,

        noDataMessage: "لم يتم العثور على حجم مبيعات المنافسين المحليين",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false
        },

        columns: {
          Type: {
            title: "السوق المستهدف",
            type: "text"
          },
          Year: {
            title: "عام",
            type: "text"
          },
          LocalQuantity: {
            title: "كمية",
            type: "number"
          },
          QuantityUOM: {
            title: 'وحدة كمية القياس',
            type: "text"
          }
        }
      };

      var additional_capacity_settings_en = {

        hideSubHeader: true,

        noDataMessage: "No Additional Capacity Found",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false,
        },

        columns: {
          Name: {
            title: "Name",
            type: "text"
          },
          Capacity: {
            title: "Capacity",
            type: "number"
          },
          Date: {
            title: 'Date of Implementation',
            type: 'custom',
            renderComponent: SmartTableDatepickerRenderComponent,
            filter: false,
            editor: {
              type: 'custom',
              component: SmartTableDatepickerComponent,
            }
          }
        }
      };

      var additional_capacity_settings_ar = {

        hideSubHeader: true,

        noDataMessage: "لا توجد قدرة إضافية",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false,
        },

        columns: {
          Name: {
            title: "اسم",
            type: "text"
          },
          Capacity: {
            title: "سعة",
            type: "number"
          },
          Date: {
            title: 'تاريخ التنفيذ',
            type: 'custom',
            renderComponent: SmartTableDatepickerRenderComponent,
            filter: false,
            editor: {
              type: 'custom',
              component: SmartTableDatepickerComponent,
            }
          }
        }
      };

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewFactoriesinTargetMarketRegionOrCountries'),

        tables: [
          {
            heading: this.translate.instant('MARKETING_INFORMATION.LocalCompetitorsSalesVolume'),
            settings: this.lang == 'en' ? local_competitors_sales_volume_settings_en : local_competitors_sales_volume_settings_ar,
            source: local_competitors_sales_volume_source,
            required: "true",
            visible: true
          },
          {
            heading: this.translate.instant('MARKETING_INFORMATION.AdditionalCapacity'),
            settings: this.lang == 'en' ? additional_capacity_settings_en : additional_capacity_settings_ar,
            source: additional_capacity_source,
            required: "true",
            visible: event.data.AdditionalCapacity ? (event.data.AdditionalCapacity.length > 0 ? true : false) : false
          }
        ],

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "text",
            value: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "text",
            value: event.data.Region,
            required: "true",
            visible: event.data.Type == "Local" ? false : true
          },
          {
            id: "FactoryName",
            name: this.translate.instant('MARKETING_INFORMATION.Factory'),
            type: "text",
            value: event.data.FactoryName,
            required: "true",
            visible: true
          },
          {
            id: "ProductionCapacity",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionCapacity'),
            type: "text",
            value: event.data.ProductionCapacity,
            required: "true",
            visible: true
          },
          {
            id: "ProductionUOM",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionCapacityUnitofMeasure'),
            type: "text",
            value: event.data.ProductionUOM,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'ImportCompetitors') {

      var import_competitors_sales_volume_source: LocalDataSource;

      import_competitors_sales_volume_source = new LocalDataSource();

      import_competitors_sales_volume_source.load(event.data.ImportSalesVolume);

      var import_competitors_sales_volume_settings_en = {

        hideSubHeader: true,

        noDataMessage: "No Import Competitors Sales Volume Found",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false,
        },

        columns: {
          Year: {
            title: "Year",
            type: "text"
          },
          Quantity: {
            title: "Quantity",
            type: "number"
          },
          QuantityUOM: {
            title: 'Quantity Unit of Measure',
            type: "text"
          }
        }
      };

      var import_competitors_sales_volume_settings_ar = {

        hideSubHeader: true,

        noDataMessage: "لا يوجد حجم استيراد المنافسين حجم المبيعات",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false,
        },

        columns: {
          Year: {
            title: "عام",
            type: "text"
          },
          Quantity: {
            title: "كمية",
            type: "number"
          },
          QuantityUOM: {
            title: 'وحدة كمية القياس',
            type: "text"
          }
        }
      };

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewImportCompetitorsinTargetMarketRegionOrCountries'),

        tables: [
          {
            heading: this.translate.instant('MARKETING_INFORMATION.ImportCompetitorsSalesVolume'),
            settings: this.lang == 'en' ? import_competitors_sales_volume_settings_en : import_competitors_sales_volume_settings_ar,
            source: import_competitors_sales_volume_source,
            required: "true",
            visible: true
          }
        ],

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "text",
            value: event.data.Orgin,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "text",
            value: event.data.Region,
            required: "true",
            visible: event.data.Orgin == "Local" ? false : true
          },
          {
            id: "FactoryName",
            name: this.translate.instant('MARKETING_INFORMATION.Trader'),
            type: "text",
            value: event.data.FactoryName,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'Demand') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewHistoricalProductDemand'),

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "text",
            value: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "text",
            value: event.data.Region,
            required: "true",
            visible: event.data.Type == "Local" ? false : true
          },
          {
            id: "Year",
            name: this.translate.instant('MARKETING_INFORMATION.Year'),
            type: "text",
            value: event.data.Year,
            required: "true",
            visible: true
          },
          {
            id: "LocalQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.LocalQuantity'),
            type: "text",
            value: event.data.LocalQuantity,
            required: "true",
            visible: true
          },
          {
            id: "ImportQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.ImportQuantity'),
            type: "text",
            value: event.data.ImportQuantity,
            required: "true",
            visible: true
          },
          {
            id: "ExportQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.Demand'),
            type: "text",
            value: event.data.ExportQuantity,
            required: "true",
            visible: true
          },
          {
            id: "QuantityUOM",
            name: this.translate.instant('MARKETING_INFORMATION.QuantityUnitofMeasure'),
            type: "text",
            value: event.data.QuantityUOM,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'ExpectedSales') {

      var expected_sales_volume_export_source: LocalDataSource;

      expected_sales_volume_export_source = new LocalDataSource();

      expected_sales_volume_export_source.load(event.data.ProductExpectedSalesExport);

      var expected_sales_volume_export_settings_en = {

        hideSubHeader: true,

        noDataMessage: "No Export Volume Found",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false
        },

        columns: {
          Region: {
            title: "Region",
            type: "text"
          },
          Export: {
            title: "Quantity",
            type: "number"
          }
        }

      };

      var expected_sales_volume_export_settings_ar = {

        hideSubHeader: true,

        noDataMessage: "لم يتم العثور على حجم التصدير",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false
        },

        columns: {
          Region: {
            title: "منطقة",
            type: "text"
          },
          Export: {
            title: "كمية",
            type: "number"
          }
        }

      };

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewExpectedSalesVolume'),

        method: "view",

        inputs: [
          {
            id: "Year",
            name: this.translate.instant('MARKETING_INFORMATION.Year'),
            type: "text",
            value: event.data.Year,
            required: "true",
            visible: true
          },
          {
            id: "Local",
            name: this.translate.instant('MARKETING_INFORMATION.Local'),
            type: "text",
            value: event.data.Local,
            required: "true",
            visible: true
          },
          {
            id: "Export",
            type: "table",
            heading: this.translate.instant('MARKETING_INFORMATION.Export'),
            settings: this.lang == 'en' ? expected_sales_volume_export_settings_en : expected_sales_volume_export_settings_ar,
            source: expected_sales_volume_export_source,
            required: "false",
            visible: true
          },
          {
            id: "TotalExport",
            name: this.translate.instant('MARKETING_INFORMATION.TotalExport'),
            type: "text",
            value: event.data.TotalExport ? event.data.TotalExport : "0",
            required: "true",
            visible: true
          },
          {
            id: "Value",
            name: this.translate.instant('MARKETING_INFORMATION.Total'),
            type: "text",
            value: event.data.Value,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'Clients') {

      var temp_documents = { url: "", documentList: [], method: "" };

      temp_documents.method = "view";

      temp_documents.url = this.clientsTableDocuments.url;

      for (var i = 0; i < this.clientsTableDocuments.documentList.length; i++)
        if (parseInt(this.clientsTableDocuments.documentList[i].RelatedEntityId) ==
          parseInt(event.data.GuiId))
          temp_documents.documentList.push(this.clientsTableDocuments.documentList[i]);

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewTargetedEndUsers'),

        method: "view",

        documents: temp_documents,

        inputs: [
          {
            id: "Year",
            name: this.translate.instant('MARKETING_INFORMATION.Year'),
            type: "text",
            value: event.data.Year,
            required: "true",
            visible: true
          },
          {
            id: "ClientName",
            name: this.translate.instant('MARKETING_INFORMATION.EndUserName'),
            type: "text",
            value: event.data.ClientName,
            required: "true",
            visible: true
          },
          {
            id: "ClientLocation",
            name: this.translate.instant('MARKETING_INFORMATION.EndUserLocation'),
            type: "text",
            value: event.data.ClientLocation,
            required: "true",
            visible: true
          },
          {
            id: "ConsumptionQuantity",
            name: this.translate.instant('MARKETING_INFORMATION.ConsumptionQuantity'),
            type: "text",
            value: event.data.ConsumptionQuantity,
            required: "true",
            visible: true
          },
          {
            id: "ConsumptionUOM",
            name: this.translate.instant('MARKETING_INFORMATION.ConsumptionUnitofMeasure'),
            type: "text",
            value: event.data.ConsumptionUOM,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'ProposedSellingPrice') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewSponsorProposedPrice'),

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "text",
            value: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "text",
            value: event.data.Region,
            required: "true",
            visible: event.data.Type == "Local" ? false : true
          },
          {
            id: "MarketType",
            name: this.translate.instant('MARKETING_INFORMATION.MarketType'),
            type: "text",
            value: event.data.MarketType,
            required: "true",
            visible: true
          },
          {
            id: "ProposedPrice",
            name: this.translate.instant('MARKETING_INFORMATION.ProposedPrice'),
            type: "text",
            value: event.data.ProposedPrice,
            required: "true",
            visible: true
          },
          {
            id: "ProposedPriceUOM",
            name: this.translate.instant('MARKETING_INFORMATION.ProposedPriceUnitofMeasure'),
            type: "text",
            value: event.data.ProposedPriceUOM,
            required: "true",
            visible: true
          },
          {
            id: "CompetitorPrice",
            name: this.translate.instant('MARKETING_INFORMATION.CompetitorPriceRange'),
            type: "text",
            value: event.data.CompetitorPrice,
            required: "true",
            visible: true
          },
          {
            id: "CompetitorPriceUOM",
            name: this.translate.instant('MARKETING_INFORMATION.CompetitorPriceRangeUnitofMeasure'),
            type: "text",
            value: event.data.CompetitorPriceUOM,
            required: "true",
            visible: true
          },
          {
            id: "ImporterPrice",
            name: this.translate.instant('MARKETING_INFORMATION.ImporterPriceRange'),
            type: "text",
            value: event.data.ImporterPrice,
            required: "true",
            visible: true
          },
          {
            id: "ImporterPriceUOM",
            name: this.translate.instant('MARKETING_INFORMATION.ImporterPriceRangeUnitofMeasure'),
            type: "text",
            value: event.data.ImporterPriceUOM,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'MajorCompetitor') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewMajorCompetitorMarketShare'),

        method: "view",

        inputs: [
          {
            id: "Type",
            name: this.translate.instant('MARKETING_INFORMATION.TargetMarket'),
            type: "text",
            value: event.data.Type,
            required: "true",
            visible: true
          },
          {
            id: "Region",
            name: this.translate.instant('MARKETING_INFORMATION.RegionOrCountries'),
            type: "text",
            value: event.data.Region,
            required: "true",
            visible: event.data.Type == "Local" ? false : true
          },
          {
            id: "CompetitorName",
            name: this.translate.instant('MARKETING_INFORMATION.CompetitorName'),
            type: "text",
            value: event.data.CompetitorName,
            required: "true",
            visible: true
          },
          {
            id: "MarketShare",
            name: this.translate.instant('MARKETING_INFORMATION.MarketSharePercentage'),
            type: "text",
            value: event.data.MarketShare,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'ManufacturingStages') {

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewManufacturingStages'),

        method: "view",

        inputs: [
          {
            id: "StageSequence",
            name: this.translate.instant('MARKETING_INFORMATION.StageSequence'),
            type: "text",
            value: event.data.StageSequence,
            required: "true",
            visible: true
          },
          {
            id: "MachineId",
            name: this.translate.instant('MARKETING_INFORMATION.MachineId'),
            type: "text",
            value: event.data.MachineId,
            required: "true",
            visible: true
          },
          {
            id: "MachineName",
            name: this.translate.instant('MARKETING_INFORMATION.MachineName'),
            type: "text",
            value: event.data.MachineName,
            required: "true",
            visible: true
          },
          {
            id: "Operators",
            name: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
            type: "text",
            value: event.data.Operators,
            required: "true",
            visible: true
          },
          {
            id: "ProductionRate",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionRate'),
            type: "text",
            value: event.data.ProductionRate,
            required: "true",
          },
          {
            id: "ProductionUom",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
            type: "text",
            value: event.data.ProductionUom,
            required: "true",
            visible: true
          },
          {
            id: "StageName",
            name: this.translate.instant('MARKETING_INFORMATION.StageName'),
            type: "text",
            value: event.data.StageName,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    else if (table_name === 'ProductionLines') {

      var Product_Production_Lines_Section_source: LocalDataSource;

      Product_Production_Lines_Section_source = new LocalDataSource();

      Product_Production_Lines_Section_source.load(event.data.ProductProductionLinesSection);

      var Product_Production_Lines_Section_settings_en = {

        hideSubHeader: true,

        noDataMessage: "No Product Production Lines Section Found",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false,
        },

        columns: {

          Description: {
            title: "Description",
            type: "text"
          },
          Rate: {
            title: "Rate",
            type: "number"
          },
          RateUnit: {
            title: "Rate Unit of Measure",
            type: "number"
          },
          MeasurementUnit: {
            title: "Measurement Unit of Measure",
            type: "text"
          },
          ShifHours: {
            title: "Shift Hours",
            type: "number"
          },
          ShiftPerDay: {
            title: "Shift Per Day",
            type: "number"
          },
          DaysPerYear: {
            title: 'Days Per Year',
            type: 'number'
          },
          PercentageEfficiency: {
            title: 'Percentage Efficiency',
            type: 'number'
          }
        }
      };

      var Product_Production_Lines_Section_settings_ar = {

        hideSubHeader: true,

        noDataMessage: "لم يتم العثور على قسم خطوط إنتاج المنتجات",

        actions: {
          position: "right",
          add: false,
          edit: false,
          delete: false,
        },

        columns: {

          Description: {
            title: "وصف",
            type: "text"
          },
          Rate: {
            title: "معدل",
            type: "number"
          },
          RateUnit: {
            title: "وحدة قياس القياسات",
            type: "number"
          },
          MeasurementUnit: {
            title: "وحدة قياس القياس",
            type: "text"
          },
          ShifHours: {
            title: "ساعات التحول",
            type: "number"
          },
          ShiftPerDay: {
            title: "تحول في اليوم",
            type: "number"
          },
          DaysPerYear: {
            title: 'أيام في السنة',
            type: 'number'
          },
          PercentageEfficiency: {
            title: 'نسبة النسبة',
            type: 'number'
          }
        }
      };

      marketingInformationModalParams = {

        header: this.translate.instant('MARKETING_INFORMATION.ViewProductionLines'),

        tables: [
          {
            heading: this.translate.instant('MARKETING_INFORMATION.ProductProductionLinesSection'),
            settings: this.lang == 'en' ? Product_Production_Lines_Section_settings_en : Product_Production_Lines_Section_settings_ar,
            source: Product_Production_Lines_Section_source,
            required: "true",
            visible: true
          }
        ],

        method: "view",

        inputs: [
          {
            id: "ProductionLinesDesc",
            name: this.translate.instant('MARKETING_INFORMATION.ProductionLinesDescription'),
            type: "text",
            value: event.data.ProductionLinesDesc,
            required: "true",
            visible: true
          }
        ],
        buttons: []
      };

    }

    let marketingInformationModal = this.modalService.open(MarketingInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    marketingInformationModal.componentInstance.MarketingInformationModalsForm = marketingInformationModalParams;

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

          if (resolvedCommentArray["RecReqSection"][i].ReqSec == "LONMI" && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

            if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIPRO") {

              this.product_details_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.product_details_comments.SectionCode, ReqSubSec: this.product_details_comments.SubSectionCode });

              this.product_details_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.product_details_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.product_details_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.product_details_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.product_details_comments.commentDetails["DeadLineDate"] = this.product_details_comments.commentArray[0]["DeadLineDate"];
              this.product_details_comments.commentDetails["GuiId"] = this.product_details_comments.commentArray[0]["GuiId"];
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

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MISPO") {

              this.sponsor_product_sales__comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.sponsor_product_sales__comments.SectionCode, ReqSubSec: this.sponsor_product_sales__comments.SubSectionCode });

              this.sponsor_product_sales__comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.sponsor_product_sales__comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.sponsor_product_sales__comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.sponsor_product_sales__comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.sponsor_product_sales__comments.commentDetails["DeadLineDate"] = this.sponsor_product_sales__comments.commentArray[0]["DeadLineDate"];
              this.sponsor_product_sales__comments.commentDetails["GuiId"] = this.sponsor_product_sales__comments.commentArray[0]["GuiId"];
              this.sponsor_product_sales__comments.commentDetails["ReqSec"] = this.sponsor_product_sales__comments.commentArray[0]["ReqSec"];
              this.sponsor_product_sales__comments.commentDetails["ReqSecDesc"] = this.sponsor_product_sales__comments.commentArray[0]["ReqSecDesc"];
              this.sponsor_product_sales__comments.commentDetails["ReqStatus"] = this.sponsor_product_sales__comments.commentArray[0]["ReqStatus"];
              this.sponsor_product_sales__comments.commentDetails["ReqStatusDesc"] = this.sponsor_product_sales__comments.commentArray[0]["ReqStatusDesc"];
              this.sponsor_product_sales__comments.commentDetails["ReqSubSec"] = this.sponsor_product_sales__comments.commentArray[0]["ReqSubSec"];
              this.sponsor_product_sales__comments.commentDetails["ReqSubSecDesc"] = this.sponsor_product_sales__comments.commentArray[0]["ReqSubSecDesc"];
              this.sponsor_product_sales__comments.commentDetails["SectionId"] = this.sponsor_product_sales__comments.commentArray[0]["SectionId"];

              var openComments = this.sponsor_product_sales__comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.sponsor_product_sales__comments.anyOpenComments = true;
              else
                this.sponsor_product_sales__comments.anyOpenComments = false;

              this.sponsor_product_sales__comments.commentArray = this.sponsor_product_sales__comments.commentArray[0]["RecReqComment"];

              this.sponsor_product_sales__comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MITAR") {

              this.target_market_region_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.target_market_region_comments.SectionCode, ReqSubSec: this.target_market_region_comments.SubSectionCode });

              this.target_market_region_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.target_market_region_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.target_market_region_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.target_market_region_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"]; this.target_market_region_comments.commentDetails["DeadLineDate"] = this.target_market_region_comments.commentArray[0]["DeadLineDate"];
              this.target_market_region_comments.commentDetails["GuiId"] = this.target_market_region_comments.commentArray[0]["GuiId"];
              this.target_market_region_comments.commentDetails["ReqSec"] = this.target_market_region_comments.commentArray[0]["ReqSec"];
              this.target_market_region_comments.commentDetails["ReqSecDesc"] = this.target_market_region_comments.commentArray[0]["ReqSecDesc"];
              this.target_market_region_comments.commentDetails["ReqStatus"] = this.target_market_region_comments.commentArray[0]["ReqStatus"];
              this.target_market_region_comments.commentDetails["ReqStatusDesc"] = this.target_market_region_comments.commentArray[0]["ReqStatusDesc"];
              this.target_market_region_comments.commentDetails["ReqSubSec"] = this.target_market_region_comments.commentArray[0]["ReqSubSec"];
              this.target_market_region_comments.commentDetails["ReqSubSecDesc"] = this.target_market_region_comments.commentArray[0]["ReqSubSecDesc"];
              this.target_market_region_comments.commentDetails["SectionId"] = this.target_market_region_comments.commentArray[0]["SectionId"];

              var openComments = this.target_market_region_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.target_market_region_comments.anyOpenComments = true;
              else
                this.target_market_region_comments.anyOpenComments = false;

              this.target_market_region_comments.commentArray = this.target_market_region_comments.commentArray[0]["RecReqComment"];

              this.target_market_region_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MITMS") {

              this.target_market_segments_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.target_market_segments_comments.SectionCode, ReqSubSec: this.target_market_segments_comments.SubSectionCode });

              this.target_market_segments_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.target_market_segments_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.target_market_segments_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.target_market_segments_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.target_market_segments_comments.commentDetails["DeadLineDate"] = this.target_market_segments_comments.commentArray[0]["DeadLineDate"];
              this.target_market_segments_comments.commentDetails["GuiId"] = this.target_market_segments_comments.commentArray[0]["GuiId"];
              this.target_market_segments_comments.commentDetails["ReqSec"] = this.target_market_segments_comments.commentArray[0]["ReqSec"];
              this.target_market_segments_comments.commentDetails["ReqSecDesc"] = this.target_market_segments_comments.commentArray[0]["ReqSecDesc"];
              this.target_market_segments_comments.commentDetails["ReqStatus"] = this.target_market_segments_comments.commentArray[0]["ReqStatus"];
              this.target_market_segments_comments.commentDetails["ReqStatusDesc"] = this.target_market_segments_comments.commentArray[0]["ReqStatusDesc"];
              this.target_market_segments_comments.commentDetails["ReqSubSec"] = this.target_market_segments_comments.commentArray[0]["ReqSubSec"];
              this.target_market_segments_comments.commentDetails["ReqSubSecDesc"] = this.target_market_segments_comments.commentArray[0]["ReqSubSecDesc"];
              this.target_market_segments_comments.commentDetails["SectionId"] = this.target_market_segments_comments.commentArray[0]["SectionId"];

              var openComments = this.target_market_segments_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.target_market_segments_comments.anyOpenComments = true;
              else
                this.target_market_segments_comments.anyOpenComments = false;

              this.target_market_segments_comments.commentArray = this.target_market_segments_comments.commentArray[0]["RecReqComment"];

              this.target_market_segments_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIFAC") {

              this.factories_target_market_region_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.factories_target_market_region_comments.SectionCode, ReqSubSec: this.factories_target_market_region_comments.SubSectionCode });

              this.factories_target_market_region_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.factories_target_market_region_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.factories_target_market_region_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.factories_target_market_region_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"]; this.factories_target_market_region_comments.commentDetails["DeadLineDate"] = this.factories_target_market_region_comments.commentArray[0]["DeadLineDate"];
              this.factories_target_market_region_comments.commentDetails["GuiId"] = this.factories_target_market_region_comments.commentArray[0]["GuiId"];
              this.factories_target_market_region_comments.commentDetails["ReqSec"] = this.factories_target_market_region_comments.commentArray[0]["ReqSec"];
              this.factories_target_market_region_comments.commentDetails["ReqSecDesc"] = this.factories_target_market_region_comments.commentArray[0]["ReqSecDesc"];
              this.factories_target_market_region_comments.commentDetails["ReqStatus"] = this.factories_target_market_region_comments.commentArray[0]["ReqStatus"];
              this.factories_target_market_region_comments.commentDetails["ReqStatusDesc"] = this.factories_target_market_region_comments.commentArray[0]["ReqStatusDesc"];
              this.factories_target_market_region_comments.commentDetails["ReqSubSec"] = this.factories_target_market_region_comments.commentArray[0]["ReqSubSec"];
              this.factories_target_market_region_comments.commentDetails["ReqSubSecDesc"] = this.factories_target_market_region_comments.commentArray[0]["ReqSubSecDesc"];
              this.factories_target_market_region_comments.commentDetails["SectionId"] = this.factories_target_market_region_comments.commentArray[0]["SectionId"];

              var openComments = this.factories_target_market_region_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.factories_target_market_region_comments.anyOpenComments = true;
              else
                this.factories_target_market_region_comments.anyOpenComments = false;

              this.factories_target_market_region_comments.commentArray = this.factories_target_market_region_comments.commentArray[0]["RecReqComment"];

              this.factories_target_market_region_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIIMP") {

              this.import_competitors_market_region_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.import_competitors_market_region_comments.SectionCode, ReqSubSec: this.import_competitors_market_region_comments.SubSectionCode });

              this.import_competitors_market_region_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.import_competitors_market_region_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.import_competitors_market_region_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.import_competitors_market_region_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.import_competitors_market_region_comments.commentDetails["DeadLineDate"] = this.import_competitors_market_region_comments.commentArray[0]["DeadLineDate"];
              this.import_competitors_market_region_comments.commentDetails["GuiId"] = this.import_competitors_market_region_comments.commentArray[0]["GuiId"];
              this.import_competitors_market_region_comments.commentDetails["ReqSec"] = this.import_competitors_market_region_comments.commentArray[0]["ReqSec"];
              this.import_competitors_market_region_comments.commentDetails["ReqSecDesc"] = this.import_competitors_market_region_comments.commentArray[0]["ReqSecDesc"];
              this.import_competitors_market_region_comments.commentDetails["ReqStatus"] = this.import_competitors_market_region_comments.commentArray[0]["ReqStatus"];
              this.import_competitors_market_region_comments.commentDetails["ReqStatusDesc"] = this.import_competitors_market_region_comments.commentArray[0]["ReqStatusDesc"];
              this.import_competitors_market_region_comments.commentDetails["ReqSubSec"] = this.import_competitors_market_region_comments.commentArray[0]["ReqSubSec"];
              this.import_competitors_market_region_comments.commentDetails["ReqSubSecDesc"] = this.import_competitors_market_region_comments.commentArray[0]["ReqSubSecDesc"];
              this.import_competitors_market_region_comments.commentDetails["SectionId"] = this.import_competitors_market_region_comments.commentArray[0]["SectionId"];

              var openComments = this.import_competitors_market_region_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.import_competitors_market_region_comments.anyOpenComments = true;
              else
                this.import_competitors_market_region_comments.anyOpenComments = false;

              this.import_competitors_market_region_comments.commentArray = this.import_competitors_market_region_comments.commentArray[0]["RecReqComment"];

              this.import_competitors_market_region_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIPDE") {

              this.historical_product_demand_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.historical_product_demand_comments.SectionCode, ReqSubSec: this.historical_product_demand_comments.SubSectionCode });

              this.historical_product_demand_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.historical_product_demand_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.historical_product_demand_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.historical_product_demand_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.historical_product_demand_comments.commentDetails["DeadLineDate"] = this.historical_product_demand_comments.commentArray[0]["DeadLineDate"];
              this.historical_product_demand_comments.commentDetails["GuiId"] = this.historical_product_demand_comments.commentArray[0]["GuiId"];
              this.historical_product_demand_comments.commentDetails["ReqSec"] = this.historical_product_demand_comments.commentArray[0]["ReqSec"];
              this.historical_product_demand_comments.commentDetails["ReqSecDesc"] = this.historical_product_demand_comments.commentArray[0]["ReqSecDesc"];
              this.historical_product_demand_comments.commentDetails["ReqStatus"] = this.historical_product_demand_comments.commentArray[0]["ReqStatus"];
              this.historical_product_demand_comments.commentDetails["ReqStatusDesc"] = this.historical_product_demand_comments.commentArray[0]["ReqStatusDesc"];
              this.historical_product_demand_comments.commentDetails["ReqSubSec"] = this.historical_product_demand_comments.commentArray[0]["ReqSubSec"];
              this.historical_product_demand_comments.commentDetails["ReqSubSecDesc"] = this.historical_product_demand_comments.commentArray[0]["ReqSubSecDesc"];
              this.historical_product_demand_comments.commentDetails["SectionId"] = this.historical_product_demand_comments.commentArray[0]["SectionId"];

              var openComments = this.historical_product_demand_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.historical_product_demand_comments.anyOpenComments = true;
              else
                this.historical_product_demand_comments.anyOpenComments = false;

              this.historical_product_demand_comments.commentArray = this.historical_product_demand_comments.commentArray[0]["RecReqComment"];

              this.historical_product_demand_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIEXS") {

              this.expected_sales_volume_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.expected_sales_volume_comments.SectionCode, ReqSubSec: this.expected_sales_volume_comments.SubSectionCode });

              this.expected_sales_volume_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.expected_sales_volume_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.expected_sales_volume_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.expected_sales_volume_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.expected_sales_volume_comments.commentDetails["DeadLineDate"] = this.expected_sales_volume_comments.commentArray[0]["DeadLineDate"];
              this.expected_sales_volume_comments.commentDetails["GuiId"] = this.expected_sales_volume_comments.commentArray[0]["GuiId"];
              this.expected_sales_volume_comments.commentDetails["ReqSec"] = this.expected_sales_volume_comments.commentArray[0]["ReqSec"];
              this.expected_sales_volume_comments.commentDetails["ReqSecDesc"] = this.expected_sales_volume_comments.commentArray[0]["ReqSecDesc"];
              this.expected_sales_volume_comments.commentDetails["ReqStatus"] = this.expected_sales_volume_comments.commentArray[0]["ReqStatus"];
              this.expected_sales_volume_comments.commentDetails["ReqStatusDesc"] = this.expected_sales_volume_comments.commentArray[0]["ReqStatusDesc"];
              this.expected_sales_volume_comments.commentDetails["ReqSubSec"] = this.expected_sales_volume_comments.commentArray[0]["ReqSubSec"];
              this.expected_sales_volume_comments.commentDetails["ReqSubSecDesc"] = this.expected_sales_volume_comments.commentArray[0]["ReqSubSecDesc"];
              this.expected_sales_volume_comments.commentDetails["SectionId"] = this.expected_sales_volume_comments.commentArray[0]["SectionId"];

              var openComments = this.expected_sales_volume_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.expected_sales_volume_comments.anyOpenComments = true;
              else
                this.expected_sales_volume_comments.anyOpenComments = false;

              this.expected_sales_volume_comments.commentArray = this.expected_sales_volume_comments.commentArray[0]["RecReqComment"];

              this.expected_sales_volume_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIENU") {

              this.targeted_end_users_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.targeted_end_users_comments.SectionCode, ReqSubSec: this.targeted_end_users_comments.SubSectionCode });

              this.targeted_end_users_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.targeted_end_users_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.targeted_end_users_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.targeted_end_users_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.targeted_end_users_comments.commentDetails["DeadLineDate"] = this.targeted_end_users_comments.commentArray[0]["DeadLineDate"];
              this.targeted_end_users_comments.commentDetails["GuiId"] = this.targeted_end_users_comments.commentArray[0]["GuiId"];
              this.targeted_end_users_comments.commentDetails["ReqSec"] = this.targeted_end_users_comments.commentArray[0]["ReqSec"];
              this.targeted_end_users_comments.commentDetails["ReqSecDesc"] = this.targeted_end_users_comments.commentArray[0]["ReqSecDesc"];
              this.targeted_end_users_comments.commentDetails["ReqStatus"] = this.targeted_end_users_comments.commentArray[0]["ReqStatus"];
              this.targeted_end_users_comments.commentDetails["ReqStatusDesc"] = this.targeted_end_users_comments.commentArray[0]["ReqStatusDesc"];
              this.targeted_end_users_comments.commentDetails["ReqSubSec"] = this.targeted_end_users_comments.commentArray[0]["ReqSubSec"];
              this.targeted_end_users_comments.commentDetails["ReqSubSecDesc"] = this.targeted_end_users_comments.commentArray[0]["ReqSubSecDesc"];
              this.targeted_end_users_comments.commentDetails["SectionId"] = this.targeted_end_users_comments.commentArray[0]["SectionId"];

              var openComments = this.targeted_end_users_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.targeted_end_users_comments.anyOpenComments = true;
              else
                this.targeted_end_users_comments.anyOpenComments = false;

              this.targeted_end_users_comments.commentArray = this.targeted_end_users_comments.commentArray[0]["RecReqComment"];

              this.targeted_end_users_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIPRI") {

              this.sponsor_proposed_price_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.sponsor_proposed_price_comments.SectionCode, ReqSubSec: this.sponsor_proposed_price_comments.SubSectionCode });

              this.sponsor_proposed_price_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.sponsor_proposed_price_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.sponsor_proposed_price_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.sponsor_proposed_price_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.sponsor_proposed_price_comments.commentDetails["DeadLineDate"] = this.sponsor_proposed_price_comments.commentArray[0]["DeadLineDate"];
              this.sponsor_proposed_price_comments.commentDetails["GuiId"] = this.sponsor_proposed_price_comments.commentArray[0]["GuiId"];
              this.sponsor_proposed_price_comments.commentDetails["ReqSec"] = this.sponsor_proposed_price_comments.commentArray[0]["ReqSec"];
              this.sponsor_proposed_price_comments.commentDetails["ReqSecDesc"] = this.sponsor_proposed_price_comments.commentArray[0]["ReqSecDesc"];
              this.sponsor_proposed_price_comments.commentDetails["ReqStatus"] = this.sponsor_proposed_price_comments.commentArray[0]["ReqStatus"];
              this.sponsor_proposed_price_comments.commentDetails["ReqStatusDesc"] = this.sponsor_proposed_price_comments.commentArray[0]["ReqStatusDesc"];
              this.sponsor_proposed_price_comments.commentDetails["ReqSubSec"] = this.sponsor_proposed_price_comments.commentArray[0]["ReqSubSec"];
              this.sponsor_proposed_price_comments.commentDetails["ReqSubSecDesc"] = this.sponsor_proposed_price_comments.commentArray[0]["ReqSubSecDesc"];
              this.sponsor_proposed_price_comments.commentDetails["SectionId"] = this.sponsor_proposed_price_comments.commentArray[0]["SectionId"];

              var openComments = this.sponsor_proposed_price_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.sponsor_proposed_price_comments.anyOpenComments = true;
              else
                this.sponsor_proposed_price_comments.anyOpenComments = false;

              this.sponsor_proposed_price_comments.commentArray = this.sponsor_proposed_price_comments.commentArray[0]["RecReqComment"];

              this.sponsor_proposed_price_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MICOM") {

              this.major_competitor_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.major_competitor_comments.SectionCode, ReqSubSec: this.major_competitor_comments.SubSectionCode });

              this.major_competitor_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.major_competitor_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.major_competitor_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.major_competitor_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.major_competitor_comments.commentDetails["DeadLineDate"] = this.major_competitor_comments.commentArray[0]["DeadLineDate"];
              this.major_competitor_comments.commentDetails["GuiId"] = this.major_competitor_comments.commentArray[0]["GuiId"];
              this.major_competitor_comments.commentDetails["ReqSec"] = this.major_competitor_comments.commentArray[0]["ReqSec"];
              this.major_competitor_comments.commentDetails["ReqSecDesc"] = this.major_competitor_comments.commentArray[0]["ReqSecDesc"];
              this.major_competitor_comments.commentDetails["ReqStatus"] = this.major_competitor_comments.commentArray[0]["ReqStatus"];
              this.major_competitor_comments.commentDetails["ReqStatusDesc"] = this.major_competitor_comments.commentArray[0]["ReqStatusDesc"];
              this.major_competitor_comments.commentDetails["ReqSubSec"] = this.major_competitor_comments.commentArray[0]["ReqSubSec"];
              this.major_competitor_comments.commentDetails["ReqSubSecDesc"] = this.major_competitor_comments.commentArray[0]["ReqSubSecDesc"];
              this.major_competitor_comments.commentDetails["SectionId"] = this.major_competitor_comments.commentArray[0]["SectionId"];

              var openComments = this.major_competitor_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.major_competitor_comments.anyOpenComments = true;
              else
                this.major_competitor_comments.anyOpenComments = false;

              this.major_competitor_comments.commentArray = this.major_competitor_comments.commentArray[0]["RecReqComment"];

              this.major_competitor_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "MIDIS") {

              this.distribution_and_marketing_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.distribution_and_marketing_comments.SectionCode, ReqSubSec: this.distribution_and_marketing_comments.SubSectionCode });

              this.distribution_and_marketing_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.distribution_and_marketing_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.distribution_and_marketing_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.distribution_and_marketing_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.distribution_and_marketing_comments.commentDetails["DeadLineDate"] = this.distribution_and_marketing_comments.commentArray[0]["DeadLineDate"];
              this.distribution_and_marketing_comments.commentDetails["GuiId"] = this.distribution_and_marketing_comments.commentArray[0]["GuiId"];
              this.distribution_and_marketing_comments.commentDetails["ReqSec"] = this.distribution_and_marketing_comments.commentArray[0]["ReqSec"];
              this.distribution_and_marketing_comments.commentDetails["ReqSecDesc"] = this.distribution_and_marketing_comments.commentArray[0]["ReqSecDesc"];
              this.distribution_and_marketing_comments.commentDetails["ReqStatus"] = this.distribution_and_marketing_comments.commentArray[0]["ReqStatus"];
              this.distribution_and_marketing_comments.commentDetails["ReqStatusDesc"] = this.distribution_and_marketing_comments.commentArray[0]["ReqStatusDesc"];
              this.distribution_and_marketing_comments.commentDetails["ReqSubSec"] = this.distribution_and_marketing_comments.commentArray[0]["ReqSubSec"];
              this.distribution_and_marketing_comments.commentDetails["ReqSubSecDesc"] = this.distribution_and_marketing_comments.commentArray[0]["ReqSubSecDesc"];
              this.distribution_and_marketing_comments.commentDetails["SectionId"] = this.distribution_and_marketing_comments.commentArray[0]["SectionId"];

              var openComments = this.distribution_and_marketing_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.distribution_and_marketing_comments.anyOpenComments = true;
              else
                this.distribution_and_marketing_comments.anyOpenComments = false;

              this.distribution_and_marketing_comments.commentArray = this.distribution_and_marketing_comments.commentArray[0]["RecReqComment"];

              this.distribution_and_marketing_comments.hasComments = true;

            }

          }

        }
        if (this.statusCode == 'Q') {
          this.setEditableSectionsBasedOnCommunication();
          this.comments_show = true;
          this.add_edit_delete_show = false;
        }
  
        else
          this.comments_show = false;
      this.commonService.showSuccessToast(this.translate.instant('MARKETING_INFORMATION.PDTMKTRetrieved'));
      this.spinnerService.hide();

    }

    catch (err) {
      this.spinnerService.hide();
      this.resolveError();
    }

  }

  onSaveAsDraft() {

    var product_sales_temp_source = [];
    var target_market_temp_source = [];
    var target_market_region_temp_source = [];
    var local_competitors_temp_source = [];
    var import_competitors_temp_source = [];
    var product_demand_temp_source = [];
    var expected_sales_temp_source = [];
    var clients_temp_source = [];
    var proposed_selling_price_temp_source = [];
    var major_competitors_temp_source = [];
    var manufacturing_stages_temp_source = [];
    var production_lines_temp_source = [];

    this.product_sales_source.getAll().then((res) => {

      product_sales_temp_source = res;

      this.target_market_source.getAll().then((res) => {

        target_market_temp_source = res;

        this.target_market_region_source.getAll().then((res) => {

          target_market_region_temp_source = res;

          this.local_competitors_source.getAll().then((res) => {

            local_competitors_temp_source = res;

            this.import_competitors_source.getAll().then((res) => {

              import_competitors_temp_source = res;

              this.product_demand_source.getAll().then((res) => {

                product_demand_temp_source = res;

                this.expected_sales_source.getAll().then((res) => {

                  expected_sales_temp_source = res;

                  this.clients_source.getAll().then((res) => {

                    clients_temp_source = res;

                    this.proposed_selling_price_source.getAll().then((res) => {

                      proposed_selling_price_temp_source = res;

                      this.major_competitors_source.getAll().then((res) => {

                        major_competitors_temp_source = res;

                        this.manufacturing_stages_source.getAll().then((res) => {

                          manufacturing_stages_temp_source = res;

                          this.production_lines_source.getAll().then((res) => {

                            production_lines_temp_source = res;


                            var indicator = "X";


                            if (this.inputs.Description == "" || !this.inputs.Description)
                              this.Description_vs = true;

                            else
                              this.Description_vs = false;

                            if (this.inputs.User == "" || !this.inputs.User)
                              this.Applications_vs = true;

                            else
                              this.Applications_vs = false;

                            if (this.inputs.Users == "" || !this.inputs.Users)
                              this.Users_vs = true;

                            else
                              this.Users_vs = false;

                            if (this.inputs.Substitutes == "" || !this.inputs.Substitutes)
                              this.Substitutes_vs = true;

                            else
                              this.Substitutes_vs = false;

                            // if (this.inputs.Weight == "" || !this.inputs.Weight)
                            //   this.Weight_vs = true;

                            // else
                            //   this.Weight_vs = false;

                            // if (this.inputs.WeightUnit == "" || !this.inputs.WeightUnit)
                            //   this.WeightUnit_vs = true;

                            // else
                            //   this.WeightUnit_vs = false;

                            // if (this.inputs.Size == "" || !this.inputs.Size)
                            //   this.Size_vs = true;

                            // else
                            //   this.Size_vs = false;

                            // if (this.inputs.SizeUnit == "" || !this.inputs.SizeUnit)
                            //   this.SizeUnit_vs = true;

                            // else
                            //   this.SizeUnit_vs = false;

                            // else if (this.inputs.ShelfLife == "" || !this.inputs.ShelfLife)
                            //   this.commonService.showFailureToast("Enter the Shelf Life !");

                            // else if (this.inputs.ShelfLifeUnit == "" || !this.inputs.ShelfLifeUnit)
                            //   this.commonService.showFailureToast("Select the Shelf Life Unit of Measure !");

                            // else if (this.inputs.Brand == "" || !this.inputs.Brand)
                            //   this.commonService.showFailureToast("Enter the Brand Name !");

                            //ADDED BY JAI

                            if (this.inputs.AnnualProductionCap == "" || !this.inputs.AnnualProductionCap)
                              this.AnnualProductionCap_vs = true;

                            else
                              this.AnnualProductionCap_vs = false;

                            if (this.inputs.AnnualPrdCapUOM == "" || !this.inputs.AnnualPrdCapUOM)
                              this.AnnualPrdCapUOM_vs = true;

                            else
                              this.AnnualPrdCapUOM_vs = false;

                            // else if (this.inputs.LicensedProductionCap == "" || !this.inputs.LicensedProductionCap)
                            //   this.commonService.showFailureToast("Enter the Licensed Production Capacity !");

                            if (this.inputs.CommercialProjYear == "" || !this.inputs.CommercialProjYear)
                              this.CommercialProjYear_vs = true;

                            else
                              this.CommercialProjYear_vs = false;

                            if (this.inputs.NumberOfClients == "" || !this.inputs.NumberOfClients)
                              this.NumberOfClients_vs = true;

                            else
                              this.NumberOfClients_vs = false;

                            if (this.productBrochuresDocuments.documentList.length == 0 && this.productBrochuresFileLength == 0)
                              this.ProductBrochures_vs = true;

                            else
                              this.ProductBrochures_vs = false;


                            if (this.panelsVisible[0].visible == true && (this.Description_vs || this.Applications_vs || this.Users_vs || this.Substitutes_vs ||
                              // this.Weight_vs || this.WeightUnit_vs || this.Size_vs || this.SizeUnit_vs ||
                              this.AnnualProductionCap_vs || this.AnnualPrdCapUOM_vs || this.CommercialProjYear_vs ||
                              this.NumberOfClients_vs || this.ProductBrochures_vs)) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.MandatoryPDTDetails'));
                              this.panelStep = 1;

                            }

                            else if (this.panelsVisible[0].visible == true && this.inputs.CommercialProjYear.toString().length != 4) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYearInPDTDetails'));
                              this.CommercialProjYear_vs = true;
                              this.panelStep = 1;

                            }

                            // else if (this.inputs.FactorsAffectingDemand == "" || !this.inputs.FactorsAffectingDemand) {

                            //   this.commonService.showFailureToast("Enter the Factors affecting Future Demand / Growth Rate Percentage !");
                            //   this.FactorsAffectingDemand_vs = true;

                            // }

                            // else if (this.inputs.ExpectedSalesDocumentsFlag && this.expectedSalesDocuments.documentList.length == 0 && this.expectedSalesFileLength == 0) {

                            //   this.commonService.showFailureToast("Attach the Off-take Agreements / Sales Agreements / MOU's in Sales Forecast !");
                            //   this.ExpectedSalesDocuments_vs = true;

                            // }

                            // else if (this.inputs.ProposedProductAdCampagin == "" || !this.inputs.ProposedProductAdCampagin) {

                            //   this.commonService.showFailureToast("Enter the Distribution and Marketing Activities !");
                            //   this.ProposedProductAdCampaign_vs = true;

                            // }

                            else {

                              var data = {
                                documentDefId: 121,
                                entityId: this.requestId,
                                entityName: "Project",
                                RelatedEntityId: this.inputs.GuiId == "" ? this.commonService.returnRandomNumber() : this.inputs.GuiId,
                                RelatedEntityName: "product",
                                operationType: "l"
                              };

                              var data_es = {
                                documentDefId: 402,
                                entityId: this.requestId,
                                entityName: "Project",
                                RelatedEntityId: this.inputs.GuiId == "" ? this.commonService.returnRandomNumber() : this.inputs.GuiId,
                                RelatedEntityName: "product",
                                operationType: "l"
                              };

                              this.spinnerService.show();

                              if (this.productBrochuresFileLength > 0)
                                this.communicationsService.uploadDocumentService(this.productBrochuresFiles, data)
                                  .then(requests => (this.onProductBrochuresUpload(requests, data.RelatedEntityId,
                                    product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
                                    local_competitors_temp_source, import_competitors_temp_source,
                                    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
                                    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
                                    production_lines_temp_source, indicator)), err => this.resolveError());

                              else if (this.inputs.ExpectedSalesDocumentsFlag && this.expectedSalesFileLength > 0)
                                this.communicationsService.uploadDocumentService(this.expectedSalesFiles, data_es)
                                  .then(requests => (this.onExpectedSalesUpload(requests, data.RelatedEntityId,
                                    product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
                                    local_competitors_temp_source, import_competitors_temp_source,
                                    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
                                    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
                                    production_lines_temp_source, indicator)), err => this.resolveError());

                              else
                                this.onDocumentUploadResolveData(product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
                                  local_competitors_temp_source, import_competitors_temp_source,
                                  product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
                                  proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
                                  production_lines_temp_source, indicator);

                            }

                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  }

  onSave() {

    var product_sales_temp_source = [];
    var target_market_temp_source = [];
    var target_market_region_temp_source = [];
    var local_competitors_temp_source = [];
    var import_competitors_temp_source = [];
    var product_demand_temp_source = [];
    var expected_sales_temp_source = [];
    var clients_temp_source = [];
    var proposed_selling_price_temp_source = [];
    var major_competitors_temp_source = [];
    var manufacturing_stages_temp_source = [];
    var production_lines_temp_source = [];

    this.product_sales_source.getAll().then((res) => {

      product_sales_temp_source = res;

      this.target_market_source.getAll().then((res) => {

        target_market_temp_source = res;

        this.target_market_region_source.getAll().then((res) => {

          target_market_region_temp_source = res;

          this.local_competitors_source.getAll().then((res) => {

            local_competitors_temp_source = res;

            this.import_competitors_source.getAll().then((res) => {

              import_competitors_temp_source = res;

              this.product_demand_source.getAll().then((res) => {

                product_demand_temp_source = res;

                this.expected_sales_source.getAll().then((res) => {

                  expected_sales_temp_source = res;

                  this.clients_source.getAll().then((res) => {

                    clients_temp_source = res;

                    this.proposed_selling_price_source.getAll().then((res) => {

                      proposed_selling_price_temp_source = res;

                      this.major_competitors_source.getAll().then((res) => {

                        major_competitors_temp_source = res;

                        this.manufacturing_stages_source.getAll().then((res) => {

                          manufacturing_stages_temp_source = res;

                          this.production_lines_source.getAll().then((res) => {

                            production_lines_temp_source = res;


                            var indicator = "";


                            if (this.inputs.Description == "" || !this.inputs.Description)
                              this.Description_vs = true;

                            else
                              this.Description_vs = false;

                            if (this.inputs.User == "" || !this.inputs.User)
                              this.Applications_vs = true;

                            else
                              this.Applications_vs = false;

                            if (this.inputs.Users == "" || !this.inputs.Users)
                              this.Users_vs = true;

                            else
                              this.Users_vs = false;

                            if (this.inputs.Substitutes == "" || !this.inputs.Substitutes)
                              this.Substitutes_vs = true;

                            else
                              this.Substitutes_vs = false;

                            // if (this.inputs.Weight == "" || !this.inputs.Weight)
                            //   this.Weight_vs = true;

                            // else
                            //   this.Weight_vs = false;

                            // if (this.inputs.WeightUnit == "" || !this.inputs.WeightUnit)
                            //   this.WeightUnit_vs = true;

                            // else
                            //   this.WeightUnit_vs = false;

                            // if (this.inputs.Size == "" || !this.inputs.Size)
                            //   this.Size_vs = true;

                            // else
                            //   this.Size_vs = false;

                            // if (this.inputs.SizeUnit == "" || !this.inputs.SizeUnit)
                            //   this.SizeUnit_vs = true;

                            // else
                            //   this.SizeUnit_vs = false;

                            // else if (this.inputs.ShelfLife == "" || !this.inputs.ShelfLife)
                            //   this.commonService.showFailureToast("Enter the Shelf Life !");

                            // else if (this.inputs.ShelfLifeUnit == "" || !this.inputs.ShelfLifeUnit)
                            //   this.commonService.showFailureToast("Select the Shelf Life Unit of Measure !");

                            // else if (this.inputs.Brand == "" || !this.inputs.Brand)
                            //   this.commonService.showFailureToast("Enter the Brand Name !");

                            //ADDED BY JAI

                            if (this.inputs.AnnualProductionCap == "" || !this.inputs.AnnualProductionCap)
                              this.AnnualProductionCap_vs = true;

                            else
                              this.AnnualProductionCap_vs = false;

                            if (this.inputs.AnnualPrdCapUOM == "" || !this.inputs.AnnualPrdCapUOM)
                              this.AnnualPrdCapUOM_vs = true;

                            else
                              this.AnnualPrdCapUOM_vs = false;

                            // else if (this.inputs.LicensedProductionCap == "" || !this.inputs.LicensedProductionCap)
                            //   this.commonService.showFailureToast("Enter the Licensed Production Capacity !");

                            if (this.inputs.CommercialProjYear == "" || !this.inputs.CommercialProjYear)
                              this.CommercialProjYear_vs = true;

                            else
                              this.CommercialProjYear_vs = false;

                            if (this.inputs.NumberOfClients == "" || !this.inputs.NumberOfClients)
                              this.NumberOfClients_vs = true;

                            else
                              this.NumberOfClients_vs = false;

                            if (this.productBrochuresDocuments.documentList.length == 0 && this.productBrochuresFileLength == 0)
                              this.ProductBrochures_vs = true;

                            else
                              this.ProductBrochures_vs = false;


                            var product_sales_year_list_and_count = [];

                            for (var i = 0; i < this.year_minus_3_list.length; i++)
                              product_sales_year_list_and_count.push({ year: this.year_minus_3_list[i], count: 0 });

                            for (var i = 0; i < product_sales_temp_source.length; i++)
                              for (var j = 0; j < product_sales_year_list_and_count.length; j++)
                                if (product_sales_temp_source[i].Year == product_sales_year_list_and_count[j].year)
                                  product_sales_year_list_and_count[j].count++;

                            var product_sales_count_flag = 0;

                            for (var i = 0; (i < product_sales_year_list_and_count.length) && (product_sales_count_flag == 0); i++)
                              if (product_sales_year_list_and_count[i].count == 0)
                                product_sales_count_flag = 1;


                            var target_market_percentage = 0, target_market_region_percentage = 0;

                            for (var i = 0; i < target_market_temp_source.length; i++)
                              target_market_percentage += parseFloat(target_market_temp_source[i].Percent);

                            for (var i = 0; i < target_market_region_temp_source.length; i++)
                              target_market_region_percentage += parseFloat(target_market_region_temp_source[i].Percent);


                            var expected_sales_export_volume = 0, target_market_region_export_percentage = 0;

                            var expected_sales_import_volume = 0, target_market_region_import_percentage = 0;

                            var expected_sales_total_volume = 0;

                            var expected_sales_import_percentage = 0, expected_sales_export_percentage = 0;

                            var flag = 0;

                            if (expected_sales_temp_source.length == 0)
                              flag = 1;

                            else {

                              for (var i = 0; (i < this.com_proj_plus_5_list.length) && flag == 0; i++) {

                                for (var j = 0; (j < expected_sales_temp_source.length) && flag == 0; j++)
                                  if (expected_sales_temp_source[j].Year == this.com_proj_plus_5_list[i])
                                    flag = 1;

                                if (flag == 0)
                                  flag = 1;

                                else
                                  flag = 0;

                              }

                            }

                            for (var i = 0; i < target_market_region_temp_source.length; i++)
                              if (target_market_region_temp_source[i].Type == "Local")
                                target_market_region_import_percentage += parseFloat(target_market_region_temp_source[i].Percent);
                              else if (target_market_region_temp_source[i].Type == "Export")
                                target_market_region_export_percentage += parseFloat(target_market_region_temp_source[i].Percent);

                            for (var i = 0; i < expected_sales_temp_source.length; i++) {

                              expected_sales_import_volume += parseFloat(expected_sales_temp_source[i].Local);
                              expected_sales_export_volume += parseFloat(expected_sales_temp_source[i].Export);
                              expected_sales_total_volume += parseFloat(expected_sales_temp_source[i].Value);

                            }

                            expected_sales_import_percentage = (expected_sales_import_volume / expected_sales_total_volume) * 100;

                            expected_sales_export_percentage = (expected_sales_export_volume / expected_sales_total_volume) * 100;


                            var client_year_list_and_count = [];

                            for (var i = 0; i < this.client_6_year_list.length; i++)
                              client_year_list_and_count.push({ year: this.client_6_year_list[i], count: 0 });

                            for (var i = 0; i < clients_temp_source.length; i++)
                              for (var j = 0; j < client_year_list_and_count.length; j++)
                                if (clients_temp_source[i].Year == client_year_list_and_count[j].year)
                                  client_year_list_and_count[j].count++;

                            var client_count_flag = 0;

                            for (var i = 0; (i < client_year_list_and_count.length) && (client_count_flag == 0); i++)
                              if (client_year_list_and_count[i].count == 0)
                                client_count_flag = 1;


                            if (this.panelsVisible[0].visible == true && (this.Description_vs || this.Applications_vs || this.Users_vs || this.Substitutes_vs ||
                              // this.Weight_vs || this.WeightUnit_vs || this.Size_vs || this.SizeUnit_vs ||
                              this.AnnualProductionCap_vs || this.AnnualPrdCapUOM_vs || this.CommercialProjYear_vs ||
                              this.NumberOfClients_vs || this.ProductBrochures_vs)) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.MandatoryPDTDetails'));
                              this.panelStep = 1;

                            }

                            else if (this.panelsVisible[0].visible == true && this.inputs.CommercialProjYear.toString().length != 4) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYearInPDTDetails'));
                              this.CommercialProjYear_vs = true;
                              this.panelStep = 1;

                            }

                            else if (this.panelsVisible[1].visible == true && product_sales_count_flag == 1 && this.loanPurpose != "New") {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterSPS1') + product_sales_year_list_and_count.length + this.translate.instant('MARKETING_INFORMATION.EnterSPS2'));
                              this.panelStep = 2;

                            }

                            else if (this.panelsVisible[2].visible == true && target_market_region_percentage > 100) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TMRCGreater1') + target_market_region_percentage + this.translate.instant('MARKETING_INFORMATION.TMRCGreater2'));
                              this.panelStep = 3;

                            }

                            else if (this.panelsVisible[2].visible == true && target_market_region_percentage < 100) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TMRCLess1') + target_market_region_percentage + this.translate.instant('MARKETING_INFORMATION.TMRCLess2'));
                              this.panelStep = 3;

                            }

                            else if (this.panelsVisible[3].visible == true && target_market_percentage > 100) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TMSGreater1') + target_market_percentage + this.translate.instant('MARKETING_INFORMATION.TMSGreater2'));
                              this.panelStep = 4;

                            }

                            else if (this.panelsVisible[3].visible == true && target_market_percentage < 100) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TMSLess1') + target_market_percentage + this.translate.instant('MARKETING_INFORMATION.TMSLess2'));
                              this.panelStep = 4;

                            }

                            else if (this.panelsVisible[4].visible == true && local_competitors_temp_source.length <= 0) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterLocalCompetitors'));
                              this.panelStep = 5;

                            }

                            else if (this.panelsVisible[5].visible == true && import_competitors_temp_source.length <= 0) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterImportCompetitors'));
                              this.panelStep = 6;

                            }

                            else if (this.panelsVisible[7].visible == true && (this.inputs.FactorsAffectingDemand == "" || !this.inputs.FactorsAffectingDemand)) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterFactorsAffecting'));
                              this.FactorsAffectingDemand_vs = true;
                              this.panelStep = 8;

                            }

                            else if (this.panelsVisible[8].visible == true && flag == 1) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterSalesForecast'));
                              this.panelStep = 9;

                            }

                            else if (this.panelsVisible[8].visible == true && target_market_region_import_percentage > expected_sales_import_percentage) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageLess1') + expected_sales_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageLess2') + target_market_region_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageLess3'));
                              this.panelStep = 9;

                            }

                            else if (this.panelsVisible[8].visible == true && target_market_region_import_percentage < expected_sales_import_percentage) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageGreater1') + expected_sales_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageGreater2') + target_market_region_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageGreater3'));
                              this.panelStep = 9;

                            }

                            else if (this.panelsVisible[8].visible == true && target_market_region_export_percentage > expected_sales_export_percentage) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageLess1') + expected_sales_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageLess2') + target_market_region_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageLess3'));
                              this.panelStep = 9;

                            }

                            else if (this.panelsVisible[8].visible == true && target_market_region_export_percentage < expected_sales_export_percentage) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageGreater1') + expected_sales_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageGreater2') + target_market_region_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageGreater3'));
                              this.panelStep = 9;

                            }

                            else if (this.panelsVisible[8].visible == true && this.inputs.ExpectedSalesDocumentsFlag && this.expectedSalesDocuments.documentList.length == 0 && this.expectedSalesFileLength == 0) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.AttachOffTakeAgreements'));
                              this.ExpectedSalesDocuments_vs = true;
                              this.panelStep = 9;

                            }

                            // else if (this.panelsVisible[9].visible == true && parseInt(this.inputs.NumberOfClients) <= 3 && clients_temp_source.length == 0) {

                            //   this.commonService.showFailureToast("The details of the " + this.inputs.NumberOfClients + " Targeted End Users must be entered !");
                            //   this.panelStep = 10;

                            // }

                            else if (this.panelsVisible[9].visible == true && parseInt(this.inputs.NumberOfClients) <= 3 && client_count_flag == 1) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.ClientDetailsCount1') + this.inputs.NumberOfClients + this.translate.instant('MARKETING_INFORMATION.ClientDetailsCount2') + client_year_list_and_count.length + this.translate.instant('MARKETING_INFORMATION.ClientDetailsCount3'));
                              this.panelStep = 10;

                            }

                            else if (this.panelsVisible[10].visible == true && proposed_selling_price_temp_source.length <= 0) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SPPDetails'));
                              this.panelStep = 11;

                            }

                            else if (this.panelsVisible[12].visible == true && (this.inputs.ProposedProductAdCampagin == "" || !this.inputs.ProposedProductAdCampagin)) {

                              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.DistributionAndMKT'));
                              this.ProposedProductAdCampaign_vs = true;
                              this.panelStep = 13;

                            }

                            else {

                              var data = {
                                documentDefId: 121,
                                entityId: this.requestId,
                                entityName: "Project",
                                RelatedEntityId: this.inputs.GuiId == "" ? this.commonService.returnRandomNumber() : this.inputs.GuiId,
                                RelatedEntityName: "product",
                                operationType: "l"
                              };

                              var data_es = {
                                documentDefId: 402,
                                entityId: this.requestId,
                                entityName: "Project",
                                RelatedEntityId: this.inputs.GuiId == "" ? this.commonService.returnRandomNumber() : this.inputs.GuiId,
                                RelatedEntityName: "product",
                                operationType: "l"
                              };

                              this.spinnerService.show();

                              if (this.productBrochuresFileLength > 0)
                                this.communicationsService.uploadDocumentService(this.productBrochuresFiles, data)
                                  .then(requests => (this.onProductBrochuresUpload(requests, data.RelatedEntityId,
                                    product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
                                    local_competitors_temp_source, import_competitors_temp_source,
                                    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
                                    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
                                    production_lines_temp_source, indicator)), err => this.resolveError());

                              else if (this.inputs.ExpectedSalesDocumentsFlag && this.expectedSalesFileLength > 0)
                                this.communicationsService.uploadDocumentService(this.expectedSalesFiles, data_es)
                                  .then(requests => (this.onExpectedSalesUpload(requests, data.RelatedEntityId,
                                    product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
                                    local_competitors_temp_source, import_competitors_temp_source,
                                    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
                                    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
                                    production_lines_temp_source, indicator)), err => this.resolveError());

                              else
                                this.onDocumentUploadResolveData(product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
                                  local_competitors_temp_source, import_competitors_temp_source,
                                  product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
                                  proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
                                  production_lines_temp_source, indicator);

                            }

                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  }

  onProductBrochuresUpload(requests, RelatedEntityId,
    product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
    local_competitors_temp_source, import_competitors_temp_source,
    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
    production_lines_temp_source, indicator) {

    if (requests.MessType == "S") {

      this.inputs.GuiId = (this.inputs.GuiId == "" ? RelatedEntityId : this.inputs.GuiId);

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.productBrochuresDocuments.documentList.push(requests.data["documentList"][i]);

      }

      var data = {
        documentDefId: 402,
        entityId: this.requestId,
        entityName: "Project",
        RelatedEntityId: this.inputs.GuiId == "" ? this.commonService.returnRandomNumber() : this.inputs.GuiId,
        RelatedEntityName: "product",
        operationType: "l"
      };

      if (this.inputs.ExpectedSalesDocumentsFlag && this.expectedSalesFileLength > 0)
        this.communicationsService.uploadDocumentService(this.expectedSalesFiles, data)
          .then(requests => (this.onExpectedSalesUpload(requests, data.RelatedEntityId,
            product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
            local_competitors_temp_source, import_competitors_temp_source,
            product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
            proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
            production_lines_temp_source, indicator)), err => this.resolveError());

      else
        this.onDocumentUploadResolveData(product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
          local_competitors_temp_source, import_competitors_temp_source,
          product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
          proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
          production_lines_temp_source, indicator);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onExpectedSalesUpload(requests, RelatedEntityId,
    product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
    local_competitors_temp_source, import_competitors_temp_source,
    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
    production_lines_temp_source, indicator) {

    if (requests.MessType == "S") {

      this.inputs.GuiId = (this.inputs.GuiId == "" ? RelatedEntityId : this.inputs.GuiId);

      for (var i = 0; i < requests.data.documentList.length; i++) {

        requests.data["documentList"][i]["docUrl"] =
          requests.data["url"]
            .replace("entityId", requests.data["documentList"][i].EntityId)
            .replace("refId", requests.data["documentList"][i].RefId)
            .replace("documentId", requests.data["documentList"][i].DocumentId)
            .replace("fileName", requests.data["documentList"][i].FileName);

        this.expectedSalesDocuments.documentList.push(requests.data["documentList"][i]);

      }

      this.onDocumentUploadResolveData(product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
        local_competitors_temp_source, import_competitors_temp_source,
        product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
        proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
        production_lines_temp_source, indicator);

    }

    else
      this.commonService.showFailureToast(requests.message);

  }

  onDocumentUploadResolveData(product_sales_temp_source, target_market_temp_source, target_market_region_temp_source,
    local_competitors_temp_source, import_competitors_temp_source,
    product_demand_temp_source, expected_sales_temp_source, clients_temp_source,
    proposed_selling_price_temp_source, major_competitors_temp_source, manufacturing_stages_temp_source,
    production_lines_temp_source, indicator) {

    this.productBrochuresFiles = [];

    if (this.productBrochuresFileField && this.productBrochuresFileField.nativeElement && this.productBrochuresFileField.nativeElement.value)
      this.productBrochuresFileField.nativeElement.value = "";

    this.productBrochuresFileLength = 0;


    this.expectedSalesFiles = [];

    if (this.expectedSalesFileField && this.expectedSalesFileField.nativeElement && this.expectedSalesFileField.nativeElement.value)
      this.expectedSalesFileField.nativeElement.value = "";

    this.expectedSalesFileLength = 0;


    var weight_unit_text = "", size_unit_text = "", shelf_life_unit_text = "",
      annual_production_capacity_unit_text = "", licensed_production_capacity_unit_text = "";

    var weight_unit = this.unit_list.find((o) => o.NameAr == this.inputs.WeightUnit|| o.Name == this.inputs.WeightUnit);
    if (weight_unit)
      weight_unit_text = weight_unit.Code;

    var size_unit = this.unit_list.find((o) =>  o.NameAr == this.inputs.SizeUnit||o.Name == this.inputs.SizeUnit);
    if (size_unit)
      size_unit_text = size_unit.Code;

    var shelf_life_unit = this.unit_list.find((o) => o.NameAr == this.inputs.ShelfLifeUnit|| o.Name == this.inputs.ShelfLifeUnit);
    if (shelf_life_unit)
      shelf_life_unit_text = shelf_life_unit.Code;

    var annual_production_capacity_unit = this.unit_list.find((o) => o.NameAr == this.inputs.AnnualPrdCapUOM||o.Name == this.inputs.AnnualPrdCapUOM);
    if (annual_production_capacity_unit)
      annual_production_capacity_unit_text = annual_production_capacity_unit.Code;

    var licensed_production_capacity_unit = this.unit_list.find((o) => o.NameAr == this.inputs.LicensedProductionCapUnit|| o.Name == this.inputs.LicensedProductionCapUnit);
    if (licensed_production_capacity_unit)
      licensed_production_capacity_unit_text = licensed_production_capacity_unit.Code;


    for (var i = 0; i < product_sales_temp_source.length; i++) {

      var quantity_unit = this.unit_list.find((o) => o.NameAr == product_sales_temp_source[i].QuantityUOM||o.Name == product_sales_temp_source[i].QuantityUOM);
      if (quantity_unit)
        product_sales_temp_source[i].QuantityUOM = quantity_unit.Code;

    }

    for (var i = 0; i < this.deleted_product_sales.length; i++) {

      var quantity_unit = this.unit_list.find((o) => o.NameAr == this.deleted_product_sales[i].QuantityUOM|| o.Name == this.deleted_product_sales[i].QuantityUOM);
      if (quantity_unit)
        this.deleted_product_sales[i].QuantityUOM = quantity_unit.Code;

    }


    for (var i = 0; i < target_market_temp_source.length; i++) {

      var target_market_type = this.market_type_list.find((o) => o.DescAr == target_market_temp_source[i].Type|| o.Desc == target_market_temp_source[i].Type);
      if (target_market_type)
        target_market_temp_source[i].Type = target_market_type.Id;

    }

    for (var i = 0; i < this.deleted_target_market.length; i++) {

      var target_market_type = this.market_type_list.find((o) => o.DescAr == this.deleted_target_market[i].Type|| o.Desc == this.deleted_target_market[i].Type);
      if (target_market_type)
        this.deleted_target_market[i].Type = target_market_type.Id;

    }


    for (var i = 0; i < target_market_region_temp_source.length; i++) {

      var target_market_region_type = this.market_region_type_list.find((o) => o.DescAr == target_market_region_temp_source[i].Type||o.Desc == target_market_region_temp_source[i].Type);
      if (target_market_region_type)
        target_market_region_temp_source[i].Type = target_market_region_type.Id;

      var target_market_region_region = this.country_list.find((o) => o.DescAr == target_market_region_temp_source[i].Region|| o.Name == target_market_region_temp_source[i].Region);
      if (target_market_region_region)
        target_market_region_temp_source[i].Region = target_market_region_region.Code;

    }

    for (var i = 0; i < this.deleted_target_market_region.length; i++) {

      var target_market_region_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_target_market_region[i].Type|| o.Desc == this.deleted_target_market_region[i].Type);
      if (target_market_region_type)
        this.deleted_target_market_region[i].Type = target_market_region_type.Id;

    }


    for (var i = 0; i < local_competitors_temp_source.length; i++) {

      var local_competitors_unit = this.unit_list.find((o) => o.NameAr == local_competitors_temp_source[i].ProductionUOM|| o.Name == local_competitors_temp_source[i].ProductionUOM);
      if (local_competitors_unit)
        local_competitors_temp_source[i].ProductionUOM = local_competitors_unit.Code;

      if (local_competitors_temp_source[i].Region) {

        var local_competitors_region = this.country_list.find((o) => o.DescAr == local_competitors_temp_source[i].Region||o.Name == local_competitors_temp_source[i].Region);
        if (local_competitors_region)
          local_competitors_temp_source[i].Region = local_competitors_region.Code;

      }

      if (local_competitors_temp_source[i].Type) {

        var local_competitors_type = this.market_region_type_list.find((o) => o.DescAr == local_competitors_temp_source[i].Type||o.Desc == local_competitors_temp_source[i].Type);
        if (local_competitors_type)
          local_competitors_temp_source[i].Type = local_competitors_type.Id;

      }

      if (local_competitors_temp_source[i]["LocalCompSalesVolume"])
        for (var j = 0; j < local_competitors_temp_source[i]["LocalCompSalesVolume"].length; j++) {

          var local_competitors_sales_volume_unit = this.unit_list.find((o) => o.NameAr == local_competitors_temp_source[i]["LocalCompSalesVolume"][j].QuantityUOM||o.Name == local_competitors_temp_source[i]["LocalCompSalesVolume"][j].QuantityUOM);
          if (local_competitors_sales_volume_unit)
            local_competitors_temp_source[i]["LocalCompSalesVolume"][j].QuantityUOM = local_competitors_sales_volume_unit.Code;

          var local_competitors_sales_volume_type = this.market_region_type_list.find((o) => o.DescAr == local_competitors_temp_source[i]["LocalCompSalesVolume"][j].Type||o.Desc == local_competitors_temp_source[i]["LocalCompSalesVolume"][j].Type);
          if (local_competitors_sales_volume_type)
            local_competitors_temp_source[i]["LocalCompSalesVolume"][j].Type = local_competitors_sales_volume_type.Id;

        }

      if (local_competitors_temp_source[i]["AdditionalCapacity"])
        for (var j = 0; j < local_competitors_temp_source[i]["AdditionalCapacity"].length; j++)
          local_competitors_temp_source[i]["AdditionalCapacity"][j].Date = this.commonService.returnDateStringWithoutHyphenFromDateString(local_competitors_temp_source[i]["AdditionalCapacity"][j].Date);

    }

    for (var i = 0; i < this.deleted_local_competitors.length; i++) {

      var local_competitors_unit = this.unit_list.find((o) => o.NameAr == this.deleted_local_competitors[i].ProductionUOM||o.Name == this.deleted_local_competitors[i].ProductionUOM);
      if (local_competitors_unit)
        this.deleted_local_competitors[i].ProductionUOM = local_competitors_unit.Code;

      if (this.deleted_local_competitors[i].Region) {

        var local_competitors_region = this.country_list.find((o) => o.DescAr == this.deleted_local_competitors[i].Region||o.Name == this.deleted_local_competitors[i].Region);
        if (local_competitors_region)
          this.deleted_local_competitors[i].Region = local_competitors_region.Code;

      }

      if (this.deleted_local_competitors[i].Type) {

        var local_competitors_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_local_competitors[i].Type||o.Desc == this.deleted_local_competitors[i].Type);
        if (local_competitors_type)
          this.deleted_local_competitors[i].Type = local_competitors_type.Id;

      }

      if (this.deleted_local_competitors[i]["LocalCompSalesVolume"])
        for (var j = 0; j < this.deleted_local_competitors[i]["LocalCompSalesVolume"].length; j++) {

          var local_competitors_sales_volume_unit = this.unit_list.find((o) => o.NameAr == this.deleted_local_competitors[i]["LocalCompSalesVolume"][j].QuantityUOM||o.Name == this.deleted_local_competitors[i]["LocalCompSalesVolume"][j].QuantityUOM);
          if (local_competitors_sales_volume_unit)
            this.deleted_local_competitors[i]["LocalCompSalesVolume"][j].QuantityUOM = local_competitors_sales_volume_unit.Code;

          var local_competitors_sales_volume_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_local_competitors[i]["LocalCompSalesVolume"][j].Type||o.Desc == this.deleted_local_competitors[i]["LocalCompSalesVolume"][j].Type);
          if (local_competitors_sales_volume_type)
            this.deleted_local_competitors[i]["LocalCompSalesVolume"][j].Type = local_competitors_sales_volume_type.Id;

        }

    }


    for (var i = 0; i < local_competitors_temp_source.length; i++)
      if (local_competitors_temp_source[i].LocalCompetitorID) {

        for (var j = 0; j < this.deleted_local_competitors_sales_volume.length; j++)
          if (local_competitors_temp_source[i].LocalCompetitorID == this.deleted_local_competitors_sales_volume[j].LocalCompetitorId)
            local_competitors_temp_source[i].LocalCompSalesVolume.push(this.deleted_local_competitors_sales_volume[j]);

        for (var j = 0; j < this.deleted_additional_capacity.length; j++)
          if (local_competitors_temp_source[i].LocalCompetitorID == this.deleted_additional_capacity[j].LocalCompetitorId)
            local_competitors_temp_source[i].AdditionalCapacity.push(this.deleted_additional_capacity[j]);

      }

    for (var i = 0; i < import_competitors_temp_source.length; i++) {

      // var import_competitors_unit = this.unit_list.find((o) => o.Name == import_competitors_temp_source[i].ProductionUOM);
      // if (import_competitors_unit)
      //   import_competitors_temp_source[i].ProductionUOM = import_competitors_unit.Code;
      if (import_competitors_temp_source[i]["ImportSalesVolume"])
        for (var j = 0; j < import_competitors_temp_source[i]["ImportSalesVolume"].length; j++) {

          var import_competitors_sales_volume_unit = this.unit_list.find((o) => o.NameAr == import_competitors_temp_source[i]["ImportSalesVolume"][j].QuantityUOM||o.Name == import_competitors_temp_source[i]["ImportSalesVolume"][j].QuantityUOM);
          if (import_competitors_sales_volume_unit)
            import_competitors_temp_source[i]["ImportSalesVolume"][j].QuantityUOM = import_competitors_sales_volume_unit.Code;

        }


      if (import_competitors_temp_source[i].Region) {

        var import_competitors_region = this.country_list.find((o) => o.DescAr == import_competitors_temp_source[i].Region|| o.Name == import_competitors_temp_source[i].Region);
        if (import_competitors_region)
          import_competitors_temp_source[i].Region = import_competitors_region.Code;

      }

      if (import_competitors_temp_source[i].Orgin) {

        var import_competitors_type = this.market_region_type_list.find((o) => o.DescAr == import_competitors_temp_source[i].Orgin||o.Desc == import_competitors_temp_source[i].Orgin);
        if (import_competitors_type)
          import_competitors_temp_source[i].Orgin = import_competitors_type.Id;

      }

    }

    for (var i = 0; i < this.deleted_import_competitors.length; i++) {

      // var import_competitors_unit = this.unit_list.find((o) => o.Name == this.deleted_import_competitors[i].ProductionUOM);
      // if (import_competitors_unit)
      //   this.deleted_import_competitors[i].ProductionUOM = import_competitors_unit.Code;
      if (this.deleted_import_competitors[i]["ImportSalesVolume"])
        for (var j = 0; j < this.deleted_import_competitors[i]["ImportSalesVolume"].length; j++) {

          var import_competitors_sales_volume_unit = this.unit_list.find((o) => o.NameAr == this.deleted_import_competitors[i]["ImportSalesVolume"][j].QuantityUOM|| o.Name == this.deleted_import_competitors[i]["ImportSalesVolume"][j].QuantityUOM);
          if (import_competitors_sales_volume_unit)
            this.deleted_import_competitors[i]["ImportSalesVolume"][j].QuantityUOM = import_competitors_sales_volume_unit.Code;

        }

      if (this.deleted_import_competitors[i].Region) {

        var import_competitors_region = this.country_list.find((o) => o.DescAr == this.deleted_import_competitors[i].Region||o.Name == this.deleted_import_competitors[i].Region);
        if (import_competitors_region)
          this.deleted_import_competitors[i].Region = import_competitors_region.Code;

      }

      if (this.deleted_import_competitors[i].Orgin) {

        var import_competitors_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_import_competitors[i].Orgin||o.Desc == this.deleted_import_competitors[i].Orgin);
        if (import_competitors_type)
          this.deleted_import_competitors[i].Orgin = import_competitors_temp_source.Id;

      }

    }


    for (var i = 0; i < import_competitors_temp_source.length; i++)
      if (import_competitors_temp_source[i].ImportCompetitorsId)
        for (var j = 0; j < this.deleted_import_competitors_sales_volume.length; j++)
          if (import_competitors_temp_source[i].ImportCompetitorsId == this.deleted_import_competitors_sales_volume[j].ImportCompetitorsId)
            import_competitors_temp_source[i].ImportSalesVolume.push(this.deleted_import_competitors_sales_volume[j]);


    for (var i = 0; i < expected_sales_temp_source.length; i++) {

      if (expected_sales_temp_source[i]["ProductExpectedSalesExport"])
        for (var j = 0; j < expected_sales_temp_source[i]["ProductExpectedSalesExport"].length; j++) {

          var expected_sales_export_region = this.country_list.find((o) => o.DescAr == expected_sales_temp_source[i]["ProductExpectedSalesExport"][j].Region||o.Name == expected_sales_temp_source[i]["ProductExpectedSalesExport"][j].Region);
          if (expected_sales_export_region)
            expected_sales_temp_source[i]["ProductExpectedSalesExport"][j].Region = expected_sales_export_region.Code;

        }

    }

    for (var i = 0; i < this.deleted_expected_sales.length; i++) {

      if (this.deleted_expected_sales[i]["ProductExpectedSalesExport"])
        for (var j = 0; j < this.deleted_expected_sales[i]["ProductExpectedSalesExport"].length; j++) {

          var expected_sales_export_region = this.country_list.find((o) => o.DescAr == this.deleted_expected_sales[i]["ProductExpectedSalesExport"][j].Region||o.Name == this.deleted_expected_sales[i]["ProductExpectedSalesExport"][j].Region);
          if (expected_sales_export_region)
            this.deleted_expected_sales[i]["ProductExpectedSalesExport"][j].Region = expected_sales_export_region.Code;

        }

    }

    for (var i = 0; i < expected_sales_temp_source.length; i++)
      if (expected_sales_temp_source[i].ExpectedSalesID)
        for (var j = 0; j < this.deleted_expected_sales_volume_export_volume.length; j++)
          if (expected_sales_temp_source[i].ExpectedSalesID == this.deleted_expected_sales_volume_export_volume[j].ExpectedSalesID)
            expected_sales_temp_source[i].ProductExpectedSalesExport.push(this.deleted_expected_sales_volume_export_volume[j]);


    for (var i = 0; i < product_demand_temp_source.length; i++) {

      var product_demand_unit = this.unit_list.find((o) => o.NameAr == product_demand_temp_source[i].QuantityUOM||o.Name == product_demand_temp_source[i].QuantityUOM);
      if (product_demand_unit)
        product_demand_temp_source[i].QuantityUOM = product_demand_unit.Code;

      if (product_demand_temp_source[i].Region) {

        var product_demand_region = this.country_list.find((o) => o.DescAr == product_demand_temp_source[i].Region|| o.Name == product_demand_temp_source[i].Region);
        if (product_demand_region)
          product_demand_temp_source[i].Region = product_demand_region.Code;

      }

      if (product_demand_temp_source[i].Type) {

        var product_demand_type = this.market_region_type_list.find((o) => o.DescAr == product_demand_temp_source[i].Type|| o.Desc == product_demand_temp_source[i].Type);
        if (product_demand_type)
          product_demand_temp_source[i].Type = product_demand_type.Id;

      }

    }

    for (var i = 0; i < this.deleted_product_demand.length; i++) {

      var product_demand_unit = this.unit_list.find((o) => o.NameAr == this.deleted_product_demand[i].QuantityUOM||o.Name == this.deleted_product_demand[i].QuantityUOM);
      if (product_demand_unit)
        this.deleted_product_demand[i].QuantityUOM = product_demand_unit.Code;


      if (this.deleted_product_demand[i].Region) {

        var product_demand_region = this.country_list.find((o) => o.DescAr == this.deleted_product_demand[i].Region||o.Name == this.deleted_product_demand[i].Region);
        if (product_demand_region)
          this.deleted_product_demand[i].Region = product_demand_region.Code;

      }

      if (this.deleted_product_demand[i].Type) {

        var product_demand_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_product_demand[i].Type|| o.Desc == this.deleted_product_demand[i].Type);
        if (product_demand_type)
          this.deleted_product_demand[i].Type = product_demand_type.Id;

      }

    }

    for (var i = 0; i < major_competitors_temp_source.length; i++) {

      if (major_competitors_temp_source[i].Region) {

        var major_competitor_region = this.country_list.find((o) => o.DescAr == major_competitors_temp_source[i].Region|| o.Name == major_competitors_temp_source[i].Region);
        if (major_competitor_region)
          major_competitors_temp_source[i].Region = major_competitor_region.Code;

      }

      if (major_competitors_temp_source[i].Type) {

        var major_competitor_type = this.market_region_type_list.find((o) => o.DescAr == major_competitors_temp_source[i].Type||o.Desc == major_competitors_temp_source[i].Type);
        if (major_competitor_type)
          major_competitors_temp_source[i].Type = major_competitor_type.Id;

      }

    }

    for (var i = 0; i < this.deleted_major_competitors.length; i++) {

      if (this.deleted_major_competitors[i].Region) {

        var major_competitor_region = this.country_list.find((o) => o.DescAr == this.deleted_major_competitors[i].Region||o.Name == this.deleted_major_competitors[i].Region);
        if (major_competitor_region)
          this.deleted_major_competitors[i].Region = major_competitor_region.Code;

      }

      if (this.deleted_major_competitors[i].Type) {

        var major_competitor_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_major_competitors[i].Type||o.Desc == this.deleted_major_competitors[i].Type);
        if (major_competitor_type)
          this.deleted_major_competitors[i].Type = major_competitor_type.Id;

      }

    }

    for (var i = 0; i < clients_temp_source.length; i++) {

      var clients_unit = this.unit_list.find((o) => o.NameAr == clients_temp_source[i].ConsumptionUOM||o.Name == clients_temp_source[i].ConsumptionUOM);
      if (clients_unit)
        clients_temp_source[i].ConsumptionUOM = clients_unit.Code;

      var clients_location = this.country_list.find((o) => o.DescAr == clients_temp_source[i].ClientLocation||o.Name == clients_temp_source[i].ClientLocation);
      if (clients_location)
        clients_temp_source[i].ClientLocation = clients_location.Code;

    }

    for (var i = 0; i < this.deleted_clients.length; i++) {

      var clients_unit = this.unit_list.find((o) => o.NameAr == this.deleted_clients[i].ConsumptionUOM||o.Name == this.deleted_clients[i].ConsumptionUOM);
      if (clients_unit)
        this.deleted_clients[i].ConsumptionUOM = clients_unit.Code;

      var clients_location = this.country_list.find((o) => o.DescAr == this.deleted_clients[i].ClientLocation||o.Name == this.deleted_clients[i].ClientLocation);
      if (clients_location)
        this.deleted_clients[i].ClientLocation = clients_location.Code;

    }


    for (var i = 0; i < proposed_selling_price_temp_source.length; i++) {

      var proposed_selling_price_type = this.market_type_list.find((o) => o.DescAr == proposed_selling_price_temp_source[i].MarketType|| o.Desc == proposed_selling_price_temp_source[i].MarketType);
      if (proposed_selling_price_type)
        proposed_selling_price_temp_source[i].MarketType = proposed_selling_price_type.Id;

      proposed_selling_price_temp_source[i].ProposedPrice = this.commonService.numberWithCommasToNumber(proposed_selling_price_temp_source[i].ProposedPrice.replace('SAR ', ""));
      proposed_selling_price_temp_source[i].CompetitorPriceFrom = this.commonService.numberWithCommasToNumber(proposed_selling_price_temp_source[i].CompetitorPriceFrom.replace('SAR ', ""));
      proposed_selling_price_temp_source[i].CompetitorPriceTo = this.commonService.numberWithCommasToNumber(proposed_selling_price_temp_source[i].CompetitorPriceTo.replace('SAR ', ""));
      proposed_selling_price_temp_source[i].CompetitorPrice = proposed_selling_price_temp_source[i].CompetitorPriceFrom + " - " + proposed_selling_price_temp_source[i].CompetitorPriceTo;
      proposed_selling_price_temp_source[i].ImporterPriceFrom = this.commonService.numberWithCommasToNumber(proposed_selling_price_temp_source[i].ImporterPriceFrom.replace('SAR ', ""));
      proposed_selling_price_temp_source[i].ImporterPriceTo = this.commonService.numberWithCommasToNumber(proposed_selling_price_temp_source[i].ImporterPriceTo.replace('SAR ', ""));
      proposed_selling_price_temp_source[i].ImporterPrice = proposed_selling_price_temp_source[i].ImporterPriceFrom + " - " + proposed_selling_price_temp_source[i].ImporterPriceTo;

      if (proposed_selling_price_temp_source[i].Region) {

        var proposed_selling_price_region = this.country_list.find((o) => o.DescAr == proposed_selling_price_temp_source[i].Region||o.Name == proposed_selling_price_temp_source[i].Region);
        if (proposed_selling_price_region)
          proposed_selling_price_temp_source[i].Region = proposed_selling_price_region.Code;

      }

      if (proposed_selling_price_temp_source[i].Type) {

        var proposed_selling_price_type = this.market_region_type_list.find((o) => o.DescAr == proposed_selling_price_temp_source[i].Type|| o.Desc == proposed_selling_price_temp_source[i].Type);
        if (proposed_selling_price_type)
          proposed_selling_price_temp_source[i].Type = proposed_selling_price_type.Id;

      }

      var proposed_price_unit = this.unit_list.find((o) => o.NameAr == proposed_selling_price_temp_source[i].ProposedPriceUOM|| o.Name == proposed_selling_price_temp_source[i].ProposedPriceUOM);
      if (proposed_price_unit)
        proposed_selling_price_temp_source[i].ProposedPriceUOM = proposed_price_unit.Code;

      var competitor_price_unit = this.unit_list.find((o) => o.NameAr == proposed_selling_price_temp_source[i].CompetitorPriceUOM||o.Name == proposed_selling_price_temp_source[i].CompetitorPriceUOM);
      if (competitor_price_unit)
        proposed_selling_price_temp_source[i].CompetitorPriceUOM = competitor_price_unit.Code;

      var importer_price_unit = this.unit_list.find((o) => o.NameAr == proposed_selling_price_temp_source[i].ImporterPriceUOM|| o.Name == proposed_selling_price_temp_source[i].ImporterPriceUOM);
      if (importer_price_unit)
        proposed_selling_price_temp_source[i].ImporterPriceUOM = importer_price_unit.Code;

    }

    for (var i = 0; i < this.deleted_proposed_selling_price.length; i++) {

      var proposed_selling_price_type = this.market_type_list.find((o) => o.DescAr == this.deleted_proposed_selling_price[i].MarketType|| o.Desc == this.deleted_proposed_selling_price[i].MarketType);
      if (proposed_selling_price_type)
        this.deleted_proposed_selling_price[i].MarketType = proposed_selling_price_type.Id;

      this.deleted_proposed_selling_price[i].ProposedPrice = this.commonService.numberWithCommasToNumber(this.deleted_proposed_selling_price[i].ProposedPrice.replace('SAR ', ""));
      this.deleted_proposed_selling_price[i].CompetitorPriceFrom = this.commonService.numberWithCommasToNumber(this.deleted_proposed_selling_price[i].CompetitorPriceFrom.replace('SAR ', ""));
      this.deleted_proposed_selling_price[i].CompetitorPriceTo = this.commonService.numberWithCommasToNumber(this.deleted_proposed_selling_price[i].CompetitorPriceTo.replace('SAR ', ""));
      this.deleted_proposed_selling_price[i].CompetitorPrice = this.deleted_proposed_selling_price[i].CompetitorPriceFrom + " - " + this.deleted_proposed_selling_price[i].CompetitorPriceTo;
      this.deleted_proposed_selling_price[i].ImporterPriceFrom = this.commonService.numberWithCommasToNumber(this.deleted_proposed_selling_price[i].ImporterPriceFrom.replace('SAR ', ""));
      this.deleted_proposed_selling_price[i].ImporterPriceTo = this.commonService.numberWithCommasToNumber(this.deleted_proposed_selling_price[i].ImporterPriceTo.replace('SAR ', ""));
      this.deleted_proposed_selling_price[i].ImporterPrice = this.deleted_proposed_selling_price[i].ImporterPriceFrom + " - " + this.deleted_proposed_selling_price[i].ImporterPriceTo;

      if (this.deleted_proposed_selling_price[i].Region) {

        var proposed_selling_price_region = this.country_list.find((o) => o.DescAr == this.deleted_proposed_selling_price[i].Region||o.Name == this.deleted_proposed_selling_price[i].Region);
        if (proposed_selling_price_region)
          this.deleted_proposed_selling_price[i].Region = proposed_selling_price_region.Code;

      }

      if (this.deleted_proposed_selling_price[i].Type) {

        var proposed_selling_price_type = this.market_region_type_list.find((o) => o.DescAr == this.deleted_proposed_selling_price[i].Type||o.Desc == this.deleted_proposed_selling_price[i].Type);
        if (proposed_selling_price_type)
          this.deleted_proposed_selling_price[i].Type = proposed_selling_price_type.Id;

      }

      var proposed_price_unit = this.unit_list.find((o) => o.NameAr == this.deleted_proposed_selling_price[i].ProposedPriceUOM|| o.Name == this.deleted_proposed_selling_price[i].ProposedPriceUOM);
      if (proposed_price_unit)
        this.deleted_proposed_selling_price[i].ProposedPriceUOM = proposed_price_unit.Code;

      var competitor_price_unit = this.unit_list.find((o) => o.NameAr == this.deleted_proposed_selling_price[i].CompetitorPriceUOM||o.Name == this.deleted_proposed_selling_price[i].CompetitorPriceUOM);
      if (competitor_price_unit)
        this.deleted_proposed_selling_price[i].CompetitorPriceUOM = competitor_price_unit.Code;

      var importer_price_unit = this.unit_list.find((o) => o.NameAr == this.deleted_proposed_selling_price[i].ImporterPriceUOM||o.Name == this.deleted_proposed_selling_price[i].ImporterPriceUOM);
      if (importer_price_unit)
        this.deleted_proposed_selling_price[i].ImporterPriceUOM = importer_price_unit.Code;

    }


    for (var i = 0; i < manufacturing_stages_temp_source.length; i++) {

      var manufacturing_machinery_list = this.machineries_list.find((o) => o.DescAr == manufacturing_stages_temp_source[i].MachineId|| o.Desc == manufacturing_stages_temp_source[i].MachineId);
      if (manufacturing_machinery_list)
        manufacturing_stages_temp_source[i].MachineId = manufacturing_machinery_list.Id;

      var manufacturing_production_unit = this.unit_list.find((o) => o.NameAr == manufacturing_stages_temp_source[i].ProductionUom||o.Name == manufacturing_stages_temp_source[i].ProductionUom);
      if (manufacturing_production_unit)
        manufacturing_stages_temp_source[i].ProductionUom = manufacturing_production_unit.Code;

    }

    for (var i = 0; i < this.deleted_manufacturing_stages.length; i++) {

      var manufacturing_machinery_list = this.machineries_list.find((o) => o.DescAr == this.deleted_manufacturing_stages[i].MachineId|| o.Desc == this.deleted_manufacturing_stages[i].MachineId);
      if (manufacturing_machinery_list)
        this.deleted_manufacturing_stages[i].MachineId = manufacturing_machinery_list.Id;

      var manufacturing_production_unit = this.unit_list.find((o) => o.NameAr == this.deleted_manufacturing_stages[i].ProductionUom|| o.Name == this.deleted_manufacturing_stages[i].ProductionUom);
      if (manufacturing_production_unit)
        this.deleted_manufacturing_stages[i].ProductionUom = manufacturing_production_unit.Code;

    }


    for (var i = 0; i < production_lines_temp_source.length; i++) {

      for (var j = 0; j < production_lines_temp_source[i]["ProductProductionLinesSection"].length; j++) {

        var Product_Production_Lines_Section_unit = this.unit_list.find((o) => o.NameAr == production_lines_temp_source[i]["ProductProductionLinesSection"][j].MeasurementUnit|| o.Name == production_lines_temp_source[i]["ProductProductionLinesSection"][j].MeasurementUnit);
        if (Product_Production_Lines_Section_unit)
          production_lines_temp_source[i]["ProductProductionLinesSection"][j].MeasurementUnit = Product_Production_Lines_Section_unit.Code;

      }

    }

    for (var i = 0; i < this.deleted_production_lines.length; i++) {

      for (var j = 0; j < this.deleted_production_lines[i]["ProductProductionLinesSection"].length; j++) {

        var Product_Production_Lines_Section_unit = this.unit_list.find((o) => o.NameAr == this.deleted_production_lines[i]["ProductProductionLinesSection"][j].MeasurementUnit || o.Name == this.deleted_production_lines[i]["ProductProductionLinesSection"][j].MeasurementUnit);
        if (Product_Production_Lines_Section_unit)
          this.deleted_production_lines[i]["ProductProductionLinesSection"][j].MeasurementUnit = Product_Production_Lines_Section_unit.Code;

      }

    }


    try {

      var post_data = {

        "FactoryId": this.selected_product["FactoryId"],
        "ProductId": this.selected_product["ProductId"],
        "ProductName": this.inputs.ProductName,
        "HSCODE": this.inputs.HSCODE,
        "GuiId": this.inputs.GuiId,
        "ISIC": this.inputs.ISIC,
        "Description": this.inputs.Description,
        "Users": this.inputs.Users,
        "User": this.inputs.User,
        "Substitutes": this.inputs.Substitutes,
        "Weight": this.inputs.Weight,
        "WeightUOM": [
          {
            "Id": weight_unit_text
          }
        ],
        "Size": this.inputs.Size,
        "SizeUOM": [
          {
            "Id": size_unit_text
          }
        ],
        "ShelfLife": this.inputs.ShelfLife,
        "ShelfLifeUOM": [
          {
            "Id": shelf_life_unit_text
          }
        ],
        "Brand": this.inputs.Brand,
        "CommercialProjYear": this.inputs.CommercialProjYear,
        "NumberOfClients": this.inputs.NumberOfClients,
        "Sales": product_sales_temp_source.concat(this.deleted_product_sales),
        "TargetMarket": target_market_temp_source.concat(this.deleted_target_market),
        "TargetMarketRegion": target_market_region_temp_source.concat(this.deleted_target_market_region),
        "LocalCompetitors": local_competitors_temp_source.concat(this.deleted_local_competitors),
        "ImportCompetitors": import_competitors_temp_source.concat(this.deleted_import_competitors),
        "Demand": product_demand_temp_source.concat(this.deleted_product_demand),
        "ExpectedSales": expected_sales_temp_source.concat(this.deleted_expected_sales),
        "Clients": clients_temp_source.concat(this.deleted_clients),
        "ProposedSellingPrice": proposed_selling_price_temp_source.concat(this.deleted_proposed_selling_price),
        "MajorCompetitor": major_competitors_temp_source.concat(this.deleted_major_competitors),
        // //ADDED BY JAI
        "ManufacturingStages": manufacturing_stages_temp_source.concat(this.deleted_manufacturing_stages),
        "ProductionLines": production_lines_temp_source.concat(this.deleted_production_lines),
        "AnnualProductionCap": this.inputs.AnnualProductionCap,
        "AnnualPrdCapUOM": [
          {
            "Id": annual_production_capacity_unit_text
          }
        ],
        "LicensedProductionCap": this.inputs.LicensedProductionCap,
        "LicensedProdCapUOM": [
          {
            "Id": licensed_production_capacity_unit_text
          }
        ],
        "ProposedProductAdCampagin": this.inputs.ProposedProductAdCampagin,
        "FactorsAffectingDemand": this.inputs.FactorsAffectingDemand,
        "Origin": "CP",
        "Operation": "U",
        "CustomerId": "",
        "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
        "Indicator": indicator,
        "FlagSales": this.loanPurpose == "New" ? "X" : ""
      };

      this.loanApplicationService.postMarketingInformation(post_data)
        .then((res) => (this.resolveSave(res)), err => this.resolveError());

    }

    catch (err) {
      this.spinnerService.hide();
      this.resolveError();
    }

  }

  resolveSave(result) {

    if (result.MessType == "S") {

      this.MarkInfoPer = parseFloat(result.Percentage);

      this.customerProfileService.loanPercentageValues.MarkInfoPer = this.MarkInfoPer;

      this.ChecklistPer = (this.customerProfileService.loanPercentageValues.GenInfoPer +
        this.customerProfileService.loanPercentageValues.MarkInfoPer +
        this.customerProfileService.loanPercentageValues.TechInfoPer +
        this.customerProfileService.loanPercentageValues.FinInfoPer) / 4;

      this.customerProfileService.loanPercentageValues.ChecklistPer = this.ChecklistPer;

      this.commonService.showSuccessToast(result.MessText == "Sucess" ? "Success" : result.MessText);

      this.resolveLoanApplicationMarketingInformation(result, 1);

    }

    else {

      this.commonService.showFailureToast(result.MessText);
      this.spinnerService.hide();

    }

  }

  onDelete(delete_cancel_modal, event, table_name) {

    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
    this.deleteCancelModalReference.event = event;
    this.deleteCancelModalReference.table_name = table_name;
    this.deleteCancelModalReference.action = this.translate.instant('COMMON.Delete');
    this.deleteCancelModalReference.error = this.translate.instant('COMMON.AreYouSure');

    if (this.deleteCancelModalReference.table_name == 'Sales')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.SponsorProductSales');

    else if (this.deleteCancelModalReference.table_name == 'TargetMarket')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.TargetMarketSegments');

    else if (this.deleteCancelModalReference.table_name == 'TargetMarketRegion')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.TargetMarketRegionOrCountries');

    else if (this.deleteCancelModalReference.table_name == 'LocalCompetitors')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.FactoriesinTargetMarketRegionOrCountries');

    else if (this.deleteCancelModalReference.table_name == 'ImportCompetitors')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.ImportCompetitorsinTargetMarketRegionOrCountries');

    else if (this.deleteCancelModalReference.table_name == 'Demand')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.HistoricalProductDemand');

    else if (this.deleteCancelModalReference.table_name == 'ExpectedSales')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.ExpectedSalesVolume');

    else if (this.deleteCancelModalReference.table_name == 'Clients')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.TargetedEndUsers');

    else if (this.deleteCancelModalReference.table_name == 'ProposedSellingPrice')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.SponsorProposedPrice');

    else if (this.deleteCancelModalReference.table_name == 'MajorCompetitor')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.MajorCompetitorMarketShare');

    else if (this.deleteCancelModalReference.table_name == 'ManufacturingStages')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.ManufacturingStages');

    else if (this.deleteCancelModalReference.table_name == 'ProductionLines')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.ProductionLines');

  }

  onDeleteConfirm() {

    if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.Delete')) {

      if (this.deleteCancelModalReference.table_name == 'Sales') {

        this.product_sales_source.remove(this.deleteCancelModalReference.event.data);

        this.product_sales_source.refresh();

        this.product_sales_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_product_sales.push(this.deleteCancelModalReference.event.data);

      }

      else if (this.deleteCancelModalReference.table_name == 'TargetMarket') {

        this.target_market_source.remove(this.deleteCancelModalReference.event.data);

        this.target_market_source.refresh();

        this.target_market_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_target_market.push(this.deleteCancelModalReference.event.data);

        var temp_array = [];

        for (var i = 0; i < this.market_type_selected_desc_list.length; i++)
          if (!(this.market_type_selected_desc_list[i] == this.deleteCancelModalReference.event.data.Type))
            temp_array.push(this.market_type_selected_desc_list[i]);

        this.market_type_selected_desc_list = temp_array;

      }

      else if (this.deleteCancelModalReference.table_name == 'TargetMarketRegion') {

        this.target_market_region_source.remove(this.deleteCancelModalReference.event.data);

        this.target_market_region_source.refresh();

        this.target_market_region_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_target_market_region.push(this.deleteCancelModalReference.event.data);

      }

      else if (this.deleteCancelModalReference.table_name == 'LocalCompetitors') {

        this.local_competitors_source.remove(this.deleteCancelModalReference.event.data);

        this.local_competitors_source.refresh();

        this.local_competitors_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_local_competitors.push(this.deleteCancelModalReference.event.data);

        this.productDemandCalculation();

      }

      else if (this.deleteCancelModalReference.table_name == 'ImportCompetitors') {

        this.import_competitors_source.remove(this.deleteCancelModalReference.event.data);

        this.import_competitors_source.refresh();

        this.import_competitors_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_import_competitors.push(this.deleteCancelModalReference.event.data);

        this.productDemandCalculation();

      }

      else if (this.deleteCancelModalReference.table_name == 'Demand') {

        this.product_demand_source.remove(this.deleteCancelModalReference.event.data);

        this.product_demand_source.refresh();

        this.product_demand_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_product_demand.push(this.deleteCancelModalReference.event.data);

      }

      else if (this.deleteCancelModalReference.table_name == 'ExpectedSales') {

        this.expected_sales_source.remove(this.deleteCancelModalReference.event.data);

        this.expected_sales_source.refresh();

        this.expected_sales_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_expected_sales.push(this.deleteCancelModalReference.event.data);

      }

      else if (this.deleteCancelModalReference.table_name == 'Clients') {

        this.clients_source.remove(this.deleteCancelModalReference.event.data);

        this.clients_source_length--;

        this.clients_source.refresh();

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_clients.push(this.deleteCancelModalReference.event.data);

        this.spinnerService.show();

        if (this.clientsTableDocuments.documentList.length > 0)
          for (var i = 0; i < this.clientsTableDocuments.documentList.length; i++)
            if (parseInt(this.clientsTableDocuments.documentList[i].RelatedEntityId) ==
              parseInt(this.deleteCancelModalReference.event.data.GuiId)) {

              this.communicationsService.deleteDocumentService
                ({
                  entityId: this.clientsTableDocuments.documentList[i].EntityId, refId: this.clientsTableDocuments.documentList[i].RefId,
                  documentId: this.clientsTableDocuments.documentList[i].DocumentId, operationType: 'l'
                })
                .then(response => (response), err => err);

              this.onDeleteConfirmClient(i);

            }

        this.spinnerService.hide();

      }

      else if (this.deleteCancelModalReference.table_name == 'ProposedSellingPrice') {

        this.proposed_selling_price_source.remove(this.deleteCancelModalReference.event.data);

        this.proposed_selling_price_source.refresh();

        this.proposed_selling_price_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_proposed_selling_price.push(this.deleteCancelModalReference.event.data);

      }

      else if (this.deleteCancelModalReference.table_name == 'MajorCompetitor') {

        this.major_competitors_source.remove(this.deleteCancelModalReference.event.data);

        this.major_competitors_source.refresh();

        this.major_competitors_source_length--;

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_major_competitors.push(this.deleteCancelModalReference.event.data);

      }

      else if (this.deleteCancelModalReference.table_name == 'ManufacturingStages') {

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_manufacturing_stages.push(this.deleteCancelModalReference.event.data);

        this.manufacturing_stages_source.remove(this.deleteCancelModalReference.event.data);

        this.manufacturing_stages_source_length--;

        this.manufacturing_stages_source.refresh();

      }

      else if (this.deleteCancelModalReference.table_name == 'ProductionLines') {

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.deleted_production_lines.push(this.deleteCancelModalReference.event.data);

        this.production_lines_source.remove(this.deleteCancelModalReference.event.data);

        this.production_lines_source_length--;

        this.production_lines_source.refresh();

      }

      this.startedFilling = 1;

    }

    else if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.Switch')) {

      if (this.deleteCancelModalReference.error == this.translate.instant('MARKETING_INFORMATION.SwitchProductError'))
        this.onClickProductItemComplete(this.deleteCancelModalReference.event)

      else if (this.deleteCancelModalReference.error == this.translate.instant('COMMON.SwitchSectionError'))
        this.onClickLoanApplicationTabComplete(this.deleteCancelModalReference.event);

    }

    else if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.GoBack')) {

      this.router.navigate(['/pages/new-request/loan-application']);

    }

    this.deleteCancelModalReference.close();

  }

  onDeleteConfirmClient(i) {

    var temp_array = [];

    for (var j = 0; j < this.clientsTableDocuments.documentList.length; j++)
      if (i != j)
        temp_array.push(this.clientsTableDocuments.documentList[j]);

    this.clientsTableDocuments.documentList = temp_array;

  }

  onProductBrochuresFileChange(event) {

    let format;

    let format_length;

    this.productBrochuresFiles = event.target.files;

    for (var i = 0; i < this.productBrochuresFiles.length; i++) {

      format = this.productBrochuresFiles[i].name.split('.');

      format_length = format.length;

      if (this.productBrochuresFiles[i].size > 5242880) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.SizeOfFile'));
        event.target.value = '';

        this.productBrochuresFileLength = 0;
        this.ProductBrochures_vs = true;

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('COMMON.FormatOfFile'));
        event.target.value = '';

        this.productBrochuresFileLength = 0;
        this.ProductBrochures_vs = true;

        break;

      }

      else if (i === (this.productBrochuresFiles.length - 1)) {

        this.productBrochuresFileLength = this.productBrochuresFiles.length;
        this.ProductBrochures_vs = false;
        this.startedFilling = 1;

        break;

      }

    }

  }

  onExpectedSalesFileChange(event) {

    let format;

    let format_length;

    this.expectedSalesFiles = event.target.files;

    for (var i = 0; i < this.expectedSalesFiles.length; i++) {

      format = this.expectedSalesFiles[i].name.split('.');

      format_length = format.length;

      if (this.expectedSalesFiles[i].size > 5242880) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.SizeOfFile'));
        event.target.value = '';

        this.expectedSalesFileLength = 0;
        this.ExpectedSalesDocuments_vs = true;

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('COMMON.FormatOfFile'));
        event.target.value = '';

        this.expectedSalesFileLength = 0;
        this.ExpectedSalesDocuments_vs = true;

        break;

      }

      else if (i === (this.expectedSalesFiles.length - 1)) {

        this.expectedSalesFileLength = this.expectedSalesFiles.length;
        this.ExpectedSalesDocuments_vs = false;
        this.startedFilling = 1;

        break;

      }

    }

  }

  onSelectChange(selected_option) {

    this.selected_unit_name = selected_option;

    this.inputs.LicensedProductionCapUnit = selected_option;

    this.AnnualPrdCapUOM_vs = false;

    this.startedFilling = 1;

  }

  onChangeStartComProjYear() {

    this.CommercialProjYear_vs = false;

    this.startedFilling = 1;

    if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

      this.com_proj_plus_5_list = [];

      var year_value = parseInt(this.inputs.CommercialProjYear);

      for (var i = 0; i < 5; i++) {

        this.com_proj_plus_5_list.push(year_value.toString());

        year_value++;

      }


      this.client_6_year_list = [];

      var current_date = new Date();

      var current_year = current_date.getFullYear();

      var year_value = current_year - 1;

      for (var i = 0; i < 3; i++) {

        this.client_6_year_list.push(year_value.toString());

        year_value--;

      }

      var year_value = parseInt(this.inputs.CommercialProjYear);

      for (var i = 0; i < 3; i++) {

        var year_value_1 = year_value.toString();

        var client_year_value = this.client_6_year_list.find((o) => o == year_value_1);
        if (!client_year_value)
          this.client_6_year_list.push(year_value_1);

        year_value++;

      }

      this.client_6_year_list = this.client_6_year_list.sort((n1, n2) => n1 - n2);

    }

  }

  onCloseDeleteCancelModal() {

    this.deleteCancelModalReference.close();

  }

  setPanelStep(index: number) {
    this.panelStep = index;
  }

  nextPanelStep(panel_number) {

    if (this.add_edit_delete_show && panel_number === 1) {

      if (this.inputs.Description == "" || !this.inputs.Description)
        this.Description_vs = true;

      else
        this.Description_vs = false;

      if (this.inputs.User == "" || !this.inputs.User)
        this.Applications_vs = true;

      else
        this.Applications_vs = false;

      if (this.inputs.Users == "" || !this.inputs.Users)
        this.Users_vs = true;

      else
        this.Users_vs = false;

      if (this.inputs.Substitutes == "" || !this.inputs.Substitutes)
        this.Substitutes_vs = true;

      else
        this.Substitutes_vs = false;

      // if (this.inputs.Weight == "" || !this.inputs.Weight)
      //   this.Weight_vs = true;

      // else
      //   this.Weight_vs = false;

      // if (this.inputs.WeightUnit == "" || !this.inputs.WeightUnit)
      //   this.WeightUnit_vs = true;

      // else
      //   this.WeightUnit_vs = false;

      // if (this.inputs.Size == "" || !this.inputs.Size)
      //   this.Size_vs = true;

      // else
      //   this.Size_vs = false;

      // if (this.inputs.SizeUnit == "" || !this.inputs.SizeUnit)
      //   this.SizeUnit_vs = true;

      // else
      //   this.SizeUnit_vs = false;

      // else if (this.inputs.ShelfLife == "" || !this.inputs.ShelfLife)
      //   this.commonService.showFailureToast("Enter the Shelf Life !");

      // else if (this.inputs.ShelfLifeUnit == "" || !this.inputs.ShelfLifeUnit)
      //   this.commonService.showFailureToast("Select the Shelf Life Unit of Measure !");

      // else if (this.inputs.Brand == "" || !this.inputs.Brand)
      //   this.commonService.showFailureToast("Enter the Brand Name !");

      //ADDED BY JAI

      if (this.inputs.AnnualProductionCap == "" || !this.inputs.AnnualProductionCap)
        this.AnnualProductionCap_vs = true;

      else
        this.AnnualProductionCap_vs = false;

      if (this.inputs.AnnualPrdCapUOM == "" || !this.inputs.AnnualPrdCapUOM)
        this.AnnualPrdCapUOM_vs = true;

      else
        this.AnnualPrdCapUOM_vs = false;

      // else if (this.inputs.LicensedProductionCap == "" || !this.inputs.LicensedProductionCap)
      //   this.commonService.showFailureToast("Enter the Licensed Production Capacity !");

      if (this.inputs.CommercialProjYear == "" || !this.inputs.CommercialProjYear)
        this.CommercialProjYear_vs = true;

      else
        this.CommercialProjYear_vs = false;

      if (this.inputs.NumberOfClients == "" || !this.inputs.NumberOfClients)
        this.NumberOfClients_vs = true;

      else
        this.NumberOfClients_vs = false;

      if (this.productBrochuresDocuments.documentList.length == 0 && this.productBrochuresFileLength == 0)
        this.ProductBrochures_vs = true;

      else
        this.ProductBrochures_vs = false;


      if (this.Description_vs || this.Applications_vs || this.Users_vs || this.Substitutes_vs ||
        // this.Weight_vs || this.WeightUnit_vs || this.Size_vs || this.SizeUnit_vs ||
        this.AnnualProductionCap_vs || this.AnnualPrdCapUOM_vs || this.CommercialProjYear_vs ||
        this.NumberOfClients_vs || this.ProductBrochures_vs)
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.MandatoryPDTDetails'));


      else if (this.inputs.CommercialProjYear.toString().length != 4) {

        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYearInPDTDetails'));
        this.CommercialProjYear_vs = true;

      }

      else
        this.panelStep++;

    }

    else if (this.add_edit_delete_show && panel_number === 2) {

      var product_sales_temp_source = [];

      var product_sales_year_list_and_count = [];

      for (var i = 0; i < this.year_minus_3_list.length; i++)
        product_sales_year_list_and_count.push({ year: this.year_minus_3_list[i], count: 0 });

      this.product_sales_source.getAll().then((res) => {

        product_sales_temp_source = res;

        for (var i = 0; i < product_sales_temp_source.length; i++)
          for (var j = 0; j < product_sales_year_list_and_count.length; j++)
            if (product_sales_temp_source[i].Year == product_sales_year_list_and_count[j].year)
              product_sales_year_list_and_count[j].count++;

        var product_sales_count_flag = 0;

        for (var i = 0; (i < product_sales_year_list_and_count.length) && (product_sales_count_flag == 0); i++)
          if (product_sales_year_list_and_count[i].count == 0)
            product_sales_count_flag = 1;

        if (product_sales_count_flag == 1 && this.loanPurpose != "New")
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SPSYears1') + product_sales_year_list_and_count.length + this.translate.instant('MARKETING_INFORMATION.SPSYears2'));

        else
          this.panelStep++;

      });

    }

    else if (this.add_edit_delete_show && panel_number === 3) {

      var target_market_region_temp_source = [];

      var target_market_region_percentage = 0;

      this.target_market_region_source.getAll().then((res) => {

        target_market_region_temp_source = res;

        for (var i = 0; i < target_market_region_temp_source.length; i++)
          target_market_region_percentage += parseFloat(target_market_region_temp_source[i].Percent);

        if (target_market_region_percentage > 100)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMRLess1') + target_market_region_percentage + this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMRLess2'));

        else if (target_market_region_percentage < 100)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMRGreater1') + target_market_region_percentage + this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMRGreater2'));

        else
          this.panelStep++;

      });

    }

    else if (this.add_edit_delete_show && panel_number === 4) {

      var target_market_temp_source = [];

      var target_market_percentage = 0;

      this.target_market_source.getAll().then((res) => {

        target_market_temp_source = res;

        for (var i = 0; i < target_market_temp_source.length; i++)
          target_market_percentage += parseFloat(target_market_temp_source[i].Percent);

        if (target_market_percentage > 100)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMSLess1') + target_market_percentage + this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMSLess2'));

        else if (target_market_percentage < 100)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMSGreater1') + target_market_percentage + this.translate.instant('MARKETING_INFORMATION.TotalPercentageTMSGreater2'));

        else
          this.panelStep++;

      });

    }

    else if (this.add_edit_delete_show && panel_number === 5) {

      var local_competitors_temp_source = [];

      this.local_competitors_source.getAll().then((res) => {

        local_competitors_temp_source = res;

        if (local_competitors_temp_source.length <= 0)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.LocalCompetitorDetails'));

        else
          this.panelStep++;

      });

    }

    else if (this.add_edit_delete_show && panel_number === 6) {

      var import_competitors_temp_source = [];

      this.import_competitors_source.getAll().then((res) => {

        import_competitors_temp_source = res;

        if (import_competitors_temp_source.length <= 0)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.ImportCompetitorDetails'));

        else
          this.panelStep++;

      });

    }

    else if (this.add_edit_delete_show && panel_number === 7) {
      this.panelStep++;
    }

    else if (this.add_edit_delete_show && panel_number === 8) {

      if (this.inputs.FactorsAffectingDemand == "" || !this.inputs.FactorsAffectingDemand) {

        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.FactorsAffectingDemand'));
        this.FactorsAffectingDemand_vs = true;

      }

      else
        this.panelStep++;

    }

    else if (this.add_edit_delete_show && panel_number === 9) {

      if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

        var expected_sales_temp_source = [], target_market_region_temp_source = [];

        var expected_sales_export_volume = 0, target_market_region_export_percentage = 0;

        var expected_sales_import_volume = 0, target_market_region_import_percentage = 0;

        var expected_sales_total_volume = 0;

        var expected_sales_import_percentage = 0, expected_sales_export_percentage = 0;

        this.target_market_region_source.getAll().then((res) => {

          target_market_region_temp_source = res;

          this.expected_sales_source.getAll().then((res) => {

            expected_sales_temp_source = res;


            var flag = 0;

            if (expected_sales_temp_source.length == 0)
              flag = 1;

            else {

              for (var i = 0; (i < this.com_proj_plus_5_list.length) && flag == 0; i++) {

                for (var j = 0; (j < expected_sales_temp_source.length) && flag == 0; j++)
                  if (expected_sales_temp_source[j].Year == this.com_proj_plus_5_list[i])
                    flag = 1;

                if (flag == 0)
                  flag = 1;

                else
                  flag = 0;

              }

            }


            for (var i = 0; i < target_market_region_temp_source.length; i++)
              if (target_market_region_temp_source[i].Type == "Local")
                target_market_region_import_percentage += parseFloat(target_market_region_temp_source[i].Percent);
              else if (target_market_region_temp_source[i].Type == "Export")
                target_market_region_export_percentage += parseFloat(target_market_region_temp_source[i].Percent);

            for (var i = 0; i < expected_sales_temp_source.length; i++) {

              expected_sales_import_volume += parseFloat(expected_sales_temp_source[i].Local);
              expected_sales_export_volume += parseFloat(expected_sales_temp_source[i].Export);
              expected_sales_total_volume += parseFloat(expected_sales_temp_source[i].Value);

            }

            expected_sales_import_percentage = (expected_sales_import_volume / expected_sales_total_volume) * 100;

            expected_sales_export_percentage = (expected_sales_export_volume / expected_sales_total_volume) * 100;

            if (flag == 1)
              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastFiveYears'));

            else if (target_market_region_import_percentage > expected_sales_import_percentage)
              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageLess1') + expected_sales_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageLess2') + target_market_region_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageLess2'));

            else if (target_market_region_import_percentage < expected_sales_import_percentage)
              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageGreater1') + expected_sales_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageGreater2') + target_market_region_import_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastLocalPercentageGreater3'));

            else if (target_market_region_export_percentage > expected_sales_export_percentage)
              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageLess1') + expected_sales_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageLess2') + target_market_region_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageLess3'));

            else if (target_market_region_export_percentage < expected_sales_export_percentage)
              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageGreater1') + expected_sales_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageGreater2') + target_market_region_export_percentage + this.translate.instant('MARKETING_INFORMATION.SalesForecastExportPercentageGreater3'));

            else if (this.inputs.ExpectedSalesDocumentsFlag && this.expectedSalesDocuments.documentList.length == 0 && this.expectedSalesFileLength == 0) {

              this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.AttachOffTakeAgreements'));
              this.ExpectedSalesDocuments_vs = true;

            }

            else
              this.panelStep++;

          });

        });

      }

      else
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYear'));

    }

    else if (this.add_edit_delete_show && panel_number === 10) {

      if (this.inputs.CommercialProjYear && this.inputs.CommercialProjYear.toString().length == 4) {

        var clients_temp_source = [];

        var client_year_list_and_count = [];

        for (var i = 0; i < this.client_6_year_list.length; i++)
          client_year_list_and_count.push({ year: this.client_6_year_list[i], count: 0 });

        this.clients_source.getAll().then((res) => {

          clients_temp_source = res;

          for (var i = 0; i < clients_temp_source.length; i++)
            for (var j = 0; j < client_year_list_and_count.length; j++)
              if (clients_temp_source[i].Year == client_year_list_and_count[j].year)
                client_year_list_and_count[j].count++;

          var client_count_flag = 0;

          for (var i = 0; (i < client_year_list_and_count.length) && (client_count_flag == 0); i++)
            if (client_year_list_and_count[i].count == 0)
              client_count_flag = 1;

          // if (parseInt(this.inputs.NumberOfClients) < 3 && clients_temp_source.length == 0)
          //   this.commonService.showFailureToast("The details of the " + this.inputs.NumberOfClients + " Targeted End Users must be entered !");

          if (parseInt(this.inputs.NumberOfClients) <= 3 && client_count_flag == 1)
            this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.ClientDetailsCount1') + this.inputs.NumberOfClients + this.translate.instant('MARKETING_INFORMATION.ClientDetailsCount2') + client_year_list_and_count.length + this.translate.instant('MARKETING_INFORMATION.ClientDetailsCount3'));

          else
            this.panelStep++;

        });

      }

      else
        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.EnterValidStartCommYear'));

    }

    else if (this.add_edit_delete_show && panel_number === 11) {

      var proposed_selling_price_temp_source = [];

      this.proposed_selling_price_source.getAll().then((res) => {

        proposed_selling_price_temp_source = res;

        if (proposed_selling_price_temp_source.length <= 0)
          this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.SPPDetails'));

        else
          this.panelStep++;

      });

    }

    else if (this.add_edit_delete_show && panel_number === 13) {

      if (this.inputs.ProposedProductAdCampagin == "" || !this.inputs.ProposedProductAdCampagin) {

        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.DistributionAndMKT'));
        this.ProposedProductAdCampaign_vs = true;

      }

      else
        this.panelStep++;

    }

    else
      this.panelStep++;

  }

  prevPanelStep() {
    this.panelStep--;
  }

  expandAllPanels(mode) {

    this.panelStep = 0;

    if (mode == 0)
      this.allPanelsExpanded = true;

    else if (mode == 1)
      this.allPanelsExpanded = false;

  }

  onClickProductItem(product, delete_cancel_modal) {

    if (this.selected_product["ProductId"] != product.ProductId) {

      if (this.startedFilling == 0)
        this.onClickProductItemComplete(product);

      else {

        this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
        this.deleteCancelModalReference.event = product;
        this.deleteCancelModalReference.action = this.translate.instant('COMMON.Switch');
        this.deleteCancelModalReference.table_name_display = this.translate.instant('MARKETING_INFORMATION.Product');
        this.deleteCancelModalReference.error = this.translate.instant('MARKETING_INFORMATION.SwitchProductError');

      }

    }

  }

  onClickProductItemComplete(product) {

    this.startedFilling = 0;

    for (var i = 0; i < this.product_list.length; i++) {

      if (this.product_list[i].ProductName == product.ProductName)
        this.product_list[i].selected = true;

      else
        this.product_list[i].selected = false;

    }

    this.selected_product = product;

    this.getLoanApplicationMarketingInformation();

  }

  onClickLoanApplicationTab(tab_number, delete_cancel_modal) {

    if (tab_number != 1) {

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

    this.startedFilling = 0;

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
        else if (this.serviceId == 9 || this.serviceId == 13)  
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

      this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
      this.deleteCancelModalReference.action = this.translate.instant('COMMON.GoBack');
      this.deleteCancelModalReference.table_name_display = "";
      this.deleteCancelModalReference.error = this.translate.instant('COMMON.BackError');

    }

    else
      this.router.navigate(['/pages/new-request/loan-application']);

  }

  getMachineryDropdown(res) {
    if (res) {
      if (res.Machineries != null) {
        for (var i = 0; i < res.Machineries.length; i++) {
          this.machineries_list.push(res.Machineries[i]);
          this.machineries_desc_list.push(res.Machineries[i].Desc);
        }
      }
    }
  }

  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

  startTour() {

    this.allPanelsExpanded = true;

    if (this.lang == 'en') {

      this.tour_en.setOption('steps', [
        {
          element: '#tourStep1',
          intro: "Navigate to Project Information"
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
          intro: "View and Select the Products from the Product List"
        },
        {
          element: '#tourStep6',
          intro: "Enter the Product Details"
        },
        {
          element: '#tourStep7',
          intro: "Enter the Sponsor Product Sales"
        },
        {
          element: '#tourStep8',
          intro: "Enter the Target Market Region / Countries"
        },
        {
          element: '#tourStep9',
          intro: "Enter the Target Market Segments"
        },
        {
          element: '#tourStep10',
          intro: "Enter the Factories in Target Market Region / Countries"
        },
        {
          element: '#tourStep11',
          intro: "Enter the Import Competitors in Target Market Region / Countries"
        },
        {
          element: '#tourStep12',
          intro: "View the Historical Product Demand auto-calculated from the above details"
        },
        {
          element: '#tourStep13',
          intro: "Enter the Factors affecting Future Demand / Growth Rate Percentage"
        },
        {
          element: '#tourStep14',
          intro: "Enter the Sales Forecast"
        },
        {
          element: '#tourStep15',
          intro: "Enter the Targeted End Users"
        },
        {
          element: '#tourStep16',
          intro: "Enter the Sponsor Proposed Price (Ex-Factory Price)"
        },
        {
          element: '#tourStep17',
          intro: "Enter the Major Competitor Market Share"
        },
        {
          element: '#tourStep18',
          intro: "Enter the Distribution and Marketing Activities"
        },
        {
          element: '#tourStep19',
          intro: "Go Back"
        },
        {
          element: '#tourStep20',
          intro: "Save the details as a draft"
        },
        {
          element: '#tourStep21',
          intro: "Save the details as a submission"
        }
      ]);

      this.tour_en.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

    else if (this.lang == 'ar') {

      this.tour_ar.setOption('steps', [
        {
          element: '#tourStep1',
          intro: "انتقل إلى معلومات المشروع"
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
          intro: "عرض واختيار المنتجات من قائمة المنتجات"
        },
        {
          element: '#tourStep6',
          intro: "أدخل تفاصيل المنتج"
        },
        {
          element: '#tourStep7',
          intro: "أدخل مبيعات المنتج الراعي"
        },
        {
          element: '#tourStep8',
          intro: "أدخل منطقة السوق المستهدفة / البلدان"
        },
        {
          element: '#tourStep9',
          intro: "أدخل شرائح السوق المستهدفة"
        },
        {
          element: '#tourStep10',
          intro: "أدخل المصانع في منطقة السوق المستهدفة / البلدان"
        },
        {
          element: '#tourStep11',
          intro: "أدخل منافسي الاستيراد في منطقة السوق / البلدان المستهدفة"
        },
        {
          element: '#tourStep12',
          intro: "عرض الطلب على المنتجات التاريخية يتم احتسابه تلقائيًا من التفاصيل أعلاه"
        },
        {
          element: '#tourStep13',
          intro: "أدخل العوامل المؤثرة في نسبة الطلب / معدل النمو في المستقبل"
        },
        {
          element: '#tourStep14',
          intro: "أدخل توقعات المبيعات"
        },
        {
          element: '#tourStep15',
          intro: "أدخل المستخدمين النهائيين المستهدفين"
        },
        {
          element: '#tourStep16',
          intro: "أدخل سعر الراعي المقترح (سعر المصنع سابقًا)"
        },
        {
          element: '#tourStep17',
          intro: "أدخل حصة سوق المنافسين الرئيسيين"
        },
        {
          element: '#tourStep18',
          intro: "أدخل أنشطة التوزيع والتسويق"
        },
        {
          element: '#tourStep19',
          intro: "عد"
        },
        {
          element: '#tourStep20',
          intro: "احفظ التفاصيل كمسودة"
        },
        {
          element: '#tourStep21',
          intro: "احفظ التفاصيل كرسالة"
        }
      ]);

      this.tour_ar.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

  }
  
  setEditableSectionsBasedOnCommunication() {
  
    if (this.sponsor_product_sales__comments.hasComments) {
      this.product_sales_settings_en.actions.edit = true;
      this.product_sales_settings_en.actions.delete = true;
      this.product_sales_settings_ar.actions.edit = true;
      this.product_sales_settings_ar.actions.delete = true;
    } else {
      this.product_sales_settings_en.actions.edit = false;
      this.product_sales_settings_en.actions.delete = false;
      
      this.product_sales_settings_ar.actions.edit = false;
      this.product_sales_settings_ar.actions.delete = false;
    }
    this.product_sales_settings_en = Object.assign({}, this.product_sales_settings_en);

    this.product_sales_settings_ar = Object.assign({}, this.product_sales_settings_ar);
    if (this.sponsor_product_sales__comments.hasComments) {
      this.product_sales_settings_en.actions.edit = true;
      this.product_sales_settings_en.actions.delete = true;
      
      this.product_sales_settings_ar.actions.edit = true;
      this.product_sales_settings_ar.actions.delete = true;
    } else {
      this.product_sales_settings_en.actions.edit = false;
      this.product_sales_settings_en.actions.delete = false;
      
      this.product_sales_settings_ar.actions.edit = false;
      this.product_sales_settings_ar.actions.delete = false;
    }
    this.product_sales_settings_en = Object.assign({}, this.product_sales_settings_en);
    
    this.product_sales_settings_ar = Object.assign({}, this.product_sales_settings_ar);

    if (this.target_market_region_comments.hasComments) {
      this.target_market_region_settings_en.actions.edit = true;
      this.target_market_region_settings_en.actions.delete = true;
      
      this.target_market_region_settings_ar.actions.edit = true;
      this.target_market_region_settings_ar.actions.delete = true;
    } else {
      this.target_market_region_settings_en.actions.edit = false;
      this.target_market_region_settings_en.actions.delete = false;
      
      this.target_market_region_settings_ar.actions.edit = false;
      this.target_market_region_settings_ar.actions.delete = false;
    }
    this.target_market_region_settings_en = Object.assign({}, this.target_market_region_settings_en);
    
    this.target_market_region_settings_ar = Object.assign({}, this.target_market_region_settings_ar);

    if (this.target_market_segments_comments.hasComments) {
      this.target_market_settings_en.actions.edit = true;
      this.target_market_settings_en.actions.delete = true;
    } else {
      this.target_market_settings_en.actions.edit = false;
      this.target_market_settings_en.actions.delete = false;
    }
    this.target_market_settings_en = Object.assign({}, this.target_market_settings_en);
    
    this.target_market_settings_ar= Object.assign({}, this.target_market_settings_ar);
/*
    if (this.activities_of_owners_comments.hasComments) {
      this.activities_of_owners_settings_en.actions.edit = true;
      this.activities_of_owners_settings_en.actions.delete = true;
    } else {
      this.activities_of_owners_settings_en.actions.edit = false;
      this.activities_of_owners_settings_en.actions.delete = false;
    }
    this.activities_of_owners_settings_en = Object.assign({}, this.activities_of_owners_settings_en);
*/
    if (this.factories_target_market_region_comments.hasComments) {
      this.local_competitors_settings_en.actions.edit = true;
      this.local_competitors_settings_en.actions.delete = true;
      this.local_competitors_settings_ar.actions.edit = true;
      this.local_competitors_settings_ar.actions.delete = true;
    } else {
      this.local_competitors_settings_en.actions.edit = false;
      this.local_competitors_settings_en.actions.delete = false;
      
      this.local_competitors_settings_ar.actions.edit = false;
      this.local_competitors_settings_ar.actions.delete = false;
    }
    this.local_competitors_settings_en = Object.assign({}, this.local_competitors_settings_en);

    this.local_competitors_settings_ar = Object.assign({}, this.local_competitors_settings_ar);
    if (this.import_competitors_market_region_comments.hasComments) {
      this.import_competitors_settings_en.actions.edit = true;
      this.import_competitors_settings_en.actions.delete = true;
      this.import_competitors_settings_ar.actions.edit = true;
      this.import_competitors_settings_ar.actions.delete = true;
    } else {
      this.import_competitors_settings_en.actions.edit = false;
      this.import_competitors_settings_en.actions.delete = false;
      
      this.import_competitors_settings_ar.actions.edit = false;
      this.import_competitors_settings_ar.actions.delete = false;
    }
    this.import_competitors_settings_en = Object.assign({}, this.import_competitors_settings_en);

    this.import_competitors_settings_ar = Object.assign({}, this.import_competitors_settings_ar);
    if (this.historical_product_demand_comments.hasComments) {
      this.product_demand_settings_en.actions.edit = true;
      this.product_demand_settings_en.actions.delete = true;
      this.product_demand_settings_ar.actions.edit = true;
      this.product_demand_settings_ar.actions.delete = true;
    } else {
      this.product_demand_settings_en.actions.edit = false;
      this.product_demand_settings_en.actions.delete = false;
      
      this.product_demand_settings_ar.actions.edit = false;
      this.product_demand_settings_ar.actions.delete = false;
    }
    this.product_demand_settings_en = Object.assign({}, this.product_demand_settings_en);

    this.product_demand_settings_ar = Object.assign({}, this.product_demand_settings_ar);
    if (this.sponsor_proposed_price_comments.hasComments) {
      this.major_competitors_settings_en.actions.edit = true;
      this.major_competitors_settings_en.actions.delete = true;
      
      this.major_competitors_settings_ar.actions.edit = true;
      this.major_competitors_settings_ar.actions.delete = true;
    } else {
      this.major_competitors_settings_en.actions.edit = false;
      this.major_competitors_settings_en.actions.delete = false;
      
      this.major_competitors_settings_ar.actions.edit = false;
      this.major_competitors_settings_ar.actions.delete = false;
    }
    this.major_competitors_settings_en = Object.assign({}, this.major_competitors_settings_en);
    
    this.major_competitors_settings_ar = Object.assign({}, this.major_competitors_settings_ar);

    if (this.sponsor_proposed_price_comments.hasComments) {
      this.proposed_selling_price_settings_en.actions.edit = true;
      this.proposed_selling_price_settings_en.actions.delete = true;
    } else {
      this.proposed_selling_price_settings_en.actions.edit = false;
      this.proposed_selling_price_settings_en.actions.delete = false;
    }
    this.proposed_selling_price_settings_en = Object.assign({}, this.proposed_selling_price_settings_en);
    
    this.proposed_selling_price_settings_ar = Object.assign({}, this.proposed_selling_price_settings_ar);

    if (this.targeted_end_users_comments.hasComments) {
      this.clients_settings_en.actions.edit = true;
      this.clients_settings_en.actions.delete = true;
      this.clients_settings_ar.actions.edit = true;
      this.clients_settings_ar.actions.delete = true;
    } else {
      this.clients_settings_en.actions.edit = false;
      this.clients_settings_en.actions.delete = false;
      
      this.clients_settings_ar.actions.edit = false;
      this.clients_settings_ar.actions.delete = false;
    }
    this.clients_settings_en = Object.assign({}, this.clients_settings_en);
    
    this.clients_settings_ar = Object.assign({}, this.clients_settings_ar);

    if (this.expected_sales_volume_comments.hasComments) {
      this.expected_sales_settings_en.actions.edit = true;
      this.expected_sales_settings_en.actions.delete = true;
      this.expected_sales_settings_ar.actions.edit = true;
      this.expected_sales_settings_ar.actions.delete = true;
      this.expected_sales_volume_export_settings_ar.actions.edit = true;
      this.expected_sales_volume_export_settings_ar.actions.delete = true;
      
      
    } else {
      this.expected_sales_settings_en.actions.edit = false;
      this.expected_sales_settings_en.actions.delete = false;
      
      this.expected_sales_settings_ar.actions.edit = false;
      this.expected_sales_settings_ar.actions.delete = false;
      
      this.expected_sales_volume_export_settings_ar.actions.edit = false;
      this.expected_sales_volume_export_settings_ar.actions.delete = false;
     
    }
    
    this.expected_sales_settings_en = Object.assign({}, this.expected_sales_settings_en);
    this.expected_sales_settings_ar = Object.assign({}, this.expected_sales_settings_ar);  
    if (this.product_details_comments.hasComments) {
      this.productBrochuresDocuments["method"] = 'edit';
    } else {
      this.productBrochuresDocuments["method"] = 'view';
    }
    this.ref.reattach();
   

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

}