import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { TechInfoModalsComponent } from './tech-info-modals/tech-info-modals.component';
import { MachQuotModalsComponent } from './machinery-quotation-modals/machinery-quotation-modals.component';
import { LocalDataSource } from 'ng2-smart-table';
import { LoanTechnicalService } from "../../../../services/loan-technical";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { groupBy, count, isEmpty } from 'rxjs/operators';
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { CommonService } from "../../../../services/common.service";
import { formDirectiveProvider } from '@angular/forms/src/directives/reactive_directives/form_group_directive';
import { CommunicationsService } from "../../../../services/communications.service";
import { LoanApplicationService } from "../../../../services/loan-application.service";
import { _ } from 'underscore';
import { Observable } from "rxjs"
import { copyObj } from '@angular/animations/browser/src/util';
import { CommonCommentsService } from '../../../../services/common-comments.service';
import { ErrorsHandler } from '../../../../services/errors-handler.service';
import { NavigationExtras } from '@angular/router'; 
import { LocalStorage } from '@ngx-pwa/local-storage';

import * as _l from 'lodash'; 
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
//import {Observable,of, from } from 'rxjs';
//import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

//import { TranslateService } from '@ngx-translate/core';
//fa fa-info
@Component({
  selector: 'technical-information',
  templateUrl: './technical-information.component.html',
  styleUrls: ['./technical-information.component.scss']
})


export class LoanApplicationTechnicalInformationComponent implements OnInit {

  add_edit_delete_show = true;
  landloanrequeststatus: any = 0;

   serviceId = 0;

  //Currency
  CurrencyList = [];
  CurrencyNameList = [];
  //For Logistics
  isLogistics = false;
  applicableSpec_logistics: any;
  applicableSpec_logistics_emptyIndicator = false;
  //
  machinery_settings_c: any;
  machinery_quotation_settings_c: any;
  bcw_settings_c: any;
  bcw_C_settings_c: any;
  vehicle_settings_c: any;
  furniture_settings_c: any;
  infotech_settings_c: any;
  preopercosts_settings_c: any;
  rawmaterial_settings_c: any;
  manpower_settings_c: any;
  utilitiesdetail_settings_c: any;
  safety_settings_c: any;
  knowhowag_settings_c: any;
  bcw_floor_settings_c: any;
  me_BidAnalysis_settings: any;
  me_BidAnalysis_source = new LocalDataSource;

  manufacturing_stages_settings_c: any;
  production_lines_settings_c: any;

  showTour = true;

  tour_en: any;

  tour_ar: any;

  loanTypeValues = {
    loanType: "",
    selectedLoanType: {},
    selectedLoanTypeOperation: "",
    loanTypeList: []
  };

  //From Claims
  temp_isFromClaim;
  isClaims;
  requestid_isClaims;
  loanid_isClaims;
  projectid_isClaims;
  myloansid_isClaims;
  myloanspath_isClaims = '';
  isClaimsForTechGet;

  //Category in infotech
  it_order_type = [];
  it_order_type_id = [];
  it_order_type_desc = [];
  //Category in safety
  safety_category = [];
  safety_category_id = [];
  safety_category_desc = [];
  //Name used in payload
  technical_list_payload_name = ["Machinery", "Bcw", "Vehicle", "Furniture", "InfoTech", "PreOperCosts", "RawMaterial", "ManPower", "UtilitiesDetail", "Safety", "KnowHowAg"];
  //Comments 
  commentsFrom = "";
  commentArray = {};
  commentArrayExists = 0;
  me_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEMAC", commentDetails: {}, commentArray: [] };
  bcw_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEBUI", commentDetails: {}, commentArray: [] };
  ve_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEVEH", commentDetails: {}, commentArray: [] };
  fu_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEFUR", commentDetails: {}, commentArray: [] };
  it_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEIFT", commentDetails: {}, commentArray: [] };
  pr_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEPRE", commentDetails: {}, commentArray: [] };
  ra_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TERAW", commentDetails: {}, commentArray: [] };
  ma_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEMAN", commentDetails: {}, commentArray: [] };
  ut_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEUTI", commentDetails: {}, commentArray: [] };
  sa_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TESAF", commentDetails: {}, commentArray: [] };
  kh_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEKNW", commentDetails: {}, commentArray: [] };
  mco_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEKNW", commentDetails: {}, commentArray: [] };
  mc_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEKNW", commentDetails: {}, commentArray: [] };
  le_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEKNW", commentDetails: {}, commentArray: [] };
  ml_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEKNW", commentDetails: {}, commentArray: [] };
  manufac_stages_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEMAS", commentDetails: {}, commentArray: [] };
  prod_line_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEINC", commentDetails: {}, commentArray: [] };
  appStdSpec_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TELOG", commentDetails: {}, commentArray: [] };
  te_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TETEC", commentDetails: {}, commentArray: [] };
  mm_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEMAM", commentDetails: {}, commentArray: [] };
  ip_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEINP", commentDetails: {}, commentArray: [] };

  //
  IT_dd = ["Units", "Sets", "Packets", "Service"]
  Bcw_created = 0;
  lang=this.commonService.defaultLanguage;
  Bcw_cost_component = [];
  CountryDD = [];
  CountryDD_id = [];
  CountryDD_desc = [];

  BcwStructures = [];
  BcwStructures_id = [];
  BcwStructures_desc = [];
  Bcw_Item_Global = {};
  Bcw_GuiId = null;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  //target1;
  translate: any;
  panelStep = 1;

  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  ChecklistPer = 0;

  financeCapitalCostSource: any = [];
  financeCapitalCostSource_ar: any = [];
  financeOperationalCostSource: any = [];
  financeOperationalCostSource_ar: any = [];
  technical_list = "Machinery,Bcw,Vehicle,Furniture,InfoTech,PreOperCosts,RawMaterial,ManPower,UtilitiesDetail,Safety,KnowHowAg".split(",");
  technical_list2 = [];
  technical_list_array = [];
  techoption = "";
  techOptionSelected = "Choose Component";

  panel_items = [];
  // panel_items2 = [];

  //panel_data = [];

  // techInfoModalParams2 = [];
  panelstepindex = 0;

  techInfoModalParams_g = {};

  allPanelsExpanded = false;

  financing_summary_source: LocalDataSource;
  machinery_quotation_source: LocalDataSource;
  manufacturing_stages_source: LocalDataSource;
  production_lines_source: LocalDataSource;

  financing_summary_source_length = 0;

  machinery_localdatasource_array = [];
  machinery_componentID_array = [];
  bcw_localdatasource_array = [];
  bcw_componentID_array = [];
  vehicle_localdatasource_array = [];
  vehicle_componentID_array = [];
  furniture_localdatasource_array = [];
  furniture_componentID_array = [];
  infotech_localdatasource_array = [];
  infotech_componentID_array = [];
  preopercosts_localdatasource_array = [];
  preopercosts_componentID_array = [];
  rawmaterial_localdatasource_array = [];
  rawmaterial_componentID_array = [];
  manpower_localdatasource_array = [];
  manpower_componentID_array = [];
  utilitiesdetail_localdatasource_array = [];
  utilitiesdetail_componentID_array = [];
  safety_localdatasource_array = [];
  safety_componentID_array = [];
  knowhowag_localdatasource_array = [];
  knowhowag_componentID_array = [];

  // machinery_localdatasource_delete_array = [];
  // bcw_localdatasource_delete_array = [];
  // vehicle_localdatasource_delete_array = [];
  // furniture_localdatasource_delete_array = [];
  // infotech_localdatasource_delete_array = [];
  // preopercosts_localdatasource_delete_array = [];
  // rawmaterial_localdatasource_delete_array = [];
  // manpower_localdatasource_delete_array = [];
  // utilitiesdetail_localdatasource_delete_array = [];
  // safety_localdatasource_delete_array = [];
  // knowhowag_localdatasource_delete_array = [];
  machinery_quotation_localdatasource_delete_array = [];

  costcomp_array = [];
  costcomp_array_index = [];

  machineries_desc_list = [];
  machineries_list = [];


  componentid = 0;

  loan_id = 0;
  CustomerId = 0;
  ProfileId = 0;
  uom_list = [];
  uom_text = [];
  uom_id = [];
  past_15_years = [];
  future_15_years = [];
  product_list = [];
  product_list_name = [];
  product_list_id = [];
  it_category = [];
  it_category_id = [];
  it_category_desc = [];
  labour_type = [];
  labour_type_id = [];
  labour_type_desc = [];
  machinery_status = [];
  machinery_status_id = [];
  machinery_status_desc = [];

  utility_type = [];
  utility_type_id = [];
  utility_type_desc = [];

  machinery_comp_type = [];
  machinery_comp_type_id = [];
  machinery_comp_type_desc = [];

  delete_status = 0;
  uom_text_kg_ton = [];

  requestId;

  statusCode = "";

  projId = 0;
  projCode = "";

  //quantityUOM_machinery = ["Unit","Complete Production Line"];
  quantityUOM_machinery = []; // for MachineryUom
  quantityUOM_machinery_id = [];
  quantityUOM_machinery_desc = [];
  //source_of_origin_machinery = ["Local", "Import"];
  source_of_origin_machinery = []; //for MachinerySource
  source_of_origin_machinery_id = [];
  source_of_origin_machinery_desc = [];
  //vehicle_type = ["Buses", "Pickup truck", "Sedan", "Forklift", "Others"];
  vehicle_type = [];//for VehicleType
  vehicle_type_id = [];
  vehicle_type_desc = [];
  //source_of_origin_rawmat = ["Local", "Import"];
  source_of_origin_rawmat = [];//for RawMatSource
  source_of_origin_rawmat_id = [];
  source_of_origin_rawmat_desc = [];

  yes_or_no = ["Yes", "No"];
  uom_furnitures = ["Unit", "SET"];

  Total_Cost_OC_CC = "0";
  //input_MA = [];
  // input_MA_Selected = "";

  // spinner_status_main = false;

  documentStructure = {};

  financeSettings = {
    hideSubHeader: true,
    mode: "external",
    noDataMessage: "No data found",
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      CompType: {
        title: "Component Type",
        type: "string",
        width: "50%",
        editable: false
      },
      TotalCost: {
        title: "Total Cost",
        type: "string",
        editable: false,
      }
    },
    pager: {
      display: true,
      perPage: 20,
    },
    // columnClassFunction: () => {

    // },
    rowClassFunction: (row) => {
      if (row.data.CompType === "Grand Total") {

        return 'highlight';
      }


    }
  };

  financeSettings_ar = {
    hideSubHeader: true,
    mode: "external",
    noDataMessage: " لم يتم العثور على بيانات",

    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      CompTypeAr: {
        title: "نوع العنصر",
        type: "string",
        width: "50%",
        editable: false
      },
      TotalCost: {
        title: "التكلفة الاجمالية",
        type: "string",
        editable: false,
      }
    },
    pager: {
      display: true,
      perPage: 20,
    },
    // columnClassFunction: () => {

    // },
    rowClassFunction: (row) => {
      if (row.data.CompType === "التكلفة الاجمالية") {

        return 'highlight';
      }


    }
  };
  //
  mouse_over_event() {
    //console.log("Mouse Over Event");
  }

  getMachineryDropdown(res) {
    this.machineries_list = [];
    this.machineries_desc_list = [];
    if (res) {
      if (res.Machinery != null) {
        for (var i = 0; i < res.Machinery.length; i++) {
          this.machineries_list.push({ "Id": res.Machinery[i].MachineId, "Desc": res.Machinery[i].MachineName });
          this.machineries_desc_list.push(res.Machinery[i].MachineName);
        }
      }
    }
  }

  resolveCommmonCommentsMarkInfo(resolvedCommentArray, technical_type) {

    if (resolvedCommentArray["RecReqSection"])
      for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

        if (resolvedCommentArray["RecReqSection"][i].ReqSec == "LONMI" && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == technical_type.SubSectionCode) {

            technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: technical_type.SectionCode, ReqSubSec: technical_type.SubSectionCode });

            technical_type.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            technical_type.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            technical_type.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            technical_type.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];

            technical_type.commentDetails["DeadLineDate"] = technical_type.commentArray[0]["DeadLineDate"];
            technical_type.commentDetails["GuiId"] = technical_type.commentArray[0]["GuiId"];
            technical_type.commentDetails["DefId"] = technical_type.commentArray[0]["DefId"];
            technical_type.commentDetails["ReqSec"] = technical_type.commentArray[0]["ReqSec"];
            technical_type.commentDetails["ReqSecDesc"] = technical_type.commentArray[0]["ReqSecDesc"];
            technical_type.commentDetails["ReqStatus"] = technical_type.commentArray[0]["ReqStatus"];
            technical_type.commentDetails["ReqStatusDesc"] = technical_type.commentArray[0]["ReqStatusDesc"];
            technical_type.commentDetails["ReqSubSec"] = technical_type.commentArray[0]["ReqSubSec"];
            technical_type.commentDetails["ReqSubSecDesc"] = technical_type.commentArray[0]["ReqSubSecDesc"];
            technical_type.commentDetails["SectionId"] = technical_type.commentArray[0]["SectionId"];

            var openComments = technical_type.commentArray.find((o) => o.ReqStatus == "O");

            if (openComments)
              technical_type.anyOpenComments = true;
            else
              technical_type.anyOpenComments = false;

            technical_type.commentArray = technical_type.commentArray[0]["RecReqComment"];

            technical_type.hasComments = true;
          }
        }
      }
  }

  resolveCommonCommentsTechTypes(resolvedCommentArray, technical_type) {

    if (resolvedCommentArray["RecReqSection"])
      for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

        if (resolvedCommentArray["RecReqSection"][i].ReqSec == "LONTE" && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == technical_type.SubSectionCode) {

            technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: technical_type.SectionCode, ReqSubSec: technical_type.SubSectionCode });

            technical_type.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            technical_type.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            technical_type.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            technical_type.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];

            technical_type.commentDetails["DeadLineDate"] = technical_type.commentArray[0]["DeadLineDate"];
            technical_type.commentDetails["GuiId"] = technical_type.commentArray[0]["GuiId"];
            technical_type.commentDetails["DefId"] = technical_type.commentArray[0]["DefId"];
            technical_type.commentDetails["ReqSec"] = technical_type.commentArray[0]["ReqSec"];
            technical_type.commentDetails["ReqSecDesc"] = technical_type.commentArray[0]["ReqSecDesc"];
            technical_type.commentDetails["ReqStatus"] = technical_type.commentArray[0]["ReqStatus"];
            technical_type.commentDetails["ReqStatusDesc"] = technical_type.commentArray[0]["ReqStatusDesc"];
            technical_type.commentDetails["ReqSubSec"] = technical_type.commentArray[0]["ReqSubSec"];
            technical_type.commentDetails["ReqSubSecDesc"] = technical_type.commentArray[0]["ReqSubSecDesc"];
            technical_type.commentDetails["SectionId"] = technical_type.commentArray[0]["SectionId"];

            var openComments = technical_type.commentArray.find((o) => o.ReqStatus == "O");

            if (openComments)
              technical_type.anyOpenComments = true;
            else
              technical_type.anyOpenComments = false;

            technical_type.commentArray = technical_type.commentArray[0]["RecReqComment"];

            technical_type.hasComments = true;
          }
        }
      }
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
      
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.me_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.bcw_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.ve_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.fu_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.it_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.pr_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.ra_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.ma_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.ut_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.sa_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.kh_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.mco_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.mc_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.le_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.ml_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.manufac_stages_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.prod_line_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.appStdSpec_comments);

      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.te_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.mm_comments);
      this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.ip_comments);
      // this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.me_comments);
      // this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.me_comments);
      // this.resolveCommonCommentsTechTypes(resolvedCommentArray, this.me_comments);
                 

      // this.commonService.showSuccessToast("Project Information retrieved successfully !");
      // this.Ng4LoadingSpinnerService.hide();

      this.setEditableSectionsBasedOnCommunication();
    }

    catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  ngOnInit() {
    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
   
    this.localStorage.getItem("serviceId").subscribe(data=> { 
  if (data)
  this.serviceId =data; })
    this.refreshBidAnalysis();
    //currencyType
    this.CurrencyList = this.commonService.currencyType;
    this.CurrencyNameList = _.map(this.CurrencyList,  (num)=> { return this.lang=='en'?num.Name:num.Name });

    var isLogisticsId = "";
    if (this.customerProfileService["loanArray"]["LoanTypeValues"])
      isLogisticsId = this.customerProfileService["loanArray"]["LoanTypeValues"]["selectedLoanType"]["id"];
    if (isLogisticsId === "0000000039" || isLogisticsId === "0000000040" || isLogisticsId === "0000000041" || isLogisticsId === "0000000042") {
      this.isLogistics = true;
      this.settingsChangeLogistics();
    }
    this.enarTableSettings();
    this.isFromClaim();
    console.log("Tech info");
    //this.onSafetyComponentCreateSuccess(10);
    //Infotech Category
    this.it_order_type =
      [{ "Id": "ES", "Desc": "Estimate" },
      { "Id": "IN", "Desc": "Invoice" },
      { "Id": "QU", "Desc": "Quotation" },
      { "Id": "CO", "Desc": "Contract" },
      { "Id": "AG", "Desc": "Agreement" }];
    for (var i = 0; i < this.it_order_type.length; i++) {
      this.it_order_type_id.push(this.it_order_type[i].Id);
      this.it_order_type_desc.push(this.it_order_type[i].Desc);
    }
    //Safety Category
    this.safety_category = [{ "Id": "FFS", "Desc": "Firefighting Systems" },
    { "Id": "FEX", "Desc": "Fire Extinguishers" }, { "Id": "FAD", "Desc": "Fire Alarm and Detection System" }, { "Id": "PPE", "Desc": "Personnel Protection Equipment" }, { "Id": "OTH", "Desc": "Others" }];
    for (var i = 0; i < this.safety_category.length; i++) {
      this.safety_category_id.push(this.safety_category[i].Id);
      this.safety_category_desc.push(this.safety_category[i].Desc);
    }
    //
    //  this.onTemp();
    //Comments Section - 
    this.commentsFrom = this.customerProfileService.commentsFrom;
    this.commentArrayExists = this.customerProfileService.commentArrayExists;
    this.commentArray = this.customerProfileService.commentArray;

    if (this.customerProfileService.loanArray.LoanTypeValues != undefined)
      this.loanTypeValues = this.customerProfileService.loanArray.LoanTypeValues;

    if (this.commentArrayExists)
      this.resolveCommonComments();


    //
    this.CountryDD = this.customerProfileService.loanDropdowns.Country;
    if (this.CountryDD != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.Country.length; i++) {
        this.CountryDD_id.push(this.customerProfileService.loanDropdowns.Country[i].Code);
        this.CountryDD_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.Country[i].Name:this.customerProfileService.loanDropdowns.Country[i].DescAr);
      }
    }

    this.BcwStructures = this.customerProfileService.loanDropdowns.BcwStructures;
    if (this.BcwStructures != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.BcwStructures.length; i++) {
        this.BcwStructures_id.push(this.customerProfileService.loanDropdowns.BcwStructures[i].Id);
        this.BcwStructures_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.BcwStructures[i].Desc:this.customerProfileService.loanDropdowns.BcwStructures[i].DescAr);
      }
    }
    this.dropdownList = [
      { "id": 1, "itemName": "India" },
      { "id": 2, "itemName": "Singapore" },
      { "id": 3, "itemName": "Australia" },
      { "id": 4, "itemName": "Canada" },
      { "id": 5, "itemName": "South Korea" },
      { "id": 6, "itemName": "Germany" },
      { "id": 7, "itemName": "France" },
      { "id": 8, "itemName": "Russia" },
      { "id": 9, "itemName": "Italy" },
      { "id": 10, "itemName": "Sweden" }
    ];
    this.selectedItems = [
      { "id": 2, "itemName": "Singapore" },
      { "id": 3, "itemName": "Australia" },
      { "id": 4, "itemName": "Canada" },
      { "id": 5, "itemName": "South Korea" }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
    //console.log("PSW" + this.translate.instant('PRELIMINARY_REQUEST.createPreliminaryRequest'));
    this.Ng4LoadingSpinnerService.show();
    this.manufacturing_stages_source = new LocalDataSource;
    this.production_lines_source = new LocalDataSource;
    //var rand_num = this.commonService.returnRandomstatuNumber;

    // this.loanApplicationService
    //   .getLoanMachineryDropdown(this.customerProfileService.loanArray.FinPlanId)
    //   .then((res) => (this.getMachineryDropdown(res)), err => (this.commonService.showFailureToast(err)));

    this.projId = this.customerProfileService.loanArray.ProjId;
    this.projCode = this.customerProfileService.loanArray.ProjCode;

    this.GenInfoPer = this.customerProfileService.loanPercentageValues.GenInfoPer;
    this.MarkInfoPer = this.customerProfileService.loanPercentageValues.MarkInfoPer;
    this.TechInfoPer = this.customerProfileService.loanPercentageValues.TechInfoPer;
    this.FinInfoPer = this.customerProfileService.loanPercentageValues.FinInfoPer;

    this.quantityUOM_machinery = this.customerProfileService.loanDropdowns.MachineryUom;
    if (this.quantityUOM_machinery != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.MachineryUom.length; i++) {
        this.quantityUOM_machinery_id.push(this.customerProfileService.loanDropdowns.MachineryUom[i].Id);
        this.quantityUOM_machinery_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.MachineryUom[i].Desc:this.customerProfileService.loanDropdowns.MachineryUom[i].DescAr);
      }
    }

    this.source_of_origin_machinery = this.customerProfileService.loanDropdowns.MachinerySource;
    if (this.source_of_origin_machinery != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.MachinerySource.length; i++) {
        this.source_of_origin_machinery_id.push(this.customerProfileService.loanDropdowns.MachinerySource[i].Id);
        this.source_of_origin_machinery_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.MachinerySource[i].Desc:this.customerProfileService.loanDropdowns.MachinerySource[i].DescAr);
      }
    }

    this.vehicle_type = this.customerProfileService.loanDropdowns.VehicleType;
    if (this.vehicle_type != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.VehicleType.length; i++) {
        this.vehicle_type_id.push(this.customerProfileService.loanDropdowns.VehicleType[i].Id);
        this.vehicle_type_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.VehicleType[i].Desc:this.customerProfileService.loanDropdowns.VehicleType[i].DescAr);
      }
    }

    this.source_of_origin_rawmat = this.customerProfileService.loanDropdowns.RawMatSource;
    if (this.source_of_origin_rawmat != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.RawMatSource.length; i++) {
        this.source_of_origin_rawmat_id.push(this.customerProfileService.loanDropdowns.RawMatSource[i].Id);
        this.source_of_origin_rawmat_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.RawMatSource[i].Desc:this.customerProfileService.loanDropdowns.RawMatSource[i].DescAr);
      }
    }


    this.machinery_comp_type = this.customerProfileService.loanDropdowns.MachineryComp;
    if (this.machinery_comp_type != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.MachineryComp.length; i++) {
        this.machinery_comp_type_id.push(this.customerProfileService.loanDropdowns.MachineryComp[i].Id);
        this.machinery_comp_type_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.MachineryComp[i].Desc:this.customerProfileService.loanDropdowns.MachineryComp[i].DescAr);
      }
    }

    this.utility_type = this.customerProfileService.loanDropdowns.UtilityType;
    if (this.utility_type != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.UtilityType.length; i++) {
        this.utility_type_id.push(this.customerProfileService.loanDropdowns.UtilityType[i].Id);
        this.utility_type_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.UtilityType[i].Desc:this.customerProfileService.loanDropdowns.UtilityType[i].DescAr);
      }
    }

    this.machinery_status = this.customerProfileService.loanDropdowns.MachineryStatus;
    if (this.machinery_status != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.MachineryStatus.length; i++) {
        this.machinery_status_id.push(this.customerProfileService.loanDropdowns.MachineryStatus[i].Id);
        this.machinery_status_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.MachineryStatus[i].Desc:this.customerProfileService.loanDropdowns.MachineryStatus[i].DescAr);
      }
    }
    this.it_category = this.customerProfileService.loanDropdowns.ITCategory;
    if (this.it_category != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.ITCategory.length; i++) {
        this.it_category_id.push(this.customerProfileService.loanDropdowns.ITCategory[i].Id);
        this.it_category_desc.push(this.lang=='en'?this.customerProfileService.loanDropdowns.ITCategory[i].Desc:this.customerProfileService.loanDropdowns.ITCategory[i].DescAr);
      }
    }

    this.labour_type = this.customerProfileService.loanDropdowns.LabourType;
    if (this.utility_type != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.LabourType.length; i++) {
        this.labour_type_id.push(this.customerProfileService.loanDropdowns.LabourType[i].Id);
        this.labour_type_desc.push(this.lang=='ar'?this.customerProfileService.loanDropdowns.LabourType[i].DescAr:this.customerProfileService.loanDropdowns.LabourType[i].Desc);
      }
    }
    this.product_list = this.customerProfileService.loanArray.GenInfoProducts;
    if (this.product_list != undefined) {
      for (var i = 0; i < this.customerProfileService.loanArray.GenInfoProducts.length; i++) {
        this.product_list_name.push(this.customerProfileService.loanArray.GenInfoProducts[i].ProductName);
        this.product_list_id.push(this.customerProfileService.loanArray.GenInfoProducts[i].ProductId);
      }
    }
    var year = new Date().getFullYear();
    //console.log(year);
    this.past_15_years.push(year);
    this.future_15_years.push(year);
    var temp1 = year;
    var temp2 = year;
    for (var i = 0; i < 15; i++) {
      temp1 = +temp1 - 1;
      temp2 = +temp2 + 1;
      this.past_15_years.push(temp1);
      this.future_15_years.push(temp2);
    }

    this.uom_list = this.customerProfileService.loanDropdowns.UnitOfMeasure;
    if (this.uom_list != undefined) {
      for (var i = 0; i < this.customerProfileService.loanDropdowns.UnitOfMeasure.length; i++) {
        this.uom_text.push(this.lang=='en'?this.customerProfileService.loanDropdowns.UnitOfMeasure[i].Name:this.customerProfileService.loanDropdowns.UnitOfMeasure[i].NameAr);
        this.uom_id.push(this.customerProfileService.loanDropdowns.UnitOfMeasure[i].Code);
      }


      var unit1 = this.uom_list.find((o) => o.Name == "Kilogram");
      var unit2 = this.uom_list.find((o) => o.Name == "Ton");
      if (unit1)
        this.uom_text_kg_ton.push(unit1.Name);
      if (unit2)
        this.uom_text_kg_ton.push(unit2.Name);

      this.requestId = this.customerProfileService.loanRequestId;
      this.statusCode = this.customerProfileService.statusCode;

    }

    if (this.landloanrequeststatus == 41 || this.landloanrequeststatus == 40)
      this.add_edit_delete_show = true;
    else
      this.add_edit_delete_show = false;

    // if (this.statusCode == 'P' || this.statusCode == 'A')
    //   this.add_edit_delete_show = false;

    // else
    //   this.add_edit_delete_show = true;

    if ((this.statusCode != 'P' && this.statusCode != 'A') || this.isClaims === 'true') {
      // if(true){
      this.showTour = true;
      //Aligning Icons across Different Browsers
      if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
        this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus icon-arrangement-top-ie" title="Add Competitive Quotation"></i>' }];
        this.machinery_settings_ar.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus icon-arrangement-top-ie" title="إضافة تسعيرة تنافسية"></i>' }];
      }
      else if (/edge\//i.test(window.navigator.userAgent)) {
        this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus icon-arrangement-top-edge-en" title="Add Competitive Quotation"></i>' }];
        this.machinery_settings_ar.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus icon-arrangement-top-edge-ar" title="إضافة تسعيرة تنافسية"></i>' }];
      }
      else {
        this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus icon-arrangement-top" title="Add Competitive Quotation"></i>' }];
        this.machinery_settings_ar.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus icon-arrangement-top" title="إضافة تسعيرة تنافسية"></i>' }];
      }
      //  /Aligning Icons across Different Browsers

      this.machinery_settings_ar.columns.MachineDesc.title = this.translate.instant('TECHNICAL_INFORMATION.MachineDescAr');
      this.machinery_settings_ar.columns.MachineSpecs.title = this.translate.instant('TECHNICAL_INFORMATION.MachineSpecsAr');
      this.machinery_settings_ar.columns.QuotDate.title = this.translate.instant('TECHNICAL_INFORMATION.QuotDateAr');
      this.machinery_settings_ar.columns.QuotInvNo.title = this.translate.instant('TECHNICAL_INFORMATION.QuotInvNoAr');
      this.machinery_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      //this.bcw_settings_ar.columns.CivilItem.title = this.translate.instant('TECHNICAL_INFORMATION.CivilItemAr');
      //this.bcw_settings_ar.columns.ItemDesc.title = this.translate.instant('TECHNICAL_INFORMATION.ItemDescAr');
      //this.bcw_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
      //this.bcw_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.vehicle_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
      // this.vehicle_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.UnitCostAr');
      // this.vehicle_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');
      // this.vehicle_settings_ar.columns.VehicleName.title = this.translate.instant('TECHNICAL_INFORMATION.VehicleNameAr');

      // this.furniture_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
      // this.furniture_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
      // this.furniture_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
      // this.furniture_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
      // this.furniture_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.infotech_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
      // this.infotech_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
      // this.infotech_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
      // this.infotech_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
      // this.infotech_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.preopercosts_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
      // this.preopercosts_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.rawmaterial_settings_ar.columns.RawMatCostUom.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUomAr');
      // this.rawmaterial_settings_ar.columns.RawMatName.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatNameAr');
      // this.rawmaterial_settings_ar.columns.RawMatQuanPerUomProd.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProdAr');
      // this.rawmaterial_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.manpower_settings_ar.columns.AddBenefPerc.title = this.translate.instant('TECHNICAL_INFORMATION.AddBenefPercAr');
      // this.manpower_settings_ar.columns.BasicMonthSal.title = this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSalAr');
      // this.manpower_settings_ar.columns.NoPositions.title = this.translate.instant('TECHNICAL_INFORMATION.NoPositionsAr');
      // this.manpower_settings_ar.columns.TotalCostMonthSal.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSalAr');
      // this.manpower_settings_ar.columns.TotalSalary.title = this.translate.instant('TECHNICAL_INFORMATION.TotalSalaryAr');

      // this.utilitiesdetail_settings_ar.columns.AnnualCost.title = this.translate.instant('TECHNICAL_INFORMATION.AnnualCostAr');
      // this.utilitiesdetail_settings_ar.columns.TotalUse.title = this.translate.instant('TECHNICAL_INFORMATION.TotalUseAr');
      // this.utilitiesdetail_settings_ar.columns.UnitPrice.title = this.translate.instant('TECHNICAL_INFORMATION.UnitPriceAr');

      // this.safety_settings_ar.columns.Category.title = this.translate.instant('TECHNICAL_INFORMATION.CategoryAr');
      // this.safety_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
      // this.safety_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
      // this.safety_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
      // this.safety_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.knowhowag_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
      // this.knowhowag_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
      // this.knowhowag_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

      // this.machinery_quotation_settings_ar.columns.Capacity.title = this.translate.instant('TECHNICAL_INFORMATION.CapacityAr');
      // this.machinery_quotation_settings_ar.columns.CapacityUOM.title = this.translate.instant('TECHNICAL_INFORMATION.CapacityUOMAr');
      // this.machinery_quotation_settings_ar.columns.MachineName.title = this.translate.instant('TECHNICAL_INFORMATION.MachineNameAr');
      // this.machinery_quotation_settings_ar.columns.Manufacturer.title = this.translate.instant('TECHNICAL_INFORMATION.ManufacturerAr');
      // this.machinery_quotation_settings_ar.columns.OriginCountry.title = this.translate.instant('TECHNICAL_INFORMATION.OriginCountryAr');
    }
    else {

      this.showTour = false;

      // this.manufacturing_stages_settings.actions["edit"] = false;
      // this.manufacturing_stages_settings.actions["delete"] = false;

      this.manufacturing_stages_settings_c.actions["edit"] = false;
      this.manufacturing_stages_settings_c.actions["delete"] = false;

      // this.manufacturing_stages_settings_ar.actions["edit"] = false;
      // this.manufacturing_stages_settings_ar.actions["delete"] = false;

      // this.production_lines_settings.actions["edit"] = false;
      // this.production_lines_settings.actions["delete"] = false;

      this.production_lines_settings_c.actions["edit"] = false;
      this.production_lines_settings_c.actions["delete"] = false;

      // this.production_lines_settings_ar.actions["edit"] = false;
      // this.production_lines_settings_ar.actions["delete"] = false;

      this.machinery_settings.actions["edit"] = false;
      this.machinery_settings.actions["delete"] = false;
      //// this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus"></i>' }];

      //this.bcw_settings.actions["edit"] = false;
      //this.bcw_settings.actions["delete"] = false;
      this.bcw_settings_c.actions["edit"] = false;
      this.bcw_settings_c.actions["delete"] = false;

      //this.bcw_C_settings.actions["edit"] = false;
      //this.bcw_C_settings.actions["delete"] = false;
      this.bcw_C_settings_c.actions["edit"] = false;
      this.bcw_C_settings_c.actions["delete"] = false;

      // this.vehicle_settings.actions["edit"] = false;
      // this.vehicle_settings.actions["delete"] = false;
      this.vehicle_settings_c.actions["edit"] = false;
      this.vehicle_settings_c.actions["delete"] = false;

      // this.furniture_settings.actions["edit"] = false;
      // this.furniture_settings.actions["delete"] = false;
      this.furniture_settings_c.actions["edit"] = false;
      this.furniture_settings_c.actions["delete"] = false;

      // this.infotech_settings.actions["edit"] = false;
      // this.infotech_settings.actions["delete"] = false;
      this.infotech_settings_c.actions["edit"] = false;
      this.infotech_settings_c.actions["delete"] = false;

      // this.preopercosts_settings.actions["edit"] = false;
      // this.preopercosts_settings.actions["delete"] = false;
      this.preopercosts_settings_c.actions["edit"] = false;
      this.preopercosts_settings_c.actions["delete"] = false;


      // this.rawmaterial_settings.actions["edit"] = false;
      // this.rawmaterial_settings.actions["delete"] = false;
      this.rawmaterial_settings_c.actions["edit"] = false;
      this.rawmaterial_settings_c.actions["delete"] = false;

      // this.manpower_settings.actions["edit"] = false;
      // this.manpower_settings.actions["delete"] = false;
      this.manpower_settings_c.actions["edit"] = false;
      this.manpower_settings_c.actions["delete"] = false;

      // this.utilitiesdetail_settings.actions["edit"] = false;
      // this.utilitiesdetail_settings.actions["delete"] = false;
      this.utilitiesdetail_settings_c.actions["edit"] = false;
      this.utilitiesdetail_settings_c.actions["delete"] = false;

      // this.safety_settings.actions["edit"] = false;
      // this.safety_settings.actions["delete"] = false;
      this.safety_settings_c.actions["edit"] = false;
      this.safety_settings_c.actions["delete"] = false;

      // this.knowhowag_settings.actions["edit"] = false;
      // this.knowhowag_settings.actions["delete"] = false;
      this.knowhowag_settings_c.actions["edit"] = false;
      this.knowhowag_settings_c.actions["delete"] = false;

      this.machinery_settings_ar.actions["edit"] = false;
      this.machinery_settings_ar.actions["delete"] = false;
      // this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="nb-plus"></i>' }];

      //this.bcw_settings_ar.actions["edit"] = false;
      //this.bcw_settings_ar.actions["delete"] = false;

      //this.bcw_C_settings_ar.actions["edit"] = false;
      //this.bcw_C_settings_ar.actions["delete"] = false;

      // this.vehicle_settings_ar.actions["edit"] = false;
      // this.vehicle_settings_ar.actions["delete"] = false;

      // this.furniture_settings_ar.actions["edit"] = false;
      // this.furniture_settings_ar.actions["delete"] = false;

      // this.infotech_settings_ar.actions["edit"] = false;
      // this.infotech_settings_ar.actions["delete"] = false;

      // this.preopercosts_settings_ar.actions["edit"] = false;
      // this.preopercosts_settings_ar.actions["delete"] = false;

      // this.rawmaterial_settings_ar.actions["edit"] = false;
      // this.rawmaterial_settings_ar.actions["delete"] = false;

      // this.manpower_settings_ar.actions["edit"] = false;
      // this.manpower_settings_ar.actions["delete"] = false;

      // this.utilitiesdetail_settings_ar.actions["edit"] = false;
      // this.utilitiesdetail_settings_ar.actions["delete"] = false;

      // this.safety_settings_ar.actions["edit"] = false;
      // this.safety_settings_ar.actions["delete"] = false;

      // this.knowhowag_settings_ar.actions["edit"] = false;
      // this.knowhowag_settings_ar.actions["delete"] = false;
    }

    this.financing_summary_source = new LocalDataSource();
    this.machinery_quotation_source = new LocalDataSource();

    var financing_summary_source_data_array = [];

    var financing_summary_list = "Machinery,Bcw,Vehicle,Furniture,InfoTech,PreOperCosts,RawMaterial,ManPower,UtilitiesDetail,Safety,KnowHowAg".split(",");

    for (var i = 0; i < financing_summary_list.length; i++) {
      var financing_summary_list_item = financing_summary_list[i];

      financing_summary_source_data_array.push({
        types: financing_summary_list_item,
        totalCost: "0",
      }
      );

    }

    this.financing_summary_source.load(financing_summary_source_data_array);

    this.financing_summary_source_length++;

    this.financing_summary_source.refresh();

    //  this.LoanTechnicalService
    // .getTechInfoComponentCategories()
    // .then((res) => (
    this.calcCategories(this.customerProfileService.loanDropdowns.ComponentCategory);//
    var isFromBcwSpecial = false;
    this.callResolvePrelim(isFromBcwSpecial);
    //   ), err => (this.Ng4LoadingSpinnerService.hide()));




    //this.input_MA = this.labour_type_desc;

  }

  refreshBidAnalysis() {
    //setSource of Bid analysis ME
    var bidAnalysisInitialSource = [
      {
        "Item": this.translate.instant('TECHNICAL_INFORMATION.Manufacturer'),
        "SelectedOffer": "",
        "CompOffer1": "",
        "CompOffer2": ""
      },
      {
        "Item": this.translate.instant('TECHNICAL_INFORMATION.CountryofOrigin'),
        "SelectedOffer": "",
        "CompOffer1": "",
        "CompOffer2": ""
      },
      {
        "Item": this.translate.instant('TECHNICAL_INFORMATION.YearofOffer'),
        "SelectedOffer": "",
        "CompOffer1": "",
        "CompOffer2": ""
      },
      {
        "Item": this.translate.instant('TECHNICAL_INFORMATION.Capacity(unit/hour)'),
        "SelectedOffer": "",
        "CompOffer1": "",
        "CompOffer2": ""
      },
      {
        "Item": this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
        "SelectedOffer": "",
        "CompOffer1": "",
        "CompOffer2": ""
      },
      {
        "Item": this.translate.instant('TECHNICAL_INFORMATION.SelectionJustifications'),
        "SelectedOffer": "",
        "CompOffer1": "",
        "CompOffer2": ""
      }
    ];
    this.me_BidAnalysis_source = new LocalDataSource;
    this.me_BidAnalysis_source.load(bidAnalysisInitialSource);
  }
  setBidAnalysisFirstColumn() {
    this.me_BidAnalysis_source.data[0]["Item"] = this.translate.instant('TECHNICAL_INFORMATION.Manufacturer');
    this.me_BidAnalysis_source.data[1]["Item"] = this.translate.instant('TECHNICAL_INFORMATION.CountryofOrigin');
    this.me_BidAnalysis_source.data[2]["Item"] = this.translate.instant('TECHNICAL_INFORMATION.YearofOffer');
    this.me_BidAnalysis_source.data[3]["Item"] = this.translate.instant('TECHNICAL_INFORMATION.Capacity(unit/hour)');
    this.me_BidAnalysis_source.data[4]["Item"] = this.translate.instant('TECHNICAL_INFORMATION.TotalCost');
    this.me_BidAnalysis_source.data[5]["Item"] = this.translate.instant('TECHNICAL_INFORMATION.SelectionJustifications');
  }
  settingsChangeLogistics() {

    this.manufacturing_stages_settings_c.columns["MachineName"].title = this.translate.instant('TECHNICAL_INFORMATION.EquipmentUsed'),
      //this.manufacturing_stages_settings_c.columns["Operators"]["show"] = false;
      delete this.manufacturing_stages_settings_c.columns.Operators;
    this.manufacturing_stages_settings_c.columns["StageSequence"].title = this.translate.instant('TECHNICAL_INFORMATION.ProcessDescription');
    this.manufacturing_stages_settings_c.columns["ProductionCapacity"] = {
      "filter": false,
      "title": this.translate.instant('TECHNICAL_INFORMATION.ProductionRate'),
      "type": "number"
    };
    console.log(this.manufacturing_stages_settings_c);

    this.production_lines_settings_c.columns["DaysPerYear"].title = this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear')
    //this.production_lines_settings_c.columns["Description_desc"]["show"] = false;
    delete this.production_lines_settings_c.columns.Description_desc
    this.production_lines_settings_c.columns["PercentageEfficiency"].title = this.translate.instant('TECHNICAL_INFORMATION.LevelofEfficiency');
    this.production_lines_settings_c.columns["Rate"].title = this.translate.instant('TECHNICAL_INFORMATION.StaticCapacity');
    this.production_lines_settings_c.columns["ShifHours"].title = this.translate.instant('TECHNICAL_INFORMATION.Process');
    this.production_lines_settings_c.columns["ShiftPerDay"].title = this.translate.instant('TECHNICAL_INFORMATION.ProductType');
    console.log(this.production_lines_settings_c);
  }

  enarTableSettings() {
    this.machinery_settings.columns.MachineDesc.title = this.translate.instant('TECHNICAL_INFORMATION.MachineNameEn');
    this.machinery_settings.columns.MachineName.title = this.translate.instant('TECHNICAL_INFORMATION.MachinePurposeEn');
    this.machinery_settings.columns.QuotDate.title = this.translate.instant('TECHNICAL_INFORMATION.QuotationDateEn');
    this.machinery_settings.columns.QuotInvNo.title = this.translate.instant('TECHNICAL_INFORMATION.QuotationInvoiceNumberEn');
    this.machinery_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');

    this.machinery_settings_ar.columns.MachineDesc.title = this.translate.instant('TECHNICAL_INFORMATION.MachineNameAr');
    this.machinery_settings_ar.columns.MachineName.title = this.translate.instant('TECHNICAL_INFORMATION.MachinePurposeAr');
    this.machinery_settings_ar.columns.QuotDate.title = this.translate.instant('TECHNICAL_INFORMATION.QuotationDateAr');
    this.machinery_settings_ar.columns.QuotInvNo.title = this.translate.instant('TECHNICAL_INFORMATION.QuotationInvoiceNumberAr');
    this.machinery_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

    //this.bcw_settings.columns.CivilItem.title = this.translate.instant('TECHNICAL_INFORMATION.CivilItemEn');
    //this.bcw_settings_ar.columns.CivilItem.title = this.translate.instant('TECHNICAL_INFORMATION.CivilItemAr');

    //this.bcw_C_settings.columns.CivilItem.title = this.translate.instant('TECHNICAL_INFORMATION.CivilItemEn');
    //this.bcw_C_settings_ar.columns.CivilItem.title = this.translate.instant('TECHNICAL_INFORMATION.CivilItemAr');

    // this.vehicle_settings.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityEn');
    // this.vehicle_settings.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostEn');
    // this.vehicle_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');
    // this.vehicle_settings.columns.VehicleName.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionEn');

    // this.vehicle_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
    // this.vehicle_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
    // this.vehicle_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');
    // this.vehicle_settings_ar.columns.VehicleName.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');

    // this.furniture_settings.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionEn');
    // this.furniture_settings.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeEn');
    // this.furniture_settings.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityEn');
    // this.furniture_settings.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostEn');
    // this.furniture_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');

    // this.furniture_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
    // this.furniture_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
    // this.furniture_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
    // this.furniture_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
    // this.furniture_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

    // this.infotech_settings.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionEn');
    // this.infotech_settings.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeEn');
    // this.infotech_settings.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityEn');
    // this.infotech_settings.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostEn');
    // this.infotech_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');

    // this.infotech_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
    // this.infotech_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
    // this.infotech_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
    // this.infotech_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
    // this.infotech_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

    // this.preopercosts_settings.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionEn');
    // this.preopercosts_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn'); 

    // this.preopercosts_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
    // this.preopercosts_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr'); 

    // this.rawmaterial_settings.columns.RawMatCostUom.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUOMEn');
    // this.rawmaterial_settings.columns.RawMatName.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatNameEn');
    // this.rawmaterial_settings.columns.RawMatQuanPerUomProd.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProdEn');
    // this.rawmaterial_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');

    // this.rawmaterial_settings_ar.columns.RawMatCostUom.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUOMAr');
    // this.rawmaterial_settings_ar.columns.RawMatName.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatNameAr2');
    // this.rawmaterial_settings_ar.columns.RawMatQuanPerUomProd.title = this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProdAr2');
    // this.rawmaterial_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

    // this.manpower_settings.columns.AddBenefPerc.title = this.translate.instant('TECHNICAL_INFORMATION.AddBenefPercEn');
    // this.manpower_settings.columns.BasicMonthSal.title = this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSalEn');
    // this.manpower_settings.columns.NoPositions.title = this.translate.instant('TECHNICAL_INFORMATION.NoPositionsEn');
    // this.manpower_settings.columns.TotalCostMonthSal.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSalEn');
    // this.manpower_settings.columns.TotalSalary.title = this.translate.instant('TECHNICAL_INFORMATION.TotalSalaryEn');

    // this.manpower_settings_ar.columns.AddBenefPerc.title = this.translate.instant('TECHNICAL_INFORMATION.AddBenefPercAr');
    // this.manpower_settings_ar.columns.BasicMonthSal.title = this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSalAr');
    // this.manpower_settings_ar.columns.NoPositions.title = this.translate.instant('TECHNICAL_INFORMATION.NoPositionsAr');
    // this.manpower_settings_ar.columns.TotalCostMonthSal.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSalAr');
    // this.manpower_settings_ar.columns.TotalSalary.title = this.translate.instant('TECHNICAL_INFORMATION.TotalSalaryAr');

    // this.utilitiesdetail_settings.columns.AnnualCost.title = this.translate.instant('TECHNICAL_INFORMATION.AnnualCostEn');
    // this.utilitiesdetail_settings.columns.TotalUse.title = this.translate.instant('TECHNICAL_INFORMATION.TotalUseEn');
    // this.utilitiesdetail_settings.columns.UnitPrice.title = this.translate.instant('TECHNICAL_INFORMATION.UnitPriceEn');

    // this.utilitiesdetail_settings_ar.columns.AnnualCost.title = this.translate.instant('TECHNICAL_INFORMATION.AnnualCostAr');
    // this.utilitiesdetail_settings_ar.columns.TotalUse.title = this.translate.instant('TECHNICAL_INFORMATION.TotalUseAr');
    // this.utilitiesdetail_settings_ar.columns.UnitPrice.title = this.translate.instant('TECHNICAL_INFORMATION.UnitPriceAr');

    // this.safety_settings.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionEn');
    // this.safety_settings.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityEn');
    // this.safety_settings.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostEn');
    // this.safety_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');

    // this.safety_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
    // this.safety_settings_ar.columns.Quantity.title = this.translate.instant('TECHNICAL_INFORMATION.QuantityAr');
    // this.safety_settings_ar.columns.SingleCost.title = this.translate.instant('TECHNICAL_INFORMATION.SingleCostAr');
    // this.safety_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');

    // this.knowhowag_settings.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionEn');
    // this.knowhowag_settings.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeEn');
    // this.knowhowag_settings.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostEn');

    // this.knowhowag_settings_ar.columns.Description.title = this.translate.instant('TECHNICAL_INFORMATION.DescriptionAr');
    // this.knowhowag_settings_ar.columns.Purpose.title = this.translate.instant('TECHNICAL_INFORMATION.PurposeAr');
    // this.knowhowag_settings_ar.columns.TotalCost.title = this.translate.instant('TECHNICAL_INFORMATION.TotalCostAr');
  }

  isFromClaim() {
    this.temp_isFromClaim = this.route.queryParams;

    if (this.temp_isFromClaim.getValue().LoanID)
      this.loanid_isClaims = this.customerProfileService.getDecryptString(this.temp_isFromClaim.getValue().LoanID);

    if (this.temp_isFromClaim.getValue().RequestID)
      this.requestid_isClaims = this.customerProfileService.getDecryptString(this.temp_isFromClaim.getValue().RequestID);

    if (this.temp_isFromClaim.getValue().isClaims) {
      this.isClaims = this.customerProfileService.getDecryptString(this.temp_isFromClaim.getValue().isClaims);
      if (this.isClaims === 'true')
        this.isClaimsForTechGet = 'X';
      else
        this.isClaimsForTechGet = '';
    }

    if (this.temp_isFromClaim.getValue().ProjectID)
      this.projectid_isClaims = this.customerProfileService.getDecryptString(this.temp_isFromClaim.getValue().ProjectID);

    if (this.temp_isFromClaim.getValue().id)
      this.myloansid_isClaims = this.customerProfileService.getDecryptString(this.temp_isFromClaim.getValue().id);

    if (this.temp_isFromClaim.getValue().type)
      this.myloanspath_isClaims = this.customerProfileService.getDecryptString(this.temp_isFromClaim.getValue().type);

  }

  callResolvePrelim(isFromBcwSpecial) {
    if (this.isClaims === "true") {
      this.loan_id = this.loanid_isClaims;
      this.CustomerId = 0;
      this.requestId = this.requestid_isClaims;
      this.projId = this.projectid_isClaims;
      this.ProfileId = this.customerProfileService.currentCustomerProfile.customerProfileId;
      if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
        this.LoanTechnicalService
          .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
          .then((res) => (this.resolveTechnicalInfo(res),
            this.ifBcwScrollCall(isFromBcwSpecial),
            this.Ng4LoadingSpinnerService.hide()),
            err => (this.Ng4LoadingSpinnerService.hide()));
    }
    else if (this.customerProfileService.loanArray) {
      this.loan_id = this.customerProfileService.loanArray.FinPlanId;
      this.CustomerId = 0;
      this.ProfileId = this.customerProfileService.currentCustomerProfile.customerProfileId;
      // alert(this.loan_id)
      if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
        this.LoanTechnicalService
          .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
          .then((res) => (this.resolveTechnicalInfo(res),
            this.ifBcwScrollCall(isFromBcwSpecial),
            this.Ng4LoadingSpinnerService.hide()),
            err => (this.Ng4LoadingSpinnerService.hide()));
    }
  }

  ifBcwScrollCall(isFromBcwSpecial) {
    if (isFromBcwSpecial)
      this.scrollControl("", "", "BC");
  }

  calcCategories(res) {
    // this.technical_list2.push("Choose Component");
    console.log('cat');
    console.log(res);
    res = _.reject(res, { Code: "FW" });
    res = _.reject(res, { Code: "WC" });
    if (res != undefined) {
      for (var i = 0; i < res.length; i++) {
        this.technical_list2.push(this.lang=='en'?res[i].Name:res[i].NameAr);
        this.technical_list_array.push(res[i]);
        this.technical_list_array[i]["payload_name"] = this.technical_list_payload_name[i];
      }
    }
  }

  getManufacProd(res) {
    if (res.MessType === "S") {
      //Applicable Specification Logistics
      if (res.Operation) {
        this.applicableSpec_logistics = res.Operation;
      }
      //-Applicable Specification Logistics

      if (res.ManufacturingStages) {
        this.manufacturing_stages_source.load(res.ManufacturingStages);
      }
      if (res.ProductionLines) {
        for (var p = 0; p < res.ProductionLines.length; p++) {
          var unit1 = this.product_list.find((o) => o.ProductId == (+res.ProductionLines[p]["Description"]));
          if (unit1)
            res.ProductionLines[p]["Description_desc"] = unit1.ProductName;
        }
        this.production_lines_source.load(res.ProductionLines);
      }
    }
    else {
      this.commonService.showFailureToast("Something went wrong, try again later");
      this.commonService.showFailureToast(res.MessText);
    }
  }

  resolveTechnicalInfo(res) {
    this.Ng4LoadingSpinnerService.show();
    this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
    if (res.MessType === "E")
      this.commonService.showFailureToast(res.MessText);

    else {
      // console.log(res);

      this.onResTechInfoPer(res);
      this.getMachineryDropdown(res);
      // this.loanApplicationService
      //   .getLoanMachineryDropdown(this.customerProfileService.loanArray.FinPlanId)
      //   .then((res) => (this.getMachineryDropdown(res)), err => (this.commonService.showFailureToast(err)));

      if (res.CostComp == undefined) {
        return true;
      }
      if (res.FinSummary != undefined) {
        var financeCapitalCostSource_temp = [];
        var financeCapitalCostSource_temp2 = [];
        var financeOperationalCostSource_temp = [];
        var financeOperationalCostSource_temp2 = [];
        var totalcost_capital_temp = 0;
        var totalcost_operation_temp = 0;

        for (var i = 0; i < res.FinSummary.length; i++) {
          var iii = i;
          var totalcost_temp1;
          var totalcost_temp2;
          if (res.FinSummary[i].CostType === "CC") {
            totalcost_temp1 = res.FinSummary[i].TotalCost;
            financeCapitalCostSource_temp.push(res.FinSummary[i]);
            financeCapitalCostSource_temp2.push(res.FinSummary[i]);
            totalcost_capital_temp = +totalcost_capital_temp + +res.FinSummary[i].TotalCost;
            res.FinSummary[i].TotalCost = this.commonService.numberToNumberWithCommas(totalcost_temp1);

            res.FinSummary[i].TotalCost = "SAR " + res.FinSummary[i].TotalCost;
            // console.log(this.financeCapitalCostSource);
          }
          else if (res.FinSummary[i].CostType === "OC") {
            totalcost_temp1 = res.FinSummary[i].TotalCost;
            financeOperationalCostSource_temp.push(res.FinSummary[i]);
            financeOperationalCostSource_temp2.push(res.FinSummary[i]);
            totalcost_operation_temp = +totalcost_operation_temp + +res.FinSummary[i].TotalCost;
            res.FinSummary[i].TotalCost = this.commonService.numberToNumberWithCommas(totalcost_temp1);

            res.FinSummary[i].TotalCost = "SAR " + res.FinSummary[i].TotalCost;
            // console.log(this.financeOperationalCostSource);
          }
        }
        //  this.financeCapitalCostSource = res.FinSummary;
        //  this.financeOperationalCostSource = res.FinSummary;
        // financeCapitalCostSource_temp.push({ CompType: "Grand Total", TotalCost: "SAR " + totalcost_capital_temp.toFixed(2) });
        var temp_calc = +totalcost_capital_temp + +totalcost_operation_temp;
        this.Total_Cost_OC_CC = this.commonService.numberToNumberWithCommas(temp_calc.toFixed(2));

        financeCapitalCostSource_temp.push({ CompType: "Grand Total", TotalCost: "SAR " + this.commonService.numberToNumberWithCommas(totalcost_capital_temp.toFixed(2)) });
        financeOperationalCostSource_temp.push({ CompType: "Grand Total", TotalCost: "SAR " + this.commonService.numberToNumberWithCommas(totalcost_operation_temp.toFixed(2)) });
        financeCapitalCostSource_temp2.push({ CompType: "Grand Total", TotalCost: "SAR " + this.commonService.numberToNumberWithCommas(totalcost_capital_temp.toFixed(2)) });
        financeOperationalCostSource_temp2.push({ CompType: "Grand Total", TotalCost: "SAR " + this.commonService.numberToNumberWithCommas(totalcost_operation_temp.toFixed(2)) });
        this.financeCapitalCostSource = financeCapitalCostSource_temp;
        this.financeCapitalCostSource_ar = financeCapitalCostSource_temp2;
        this.financeOperationalCostSource = financeOperationalCostSource_temp;
        this.financeOperationalCostSource_ar = financeOperationalCostSource_temp2;
        // console.log(this.financeCapitalCostSource);
        // console.log(this.financeOperationalCostSource);

      }
      let component_length = res.CostComp.length;
      for (var i = 0; i < component_length; i++) {
        var costcomp = res.CostComp[i];
        costcomp["Operation"] = "U";
      }
      this.costcomp_array.push(res.CostComp);
      this.costcomp_array_index = res.CostComp;
      // var temp_temp = this.isRaUtMa();
      // console.log(this.costcomp_array);

      // for (var comp = 0; comp < component_length; comp++) {
      // let component_name = res.CostComp[comp].CompName;
      // let component_type = res.CostComp[comp].CompType;
      // let wbs_id = res.CostComp[comp].WbsId;
      // let comp_id = res.CostComp[comp].ComponentId;

      // if (component_type === "IT") {
      //   component_type = "InfoTech";
      //   if (res.InfoTech != null) {
      //     for (var j = 0; j < res.InfoTech.length; j++) {
      //       if (res.InfoTech[j].WbsId === wbs_id) {
      //         var totalcost = 0;
      //         totalcost = +totalcost + +res.InfoTech[j].TotalCost;
      //         var source = new LocalDataSource();
      //         this.panelstepindex = this.panelstepindex + 1;
      //         source.load(res.InfoTech);
      //         this.infotech_localdatasource_array.push(source);
      //         this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
      //           panelStep: this.panelstepindex ,
      //           typesel: component_type, uniqname: component_name, method: "views",
      //           source: source, settings: this.infotech_settings, length: res.InfoTech.length,
      //           componentID: comp_id,  wbsid : wbs_id,
      //           componentOperation: "U", localdatasource_index: this.infotech_localdatasource_array.length,
      //           totalcost: totalcost
      //         });
      //       }
      //       else {
      //         var source = new LocalDataSource();
      //         this.panelstepindex = this.panelstepindex + 1;
      //         this.infotech_localdatasource_array.push(source);
      //         this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
      //           panelStep: this.panelstepindex,
      //           typesel: component_type, uniqname: component_name, method: "views",
      //           source: source, settings: this.infotech_settings, length: 0, 
      //           componentOperation: "C", localdatasource_index: this.infotech_localdatasource_array.length,
      //           componentID: comp_id,  wbsid : wbs_id,
      //           totalcost: 0
      //         });
      //       }
      //     }
      //   }
      // }
      var cost_comp_ismain = _.where(res.CostComp, { IsMain: "X" });

      var comp_temp = _.where(cost_comp_ismain, { CompType: "ME" });
      if (res.Machinery || comp_temp != 0) {
        //component_type = "Machinery and Equipments";
        if (res.Machinery === undefined)
          res["Machinery"] = [];
        var component_type = "ME";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.Machinery != undefined) {
          var flag = 0;
          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          var source_temp_array = [];
          for (var j = 0; j < res.Machinery.length; j++) {

            //if (res.Machinery[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.Machinery[j].TotalCost;
            var source = new LocalDataSource();
            res.Machinery[j]["Operation"] = "U";
            res.Machinery[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Machinery[j]["TotalCost"]);
            res.Machinery[j]["Cost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Machinery[j]["Cost"]);
            var machinery_array = [];
            machinery_array.push(res.Machinery[j]);
            if (source2.data.length == 0)
              source2.load(machinery_array);
            else
              source2.add(res.Machinery[j]);
            // source2.load(res.Machinery);
            var source_temp = new LocalDataSource();

            if (res.Machinery[j].CompQuot != undefined) {
              source_temp.data = res.Machinery[j].CompQuot;
              source_temp_array.push(source_temp);
            }
            else {
              source_temp_array.push(source_temp);
            }
            flag = 2;
            flag2 = 1;
            //  }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            for (var i = 0; i < source2.data.length; i++) {
              if (source2.data[i].CompQuot != undefined) {
                for (var j = 0; j < source2.data[i].CompQuot.length; j++) {
                  source2.data[i].CompQuot[j]["Operation"] = "U"
                }
              }
            }
            this.machinery_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for Machinery 
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.machinery_settings, settings_ar: this.machinery_settings_ar, length: res.Machinery.length,
              componentOperation: "U", localdatasource_index: this.machinery_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              mach_quot_source: source_temp_array,
              panel_comment: this.me_comments
            });
            if (this.ProfileId != undefined && this.loan_id != undefined, this.requestId != undefined) {
              if (this.isClaims != 'true')
                this.LoanTechnicalService
                  .getManfacProducts(this.ProfileId, this.loan_id, this.requestId)
                  .then((res) => (
                    this.getManufacProd(res),
                    this.Ng4LoadingSpinnerService.hide()),
                    err => (this.Ng4LoadingSpinnerService.hide()));
            }
          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   // for (var i = 0; i < source2.data.length; i++) {
        //   //   for (var j = 0; j < source2.data[i].CompQuot.length; j++) {
        //   //     source2.data[i].CompQuot[j]["Operation"] = "U"
        //   //   }
        //   // }  
        //   this.machinery_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.machinery_settings, settings_ar: this.machinery_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.machinery_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id, mach_quot_source: source_temp_array
        //   });
        //   flag = 3;
        //   flag2 = 1;
        // }


      }

      //Start123
      ///BCW  if (res.Machinery) {
      var comp_temp = _.where(cost_comp_ismain, { CompType: "BC" });
      //this.Bcw_GuiId = comp_temp[0].  
      if (res.Bcw || comp_temp != 0) {
        //hide button
        var building_state = "No";
        var civil_state = "No";
        var temp_build_civil;
        if (comp_temp.length != 0) {
          if (comp_temp[0]["BcwLumpsum"]) {
            temp_build_civil = comp_temp[0]["BcwLumpsum"].split("&");
            building_state = temp_build_civil[0] === "Y" ? "Yes" : "No";
            civil_state = temp_build_civil[1] === "Y" ? "Yes" : "No";
          }
        }

        this.Bcw_GuiId = comp_temp[0].GuiId;
        if (res.Bcw === undefined)
          res["Bcw"] = [];
        var component_type = "BC";
        //component_type = "Building and Civil Works";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.Bcw != null) {

          var flag = 0;

          var source2 = new LocalDataSource();
          var source3 = new LocalDataSource();
          var source4 = new LocalDataSource();
          var totalcost2 = comp_temp[0]["CompTotCost"];

          // if (this.Bcw_created === 1) {
          //   flag = 2;
          // }

          for (var j = 0; j < res.Bcw.length; j++) {

            // if (res.Bcw[j].ComponentId === comp_id) {

            //totalcost2 = +totalcost2 + +res.Bcw[j].TotalCost;
            //var source = new LocalDataSource();
            res.Bcw[j]["Operation"] = "U";
            res.Bcw[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Bcw[j]["TotalCost"]);

            var Bcw_array = [];
            Bcw_array.push(res.Bcw[j]);
            // if (source2.data.length == 0)
            //   source2.load(Bcw_array);
            // else
            //   source2.add(res.Bcw[j]);
            // source2.load(res.bcw);
            if (res.Bcw[j].Category == "B") {
              if (source2.data.length == 0)
                source2.load(Bcw_array);
              else
                source2.add(res.Bcw[j]);
            }

            if (res.Bcw[j].Category == "C") {
              if (source3.data.length == 0)
                source3.load(Bcw_array);
              else
                source3.add(res.Bcw[j]);
            }

            if (res.Bcw[j].Category == "F" || res.Bcw[j].Category == "F1" || res.Bcw[j].Category == "F2" || res.Bcw[j].Category == "F3") {
              if (source4.data.length == 0)
                source4.load(Bcw_array);
              else
                source4.add(res.Bcw[j]);
            }

            flag = 2; flag2 = 1;
            //}

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.bcw_localdatasource_array.push(source2);
            // if (comp_temp[0].BcwLumpsum === "X") {
            //   var panel_item_temp = {
            //     scroll_name: "scroll" + this.panelstepindex, //Jai add here for Bcw
            //     ComponentId: comp_temp[0]["ComponentId"], WbsId: comp_temp[0]["WbsId"],
            //     panelStep: this.panelstepindex, isCost: "Y",
            //     typesel: component_type, typeselname: component_type_fullname, method: "views",
            //     source1: source2, source2: source3, settings: this.bcw_settings, settings2: this.bcw_C_settings, settings_ar: this.bcw_settings_ar, length: res.Bcw.length,
            //     componentOperation: "U", localdatasource_index: this.bcw_localdatasource_array.length,
            //     totalcost: this.commonService.numberToNumberWithCommas((+comp_temp[0].CompTotCost).toFixed(2)), totalcost2: (+comp_temp[0].CompTotCost).toFixed(2),
            //     panel_comment: this.bcw_comments, source3: source4
            //   };
            //   this.panel_items.push(panel_item_temp);
            //   this.Bcw_Item_Global = panel_item_temp;
            //   console.log(this.Bcw_Item_Global);
            // }
            if (comp_temp[0]) {
              var panel_item_temp2 = {
                scroll_name: "scroll" + this.panelstepindex, //Jai add here for Bcw
                panelStep: this.panelstepindex, isCost: "Y",
                typesel: component_type, typeselname: component_type_fullname, method: "views",
                source1: source2, source2: source3, settings: this.bcw_settings_c, settings2: this.bcw_C_settings_c,
                //settings_ar: this.bcw_settings_c, settings2_ar: this.bcw_settings_c, 
                length: res.Bcw.length,
                componentOperation: "U", localdatasource_index: this.bcw_localdatasource_array.length,
                totalcost: parseFloat(totalcost2 + "").toFixed(2), totalcost2: parseFloat(totalcost2 + "").toFixed(2),
                panel_comment: this.bcw_comments, source3: source4, building_state: building_state,
                civil_state: civil_state
              };
              this.panel_items.push(panel_item_temp2);
              this.Bcw_Item_Global = panel_item_temp2;
              console.log(this.Bcw_Item_Global);
              this.Bcw_cost_component = comp_temp;
            }

            //this.panel_items.push(panel_item_temp);

          }
        }
      } else if (comp_temp != 0) {
        this.Bcw_cost_component = comp_temp;
      }
      // if (flag2 == 0) {
      //   var source = new LocalDataSource();
      //   this.panelstepindex = this.panelstepindex + 1;
      //   this.bcw_localdatasource_array.push(source);
      //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
      //     panelStep: this.panelstepindex,
      //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
      //     source: source, settings: this.bcw_settings, settings_ar: this.bcw_settings_ar, length: 0,
      //     componentOperation: "U", localdatasource_index: this.bcw_localdatasource_array.length,
      //     totalcost: 0,
      //     componentID: comp_id, wbsid: wbs_id,
      //   });
      //   flag = 3; flag2 = 1;
      // }
      //}

      // //Vehicle

      var comp_temp = _.where(cost_comp_ismain, { CompType: "VE" });
      if (res.Vehicle || comp_temp != 0) {
        //component_type = "Vehicles";
        if (res.Vehicle === undefined)
          res["Vehicle"] = [];
        var component_type = "VE";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.Vehicle != undefined) {
          var flag = 0;
          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.Vehicle.length; j++) {

            //  if (res.Vehicle[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.Vehicle[j].TotalCost;
            //var source = new LocalDataSource();
            res.Vehicle[j]["Operation"] = "U";
            res.Vehicle[j]["SingleCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Vehicle[j]["SingleCost"]);
            res.Vehicle[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Vehicle[j]["TotalCost"]);

            var vehicle_array = [];
            vehicle_array.push(res.Vehicle[j]);
            if (source2.data.length == 0)
              source2.load(vehicle_array);
            else
              source2.add(res.Vehicle[j]);
            // source2.load(res.vehicle);

            flag = 2; flag2 = 1; flag2 = 1;
            //  }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.vehicle_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for Vehicle
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.vehicle_settings_c, length: res.Vehicle.length,
              componentOperation: "U", localdatasource_index: this.vehicle_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.ve_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.vehicle_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.vehicle_settings, settings_ar: this.vehicle_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.vehicle_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }
      }


      // Furniture
      var comp_temp = _.where(cost_comp_ismain, { CompType: "FU" });
      if (res.Furniture || comp_temp != 0) {
        //component_type = "Furnitures";
        if (res.Furniture === undefined)
          res["Furniture"] = [];
        var component_type = "FU";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.Furniture != undefined) {
          var flag = 0;
          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.Furniture.length; j++) {

            //if (res.Furniture[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.Furniture[j].TotalCost;
            //var source = new LocalDataSource();
            res.Furniture[j]["Operation"] = "U";
            res.Furniture[j]["SingleCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Furniture[j]["SingleCost"]);
            res.Furniture[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Furniture[j]["TotalCost"]);

            var furniture_array = [];
            furniture_array.push(res.Furniture[j]);
            if (source2.data.length == 0)
              source2.load(furniture_array);
            else
              source2.add(res.Furniture[j]);
            // source2.load(res.Furniture);

            flag = 2; flag2 = 1; flag2 = 1;
            //}

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.furniture_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex,//Jai add here for Furniture
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.furniture_settings_c, length: res.Furniture.length,
              componentOperation: "U", localdatasource_index: this.furniture_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.fu_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.furniture_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.furniture_settings, settings_ar: this.furniture_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.furniture_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }
      }

      // // infotech
      var comp_temp = _.where(cost_comp_ismain, { CompType: "IT" });
      if (res.InfoTech || comp_temp != 0) {
        //component_type = "Information Technology";
        if (res.InfoTech === undefined)
          res["InfoTech"] = [];
        var component_type = "IT";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.InfoTech != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.InfoTech.length; j++) {

            //  if (res.InfoTech[j].ComponentId === comp_id) {
            // if(res.InfoTech[j].isFromIcu){
            if (res.InfoTech[j].isFromIcu === undefined || res.InfoTech[j].isFromIcu === "" || res.InfoTech[j].isFromIcu === "undefined") {
              totalcost2 = +totalcost2 + +res.InfoTech[j].TotalCost;
              //var source = new LocalDataSource();
              res.InfoTech[j]["Operation"] = "U";
              res.InfoTech[j]["SingleCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.InfoTech[j]["SingleCost"]);
              res.InfoTech[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.InfoTech[j]["TotalCost"]);
              var infotech_array = [];
              infotech_array.push(res.InfoTech[j]);
              if (source2.data.length == 0)
                source2.load(infotech_array);
              else
                source2.add(res.InfoTech[j]);
              // source2.load(res.InfoTech);
            }
            //  }
            flag = 2; flag2 = 1;
            //  }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.infotech_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for infotech
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.infotech_settings_c, length: res.InfoTech.length,
              componentOperation: "U", localdatasource_index: this.infotech_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.it_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.infotech_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.infotech_settings, settings_ar: this.infotech_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.infotech_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }
      // // PreOperCosts
      var comp_temp = _.where(cost_comp_ismain, { CompType: "PR" });
      if (res.PreOperCosts || comp_temp != 0) {
        // component_type = "Pre Operational Costs";
        if (res.PreOperCosts === undefined)
          res["PreOperCosts"] = [];
        var component_type = "PR";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.PreOperCosts != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.PreOperCosts.length; j++) {

            // if (res.PreOperCosts[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.PreOperCosts[j].TotalCost;
            //var source = new LocalDataSource();
            res.PreOperCosts[j]["Operation"] = "U";
            res.PreOperCosts[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.PreOperCosts[j]["TotalCost"]);
            var preopercosts_array = [];
            preopercosts_array.push(res.PreOperCosts[j]);
            if (source2.data.length == 0)
              source2.load(preopercosts_array);
            else
              source2.add(res.PreOperCosts[j]);
            // source2.load(res.PreOperCosts);

            flag = 2; flag2 = 1;
            //   }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.preopercosts_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex,//Jai add here for preopercost
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.preopercosts_settings_c, length: res.PreOperCosts.length,
              componentOperation: "U", localdatasource_index: this.preopercosts_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.pr_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.preopercosts_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.preopercosts_settings, settings_ar: this.preopercosts_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.preopercosts_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }
      // // Raw Material
      var comp_temp = _.where(cost_comp_ismain, { CompType: "RA" });
      if (res.RawMaterial || comp_temp != 0) {
        //  component_type = "Raw Materials";
        if (res.RawMaterial === undefined)
          res["RawMaterial"] = [];
        var component_type = "RA";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.RawMaterial != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.RawMaterial.length; j++) {

            // if (res.RawMaterial[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.RawMaterial[j].TotalCost;
            //var source = new LocalDataSource();
            res.RawMaterial[j]["Operation"] = "U";
            res.RawMaterial[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.RawMaterial[j]["TotalCost"]);
            res.RawMaterial[j]["RawMatCostUom"] = "SAR " + this.commonService.numberToNumberWithCommas(res.RawMaterial[j]["RawMatCostUom"]);
            var rawmaterial_array = [];
            rawmaterial_array.push(res.RawMaterial[j]);
            if (source2.data.length == 0)
              source2.load(rawmaterial_array);
            else
              source2.add(res.RawMaterial[j]);
            // source2.load(res.RawMaterial);

            flag = 2; flag2 = 1;
            // }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.rawmaterial_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for raw materials
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.rawmaterial_settings_c, length: res.RawMaterial.length,
              componentOperation: "U", localdatasource_index: this.rawmaterial_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.ra_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.rawmaterial_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, method: "views",
        //     source: source, settings: this.rawmaterial_settings, settings_ar: this.rawmaterial_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.rawmaterial_localdatasource_array.length,
        //     totalcost: 0
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }

      // // ManPower
      var comp_temp = _.where(cost_comp_ismain, { CompType: "MA" });
      if (res.ManPower || comp_temp != 0) {
        // component_type = "Man Power";
        if (res.ManPower === undefined)
          res["ManPower"] = [];
        component_type = "MA";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        // var unit = this.labour_type.find((o) => o.Id == component_name);
        // if (unit)
        //   var component_name_full = unit.Desc;
        if (res.ManPower != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var source3 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.ManPower.length; j++) {

            //if (res.ManPower[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.ManPower[j].TotalSalary;
            //var source = new LocalDataSource();
            res.ManPower[j]["Operation"] = "U";
            res.ManPower[j]["BasicMonthSal"] = "SAR " + this.commonService.numberToNumberWithCommas(res.ManPower[j]["BasicMonthSal"]);
            res.ManPower[j]["TotalCostMonthSal"] = "SAR " + this.commonService.numberToNumberWithCommas(res.ManPower[j]["TotalCostMonthSal"]);
            res.ManPower[j]["TotalSalary"] = "SAR " + this.commonService.numberToNumberWithCommas(res.ManPower[j]["TotalSalary"]);

            var manpower_array = [];
            manpower_array.push(res.ManPower[j]);
            if (res.ManPower[j].LabourType == "D") {
              if (source2.data.length == 0)
                source2.load(manpower_array);
              else
                source2.add(res.ManPower[j]);
            }

            if (res.ManPower[j].LabourType == "I") {
              if (source3.data.length == 0)
                source3.load(manpower_array);
              else
                source3.add(res.ManPower[j]);
            }
            // source2.load(res.ManPower);

            flag = 2; flag2 = 1;


            /// }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.manpower_localdatasource_array.push(source2);

            // if (source2.data.length || source3.data.length) {
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for Manpower
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source1: source2, source2: source3, settings: this.manpower_settings_c, length: res.ManPower.length,
              componentOperation: "U", localdatasource_index: this.manpower_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.ma_comments
            });
            //   }
            // if(source3.data.length){
            //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex, scroll_name: "scroll" + this.panelstepindex,
            //     panelStep: this.panelstepindex, labourtype: "IN",
            //     typesel: component_type, typeselname: component_type_fullname, method: "views",
            //     source: source3, settings: this.manpower_settings, settings_ar: this.manpower_settings_ar, length: res.ManPower.length,
            //     componentOperation: "U", localdatasource_index: this.manpower_localdatasource_array.length,
            //     totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2))
            //   });
            // }
          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.manpower_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name_full, method: "views",
        //     source: source, settings: this.manpower_settings, settings_ar: this.manpower_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.manpower_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }

      // // UtilitiesDetail
      var comp_temp = _.where(cost_comp_ismain, { CompType: "UT" });
      if (res.UtilitiesDetail || comp_temp != 0) {
        // component_type = "Utilities";
        if (res.UtilitiesDetail === undefined)
          res["UtilitiesDetail"] = [];
        var component_type = "UT";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.UtilitiesDetail != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.UtilitiesDetail.length; j++) {

            //  if (res.UtilitiesDetail[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.UtilitiesDetail[j].AnnualCost;
            //var source = new LocalDataSource();
            res.UtilitiesDetail[j]["Operation"] = "U";
            res.UtilitiesDetail[j]["UnitPrice"] = "SAR " + this.commonService.numberToNumberWithCommas(res.UtilitiesDetail[j]["UnitPrice"]);
            res.UtilitiesDetail[j]["AnnualCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.UtilitiesDetail[j]["AnnualCost"]);
            var utilitiesdetail_array = [];
            utilitiesdetail_array.push(res.UtilitiesDetail[j]);
            if (source2.data.length == 0)
              source2.load(utilitiesdetail_array);
            else
              source2.add(res.UtilitiesDetail[j]);
            // source2.load(res.UtilitiesDetail);

            flag = 2; flag2 = 1;
            //  }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.utilitiesdetail_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for utilities
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.utilitiesdetail_settings_c, length: res.UtilitiesDetail.length,
              componentOperation: "U", localdatasource_index: this.utilitiesdetail_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.ut_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.utilitiesdetail_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.utilitiesdetail_settings, settings_ar: this.utilitiesdetail_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.utilitiesdetail_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }

      // // Safety
      var comp_temp = _.where(cost_comp_ismain, { CompType: "SA" });
      if (res.Safety || comp_temp != 0) {
        // component_type = "Safety";
        if (res.Safety === undefined)
          res["Safety"] = [];
        var component_type = "SA";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.Safety != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.Safety.length; j++) {

            // if (res.Safety[j].ComponentId === comp_id) {
            // if(res.Safety[j].IsFromSafety){
            if (res.Safety[j].IsFromSafety === undefined || res.Safety[j].IsFromSafety === "" || res.Safety[j].IsFromSafety === "undefined") {
              totalcost2 = +totalcost2 + +res.Safety[j].TotalCost;
              //var source = new LocalDataSource();
              res.Safety[j]["Operation"] = "U";
              res.Safety[j]["SingleCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Safety[j]["SingleCost"]);
              res.Safety[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.Safety[j]["TotalCost"]);
              var safety_array = [];
              safety_array.push(res.Safety[j]);
              if (source2.data.length == 0)
                source2.load(safety_array);
              else
                source2.add(res.Safety[j]);
              // source2.load(res.Safety);
            }
            // }

            flag = 2; flag2 = 1;
            //  }

          }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.safety_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for safety
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.safety_settings_c, length: res.Safety.length,
              componentOperation: "U", localdatasource_index: this.safety_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.sa_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.safety_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.safety_settings, settings_ar: this.safety_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.safety_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }
      // // KnowHowAg
      var comp_temp = _.where(cost_comp_ismain, { CompType: "KN" });
      if (res.KnowHowAg || comp_temp != 0) {
        // component_type = "Know How Agreements";
        if (res.KnowHowAg === undefined)
          res["KnowHowAg"] = [];
        var component_type = "KN";
        var component_type_fullname = this.find_code_func(component_type);
        var flag = 0;
        var flag2 = 0;
        if (res.KnowHowAg != undefined) {
          var flag = 0;

          var source2 = new LocalDataSource();
          var totalcost2 = 0;
          for (var j = 0; j < res.KnowHowAg.length; j++) {

            // if (res.KnowHowAg[j].ComponentId === comp_id) {

            totalcost2 = +totalcost2 + +res.KnowHowAg[j].TotalCost;
            //var source = new LocalDataSource();
            res.KnowHowAg[j]["Operation"] = "U";
            res.KnowHowAg[j]["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas(res.KnowHowAg[j]["TotalCost"]);
            var knowhowag_array = [];
            knowhowag_array.push(res.KnowHowAg[j]);
            if (source2.data.length == 0)
              source2.load(knowhowag_array);
            else
              source2.add(res.KnowHowAg[j]);
            // source2.load(res.KnowHowAg);

            flag = 2; flag2 = 1;
          }

          //   }
          if (flag == 2 || comp_temp != 0) {
            this.panelstepindex = this.panelstepindex + 1;
            this.knowhowag_localdatasource_array.push(source2);
            this.panel_items.push({
              scroll_name: "scroll" + this.panelstepindex, //Jai add here for know how agreements
              panelStep: this.panelstepindex,
              typesel: component_type, typeselname: component_type_fullname, method: "views",
              source: source2, settings: this.knowhowag_settings_c, length: res.KnowHowAg.length,
              componentOperation: "U", localdatasource_index: this.knowhowag_localdatasource_array.length,
              totalcost: this.commonService.numberToNumberWithCommas(totalcost2.toFixed(2)),
              panel_comment: this.kh_comments
            });

          }
        }
        // if (flag2 == 0) {
        //   var source = new LocalDataSource();
        //   this.panelstepindex = this.panelstepindex + 1;
        //   this.knowhowag_localdatasource_array.push(source);
        //   this.panel_items.push({ scroll_name: "scroll" + this.panelstepindex,
        //     panelStep: this.panelstepindex,
        //     typesel: component_type, typeselname: component_type_fullname, uniqname: component_name, method: "views",
        //     source: source, settings: this.knowhowag_settings, settings_ar: this.knowhowag_settings_ar, length: 0,
        //     componentOperation: "U", localdatasource_index: this.knowhowag_localdatasource_array.length,
        //     totalcost: 0,
        //     componentID: comp_id, wbsid: wbs_id,
        //   });
        //   flag = 3; flag2 = 1;
        // }

      }

      ///End123

      // if(iii = +res.FinSummary.length - 1){
      //   this.target1.scrollIntoView({behavior:"smooth"});
      // }

      //  }

    }
    this.Ng4LoadingSpinnerService.hide();

  }

  // bcw_floor_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   add: {
  //     addButtonContent: '<i class="nb-plus" title="Add"></i>',
  //     createButtonContent: '<i class="nb-checkmark" title="Save"></i>',
  //     cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
  //     confirmCreate: true,
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //     createButtonContent: '<i class="nb-checkmark" title="Save"></i>',
  //     cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
  //     saveButtonContent: '<i class="nb-checkmark" title="Save"></i>',
  //     confirmSave: true,
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //     createButtonContent: '<i class="nb-checkmark" title="Save"></i>',
  //     cancelButtonContent: '<i class="nb-close" title="Cancel"></i>',
  //     confirmDelete: true,
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true
  //   },

  //   columns: {
  //     Floor: {
  //       title: "Floor No.",
  //       type: "number",
  //       filter: false,
  //       width: "40%"
  //     },
  //     Area: {
  //       title: "Area (m2)",
  //       type: "number",
  //       filter: false,
  //       width: "40%"
  //     }
  //   }

  //   // pager: {
  //   //   display: true,
  //   //   perPage: 20,
  //   // }

  // };


  financing_summary_settings = {
    hideSubHeader: true,

    noDataMessage: "No financing_summary Found",

    mode: "external",

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Edit"></i>',
    },

    actions: {
      position: "right",
      add: false,
      edit: false,
      delete: false
    },

    columns: {
      types: {
        title: "Types",
        type: "string",
        filter: false
      },
      totalCost: {
        title: "Total Cost",
        type: "number",
        filter: false
      }
    },

    pager: {
      display: true,
      perPage: 20,
    }

  };


  // manufacturing_stages_settings = {

  //   hideSubHeader: true,

  //   noDataMessage: "No Manufacturing Stages Found",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions"
  //   },

  //   columns: {

  //     StageSequence: {
  //       title: "Stage Sequence",
  //       type: "string",
  //     },
  //     // MachineId: {
  //     //   title: "Machine ID",
  //     //   type: "string",
  //     // },
  //     MachineName: {
  //       title: "Machine Name",
  //       type: "string"
  //     },
  //     Operators: {
  //       title: "Number of Operators",
  //       type: "string",
  //     },
  //     // ProductionRate: {
  //     //   title: this.translate.instant('TECHNICAL_INFORMATION.ProductionRate'),
  //     //   type: "string",
  //     // },
  //     // ProductionUom: {
  //     //   title: "Production Unit of Measure",
  //     //   type: "string",
  //     // },
  //     // StageName: {
  //     //   title: "Stage Name",
  //     //   type: "string"
  //     // },

  //   }
  // };

  // manufacturing_stages_settings_ar = {

  //   hideSubHeader: true,

  //   noDataMessage: "لم يتم العثور على مراحل التصنيع",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال"
  //   },

  //   columns: {

  //     StageSequence: {
  //       title: "سلسلة المرحلة",
  //       type: "string",
  //     },
  //     MachineId: {
  //       title: "هوية الالة",
  //       type: "string",
  //     },
  //     MachineName: {
  //       title: "اسم الالة",
  //       type: "string"
  //     },
  //     Operators: {
  //       title: "عدد المشغلين",
  //       type: "string",
  //     },
  //     // ProductionRate: {
  //     //   title: this.translate.instant('TECHNICAL_INFORMATION.ProductionRate'),
  //     //   type: "string",
  //     // },
  //     // ProductionUom: {
  //     //   title: "Production Unit of Measure",
  //     //   type: "string",
  //     // },
  //     // StageName: {
  //     //   title: "Stage Name",
  //     //   type: "string"
  //     // },

  //   }
  // };

  // production_lines_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Installed Capacities Found",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions"
  //   },


  //   columns: {

  //     Description_desc: {
  //       title: "Description",
  //       type: "text",
  //       filter: false
  //     },
  //     Rate: {
  //       title: "Rate",
  //       type: "number",
  //       filter: false
  //     },
  //     // RateUnit: {
  //     //   title: "Rate Unit of Measure",
  //     //   type: "number",
  //     //   filter: false
  //     // },
  //     // MeasurementUnit: {
  //     //   title: 'Measurement Unit of Measure',
  //     //   type: 'html',
  //     //   defaultValue: '',
  //     //   editor: {
  //     //     type: 'list',
  //     //     config: {
  //     //       list: [],
  //     //     },
  //     //   },
  //     //   filter: false
  //     // },
  //     ShifHours: {
  //       title: "Shift Hours",
  //       type: "number",
  //       filter: false
  //     },
  //     ShiftPerDay: {
  //       title: "Shift Per Day",
  //       type: "number",
  //       filter: false
  //     },
  //     DaysPerYear: {
  //       title: this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear'),
  //       type: "number",
  //       filter: false
  //     },
  //     PercentageEfficiency: {
  //       title: "Percentage Efficiency",
  //       type: "number",
  //       filter: false
  //     },
  //   }
  // };

  // production_lines_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال"
  //   },


  //   columns: {

  //     Description_desc: {
  //       title: "وصف",
  //       type: "text",
  //       filter: false
  //     },
  //     Rate: {
  //       title: "معدل",
  //       type: "number",
  //       filter: false
  //     },
  //     ShifHours: {
  //       title: "ساعات التحول",
  //       type: "number",
  //       filter: false
  //     },
  //     ShiftPerDay: {
  //       title: "التحول في اليوم الواحد",
  //       type: "number",
  //       filter: false
  //     },
  //     DaysPerYear: {
  //       title: "أيام في السنة",
  //       type: "number",
  //       filter: false
  //     },
  //     PercentageEfficiency: {
  //       title: "النسبة المئوية الكفاءة",
  //       type: "number",
  //       filter: false
  //     },
  //   }
  // };


  machinery_settings = {
    hideSubHeader: true,

    noDataMessage: "No Machinery Found",

    mode: "external",

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      // editButtonContent: '<ng-template #deletetipContent>Delete Component</ng-template><button matRipple matRippleColor="rgba(255,239,20,0.15)" style="cursor: pointer; margin-right: 25px; margin-top: 5px" class="close" aria-label="Close" [ngbTooltip]="deletetipContent"><span aria-hidden="true" class="nb-trash"></span></button>'
      editButtonContent: '<i class="nb-edit icon-arrangement-left" title="Edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash icon-arrangement-right" title="Delete"></i>',
    },


    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "Actions",
      //custom: [{ name: 'ourCustomAction', title: '<i class="nb-plus"></i>' }],
    },

    columns: {
      MachineName: {
        title: "Machine Name",
        type: "string",
      },
      // MachineSpecs: {
      //   title: "Machine Specification",
      //   type: "string"
      // },
      MachineDesc: {
        title: "Machine Purpose",
        type: "string"
      },
      QuotInvNo: {
        title: "Quotation Invoice Number",
        type: "number"
      },
      QuotDate: {
        title: "Quotation Date",
        type: "string"
      },
      // ReferenceNo: {
      //   title: "Reference Number",
      //   type: "string"
      // },
      // SupplierId: {
      //   title: "Supplier ID",
      //   type: "string"
      // },
      // Quantity: {
      //   title: "Quantity",
      //   type: "string"
      // },
      // QuantityUom: {
      //   title: "QuantityUom",
      //   type: "string"
      // },
      // Cost: {
      //   title: "Cost",
      //   type: "string"
      // },
      // CostCurr: {
      //   title: "Cost Curr",
      //   type: "string"
      // },
      TotalCost: {
        title: "Total Cost",
        type: "number",
      },
      // TotalCostCurr: {
      //   title: "TotalCostCurr",
      //   type: "string"
      // },

      // CompQuot: {
      //   title: "Competitors Quotation",
      //   type: "string"
      // }
    }
  };

  machinery_settings_ar = {
    hideSubHeader: true,

    noDataMessage: " لم يتم العثور على بيانات",

    mode: "external",

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      // editButtonContent: '<ng-template #deletetipContent>Delete Component</ng-template><button matRipple matRippleColor="rgba(255,239,20,0.15)" style="cursor: pointer; margin-right: 25px; margin-top: 5px" class="close" aria-label="Close" [ngbTooltip]="deletetipContent"><span aria-hidden="true" class="nb-trash"></span></button>'
      editButtonContent: '<i class="nb-edit icon-arrangement-left-ar" title="تعديل"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash icon-arrangement-right-ar" title="حذف"></i>',
    },


    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: true,
      columnTitle: "أفعال",
      //custom: [{ name: 'ourCustomAction', title: '<i class="nb-plus"></i>' }],
    },

    columns: {
      MachineName: {
        title: "Machine Name",
        type: "string",
      },
      MachineSpecs: {
        title: "Machine Specification",
        type: "string"
      },
      MachineDesc: {
        title: "Machine Purpose",
        type: "string"
      },
      QuotInvNo: {
        title: "Quotation Invoice Number",
        type: "number"
      },
      QuotDate: {
        title: "Quotation Date",
        type: "string"
      },
      // ReferenceNo: {
      //   title: "Reference Number",
      //   type: "string"
      // },
      // SupplierId: {
      //   title: "Supplier ID",
      //   type: "string"
      // },
      // Quantity: {
      //   title: "Quantity",
      //   type: "string"
      // },
      // QuantityUom: {
      //   title: "QuantityUom",
      //   type: "string"
      // },
      // Cost: {
      //   title: "Cost",
      //   type: "string"
      // },
      // CostCurr: {
      //   title: "Cost Curr",
      //   type: "string"
      // },
      TotalCost: {
        title: "Total Cost",
        type: "number",
      },
      // TotalCostCurr: {
      //   title: "TotalCostCurr",
      //   type: "string"
      // },

      // CompQuot: {
      //   title: "Competitors Quotation",
      //   type: "string"
      // }
    }
  };

  // machinery_quotation_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Machinery Quotation Found",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     MachineName: {
  //       title: "Machine Name",
  //       type: "text"
  //     },
  //     Manufacturer: {
  //       title: "Manufacturer",
  //       type: "text",
  //     },
  //     OriginCountry: {
  //       title: "Origin Country",
  //       type: "text"
  //     },
  //     Capacity: {
  //       title: "Capacity",
  //       type: "number"
  //     },
  //     CapacityUOM: {
  //       title: "Capacity UOM",
  //       type: "text"
  //     }
  //     // TotalCost: {
  //     //   title: "TotalCost",
  //     //   type: "number"
  //     // },
  //     // CostCurrency: {
  //     //   title: "CostCurrency",
  //     //   type: "number"
  //     // },
  //     // CostIndex: {
  //     //   title: "CostIndex",
  //     //   type: "number"
  //     // },
  //     // SelectedStat: {
  //     //   title: "SelectedStat",
  //     //   type: "number"
  //     // }
  //   }
  // };

  // machinery_quotation_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",

  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     MachineName: {
  //       title: "Machine Name",
  //       type: "text"
  //     },
  //     Manufacturer: {
  //       title: "Manufacturer",
  //       type: "text",
  //     },
  //     OriginCountry: {
  //       title: "OriginCountry",
  //       type: "text"
  //     },
  //     Capacity: {
  //       title: "Capacity",
  //       type: "number"
  //     },
  //     CapacityUOM: {
  //       title: "CapacityUOM",
  //       type: "text"
  //     }
  //     // TotalCost: {
  //     //   title: "TotalCost",
  //     //   type: "number"
  //     // },
  //     // CostCurrency: {
  //     //   title: "CostCurrency",
  //     //   type: "number"
  //     // },
  //     // CostIndex: {
  //     //   title: "CostIndex",
  //     //   type: "number"
  //     // },
  //     // SelectedStat: {
  //     //   title: "SelectedStat",
  //     //   type: "number"
  //     // }
  //   }
  // };

  // bcw_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     CivilItem: {
  //       title: "Civil Item",
  //       type: "string",
  //     },
  //     // ItemDesc: {
  //     //   title: "Item Description",
  //     //   type: "string"
  //     // },
  //     // TotalCost: {
  //     //   title: "Total Cost",
  //     //   type: "number"
  //     // },

  //     // Area: {
  //     //   title: "Ground Floor Area(m2)",
  //     //   type: "string"
  //     // }
  //   }
  // };

  // bcw_C_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     CivilItem: {
  //       title: "Civil Item",
  //       type: "string",
  //     }
  //   }
  // };

  // bcw_C_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     CivilItem: {
  //       title: "Civil Item",
  //       type: "string",
  //     }
  //   }
  // };


  // bcw_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     CivilItem: {
  //       title: "Civil Item",
  //       type: "string",
  //     }
  //     // ItemDesc: {
  //     //   title: "Item Description",
  //     //   type: "string"
  //     // },
  //     // TotalCost: {
  //     //   title: "Total Cost",
  //     //   type: "number"
  //     // },

  //     // Purpose: {
  //     //   title: "Purpose",
  //     //   type: "string"
  //     // }
  //   }
  // };

  // vehicle_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     VehicleName: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "number"
  //     },
  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "number"
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },
  //   }
  // };

  // vehicle_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     VehicleName: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "number"
  //     },
  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "number"
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },
  //   }
  // };

  // furniture_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "string"
  //     },
  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "number"
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },
  //     Purpose: {
  //       title: "Purpose",
  //       type: "string"
  //     }
  //   }
  // };

  // furniture_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "string"
  //     },
  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "number"
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },
  //     Purpose: {
  //       title: "Purpose",
  //       type: "string"
  //     }
  //   }
  // };

  // infotech_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     // Category: {
  //     //   title: "Category",
  //     //   type: "string",
  //     // },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "number"
  //     },

  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "string"
  //     },
  //     // SingleCostCurr: {
  //     //   title: "SingleCostCurr",
  //     //   type: "string"
  //     // },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //     Purpose: {
  //       title: "Purpose",
  //       type: "string"
  //     }
  //   }
  // };
  // infotech_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     // Category: {
  //     //   title: "Category",
  //     //   type: "string",
  //     // },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "number"
  //     },

  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "string"
  //     },
  //     // SingleCostCurr: {
  //     //   title: "SingleCostCurr",
  //     //   type: "string"
  //     // },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //     Purpose: {
  //       title: "Purpose",
  //       type: "string"
  //     }
  //   }
  // };

  // preopercosts_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //   }
  // };
  // preopercosts_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //   }
  // };

  // rawmaterial_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     RawMatName: {
  //       title: "Raw Material Name",
  //       type: "string"
  //     },
  //     RawMatQuanPerUomProd: {
  //       title: "Quantity Required",
  //       type: "string"
  //     },
  //     RawMatCostUom: {
  //       title: "Raw Material Cost Per UOM",
  //       type: "number"
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //   }
  // };

  // rawmaterial_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     RawMatName: {
  //       title: "Raw Material Name",
  //       type: "string"
  //     },
  //     RawMatQuanPerUomProd: {
  //       title: "Quantity Required",
  //       type: "string"
  //     },
  //     RawMatCostUom: {
  //       title: "Raw Material Cost Per UOM",
  //       type: "number"
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //   }
  // };

  // manpower_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {

  //     // LabourType: {
  //     //   title: "Labour Type",
  //     //   type: "string"
  //     // },
  //     // JobDesc: {
  //     //   title: "Job Description",
  //     //   type: "string"
  //     // },
  //     NoPositions: {
  //       title: "No Positions",
  //       type: "number"
  //     },
  //     BasicMonthSal: {
  //       title: "Basic Monthly Salary",
  //       type: "number"
  //     },
  //     TotalCostMonthSal: {
  //       title: "Total Cost Of Monthly Salary",
  //       type: "number"
  //     },
  //     AddBenefPerc: {
  //       title: "AddBenefPerc",
  //       type: "string"
  //     },
  //     TotalSalary: {
  //       title: "TotalSalary",
  //       type: "number"
  //     },

  //   }
  // };

  // manpower_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {

  //     // LabourType: {
  //     //   title: "Labour Type",
  //     //   type: "string"
  //     // },
  //     // JobDesc: {
  //     //   title: "Job Description",
  //     //   type: "string"
  //     // },
  //     NoPositions: {
  //       title: "No Positions",
  //       type: "number"
  //     },
  //     BasicMonthSal: {
  //       title: "Basic Monthly Salary",
  //       type: "number"
  //     },
  //     TotalCostMonthSal: {
  //       title: "Total Cost Of Monthly Salary",
  //       type: "number"
  //     },
  //     AddBenefPerc: {
  //       title: "AddBenefPerc",
  //       type: "string"
  //     },
  //     TotalSalary: {
  //       title: "TotalSalary",
  //       type: "number"
  //     },

  //   }
  // };

  // utilitiesdetail_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     // Year: {
  //     //   title: "Year",
  //     //   type: "string",
  //     // },

  //     // Unit: {
  //     //   title: "Unit",
  //     //   type: "string"
  //     // },
  //     TotalUse: {
  //       title: "Total Use",
  //       type: "string"
  //     },
  //     UnitPrice: {
  //       title: "Unit Price",
  //       type: "number"
  //     },
  //     AnnualCost: {
  //       title: "Annual Cost",
  //       type: "number"
  //     },

  //   }
  // };

  // utilitiesdetail_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     // Year: {
  //     //   title: "Year",
  //     //   type: "string",
  //     // },

  //     TotalUse: {
  //       title: "Total Use",
  //       type: "string"
  //     },
  //     UnitPrice: {
  //       title: "Unit Price",
  //       type: "number"
  //     },
  //     AnnualCost: {
  //       title: "Annual Cost",
  //       type: "number"
  //     },

  //   }
  // };

  // safety_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     // Category: {
  //     //   title: "Category",
  //     //   type: "string",
  //     // },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "number"
  //     },
  //     // QuantityUom: {
  //     //   title: "QuantityUom",
  //     //   type: "string"
  //     // },
  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "number"
  //     },
  //     // SingleCostCurr: {
  //     //   title: "SingleCostCurr",
  //     //   type: "string"
  //     // },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //     // IstfdEstCost: {
  //     //   title: "IstfdEstCost",
  //     //   type: "string"
  //     // },
  //     // IstfdEstCostCurr: {
  //     //   title: "IstfdEstCostCurr",
  //     //   type: "string"
  //     // },

  //   }
  // };

  // safety_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     Category: {
  //       title: "Category",
  //       type: "string",
  //     },
  //     Quantity: {
  //       title: "Quantity",
  //       type: "number"
  //     },
  //     // QuantityUom: {
  //     //   title: "QuantityUom",
  //     //   type: "string"
  //     // },
  //     SingleCost: {
  //       title: "Single Cost",
  //       type: "number"
  //     },
  //     // SingleCostCurr: {
  //     //   title: "SingleCostCurr",
  //     //   type: "string"
  //     // },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //     // IstfdEstCost: {
  //     //   title: "IstfdEstCost",
  //     //   type: "string"
  //     // },
  //     // IstfdEstCostCurr: {
  //     //   title: "IstfdEstCostCurr",
  //     //   type: "string"
  //     // },

  //   }
  // };

  // knowhowag_settings = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "Actions",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //     Purpose: {
  //       title: "Purpose",
  //       type: "string"
  //     }
  //   }
  // };

  // knowhowag_settings_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: " لم يتم العثور على بيانات",

  //   mode: "external",


  //   add: {
  //     addButtonContent: '<i class="nb-plus"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تعديل"></i>',
  //   },
  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: true,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },

  //   columns: {
  //     Description: {
  //       title: "Description",
  //       type: "string",
  //     },
  //     TotalCost: {
  //       title: "Total Cost",
  //       type: "number"
  //     },

  //     Purpose: {
  //       title: "Purpose",
  //       type: "string"
  //     }
  //   }
  // };

  ///on Result
  onResult(result) {

    if (result.MessType === 'E') {
      this.commonService.showFailureToast(result.MessText);
    }
    else if (this.delete_status === 1) {
      this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.ComponentSuccessfullyDeleted'));
      this.delete_status = 0;
    }
    else {
      this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.RecordSuccessfullyCreated'));
    }
  }
  ////costcomp_handle
  costcomp_handle(costcomp) {
    //this.costcomp_array.pop(),

    if (this.costcomp_array.length === 0) {
      var costcomptemp = [];
      costcomptemp.push(costcomp);
      ///  var cost_comp_temp = [];
      // cost_comp_temp.push(costcomp);
      //        if(this.costcomp_array[0] === undefined){
      this.costcomp_array.push(costcomptemp);
      //      } else{
      //      this.costcomp_array.push(costcomp);
      //  }
    }
    else {
      this.costcomp_array[0].pop();
      this.costcomp_array[0].push(costcomp);
    }
  }
  // component_click_pre(target1){
  //     let typsel = this.techOptionSelected;
  //     if (typsel === '' || typsel === 'Choose Component') {
  //       this.commonService.showFailureToast("Please select type");
  //     }
  //     else{
  //       this.Ng4LoadingSpinnerService.show();
  //       this.LoanTechnicalService
  //       .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //       .then((res1) => (this.component_click(target1, res1),
  //         console.log(res1), this.Ng4LoadingSpinnerService.hide()),
  //         err => (this.Ng4LoadingSpinnerService.hide()));
  //     }
  //   }
  // /////Add_click
  onComponentCreateSuccess(res, panel_items_temp) {
    if (res.CostComp && res.CostComp.length > 0 && res.CostComp[+res.CostComp.length - 1].MessType && res.CostComp[+res.CostComp.length - 1].MessType === "S") {
      this.panel_items.push(panel_items_temp);
      var temp_costcomp = _.omit(res.CostComp[0], 'MessText', 'MessType', 'Operation');
      this.costcomp_array_index.push(temp_costcomp);
      this.onAdd(panel_items_temp);
      this.setPanelStep(panel_items_temp.panelStep);
      //this.panel_items.push(panel_items_temp);
    } else {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.ComponentCreationFailed'));
    }
  }
  onisMaintDepAmortCreateSuccess(res, panel_items_temp) {
    if (res.CostComp[0].MessType === "S" && res.CostComp[1].MessType === "S" && res.CostComp[2].MessType === "S" && res.CostComp[3].MessType === "S") {
      this.panel_items.push(panel_items_temp);
      var temp_costcomp = _.omit(res.CostComp[0], 'MessText', 'MessType', 'Operation');
      var temp_costcomp_2 = _.omit(res.CostComp[1], 'MessText', 'MessType', 'Operation');
      var temp_costcomp_3 = _.omit(res.CostComp[2], 'MessText', 'MessType', 'Operation');
      var temp_costcomp_4 = _.omit(res.CostComp[3], 'MessText', 'MessType', 'Operation');
      this.costcomp_array_index.push(temp_costcomp);
      this.costcomp_array_index.push(temp_costcomp_2);
      this.costcomp_array_index.push(temp_costcomp_3);
      this.costcomp_array_index.push(temp_costcomp_4);
      this.onAdd(panel_items_temp);
      this.setPanelStep(panel_items_temp.panelStep);
      //this.panel_items.push(panel_items_temp);
    } else {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.ComponentCreationFailed'));
    }
  }
  calcIndex(post_data) {
    //
    var index_temp = 0;
    if (this.costcomp_array_index && this.costcomp_array_index.length > 0) {
      var index_array = [];
      for (var i = 0; i < this.costcomp_array_index.length; i++) {
        if (this.costcomp_array_index[i].Index) {
          index_array.push((+this.costcomp_array_index[i].Index));
        }
      }
      index_temp = _.max(index_array);
      if (index_temp === -Infinity)
        index_temp = 0;
    }
    var comp_type_code = post_data.CostComp[0].CompType;
    var comp_type_name_object = _.where(this.technical_list_array, { Code: comp_type_code });
    var comp_type_name = "";
    if (comp_type_name_object.length != 0)
      comp_type_name = comp_type_name_object[0].payload_name;
    if (isNaN(index_temp) === false) {
      post_data.CostComp[0]["Index"] = (+index_temp + 1) + "";
      if (comp_type_name != "" && post_data[comp_type_name])
        post_data[comp_type_name][0]["Index"] = (+index_temp + 1) + "";
    }
    //
    return post_data;
  }

  isRaUtMa() {
    var FW_isMain = _.filter(this.costcomp_array_index, function (num) { return num.CompType === "FW" });
    if (FW_isMain.length != 0) {
      //this.createCompRaUtMa();
      return false;
    } else {
      //this.createCompRaUtMa();
      return true;
    }
  }

  createCompRaUtMa(compType) {
    console.log("createCompRaUtMa");
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": [
        {
          "Operation": "C",
          "LoanId": this.loan_id,
          "CompName": "Funded Working Capital",
          "CompType": "FW",
          "CompTotCost": "0.00",
          "CompTotCostCurr": "SAR",
          "IsMain": "X"
        }
      ]

    };

    post_data = this.calcIndex(post_data);
    this.Ng4LoadingSpinnerService.show();
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (
        //this.onAdd(panel_items_temp),
        //this.onComponentCreateSuccess(res, panel_items_temp),
        this.createCompRaUtMaSuccess(res),
        this.createCompRaUtMaCallFun(compType),
        this.Ng4LoadingSpinnerService.hide(),
        err => (this.Ng4LoadingSpinnerService.hide())));
  }

  isClaimsAppendPostData(post_data) {
    if (this.isClaims === 'true') {
      post_data["ForNonEnvisaged"] = "X";
      for (var i = 0; i < post_data["CostComp"].length; i++)
        post_data["CostComp"][i]["IsNonEnvisaged"] = 'X';
      return post_data;
    } else {
      return post_data;
    }
  }

  createCompRaUtMaCallFun(compType) {
    if (compType === "RA")
      this.ra_component_click();
    else if (compType === "UT")
      this.ut_component_click();
    else if (compType === "MA")
      this.ma_component_click();
  }

  createCompRaUtMaSuccess(res) {
    if (res.CostComp && res.CostComp.length != 0 && res.CostComp[+res.CostComp.length - 1].MessType === "S") {
      //this.panel_items.push(panel_items_temp);
      var temp_costcomp = _.omit(res.CostComp[0], 'MessText', 'MessType', 'Operation');
      this.costcomp_array_index.push(temp_costcomp);
      //this.onAdd(panel_items_temp);
      //this.panel_items.push(panel_items_temp);
    } else {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.ComponentCreationFailed'));
    }
  }


  onComponentCreate(CompName, CompType, CompTotCost, panel_items_temp) {

    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": [
        {
          "Operation": "C",
          "LoanId": this.loan_id,
          "CompName": CompName,
          "CompType": CompType,
          "CompTotCost": CompTotCost,
          "CompTotCostCurr": "SAR",
          "IsMain": "X"
        }
      ]

    };

    post_data = this.calcIndex(post_data);
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res),
        //this.onAdd(panel_items_temp),
        this.onComponentCreateSuccess(res, panel_items_temp),
        this.Ng4LoadingSpinnerService.hide(),
        err => (this.Ng4LoadingSpinnerService.hide())));
  }
  component_click(target1) {
    let techInfoModalParams = {};
    let typsel_code = "";
    var post_data;
    var unit0 = this.technical_list_array.find((o) => o.NameAr == this.techOptionSelected||o.Name == this.techOptionSelected);
    //   this.scroll(target1)
    var panel_items_temp = {};
    if (unit0)
      typsel_code = unit0.Code;
    let typsel = this.techOptionSelected;
    if (typsel_code === "") {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent'));
    }
    else if (typsel_code === "ME") {
      console.log(this.machinery_localdatasource_array);
      if (this.machinery_localdatasource_array.length === 0) {
        var component_type = "ME";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.machinery_localdatasource_array.length === 0)
          this.machinery_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.machinery_settings, settings_ar: this.machinery_settings_ar, length: 0,
          componentOperation: "U", localdatasource_index: this.machinery_localdatasource_array.length,
          totalcost: 0, mach_quot_source: source_temp_array,
          panel_comment: this.me_comments
        };
        this.Ng4LoadingSpinnerService.show();
        this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
        //this.onAdd(panel_items_temp);
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "ME" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "VE") {
      console.log(this.vehicle_localdatasource_array);
      if (this.vehicle_localdatasource_array.length === 0) {
        var component_type = "VE";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.vehicle_localdatasource_array.length === 0)
          this.vehicle_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.vehicle_settings_c, length: 0,
          componentOperation: "U", localdatasource_index: this.vehicle_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.ve_comments
        };
        // this.onComponentCreate(CompName, CompType, CompTotCost, panel_items_temp);
        this.Ng4LoadingSpinnerService.show();
        this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
        //this.onAdd(panel_items_temp);
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "VE" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "FU") {
      console.log(this.furniture_localdatasource_array);
      if (this.furniture_localdatasource_array.length === 0) {
        var component_type = "FU";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.furniture_localdatasource_array.length === 0)
          this.furniture_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.furniture_settings_c, length: 0,
          componentOperation: "U", localdatasource_index: this.furniture_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.fu_comments
        };
        //this.onAdd(panel_items_temp);
        this.Ng4LoadingSpinnerService.show();
        this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "FU" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "IT") {
      console.log(this.infotech_localdatasource_array);
      if (this.infotech_localdatasource_array.length === 0) {
        var component_type = "IT";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.infotech_localdatasource_array.length === 0)
          this.infotech_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.infotech_settings_c, length: 0,
          componentOperation: "U", localdatasource_index: this.infotech_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.it_comments
        };
        // this.onAdd(panel_items_temp);
        this.Ng4LoadingSpinnerService.show();
        this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "IT" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "PR") {
      console.log(this.preopercosts_localdatasource_array);
      if (this.preopercosts_localdatasource_array.length === 0) {
        var component_type = "PR";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.preopercosts_localdatasource_array.length === 0)
          this.preopercosts_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.preopercosts_settings_c, length: 0,
          componentOperation: "U", localdatasource_index: this.preopercosts_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.pr_comments
        };
        //this.onAdd(panel_items_temp);
        this.Ng4LoadingSpinnerService.show();
        this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "PR" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "RA") {
      //console.log(this.rawmaterial_localdatasource_array);
      if (this.rawmaterial_localdatasource_array.length === 0) {
        if (this.isRaUtMa() === false) {
          this.ra_component_click();
        } else {
          this.createCompRaUtMa(typsel_code);
        }
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "RA" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "UT") {
      console.log(this.utilitiesdetail_localdatasource_array);
      if (this.utilitiesdetail_localdatasource_array.length === 0) {
        var component_type = "UT";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.utilitiesdetail_localdatasource_array.length === 0)
          if (this.isRaUtMa() === false) {
            this.ut_component_click();
          } else {
            this.createCompRaUtMa(typsel_code);
          }
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "UT" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "SA") {
      console.log(this.safety_localdatasource_array);
      if (this.safety_localdatasource_array.length === 0) {
        var component_type = "SA";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.safety_localdatasource_array.length === 0)
          this.safety_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.safety_settings_c, length: 0,
          componentOperation: "U", localdatasource_index: this.safety_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.sa_comments
        };
        //this.onAdd(panel_items_temp);
        this.Ng4LoadingSpinnerService.show();
        //this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
        //CompName, CompType, CompTotCost, panel_items_temp
        //Safety success call
        var CompName = component_type_fullname;
        var CompType = component_type;
        var CompTotCost = "0.00";
        var panel_items_temp = panel_items_temp;
        var post_data_SA = {
          "LoanId": this.loan_id,
          "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
          "CustomerId": this.CustomerId,
          "ProfileId": this.ProfileId,
          "CostComp": [
            {
              "Operation": "C",
              "LoanId": this.loan_id,
              "CompName": CompName,
              "CompType": CompType,
              "CompTotCost": CompTotCost,
              "CompTotCostCurr": "SAR",
              "IsMain": "X",
              "Index": ""
            }
          ]

        };

        post_data_SA = this.calcIndex(post_data_SA);
        post_data = this.isClaimsAppendPostData(post_data);
        this.LoanTechnicalService.postTechInfoComponent(post_data_SA)
          .then((res) => (this.onResult(res),
            //this.onAdd(panel_items_temp),
            this.onSafetyComponentCreateSuccess(post_data_SA.CostComp[0].Index),
            this.onComponentCreateSuccess(res, panel_items_temp),
            this.Ng4LoadingSpinnerService.hide(),
            err => (this.Ng4LoadingSpinnerService.hide())));
        //
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "SA" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "KN") {
      console.log(this.knowhowag_localdatasource_array);
      if (this.knowhowag_localdatasource_array.length === 0) {
        var component_type = "KN";
        var component_type_fullname = this.find_code_func(component_type);
        var source = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.knowhowag_localdatasource_array.length === 0)
          this.knowhowag_localdatasource_array.push(source);
        panel_items_temp = {
          panelStep: this.panelstepindex,
          typesel: component_type, typeselname: component_type_fullname, method: "views",
          source: source, settings: this.knowhowag_settings_c, length: 0,
          componentOperation: "U", localdatasource_index: this.knowhowag_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.kh_comments
        };
        //this.onAdd(panel_items_temp);
        this.Ng4LoadingSpinnerService.show();
        this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "KN" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "MA") {
      console.log(this.manpower_localdatasource_array);
      if (this.manpower_localdatasource_array.length === 0) {
        var component_type = "MA";
        var component_type_fullname = this.find_code_func(component_type);
        var source1 = new LocalDataSource();
        var source2 = new LocalDataSource();
        this.panelstepindex = this.panelstepindex + 1;
        var source_temp_array = [];
        if (this.manpower_localdatasource_array.length === 0)
          if (this.isRaUtMa() === false) {
            this.ma_component_click();
          } else {
            this.createCompRaUtMa(typsel_code);
          }
      } else {
        console.log(this.panel_items);
        var panel_temp;
        panel_temp = _.where(this.panel_items, { typesel: "MA" });
        this.onAdd(panel_temp[0]);
      }
    } else if (typsel_code === "BC") {
      ////if (this.bcw_localdatasource_array.length === 0 || this.bcw_localdatasource_array[0].data.length === 0) {
      if (this.bcw_localdatasource_array) {
        var hideable_state = true;
        var isCost_value = "";
        var BcwLumpsum_array = [];
        var isBuildings_state = "";
        var isCivil_state = "";
        var comptotcost_temp = "";
        if (this.Bcw_cost_component.length != 0) {
          hideable_state = this.Bcw_cost_component[0].CompTotCost != "" ? false : true;
          isCost_value = hideable_state ? "" : "Yes";
          if (this.Bcw_cost_component[0]["BcwLumpsum"]) {
            BcwLumpsum_array = this.Bcw_cost_component[0]["BcwLumpsum"].split("&");
            isBuildings_state = BcwLumpsum_array[0] === "Y" ? "Yes" : "No";
            isCivil_state = BcwLumpsum_array[1] === "Y" ? "Yes" : "No";
          }
          comptotcost_temp = this.Bcw_cost_component[0].CompTotCost;
        }
        techInfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),
          isBcw: "Y",
          inputs: [
            {
              id: "isCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.IsthereanycostforBuildingandCivilWorks'),
              type: "select",
              selected: isCost_value,
              value: this.yes_or_no,
              required: "true",
              // type2 : "view"
            },
            {
              id: "TotalProjectCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.ProvideTotalProjectCost'),
              type: "text",
              value: comptotcost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
              hideable: hideable_state
            },
            {
              id: "isbuilding",
              name: this.translate.instant('TECHNICAL_INFORMATION.Isthereanybuildingitems'),
              type: "select",
              selected: isBuildings_state,
              value: this.yes_or_no,
              required: "true",
              hideable: hideable_state
            },
            {
              id: "iscivil",
              name: this.translate.instant('TECHNICAL_INFORMATION.Isthereanycivilitems'),
              type: "select",
              selected: isCivil_state,
              value: this.yes_or_no,
              required: "true",
              hideable: hideable_state
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.create'),
              type: "Submit",
              class: "btn-success",
              trueName: "CreateBCW",

              handler: (modal_data) => {
                // this.Ng4LoadingSpinnerService.show();
                // this.LoanTechnicalService
                //   .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
                //   .then((res1) => (this.component_click_ME(res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
                //     err => (this.Ng4LoadingSpinnerService.hide()));
                console.log("BC");
                console.log(this.Bcw_cost_component);
                //  if()

                // if()
                var component_type = "BC";
                var component_type_fullname = this.find_code_func(component_type);
                var source1 = new LocalDataSource();
                var source2 = new LocalDataSource();
                //    this.panelstepindex = this.panelstepindex + 1;
                var source_temp_array = [];
                if (this.bcw_localdatasource_array.length === 0)
                  this.bcw_localdatasource_array.push(source1);
                var Bcw_GuiId_temp = this.commonService.returnRandomNumber();
                if (this.bcw_localdatasource_array[0]) {
                  if (modal_data.inputs[0].selected === "No") {
                    // panel_items_temp = {
                    //   panelStep: this.panelstepindex, isCost: "N",
                    //   typesel: component_type, typeselname: component_type_fullname, method: "views",
                    //   source1: source1, source2: source2, settings: this.bcw_settings, settings2: this.bcw_C_settings, settings_ar: this.bcw_settings_ar, length: 0,
                    //   componentOperation: "U", localdatasource_index: this.bcw_localdatasource_array.length,
                    //   totalcost: 0, totalcost2: (+modal_data.inputs[1].value),
                    //   panel_comment: this.bcw_comments
                    // };
                    // var post_data2;

                    // if (_.isEmpty((this.Bcw_cost_component))) {
                    //   post_data2 = {
                    //     "LoanId": this.loan_id,
                    //     "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                    //     "CustomerId": this.CustomerId,
                    //     "ProfileId": this.ProfileId,
                    //     "CostComp": [
                    //       {
                    //         "Operation": "C",
                    //         "LoanId": this.loan_id,
                    //         "CompName": component_type_fullname,
                    //         "CompType": component_type,
                    //         "CompTotCost": "0.00",
                    //         "CompTotCostCurr": "SAR",
                    //         "IsMain": "X",
                    //         "BcwLumpsum": "",
                    //         "GuiId": Bcw_GuiId_temp
                    //       }
                    //     ]

                    //   };


                    // }
                    // else {
                    //   post_data2 = {
                    //     "LoanId": this.loan_id,
                    //     "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                    //     "CustomerId": this.CustomerId,
                    //     "ProfileId": this.ProfileId,
                    //     "CostComp": [
                    //       {
                    //         "Operation": "U",
                    //         "LoanId": this.loan_id,
                    //         "CompName": component_type_fullname,
                    //         "CompType": component_type,
                    //         "CompTotCost": "0.00",
                    //         "CompTotCostCurr": "SAR",
                    //         "IsMain": "X",
                    //         "BcwLumpsum": "",
                    //         "GuiId": Bcw_GuiId_temp,
                    //         "ComponentId": this.Bcw_cost_component[0]["ComponentId"],
                    //         "WbsId": this.Bcw_cost_component[0]["WbsId"]
                    //       }
                    //     ]

                    //   };
                    // }
                    // //12345
                    // var err_temp;
                    // this.Ng4LoadingSpinnerService.show();
                    // this.LoanTechnicalService.postTechInfoComponent(post_data2)
                    //   .then((res) => (this.onResult(res),
                    //     //  this.panel_items.push(panel_items_temp),
                    //     this.bcwComponentChangeType(panel_items_temp),
                    //     this.Ng4LoadingSpinnerService.hide(),
                    //     this.scroll(target1),
                    //     this.setPanelStep(this.panelstepindex),
                    //     this.Bcw_created = 1,
                    //     // this.LoanTechnicalService
                    //     // .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
                    //     // .then((res) => (this.items_refresh(),
                    //     // this.resolveTechnicalInfo(res),
                    //     //   this.Ng4LoadingSpinnerService.hide()), err => (
                    //     //     err_temp = err)
                    //     // ),
                    //     err => (this.Ng4LoadingSpinnerService.hide())));
                    // //this.panel_items.push(panel_items_temp);
                  }
                  else if (modal_data.inputs[0].selected === "Yes") {
                    var source3 = new LocalDataSource;
                    panel_items_temp = {
                      panelStep: this.panelstepindex, isCost: "Y",
                      typesel: component_type, typeselname: component_type_fullname, method: "views",
                      source1: source1, source2: source2, settings: this.bcw_settings_c, settings2: this.bcw_C_settings_c,
                      //settings_ar: this.bcw_settings_c, settings2_ar: this.bcw_settings_c, 
                      length: 0,
                      componentOperation: "U", localdatasource_index: this.bcw_localdatasource_array.length,
                      totalcost: this.commonService.numberToNumberWithCommas((+modal_data.inputs[1].value)), totalcost2: (+modal_data.inputs[1].value),
                      panel_comment: this.bcw_comments, source3: source3, building_state: modal_data.inputs[2].selected,
                      civil_state: modal_data.inputs[3].selected
                    };
                    var isBuilding = modal_data.inputs[2].selected === "Yes" ? "Y" : "N";
                    var isCivil = modal_data.inputs[3].selected === "Yes" ? "Y" : "N";
                    var isBuildingCivil = isBuilding + "&" + isCivil;
                    var post_data3;
                    if (_.isEmpty((this.Bcw_cost_component))) {
                      post_data3 = {
                        "LoanId": this.loan_id,
                        "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                        "CustomerId": this.CustomerId,
                        "ProfileId": this.ProfileId,
                        "CostComp": [
                          {
                            "Operation": "C",
                            "LoanId": this.loan_id,
                            "CompName": component_type_fullname,
                            "CompType": component_type,
                            "CompTotCost": modal_data.inputs[1].value,
                            "CompTotCostCurr": "SAR",
                            "IsMain": "X",
                            "BcwLumpsum": isBuildingCivil,
                            "GuiId": Bcw_GuiId_temp
                          }
                        ]

                      };
                      var index_temp = 0;
                      if (this.costcomp_array_index && this.costcomp_array_index.length > 0) {
                        var index_array = [];
                        for (var i = 0; i < this.costcomp_array_index.length; i++) {
                          if (this.costcomp_array_index[i].Index) {
                            index_array.push((+this.costcomp_array_index[i].Index));
                          }
                        }
                        index_temp = _.max(index_array);
                      }
                      var comp_type_code = post_data3.CostComp[0].CompType;
                      var comp_type_name_object = _.where(this.technical_list_array, { Code: comp_type_code });
                      var comp_type_name = comp_type_name_object[0].payload_name;
                      if (isNaN(index_temp) === false) {
                        post_data3.CostComp[0]["Index"] = (+index_temp + 1) + "";
                        // post_data.comp_type_name[0]["Index"] = (+index_temp + 1) + "";
                      }

                    } else {
                      post_data3 = {
                        "LoanId": this.loan_id,
                        "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                        "CustomerId": this.CustomerId,
                        "ProfileId": this.ProfileId,
                        "CostComp": [
                          {
                            "Operation": "U",
                            "LoanId": this.loan_id,
                            "CompName": component_type_fullname,
                            "CompType": component_type,
                            "CompTotCost": modal_data.inputs[1].value,
                            "CompTotCostCurr": "SAR",
                            "IsMain": "X",
                            "BcwLumpsum": isBuildingCivil,
                            "GuiId": Bcw_GuiId_temp,
                            "ComponentId": this.Bcw_cost_component[0]["ComponentId"],
                            "WbsId": this.Bcw_cost_component[0]["WbsId"]
                          }
                        ]

                      };
                      post_data3.CostComp[0]["Index"] = (+this.Bcw_cost_component[0]["Index"]) + "";
                    }
                    //


                    //
                    post_data3 = this.isClaimsAppendPostData(post_data3);
                    this.Ng4LoadingSpinnerService.show();
                    this.LoanTechnicalService.postTechInfoComponent(post_data3)
                      .then((res) => (this.onResult(res),
                        this.Bcw_GuiId = Bcw_GuiId_temp,
                        // this.panel_items.push(panel_items_temp),
                        this.bcwComponentChangeType(panel_items_temp),
                        this.Ng4LoadingSpinnerService.hide(),
                        // this.LoanTechnicalService
                        // .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
                        // .then((res) => (this.items_refresh(),
                        // res.Bcw = [],
                        // this.resolveTechnicalInfo(res),
                        //   this.Ng4LoadingSpinnerService.hide()), err => (
                        //     err_temp = err)
                        // ),
                        //this.scroll(target1),
                        err => (this.Ng4LoadingSpinnerService.hide())));
                    // this.panel_items.push(panel_items_temp);
                  }
                } else {
                  this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.AlreadyAdded'));
                }
                //this.onAdd(panel_items_temp);

              }
            }
          ]
        };
        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
      }
      else {
        //ScrollTo
        console.log(target1);
        this.scroll(target1);
      }
    }

  }

  ra_component_click() {
    console.log(this.rawmaterial_localdatasource_array);
    if (this.rawmaterial_localdatasource_array.length === 0) {
      var component_type = "RA";
      var component_type_fullname = this.find_code_func(component_type);
      var source = new LocalDataSource();
      this.panelstepindex = this.panelstepindex + 1;
      var source_temp_array = [];
      if (this.rawmaterial_localdatasource_array.length === 0)
        this.rawmaterial_localdatasource_array.push(source);
      var panel_items_temp = {
        panelStep: this.panelstepindex,
        typesel: component_type, typeselname: component_type_fullname, method: "views",
        source: source, settings: this.rawmaterial_settings_c, length: 0,
        componentOperation: "U", localdatasource_index: this.rawmaterial_localdatasource_array.length,
        totalcost: 0,
        panel_comment: this.ra_comments
      };
      // this.onAdd(panel_items_temp);
      this.Ng4LoadingSpinnerService.show();
      //this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
      var CompName = component_type_fullname;
      var CompType = component_type;
      var CompTotCost = "0.00";
      var panel_items_temp = panel_items_temp;
      var post_data_RA = {
        "LoanId": this.loan_id,
        "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
        "CustomerId": this.CustomerId,
        "ProfileId": this.ProfileId,
        "CostComp": [
          {
            "Operation": "C",
            "LoanId": this.loan_id,
            "CompName": CompName,
            "CompType": CompType,
            "CompTotCost": CompTotCost,
            "CompTotCostCurr": "SAR",
            "IsMain": "X",
            "Index": ""
          }
        ]

      };

      post_data_RA = this.calcIndex(post_data_RA);
      if (this.isMaintDepAmort())
        post_data_RA = this.appendMaintDepAmort(post_data_RA);
      post_data_RA = this.isClaimsAppendPostData(post_data_RA);
      this.LoanTechnicalService.postTechInfoComponent(post_data_RA)
        .then((res) => (this.onResult(res),
          //this.onAdd(panel_items_temp),
          // this.onComponentCreateSuccess(res, panel_items_temp),
          //this.isRaUtMa(),
          this.isMaintDepAmort() ? this.onisMaintDepAmortCreateSuccess(res, panel_items_temp) : this.onComponentCreateSuccess(res, panel_items_temp),
          //this.onSafetyComponentCreateSuccess(post_data_RA.CostComp[0].Index),
          this.Ng4LoadingSpinnerService.hide(),
          err => (this.Ng4LoadingSpinnerService.hide())));
      //
    }
  }

  ut_component_click() {
    console.log(this.utilitiesdetail_localdatasource_array);
    if (this.utilitiesdetail_localdatasource_array.length === 0) {
      var component_type = "UT";
      var component_type_fullname = this.find_code_func(component_type);
      var source = new LocalDataSource();
      this.panelstepindex = this.panelstepindex + 1;
      var source_temp_array = [];
      if (this.utilitiesdetail_localdatasource_array.length === 0)
        this.utilitiesdetail_localdatasource_array.push(source);
      var panel_items_temp = {
        panelStep: this.panelstepindex,
        typesel: component_type, typeselname: component_type_fullname, method: "views",
        source: source, settings: this.utilitiesdetail_settings_c, length: 0,
        componentOperation: "U", localdatasource_index: this.utilitiesdetail_localdatasource_array.length,
        totalcost: 0,
        panel_comment: this.ut_comments
      };
      //this.onAdd(panel_items_temp);
      this.Ng4LoadingSpinnerService.show();
      //this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);
      var CompName = component_type_fullname;
      var CompType = component_type;
      var CompTotCost = "0.00";
      var panel_items_temp = panel_items_temp;
      var post_data_UT = {
        "LoanId": this.loan_id,
        "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
        "CustomerId": this.CustomerId,
        "ProfileId": this.ProfileId,
        "CostComp": [
          {
            "Operation": "C",
            "LoanId": this.loan_id,
            "CompName": CompName,
            "CompType": CompType,
            "CompTotCost": CompTotCost,
            "CompTotCostCurr": "SAR",
            "IsMain": "X",
            "Index": ""
          }
        ]

      };

      post_data_UT = this.calcIndex(post_data_UT);
      if (this.isMaintDepAmort())
        post_data_UT = this.appendMaintDepAmort(post_data_UT);
      post_data_UT = this.isClaimsAppendPostData(post_data_UT);
      this.LoanTechnicalService.postTechInfoComponent(post_data_UT)
        .then((res) => (this.onResult(res),
          //this.onAdd(panel_items_temp),
          //this.onComponentCreateSuccess(res, panel_items_temp),
          //this.isRaUtMa(),
          this.isMaintDepAmort() ? this.onisMaintDepAmortCreateSuccess(res, panel_items_temp) : this.onComponentCreateSuccess(res, panel_items_temp),
          // this.onSafetyComponentCreateSuccess(post_data_UT.CostComp[0].Index),
          this.Ng4LoadingSpinnerService.hide(),
          err => (this.Ng4LoadingSpinnerService.hide())));
    }
  }

  ma_component_click() {
    console.log(this.manpower_localdatasource_array);
    if (this.manpower_localdatasource_array.length === 0) {
      var component_type = "MA";
      var component_type_fullname = this.find_code_func(component_type);
      var source1 = new LocalDataSource();
      var source2 = new LocalDataSource();
      this.panelstepindex = this.panelstepindex + 1;
      var source_temp_array = [];
      if (this.manpower_localdatasource_array.length === 0)
        this.manpower_localdatasource_array.push(source1);
      var panel_items_temp = {
        panelStep: this.panelstepindex,
        typesel: component_type, typeselname: component_type_fullname, method: "views",
        source1: source1, source2: source2, settings: this.manpower_settings_c, length: 0,
        componentOperation: "U", localdatasource_index: this.manpower_localdatasource_array.length,
        totalcost: 0,
        panel_comment: this.ma_comments
      };
      //this.onAdd(panel_items_temp);
      ////this.onComponentCreate(component_type_fullname, component_type, "0.00", panel_items_temp);

      var post_data2 = {
        "LoanId": this.loan_id,
        "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
        "CustomerId": this.CustomerId,
        "ProfileId": this.ProfileId,
        "CostComp": [
          {
            "Operation": "C",
            "LoanId": this.loan_id,
            "CompName": component_type_fullname,
            "CompType": component_type,
            "CompTotCost": "0.00",
            "CompTotCostCurr": "SAR",
            "IsMain": "X"
          }
        ]

      };
      //
      var index_temp = 0;
      if (this.costcomp_array_index && this.costcomp_array_index.length > 0) {
        var index_array = [];
        for (var i = 0; i < this.costcomp_array_index.length; i++) {
          if (this.costcomp_array_index[i].Index) {
            index_array.push((+this.costcomp_array_index[i].Index));
          }
        }
        index_temp = _.max(index_array);
      }
      var comp_type_code = post_data2.CostComp[0].CompType;
      var comp_type_name_object = _.where(this.technical_list_array, { Code: comp_type_code });
      var comp_type_name = comp_type_name_object[0].payload_name;
      if (isNaN(index_temp) === false) {
        post_data2.CostComp[0]["Index"] = (+index_temp + 1) + "";
        // post_data.comp_type_name[0]["Index"] = (+index_temp + 1) + "";
      }
      //var flag_isMaintDepAmort
      if (this.isMaintDepAmort()) {
        post_data2 = this.appendMaintDepAmort(post_data2);
      }
      this.Ng4LoadingSpinnerService.show();
      post_data2 = this.isClaimsAppendPostData(post_data2);
      this.LoanTechnicalService.postTechInfoComponent(post_data2)
        .then((res) => (this.onResult(res),
          //this.panel_items.push(panel_items_temp),
          // this.onComponentCreateSuccess(res, panel_items_temp),
          //this.isRaUtMa(),
          this.isMaintDepAmort() ? this.onisMaintDepAmortCreateSuccess(res, panel_items_temp) : this.onComponentCreateSuccess(res, panel_items_temp),
          this.Ng4LoadingSpinnerService.hide(),
          //   this.onAdd(panel_items_temp),
          err => (this.Ng4LoadingSpinnerService.hide())));
    }
  }

  isMaintDepAmort() {
    var MaDeAm_isMain = _.filter(this.costcomp_array_index, function (num) { return (num.CompType === "MT" || num.CompType === "DE" || num.CompType === "AM") });
    if (MaDeAm_isMain.length != 0) {
      return false;
    } else {
      return true;
    }
  }

  appendMaintDepAmort(post_data) {
    var index = post_data["CostComp"][0]["Index"];
    post_data["CostComp"].push({
      "CompName": "Maintenance",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "CompType": "MT",
      "Index": (+index + 1) + "",
      "LoanId": this.loan_id,
      "Operation": "C",
      "IsMain": "X"
    });
    post_data["CostComp"].push({
      "CompName": "Depreciation",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "CompType": "DE",
      "Index": (+index + 2) + "",
      "LoanId": this.loan_id,
      "Operation": "C",
      "IsMain": "X"
    });
    post_data["CostComp"].push({
      "CompName": "Amortization",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "CompType": "AM",
      "Index": (+index + 3) + "",
      "LoanId": this.loan_id,
      "Operation": "C",
      "IsMain": "X"
    });
    return post_data;
  }

  onSafetyComponentCreateSuccess(index) {
    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": "Firefighting Systems",
      "CompType": "SA",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "Index": +index + 1
    },
    {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": "Fire Extinguishers",
      "CompType": "SA",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "Index": +index + 2
    },
    {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": "Fire Alarm and Detection System",
      "CompType": "SA",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "Index": +index + 3
    },
    {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": "Personnel Protection Equipment",
      "CompType": "SA",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "Index": +index + 4
    },
    {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": "Others",
      "CompType": "SA",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR",
      "Index": +index + 5
    }

    ];
    var data_temp = [{
      "Category": "FFS",
      "Description": "Firefighting Systems",
      "TotalCost": "0.00 ",
      "TotalCostCurr": "SAR",
      "Index": +index + 1,
      "IsFromSafety": "X",
      "Operation": "C"
    },
    {
      "Category": "FEX",
      "Description": "Fire Extinguishers",
      "TotalCost": "0.00 ",
      "TotalCostCurr": "SAR",
      "Index": +index + 2,
      "IsFromSafety": "X",
      "Operation": "C"
    },
    {
      "Category": "FAD",
      "Description": "Fire Alarm and Detection System",
      "TotalCost": "0.00 ",
      "TotalCostCurr": "SAR",
      "Index": +index + 3,
      "IsFromSafety": "X",
      "Operation": "C"
    },
    {
      "Category": "PPE",
      "Description": "Personnel Protection Equipment",
      "TotalCost": "0.00 ",
      "TotalCostCurr": "SAR",
      "Index": +index + 4,
      "IsFromSafety": "X",
      "Operation": "C"
    },
    {
      "Category": "OTH",
      "Description": "Others",
      "TotalCost": "0.00 ",
      "TotalCostCurr": "SAR",
      "Index": +index + 5,
      "IsFromSafety": "X",
      "Operation": "C"
    }
    ];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Safety": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    //post_data = this.calcIndex(post_data);
    console.log(post_data);
    // this.onSave(post_data, item.panelStep);

    var err_temp;
    var comp_type_temp = post_data.CostComp[0]["CompType"];
    if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined) {
      post_data = this.isClaimsAppendPostData(post_data);
      this.LoanTechnicalService.postTechInfoComponent(post_data)
        .then((res) => (this.Ng4LoadingSpinnerService.hide()
          //  this.onResult(res),
          //  this.items_refresh(),
          //  this.LoanTechnicalService
          //    .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
          //    .then((res) => (
          //      //this.resolveTechnicalInfo(res),
          //      //this.scrollControl(res, post_data, comp_type_temp),
          //    //  this.Ng4LoadingSpinnerService.hide()
          //      //this.setPanelStep(panelStepIndex)
          //    ), err => (
          //      err_temp = err)
          
        ),
          err => (this.Ng4LoadingSpinnerService.hide()));
    }

  }

  bcwComponentChangeType(panel_temp) {
    // if (this.bcw_localdatasource_array.length != 0) {
    //   if (this.bcw_localdatasource_array[0].data.length === 0) {
    //     this.Ng4LoadingSpinnerService.show();
    if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
      this.LoanTechnicalService
        .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
        .then((res1) => (
          //this.Bcw_created = 0,
          this.items_refresh(),
          this.resolveTechnicalInfo(res1),
          this.scrollControl("", "", "BC"),
          //this.Bcw_created = 1,
          // panel_temp.panelStep = +this.panelstepindex + 1,
          //this.panelstepindex = this.panelstepindex + 1;
          //this.panel_items.push(panel_temp),
          //this.setPanelStep(+this.panelstepindex + 1),

          this.Ng4LoadingSpinnerService.hide()
        ),
          err => (this.Ng4LoadingSpinnerService.hide(), this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Failed'))));

    //   }
    //   else {
    //     panel_temp.panelStep = +panel_temp.panelStep + 1;
    //     this.panel_items.push(panel_temp);
    //   }
    // }
  }
  // component_click_2(target1) {
  //   let techInfoModalParams = {};
  //   let typsel_code = "";
  //   var unit0 = this.technical_list_array.find((o) => o.Name == this.techOptionSelected);
  //   if (unit0)
  //     typsel_code = unit0.Code;

  //   // if(this.techOptionSelected  === )
  //   let typsel = this.techOptionSelected;
  //   // if (typsel === ''|| typsel === 'Maintenance') {
  //   //   this.commonService.showFailureToast("Please select type");
  //   // }
  //   // else {

  //   if (typsel == "Machinery and Equipments" || typsel_code === "ME") {
  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "select",
  //           selected: "",
  //           value: this.machinery_comp_type_desc,
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_ME(res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));

  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Building and Civil Works' || typsel_code === "BC") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_BC(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Vehicles' || typsel_code === "VE") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_VE(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Furnitures' || typsel_code === "FU") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             //this.Ng4LoadingSpinnerService.show();
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_FU(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));

  //             //
  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Information Technology' || typsel === 'Info Tech' || typsel_code === "IT") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_IT(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Pre Operational Costs' || typsel_code === "PR") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_PR(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Raw Materials' || typsel_code === "RA") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_RA(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //             //
  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Man Power' || typsel_code === "MA") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),
  //       manpower: "Note",

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "select",
  //           selected: "",
  //           value: this.labour_type_desc,
  //           required: "true",
  //         },
  //         // {
  //         //   id: "componentName",
  //         //   name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //         //   type: "text",
  //         //   value: "",
  //         //   required: "true",
  //         // }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_MA(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Utilities' || typsel_code === "UT") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {

  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_UT(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));

  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Safety' || typsel_code === "SA") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_SA(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));

  //             //
  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   }
  //   else if (typsel === 'Know How Agreements' || typsel_code === "KN") {

  //     techInfoModalParams = {

  //       header: this.translate.instant('TECHNICAL_INFORMATION.AddComponent'),

  //       inputs: [
  //         {
  //           id: "componentType",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.Type'),
  //           type: "text_disabled",
  //           value: typsel,
  //           required: "true",
  //           // type2 : "view"
  //         },
  //         {
  //           id: "componentName",
  //           name: this.translate.instant('TECHNICAL_INFORMATION.name'),
  //           type: "text",
  //           value: "",
  //           required: "true",
  //         }
  //       ],
  //       buttons: [
  //         {
  //           name: this.translate.instant('TECHNICAL_INFORMATION.create'),
  //           type: "Submit",
  //           class: "btn-success",

  //           handler: (modal_data) => {
  //             this.Ng4LoadingSpinnerService.show();
  //             if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
  //               this.LoanTechnicalService
  //                 .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //                 .then((res1) => (this.component_click_KN(modal_data, res1, typsel, typsel_code, target1), this.onResTechInfoPer(res1)),
  //                   err => (this.Ng4LoadingSpinnerService.hide()));


  //           }
  //         }
  //       ]
  //     };
  //     let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //     techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //     this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
  //   } else if (typsel === '' || typsel === 'Choose Component') {
  //     this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Pleaseselecttype') + "!");
  //   }
  //   else {
  //     this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Invalidtype') + "!");
  //     this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
  //   }
  //   this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
  //   // let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
  //   // techInfoModal.componentInstance.techInfoModalsForm = techInfoModalParams;
  //   //this.techInfoModalParams_g = techInfoModalParams;
  // }
  //panel click
  // panel_click() {
  //   //console.log("adfsdfs");
  // }
  //onDeleteComponent
  onDeleteComponent(item, delete_cancel_modal) {
    let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
    delete options.size;
    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal, options);
    this.deleteCancelModalReference.event = event;
    this.deleteCancelModalReference.table_name = "Component";
    this.deleteCancelModalReference.table_name_display = item.uniqname;
    this.deleteCancelModalReference.item = item;
    this.deleteCancelModalReference.action = "Delete";
    this.delete_status = 1;
    this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
    // console.log(item);
    // var flag = 0;
    // for(var i=0; i<this.costcomp_array[0].length; i++){
    //   if(item.wbsid === this.costcomp_array[0][i].WbsId){
    //     this.costcomp_array[0][i].Operation = "D";
    //     flag=1;
    //   }
    // }
    // if(flag === 1)
    //   this.onSave();
  }
  //onAdd(table_name)
  uploadDocumentFunction(file, data) {
    var temp;
    this.communicationsService.uploadDocumentService(file, data)
      .then(requests => (
        (
          temp = this.onDocumentUpload(requests),
          this.Ng4LoadingSpinnerService.hide()
          //  this.machinery_add(item, requests, modal_data, upload_post, rand_num),
          //  this.Ng4LoadingSpinnerService.hide()
        ), err => (this.commonService.showFailureToast(this.translate.instant('COMMON.DocumentSubmissionFailed')),
          this.Ng4LoadingSpinnerService.hide())));
    return temp;
  }

  clearData(modal_data) {
    if (modal_data.inputs != undefined) {
      modal_data.inputs[1].value = "";
      modal_data.inputs[2].selected = "";
      modal_data.inputs[3].value = "";
      modal_data.inputs[4].selected = "";
      modal_data.inputs[5].value = "";
      modal_data.inputs[6].value = "";
      modal_data.inputs[7].value = "";
      modal_data.inputs[8].value = "";
      modal_data.inputs[9].value = "";

    }
  }

  removeDisabled(modal_data) {
    if (modal_data.inputs != undefined) {
      modal_data.inputs[1].type = "text";
      modal_data.inputs[2].type = "select";
      modal_data.inputs[2].value = this.CountryDD_desc;
      modal_data.inputs[3].type = "number";
      modal_data.inputs[4].type = "select";
      modal_data.inputs[4].value = this.uom_text;
      modal_data.inputs[5].type = "text";
      modal_data.inputs[6].type = "text";
      //modal_data.inputs[7].type = "text";
      modal_data.inputs[7].disabled = "false";
      modal_data.inputs[8].disabled = "false";
      modal_data.inputs[9].disabled = "false";
    }
  }

  find_code_func(search_name) {
    var unit1 = this.technical_list_array.find((o) => o.Code == search_name);
    if (unit1)
      return (this.lang=='en'?unit1.Name:unit1.NameAr);
  }


  onQuotAdd(item, event2) {
    console.log("Quotation Add");
    if (this.isClaimsCompQuotation(event)) {
      //console.log("Quot add");
      let technicaltableinfoModalParams = {};
      // let machinery_quotation_localdatasource_delete_array = []
      let temp_source = new LocalDataSource;
      if (event2.data.CompQuot != undefined) {

        for (var i = 0; i < event2.data.CompQuot.length; i++) {
          if (event2.data.CompQuot[i].Operation != "D") {
            //  if(temp_source.data.length == 0){
            temp_source.data.push(event2.data.CompQuot[i]);
            //  }
          }
        }
      }

      technicaltableinfoModalParams = {

        header: "Add Competitive Quotation",
        headerAr: this.translate.instant('TECHNICAL_INFORMATION.AddQuotation'),
        documentjson: this.documentStructure,
        requestId: this.requestId,
        event: event2,
        uom_text: this.uom_text,
        spinner_status: false,
        CountryDD_desc: this.CountryDD_desc,

        tables: [
          {
            heading: this.translate.instant('TECHNICAL_INFORMATION.QuotationsList'),
            settings: this.machinery_quotation_settings_c,
            settings_ar: this.machinery_quotation_settings_c,
            source: temp_source,
            required: "true"
          }
        ],

        inputs: [
          {
            id: "MachineName",
            name: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
            type: "text_disabled",
            value: event2.data.MachineName,
            required: "true",
          },
          {
            id: "Manufacturer",
            name: this.translate.instant('TECHNICAL_INFORMATION.Manufacturer'),
            type: "text",
            value: "",
            required: "true",
          },
          {
            id: "OriginCountry",
            name: this.translate.instant('TECHNICAL_INFORMATION.OriginCountry'),
            type: "select",
            selected: "",
            value: this.CountryDD_desc,
            required: "true",
          },
          {
            id: "Capacity",
            name: this.translate.instant('TECHNICAL_INFORMATION.Capacity'),
            type: "number",
            value: "",
            required: "false",
          },
          {
            id: "CapacityUOM",
            name: this.translate.instant('TECHNICAL_INFORMATION.CapacityUOM'),
            type: "select",
            selected: "",
            value: this.uom_text,
            required: "true",
          },
          {
            id: "TotalCost",
            name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
            type: "text",
            value: "",
            required: "true",
            cost: "true",
            currency: "SAR ",
          },

          {
            id: "CostIndex",
            name: this.translate.instant('TECHNICAL_INFORMATION.CostIndex'),
            type: "text",
            value: "",
            required: "true",
          },
          // {
          //   id: "SelectedStat",
          //   name: "Selected Stat",
          //   type: "text",
          //   value: "",
          //   required: "true",
          // },
          {
            id: "attachment1",
            name: this.translate.instant('TECHNICAL_INFORMATION.attachmentQuot') + "1",
            type: "file_multiple",
            file: "",
            required: "true",
            visible: true,
            value: "",
            disabled: "false"
          },
          {
            id: "attachment2",
            name: this.translate.instant('TECHNICAL_INFORMATION.attachmentQuot') + "2",
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: "",
            disabled: "false"
          },
          {
            id: "attachment3",
            name: this.translate.instant('TECHNICAL_INFORMATION.attachmentQuot') + "2",
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: "",
            disabled: "false"
          }
        ],
        buttons: [
          {
            //Add
            name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
            //name: "Save",
            type: "Submit",
            class: "btn-success",
            state: "null",
            event: "",
            true_name: "Add",



            handler: (modal_data) => {
              if (modal_data.inputs[7].file.length > 0) {
                this.Ng4LoadingSpinnerService.show();
                var rand_num = this.commonService.returnRandomNumber();
                var upload_post = "";
                var data = {
                  documentDefId: 391,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };

                if (modal_data.inputs[7].file.length > 0)
                  this.uploadDocumentFunction(modal_data.inputs[7].file, data);
                if (modal_data.inputs[8].file.length > 0)
                  this.uploadDocumentFunction(modal_data.inputs[8].file, data);
                if (modal_data.inputs[9].file.length > 0)
                  this.uploadDocumentFunction(modal_data.inputs[9].file, data);
                // this.communicationsService.uploadDocumentService(modal_data.inputs[8].file, data)
                //   .then(requests => (
                //     upload_post = this.onDocumentUpload(requests),
                this.quotation_add(item, modal_data, rand_num, temp_source);
                //     this.Ng4LoadingSpinnerService.hide()
                //   ), err => (this.Ng4LoadingSpinnerService.hide()));


              }
              else {
                this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.DataAlreadySaved') + "!");
              }

            }
          },
          //Edit
          {
            name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
            // name: "Save",
            type: "Submit",
            class: "btn-success",
            state: "disabled",
            event_old: "",
            true_name: "Edit",

            handler: (modal_data, eventofclick, documents_length) => {
              if (modal_data.inputs[7].file.length > 0 || modal_data.inputs[8].file.length > 0 || modal_data.inputs[9].file.length > 0) {
                this.Ng4LoadingSpinnerService.show();

                //    this.clearData(modal_data);
                //    this.removeDisabled(modal_data);
                // machQuotModalsForm.tables[event.index].source.update(event.data, technicaltableinfoModalParams.inputs);
                var upload_post = "";
                var data = {
                  documentDefId: 391,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: eventofclick.data.GuiId,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[7].file.length > 0)
                  this.uploadDocumentFunction(modal_data.inputs[7].file, data);
                if (modal_data.inputs[8].file.length > 0)
                  this.uploadDocumentFunction(modal_data.inputs[8].file, data);
                if (modal_data.inputs[9].file.length > 0)
                  this.uploadDocumentFunction(modal_data.inputs[9].file, data);

                // this.communicationsService.uploadDocumentService(modal_data.inputs[8].file, data)
                //   .then(requests => (
                //     (
                //       upload_post = this.onDocumentUpload(requests),
                this.quotation_edit(item, modal_data, upload_post, event, eventofclick, temp_source);
                //       this.Ng4LoadingSpinnerService.hide()


                //     ), err => (this.Ng4LoadingSpinnerService.hide())));
              }
              else {
                this.quotation_edit(item, modal_data, upload_post, event, eventofclick, temp_source);
              }

            }
          },
          {
            name: this.translate.instant('TECHNICAL_INFORMATION.Submit'),
            //name: "Save",
            type: "Submit",
            class: "btn-success",
            state: "disabled",
            event_old: "",
            true_name: "Submit",

            handler: (modal_data) => {

              console.log("On Quot Add");

              var temp_data_array = [];
              var quot_array = [];
              // temp_data_array.push(modal_data.event.data);
              // quot_array = event2.data;
              // temp_data_array[0]["CompQuot"] = quot_array;
              // var temp_quot_array = modal_data.tables
              //     let machinery_quotation_source2 = [];
              //     //this.machinery_localdatasource_array[item.localdatasource_index - 1]["CompQuot"] = item.mach_quot_source.data;
              //     //item.mach_quot_source = item.mach_quot_source.data[item.localdatasource_index - 1];
              //     // console.log(event2);
              //     //console.log(this.panel_items[item.localdatasource_index]);
              //     //console.log(item.mach_quot_source);
              //     machinery_quotation_source2.push(event2.data);


              //     // if(machinery_quotation_source2[0]["CompQuot"] === undefined  || machinery_quotation_source2[0]["CompQuot"] === null)
              //     // machinery_quotation_source2[0]["CompQuot"] 
              //     //item.mach_quot_source.dat

              //     //for(var i=0; i<temp_source[item.length-1].data.length; i++){
              //     ///temp_source.data[i]["MachineId"] = event2.data.MachineId;
              //     //}

              //     machinery_quotation_source2[0]["CompQuot"] = temp_source.data;

              //     //machinery_quotation_source2[0]["CompQuot"] = item.mach_quot_source.data[0];
              // //    console.log(machinery_quotation_source2);
              //   //  console.log(this.machinery_localdatasource_array);
              //     item.source.update(event2.data, temp_source.data);
              //     this.machinery_localdatasource_array[item.localdatasource_index - 1].update(event2.data, temp_source.data);
              //     //console.log(event2);
              //     //item.source.update(event2.data, this.machinery_quotation_source);
              //     if (this.machinery_quotation_localdatasource_delete_array.length != 0) {
              //       for (var i = 0; i < this.machinery_quotation_localdatasource_delete_array.length; i++) {
              //         machinery_quotation_source2[0].CompQuot.push(this.machinery_quotation_localdatasource_delete_array[i]);
              //       }
              //     }

              //     this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Submittedsuccessfully') + "!");

              //     temp_source.data = [];
              //     if (event2.data.CompQuot != undefined) {

              //       for (var i = 0; i < event2.data.CompQuot.length; i++) {
              //         if (event2.data.CompQuot[i].Operation != "D") {
              //           // if(temp_source.data.length == 0){
              //           temp_source.data.push(event2.data.CompQuot[i]);
              //           //  }
              //         }
              //       }
              //     }
              //     temp_source.refresh();
            }
          },
          {
            name: this.translate.instant('TECHNICAL_INFORMATION.Delete'),
            // name: "Delete",
            type: "Delete",
            class: "btn-success",
            state: "null",
            event_old: "",
            true_name: "Delete",

            handler: (modal_data, machQuotModalsForm) => {
              this.Ng4LoadingSpinnerService.show();
              this.clearData(machQuotModalsForm);
              this.removeDisabled(machQuotModalsForm);

              var data_temp = [];
              // for(var i=0; i<event2.data.length; i++)
              //   event2.data.
              data_temp.push(event2.data);
              var comp_quot_temp = _.reject(event2.data.CompQuot, { QuotId: modal_data.QuotId });
              data_temp[0]["CompQuot"] = [];
              data_temp[0]["CompQuot"] = comp_quot_temp;
              data_temp[0]["TotalCost"] = this.removeSAR(data_temp[0]["TotalCost"]);
              data_temp[0]["Cost"] = this.removeSAR(data_temp[0]["Cost"]);
              modal_data.TotalCost = this.removeSAR(modal_data.TotalCost);
              data_temp[0]["CompQuot"].push(modal_data);
              // data_temp[0]["CompQuot"].push(quot_source_data);

              var comptotcost = data_temp[0]["TotalCost"];

              var costcomptemp = [{
                "Operation": "U",
                "LoanId": this.loan_id,
                "CompName": data_temp[0]["MachineName"],
                "CompType": "ME",
                "CompTotCost": this.removeSAR(comptotcost),
                "CompTotCostCurr": "SAR"
              }];
              costcomptemp[0]["ComponentId"] = data_temp[0]["ComponentId"];
              costcomptemp[0]["WbsId"] = data_temp[0]["WbsId"];
              costcomptemp[0]["Index"] = data_temp[0]["Index"];
              var post_data = {
                "LoanId": this.loan_id,
                "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                "CustomerId": this.CustomerId,
                "ProfileId": this.ProfileId,
                "CostComp": costcomptemp,
                "Machinery": data_temp,
              };

              this.onSave(post_data, item.panelStep);

              this.machinery_quotation_localdatasource_delete_array.push(modal_data);

              //this.Ng4LoadingSpinnerService.hide();
            }
          },
          {
            name: this.translate.instant('TECHNICAL_INFORMATION.Clear'),
            //name: "Clear",
            type: "Submit",
            class: "btn-success",
            state: "null",
            event_old: "",
            true_name: "Clear",

            handler: (modal_data) => {
              //      modal_data.inputs[0].value = "";


              this.clearData(modal_data);
              this.removeDisabled(modal_data);

            }
          }
        ]
      };

      let techInfoModal = this.modalService.open(MachQuotModalsComponent, this.commonService.modalOptions);
      techInfoModal.componentInstance.machQuotModalsForm = technicaltableinfoModalParams;
      techInfoModal.componentInstance.item_temp = item;
      techInfoModal.componentInstance.machinery_quotation_localdatasource_delete_array = this.machinery_quotation_localdatasource_delete_array;
      this.techInfoModalParams_g = technicaltableinfoModalParams;
      this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');

    } else {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.CannotViewCompetitiveInformation'));
    }
  }

  onEditBcwTotalCost(item, TotalCost, onEditBcwTotalCost) {
    // var cost_comp_ismain = _.where(this.costcomp_array_index, { IsMain: "X" });
    // var comp_temp = _.where(cost_comp_ismain, { CompType: "BC" });
    var costcompmain_bcw = _.filter(this.costcomp_array_index, { IsMain: "X", CompType: "BC" });
    var component_type_fullname = item.typeselname;
    var component_type = item.typesel;
    var Bcw_GuiId_temp = this.Bcw_GuiId;
    var TotalCost_temp = this.removeSAR(TotalCost);
    var component_id_temp = costcompmain_bcw[0].ComponentId;
    var wbsid_temp = costcompmain_bcw[0].WbsId;
    var index_temp_bcw_main = costcompmain_bcw[0].Index;
    var BcwLumpsum = costcompmain_bcw[0].BcwLumpsum;
    // if (item.isCost === "Y") {
    //   BcwLumpsum = "X";
    // } else {
    //   BcwLumpsum = "";
    // }
    var post_data2 = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": [
        {
          "Operation": "U",
          "LoanId": this.loan_id,
          "CompName": component_type_fullname,
          "CompType": component_type,
          "CompTotCost": TotalCost_temp + "",
          "CompTotCostCurr": "SAR",
          "IsMain": "X",
          "BcwLumpsum": BcwLumpsum,
          "GuiId": Bcw_GuiId_temp,
          "ComponentId": component_id_temp,
          "WbsId": wbsid_temp
        }
      ]

    };
    //var index_temp = _.filter(this.costcomp_array_index, { IsMain: "X", ComponentId: item.ComponentId });
    post_data2["CostComp"][0]["Index"] = (+index_temp_bcw_main) + "";
    this.Ng4LoadingSpinnerService.show();
    if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined) {
      post_data2 = this.isClaimsAppendPostData(post_data2);
      this.LoanTechnicalService.postTechInfoComponent(post_data2)
        .then((res) => (this.onResult(res),
          //this.resolveTechnicalInfo(res),
          this.LoanTechnicalService
            .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
            .then((res) => (this.items_refresh(),
              this.resolveTechnicalInfo(res),
              //this.scrollControl(res, post_data),
              this.Ng4LoadingSpinnerService.hide(),
              this.setPanelStep(item.panelStep)
            ),
              //  item.totalCost2 = TotalCost_temp + "",
              //  item.totalcost = this.commonService.numberToNumberWithCommas((+TotalCost_temp)),
              // this.Ng4LoadingSpinnerService.hide(),
              //   this.onAdd(panel_items_temp),
              err => (this.Ng4LoadingSpinnerService.hide()))));
    }
  }

  onAddProfFees(item) {
    let technicaltableinfoModalParams;
    let typselname = item.typeselname;
    let typesel = item.typsel;
    let bcw_prof_fees = item.source3.data;
    let bcw_prof_pre_contract = _.filter(item.source3.data, { Category: "F1" });
    let bcw_prof_post_contract = _.filter(item.source3.data, { Category: "F2" });
    let bcw_prof_other_fees = _.filter(item.source3.data, { Category: "F3" });

    let bcw_prof_pre_contract_flag = bcw_prof_pre_contract.length === 0 ? false : true;
    let bcw_prof_post_contract_flag = bcw_prof_post_contract.length === 0 ? false : true;
    let bcw_prof_other_fees_flag = bcw_prof_other_fees.length === 0 ? false : true;

    technicaltableinfoModalParams = {

      header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + this.translate.instant('TECHNICAL_INFORMATION.ProfessionalFees'), operation: "Add",
      typselcode: typesel,
      inputs: [
        {
          id: "Pre-ContractFees",
          name: this.translate.instant('TECHNICAL_INFORMATION.PreContractFees'),
          type: "text",
          value: bcw_prof_pre_contract_flag === false ? "" : this.removeSAR(bcw_prof_pre_contract[0].TotalCost),
          required: "true",
          cost: "true",
          currency: "SAR ",
        },
        {
          id: "Post-contractFees",
          name: this.translate.instant('TECHNICAL_INFORMATION.PostContractFees'),
          type: "text",
          value: bcw_prof_post_contract_flag === false ? "" : this.removeSAR(bcw_prof_post_contract[0].TotalCost),
          required: "true",
          cost: "true",
          currency: "SAR ",
        },
        {
          id: "Checkbox_Fees",
          name: this.translate.instant('TECHNICAL_INFORMATION.OtherFees'),
          type: "checkbox",
          value: bcw_prof_other_fees_flag === false ? false : true,
          required: "false",
        },
        {
          id: "OtherFeesDescription",
          name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
          type: "text",
          required: "true",
          visible: bcw_prof_other_fees_flag === false ? false : true,
          value: bcw_prof_other_fees_flag === false ? "" : bcw_prof_other_fees[0].CivilItem,
          hideable: bcw_prof_other_fees_flag === false ? true : false,
        },
        {
          id: "Other Fees",
          name: this.translate.instant('TECHNICAL_INFORMATION.Amount'),
          visible: bcw_prof_other_fees_flag === false ? false : true,
          hideable: bcw_prof_other_fees_flag === false ? true : false,
          type: "text",
          value: bcw_prof_other_fees_flag === false ? "" : this.removeSAR(bcw_prof_other_fees[0].TotalCost),
          required: "true",
          cost: "true",
          currency: "SAR ",
        },


      ],
      buttons: [
        {
          name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
          type: "Submit",
          class: "btn-success",
          trueName: "",

          handler: (modal_data) => {

            var bcw_source_data_array_1 = [];
            var bcw_source_data_array_2 = [];
            var bcw_source_data_array_3 = [];

            var bcw_source_data_1 = {
              Operation: "C",
              CivilItem: "Pre-Contract Fees",
              TotalCost: modal_data.inputs[0].value,
              TotalCostCurr: "SAR", Category: "F1"
            };
            var bcw_source_data_2 = {
              Operation: "C",
              CivilItem: "Post-Contract Fees",
              TotalCost: modal_data.inputs[1].value,
              TotalCostCurr: "SAR", Category: "F2"
            };

            var bcw_source_data_3 = {
              Operation: "C",
              CivilItem: modal_data.inputs[3].value,
              TotalCost: modal_data.inputs[4].value,
              TotalCostCurr: "SAR", Category: "F3"
            };

            //F1
            bcw_source_data_array_1.push(bcw_source_data_1);

            var data_temp_1 = [];
            bcw_source_data_array_1.push(bcw_source_data_1);
            data_temp_1.push(bcw_source_data_1);
            data_temp_1[0]["TotalCost"] = this.removeSAR(bcw_source_data_1["TotalCost"]);
            //  data_temp_1[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data_1["RawMatCostUom"]);
            data_temp_1[0]["ComponentId"] = "";
            data_temp_1[0]["WbsId"] = "";

            var comptotcost_1 = data_temp_1[0]["TotalCost"];
            var compname_1 = data_temp_1[0]["CivilItem"]

            var costcomptemp_1 = [{
              "Operation": "C",
              "LoanId": this.loan_id,
              "CompName": compname_1,
              "CompType": "BC",
              "CompTotCost": comptotcost_1,
              "CompTotCostCurr": "SAR"
            }];
            var post_data_1 = {
              "LoanId": this.loan_id,
              "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
              "CustomerId": this.CustomerId,
              "ProfileId": this.ProfileId,
              "CostComp": costcomptemp_1,
              "Bcw": data_temp_1,
            };

            //

            //F2
            bcw_source_data_array_2.push(bcw_source_data_2);

            var data_temp_2 = [];
            bcw_source_data_array_2.push(bcw_source_data_2);
            data_temp_2.push(bcw_source_data_2);
            data_temp_2[0]["TotalCost"] = this.removeSAR(bcw_source_data_2["TotalCost"]);
            //  data_temp_2[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data_2["RawMatCostUom"]);
            data_temp_2[0]["ComponentId"] = "";
            data_temp_2[0]["WbsId"] = "";

            var comptotcost_2 = data_temp_2[0]["TotalCost"];
            var compname_2 = data_temp_2[0]["CivilItem"]

            var costcomptemp_2 = [{
              "Operation": "C",
              "LoanId": this.loan_id,
              "CompName": compname_2,
              "CompType": "BC",
              "CompTotCost": comptotcost_2,
              "CompTotCostCurr": "SAR"
            }];
            var post_data_2 = {
              "LoanId": this.loan_id,
              "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
              "CustomerId": this.CustomerId,
              "ProfileId": this.ProfileId,
              "CostComp": costcomptemp_2,
              "Bcw": data_temp_2,
            };
            //

            //F3
            bcw_source_data_array_3.push(bcw_source_data_3);

            var data_temp_3 = [];
            bcw_source_data_array_3.push(bcw_source_data_3);
            data_temp_3.push(bcw_source_data_3);
            data_temp_3[0]["TotalCost"] = this.removeSAR(bcw_source_data_3["TotalCost"]);
            //  data_temp_3[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data_3["RawMatCostUom"]);
            data_temp_3[0]["ComponentId"] = "";
            data_temp_3[0]["WbsId"] = "";

            var comptotcost_3 = data_temp_3[0]["TotalCost"];
            var compname_3 = data_temp_3[0]["CivilItem"]

            var costcomptemp_3 = [{
              "Operation": "C",
              "LoanId": this.loan_id,
              "CompName": compname_3,
              "CompType": "BC",
              "CompTotCost": comptotcost_3,
              "CompTotCostCurr": "SAR"
            }];
            var post_data_3 = {
              "LoanId": this.loan_id,
              "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
              "CustomerId": this.CustomerId,
              "ProfileId": this.ProfileId,
              "CostComp": costcomptemp_3,
              "Bcw": data_temp_3,
            };
            //
            this.Ng4LoadingSpinnerService.show();
            // this.onSave(post_data_1, item.panelStep);

            //One shot push

            var index_temp = 0;
            if (this.costcomp_array_index && this.costcomp_array_index.length > 0) {
              var index_array = [];
              for (var i = 0; i < this.costcomp_array_index.length; i++) {
                if (this.costcomp_array_index[i].Index) {
                  index_array.push((+this.costcomp_array_index[i].Index));
                }
              }
              index_temp = _.max(index_array);
              if (index_temp === -Infinity)
                index_temp = 0;
            }


            var costcomp_final = [];
            var bcw_final = [];
            if (bcw_prof_pre_contract_flag) {
              costcomptemp_1[0]["Index"] = bcw_prof_pre_contract[0]["Index"] ? (+bcw_prof_pre_contract[0]["Index"]) + "" : "";
              data_temp_1[0]["Index"] = bcw_prof_pre_contract[0]["Index"] ? (+bcw_prof_pre_contract[0]["Index"]) + "" : "";
              costcomptemp_1[0]["Operation"] = "U";
              costcomptemp_1[0]["ComponentId"] = bcw_prof_pre_contract[0]["ComponentId"] ? bcw_prof_pre_contract[0]["ComponentId"] : "";
              costcomptemp_1[0]["WbsId"] = bcw_prof_pre_contract[0]["WbsId"] ? bcw_prof_pre_contract[0]["WbsId"] : "";
              data_temp_1[0]["Operation"] = "U";
              data_temp_1[0]["ComponentId"] = bcw_prof_pre_contract[0]["ComponentId"] ? bcw_prof_pre_contract[0]["ComponentId"] : "";
              data_temp_1[0]["WbsId"] = bcw_prof_pre_contract[0]["WbsId"] ? bcw_prof_pre_contract[0]["WbsId"] : "";
              data_temp_1[0]["BcwId"] = bcw_prof_pre_contract[0]["BcwId"] ? bcw_prof_pre_contract[0]["BcwId"] : "";
              costcomp_final.push(costcomptemp_1[0]);
              bcw_final.push(data_temp_1[0]);
            }
            else {
              costcomptemp_1[0]["Operation"] = "C";
              data_temp_1[0]["Operation"] = "C";
              index_temp = index_temp + 1;
              costcomptemp_1[0]["Index"] = index_temp;
              data_temp_1[0]["Index"] = index_temp;
              costcomp_final.push(costcomptemp_1[0]);
              bcw_final.push(data_temp_1[0]);
            }
            if (bcw_prof_post_contract_flag) {
              costcomptemp_2[0]["Index"] = bcw_prof_post_contract[0]["Index"] ? (+bcw_prof_post_contract[0]["Index"]) + "" : "";
              data_temp_2[0]["Index"] = bcw_prof_post_contract[0]["Index"] ? (+bcw_prof_post_contract[0]["Index"]) + "" : "";
              costcomptemp_2[0]["Operation"] = "U";
              costcomptemp_2[0]["ComponentId"] = bcw_prof_post_contract[0]["ComponentId"] ? bcw_prof_post_contract[0]["ComponentId"] : "";
              costcomptemp_2[0]["WbsId"] = bcw_prof_post_contract[0]["WbsId"] ? bcw_prof_post_contract[0]["WbsId"] : "";
              data_temp_2[0]["Operation"] = "U";
              data_temp_2[0]["ComponentId"] = bcw_prof_post_contract[0]["ComponentId"] ? bcw_prof_post_contract[0]["ComponentId"] : "";
              data_temp_2[0]["WbsId"] = bcw_prof_post_contract[0]["WbsId"] ? bcw_prof_post_contract[0]["WbsId"] : "";
              data_temp_2[0]["BcwId"] = bcw_prof_post_contract[0]["BcwId"] ? bcw_prof_post_contract[0]["BcwId"] : "";
              costcomp_final.push(costcomptemp_2[0]);
              bcw_final.push(data_temp_2[0]);
            }
            else {
              costcomptemp_2[0]["Operation"] = "C";
              data_temp_2[0]["Operation"] = "C";
              index_temp = index_temp + 1;
              costcomptemp_2[0]["Index"] = index_temp;
              data_temp_2[0]["Index"] = index_temp;
              costcomp_final.push(costcomptemp_2[0]);
              bcw_final.push(data_temp_2[0]);
            }
            if (bcw_prof_other_fees_flag && modal_data.inputs[2].value) {
              costcomptemp_3[0]["Index"] = bcw_prof_other_fees[0]["Index"] ? (+bcw_prof_other_fees[0]["Index"]) + "" : "";
              data_temp_3[0]["Index"] = bcw_prof_other_fees[0]["Index"] ? (+bcw_prof_other_fees[0]["Index"]) + "" : "";
              costcomptemp_3[0]["Operation"] = "U";
              costcomptemp_3[0]["ComponentId"] = bcw_prof_other_fees[0]["ComponentId"] ? bcw_prof_other_fees[0]["ComponentId"] : "";
              costcomptemp_3[0]["WbsId"] = bcw_prof_other_fees[0]["WbsId"] ? bcw_prof_other_fees[0]["WbsId"] : "";
              data_temp_3[0]["Operation"] = "U";
              data_temp_3[0]["ComponentId"] = bcw_prof_other_fees[0]["ComponentId"] ? bcw_prof_other_fees[0]["ComponentId"] : "";
              data_temp_3[0]["WbsId"] = bcw_prof_other_fees[0]["WbsId"] ? bcw_prof_other_fees[0]["WbsId"] : "";
              data_temp_3[0]["BcwId"] = bcw_prof_other_fees[0]["BcwId"] ? bcw_prof_other_fees[0]["BcwId"] : "";
              costcomp_final.push(costcomptemp_3[0]);
              bcw_final.push(data_temp_3[0]);
            }
            else if (bcw_prof_other_fees_flag && modal_data.inputs[2].value === false) {
              costcomptemp_3[0]["Index"] = bcw_prof_other_fees[0]["Index"] ? (+bcw_prof_other_fees[0]["Index"]) + "" : "";
              data_temp_3[0]["Index"] = bcw_prof_other_fees[0]["Index"] ? (+bcw_prof_other_fees[0]["Index"]) + "" : "";
              costcomptemp_3[0]["Operation"] = "D";
              costcomptemp_3[0]["ComponentId"] = bcw_prof_other_fees[0]["ComponentId"] ? bcw_prof_other_fees[0]["ComponentId"] : "";
              costcomptemp_3[0]["WbsId"] = bcw_prof_other_fees[0]["WbsId"] ? bcw_prof_other_fees[0]["WbsId"] : "";
              data_temp_3[0]["Operation"] = "D";
              data_temp_3[0]["ComponentId"] = bcw_prof_other_fees[0]["ComponentId"] ? bcw_prof_other_fees[0]["ComponentId"] : "";
              data_temp_3[0]["WbsId"] = bcw_prof_other_fees[0]["WbsId"] ? bcw_prof_other_fees[0]["WbsId"] : "";
              data_temp_3[0]["BcwId"] = bcw_prof_other_fees[0]["BcwId"] ? bcw_prof_other_fees[0]["BcwId"] : "";
              costcomp_final.push(costcomptemp_3[0]);
              bcw_final.push(data_temp_3[0]);
            }
            else if (bcw_prof_other_fees_flag === false && modal_data.inputs[2].value) {
              costcomptemp_3[0]["Operation"] = "C";
              data_temp_3[0]["Operation"] = "C";
              index_temp = index_temp + 1;
              costcomptemp_3[0]["Index"] = index_temp;
              data_temp_3[0]["Index"] = index_temp;
              costcomp_final.push(costcomptemp_3[0]);
              bcw_final.push(data_temp_3[0]);
            }
            var post_data_final = {
              "LoanId": this.loan_id,
              "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
              "CustomerId": this.CustomerId,
              "ProfileId": this.ProfileId,
              "CostComp": costcomp_final,
              "Bcw": bcw_final
            };

            //One shot push end

            var err_temp;
            var comp_type_temp = post_data_final.CostComp[0]["CompType"];
            var isFromBcwSpecial = true;
            if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined) {
              post_data_final = this.isClaimsAppendPostData(post_data_final);
              this.LoanTechnicalService.postTechInfoComponent(post_data_final)
                .then((res) => (
                  // this.postPostContractFees(post_data_2),
                  // this.postOtherFees(post_data_3),
                  this.callResolvePrelim(isFromBcwSpecial),
                  this.items_refresh(),
                  //this.scrollControl(res, post_data_final, comp_type_temp),
                  this.Ng4LoadingSpinnerService.hide()
                ), err => (
                  err_temp = err)
                ),
                err => (this.Ng4LoadingSpinnerService.hide());

              this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
            }
          }
        }
      ]
    };
    let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
    techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
    this.techInfoModalParams_g = technicaltableinfoModalParams;
    this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
  }

  postPostContractFees(post_data_2) {
    var err_temp;
    var comp_type_temp = post_data_2.CostComp[0]["CompType"];
    // this.LoanTechnicalService.postTechInfoComponent(post_data_2)
    // .then((res) => (
    //       console.log("sdfasd")
    //     ), err => (
    //       err_temp = err)
    //     ),  
    //   err => (this.Ng4LoadingSpinnerService.hide());
  }

  postOtherFees(post_data_3) {
    var err_temp;
    var comp_type_temp = post_data_3.CostComp[0]["CompType"];
    // this.LoanTechnicalService.postTechInfoComponent(post_data_3)
    // .then((res) => (
    //   console.log("sdfasd")
    //     ), err => (
    //       err_temp = err)
    //     ),  
    //   err => (this.Ng4LoadingSpinnerService.hide());
  }

  onAddBcw(item, type) {
    let technicaltableinfoModalParams = {};
    this.techOptionSelected = item.typesel;
    let typsel = item.typesel;
    let typselname = item.typeselname;
    let floor_source = new LocalDataSource;

    let BuildingName = this.translate.instant('TECHNICAL_INFORMATION.BuildingName')
    let GroundFloorArea = this.translate.instant('TECHNICAL_INFORMATION.GroundFloorArea(m2)')
    let TypeofStructure = this.translate.instant('TECHNICAL_INFORMATION.TypeOfStructure')
    let Description = this.translate.instant('TECHNICAL_INFORMATION.Description')
    let FloorDetails = this.translate.instant('TECHNICAL_INFORMATION.FloorDetails')
    let CivilWork = this.translate.instant('TECHNICAL_INFORMATION.CivilWork')

    if (item.isCost === "N") {
      if (typsel === 'BC' && type === 'B') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          alert: "true - BC - B",
          typselcode: typsel,
          inputs: [
            {
              id: "CivilItem",
              name: BuildingName,
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "TotalArea",
              name: GroundFloorArea,
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ItemDesc",
              name: TypeofStructure,
              type: "select",
              value: this.BcwStructures_desc,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "ItemFullDesc",
              name: Description,
              type: "text",
              required: "false",
              visible: false,
              value: "",
              hideable: true,
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              name: "FloorDetails",
              type: "table",
              id: "FloorArea",
              settings: this.bcw_floor_settings_c,
              source: floor_source,
            }

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",
              trueName: "add_bcw",

              handler: (modal_data) => {
                // this.bcw_add(item, modal_data);
                // var flag = 0;
                // for(var i = 0 ; i<modal_data.inputs[5]["source"]["data"].length; i++){
                //   if(modal_data.inputs[5]["source"]["data"][i]["Floor"] === "0")
                //     flag = 1;
                // }
                // if(flag === 0){

                var bcw_source_data_array = [];
                var bcw_source_data = {
                  Operation: "C",
                  CivilItem: modal_data.inputs[0].value,
                  // TotalArea: modal_data.inputs[1].value,
                  ItemDesc: modal_data.inputs[2].selected,
                  ItemFullDesc: modal_data.inputs[3].value,
                  TotalCost: modal_data.inputs[4].value,
                  TotalCostCurr: "SAR", Category: "B"
                };

                bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";

                var unit = this.BcwStructures.find((o) => o.DescAr == bcw_source_data["ItemDesc"]||o.Desc == bcw_source_data["ItemDesc"]);
                if (unit)
                  bcw_source_data["ItemDesc"] = unit.Id;

                var floor_area_array = [];
                floor_area_array.push({ "Floor": "0", "Area": modal_data.inputs[1].value });
                floor_area_array = floor_area_array.concat(modal_data.inputs[5]["source"]["data"]);
                for (var i = 0; i < floor_area_array.length; i++)
                  floor_area_array[i]["Operation"] = "C";
                bcw_source_data["FloorArea"] = floor_area_array;

                var totalArea_temp = 0;
                for (var i = 0; i < floor_area_array.length; i++)
                  totalArea_temp = totalArea_temp + +parseFloat(floor_area_array[i].Area);
                bcw_source_data["TotalArea"] = totalArea_temp + "";

                bcw_source_data_array.push(bcw_source_data);

                if (item.length == 0)
                  item.source1.load(bcw_source_data_array);

                else
                  item.source1.add(bcw_source_data);

                item.length++;

                var x = 0;
                for (var i = 0; i < item.source1.data.length; i++) {
                  x = +x + +[item.source1.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                }

                item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                item.source1.refresh();

                var data_temp = [];
                // bcw_source_data_array.push(bcw_source_data);
                data_temp.push(bcw_source_data);
                data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                data_temp[0]["ComponentId"] = "";
                data_temp[0]["WbsId"] = "";

                var comptotcost = data_temp[0]["TotalCost"];

                var costcomptemp = [{
                  "Operation": "C",
                  "LoanId": this.loan_id,
                  "CompName": bcw_source_data["CivilItem"],
                  "CompType": "BC",
                  "CompTotCost": comptotcost,
                  "CompTotCostCurr": "SAR"
                }];
                var post_data = {
                  "LoanId": this.loan_id,
                  "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                  "CustomerId": this.CustomerId,
                  "ProfileId": this.ProfileId,
                  "CostComp": costcomptemp,
                  "Bcw": data_temp,
                };
                this.Ng4LoadingSpinnerService.show();
                post_data = this.calcIndex(post_data);
                this.onSave(post_data, item.panelStep);
                this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
                // }
                // else {
                //   this.commonService.showFailureToast("Floor number should be greater than 0")
                // }

              }
            }
          ]
        };

      }
      if (typsel === 'BC' && type === 'C') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          alert: "true - BC",
          typselcode: typsel,
          inputs: [
            {
              id: "CivilItem",
              name: CivilWork,
              type: "text",
              value: "",
              required: "true",
            },
            // {
            //   id: "Area",
            //   name: "Built-Up Area(m2)",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            // {
            //   id: "ItemDesc",
            //   name: "Type of Structure",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                // this.bcw_add(item, modal_data);
                var bcw_source_data_array = [];
                var bcw_source_data = {
                  Operation: "C",
                  CivilItem: modal_data.inputs[0].value, TotalCost: modal_data.inputs[1].value,
                  TotalCostCurr: "SAR", Category: "C"
                };
                bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";

                bcw_source_data_array.push(bcw_source_data);

                if (item.length == 0)
                  item.source2.load(bcw_source_data_array);

                else
                  item.source2.add(bcw_source_data);

                item.length++;

                var x = 0;
                for (var i = 0; i < item.source2.data.length; i++) {
                  x = +x + +[item.source2.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                }

                item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                item.source2.refresh();

                var data_temp = [];
                //bcw_source_data_array.push(bcw_source_data);
                data_temp.push(bcw_source_data);
                data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                data_temp[0]["ComponentId"] = "";
                data_temp[0]["WbsId"] = "";

                var comptotcost = data_temp[0]["TotalCost"];

                var costcomptemp = [{
                  "Operation": "C",
                  "LoanId": this.loan_id,
                  "CompName": bcw_source_data["CivilItem"],
                  "CompType": "BC",
                  "CompTotCost": comptotcost,
                  "CompTotCostCurr": "SAR"
                }];
                var post_data = {
                  "LoanId": this.loan_id,
                  "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                  "CustomerId": this.CustomerId,
                  "ProfileId": this.ProfileId,
                  "CostComp": costcomptemp,
                  "Bcw": data_temp,
                };
                post_data = this.calcIndex(post_data);
                this.Ng4LoadingSpinnerService.show();
                this.onSave(post_data, item.panelStep);

                this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

              }
            }
          ]
        };

      }
    }
    else if (item.isCost === "Y") {
      if (typsel === 'BC' && type === 'B') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          alert: "true - BC - B",
          typselcode: typsel,
          inputs: [
            {
              id: "CivilItem",
              name: BuildingName,
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "TotalArea",
              name: GroundFloorArea,
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "ItemDesc",
              name: TypeofStructure,
              type: "select",
              value: this.BcwStructures_desc,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "ItemFullDesc",
              name: Description,
              type: "text",
              required: "false",
              visible: false,
              value: "",
              hideable: true,
            },
            {
              name: FloorDetails,
              type: "table",
              id: "FloorArea",
              settings: this.bcw_floor_settings_c,
              source: floor_source,
            },

            // {
            //   id: "TotalCost",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            //   cost: "true",
            //   currency: "SAR ",
            // },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",
              trueName: "add_bcw_2",

              handler: (modal_data) => {
                // this.bcw_add(item, modal_data);
                var bcw_source_data_array = [];
                var bcw_source_data = {
                  Operation: "C",
                  CivilItem: modal_data.inputs[0].value,
                  //TotalArea: modal_data.inputs[1].value,
                  ItemDesc: modal_data.inputs[2].selected,
                  ItemFullDesc: modal_data.inputs[3].value,
                  Category: "B"
                };
                //  bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";
                var unit = this.BcwStructures.find((o) => o.DescAr == bcw_source_data["ItemDesc"]|| o.Desc == bcw_source_data["ItemDesc"]);
                if (unit)
                  bcw_source_data["ItemDesc"] = unit.Id;

                bcw_source_data_array.push(bcw_source_data);

                if (item.length == 0)
                  item.source1.load(bcw_source_data_array);

                else
                  item.source1.add(bcw_source_data);

                item.length++;

                // var x = 0;
                // for (var i = 0; i < item.source.data.length; i++) {
                //   x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                // }

                // item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                item.source1.refresh();

                var floor_area_array = [];
                floor_area_array.push({ "Floor": "0", "Area": modal_data.inputs[1].value });
                floor_area_array = floor_area_array.concat(modal_data.inputs[4]["source"]["data"]);
                for (var i = 0; i < floor_area_array.length; i++)
                  floor_area_array[i]["Operation"] = "C";
                bcw_source_data["FloorArea"] = floor_area_array;

                var data_temp = [];

                var totalArea_temp = 0;
                for (var i = 0; i < floor_area_array.length; i++)
                  totalArea_temp = totalArea_temp + +parseFloat(floor_area_array[i].Area);
                bcw_source_data["TotalArea"] = totalArea_temp + "";

                //   bcw_source_data_array.push(bcw_source_data);
                data_temp.push(bcw_source_data);
                //  data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                data_temp[0]["ComponentId"] = "";
                data_temp[0]["WbsId"] = "";

                //    var comptotcost = data_temp[0]["TotalCost"];

                var costcomptemp = [{
                  "Operation": "C",
                  "LoanId": this.loan_id,
                  "CompName": bcw_source_data["CivilItem"],
                  "CompType": "BC",
                  "CompTotCost": item.TotalCost,
                  "CompTotCostCurr": "SAR"
                }];
                var post_data = {
                  "LoanId": this.loan_id,
                  "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                  "CustomerId": this.CustomerId,
                  "ProfileId": this.ProfileId,
                  "CostComp": costcomptemp,
                  "Bcw": data_temp,
                };
                post_data = this.calcIndex(post_data);
                this.Ng4LoadingSpinnerService.show();
                this.onSave(post_data, item.panelStep);

                this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

              }
            }
          ]
        };

      }
      if (typsel === 'BC' && type === 'C') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          alert: "true - BC",
          typselcode: typsel,
          inputs: [
            {
              id: "CivilItem",
              name: CivilWork,
              type: "text",
              value: "",
              required: "true",
            },
            // {
            //   id: "Area",
            //   name: "Built-Up Area(m2)",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            // {
            //   id: "ItemDesc",
            //   name: "Type of Structure",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            // {
            //   id: "TotalCost",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            //   cost: "true",
            //   currency: "SAR ",
            // },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                // this.bcw_add(item, modal_data);
                var bcw_source_data_array = [];
                var bcw_source_data = {
                  Operation: "C",
                  CivilItem: modal_data.inputs[0].value, Category: "C"
                };
                //  bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";

                bcw_source_data_array.push(bcw_source_data);

                if (item.length == 0)
                  item.source2.load(bcw_source_data_array);

                else
                  item.source2.add(bcw_source_data);

                item.length++;

                // var x = 0;
                // for (var i = 0; i < item.source.data.length; i++) {
                //   x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                // }

                // item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                item.source2.refresh();

                var data_temp = [];
                bcw_source_data_array.push(bcw_source_data);
                data_temp.push(bcw_source_data);
                //  data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                data_temp[0]["ComponentId"] = "";
                data_temp[0]["WbsId"] = "";

                //    var comptotcost = data_temp[0]["TotalCost"];

                var costcomptemp = [{
                  "Operation": "C",
                  "LoanId": this.loan_id,
                  "CompName": bcw_source_data["CivilItem"],
                  "CompType": "BC",
                  "CompTotCost": item.TotalCost,
                  "CompTotCostCurr": "SAR"
                }];
                var post_data = {
                  "LoanId": this.loan_id,
                  "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                  "CustomerId": this.CustomerId,
                  "ProfileId": this.ProfileId,
                  "CostComp": costcomptemp,
                  "Bcw": data_temp,
                };
                post_data = this.calcIndex(post_data);
                this.Ng4LoadingSpinnerService.show();
                this.onSave(post_data, item.panelStep);

                this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

              }
            }
          ]
        };

      }
    }
    let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
    techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
    this.techInfoModalParams_g = technicaltableinfoModalParams;
    this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
  }

  onViewBcw(item, event, type) {
    let technicaltableinfoModalParams = {};
    this.techOptionSelected = item.typesel;
    let typsel = item.typesel;
    let typselname = item.typeselname;

    let FloorArea_array = [];
    let totalarea_temp = [];
    let FloorArea_gf = [];
    let floor_source = new LocalDataSource;
    if (event.data.FloorArea) {
      FloorArea_array = event.data.FloorArea.slice(0);
      FloorArea_array = _.sortBy(FloorArea_array, 'Floor');
      totalarea_temp = FloorArea_array[0].Area;
      FloorArea_gf = [];
      for (var i = 1; i < FloorArea_array.length; i++)
        FloorArea_gf.push(FloorArea_array[i]);
      floor_source.load(FloorArea_gf);
    }

    let BuildingName = this.translate.instant('TECHNICAL_INFORMATION.BuildingName')
    let GroundFloorArea = this.translate.instant('TECHNICAL_INFORMATION.GroundFloorArea(m2)')
    let TypeofStructure = this.translate.instant('TECHNICAL_INFORMATION.TypeOfStructure')
    let Description = this.translate.instant('TECHNICAL_INFORMATION.Description')
    let FloorDetails = this.translate.instant('TECHNICAL_INFORMATION.FloorDetails')
    let CivilWork = this.translate.instant('TECHNICAL_INFORMATION.CivilWork')

    if (item.isCost === "N") {
      if (typsel === 'BC' && type === 'B') {
        var itemdesc_temp;
        var unit = this.BcwStructures.find((o) => o.Id == event.data.ItemDesc);
        if (unit)
          itemdesc_temp = unit.Desc;
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + typselname, operation: "View",
          alert: "true - BC - B",
          typselcode: typsel,
          method: "view",
          inputs: [
            {
              id: "CivilItem",
              name: BuildingName,
              type: "text",
              value: event.data.CivilItem,
              required: "true",
            },
            {
              id: "TotalArea",
              name: GroundFloorArea,
              type: "text",
              value: totalarea_temp,
              required: "true",
            },
            {
              id: "ItemDesc",
              name: TypeofStructure,
              type: "text",
              value: itemdesc_temp,
              required: "true",
            },
            {
              id: "ItemFullDesc",
              name: Description,
              type: "text",
              required: event.data.ItemDesc === "OT" ? "true" : "false",
              visible: event.data.ItemDesc === "OT" ? true : false,
              value: event.data.ItemFullDesc,
              hideable: event.data.ItemDesc === "OT" ? false : true,
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: this.removeSAR(event.data.TotalCost),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              name: FloorDetails,
              type: "table",
              id: "FloorArea",
              settings: this.bcw_floor_settings_c,
              source: floor_source,
            },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [

          ]
        };

      }
      if (typsel === 'BC' && type === 'C') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + typselname, operation: "View",
          alert: "true - BC",
          typselcode: typsel,
          method: "view",
          inputs: [
            {
              id: "CivilItem",
              name: CivilWork,
              type: "text",
              value: event.data.CivilItem,
              required: "true",
            },
            // {
            //   id: "Area",
            //   name: "Built-Up Area(m2)",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            // {
            //   id: "ItemDesc",
            //   name: "Type of Structure",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: this.removeSAR(event.data.TotalCost),
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
          ]
        };

      }
    }
    else if (item.isCost === "Y") {
      if (typsel === 'BC' && type === 'B') {
        var itemdesc_temp;
        var unit = this.BcwStructures.find((o) => o.Id == event.data.ItemDesc);
        if (unit)
          itemdesc_temp = unit.Desc;
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + typselname, operation: "View",
          alert: "true - BC - B",
          typselcode: typsel,
          method: "view",
          inputs: [
            {
              id: "CivilItem",
              name: BuildingName,
              type: "text",
              value: event.data.CivilItem,
              required: "true",
            },
            {
              id: "TotalArea",
              name: GroundFloorArea,
              type: "text",
              value: totalarea_temp,
              required: "true",
            },
            {
              id: "ItemDesc",
              name: TypeofStructure,
              type: "text",
              value: itemdesc_temp,
              required: "true",
            },
            {
              id: "ItemFullDesc",
              name: Description,
              type: "text",
              required: event.data.ItemDesc === "OT" ? "true" : "false",
              visible: event.data.ItemDesc === "OT" ? true : false,
              value: event.data.ItemFullDesc,
              hideable: event.data.ItemDesc === "OT" ? false : true,
            },
            {
              name: FloorDetails,
              type: "table",
              id: "FloorArea",
              settings: this.bcw_floor_settings_c,
              source: floor_source,
            },
            // {
            //   id: "TotalCost",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            //   cost: "true",
            //   currency: "SAR ",
            // },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
          ]
        };

      }
      if (typsel === 'BC' && type === 'C') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + typselname, operation: "View",
          alert: "true - BC",
          typselcode: typsel,
          method: "view",
          inputs: [
            {
              id: "CivilItem",
              name: CivilWork,
              type: "text",
              value: event.data.CivilItem,
              required: "true",
            },
            // {
            //   id: "Area",
            //   name: "Built-Up Area(m2)",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            // {
            //   id: "ItemDesc",
            //   name: "Type of Structure",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            // {
            //   id: "TotalCost",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            //   cost: "true",
            //   currency: "SAR ",
            // },

            // {
            //   id: "Purpose",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },

          ],
          buttons: [
          ]
        };

      }
    }
    let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
    techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
    this.techInfoModalParams_g = technicaltableinfoModalParams;
    this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
  }

  onEditBcw(item, event, type) {
    if (this.isClaimsEditDelete(event)) {
      let technicaltableinfoModalParams = {};
      this.techOptionSelected = item.typesel;
      let typsel = item.typesel;
      let typselname = item.typeselname;
      //  var duplicateObject = JSON.parse(JSON.stringify( event.data.FloorArea ));
      let FloorArea_array = [];
      let totalarea_temp = [];
      let FloorArea_gf = [];
      let floor_source = new LocalDataSource;
      if (event.data.FloorArea) {
        FloorArea_array = JSON.parse(JSON.stringify(event.data.FloorArea));
        for (var i = 0; i < FloorArea_array.length; i++)
          FloorArea_array[i].Floor = (+FloorArea_array[i].Floor) + "";
        FloorArea_array = _.sortBy(FloorArea_array, 'Floor');
        totalarea_temp = FloorArea_array[0].Area;
        FloorArea_gf = [];
        for (var i = 1; i < FloorArea_array.length; i++)
          FloorArea_gf.push(FloorArea_array[i]);
        floor_source.load(FloorArea_gf);
      }

      let BuildingName = this.translate.instant('TECHNICAL_INFORMATION.BuildingName')
      let GroundFloorArea = this.translate.instant('TECHNICAL_INFORMATION.GroundFloorArea(m2)')
      let TypeofStructure = this.translate.instant('TECHNICAL_INFORMATION.TypeOfStructure')
      let Description = this.translate.instant('TECHNICAL_INFORMATION.Description')
      let FloorDetails = this.translate.instant('TECHNICAL_INFORMATION.FloorDetails')
      let CivilWork = this.translate.instant('TECHNICAL_INFORMATION.CivilWork')

      if (item.isCost === "N") {

        var itemdesc_temp;
        var unit = this.BcwStructures.find((o) => o.Id == event.data.ItemDesc);
        if (unit)
          itemdesc_temp = unit.Desc;

        if (typsel === 'BC' && type === 'B') {

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",
            alert: "true - BC - B",
            typselcode: typsel,
            inputs: [
              {
                id: "CivilItem",
                name: BuildingName,
                type: "text",
                value: event.data.CivilItem,
                required: "true",
              },
              {
                id: "TotalArea",
                name: GroundFloorArea,
                type: "number",
                value: totalarea_temp,
                required: "true",
              },
              {
                id: "ItemDesc",
                name: TypeofStructure,
                type: "select",
                value: this.BcwStructures_desc,
                selected: itemdesc_temp,
                required: "true",
                visible: true
              },
              {
                id: "ItemFullDesc",
                name: Description,
                type: "text",
                required: event.data.ItemDesc === "OT" ? "true" : "false",
                visible: event.data.ItemDesc === "OT" ? true : false,
                value: event.data.ItemFullDesc,
                hideable: event.data.ItemDesc === "OT" ? false : true,
              },
              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text",
                value: this.removeSAR(event.data.TotalCost),
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                name: FloorDetails,
                type: "table",
                id: "FloorArea",
                settings: this.bcw_floor_settings_c,
                source: floor_source,
              },


              // {
              //   id: "Purpose",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",
                trueName: "edit_bcw",

                handler: (modal_data) => {
                  //    this.bcw_add(item, modal_data);
                  FloorArea_array = [];
                  for (var i = 0; i < event.data.FloorArea.length; i++) {
                    FloorArea_array.push({ "Floor": event.data.FloorArea[i].Floor, "Area": event.data.FloorArea[i].Area });
                  }
                  var bcw_source_data_array = [];
                  var bcw_source_data = {
                    Operation: "U", ComponentId: event.data.ComponentId, WbsId: event.data.WbsId,
                    BcwId: event.data.BcwId,
                    CivilItem: modal_data.inputs[0].value,
                    // TotalArea: modal_data.inputs[1].value,

                    ItemDesc: modal_data.inputs[2].selected,
                    ItemFullDesc: modal_data.inputs[3].selected,
                    TotalCost: modal_data.inputs[4].value,
                    TotalCostCurr: "SAR", Category: "B"
                  };

                  bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";

                  var unit = this.BcwStructures.find((o) => o.DescAr == bcw_source_data["ItemDesc"]|| o.Desc == bcw_source_data["ItemDesc"]);
                  if (unit)
                    bcw_source_data["ItemDesc"] = unit.Id;

                  var floor_area_array = [];
                  for (var i = 0; i < FloorArea_array.length; i++) {
                    FloorArea_array[i]["Operation"] = "D";
                  }
                  floor_area_array = floor_area_array.concat(FloorArea_array);
                  floor_area_array.push({ "Operation": "C", "Floor": "0", "Area": modal_data.inputs[1].value });
                  for (var i = 0; i < modal_data.inputs[5]["source"]["data"].length; i++) {
                    modal_data.inputs[5]["source"]["data"][i] = { "Operation": "C", "Floor": modal_data.inputs[5]["source"]["data"][i]["Floor"], "Area": modal_data.inputs[5]["source"]["data"][i]["Area"] };
                  }

                  floor_area_array = floor_area_array.concat(modal_data.inputs[5]["source"]["data"]);
                  bcw_source_data["FloorArea"] = floor_area_array;

                  var totalArea_temp = 0;
                  for (var i = 0; i < floor_area_array.length; i++) {
                    if (floor_area_array[i].Operation === "C")
                      totalArea_temp = totalArea_temp + +parseFloat(floor_area_array[i].Area);
                  }
                  bcw_source_data["TotalArea"] = totalArea_temp + "";

                  bcw_source_data_array.push(bcw_source_data);

                  // if (item.length == 0)
                  //   item.source1.load(bcw_source_data_array);

                  // else
                  //   item.source1.add(bcw_source_data);

                  // item.length++;

                  item.source1.update(event.data, bcw_source_data);
                  item.source1.refresh();

                  var x = 0;
                  for (var i = 0; i < item.source1.data.length; i++) {
                    x = +x + +[item.source1.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                  }

                  item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                  item.source1.refresh();

                  var data_temp = [];
                  // bcw_source_data_array.push(bcw_source_data);
                  data_temp.push(bcw_source_data);
                  data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                  //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                  data_temp[0]["ComponentId"] = event.data.ComponentId;
                  data_temp[0]["WbsId"] = event.data.WbsId;
                  data_temp[0]["Index"] = event.data.Index;

                  var comptotcost = data_temp[0]["TotalCost"];

                  var costcomptemp = [{
                    "Operation": "U",
                    "LoanId": this.loan_id,
                    "CompName": bcw_source_data["CivilItem"],
                    "CompType": "BC",
                    "CompTotCost": comptotcost,
                    "CompTotCostCurr": "SAR",
                    "ComponentId": data_temp[0]["ComponentId"],
                    "WbsId": data_temp[0]["WbsId"]
                  }];
                  costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
                  var post_data = {
                    "LoanId": this.loan_id,
                    "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                    "CustomerId": this.CustomerId,
                    "ProfileId": this.ProfileId,
                    "CostComp": costcomptemp,
                    "Bcw": data_temp,
                  };
                  this.Ng4LoadingSpinnerService.show();
                  this.onSave(post_data, item.panelStep);
                  this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

                }
              }
            ]
          };

        }
        if (typsel === 'BC' && type === 'C') {

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Add",
            alert: "true - BC",
            typselcode: typsel,
            inputs: [
              {
                id: "CivilItem",
                name: CivilWork,
                type: "text",
                value: event.data.CivilItem,
                required: "true",
              },
              // {
              //   id: "Area",
              //   name: "Built-Up Area(m2)",
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },
              // {
              //   id: "ItemDesc",
              //   name: "Type of Structure",
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },
              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text",
                value: this.removeSAR(event.data.TotalCost),
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              // {
              //   id: "Purpose",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  // this.bcw_add(item, modal_data);
                  var bcw_source_data_array = [];
                  var bcw_source_data = {
                    Operation: "U", ComponentId: event.data.ComponentId, WbsId: event.data.WbsId,
                    BcwId: event.data.BcwId,
                    CivilItem: modal_data.inputs[0].value, TotalCost: modal_data.inputs[1].value,
                    TotalCostCurr: "SAR", Category: "C"
                  };
                  bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";

                  bcw_source_data_array.push(bcw_source_data);

                  // if (item.length == 0)
                  //   item.source2.load(bcw_source_data_array);

                  // else
                  //   item.source2.add(bcw_source_data);

                  // item.length++;
                  item.source2.update(event.data, bcw_source_data);
                  item.source2.refresh();

                  var x = 0;
                  for (var i = 0; i < item.source2.data.length; i++) {
                    x = +x + +[item.source2.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                  }

                  item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                  item.source2.refresh();

                  var data_temp = [];
                  bcw_source_data_array.push(bcw_source_data);
                  data_temp.push(bcw_source_data);
                  data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                  //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                  data_temp[0]["ComponentId"] = event.data.ComponentId;
                  data_temp[0]["WbsId"] = event.data.WbsId;
                  data_temp[0]["Index"] = event.data.Index;

                  var comptotcost = data_temp[0]["TotalCost"];

                  var costcomptemp = [{
                    "Operation": "U",
                    "LoanId": this.loan_id,
                    "CompName": bcw_source_data["CivilItem"],
                    "CompType": "BC",
                    "CompTotCost": comptotcost,
                    "CompTotCostCurr": "SAR",
                    "ComponentId": data_temp[0]["ComponentId"],
                    "WbsId": data_temp[0]["WbsId"]
                  }];
                  costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
                  var post_data = {
                    "LoanId": this.loan_id,
                    "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                    "CustomerId": this.CustomerId,
                    "ProfileId": this.ProfileId,
                    "CostComp": costcomptemp,
                    "Bcw": data_temp,
                  };
                  this.Ng4LoadingSpinnerService.show();
                  this.onSave(post_data, item.panelStep);

                  this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

                }
              }
            ]
          };

        }
      }
      else if (item.isCost === "Y") {
        if (typsel === 'BC' && type === 'B') {

          var itemdesc_temp;
          var unit = this.BcwStructures.find((o) => o.Id == event.data.ItemDesc);
          if (unit)
            itemdesc_temp = unit.Desc;

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Add",
            alert: "true - BC - B",
            typselcode: typsel,
            inputs: [
              {
                id: "CivilItem",
                name: BuildingName,
                type: "text",
                value: event.data.CivilItem,
                required: "true",
              },
              {
                id: "TotalArea",
                name: GroundFloorArea,
                type: "number",
                value: totalarea_temp,
                required: "true",
              },
              {
                id: "ItemDesc",
                name: TypeofStructure,
                type: "select",
                value: this.BcwStructures_desc,
                selected: itemdesc_temp,
                required: "true",
                visible: true
              },
              {
                id: "ItemFullDesc",
                name: Description,
                type: "text",
                required: event.data.ItemDesc === "OT" ? "true" : "false",
                visible: event.data.ItemDesc === "OT" ? true : false,
                value: event.data.ItemFullDesc,
                hideable: event.data.ItemDesc === "OT" ? false : true,
              },
              {
                name: FloorDetails,
                type: "table",
                id: "FloorArea",
                settings: this.bcw_floor_settings_c,
                source: floor_source,
              },

              // {
              //   id: "TotalCost",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              //   type: "text",
              //   value: "",
              //   required: "true",
              //   cost: "true",
              //   currency: "SAR ",
              // },

              // {
              //   id: "Purpose",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",
                trueName: "edit_bcw_2",

                handler: (modal_data) => {
                  // this.bcw_add(item, modal_data);
                  var bcw_source_data_array = [];
                  var bcw_source_data = {
                    Operation: "U", ComponentId: event.data.ComponentId, WbsId: event.data.WbsId,
                    BcwId: event.data.BcwId,
                    CivilItem: modal_data.inputs[0].value,
                    //TotalArea: modal_data.inputs[1].value,
                    ItemDesc: modal_data.inputs[2].selected,
                    ItemFullDesc: modal_data.inputs[3].value,
                    Category: "B"
                  };
                  //  bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";
                  var unit = this.BcwStructures.find((o) => o.DescAr == bcw_source_data["ItemDesc"]|| o.Desc == bcw_source_data["ItemDesc"]);
                  if (unit)
                    bcw_source_data["ItemDesc"] = unit.Id;


                  var floor_area_array = [];
                  for (var i = 0; i < FloorArea_array.length; i++) {
                    FloorArea_array[i]["Operation"] = "D";
                  }
                  floor_area_array = floor_area_array.concat(FloorArea_array);
                  floor_area_array.push({ "Operation": "C", "Floor": "0", "Area": modal_data.inputs[1].value });
                  for (var i = 0; i < modal_data.inputs[4]["source"]["data"].length; i++) {
                    modal_data.inputs[4]["source"]["data"][i] = { "Operation": "C", "Floor": modal_data.inputs[4]["source"]["data"][i]["Floor"], "Area": modal_data.inputs[4]["source"]["data"][i]["Area"] };
                  }

                  floor_area_array = floor_area_array.concat(modal_data.inputs[4]["source"]["data"]);
                  bcw_source_data["FloorArea"] = floor_area_array;

                  var totalArea_temp = 0;
                  for (var i = 0; i < floor_area_array.length; i++) {
                    if (floor_area_array[i].Operation === "C")
                      totalArea_temp = totalArea_temp + +parseFloat(floor_area_array[i].Area);
                  }
                  bcw_source_data["TotalArea"] = totalArea_temp + "";

                  bcw_source_data_array.push(bcw_source_data);

                  // if (item.length == 0)
                  //   item.source1.load(bcw_source_data_array);

                  // else
                  //   item.source1.add(bcw_source_data);

                  // item.length++;
                  item.source1.update(event.data, bcw_source_data);
                  item.source1.refresh();
                  // var x = 0;
                  // for (var i = 0; i < item.source.data.length; i++) {
                  //   x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                  // }

                  // item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                  item.source1.refresh();

                  var data_temp = [];
                  bcw_source_data_array.push(bcw_source_data);
                  data_temp.push(bcw_source_data);
                  //  data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                  //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                  data_temp[0]["ComponentId"] = event.data.ComponentId;
                  data_temp[0]["WbsId"] = event.data.WbsId;
                  data_temp[0]["Index"] = event.data.Index;

                  //    var comptotcost = data_temp[0]["TotalCost"];

                  var costcomptemp = [{
                    "Operation": "U",
                    "LoanId": this.loan_id,
                    "CompName": bcw_source_data["CivilItem"],
                    "CompType": "BC",
                    "CompTotCost": item.TotalCost,
                    "CompTotCostCurr": "SAR",
                    "ComponentId": data_temp[0]["ComponentId"],
                    "WbsId": data_temp[0]["WbsId"]
                  }];
                  costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
                  var post_data = {
                    "LoanId": this.loan_id,
                    "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                    "CustomerId": this.CustomerId,
                    "ProfileId": this.ProfileId,
                    "CostComp": costcomptemp,
                    "Bcw": data_temp,
                  };
                  this.Ng4LoadingSpinnerService.show();
                  this.onSave(post_data, item.panelStep);

                  this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

                }
              }
            ]
          };

        }
        if (typsel === 'BC' && type === 'C') {

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Add",
            alert: "true - BC",
            typselcode: typsel,
            inputs: [
              {
                id: "CivilItem",
                name: CivilWork,
                type: "text",
                value: event.data.CivilItem,
                required: "true",
              },
              // {
              //   id: "Area",
              //   name: "Built-Up Area(m2)",
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },
              // {
              //   id: "ItemDesc",
              //   name: "Type of Structure",
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },
              // {
              //   id: "TotalCost",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              //   type: "text",
              //   value: "",
              //   required: "true",
              //   cost: "true",
              //   currency: "SAR ",
              // },

              // {
              //   id: "Purpose",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              //   type: "text",
              //   value: "",
              //   required: "true",
              // },

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  // this.bcw_add(item, modal_data);
                  var bcw_source_data_array = [];
                  var bcw_source_data = {
                    Operation: "U", ComponentId: event.data.ComponentId, WbsId: event.data.WbsId,
                    CivilItem: modal_data.inputs[0].value, Category: "C"
                  };
                  //  bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";

                  bcw_source_data_array.push(bcw_source_data);

                  // if (item.length == 0)
                  //   item.source2.load(bcw_source_data_array);

                  // else
                  //   item.source2.add(bcw_source_data);

                  // item.length++;
                  item.source2.update(event.data, bcw_source_data);
                  item.source2.refresh();

                  // var x = 0;
                  // for (var i = 0; i < item.source.data.length; i++) {
                  //   x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
                  // }

                  // item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                  item.source2.refresh();

                  var data_temp = [];
                  bcw_source_data_array.push(bcw_source_data);
                  data_temp.push(bcw_source_data);
                  //  data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
                  //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
                  data_temp[0]["ComponentId"] = event.data.ComponentId;
                  data_temp[0]["WbsId"] = event.data.WbsId;
                  data_temp[0]["Index"] = event.data.Index;

                  //    var comptotcost = data_temp[0]["TotalCost"];

                  var costcomptemp = [{
                    "Operation": "U",
                    "LoanId": this.loan_id,
                    "CompName": bcw_source_data["CivilItem"],
                    "CompType": "BC",
                    "CompTotCost": item.TotalCost,
                    "CompTotCostCurr": "SAR",
                    "ComponentId": data_temp[0]["ComponentId"],
                    "WbsId": data_temp[0]["WbsId"]
                  }];
                  costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
                  var post_data = {
                    "LoanId": this.loan_id,
                    "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                    "CustomerId": this.CustomerId,
                    "ProfileId": this.ProfileId,
                    "CostComp": costcomptemp,
                    "Bcw": data_temp,
                  };
                  this.Ng4LoadingSpinnerService.show();
                  this.onSave(post_data, item.panelStep);

                  this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

                }
              }
            ]
          };

        }
      }
      let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
      techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
      this.techInfoModalParams_g = technicaltableinfoModalParams;
      this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
    }
    else {
      this.commonService.showFailureToast("Cannot Edit");
    }
  }


  onSaveManufacProd(post_data) {
    var err_temp;
    if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
      this.LoanTechnicalService.postManfacProducts(post_data)
        .then((res) => (
          this.onResult(res),
          this.items_refresh(),
          this.LoanTechnicalService
            .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
            .then((res) => (this.resolveTechnicalInfo(res),
              this.Ng4LoadingSpinnerService.hide()), err => (
                err_temp = err)
            ),
          err => (this.Ng4LoadingSpinnerService.hide())));
  }

  onAddMachExtra(event, table_name) {
    try {
      console.log(event);
      let technicaltableinfoModalParams = {};
      if (this.machinery_localdatasource_array.length > 0) {
        if (this.machinery_localdatasource_array[0].data.length != 0) {



          if (table_name === 'ManufacturingStages') {

            //  if (this.machineries_desc_list.length != 0) {

            technicaltableinfoModalParams = {

              header: this.translate.instant('MARKETING_INFORMATION.AddManufacturingStages'),

              isLogistics: this.isLogistics,

              inputs: [

                {
                  id: "StageSequence",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProcessDescription') : this.translate.instant('MARKETING_INFORMATION.StageSequence'),
                  type: this.isLogistics ? "string" : "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "MachineName",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.EquipmentUsed') : this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
                  type: this.isLogistics ? "text" : "select",
                  value: this.isLogistics ? "" : this.machineries_desc_list,
                  selected: "",
                  required: "true",
                  // visible: true,
                },
                // {
                //   id: "MachineName",
                //   name: this.translate.instant('MARKETING_INFORMATION.MachineName'),
                //   type: "text",
                //   value: "",
                //   required: "true",
                // },
                {
                  id: "Operators",
                  name: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
                  type: "number",
                  value: "",
                  required: "true",
                  hideable: this.isLogistics ? true : false
                },
                {
                  id: "ProductionCapacity",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProductionRate') : this.translate.instant('MARKETING_INFORMATION.ProductionCapacity'),
                  type: "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "ProductionUom",
                  name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
                  type: "select",
                  value: this.uom_text,
                  selected: "",
                  required: "true",
                  visible: true,
                  hideable: this.isLogistics ? true : false
                },
                {
                  id: "StageName",
                  name: this.translate.instant('MARKETING_INFORMATION.StageName'),
                  type: "text",
                  value: "",
                  required: "true",
                  hideable: this.isLogistics ? true : false
                }

              ],
              buttons: [
                {
                  name: this.translate.instant('COMMON.Save'),
                  type: "button",
                  class: "btn-success",

                  handler: (modal_data) => {
                    var manufacturing_stages_source_data_array = [];
                    var manufacturing_stages_source_data;
                    var post_data;
                    if (!this.isLogistics) {

                      var machine_id_temp = _.where(this.machineries_list, { Desc: modal_data.inputs[1].selected })
                      //panel_temp = _.where(this.panel_items, { typesel: "ME" });
                      manufacturing_stages_source_data = {
                        Operation: "C", StageId: "",
                        StageSequence: modal_data.inputs[0].value, MachineName: modal_data.inputs[1].selected,
                        Operators: modal_data.inputs[2].value, ProductionCapacity: modal_data.inputs[3].value,
                        ProductionUom: modal_data.inputs[4].selected, StageName: modal_data.inputs[5].value,
                        MachineId: machine_id_temp[0].Id
                      };

                      var unit = this.uom_list.find((o) => o.NameAr == manufacturing_stages_source_data["ProductionUom"]||o.Name == manufacturing_stages_source_data["ProductionUom"]);
                      if (unit)
                        manufacturing_stages_source_data["ProductionUom"] = unit.Code;

                      post_data = {
                        "FinancingPlan": this.loan_id,
                        "Indicator": "M",
                        "ManufacturingStages": [
                          {
                            "Operation": "C",
                            "StageId": manufacturing_stages_source_data["StageId"],
                            "StageSequence": manufacturing_stages_source_data["StageSequence"],
                            "MachineId": manufacturing_stages_source_data["MachineId"],
                            "MachineName": manufacturing_stages_source_data["MachineName"],
                            "Operators": manufacturing_stages_source_data["Operators"],
                            "ProductionCapacity": manufacturing_stages_source_data["ProductionCapacity"],
                            "ProductionUom": manufacturing_stages_source_data["ProductionUom"],
                            "StageName": manufacturing_stages_source_data["StageName"],
                            "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                          }
                        ]
                      };
                      console.log(post_data);
                      this.Ng4LoadingSpinnerService.show();
                      this.onSaveManufacProd(post_data);
                    } else {
                      manufacturing_stages_source_data = {
                        Operation: "C",
                        StageSequence: modal_data.inputs[0].value, MachineName: modal_data.inputs[1].value,
                        ProductionCapacity: modal_data.inputs[3].value
                      };

                      post_data = {
                        "FinancingPlan": this.loan_id,
                        "Indicator": "L",
                        "Operation": this.applicableSpec_logistics,
                        "ManufacturingStages": [
                          {
                            "Operation": "C",
                            "StageSequence": manufacturing_stages_source_data["StageSequence"],
                            "MachineName": manufacturing_stages_source_data["MachineName"],
                            "ProductionCapacity": manufacturing_stages_source_data["ProductionCapacity"],
                            "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                          }
                        ]
                      };
                      this.Ng4LoadingSpinnerService.show();
                      this.onSaveManufacProd(post_data);
                    }

                    // manufacturing_stages_source_data_array.push(manufacturing_stages_source_data);

                    // if (this.manufacturing_stages_source_length == 0)
                    //   this.manufacturing_stages_source.load(manufacturing_stages_source_data_array);

                    // else
                    //   this.manufacturing_stages_source.add(manufacturing_stages_source_data);

                    // this.manufacturing_stages_source_length++;

                    // this.manufacturing_stages_source.refresh();

                    // this.commonService.showSuccessToast("Addition successful !");

                  }
                }
              ]
            };

            // if(this.isLogistics === 'false'){
            //   console.log("Logistics");
            //   var techInfoModalParamsLogistics = technicaltableinfoModalParams;
            //   var inputsArray = technicaltableinfoModalParams["inputs"].slice(0,1);
            //   inputsArray.push(technicaltableinfoModalParams["inputs"].slice(1,2)[0]);
            //   inputsArray.push(technicaltableinfoModalParams["inputs"].slice(3,4)[0]);
            //   inputsArray[0].name = this.translate.instant('TECHNICAL_INFORMATION.ProcessDescription');
            //   inputsArray[0].type = "text";
            // }

            let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
            techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
            this.techInfoModalParams_g = technicaltableinfoModalParams;
            this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
            // }
            // else {
            //   this.commonService.showFailureToast("Please fill Machinery Details in Technical Information");
            // }

          }
          if (table_name === 'ProductionLines') {
            var dropdownList_temp = [];
            //  if (this.machineries_desc_list.length != 0) {
            for (var i = 0; i < this.machineries_list.length; i++) {
              dropdownList_temp.push({ "id": this.machineries_list[i].Id, "itemName": this.machineries_list[i].Desc });
            }
            technicaltableinfoModalParams = {

              header: this.translate.instant('MARKETING_INFORMATION.AddInstalledCapacities'),
              isProdMachExtra: "Y",
              isLogistics: this.isLogistics,
              inputs: [

                {
                  id: "Description",
                  name: this.translate.instant('TECHNICAL_INFORMATION.Product'),
                  type: "select",
                  selected: "",
                  value: this.product_list_name,
                  required: "true",
                  hideable: this.isLogistics ? true : false
                },

                {
                  id: "ProdLineMachinery",
                  name: this.translate.instant('TECHNICAL_INFORMATION.AddMachinesToLine'),
                  type: "multiselect",
                  //   value: [
                  //     {"id":2,"itemName":"Singapore"},
                  //     {"id":3,"itemName":"Australia"},
                  //     {"id":4,"itemName":"Canada"},
                  //     {"id":5,"itemName":"South Korea"}
                  // ],
                  value: "",
                  required: "true",
                  dropdownSettings: {
                    singleSelection: false,
                    text: this.translate.instant('TECHNICAL_INFORMATION.SelectProductionLineMachineries'),
                    selectAllText: this.translate.instant('TECHNICAL_INFORMATION.SelectAll'),
                    unSelectAllText: this.translate.instant('TECHNICAL_INFORMATION.UnSelectAll'),
                    enableSearchFilter: true,
                    classes: "myclass custom-class"
                  },
                  dropdownList: dropdownList_temp,
                  hidden: this.isLogistics ? true : false,
                  hideable: this.isLogistics ? true : false
                },


                {
                  id: "Rate",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.StaticCapacity') : this.translate.instant('TECHNICAL_INFORMATION.CapacityPerShift'),
                  type: "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "CapacityUnit",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.FlowRate') : this.translate.instant('TECHNICAL_INFORMATION.CapacityUnitOfMeasure'),
                  type: "text",
                  value: "",
                  required: "true",
                },
                // {
                //   id: "AnnualCapacity",
                //   name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
                //   type: "select",
                //   value: this.uom_text,
                //   // selected: this.selected_unit_name,
                //   required: "true",
                //   visible: true
                // },

                {
                  id: "ShifHours",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.Process') : this.translate.instant('TECHNICAL_INFORMATION.ShiftHours'),
                  type: this.isLogistics ? "text" : "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "ShiftPerDay",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProductType') : this.translate.instant('TECHNICAL_INFORMATION.ShiftPerDay'),
                  type: this.isLogistics ? "string" : "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "DaysPerYear",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear') : this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear'),
                  type: "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "PercentageEfficiency",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.LevelofEfficiency') : this.translate.instant('TECHNICAL_INFORMATION.PercentageEfficiency'),
                  type: "number",
                  value: "",
                  required: "true",
                },
                {
                  id: "AnnualCapacity",
                  name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.AnnualCapacity') : this.translate.instant('TECHNICAL_INFORMATION.AnnualCapacity'),
                  type: this.isLogistics ? "text" : "text_disabled",
                  value: "",
                  required: "true",
                },
                {
                  id: "GuiId",
                  name: this.translate.instant('TECHNICAL_INFORMATION.UnitofMeasure'),
                  type: "text",
                  value: "",
                  required: "true",
                  hideable: this.isLogistics ? false : true
                },

              ],
              buttons: [
                {
                  name: this.translate.instant('COMMON.Save'),
                  type: "button",
                  class: "btn-success",

                  handler: (modal_data) => {
                    var production_lines_source_data;
                    var post_data;
                    if (!this.isLogistics) {
                      production_lines_source_data = {
                        Operation: "C", ProductionLineId: "",
                        Description: modal_data.inputs[0].selected, Rate: modal_data.inputs[2].value,
                        CapacityUnit: modal_data.inputs[3].value, ShifHours: modal_data.inputs[4].value,
                        ShiftPerDay: modal_data.inputs[5].value, DaysPerYear: modal_data.inputs[6].value,
                        PercentageEfficiency: modal_data.inputs[7].value, AnnualCapacity: modal_data.inputs[8].value
                      };

                      var unit1 = this.product_list.find((o) => o.ProductName == production_lines_source_data["Description"]);
                      if (unit1)
                        production_lines_source_data["Description"] = unit1.ProductId;

                      console.log(production_lines_source_data);
                      var ProductionLines_temp = [];
                      for (var i = 0; i < modal_data.inputs[1].value.length; i++) {
                        ProductionLines_temp.push({ "Operation": "C", "MachineId": modal_data.inputs[1].value[i].id, "MachineName": modal_data.inputs[1].value[i].itemName });
                      }

                      post_data = {
                        "FinancingPlan": this.loan_id,
                        "Indicator": "P",
                        "ProductionLines": [
                          {
                            "Operation": "C",
                            "ProductionLineId": "",
                            "ProdLineMachinery": ProductionLines_temp,
                            "Description": production_lines_source_data["Description"],
                            "Rate": production_lines_source_data["Rate"],
                            "CapacityUnit": production_lines_source_data["CapacityUnit"],
                            "AnnualCapacity": production_lines_source_data["AnnualCapacity"],
                            "ShifHours": production_lines_source_data["ShifHours"],
                            "ShiftPerDay": production_lines_source_data["ShiftPerDay"],
                            "DaysPerYear": production_lines_source_data["DaysPerYear"],
                            "PercentageEfficiency": production_lines_source_data["PercentageEfficiency"],
                            "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                          }
                        ]
                      };
                      console.log(post_data);
                      this.Ng4LoadingSpinnerService.show();
                      this.onSaveManufacProd(post_data);
                    }
                    else {
                      production_lines_source_data = {
                        Operation: "C", Rate: modal_data.inputs[2].value,
                        CapacityUnit: modal_data.inputs[3].value, ShifHours: modal_data.inputs[4].value,
                        ShiftPerDay: modal_data.inputs[5].value, DaysPerYear: modal_data.inputs[6].value,
                        PercentageEfficiency: modal_data.inputs[7].value, AnnualCapacity: modal_data.inputs[8].value,
                        GuiId: modal_data.inputs[9].value
                      };

                      post_data = {
                        "FinancingPlan": this.loan_id,
                        "Indicator": "L",
                        "Operation": this.applicableSpec_logistics,
                        "ProductionLines": [
                          {
                            "Operation": "C",
                            "Rate": production_lines_source_data["Rate"],
                            "CapacityUnit": production_lines_source_data["CapacityUnit"],
                            "AnnualCapacity": production_lines_source_data["AnnualCapacity"],
                            "ShifHours": production_lines_source_data["ShifHours"],
                            "ShiftPerDay": production_lines_source_data["ShiftPerDay"],
                            "DaysPerYear": production_lines_source_data["DaysPerYear"],
                            "PercentageEfficiency": production_lines_source_data["PercentageEfficiency"],
                            "GuiId": production_lines_source_data["GuiId"],
                            "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                          }
                        ]
                      };
                      console.log(post_data);
                      this.Ng4LoadingSpinnerService.show();
                      this.onSaveManufacProd(post_data);
                    }


                  }
                }
              ]
            };


            let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
            techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
            this.techInfoModalParams_g = technicaltableinfoModalParams;
            this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
            // }
            // else {
            //   this.commonService.showFailureToast("Please fill Machinery Details in Technical Information");
            // }

          }
        }
        else {
          this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Youneedtoaddmachineries,beforeaddingmanufacturingstages/productionlines'));
        }
      }
      else {
        this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Youneedtoaddmachineries,beforeaddingmanufacturingstages/productionlines'));
      }
    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.Adding') + " " + table_name + " " + this.translate.instant('COMMON.failed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }
  }


  onDeleteMachExtra(delete_cancel_modal, event, table_name) {
    let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
    delete options.size;
    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal, options);
    this.deleteCancelModalReference.event = event;
    this.deleteCancelModalReference.table_name = table_name;
    //this.deleteCancelModalReference.table_code = table_code;
    if (table_name === 'Manufacturing Stages')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('TECHNICAL_INFORMATION.ManufacturingStages');
    else if (table_name === 'Production Lines')
      this.deleteCancelModalReference.table_name_display = this.translate.instant('TECHNICAL_INFORMATION.InstalledCapacities');
    this.deleteCancelModalReference.item = "";
    this.deleteCancelModalReference.action = this.translate.instant('TECHNICAL_INFORMATION.Delete');
  }

  onViewMachExtra(event, table_name) {
    try {
      console.log(event);
      let technicaltableinfoModalParams = {};
      if (table_name === 'ManufacturingStages') {

        //  if (this.machineries_desc_list.length != 0) {
        var prodUom_temp;
        var unit = this.uom_list.find((o) => o.Code == event.data.ProductionUom);
        if (unit)
          prodUom_temp = unit.Name;

        technicaltableinfoModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddManufacturingStages'),
          method: "view",
          inputs: [

            {
              id: "StageSequence",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProcessDescription') : this.translate.instant('MARKETING_INFORMATION.StageSequence'),
              type: this.isLogistics ? "string" : "number",
              value: event.data.StageSequence,
              required: "true",
            },
            {
              id: "MachineName",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.EquipmentUsed') : this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
              type: "text",
              value: event.data.MachineName,
              required: "true",
            },
            // {
            //   id: "MachineName",
            //   name: this.translate.instant('MARKETING_INFORMATION.MachineName'),
            //   type: "text",
            //   value: "",
            //   required: "true",
            // },
            {
              id: "Operators",
              name: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
              type: "number",
              value: event.data.Operators,
              required: "true",
              hideable: this.isLogistics ? true : false
            },
            {
              id: "ProductionCapacity",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProductionRate') : this.translate.instant('MARKETING_INFORMATION.ProductionCapacity'),
              type: "number",
              value: event.data.ProductionCapacity,
              required: "true",
            },
            {
              id: "ProductionUom",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
              type: "text",
              value: prodUom_temp,
              required: "true",
              visible: true,
              hideable: this.isLogistics ? true : false
            },
            {
              id: "StageName",
              name: this.translate.instant('MARKETING_INFORMATION.StageName'),
              type: "text",
              value: event.data.StageName,
              required: "true",
              hideable: this.isLogistics ? true : false
            }

          ],
          buttons: [

          ]
        };


        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
        this.techInfoModalParams_g = technicaltableinfoModalParams;
        this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
        // }
        // else {
        //   this.commonService.showFailureToast("Please fill Machinery Details in Technical Information");
        // }

      }
      if (table_name === 'ProductionLines') {
        var Quantity_UOM2;
        if (event.data.Description != null) {
          var unit2 = this.product_list.find((o) => o.ProductId == event.data.Description);
          if (unit2)
            Quantity_UOM2 = unit2.ProductName;
        }
        //  if (this.machineries_desc_list.length != 0) {
        var dropdownList_temp = [];
        var dropdownList_temp2 = [];
        if (!this.isLogistics) {
          for (var i = 0; i < this.machineries_list.length; i++) {
            dropdownList_temp.push({ "id": this.machineries_list[i].Id, "itemName": this.machineries_list[i].Desc });
          }
          for (var i = 0; i < event.data.ProdLineMachinery.length; i++) {
            dropdownList_temp2.push({ "id": event.data.ProdLineMachinery[i].MachineId, "itemName": event.data.ProdLineMachinery[i].MachineName });
          }
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.ViewInstalledCapacities'),
          method: "view",
          inputs: [

            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Product'),
              type: "text",
              value: Quantity_UOM2,
              required: "true",
              hideable: this.isLogistics ? true : false
            },
            {
              id: "ProdLineMachinery",
              name: this.translate.instant('TECHNICAL_INFORMATION.AddMachinesToLine'),
              type: "multiselect",
              //   value: [
              //     {"id":2,"itemName":"Singapore"},
              //     {"id":3,"itemName":"Australia"},
              //     {"id":4,"itemName":"Canada"},
              //     {"id":5,"itemName":"South Korea"}
              // ],
              value: dropdownList_temp2,
              required: "true",
              dropdownSettings: {
                singleSelection: false,
                text: this.translate.instant('TECHNICAL_INFORMATION.AddMachinesToLine'),
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                enableSearchFilter: true,
                classes: "myclass custom-class",
                disabled: true
              },
              dropdownList: dropdownList_temp,
              hidden: this.isLogistics ? true : false,
              hideable: this.isLogistics ? true : false
            },
            // {
            //   id: "AddMachToLine",
            //   name: "Add machines to line",
            //   type: "text",
            //   value: event.data.AddMachToLine,
            //   required: "true",
            // },

            {
              id: "Rate",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.StaticCapacity') : this.translate.instant('TECHNICAL_INFORMATION.CapacityPerShift'),
              type: "number",
              value: event.data.Rate,
              required: "true",
            },
            {
              id: "CapacityUnit",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.FlowRate') : this.translate.instant('TECHNICAL_INFORMATION.CapacityUnitOfMeasure'),
              type: "number",
              value: event.data.CapacityUnit,
              required: "true",
            },
            // {
            //   id: "AnnualCapacity",
            //   name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
            //   type: "select",
            //   value: this.uom_text,
            //   // selected: this.selected_unit_name,
            //   required: "true",
            //   visible: true
            // },
            {
              id: "ShifHours",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.Process') : this.translate.instant('TECHNICAL_INFORMATION.ShiftHours'),
              type: "text",
              value: event.data.ShifHours,
              required: "true",
            },
            {
              id: "ShiftPerDay",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProductType') : this.translate.instant('TECHNICAL_INFORMATION.ShiftPerDay'),
              type: "text",
              value: event.data.ShiftPerDay,
              required: "true",
            },
            {
              id: "DaysPerYear",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear') : this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear'),
              type: "text",
              value: event.data.DaysPerYear,
              required: "true",
            },
            {
              id: "PercentageEfficiency",
              name: this.translate.instant('TECHNICAL_INFORMATION.PercentageEfficiency'),
              type: "text",
              value: event.data.PercentageEfficiency,
              required: "true",
            },
            {
              id: "AnnualCapacity",
              name: this.translate.instant('TECHNICAL_INFORMATION.AnnualCapacity'),
              type: "text",
              value: event.data.AnnualCapacity,
              required: "true",
            },
            {
              id: "GuiId",
              name: this.translate.instant('TECHNICAL_INFORMATION.UnitofMeasure'),
              type: "text",
              value: event.data.GuiId,
              required: "true",
              hideable: this.isLogistics ? false : true
            },
          ],
          buttons: [

          ]
        };


        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
        this.techInfoModalParams_g = technicaltableinfoModalParams;
        this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
        // }
        // else {
        //   this.commonService.showFailureToast("Please fill Machinery Details in Technical Information");
        // }

      }
    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.Viewing') + " " + table_name + " " + this.translate.instant('COMMON.failed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }
  }

  onEditMachExtra(event, table_name) {
    try {
      console.log(event);
      let technicaltableinfoModalParams = {};
      if (table_name === 'ManufacturingStages') {

        //  if (this.machineries_desc_list.length != 0) {
        var prodUom_temp;
        var unit = this.uom_list.find((o) => o.Code == event.data.ProductionUom);
        if (unit)
          prodUom_temp = unit.Name;

        technicaltableinfoModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.AddManufacturingStages'),
          isLogistics: this.isLogistics,

          inputs: [

            {
              id: "StageSequence",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProcessDescription') : this.translate.instant('MARKETING_INFORMATION.StageSequence'),
              type: this.isLogistics ? "string" : "number",
              value: event.data.StageSequence,
              required: "true",
            },
            {
              id: "MachineName",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.EquipmentUsed') : this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
              type: this.isLogistics ? "text" : "select",
              value: this.isLogistics ? event.data.MachineName : this.machineries_desc_list,
              selected: this.isLogistics ? "" : event.data.MachineName,
              required: "true",
              //visible: true
            },
            // {
            //   id: "MachineName",
            //   name: this.translate.instant('MARKETING_INFORMATION.MachineName'),
            //   type: "text",
            //   value: event.data.StageName,
            //   required: "true",
            // },
            {
              id: "Operators",
              name: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
              type: "number",
              value: event.data.Operators,
              required: this.isLogistics ? "false" : "true",
              hideable: this.isLogistics ? true : false
            },
            {
              id: "ProductionCapacity",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProductionRate') : this.translate.instant('MARKETING_INFORMATION.ProductionCapacity'),
              type: "number",
              value: event.data.ProductionCapacity,
              required: "true",
            },
            {
              id: "ProductionUom",
              name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
              type: "select",
              value: this.uom_text,
              selected: prodUom_temp,
              required: this.isLogistics ? "false" : "true",
              visible: true,
              hideable: this.isLogistics ? true : false
            },
            {
              id: "StageName",
              name: this.translate.instant('MARKETING_INFORMATION.StageName'),
              type: "text",
              value: event.data.StageName,
              required: this.isLogistics ? "false" : "true",
              hideable: this.isLogistics ? true : false
            }

          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var manufacturing_stages_source_data_array = [];
                var manufacturing_stages_source_data = {};
                var post_data;
                if (!this.isLogistics) {
                  var machine_id_temp = _.where(this.machineries_list, { Desc: modal_data.inputs[1].selected })
                  //panel_temp = _.where(this.panel_items, { typesel: "ME" });
                  manufacturing_stages_source_data = {
                    Operation: "C", StageId: event.data.StageId,
                    StageSequence: modal_data.inputs[0].value, MachineName: modal_data.inputs[1].selected,
                    Operators: modal_data.inputs[2].value, ProductionCapacity: modal_data.inputs[3].value,
                    ProductionUom: modal_data.inputs[4].selected, StageName: modal_data.inputs[5].value,
                    MachineId: machine_id_temp[0].Id
                  };

                  var unit = this.uom_list.find((o) => o.NameAr == manufacturing_stages_source_data["ProductionUom"]||o.Name == manufacturing_stages_source_data["ProductionUom"]);
                  if (unit)
                    manufacturing_stages_source_data["ProductionUom"] = unit.Code;

                  post_data = {
                    "FinancingPlan": this.loan_id,
                    "Indicator": "M",
                    "ManufacturingStages": [
                      {
                        "Operation": "U",
                        "StageId": "",
                        "StageSequence": manufacturing_stages_source_data["StageSequence"],
                        "MachineId": manufacturing_stages_source_data["MachineId"],
                        "MachineName": manufacturing_stages_source_data["MachineName"],
                        "Operators": manufacturing_stages_source_data["Operators"],
                        "ProductionCapacity": manufacturing_stages_source_data["ProductionCapacity"],
                        "ProductionUom": manufacturing_stages_source_data["ProductionUom"],
                        "StageName": manufacturing_stages_source_data["StageName"],
                        "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                      }
                    ]
                  };
                  console.log(post_data);
                  this.Ng4LoadingSpinnerService.show();
                  this.onSaveManufacProd(post_data);
                } else {
                  manufacturing_stages_source_data = {
                    Operation: "C", StageId: event.data.StageId,
                    StageSequence: modal_data.inputs[0].value, MachineName: modal_data.inputs[1].value,
                    ProductionCapacity: modal_data.inputs[3].value
                  };

                  post_data = {
                    "FinancingPlan": this.loan_id,
                    "Indicator": "L",
                    "Operation": event.data.Operation ? event.data.Operation : this.applicableSpec_logistics,
                    "ManufacturingStages": [
                      {
                        "Operation": "U",
                        "StageId": manufacturing_stages_source_data["StageId"],
                        "StageSequence": manufacturing_stages_source_data["StageSequence"],
                        "MachineName": manufacturing_stages_source_data["MachineName"],
                        "ProductionCapacity": manufacturing_stages_source_data["ProductionCapacity"],
                        "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                      }
                    ]
                  };
                  this.Ng4LoadingSpinnerService.show();
                  this.onSaveManufacProd(post_data);
                }
                // manufacturing_stages_source_data_array.push(manufacturing_stages_source_data);

                // if (this.manufacturing_stages_source_length == 0)
                //   this.manufacturing_stages_source.load(manufacturing_stages_source_data_array);

                // else
                //   this.manufacturing_stages_source.add(manufacturing_stages_source_data);

                // this.manufacturing_stages_source_length++;

                // this.manufacturing_stages_source.refresh();

                // this.commonService.showSuccessToast("Addition successful !");

              }
            }
          ]
        };


        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
        this.techInfoModalParams_g = technicaltableinfoModalParams;
        this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
        // }
        // else {
        //   this.commonService.showFailureToast("Please fill Machinery Details in Technical Information");
        // }

      }
      if (table_name === 'ProductionLines') {

        var Quantity_UOM2;
        if (event.data.Description != null) {
          var unit2 = this.product_list.find((o) => o.ProductId == event.data.Description);
          if (unit2)
            Quantity_UOM2 = unit2.ProductName;
        }

        //  if (this.machineries_desc_list.length != 0) {
        var dropdownList_temp = [];
        var dropdownList_temp2 = [];
        if (!this.isLogistics) {
          for (var i = 0; i < this.machineries_list.length; i++) {
            dropdownList_temp.push({ "id": this.machineries_list[i].Id, "itemName": this.machineries_list[i].Desc });
          }
          for (var i = 0; i < event.data.ProdLineMachinery.length; i++) {
            dropdownList_temp2.push({ "id": event.data.ProdLineMachinery[i].MachineId, "itemName": event.data.ProdLineMachinery[i].MachineName });
          }
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('MARKETING_INFORMATION.EditInstalledCapacities'),
          isProdMachExtra: "Y",
          isLogistics: this.isLogistics,
          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Product'),
              type: "select",
              selected: Quantity_UOM2,
              value: this.product_list_name,
              required: this.isLogistics ? "false" : "true",
              hideable: this.isLogistics ? true : false
            },
            {
              id: "ProdLineMachinery",
              name: this.translate.instant('TECHNICAL_INFORMATION.AddMachinesToLine'),
              type: "multiselect",
              //   value: [
              //     {"id":2,"itemName":"Singapore"},
              //     {"id":3,"itemName":"Australia"},
              //     {"id":4,"itemName":"Canada"},
              //     {"id":5,"itemName":"South Korea"}
              // ],
              value: dropdownList_temp2,
              required: this.isLogistics ? "false" : "true",
              dropdownSettings: {
                singleSelection: false,
                text: this.translate.instant('TECHNICAL_INFORMATION.SelectProductionLineMachineries'),
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                enableSearchFilter: true,
                classes: "myclass custom-class"
              },
              dropdownList: dropdownList_temp,
              hidden: this.isLogistics ? true : false,
              hideable: this.isLogistics ? true : false
            },
            // {
            //   id: "AddMachToLine",
            //   name: "Add machines to line",
            //   type: "text",
            //   value: event.data.AddMachToLine,
            //   required: "true",
            // },

            {
              id: "Rate",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.StaticCapacity') : this.translate.instant('TECHNICAL_INFORMATION.CapacityPerShift'),
              type: "number",
              value: event.data.Rate,
              required: "true",
            },
            {
              id: "CapacityUnit",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.FlowRate') : this.translate.instant('TECHNICAL_INFORMATION.CapacityUnitOfMeasure'),
              type: "text",
              value: event.data.CapacityUnit,
              required: "true",
            },
            // {
            //   id: "AnnualCapacity",
            //   name: this.translate.instant('MARKETING_INFORMATION.ProductionUnitofMeasure'),
            //   type: "select",
            //   value: this.uom_text,
            //   // selected: this.selected_unit_name,
            //   required: "true",
            //   visible: true
            // },
            {
              id: "ShifHours",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.Process') : this.translate.instant('TECHNICAL_INFORMATION.ShiftHours'),
              type: this.isLogistics ? "text" : "number",
              value: event.data.ShifHours,
              required: "true",
            },
            {
              id: "ShiftPerDay",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.ProductType') : this.translate.instant('TECHNICAL_INFORMATION.ShiftPerDay'),
              type: this.isLogistics ? "string" : "number",
              value: event.data.ShiftPerDay,
              required: "true",
            },
            {
              id: "DaysPerYear",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear') : this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear'),
              type: "number",
              value: event.data.DaysPerYear,
              required: "true",
            },
            {
              id: "PercentageEfficiency",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.LevelofEfficiency') : this.translate.instant('TECHNICAL_INFORMATION.PercentageEfficiency'),
              type: "number",
              value: event.data.PercentageEfficiency,
              required: "true",
            },
            {
              id: "AnnualCapacity",
              name: this.isLogistics ? this.translate.instant('TECHNICAL_INFORMATION.AnnualCapacity') : this.translate.instant('TECHNICAL_INFORMATION.AnnualCapacity'),
              type: this.isLogistics ? "text" : "text_disabled",
              value: event.data.AnnualCapacity,
              required: "true",
            },
            {
              id: "GuiId",
              name: this.translate.instant('TECHNICAL_INFORMATION.UnitofMeasure'),
              type: "text",
              value: event.data.GuiId,
              required: this.isLogistics ? "true" : "false",
              hideable: this.isLogistics ? false : true
            },
          ],
          buttons: [
            {
              name: this.translate.instant('COMMON.Save'),
              type: "button",
              class: "btn-success",

              handler: (modal_data) => {

                var production_lines_source_data_array = [];
                var production_lines_source_data = {};
                var post_data;
                //var production_lines_source_data_2 = {};


                if (!this.isLogistics) {
                  production_lines_source_data = {
                    Operation: "C", ProductionLineId: event.data.ProductionLineId,
                    Description: modal_data.inputs[0].selected, Rate: modal_data.inputs[2].value,
                    CapacityUnit: modal_data.inputs[3].value, ShifHours: modal_data.inputs[4].value,
                    ShiftPerDay: modal_data.inputs[5].value, DaysPerYear: modal_data.inputs[6].value,
                    PercentageEfficiency: modal_data.inputs[7].value, AnnualCapacity: modal_data.inputs[8].value
                  };
                  var unit1 = this.product_list.find((o) => o.ProductName == production_lines_source_data["Description"]);
                  if (unit1)
                    production_lines_source_data["Description"] = unit1.ProductId;

                  console.log(production_lines_source_data);
                  var ProductionLines_temp = [];
                  for (var i = 0; i < modal_data.inputs[1].value.length; i++) {
                    ProductionLines_temp.push({ "Operation": "C", "MachineId": modal_data.inputs[1].value[i].id, "MachineName": modal_data.inputs[1].value[i].itemName });
                  }

                  post_data = {
                    "FinancingPlan": this.loan_id,
                    "Indicator": "P",
                    "ProductionLines": [
                      {
                        "Operation": "U",
                        "ProductionLineId": production_lines_source_data["ProductionLineId"],
                        "ProdLineMachinery": ProductionLines_temp,
                        "Description": production_lines_source_data["Description"],
                        "Rate": production_lines_source_data["Rate"],
                        "CapacityUnit": production_lines_source_data["CapacityUnit"],
                        "AnnualCapacity": production_lines_source_data["AnnualCapacity"],
                        "ShifHours": production_lines_source_data["ShifHours"],
                        "ShiftPerDay": production_lines_source_data["ShiftPerDay"],
                        "DaysPerYear": production_lines_source_data["DaysPerYear"],
                        "PercentageEfficiency": production_lines_source_data["PercentageEfficiency"],
                        "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                      }
                    ]
                  };
                  console.log(post_data);
                  this.Ng4LoadingSpinnerService.show();
                  this.onSaveManufacProd(post_data);
                } else {
                  production_lines_source_data = {
                    Operation: "C", ProductionLineId: event.data.ProductionLineId, Rate: modal_data.inputs[2].value,
                    CapacityUnit: modal_data.inputs[3].value, ShifHours: modal_data.inputs[4].value,
                    ShiftPerDay: modal_data.inputs[5].value, DaysPerYear: modal_data.inputs[6].value,
                    PercentageEfficiency: modal_data.inputs[7].value, AnnualCapacity: modal_data.inputs[8].value,
                    GuiId: modal_data.inputs[9].value
                  };

                  post_data = {
                    "FinancingPlan": this.loan_id,
                    "Indicator": "L",
                    "Operation": event.data.Operation ? event.data.Operation : this.applicableSpec_logistics,
                    "ProductionLines": [
                      {
                        "Operation": "U",
                        "ProductionLineId": production_lines_source_data["ProductionLineId"],
                        "Rate": production_lines_source_data["Rate"],
                        "CapacityUnit": production_lines_source_data["CapacityUnit"],
                        "AnnualCapacity": production_lines_source_data["AnnualCapacity"],
                        "ShifHours": production_lines_source_data["ShifHours"],
                        "ShiftPerDay": production_lines_source_data["ShiftPerDay"],
                        "DaysPerYear": production_lines_source_data["DaysPerYear"],
                        "PercentageEfficiency": production_lines_source_data["PercentageEfficiency"],
                        "GuiId": production_lines_source_data["GuiId"],
                        "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
                      }
                    ]
                  };
                  console.log(post_data);
                  this.Ng4LoadingSpinnerService.show();
                  this.onSaveManufacProd(post_data);
                }

              }
            }
          ]
        };


        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
        this.techInfoModalParams_g = technicaltableinfoModalParams;
        this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
        // }
        // else {
        //   this.commonService.showFailureToast("Please fill Machinery Details in Technical Information");
        // }

      }
    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.Editing') + " " + table_name + " " + this.translate.instant('COMMON.failed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }
  }

  onAdd(item) {
    try {
      let technicaltableinfoModalParams = {};
      this.techOptionSelected = item.typesel;
      let typsel = item.typesel;
      let typselname = item.typeselname;
      if (typsel == "ME") {
        this.refreshBidAnalysis();

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          alert: "true - ME",
          requestId: this.requestId,
          typselcode: typsel,
          inputs: [
            {
              id: "MachineName",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
              type: "text",
              value: "",
              required: "true",

            },
            {
              id: "MachineSpecs",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineSpecs'),
              type: "text",
              value: "",
              required: "false",

            },
            {
              id: "MachineDesc",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineDesc'),
              type: "text",
              value: "",
              required: "true",

            },
            {
              id: "MachineStatusId",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineStatusId'),
              type: "select",
              selected: "",
              value: this.machinery_status_desc,
              required: "true",

            },
            {
              id: "MachineCap",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineCap'),
              type: "text",
              value: "",
              required: "false",

            },
            {
              id: "QuotInvNo",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuotInvNo'),
              type: "text",
              value: "",
              required: "true",

            },
            {
              id: "QuotDate",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuotDate'),
              type: "calendar",
              value: "",
              required: "true",
              placeholder: "YYYY-MM-DD",

            },
            // {
            //   id: "ReeferenceNo",
            //   name: "Reference Number",
            //   type: "number",
            //   value: "",
            //   required: "true",
            // },
            {
              id: "SupplierId",
              name: this.translate.instant('TECHNICAL_INFORMATION.ManufacturerName'),
              type: "text",
              value: "",
              required: "true",

            },
            {
              id: "SuppOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.ManufacturerOrigin'),
              type: "select",
              selected: "",
              value: this.CountryDD_desc,
              required: "true",

            },
            {
              id: "SourceOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.SourceOrigin'),
              type: "select",
              selected: "",
              value: this.source_of_origin_machinery_desc,
              required: "true",

            },
            {
              id: "ConnecLoad",
              name: this.translate.instant('TECHNICAL_INFORMATION.ConnecLoad'),
              type: "number",
              value: "",
              required: "false",

            },
            {
              id: "PowerLoad",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachinePowerLoad'),
              type: "number",
              value: "",
              required: "false",

            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "number",
              value: "",
              required: "true",

            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "select",
              selected: "",
              value: this.quantityUOM_machinery_desc,
              required: "false",

            },
            {
              id: "Cost",
              name: this.translate.instant('TECHNICAL_INFORMATION.LocalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",

            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalLocalCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "ForeignCurrency",
              name: this.translate.instant('CONTRACTS.ForeignCurrency'),
              type: "select",
              value: this.CurrencyNameList,
              selected: "",
              required: "false",
            },
            {
              id: "ForeignCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.ForeignCost'),
              type: "text",
              value: "",
              required: "false",
              cost: "true",
              currency: "SAR ",

            },
            {
              id: "TotalForeignCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalForeignCost'),
              type: "text_disabled",
              value: "",
              required: "false",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "ShipmentTerms",
              name: this.translate.instant('TECHNICAL_INFORMATION.ShipmentTerms'),
              type: "text",
              value: "",
              required: "false",

            },
            {
              id: "TechSpecInc",
              name: this.translate.instant('TECHNICAL_INFORMATION.TechSpecInc'),
              type: "select",
              selected: "",
              value: this.yes_or_no,
              required: "true",

            },
            {
              id: "MachineryQuotationAttachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineryQuotationAttachment'),
              type: "file_multiple",
              file: "",
              required: "true",
              visible: true,
              value: "",

            },
            {
              id: "MachineryLayoutAttachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineryLayoutAttachment'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: "",

            },
            {
              id: "CustomClearanceAttachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.CustomClearanceAttachment'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: "",
              hideable: false,
            },
            // {
            //   id: "MachineryRawMaterialWarehouses",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.MachineryRawMaterialWarehouses'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   value: "",

            // },
            // {
            //   id: "MachineryFinishedGoods",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.MachineryFinishedGoods'),
            //   type: "file_multiple",
            //   file: "",
            //   required: "false",
            //   visible: true,
            //   value: "",

            // },
            {
              id: "TechnicalSpecification",
              name: this.translate.instant('TECHNICAL_INFORMATION.TechnicalSpecification'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: "",
              hideable: true
            },
            {
              name: "BidAnalysis",
              type: "table",
              id: "bidAnalysis",
              settings: this.me_BidAnalysis_settings,
              source: this.me_BidAnalysis_source,
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",
              handler: (modal_data) => {
                this.Ng4LoadingSpinnerService.show();
                var rand_num = this.commonService.returnRandomNumber();
                var upload_post = "";
                var count_check = 0;
                var count_check_2 = 0;
                //Machinery Quotation
                for (var i = 0; i < modal_data.inputs.length; i++) {
                  if (modal_data.inputs[i].file) {
                    count_check++;
                  }
                }
                if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryQuotationAttachment")].file) {
                  var data = {
                    documentDefId: 385,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  var temp = this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryQuotationAttachment")].file, data);
                  if (temp === "S")
                    count_check_2++;
                }
                //Machinery Layout
                if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryLayoutAttachment")].file) {
                  var data1 = {
                    documentDefId: 386,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  var temp = this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryLayoutAttachment")].file, data1);
                  if (temp === "S")
                    count_check_2++;
                }
                //Custom Clearance
                if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "CustomClearanceAttachment")].file) {
                  var data2 = {
                    documentDefId: 387,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "CustomClearanceAttachment")].file, data2);
                }
                //Machinery Raw material Warehouses
                if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TechnicalSpecification")].file) {
                  var data3 = {
                    documentDefId: 390,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  var temp = this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TechnicalSpecification")].file, data3);
                  if (temp === "S")
                    count_check_2++;
                }
                //Machinery Finished Goods
                // if (modal_data.inputs[20].file) {
                //   var data4 = {
                //     documentDefId: 389,
                //     entityId: this.requestId,
                //     entityName: "Project",
                //     RelatedEntityId: rand_num,
                //     RelatedEntityName: "technicalInfos",
                //     operationType: "l"
                //   };
                //   var temp = this.uploadDocumentFunction(modal_data.inputs[20].file, data4);
                //   if (temp === "S")
                //     count_check_2++;
                // }
                // //Technical Specification
                // if (modal_data.inputs[21].file) {
                //   var data5 = {
                //     documentDefId: 390,
                //     entityId: this.requestId,
                //     entityName: "Project",
                //     RelatedEntityId: rand_num,
                //     RelatedEntityName: "technicalInfos",
                //     operationType: "l"
                //   };
                //   var temp = this.uploadDocumentFunction(modal_data.inputs[21].file, data5);
                //   if (temp === "S")
                //     count_check_2++;
                // }
                //     if(count_check === count_check_2){

                this.machinery_add(item, modal_data, rand_num);

                // }
                // this.communicationsService.uploadDocumentService(modal_data.inputs[13].file, data)
                //   .then(reocumentFunction(modal_data.inputs[13].file, data);
                // this.communicationsService.uploadDocumentService(modal_data.inputs[13].file, data)
                //   .then(requests => (
                //     (
                //       upload_post = this.onDocumentUpload(requests),
                //           this.machinery_add(item, modal_data, rand_num);
                //       this.Ng4LoadingSpinnerService.hide()
                //     ), err => (this.Ng4LoadingSpinnerService.hide())));

              }
            }
          ]
        };

      }
      else if (typsel === 'BC') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          alert: "true - BC",
          typselcode: typsel,
          inputs: [
            {
              id: "CivilItem",
              name: "Building Name",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Area",
              name: "Built-Up Area(m2)",
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "ItemDesc",
              name: "Type of Structure",
              type: "select",
              value: this.BcwStructures_desc,
              selected: "",
              required: "true",
              visible: true
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: "",
              required: "true",
            },

          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {




                // this.communicationsService.uploadDocumentService(modal_data.inputs[4].file, data)
                //   .then(requests => (
                //     upload_post = this.onDocumentUpload(requests),
                this.bcw_add(item, modal_data);
                //     this.Ng4LoadingSpinnerService.hide()
                //   ), err => (this.Ng4LoadingSpinnerService.hide()));

              }
            }
          ]
        };

      }
      else if (typsel === 'VE') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [
            {
              id: "VehicleType",
              name: this.translate.instant('TECHNICAL_INFORMATION.VehicleType'),
              type: "select",
              selected: "",
              value: this.vehicle_type_desc,
              required: "true",
              //  hideable: false,
            },
            {
              id: "VehicleName",
              name: this.translate.instant('TECHNICAL_INFORMATION.VehicleName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "text_disabled",
              value: "Unit",
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.UnitCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentVehicle'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: ""
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                if (modal_data.inputs[7].file) {
                  this.Ng4LoadingSpinnerService.show();
                  var rand_num = this.commonService.returnRandomNumber();
                  var upload_post = "";
                  var data = {
                    documentDefId: 121,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };

                  this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
                    .then(requests => (
                      upload_post = this.onDocumentUpload(requests),
                      this.vehicle_add(item, modal_data, rand_num),
                      this.Ng4LoadingSpinnerService.hide()
                    ), err => (this.Ng4LoadingSpinnerService.hide()));
                }
                else {
                  this.vehicle_add(item, modal_data, rand_num);
                }



              }
            }
          ]
        };

      }
      else if (typsel === 'FU') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "number",
              value: "",
              required: "false",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "select",
              selected: "",
              value: this.uom_furnitures,
              required: "false",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
              type: "text",
              value: "",
              required: "false",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: "",
              required: "false",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentFurniture'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: ""
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                if (modal_data.inputs[6].file) {
                  this.Ng4LoadingSpinnerService.show();
                  var rand_num = this.commonService.returnRandomNumber();
                  var upload_post = "";
                  var data = {
                    documentDefId: 121,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };

                  this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
                    .then(requests => (
                      upload_post = this.onDocumentUpload(requests),
                      this.furniture_add(item, modal_data, upload_post, rand_num),
                      this.Ng4LoadingSpinnerService.hide()
                    ), err => (this.Ng4LoadingSpinnerService.hide()));
                }
                else {
                  this.furniture_add(item, modal_data, upload_post, rand_num);
                }



              }
            }
          ]
        };

      }
      else if (typsel === 'IT') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "OrderType",
              name: this.translate.instant('TECHNICAL_INFORMATION.OrderType'),
              type: "select",
              selected: "",
              value: this.it_order_type_desc,
              required: "true",
            },
            {
              id: "Category",
              name: this.translate.instant('TECHNICAL_INFORMATION.Category'),
              type: "select",
              selected: "",
              value: this.it_category_desc,
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "select",
              selected: "",
              value: this.IT_dd,
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "TotalCost_nb",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "Discount",
              name: this.translate.instant('TECHNICAL_INFORMATION.DiscountP'),
              type: "number",
              value: "",
              required: "false",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.NetCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: "",
              required: "false",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentIT'),
              type: "file_multiple",
              file: "",
              required: "true",
              visible: true,
              value: ""
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                if (modal_data.inputs[10].file) {

                  this.Ng4LoadingSpinnerService.show();
                  var rand_num = this.commonService.returnRandomNumber();
                  var upload_post = "";
                  var data = {
                    documentDefId: 121,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };

                  this.communicationsService.uploadDocumentService(modal_data.inputs[10].file, data)
                    .then(requests => (
                      upload_post = this.onDocumentUpload(requests),
                      this.infotech_add(item, modal_data, rand_num),
                      this.Ng4LoadingSpinnerService.hide()
                    ), err => (this.Ng4LoadingSpinnerService.hide()));
                }
                else {
                  this.infotech_add(item, modal_data, rand_num);
                }


              }
            }
          ]
        };

      }
      else if (typsel === 'PR') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,
          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
            },

            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentPreOperCosts'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: ""
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Save",
              class: "btn-success",

              handler: (modal_data) => {
                if (modal_data.inputs[2].file) {
                  this.Ng4LoadingSpinnerService.show();
                  var rand_num = this.commonService.returnRandomNumber();
                  var upload_post = "";
                  var data = {
                    documentDefId: 121,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };

                  this.communicationsService.uploadDocumentService(modal_data.inputs[2].file, data)
                    .then(requests => (
                      upload_post = this.onDocumentUpload(requests),
                      this.preoper_add(item, modal_data, upload_post, rand_num),
                      this.Ng4LoadingSpinnerService.hide()
                    ), err => (this.Ng4LoadingSpinnerService.hide()));
                }
                else {
                  this.preoper_add(item, modal_data, upload_post, rand_num);
                }


              }
            }
          ]
        };

      }
      else if (typsel === 'RA') {


        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [
            // {
            //   id: "Year",
            //   name: "Year",
            //   type: "select",
            //   selected: "",
            //   value: this.past_15_years,
            //   required: "true",
            // },

            {
              id: "RawMatName",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Product",
              name: this.translate.instant('TECHNICAL_INFORMATION.Product'),
              type: "select",
              selected: "",
              value: this.product_list_name,
              required: "true",
            },
            {
              id: "RawMatQuanPerUomProd",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProd'),
              type: "number",
              value: "",
              placeholder: this.translate.instant('TECHNICAL_INFORMATION.QuantityRequiredToManufactureProduct'),
              required: "true",
            },
            {
              id: "RawMatQuanPerUomProdUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProdUom'),
              type: "select",
              selected: "",
              value: this.uom_text,
              required: "true",
            },
            {
              id: "RawMatCostUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUom'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "CountryOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.CountryofOrigin'),
              type: "select",
              selected: "",
              value: this.CountryDD_desc,
              required: "true",

            },
            {
              id: "SuppName",
              name: this.translate.instant('TECHNICAL_INFORMATION.SuppName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "SourceOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.SourceOrigin'),
              type: "select",
              selected: "",
              value: this.source_of_origin_rawmat_desc,
              required: "true",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentRawMat'),
              type: "file_multiple",
              file: "",
              required: "true",
              visible: true,
              value: ""
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Save",
              class: "btn-success",

              handler: (modal_data) => {
                if (modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "attachment")].file) {//8
                  this.Ng4LoadingSpinnerService.show();
                  var rand_num = this.commonService.returnRandomNumber();
                  var upload_post = "";

                  var data = {
                    documentDefId: 398,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  this.uploadDocumentFunction(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "attachment")].file, data);
                  this.rawmat_add(item, modal_data, rand_num);
                }
                else {
                  this.rawmat_add(item, modal_data, rand_num);
                }
              }
            }
          ]
        };

      }
      else if (typsel === 'MA') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,
          alert: "true - MA",
          table_name: typselname,

          inputs: [
            {
              id: "Year",
              name: this.translate.instant('TECHNICAL_INFORMATION.YearOfHiring'),
              type: "select",
              selected: "",
              value: this.future_15_years,
              required: "false",
            },

            {
              id: "LabourType",
              name: this.translate.instant('TECHNICAL_INFORMATION.LabourType'),
              type: "select",
              selected: "",
              value: this.labour_type_desc,
              required: "true",
            },
            {
              id: "JobDesc",
              name: this.translate.instant('TECHNICAL_INFORMATION.JobDesc'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "NoPositions",
              name: this.translate.instant('TECHNICAL_INFORMATION.NoPositions'),
              type: "number",
              value: "",
              required: "true",
            },

            {
              id: "BasicMonthSal",
              name: this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSal'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCostMonthSal",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSal'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "AddBenefPerc",
              name: this.translate.instant('TECHNICAL_INFORMATION.AddBenefPerc'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "TotalSalary",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalSalary'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                var manpower_source_data_array = [];
                // var unit = this.labour_type.find((o) => o.Desc == item.uniqname);
                // if (unit)
                //   var component_name_code = unit.Id;

                var manpower_source_data = {
                  Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid, Year: modal_data.inputs[0].selected,
                  LabourType: modal_data.inputs[1].selected, JobDesc: modal_data.inputs[2].value,
                  NoPositions: modal_data.inputs[3].value, SalaryCurr: "SAR",
                  BasicMonthSal: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value), TotalCostMonthSal: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value),
                  AddBenefPerc: modal_data.inputs[6].value, TotalSalary: modal_data.inputs[7].value
                };

                var unit = this.labour_type.find((o) => o.DescAr == manpower_source_data["LabourType"]|| o.Desc == manpower_source_data["LabourType"]);
                if (unit)
                  manpower_source_data["LabourType"] = unit.Id;
                var component_name_code = unit.Id;
                manpower_source_data["TotalSalary"] = "SAR " + this.commonService.numberToNumberWithCommas((+manpower_source_data["TotalSalary"]).toFixed(2)) + "";
                manpower_source_data_array.push(manpower_source_data);

                if (item.length == 0) {
                  if (manpower_source_data["LabourType"] === "D")
                    item.source1.load(manpower_source_data_array);
                  if (manpower_source_data["LabourType"] === "I")
                    item.source2.load(manpower_source_data_array);
                }
                else {
                  if (manpower_source_data["LabourType"] === "D")
                    item.source1.add(manpower_source_data);
                  if (manpower_source_data["LabourType"] === "I")
                    item.source2.add(manpower_source_data);
                }

                item.length++;

                var x = 0;
                for (var i = 0; i < item.source1.data.length; i++) {
                  if (i === +item.source1.data.length - 1) {
                    x = +x + +manpower_source_data.TotalSalary.replace(/[^\d.-]/g, '');
                  }
                  else {
                    x = +x + +item.source1.data[i].TotalSalary.replace(/[^\d.-]/g, '');
                  }
                }
                for (var i = 0; i < item.source2.data.length; i++) {
                  if (i === +item.source2.data.length - 1) {
                    x = +x + +manpower_source_data.TotalSalary.replace(/[^\d.-]/g, '');
                  }
                  else {
                    x = +x + +item.source2.data[i].TotalSalary.replace(/[^\d.-]/g, '');
                  }
                }

                item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                item.source1.refresh();
                item.source2.refresh();


                var data_temp = [];
                //manpower_source_data_array.push(manpower_source_data);
                data_temp.push(manpower_source_data);
                data_temp[0]["TotalSalary"] = this.removeSAR(manpower_source_data["TotalSalary"]);
                data_temp[0]["BasicMonthSal"] = this.removeSAR(manpower_source_data["BasicMonthSal"]);
                data_temp[0]["TotalCostMonthSal"] = this.removeSAR(manpower_source_data["TotalCostMonthSal"]);
                //data_temp[0]["RawMatCostUom"] = this.removeSAR(manpower_source_data["RawMatCostUom"]);
                data_temp[0]["ComponentId"] = "";
                data_temp[0]["WbsId"] = "";

                var comptotcost = data_temp[0]["TotalSalary"];

                var costcomptemp = [{
                  "Operation": "C",
                  "LoanId": this.loan_id,
                  "CompName": manpower_source_data["JobDesc"],
                  "CompType": "MA",
                  "CompTotCost": comptotcost,
                  "CompTotCostCurr": "SAR"
                }];
                var post_data = {
                  "LoanId": this.loan_id,
                  "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                  "CustomerId": this.CustomerId,
                  "ProfileId": this.ProfileId,
                  "CostComp": costcomptemp,
                  "ManPower": data_temp,
                };
                this.Ng4LoadingSpinnerService.show();
                post_data = this.calcIndex(post_data);
                this.onSave(post_data, item.panelStep);


                this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

              }
            }
          ]
        };

      }
      else if (typsel === 'UT') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [
            // {
            //   id: "Year",
            //   name: "Year",
            //   type: "select",
            //   selected: "",
            //   value: this.future_15_years,
            //   required: "true",
            // },
            {
              id: "UtilityType",
              name: this.translate.instant('TECHNICAL_INFORMATION.UtilityType'),
              type: "select",
              selected: "",
              value: this.utility_type_desc,
              required: "true",
            },
            {
              id: "Unit",
              name: this.translate.instant('TECHNICAL_INFORMATION.UtilitiesUOM'),
              type: "select",
              selected: "",
              value: this.uom_text,
              required: "true",
            },
            {
              id: "UnitPrice",
              name: this.translate.instant('TECHNICAL_INFORMATION.UnitPrice'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalUse",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalUse'),
              type: "number",
              value: "",
              placeholder: this.translate.instant('TECHNICAL_INFORMATION.EnterTotalUsePerYear'),
              required: "true",
            },
            {
              id: "AnnualCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.AnnualCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            // {
            //   id: "UtilityMetCurr",
            //   name: "Utility MetCurr",
            //   type: "text",
            //   value: "",
            //   required: "true",
            // }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                var utilitiesdetail_source_data_array = [];
                var utilitiesdetail_source_data = {
                  Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid, Year: "",
                  UtilityType: modal_data.inputs[0].selected,
                  Unit: modal_data.inputs[1].selected, UnitPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[2].value),
                  TotalUse: modal_data.inputs[3].value, AnnualCost: modal_data.inputs[4].value,
                  UtilityMetCurr: ""
                };

                var unit1 = this.uom_list.find((o) => o.NameAr == utilitiesdetail_source_data["Unit"]|| o.Name == utilitiesdetail_source_data["Unit"]);
                if (unit1)
                  utilitiesdetail_source_data["Unit"] = unit1.Code;



                var unit = this.utility_type.find((o) => o.DescAr == utilitiesdetail_source_data["UtilityType"]||o.Desc == utilitiesdetail_source_data["UtilityType"]);
                if (unit)
                  utilitiesdetail_source_data["UtilityType"] = unit.Id;

                utilitiesdetail_source_data["AnnualCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+utilitiesdetail_source_data["AnnualCost"]).toFixed(2)) + "";
                utilitiesdetail_source_data_array.push(utilitiesdetail_source_data);

                if (item.length == 0)
                  item.source.load(utilitiesdetail_source_data_array);

                else
                  item.source.add(utilitiesdetail_source_data);

                item.length++;

                var x = 0;
                for (var i = 0; i < item.source.data.length; i++) {
                  if (i === +item.source.data.length - 1) {
                    x = +x + +utilitiesdetail_source_data.AnnualCost.replace(/[^\d.-]/g, '');
                  }
                  else {
                    x = +x + +item.source.data[i].AnnualCost.replace(/[^\d.-]/g, '');
                  }
                }

                item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
                item.source.refresh();

                var data_temp = [];
                //utilitiesdetail_source_data_array.push(utilitiesdetail_source_data);
                data_temp.push(utilitiesdetail_source_data);
                data_temp[0]["UnitPrice"] = this.removeSAR(utilitiesdetail_source_data["UnitPrice"]);
                data_temp[0]["AnnualCost"] = this.removeSAR(utilitiesdetail_source_data["AnnualCost"]);
                data_temp[0]["ComponentId"] = "";
                data_temp[0]["WbsId"] = "";

                var comptotcost = data_temp[0]["AnnualCost"];

                var costcomptemp = [{
                  "Operation": "C",
                  "LoanId": this.loan_id,
                  "CompName": modal_data.inputs[0].selected,
                  "CompType": "UT",
                  "CompTotCost": comptotcost,
                  "CompTotCostCurr": "SAR"
                }];
                var post_data = {
                  "LoanId": this.loan_id,
                  "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
                  "CustomerId": this.CustomerId,
                  "ProfileId": this.ProfileId,
                  "CostComp": costcomptemp,
                  "UtilitiesDetail": data_temp,
                };
                this.Ng4LoadingSpinnerService.show();
                post_data = this.calcIndex(post_data);
                this.onSave(post_data, item.panelStep);
                this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

              }
            }
          ]
        };

      }
      else if (typsel === 'SA') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
            },

            {
              id: "Category",
              name: this.translate.instant('TECHNICAL_INFORMATION.Category'),
              type: "select",
              selected: "",
              value: this.safety_category_desc,
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "select",
              selected: "",
              value: this.uom_text,
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },


            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentFireFighting'),
              type: "file_multiple",
              file: "",
              required: "true",
              visible: true,
              value: ""
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentFireAlarm'),
              type: "file_multiple",
              file: "",
              required: "true",
              visible: true,
              value: ""
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentEnvironmentImpact'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: ""
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentSafetyWorks'),
              type: "file_multiple",
              file: "",
              required: "true",
              visible: true,
              value: ""
            },

          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                this.Ng4LoadingSpinnerService.show();
                var rand_num = this.commonService.returnRandomNumber();
                var upload_post = "";
                if (modal_data.inputs[7].file) {
                  var data = {
                    documentDefId: 381,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  this.uploadDocumentFunction(modal_data.inputs[7].file, data);
                }
                if (modal_data.inputs[8].file) {
                  var data = {
                    documentDefId: 382,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  this.uploadDocumentFunction(modal_data.inputs[8].file, data);
                }
                if (modal_data.inputs[9].file) {
                  var data = {
                    documentDefId: 383,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  this.uploadDocumentFunction(modal_data.inputs[9].file, data);
                }
                if (modal_data.inputs[10].file) {
                  var data = {
                    documentDefId: 384,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };
                  this.uploadDocumentFunction(modal_data.inputs[10].file, data);
                }
                // this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
                //   .then(requests => (
                //     upload_post = this.onDocumentUpload(requests),
                this.safety_add(item, modal_data, rand_num);
                //     this.Ng4LoadingSpinnerService.hide()
                //   ), err => (this.Ng4LoadingSpinnerService.hide()));





              }
            }
          ]
        };

      }
      else if (typsel === 'KN') {

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.add') + " " + typselname, operation: "Add",
          typselcode: typsel,

          inputs: [

            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.LocalCost'),
              type: "text",
              value: "",
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "TotalCostCurr",
              name: this.translate.instant('TECHNICAL_INFORMATION.Currency'),
              type: "select",
              value: this.CurrencyNameList,
              selected: "",
              required: "false",
            },
            {
              id: "Currency",
              name: this.translate.instant('TECHNICAL_INFORMATION.ForeignCost'),
              type: "text",
              value: "",
              required: "false",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Duration",
              name: this.translate.instant('TECHNICAL_INFORMATION.DurationofAgreement'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "attachment",
              name: this.translate.instant('TECHNICAL_INFORMATION.attachmentKnowHow'),
              type: "file_multiple",
              file: "",
              required: "false",
              visible: true,
              value: ""
            }
          ],
          buttons: [
            {
              name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
              type: "Submit",
              class: "btn-success",

              handler: (modal_data) => {
                if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "attachment")].file) {
                  this.Ng4LoadingSpinnerService.show();
                  var rand_num = this.commonService.returnRandomNumber();
                  var upload_post = "";
                  var data = {
                    documentDefId: 121,
                    entityId: this.requestId,
                    entityName: "Project",
                    RelatedEntityId: rand_num,
                    RelatedEntityName: "technicalInfos",
                    operationType: "l"
                  };

                  this.communicationsService.uploadDocumentService(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "attachment")].file, data)
                    .then(requests => (
                      upload_post = this.onDocumentUpload(requests),
                      this.knowhowag_add(item, modal_data, rand_num),
                      this.Ng4LoadingSpinnerService.hide()
                    ), err => (this.Ng4LoadingSpinnerService.hide()));
                }
                else {
                  this.knowhowag_add(item, modal_data, rand_num);
                }

              }
            }
          ]
        };

      }


      let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
      techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
      this.techInfoModalParams_g = technicaltableinfoModalParams;
      this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');

    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.Adding') + " " + item.typeselname + " " + this.translate.instant('COMMON.failed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }
  }

  // panelpush() {
  //   //this.panel_items.push({panelStep: 4});
  //   //   this.panel_data.push({techInfoModalsForm : this.techInfoModalParams_g})
  // }

  setPanelStep(index: number) {
    this.panelStep = index;
  }

  nextPanelStep() {
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

  deleteCancelModalReference: any;

  startedFilling = 0;

  constructor(private translateService: TranslateService, private errorsHandler: ErrorsHandler, private route: ActivatedRoute, private loanApplicationService: LoanApplicationService, private communicationsService: CommunicationsService, public commonService: CommonService, private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService, private LoanTechnicalService: LoanTechnicalService, private toastr: ToastrService, private modalService: NgbModal, private router: Router,
    private customerProfileService: CustomerProfileService , private localStorage:LocalStorage) {

    this.translate = this.commonService.returnTranslate();
  
    this.tour_en = this.commonService.returnEnglishTour();
    this.tour_ar = this.commonService.returnArabicTour();

    this.initTableSettings();
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      // console.log(event.lang);
      this.initTableSettings();
      this.refreshBidAnalysis(); 
      
    });
  }

  initTableSettings(): void {
    this.machinery_settings_c = {
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
        MachineName: {
          title: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
          type: "string",
        },
        MachineDesc: {
          title: this.translate.instant('TECHNICAL_INFORMATION.MachineDesc'),
          type: "string"
        },
        QuotInvNo: {
          title: this.translate.instant('TECHNICAL_INFORMATION.QuotInvNo'),
          type: "number"
        },
        QuotDate: {
          title: this.translate.instant('TECHNICAL_INFORMATION.QuotDate'),
          type: "string"
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number",
        },
      }
    };
    this.machinery_quotation_settings_c = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

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
        columnTitle: this.translate.instant('COMMON.Actions'),
      },

      columns: {
        MachineName: {
          title: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
          type: "text"
        },
        Manufacturer: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Manufacturer'),
          type: "text",
        },
        OriginCountry: {
          title: this.translate.instant('TECHNICAL_INFORMATION.OriginCountry'),
          type: "text"
        },
        Capacity: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Capacity'),
          type: "number"
        },
        CapacityUOM: {
          title: this.translate.instant('TECHNICAL_INFORMATION.CapacityUOM'),
          type: "text"
        }
      }
    };
    this.bcw_settings_c = {
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
        CivilItem: {
          title: this.translate.instant('TECHNICAL_INFORMATION.CivilItem'),
          type: "string",
          width: "80%",
        },
      }
    };
    this.bcw_C_settings_c = {
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
        CivilItem: {
          title: this.translate.instant('TECHNICAL_INFORMATION.CivilItem'),
          type: "string",
          width: "80%",
        }
      }
    };
    this.vehicle_settings_c = {
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
        VehicleName: {
          title: this.translate.instant('TECHNICAL_INFORMATION.VehicleName'),
          type: "string",
        },
        Quantity: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
          type: "number"
        },
        SingleCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.UnitCost'),
          type: "number"
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number"
        },
      }
    };
    this.furniture_settings_c = {
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
        Description: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Description'),
          type: "string",
        },
        Quantity: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
          type: "string"
        },
        SingleCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
          type: "number"
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number"
        },
        Purpose: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
          type: "string"
        }
      }
    };
    this.infotech_settings_c = {
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
        Description: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Description'),
          type: "string",
        },
        Quantity: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
          type: "number"
        },
        SingleCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
          type: "string"
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.NetCost'),
          type: "number"
        },
        Purpose: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
          type: "string"
        }
      }
    };
    this.preopercosts_settings_c = {
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
        Description: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Description'),
          type: "string",
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number"
        },
      }
    };
    this.rawmaterial_settings_c = {
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
        RawMatName: {
          title: this.translate.instant('TECHNICAL_INFORMATION.RawMatName'),
          type: "string"
        },
        RawMatQuanPerUomProd: {
          title: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProd'),
          type: "string"
        },
        RawMatCostUom: {
          title: this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUom'),
          type: "number"
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number"
        },

      }
    };
    this.manpower_settings_c = {
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
        NoPositions: {
          title: this.translate.instant('TECHNICAL_INFORMATION.NoPositions'),
          type: "number"
        },
        BasicMonthSal: {
          title: this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSal'),
          type: "number"
        },
        TotalCostMonthSal: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSal'),
          type: "number"
        },
        AddBenefPerc: {
          title: this.translate.instant('TECHNICAL_INFORMATION.AddBenefPerc'),
          type: "string"
        },
        TotalSalary: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalSalary'),
          type: "number"
        },
      }
    };
    this.utilitiesdetail_settings_c = {
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
        TotalUse: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalUse'),
          type: "string"
        },
        UnitPrice: {
          title: this.translate.instant('TECHNICAL_INFORMATION.UnitPrice'),
          type: "number"
        },
        AnnualCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.AnnualCost'),
          type: "number"
        },
      }
    };
    this.safety_settings_c = {
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
        Description: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Description'),
          type: "string",
        },
        Quantity: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
          type: "number"
        },
        SingleCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
          type: "number"
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number"
        },
      }
    };
    this.knowhowag_settings_c = {
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
        Description: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Description'),
          type: "string",
        },
        TotalCost: {
          title: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
          type: "number"
        },

        Purpose: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
          type: "string"
        }
      }
    };
    this.manufacturing_stages_settings_c = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

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

        StageSequence: {
          title: this.translate.instant('MARKETING_INFORMATION.StageSequence'),
          type: "string",
        },
        MachineName: {
          title: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
          type: "string"
        },
        Operators: {
          title: this.translate.instant('MARKETING_INFORMATION.NumberofOperators'),
          type: "string",
        },
      }
    };
    this.production_lines_settings_c = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

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

        Description_desc: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Product'),
          type: "text",
          filter: false
        },
        Rate: {
          title: this.translate.instant('TECHNICAL_INFORMATION.CapacityPerShift'),
          type: "number",
          filter: false
        },
        ShifHours: {
          title: this.translate.instant('TECHNICAL_INFORMATION.ShiftHours'),
          type: "number",
          filter: false
        },
        ShiftPerDay: {
          title: this.translate.instant('TECHNICAL_INFORMATION.ShiftPerDay'),
          type: "number",
          filter: false
        },
        DaysPerYear: {
          title: this.translate.instant('TECHNICAL_INFORMATION.DaysPerYear'),
          type: "number",
          filter: false
        },
        PercentageEfficiency: {
          title: this.translate.instant('TECHNICAL_INFORMATION.PercentageEfficiency'),
          type: "number",
          filter: false
        },
      }
    };
    this.bcw_floor_settings_c = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

      add: {
        addButtonContent: '<i class="nb-plus" title="Add"></i>',
        createButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        cancelButtonContent: '<i class="nb-close" title="' + this.translate.instant('COMMON.Cancel') + '"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
        createButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        cancelButtonContent: '<i class="nb-close" title="' + this.translate.instant('COMMON.Cancel') + '"></i>',
        saveButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
        createButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        cancelButtonContent: '<i class="nb-close" title="' + this.translate.instant('COMMON.Cancel') + '"></i>',
        confirmDelete: true,
      },

      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions')
      },

      columns: {
        Floor: {
          title: this.translate.instant('TECHNICAL_INFORMATION.FloorNumber'),
          type: "number",
          filter: false,
          width: "40%"
        },
        Area: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Area') + " " + this.translate.instant('TECHNICAL_INFORMATION.metersquare'),
          type: "number",
          filter: false,
          width: "40%"
        }
      }
    };

    this.me_BidAnalysis_settings = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

      add: {
        addButtonContent: '<i class="nb-plus" title="Add"></i>',
        createButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        cancelButtonContent: '<i class="nb-close" title="' + this.translate.instant('COMMON.Cancel') + '"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="' + this.translate.instant('COMMON.Edit') + '"></i>',
        createButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        cancelButtonContent: '<i class="nb-close" title="' + this.translate.instant('COMMON.Cancel') + '"></i>',
        saveButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash" title="' + this.translate.instant('COMMON.Delete') + '"></i>',
        createButtonContent: '<i class="nb-checkmark" title="' + this.translate.instant('COMMON.Save') + '"></i>',
        cancelButtonContent: '<i class="nb-close" title="' + this.translate.instant('COMMON.Cancel') + '"></i>',
        confirmDelete: true,
      },

      actions: {
        position: "right",
        add: false,
        edit: true,
        delete: false,
        columnTitle: this.translate.instant('COMMON.Actions')
      },

      columns: {
        Item: {
          title: this.translate.instant('TECHNICAL_INFORMATION.Items'),
          type: "text",
          filter: false,
          editable: false
        },
        SelectedOffer: {
          title: this.translate.instant('TECHNICAL_INFORMATION.SelectedOffer'),
          type: "text",
          filter: false,
        },
        CompOffer1: {
          title: this.translate.instant('TECHNICAL_INFORMATION.CompetitiveOffer1'),
          type: "text",
          filter: false,
        },
        CompOffer2: {
          title: this.translate.instant('TECHNICAL_INFORMATION.CompetitiveOffer2'),
          type: "text",
          filter: false,
        }
      }
    };
  };

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

      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.CompletefillingtheTechnicalInformation!'));

    }

  }


  // onSaveValidation() {
  //   // let machinery_localdatasource_array_temp = [];
  //   // let manpower_localdatasource_array_temp = [];
  //   // var flag1 = 0;
  //   // var flag2 = 0;

  //   // var flag_mach = 0;
  //   // var flag_man = 0;

  //   // for (var i = 0; i < this.machinery_localdatasource_array.length; i++) {
  //   //   for (var j = 0; j < this.machinery_localdatasource_array[i].data.length; j++) {
  //   //     this.machinery_localdatasource_array[i].data[j]["Cost"] = this.machinery_localdatasource_array[i].data[j]["Cost"].replace(/[^\d.-]/g, '');
  //   //     this.machinery_localdatasource_array[i].data[j]["TotalCost"] = this.machinery_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //   //     if (this.machinery_localdatasource_array[i].data[j] != undefined) {
  //   //       machinery_localdatasource_array_temp.push(this.machinery_localdatasource_array[i].data[j]);
  //   //     }
  //   //   }
  //   // }

  //   // for (var i = 0; i < this.manpower_localdatasource_array.length; i++) {
  //   //   for (var j = 0; j < this.manpower_localdatasource_array[i].data.length; j++) {
  //   //     this.manpower_localdatasource_array[i].data[j]["BasicMonthSal"] = this.manpower_localdatasource_array[i].data[j]["BasicMonthSal"].replace(/[^\d.-]/g, '');
  //   //     this.manpower_localdatasource_array[i].data[j]["TotalCostMonthSal"] = this.manpower_localdatasource_array[i].data[j]["TotalCostMonthSal"].replace(/[^\d.-]/g, '');
  //   //     this.manpower_localdatasource_array[i].data[j]["TotalSalary"] = this.manpower_localdatasource_array[i].data[j]["TotalSalary"].replace(/[^\d.-]/g, '');

  //   //     if (this.manpower_localdatasource_array[i].data[j] != undefined) {
  //   //       manpower_localdatasource_array_temp.push(this.manpower_localdatasource_array[i].data[j]);
  //   //     }
  //   //   }
  //   // }

  //   // if (machinery_localdatasource_array_temp) {
  //   //   for (var x = 0; x < machinery_localdatasource_array_temp.length; x++) {
  //   //     if (machinery_localdatasource_array_temp[x].CompQuot) {
  //   //       if (machinery_localdatasource_array_temp[x].CompQuot.length === 0) {
  //   //         this.commonService.showFailureToast("Please submit atleast one quotation for all machinery and equipment items !");
  //   //         flag_mach = flag_mach + 1;
  //   //         break;
  //   //       }
  //   //       if (machinery_localdatasource_array_temp[x].CompQuot.length){
  //   //         var compquot_temp = 0;
  //   //         for(var y=0; y < machinery_localdatasource_array_temp[x].CompQuot.length; y++){
  //   //           if(machinery_localdatasource_array_temp[x].CompQuot[y].Operation === "D") {
  //   //             compquot_temp = compquot_temp + 1;
  //   //           }
  //   //         }
  //   //         if(compquot_temp === machinery_localdatasource_array_temp[x].CompQuot.length){
  //   //           this.commonService.showFailureToast("Please submit atleast one quotation for all machinery and equipment items !");
  //   //           flag_mach = flag_mach + 1;
  //   //           break;
  //   //         }
  //   //       }
  //   //       else if (machinery_localdatasource_array_temp[x].CompQuot.length === 0) {
  //   //         this.commonService.showFailureToast("Please submit atleast one quotation for all machinery and equipment items !");
  //   //         flag_mach = flag_mach + 1;
  //   //         break;
  //   //       }
  //   //     }
  //   //   }
  //   // }

  //   // if (manpower_localdatasource_array_temp) {

  //   //   for (var z = 0; z < manpower_localdatasource_array_temp.length; z++) {
  //   //     if (manpower_localdatasource_array_temp[z].LabourType === "Indirect Labour" || manpower_localdatasource_array_temp[z].LabourType === "In") {
  //   //       flag1 = flag1 + 1;
  //   //     }
  //   //     else if (manpower_localdatasource_array_temp[z].LabourType === "Direct Labour" || manpower_localdatasource_array_temp[z].LabourType === "Di") {
  //   //       flag2 = flag2 + 1;
  //   //     }
  //   //   }
  //   //   if (flag1 === 0 && flag2 === 0) {
  //   //     this.commonService.showFailureToast("Please submit direct and indirect labour type component !");
  //   //   }
  //   //   else if (flag1 === 0) {
  //   //     this.commonService.showFailureToast("Please submit indirect labour type component !");
  //   //   }
  //   //   else if (flag2 === 0) {
  //   //     this.commonService.showFailureToast("Please submit direct labour type component !");
  //   //   }
  //   // }
  //   // else {
  //   //   this.commonService.showFailureToast("Please submit direct and indirect labour type component !");
  //   // }

  //   // if (machinery_localdatasource_array_temp) {
  //   //   if (flag1 > 0 && flag2 > 0 && flag_mach === 0) {
  //   //     this.onSave();
  //   //   }
  //   //   else {
  //   //   }
  //   // }
  //   // else {
  //   //   if (flag1 > 0 && flag2 > 0) {
  //   //  this.onSave();
  //   //   }
  //   //   else {

  //   //   }
  //   // }

  // }

  scrollControl(res, post_data, comp_type_temp) {
    console.log(this.panel_items);
    var cost_comp_ismain = _.where(this.panel_items, { typesel: comp_type_temp });
    if (cost_comp_ismain[0])
      this.setPanelStep(cost_comp_ismain[0]["panelStep"]);
    // if(post_data.CostComp[0]["CompType"] === "KN"){
    //   this.scroll("scroll10");
    // }
    // console.log(res);
    // console.log(post_data);
  }

  onSave(post_data, panelStepIndex) {
    var err_temp;
    var comp_type_temp = post_data.CostComp[0]["CompType"];
    if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined) {
      post_data = this.isClaimsAppendPostData(post_data);
      this.LoanTechnicalService.postTechInfoComponent(post_data)
        .then((res) => (this.onResult(res),
          this.items_refresh(),
          this.LoanTechnicalService
            .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
            .then((res) => (this.resolveTechnicalInfo(res),
              this.scrollControl(res, post_data, comp_type_temp),
              this.Ng4LoadingSpinnerService.hide()
              //this.setPanelStep(panelStepIndex)
            ), err => (
              err_temp = err)
            ),
          err => (this.Ng4LoadingSpinnerService.hide())));
    }
  }
  // onSave2(operation, comp_type) {
  //   let machinery_localdatasource_array_temp = [];
  //   let bcw_localdatasource_array_temp = [];
  //   let vehicle_localdatasource_array_temp = [];
  //   let furniture_localdatasource_array_temp = [];
  //   let infotech_localdatasource_array_temp = [];
  //   let preopercosts_localdatasource_array_temp = [];
  //   let rawmaterial_localdatasource_array_temp = [];
  //   let manpower_localdatasource_array_temp = [];
  //   let utilitiesdetail_localdatasource_array_temp = [];
  //   let safety_localdatasource_array_temp = [];
  //   let knowhowag_localdatasource_array_temp = [];

  //   let machinery_localdatasource_array_temp2 = new LocalDataSource;
  //   let bcw_localdatasource_array_temp2 = new LocalDataSource;
  //   let vehicle_localdatasource_array_temp2 = new LocalDataSource;
  //   let furniture_localdatasource_array_temp2 = new LocalDataSource;
  //   let infotech_localdatasource_array_temp2 = new LocalDataSource;
  //   let preopercosts_localdatasource_array_temp2 = new LocalDataSource;
  //   let rawmaterial_localdatasource_array_temp2 = new LocalDataSource;
  //   let manpower_localdatasource_array_temp2 = new LocalDataSource;
  //   let utilitiesdetail_localdatasource_array_temp2 = new LocalDataSource;
  //   let safety_localdatasource_array_temp2 = new LocalDataSource;
  //   let knowhowag_localdatasource_array_temp2 = new LocalDataSource;



  //   if (this.machinery_localdatasource_array.length == 0) {
  //     this.machinery_localdatasource_array.push(machinery_localdatasource_array_temp2);
  //   }
  //   if (this.bcw_localdatasource_array.length == 0) {
  //     this.bcw_localdatasource_array.push(bcw_localdatasource_array_temp2);
  //   }
  //   if (this.vehicle_localdatasource_array.length == 0) {
  //     this.vehicle_localdatasource_array.push(vehicle_localdatasource_array_temp2);
  //   }
  //   if (this.furniture_localdatasource_array.length == 0) {
  //     this.furniture_localdatasource_array.push(furniture_localdatasource_array_temp2);
  //   }
  //   if (this.infotech_localdatasource_array.length == 0) {
  //     this.infotech_localdatasource_array.push(infotech_localdatasource_array_temp2);
  //   }
  //   if (this.preopercosts_localdatasource_array.length == 0) {
  //     this.preopercosts_localdatasource_array.push(preopercosts_localdatasource_array_temp2);
  //   }
  //   if (this.rawmaterial_localdatasource_array.length == 0) {
  //     this.rawmaterial_localdatasource_array.push(rawmaterial_localdatasource_array_temp2);
  //   }
  //   if (this.manpower_localdatasource_array.length == 0) {
  //     this.manpower_localdatasource_array.push(manpower_localdatasource_array_temp2);
  //   }
  //   if (this.utilitiesdetail_localdatasource_array.length == 0) {
  //     this.utilitiesdetail_localdatasource_array.push(utilitiesdetail_localdatasource_array_temp2);
  //   }
  //   if (this.safety_localdatasource_array.length == 0) {
  //     this.safety_localdatasource_array.push(safety_localdatasource_array_temp2);
  //   }
  //   if (this.knowhowag_localdatasource_array.length == 0) {
  //     this.knowhowag_localdatasource_array.push(knowhowag_localdatasource_array_temp2);
  //   }

  //   for (var i = 0; i < this.machinery_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.machinery_localdatasource_array[i].data.length; j++) {
  //       this.machinery_localdatasource_array[i].data[j]["Cost"] = this.machinery_localdatasource_array[i].data[j]["Cost"].replace(/[^\d.-]/g, '');
  //       this.machinery_localdatasource_array[i].data[j]["TotalCost"] = this.machinery_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //       if (this.machinery_localdatasource_array[i].data[j] != undefined) {
  //         machinery_localdatasource_array_temp.push(this.machinery_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.machinery_localdatasource_delete_array.length; i++) {
  //     this.machinery_localdatasource_delete_array[i]["TotalCost"] = this.machinery_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     this.machinery_localdatasource_delete_array[i]["Cost"] = this.machinery_localdatasource_delete_array[i]["Cost"].replace(/[^\d.-]/g, '');

  //     machinery_localdatasource_array_temp.push(this.machinery_localdatasource_delete_array[i]);
  //   }

  //   for (var i = 0; i < this.bcw_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.bcw_localdatasource_array[i].data.length; j++) {
  //       this.bcw_localdatasource_array[i].data[j]["TotalCost"] = this.bcw_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //       if (this.bcw_localdatasource_array[i].data[j] != undefined) {
  //         bcw_localdatasource_array_temp.push(this.bcw_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.bcw_localdatasource_delete_array.length; i++) {
  //     this.bcw_localdatasource_delete_array[i]["TotalCost"] = this.bcw_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');

  //     bcw_localdatasource_array_temp.push(this.bcw_localdatasource_delete_array[i]);
  //   }

  //   for (var i = 0; i < this.vehicle_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.vehicle_localdatasource_array[i].data.length; j++) {
  //       this.vehicle_localdatasource_array[i].data[j]["TotalCost"] = this.vehicle_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //       this.vehicle_localdatasource_array[i].data[j]["SingleCost"] = this.vehicle_localdatasource_array[i].data[j]["SingleCost"].replace(/[^\d.-]/g, '');

  //       if (this.vehicle_localdatasource_array[i].data[j] != undefined) {
  //         vehicle_localdatasource_array_temp.push(this.vehicle_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.vehicle_localdatasource_delete_array.length; i++) {
  //     this.vehicle_localdatasource_delete_array[i]["TotalCost"] = this.vehicle_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     this.vehicle_localdatasource_delete_array[i]["SingleCost"] = this.vehicle_localdatasource_delete_array[i]["SingleCost"].replace(/[^\d.-]/g, '');

  //     vehicle_localdatasource_array_temp.push(this.vehicle_localdatasource_delete_array[i]);
  //   }

  //   for (var i = 0; i < this.furniture_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.furniture_localdatasource_array[i].data.length; j++) {
  //       this.furniture_localdatasource_array[i].data[j]["TotalCost"] = this.furniture_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //       this.furniture_localdatasource_array[i].data[j]["SingleCost"] = this.furniture_localdatasource_array[i].data[j]["SingleCost"].replace(/[^\d.-]/g, '');
  //       if (this.furniture_localdatasource_array[i].data[j] != undefined) {
  //         furniture_localdatasource_array_temp.push(this.furniture_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.furniture_localdatasource_delete_array.length; i++) {
  //     this.furniture_localdatasource_delete_array[i]["TotalCost"] = this.furniture_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     this.furniture_localdatasource_delete_array[i]["SingleCost"] = this.furniture_localdatasource_delete_array[i]["SingleCost"].replace(/[^\d.-]/g, '');

  //     furniture_localdatasource_array_temp.push(this.furniture_localdatasource_delete_array[i]);
  //   }
  //   for (var i = 0; i < this.infotech_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.infotech_localdatasource_array[i].data.length; j++) {
  //       this.infotech_localdatasource_array[i].data[j]["TotalCost"] = this.infotech_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //       this.infotech_localdatasource_array[i].data[j]["SingleCost"] = this.infotech_localdatasource_array[i].data[j]["SingleCost"].replace(/[^\d.-]/g, '');
  //       if (this.infotech_localdatasource_array[i].data[j] != undefined) {
  //         infotech_localdatasource_array_temp.push(this.infotech_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.infotech_localdatasource_delete_array.length; i++) {
  //     this.infotech_localdatasource_delete_array[i]["TotalCost"] = this.infotech_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     this.infotech_localdatasource_delete_array[i]["SingleCost"] = this.infotech_localdatasource_delete_array[i]["SingleCost"].replace(/[^\d.-]/g, '');

  //     infotech_localdatasource_array_temp.push(this.infotech_localdatasource_delete_array[i]);
  //   }
  //   for (var i = 0; i < this.preopercosts_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.preopercosts_localdatasource_array[i].data.length; j++) {
  //       this.preopercosts_localdatasource_array[i].data[j]["TotalCost"] = this.preopercosts_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');

  //       if (this.preopercosts_localdatasource_array[i].data[j] != undefined) {
  //         preopercosts_localdatasource_array_temp.push(this.preopercosts_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.preopercosts_localdatasource_delete_array.length; i++) {
  //     this.preopercosts_localdatasource_delete_array[i]["TotalCost"] = this.preopercosts_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');

  //     preopercosts_localdatasource_array_temp.push(this.preopercosts_localdatasource_delete_array[i]);
  //   }

  //   for (var i = 0; i < this.rawmaterial_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.rawmaterial_localdatasource_array[i].data.length; j++) {
  //       this.rawmaterial_localdatasource_array[i].data[j]["TotalCost"] = this.rawmaterial_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');
  //       this.rawmaterial_localdatasource_array[i].data[j]["RawMatCostUom"] = this.rawmaterial_localdatasource_array[i].data[j]["RawMatCostUom"].replace(/[^\d.-]/g, '');

  //       if (this.rawmaterial_localdatasource_array[i].data[j] != undefined) {
  //         rawmaterial_localdatasource_array_temp.push(this.rawmaterial_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.rawmaterial_localdatasource_delete_array.length; i++) {
  //     this.rawmaterial_localdatasource_delete_array[i]["TotalCost"] = this.rawmaterial_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     this.rawmaterial_localdatasource_delete_array[i]["RawMatCostUom"] = this.rawmaterial_localdatasource_delete_array[i]["RawMatCostUom"].replace(/[^\d.-]/g, '');

  //     rawmaterial_localdatasource_array_temp.push(this.rawmaterial_localdatasource_delete_array[i]);
  //   }
  //   for (var i = 0; i < this.manpower_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.manpower_localdatasource_array[i].data.length; j++) {
  //       this.manpower_localdatasource_array[i].data[j]["BasicMonthSal"] = this.manpower_localdatasource_array[i].data[j]["BasicMonthSal"].replace(/[^\d.-]/g, '');
  //       this.manpower_localdatasource_array[i].data[j]["TotalCostMonthSal"] = this.manpower_localdatasource_array[i].data[j]["TotalCostMonthSal"].replace(/[^\d.-]/g, '');
  //       this.manpower_localdatasource_array[i].data[j]["TotalSalary"] = this.manpower_localdatasource_array[i].data[j]["TotalSalary"].replace(/[^\d.-]/g, '');

  //       if (this.manpower_localdatasource_array[i].data[j] != undefined) {
  //         manpower_localdatasource_array_temp.push(this.manpower_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.manpower_localdatasource_delete_array.length; i++) {
  //     this.manpower_localdatasource_delete_array[i]["BasicMonthSal"] = this.manpower_localdatasource_delete_array[i]["BasicMonthSal"].replace(/[^\d.-]/g, '');
  //     this.manpower_localdatasource_delete_array[i]["TotalCostMonthSal"] = this.manpower_localdatasource_delete_array[i]["TotalCostMonthSal"].replace(/[^\d.-]/g, '');
  //     this.manpower_localdatasource_delete_array[i]["TotalSalary"] = this.manpower_localdatasource_delete_array[i]["TotalSalary"].replace(/[^\d.-]/g, '');

  //     manpower_localdatasource_array_temp.push(this.manpower_localdatasource_delete_array[i]);
  //   }
  //   for (var i = 0; i < this.utilitiesdetail_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.utilitiesdetail_localdatasource_array[i].data.length; j++) {
  //       this.utilitiesdetail_localdatasource_array[i].data[j]["UnitPrice"] = this.utilitiesdetail_localdatasource_array[i].data[j]["UnitPrice"].replace(/[^\d.-]/g, '');
  //       this.utilitiesdetail_localdatasource_array[i].data[j]["AnnualCost"] = this.utilitiesdetail_localdatasource_array[i].data[j]["AnnualCost"].replace(/[^\d.-]/g, '');

  //       if (this.utilitiesdetail_localdatasource_array[i].data[j] != undefined) {
  //         utilitiesdetail_localdatasource_array_temp.push(this.utilitiesdetail_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.utilitiesdetail_localdatasource_delete_array.length; i++) {
  //     this.utilitiesdetail_localdatasource_delete_array[i]["UnitPrice"] = this.utilitiesdetail_localdatasource_delete_array[i]["UnitPrice"].replace(/[^\d.-]/g, '');
  //     this.utilitiesdetail_localdatasource_delete_array[i]["AnnualCost"] = this.utilitiesdetail_localdatasource_delete_array[i]["AnnualCost"].replace(/[^\d.-]/g, '');

  //     utilitiesdetail_localdatasource_array_temp.push(this.utilitiesdetail_localdatasource_delete_array[i]);
  //   }
  //   for (var i = 0; i < this.safety_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.safety_localdatasource_array[i].data.length; j++) {
  //       this.safety_localdatasource_array[i].data[j]["SingleCost"] = this.safety_localdatasource_array[i].data[j]["SingleCost"].replace(/[^\d.-]/g, '');
  //       this.safety_localdatasource_array[i].data[j]["TotalCost"] = this.safety_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');

  //       if (this.safety_localdatasource_array[i].data[j] != undefined) {
  //         safety_localdatasource_array_temp.push(this.safety_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.safety_localdatasource_delete_array.length; i++) {
  //     this.safety_localdatasource_delete_array[i]["TotalCost"] = this.safety_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     this.safety_localdatasource_delete_array[i]["SingleCost"] = this.safety_localdatasource_delete_array[i]["SingleCost"].replace(/[^\d.-]/g, '');

  //     safety_localdatasource_array_temp.push(this.safety_localdatasource_delete_array[i]);
  //   }
  //   for (var i = 0; i < this.knowhowag_localdatasource_array.length; i++) {
  //     for (var j = 0; j < this.knowhowag_localdatasource_array[i].data.length; j++) {
  //       this.knowhowag_localdatasource_array[i].data[j]["TotalCost"] = this.knowhowag_localdatasource_array[i].data[j]["TotalCost"].replace(/[^\d.-]/g, '');

  //       if (this.knowhowag_localdatasource_array[i].data[j] != undefined) {
  //         knowhowag_localdatasource_array_temp.push(this.knowhowag_localdatasource_array[i].data[j]);
  //       }
  //     }
  //   }
  //   for (var i = 0; i < this.knowhowag_localdatasource_delete_array.length; i++) {
  //     this.knowhowag_localdatasource_delete_array[i]["TotalCost"] = this.knowhowag_localdatasource_delete_array[i]["TotalCost"].replace(/[^\d.-]/g, '');
  //     knowhowag_localdatasource_array_temp.push(this.knowhowag_localdatasource_delete_array[i]);
  //   }



  //   // this.machinery_localdatasource_array[0].getAll().then((res) => {
  //   //   this.bcw_localdatasource_array[0].getAll().then((res) => {
  //   //     this.vehicle_localdatasource_array[0].getAll().then((res) => {
  //   //       this.furniture_localdatasource_array[0].getAll().then((res) => {
  //   //         this.infotech_localdatasource_array[0].getAll().then((res) => {
  //   //           this.preopercosts_localdatasource_array[0].getAll().then((res) => {
  //   //             this.rawmaterial_localdatasource_array[0].getAll().then((res) => {
  //   //               this.manpower_localdatasource_array[0].getAll().then((res) => {
  //   //                 this.utilitiesdetail_localdatasource_array[0].getAll().then((res) => {
  //   //                   this.safety_localdatasource_array[0].getAll().then((res) => {
  //   //                     this.knowhowag_localdatasource_array[0].getAll().then((res) => {
  //   this.Ng4LoadingSpinnerService.show();
  //   var err_temp;
  //   // alert(JSON.stringify(machinery_localdatasource_array_temp[0]));
  //   // alert("SSS"+JSON.stringify(this.furniture_localdatasource_array));
  //   var costcomptemp = {
  //     "Operation": operation,
  //     "LoanId": this.loan_id,
  //     "CompName": "",
  //     "CompType": comp_type,
  //     "CompTotCost": "0.00",
  //     "CompTotCostCurr": "SAR"
  //   }
  //   if (comp_type === "ME") {
  //     var post_data =
  //     {
  //       "LoanId": this.loan_id,
  //       "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
  //       "CustomerId": this.CustomerId,
  //       "ProfileId": this.ProfileId,
  //       "CostComp": costcomptemp,
  //       "Machinery": machinery_localdatasource_array_temp,
  //       "Bcw": bcw_localdatasource_array_temp,
  //       "Vehicle": vehicle_localdatasource_array_temp,
  //       "Furniture": furniture_localdatasource_array_temp,
  //       "InfoTech": infotech_localdatasource_array_temp,
  //       "PreOperCosts": preopercosts_localdatasource_array_temp,
  //       "RawMaterial": rawmaterial_localdatasource_array_temp,
  //       "ManPower": manpower_localdatasource_array_temp,
  //       "UtilitiesDetail": utilitiesdetail_localdatasource_array_temp,
  //       "Safety": safety_localdatasource_array_temp,
  //       "KnowHowAg": knowhowag_localdatasource_array_temp
  //     };
  //   }
  //   //console.log(post_data);
  //   if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined) {
  //     post_data = this.isClaimsAppendPostData(post_data);
  //     this.LoanTechnicalService.postTechInfoComponent(post_data)
  //       .then((res) => (this.onResult(res),
  //         this.items_refresh(),
  //         this.LoanTechnicalService
  //           .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
  //           .then((res) => (this.resolveTechnicalInfo(res),
  //             this.Ng4LoadingSpinnerService.hide()), err => (
  //               err_temp = err)
  //           ),
  //         //this.Ng4LoadingSpinnerService.hide()),
  //         err => (this.Ng4LoadingSpinnerService.hide())));
  //   }

  //   //                     });
  //   //                   });
  //   //                 });
  //   //               });
  //   //             });
  //   //           });
  //   //         });
  //   //       });
  //   //     });
  //   //   });
  //   // });
  //   // this.router.navigateByUrl('/pages/new-request/loan-application/financial-information');
  //   //  this.commonService.showSuccessToast("Technical Information submitted successfully !");

  // }
  items_refresh() {
    this.costcomp_array_index = [];
    //this.panel_items = [];
    this.Bcw_GuiId = null;
    this.manufacturing_stages_source = new LocalDataSource;
    this.production_lines_source = new LocalDataSource;

    this.panelStep = 1;
    this.financeCapitalCostSource = [];
    this.financeOperationalCostSource = [];
    this.financeCapitalCostSource_ar = [];
    this.financeOperationalCostSource_ar = [];
    // this.technical_list = "Machinery,Bcw,Vehicle,Furniture,InfoTech,PreOperCosts,RawMaterial,ManPower,UtilitiesDetail,Safety,KnowHowAg".split(",");
    //this.technical_list2 = [];
    this.techoption = "";
    this.techOptionSelected = "";

    this.panel_items = [];
    //this.panel_items2 = [];

    //this.panel_data = [];

    // this.techInfoModalParams2 = [];
    this.panelstepindex = 0;

    this.techInfoModalParams_g = {};

    this.allPanelsExpanded = false;

    this.financing_summary_source_length = 0;

    this.machinery_localdatasource_array = [];
    this.machinery_componentID_array = [];
    this.bcw_localdatasource_array = [];
    this.bcw_componentID_array = [];
    this.vehicle_localdatasource_array = [];
    this.vehicle_componentID_array = [];
    this.furniture_localdatasource_array = [];
    this.furniture_componentID_array = [];
    this.infotech_localdatasource_array = [];
    this.infotech_componentID_array = [];
    this.preopercosts_localdatasource_array = [];
    this.preopercosts_componentID_array = [];
    this.rawmaterial_localdatasource_array = [];
    this.rawmaterial_componentID_array = [];
    this.manpower_localdatasource_array = [];
    this.manpower_componentID_array = [];
    this.utilitiesdetail_localdatasource_array = [];
    this.utilitiesdetail_componentID_array = [];
    this.safety_localdatasource_array = [];
    this.safety_componentID_array = [];
    this.knowhowag_localdatasource_array = [];
    this.knowhowag_componentID_array = [];

    this.costcomp_array = [];

    this.componentid = 0;

    // this.machinery_localdatasource_delete_array = [];
    // this.bcw_localdatasource_delete_array = [];
    // this.vehicle_localdatasource_delete_array = [];
    // this.furniture_localdatasource_delete_array = [];
    // this.infotech_localdatasource_delete_array = [];
    // this.preopercosts_localdatasource_delete_array = [];
    // this.rawmaterial_localdatasource_delete_array = [];
    // this.manpower_localdatasource_delete_array = [];
    // this.utilitiesdetail_localdatasource_delete_array = [];
    // this.safety_localdatasource_delete_array = [];
    // this.knowhowag_localdatasource_delete_array = [];
    this.machinery_quotation_localdatasource_delete_array = [];

    //this.costcomp_array = [];

    //this.machinery_quotation_localdatasource_delete_array = [];
  }
  //onDelete
  onDelete(delete_cancel_modal, event, table_name, table_code, item) {
    if (this.isClaimsEditDelete(event)) {
      let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
      delete options.size;
      this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal, options);
      this.deleteCancelModalReference.event = event;
      this.deleteCancelModalReference.table_name = table_name;
      this.deleteCancelModalReference.table_code = table_code;
      this.deleteCancelModalReference.table_name_display = table_name;
      this.deleteCancelModalReference.item = item;
      this.deleteCancelModalReference.action = this.translate.instant('TECHNICAL_INFORMATION.Delete');
      // console.log("Delete");
      // if (this.deleteCancelModalReference.table_code == 'ME')
      //   this.deleteCancelModalReference.table_name_display = 'Machinery and Equipments';
      // if (this.deleteCancelModalReference.table_code == 'Building and Civil Works')
      //   this.deleteCancelModalReference.table_name_display = 'Building and Civil Works';
      // if (this.deleteCancelModalReference.table_code == 'Vehicles')
      //   this.deleteCancelModalReference.table_name_display = 'Vehicles';

      // if (this.deleteCancelModalReference.table_code == 'Furnitures')
      //   this.deleteCancelModalReference.table_name_display = 'Furnitures';
      // if (this.deleteCancelModalReference.table_code == 'Information Technology')
      //   this.deleteCancelModalReference.table_name_display = 'Information Technology';
      // if (this.deleteCancelModalReference.table_code == 'Pre Operational Costs')
      //   this.deleteCancelModalReference.table_name_display = 'Pre Operational Costs';
      // if (this.deleteCancelModalReference.table_code == 'Raw Materials')
      //   this.deleteCancelModalReference.table_name_display = 'Raw Materials';
      // if (this.deleteCancelModalReference.table_code == 'Man Power')
      //   this.deleteCancelModalReference.table_name_display = 'Man Power';
      // if (this.deleteCancelModalReference.table_code == 'Utilities')
      //   this.deleteCancelModalReference.table_name_display = 'Utilities';
      // if (this.deleteCancelModalReference.table_code == 'Safety')
      //   this.deleteCancelModalReference.table_name_display = 'Safety';
      // if (this.deleteCancelModalReference.table_code == 'Know How Agreements')
      //   this.deleteCancelModalReference.table_name_display = 'Know How Agreements';
    }
    else {
      this.commonService.showFailureToast("Cannot Delete");
    }
  }

  onCancel(delete_cancel_modal) {
    let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
    delete options.size;
    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal, options);
    this.deleteCancelModalReference.action = "Cancel";
    this.deleteCancelModalReference.table_name_display = "Loan Application";

  }

  onCloseDeleteCancelModal() {

    if (this.deleteCancelModalReference.action == this.translate.instant('TECHNICAL_INFORMATION.Delete')) {

      this.deleteCancelModalReference.close();

      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Deletioncancelled') + "!");

    } else if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.Submit')) {

      this.deleteCancelModalReference.close();

      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Submissioncancelled') + "!");

    }

    else if (this.deleteCancelModalReference.action == 'Cancel') {

      this.deleteCancelModalReference.close();

    }


  }

  onDeleteCall(item, data_temp, compName, CompTotCost, postdata_name, CompType) {
    // var data_temp = [];
    // //machinery_source_data_array.push(machinery_source_data);
    // data_temp.push(source);

    // data_temp[0]["TotalCost"] = modal_data.inputs[14].value;
    // data_temp[0]["Cost"] = modal_data.inputs[13].value;
    // data_temp[0]["ComponentId"] = "";
    // data_temp[0]["WbsId"] = "";

    var costcomptemp = [{
      "Operation": "D",
      "LoanId": this.loan_id,
      "CompName": compName,
      "CompTotCost": CompTotCost,
      "CompTotCostCurr": "SAR",
      "ComponentId": data_temp[0]["ComponentId"],
      "WbsId": data_temp[0]["WbsId"]
    }];
    costcomptemp[0]["CompType"] = CompType;
    costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
    };
    post_data[postdata_name] = data_temp;
    this.Ng4LoadingSpinnerService.show();
    this.onSave(post_data, item.panelStep);
  }

  removeSAR(value) {
    var temp = value.replace(/[^\d.-]/g, '');
    return ((+temp).toFixed(2) + "");
  }

  onDeleteConfirm(item) {
    var temp_delete_array = [];
    if (this.deleteCancelModalReference.action == this.translate.instant('COMMON.Submit')) {
      this.onSubmitisClaims();
    }
    else if (this.deleteCancelModalReference.action == this.translate.instant('TECHNICAL_INFORMATION.Delete')) {
      if (this.deleteCancelModalReference.table_code == 'ME') {
        if (this.deleteCancelModalReference.event.data.MachineId != undefined) {
          this.machinery_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          if (this.deleteCancelModalReference.event.data.CompQuot != undefined) {
            for (var i = 0; i < this.deleteCancelModalReference.event.data.CompQuot.length; i++) {
              this.deleteCancelModalReference.event.data.CompQuot[i]["Operation"] = "D";
            }
          }
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          this.deleteCancelModalReference.event.data["Cost"] = this.removeSAR(this.deleteCancelModalReference.event.data["Cost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["MachineName"], this.deleteCancelModalReference.event.data["TotalCost"], "Machinery", "ME");
        }
      }
      // if (this.deleteCancelModalReference.table_code == 'BC') {
      //   if (this.deleteCancelModalReference.event.data.BcwId != undefined) {
      //     this.bcw_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
      //     this.bcw_localdatasource_delete_array.push(this.deleteCancelModalReference.event.data);
      //     for (var i = 0; i < this.bcw_localdatasource_delete_array.length; i++) {
      //       this.bcw_localdatasource_delete_array[i]["Operation"] = "D";
      //     }
      //   }
      //   else {
      //     this.bcw_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
      //   }
      //   item.source.refresh();
      //   var x = 0;
      //   for (var i = 0; i < item.source.data.length; i++) {
      //     x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      //   }

      //   item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
      // }
      if (this.deleteCancelModalReference.table_code == 'VE') {

        if (this.deleteCancelModalReference.event.data.VehicleId != undefined) {
          this.vehicle_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          this.deleteCancelModalReference.event.data["SingleCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["SingleCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["VehicleType"], this.deleteCancelModalReference.event.data["TotalCost"], "Vehicle", "VE");
        }
      }
      if (this.deleteCancelModalReference.table_code == 'FU') {
        if (this.deleteCancelModalReference.event.data.FurnitureId != undefined) {
          this.furniture_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          this.deleteCancelModalReference.event.data["SingleCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["SingleCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["Description"], this.deleteCancelModalReference.event.data["TotalCost"], "Furniture", "FU");
        }
      }
      if (this.deleteCancelModalReference.table_code == 'IT') {
        if (this.deleteCancelModalReference.event.data.InfoTechId != undefined) {
          this.infotech_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          this.deleteCancelModalReference.event.data["SingleCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["SingleCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["Description"], this.deleteCancelModalReference.event.data["TotalCost"], "InfoTech", "IT");
        }
      }
      if (this.deleteCancelModalReference.table_code == 'PR') {
        if (this.deleteCancelModalReference.event.data.PreOperCostsId != undefined) {
          this.preopercosts_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          //   this.deleteCancelModalReference.event.data["SingleCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["SingleCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["Description"], this.deleteCancelModalReference.event.data["TotalCost"], "PreOperCosts", "PR");
        }
      }
      if (this.deleteCancelModalReference.table_code == 'RA') {
        if (this.deleteCancelModalReference.event.data.RawMaterialId != undefined) {
          this.rawmaterial_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          this.deleteCancelModalReference.event.data["RawMatCostUom"] = this.removeSAR(this.deleteCancelModalReference.event.data["RawMatCostUom"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["RawMatName"], this.deleteCancelModalReference.event.data["TotalCost"], "RawMaterial", "RA");
        }
      }
      if (this.deleteCancelModalReference.table_code == 'MA') {
        if (this.deleteCancelModalReference.event.data.ManPowerId != undefined) {
          this.manpower_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["BasicMonthSal"] = this.removeSAR(this.deleteCancelModalReference.event.data["BasicMonthSal"]);
          this.deleteCancelModalReference.event.data["TotalCostMonthSal"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCostMonthSal"]);
          this.deleteCancelModalReference.event.data["TotalSalary"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalSalary"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["LabourType"], this.deleteCancelModalReference.event.data["TotalSalary"], "ManPower", "MA");
        }
      }

      if (this.deleteCancelModalReference.table_code == 'UT') {
        if (this.deleteCancelModalReference.event.data.UtilitiesDetailId != undefined) {
          this.utilitiesdetail_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["UnitPrice"] = this.removeSAR(this.deleteCancelModalReference.event.data["UnitPrice"]);
          this.deleteCancelModalReference.event.data["AnnualCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["AnnualCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["UtilityType"], this.deleteCancelModalReference.event.data["AnnualCost"], "UtilitiesDetail", "UT");
        }
      }

      if (this.deleteCancelModalReference.table_code == 'SA') {
        if (this.deleteCancelModalReference.event.data.SafetyId != undefined) {
          this.safety_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          this.deleteCancelModalReference.event.data["SingleCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["SingleCost"]);
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["Description"], this.deleteCancelModalReference.event.data["TotalCost"], "Safety", "SA");
        }
      }
      if (this.deleteCancelModalReference.table_code == 'KN') {
        if (this.deleteCancelModalReference.event.data.KnowHowAgId != undefined) {
          this.knowhowag_localdatasource_array[item.localdatasource_index - 1].remove(this.deleteCancelModalReference.event.data);
          this.deleteCancelModalReference.event.data["Operation"] = "D";
          // this.deleteCancelModalReference.event.data["SingleCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["SingleCost"]);
          this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
          temp_delete_array.push(this.deleteCancelModalReference.event.data);
          this.onDeleteCall(item, temp_delete_array, this.deleteCancelModalReference.event.data["Description"], this.deleteCancelModalReference.event.data["TotalCost"], "KnowHowAg", "KN");
        }
      }
      if (this.deleteCancelModalReference.table_name == 'Component') {
        var flag = 0;
        for (var i = 0; i < this.costcomp_array[0].length; i++) {
          if (item.wbsid === this.costcomp_array[0][i].WbsId) {
            this.costcomp_array[0][i].Operation = "D";
            flag = 1;
          }
        }
        // if (flag === 1)
        // this.onSave(operation, comp_type);
      }
      if (this.deleteCancelModalReference.table_name == 'Manufacturing Stages') {
        var event = this.deleteCancelModalReference.event;

        var post_data = {
          "FinancingPlan": this.loan_id,
          "Indicator": "M",
          "ManufacturingStages": [
            {
              "Operation": "D",
              "StageId": event.data["StageId"],
              "StageSequence": event.data["StageSequence"],
              "MachineId": event.data["MachineId"],
              "MachineName": event.data["MachineName"],
              "Operators": event.data["Operators"],
              "ProductionCapacity": event.data["ProductionCapacity"],
              "ProductionUom": event.data["ProductionUom"],
              "StageName": event.data["StageName"],
              "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
            }
          ]
        };
        console.log(post_data);
        this.Ng4LoadingSpinnerService.show();
        this.onSaveManufacProd(post_data);
      }
      if (this.deleteCancelModalReference.table_name == 'Production Lines') {
        var event = this.deleteCancelModalReference.event;
        var post_data1 = {
          "FinancingPlan": this.loan_id,
          "Indicator": "P",
          "ProductionLines": [
            {
              "Operation": "D",
              "ProductionLineId": event.data["ProductionLineId"],
              "ProdLineMachinery": [
                {
                  "Operation": "D",
                  "MachineId": "1",
                  "MachineName": "1"
                },
              ],
              "Description": event.data["Description"],
              "Rate": event.data["Rate"],
              "CapacityUnit": event.data["CapacityUnit"],
              "AnnualCapacity": event.data["AnnualCapacity"],
              "ShifHours": event.data["ShifHours"],
              "ShiftPerDay": event.data["ShiftPerDay"],
              "DaysPerYear": event.data["DaysPerYear"],
              "PercentageEfficiency": event.data["PercentageEfficiency"],
              "SendReqId": this.customerProfileService.loanArray.SentReqId + ""
            }
          ]
        };
        console.log(post_data1);
        this.Ng4LoadingSpinnerService.show();
        this.onSaveManufacProd(post_data1);
      }

      if (this.deleteCancelModalReference.table_code == 'BC') {
        var totalcost_temp;
        if (item.isCost === "Y")
          totalcost_temp = item.totalcost;
        else
          totalcost_temp = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
        this.deleteCancelModalReference.event.data["TotalCost"] = this.removeSAR(this.deleteCancelModalReference.event.data["TotalCost"]);
        temp_delete_array.push(this.deleteCancelModalReference.event.data);
        var costcomptemp = [{
          "Operation": "D",
          "LoanId": this.loan_id,
          "CompName": this.deleteCancelModalReference.event.data["CivilItem"],
          "CompTotCost": this.commonService.numberWithCommasToNumber(totalcost_temp),
          "CompTotCostCurr": "SAR",
          "ComponentId": this.deleteCancelModalReference.event.data["ComponentId"],
          "WbsId": this.deleteCancelModalReference.event.data["WbsId"]
        }];
        costcomptemp[0]["CompType"] = "BC";
        costcomptemp[0]["Index"] = temp_delete_array[0]["Index"] ? temp_delete_array[0]["Index"] : "";
        temp_delete_array[0]["Operation"] = "D";
        var post_data2 = {
          "LoanId": this.loan_id,
          "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
          "CustomerId": this.CustomerId,
          "ProfileId": this.ProfileId,
          "CostComp": costcomptemp,
          "Bcw": temp_delete_array
        };
        this.Ng4LoadingSpinnerService.show();
        this.onSave(post_data2, item.panelStepIndex);
        this.Bcw_created = 0;
      }
    }

    else if (this.deleteCancelModalReference.action == 'Cancel') {


      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.LoanApplicationCancelled') + "!");

      this.router.navigateByUrl('/pages/new-request/loan-application');

    }

    this.deleteCancelModalReference.close();

  }
  ////Edit and delete isClaims Check
  isClaimsEditDelete(event) {
    if (this.isClaims === 'true') {
      var temp_check_isClaim_nonenv = _.where(this.costcomp_array[0], { IsActive: "X", ComponentId: event.data.ComponentId, WbsId: event.data.WbsId });//Add isClaims
      if (temp_check_isClaim_nonenv.length > 0)
        return true;
      else
        return false;
    } else {
      return true
    }
  }

  isClaimsCompQuotation(event) {
    if (this.isClaims === 'true') {
      return false;
    } else {
      return true
    }
  }

  ////onEdit
  onEdit(event, typesel, item) {
    try {
      // this.deleteCancelModalReference.event = event;
      if (this.isClaimsEditDelete(event)) {

        let technicaltableinfoModalParams = {};
        this.techOptionSelected = item.typesel;
        let typsel = item.typesel;
        let typselname = item.typeselname;
        if (typsel == "ME") {
          this.me_BidAnalysis_source.data = event.data.BidAnalysis ? event.data.BidAnalysis : this.me_BidAnalysis_source.data;
          this.setBidAnalysisFirstColumn();

          var cost_temp2 = event.data.Cost.replace(/[^\d.-]/g, '');
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, ''); // To remove non numeric characters
          var cost_temp = (+cost_temp2).toFixed(2) + "";
          var total_cost_temp = (+total_cost_temp2).toFixed(2);
          var temp_date = new Date;

          var Quantity_UOM;
          if (event.data.QuantityUom != null) {
            var unit = this.quantityUOM_machinery.find((o) => o.Id == event.data.QuantityUom);
            if (unit)
              Quantity_UOM = unit.Desc;
          }

          var source_of_origin_machinery_temp;
          if (event.data.SourceOrigin != null) {
            var unit1 = this.source_of_origin_machinery.find((o) => o.Id == event.data.SourceOrigin);
            if (unit1)
              source_of_origin_machinery_temp = unit1.Desc;
          }



          var mach_status;
          if (event.data.MachineStatusId != null) {
            var unit1 = this.machinery_status.find((o) => o.Id == event.data.MachineStatusId);
            if (unit1)
              mach_status = unit1.Desc;
          }

          var supplier_origin_machinery_temp;
          if (event.data.SuppOrigin != null) {
            var unit1 = this.CountryDD.find((o) => o.Code == event.data.SuppOrigin);
            if (unit1)
              supplier_origin_machinery_temp = unit1.Name;
          }

          var ForeignCurrency_temp = this.findNameFromCode(this.CurrencyList, event.data.ForeignCurrency, "Code", "Name");
          var ForeignCost_temp = +event.data.ForeignCost * +event.data.Quantity;

          var date_temp = event.data.QuotDate.split("-");
          var Quotation_date = date_temp[0] + "-" + date_temp[1] + "-" + date_temp[2];
          var Quotation_date_value = { year: date_temp[0], month: date_temp[1], day: date_temp[2] }
          temp_date.setFullYear(Quotation_date_value.year);
          temp_date.setMonth(+Quotation_date_value.month - 1);
          temp_date.setDate(Quotation_date_value.day);

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",
            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,
            inputs: [
              {
                id: "MachineName",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
                type: "text",
                value: event.data.MachineName,
                required: "true",
              },
              {
                id: "MachineSpecs",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineSpecs'),
                type: "text",
                value: event.data.MachineSpecs,
                required: "false",
              },
              {
                id: "MachineDesc",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineDesc'),
                type: "text",
                value: event.data.MachineDesc,
                required: "true",
              },
              {
                id: "MachineStatusId",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineStatusId'),
                type: "select",
                selected: mach_status,
                value: this.machinery_status_desc,
                required: "true",
              },
              {
                id: "MachineCap",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineCap'),
                type: "text",
                value: event.data.MachineCap,
                required: "false",
              },
              {
                id: "QuotInvNo",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuotInvNo'),
                type: "text",
                value: event.data.QuotInvNo,
                required: "true",
              },
              {
                id: "QuotDate",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuotDate'),
                type: "calendar",
                value: temp_date,
                placeholder: Quotation_date,
                required: "true",
              },
              // {
              //   id: "ReeferenceNo",
              //   name: "Reference Number",
              //   type: "number",
              //   value: event.data.ReeferenceNo,
              //   required: "true",
              // },
              {
                id: "SupplierId",
                name: this.translate.instant('TECHNICAL_INFORMATION.ManufacturerName'),
                type: "text",
                value: event.data.SupplierId,
                required: "true",
              },
              {
                id: "SuppOrigin",
                name: this.translate.instant('TECHNICAL_INFORMATION.ManufacturerOrigin'),
                type: "select",
                selected: supplier_origin_machinery_temp,
                value: this.CountryDD_desc,
                required: "true",
                hideable: false,
              },
              {
                id: "SourceOrigin",
                name: this.translate.instant('TECHNICAL_INFORMATION.SourceOrigin'),
                type: "select",
                selected: source_of_origin_machinery_temp,
                value: this.source_of_origin_machinery_desc,
                required: "true",
                hideable: false,
              },
              {
                id: "ConnecLoad",
                name: this.translate.instant('TECHNICAL_INFORMATION.ConnecLoad'),
                type: "number",
                value: event.data.ConnecLoad,
                required: "false",
                hideable: false,
              },
              {
                id: "PowerLoad",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachinePowerLoad'),
                type: "number",
                value: event.data.PowerLoad,
                required: "false",

              },
              {
                id: "Quantity",
                name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
                type: "number",
                value: event.data.Quantity,
                required: "true",
              },
              {
                id: "QuantityUom",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
                type: "select",
                selected: Quantity_UOM,
                value: this.quantityUOM_machinery_desc,
                required: "false",
              },
              {
                id: "Cost",
                name: this.translate.instant('TECHNICAL_INFORMATION.Cost'),
                type: "text",
                value: cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text_disabled",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "ForeignCurrency",
                name: this.translate.instant('CONTRACTS.ForeignCurrency'),
                type: "select",
                value: this.CurrencyNameList,
                selected: ForeignCurrency_temp,
                required: "false",
              },
              {
                id: "ForeignCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.ForeignCost'),
                type: "text",
                value: event.data.ForeignCost,
                required: "false",
                cost: "true",
                currency: (event.data.ForeignCurrency ? (event.data.ForeignCurrency + " ") : " "),

              },
              {
                id: "TotalForeignCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalForeignCost'),
                type: "text_disabled",
                value: ForeignCost_temp + "",
                required: "false",
                cost: "true",
                currency: (event.data.ForeignCurrency ? (event.data.ForeignCurrency + " ") : " "),
              },
              {
                id: "ShipmentTerms",
                name: this.translate.instant('TECHNICAL_INFORMATION.ShipmentTerms'),
                type: "text",
                value: event.data.ShipmentTerms,
                required: "false",

              },
              {
                id: "TechSpecInc",
                name: this.translate.instant('TECHNICAL_INFORMATION.TechSpecInc'),
                type: "select",
                selected: event.data.TechSpecInc,
                value: this.yes_or_no,
                required: "true",
                hideable: false,
              },
              {
                id: "MachineryQuotationAttachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineryQuotationAttachment'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: "",
                hideable: false,
              },
              {
                id: "MachineryLayoutAttachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.MachineryLayoutAttachment'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: "",
                hideable: false,
              },
              {
                id: "CustomClearanceAttachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.CustomClearanceAttachment'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: "",
                hideable: true,
              },
              // {
              //   id: "MachineryRawMaterialWarehouses",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.MachineryRawMaterialWarehouses'),
              //   type: "file_multiple",
              //   file: "",
              //   required: "false",
              //   visible: true,
              //   value: "",
              //   hideable: false,
              // },
              // {
              //   id: "MachineryFinishedGoods",
              //   name: this.translate.instant('TECHNICAL_INFORMATION.MachineryFinishedGoods'),
              //   type: "file_multiple",
              //   file: "",
              //   required: "false",
              //   visible: true,
              //   value: "",
              //   hideable: false,
              // },
              {
                id: "TechnicalSpecification",
                name: this.translate.instant('TECHNICAL_INFORMATION.TechnicalSpecification'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: "",
                hideable: true
              },
              {
                name: "BidAnalysis",
                type: "table",
                id: "bidAnalysis",
                settings: this.me_BidAnalysis_settings,
                source: this.me_BidAnalysis_source,
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",
                handler: (modal_data) => {
                  this.Ng4LoadingSpinnerService.show();
                  // var rand_num = this.commonService.returnRandomNumber();
                  var guiid_temp = modal_data.event.data.GuiId;
                  var upload_post = "";
                  var count_check = 0;
                  var count_check_2 = 0;
                  //Machinery Quotation
                  for (var i = 0; i < modal_data.inputs.length; i++) {
                    if (modal_data.inputs[i].file) {
                      count_check++;
                    }
                  }
                  if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryQuotationAttachment")].file) {
                    var data = {
                      documentDefId: 385,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    var temp = this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryQuotationAttachment")].file, data);
                    if (temp === "S")
                      count_check_2++;
                  }
                  //Machinery Layout
                  if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryLayoutAttachment")].file) {
                    var data1 = {
                      documentDefId: 386,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    var temp = this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineryLayoutAttachment")].file, data1);
                    if (temp === "S")
                      count_check_2++;
                  }
                  //Custom Clearance
                  if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "CustomClearanceAttachment")].file) {
                    var data2 = {
                      documentDefId: 387,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "CustomClearanceAttachment")].file, data2);
                  }
                  //Machinery Raw material Warehouses
                  if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TechnicalSpecification")].file) {
                    var data3 = {
                      documentDefId: 390,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    var temp = this.uploadDocumentFunction(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TechnicalSpecification")].file, data3);
                    if (temp === "S")
                      count_check_2++;
                  }
                  //Machinery Finished Goods
                  // if (modal_data.inputs[20].file) {
                  //   var data4 = {
                  //     documentDefId: 389,
                  //     entityId: this.requestId,
                  //     entityName: "Project",
                  //     RelatedEntityId: guiid_temp,
                  //     RelatedEntityName: "technicalInfos",
                  //     operationType: "l"
                  //   };
                  //   var temp = this.uploadDocumentFunction(modal_data.inputs[20].file, data4);
                  //   if (temp === "S")
                  //     count_check_2++;
                  // }
                  // //Technical Specification
                  // if (modal_data.inputs[21].file) {
                  //   var data5 = {
                  //     documentDefId: 390,
                  //     entityId: this.requestId,
                  //     entityName: "Project",
                  //     RelatedEntityId: guiid_temp,
                  //     RelatedEntityName: "technicalInfos",
                  //     operationType: "l"
                  //   };
                  //   var temp = this.uploadDocumentFunction(modal_data.inputs[21].file, data5);
                  //   if (temp === "S")
                  //     count_check_2++;
                  // }
                  //     if(count_check === count_check_2){
                  this.machinery_edit(item, modal_data, event);


                  // if(modal_data.inputs[12].file){
                  // this.Ng4LoadingSpinnerService.show();
                  // var upload_post = "";
                  // var data = {
                  //   documentDefId: 121,
                  //   entityId: this.requestId,
                  //   entityName: "Project",
                  //   RelatedEntityId: event.data.GuiId,
                  //   RelatedEntityName: "technicalInfos",
                  //   operationType: "l"
                  // };

                  // this.communicationsService.uploadDocumentService(modal_data.inputs[12].file, data)
                  //   .then(requests => (
                  //     (
                  //       upload_post = this.onDocumentUpload(requests),
                  //       this.machinery_edit(item, modal_data, event),
                  //       this.Ng4LoadingSpinnerService.hide()
                  //     ), err => (this.Ng4LoadingSpinnerService.hide())));

                  //     }
                  //     else{
                  //       this.machinery_edit(item, modal_data, event);
                  //     }
                }
              }
            ]
          };

        }
        else if (typsel === 'BC') {
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
          var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",


            requestId: this.requestId,
            event: event,
            typselcode: typsel,

            inputs: [
              {
                id: "CivilItem",
                name: this.translate.instant('TECHNICAL_INFORMATION.CivilItem'),
                type: "text",
                value: event.data.CivilItem,
                required: "true",
              },
              {
                id: "ItemDesc",
                name: this.translate.instant('TECHNICAL_INFORMATION.ItemDesc'),
                type: "text",
                value: event.data.ItemDesc,
                required: "true",
              },
              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "Purpose",
                name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
                type: "text",
                value: event.data.Purpose,
                required: "true",
              },

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {



                  // this.communicationsService.uploadDocumentService(modal_data.inputs[4].file, data)
                  //   .then(requests => (
                  //     upload_post = this.onDocumentUpload(requests),
                  this.bcw_edit(item, modal_data, event);




                  // if(modal_data.inputs[4].file){
                  // this.Ng4LoadingSpinnerService.show();
                  // var upload_post = "";
                  // var data = {
                  //   documentDefId: 121,
                  //   entityId: this.requestId,
                  //   entityName: "Project",
                  //   RelatedEntityId: event.data.GuiId,
                  //   RelatedEntityName: "technicalInfos",
                  //   operationType: "l"
                  // };

                  // this.communicationsService.uploadDocumentService(modal_data.inputs[4].file, data)
                  //   .then(requests => (
                  //     (
                  //       upload_post = this.onDocumentUpload(requests),
                  //       this.bcw_edit(item, modal_data, event),
                  //       this.Ng4LoadingSpinnerService.hide()
                  //     ), err => (this.Ng4LoadingSpinnerService.hide())));
                  //     }
                  //     else{
                  //       this.bcw_edit(item, modal_data, event);
                  //     }
                }
              }
            ]
          };

        }
        else if (typsel === 'VE') {
          var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
          var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');

          // var Quantity_UOM;
          // if (event.data.QuantityUom != null) {
          //   var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
          //   if (unit)
          //     Quantity_UOM = unit.Name;
          // }

          var VehicleType;
          // var Desc_status = "false";
          // if (event.data.VehicleType === "OT") {
          //   Desc_status = "true";
          // }
          // else {
          //   Desc_status = "false";
          // }
          if (event.data.VehicleType != null) {
            var unit = this.vehicle_type.find((o) => o.Id == event.data.VehicleType);
            if (unit)
              VehicleType = unit.Desc;
          }
          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",

            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,

            inputs: [
              {
                id: "VehicleType",
                name: this.translate.instant('TECHNICAL_INFORMATION.VehicleType'),
                type: "select",
                selected: VehicleType,
                value: this.vehicle_type_desc,
                required: "true",
                hideable: false,
              },
              {
                id: "VehicleName",
                name: this.translate.instant('TECHNICAL_INFORMATION.VehicleName'),
                type: "text",
                value: event.data.VehicleName,
                required: "true",
              },
              {
                id: "Quantity",
                name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
                type: "number",
                value: event.data.Quantity,
                required: "true",
              },
              {
                id: "QuantityUom",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
                type: "text_disabled",
                value: "Unit",
                required: "true",
              },
              {
                id: "SingleCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.UnitCost'),
                type: "text",
                value: single_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text_disabled",
                value: total_cost_temp2,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "Purpose",
                name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
                type: "text",
                value: event.data.Purpose,
                required: "true",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentVehicle'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: ""
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  if (modal_data.inputs[6].file) {
                    this.Ng4LoadingSpinnerService.show();
                    event.data["GuiId"] = event.data["GuiId"] ? event.data.GuiId : this.commonService.returnRandomNumber();
                    var upload_post = "";
                    var data = {
                      documentDefId: 121,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: event.data.GuiId,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };

                    this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
                      .then(requests => (
                        (
                          upload_post = this.onDocumentUpload(requests),
                          this.vehicle_edit(item, modal_data, event),
                          this.Ng4LoadingSpinnerService.hide()
                        ), err => (this.Ng4LoadingSpinnerService.hide())));

                  }
                  else {
                    this.vehicle_edit(item, modal_data, event);
                  }
                }
              }
            ]
          };

        }
        else if (typsel === 'FU') {
          var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
          var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');

          var Quantity_UOM;
          if (event.data.QuantityUom != null) {
            var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
            if (unit)
              Quantity_UOM = unit.Name;
          }
          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",

            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,

            inputs: [
              {
                id: "Description",
                name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
                type: "text",
                value: event.data.Description,
                required: "true",
              },
              {
                id: "Quantity",
                name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
                type: "number",
                value: event.data.Quantity,
                required: "false",
              },
              {
                id: "Quantity Uom",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
                type: "select",
                selected: Quantity_UOM,
                value: this.uom_furnitures,
                required: "false",
              },
              {
                id: "SingleCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
                type: "text",
                value: single_cost_temp,
                required: "false",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text_disabled",
                value: total_cost_temp2,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "Purpose",
                name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
                type: "text",
                value: event.data.Purpose,
                required: "false",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentFurniture'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: ""
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  if (modal_data.inputs[6].file) {
                    this.Ng4LoadingSpinnerService.show();
                    event.data["GuiId"] = event.data["GuiId"] ? event.data.GuiId : this.commonService.returnRandomNumber();
                    var upload_post = "";
                    var data = {
                      documentDefId: 121,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: event.data.GuiId,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };

                    this.communicationsService.uploadDocumentService(modal_data.inputs[6].file, data)
                      .then(requests => (
                        (
                          upload_post = this.onDocumentUpload(requests),
                          this.furniture_edit(item, modal_data, event),
                          this.Ng4LoadingSpinnerService.hide()
                        ), err => (this.Ng4LoadingSpinnerService.hide())));

                  }
                  else {
                    this.furniture_edit(item, modal_data, event);
                  }
                }
              }
            ]
          };

        }
        else if (typsel === 'IT') {
          var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
          var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
          var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

          // var Quantity_UOM;
          // if (event.data.QuantityUom != null) {
          //   var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
          //   if (unit)
          //     Quantity_UOM = unit.Name;
          // }

          var category_temp;
          if (event.data.Category != null) {
            var unit1 = this.it_category.find((o) => o.Id == event.data.Category);
            if (unit1)
              category_temp = unit1.Desc;
          }

          var order_temp;
          if (event.data.OrderType != null) {
            var unit1 = this.it_order_type.find((o) => o.Id == event.data.OrderType);
            if (unit1)
              order_temp = unit1.Desc;
          }
          technicaltableinfoModalParams = {
            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",

            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,

            inputs: [
              {
                id: "Description",
                name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
                type: "text",
                value: event.data.Description,
                required: "true",
              },
              {
                id: "OrderType",
                name: this.translate.instant('TECHNICAL_INFORMATION.OrderType'),
                type: "select",
                selected: order_temp,
                value: this.it_order_type_desc,
                required: "true",
              },
              {
                id: "Category",
                name: this.translate.instant('TECHNICAL_INFORMATION.Category'),
                type: "select",
                selected: category_temp,
                value: this.it_category_desc,
                required: "true",
              },
              {
                id: "Quantity",
                name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
                type: "number",
                value: event.data.Quantity,
                required: "true",
              },
              {
                id: "QuantityUom",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
                type: "select",
                selected: event.data.QuantityUom,
                value: this.IT_dd,
                required: "true",
              },
              {
                id: "SingleCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
                type: "text",
                value: single_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "TotalCost_nb",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text_disabled",
                value: +single_cost_temp * +event.data.Quantity,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "Discount",
                name: this.translate.instant('TECHNICAL_INFORMATION.DiscountP'),
                type: "number",
                value: parseFloat(event.data.Discount),
                required: "false",
              },
              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.NetCost'),
                type: "text_disabled",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "Purpose",
                name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
                type: "text",
                value: event.data.Purpose,
                required: "false",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentIT'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: ""
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  if (modal_data.inputs[10].file) {
                    this.Ng4LoadingSpinnerService.show();
                    var upload_post = "";
                    var data = {
                      documentDefId: 121,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: event.data.GuiId,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };

                    this.communicationsService.uploadDocumentService(modal_data.inputs[10].file, data)
                      .then(requests => (
                        (
                          upload_post = this.onDocumentUpload(requests),
                          this.infotech_edit(item, modal_data, event),
                          this.Ng4LoadingSpinnerService.hide()
                        ), err => (this.Ng4LoadingSpinnerService.hide())));

                  }
                  else {
                    this.infotech_edit(item, modal_data, event);
                  }


                }
              }
            ]
          };

        }
        else if (typsel === 'PR') {
          //  var single_cost_temp = event.data.SingleCost.slice(0, -1);
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
          var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",

            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,
            inputs: [
              {
                id: "Description",
                name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
                type: "text",
                value: event.data.Description,
                required: "true",
              },

              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentPreOperCosts'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: ""
              }

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  if (modal_data.inputs[2].file) {
                    this.Ng4LoadingSpinnerService.show();
                    event.data["GuiId"] = event.data["GuiId"] ? event.data.GuiId : this.commonService.returnRandomNumber();
                    var upload_post = "";
                    var data = {
                      documentDefId: 121,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: event.data.GuiId,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };

                    this.communicationsService.uploadDocumentService(modal_data.inputs[2].file, data)
                      .then(requests => (
                        (
                          upload_post = this.onDocumentUpload(requests),
                          this.preoper_edit(item, modal_data, event),
                          this.Ng4LoadingSpinnerService.hide()
                        ), err => (this.Ng4LoadingSpinnerService.hide())));
                  }
                  else {
                    this.preoper_edit(item, modal_data, event);
                  }

                }
              }
            ]
          };

        }
        else if (typsel === 'RA') {
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
          var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";
          var rawmat_cost_temp2 = event.data.RawMatCostUom.replace(/[^\d.-]/g, '');
          var RawMatCostUom = (+rawmat_cost_temp2).toFixed(2) + "";

          var Quantity_UOM;
          if (event.data.RawMatQuanPerUomProdUom != null) {
            var unit = this.uom_list.find((o) => o.Code == event.data.RawMatQuanPerUomProdUom);
            if (unit)
              Quantity_UOM = unit.Name;
          }

          var Quantity_UOM2;
          if (event.data.Product != null) {
            var unit2 = this.product_list.find((o) => o.ProductId == event.data.Product);
            if (unit2)
              Quantity_UOM2 = unit2.ProductName;
          }

          var source_rawmat;
          if (event.data.SourceOrigin != null) {
            var unit3 = this.source_of_origin_rawmat.find((o) => o.Id == event.data.SourceOrigin);
            if (unit3)
              source_rawmat = unit3.Desc;
          }

          var supplier_origin_rawmat_temp;
          if (event.data.CountryOrigin != null) {
            var unit1 = this.CountryDD.find((o) => o.Code == event.data.CountryOrigin);
            if (unit1)
              supplier_origin_rawmat_temp = unit1.Name;
          }

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",
            typselcode: typsel,
            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,


            inputs: [
              // {
              //   id: "Year",
              //   name: "Year",
              //   type: "select",
              //   selected: event.data.Year,
              //   value: this.past_15_years,
              //   required: "true",
              // },

              {
                id: "RawMatName",
                name: this.translate.instant('TECHNICAL_INFORMATION.RawMatName'),
                type: "text",
                value: event.data.RawMatName,
                required: "true",
              },
              {
                id: "Product",
                name: this.translate.instant('TECHNICAL_INFORMATION.Product'),
                type: "select",
                selected: Quantity_UOM2,
                value: this.product_list_name,
                required: "true",
              },
              {
                id: "RawMatQuanPerUomProd",
                name: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProd'),
                type: "number",
                placeholder: this.translate.instant('TECHNICAL_INFORMATION.QuantityRequiredToManufactureProduct'),
                value: event.data.RawMatQuanPerUomProd,
                required: "true",
              },
              {
                id: "RawMatQuanPerUomProdUom",
                name: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProdUom'),
                type: "select",
                selected: Quantity_UOM,
                value: this.uom_text,
                required: "true",
              },
              {
                id: "RawMatCostUom",
                name: this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUom'),
                type: "text",
                value: RawMatCostUom,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text_disabled",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "CountryOrigin",
                name: this.translate.instant('TECHNICAL_INFORMATION.CountryofOrigin'),
                type: "select",
                selected: supplier_origin_rawmat_temp,
                value: this.CountryDD_desc,
                required: "true",
                hideable: false,
              },
              {
                id: "SuppName",
                name: this.translate.instant('TECHNICAL_INFORMATION.SuppName'),
                type: "text",
                value: event.data.SuppName,
                required: "true",
              },
              {
                id: "SourceOrigin",
                name: this.translate.instant('TECHNICAL_INFORMATION.SourceOrigin'),
                type: "select",
                selected: source_rawmat,
                value: this.source_of_origin_rawmat_desc,
                required: "true",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentRawMat'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: ""
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  this.Ng4LoadingSpinnerService.show();
                  //var rand_num = this.commonService.returnRandomNumber();
                  var guiid_temp = modal_data.event.data.GuiId;
                  var upload_post = "";
                  var count_check = 0;
                  var count_check_2 = 0;
                  if (modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "attachment")].file) {
                    var data = {
                      documentDefId: 398,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    var temp = this.uploadDocumentFunction(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "attachment")].file, data);
                    // if(temp === "S")
                    // count_check_2++;
                    this.rawmat_edit(item, modal_data, event);
                  }
                  else {
                    this.rawmat_edit(item, modal_data, event);
                  }

                }
              }
            ]
          };

        }
        else if (typsel === 'MA') {
          // var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
          var basic_monthly_salary_temp2 = event.data.BasicMonthSal.replace(/[^\d.-]/g, '');
          var total_monthly_temp2 = event.data.TotalCostMonthSal.replace(/[^\d.-]/g, '');
          var total_salary_temp2 = event.data.TotalSalary.replace(/[^\d.-]/g, '');

          var AddBenefPerc_temp = (+event.data.AddBenefPerc).toFixed(2) + "";
          var BasicMonthSal_temp = (+event.data.BasicMonthSal).toFixed(2) + "";


          var LabourType_temp;
          if (event.data.LabourType != null) {
            var unit = this.labour_type.find((o) => o.Id == event.data.LabourType);
            if (unit)
              LabourType_temp = unit.Desc;
          }
          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",
            typselcode: typsel,
            table_name: typselname,

            inputs: [
              {
                id: "Year",
                name: this.translate.instant('TECHNICAL_INFORMATION.YearOfHiring'),
                type: "select",
                selected: event.data.Year,
                value: this.future_15_years,
                required: "false",
              },

              {
                id: "LabourType",
                name: this.translate.instant('TECHNICAL_INFORMATION.LabourType'),
                type: "select",
                selected: LabourType_temp,
                value: this.labour_type_desc,
                required: "true",
                disabled: "true"
              },
              {
                id: "JobDesc",
                name: this.translate.instant('TECHNICAL_INFORMATION.JobDesc'),
                type: "text",
                value: event.data.JobDesc,
                required: "true",
              },
              {
                id: "NoPositions",
                name: this.translate.instant('TECHNICAL_INFORMATION.NoPositions'),
                type: "number",
                value: event.data.NoPositions,
                required: "true",
              },
              {
                id: "BasicMonthSal",
                name: this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSal'),
                type: "text",
                value: basic_monthly_salary_temp2,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "TotalCostMonthSal",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSal'),
                type: "text_disabled",
                value: total_monthly_temp2,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "AddBenefPerc",
                name: this.translate.instant('TECHNICAL_INFORMATION.AddBenefPerc'),
                type: "number",
                value: AddBenefPerc_temp,
                required: "true",
              },
              {
                id: "TotalSalary",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalSalary'),
                type: "text_disabled",
                value: total_salary_temp2,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  var manpower_source_data_array = [];
                  // var unit = this.labour_type.find((o) => o.Desc == item.uniqname);
                  // if (unit)
                  //   var component_name_code = unit.Id;
                  var manpower_source_data = {
                    Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid, Year: modal_data.inputs[0].selected,
                    LabourType: modal_data.inputs[1].selected, JobDesc: modal_data.inputs[2].value,
                    NoPositions: modal_data.inputs[3].value, SalaryCurr: "SAR",
                    BasicMonthSal: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value), TotalCostMonthSal: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value),
                    AddBenefPerc: modal_data.inputs[6].value, TotalSalary: modal_data.inputs[7].value

                  };

                  if (event.data.ManPowerId === undefined) {
                    manpower_source_data["Operation"] = "C";
                  }
                  else {
                    manpower_source_data["Operation"] = "U";
                  }

                  var unit = this.labour_type.find((o) => o.DescAr == manpower_source_data["LabourType"]||o.Desc == manpower_source_data["LabourType"]);
                  if (unit)
                    manpower_source_data["LabourType"] = unit.Id;
                  manpower_source_data["TotalSalary"] = "SAR " + this.commonService.numberToNumberWithCommas((+manpower_source_data["TotalSalary"]).toFixed(2)) + "";
                  console.log(this.manpower_localdatasource_array);
                  //this.manpower_localdatasource_array[item.localdatasource_index - 1].update(event.data, manpower_source_data);
                  if (manpower_source_data["LabourType"] === "D")
                    item.source1.update(event.data, manpower_source_data);
                  if (manpower_source_data["LabourType"] === "I")
                    item.source2.update(event.data, manpower_source_data);

                  var x = 0;
                  for (var i = 0; i < item.source1.data.length; i++) {
                    if (i === +item.source1.data.length - 1) {
                      x = +x + +manpower_source_data.TotalSalary.replace(/[^\d.-]/g, '');
                    }
                    else {
                      x = +x + +item.source1.data[i].TotalSalary.replace(/[^\d.-]/g, '');
                    }
                  }
                  for (var i = 0; i < item.source2.data.length; i++) {
                    if (i === +item.source2.data.length - 1) {
                      x = +x + +manpower_source_data.TotalSalary.replace(/[^\d.-]/g, '');
                    }
                    else {
                      x = +x + +item.source2.data[i].TotalSalary.replace(/[^\d.-]/g, '');
                    }
                  }
                  item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
                  item.source1.refresh();
                  item.source2.refresh();


                  var data_temp = [];
                  data_temp.push(manpower_source_data);
                  data_temp[0]["BasicMonthSal"] = this.removeSAR(manpower_source_data["BasicMonthSal"]);
                  data_temp[0]["TotalCostMonthSal"] = this.removeSAR(manpower_source_data["TotalCostMonthSal"]);
                  data_temp[0]["TotalSalary"] = this.removeSAR(manpower_source_data["TotalSalary"]);
                  data_temp[0]["ComponentId"] = event.data.ComponentId;
                  data_temp[0]["WbsId"] = event.data.WbsId;
                  data_temp[0]["Index"] = event.data.Index;

                  var comptotcost = data_temp[0]["TotalSalary"];
                  var compname = data_temp[0]["JobDesc"];
                  var compType = "MA";
                  this.onEditCall(item, data_temp, compname, comptotcost, "ManPower", compType);

                  this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
                }
              }
            ]
          };

        }
        else if (typsel === 'UT') {
          var unit_price_temp = event.data.UnitPrice.replace(/[^\d.-]/g, '');
          var annual_cost_temp = event.data.AnnualCost.replace(/[^\d.-]/g, '');

          var unitprice_cost_temp = (+unit_price_temp).toFixed(2) + "";
          var UtilityType;
          if (event.data.UtilityType != null) {
            var unit = this.utility_type.find((o) => o.Id == event.data.UtilityType);
            if (unit)
              UtilityType = unit.Desc;
          }

          var UOM;
          if (event.data.Unit != null) {
            var unit1 = this.uom_list.find((o) => o.Code == event.data.Unit);
            if (unit1)
              UOM = unit1.Name;
          }


          //var total_cost_temp = event.data.TotalCost.slice(0, -1);
          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",
            typselcode: typsel,
            inputs: [
              // {
              //   id: "Year",
              //   name: "Year",
              //   type: "select",
              //   selected: event.data.Year,
              //   value: this.future_15_years,
              //   required: "true",
              // },

              {
                id: "UtilityType",
                name: this.translate.instant('TECHNICAL_INFORMATION.UtilityType'),
                type: "select",
                selected: UtilityType,
                value: this.utility_type_desc,
                required: "true",
              },
              {
                id: "Unit",
                name: this.translate.instant('TECHNICAL_INFORMATION.UtilitiesUOM'),
                type: "select",
                selected: UOM,
                value: this.uom_text,
                required: "true",
              },
              {
                id: "UnitPrice",
                name: this.translate.instant('TECHNICAL_INFORMATION.UnitPrice'),
                type: "text",
                value: unitprice_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "TotalUse",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalUse'),
                type: "number",
                value: event.data.TotalUse,
                placeholder: this.translate.instant('TECHNICAL_INFORMATION.EnterTotalUsePerYear'),
                required: "true",
              },
              {
                id: "AnnualCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.AnnualCost'),
                type: "text_disabled",
                value: annual_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              // {
              //   id: "UtilityMetCurr",
              //   name: "Utility MetCurr",
              //   type: "text",
              //   value: event.data.UtilityMetCurr,
              //   required: "true",
              // }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  var utilitiesdetail_source_data_array = [];
                  var utilitiesdetail_source_data = {
                    Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid, Year: "",
                    UtilityType: modal_data.inputs[0].selected,
                    Unit: modal_data.inputs[1].selected, UnitPrice: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[2].value),
                    TotalUse: modal_data.inputs[3].value, AnnualCost: modal_data.inputs[4].value,
                    UtilityMetCurr: ""
                  };
                  if (event.data.UtilitiesDetailId === undefined) {
                    utilitiesdetail_source_data["Operation"] = "C";
                  }
                  else {
                    utilitiesdetail_source_data["Operation"] = "U";
                  }

                  utilitiesdetail_source_data["AnnualCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+utilitiesdetail_source_data["AnnualCost"]).toFixed(2)) + "";

                  var unit = this.utility_type.find((o) => o.DescAr == utilitiesdetail_source_data["UtilityType"]|| o.Desc == utilitiesdetail_source_data["UtilityType"]);
                  if (unit)
                    utilitiesdetail_source_data["UtilityType"] = unit.Id;

                  var unit1 = this.uom_list.find((o) => o.NameAr == utilitiesdetail_source_data["Unit"]|| o.Name == utilitiesdetail_source_data["Unit"]);
                  if (unit1)
                    utilitiesdetail_source_data["Unit"] = unit1.Code;

                  this.utilitiesdetail_localdatasource_array[item.localdatasource_index - 1].update(event.data, utilitiesdetail_source_data);
                  item.source.update(event.data, utilitiesdetail_source_data);

                  var x = 0;
                  for (var i = 0; i < item.source.data.length; i++) {
                    if (i === +item.source.data.length - 1) {
                      x = +x + +utilitiesdetail_source_data.AnnualCost.replace(/[^\d.-]/g, '');
                    }
                    else {
                      x = +x + +item.source.data[i].AnnualCost.replace(/[^\d.-]/g, '');
                    }
                  }
                  item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
                  item.source.refresh();

                  var data_temp = [];
                  data_temp.push(utilitiesdetail_source_data);
                  data_temp[0]["AnnualCost"] = this.removeSAR(utilitiesdetail_source_data["AnnualCost"]);
                  data_temp[0]["UnitPrice"] = this.removeSAR(utilitiesdetail_source_data["UnitPrice"]);
                  data_temp[0]["ComponentId"] = event.data.ComponentId;
                  data_temp[0]["WbsId"] = event.data.WbsId;
                  data_temp[0]["Index"] = event.data.Index;

                  var comptotcost = data_temp[0]["AnnualCost"];
                  var compname = modal_data.inputs[0].selected;
                  var compType = "UT";
                  this.onEditCall(item, data_temp, compname, comptotcost, "UtilitiesDetail", compType);

                  this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");

                }
              }
            ]
          };

        }
        else if (typsel === 'SA') {
          var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');

          var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
          var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";


          var Quantity_UOM;
          if (event.data.QuantityUom != null) {
            var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
            if (unit)
              Quantity_UOM = unit.Name;
          }

          var Quantity_UOM2;
          if (event.data.Category != null) {
            var unit = this.safety_category.find((o) => o.Id == event.data.Category);
            if (unit)
              Quantity_UOM2 = unit.Desc;
          }
          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",

            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,
            inputs: [
              {
                id: "Description",
                name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
                type: "text",
                value: event.data.Description,
                required: "true",
              },

              {
                id: "Category",
                name: this.translate.instant('TECHNICAL_INFORMATION.Category'),
                type: "select",
                selected: Quantity_UOM2,
                value: this.safety_category_desc,
                required: "true",
              },
              {
                id: "Quantity",
                name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
                type: "number",
                value: event.data.Quantity,
                required: "true",
              },
              {
                id: "QuantityUom",
                name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
                type: "select",
                selected: Quantity_UOM,
                value: this.uom_text,
                required: "true",
              },
              {
                id: "SingleCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
                type: "text",
                value: single_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
                type: "text_disabled",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },
              {
                id: "Purpose",
                name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
                type: "text",
                value: event.data.Purpose,
                required: "true",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentFireFighting'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: ""
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentFireAlarm'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: ""
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentEnvironmentImpact'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: ""
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentSafetyWorks'),
                type: "file_multiple",
                file: "",
                required: "true",
                visible: true,
                value: ""
              },
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  this.Ng4LoadingSpinnerService.show();
                  //var rand_num = this.commonService.returnRandomNumber();
                  var guiid_temp = modal_data.event.data.GuiId;
                  var upload_post = "";

                  if (modal_data.inputs[7].file) {
                    var data = {
                      documentDefId: 381,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    this.uploadDocumentFunction(modal_data.inputs[7].file, data);
                  }
                  if (modal_data.inputs[8].file) {
                    var data = {
                      documentDefId: 382,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    this.uploadDocumentFunction(modal_data.inputs[8].file, data);
                  }
                  if (modal_data.inputs[9].file) {
                    var data = {
                      documentDefId: 383,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    this.uploadDocumentFunction(modal_data.inputs[9].file, data);
                  }
                  if (modal_data.inputs[10].file) {
                    var data = {
                      documentDefId: 384,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: guiid_temp,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };
                    this.uploadDocumentFunction(modal_data.inputs[10].file, data);
                  }
                  // this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
                  //   .then(requests => (
                  //      upload_post = this.onDocumentUpload(requests),
                  this.safety_edit(item, modal_data, event);



                  // if(modal_data.inputs[7].file){
                  // this.Ng4LoadingSpinnerService.show();
                  // var upload_post = "";
                  // var data = {
                  //   documentDefId: 121,
                  //   entityId: this.requestId,
                  //   entityName: "Project",
                  //   RelatedEntityId: event.data.GuiId,
                  //   RelatedEntityName: "technicalInfos",
                  //   operationType: "l"
                  // };

                  // this.communicationsService.uploadDocumentService(modal_data.inputs[7].file, data)
                  //   .then(requests => (
                  //     (
                  //       upload_post = this.onDocumentUpload(requests),
                  //       this.safety_edit(item, modal_data, event),
                  //       this.Ng4LoadingSpinnerService.hide()
                  //     ), err => (this.Ng4LoadingSpinnerService.hide())));

                  //   }
                  //   else{
                  //     this.safety_edit(item, modal_data, event);
                  //   }


                }
              }
            ]
          };

        }
        else if (typsel === 'KN') {
          var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
          var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";
          var foreign_cost_temp = "";
          var foreign_cost_temp2 = "";
          if (event.data.Currency) {
            foreign_cost_temp = event.data.Currency.replace(/[^\d.-]/g, '');
            foreign_cost_temp2 = (+foreign_cost_temp).toFixed(2) + "";
          }

          var totalCostCurr_temp = "";
          if (event.data.TotalCostCurr)
            totalCostCurr_temp = this.findNameFromCode(this.CurrencyList, event.data.TotalCostCurr, "Code", "Name")

          technicaltableinfoModalParams = {

            header: this.translate.instant('TECHNICAL_INFORMATION.Edit') + " " + typselname, operation: "Edit",

            documentjson: this.documentStructure,
            requestId: this.requestId,
            event: event,
            typselcode: typsel,
            inputs: [

              {
                id: "Description",
                name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
                type: "text",
                value: event.data.Description,
                required: "true",
              },
              {
                id: "TotalCost",
                name: this.translate.instant('TECHNICAL_INFORMATION.LocalCost'),
                type: "text",
                value: total_cost_temp,
                required: "true",
                cost: "true",
                currency: "SAR ",
              },

              {
                id: "TotalCostCurr",
                name: this.translate.instant('TECHNICAL_INFORMATION.Currency'),
                type: "select",
                value: this.CurrencyNameList,
                selected: totalCostCurr_temp,
                required: "false",
              },
              {
                id: "Currency",
                name: this.translate.instant('TECHNICAL_INFORMATION.ForeignCost'),
                type: "text",
                value: foreign_cost_temp2,
                required: "false",
                cost: "true",
                currency: (event.data.TotalCostCurr + " "),
              },

              {
                id: "Purpose",
                name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
                type: "text",
                value: event.data.Purpose,
                required: "true",
              },
              {
                id: "Duration",
                name: this.translate.instant('TECHNICAL_INFORMATION.DurationofAgreement'),
                type: "number",
                value: event.data.Duration,
                required: "true",
              },
              {
                id: "attachment",
                name: this.translate.instant('TECHNICAL_INFORMATION.attachmentKnowHow'),
                type: "file_multiple",
                file: "",
                required: "false",
                visible: true,
                value: ""
              }
            ],
            buttons: [
              {
                name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
                type: "Submit",
                class: "btn-success",

                handler: (modal_data) => {
                  if (modal_data.inputs[this.findIndexFromId(modal_data.inputs, "attachment")].file) {
                    this.Ng4LoadingSpinnerService.show();
                    event.data["GuiId"] = event.data["GuiId"] ? event.data.GuiId : this.commonService.returnRandomNumber();
                    var upload_post = "";
                    var data = {
                      documentDefId: 121,
                      entityId: this.requestId,
                      entityName: "Project",
                      RelatedEntityId: event.data.GuiId,
                      RelatedEntityName: "technicalInfos",
                      operationType: "l"
                    };

                    this.communicationsService.uploadDocumentService(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "attachment")].file, data)
                      .then(requests => (
                        (
                          upload_post = this.onDocumentUpload(requests),
                          this.knowhowag_edit(item, modal_data, event),
                          this.Ng4LoadingSpinnerService.hide()
                        ), err => (this.Ng4LoadingSpinnerService.hide())));
                  }
                  else {
                    this.knowhowag_edit(item, modal_data, event);
                  }

                }
              }
            ]
          };

        }

        if (typsel === 'ME' || typsel === 'RA' || typsel === "VE" || typsel === "FU" || typsel === "IT" || typsel === "PR" || typsel === "SA" || typsel === "KN") {
          this.Ng4LoadingSpinnerService.show();

          this.documentStructure = {};

          this.communicationsService.getDocumentService(this.requestId, "p").then(requests => {

            this.documentStructure = this.commonService.returnViewDocumentJson(requests);

            // console.log(this.documentStructure);

            this.Ng4LoadingSpinnerService.hide();

            technicaltableinfoModalParams["documentjson"] = this.documentStructure;

            let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
            techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
            this.techInfoModalParams_g = technicaltableinfoModalParams;
            this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
          });
        }
        else {
          let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
          techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
          this.techInfoModalParams_g = technicaltableinfoModalParams;
          this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
        }
      } else {
        this.commonService.showFailureToast("Cannot Edit");
      }
    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.Editing') + " " + item.typeselname + " " + this.translate.instant('COMMON.failed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }
  }

  //View
  onView(event, table_name_code, table_name) {

    try {
      let technicaltableinfoModalParams = {};


      if (table_name_code === 'ME') {

        //this.me_BidAnalysis_source = event.data.BidAnalysis;
        this.me_BidAnalysis_source.data = event.data.BidAnalysis ? event.data.BidAnalysis : this.me_BidAnalysis_source.data;
        this.setBidAnalysisFirstColumn();

        var cost_temp2 = event.data.Cost.replace(/[^\d.-]/g, '');
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, ''); // To remove non numeric characters
        var cost_temp = (+cost_temp2).toFixed(2) + "";
        var total_cost_temp = (+total_cost_temp2).toFixed(2);

        var Quantity_UOM;
        if (event.data.QuantityUom != null) {
          var unit = this.quantityUOM_machinery.find((o) => o.Id == event.data.QuantityUom);
          if (unit)
            Quantity_UOM = unit.Desc;
        }

        var source_of_origin_machinery_temp;
        if (event.data.SourceOrigin != null) {
          var unit1 = this.source_of_origin_machinery.find((o) => o.Id == event.data.SourceOrigin);
          if (unit1)
            source_of_origin_machinery_temp = unit1.Desc;
        }

        var mach_status;
        if (event.data.MachineStatusId != null) {
          var unit2 = this.machinery_status.find((o) => o.Id == event.data.MachineStatusId);
          if (unit2)
            mach_status = unit2.Desc;
        }

        var supplier_origin_machinery_temp;
        if (event.data.SuppOrigin != null) {
          var unit1 = this.CountryDD.find((o) => o.Code == event.data.SuppOrigin);
          if (unit1)
            supplier_origin_machinery_temp = unit1.Name;
        }

        var ForeignCurrency_temp = this.findNameFromCode(this.CurrencyList, event.data.ForeignCurrency, "Code", "Name");
        var ForeignCost_temp = +event.data.ForeignCost * +event.data.Quantity;

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operation: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [
            {
              id: "MachineName",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineryandEquipmentName'),
              type: "text",
              value: event.data.MachineName,
              required: "true",
            },
            {
              id: "MachineSpecs",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineSpecs'),
              type: "text",
              value: event.data.MachineSpecs,
              required: "false",
            },
            {
              id: "MachineDesc",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineDesc'),
              type: "text",
              value: event.data.MachineDesc,
              required: "true",
            },
            {
              id: "MachineStatusId",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineStatusId'),
              type: "text",
              value: mach_status,
              required: "true",
            },
            {
              id: "MachineCap",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachineCap'),
              type: "text",
              value: event.data.MachineCap,
              required: "false",
              hideable: false,
            },
            {
              id: "QuotInvNo",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuotInvNo'),
              type: "text",
              value: event.data.QuotInvNo,
              required: "true",
            },
            {
              id: "QuotDate",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuotDate'),
              type: "text",
              value: event.data.QuotDate,
              required: "true",
            },
            // {
            //   id: "ReeferenceNo",
            //   name: "Reference Number",
            //   type: "text",
            //   value: event.data.ReeferenceNo,
            //   required: "true",
            // },
            {
              id: "SupplierId",
              name: this.translate.instant('TECHNICAL_INFORMATION.ManufacturerName'),
              type: "text",
              value: event.data.SupplierId,
              required: "true",
            },
            {
              id: "SuppOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.ManufacturerOrigin'),
              type: "text",
              value: supplier_origin_machinery_temp,
              required: "true",
              hideable: false,
            },
            {
              id: "SourceOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.SourceOrigin'),
              type: "text",
              value: source_of_origin_machinery_temp,
              required: "true",
            },
            {
              id: "ConnecLoad",
              name: this.translate.instant('TECHNICAL_INFORMATION.ConnecLoad'),
              type: "text",
              value: event.data.ConnecLoad,
              required: "false",
            },
            {
              id: "PowerLoad",
              name: this.translate.instant('TECHNICAL_INFORMATION.MachinePowerLoad'),
              type: "number",
              value: event.data.PowerLoad,
              required: "false",

            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "text",
              value: event.data.Quantity,
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "text",
              value: Quantity_UOM,
              required: "false",
            },
            {
              id: "Cost",
              name: this.translate.instant('TECHNICAL_INFORMATION.Cost'),
              type: "text_disabled",
              value: cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "ForeignCurrency",
              name: this.translate.instant('CONTRACTS.ForeignCurrency'),
              type: "text_disabled",
              value: ForeignCurrency_temp,
              required: "false",
            },
            {
              id: "ForeignCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.ForeignCost'),
              type: "text_disabled",
              value: event.data.ForeignCost,
              required: "false",
              cost: "true",
              currency: (event.data.ForeignCurrency ? (event.data.ForeignCurrency + " ") : " "),

            },
            {
              id: "TotalForeignCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalForeignCost'),
              type: "text_disabled",
              value: ForeignCost_temp,
              required: "false",
              cost: "true",
              currency: (event.data.ForeignCurrency ? (event.data.ForeignCurrency + " ") : " "),
            },
            {
              id: "ShipmentTerms",
              name: this.translate.instant('TECHNICAL_INFORMATION.ShipmentTerms'),
              type: "text",
              value: event.data.ShipmentTerms,
              required: "false",

            },
            {
              id: "TechSpecInc",
              name: this.translate.instant('TECHNICAL_INFORMATION.TechSpecInc'),
              type: "text",
              //   selected: event.data.TechSpecInc,
              value: event.data.TechSpecInc,
              required: "true",

            },
            {
              name: "BidAnalysis",
              type: "table",
              id: "bidAnalysis",
              settings: this.me_BidAnalysis_settings,
              source: this.me_BidAnalysis_source,
            }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'BC') {

        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
        var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",


          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [
            {
              id: "CivilItem",
              name: this.translate.instant('TECHNICAL_INFORMATION.CivilItem'),
              type: "text",
              value: event.data.CivilItem,
              required: "true",
            },
            {
              id: "ItemDesc",
              name: this.translate.instant('TECHNICAL_INFORMATION.ItemDesc'),
              type: "text",
              value: event.data.ItemDesc,
              required: "true",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: event.data.Purpose,
              required: "true",
            }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'VE') {
        var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
        var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
        var Quantity_UOM;
        // if (event.data.QuantityUom != null) {
        //   var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
        //   if (unit)
        //     Quantity_UOM = unit.Name;
        // }
        // var Desc_status = "false";
        // if (event.data.VehicleType === "OT") {
        //   Desc_status = "true";
        // }
        // else {
        //   Desc_status = "false";
        // }
        var VehicleType;
        if (event.data.VehicleType != null) {
          var unit = this.vehicle_type.find((o) => o.Id == event.data.VehicleType);
          if (unit)
            VehicleType = unit.Desc;
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,
          method: "view",

          inputs: [
            {
              id: "VehicleType",
              name: this.translate.instant('TECHNICAL_INFORMATION.VehicleType'),
              type: "text",
              value: VehicleType,
              required: "true",
            },
            {
              id: "VehicleName",
              name: this.translate.instant('TECHNICAL_INFORMATION.VehicleName'),
              type: "text",
              value: event.data.VehicleName,
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "text",
              value: event.data.Quantity,
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "text",
              value: "Unit",
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.UnitCost'),
              type: "text_disabled",
              value: single_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp2,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: event.data.Purpose,
              required: "true",
            }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'FU') {

        var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
        var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');

        var Quantity_UOM;
        if (event.data.QuantityUom != null) {
          var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
          if (unit)
            Quantity_UOM = unit.Name;
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: event.data.Description,
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "text",
              value: event.data.Quantity,
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "text",
              value: Quantity_UOM,
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
              type: "text_disabled",
              value: single_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp2,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: event.data.Purpose,
              required: "true",
            }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'IT') {

        var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
        var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
        var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

        // var Quantity_UOM;
        // if (event.data.QuantityUom != null) {
        //   var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
        //   if (unit)
        //     Quantity_UOM = unit.Name;
        // }

        var category_temp;
        if (event.data.Category != null) {
          var unit1 = this.it_category.find((o) => o.Id == event.data.Category);
          if (unit1)
            category_temp = unit1.Desc;
        }

        var order_temp;
        if (event.data.OrderType != null) {
          var unit1 = this.it_order_type.find((o) => o.Id == event.data.OrderType);
          if (unit1)
            order_temp = unit1.Desc;
        }

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: event.data.Description,
              required: "true",
            },
            {
              id: "OrderType",
              name: this.translate.instant('TECHNICAL_INFORMATION.OrderType'),
              type: "text",
              value: order_temp,
              required: "true",
            },
            {
              id: "Category",
              name: this.translate.instant('TECHNICAL_INFORMATION.Category'),
              type: "text",
              value: category_temp,
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "text",
              value: event.data.Quantity,
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "text",
              value: event.data.QuantityUom,
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
              type: "text_disabled",
              value: single_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCost_nb",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: +single_cost_temp * +event.data.Quantity,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "Discount",
              name: this.translate.instant('TECHNICAL_INFORMATION.DiscountP'),
              type: "number",
              value: event.data.Discount,
              required: "false",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.NetCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: event.data.Purpose,
              required: "true",
            }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'PR') {

        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
        var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: event.data.Description,
              required: "true",
            },

            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

          ],
          buttons: []
        };

      }
      else if (table_name_code === 'RA') {
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
        var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";
        var rawmat_cost_temp2 = event.data.RawMatCostUom.replace(/[^\d.-]/g, '');
        var RawMatCostUom = (+rawmat_cost_temp2).toFixed(2) + "";

        var Quantity_UOM;
        if (event.data.RawMatQuanPerUomProdUom != null) {
          var unit = this.uom_list.find((o) => o.Code == event.data.RawMatQuanPerUomProdUom);
          if (unit)
            Quantity_UOM = unit.Name;
        }

        var Quantity_UOM2;
        if (event.data.Product != null) {
          var unit2 = this.product_list.find((o) => o.ProductId == event.data.Product);
          if (unit2)
            Quantity_UOM2 = unit2.ProductName;
        }

        var source_rawmat;
        if (event.data.SourceOrigin != null) {
          var unit3 = this.source_of_origin_rawmat.find((o) => o.Id == event.data.SourceOrigin);
          if (unit3)
            source_rawmat = unit3.Desc;
        }
        var supplier_origin_rawmat_temp;
        if (event.data.CountryOrigin != null) {
          var unit1 = this.CountryDD.find((o) => o.Code == event.data.CountryOrigin);
          if (unit1)
          supplier_origin_rawmat_temp = unit1.Name;
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",
          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,
          method: "view",

          inputs: [
            // {
            //   id: "Year",
            //   name: "Year",
            //   type: "text",
            //   value: event.data.Year,
            //   required: "true",
            // },

            {
              id: "RawMatName",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatName'),
              type: "text",
              value: event.data.RawMatName,
              required: "true",
            },
            {
              id: "Product",
              name: this.translate.instant('TECHNICAL_INFORMATION.Product'),
              type: "text",
              value: Quantity_UOM2,
              required: "true",
            },
            {
              id: "RawMatQuanPerUomProd",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProd'),
              type: "text",
              placeholder: this.translate.instant('TECHNICAL_INFORMATION.QuantityRequiredToManufactureProduct'),
              value: event.data.RawMatQuanPerUomProd,
              required: "true",
            },
            {
              id: "RawMatQuanPerUomProdUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatQuanPerUomProdUom'),
              type: "text",
              value: Quantity_UOM,
              required: "true",
            },
            {
              id: "RawMatCostUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.RawMatCostUom'),
              type: "text_disabled",
              value: RawMatCostUom,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "CountryOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.CountryofOrigin'),
              type: "text",
              value: supplier_origin_rawmat_temp,
              required: "true",
              hideable: false,
            },
            {
              id: "SuppName",
              name: this.translate.instant('TECHNICAL_INFORMATION.SuppName'),
              type: "text",
              value: event.data.SuppName,
              required: "true",
            },
            {
              id: "SourceOrigin",
              name: this.translate.instant('TECHNICAL_INFORMATION.SourceOrigin'),
              type: "text",
              value: source_rawmat,
              required: "true",
            },

          ],
          buttons: []
        };

      }
      else if (table_name_code === 'MA') {
        // var basic_salary_temp2 = event.data.BasicMonthSal.replace(/[^\d.-]/g, '');
        // var total_salary_temp2 = event.data.TotalSalary.replace(/[^\d.-]/g, '');
        // var total_cost_monthly_salary_temp2 = event.data.TotalCostMonthSal.replace(/[^\d.-]/g, '');
        var basic_monthly_salary_temp2 = event.data.BasicMonthSal.replace(/[^\d.-]/g, '');
        var total_monthly_temp2 = event.data.TotalCostMonthSal.replace(/[^\d.-]/g, '');
        var total_salary_temp2 = event.data.TotalSalary.replace(/[^\d.-]/g, '');

        var LabourType_temp;
        if (event.data.LabourType != null) {
          var unit = this.labour_type.find((o) => o.Id == event.data.LabourType);
          if (unit)
            LabourType_temp = unit.Desc;
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",
          typselcode: table_name_code,
          // table_name: table_name,

          method: "view",

          inputs: [
            {
              id: "Year",
              name: this.translate.instant('TECHNICAL_INFORMATION.YearOfHiring'),
              type: "text",
              value: event.data.Year,
              required: "false",
            },

            // {
            //   id: "LabourType",
            //   name: this.translate.instant('TECHNICAL_INFORMATION.LabourType'),
            //   type: "text",
            //   value: LabourType_temp,
            //   required: "true",
            // },
            {
              id: "JobDesc",
              name: this.translate.instant('TECHNICAL_INFORMATION.JobDesc'),
              type: "text",
              value: event.data.JobDesc,
              required: "true",
            },
            {
              id: "NoPositions",
              name: this.translate.instant('TECHNICAL_INFORMATION.NoPositions'),
              type: "text",
              value: event.data.NoPositions,
              required: "true",
            },

            {
              id: "BasicMonthSal",
              name: this.translate.instant('TECHNICAL_INFORMATION.BasicMonthSal'),
              type: "text_disabled",
              value: basic_monthly_salary_temp2,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCostMonthSal",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCostMonthSal'),
              type: "text_disabled",
              value: total_monthly_temp2,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "AddBenefPerc",
              name: this.translate.instant('TECHNICAL_INFORMATION.AddBenefPerc'),
              type: "text",
              value: event.data.AddBenefPerc,
              required: "true",
            },
            {
              id: "TotalSalary",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalSalary'),
              type: "text_disabled",
              value: total_salary_temp2,
              required: "true",
              cost: "true",
              currency: "SAR ",
            }

          ],
          buttons: []
        };

      }
      else if (table_name_code === 'UT') {
        var unit_price_temp = event.data.UnitPrice.replace(/[^\d.-]/g, '');
        var annual_cost_temp = event.data.AnnualCost.replace(/[^\d.-]/g, '');

        var unitprice_cost_temp = (+unit_price_temp).toFixed(2) + "";
        var UtilityType;
        if (event.data.UtilityType != null) {
          var unit = this.utility_type.find((o) => o.Id == event.data.UtilityType);
          if (unit)
            UtilityType = unit.Desc;
        }

        var UOM;
        if (event.data.Unit != null) {
          var unit1 = this.uom_list.find((o) => o.Code == event.data.Unit);
          if (unit1)
            UOM = unit1.Name;
        }

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",
          typselcode: table_name_code,
          method: "view",

          inputs: [
            // {
            //   id: "Year",
            //   name: "Year",
            //   type: "text",
            //   value: event.data.Year,
            //   required: "true",
            // },

            {
              id: "UtilityType",
              name: this.translate.instant('TECHNICAL_INFORMATION.UtilityType'),
              type: "text",
              value: UtilityType,
              required: "true",
            },
            {
              id: "Unit",
              name: this.translate.instant('TECHNICAL_INFORMATION.UtilitiesUOM'),
              type: "text",
              value: UOM,
              required: "true",
            },
            {
              id: "UnitPrice",
              name: this.translate.instant('TECHNICAL_INFORMATION.UnitPrice'),
              type: "text_disabled",
              value: unitprice_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalUse",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalUse'),
              type: "text",
              value: event.data.TotalUse,
              required: "true",
            },
            {
              id: "AnnualCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.AnnualCost'),
              type: "text_disabled",
              value: annual_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            // {
            //   id: "UtilityMetCurr",
            //   name: "Utility MetCurr",
            //   type: "text",
            //   value: event.data.UtilityMetCurr,
            //   required: "true",
            // }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'SA') {

        var single_cost_temp2 = event.data.SingleCost.replace(/[^\d.-]/g, '');
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');

        var single_cost_temp = (+single_cost_temp2).toFixed(2) + "";
        var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";

        var Quantity_UOM;
        if (event.data.QuantityUom != null) {
          var unit = this.uom_list.find((o) => o.Code == event.data.QuantityUom);
          if (unit)
            Quantity_UOM = unit.Name;
        }

        var Quantity_UOM2;
        if (event.data.Category != null) {
          var unit = this.safety_category.find((o) => o.Id == event.data.Category);
          if (unit)
            Quantity_UOM2 = unit.Desc;
        }
        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [
            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: event.data.Description,
              required: "true",
            },

            {
              id: "Category",
              name: this.translate.instant('TECHNICAL_INFORMATION.Category'),
              type: "text",
              value: Quantity_UOM2,
              required: "true",
            },
            {
              id: "Quantity",
              name: this.translate.instant('TECHNICAL_INFORMATION.Quantity'),
              type: "text",
              value: event.data.Quantity,
              required: "true",
            },
            {
              id: "QuantityUom",
              name: this.translate.instant('TECHNICAL_INFORMATION.QuantityUom'),
              type: "text",
              value: Quantity_UOM,
              required: "true",
            },
            {
              id: "SingleCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.SingleCost'),
              type: "text_disabled",
              value: single_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.TotalCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: event.data.Purpose,
              required: "true",
            }
          ],
          buttons: []
        };

      }
      else if (table_name_code === 'KN') {
        var total_cost_temp2 = event.data.TotalCost.replace(/[^\d.-]/g, '');
        var total_cost_temp = (+total_cost_temp2).toFixed(2) + "";
        var foreign_cost_temp = "";
        var foreign_cost_temp2 = "";
        if (event.data.Currency) {
          foreign_cost_temp = event.data.Currency.replace(/[^\d.-]/g, '');
          foreign_cost_temp2 = (+foreign_cost_temp).toFixed(2) + "";
        }

        var totalCostCurr_temp = "";
        if (event.data.TotalCostCurr)
          totalCostCurr_temp = this.findNameFromCode(this.CurrencyList, event.data.TotalCostCurr, "Code", "Name")

        technicaltableinfoModalParams = {

          header: this.translate.instant('TECHNICAL_INFORMATION.View') + " " + table_name, operaton: "View",

          documentjson: this.documentStructure,
          requestId: this.requestId,
          event: event,
          typselcode: table_name_code,

          method: "view",

          inputs: [

            {
              id: "Description",
              name: this.translate.instant('TECHNICAL_INFORMATION.Description'),
              type: "text",
              value: event.data.Description,
              required: "true",
            },
            {
              id: "TotalCost",
              name: this.translate.instant('TECHNICAL_INFORMATION.LocalCost'),
              type: "text_disabled",
              value: total_cost_temp,
              required: "true",
              cost: "true",
              currency: "SAR ",
            },
            {
              id: "TotalCostCurr",
              name: this.translate.instant('TECHNICAL_INFORMATION.Currency'),
              type: "text",
              value: totalCostCurr_temp,
              required: "false",
            },
            {
              id: "Currency",
              name: this.translate.instant('TECHNICAL_INFORMATION.ForeignCost'),
              type: "text_disabled",
              value: foreign_cost_temp2,
              required: "false",
              cost: "true",
              currency: (event.data.TotalCostCurr + " "),
            },

            {
              id: "Purpose",
              name: this.translate.instant('TECHNICAL_INFORMATION.Purpose'),
              type: "text",
              value: event.data.Purpose,
              required: "true",
            },
            {
              id: "Duration",
              name: this.translate.instant('TECHNICAL_INFORMATION.DurationofAgreement'),
              type: "number",
              value: event.data.Duration,
              required: "true",
            },
          ],
          buttons: []
        };

      }
      if (table_name_code === 'ME' || table_name_code === 'RA' || table_name_code === "VE" || table_name_code === "FU" || table_name_code === "IT" || table_name_code === "PR" || table_name_code === "SA" || table_name_code === "KN") {
        this.Ng4LoadingSpinnerService.show();

        this.documentStructure = {};

        this.communicationsService.getDocumentService(this.requestId, "p").then(requests => {

          this.documentStructure = this.commonService.returnViewDocumentJson(requests);

          // console.log(this.documentStructure);

          this.Ng4LoadingSpinnerService.hide();

          technicaltableinfoModalParams["documentjson"] = this.documentStructure;

          let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
          techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
          this.techInfoModalParams_g = technicaltableinfoModalParams;
          this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
        });
      }
      else {
        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
        this.techInfoModalParams_g = technicaltableinfoModalParams;
        this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
      }

    } catch (err) {
      this.Ng4LoadingSpinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.Viewing') + " " + table_name + " " + this.translate.instant('COMMON.failed') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }

  }

  onDocumentUpload(requests) {

    if (requests.MessType == "S") {
      //  this.commonService.showSuccessToast("Document Uploaded Successfully !");
      return ("S");
    }

    else {
      this.commonService.showFailureToast(requests.message);
      return ("E");
    }
  }

  machinery_add(item, modal_data, rand_num) {
    var machinery_source_data_array = [];

    var machinery_quotation_temp_source = [];
    var machinery_source_data = {
      Operation: "C", ComponentId: "", WbsId: "",
      MachineName: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineName")].value,
      MachineSpecs: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineSpecs")].value,
      MachineDesc: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineDesc")].value,
      MachineStatusId: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineStatusId")].selected,
      MachineCap: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineCap")].value,
      QuotInvNo: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "QuotInvNo")].value,
      QuotDate: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "QuotDate")].value,
      ReeferenceNo: "",
      SupplierId: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "SupplierId")].value,
      SuppOrigin: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "SuppOrigin")].selected,
      SourceOrigin: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "SourceOrigin")].selected,
      ConnecLoad: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ConnecLoad")].value,
      Quantity: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Quantity")].value,
      QuantityUom: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "QuantityUom")].selected,
      Cost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Cost")].value),
      CostCurr: "SAR",
      TotalCost: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TotalCost")].value,
      TechSpecInc: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TechSpecInc")].selected,
      TotalCostCurr: "SAR",
      ForeignCurrency: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ForeignCurrency")].selected,
      ForeignCost: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ForeignCost")].value,
      PowerLoad: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "PowerLoad")].value,
      ShipmentTerms: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ShipmentTerms")].value,
      CompQuot: [], GuiId: rand_num,
      BidAnalysis: this.me_BidAnalysis_source.data
    };

    machinery_source_data["ForeignCurrency"] = this.findCodeFromName(this.CurrencyList, machinery_source_data["ForeignCurrency"], "Code", "Name");

    var unit1 = this.machinery_status.find((o) => o.DescAr == machinery_source_data["MachineStatusId"]||o.Desc == machinery_source_data["MachineStatusId"]);
    if (unit1)
      machinery_source_data["MachineStatusId"] = unit1.Id;

    var date_temp = machinery_source_data["QuotDate"];
    machinery_source_data["QuotDate"] = date_temp.getFullYear() + "-" + (+date_temp.getMonth() + 1) + "-" + date_temp.getDate();

    var unit = this.quantityUOM_machinery.find((o) => o.DescAr == machinery_source_data["QuantityUom"]|| o.Desc == machinery_source_data["QuantityUom"]);
    if (unit)
      machinery_source_data["QuantityUom"] = unit.Id;

    var unit3 = this.source_of_origin_machinery.find((o) => o.DescAr == machinery_source_data["SourceOrigin"]|| o.Desc == machinery_source_data["SourceOrigin"]);
    if (unit3)
      machinery_source_data["SourceOrigin"] = unit3.Id;

    var unit4 = this.CountryDD.find((o) => o.DescAr == machinery_source_data["SuppOrigin"]||o.Name == machinery_source_data["SuppOrigin"]);
    if (unit4)
      machinery_source_data["SuppOrigin"] = unit4.Code;

    machinery_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+machinery_source_data["TotalCost"]).toFixed(2)) + "";
    //machinery_source_data["TotalForeignCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+machinery_source_data["TotalForeignCost"]).toFixed(2)) + "";
    //  machinery_source_data["TotalCost"] = modal_data.inputs[14].value;
    //machinery_source_data["Cost"] = modal_data.inputs[13].value;


    //console.log("sfasasdff");
    if (item.length == 0)
      item.source.load(machinery_source_data_array);

    else
      item.source.add(machinery_source_data);

    item.length++;


    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";

    item.source.refresh();

    var data_temp = [];
    //machinery_source_data_array.push(machinery_source_data);
    data_temp.push(machinery_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(machinery_source_data["TotalCost"]);
    data_temp[0]["Cost"] = this.removeSAR(machinery_source_data["Cost"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": machinery_source_data["MachineName"],
      "CompType": "ME",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Machinery": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);
    //sd
  }
  bcw_add(item, modal_data) {
    var bcw_source_data_array = [];
    var bcw_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid,
      CivilItem: modal_data.inputs[0].value, ItemDesc: modal_data.inputs[1].value, TotalCost: modal_data.inputs[2].value,
      TotalCostCurr: "SAR", Purpose: modal_data.inputs[3].value
    };
    bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";



    bcw_source_data_array.push(bcw_source_data);

    if (item.length == 0)
      item.source.load(bcw_source_data_array);

    else
      item.source.add(bcw_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    bcw_source_data_array.push(bcw_source_data);
    data_temp.push(bcw_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(bcw_source_data["TotalCost"]);
    //  data_temp[0]["RawMatCostUom"] = this.removeSAR(bcw_source_data["RawMatCostUom"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": bcw_source_data["RawMatName"],
      "CompType": "BC",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Bcw": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }
  rawmat_add(item, modal_data, rand_num) {
    var rawmaterial_source_data_array = [];
    var rawmaterial_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid, Year: "",
      RawMatName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatName")].value,
      Product: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "Product")].selected, 
      RawMatQuanPerUomProd: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatQuanPerUomProd")].value,
      RawMatQuanPerUomProdUom: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatQuanPerUomProdUom")].selected, 
      RawMatCostUom: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatCostUom")].value),
      TotalCost: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "TotalCost")].value, 
      TotalCostCurr: "SAR",
      SuppName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "SuppName")].value, 
      SourceOrigin: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "SourceOrigin")].selected,
      CountryOrigin: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "CountryOrigin")].selected,
      GuiId: rand_num
    };

    var unit4 = this.CountryDD.find((o) => o.DescAr == rawmaterial_source_data["CountryOrigin"]|| o.Name == rawmaterial_source_data["CountryOrigin"]);
    if (unit4)
    rawmaterial_source_data["CountryOrigin"] = unit4.Code;

    var unit1 = this.product_list.find((o) => o.ProductName == rawmaterial_source_data["Product"]);
    if (unit1)
      rawmaterial_source_data["Product"] = unit1.ProductId;

    var unit2 = this.uom_list.find((o) => o.NameAr == rawmaterial_source_data["RawMatQuanPerUomProdUom"]|| o.Name == rawmaterial_source_data["RawMatQuanPerUomProdUom"]);
    if (unit2)
      rawmaterial_source_data["RawMatQuanPerUomProdUom"] = unit2.Code;

    var unit3 = this.source_of_origin_rawmat.find((o) => o.DescAr == rawmaterial_source_data["SourceOrigin"]||o.Desc == rawmaterial_source_data["SourceOrigin"]);
    if (unit3)
      rawmaterial_source_data["SourceOrigin"] = unit3.Id;

    rawmaterial_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+rawmaterial_source_data["TotalCost"]).toFixed(2)) + "";
    rawmaterial_source_data_array.push(rawmaterial_source_data);

    if (item.length == 0)
      item.source.load(rawmaterial_source_data_array);

    else
      item.source.add(rawmaterial_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    // rawmaterial_source_data_array.push(rawmaterial_source_data);
    data_temp.push(rawmaterial_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(rawmaterial_source_data["TotalCost"]);
    data_temp[0]["RawMatCostUom"] = this.removeSAR(rawmaterial_source_data["RawMatCostUom"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": rawmaterial_source_data["RawMatName"],
      "CompType": "RA",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "RawMaterial": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }
  quotation_add(item, modal_data, rand_num, temp_source) {

    var quot_source_data_array = [];
    var quot_source_data = {
      Operation: "C", MachineName: modal_data.inputs[0].value,
      Manufacturer: modal_data.inputs[1].value, OriginCountry: modal_data.inputs[2].selected, Capacity: modal_data.inputs[3].value,
      CapacityUOM: modal_data.inputs[4].selected, TotalCost: modal_data.inputs[5].value + " ",
      CostCurrency: "SAR", CostIndex: modal_data.inputs[6].value,
      SelectedStat: "", GuiId: rand_num
    };
    // console.log("Hi");
    /// console.log(event2);

    quot_source_data_array.push(quot_source_data);
    // if()
    if (temp_source.data.length == 0)
      temp_source.load(quot_source_data_array);
    else
      temp_source.add(quot_source_data);

    temp_source.refresh();

    // item.length++;

    //item.source.data[0]["CompQuot"]=quot_source_data_array;

    // if(event2.data.CompQuot == null)
    // {
    //   event2.data["CompQuot"] = quot_source_data_array;
    // }
    // else {
    //   event2.data["CompQuot"].push(quot_source_data);
    // }
    // item.mach_quot_source.refresh();
    // modal_data.inputs[0].value = "";
    modal_data.inputs[1].value = "";
    modal_data.inputs[2].selected = "";
    modal_data.inputs[3].value = "";
    modal_data.inputs[4].selected = "";
    modal_data.inputs[5].value = "";
    modal_data.inputs[6].value = "";
    modal_data.inputs[7].value = "";
    modal_data.inputs[8].value = "";

    temp_source.refresh();

    var data_temp = [];
    //machinery_source_data_array.push(machinery_source_data);
    data_temp.push(modal_data.event.data);
    data_temp[0]["CompQuot"] = [];
    data_temp[0]["CompQuot"].push(quot_source_data);
    //data_temp.push(quot_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(data_temp[0]["TotalCost"]);
    data_temp[0]["Cost"] = this.removeSAR(data_temp[0]["Cost"]);
    data_temp[0]["ComponentId"] = modal_data.event.data["ComponentId"];
    data_temp[0]["WbsId"] = modal_data.event.data["WbsId"];

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "ComponentId": modal_data.event.data["ComponentId"],
      "WbsId": modal_data.event.data["WbsId"],
      "Operation": "U",
      "LoanId": this.loan_id,
      "CompName": modal_data.event.data["MachineName"],
      "CompType": "ME",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Machinery": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);
    // this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful')+ "!");
  }

  onEditCall(item, data_temp, compName, CompTotCost, postdata_name, CompType) {

    var costcomptemp = [{
      "Operation": "U",
      "LoanId": this.loan_id,
      "CompName": compName,
      "CompTotCost": CompTotCost,
      "CompTotCostCurr": "SAR",
      "ComponentId": data_temp[0]["ComponentId"],
      "WbsId": data_temp[0]["WbsId"]
    }];
    costcomptemp[0]["CompType"] = CompType;
    costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
    };
    post_data[postdata_name] = data_temp;
    //data_temp[0]["ComponentId"]
    // let index_temp = _.filter(item.source3.data, {Category: "F1"});
    this.Ng4LoadingSpinnerService.show();
    this.onSave(post_data, item.panelStep);
  }

  machinery_edit(item, modal_data, event) {
    var machinery_source_data_array = [];
    var machinery_quotation_temp_source = [];
    var machinery_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid,
      MachineName: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineName")].value,
      MachineSpecs: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineSpecs")].value,
      MachineDesc: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineDesc")].value,
      MachineStatusId: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineStatusId")].selected,
      MachineCap: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "MachineCap")].value,
      QuotInvNo: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "QuotInvNo")].value,
      QuotDate: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "QuotDate")].value,
      ReeferenceNo: "",
      SupplierId: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "SupplierId")].value,
      SuppOrigin: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "SuppOrigin")].selected,
      SourceOrigin: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "SourceOrigin")].selected,
      ConnecLoad: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ConnecLoad")].value,
      Quantity: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Quantity")].value,
      QuantityUom: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "QuantityUom")].selected,
      Cost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Cost")].value),
      CostCurr: "SAR",
      TotalCost: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TotalCost")].value,
      TechSpecInc: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TechSpecInc")].selected,
      TotalCostCurr: "SAR",
      ForeignCurrency: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ForeignCurrency")].selected,
      ForeignCost: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ForeignCost")].value,
      PowerLoad: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "PowerLoad")].value,
      ShipmentTerms: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "ShipmentTerms")].value,
      CompQuot: [], GuiId: event.data.GuiId,
      BidAnalysis: this.me_BidAnalysis_source.data
    };

    machinery_source_data["ForeignCurrency"] = this.findCodeFromName(this.CurrencyList, machinery_source_data["ForeignCurrency"], "Code", "Name");

    if (event.data.MachineId === undefined) {
      machinery_source_data["Operation"] = "C";
    }
    else {
      machinery_source_data["Operation"] = "U";
    }

    // var date_temp = modal_data.inputs[5].value;
    // machinery_source_data["QuotDate"] = date_temp.year + "-" + date_temp.month + "-" + date_temp.day;

    var date_temp = machinery_source_data["QuotDate"];
    machinery_source_data["QuotDate"] = date_temp.getFullYear() + "-" + (+date_temp.getMonth() + 1) + "-" + date_temp.getDate();


    var unit = this.quantityUOM_machinery.find((o) => o.Desc == machinery_source_data["QuantityUom"]);
    if (unit)
      machinery_source_data["QuantityUom"] = unit.Id;

    var unit3 = this.source_of_origin_machinery.find((o) => o.Desc == machinery_source_data["SourceOrigin"]);
    if (unit3)
      machinery_source_data["SourceOrigin"] = unit3.Id;

    machinery_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+machinery_source_data["TotalCost"]).toFixed(2)) + "";

    var unit1 = this.machinery_status.find((o) => o.DescAr == machinery_source_data["MachineStatusId"]||o.Desc == machinery_source_data["MachineStatusId"]);
    if (unit1)
      machinery_source_data["MachineStatusId"] = unit1.Id;

    var unit4 = this.CountryDD.find((o) => o.DescAr == machinery_source_data["SuppOrigin"]|| o.Name == machinery_source_data["SuppOrigin"]);
    if (unit4)
      machinery_source_data["SuppOrigin"] = unit4.Code;

    this.machinery_localdatasource_array[item.localdatasource_index - 1].update(event.data, machinery_source_data);

    item.source.update(event.data, machinery_source_data);
    item.source.refresh();
    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +machinery_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();

    //machinery_source_data_array.push(machinery_source_data);

    var data_temp = [];
    data_temp.push(machinery_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(machinery_source_data["TotalCost"]);
    data_temp[0]["Cost"] = this.removeSAR(machinery_source_data["Cost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["MachineName"];
    var compType = "ME";
    this.onEditCall(item, data_temp, compname, comptotcost, "Machinery", compType);


    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
  }
  bcw_edit(item, modal_data, event) {
    var bcw_source_data_array = [];
    var bcw_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid,
      CivilItem: modal_data.inputs[0].value, ItemDesc: modal_data.inputs[1].value, TotalCost: modal_data.inputs[2].value,
      TotalCostCurr: "SAR", Purpose: modal_data.inputs[3].value, GuiId: event.data.GuiId
    };
    if (event.data.BcwId === undefined) {
      bcw_source_data["Operation"] = "C";
    }
    else {
      bcw_source_data["Operation"] = "U";
    }

    bcw_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+bcw_source_data["TotalCost"]).toFixed(2)) + "";
    this.bcw_localdatasource_array[item.localdatasource_index - 1].update(event.data, bcw_source_data);
    item.source.update(event.data, bcw_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +bcw_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();
    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
  }
  quotation_edit(item, modal_data, upload_post, event, eventofclick, temp_source) {
    var quot_source_data_array = [];
    var operation;
    if (eventofclick.data.QuotId === undefined) {
      operation = "C";
    }
    else {
      operation = "U";
    }
    var quot_source_data = {
      Operation: operation, MachineName: modal_data.inputs[0].value,
      Manufacturer: modal_data.inputs[1].value, OriginCountry: modal_data.inputs[2].selected, Capacity: modal_data.inputs[3].value,
      CapacityUOM: modal_data.inputs[4].selected, TotalCost: modal_data.inputs[5].value + " ",
      CostCurrency: "SAR", CostIndex: modal_data.inputs[6].value,
      SelectedStat: "", GuiId: eventofclick.data.GuiId
    };
    //console.log(item);
    //console.log(eventofclick);

    if (eventofclick.data.QuotId != undefined && eventofclick.data.QuotId != null) {
      quot_source_data["QuotId"] = eventofclick.data.QuotId;
      quot_source_data["MachineId"] = eventofclick.data.MachineId;

    }
    //  item.source.data[0].CompQuot[0]=quot_source_data;
    // event2.data.CompQuot[eventofclick.index]=quot_source_data;
    temp_source.data[eventofclick.index] = quot_source_data;
    temp_source.refresh();

    var data_temp = [];
    //machinery_source_data_array.push(machinery_source_data);
    data_temp.push(modal_data.event.data);
    data_temp[0]["CompQuot"] = [];
    data_temp[0]["CompQuot"].push(quot_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(data_temp[0]["TotalCost"]);
    data_temp[0]["Cost"] = this.removeSAR(data_temp[0]["Cost"]);
    data_temp[0]["ComponentId"] = modal_data.event.data["ComponentId"];
    data_temp[0]["WbsId"] = modal_data.event.data["WbsId"];
    data_temp[0]["Index"] = modal_data.event.data.Index;
    //data_temp.push(quot_source_data);
    // data_temp[0]["TotalCost"] = this.removeSAR(quot_source_data["TotalCost"]);
    // data_temp[0]["Cost"] = this.removeSAR(quot_source_data["Cost"]);
    //data_temp[0]["ComponentId"] = "";
    //data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "ComponentId": modal_data.event.data["ComponentId"],
      "WbsId": modal_data.event.data["WbsId"],
      "Operation": "U",
      "LoanId": this.loan_id,
      "CompName": modal_data.event.data["MachineName"],
      "CompType": "ME",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    costcomptemp[0]["Index"] = data_temp[0]["Index"] ? data_temp[0]["Index"] : "";
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Machinery": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    this.onSave(post_data, item.panelStep);

    this.clearData(modal_data);



  }
  vehicle_edit(item, modal_data, event) {


    var vehicle_source_data_array = [];
    var vehicle_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid,
      VehicleType: modal_data.inputs[0].selected,
      VehicleName: modal_data.inputs[1].value,
      Quantity: modal_data.inputs[2].value,
      QuantityUom: modal_data.inputs[3].value,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value), SingleCostCurr: "SAR",
      TotalCost: modal_data.inputs[5].value, TotalCostCurr: "SAR",
      Purpose: modal_data.inputs[6].value, GuiId: event.data.GuiId
    };
    if (event.data.VehicleId === undefined) {
      vehicle_source_data["Operation"] = "C";
    }
    else {
      vehicle_source_data["Operation"] = "U";
    }

    // var unit = this.uom_list.find((o) => o.Name == vehicle_source_data["QuantityUom"]);
    // if (unit)
    //   vehicle_source_data["QuantityUom"] = unit.Code;
    var unit = this.vehicle_type.find((o) => o.DescAr == vehicle_source_data["VehicleType"]|| o.Desc == vehicle_source_data["VehicleType"]);
    if (unit)
      vehicle_source_data["VehicleType"] = unit.Id;


    vehicle_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+vehicle_source_data["TotalCost"]).toFixed(2)) + "";

    this.vehicle_localdatasource_array[item.localdatasource_index - 1].update(event.data, vehicle_source_data);
    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
    item.source.update(event.data, vehicle_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +vehicle_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();
    var data_temp = [];
    data_temp.push(vehicle_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(vehicle_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(vehicle_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["VehicleName"];
    var compType = "VE";
    this.onEditCall(item, data_temp, compname, comptotcost, "Vehicle", compType);
    //  this.commonService.showSuccessToast("Edit successful !");
  }
  infotech_edit(item, modal_data, event) {



    var infotech_source_data_array = [];
    var infotech_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid, Description: modal_data.inputs[0].value,
      OrderType: modal_data.inputs[1].selected,
      Category: modal_data.inputs[2].selected, Quantity: modal_data.inputs[3].value,
      QuantityUom: modal_data.inputs[4].selected,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value), SingleCostCurr: "SAR",
      Discount: modal_data.inputs[7].value,
      TotalCost: modal_data.inputs[8].value, TotalCostCurr: "SAR",
      Purpose: modal_data.inputs[9].value, GuiId: event.data.GuiId
    };
    if (event.data.InfoTechId === undefined) {
      infotech_source_data["Operation"] = "C";
    }
    else {
      infotech_source_data["Operation"] = "U";
    }

    var unit = this.it_order_type.find((o) => o.DescAr == infotech_source_data["OrderType"]|| o.Desc == infotech_source_data["OrderType"]);
    if (unit)
      infotech_source_data["OrderType"] = unit.Id;

    // var unit = this.uom_list.find((o) => o.Name == infotech_source_data["QuantityUom"]);
    // if (unit)
    //   infotech_source_data["QuantityUom"] = unit.Code;

    var unit1 = this.it_category.find((o) => o.Desc == infotech_source_data["Category"]);
    if (unit1)
      infotech_source_data["Category"] = unit1.Id;
    infotech_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+infotech_source_data["TotalCost"]).toFixed(2)) + "";

    this.infotech_localdatasource_array[item.localdatasource_index - 1].update(event.data, infotech_source_data);
    item.source.update(event.data, infotech_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +infotech_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();

    var data_temp = [];
    data_temp.push(infotech_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(infotech_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(infotech_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["Description"];
    var compType = "IT";
    this.onEditCall(item, data_temp, compname, comptotcost, "InfoTech", compType);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
  }
  furniture_edit(item, modal_data, event) {


    var furniture_source_data_array = [];
    var furniture_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid, Description: modal_data.inputs[0].value, Quantity: modal_data.inputs[1].value,
      QuantityUom: modal_data.inputs[2].selected,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[3].value), SingleCostCurr: "SAR",
      TotalCost: modal_data.inputs[4].value, TotalCostCurr: "SAR",
      Purpose: modal_data.inputs[5].value, GuiId: event.data.GuiId
    };

    if (event.data.FurnitureId === undefined) {
      furniture_source_data["Operation"] = "C";
    }
    else {
      furniture_source_data["Operation"] = "U";
    }

    var unit = this.uom_list.find((o) => o.NameAr == furniture_source_data["QuantityUom"]||o.Name == furniture_source_data["QuantityUom"]);
    if (unit)
      furniture_source_data["QuantityUom"] = unit.Code;
    furniture_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+furniture_source_data["TotalCost"]).toFixed(2)) + "";

    this.furniture_localdatasource_array[item.localdatasource_index - 1].update(event.data, furniture_source_data);
    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
    item.source.update(event.data, furniture_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +furniture_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();
    var data_temp = [];
    data_temp.push(furniture_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(furniture_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(furniture_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["Description"];
    var compType = "FU";
    this.onEditCall(item, data_temp, compname, comptotcost, "Furniture", compType);
  }
  preoper_edit(item, modal_data, event) {

    var preopercosts_source_data_array = [];
    var preopercosts_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid, Description: modal_data.inputs[0].value,
      TotalCost: modal_data.inputs[1].value, TotalCostCurr: "SAR", GuiId: event.data.GuiId
    };
    preopercosts_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+preopercosts_source_data["TotalCost"]).toFixed(2)) + "";

    if (event.data.PreOperCostsId === undefined) {
      preopercosts_source_data["Operation"] = "C";
    }
    else {
      preopercosts_source_data["Operation"] = "U";
    }
    this.preopercosts_localdatasource_array[item.localdatasource_index - 1].update(event.data, preopercosts_source_data);
    item.source.update(event.data, preopercosts_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +preopercosts_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();

    var data_temp = [];
    data_temp.push(preopercosts_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(preopercosts_source_data["TotalCost"]);
    //data_temp[0]["SingleCost"] = this.removeSAR(preopercosts_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["Description"];
    var compType = "PR";
    this.onEditCall(item, data_temp, compname, comptotcost, "PreOperCosts", compType);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
  }
  knowhowag_edit(item, modal_data, event) {


    var knowhowag_source_data_array = [];
    var knowhowag_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid,
      Description: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Description")].value,
      TotalCost: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TotalCost")].value,
      TotalCostCurr: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TotalCostCurr")].selected,
      Purpose: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Purpose")].value,
      Duration: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Duration")].value,
      Currency: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Currency")].value,
      GuiId: event.data.GuiId
    };
    knowhowag_source_data["TotalCostCurr"] = this.findCodeFromName(this.CurrencyList, knowhowag_source_data["TotalCostCurr"], "Code", "Name");

    if (event.data.KnowHowAgId === undefined) {
      knowhowag_source_data["Operation"] = "C";
    }
    else {
      knowhowag_source_data["Operation"] = "U";
    }

    knowhowag_source_data["Totalost"] = "SAR" + " " + this.commonService.numberToNumberWithCommas((+knowhowag_source_data["TotalCost"]).toFixed(2)) + "";

    this.knowhowag_localdatasource_array[item.localdatasource_index - 1].update(event.data, knowhowag_source_data);
    item.source.update(event.data, knowhowag_source_data);
    item.source.refresh();
    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +knowhowag_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();

    var data_temp = [];
    data_temp.push(knowhowag_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(knowhowag_source_data["TotalCost"]);
    if (data_temp[0]["Currency"])
      data_temp[0]["Currency"] = this.removeSAR(knowhowag_source_data["Currency"]);
    // data_temp[0]["SingleCost"] = this.removeSAR(knowhowag_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["Description"];
    var compType = "KN";
    this.onEditCall(item, data_temp, compname, comptotcost, "KnowHowAg", compType);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");

  }
  safety_edit(item, modal_data, event) {

    var safety_source_data_array = [];
    var safety_source_data = {
      Operation: item.componentOperation, ComponentId: item.componentID, WbsId: item.wbsid,
      Description: modal_data.inputs[0].value, Category: modal_data.inputs[1].selected,
      Quantity: modal_data.inputs[2].value, QuantityUom: modal_data.inputs[3].selected,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value), SingleCostCurr: "SAR",
      TotalCost: modal_data.inputs[5].value, TotalCostCurr: "SAR", IstfdEstCost: "",
      IstfdEstCostCurr: "", Purpose: modal_data.inputs[6].value, GuiId: event.data.GuiId
    };

    if (event.data.SafetyId === undefined) {
      safety_source_data["Operation"] = "C";
    }
    else {
      safety_source_data["Operation"] = "U";
    }

    var unit = this.uom_list.find((o) => o.NameAr == safety_source_data["QuantityUom"]||o.Name == safety_source_data["QuantityUom"]);
    if (unit)
      safety_source_data["QuantityUom"] = unit.Code;

    var unit = this.safety_category.find((o) => o.Id == safety_source_data["Category"]);
    if (unit)
      safety_source_data["Category"] = unit.Desc;

    safety_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+safety_source_data["TotalCost"]).toFixed(2)) + "";

    this.safety_localdatasource_array[item.localdatasource_index - 1].update(event.data, safety_source_data);
    item.source.update(event.data, safety_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +safety_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();

    var data_temp = [];
    data_temp.push(safety_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(safety_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(safety_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["Description"];
    var compType = "SA";
    this.onEditCall(item, data_temp, compname, comptotcost, "Safety", compType);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
  }
  rawmat_edit(item, modal_data, event) {
    var rawmaterial_source_data_array = [];
    var rawmaterial_source_data = {
      Operation: item.componentOperation, 
      ComponentId: item.componentID, WbsId: item.wbsid,
      Year: "", 
      RawMatName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatName")].value,
      Product: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "Product")].selected, 
      RawMatQuanPerUomProd: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatQuanPerUomProd")].value,
      RawMatQuanPerUomProdUom: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatQuanPerUomProdUom")].selected, 
      RawMatCostUom: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "RawMatCostUom")].value),
      TotalCost: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "TotalCost")].value, 
      TotalCostCurr: "SAR",
      SuppName: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "SuppName")].value, 
      SourceOrigin: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "SourceOrigin")].selected, 
      CountryOrigin: modal_data.inputs[this.commonService.findIndexFromId(modal_data.inputs, "CountryOrigin")].selected,
      GuiId: event.data.GuiId
    };

    if (event.data.RawMaterialId === undefined) {
      rawmaterial_source_data["Operation"] = "C";
    }
    else {
      rawmaterial_source_data["Operation"] = "U";
    }

    var unit4 = this.CountryDD.find((o) => o.DescAr == rawmaterial_source_data["CountryOrigin"]|| o.Name == rawmaterial_source_data["CountryOrigin"]);
    if (unit4)
      rawmaterial_source_data["CountryOrigin"] = unit4.Code;

    var unit = this.uom_list.find((o) => o.NameAr == rawmaterial_source_data["RawMatQuanPerUomProdUom"]||o.Name == rawmaterial_source_data["RawMatQuanPerUomProdUom"]);
    if (unit)
      rawmaterial_source_data["RawMatQuanPerUomProdUom"] = unit.Code;

    var unit1 = this.product_list.find((o) => o.ProductName == rawmaterial_source_data["Product"]);
    if (unit1)
      rawmaterial_source_data["Product"] = unit1.ProductId;

    var unit3 = this.source_of_origin_rawmat.find((o) => o.DescAr == rawmaterial_source_data["SourceOrigin"]||o.Desc == rawmaterial_source_data["SourceOrigin"]);
    if (unit3)
      rawmaterial_source_data["SourceOrigin"] = unit3.Id;

    rawmaterial_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+rawmaterial_source_data["TotalCost"]).toFixed(2)) + "";

    this.rawmaterial_localdatasource_array[item.localdatasource_index - 1].update(event.data, rawmaterial_source_data);
    item.source.update(event.data, rawmaterial_source_data);

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      if (i === +item.source.data.length - 1) {
        x = +x + +rawmaterial_source_data.TotalCost.replace(/[^\d.-]/g, '');
      }
      else {
        x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
      }
    }
    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2));
    item.source.refresh();

    var data_temp = [];
    data_temp.push(rawmaterial_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(rawmaterial_source_data["TotalCost"]);
    data_temp[0]["RawMatCostUom"] = this.removeSAR(rawmaterial_source_data["RawMatCostUom"]);
    data_temp[0]["ComponentId"] = event.data.ComponentId;
    data_temp[0]["WbsId"] = event.data.WbsId;
    data_temp[0]["Index"] = event.data.Index;

    var comptotcost = data_temp[0]["TotalCost"];
    var compname = data_temp[0]["RawMatName"];
    var compType = "RA";
    this.onEditCall(item, data_temp, compname, comptotcost, "RawMaterial", compType);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Editsuccessful') + "!");
  }
  vehicle_add(item, modal_data, rand_num) {

    var vehicle_source_data_array = [];
    var vehicle_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid,
      VehicleType: modal_data.inputs[0].selected,
      VehicleName: modal_data.inputs[1].value,
      Quantity: modal_data.inputs[2].value,
      QuantityUom: modal_data.inputs[3].value,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value), SingleCostCurr: "SAR",
      TotalCost: modal_data.inputs[5].value, TotalCostCurr: "SAR",
      Purpose: modal_data.inputs[6].value, GuiId: rand_num
    };
    // var unit = this.uom_list.find((o) => o.Name == vehicle_source_data["QuantityUom"]);
    // if (unit)
    //   vehicle_source_data["QuantityUom"] = unit.Code;
    // vehicle_source_data["TotalCost"] = "SAR " + (+vehicle_source_data["TotalCost"]).toFixed(2) + "";

    var unit = this.vehicle_type.find((o) => o.DescAr == vehicle_source_data["VehicleType"]||o.Desc == vehicle_source_data["VehicleType"]);
    if (unit)
      vehicle_source_data["VehicleType"] = unit.Id;

    vehicle_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+vehicle_source_data["TotalCost"]).toFixed(2)) + "";

    vehicle_source_data_array.push(vehicle_source_data);

    if (item.length == 0)
      item.source.load(vehicle_source_data_array);

    else
      item.source.add(vehicle_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    //vehicle_source_data_array.push(vehicle_source_data);
    data_temp.push(vehicle_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(vehicle_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(vehicle_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": vehicle_source_data["VehicleName"],
      "CompType": "VE",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Vehicle": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");

  }
  infotech_add(item, modal_data, rand_num) {

    var infotech_source_data_array = [];
    var infotech_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid, Description: modal_data.inputs[0].value,
      OrderType: modal_data.inputs[1].selected,
      Category: modal_data.inputs[2].selected, Quantity: modal_data.inputs[3].value,
      QuantityUom: modal_data.inputs[4].selected,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[5].value), SingleCostCurr: "SAR",
      Discount: modal_data.inputs[7].value,
      TotalCost: modal_data.inputs[8].value, TotalCostCurr: "SAR",
      Purpose: modal_data.inputs[9].value, GuiId: rand_num
    };

    var unit = this.it_order_type.find((o) => o.DescAr == infotech_source_data["OrderType"]|| o.Desc == infotech_source_data["OrderType"]);
    if (unit)
      infotech_source_data["OrderType"] = unit.Id;

    // var unit = this.uom_list.find((o) => o.Name == infotech_source_data["QuantityUom"]);
    // if (unit)
    //   infotech_source_data["QuantityUom"] = unit.Code;

    var unit1 = this.it_category.find((o) => o.DescAr == infotech_source_data["Category"]|| o.Desc == infotech_source_data["Category"]);
    if (unit1)
      infotech_source_data["Category"] = unit1.Id;

    infotech_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+infotech_source_data["TotalCost"]).toFixed(2)) + "";
    infotech_source_data_array.push(infotech_source_data);

    if (item.length == 0)
      item.source.load(infotech_source_data_array);

    else
      item.source.add(infotech_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    // infotech_source_data_array.push(infotech_source_data);
    data_temp.push(infotech_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(infotech_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(infotech_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": infotech_source_data["Description"],
      "CompType": "IT",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "InfoTech": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);


    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }
  furniture_add(item, modal_data, upload_post, rand_num) {

    var furniture_source_data_array = [];
    var furniture_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid, Description: modal_data.inputs[0].value, Quantity: modal_data.inputs[1].value,
      QuantityUom: modal_data.inputs[2].selected,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[3].value), SingleCostCurr: "SAR",
      TotalCost: modal_data.inputs[4].value, TotalCostCurr: "SAR",
      Purpose: modal_data.inputs[5].value, GuiId: rand_num
    };

    var unit = this.uom_list.find((o) => o.NameAr == furniture_source_data["QuantityUom"]|| o.Name == furniture_source_data["QuantityUom"]);
    if (unit)
      furniture_source_data["QuantityUom"] = unit.Code;
    furniture_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+furniture_source_data["TotalCost"]).toFixed(2)) + "";
    furniture_source_data_array.push(furniture_source_data);

    if (item.length == 0)
      item.source.load(furniture_source_data_array);

    else
      item.source.add(furniture_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    //furniture_source_data_array.push(furniture_source_data);
    data_temp.push(furniture_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(furniture_source_data["TotalCost"]);
    data_temp[0]["SingleCost"] = this.removeSAR(furniture_source_data["SingleCost"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": furniture_source_data["Description"],
      "CompType": "FU",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Furniture": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }
  preoper_add(item, modal_data, upload_post, rand_num) {

    var preopercosts_source_data_array = [];
    var preopercosts_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid, Description: modal_data.inputs[0].value,
      TotalCost: modal_data.inputs[1].value, TotalCostCurr: "SAR", GuiId: rand_num
    };
    preopercosts_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+preopercosts_source_data["TotalCost"]).toFixed(2)) + "";
    preopercosts_source_data_array.push(preopercosts_source_data);

    if (item.length == 0)
      item.source.load(preopercosts_source_data_array);

    else
      item.source.add(preopercosts_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    //preopercosts_source_data_array.push(preopercosts_source_data);
    data_temp.push(preopercosts_source_data);
    data_temp[0]["TotalCost"] = this.removeSAR(preopercosts_source_data["TotalCost"]);
    // data_temp[0]["Cost"] = modal_data.inputs[4].value;
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": preopercosts_source_data["Description"],
      "CompType": "PR",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "PreOperCosts": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }
  knowhowag_add(item, modal_data, rand_num) {

    var knowhowag_source_data_array = [];
    var knowhowag_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid,
      Description: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Description")].value,
      TotalCost: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TotalCost")].value,
      TotalCostCurr: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "TotalCostCurr")].selected,
      Purpose: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Purpose")].value,
      Duration: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Duration")].value,
      Currency: modal_data.inputs[this.findIndexFromId(modal_data.inputs, "Currency")].value,
      GuiId: rand_num
    };
    knowhowag_source_data["TotalCostCurr"] = this.findCodeFromName(this.CurrencyList, knowhowag_source_data["TotalCostCurr"], "Code", "Name");

    knowhowag_source_data["TotalCost"] = "SAR" + " " + this.commonService.numberToNumberWithCommas((+knowhowag_source_data["TotalCost"]).toFixed(2)) + "";
    knowhowag_source_data_array.push(knowhowag_source_data);

    if (item.length == 0)
      item.source.load(knowhowag_source_data_array);

    else
      item.source.add(knowhowag_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    //knowhowag_source_data_array.push(knowhowag_source_data);
    data_temp.push(knowhowag_source_data);
    //data_temp[0]["SingleCost"] = modal_data.inputs[4].value;
    data_temp[0]["TotalCost"] = this.removeSAR(knowhowag_source_data["TotalCost"]);
    if (data_temp[0]["Currency"])
      data_temp[0]["Currency"] = this.removeSAR(knowhowag_source_data["Currency"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": knowhowag_source_data["Description"],
      "CompType": "KN",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "KnowHowAg": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    //this.scroll();
    //this.scroll();
    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }
  safety_add(item, modal_data, rand_num) {
    var safety_source_data_array = [];
    var safety_source_data = {
      Operation: "C", ComponentId: item.componentID, WbsId: item.wbsid,
      Description: modal_data.inputs[0].value, Category: modal_data.inputs[1].selected,
      Quantity: modal_data.inputs[2].value, QuantityUom: modal_data.inputs[3].selected,
      SingleCost: "SAR " + this.commonService.numberToNumberWithCommas(modal_data.inputs[4].value), SingleCostCurr: "SAR",
      TotalCost: modal_data.inputs[5].value, TotalCostCurr: "SAR", IstfdEstCost: "",
      IstfdEstCostCurr: "", Purpose: modal_data.inputs[6].value, GuiId: rand_num
    };
    var unit = this.uom_list.find((o) => o.NameAr == safety_source_data["QuantityUom"]|| o.Name == safety_source_data["QuantityUom"]);
    if (unit)
      safety_source_data["QuantityUom"] = unit.Code;

    var unit = this.safety_category.find((o) => o.DescAr == safety_source_data["Category"]|| o.Desc == safety_source_data["Category"]);
    if (unit)
      safety_source_data["Category"] = unit.Id;

    safety_source_data["TotalCost"] = "SAR " + this.commonService.numberToNumberWithCommas((+safety_source_data["TotalCost"]).toFixed(2)) + "";
    safety_source_data_array.push(safety_source_data);

    if (item.length == 0)
      item.source.load(safety_source_data_array);

    else
      item.source.add(safety_source_data);

    item.length++;

    var x = 0;
    for (var i = 0; i < item.source.data.length; i++) {
      x = +x + +[item.source.data[i].TotalCost.replace(/[^\d.-]/g, '')];
    }

    item.totalcost = this.commonService.numberToNumberWithCommas(x.toFixed(2)) + "";
    item.source.refresh();

    var data_temp = [];
    // safety_source_data_array.push(safety_source_data);
    data_temp.push(safety_source_data);
    data_temp[0]["SingleCost"] = this.removeSAR(safety_source_data["SingleCost"]);
    data_temp[0]["TotalCost"] = this.removeSAR(safety_source_data["TotalCost"]);
    data_temp[0]["ComponentId"] = "";
    data_temp[0]["WbsId"] = "";

    var comptotcost = data_temp[0]["TotalCost"];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": safety_source_data["Description"],
      "CompType": "SA",
      "CompTotCost": comptotcost,
      "CompTotCostCurr": "SAR"
    }];
    var post_data = {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
      "Safety": data_temp,
    };
    this.Ng4LoadingSpinnerService.show();
    post_data = this.calcIndex(post_data);
    this.onSave(post_data, item.panelStep);

    //  var err_temp;
    //  var comp_type_temp = post_data.CostComp[0]["CompType"];
    //  if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined)
    //    this.LoanTechnicalService.postTechInfoComponent(post_data)
    //      .then((res) => (this.onResult(res),
    //        this.items_refresh(),
    //        this.LoanTechnicalService
    //          .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
    //          .then((res) => (this.resolveTechnicalInfo(res),
    //            this.scrollControl(res, post_data, comp_type_temp),
    //            this.Ng4LoadingSpinnerService.hide()
    //            //this.setPanelStep(panelStepIndex)
    //          ), err => (
    //            err_temp = err)
    //          ),
    //        err => (this.Ng4LoadingSpinnerService.hide())));


    this.commonService.showSuccessToast(this.translate.instant('TECHNICAL_INFORMATION.Additionsuccessful') + "!");
  }

  onAttachClick(item) {
    let technicaltableinfoModalParams = {};
    this.techOptionSelected = item.typesel;
    let typsel = item.typesel;
    let typselname = item.typeselname;
    if (typsel == "BC") {
      var index_costcomp;
      var GuiId_temp = 0;
      // for (var i = 0; i < this.costcomp_array[0].length; i++) {
      //   if (this.costcomp_array[0][i].ComponentId === item.componentID) {
      //     index_costcomp = i;
      //     if (this.costcomp_array[0][i].GuiId) {
      //       GuiId_temp = this.costcomp_array[0][i].GuiId;
      //     }
      //     break;
      //   }
      // }
      GuiId_temp = this.Bcw_GuiId;
      technicaltableinfoModalParams = {
        method: "Add",
        header: typselname + " " + this.translate.instant('TECHNICAL_INFORMATION.Attachments'),
        item: item,
        GuiId: GuiId_temp,
        alert: "true - BCW - Attachment",
        inputs: [
          {
            id: "LandLeaseAgreem",
            name: this.translate.instant('TECHNICAL_INFORMATION.LandLeaseAgreement'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: ""
          },
          {
            id: "GeneralSiteLayout",
            name: this.translate.instant('TECHNICAL_INFORMATION.GeneralSiteLayout'),
            type: "file_multiple",
            file: "",
            required: "true",
            visible: true,
            value: ""
          },
          {
            id: "BCWDrawings",
            name: this.translate.instant('TECHNICAL_INFORMATION.BuildingandCivilWorksDrawings'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: ""
          },
          {
            id: "DesignSupervisionContracts",
            name: this.translate.instant('TECHNICAL_INFORMATION.DesignandSupervisionContractsOffers'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: ""
          },
          {
            id: "BOQBuildings",
            name: this.translate.instant('TECHNICAL_INFORMATION.BillofQuantitiesBOQforBuildings'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: ""
          },
          {
            id: "PermitBuildOperate",
            name: this.translate.instant('TECHNICAL_INFORMATION.PermittoBuildandOperate'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: ""
          },
          {
            id: "QuotationContractsBuildings",
            name: this.translate.instant('TECHNICAL_INFORMATION.SelectedQuotationContractsforbuildings'),
            type: "file_multiple",
            file: "",
            required: "false",
            visible: true,
            value: ""
          },
        ],
        buttons: [
          {
            name: this.translate.instant('TECHNICAL_INFORMATION.Save'),
            type: "Submit",
            class: "btn-success",
            handler: (modal_data) => {
              this.Ng4LoadingSpinnerService.show();
              var rand_num;
              if (this.Bcw_GuiId != null) {
                rand_num = this.Bcw_GuiId;

                var upload_post = "";
                var data = {
                  documentDefId: 369,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[0].file)
                  this.uploadDocumentFunction(modal_data.inputs[0].file, data);

                var data = {
                  documentDefId: 392,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[1].file)
                  this.uploadDocumentFunction(modal_data.inputs[1].file, data);

                var data = {
                  documentDefId: 393,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[2].file)
                  this.uploadDocumentFunction(modal_data.inputs[2].file, data);

                var data = {
                  documentDefId: 394,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[3].file)
                  this.uploadDocumentFunction(modal_data.inputs[3].file, data);

                var data = {
                  documentDefId: 395,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[4].file)
                  this.uploadDocumentFunction(modal_data.inputs[4].file, data);

                var data = {
                  documentDefId: 396,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[5].file)
                  this.uploadDocumentFunction(modal_data.inputs[5].file, data);

                var data = {
                  documentDefId: 397,
                  entityId: this.requestId,
                  entityName: "Project",
                  RelatedEntityId: rand_num,
                  RelatedEntityName: "technicalInfos",
                  operationType: "l"
                };
                if (modal_data.inputs[6].file)
                  this.uploadDocumentFunction(modal_data.inputs[6].file, data);

                if (modal_data.inputs[0].file === "" && modal_data.inputs[1].file === "" && modal_data.inputs[2].file === "" && modal_data.inputs[3].file === "" && modal_data.inputs[4].file === "" && modal_data.inputs[5].file === "" && modal_data.inputs[6].file === "") {
                  this.Ng4LoadingSpinnerService.hide();
                }

                // var unit1 = this.costcomp_array[0].find((o) => o.ComponentId == item.componentID);
                // if (unit1)
                // return(unit1.Name);
                // this.costcomp_array[0][index_costcomp]["GuiId"] = rand_num;

              }
            }
          }
        ]
      };

    }
    if (typsel === "BC") {
      this.Ng4LoadingSpinnerService.show();

      this.documentStructure = {};

      this.communicationsService.getDocumentService(this.requestId, "l").then(requests => {

        this.documentStructure = this.commonService.returnViewDocumentJson(requests);

        // console.log(this.documentStructure);

        this.Ng4LoadingSpinnerService.hide();

        technicaltableinfoModalParams["documentjson"] = this.documentStructure;

        let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
        techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
        this.techInfoModalParams_g = technicaltableinfoModalParams;
        this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');

      });
    }
    else {
      let techInfoModal = this.modalService.open(TechInfoModalsComponent, this.commonService.modalOptions);
      techInfoModal.componentInstance.techInfoModalsForm = technicaltableinfoModalParams;
      this.techInfoModalParams_g = technicaltableinfoModalParams;
      this.techOptionSelected = this.translate.instant('TECHNICAL_INFORMATION.ChooseComponent');
    }
  }

  scroll(el) {
    el.scrollIntoView({ behavior: "smooth" });
  }

  component_click_ME(res1, typsel, typsel_code, target1) {

    //this.Ng4LoadingSpinnerService.show();
    //var res2;
    // var machinery_source_data_array = [];
    //var machinery_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].selected };
    //var data_label = [{name: modal_data.inputs[0].name},{name: modal_data.inputs[1].name},
    //{name: modal_data.inputs[2].name},{name: modal_data.inputs[3].name}];
    // console.log(data_label);

    // var unit2 = this.machinery_comp_type.find((o) => o.Desc == machinery_source_data["MachineName"]);
    // if (unit2)
    //   machinery_source_data["componentName"] = unit2.Desc;


    // machinery_source_data_array.push(machinery_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source = new LocalDataSource();
    //
    var machinery_componentID = [];

    var costcomptemp = [{
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": "",
      "CompType": "ME",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR"
    }];
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomptemp,
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (
        this.onResult(res),
        console.log(res),
        machinery_componentID[0] = res,
        costcomp = machinery_componentID[0].CostComp[+machinery_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        this.costcomp_handle(costcomp),
        //  this.costcomp_array.pop(),
        //this.costcomp_array[0].push(costcomp),

        // this.machinery_localdatasource_array.push(source),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, method: "views",
          source: source, settings: this.machinery_settings, settings_ar: this.machinery_settings_ar, length: 0,
          componentID: machinery_componentID[0].CostComp[+machinery_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: machinery_componentID[0].CostComp[+machinery_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.machinery_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.me_comments
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (
        this.Ng4LoadingSpinnerService.hide()
      ));
  }
  component_click_BC(modal_data, res1, typsel, typsel_code, target1) {
    ///   this.Ng4LoadingSpinnerService.show();
    var bcw_source_data_array = [];
    var bcw_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    bcw_source_data_array.push(bcw_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_bcw = new LocalDataSource();
    var bcw_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "BC",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }
    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), bcw_componentID[0] = res,

        costcomp = bcw_componentID[0].CostComp[+bcw_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        this.costcomp_handle(costcomp),
        // this.costcomp_array.pop(),
        //this.costcomp_array[0].push(costcomp),

        this.bcw_localdatasource_array.push(source_bcw),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_bcw, settings: this.bcw_settings_c, settings2: this.bcw_C_settings_c,
          //settings_ar: this.bcw_settings_c, settings2_ar: this.bcw_settings_c, 
          length: 0,
          componentID: bcw_componentID[0].CostComp[+bcw_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: bcw_componentID[0].CostComp[+bcw_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.bcw_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.bcw_comments
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
  }
  component_click_VE(modal_data, res1, typsel, typsel_code, target1) {

    // this.Ng4LoadingSpinnerService.show();
    var vehicle_source_data_array = [];
    var vehicle_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    vehicle_source_data_array.push(vehicle_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_vehicle = new LocalDataSource();
    //
    var vehicle_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "VE",
      "CompTotCost": "0.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), vehicle_componentID[0] = res,
        //      this.costcomp_array = vehicle_componentID[0].CostComp,
        costcomp = vehicle_componentID[0].CostComp[+vehicle_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,

        this.costcomp_handle(costcomp),

        // this.costcomp_array.pop(),
        //this.costcomp_array[0].push(costcomp),


        this.vehicle_localdatasource_array.push(source_vehicle),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_vehicle, settings: this.vehicle_settings_c, length: 0,
          componentID: vehicle_componentID[0].CostComp[+vehicle_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: vehicle_componentID[0].CostComp[+vehicle_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.vehicle_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.ve_comments
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
    //
  }
  component_click_FU(modal_data, res1, typsel, typsel_code, target1) {

    var furniture_source_data_array = [];
    var furniture_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    furniture_source_data_array.push(furniture_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_furniture = new LocalDataSource();

    //
    var furniture_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "FU",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), furniture_componentID[0] = res,

        costcomp = furniture_componentID[0].CostComp[+furniture_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        this.costcomp_handle(costcomp),
        //this.costcomp_array.pop(),
        //this.costcomp_array[0].push(costcomp),


        this.furniture_localdatasource_array.push(source_furniture),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_furniture, settings: this.furniture_settings_c, length: 0,
          componentID: furniture_componentID[0].CostComp[+furniture_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: furniture_componentID[0].CostComp[+furniture_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.furniture_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.me_comments
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
  }
  component_click_IT(modal_data, res1, typsel, typsel_code, target1) {
    /// this.Ng4LoadingSpinnerService.show();
    var infotech_source_data_array = [];
    var infotech_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    infotech_source_data_array.push(infotech_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_infotech = new LocalDataSource();

    //
    var infotech_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "IT",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), infotech_componentID[0] = res,

        costcomp = infotech_componentID[0].CostComp[+infotech_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        this.costcomp_handle(costcomp),
        //   this.costcomp_array.pop(),
        //   this.costcomp_array[0].push(costcomp),


        this.infotech_localdatasource_array.push(source_infotech),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_infotech, settings: this.infotech_settings_c, length: 0,
          componentID: infotech_componentID[0].CostComp[+infotech_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: infotech_componentID[0].CostComp[+infotech_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.infotech_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.me_comments
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
    //
  }
  component_click_PR(modal_data, res1, typsel, typsel_code, target1) {
    // this.Ng4LoadingSpinnerService.show();
    var preopercosts_source_data_array = [];
    var preopercosts_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    preopercosts_source_data_array.push(preopercosts_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_preopercosts = new LocalDataSource();

    //
    var preopercosts_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "PR",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), preopercosts_componentID[0] = res,

        costcomp = preopercosts_componentID[0].CostComp[+preopercosts_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        this.costcomp_handle(costcomp),
        //this.costcomp_array.pop(),
        // this.costcomp_array[0].push(costcomp),


        this.preopercosts_localdatasource_array.push(source_preopercosts),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_preopercosts, settings: this.preopercosts_settings_c, length: 0,
          componentID: preopercosts_componentID[0].CostComp[+preopercosts_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: preopercosts_componentID[0].CostComp[+preopercosts_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.preopercosts_localdatasource_array.length,
          totalcost: 0,
          panel_comment: this.me_comments
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
    //
  }
  component_click_RA(modal_data, res1, typsel, typsel_code, target1) {
    // this.Ng4LoadingSpinnerService.show();
    var rawmaterial_source_data_array = [];
    var rawmaterial_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    rawmaterial_source_data_array.push(rawmaterial_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_rawmaterial = new LocalDataSource();

    //
    var rawmaterial_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "RA",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), rawmaterial_componentID[0] = res,

        costcomp = rawmaterial_componentID[0].CostComp[+rawmaterial_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        //  this.costcomp_array.pop(),
        // this.costcomp_array[0].push(costcomp),
        this.costcomp_handle(costcomp),


        this.rawmaterial_localdatasource_array.push(source_rawmaterial),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_rawmaterial, settings: this.rawmaterial_settings_c, length: 0,
          componentID: rawmaterial_componentID[0].CostComp[+rawmaterial_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: rawmaterial_componentID[0].CostComp[+rawmaterial_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.rawmaterial_localdatasource_array.length,
          totalcost: 0
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
  }
  component_click_MA(modal_data, res1, typsel, typsel_code, target1) {
    // this.Ng4LoadingSpinnerService.show();
    var flag_in = 0;
    var flag_di = 0;
    if (res1.CostComp) {
      for (var xyz = 0; xyz < res1.CostComp.length; xyz++) {
        if (res1.CostComp[xyz].CompType === "MA" && (res1.CostComp[xyz].CompName === "I" || res1.CostComp[xyz].CompName === "Indirect Labour" || res1.CostComp[xyz].CompName === "In"))
          flag_in = flag_in + 1;
        if (res1.CostComp[xyz].CompType === "MA" && (res1.CostComp[xyz].CompName === "D" || res1.CostComp[xyz].CompName === "Direct Labour" || res1.CostComp[xyz].CompName === "Di"))
          flag_di = flag_di + 1;
      }
    }
    else {
      flag_in = 0;
      flag_di = 0;
    }
    if (flag_di > 0 && flag_in > 0) {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Onlyonedirectindirect') + "!");
      this.Ng4LoadingSpinnerService.hide();
    }
    else if ((modal_data.inputs[1].selected === "Direct Labour" || modal_data.inputs[1].selected === "Di") && flag_di > 0) {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Onlyonedirect') + "!");
      this.Ng4LoadingSpinnerService.hide();
    }
    else if ((modal_data.inputs[1].selected === "Indirect Labour" || modal_data.inputs[1].selected === "In") && flag_in > 0) {
      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Onlyoneindirect') + "!");
      this.Ng4LoadingSpinnerService.hide();
    }
    else {
      //continue
      var manpower_source_data_array = [];
      var manpower_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].selected };

      var unit = this.labour_type.find((o) => o.DescAr == manpower_source_data["componentName"]|| o.Desc == manpower_source_data["componentName"]);
      if (unit)
        var component_name_code = unit.Id;

      manpower_source_data_array.push(manpower_source_data);

      this.panelstepindex = this.panelstepindex + 1;

      var source_manpower = new LocalDataSource();

      //
      var manpower_componentID = [];

      var unit1 = this.uom_list.find((o) => o.NameAr == modal_data.inputs[1].selected||o.Name == modal_data.inputs[1].selected);
      if (unit1)
        this.uom_text_kg_ton.push(unit1.Name);

      var costcomptemp = {
        "Operation": "C",
        "LoanId": this.loan_id,
        "CompName": component_name_code,
        "CompType": "MA",
        "CompTotCost": "123.00",
        "CompTotCostCurr": "SAR"
      }

      var costcomparraytemp = [];
      var costcomptemp2 = [];
      costcomptemp2.push(costcomptemp);
      if (this.costcomp_array[0] != undefined) {
        costcomparraytemp = this.costcomp_array;
        costcomparraytemp[0].push(costcomptemp);
      }
      else {
        costcomparraytemp[0] = costcomptemp2;
      }
      var post_data =
      {
        "LoanId": this.loan_id,
        "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
        "CustomerId": this.CustomerId,
        "ProfileId": this.ProfileId,
        "CostComp": costcomparraytemp[0],
        "Machinery": res1.Machinery ? res1.Machinery : [],
        "Bcw": res1.Bcw ? res1.Bcw : [],
        "Vehicle": res1.Vehicle ? res1.Vehicle : [],
        "Furniture": res1.Furniture ? res1.Furniture : [],
        "InfoTech": res1.InfoTech ? res1.Machinery : [],
        "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
        "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
        "ManPower": res1.ManPower ? res1.Machinery : [],
        "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
        "Safety": res1.Safety ? res1.Machinery : [],
        "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
      };
      var costcomp;
      post_data = this.isClaimsAppendPostData(post_data);
      this.LoanTechnicalService.postTechInfoComponent(post_data)
        .then((res) => (this.onResult(res),
          manpower_componentID[0] = res,
          costcomp = manpower_componentID[0].CostComp[+manpower_componentID[0].CostComp.length - 1],
          costcomp["Operation"] = "U",
          delete costcomp.MessText, delete costcomp.MessType,
          // this.costcomp_array.pop(),
          // this.costcomp_array[0].push(costcomp),
          this.costcomp_handle(costcomp),


          this.manpower_localdatasource_array.push(source_manpower),
          this.panel_items.push({
            scroll_name: "scroll" + this.panelstepindex,
            panelStep: this.panelstepindex, typeselname: typsel,
            typesel: typsel_code, uniqname: modal_data.inputs[1].selected, method: "views",
            source: source_manpower, settings: this.manpower_settings_c, length: 0,
            componentID: manpower_componentID[0].CostComp[+manpower_componentID[0].CostComp.length - 1].ComponentId,
            wbsid: manpower_componentID[0].CostComp[+manpower_componentID[0].CostComp.length - 1].WbsId,
            componentOperation: "C", localdatasource_index: this.manpower_localdatasource_array.length,
            totalcost: 0
          }),
          this.Ng4LoadingSpinnerService.hide(),
          //this.scroll(target1),
          this.setPanelStep(this.panelstepindex)

        ), err => (this.Ng4LoadingSpinnerService.hide()));
    }
    //
  }
  component_click_UT(modal_data, res1, typsel, typsel_code, target1) {
    //  this.Ng4LoadingSpinnerService.show();

    var utilitiesdetail_source_data_array = [];
    var utilitiesdetail_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    utilitiesdetail_source_data_array.push(utilitiesdetail_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_utilitiesdetail = new LocalDataSource();

    //
    var utilitiesdetail_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "UT",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), utilitiesdetail_componentID[0] = res,

        costcomp = utilitiesdetail_componentID[0].CostComp[+utilitiesdetail_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        // this.costcomp_array.pop(),
        // this.costcomp_array[0].push(costcomp),
        this.costcomp_handle(costcomp),


        this.utilitiesdetail_localdatasource_array.push(source_utilitiesdetail),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_utilitiesdetail, settings: this.utilitiesdetail_settings_c, length: 0,
          componentID: utilitiesdetail_componentID[0].CostComp[+utilitiesdetail_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: utilitiesdetail_componentID[0].CostComp[+utilitiesdetail_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.utilitiesdetail_localdatasource_array.length,
          totalcost: 0
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
    //
  }
  component_click_SA(modal_data, res1, typsel, typsel_code, target1) {
    // this.Ng4LoadingSpinnerService.show();
    var safety_source_data_array = [];
    var safety_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    safety_source_data_array.push(safety_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_safety = new LocalDataSource();

    //
    var safety_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "SA",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);
    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res), safety_componentID[0] = res,

        costcomp = safety_componentID[0].CostComp[+safety_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        //  this.costcomp_array.pop(),
        // this.costcomp_array[0].push(costcomp),
        this.costcomp_handle(costcomp),


        this.safety_localdatasource_array.push(source_safety),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_safety, settings: this.safety_settings_c, length: 0,
          componentID: safety_componentID[0].CostComp[+safety_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: safety_componentID[0].CostComp[+safety_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.safety_localdatasource_array.length,
          totalcost: 0
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
  }
  component_click_KN(modal_data, res1, typsel, typsel_code, target1) {
    // this.Ng4LoadingSpinnerService.show();
    var knowhowag_source_data_array = [];
    var knowhowag_source_data = { componentType: modal_data.inputs[0].value, componentName: modal_data.inputs[1].value };

    knowhowag_source_data_array.push(knowhowag_source_data);

    this.panelstepindex = this.panelstepindex + 1;

    var source_knowhowag = new LocalDataSource();

    //
    var knowhowag_componentID = [];

    var costcomptemp = {
      "Operation": "C",
      "LoanId": this.loan_id,
      "CompName": modal_data.inputs[1].value,
      "CompType": "KN",
      "CompTotCost": "123.00",
      "CompTotCostCurr": "SAR"
    }
    var costcomptemp2 = [];
    costcomptemp2.push(costcomptemp);

    var costcomparraytemp = [];
    if (this.costcomp_array[0] != undefined) {
      costcomparraytemp = this.costcomp_array;
      costcomparraytemp[0].push(costcomptemp);
    }
    else {
      costcomparraytemp[0] = costcomptemp2;
    }

    var post_data =
    {
      "LoanId": this.loan_id,
      "Origin": "CP", "SentReqId": this.requestId, "ProjectId": this.projId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "CostComp": costcomparraytemp[0],
      "Machinery": res1.Machinery ? res1.Machinery : [],
      "Bcw": res1.Bcw ? res1.Bcw : [],
      "Vehicle": res1.Vehicle ? res1.Vehicle : [],
      "Furniture": res1.Furniture ? res1.Furniture : [],
      "InfoTech": res1.InfoTech ? res1.Machinery : [],
      "PreOperCosts": res1.PreOperCosts ? res1.Machinery : [],
      "RawMaterial": res1.RawMaterial ? res1.Machinery : [],
      "ManPower": res1.ManPower ? res1.Machinery : [],
      "UtilitiesDetail": res1.UtilitiesDetail ? res1.Machinery : [],
      "Safety": res1.Safety ? res1.Machinery : [],
      "KnowHowAg": res1.KnowHowAg ? res1.Machinery : []
    };
    var costcomp;
    post_data = this.isClaimsAppendPostData(post_data);
    this.LoanTechnicalService.postTechInfoComponent(post_data)
      .then((res) => (this.onResult(res),
        knowhowag_componentID[0] = res,
        // console.log(res),
        costcomp = knowhowag_componentID[0].CostComp[+knowhowag_componentID[0].CostComp.length - 1],
        costcomp["Operation"] = "U",
        delete costcomp.MessText, delete costcomp.MessType,
        //   this.costcomp_array.pop(),
        //  this.costcomp_array[0].push(costcomp),
        this.costcomp_handle(costcomp),


        this.knowhowag_localdatasource_array.push(source_knowhowag),
        this.panel_items.push({
          scroll_name: "scroll" + this.panelstepindex,
          panelStep: this.panelstepindex, typeselname: typsel,
          typesel: typsel_code, uniqname: modal_data.inputs[1].value, method: "views",
          source: source_knowhowag, settings: this.knowhowag_settings_c, length: 0, componentID: knowhowag_componentID[0].CostComp[+knowhowag_componentID[0].CostComp.length - 1].ComponentId,
          wbsid: knowhowag_componentID[0].CostComp[+knowhowag_componentID[0].CostComp.length - 1].WbsId,
          componentOperation: "C", localdatasource_index: this.knowhowag_localdatasource_array.length,
          totalcost: 0
        }),
        this.Ng4LoadingSpinnerService.hide(),
        //this.scroll(target1),
        this.setPanelStep(this.panelstepindex)

      ), err => (this.Ng4LoadingSpinnerService.hide()));
    //
  }

  onResTechInfoPer(res) {
    this.TechInfoPer = parseFloat(res.Percentage);
    if (this.TechInfoPer > 100) {
      this.customerProfileService.loanPercentageValues.TechInfoPer = 100;
    } else {
      this.customerProfileService.loanPercentageValues.TechInfoPer = this.TechInfoPer;
    }


    this.ChecklistPer = (this.customerProfileService.loanPercentageValues.GenInfoPer +
      this.customerProfileService.loanPercentageValues.MarkInfoPer +
      this.customerProfileService.loanPercentageValues.TechInfoPer +
      this.customerProfileService.loanPercentageValues.FinInfoPer) / 4;

    this.customerProfileService.loanPercentageValues.ChecklistPer = this.ChecklistPer;
  }

  onBack() {

    this.router.navigate(['/pages/new-request/loan-application']);

  }

  onBackisClaims() {
    if (this.myloanspath_isClaims === "Loan") {
      let navigationExtras: NavigationExtras = {
        queryParams: { 'tab': this.customerProfileService.getEncryptedString("2"), 'id': this.customerProfileService.getEncryptedString(this.myloansid_isClaims) }
      };
      this.router.navigate(['/pages/my-loans'], navigationExtras);
    } else {
      window.history.back();
    }
  }

  startTour() {

    this.allPanelsExpanded = true;

    this.commonService.returnTour(this.commonService.defaultLanguage).setOption('steps', [
      {
        element: '#tourStep1',
        intro: this.translate.instant('COMMON.NavigatetoProjectInformation')
      },
      {
        element: '#tourStep2',
        intro: this.translate.instant('COMMON.NavigatetoMarketingInformation')
      },
      {
        element: '#tourStep3',
        intro: this.translate.instant('COMMON.NavigatetoFinancialInformation')
      },
      {
        element: '#tourStep4',
        intro: this.translate.instant('COMMON.NavigatetoChecklist')
      },
      {
        element: '#tourStep5',
        intro: this.translate.instant('TECHNICAL_INFORMATION.ChooseTypeofComponent')
      },
      {
        element: '#tourStep6',
        intro: this.translate.instant('TECHNICAL_INFORMATION.Clicktoaddthechosencomponent')
      },
      {
        element: '#tourStep7',
        intro: this.translate.instant('TECHNICAL_INFORMATION.AddedcomponentappearhereaspanelsYoucanaddeditdeleteandviewthem')
      },
      {
        element: '#tourStep8',
        intro: this.translate.instant('TECHNICAL_INFORMATION.EntertheManufacturingStages')
      },
      {
        element: '#tourStep9',
        intro: this.translate.instant('TECHNICAL_INFORMATION.EntertheInstalledCapacities')
      },
      {
        element: '#tourStep10',
        intro: this.translate.instant('TECHNICAL_INFORMATION.ViewCapitalCostSummary')
      },
      {
        element: '#tourStep11',
        intro: this.translate.instant('TECHNICAL_INFORMATION.ViewOperationalCostSummary')
      },
      {
        element: '#tourStep12',
        intro: this.translate.instant('TECHNICAL_INFORMATION.ViewTotalCost')
      },
      {
        element: '#tourStep13',
        intro: this.translate.instant('TECHNICAL_INFORMATION.GoBack')
      },
      {
        element: '#tourStep14',
        intro: this.translate.instant('COMMON.NavigatetoMarketingInformation')
      },
      {
        element: '#tourStep15',
        intro: this.translate.instant('COMMON.NavigatetoFinancialInformation')
      }
    ]);

    this.commonService.returnTour(this.commonService.defaultLanguage).onchange(function (targetElement) {

      window.location.hash = "#" + targetElement.id;

    }).onexit(() => this.handleOnExitTour()).start();

  }

  handleOnExitTour() {

    window.location.hash = "#" + "startTour";
    this.allPanelsExpanded = false;
    this.panelStep = 1;

  }

  onSubmitisClaimsConfirm(delete_cancel_modal) {
    let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
    delete options.size;
    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal, options);
    //this.deleteCancelModalReference.event = event;
    //this.deleteCancelModalReference.table_name = table_name;
    this.deleteCancelModalReference.items = "Submit";
    this.deleteCancelModalReference.table_name_display = this.translate.instant('MY_LOANS.NonEnvisagedItems');
    this.deleteCancelModalReference.action = this.translate.instant('COMMON.Submit');
  }

  onSubmitisClaims() {
    var err_temp;
    var post_data = {
      "ProjectId": this.projectid_isClaims,
      "LoanId": this.loan_id,
      "Origin": "CP",
      "SentReqId": this.requestId,
      "CustomerId": this.CustomerId,
      "ProfileId": this.ProfileId,
      "ForNonEnvisaged": "X",
      "IsNevsgSubmit": "X"
    };
    if (this.ProfileId != undefined && this.loan_id != undefined && this.requestId != undefined) {
      //post_data = this.isClaimsAppendPostData(post_data);
      this.Ng4LoadingSpinnerService.show();
      this.LoanTechnicalService.postTechInfoComponent(post_data)
        .then((res) => (this.onResult(res),
          this.items_refresh(),
          this.LoanTechnicalService
            .getTechInfoComponent(this.ProfileId, this.loan_id, this.requestId, this.isClaimsForTechGet)
            .then((res) => (this.resolveTechnicalInfo(res),
              //this.scrollControl(res, post_data, comp_type_temp),
              this.Ng4LoadingSpinnerService.hide(),
              this.afterSubmitNonEnvisagedExitToClaims(res)
              //this.setPanelStep(panelStepIndex)
            ), err => (
              err_temp = err)
            ),
          err => (this.Ng4LoadingSpinnerService.hide())));
    }

  }

  afterSubmitNonEnvisagedExitToClaims(res) {
    if (res.MessType === "S")
      this.onBackisClaims();
  }

  onSubmitAppSpecLogistic() {
    if (this.applicableSpec_logistics != "") {
      var post_data = {
        "FinancingPlan": this.loan_id,
        "Indicator": "L",
        "Operation": this.applicableSpec_logistics
      };
      this.Ng4LoadingSpinnerService.show();
      this.onSaveManufacProd(post_data);
    }
  }

  findIndexFromId(array, id) {
    if (array && array.length != 0 && (id + "") != "") {
      return _.findIndex(array, function (num) { return (num.id + "") === id });
    } else {
      return -1;
    }
  }

  findCodeFromName(list, name, listId, listName) {
    var unit = list.find((o) => o[listName] == name);
    if (unit)
      return unit[listId];
    else
      return "";
  }

  findNameFromCode(list, id, listId, listName) {
    var unit = list.find((o) => o[listId] == id);
    if (unit)
      return unit[listName];
    else
      return "";
  }
  returnDisabledStateBasedOnCommunication(section) {
    if (this.statusCode == 'Q' && _l.get(section, 'hasComments')) {
      return false;
    } else {
      return !this.add_edit_delete_show;
    }
  }
  
  setQuotationIconBasedOnPlatform() {
    if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
      this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="ion-clipboard icon-arrangement-top-ie" title="Add Competitive Quotation"></i>' }];
      this.machinery_settings_ar.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="ion-clipboard icon-arrangement-top-ie" title="إضافة تسعيرة تنافسية"></i>' }];
    }
    else if (/edge\//i.test(window.navigator.userAgent)) {
      this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="ion-clipboard icon-arrangement-top-edge-en" title="Add Competitive Quotation"></i>' }];
      this.machinery_settings_ar.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="ion-clipboard icon-arrangement-top-edge-ar" title="إضافة تسعيرة تنافسية"></i>' }];
    }
    else {
      this.machinery_settings.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="ion-clipboard icon-arrangement-top" title="Add Competitive Quotation"></i>' }];
      this.machinery_settings_ar.actions["custom"] = [{ name: 'ourCustomAction', title: '<i class="ion-clipboard icon-arrangement-top" title="إضافة تسعيرة تنافسية"></i>' }];
    }
  }
  setEditableSectionsBasedOnCommunication() {

    if (this.me_comments.hasComments) {
      this.machinery_settings_ar.actions.edit = true;
      this.machinery_settings_ar.actions.delete = true;
      this.machinery_settings.actions.edit = true;
      this.machinery_settings.actions.delete = true;
      this.setQuotationIconBasedOnPlatform();
    } else {
      this.machinery_settings_ar.actions.edit = false;
      this.machinery_settings_ar.actions.delete = false;
      this.machinery_settings.actions.edit = false;
      this.machinery_settings.actions.delete = false;
      this.machinery_settings_ar.actions = _.omit(this.machinery_settings_ar.actions, ['custom']);
      this.machinery_settings.actions = _.omit(this.machinery_settings.actions, ['custom']);
    }
    this.machinery_settings_ar = Object.assign({}, this.machinery_settings_ar);

    if (this.bcw_comments.hasComments) {
      this.bcw_settings_c.actions.edit = true;
      this.bcw_settings_c.actions.delete = true;
      this.bcw_C_settings_c.actions.edit = true;
      this.bcw_C_settings_c.actions.delete = true;
    } else {
      this.bcw_settings_c.actions.edit = false;
      this.bcw_settings_c.actions.delete = false;
      this.bcw_C_settings_c.actions.edit = false;
      this.bcw_C_settings_c.actions.delete = false;
    }
    this.bcw_settings_c = Object.assign({}, this.bcw_settings_c);
    this.bcw_C_settings_c = Object.assign({}, this.bcw_C_settings_c);

    if (this.ve_comments.hasComments) {
      this.vehicle_settings_c.actions.edit = true;
      this.vehicle_settings_c.actions.delete = true;
    } else {
      this.vehicle_settings_c.actions.edit = false;
      this.vehicle_settings_c.actions.delete = false;
    }
    this.vehicle_settings_c = Object.assign({}, this.vehicle_settings_c);

    if (this.fu_comments.hasComments) {
      this.furniture_settings_c.actions.edit = true;
      this.furniture_settings_c.actions.delete = true;
    } else {
      this.furniture_settings_c.actions.edit = false;
      this.furniture_settings_c.actions.delete = false;
    }
    this.furniture_settings_c = Object.assign({}, this.furniture_settings_c);

    if (this.ra_comments.hasComments) {
      this.rawmaterial_settings_c.actions.edit = true;
      this.rawmaterial_settings_c.actions.delete = true;
    } else {
      this.rawmaterial_settings_c.actions.edit = false;
      this.rawmaterial_settings_c.actions.delete = false;
    }
    this.rawmaterial_settings_c = Object.assign({}, this.rawmaterial_settings_c);

    if (this.ma_comments.hasComments) {
      this.manpower_settings_c.actions.edit = true;
      this.manpower_settings_c.actions.delete = true;
    } else {
      this.manpower_settings_c.actions.edit = false;
      this.manpower_settings_c.actions.delete = false;
    }
    this.manpower_settings_c = Object.assign({}, this.manpower_settings_c);

    if (this.ut_comments.hasComments) {
      this.utilitiesdetail_settings_c.actions.edit = true;
      this.utilitiesdetail_settings_c.actions.delete = true;
    } else {
      this.utilitiesdetail_settings_c.actions.edit = false;
      this.utilitiesdetail_settings_c.actions.delete = false;
    }
    this.utilitiesdetail_settings_c = Object.assign({}, this.utilitiesdetail_settings_c);

    if (this.sa_comments.hasComments) {
      this.safety_settings_c.actions.edit = true;
      this.safety_settings_c.actions.delete = true;
    } else {
      this.safety_settings_c.actions.edit = false;
      this.safety_settings_c.actions.delete = false;
    }
    this.safety_settings_c = Object.assign({}, this.safety_settings_c);

    if (this.kh_comments.hasComments) {
      this.knowhowag_settings_c.actions.edit = true;
      this.knowhowag_settings_c.actions.delete = true;
    } else {
      this.knowhowag_settings_c.actions.edit = false;
      this.knowhowag_settings_c.actions.delete = false;
    }
    this.knowhowag_settings_c = Object.assign({}, this.knowhowag_settings_c);

   
      
    if (this.manufac_stages_comments.hasComments) {
      this.manufacturing_stages_settings_c.actions.edit = true;
      this.manufacturing_stages_settings_c.actions.delete = true;
    } else {
      this.manufacturing_stages_settings_c.actions.edit = false;
      this.manufacturing_stages_settings_c.actions.delete = false;
    }
    this.manufacturing_stages_settings_c = Object.assign({}, this.manufacturing_stages_settings_c);

    if (this.prod_line_comments.hasComments) {
      this.production_lines_settings_c.actions.edit = true;
      this.production_lines_settings_c.actions.delete = true;
    } else {
      this.production_lines_settings_c.actions.edit = false;
      this.production_lines_settings_c.actions.delete = false;
    }
    this.production_lines_settings_c = Object.assign({}, this.production_lines_settings_c);

  }
  returnAddDisabledStateBasedOnCommunication() {
            
         
    if (this.statusCode == 'Q' &&( _l.get(this.me_comments, 'hasComments') ||  _l.get(this.bcw_comments, 'hasComments') ||  _l.get(this.ve_comments, 'hasComments')
    || _l.get(this.fu_comments, 'hasComments')|| _l.get(this.it_comments, 'hasComments')|| _l.get(this.pr_comments, 'hasComments')||
    _l.get(this.ra_comments, 'hasComments')|| _l.get(this.ma_comments, 'hasComments')|| _l.get(this.ut_comments, 'hasComments')
    || _l.get(this.sa_comments, 'hasComments')|| _l.get(this.kh_comments, 'hasComments')|| _l.get(this.manufac_stages_comments, 'hasComments')|| _l.get(this.prod_line_comments, 'hasComments'))) {
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



}
