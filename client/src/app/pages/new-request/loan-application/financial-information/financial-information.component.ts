import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { CommonService } from "../../../../services/common.service";
import { Router } from '@angular/router';
import { FinancialInformationModalsComponent } from '../financial-information/financial-information-modals/financial-information-modals.component';
import { LoanApplicationService } from "../../../../services/loan-application.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from "../../../../services/communications.service";
import { CommonCommentsService } from '../../../../services/common-comments.service';
import { _ } from 'underscore'; 
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'financial-information',
  templateUrl: './financial-information.component.html',
  styleUrls: ['./financial-information.component.scss']
})

export class LoanApplicationFinancialInformationComponent implements OnInit {
  landloanrequeststatus: any = 0;
  add_edit_delete_show = true;

  // source_of_finance_comments = { hasComments: false ,PrqOrLoan:"NPRE", SectionCode: "PRSEC", SubSectionCode: "", commentArray : [] };
  // asset_statement_comments = { hasComments: false ,PrqOrLoan:"NLOA", SectionCode: "LONFI", SubSectionCode: "", commentArray : []};
  // liabilities_statement_comments = { hasComments: false ,PrqOrLoan:"NLOA", SectionCode: "LONFI", SubSectionCode: "", commentArray : []};
  // income_statement_comments = { hasComments: false ,PrqOrLoan:"NLOA", SectionCode: "LONFI", SubSectionCode: "", commentArray : []};
  // financial_flow_comments = { hasComments: false ,PrqOrLoan:"NLOA", SectionCode: "LONFI", SubSectionCode: "", commentArray : []};

  tour_en: any;

  tour_ar: any;

  loanTypeValues = {
    loanType: "",
    selectedLoanType: {},
    selectedLoanTypeOperation: "",
    loanTypeList: []
  };

  commentsFrom = "";
  commentArray = {};
  commentArrayExists = false;

  source_of_finance_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FISOU", commentDetails: {}, commentArray: [] };
  asset_statement_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FIBAL", commentDetails: {}, commentArray: [] };
  liabilities_statement_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FILEQ", commentDetails: {}, commentArray: [] };
  income_statement_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FIINC", commentDetails: {}, commentArray: [] };
  // financial_flow_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FIINC", commentDetails: {}, commentArray: [] };
  business_case_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FIBUC", commentDetails: {}, commentArray: [] };

 serviceId=9;
  panelStep = 1;

  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  ChecklistPer = 0;

  totpercent = 0;
  totprjamount = 0;

  operation = "C";

  projId = 0;

  flag = 0;

  assetflag = 0;
  liabilityflag = 0;
  incomeflag = 0;
  financialflowflag = 0;

  documentStructure = {};

  source_of_finance_visible = true;
  asset_statement_visible = false;
  liabilities_statement_visible = false;
  income_statement_visible = false;
  financial_flow_visible = false;

  source_of_finance_edit_button_visible = false;
  asset_statement_edit_button_visible = false;
  liabilities_statement_edit_button_visible = false;
  income_statement_edit_button_visible = false;
  financial_flow_edit_button_visible = false;

  source_of_finance_delete_button_visible = false;
  asset_statement_delete_button_visible = false;
  liabilities_statement_delete_button_visible = false;
  income_statement_delete_button_visible = false;
  financial_flow_delete_button_visible = false;

  source_of_finance_view_button_visible = false;
  asset_statement_view_button_visible = false;
  liabilities_statement_view_button_visible = false;
  income_statement_view_button_visible = false;
  financial_flow_view_button_visible = false;

  asset_statement_years = [];
  liabilities_statement_years = [];
  income_statement_years = [];
  financial_flow_years = [];

  assetId = [];
  liabilityId = [];
  incomeId = [];
  flowsourceId = [];

  assetGuId = [];
 liabilityGuId = [];
  incomeGuId = [];
  flowsourceGuId = [];



  Cofinancers = [];
  relations_list = [];
  relations_externalidp_list = [];

  deleted_source_of_finance_source = [];

  cofinbprelation = {};

  pastYear = 0;
  futureYear = 0;
  yearArray = [];

  ExtidType_list = [];

  ExtidType_Desc_list = [];

  BpRelations_list = [];

  BpRelations_desc_list = [];

  CofinsType_list = [];

  CofinsType_Desc_list = [];

  country_list = [];

  country_name_list = [];

  mainassetlist = [];

  mainliablist = [];

  mainincomelist = [];

  isdelete = "false";

  MyLoanComm: any = {};

  lang=this.commonService.defaultLanguage;

  allPanelsExpanded = false;

  setPanelStep(index: number) {
    this.panelStep = index;
    if (this.panelStep === 2) {
      this.assetflag = 0;
    }
    else if (this.panelStep === 3) {
      this.liabilityflag = 0;
    }
    else if (this.panelStep === 4) {
      this.incomeflag = 0;
    }
    else if (this.panelStep === 5) {
      this.financialflowflag = 0;
    }
  }

  nextPanelStep() {

    if (this.panelStep === 2) {
      this.assetflag = 1;
    }

    else if (this.panelStep === 3) {
      this.liabilityflag = 1;
    }

    else if (this.panelStep === 4) {
      this.incomeflag = 1;
    }

    else if (this.panelStep === 5) {
      this.financialflowflag = 1;
    }


    this.panelStep++;


  }

  prevPanelStep() {


    this.panelStep--;

    if (this.panelStep === 2) {
      this.assetflag = 0;
    }
    else if (this.panelStep === 3) {
      this.liabilityflag = 0;
    }
    else if (this.panelStep === 4) {
      this.incomeflag = 0;
      this.financialflowflag = 0;
    }
  }

  expandAllPanels(mode) {

    this.panelStep = 0;

    if (mode == 0)
      this.allPanelsExpanded = true;

    else if (mode == 1)
      this.allPanelsExpanded = false;

  }

  deleteCancelModalReference: any;

  startedFilling = 0;

  source_of_finance_source: LocalDataSource;
  source_of_finance_new_partner_source: LocalDataSource;
  asset_statement_source: LocalDataSource;
  liabilities_statement_source: LocalDataSource;
  income_statement_source: LocalDataSource;
  project_financial_flows_source: LocalDataSource;

  source_of_finance_source_length = 0;
  source_of_finance_new_partner_source_length = 0;
  asset_statement_source_length = 0;
  liabilities_statement_source_length = 0;
  income_statement_source_length = 0;
  project_financial_flows_source_length = 0;

  statusCode = "";

  commentTypeCode = "";

  commentCommId = 0;

  translate: any;

  constructor(public commonService: CommonService, private communicationsService: CommunicationsService, private loanApplicationService: LoanApplicationService, private toastr: ToastrService, private modalService: NgbModal, private router: Router, private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService,
    private commonCommentsService: CommonCommentsService ,  private localStorage:LocalStorage) {

    this.translate = this.commonService.returnTranslate();

    this.tour_en = this.commonService.returnEnglishTour();
    this.tour_ar = this.commonService.returnArabicTour();
  }

  requestId = 0;

