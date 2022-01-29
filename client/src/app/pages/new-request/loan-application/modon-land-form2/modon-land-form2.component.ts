import { Component, OnInit, Injectable, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { LocalDataSource } from "ng2-smart-table";
import { RCJInfoService } from "../../../../services/rcj-information.service";
import { LoanApplicationService } from "../../../../services/loan-application.service";
import { CommonService } from "../../../../services/common.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { CommunicationsService } from "../../../../services/communications.service"

import { Observable, Subscription, interval } from "rxjs";
import { ProjInfoService } from "../../../../services/project-information.service";
import { Form5Service } from '../../../../services/form5.service';
import { Cell, CellList, InputsTableComponent } from '../../../../components/inputs-table/inputs-table.component'



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
  selector: "land-form2",
  templateUrl: "./modon-land-form2.component.html",
  styleUrls: ["./modon-land-form2.component.scss"],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})
export class ModonLandForm2Component implements OnInit, AfterViewInit {
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
  //  product Table
  rowStructureCells: Cell[] = [];
  header;
  productKey = "Id";
  products = [];
  // End Of Product Table
  add_edit_delete_show = true;
  serviceId = 7;

  landloanrequeststatus: any = 0;

  @ViewChild(InputsTableComponent) inputsTable;

  input = {
    SysUserServiceId: "",
    LoanRequestNo: "",
    TotalTechnicians: "",
    TotalManagments: "",
    TotalEngineers: "",
    TotalHandMen: "",
    TotalEmployees: "",
    SaudiTechnicians: "",
    SaudiManagments: "",
    SaudiEngineers: "",
    SaudiHandMen: "",
    SaudiEmployees: "",
    Area: "",
    Distributors: "",
    ExportCountries: "",
    ExportPercentage: "",
    ConsumerAgreementURL: "",
    AdditionalConsumerAgreementInfo: "",
    DocumentOfRelation: "",
    DocumentOfRelationType: "",
    AdditionalRelationInfo: "",
    HasInternalProduction: "",
    HasExternalExport: "",
    HasConsumerAgreement: "",
    IsRelatedToExistingIndustry: "",
    AgreementAttachement: "",
    AgreementAttachementType: "",
    ModonProducts: [],
    Id: ""


  };

  tables = {
    CustomerId: "",
    ProfileId: "",
    Orgin: "CP",
    Id: 0,
    OperationType: "C",
    AssetRealEstate: [],
    AssetShares: [],
    AssetOtherInvestments: [],
    AssetBankDetails: [],
    AssetNetworth: [],
    MessType: "S",
    MessText: "Sucess"
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
  new_material_object = {
    Description: "",
    Unit: 0,
    Destination: "",
    RCJ_RequestId: 0,
    SysUserServiceId: 0
  };
  new_product_object = {
    RawMaterial: "",
    Unit: 0,
    Destination: "",
    RCJ_RequestId: 0,
    SysUserServiceId: 0
  };
  nonSaudiOwnersListNames = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  translate: any;
  contries;
  region;
  constructor(
    private communicationsService: CommunicationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private calendar: NgbCalendar,
    private loanApplicationService: LoanApplicationService,
    private customerProfileService: CustomerProfileService,
    private commonService: CommonService,
    private rcjInfoService: RCJInfoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private projectInformationService: ProjInfoService,
    private form5Service: Form5Service
  ) {
    this.contries = this.form5Service.contries;
    this.region = this.form5Service.region;
    this.minDate = {
      year: this.calendar.getToday().year - 100,
      month: 1,
      day: 1
    };
    this.maxDate = {
      year: this.calendar.getToday().year + 20,
      month: 12,
      day: 31
    };
    this.translate = this.commonService.returnTranslate();
  }

  files: any = [];

  onFileChange(event) {
    this.files = event.target.files;
  }
  countries;
  ngAfterViewInit() {
    this.spinnerService.show();
    this.requestId = this.customerProfileService.loanRequestId;
    this.input.LoanRequestNo = this.customerProfileService.loanRequestId;
    this.countries = this.form5Service.contries;
    this.input = this.input;
    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
    this.form5Service.GetForm6Data(this.requestId).then(res => {
      this.input = this.input;
      console.log(res);
      if (res) {  // should fix from back end to return on item 
        res = res[0];
      }
      for (var i in Object.keys(res)) {
        this.input[Object.keys(res)[i]] = res[Object.keys(res)[i]];
        if (Object.keys(res)[i] === "ModonProducts") {
          this.products = this.input.ModonProducts;
          this.createProductsTable();
          this.inputsTable.seedTableData(this.products);
        }
      }
    })

    console.log("testData", this.ProjectClassificationAll);

    this.requestId = this.customerProfileService.loanRequestId;
    this.statusCode = this.customerProfileService.statusCode;

    if (this.statusCode == "P" || this.statusCode == "A")
      this.add_edit_delete_show = false;
    else this.add_edit_delete_show = true;

    if (this.landloanrequeststatus == 3 || this.landloanrequeststatus == 40 || this.landloanrequeststatus == 41)
      this.add_edit_delete_show = false;
    else this.add_edit_delete_show = true;

    // if (this.model.sysUserServiceId == null || this.model.sysUserServiceId == 0)
    //   this.router.navigateByUrl("/pages/new-request/loan-application");
    if (this.requestId == null || this.requestId == 0)
      this.router.navigateByUrl("/pages/new-request/loan-application");
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
    }
    this.spinnerService.hide();

  }
  ngOnInit() {
  }

