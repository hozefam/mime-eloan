import { Component, OnInit, Injectable, Input } from "@angular/core";
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
import { FactoryLoanService } from '../../../../services/factory-loan.service';
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
  selector: 'factory-loan',
  templateUrl: './factory-loan.component.html',
  styleUrls: ['./factory-loan.component.scss']
})
export class FactoryLoanComponent implements OnInit {


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
  landloanrequeststatus: any = 0;

  add_edit_delete_show = true;
  serviceId = 8;

  input = {
    Id: "",
    SysUserServiceId: "",
    LoanRequestNo: "",
    "LandRequestNo": "",
    "ILActivityClassification": "",
    "SubActivitie": "",
    ReadyFactoryCity: "",
    UnitsNumber: "",
    Products: "",
    RawMaterials: "",
    ReadyFactoryType: "", //ModelFactoryType  
    WaterNeeds: "",
    Waste: "",
    ElectricalNeeds: "",
    WaterConsumption: "",
    Area: "",
    DelegateIDCopy: "",
    FactoryLayoutAttachment: "",
    IDCopy: "",
    IDCopyType: "",
    //NationalAttachment:"",
    //NationalAttachmentType:"",
    NationalSource: "",
    IsAwaitingSIDFFinance: false
  };
  nationalSources = [];
  readyFactoryCities = [];

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










  panelStep = 1;








  allPanelsExpanded = false;

  startedFilling = 0;

  requestId = 0;


  statusCode = "";

  countries;
  pollutionType;
  IndustryType;
  ManufacturingMethod;
  Supplier;
  ManufactureTechId;
  Activities;
  SubActivities;
  areaAvailable = false;

  nonSaudiOwnersListNames = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  translate: any;


  constructor(private communicationsService: CommunicationsService, private spinnerService: Ng4LoadingSpinnerService, private calendar: NgbCalendar, private loanApplicationService: LoanApplicationService,
    private customerProfileService: CustomerProfileService, private commonService: CommonService, private rcjInfoService: RCJInfoService, private toastr: ToastrService, private modalService: NgbModal, private router: Router
    , private projectInformationService: ProjInfoService, private form5Service: Form5Service, private llCommonService: LLCommonService, private factoryLoanService: FactoryLoanService) {

    this.Activities = this.form5Service.activeties;
    this.nationalSources = this.factoryLoanService.nationalSource;
    this.readyFactoryCities = this.factoryLoanService.readyFactoryCities;




    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 20, month: 12, day: 31 };
    this.translate = this.commonService.returnTranslate();

  }

  files: any = [];

  onFileChange(event) {

    this.files = event.target.files;

  }

  ngOnInit() {

    this.input = this.input;
    this.spinnerService.show();
    this.requestId = this.customerProfileService.loanRequestId;
    this.landloanrequeststatus = this.customerProfileService.LandLoanRequestStatus;
    this.factoryLoanService.factoryInfo({ id: this.requestId, method: "get" }).subscribe(responce => {
      Object.keys(responce).forEach(e => {
        this.input[e] = responce[e];
      });
      this.getModonSubActivety(this.input.ILActivityClassification);

    }, error => {
      console.warn("getting form data", error);
    })
    // this.form5Service.GetForm5Data(this.requestId ).then(res=>
    //    {
    //       console.log(res);
    //       Object.keys(res).forEach(e=>
    //         {
    //          this.input[e] = res[e];
    //         });
    //         // fix numberic list to be string
    //          // this.input.ILActivityClassification = res['Activitie'].toString()

    //         var obj;
    //         this.getModonSubActivety(obj);
    //         this.input.SubActivitie = res['SubActivitie'].toString();
    //         // console.log(res["Activitie"]);
    //         console.log(this.input["SubActivitie"]);
    //         console.log(this.input["IndustryType"]);
    //         console.log(this.input["ManufactureTechId"]);


    //    }
    //)
    //For testing
    //this.model.sysUserServiceId= 4347;
    //this.model.sysUserServiceId= this.customerProfileService.loanRequestId;

    console.log("testData", this.ProjectClassificationAll);

    this.requestId = this.customerProfileService.loanRequestId;
    this.statusCode = this.customerProfileService.statusCode;

    //if (this.statusCode == "P" || this.statusCode == "A" || this.landloanrequeststatus == 8 || this.landloanrequeststatus == 40 || this.landloanrequeststatus == 41)
    if (this.landloanrequeststatus == 8 || this.landloanrequeststatus == 40 || this.landloanrequeststatus == 41)
      this.add_edit_delete_show = false;

    else
      this.add_edit_delete_show = true;



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

  tempAttachments = {
    //NationalAttachment:"",
    FactoryLayoutAttachment: ""

  };
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


  checkCityAreaAvailability() {
    if (this.input.Area && this.input.ReadyFactoryCity)
      this.factoryLoanService.checkCityAvailability({ area: this.input.Area, cityid: this.input.ReadyFactoryCity }).subscribe((res) => {
        if (res["code"] === "S") {
          this.areaAvailable = true;
          this.commonService.showSuccessToast(res["message"]);
        }
        else {
          this.areaAvailable = false;
          this.commonService.showFailureToast(res["message"]);
        }
      }, error => {
        this.commonService.showFailureToast("لا توجد مساحة متوفرة في المدينة المختارة");
        this.areaAvailable = false;
      });
  }

  invalidForm() {
    this.commonService.showFailureToast("الرجاء إدخال الحقول المطلوبة ");
  }
  getModonSubActivety(obj) {
    console.log(obj);

    this.form5Service.GetModonSubActivities(this.input.ILActivityClassification).then(res => {
      console.log(res);
      this.SubActivities = res;
      
      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.MainActRetrieved'));
      console.log(this.input.SubActivitie)

    }
    ).catch()
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

  onSave() {
    if (!this.areaAvailable) {
      this.commonService.showFailureToast("لا توجد مساحة متوفرة في المدينة المختارة");
      return;
    }
    this.input.LoanRequestNo = this.requestId.toString();
    this.factoryLoanService
      .factoryInfo(this.input)
      .subscribe(res => {
        if (!res["message"] || res["message"] !== "F") {
          this.input.Id = res.toString();
          this.commonService.showSuccessToast(" تم الحفظ ");
        }
        else
          this.commonService.showFailureToast("لم يتم الحفظ ")
      }),
      err => this.commonService.showFailureToast(err);

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


}