  source_of_finance_settings = { hideSubHeader: true, noDataMessage: "", mode: "", edit: {}, delete: {}, actions: {}, columns: {} };
  asset_statement_settings = { hideSubHeader: true, noDataMessage: "", mode: "", add: {}, edit: {}, actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
  liabilities_statement_settings = { hideSubHeader: true, noDataMessage: "", mode: "", add: {}, edit: {}, actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
  income_statement_settings = { hideSubHeader: true, noDataMessage: "", mode: "", actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
  project_financial_flows_settings = { hideSubHeader: true, noDataMessage: "", mode: "", add: {}, edit: {}, actions: {}, columns: {}, pager: {}, rowClassFunction: {} };

  source_of_finance_settings_ar = { hideSubHeader: true, noDataMessage: "", mode: "", edit: {}, delete: {}, actions: {}, columns: {} };
  asset_statement_settings_ar = { hideSubHeader: true, noDataMessage: "", mode: "", add: {}, edit: {}, actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
  liabilities_statement_settings_ar = { hideSubHeader: true, noDataMessage: "", mode: "", add: {}, edit: {}, actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
  income_statement_settings_ar = { hideSubHeader: true, noDataMessage: "", mode: "", actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
  project_financial_flows_settings_ar = { hideSubHeader: true, noDataMessage: "", mode: "", add: {}, edit: {}, actions: {}, columns: {}, pager: {}, rowClassFunction: {} };
 
  service_Id = 9; 
  ngOnInit() {

    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
this.localStorage.getItem("serviceId").subscribe(data=> { 
  
  if (data)
  this.serviceId =data;    
    this.source_of_finance_settings = {

      hideSubHeader: true,

      noDataMessage: "No Source of Finance Found",

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

        TypeId: {
          title: "Source of Finance",
          type: "number"
        },
        Amount: {
          title: "Amount",
          type: "number"
        },
        Percent: {
          title: "Percent",
          type: "number"
        },
        ExtId: {
          title: "Comments",
          type: "text"
        }
      }
    };

    this.source_of_finance_settings_ar = {

      hideSubHeader: true,

      noDataMessage: "لا يوجد مصدر للتمويل العثور على",

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
        columnTitle: "أفعال"
      },

      columns: {

        TypeId: {
          title: "مصدر التمويل",
          type: "number"
        },
        Amount: {
          title: "كمية",
          type: "number"
        },
        Percent: {
          title: "نسبه مئويه",
          type: "number"
        },
        ExtId: {
          title: "التعليقات",
          type: "text"
        }
      }
    };

    this.asset_statement_settings = {

      noDataMessage: "No asset statement Found",

      mode: "external",

      hideSubHeader: true,

      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        assets: {
          title: "Assets",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 30,
      },

      rowClassFunction: (row) => {
        if (row.data.assets === "Total Current Assets" || row.data.assets === "Total Fixed Assets" || row.data.assets === "Net Fixed Assets" ||
          row.data.assets === "Total Intangibles" || row.data.assets === " Net Intangibles" || row.data.assets === "Total Assets") {

          return 'highlight';
        }


      }


    };

    this.asset_statement_settings_ar = {

      noDataMessage: "لا يوجد بيان الأصول تم العثور عليه",

      mode: "external",

      hideSubHeader: true,

      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        assets: {
          title: "الأصول",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 30,
      },

      rowClassFunction: (row) => {
        if (row.data.assets === "Total Current Assets" || row.data.assets === "Total Fixed Assets" || row.data.assets === "Net Fixed Assets" ||
          row.data.assets === "Total Intangibles" || row.data.assets === " Net Intangibles" || row.data.assets === "Total Assets") {

          return 'highlight';
        }


      }


    };

    this.liabilities_statement_settings = {

      noDataMessage: "No Liabilities Statement Found",

      mode: "external",

      hideSubHeader: true,

      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        liabilities: {
          title: "Liabilities",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 25,
      },

      rowClassFunction: (row) => {
        if (row.data.liabilities === "Total Current Liabilities" || row.data.liabilities === "Total Long Term Debt" || row.data.liabilities === "Total Liabilities" ||
          row.data.liabilities === "Total Equity" || row.data.liabilities === "Net Intangibles" || row.data.liabilities === "Total liability & Equity") {

          return 'highlight';
        }
      }
    };

    this.liabilities_statement_settings_ar = {

      noDataMessage: "بيان الخصوم لم يتم العثور على",

      mode: "external",

      hideSubHeader: true,

      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        liabilities: {
          title: "المطلوبات",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 25,
      },

      rowClassFunction: (row) => {
        if (row.data.liabilities === "Total Current Liabilities" || row.data.liabilities === "Total Long Term Debt" || row.data.liabilities === "Total Liabilities" ||
          row.data.liabilities === "Total Equity" || row.data.liabilities === "Net Intangibles" || row.data.liabilities === "Total liability & Equity") {

          return 'highlight';
        }
      }
    };

    this.income_statement_settings = {

      noDataMessage: "No Income Statement Found",

      mode: "external",

      hideSubHeader: true,

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        Income: {
          title: "Income",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 25,
      },

      rowClassFunction: (row) => {
        if (row.data.Income === "Total of Cost Of Goods" || row.data.Income === "Gross Margin" || row.data.Income === "Total Indirect Cost" ||
          row.data.Income === "Profit before Zakat" || row.data.Income === "Profit after Zakat" || row.data.Income === "Retained Earnings") {

          return 'highlight';
        }
      }

    };

    this.income_statement_settings_ar = {

      noDataMessage: "بيان الدخل لم يتم العثور على",

      mode: "external",

      hideSubHeader: true,

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        Income: {
          title: "الإيرادات",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 25,
      },

      rowClassFunction: (row) => {
        if (row.data.Income === "Total of Cost Of Goods" || row.data.Income === "Gross Margin" || row.data.Income === "Total Indirect Cost" ||
          row.data.Income === "Profit before Zakat" || row.data.Income === "Profit after Zakat" || row.data.Income === "Retained Earnings") {

          return 'highlight';
        }
      }

    };

    this.project_financial_flows_settings = {

      noDataMessage: "No Financial Cash Flow Statement Found",

      mode: "external",

      hideSubHeader: true,

      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        financial_inflows: {
          title: "Cash Flow",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 25,
      },

      rowClassFunction: (row) => {
        if (row.data.financial_inflows === "Total Sources" || row.data.financial_inflows === "Total Uses" || row.data.financial_inflows === "Cash Flow" || row.data.financial_inflows === "Ending Cash") {

          return 'highlight';
        }
      }

    };

    this.project_financial_flows_settings_ar = {

      noDataMessage: "بيان التدفقات النقدية المالية لا وجدت",

      mode: "external",

      hideSubHeader: true,

      add: {
        addButtonContent: '<i class="nb-plus"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false
      },

      columns: {
        financial_inflows: {
          title: "تدفق مالي",
          type: "string",
          filter: false
        },
      },

      pager: {
        display: true,
        perPage: 25,
      },

      rowClassFunction: (row) => {
        if (row.data.financial_inflows === "Total Sources" || row.data.financial_inflows === "Total Uses" || row.data.financial_inflows === "Cash Flow" || row.data.financial_inflows === "Ending Cash") {

          return 'highlight';
        }
      }

    };



    this.spinnerService.show();

    //PUSHING YEARS INTO ARRAY

    var curDate = new Date();
    var footerYear1 = curDate.getFullYear();
    this.pastYear = footerYear1 - 15;
    this.futureYear = footerYear1 + 15;

    for (var i = this.pastYear - 1; i <= this.futureYear; i++)
      if (i === this.pastYear - 1)
        this.yearArray.push("Select Year");
      else
        this.yearArray.push(i);



    this.requestId = this.customerProfileService.loanRequestId;
    this.projId = this.customerProfileService.loanArray.ProjId;
    this.statusCode = this.customerProfileService.statusCode;

  if (this.landloanrequeststatus == 41 || this.landloanrequeststatus == 40)
    this.add_edit_delete_show = true;
  else
    this.add_edit_delete_show = false;
    
    this.loanTypeValues = this.customerProfileService.loanArray.LoanTypeValues;

    // this.commentTypeCode = this.customerProfileService.commentTypeCode;
    // this.commentCommId = this.customerProfileService.commentCommId;

    if (this.requestId == 0)
      this.router.navigateByUrl('/pages/new-request/loan-application');

    else {

      //DROPDOWNS

      this.ExtidType_list = this.customerProfileService.loanDropdowns.ExtidType;

      this.BpRelations_list = this.customerProfileService.loanDropdowns.BpRelations;

      this.CofinsType_list = this.customerProfileService.loanDropdowns.CofinsType;

      this.country_list = this.customerProfileService.loanDropdowns.Country;

      if (this.ExtidType_list && this.ExtidType_list.length > 0)
        for (var i = 0; i < this.ExtidType_list.length; i++)
          this.ExtidType_Desc_list.push(this.lang=='en'?this.ExtidType_list[i].Desc:this.ExtidType_list[i].DescAr);

      if (this.BpRelations_list && this.BpRelations_list.length > 0)
        for (var i = 0; i < this.BpRelations_list.length; i++)
          this.BpRelations_desc_list.push(this.lang=='en'?this.BpRelations_list[i].Desc:this.BpRelations_list[i].DescAr);

      if (this.CofinsType_list && this.CofinsType_list.length > 0)
        for (var i = 0; i < this.CofinsType_list.length; i++)
          this.CofinsType_Desc_list.push(this.lang=='en'?this.CofinsType_list[i].Desc:this.CofinsType_list[i].DescAr);

      if (this.country_list && this.country_list.length > 0)
        for (var i = 0; i < this.country_list.length; i++)
          this.country_name_list.push(this.lang=='en'?this.country_list[i].Name:this.country_list[i].DescAr);


      //For Source of Finance

      this.source_of_finance_source = new LocalDataSource();

      this.source_of_finance_new_partner_source = new LocalDataSource();

      // For Assets

      this.asset_statement_source = new LocalDataSource();

      var asset_statement_source_data_array = [];

      var asset_statement_list = this.translate.instant('FINANCIAL_INFORMATION.assetarray');
      this.mainassetlist = this.translate.instant('FINANCIAL_INFORMATION.assetarray');

      for (var i = 0; i < asset_statement_list.length; i++) {
        var asset_statement_list_item = asset_statement_list[i];

        asset_statement_source_data_array.push({
          assets: asset_statement_list_item,
        }
        );
      }

      this.asset_statement_source.load(asset_statement_source_data_array);

      this.asset_statement_source_length++;

      this.asset_statement_source.refresh();

      // For Liabilities

      this.liabilities_statement_source = new LocalDataSource();

      var liabilities_statement_source_data_array = [];

      var liabilities_statement_list = this.translate.instant('FINANCIAL_INFORMATION.liabilityarray');
      this.mainliablist = this.translate.instant('FINANCIAL_INFORMATION.liabilityarray');

      for (var i = 0; i < liabilities_statement_list.length; i++) {
        var liabilities_statement_list_item = liabilities_statement_list[i];

        liabilities_statement_source_data_array.push({
          liabilities: liabilities_statement_list_item,
       }
        );
      }

      this.liabilities_statement_source.load(liabilities_statement_source_data_array);

      this.liabilities_statement_source_length++;

      this.liabilities_statement_source.refresh();



      //For Income Statement

      this.income_statement_source = new LocalDataSource();

      var income_statement_source_data_array = [];

      //var income_statement_list = "Sales|Raw Materials|Direct Labour|Maintenance|Utilities|Depreciation|Amortization|Total of Cost Of Goods|Gross Margin|Sales,Gen. & Admin|Salaries|Finance Charges|Other Indirect Expenses|Other Direct Expenses|Total Indirect Cost|Profit before Zakat|Zakat|Profit after Zakat|Statutory Reserve|Dividends|Retained Earnings|Audited / UnAudited Files|Comments".split("|");

      var income_statement_list = this.translate.instant('FINANCIAL_INFORMATION.incomestatementarray');
      this.mainincomelist = this.translate.instant('FINANCIAL_INFORMATION.incomestatementarray');

      for (var i = 0; i < income_statement_list.length; i++) {
        var income_statement_list_item = income_statement_list[i];

        income_statement_source_data_array.push({
          Income: income_statement_list_item,
        }
        );
      }

      this.income_statement_source.load(income_statement_source_data_array);

      this.income_statement_source_length++;

      this.income_statement_source.refresh();


      //For Finacial Flow Statement

      this.project_financial_flows_source = new LocalDataSource();

      var project_financial_flows_source_data_array = [];

      var project_financial_flows_list = this.translate.instant('FINANCIAL_INFORMATION.flowstatementarray');

      for (var i = 0; i < project_financial_flows_list.length; i++) {
        var project_financial_flows_list_item = project_financial_flows_list[i];

        project_financial_flows_source_data_array.push({
          financial_inflows: project_financial_flows_list_item,
        }
        );

      }

      this.project_financial_flows_source.load(project_financial_flows_source_data_array);

      this.project_financial_flows_source_length++;

      this.project_financial_flows_source.refresh();

      this.getLoanApplicationFinancingInformation();

    }

    if (this.statusCode == 'P' || this.statusCode == 'A') {
      this.source_of_finance_settings.actions = false;
      this.source_of_finance_settings_ar.actions = false;
    }
  });
  }


  onAdd(table_name) {

    if (table_name === 'source_of_finance_cofinancer' || table_name === 'asset_statement' || this.asset_statement_years.length > 0) {
      let financialInformationModalParams = {};

      if (table_name === 'source_of_finance_cofinancer') {

        if (this.totprjamount > 0) {

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.AddSourcesofFunds'),

            method: "add_normal",

            filter: false,

            inputs: [

              {
                id: "TypeId",
                name: this.translate.instant('FINANCIAL_INFORMATION.SourceofFinance'),
                type: "select",
                value: this.CofinsType_Desc_list,
                selected: "",
                required: "true",
              },
              {
                id: "Amount",
                name: this.translate.instant('FINANCIAL_INFORMATION.Amount'),
                type: "currency",
                value: "",
                required: "true",
              },
              {
                id: "Percent",
                name: this.translate.instant('FINANCIAL_INFORMATION.Percent'),
                type: "number",
                value: "",
                required: "true",
              },
              {
                id: "ExtId",
               name: this.translate.instant('FINANCIAL_INFORMATION.Comments'),
                type: "textarea",
                value: "",
                required: "false",
              },
              {
                id: "alert"
              }

            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  var source_of_finance_temp_source = [];

                  var tot_percent = 0;

                  this.source_of_finance_source.getAll().then((res) => {

                    source_of_finance_temp_source = res;
                    source_of_finance_temp_source.pop();
                    for (var i = 0; i < source_of_finance_temp_source.length; i++) {

                      tot_percent += parseFloat(source_of_finance_temp_source[i].Percent);
                    }

                    tot_percent += parseFloat(modal_data.inputs[2].value);

                    if (tot_percent > 100) {
                      this.commonService.showFailureToast(this.commonService.defaultLanguage == 'ar'?"لا يمكن أن تتجاوز النسبة المئوية الإجمالية لجميع مصادر التمويل 100٪":"Total Percent of all Source of Finance can't exceed 100%");
                    }
                    else {
                      this.spinnerService.show();

                      var TypeId_typecode = "";

                      var source_of_finance_source_data_array = [];

                      // var source_of_finance_source_data = {ExtId: modal_data.inputs[0].selected, Amount: modal_data.inputs[1].value, Percent: modal_data.inputs[2].value,
                      //                                      TypeId: modal_data.inputs[3].selected, Operation: "C"};

                      var source_of_finance_source_data = {
                        TypeId: modal_data.inputs[0].selected, Amount: "SAR " + this.numberWithCommas(modal_data.inputs[1].value), Percent: modal_data.inputs[2].value,
                        ExtId: modal_data.inputs[3].value, Operation: "C"
                      };

                      source_of_finance_source_data_array.push(source_of_finance_source_data);

                      if (this.source_of_finance_source_length == 0)
                        this.source_of_finance_source.load(source_of_finance_source_data_array);

                      else
                        this.source_of_finance_source.add(source_of_finance_source_data);

                      this.source_of_finance_source_length++;



                      var cofin_type = this.CofinsType_list.find((o) => o.DescAr === modal_data.inputs[0].selected||o.Desc === modal_data.inputs[0].selected);
                      if (cofin_type)
                        TypeId_typecode = cofin_type.Id;

                      var source_of_finance_final_post_data = {
                        "Cofinancers": [
                          {
                            "_comment1": "The below financing plan id is the loan id inputted in technical section under loan id field",
                            "FinancingPlanId": this.customerProfileService.loanArray.FinPlanId,
                            "ExtId": modal_data.inputs[3].value,
                            "Amount": modal_data.inputs[1].value.replace("SAR ", "").replace(/,/g, ""),
                            "Percent": modal_data.inputs[2].value,
                            // sentRequestId
                            "SentReqId": JSON.stringify(this.requestId),
                            "Type": {
                              "Id": TypeId_typecode
                            },
                            "Operation": "C"
                          }
                        ]

                      };

                      this.source_of_finance_source.refresh();


                      //create cofinacier 
                      this.loanApplicationService
                        .postcofinancier(source_of_finance_final_post_data)
                        .then((res) => (this.postcofinancier(res)), err => console.log(err));



                      // this.commonService.showSuccessToast("Addition successful !");
                    }
                  });
                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;
        }
        else {
          this.commonService.showFailureToast(this.commonService.defaultLanguage == 'ar'?"يرجى تقديم تفاصيل تكلفة المكون في القسم الفني أولاً":"Please provide Component Cost Details in Technical Section first");
        }


      }

      else if (table_name === 'source_of_finance_new_partner') {

        financialInformationModalParams = {

          header: "Add New Partner",

          page: "source_of_finance",

          method: "add_normal",

          filter: false,

          inputs: [

            {
              id: "Externalid",
              name: "External ID",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Extidtype",
              name: "External ID Type",
              type: "select",
              value: this.ExtidType_Desc_list,
              selected: "",
              required: "true",
            },
            {
              id: "Firstname",
              name: "First Name",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Lastname",
              name: "Last Name",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Street",
              name: "Street",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Area",
              name: "Area",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "City",
              name: "City",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Country",
              name: "Country",
              type: "select",
              value: this.country_name_list,
              selected: "",
              required: "true",
            },
            {
              id: "Zip",
              name: "Zip Code",
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "Phone1",
              name: "Phone Number",
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "Fax",
              name: "Fax",
              type: "number",
              value: "",
            },
            {
              id: "Mail",
              name: "Email ID",
              type: "text",
              value: "",
              required: "true",
            }
          ],
          buttons: [
            {
              name: "Save",
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {

                var extidtype_desc = "", country_desc = "", relationtype_desc = "";

                var extidtype_list = this.ExtidType_list.find((o) => o.DescAr === modal_data.inputs[1].selected||o.Desc === modal_data.inputs[1].selected);
                if (extidtype_list)
                  extidtype_desc = extidtype_list.Id;

                var country_list = this.country_list.find((o) => o.DescAr === modal_data.inputs[7].selected|| o.Name === modal_data.inputs[7].selected);
                if (country_list)
                  country_desc = country_list.Code;

                var relationtype_list = this.BpRelations_list.find((o) => o.DescAr == modal_data.inputs[11].selected|| o.Desc == modal_data.inputs[11].selected);
                if (relationtype_list)
                  relationtype_desc = relationtype_list.Id;

                var source_of_finance_new_partner_source_data_array = {};

                var relations_source_data = { Externalidp: this.customerProfileService.loanArray.FactoryCr, Operation: "C", Relationtype: "SIDF02" };

                var source_of_finance_new_partner_source_data = {
                  Externalid: modal_data.inputs[0].value, Extidtype: extidtype_desc, Firstname: modal_data.inputs[2].value, Lastname: modal_data.inputs[3].value, Street: modal_data.inputs[4].value,
                  Area: modal_data.inputs[5].value, City: modal_data.inputs[6].value, Country: country_desc, Zip: modal_data.inputs[8].value, Phone1: modal_data.inputs[9].value, Fax: modal_data.inputs[10].value,
                  Mail: modal_data.inputs[11].value, Relations: [relations_source_data], Operation: "C"
                };

                source_of_finance_new_partner_source_data_array = source_of_finance_new_partner_source_data;


                // this.source_of_finance_new_partner_source.load(source_of_finance_new_partner_source_data_array);

                //create NEW PARTNER 

                this.loanApplicationService
                  .createBpRelation(source_of_finance_new_partner_source_data_array)
                  .then((res) => (this.postcofinancier(res)), err => console.log(err));



                //this.source_of_finance_source_length++;



                //this.commonService.showSuccessToast("Addition successful !");



              }
            }
          ]
        };

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }

      else if (table_name === 'asset_statement') {

        financialInformationModalParams = {

          header: this.translate.instant('FINANCIAL_INFORMATION.addassetheader'),

          page: "Asset",

          method: "add",

          filter: false,

          val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6, 7] },
          { action: "add", values: [8, 9, 10, 11, 12, 13, 14, 15, 16] },
          { action: "sub", values: [16, 17, 18] },
          { action: "add", values: [20, 21, 22] },
          { action: "sub", values: [22, 23, 24] },
          { action: "add", values: [7, 18, 19, 25] }],

          data_settings: this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar,

          inputs: [
            {
              id: "year",
              name: this.translate.instant('FINANCIAL_INFORMATION.year'),
              type: "select",
              value: this.yearArray,
              selected: this.yearArray[0],
              required: "true",
            },
            {
              id: "factoryCash",
              name: this.mainassetlist[0],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "accountReceivable",
              name: this.mainassetlist[1],
              type: "text",
              value: "",
             required: "true",
            },
            {
              id: "inventory",
              name: this.mainassetlist[2],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "lcMargin",
              name: this.mainassetlist[3],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "prepaid",
              name: this.mainassetlist[4],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "other1",
              name: this.mainassetlist[5],
              type: "text",
              value: "",
             required: "true",
            },
            {
              id: "currentAssets",
              name: this.mainassetlist[6],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "land",
              name: this.mainassetlist[7],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "buildings",
              name: this.mainassetlist[8],
              type: "text",
              value: "",
              required: "true",
            },

            {
              id: "machinery",
              name: this.mainassetlist[9],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "furniture",
              name: this.mainassetlist[10],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "vehicles",
              name: this.mainassetlist[11],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "lossPrevention",
              name: this.mainassetlist[12],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "other2",
              name: this.mainassetlist[13],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "contingencies",
              name: this.mainassetlist[14],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totalFixedAssets",
              name: this.mainassetlist[15],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "accumDepreciation",
              name: this.mainassetlist[16],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "netFixedAssets",
              name: this.mainassetlist[17],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "otherNonCurrentAssets",
              name: this.mainassetlist[18],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "sidfCharge",
              name: this.mainassetlist[19],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "preoperatingExpense",
              name: this.mainassetlist[20],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totalIntangibles",
              name: this.mainassetlist[21],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "accumAmmortization",
              name: this.mainassetlist[22],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "netIntangibles",
              name: this.mainassetlist[23],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "totalAssets",
              name: this.mainassetlist[24],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "assetfiles",
              name: this.mainassetlist[25],
              type: "file",
             file: "",
              value: "",

            },
            {
              id: "Yearcom",
              name: this.mainassetlist[26],
              type: "textarea",
              value: "",
            },
            {
              id: "alert"
            }

          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var file_names = "";

                for (var i = 0; i < modal_data.inputs[26].file.length; i++)
                  if (i != (modal_data.inputs[26].file.length - 1))
                    file_names += modal_data.inputs[26].file[i].name + ", ";
                  else
                    file_names += modal_data.inputs[26].file[i].name;

                var selected_year = modal_data.inputs[0].selected;

                var randomNum = ""

               var randomNum = this.commonService.returnRandomNumber().toString();

                var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, modal_data.inputs[14].value, modal_data.inputs[15].value,
                modal_data.inputs[16].value, modal_data.inputs[17].value, modal_data.inputs[18].value, modal_data.inputs[19].value, modal_data.inputs[20].value,
                modal_data.inputs[21].value, modal_data.inputs[22].value, modal_data.inputs[23].value, modal_data.inputs[24].value, modal_data.inputs[25].value, file_names, modal_data.inputs[27].value];

                var mySettings = this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar;

                mySettings.columns["year_" + selected_year] = {
                  title: selected_year,
                  type: "string",
                  filter: false
                }

                this.asset_statement_years.push(selected_year);

                if (this.commonService.defaultLanguage == "en")
                  this.asset_statement_settings = Object.assign({}, mySettings);
                else
                  this.asset_statement_settings_ar = Object.assign({}, mySettings);

                var asset_statement_temp_source = [];

                var asset_statement_final_temp_source = [];

                this.asset_statement_source.getAll().then((res) => {

                  asset_statement_temp_source = res;

                  for (var i = 0; i < asset_statement_temp_source.length; i++) {
                    if (i < asset_statement_temp_source.length - 2)
                      asset_statement_temp_source[i]["year_" + selected_year] = "SAR " + this.numberWithCommas(year_values[i]);
                    else
                      asset_statement_temp_source[i]["year_" + selected_year] = year_values[i];
                  }

                  this.asset_statement_source.load(asset_statement_temp_source);

                  this.asset_statement_source.refresh();

                  this.assetflag = 2;

                  this.asset_statement_source.getAll().then((res) => {

                    asset_statement_temp_source = res;


                    for (var i = 0; i < this.asset_statement_years.length; i++) {

                      if (this.assetId[i]) {

                        asset_statement_final_temp_source.push({

                          "Operation": "U",
                          "Assetid": this.assetId[i],
                          "Year": this.asset_statement_years[i],
                          "Factorycash": asset_statement_temp_source[0]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accntsrec": asset_statement_temp_source[1]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Inventory": asset_statement_temp_source[2]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Lcmargins": asset_statement_temp_source[3]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Prepaid": asset_statement_temp_source[4]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other1": asset_statement_temp_source[5]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Currentassets": asset_statement_temp_source[6]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Land": asset_statement_temp_source[7]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Buildings": asset_statement_temp_source[8]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Machinery": asset_statement_temp_source[9]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Furniture": asset_statement_temp_source[10]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Vehicles": asset_statement_temp_source[11]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Lossprev": asset_statement_temp_source[12]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other2": asset_statement_temp_source[13]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Contigencies": asset_statement_temp_source[14]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totfixassets": asset_statement_temp_source[15]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accumdepre": asset_statement_temp_source[16]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Netfixassets": asset_statement_temp_source[17]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Otherncassets": asset_statement_temp_source[18]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Sidfcharge": asset_statement_temp_source[19]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Preopexp": asset_statement_temp_source[20]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totintang": asset_statement_temp_source[21]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accumamort": asset_statement_temp_source[22]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Netintang": asset_statement_temp_source[23]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totassets": asset_statement_temp_source[24]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Statetype": "H",
                          "GuiId": this.assetGuId[i],
                          "Yearcom": asset_statement_temp_source[26]["year_" + this.asset_statement_years[i]]

                        });
                      }
                      else {

                        asset_statement_final_temp_source.push({

                          "Operation": "C",
                          "Year": this.asset_statement_years[i],
                          "Factorycash": asset_statement_temp_source[0]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accntsrec": asset_statement_temp_source[1]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Inventory": asset_statement_temp_source[2]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Lcmargins": asset_statement_temp_source[3]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Prepaid": asset_statement_temp_source[4]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other1": asset_statement_temp_source[5]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Currentassets": asset_statement_temp_source[6]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Land": asset_statement_temp_source[7]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Buildings": asset_statement_temp_source[8]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Machinery": asset_statement_temp_source[9]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Furniture": asset_statement_temp_source[10]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Vehicles": asset_statement_temp_source[11]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Lossprev": asset_statement_temp_source[12]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other2": asset_statement_temp_source[13]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Contigencies": asset_statement_temp_source[14]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totfixassets": asset_statement_temp_source[15]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accumdepre": asset_statement_temp_source[16]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Netfixassets": asset_statement_temp_source[17]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Otherncassets": asset_statement_temp_source[18]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Sidfcharge": asset_statement_temp_source[19]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Preopexp": asset_statement_temp_source[20]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totintang": asset_statement_temp_source[21]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accumamort": asset_statement_temp_source[22]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Netintang": asset_statement_temp_source[23]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totassets": asset_statement_temp_source[24]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Statetype": "H",
                          "GuiId": randomNum,
                          "Yearcom": asset_statement_temp_source[26]["year_" + this.asset_statement_years[i]]

                        });
                      }


                    }


                    var asset_statement_post_data = {

                      "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                      "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                      "Bpid": this.customerProfileService.loanArray.BpId,
                      "Origin": "CP",
                      "Sentreqid": this.requestId,
                      "Customerid": "",
                      "Assetstat": asset_statement_final_temp_source,

                    };


                    this.loanApplicationService.postAssetStatement(asset_statement_post_data)
                      .then((res) => (this.onResult(res, 2, modal_data.inputs[26].file, randomNum)), err => console.log(err));


                    this.assetflag = 1;


                  });


                  // this.commonService.showSuccessToast("Addition successful !");

                  this.asset_statement_visible = true;

                  this.asset_statement_edit_button_visible = true;

                  this.asset_statement_delete_button_visible = true;

                  this.asset_statement_view_button_visible = true;

                });

              }
            }
          ]
        };

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }

      else if (table_name === 'liabilities_statement') {

        financialInformationModalParams = {

          header: this.translate.instant('FINANCIAL_INFORMATION.addliabilityheader'),

          page: "Liabilities",

          method: "add",

          val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
          { action: "add", values: [10, 11, 12, 13] },
          { action: "add", values: [9, 13, 14, 15] },
          { action: "add", values: [16, 17, 18, 19, 20, 21] },
          { action: "add", values: [15, 21, 22] }],

          data_settings: this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar,

          inputs: [
            {
              id: "year",
              name: this.translate.instant('FINANCIAL_INFORMATION.year'),
              type: "select",
              value: this.asset_statement_years,
              selected: "",
              required: "true",
            },
            {
              id: "accountsPayable",
              name: this.mainliablist[0],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "std",
              name: this.mainliablist[1],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "accruals",
              name: this.mainliablist[2],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "cplsidf",
              name: this.mainliablist[3],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "cplbank",
              name: this.mainliablist[4],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "cplother",
              name: this.mainliablist[5],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "other1",
              name: this.mainliablist[6],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "other2",
              name: this.mainliablist[7],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "currentliab",
              name: this.mainliablist[8],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "Ltdsidf",
              name: this.mainliablist[9],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "ltdbank",
              name: this.mainliablist[10],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "ltdother",
              name: this.mainliablist[11],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totltd",
              name: this.mainliablist[12],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "nonsubltd",
              name: this.mainliablist[13],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totliab",
              name: this.mainliablist[14],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "paidincap",
              name: this.mainliablist[15],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "suborddebt",
              name: this.mainliablist[16],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "retearn",
              name: this.mainliablist[17],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "statres",
              name: this.mainliablist[18],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "other3",
              name: this.mainliablist[19],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totequi",
              name: this.mainliablist[20],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "totliabeq",
              name: this.mainliablist[21],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "liabilityfiles",
              name: this.mainliablist[22],
              type: "file",
              file: "",
              value: "",

            },
            {
              id: "Yearcom",
              name: this.mainliablist[23],
              type: "textarea",
              value: "",
            },
            {
              id: "alert"
            }

          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var file_names = "";

                for (var i = 0; i < modal_data.inputs[23].file.length; i++)
                  if (i != (modal_data.inputs[23].file.length - 1))
                    file_names += modal_data.inputs[23].file[i].name + ", ";
                  else
                    file_names += modal_data.inputs[23].file[i].name;

                var selected_year = modal_data.inputs[0].selected;

                var randomNum = ""

                var randomNum = this.commonService.returnRandomNumber().toString();

                var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, modal_data.inputs[14].value, modal_data.inputs[15].value,
                modal_data.inputs[16].value, modal_data.inputs[17].value, modal_data.inputs[18].value, modal_data.inputs[19].value, modal_data.inputs[20].value,
                modal_data.inputs[21].value, modal_data.inputs[22].value, modal_data.inputs[23].value, modal_data.inputs[24].value];


                var mySettings = this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar;

                mySettings.columns["year_" + selected_year] = {
                  title: selected_year,
                  type: "string",
                  filter: false
                }

                this.liabilities_statement_years.push(selected_year);

                if (this.commonService.defaultLanguage == "en")
                  this.liabilities_statement_settings = Object.assign({}, mySettings);
                else
                  this.liabilities_statement_settings_ar = Object.assign({}, mySettings);

                var liabilities_statement_temp_source = [];

                var liabilities_statement_final_temp_source = [];

                this.liabilities_statement_source.getAll().then((res) => {

                  liabilities_statement_temp_source = res;

                  for (var i = 0; i < liabilities_statement_temp_source.length; i++) {
                    if (i < liabilities_statement_temp_source.length - 2)
                      liabilities_statement_temp_source[i]["year_" + selected_year] = "SAR " + this.numberWithCommas(year_values[i]);
                    else
                      liabilities_statement_temp_source[i]["year_" + selected_year] = year_values[i];
                  }

                  this.liabilities_statement_source.load(liabilities_statement_temp_source);

                  this.liabilities_statement_source.refresh();

                  this.liabilityflag = 2;

                  this.liabilities_statement_source.getAll().then((res) => {

                    liabilities_statement_temp_source = res;

                    for (var i = 0; i < this.liabilities_statement_years.length; i++) {

                      if (this.liabilityId[i]) {

                        liabilities_statement_final_temp_source.push({

                          "Operation": "U",
                          "Liabeqid": this.liabilityId[i],
                          "Year": this.liabilities_statement_years[i],
                          "Acpay": liabilities_statement_temp_source[0]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Std": liabilities_statement_temp_source[1]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accruals": liabilities_statement_temp_source[2]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cplsidf": liabilities_statement_temp_source[3]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cplbank": liabilities_statement_temp_source[4]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cplother": liabilities_statement_temp_source[5]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other1": liabilities_statement_temp_source[6]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other2": liabilities_statement_temp_source[7]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Currentliab": liabilities_statement_temp_source[8]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltd": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltdsidf": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltdbank": liabilities_statement_temp_source[10]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltdother": liabilities_statement_temp_source[11]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totltd": liabilities_statement_temp_source[12]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Nonsubltd": liabilities_statement_temp_source[13]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totliab": liabilities_statement_temp_source[14]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Paidincap": liabilities_statement_temp_source[15]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Suborddebt": liabilities_statement_temp_source[16]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Retearn": liabilities_statement_temp_source[17]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Statres": liabilities_statement_temp_source[18]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other3": liabilities_statement_temp_source[19]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totequi": liabilities_statement_temp_source[20]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totliabeq": liabilities_statement_temp_source[21]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Stattype": "H",
                          "GuiId": this.liabilityGuId[i],
                          "Yearcom": liabilities_statement_temp_source[23]["year_" + this.liabilities_statement_years[i]]

                        });



                      }
                      else {

                        liabilities_statement_final_temp_source.push({

                          "Operation": "C",
                          "Year": this.liabilities_statement_years[i],
                          "Acpay": liabilities_statement_temp_source[0]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Std": liabilities_statement_temp_source[1]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Accruals": liabilities_statement_temp_source[2]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cplsidf": liabilities_statement_temp_source[3]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cplbank": liabilities_statement_temp_source[4]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cplother": liabilities_statement_temp_source[5]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other1": liabilities_statement_temp_source[6]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other2": liabilities_statement_temp_source[7]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Currentliab": liabilities_statement_temp_source[8]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltd": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltdsidf": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltdbank": liabilities_statement_temp_source[10]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Ltdother": liabilities_statement_temp_source[11]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totltd": liabilities_statement_temp_source[12]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Nonsubltd": liabilities_statement_temp_source[13]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totliab": liabilities_statement_temp_source[14]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Paidincap": liabilities_statement_temp_source[15]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Suborddebt": liabilities_statement_temp_source[16]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Retearn": liabilities_statement_temp_source[17]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Statres": liabilities_statement_temp_source[18]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Other3": liabilities_statement_temp_source[19]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totequi": liabilities_statement_temp_source[20]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totliabeq": liabilities_statement_temp_source[21]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Stattype": "H",
                          "GuiId": randomNum,
                          "Yearcom": liabilities_statement_temp_source[23]["year_" + this.liabilities_statement_years[i]]

                        });


                      }


                    }

                    var liabilities_statement_post_data = {

                      "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                      "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                      "Bpid": this.customerProfileService.loanArray.BpId,
                      "Origin": "CP",
                      "Sentreqid": this.requestId,
                      "Customerid": "",
                      "Liabstat": liabilities_statement_final_temp_source,

                    };
                    //console.log(liabilities_statement_post_data);
                    this.loanApplicationService.postLiabilitiesStatement(liabilities_statement_post_data)
                      .then((res) => (this.onResult(res, 3, modal_data.inputs[23].file, randomNum)), err => console.log(err));

                    this.liabilityflag = 1;

                  });

                  // this.commonService.showSuccessToast("Addition successful !");

                  this.liabilities_statement_visible = true;

                  this.liabilities_statement_edit_button_visible = true;

                  this.liabilities_statement_delete_button_visible = true;

                  this.liabilities_statement_view_button_visible = true;
                  //
                });

              }
            }
          ]
        };

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }

      else if (table_name === 'income_statement') {

        financialInformationModalParams = {

          header: this.translate.instant('FINANCIAL_INFORMATION.addincomeheader'),

          page: "Income",

          method: "add",


          val_indices: [{ action: "add", values: [2, 3, 4, 5, 6, 7, 9] },
          { action: "sub", values: [1, 9, 10] },
          { action: "add", values: [11, 12, 13, 14, 8, 15] },
          { action: "sub", values: [10, 15, 16] },
          { action: "sub", values: [16, 17, 18] },
          { action: "sub", values: [18, 20, 19, 21] }],

          data_settings: this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar,

          inputs: [
            {
              id: "year",
              name: this.translate.instant('FINANCIAL_INFORMATION.year'),
              type: "select",
              value: this.asset_statement_years,
             selected: "",
              required: "true",
            },
            {
              id: "sales",
              name: this.mainincomelist[0],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "rawMaterials",
              name: this.mainincomelist[1],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "directLabour",
              name: this.mainincomelist[2],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "maintenance",
              name: this.mainincomelist[3],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "utilities",
              name: this.mainincomelist[4],
              type: "text",
              value: "",
             required: "true",
            },
            {
              id: "depreciation",
              name: this.mainincomelist[5],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "amortization",
              name: this.mainincomelist[6],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Othdirexp",
              name: this.mainincomelist[7],
              type: "text",
              value: "",
              required: "true",
            },
           {
              id: "Cgs",
              name: this.mainincomelist[8],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "grossMargin",
              name: this.mainincomelist[9],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "salesGenAdmin",
              name: this.mainincomelist[10],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "salaries",
              name: this.mainincomelist[11],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Finchar",
              name: this.mainincomelist[12],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Othexp",
              name: this.mainincomelist[13],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Totindcost",
              name: this.mainincomelist[14],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "Pbtzak",
              name: this.mainincomelist[15],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "Taxzak",
              name: this.mainincomelist[16],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "profitzatak",
              name: this.mainincomelist[17],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "statres",
              name: this.mainincomelist[18],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "dividends",
              name: this.mainincomelist[19],
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Retear",
              name: this.mainincomelist[20],
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "incomefiles",
              name: this.mainincomelist[21],
              type: "file",
              file: "",
              value: "",

            },
            {
              id: "Yearcom",
              name: this.mainincomelist[22],
              type: "textarea",
              value: "",
            },
            {
              id: "alert"
            }

          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {

                this.spinnerService.show();

                var file_names = "";

                for (var i = 0; i < modal_data.inputs[22].file.length; i++)
                  if (i != (modal_data.inputs[22].file.length - 1))
                    file_names += modal_data.inputs[22].file[i].name + ", ";
                  else
                    file_names += modal_data.inputs[22].file[i].name;

                var selected_year = modal_data.inputs[0].selected;

                var randomNum = ""

                var randomNum = this.commonService.returnRandomNumber().toString();

                var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, modal_data.inputs[14].value, modal_data.inputs[15].value,
                modal_data.inputs[16].value, modal_data.inputs[17].value, modal_data.inputs[18].value, modal_data.inputs[19].value, modal_data.inputs[20].value,
                modal_data.inputs[21].value, file_names, modal_data.inputs[23].value];

                var mySettings = this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar;

                mySettings.columns["year_" + selected_year] = {
                  title: selected_year,
                  type: "string",
                  filter: false
                }

                this.income_statement_years.push(selected_year);

                if (this.commonService.defaultLanguage == "en")
                  this.income_statement_settings = Object.assign({}, mySettings);
                else
                  this.income_statement_settings_ar = Object.assign({}, mySettings);

                var income_statement_temp_source = [];

                var income_statement_final_temp_source = [];

                this.income_statement_source.getAll().then((res) => {

                  income_statement_temp_source = res;

                  for (var i = 0; i < income_statement_temp_source.length; i++) {
                    if (i < income_statement_temp_source.length - 2)
                      income_statement_temp_source[i]["year_" + selected_year] = "SAR " + this.numberWithCommas(year_values[i]);
                    else
                      income_statement_temp_source[i]["year_" + selected_year] = year_values[i];
                  }

                  this.income_statement_source.load(income_statement_temp_source);

                  this.income_statement_source.refresh();

                  this.incomeflag = 2;

                  this.income_statement_source.getAll().then((res) => {

                    income_statement_temp_source = res;

                    for (var i = 0; i < this.income_statement_years.length; i++) {

                      if (this.incomeId[i]) {

                        income_statement_final_temp_source.push({

                          "Operation": "U",
                          "Incomeid": this.incomeId[i],
                          "Year": this.income_statement_years[i],
                          "Sales": income_statement_temp_source[0]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Rawmat": income_statement_temp_source[1]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Dirlab": income_statement_temp_source[2]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Maint": income_statement_temp_source[3]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Utils": income_statement_temp_source[4]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Deprec": income_statement_temp_source[5]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Amort": income_statement_temp_source[6]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Othdirexp": income_statement_temp_source[7]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cgs": income_statement_temp_source[8]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Grossmar": income_statement_temp_source[9]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Salesad": income_statement_temp_source[10]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Salar": income_statement_temp_source[11]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Finchar": income_statement_temp_source[12]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Othexp": income_statement_temp_source[13]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totindcost": income_statement_temp_source[14]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Pbtzak": income_statement_temp_source[15]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Taxzak": income_statement_temp_source[16]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Profit": income_statement_temp_source[17]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Statres": income_statement_temp_source[18]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Divid": income_statement_temp_source[19]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Retear": income_statement_temp_source[20]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Yearcom": income_statement_temp_source[22]["year_" + this.income_statement_years[i]],
                          "GuiId": this.incomeGuId[i],
                          "Type": "H"

                        });


                      }
                      else {

                        income_statement_final_temp_source.push({

                          "Operation": "C",
                          "Year": this.income_statement_years[i],
                          "Sales": income_statement_temp_source[0]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Rawmat": income_statement_temp_source[1]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Dirlab": income_statement_temp_source[2]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Maint": income_statement_temp_source[3]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Utils": income_statement_temp_source[4]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Deprec": income_statement_temp_source[5]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Amort": income_statement_temp_source[6]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Othdirexp": income_statement_temp_source[7]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Cgs": income_statement_temp_source[8]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Grossmar": income_statement_temp_source[9]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Salesad": income_statement_temp_source[10]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Salar": income_statement_temp_source[11]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Finchar": income_statement_temp_source[12]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Othexp": income_statement_temp_source[13]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Totindcost": income_statement_temp_source[14]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Pbtzak": income_statement_temp_source[15]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Taxzak": income_statement_temp_source[16]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Profit": income_statement_temp_source[17]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Statres": income_statement_temp_source[18]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Divid": income_statement_temp_source[19]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Retear": income_statement_temp_source[20]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                          "Yearcom": income_statement_temp_source[22]["year_" + this.income_statement_years[i]],
                          "GuiId": randomNum,
                          "Type": "H"

                        });

                      }



                    }

                    var income_statement_post_data = {

                      "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                      "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                      "Bpid": this.customerProfileService.loanArray.BpId,
                      "Origin": "CP",
                      "Sentreqid": this.requestId,
                      "Customerid": "",
                      "Incstat": income_statement_final_temp_source,


                    };

                    this.loanApplicationService.postIncomeStatement(income_statement_post_data)
                      .then((res) => (this.onResult(res, 4, modal_data.inputs[22].file, randomNum)), err => console.log(err));

                    this.incomeflag = 1;

                  });

                  //this.commonService.showSuccessToast("Addition successful !");

                  this.income_statement_visible = true;

                  this.income_statement_edit_button_visible = true;

                  this.income_statement_delete_button_visible = true;

                  this.income_statement_view_button_visible = true;


                });

              }
            }
          ]
        };

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }

      else if (table_name === 'project_financial_flows') {

        financialInformationModalParams = {

          header: "Add Financial Flow Details",

          page: "Financialflow",

          method: "add",

          val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6] },
          { action: "add", values: [7, 8, 9, 10, 11] },
          { action: "sub", values: [6, 11, 12] }],


          data_settings: this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar,

          inputs: [
            {
              id: "year",
              name: "Year",
              type: "select",
              value: this.yearArray,
              selected: this.yearArray[0],
              required: "true",
            },
            {
              id: "paidUpCapital",
              name: "Paid-Up Capital",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "selfFinancingfromtheOwner",
              name: "Self-Financing from the Owner",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "bankFinancing",
              name: "Bank Financing",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "governmentLendingAgencies",
              name: "Government Lending Agencies (SIDF Loans)",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "depreciationandAmortization",
              name: "Depreciation and Amortization",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totalInflow",
              name: "Total Inflow",
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "capitalExpensefortheproject",
              name: "Capital Expense for the project",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "bankInstallments",
              name: "Bank Installments",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "governmentAgenciesInstallments",
              name: "Government Agencies Installments (SIDF Loan)",
              type: "text",
              value: "",
              required: "true",
            },

            {
              id: "dividends",
              name: "Dividends",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "totalOutflow",
              name: "Total Outflow",
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "Fundsremainingendyear",
              name: "Funds remaining at the end of the year",
              type: "number_disabled",
              value: "",
              required: "true",
            },
            {
              id: "pooledFunds",
              name: "Pooled Funds",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "cashflowfiles",
              name: "Audited / UnAudited Files",
              type: "file",
              file: "",
              value: "",

            },
            {
              id: "Yearcom",
              name: "Comments",
              type: "textarea",
              value: "",
            }

          ],
          buttons: [
            {
              name: "Save",
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {

                var file_names = "";

                for (var i = 0; i < modal_data.inputs[14].file.length; i++)
                  if (i != (modal_data.inputs[14].file.length - 1))
                    file_names += modal_data.inputs[14].file[i].name + ", ";
                  else
                    file_names += modal_data.inputs[14].file[i].name;

                var selected_year = modal_data.inputs[0].selected;

                var randomNum = ""

                var randomNum = this.commonService.returnRandomNumber().toString();

                var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, file_names, modal_data.inputs[15].value];

                var mySettings = this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar;

                mySettings.columns["year_" + selected_year] = {
                  title: selected_year,
                  type: "string",
                  filter: false
                }

                this.financial_flow_years.push(selected_year);

                if (this.commonService.defaultLanguage == "en")
                  this.project_financial_flows_settings = Object.assign({}, mySettings);
                else
                  this.project_financial_flows_settings_ar = Object.assign({}, mySettings);

                var project_financial_flows_temp_source = [];

                var project_financial_flows_final_temp_source = [];

                this.project_financial_flows_source.getAll().then((res) => {

                  project_financial_flows_temp_source = res;

                  for (var i = 0; i < project_financial_flows_temp_source.length; i++) {
                    if (i < project_financial_flows_temp_source.length - 2)
                      project_financial_flows_temp_source[i]["year_" + selected_year] = "SAR " + year_values[i];
                    else
                      project_financial_flows_temp_source[i]["year_" + selected_year] = year_values[i];
                  }

                  this.project_financial_flows_source.load(project_financial_flows_temp_source);

                  this.project_financial_flows_source.refresh();

                  this.financialflowflag = 2;

                  this.project_financial_flows_source.getAll().then((res) => {

                    project_financial_flows_temp_source = res;

                    for (var i = 0; i < this.financial_flow_years.length; i++) {

                      if (this.flowsourceId[i]) {

                        project_financial_flows_final_temp_source.push({

                          "Operation": "U",
                          "Flowid": this.flowsourceId[i],
                          "Year": this.financial_flow_years[i],
                          "Paidcap": project_financial_flows_temp_source[0]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Selffin": project_financial_flows_temp_source[1]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Bankfin": project_financial_flows_temp_source[2]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Govlend": project_financial_flows_temp_source[3]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Depamort": project_financial_flows_temp_source[4]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Totinflow": project_financial_flows_temp_source[5]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Capexp": project_financial_flows_temp_source[6]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Bankinst": project_financial_flows_temp_source[7]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Govaginst": project_financial_flows_temp_source[8]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Dividends": project_financial_flows_temp_source[9]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Totoutflow": project_financial_flows_temp_source[10]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Yearendrem": project_financial_flows_temp_source[11]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Pooledfunds": project_financial_flows_temp_source[12]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Statetype": "H",
                          "GuiId": this.flowsourceGuId[i],
                          "Yearcom": project_financial_flows_temp_source[14]["year_" + this.financial_flow_years[i]]

                        });


                      }
                      else {

                        project_financial_flows_final_temp_source.push({

                          "Operation": "C",
                          "Year": this.financial_flow_years[i],
                          "Paidcap": project_financial_flows_temp_source[0]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Selffin": project_financial_flows_temp_source[1]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Bankfin": project_financial_flows_temp_source[2]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Govlend": project_financial_flows_temp_source[3]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Depamort": project_financial_flows_temp_source[4]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Totinflow": project_financial_flows_temp_source[5]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Capexp": project_financial_flows_temp_source[6]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Bankinst": project_financial_flows_temp_source[7]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Govaginst": project_financial_flows_temp_source[8]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Dividends": project_financial_flows_temp_source[9]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                         "Totoutflow": project_financial_flows_temp_source[10]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Yearendrem": project_financial_flows_temp_source[11]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Pooledfunds": project_financial_flows_temp_source[12]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                          "Statetype": "H",
                          "GuiId": randomNum,
                          "Yearcom": project_financial_flows_temp_source[14]["year_" + this.financial_flow_years[i]]

                        });

                      }



                    }

                    var project_financial_flows_post_data = {

                      "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                      "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                      "Bpid": this.customerProfileService.loanArray.BpId,
                      "Origin": "CP",
                      "Sentreqid": this.requestId,
                      "Customerid": "",
                      "Flowstat": project_financial_flows_final_temp_source,


                    };

                    this.loanApplicationService.postFlowStatement(project_financial_flows_post_data)
                      .then((res) => (this.onResult(res, 5, modal_data.inputs[14].file, randomNum)), err => console.log(err));

                    this.financialflowflag = 1;

                  });

                  //this.commonService.showSuccessToast("Addition successful !");

                  this.financial_flow_visible = true;

                  this.financial_flow_edit_button_visible = true;

                  this.financial_flow_delete_button_visible = true;

                });

              }
            }
          ]
        };

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;


      }

    }
    else {
      this.commonService.showFailureToast("Add Asset Statement to proceed");
    }

  }

  onEditCofinancier(event, table_name) {

    if (this.statusCode != 'P' && this.statusCode != 'A') {
      if (event.data.TypeId != "Total") {

        let financialInformationModalParams = {};

        if (table_name === 'source_of_finance_cofinancer') {


          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.editSourceoffinance'),

            page: "source_of_finance",

            method: "add_normal",

            inputs: [

              {
                id: "TypeId",
                name: this.translate.instant('FINANCIAL_INFORMATION.SourceofFinance'),
                type: "select",
                value: this.CofinsType_Desc_list,
                selected: event.data.TypeId,
                required: "true",
              },
              {
                id: "Amount",
                name: this.translate.instant('FINANCIAL_INFORMATION.Amount'),
                type: "currency",
                value: parseInt(event.data.Amount.replace("SAR ", "").replace(/,/g, "")),
                required: "true",
              },
              {
                id: "Percent",
                name: this.translate.instant('FINANCIAL_INFORMATION.Percent'),
                type: "number",
                value: parseInt(event.data.Percent),
                required: "true",
              },
              {
                id: "ExtId",
                name: this.translate.instant('FINANCIAL_INFORMATION.Comments'),
                type: "textarea",
                value: event.data.ExtId,
                required: event.data.ExtId != "Others" ? "false" : "true",
              }

            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  var source_of_finance_temp_source = [];

                  var tot_percent = 0;

                  this.source_of_finance_source.getAll().then((res) => {

                    source_of_finance_temp_source = res;
                    source_of_finance_temp_source.pop();

                    for (var i = 0; i < source_of_finance_temp_source.length; i++) {
                      if (event.index === i) {
                        tot_percent += parseFloat(modal_data.inputs[2].value);
                      }
                      else {
                        tot_percent += parseFloat(source_of_finance_temp_source[i].Percent);
                      }

                    }


                    if (tot_percent > 100) {
                      this.commonService.showFailureToast("Total Percent of all Source of Finance can't exceed 100%");
                    }
                    else {
                      this.spinnerService.show();

                      var TypeId_typecode = "";

                      var source_of_finance_source_data = {
                        TypeId: modal_data.inputs[0].selected, Amount: "SAR " + this.numberWithCommas(modal_data.inputs[1].value), Percent: modal_data.inputs[2].value,
                        ExtId: modal_data.inputs[3].value, Operation: "U"
                      };


                      //this.source_of_finance_source.update(event.data, source_of_finance_source_data_array);


                      var cofin_type = this.CofinsType_list.find((o) => o.DescAr === modal_data.inputs[0].selected||o.Desc === modal_data.inputs[0].selected);
                      if (cofin_type)
                        TypeId_typecode = cofin_type.Id;

                      var source_of_finance_final_post_data = {
                        "Cofinancers": [
                          {
                            "_comment1": "The below financing plan id is the loan id inputted in technical section under loan id field",
                            "FinancingPlanId": this.customerProfileService.loanArray.FinPlanId,
                            "Amount": modal_data.inputs[1].value,
                            "Percent": modal_data.inputs[2].value,
                            "ExtId": modal_data.inputs[3].value,
                            "SentReqId": JSON.stringify(this.requestId),
                            "CofinancerId": event.data.CofinancerId,
                            "Type": { "Id": TypeId_typecode },
                            "Operation": "U"
                          }
                        ]
                      };

                      this.source_of_finance_source.update(event.data, source_of_finance_source_data);

                      this.source_of_finance_source.refresh();


                      //create cofinacier 

                      this.loanApplicationService
                        .postcofinancier(source_of_finance_final_post_data)
                        .then((res) => (this.postcofinancier(res)), err => console.log(err));




                      //this.commonService.showSuccessToast("Edit successful !");
                    }
                  });
                }
              }
            ]
          };
        }


        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }
      else {
        this.commonService.showFailureToast("Your not allowed to edit this row");
      }

    }
  }


  onEdit(table_name) {

    this.spinnerService.show();

    this.documentStructure = {};

    this.communicationsService.getDocumentService(this.requestId, "p").then(requests => {

      this.documentStructure = this.commonService.returnViewDocumentJson(requests);



      this.spinnerService.hide();

      let financialInformationModalParams = {};

      if (table_name === 'source_of_finance') {

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }
      else if (table_name === 'asset_statement') {

        var asset_statement_temp_source = [];

        this.asset_statement_source.getAll().then((res) => {

          asset_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.editassetheader'),

            page: "Asset",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.asset_statement_years,

            guIdArray: this.assetGuId,

            val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6, 7] },
            { action: "add", values: [8, 9, 10, 11, 12, 13, 14, 15, 16] },
            { action: "sub", values: [16, 17, 18] },
            { action: "add", values: [20, 21, 22] },
            { action: "sub", values: [22, 23, 24] },
            { action: "add", values: [7, 18, 19, 25] }],

           data_source: asset_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.asset_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "factoryCash",
                name: this.mainassetlist[0],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "accountReceivable",
                name: this.mainassetlist[1],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "inventory",
                name: this.mainassetlist[2],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "lcMargin",
                name: this.mainassetlist[3],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "prepaid",
                name: this.mainassetlist[4],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other1",
                name: this.mainassetlist[5],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "currentAssets",
                name: this.mainassetlist[6],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "land",
                name: this.mainassetlist[7],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "buildings",
                name: this.mainassetlist[8],
                type: "text",
                value: "",
                required: "true",
              },

              {
                id: "machinery",
                name: this.mainassetlist[9],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "furniture",
                name: this.mainassetlist[10],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "vehicles",
                name: this.mainassetlist[11],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "lossPrevention",
                name: this.mainassetlist[12],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other2",
                name: this.mainassetlist[13],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "contingencies",
                name: this.mainassetlist[14],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalFixedAssets",
                name: this.mainassetlist[15],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "accumDepreciation",
                name: this.mainassetlist[16],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "netFixedAssets",
                name: this.mainassetlist[17],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "otherNonCurrentAssets",
                name: this.mainassetlist[18],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "sidfCharge",
                name: this.mainassetlist[19],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "preoperatingExpense",
                name: this.mainassetlist[20],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalIntangibles",
                name: this.mainassetlist[21],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "accumAmmortization",
                name: this.mainassetlist[22],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "netIntangibles",
                name: this.mainassetlist[23],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "totalAssets",
                name: this.mainassetlist[24],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "assetfiles",
                name: this.mainassetlist[25],
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: this.mainassetlist[26],
                type: "textarea",
                value: "",
              },
              {
                id: "alert"
              }


            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;

                  var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                  modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                  modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, modal_data.inputs[14].value, modal_data.inputs[15].value,
                  modal_data.inputs[16].value, modal_data.inputs[17].value, modal_data.inputs[18].value, modal_data.inputs[19].value, modal_data.inputs[20].value,
                  modal_data.inputs[21].value, modal_data.inputs[22].value, modal_data.inputs[23].value, modal_data.inputs[24].value, modal_data.inputs[25].value, "file(s)", modal_data.inputs[27].value];

                  var asset_statement_temp_source = [];

                  var asset_statement_final_temp_source = [];

                  this.asset_statement_source.getAll().then((res) => {

                    asset_statement_temp_source = res;

                    for (var i = 0; i < this.asset_statement_years.length; i++) {
                      if (this.asset_statement_years[i] === selected_year) {
                        var guiIdrandom = i;
                      }
                    }

                    for (var i = 0; i < asset_statement_temp_source.length; i++) {
                      if (i < asset_statement_temp_source.length - 2)
                        asset_statement_temp_source[i]["year_" + selected_year] = "SAR " + this.numberWithCommas(year_values[i]);
                      else
                        asset_statement_temp_source[i]["year_" + selected_year] = year_values[i];
                    }

                    this.asset_statement_source.load(asset_statement_temp_source);

                    this.asset_statement_source.refresh();

                    this.assetflag = 2;

                    this.asset_statement_source.getAll().then((res) => {

                      asset_statement_temp_source = res;


                      for (var i = 0; i < this.asset_statement_years.length; i++) {

                        if (this.assetId[i]) {


                          asset_statement_final_temp_source.push({

                            "Operation": "U",
                            "Assetid": this.assetId[i],
                            "Year": this.asset_statement_years[i],
                            "Factorycash": asset_statement_temp_source[0]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accntsrec": asset_statement_temp_source[1]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Inventory": asset_statement_temp_source[2]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Lcmargins": asset_statement_temp_source[3]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Prepaid": asset_statement_temp_source[4]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other1": asset_statement_temp_source[5]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Currentassets": asset_statement_temp_source[6]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Land": asset_statement_temp_source[7]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Buildings": asset_statement_temp_source[8]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Machinery": asset_statement_temp_source[9]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Furniture": asset_statement_temp_source[10]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Vehicles": asset_statement_temp_source[11]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Lossprev": asset_statement_temp_source[12]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other2": asset_statement_temp_source[13]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Contigencies": asset_statement_temp_source[14]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totfixassets": asset_statement_temp_source[15]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accumdepre": asset_statement_temp_source[16]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Netfixassets": asset_statement_temp_source[17]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Otherncassets": asset_statement_temp_source[18]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Sidfcharge": asset_statement_temp_source[19]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Preopexp": asset_statement_temp_source[20]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totintang": asset_statement_temp_source[21]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accumamort": asset_statement_temp_source[22]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Netintang": asset_statement_temp_source[23]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totassets": asset_statement_temp_source[24]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Statetype": "H",
                            "GuiId": this.assetGuId[i],
                            "Yearcom": asset_statement_temp_source[26]["year_" + this.asset_statement_years[i]]

                          });
                        }
                        else {

                          asset_statement_final_temp_source.push({

                            "Operation": "C",
                            "Year": this.asset_statement_years[i],
                            "Factorycash": asset_statement_temp_source[0]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accntsrec": asset_statement_temp_source[1]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Inventory": asset_statement_temp_source[2]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Lcmargins": asset_statement_temp_source[3]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Prepaid": asset_statement_temp_source[4]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other1": asset_statement_temp_source[5]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Currentassets": asset_statement_temp_source[6]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Land": asset_statement_temp_source[7]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                           "Buildings": asset_statement_temp_source[8]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Machinery": asset_statement_temp_source[9]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Furniture": asset_statement_temp_source[10]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Vehicles": asset_statement_temp_source[11]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Lossprev": asset_statement_temp_source[12]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other2": asset_statement_temp_source[13]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Contigencies": asset_statement_temp_source[14]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totfixassets": asset_statement_temp_source[15]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accumdepre": asset_statement_temp_source[16]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Netfixassets": asset_statement_temp_source[17]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Otherncassets": asset_statement_temp_source[18]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Sidfcharge": asset_statement_temp_source[19]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Preopexp": asset_statement_temp_source[20]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totintang": asset_statement_temp_source[21]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accumamort": asset_statement_temp_source[22]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Netintang": asset_statement_temp_source[23]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totassets": asset_statement_temp_source[24]["year_" + this.asset_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Statetype": "H",
                            "GuiId": this.assetGuId[i],
                            "Yearcom": asset_statement_temp_source[26]["year_" + this.asset_statement_years[i]]

                          });
                        }


                      }

                      var asset_statement_post_data = {

                        "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Assetstat": asset_statement_final_temp_source,

                      };


                      this.loanApplicationService.postAssetStatement(asset_statement_post_data)
                        .then((res) => (this.onResult(res, 2, modal_data.inputs[26].file, this.assetGuId[guiIdrandom])), err => console.log(err));

                      this.assetflag = 1;




                    });

                    // this.commonService.showSuccessToast("Edit successful !");

                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;
        });
      }
      else if (table_name === 'liabilities_statement') {

        var liabilities_statement_temp_source = [];

        this.liabilities_statement_source.getAll().then((res) => {

          liabilities_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.editliabilityheader'),

            page: "Liabilities",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.liabilities_statement_years,

            guIdArray: this.liabilityGuId,

            val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
            { action: "add", values: [10, 11, 12, 13] },
            { action: "add", values: [9, 13, 14, 15] },
            { action: "add", values: [16, 17, 18, 19, 20, 21] },
            { action: "add", values: [15, 21, 22] }],

            data_source: liabilities_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.liabilities_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "accountsPayable",
                name: this.mainliablist[0],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "std",
                name: this.mainliablist[1],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "accruals",
                name: this.mainliablist[2],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cplsidf",
                name: this.mainliablist[3],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cplbank",
                name: this.mainliablist[4],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cplother",
                name: this.mainliablist[5],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other1",
                name: this.mainliablist[6],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other2",
                name: this.mainliablist[7],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "currentliab",
                name: this.mainliablist[8],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Ltdsidf",
                name: this.mainliablist[9],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "ltdbank",
                name: this.mainliablist[10],
               type: "text",
                value: "",
                required: "true",
              },
              {
                id: "ltdother",
                name: this.mainliablist[11],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totltd",
                name: this.mainliablist[12],
                type: "number_disabled",
                value: "",
                required: "true",
             },
              {
                id: "nonsubltd",
                name: this.mainliablist[13],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totliab",
                name: this.mainliablist[14],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "paidincap",
                name: this.mainliablist[15],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "suborddebt",
                name: this.mainliablist[16],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "retearn",
                name: this.mainliablist[17],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "statres",
                name: this.mainliablist[18],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other3",
                name: this.mainliablist[19],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totequi",
                name: this.mainliablist[20],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "totliabeq",
                name: this.mainliablist[21],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "liabilityfiles",
                name: this.mainliablist[22],
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
               name: this.mainliablist[23],
                type: "textarea",
                value: "",
              },
              {
                id: "alert"
              }


            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                 this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;


                  var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                  modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                  modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, modal_data.inputs[14].value, modal_data.inputs[15].value,
                  modal_data.inputs[16].value, modal_data.inputs[17].value, modal_data.inputs[18].value, modal_data.inputs[19].value, modal_data.inputs[20].value,
                  modal_data.inputs[21].value, modal_data.inputs[22].value, "file(s)", modal_data.inputs[24].value];

                  var liabilities_statement_temp_source = [];

                  var liabilities_statement_final_temp_source = [];

                  this.liabilities_statement_source.getAll().then((res) => {

                    liabilities_statement_temp_source = res;

                    for (var i = 0; i < this.liabilities_statement_years.length; i++) {
                      if (this.liabilities_statement_years[i] === selected_year) {
                        var guiIdrandom = i;
                      }
                    }

                    for (var i = 0; i < liabilities_statement_temp_source.length; i++) {
                      if (i < liabilities_statement_temp_source.length - 2)
                        liabilities_statement_temp_source[i]["year_" + selected_year] = "SAR " + this.numberWithCommas(year_values[i]);
                      else
                        liabilities_statement_temp_source[i]["year_" + selected_year] = year_values[i];
                    }

                    this.liabilities_statement_source.load(liabilities_statement_temp_source);

                    this.liabilities_statement_source.refresh();

                    this.liabilityflag = 2;

                    this.liabilities_statement_source.getAll().then((res) => {

                      liabilities_statement_temp_source = res;

                      for (var i = 0; i < this.liabilities_statement_years.length; i++) {

                        if (this.liabilityId[i]) {


                          liabilities_statement_final_temp_source.push({

                            "Operation": "U",
                            "Liabeqid": this.liabilityId[i],
                            "Year": this.liabilities_statement_years[i],
                            "Acpay": liabilities_statement_temp_source[0]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Std": liabilities_statement_temp_source[1]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accruals": liabilities_statement_temp_source[2]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cplsidf": liabilities_statement_temp_source[3]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cplbank": liabilities_statement_temp_source[4]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cplother": liabilities_statement_temp_source[5]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other1": liabilities_statement_temp_source[6]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other2": liabilities_statement_temp_source[7]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Currentliab": liabilities_statement_temp_source[8]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltd": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltdsidf": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltdbank": liabilities_statement_temp_source[10]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltdother": liabilities_statement_temp_source[11]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totltd": liabilities_statement_temp_source[12]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Nonsubltd": liabilities_statement_temp_source[13]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totliab": liabilities_statement_temp_source[14]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Paidincap": liabilities_statement_temp_source[15]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Suborddebt": liabilities_statement_temp_source[16]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Retearn": liabilities_statement_temp_source[17]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Statres": liabilities_statement_temp_source[18]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other3": liabilities_statement_temp_source[19]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totequi": liabilities_statement_temp_source[20]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totliabeq": liabilities_statement_temp_source[21]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Stattype": "H",
                            "GuiId": this.liabilityGuId[i],
                            "Yearcom": liabilities_statement_temp_source[23]["year_" + this.liabilities_statement_years[i]]

                          });



                        }
                        else {

                          liabilities_statement_final_temp_source.push({

                            "Operation": "C",
                            "Year": this.liabilities_statement_years[i],
                            "Acpay": liabilities_statement_temp_source[0]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Std": liabilities_statement_temp_source[1]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Accruals": liabilities_statement_temp_source[2]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cplsidf": liabilities_statement_temp_source[3]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cplbank": liabilities_statement_temp_source[4]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cplother": liabilities_statement_temp_source[5]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other1": liabilities_statement_temp_source[6]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other2": liabilities_statement_temp_source[7]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Currentliab": liabilities_statement_temp_source[8]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltd": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltdsidf": liabilities_statement_temp_source[9]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltdbank": liabilities_statement_temp_source[10]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Ltdother": liabilities_statement_temp_source[11]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totltd": liabilities_statement_temp_source[12]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Nonsubltd": liabilities_statement_temp_source[13]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totliab": liabilities_statement_temp_source[14]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Paidincap": liabilities_statement_temp_source[15]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Suborddebt": liabilities_statement_temp_source[16]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Retearn": liabilities_statement_temp_source[17]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Statres": liabilities_statement_temp_source[18]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Other3": liabilities_statement_temp_source[19]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totequi": liabilities_statement_temp_source[20]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totliabeq": liabilities_statement_temp_source[21]["year_" + this.liabilities_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Stattype": "H",
                            "GuiId": this.liabilityGuId[i],
                            "Yearcom": liabilities_statement_temp_source[23]["year_" + this.liabilities_statement_years[i]]

                          });


                        }


                      }

                      var liabilities_statement_post_data = {

                        "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Liabstat": liabilities_statement_final_temp_source,

                      };

                      this.loanApplicationService.postLiabilitiesStatement(liabilities_statement_post_data)
                        .then((res) => (this.onResult(res, 3, modal_data.inputs[23].file, this.liabilityGuId[guiIdrandom])), err => console.log(err));

                      this.liabilityflag = 1;

                    });

                    //this.commonService.showSuccessToast("Edit successful !");


                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;
        });
      }
      else if (table_name === 'income_statement') {

        var income_statement_temp_source = [];

        this.income_statement_source.getAll().then((res) => {

          income_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.editincomeheader'),

            page: "Income",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.income_statement_years,

            guIdArray: this.incomeGuId,

            val_indices: [{ action: "add", values: [2, 3, 4, 5, 6, 7, 9] },
            { action: "sub", values: [1, 9, 10] },
            { action: "add", values: [11, 12, 13, 14, 8, 15] },
            { action: "sub", values: [10, 15, 16] },
            { action: "sub", values: [16, 17, 18] },
            { action: "sub", values: [18, 20, 19, 21] }],

            data_source: income_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.income_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "sales",
                name: this.mainincomelist[0],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "rawMaterials",
                name: this.mainincomelist[1],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "directLabour",
                name: this.mainincomelist[2],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "maintenance",
                name: this.mainincomelist[3],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "utilities",
                name: this.mainincomelist[4],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "depreciation",
                name: this.mainincomelist[5],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "amortization",
                name: this.mainincomelist[6],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Othdirexp",
                name: this.mainincomelist[7],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Cgs",
                name: this.mainincomelist[8],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "grossMargin",
                name: this.mainincomelist[9],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "salesGenAdmin",
                name: this.mainincomelist[10],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "salaries",
                name: this.mainincomelist[11],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Finchar",
                name: this.mainincomelist[12],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Othexp",
                name: this.mainincomelist[13],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Totindcost",
                name: this.mainincomelist[14],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Pbtzak",
                name: this.mainincomelist[15],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Taxzak",
                name: this.mainincomelist[16],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "profitzatak",
                name: this.mainincomelist[17],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "statres",
                name: this.mainincomelist[18],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "dividends",
                name: this.mainincomelist[19],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Retear",
                name: this.mainincomelist[20],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "incomefiles",
                name: this.mainincomelist[21],
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: this.mainincomelist[22],
                type: "textarea",
                value: "",
              },
              {
                id: "alert"
              }

            ],
            buttons: [
              {
                name: this.translate.instant('COMMON.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;


                  var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                  modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                  modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, modal_data.inputs[14].value, modal_data.inputs[15].value,
                  modal_data.inputs[16].value, modal_data.inputs[17].value, modal_data.inputs[18].value, modal_data.inputs[19].value, modal_data.inputs[20].value,
                  modal_data.inputs[21].value, "file(s)", modal_data.inputs[23].value];

                  var income_statement_temp_source = [];

                  var income_statement_final_temp_source = [];

                  this.income_statement_source.getAll().then((res) => {

                    income_statement_temp_source = res;

                    for (var i = 0; i < this.income_statement_years.length; i++) {
                      if (this.income_statement_years[i] === selected_year) {
                        var guiIdrandom = i;
                      }
                    }

                    for (var i = 0; i < income_statement_temp_source.length; i++) {
                      if (i < income_statement_temp_source.length - 2)
                        income_statement_temp_source[i]["year_" + selected_year] = "SAR " + this.numberWithCommas(year_values[i]);
                      else
                        income_statement_temp_source[i]["year_" + selected_year] = year_values[i];
                    }

                    this.income_statement_source.load(income_statement_temp_source);

                    this.income_statement_source.refresh();

                    this.incomeflag = 2;

                    this.income_statement_source.getAll().then((res) => {

                      income_statement_temp_source = res;

                      for (var i = 0; i < this.income_statement_years.length; i++) {

                        if (this.incomeId[i]) {

                          //guiIdrandom = this.incomeGuId[i];

                          income_statement_final_temp_source.push({

                            "Operation": "U",
                            "Incomeid": this.incomeId[i],
                            "Year": this.income_statement_years[i],
                            "Sales": income_statement_temp_source[0]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Rawmat": income_statement_temp_source[1]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Dirlab": income_statement_temp_source[2]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Maint": income_statement_temp_source[3]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Utils": income_statement_temp_source[4]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Deprec": income_statement_temp_source[5]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Amort": income_statement_temp_source[6]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Othdirexp": income_statement_temp_source[7]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cgs": income_statement_temp_source[8]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Grossmar": income_statement_temp_source[9]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Salesad": income_statement_temp_source[10]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Salar": income_statement_temp_source[11]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Finchar": income_statement_temp_source[12]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Othexp": income_statement_temp_source[13]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totindcost": income_statement_temp_source[14]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Pbtzak": income_statement_temp_source[15]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Taxzak": income_statement_temp_source[16]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Profit": income_statement_temp_source[17]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Statres": income_statement_temp_source[18]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Divid": income_statement_temp_source[19]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Retear": income_statement_temp_source[20]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Yearcom": income_statement_temp_source[22]["year_" + this.income_statement_years[i]],
                            "GuiId": this.incomeGuId[i],
                            "Type": "H"

                          });


                        }
                        else {

                          income_statement_final_temp_source.push({

                            "Operation": "C",
                            "Year": this.income_statement_years[i],
                            "Sales": income_statement_temp_source[0]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Rawmat": income_statement_temp_source[1]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Dirlab": income_statement_temp_source[2]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Maint": income_statement_temp_source[3]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Utils": income_statement_temp_source[4]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Deprec": income_statement_temp_source[5]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Amort": income_statement_temp_source[6]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Othdirexp": income_statement_temp_source[7]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Cgs": income_statement_temp_source[8]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Grossmar": income_statement_temp_source[9]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Salesad": income_statement_temp_source[10]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Salar": income_statement_temp_source[11]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Finchar": income_statement_temp_source[12]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Othexp": income_statement_temp_source[13]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Totindcost": income_statement_temp_source[14]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Pbtzak": income_statement_temp_source[15]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Taxzak": income_statement_temp_source[16]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Profit": income_statement_temp_source[17]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Statres": income_statement_temp_source[18]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Divid": income_statement_temp_source[19]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Retear": income_statement_temp_source[20]["year_" + this.income_statement_years[i]].replace("SAR ", "").replace(/,/g, ""),
                            "Yearcom": income_statement_temp_source[22]["year_" + this.income_statement_years[i]],
                            "GuiId": this.incomeGuId[i],
                            "Type": "H"

                          });

                        }



                      }

                      var income_statement_post_data = {

                        "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Incstat": income_statement_final_temp_source,


                      };

                      this.loanApplicationService.postIncomeStatement(income_statement_post_data)
                        .then((res) => (this.onResult(res, 4, modal_data.inputs[22].file, this.incomeGuId[guiIdrandom])), err => console.log(err));

                      this.incomeflag = 1;

                    });

                    //this.commonService.showSuccessToast("Edit successful !");

                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

        });

      }
      else if (table_name === 'project_financial_flows') {

        var project_financial_flows_temp_source = [];

        this.project_financial_flows_source.getAll().then((res) => {

          project_financial_flows_temp_source = res;

          financialInformationModalParams = {

            header: "Edit Project Financial Flow Statement Details",

            page: "Financialflow",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.financial_flow_years,

            guIdArray: this.flowsourceGuId,

            val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6] },
            { action: "add", values: [7, 8, 9, 10, 11] },
            { action: "sub", values: [6, 11, 12] }],

            data_source: project_financial_flows_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar,

            inputs: [
              {
                id: "year",
                name: "Year",
                type: "select",
                value: this.financial_flow_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "paidUpCapital",
                name: "Paid-Up Capital",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "selfFinancingfromtheOwner",
                name: "Self-Financing from the Owner",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "bankFinancing",
                name: "Bank Financing",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "governmentLendingAgencies",
                name: "Government Lending Agencies (SIDF Loans)",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "depreciationandAmortization",
                name: "Depreciation and Amortization",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalInflow",
                name: "Total Inflow",
                type: "number_disabled",
               value: "",
                required: "true",
              },
              {
                id: "capitalExpensefortheproject",
                name: "Capital Expense for the project",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "bankInstallments",
                name: "Bank Installments",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "governmentAgenciesInstallments",
                name: "Government Agencies Installments (SIDF Loan)",
                type: "text",
                value: "",
                required: "true",
              },

              {
                id: "dividends",
                name: "Dividends",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalOutflow",
                name: "Total Outflow",
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Fundsremainingendyear",
                name: "Funds remaining at the end of the year",
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "pooledFunds",
                name: "Pooled Funds",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cashflowfiles",
                name: "Audited / UnAudited Files",
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: "Comments",
                type: "textarea",
                value: "",
              }

            ],
            buttons: [
              {
                name: "Save",
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;

                  var year_values = [modal_data.inputs[1].value, modal_data.inputs[2].value, modal_data.inputs[3].value, modal_data.inputs[4].value, modal_data.inputs[5].value,
                  modal_data.inputs[6].value, modal_data.inputs[7].value, modal_data.inputs[8].value, modal_data.inputs[9].value, modal_data.inputs[10].value,
                  modal_data.inputs[11].value, modal_data.inputs[12].value, modal_data.inputs[13].value, "file(s)", modal_data.inputs[15].value];

                  var project_financial_flows_temp_source = [];

                  var project_financial_flows_final_temp_source = [];

                  this.project_financial_flows_source.getAll().then((res) => {

                    project_financial_flows_temp_source = res;

                    for (var i = 0; i < this.financial_flow_years.length; i++) {
                      if (this.financial_flow_years[i] === selected_year) {
                        var guiIdrandom = i;
                      }
                    }

                    for (var i = 0; i < project_financial_flows_temp_source.length; i++) {
                      if (i < project_financial_flows_temp_source.length - 2)
                        project_financial_flows_temp_source[i]["year_" + selected_year] = "SAR " + year_values[i];
                      else
                        project_financial_flows_temp_source[i]["year_" + selected_year] = year_values[i];
                    }

                    this.project_financial_flows_source.load(project_financial_flows_temp_source);

                    this.project_financial_flows_source.refresh();

                    this.financialflowflag = 2;

                    this.project_financial_flows_source.getAll().then((res) => {

                      project_financial_flows_temp_source = res;

                      for (var i = 0; i < this.financial_flow_years.length; i++) {

                        if (this.flowsourceId[i]) {
                          //guiIdrandom = this.flowsourceGuId[i],
                          project_financial_flows_final_temp_source.push({

                            "Operation": "U",
                            "Flowid": this.flowsourceId[i],
                            "Year": this.financial_flow_years[i],
                            "Paidcap": project_financial_flows_temp_source[0]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Selffin": project_financial_flows_temp_source[1]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Bankfin": project_financial_flows_temp_source[2]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Govlend": project_financial_flows_temp_source[3]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Depamort": project_financial_flows_temp_source[4]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Totinflow": project_financial_flows_temp_source[5]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Capexp": project_financial_flows_temp_source[6]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Bankinst": project_financial_flows_temp_source[7]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Govaginst": project_financial_flows_temp_source[8]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Dividends": project_financial_flows_temp_source[9]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Totoutflow": project_financial_flows_temp_source[10]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Yearendrem": project_financial_flows_temp_source[11]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Pooledfunds": project_financial_flows_temp_source[12]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Statetype": "H",
                            "GuiId": this.flowsourceGuId[i],
                            "Yearcom": project_financial_flows_temp_source[14]["year_" + this.financial_flow_years[i]]

                          });


                        }
                        else {

                          project_financial_flows_final_temp_source.push({

                            "Operation": "C",
                            "Year": this.financial_flow_years[i],
                            "Paidcap": project_financial_flows_temp_source[0]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Selffin": project_financial_flows_temp_source[1]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Bankfin": project_financial_flows_temp_source[2]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Govlend": project_financial_flows_temp_source[3]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Depamort": project_financial_flows_temp_source[4]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Totinflow": project_financial_flows_temp_source[5]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Capexp": project_financial_flows_temp_source[6]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Bankinst": project_financial_flows_temp_source[7]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Govaginst": project_financial_flows_temp_source[8]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Dividends": project_financial_flows_temp_source[9]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Totoutflow": project_financial_flows_temp_source[10]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Yearendrem": project_financial_flows_temp_source[11]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Pooledfunds": project_financial_flows_temp_source[12]["year_" + this.financial_flow_years[i]].replace("SAR ", ""),
                            "Statetype": "H",
                            "GuiId": this.flowsourceGuId[i],
                            "Yearcom": project_financial_flows_temp_source[14]["year_" + this.financial_flow_years[i]]

                          });

                        }



                      }

                      var project_financial_flows_post_data = {

                        "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Flowstat": project_financial_flows_final_temp_source,


                      };

                      this.loanApplicationService.postFlowStatement(project_financial_flows_post_data)
                        .then((res) => (this.onResult(res, 5, modal_data.inputs[14].file, this.flowsourceGuId[guiIdrandom])), err => console.log(err));

                      this.financialflowflag = 1;

                    });

                    //this.commonService.showSuccessToast("Edit successful !");


                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;


        });
      }


    });

  }

  onView(table_name) { 

    this.spinnerService.show();

    this.documentStructure = {};

    this.communicationsService.getDocumentService(this.requestId, "p").then(requests => {

      this.documentStructure = this.commonService.returnViewDocumentJson(requests);



      this.spinnerService.hide();

      let financialInformationModalParams = {};

      if (table_name === 'source_of_finance') {

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }
      else if (table_name === 'asset_statement') {

        var asset_statement_temp_source = [];

        this.asset_statement_source.getAll().then((res) => {

          asset_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.viewassetheader'),

            page: "Asset",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.asset_statement_years,

            guIdArray: this.assetGuId,

            val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6, 7] },
            { action: "add", values: [8, 9, 10, 11, 12, 13, 14, 15, 16] },
            { action: "sub", values: [16, 17, 18] },
            { action: "add", values: [20, 21, 22] },
            { action: "sub", values: [22, 23, 24] },
            { action: "add", values: [7, 18, 19, 25] }],

            data_source: asset_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.asset_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "factoryCash",
                name: this.mainassetlist[0],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "accountReceivable",
                name: this.mainassetlist[1],
               type: "text",
                value: "",
                required: "true",
              },
              {
                id: "inventory",
                name: this.mainassetlist[2],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "lcMargin",
                name: this.mainassetlist[3],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "prepaid",
                name: this.mainassetlist[4],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other1",
                name: this.mainassetlist[5],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "currentAssets",
                name: this.mainassetlist[6],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "land",
                name: this.mainassetlist[7],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "buildings",
                name: this.mainassetlist[8],
                type: "text",
                value: "",
                required: "true",
              },

              {
                id: "machinery",
                name: this.mainassetlist[9],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "furniture",
                name: this.mainassetlist[10],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "vehicles",
                name: this.mainassetlist[11],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "lossPrevention",
                name: this.mainassetlist[12],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other2",
                name: this.mainassetlist[13],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "contingencies",
                name: this.mainassetlist[14],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalFixedAssets",
                name: this.mainassetlist[15],
                type: "number_disabled",
                value: "",
               required: "true",
              },
              {
                id: "accumDepreciation",
                name: this.mainassetlist[16],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "netFixedAssets",
                name: this.mainassetlist[17],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "otherNonCurrentAssets",
                name: this.mainassetlist[18],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "sidfCharge",
                name: this.mainassetlist[19],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "preoperatingExpense",
                name: this.mainassetlist[20],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalIntangibles",
                name: this.mainassetlist[21],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "accumAmmortization",
                name: this.mainassetlist[22],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "netIntangibles",
                name: this.mainassetlist[23],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "totalAssets",
                name: this.mainassetlist[24],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "assetfiles",
                name: this.mainassetlist[25],
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: this.mainassetlist[26],
                type: "textarea",
                value: "",
                required: "true",
              }


            ],
            buttons: [

            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;
        });
      }
      else if (table_name === 'liabilities_statement') {

        var liabilities_statement_temp_source = [];

        this.liabilities_statement_source.getAll().then((res) => {

          liabilities_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.viewliabilityheader'),

            page: "Liabilities",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.liabilities_statement_years,

            guIdArray: this.liabilityGuId,

            val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
            { action: "add", values: [10, 11, 12, 13] },
            { action: "add", values: [9, 13, 14, 15] },
            { action: "add", values: [16, 17, 18, 19, 20, 21] },
            { action: "add", values: [15, 21, 22] }],

            data_source: liabilities_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.liabilities_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "accountsPayable",
                name: this.mainliablist[0],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "std",
                name: this.mainliablist[1],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "accruals",
                name: this.mainliablist[2],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cplsidf",
                name: this.mainliablist[3],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cplbank",
                name: this.mainliablist[4],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cplother",
                name: this.mainliablist[5],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other1",
                name: this.mainliablist[6],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other2",
                name: this.mainliablist[7],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "currentliab",
                name: this.mainliablist[8],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Ltdsidf",
                name: this.mainliablist[9],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "ltdbank",
                name: this.mainliablist[10],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "ltdother",
                name: this.mainliablist[11],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totltd",
                name: this.mainliablist[12],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "nonsubltd",
               name: this.mainliablist[13],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totliab",
                name: this.mainliablist[14],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "paidincap",
                name: this.mainliablist[15],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "suborddebt",
                name: this.mainliablist[16],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "retearn",
                name: this.mainliablist[17],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "statres",
                name: this.mainliablist[18],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "other3",
                name: this.mainliablist[19],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totequi",
                name: this.mainliablist[20],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "totliabeq",
                name: this.mainliablist[21],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "liabilityfiles",
                name: this.mainliablist[22],
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: this.mainliablist[23],
                type: "textarea",
                value: "",
                required: "true",
              }


            ],
            buttons: [

            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;
        });
      }
      else if (table_name === 'income_statement') {

        var income_statement_temp_source = [];

        this.income_statement_source.getAll().then((res) => {

          income_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.viewincomeheader'),

            page: "Income",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.income_statement_years,

            guIdArray: this.incomeGuId,

            val_indices: [{ action: "add", values: [2, 3, 4, 5, 6, 7, 9] },
            { action: "sub", values: [1, 9, 10] },
            { action: "add", values: [11, 12, 13, 14, 8, 15] },
            { action: "sub", values: [10, 15, 16] },
            { action: "sub", values: [16, 17, 18] },
            { action: "sub", values: [18, 20, 19, 21] }],

            data_source: income_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.income_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "sales",
                name: this.mainincomelist[0],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "rawMaterials",
                name: this.mainincomelist[1],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "directLabour",
                name: this.mainincomelist[2],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "maintenance",
                name: this.mainincomelist[3],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "utilities",
                name: this.mainincomelist[4],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "depreciation",
                name: this.mainincomelist[5],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "amortization",
                name: this.mainincomelist[6],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Othdirexp",
                name: this.mainincomelist[7],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Cgs",
                name: this.mainincomelist[8],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "grossMargin",
                name: this.mainincomelist[9],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "salesGenAdmin",
                name: this.mainincomelist[10],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "salaries",
                name: this.mainincomelist[11],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Finchar",
                name: this.mainincomelist[12],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Othexp",
                name: this.mainincomelist[13],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Totindcost",
                name: this.mainincomelist[14],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Pbtzak",
                name: this.mainincomelist[15],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Taxzak",
                name: this.mainincomelist[16],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "profitzatak",
                name: this.mainincomelist[17],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "statres",
                name: this.mainincomelist[18],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "dividends",
                name: this.mainincomelist[19],
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "Retear",
                name: this.mainincomelist[20],
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "incomefiles",
                name: this.mainincomelist[21],
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: this.mainincomelist[22],
                type: "textarea",
                value: "",
                required: "true",
              }

            ],
            buttons: [

            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

        });

      }
      else if (table_name === 'project_financial_flows') {

        var project_financial_flows_temp_source = [];

        this.project_financial_flows_source.getAll().then((res) => {

          project_financial_flows_temp_source = res;

          financialInformationModalParams = {

            header: "View Project Financial Flow Statement Details",

            page: "Financialflow",

            method: "edit",

            documentjson: this.documentStructure,

            yearArray: this.financial_flow_years,

            guIdArray: this.flowsourceGuId,

            val_indices: [{ action: "add", values: [1, 2, 3, 4, 5, 6] },
            { action: "add", values: [7, 8, 9, 10, 11] },
            { action: "sub", values: [6, 11, 12] }],

            data_source: project_financial_flows_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.financial_flow_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              },
              {
                id: "paidUpCapital",
                name: "Paid-Up Capital",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "selfFinancingfromtheOwner",
                name: "Self-Financing from the Owner",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "bankFinancing",
                name: "Bank Financing",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "governmentLendingAgencies",
                name: "Government Lending Agencies (SIDF Loans)",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "depreciationandAmortization",
                name: "Depreciation and Amortization",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalInflow",
                name: "Total Inflow",
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "capitalExpensefortheproject",
                name: "Capital Expense for the project",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "bankInstallments",
                name: "Bank Installments",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "governmentAgenciesInstallments",
                name: "Government Agencies Installments (SIDF Loan)",
                type: "text",
                value: "",
                required: "true",
              },

              {
                id: "dividends",
                name: "Dividends",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "totalOutflow",
                name: "Total Outflow",
                type: "number_disabled",
                value: "",
                required: "true",
              },
              {
                id: "Fundsremainingendyear",
                name: "Funds remaining at the end of the year",
                type: "number_disabled",
                value: "",
               required: "true",
              },
              {
                id: "pooledFunds",
                name: "Pooled Funds",
                type: "text",
                value: "",
                required: "true",
              },
              {
                id: "cashflowfiles",
                name: "Audited / UnAudited Files",
                type: "file",
                file: "",
                value: "",

              },
              {
                id: "Yearcom",
                name: "Comments",
                type: "textarea",
                value: "",
                required: "true",
              }

            ],
            buttons: [

            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;


        });
      }


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

    else {

      this.commonService.showFailureToast("Complete filling the Financial Information !");

    }

  }

  getLoanApplicationFinancingInformation() {


    this.spinnerService.show();

    this.GenInfoPer = this.customerProfileService.loanPercentageValues.GenInfoPer;
    this.MarkInfoPer = this.customerProfileService.loanPercentageValues.MarkInfoPer;
    this.TechInfoPer = this.customerProfileService.loanPercentageValues.TechInfoPer;
    this.FinInfoPer = this.customerProfileService.loanPercentageValues.FinInfoPer;
    this.ChecklistPer = this.customerProfileService.loanPercentageValues.ChecklistPer;

    this.commentsFrom = this.customerProfileService.commentsFrom;
    this.commentArrayExists = this.customerProfileService.commentArrayExists;
    this.commentArray = this.customerProfileService.commentArray;

    this.communicationsService.getDocumentService(this.requestId, "l").then(requests => {

      this.documentStructure = this.commonService.returnViewDocumentJson(requests);
      this.commonService.showSuccessToast(this.translate.instant('FINANCIAL_INFORMATION.success')); 

    });

    if (this.requestId != undefined)
      this.loanApplicationService
        .getcofinancier(this.customerProfileService.loanArray.FinPlanId, this.requestId)
        .then((res) => (this.getFinancialData(res)), err => console.log(err));
    else
      this.commonService.showFailureToast( this.translate.instant('FINANCIAL_INFORMATION.fail'));

   this.loanApplicationService
      .getAssetStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
      .then((res) => (this.getFinancialData(res)), err => console.log(err));

    this.loanApplicationService
      .getLiabilityStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
      .then((res) => (this.getFinancialData(res)), err => console.log(err));

    this.loanApplicationService
      .getIncomeStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
      .then((res) => (this.getFinancialData(res)), err => console.log(err));

    this.loanApplicationService
      .getFinancialFlow(this.customerProfileService.loanArray.BpId)
      .then((res) => (this.getFinancialData(res)), err => console.log(err));

    if (this.commentArrayExists)
      this.resolveCommonComments();

  }

  postcofinancier(res) {
    // console.log(res);
    if (res) {
      if (!res.Cofinancers) {
        if (res.MessType == "S") {

          if (parseFloat(res.Percentage) > 100) {
            this.FinInfoPer = 100;
          }
          else {
            this.FinInfoPer = parseFloat(res.Percentage);
          }

          this.customerProfileService.loanPercentageValues.FinInfoPer = this.FinInfoPer;

          this.ChecklistPer = (this.customerProfileService.loanPercentageValues.GenInfoPer +
            this.customerProfileService.loanPercentageValues.MarkInfoPer +
            this.customerProfileService.loanPercentageValues.TechInfoPer +
            this.customerProfileService.loanPercentageValues.FinInfoPer) / 4;

          this.customerProfileService.loanPercentageValues.ChecklistPer = this.ChecklistPer;

          if (this.requestId != undefined) {
            this.loanApplicationService
            .getcofinancier(this.customerProfileService.loanArray.FinPlanId, this.requestId)
            .then((res) => (this.getFinancialData(res)), err => console.log(err));
            //this.spinnerService.hide();
            this.commonService.showSuccessToast(res.MessText);
          }
          else
            this.commonService.showFailureToast("Financial Information Failed !");
        }
        else {
          if (this.requestId != undefined) {
            this.loanApplicationService
            .getcofinancier(this.customerProfileService.loanArray.FinPlanId, this.requestId)
            .then((res) => (this.getFinancialData(res)), err => console.log(err));
            //this.spinnerService.hide();
            this.commonService.showFailureToast(res.MessText);
          }
          else
            this.commonService.showFailureToast("Financial Information Failed !");
        }
      }
      else {
        if (res.Cofinancers[0].MessType == "S") {

          if (parseFloat(res.Percentage) > 100) {
            this.FinInfoPer = 100;
          }
          else {
            this.FinInfoPer = parseFloat(res.Percentage);
          }

          this.customerProfileService.loanPercentageValues.FinInfoPer = this.FinInfoPer;

          this.ChecklistPer = (this.customerProfileService.loanPercentageValues.GenInfoPer +
            this.customerProfileService.loanPercentageValues.MarkInfoPer +
            this.customerProfileService.loanPercentageValues.TechInfoPer +
            this.customerProfileService.loanPercentageValues.FinInfoPer) / 4;

          this.customerProfileService.loanPercentageValues.ChecklistPer = this.ChecklistPer;

          if (this.requestId != undefined) {
            this.loanApplicationService
            .getcofinancier(this.customerProfileService.loanArray.FinPlanId, this.requestId)
            .then((res) => (this.getFinancialData(res)), err => console.log(err));
            // this.spinnerService.hide();
            this.commonService.showSuccessToast(res.Cofinancers[0].MessText);
          }
          else
            this.commonService.showFailureToast("Financial Information Failed !");
        }
        else {
          if (this.requestId != undefined) {
            this.loanApplicationService
              .getcofinancier(this.customerProfileService.loanArray.FinPlanId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));
            //this.spinnerService.hide();
            this.commonService.showFailureToast(res.Cofinancers[0].MessText);
          }
          else
            this.commonService.showFailureToast("Financial Information Failed !");
        }
      }
    }
  }

  getFinancialData(res) {

    //console.log(res);
    //console.log(Object.keys(res.Incstat).length);
    if (res && res.MessType == "S") {

      if (res.ProjCost) {

        this.spinnerService.hide();

        if (parseFloat(res.Percentage) > 100) {
          this.FinInfoPer = 100;
        }
        else {
          this.FinInfoPer = parseFloat(res.Percentage);
        }

        this.totprjamount = parseFloat(res.ProjCost);
        this.Cofinancers = [];
        this.source_of_finance_source.load(this.Cofinancers);
      }
      if (res.Cofinancers) {

        this.source_of_finance_source.empty();
        this.Cofinancers = [];
        this.source_of_finance_source_length = 0;
        var tot_amount = 0;
        var tot_percent = 0;



        for (var i = 0; i < res.Cofinancers.length; i++) {
          var TypeId_typecode = "";
          res.Cofinancers[i]["Operation"] = "U";

          if (res.Cofinancers[i].Type)
            var cofin_type = this.CofinsType_list.find((o) => o.Id === res.Cofinancers[i].Type.Id);
          if (cofin_type)
            TypeId_typecode = cofin_type.Desc;

          res.Cofinancers[i]["TypeId"] = TypeId_typecode;

          tot_amount += parseFloat(res.Cofinancers[i].Amount);
          tot_percent += parseFloat(res.Cofinancers[i].Percent);

          res.Cofinancers[i]["CofinancerId"] = res.Cofinancers[i].CofinancerId;

          res.Cofinancers[i]["Amount"] = "SAR " + this.numberWithCommas(res.Cofinancers[i].Amount);

          this.Cofinancers.push(res.Cofinancers[i]);
        }
        if (res.Cofinancers.length > 0)
          this.Cofinancers.push({ "TypeId": this.translate.instant('FINANCIAL_INFORMATION.Total'), "Amount": "SAR " + this.numberWithCommas(tot_amount), "Percent": tot_percent });

        this.source_of_finance_source.load(this.Cofinancers);

        this.source_of_finance_source.refresh();
        //this.source_of_finance_source.load(this.Cofinancers);

        this.source_of_finance_source_length = res.Cofinancers.length + 1;

        this.spinnerService.hide();
      }
      else if (res.Assetstat) {
        if (res.Assetstat[0].Assetid) {

          var asset_statement_temp_source = [];

          this.asset_statement_source.getAll().then((res1) => {

            asset_statement_temp_source = res1;

            for (var i = 0; i < res.Assetstat.length; i++) {

              this.asset_statement_years.push(res.Assetstat[i].Year);
              this.assetId.push(res.Assetstat[i].Assetid);
              this.assetGuId.push(res.Assetstat[i].GuiId);

              var year_values = [res.Assetstat[i].Factorycash, res.Assetstat[i].Accntsrec, res.Assetstat[i].Inventory, res.Assetstat[i].Lcmargins,
              res.Assetstat[i].Prepaid, res.Assetstat[i].Other1, res.Assetstat[i].Currentassets, res.Assetstat[i].Land, res.Assetstat[i].Buildings,
              res.Assetstat[i].Machinery, res.Assetstat[i].Furniture, res.Assetstat[i].Vehicles, res.Assetstat[i].Lossprev, res.Assetstat[i].Other2,
              res.Assetstat[i].Contigencies, res.Assetstat[i].Totfixassets, res.Assetstat[i].Accumdepre, res.Assetstat[i].Netfixassets, res.Assetstat[i].Otherncassets,
              res.Assetstat[i].Sidfcharge, res.Assetstat[i].Preopexp, res.Assetstat[i].Totintang, res.Assetstat[i].Accumamort, res.Assetstat[i].Netintang,
              res.Assetstat[i].Totassets, "file", res.Assetstat[i].Yearcom];


              var mySettings = this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar;

              mySettings.columns["year_" + res.Assetstat[i].Year] = {
                title: res.Assetstat[i].Year,
                type: "string",
                filter: false
              }

              // mySettings.columns["year_" + res.Assetstat[i].Year] = {
              //   title: res.Assetstat[i].Year,
              //   type: "html",
              //   valuePrepareFunction: (cell, row) => {

              //     if(cell === 'file')
              //       return `<a onclick="abc()">file</a>`;

              //     else
              //       return `${cell}`;

              //   },  
              //   filter: false
              // }
              if (this.commonService.defaultLanguage == "en")
                this.asset_statement_settings = Object.assign({}, mySettings);
              else
                this.asset_statement_settings_ar = Object.assign({}, mySettings);

              for (var j = 0; j < asset_statement_temp_source.length; j++) {
                if (j < asset_statement_temp_source.length - 2)
                  asset_statement_temp_source[j]["year_" + res.Assetstat[i].Year] = "SAR " + this.numberWithCommas(year_values[j]);
                else
                  asset_statement_temp_source[j]["year_" + res.Assetstat[i].Year] = year_values[j];
              }
              this.asset_statement_source.load(asset_statement_temp_source);

              this.asset_statement_source.refresh();

              this.asset_statement_visible = true;

              this.asset_statement_edit_button_visible = true;

              this.asset_statement_delete_button_visible = true;

              this.asset_statement_view_button_visible = true;

              this.spinnerService.hide();
            }

          });

        }

      }
      else if (res.Liabstat) {
        if (res.Liabstat[0].Liabeqid) {

          var liabilities_statement_temp_source = [];

          this.liabilities_statement_source.getAll().then((res1) => {

            liabilities_statement_temp_source = res1;

            for (var i = 0; i < res.Liabstat.length; i++) {

              this.liabilities_statement_years.push(res.Liabstat[i].Year);
              this.liabilityId.push(res.Liabstat[i].Liabeqid);
              this.liabilityGuId.push(res.Liabstat[i].GuiId);


              var year_values = [res.Liabstat[i].Acpay, res.Liabstat[i].Std, res.Liabstat[i].Accruals, res.Liabstat[i].Cplsidf,
              res.Liabstat[i].Cplbank, res.Liabstat[i].Cplother, res.Liabstat[i].Other1, res.Liabstat[i].Other2, res.Liabstat[i].Currentliab,
              res.Liabstat[i].Ltdsidf, res.Liabstat[i].Ltdbank, res.Liabstat[i].Ltdother, res.Liabstat[i].Totltd, res.Liabstat[i].Nonsubltd,
              res.Liabstat[i].Totliab, res.Liabstat[i].Paidincap, res.Liabstat[i].Suborddebt, res.Liabstat[i].Retearn, res.Liabstat[i].Statres,
              res.Liabstat[i].Other3, res.Liabstat[i].Totequi, res.Liabstat[i].Totliabeq, "file", res.Liabstat[i].Yearcom];


              var mySettings = this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar;

              mySettings.columns["year_" + res.Liabstat[i].Year] = {
                title: res.Liabstat[i].Year,
                type: "string",
                filter: false
              }

              if (this.commonService.defaultLanguage == "en")
                this.liabilities_statement_settings = Object.assign({}, mySettings);
              else
                this.liabilities_statement_settings_ar = Object.assign({}, mySettings);

              for (var j = 0; j < liabilities_statement_temp_source.length; j++) {
                if (j < liabilities_statement_temp_source.length - 2)
                  liabilities_statement_temp_source[j]["year_" + res.Liabstat[i].Year] = "SAR " + this.numberWithCommas(year_values[j]);
                else
                  liabilities_statement_temp_source[j]["year_" + res.Liabstat[i].Year] = year_values[j];
              }

              this.liabilities_statement_source.load(liabilities_statement_temp_source);

              this.liabilities_statement_source.refresh();

              this.liabilities_statement_visible = true;

              this.liabilities_statement_edit_button_visible = true;

              this.liabilities_statement_delete_button_visible = true;

              this.liabilities_statement_view_button_visible = true;

              this.spinnerService.hide();

            }

          });

        }

      }
      else if (res.Incstat) {
        if (res.Incstat[0].Incomeid) {

          var income_statement_temp_source = [];

          this.income_statement_source.getAll().then((res1) => {

            income_statement_temp_source = res1;

            for (var i = 0; i < res.Incstat.length; i++) {

              this.income_statement_years.push(res.Incstat[i].Year);
              this.incomeId.push(res.Incstat[i].Incomeid);
              this.incomeGuId.push(res.Incstat[i].GuiId);

              var year_values = [res.Incstat[i].Sales, res.Incstat[i].Rawmat, res.Incstat[i].Dirlab, res.Incstat[i].Maint,
              res.Incstat[i].Utils, res.Incstat[i].Deprec, res.Incstat[i].Amort, res.Incstat[i].Othdirexp, res.Incstat[i].Cgs,
              res.Incstat[i].Grossmar, res.Incstat[i].Salesad, res.Incstat[i].Salar, res.Incstat[i].Finchar, res.Incstat[i].Othexp,
              res.Incstat[i].Totindcost, res.Incstat[i].Pbtzak, res.Incstat[i].Taxzak, res.Incstat[i].Profit, res.Incstat[i].Statres,
              res.Incstat[i].Divid, res.Incstat[i].Retear, "file", res.Incstat[i].Yearcom];

              var mySettings = this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar;

              mySettings.columns["year_" + res.Incstat[i].Year] = {
                title: res.Incstat[i].Year,
                type: "string",
                filter: false
              }

              if (this.commonService.defaultLanguage == "en")
                this.income_statement_settings = Object.assign({}, mySettings);
              else
                this.income_statement_settings_ar = Object.assign({}, mySettings);

              for (var j = 0; j < income_statement_temp_source.length; j++) {
                if (j < income_statement_temp_source.length - 2)
                  income_statement_temp_source[j]["year_" + res.Incstat[i].Year] = "SAR " + this.numberWithCommas(year_values[j]);
                else
                  income_statement_temp_source[j]["year_" + res.Incstat[i].Year] = year_values[j];
              }

              this.income_statement_source.load(income_statement_temp_source);

              this.income_statement_source.refresh();

              this.income_statement_visible = true;

              this.income_statement_edit_button_visible = true;

              this.income_statement_delete_button_visible = true;

              this.income_statement_view_button_visible = true;

              this.spinnerService.hide();

            }

          });

        }
      }
      else if (res.Flowstat) {
        if (res.Flowstat[0].Flowid) {

          var project_financial_flows_temp_source = [];

          this.project_financial_flows_source.getAll().then((res1) => {

            project_financial_flows_temp_source = res1;

            for (var i = 0; i < res.Flowstat.length; i++) {

              this.financial_flow_years.push(res.Flowstat[i].Year);
              this.flowsourceId.push(res.Flowstat[i].Flowid);
              //this.flowsourceGuId.push(res.Flowstat[i].GuiId);

              var year_values = [res.Flowstat[i].SPaidIncap, res.Flowstat[i].SLtdSidf, res.Flowstat[i].SLtdBank, res.Flowstat[i].SLtdOther,
              res.Flowstat[i].SSubordDebt, res.Flowstat[i].SStd, res.Flowstat[i].SOtherAssets, res.Flowstat[i].SOtherLiaeq, res.Flowstat[i].SProfit,
              res.Flowstat[i].SNonCash, res.Flowstat[i].STotalSources, res.Flowstat[i].UCapExp, res.Flowstat[i].UWorkInvest, res.Flowstat[i].UPreopExp, res.Flowstat[i].ULtdSidf, res.Flowstat[i].ULtdBank
                , res.Flowstat[i].ULtdOther, res.Flowstat[i].USubordDebt, res.Flowstat[i].UStd, res.Flowstat[i].UDividends, res.Flowstat[i].UOtherAssets, res.Flowstat[i].UOtherLiaeq, res.Flowstat[i].UTotalUse
                , res.Flowstat[i].Cashflow, res.Flowstat[i].EndingCash];

              var mySettings = this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar;

              mySettings.columns["year_" + res.Flowstat[i].Year] = {
                title: res.Flowstat[i].Year,
                type: "string",
                filter: false
              }

              if (this.commonService.defaultLanguage == "en")
                this.project_financial_flows_settings = Object.assign({}, mySettings);
              else
                this.project_financial_flows_settings_ar = Object.assign({}, mySettings);

              for (var j = 0; j < project_financial_flows_temp_source.length; j++) {
                if (j < project_financial_flows_temp_source.length)
                  project_financial_flows_temp_source[j]["year_" + res.Flowstat[i].Year] = "SAR " + this.numberWithCommas(year_values[j]);

              }
              //
              this.project_financial_flows_source.load(project_financial_flows_temp_source);

              this.project_financial_flows_source.refresh();

              this.financial_flow_visible = true;

              this.financial_flow_edit_button_visible = true;

              this.financial_flow_delete_button_visible = true;

              this.spinnerService.hide();
            }

          });

        }

      }
    }

    else {
      this.spinnerService.hide();
    }

  }

  // getCommonComments() {

  //   try {

  //     this.commonCommentsService
  //       .getCommonComments(395, this.commentTypeCode)
  //       .then((res) => (this.resolveCommonComments(res)), err => this.commonService.showFailureToast(err));

  //   }

  //   catch (err) {
  //     this.spinnerService.hide();
  //     this.commonService.showFailureToast(err);
  //   }

  // }

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

          if (resolvedCommentArray["RecReqSection"][i].ReqSec == "LONFI" && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {
            if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "FISOU") {

              this.source_of_finance_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.source_of_finance_comments.SectionCode, ReqSubSec: this.source_of_finance_comments.SubSectionCode });

              this.source_of_finance_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.source_of_finance_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.source_of_finance_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.source_of_finance_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.source_of_finance_comments.commentDetails["DeadLineDate"] = this.source_of_finance_comments.commentArray[0]["DeadLineDate"];
              this.source_of_finance_comments.commentDetails["GuiId"] = this.source_of_finance_comments.commentArray[0]["GuiId"];
              this.source_of_finance_comments.commentDetails["DefId"] = this.source_of_finance_comments.commentArray[0]["DefId"];
              this.source_of_finance_comments.commentDetails["ReqSec"] = this.source_of_finance_comments.commentArray[0]["ReqSec"];
              this.source_of_finance_comments.commentDetails["ReqSecDesc"] = this.source_of_finance_comments.commentArray[0]["ReqSecDesc"];
              this.source_of_finance_comments.commentDetails["ReqStatus"] = this.source_of_finance_comments.commentArray[0]["ReqStatus"];
              this.source_of_finance_comments.commentDetails["ReqStatusDesc"] = this.source_of_finance_comments.commentArray[0]["ReqStatusDesc"];
              this.source_of_finance_comments.commentDetails["ReqSubSec"] = this.source_of_finance_comments.commentArray[0]["ReqSubSec"];
              this.source_of_finance_comments.commentDetails["ReqSubSecDesc"] = this.source_of_finance_comments.commentArray[0]["ReqSubSecDesc"];
              this.source_of_finance_comments.commentDetails["SectionId"] = this.source_of_finance_comments.commentArray[0]["SectionId"];

              var openComments = this.source_of_finance_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.source_of_finance_comments.anyOpenComments = true;
              else
                this.source_of_finance_comments.anyOpenComments = false;

              this.source_of_finance_comments.commentArray = this.source_of_finance_comments.commentArray[0]["RecReqComment"];

              this.source_of_finance_comments.hasComments = true;

            }