  createProductsTable() {
    this.header = [
      "Final Product",
      "Product Capacity",
      "Product CapacityUnit",
      "Product Code"
    ];

    let cell = new Cell(
      "ProductCapacityUnit",
      "select",
      "",
      this.form5Service.productUnit as (CellList[]),
      false
    );

    this.rowStructureCells.push(new Cell("FinalProduct", "input", "", []));
    this.rowStructureCells.push(new Cell("ProductCapacityUnit", "input", "number", []));
    this.rowStructureCells.push(cell);
    this.rowStructureCells.push(new Cell("ProductCode", "input", "number", []));

    this.rowStructureCells.push(new Cell("Id", "input", "", null, true));

    //  let cell  = new Cell( "ProductCapacityUnit", "select", "", "");
    //  cell.list=[new CellList(" ton " , "2" ) ,  new CellList(" kig " , "3" ) ]
    //   this.rowStructueCells.push(new Cell( "FinalProduct", "input", "", ""));
    //   this.rowStructueCells.push(new Cell( "ProductCapacity", "input", "", ""));
    //   this.rowStructueCells.push(cell);
    //   this.rowStructueCells.push(new Cell( "ProductCode", "input", "", ""));
  }


  uploadFile(event, type) {
    try {
      this.input = this.input;
      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        if (file.size / 1024 / 1024 > 1) {
          this.commonService.showFailureToast("يجب أن لا يتعدى حجم الملف المرفق 1MB ");
          return false;
        }
        let attachmentType = file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.') + 1);
        if (this.form5Service.AttachmentExtentionTypes.indexOf(file.name.toLowerCase().substring(file.name.toLowerCase().lastIndexOf('.') + 1)) === -1) {
          this.commonService.showFailureToast("صيغة الملف غير متوافقة ");
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
    } else {
      // this.model.sysUserServiceId = res.SysUserServiceId;
      // this.model.id = res.Id;
      // this.model.Power = res.Power;
      // this.model.ProjectClassification = res.ProjectClassification;
      // this.model.Location = res.Location;
      // this.model.HazardousWaste = res.HazardousWaste;
      // this.model.IndustrialNonHazWaste = res.IndustrialNonHazWaste;
      // this.model.MunicipalWaste = res.MunicipalWaste;
      // this.model.PotableWater = res.PotableWater;
      // this.model.TotalAreaRequired = res.TotalAreaRequired;
      // this.model.SanitaryWasteWater = res.SanitaryWasteWater;
      // this.model.RCJ_Material = res.RCJ_Material;
      // this.material_object = this.model.RCJ_Material;
      // this.model.RCJ_ProductServices = res.RCJ_ProductServices;
      // this.product_services_object = this.model.RCJ_ProductServices;
      this.new_product_object.RCJ_RequestId = res.Id;
      this.new_material_object.RCJ_RequestId = res.Id;
      this.new_product_object.SysUserServiceId = res.SysUserServiceId;
      this.new_material_object.SysUserServiceId = res.SysUserServiceId;
      this.spinnerService.hide();
    }
  }
  resolveProjectInformation(res) {
    if (res.MessType === "E") {
      this.commonService.showFailureToast(res.MessText);
      this.spinnerService.hide();
    } else {
      try {
        this.GenInfoPer = parseFloat(res.GenInfoPer);
        this.MarkInfoPer = parseFloat(res.MarkInfoPer);
        this.TechInfoPer = parseFloat(res.TechInfoPer);
        this.FinInfoPer = parseFloat(res.FinInfoPer);
        this.ChecklistPer =
          (this.GenInfoPer +
            this.MarkInfoPer +
            this.TechInfoPer +
            this.FinInfoPer) /
          4;

        var loanPercentageValues = {
          GenInfoPer: this.GenInfoPer,
          MarkInfoPer: this.MarkInfoPer,
          TechInfoPer: this.TechInfoPer,
          FinInfoPer: this.FinInfoPer,
          ChecklistPer: this.ChecklistPer
        };

        this.customerProfileService.setLoanPercentageValues(
          loanPercentageValues
        );

        var temp_array = {};

        this.customerProfileService.setLoanArray(temp_array);
      } catch (err) {
        this.spinnerService.hide();
        this.commonService.showFailureToast(err);
      }
    }
  }
  onCreate($event) {
    $event["Status"] = "C";
    this.input.ModonProducts.push($event)
  }
  onDelete($event) {
    $event["Status"] = "D";
    this.input.ModonProducts.push($event)
  }
  onUpdate($event) {
    $event["Status"] = "U";
    this.input.ModonProducts.push($event)
  }
  onSave() {

    if (this.input.SaudiEngineers == "0")
      this.commonService.showFailureToast("يجب أن يكون عدد المهندس السعودي أكثر من صفر");
    else {
      if ((this.input.HasInternalProduction.toString() == 'true' || this.input.HasInternalProduction.toString() == 'false') && (this.input.HasExternalExport.toString() == 'true' || this.input.HasExternalExport.toString() == 'false')) {
        this.form5Service.SubmitForm6Data(this.input).then(requests => {
          this.commonService.showSuccessToast(" تم الحفظ ");
        }),
          err => this.commonService.showFailureToast(err);
      }
      else
        this.commonService.showFailureToast("الرجاء إدخال الحقول المطلوبة ");
    }
  }

  getProjectKPMRInformation() {
    try {
      //TODO: get rcj info from DB
      //   this.rcjInfoService
      //     .getProjectKPMRInformation(this.inputs.BpId,
      //       this.customerProfileService.currentCustomerProfile.customerProfileId)
      //     .then((res) => (this.resolveProjectKPMRInformation(res)), err => (this.getProjectInformationError(err)));
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  resolveProjectKPMRInformation(res) {
    if (res.ResMessType === "E") this.spinnerService.hide();
    else {
      var kpmr_source_data_array = [];

      for (var i = 0; i < res.BpManagePos.length; i++) {
        var kpmr_source_data = {
          BpPosId: res.BpManagePos[i].BpPosId ? res.BpManagePos[i].BpPosId : "",
          BpPosition: res.BpManagePos[i].BpPosition
            ? res.BpManagePos[i].BpPosition.PosDesc
            : "",
          FirstName: res.BpManagePos[i].FirstName
            ? res.BpManagePos[i].FirstName
            : "",
          LastName: res.BpManagePos[i].LastName
            ? res.BpManagePos[i].LastName
            : "",
          MiddleName: res.BpManagePos[i].MiddleName
            ? res.BpManagePos[i].MiddleName
            : "",
          DateOfJoining: res.BpManagePos[i].DateOfJoining
            ? this.commonService.returnDateArrayFromDateString(
              res.BpManagePos[i].DateOfJoining
            )
            : "",
          Nationality: res.BpManagePos[i].Nationality
            ? res.BpManagePos[i].Nationality.Nationality
            : "",
          Degree: res.BpManagePos[i].Degree ? res.BpManagePos[i].Degree : "",
          ProfCert: res.BpManagePos[i].ProfCert
            ? res.BpManagePos[i].ProfCert
            : "",
          YearExp: res.BpManagePos[i].YearExp ? res.BpManagePos[i].YearExp : "",
          YearOverExp: res.BpManagePos[i].YearOverExp
            ? res.BpManagePos[i].YearOverExp
            : "",
          GuiId: res.BpManagePos[i].GuiId ? res.BpManagePos[i].GuiId : ""
        };

        kpmr_source_data_array.push(kpmr_source_data);

        this.kpmr_source_length++;
      }

      this.kpmr_source.load(kpmr_source_data_array);

      this.kpmr_source.refresh();

      this.communicationsService
        .getDocumentService(this.requestId, "p")
        .then(
          requests => this.resolveDocuments(requests),
          err => this.commonService.showFailureToast(err)
        );
    }
  }
  invalidForm() {
    this.commonService.showFailureToast("الرجاء إدخال الحقول المطلوبة ");
  }

  resolveDocuments(requests) {

  }
  addRowMaterial(material_object) {
    material_object.push(this.new_material_object);
  }
  addRowProduct(product_services_object) {
    product_services_object.push(this.new_product_object);
  }
  onClickLoanApplicationTab(tab_number) {
    if (this.startedFilling == 0) {
      switch (tab_number) {
        case 0:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/project-information"
          );
          break;

        case 1:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/marketing-information"
          );
          break;

        case 2:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/technical-information"
          );
          break;

        case 3:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/financial-information"
          );
          break;

        case 4:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/checklist"
          );
          break;

        case 5:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/land-form1"
          );
          break;

        case 6:
          this.router.navigateByUrl(
            "/pages/new-request/loan-application/land-form2"
          );
          break;
      }
    } else {
      this.commonService.showFailureToast(
        "Complete filling the MODON Information !"
      ); // identity theft
    }
  }
}