else            if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "FIBAL") {

              this.asset_statement_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.asset_statement_comments.SectionCode, ReqSubSec: this.asset_statement_comments.SubSectionCode });

              this.asset_statement_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.asset_statement_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.asset_statement_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.asset_statement_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.asset_statement_comments.commentDetails["DeadLineDate"] = this.asset_statement_comments.commentArray[0]["DeadLineDate"];
              this.asset_statement_comments.commentDetails["GuiId"] = this.asset_statement_comments.commentArray[0]["GuiId"];
              this.asset_statement_comments.commentDetails["ReqSec"] = this.asset_statement_comments.commentArray[0]["ReqSec"];
              this.asset_statement_comments.commentDetails["ReqSecDesc"] = this.asset_statement_comments.commentArray[0]["ReqSecDesc"];
              this.asset_statement_comments.commentDetails["ReqStatus"] = this.asset_statement_comments.commentArray[0]["ReqStatus"];
              this.asset_statement_comments.commentDetails["ReqStatusDesc"] = this.asset_statement_comments.commentArray[0]["ReqStatusDesc"];
              this.asset_statement_comments.commentDetails["ReqSubSec"] = this.asset_statement_comments.commentArray[0]["ReqSubSec"];
              this.asset_statement_comments.commentDetails["ReqSubSecDesc"] = this.asset_statement_comments.commentArray[0]["ReqSubSecDesc"];
              this.asset_statement_comments.commentDetails["SectionId"] = this.asset_statement_comments.commentArray[0]["SectionId"];

              var openComments = this.asset_statement_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.asset_statement_comments.anyOpenComments = true;
              else
                this.asset_statement_comments.anyOpenComments = false;

              this.asset_statement_comments.commentArray = this.asset_statement_comments.commentArray[0]["RecReqComment"];

              this.asset_statement_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "FILEQ") {

              this.liabilities_statement_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.liabilities_statement_comments.SectionCode, ReqSubSec: this.liabilities_statement_comments.SubSectionCode });

              this.liabilities_statement_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.liabilities_statement_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.liabilities_statement_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.liabilities_statement_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.liabilities_statement_comments.commentDetails["DeadLineDate"] = this.liabilities_statement_comments.commentArray[0]["DeadLineDate"];
              this.liabilities_statement_comments.commentDetails["GuiId"] = this.liabilities_statement_comments.commentArray[0]["GuiId"];
              this.liabilities_statement_comments.commentDetails["ReqSec"] = this.liabilities_statement_comments.commentArray[0]["ReqSec"];
              this.liabilities_statement_comments.commentDetails["ReqSecDesc"] = this.liabilities_statement_comments.commentArray[0]["ReqSecDesc"];
              this.liabilities_statement_comments.commentDetails["ReqStatus"] = this.liabilities_statement_comments.commentArray[0]["ReqStatus"];
              this.liabilities_statement_comments.commentDetails["ReqStatusDesc"] = this.liabilities_statement_comments.commentArray[0]["ReqStatusDesc"];
              this.liabilities_statement_comments.commentDetails["ReqSubSec"] = this.liabilities_statement_comments.commentArray[0]["ReqSubSec"];
              this.liabilities_statement_comments.commentDetails["ReqSubSecDesc"] = this.liabilities_statement_comments.commentArray[0]["ReqSubSecDesc"];
              this.liabilities_statement_comments.commentDetails["SectionId"] = this.liabilities_statement_comments.commentArray[0]["SectionId"];

              var openComments = this.liabilities_statement_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.liabilities_statement_comments.anyOpenComments = true;
              else
                this.liabilities_statement_comments.anyOpenComments = false;

              this.liabilities_statement_comments.commentArray = this.liabilities_statement_comments.commentArray[0]["RecReqComment"];

              this.liabilities_statement_comments.hasComments = true;

            }

            else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "FIINC") {

              this.income_statement_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.income_statement_comments.SectionCode, ReqSubSec: this.income_statement_comments.SubSectionCode });

              this.income_statement_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
              this.income_statement_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
              this.income_statement_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
              this.income_statement_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
              this.income_statement_comments.commentDetails["DeadLineDate"] = this.income_statement_comments.commentArray[0]["DeadLineDate"];
              this.income_statement_comments.commentDetails["GuiId"] = this.income_statement_comments.commentArray[0]["GuiId"];
              this.income_statement_comments.commentDetails["ReqSec"] = this.income_statement_comments.commentArray[0]["ReqSec"];
              this.income_statement_comments.commentDetails["ReqSecDesc"] = this.income_statement_comments.commentArray[0]["ReqSecDesc"];
              this.income_statement_comments.commentDetails["ReqStatus"] = this.income_statement_comments.commentArray[0]["ReqStatus"];
              this.income_statement_comments.commentDetails["ReqStatusDesc"] = this.income_statement_comments.commentArray[0]["ReqStatusDesc"];
              this.income_statement_comments.commentDetails["ReqSubSec"] = this.income_statement_comments.commentArray[0]["ReqSubSec"];
              this.income_statement_comments.commentDetails["ReqSubSecDesc"] = this.income_statement_comments.commentArray[0]["ReqSubSecDesc"];
              this.income_statement_comments.commentDetails["SectionId"] = this.income_statement_comments.commentArray[0]["SectionId"];

              var openComments = this.income_statement_comments.commentArray.find((o) => o.ReqStatus == "O");

              if (openComments)
                this.income_statement_comments.anyOpenComments = true;
              else
                this.income_statement_comments.anyOpenComments = false;

              this.income_statement_comments.commentArray = this.income_statement_comments.commentArray[0]["RecReqComment"];

              this.income_statement_comments.hasComments = true;

            }

            // else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIGUA") {

            //   this.guarantors_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.guarantors_comments.SectionCode, ReqSubSec: this.guarantors_comments.SubSectionCode });

            //   this.guarantors_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            //   this.guarantors_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            //   this.guarantors_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            //   this.guarantors_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
            //   this.guarantors_comments.commentDetails["DeadLineDate"] = this.guarantors_comments.commentArray[0]["DeadLineDate"];
           //   this.guarantors_comments.commentDetails["GuiId"] = this.guarantors_comments.commentArray[0]["GuiId"];
            //   this.guarantors_comments.commentDetails["ReqSec"] = this.guarantors_comments.commentArray[0]["ReqSec"];
            //   this.guarantors_comments.commentDetails["ReqSecDesc"] = this.guarantors_comments.commentArray[0]["ReqSecDesc"];
            //   this.guarantors_comments.commentDetails["ReqStatus"] = this.guarantors_comments.commentArray[0]["ReqStatus"];
            //   this.guarantors_comments.commentDetails["ReqStatusDesc"] = this.guarantors_comments.commentArray[0]["ReqStatusDesc"];
            //   this.guarantors_comments.commentDetails["ReqSubSec"] = this.guarantors_comments.commentArray[0]["ReqSubSec"];
            //   this.guarantors_comments.commentDetails["ReqSubSecDesc"] = this.guarantors_comments.commentArray[0]["ReqSubSecDesc"];
            //   this.guarantors_comments.commentDetails["SectionId"] = this.guarantors_comments.commentArray[0]["SectionId"];

            //   var openComments = this.guarantors_comments.commentArray.find((o) => o.ReqStatus == "O");

            //   if (openComments)
            //     this.guarantors_comments.anyOpenComments = true;
            //   else
            //     this.guarantors_comments.anyOpenComments = false;

            //   this.guarantors_comments.commentArray = this.guarantors_comments.commentArray[0]["RecReqComment"];

            //   this.guarantors_comments.hasComments = true;

            // }

            // else if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == "PIRES") {

            //   this.real_estates_comments.commentDetails = commentDetails;

            //   this.real_estates_comments.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.real_estates_comments.SectionCode, ReqSubSec: this.real_estates_comments.SubSectionCode });

           //   this.real_estates_comments.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            //   this.real_estates_comments.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            //   this.real_estates_comments.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            //   this.real_estates_comments.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];
            //   this.real_estates_comments.commentDetails["DeadLineDate"] = this.real_estates_comments.commentArray[0]["DeadLineDate"];
            //   this.real_estates_comments.commentDetails["GuiId"] = this.real_estates_comments.commentArray[0]["GuiId"];
            //   this.real_estates_comments.commentDetails["ReqSec"] = this.real_estates_comments.commentArray[0]["ReqSec"];
            //   this.real_estates_comments.commentDetails["ReqSecDesc"] = this.real_estates_comments.commentArray[0]["ReqSecDesc"];
            //   this.real_estates_comments.commentDetails["ReqStatus"] = this.real_estates_comments.commentArray[0]["ReqStatus"];
            //   this.real_estates_comments.commentDetails["ReqStatusDesc"] = this.real_estates_comments.commentArray[0]["ReqStatusDesc"];
            //   this.real_estates_comments.commentDetails["ReqSubSec"] = this.real_estates_comments.commentArray[0]["ReqSubSec"];
            //   this.real_estates_comments.commentDetails["ReqSubSecDesc"] = this.real_estates_comments.commentArray[0]["ReqSubSecDesc"];
            //   this.real_estates_comments.commentDetails["SectionId"] = this.real_estates_comments.commentArray[0]["SectionId"];

            //   var openComments = this.real_estates_comments.commentArray.find((o) => o.ReqStatus == "O");

            //   if (openComments)
            //     this.real_estates_comments.anyOpenComments = true;
            //   else
            //     this.real_estates_comments.anyOpenComments = false;

            //   this.real_estates_comments.commentArray = this.real_estates_comments.commentArray[0]["RecReqComment"];

            //   this.real_estates_comments.hasComments = true;

            // }

          }

        }

        this.setEditableSectionsBasedOnCommunication();
      this.spinnerService.hide();

    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  onSave() {

    // var source_of_finance_temp_source = [];
    // var tot_percent = 0;

    // this.source_of_finance_source.getAll().then((res) => {

    //   source_of_finance_temp_source = res;

    //   for (var i = 0; i < source_of_finance_temp_source.length; i++) {

    //     tot_percent += parseFloat(source_of_finance_temp_source[i].Percent);
    //   }
    //   if (tot_percent != 100) {
    //     this.commonService.showFailureToast("Total Percent of all Source of Finance should be 100%");
    //   }
    //   else {
    this.onResult([], 6, 1, 1);
    //   }
    // });




  }

  onResult(result, type_statement, filedata, randomNum) {
    //console.log(result);

    switch (type_statement) {
      case 2:
        if (result.Assetstat)
          if (result.Assetstat[0].MessType == "S") {

            var project_financial_flows_temp_source = [];

            this.project_financial_flows_source.getAll().then((res) => {

              project_financial_flows_temp_source = res;



              var project_financial_flows_post_data = {

                "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                "Bpid": this.customerProfileService.loanArray.BpId,
                "Origin": "CP",
                "Sentreqid": this.requestId,
                "Customerid": "",
                "Flowstat": [],


              };

              this.loanApplicationService.postFlowStatement(project_financial_flows_post_data)
                .then((res) => (this.onResult(res, 5, 1, 1), err => console.log(err)));

              this.financialflowflag = 1;

            });

            if (this.isdelete != "true") {

              if (filedata.length > 0) {
                var asset_statement_upload_document_post_data = {

                  "documentDefId": "121",
                  "entityId": this.requestId,
                  "entityName": "Project",
                  "RelatedEntityId": randomNum,
                  "RelatedEntityName": "finAssetStats",
                  "operationType": "l"
                }
                //
                this.communicationsService.uploadDocumentService(filedata, asset_statement_upload_document_post_data).then(requests => {
                  this.documentUploadStatus(requests)
                }, err => (console.log(err)));
              }
            }
            else {

              for (var i = 0; i < filedata.length; i++) {

                this.communicationsService.deleteDocumentService({ entityId: filedata[i].EntityId, refId: filedata[i].RefId, documentId: filedata[i].DocumentId, operationType: 'l' })
                  .then(response => {
                    // console.log("success");
                  }, err => (console.log(err)));

              }

            }

            this.asset_statement_years = [];
            this.assetId = [];
            this.assetGuId = [];

            this.loanApplicationService
              .getAssetStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));

            this.isdelete = "false";

            //this.spinnerService.hide();
            this.commonService.showSuccessToast(result.Assetstat[0].MessText);

          }
          else {
            this.isdelete = "false";
            this.loanApplicationService
              .getAssetStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));
            //this.spinnerService.hide();
            this.commonService.showFailureToast(result.Assetstat[0].MessText);

          }
        break;

      case 3:
        if (result.Liabstat)
          if (result.Liabstat[0].MessType == "S") {

            var project_financial_flows_temp_source = [];

            this.project_financial_flows_source.getAll().then((res) => {

              project_financial_flows_temp_source = res;



              var project_financial_flows_post_data = {

                "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                "Bpid": this.customerProfileService.loanArray.BpId,
                "Origin": "CP",
                "Sentreqid": this.requestId,
                "Customerid": "",
                "Flowstat": [],


              };

              this.loanApplicationService.postFlowStatement(project_financial_flows_post_data)
                .then((res) => (this.onResult(res, 5, 1, 1), err => console.log(err)));

              this.financialflowflag = 1;

            });

            if (this.isdelete != "true") {
              if (filedata.length > 0) {
                var liability_statement_upload_document_post_data = {

                  "documentDefId": "121",
                  "entityId": this.requestId,
                  "entityName": "Project",
                  "RelatedEntityId": randomNum,
                  "RelatedEntityName": "finLiabStats",
                  "operationType": "l"
                }
                //
                this.communicationsService.uploadDocumentService(filedata, liability_statement_upload_document_post_data).then(requests => (this.documentUploadStatus(requests)), err => (console.log(err)));
              }
            }
            else {

              for (var i = 0; i < filedata.length; i++) {

                this.communicationsService.deleteDocumentService({ entityId: filedata[i].EntityId, refId: filedata[i].RefId, documentId: filedata[i].DocumentId, operationType: 'l' })
                  .then(response => {
                    // console.log("success");
                  }, err => (console.log(err)));

              }

            }

            this.liabilities_statement_years = [];
            this.liabilityId = [];
            this.liabilityGuId = [];

            this.loanApplicationService
              .getLiabilityStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));

            this.isdelete = "false";

            //this.spinnerService.hide();
            this.commonService.showSuccessToast(result.Liabstat[0].MessText);

          }
          else {
            this.isdelete = "false";

            this.loanApplicationService
              .getLiabilityStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));

            //this.spinnerService.hide();
            this.commonService.showFailureToast(result.Liabstat[0].MessText);

          }
        break;

      case 4:
        if (result.Incstat)
         if (result.Incstat[0].MessType == "S") {

            var project_financial_flows_temp_source = [];

            this.project_financial_flows_source.getAll().then((res) => {

              project_financial_flows_temp_source = res;



              var project_financial_flows_post_data = {

                "_comment": "Change BP value or Year value for every test. Only a successful transaction will return ID in response!",
                "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                "Bpid": this.customerProfileService.loanArray.BpId,
                "Origin": "CP",
                "Sentreqid": this.requestId,
                "Customerid": "",
                "Flowstat": [],


              };

              this.loanApplicationService.postFlowStatement(project_financial_flows_post_data)
                .then((res) => (this.onResult(res, 5, 1, 1), err => console.log(err)));

              this.financialflowflag = 1;

            });

            if (this.isdelete != "true") {
              if (filedata.length > 0) {
                var income_statement_upload_document_post_data = {

                  "documentDefId": "121",
                  "entityId": this.requestId,
                  "entityName": "Project",
                  "RelatedEntityId": randomNum,
                  "RelatedEntityName": "finStat",
                  "operationType": "l"
                }
                //
                this.communicationsService.uploadDocumentService(filedata, income_statement_upload_document_post_data).then(requests => (this.documentUploadStatus(requests)), err => (console.log(err)));
              }
            }
            else {

              for (var i = 0; i < filedata.length; i++) {

                this.communicationsService.deleteDocumentService({ entityId: filedata[i].EntityId, refId: filedata[i].RefId, documentId: filedata[i].DocumentId, operationType: 'l' })
                  .then(response => {
                    // console.log("success");
                  });

              }

            }

            this.income_statement_years = [];
            this.incomeId = [];
            this.incomeGuId = [];

            this.loanApplicationService
              .getIncomeStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));

            this.isdelete = "false";

            //this.spinnerService.hide();
            this.commonService.showSuccessToast(result.Incstat[0].MessText);

          }
          else {
            this.isdelete = "false";

            this.loanApplicationService
              .getIncomeStatement(this.customerProfileService.loanArray.BpId, this.customerProfileService.currentCustomerProfile.customerProfileId, this.requestId)
              .then((res) => (this.getFinancialData(res)), err => console.log(err));

            //this.spinnerService.hide();
            this.commonService.showFailureToast(result.Incstat[0].MessText);
          }
        break;

      case 5:
        // if(result.Flowstat)
        // if (result.Flowstat[0].MessType == "S") {


        //       if(this.isdelete != "true"){
        //         if(filedata.length > 0){
        //           var flow_statement_upload_document_post_data = {

        //             "documentDefId": "121",
        //             "entityId": this.requestId,
        //             "entityName": "Project",
        //             "RelatedEntityId": randomNum,
        //             "RelatedEntityName": "finFlowStats",
        //             "operationType": "p"
        //           }
        // //
        //           this.communicationsService.uploadDocumentService(filedata , flow_statement_upload_document_post_data).then(requests => (console.log(requests)), err => (console.log(err)));
        //         }
        //         }
        //         else{

        //           for(var i = 0; i < filedata.length; i++ ){

        //             this.communicationsService.deleteDocumentService({ entityId: filedata[i].EntityId, refId: filedata[i].RefId, documentId: filedata[i].DocumentId, operationType: 'p' })
        //         .then(response => {
        //               console.log("success");
        //         });

        //           }

        //         }

        this.financial_flow_years = [];
        this.flowsourceId = [];
        this.flowsourceGuId = [];

        this.loanApplicationService
          .getFinancialFlow(this.customerProfileService.loanArray.BpId)
          .then((res) => (this.getFinancialData(res)), err => console.log(err));

        this.isdelete = "false";

        //this.spinnerService.hide();
        //this.commonService.showSuccessToast(result.Flowstat[0].MessText);


        // }
        // else {
        //   this.isdelete = "false";
        //   this.spinnerService.hide();
        //   this.commonService.showFailureToast(result.Flowstat[0].MessText);

        // }
        break;

      case 6:
        this.spinnerService.hide();
        this.commonService.showSuccessToast("Financial Information saved successfully !");

        break;

      default:

        break;
    }

  }

  documentUploadStatus(response) {

    if (response.MessType === "S") {
      this.commonService.showSuccessToast("Document(s) uploaded successfully !");
    }
    else {
      this.commonService.showFailureToast("Document(s) upload Failed. Try uploading in Edit !");
    }

  }

  documentDeleteStatus(response) {

    if (response.MessType === "S") {
      this.commonService.showSuccessToast("Document(s) deleted successfully !");
    }
  }

  onDeleteCofinancier(delete_cancel_modal, event, table_name) {
    if (this.statusCode != 'P' && this.statusCode != 'A') {
      if (event.data.TypeId != "Total") {
        this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
        this.deleteCancelModalReference.event = event;
        this.deleteCancelModalReference.table_name = table_name;
        this.deleteCancelModalReference.action = "Delete";
        this.deleteCancelModalReference.actionname = this.translate.instant('TECHNICAL_INFORMATION.Delete');

        if (this.deleteCancelModalReference.table_name == 'source_of_finance_cofinancer')
          this.deleteCancelModalReference.table_name_display = this.translate.instant('FINANCIAL_INFORMATION.coFinancer');
      }
      else {
        this.commonService.showFailureToast("Your not allowed to delete this row");
      }
    }
  }

  onDeleteConfirm() {

    this.spinnerService.show();

    if (this.deleteCancelModalReference.action == 'Delete') {

      if (this.deleteCancelModalReference.table_name == 'source_of_finance_cofinancer') {

        this.deleteCancelModalReference.event.data["Operation"] = "D";

        this.source_of_finance_source.remove(this.deleteCancelModalReference.event.data);

        this.source_of_finance_source_length--;



        var source_of_finance_final_delete_post_data = {
          "Cofinancers": [
            {
              "_comment1": "The below financing plan id is the loan id inputted in technical section under loan id field",
              "FinancingPlanId": this.customerProfileService.loanArray.FinPlanId,
              "CofinancerId": this.deleteCancelModalReference.event.data.CofinancerId,
              "Amount": this.deleteCancelModalReference.event.data.Amount.replace("SAR ", "").replace(/,/g, ""),
              "Percent": this.deleteCancelModalReference.event.data.Percent,
              "Type": { "Id": this.deleteCancelModalReference.event.data.TypeId },
              "Operation": this.deleteCancelModalReference.event.data.Operation,
            }
          ]

        };

        this.source_of_finance_source.refresh();

        this.deleteCancelModalReference.close();
        this.loanApplicationService
          .postcofinancier(source_of_finance_final_delete_post_data)
          .then((res) => (this.postcofinancier(res)), err => console.log(err));




      }
    }
  }

  onDelete(table_name) {

    this.spinnerService.show();

    this.documentStructure = {};

    this.communicationsService.getDocumentService(this.requestId, "p").then(requests => {

      this.documentStructure = this.commonService.returnViewDocumentJson(requests);



      this.spinnerService.hide();

      this.operation = "D";

      let financialInformationModalParams = {};

      var asset_statement_final_temp_source = [];
      let liabilities_statement_final_temp_source = [];
      var income_statement_delete_temp_source = [];
      var project_financial_flows_final_temp_source = [];


      if (table_name === 'source_of_finance') {

        let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
        FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

      }
      else if (table_name === 'asset_statement') {

        var asset_statement_temp_source = [];

        var flag = 0;

        this.asset_statement_source.getAll().then((res) => {

          asset_statement_temp_source = res;
          //console.log(asset_statement_temp_source);

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.deleteassetheader'),

            method: "delete",

            page: "Asset",

            data_source: asset_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.asset_statement_years,
               //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Delete'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;

                  var asset_statement_temp_source = [];

                  this.asset_statement_source.getAll().then((res) => {

                    asset_statement_temp_source = res;

                   this.isdelete = "true";

                    for (var i = 0; i <= this.asset_statement_years.length; i++) {
                      if (this.asset_statement_years[i] === selected_year) {
                        flag = i;
                      }
                    }

                    if (flag < this.assetId.length) {

                      for (var i = 0; i < this.asset_statement_years.length; i++) {
                        if (this.asset_statement_years[i] === selected_year) {
                          var assetIdNo = i;
                          var assetGuiIdNo = i;
                        }
                      }

                      var documentArray = [];

                      for (var i = 0; i < this.documentStructure["documentList"].length; i++) {

                        if (parseInt(this.documentStructure["documentList"][i].RelatedEntityId) === parseInt(this.assetGuId[assetGuiIdNo])) {

                          documentArray.push(this.documentStructure["documentList"][i]);

                        }
                      }

                      asset_statement_final_temp_source.push({

                        "Operation": "D",
                        "Assetid": this.assetId[assetIdNo],
                        "Year": selected_year,
                        "Factorycash": asset_statement_temp_source[0]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Accntsrec": asset_statement_temp_source[1]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Inventory": asset_statement_temp_source[2]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Lcmargins": asset_statement_temp_source[3]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Prepaid": asset_statement_temp_source[4]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Other1": asset_statement_temp_source[5]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Currentassets": asset_statement_temp_source[6]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Land": asset_statement_temp_source[7]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Buildings": asset_statement_temp_source[8]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Machinery": asset_statement_temp_source[9]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Furniture": asset_statement_temp_source[10]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Vehicles": asset_statement_temp_source[11]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Lossprev": asset_statement_temp_source[12]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Other2": asset_statement_temp_source[13]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Contigencies": asset_statement_temp_source[14]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totfixassets": asset_statement_temp_source[15]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Accumdepre": asset_statement_temp_source[16]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Netfixassets": asset_statement_temp_source[17]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Otherncassets": asset_statement_temp_source[18]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Sidfcharge": asset_statement_temp_source[19]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Preopexp": asset_statement_temp_source[20]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totintang": asset_statement_temp_source[21]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Accumamort": asset_statement_temp_source[22]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Netintang": asset_statement_temp_source[23]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totassets": asset_statement_temp_source[24]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Statetype": "H",
                        "GuiId": this.assetGuId[assetGuiIdNo],
                        "Yearcom:": asset_statement_temp_source[26]["year_" + selected_year]

                      });


                      var asset_statement_delete_data = {

                        "_comment": "Pass a valid BP or year to delete and ID is mandatory!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Assetstat": asset_statement_final_temp_source,


                      };

                      this.loanApplicationService.postAssetStatement(asset_statement_delete_data)
                        .then((res) => (this.onResult(res, 2, documentArray, this.assetGuId[assetGuiIdNo])), err => console.log(err));

                    }

                    for (var i = 0; i < asset_statement_temp_source.length; i++)
                      delete asset_statement_temp_source[i]["year_" + selected_year];

                    this.asset_statement_source.load(asset_statement_temp_source);

                    this.asset_statement_source.refresh();

                    //this.spinnerService.hide();

                    //this.commonService.showSuccessToast("Delete successful !");

                    var index = this.asset_statement_years.indexOf(selected_year);

                    if (index > -1) {

                      this.asset_statement_years.splice(index, 1);

                    }

                    var mySettings = this.commonService.defaultLanguage == "en" ? this.asset_statement_settings : this.asset_statement_settings_ar;

                    delete mySettings.columns["year_" + selected_year];

                    if (this.commonService.defaultLanguage == "en")
                      this.asset_statement_settings = Object.assign({}, mySettings);
                    else
                      this.asset_statement_settings_ar = Object.assign({}, mySettings);

                    if (this.asset_statement_years.length === 0) {
                      this.asset_statement_visible = false;
                      this.asset_statement_edit_button_visible = false;
                      this.asset_statement_delete_button_visible = false;
                      this.asset_statement_view_button_visible = false;
                    }


                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

        });
      }
      else if (table_name === 'liabilities_statement') {

        var liabilities_statement_temp_source = [];

        var flag = 0;

        this.liabilities_statement_source.getAll().then((res) => {

          liabilities_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.deleteliabilityheader'),

            method: "delete",

            page: "Liabilities",

            data_source: liabilities_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.liabilities_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Delete'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;

                  var liabilities_statement_temp_source = [];

                  var flag = 0;

                  this.liabilities_statement_source.getAll().then((res) => {

                    liabilities_statement_temp_source = res;

                    this.isdelete = "true";

                    for (var i = 0; i < this.liabilities_statement_years.length; i++) {
                      if (this.liabilities_statement_years[i] === selected_year) {
                        flag = i;
                      }
                    }

                    if (flag < this.liabilityId.length) {

                      for (var i = 0; i < this.liabilities_statement_years.length; i++) {
                        if (this.liabilities_statement_years[i] === selected_year) {
                          var liabIdNo = i;
                          var liabguiIdNo = i;
                        }
                      }

                      var documentArray = [];

                      for (var i = 0; i < this.documentStructure["documentList"].length; i++) {

                        if (parseInt(this.documentStructure["documentList"][i].RelatedEntityId) === parseInt(this.liabilityGuId[liabguiIdNo])) {

                          documentArray.push(this.documentStructure["documentList"][i]);

                        }
                      }

                      liabilities_statement_final_temp_source.push({

                        "Operation": "D",
                        "Liabeqid": this.liabilityId[liabIdNo],
                        "Year": selected_year,
                        "Acpay": liabilities_statement_temp_source[0]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Std": liabilities_statement_temp_source[1]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Accruals": liabilities_statement_temp_source[2]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Cplsidf": liabilities_statement_temp_source[3]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Cplbank": liabilities_statement_temp_source[4]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Cplother": liabilities_statement_temp_source[5]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Other1": liabilities_statement_temp_source[6]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Other2": liabilities_statement_temp_source[7]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Currentliab": liabilities_statement_temp_source[8]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Ltd": liabilities_statement_temp_source[9]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Ltdsidf": liabilities_statement_temp_source[9]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Ltdbank": liabilities_statement_temp_source[10]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Ltdother": liabilities_statement_temp_source[11]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totltd": liabilities_statement_temp_source[12]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Nonsubltd": liabilities_statement_temp_source[13]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totliab": liabilities_statement_temp_source[14]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Paidincap": liabilities_statement_temp_source[15]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Suborddebt": liabilities_statement_temp_source[16]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Retearn": liabilities_statement_temp_source[17]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Statres": liabilities_statement_temp_source[18]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Other3": liabilities_statement_temp_source[19]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totequi": liabilities_statement_temp_source[20]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totliabeq": liabilities_statement_temp_source[21]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Stattype": "H",
                        "GuiId": this.liabilityGuId[liabguiIdNo],
                        "Yearcom": liabilities_statement_temp_source[23]["year_" + selected_year]

                      });

                      var liabilities_statement_delete_data = {

                        "_comment": "Pass a valid BP or year to delete and ID is mandatory!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Liabstat": liabilities_statement_final_temp_source,

                      };

                      this.loanApplicationService.postLiabilitiesStatement(liabilities_statement_delete_data)
                        .then((res) => (this.onResult(res, 3, documentArray, this.liabilityGuId[liabguiIdNo])), err => console.log(err));

                    }

                   for (var i = 0; i < liabilities_statement_temp_source.length; i++)
                      delete liabilities_statement_temp_source[i]["year_" + selected_year];

                    this.liabilities_statement_source.load(liabilities_statement_temp_source);

                    this.liabilities_statement_source.refresh();

                    //this.spinnerService.hide();

                    //this.commonService.showSuccessToast("Delete successful !");

                    var index = this.liabilities_statement_years.indexOf(selected_year);

                    if (index > -1) {

                      this.liabilities_statement_years.splice(index, 1);

                    }

                    var mySettings = this.commonService.defaultLanguage == "en" ? this.liabilities_statement_settings : this.liabilities_statement_settings_ar;

                    delete mySettings.columns["year_" + selected_year];

                    if (this.commonService.defaultLanguage == "en")
                      this.liabilities_statement_settings = Object.assign({}, mySettings);
                    else
                      this.liabilities_statement_settings_ar = Object.assign({}, mySettings);

                    if (this.liabilities_statement_years.length === 0) {
                      this.liabilities_statement_visible = false;
                      this.liabilities_statement_edit_button_visible = false;
                      this.liabilities_statement_delete_button_visible = false;
                      this.liabilities_statement_view_button_visible = false;
                    }


                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

        });
      }
      else if (table_name === 'income_statement') {

        var income_statement_temp_source = [];

        var flag = 0;

        this.income_statement_source.getAll().then((res) => {

          income_statement_temp_source = res;

          financialInformationModalParams = {

            header: this.translate.instant('FINANCIAL_INFORMATION.deleteincomeheader'),

            method: "delete",

            page: "Income",

            data_source: income_statement_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar,

            inputs: [
              {
                id: "year",
                name: this.translate.instant('FINANCIAL_INFORMATION.year'),
                type: "select",
                value: this.income_statement_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Delete'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;

                  var income_statement_temp_source = [];

                  this.income_statement_source.getAll().then((res) => {

                    income_statement_temp_source = res;

                    this.isdelete = "true";


                    for (var i = 0; i < this.income_statement_years.length; i++) {
                      if (this.income_statement_years[i] === selected_year) {
                        flag = i;
                      }
                    }

                    if (flag < this.incomeId.length) {

                      for (var i = 0; i < this.income_statement_years.length; i++) {
                        if (this.income_statement_years[i] === selected_year) {
                          var incomeIdNo = i;
                          var incomeGuiIdNo = i;
                        }
                      }

                      var documentArray = [];

                      for (var i = 0; i < this.documentStructure["documentList"].length; i++) {

                       if (parseInt(this.documentStructure["documentList"][i].RelatedEntityId) === parseInt(this.incomeGuId[incomeGuiIdNo])) {

                          documentArray.push(this.documentStructure["documentList"][i]);

                        }
                      }

                      income_statement_delete_temp_source.push({

                        "Operation": "D",
                        "Incomeid": this.incomeId[incomeIdNo],
                        "Year": selected_year,
                        "Sales": income_statement_temp_source[0]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Rawmat": income_statement_temp_source[1]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Dirlab": income_statement_temp_source[2]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Maint": income_statement_temp_source[3]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Utils": income_statement_temp_source[4]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Deprec": income_statement_temp_source[5]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Amort": income_statement_temp_source[6]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Othdirexp": income_statement_temp_source[7]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Cgs": income_statement_temp_source[8]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Grossmar": income_statement_temp_source[9]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Salesad": income_statement_temp_source[10]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Salar": income_statement_temp_source[11]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Finchar": income_statement_temp_source[12]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Othexp": income_statement_temp_source[13]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Totindcost": income_statement_temp_source[14]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Pbtzak": income_statement_temp_source[15]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Taxzak": income_statement_temp_source[16]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Profit": income_statement_temp_source[17]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Statres": income_statement_temp_source[18]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Divid": income_statement_temp_source[19]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Retear": income_statement_temp_source[20]["year_" + selected_year].replace("SAR ", "").replace(/,/g, ""),
                        "Yearcom": income_statement_temp_source[22]["year_" + selected_year],
                        "GuiId": this.incomeGuId[incomeGuiIdNo],
                        "Type": "H"

                      });

                      var income_statement_delete_data = {

                        "_comment": "Pass a valid BP or year to delete and ID is mandatory!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Incstat": income_statement_delete_temp_source,


                      };

                      this.loanApplicationService.postIncomeStatement(income_statement_delete_data)
                        .then((res) => (this.onResult(res, 4, documentArray, this.incomeGuId[incomeGuiIdNo])), err => console.log(err));

                    }




                    for (var i = 0; i < income_statement_temp_source.length; i++)
                      delete income_statement_temp_source[i]["year_" + selected_year];

                    this.income_statement_source.load(income_statement_temp_source);

                    this.income_statement_source.refresh();

                    //this.spinnerService.hide();

                    // this.commonService.showSuccessToast("Delete successful !");

                    var index = this.income_statement_years.indexOf(selected_year);

                    if (index > -1) {

                      this.income_statement_years.splice(index, 1);

                    }

                    var mySettings = this.commonService.defaultLanguage == "en" ? this.income_statement_settings : this.income_statement_settings_ar;

                    delete mySettings.columns["year_" + selected_year];

                    if (this.commonService.defaultLanguage == "en")
                      this.income_statement_settings = Object.assign({}, mySettings);
                    else
                      this.income_statement_settings_ar = Object.assign({}, mySettings);

                    if (this.income_statement_years.length === 0) {
                      this.income_statement_visible = false;
                      this.income_statement_edit_button_visible = false;
                      this.income_statement_delete_button_visible = false;
                      this.income_statement_view_button_visible = false;
                    }


                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

        });
      }
      else if (table_name === 'project_financial_flows') {

        var project_financial_flows_temp_source = [];

        var flag = 0;

        this.project_financial_flows_source.getAll().then((res) => {

          project_financial_flows_temp_source = res;

          financialInformationModalParams = {

            header: "Delete Project Financial Flow Details",

            method: "delete",

            page: "Financialflow",

            data_source: project_financial_flows_temp_source,

            data_settings: this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar,

            inputs: [
              {
                id: "year",
                name: "Year",
                type: "select",
                value: this.financial_flow_years,
                //value: "Select Year|1990|1991|1992|1993|1994|1995|1996|1997|1998|1999|2000|2001|2002|2003|2004|2005|2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018".split("|"),
                selected: this.yearArray[0],
                required: "true",
              }
            ],
            buttons: [
              {
                name: "Delete",
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {

                  this.spinnerService.show();

                  var selected_year = modal_data.inputs[0].selected;

                  var project_financial_flows_temp_source = [];

                  this.project_financial_flows_source.getAll().then((res) => {

                    project_financial_flows_temp_source = res;

                    this.isdelete = "true";


                    for (var i = 0; i < this.financial_flow_years.length; i++) {
                      if (this.financial_flow_years[i] === selected_year) {
                        flag = i;
                      }
                    }

                    if (flag < this.flowsourceId.length) {

                      for (var i = 0; i < this.financial_flow_years.length; i++) {
                        if (this.financial_flow_years[i] === selected_year) {
                          var flowfinanceIdNo = i;
                          var temGuiIdNo = i;
                        }
                      }

                      var documentArray = [];

                      for (var i = 0; i < this.documentStructure["documentList"].length; i++) {

                        if (parseInt(this.documentStructure["documentList"][i].RelatedEntityId) === parseInt(this.flowsourceGuId[temGuiIdNo])) {

                          documentArray.push(this.documentStructure["documentList"][i]);

                        }
                      }

                      project_financial_flows_final_temp_source.push({

                        "Operation": "D",
                        "Flowid": this.flowsourceId[flowfinanceIdNo],
                        "Year": selected_year,
                        "Paidcap": project_financial_flows_temp_source[0]["year_" + selected_year].replace("SAR ", ""),
                        "Selffin": project_financial_flows_temp_source[1]["year_" + selected_year].replace("SAR ", ""),
                        "Bankfin": project_financial_flows_temp_source[2]["year_" + selected_year].replace("SAR ", ""),
                        "Govlend": project_financial_flows_temp_source[3]["year_" + selected_year].replace("SAR ", ""),
                        "Depamort": project_financial_flows_temp_source[4]["year_" + selected_year].replace("SAR ", ""),
                        "Totinflow": project_financial_flows_temp_source[5]["year_" + selected_year].replace("SAR ", ""),
                        "Capexp": project_financial_flows_temp_source[6]["year_" + selected_year].replace("SAR ", ""),
                        "Bankinst": project_financial_flows_temp_source[7]["year_" + selected_year].replace("SAR ", ""),
                        "Govaginst": project_financial_flows_temp_source[8]["year_" + selected_year].replace("SAR ", ""),
                        "Dividends": project_financial_flows_temp_source[9]["year_" + selected_year].replace("SAR ", ""),
                        "Totoutflow": project_financial_flows_temp_source[10]["year_" + selected_year].replace("SAR ", ""),
                        "Yearendrem": project_financial_flows_temp_source[11]["year_" + selected_year].replace("SAR ", ""),
                        "Pooledfunds": project_financial_flows_temp_source[12]["year_" + selected_year].replace("SAR ", ""),
                        "Statetype": "H",
                        "GuiId": this.flowsourceGuId[temGuiIdNo],
                        "Yearcom": project_financial_flows_temp_source[14]["year_" + selected_year]

                      });

                      var project_financial_flows_delete_data = {

                        "_comment": "Pass a valid BP or year to delete and ID is mandatory!",
                        "Profileid": this.customerProfileService.currentCustomerProfile.customerProfileId,
                        "Bpid": this.customerProfileService.loanArray.BpId,
                        "Origin": "CP",
                        "Sentreqid": this.requestId,
                        "Customerid": "",
                        "Flowstat": project_financial_flows_final_temp_source,


                      };

                      this.loanApplicationService.postFlowStatement(project_financial_flows_delete_data)
                        .then((res) => (this.onResult(res, 5, documentArray, this.flowsourceGuId[temGuiIdNo])), err => console.log(err));

                    }

                    for (var i = 0; i < project_financial_flows_temp_source.length; i++)
                      delete project_financial_flows_temp_source[i]["year_" + selected_year];

                    this.project_financial_flows_source.load(project_financial_flows_temp_source);

                    this.project_financial_flows_source.refresh();

                    this.spinnerService.hide();

                    //this.commonService.showSuccessToast("Delete successful !");

                    var index = this.financial_flow_years.indexOf(selected_year);

                    if (index > -1) {

                      this.financial_flow_years.splice(index, 1);

                    }

                    var mySettings = this.commonService.defaultLanguage == "en" ? this.project_financial_flows_settings : this.project_financial_flows_settings_ar;

                    delete mySettings.columns["year_" + selected_year];

                    if (this.commonService.defaultLanguage == "en")
                      this.project_financial_flows_settings = Object.assign({}, mySettings);
                    else
                      this.project_financial_flows_settings_ar = Object.assign({}, mySettings);

                    if (this.financial_flow_years.length === 0) {
                      this.financial_flow_visible = false;
                      this.financial_flow_edit_button_visible = false;
                      this.financial_flow_delete_button_visible = false;
                    }


                  });

                }
              }
            ]
          };

          let FinancialInformationModal = this.modalService.open(FinancialInformationModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
          FinancialInformationModal.componentInstance.FinancialInformationModalsForm = financialInformationModalParams;

        });
      }

    });

  }

  onCancel(delete_cancel_modal) {

    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
    this.deleteCancelModalReference.action = "Cancel";
    this.deleteCancelModalReference.table_name_display = "Loan Application";

  }

  onCloseDeleteCancelModal() {

    if (this.deleteCancelModalReference.action == 'Delete') {

      this.deleteCancelModalReference.close();

      this.commonService.showFailureToast("Deletion cancelled !");

    }

    else if (this.deleteCancelModalReference.action == 'Cancel') {

      this.deleteCancelModalReference.close();

    }

  }

  numberWithCommas(x) {
    if (x != undefined)
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onBack() {

    this.router.navigate(['/pages/new-request/loan-application']);

  }

  startTour() {

    this.allPanelsExpanded = true;

    if (this.commonService.defaultLanguage == 'en') {

      this.tour_en.setOption('steps', [
        {
          element: '#tourStep1',
          intro: "Navigate to Project Information"
        },
        {
          element: '#tourStep2',
          intro: "Navigate to Marketing Information"
        },
        {
          element: '#tourStep3',
          intro: "Navigate to Technical Information"
        },
        {
          element: '#tourStep4',
          intro: "Navigate to Checklist"
        },
        {
          element: '#tourStep5',
          intro: "Enter the Sources of Finance Details"
        },
        {
          element: '#tourStep6',
          intro: "Enter the Balance Sheet Asset Details"
        },
        {
          element: '#tourStep7',
          intro: "Enter the Balance Sheet Liabilities & Equity Details"
        },
        {
          element: '#tourStep8',
          intro: "Enter the Income Statement Details"
        },
        {
          element: '#tourStep9',
          intro: "View Cash Flow Statement Details"
        },
        {
          element: '#tourStep10',
          intro: "Go Back"
        },
       
      ]);

      this.tour_en.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

    else if (this.commonService.defaultLanguage == 'ar') {

      this.tour_ar.setOption('steps', [
        {
          element: '#tourStep1',
          intro: "انتقل إلى معلومات المشروع"
        },
        {
          element: '#tourStep2',
          intro: "انتقل إلى معلومات التسويق"
        },
        {
          element: '#tourStep3',
          intro: "انتقل إلى المعلومات الفنية"
        },
        {
          element: '#tourStep4',
          intro: "انتقل إلى قائمة التحقق"
        },
        {
          element: '#tourStep5',
          intro: "أدخل مصدر التمويل"
        },
        {
          element: '#tourStep6',
          intro: "أدخل تفاصيل أصول الميزانية العمومية"
        },
        {
          element: '#tourStep7',
          intro: "أدخل تفاصيل التزامات الميزانية العمومية وحقوق الملكية"
        },
        {
          element: '#tourStep8',
          intro: "أدخل تفاصيل بيان الدخل"
        },
        {
         element: '#tourStep9',
          intro: "عرض تفاصيل بيان التدفق النقدي"
        },
        {
          element: '#tourStep10',
          intro: "احفظ التفاصيل كرسالة"
        }
      ]);

      this.tour_ar.onchange(function (targetElement) {

        window.location.hash = "#" + targetElement.id;

      }).onexit(() => this.handleOnExitTour()).start();

    }

  }

  setEditableSectionsBasedOnCommunication() {

    if (this.source_of_finance_comments.hasComments) {
      this.source_of_finance_settings.actions["edit"] = true;
      this.source_of_finance_settings.actions["delete"] = true;
      
      this.source_of_finance_settings_ar.actions["edit"] = true;
      this.source_of_finance_settings_ar.actions["delete"] = true;
    } else {
      this.source_of_finance_settings.actions["edit"] = false;
      this.source_of_finance_settings.actions["delete"] = false;
      
      this.source_of_finance_settings_ar.actions["edit"] = false;
      this.source_of_finance_settings_ar.actions["delete"] = false;
    }
    this.source_of_finance_settings = Object.assign({}, this.source_of_finance_settings);

    this.source_of_finance_settings_ar = Object.assign({}, this.source_of_finance_settings_ar);
   
  }

  handleOnExitTour() {

    window.location.hash = "#" + "startTour";
    this.allPanelsExpanded = false;
    this.panelStep = 1;

  }

}

