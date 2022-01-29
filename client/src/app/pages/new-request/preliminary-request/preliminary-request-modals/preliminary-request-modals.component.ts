import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreliminaryRequestService } from "../../../../services/preliminary-request.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonService } from "../../../../services/common.service";
import { NgbDateStruct, NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentListComponent } from '../../../../components/document-list/document-list.component';
import { _ } from 'underscore';
declare var $: any;

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
  selector: 'preliminary-request-modals',
  templateUrl: './preliminary-request-modals.component.html',
  styleUrls: ['./preliminary-request-modals.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class PreliminaryRequestModalsComponent implements OnInit {

  fieldForSearchInput = "";
  harmonized_code_pop_up_array: any = [];
  main_activity_pop_up_array: any = [];

  sub_activity_pop_up_array: any = [];
   company_type_code_list:any=[];
   
  investor_type_code_list = [];
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
  harmonized_code_pop_up_original_array: any = [];
  main_activity_pop_up_original_array: any = [];

  sub_activity_pop_up_original_array: any = [];

  searchText: string = "";

  HarmonizedCodePopUpReference: any;

  PreliminaryRequestModalsForm: any = {};

  selected_option = "";

  selected_radio = "";

  // postalCodeLength = 0;

  files: any = [];

  @ViewChild('identifier') identifier: DocumentListComponent;

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  translate: any;
language:any;
  constructor(private modalService: NgbModal, private commonService: CommonService, private calendar: NgbCalendar, private spinnerService: Ng4LoadingSpinnerService, private activeModal: NgbActiveModal, private preliminaryRequestService: PreliminaryRequestService) {

    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 100, month: 12, day: 31 };

    this.translate = this.commonService.returnTranslate();
    this.language=this.commonService.defaultLanguage;

  }

  ngOnInit() {

    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++) {

      this.PreliminaryRequestModalsForm.inputs[i]["validation_status"] = false;

      if (this.PreliminaryRequestModalsForm.inputs[i].combo && this.PreliminaryRequestModalsForm.inputs[i].combo === true)
        this.PreliminaryRequestModalsForm.inputs[i]["validation_status_unit"] = false;

      if (this.PreliminaryRequestModalsForm.inputs[i].id == "hsCode")
        this.harmonized_code_pop_up_original_array = this.PreliminaryRequestModalsForm.inputs[i].value;
      if (this.PreliminaryRequestModalsForm.inputs[i].id == "divisionName")
        this.main_activity_pop_up_original_array = this.PreliminaryRequestModalsForm.inputs[i].value;

      if (this.PreliminaryRequestModalsForm.inputs[i].id == "activityName")
        this.sub_activity_pop_up_original_array = this.PreliminaryRequestModalsForm.inputs[i].value;

    }

  }


  getOwnerDetails(shareholder_type, investor_type, id_type, id_number, dob) {

    this.spinnerService.show();

    this.preliminaryRequestService
      .getOwnerDetails(shareholder_type, investor_type, id_type, id_number, dob)
      .then((res) => (this.resolveOwnersDetails(res)), err => this.resolveError());

  }

  resolveOwnersDetails(res) {

    if (res.ErrorMessages) {

      if (res.ErrorMessages[0].Type === "error") {
        this.commonService.showFailureToast(res.ErrorMessages[0].Message);
        this.spinnerService.hide();
      }

    }

    else {

      this.PreliminaryRequestModalsForm.form_number = 2;

      if (this.selected_option === this.translate.instant('COMMON.Individual')) {

        if (this.selected_radio === this.translate.instant('COMMON.Saudi National')) {

          for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
            if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "nationalId" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "date" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo" ||

              // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "NoObjectionLetter" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "emailId")
              this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

          for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
            if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "nationalId" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "date" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

              // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "NoObjectionLetter" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "emailId"))
              this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        }

        else if (this.selected_radio === this.translate.instant('COMMON.Resident')) {

          for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
            if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "iqamaNumber" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "date" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo" ||

              // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "emailId")
              this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

          for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
            if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "iqamaNumber" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "date" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo" ||
              this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo" ||

              // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
              // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||

              this.PreliminaryRequestModalsForm.inputs[i].id == "emailId"))
              this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        }

      }

      else if (this.selected_option === this.translate.instant('COMMON.Company')) {

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crIssueDate" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

            this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo" ||

            // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "NoObjectionLetter" ||

            this.PreliminaryRequestModalsForm.inputs[i].id == "emailId")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crIssueDate" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

            this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo" ||

            // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "NoObjectionLetter" ||

            this.PreliminaryRequestModalsForm.inputs[i].id == "emailId"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;
      }

      for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++) {

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "name" && this.PreliminaryRequestModalsForm.method == "add")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.name ? res.name : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.phoneNo ? res.phoneNo : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.faxNo ? res.faxNo : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "street")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.street ? res.street : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.zipCode ? res.zipCode : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "emailId")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.emailId ? res.emailId : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "districtArea")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.districtArea ? res.districtArea : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "unitNo")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.unitNo ? res.unitNo : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "buildingNo")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.buildingNo ? res.buildingNo : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "additionalNo")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.additionalNo ? res.additionalNo : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "nationality") {

          this.PreliminaryRequestModalsForm.inputs[i].selected = this.translate.instant('COMMON.Saudi Arabia');
          this.changeCountryCitySelectOption(this.PreliminaryRequestModalsForm.inputs[i].selected, res.city, this.PreliminaryRequestModalsForm.inputs[i].id);

        }

        // if (this.PreliminaryRequestModalsForm.inputs[i].id == "city")
        //   this.PreliminaryRequestModalsForm.inputs[i].value = res.city ? res.city : "";

      }

      if (this.PreliminaryRequestModalsForm.inputs[0].id == "proInd") {

        this.PreliminaryRequestModalsForm.inputs[0].form_number = 2;

        if (this.PreliminaryRequestModalsForm.inputs[0].selected == "Yes")
          this.PreliminaryRequestModalsForm.inputs[11].form_number = 2;

        else
          this.PreliminaryRequestModalsForm.inputs[11].form_number = 1;

      }

      this.spinnerService.hide();

    }

  }

  getRepresentativeDetails(id_type, id_number, dob) {

    this.spinnerService.show();

    this.preliminaryRequestService
      .getRepresentativeDetails(id_type, id_number, dob)
      .then((res) => (this.resolveRepresentativeDetails(res)), err => this.resolveError());

  }

  resolveRepresentativeDetails(res) {

    if (res.ErrorMessages) {

      if (res.ErrorMessages[0].Type === "error") {
        this.commonService.showFailureToast(res.ErrorMessages[0].Message);
        this.spinnerService.hide();
      }

    }

    else {

      this.PreliminaryRequestModalsForm.form_number = 2;

      if (this.selected_option ==  this.translate.instant('COMMON.Sagia License')) {

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "License Date" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "address" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "email" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "mobile" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "attachment")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "License Date" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "address" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "email" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "mobile" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "attachment"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

      }

      else if (this.selected_option == this.translate.instant('COMMON.National ID') || this.selected_option ==  this.translate.instant('COMMON.Iqama') ) {

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "Date of Birth" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "address" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "email" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "mobile" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "attachment")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "Date of Birth" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "address" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "email" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "mobile" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "attachment"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

      }

      if (this.selected_option ==this.translate.instant('COMMON.GCC ID')) {

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "address" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "email" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "mobile" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "attachment")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "address" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "email" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "mobile" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "attachment"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

      }

      for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++) {

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "address")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.address ? res.address : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "email")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.email ? res.email : "";

        if (this.PreliminaryRequestModalsForm.inputs[i].id == "mobile")
          this.PreliminaryRequestModalsForm.inputs[i].value = res.mobile ? res.mobile : "";

      }

      this.PreliminaryRequestModalsForm["buPartner"] = res.buPartner ? res.buPartner : "";

      this.spinnerService.hide();

    }

  }

  onSubmit(form_number) {

    var flag = 0;

    var flagged_id = 0;

    // var flagged_name = "", flagged_type = "";

    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var passportRegex = /^[A-Za-z]/i

    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++) {

      this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

      if (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number && this.PreliminaryRequestModalsForm.inputs[i].visible === true) {

        if (this.PreliminaryRequestModalsForm.inputs[i].type == "file_single" && this.PreliminaryRequestModalsForm.inputs[i].required == "true" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && ((!this.PreliminaryRequestModalsForm.documents && this.files.length == 0) || (this.PreliminaryRequestModalsForm.documents && this.PreliminaryRequestModalsForm.documents.documentList.length == 0 && this.files.length == 0))) {

          flag = 1;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = true;

        }

        if (this.PreliminaryRequestModalsForm.inputs[i].type == "file_multiple" && this.PreliminaryRequestModalsForm.inputs[i].required == "true" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && ((!this.PreliminaryRequestModalsForm.documents && this.files.length == 0) || (this.PreliminaryRequestModalsForm.documents && this.PreliminaryRequestModalsForm.documents.documentList.length == 0 && this.files.length == 0))) {

          flag = 1;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = true;

        }

        if ((this.PreliminaryRequestModalsForm.inputs[i].type != "file_single" &&
          this.PreliminaryRequestModalsForm.inputs[i].type != "file_multiple") &&
          this.PreliminaryRequestModalsForm.inputs[i].required === "true" &&
          (this.PreliminaryRequestModalsForm.inputs[i].form_number ===
            this.PreliminaryRequestModalsForm.form_number) &&
          this.PreliminaryRequestModalsForm.inputs[i].visible === true &&
          this.PreliminaryRequestModalsForm.inputs[i].type != 'radio' &&
          this.PreliminaryRequestModalsForm.inputs[i].type != 'select' &&
          this.PreliminaryRequestModalsForm.inputs[i].type != 'da_select' &&
          this.PreliminaryRequestModalsForm.inputs[i].type != 'cc_select' &&
          this.PreliminaryRequestModalsForm.inputs[i].type != 'harmonized_code_pop_up' &&
          (this.PreliminaryRequestModalsForm.inputs[i].value === "" ||
            this.PreliminaryRequestModalsForm.inputs[i].value === null ||
            !this.PreliminaryRequestModalsForm.inputs[i].value)) {

          flag = 1;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = true;
          // flagged_name = this.PreliminaryRequestModalsForm.inputs[i].name;
          // flagged_type = this.PreliminaryRequestModalsForm.inputs[i].type;

        }

        if ((this.PreliminaryRequestModalsForm.inputs[i].type != "file_single" &&
          this.PreliminaryRequestModalsForm.inputs[i].type != "file_multiple") &&
          this.PreliminaryRequestModalsForm.inputs[i].required === "true" &&
          (this.PreliminaryRequestModalsForm.inputs[i].form_number ===
            this.PreliminaryRequestModalsForm.form_number) &&
          this.PreliminaryRequestModalsForm.inputs[i].visible === true &&
          (this.PreliminaryRequestModalsForm.inputs[i].type === 'radio' ||
            this.PreliminaryRequestModalsForm.inputs[i].type === 'harmonized_code_pop_up' ||
            this.PreliminaryRequestModalsForm.inputs[i].type === 'select' ||
            this.PreliminaryRequestModalsForm.inputs[i].type === 'da_select' ||
            this.PreliminaryRequestModalsForm.inputs[i].type === 'cc_select') &&
          (this.PreliminaryRequestModalsForm.inputs[i].selected === "" ||
            this.PreliminaryRequestModalsForm.inputs[i].selected === null ||
            !this.PreliminaryRequestModalsForm.inputs[i].selected)) {

          flag = 1;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = true;
          // flagged_name = this.PreliminaryRequestModalsForm.inputs[i].name;
          // flagged_type = this.PreliminaryRequestModalsForm.inputs[i].type;

        }

        else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].type === "email" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && !emailRegex.test(this.PreliminaryRequestModalsForm.inputs[i].value ? this.PreliminaryRequestModalsForm.inputs[i].value.toLowerCase() : "")) {

          flag = 2;
          flagged_id = i;

        }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "nationalId" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length != 10) {

        //   flag = 4;
        //   flagged_id = i;

        // }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "passportNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length != 8) {

        //   flag = 5;
        //   flagged_id = i;

        // }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "passportNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && !passportRegex.test(this.PreliminaryRequestModalsForm.inputs[i].value)) {

        //   flag = 6;
        //   flagged_id = i;

        // }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "iqamaNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length != 10) {

        //   flag = 7;
        //   flagged_id = i;

        // }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "idNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[0].selected === "National ID" && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length != 10) {

        //   flag = 8;
        //   flagged_id = i;

        // }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "idNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[0].selected === "Iqama" && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length != 10) {

        //   flag = 9;
        //   flagged_id = i;

        // }

        else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "idNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[0].selected ===this.translate.instant('COMMON.Sagia License') && !(this.PreliminaryRequestModalsForm.inputs[i].value.toString().length >= 10 && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length <= 15)) {

          flag = 10;
          flagged_id = i;

        }

        else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "idNumber" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) && this.PreliminaryRequestModalsForm.inputs[0].selected === this.translate.instant('COMMON.GCC ID') && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length > 15) {

          flag = 11;
          flagged_id = i;

        }

        else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "shareHolderType") {

          if ((this.PreliminaryRequestModalsForm.inputs[i].selected === this.translate.instant('COMMON.Individual') ||
            this.PreliminaryRequestModalsForm.inputs[i].value === this.translate.instant('COMMON.Individual')) &&
            (this.PreliminaryRequestModalsForm.inputs[i + 1].selected === this.translate.instant('COMMON.Foreigner') ||
              this.PreliminaryRequestModalsForm.inputs[i + 1].value === this.translate.instant('COMMON.Foreigner')) &&
            this.PreliminaryRequestModalsForm.inputs[i + 8].selected === this.translate.instant('COMMON.Saudi Arabia')) {

            flag = 12;
            flagged_id = i;

          }

        }

        // else if (this.PreliminaryRequestModalsForm.inputs[i].id === "hsCode" && this.PreliminaryRequestModalsForm.inputs[i].value.toString().length > 10)
        //   flag = 13;

        else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "passportExpiryDate" && (this.PreliminaryRequestModalsForm.inputs[i].form_number === this.PreliminaryRequestModalsForm.form_number) &&
          this.checkGregDate(this.commonService.returnDateArrayFromGregDateString(this.PreliminaryRequestModalsForm.inputs[i].value))) {

          flag = 14;
          flagged_id = i;

        }

        // else if (flag != 1 && this.PreliminaryRequestModalsForm.inputs[i].id === "zipCode" &&
        //   this.PreliminaryRequestModalsForm.inputs[i].postalCodeLength != 0 && (
        //     this.PreliminaryRequestModalsForm.inputs[i].form_number ===
        //     this.PreliminaryRequestModalsForm.form_number) &&
        //   this.PreliminaryRequestModalsForm.inputs[i].value.toString().length != this.PreliminaryRequestModalsForm.inputs[i].postalCodeLength) {

        //   flag = 15;
        //   flagged_id = i;
        //   this.postalCodeLength = this.PreliminaryRequestModalsForm.inputs[i].postalCodeLength;

        // }

        else if (flag != 1 && this.PreliminaryRequestModalsForm.method) {

          if (this.PreliminaryRequestModalsForm.method == "add" &&
            this.PreliminaryRequestModalsForm.inputs[i].id === "percentage" &&
            (this.PreliminaryRequestModalsForm.inputs[i].form_number ===
              this.PreliminaryRequestModalsForm.form_number) &&
            this.PreliminaryRequestModalsForm.inputs[i].value > 100) {

            flag = 16;
            flagged_id = i;

          }

          else if (flag != 1 && this.PreliminaryRequestModalsForm.method == "edit" &&
            this.PreliminaryRequestModalsForm.inputs[i].id === "proPercentage" &&
            (this.PreliminaryRequestModalsForm.inputs[i].form_number ===
              this.PreliminaryRequestModalsForm.form_number) &&
            this.PreliminaryRequestModalsForm.inputs[i].value > 100) {

            flag = 17;
            flagged_id = i;

          }

        }
        if (this.PreliminaryRequestModalsForm.inputs[i].combo && this.PreliminaryRequestModalsForm.inputs[i].combo === true && this.PreliminaryRequestModalsForm.inputs[i].selected_unit === "" && this.PreliminaryRequestModalsForm.inputs[i].required === "true")
          this.PreliminaryRequestModalsForm.inputs[i].validation_status_unit = true;

      }

    }

    if (flag == 0) {

      switch (form_number) {

        case 1:

          var shareholder_type = "", investor_type = "", id_type = "", id_number = "", date = "";

          if (this.selected_option === this.translate.instant('COMMON.Individual')) {

            shareholder_type = "1";

            if (this.selected_radio === this.translate.instant('COMMON.Saudi National')) {

              investor_type = "N";
              id_type = "N"

              if (this.PreliminaryRequestModalsForm.method == "add") {

                id_number = this.PreliminaryRequestModalsForm.inputs[2].value;
                date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[4].value);

              }

              else if (this.PreliminaryRequestModalsForm.method == "edit") {

                id_number = this.PreliminaryRequestModalsForm.inputs[3].value;
                date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[5].value);

              }

              this.getOwnerDetails(shareholder_type, investor_type, id_type, id_number, date);

            }

            else if (this.selected_radio === this.translate.instant('COMMON.Resident')) {

              investor_type = "R";
              id_type = "I"

              if (this.PreliminaryRequestModalsForm.method == "add") {

                id_number = this.PreliminaryRequestModalsForm.inputs[3].value;
                date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[4].value);

              }

              else if (this.PreliminaryRequestModalsForm.method == "edit") {

                id_number = this.PreliminaryRequestModalsForm.inputs[4].value;
                date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[5].value);

              }

              this.getOwnerDetails(shareholder_type, investor_type, id_type, id_number, date);

            }

          }

          else if (this.selected_option === this.translate.instant('COMMON.Company')) {

            shareholder_type = "2"
            investor_type = "N";
            id_type = "C"

            if (this.PreliminaryRequestModalsForm.method == "add") {

              id_number = this.PreliminaryRequestModalsForm.inputs[5].value;
              date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[6].value);

            }

            else if (this.PreliminaryRequestModalsForm.method == "edit") {

              id_number = this.PreliminaryRequestModalsForm.inputs[6].value;
              date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[7].value);

            }

            this.getOwnerDetails(shareholder_type, investor_type, id_type, id_number, date);

          }

          else if (this.selected_option ===  this.translate.instant('COMMON.National ID')) {

            id_type = "N";
            id_number = this.PreliminaryRequestModalsForm.inputs[2].value;
            date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[3].value);

            this.getRepresentativeDetails(id_type, id_number, date);

          }

          else if (this.selected_option ===  this.translate.instant('COMMON.Iqama')) {

            id_type = "I";
            id_number = this.PreliminaryRequestModalsForm.inputs[2].value;
            date = this.commonService.returnDateStringWithoutHyphenFromDateArray(this.PreliminaryRequestModalsForm.inputs[3].value);

            this.getRepresentativeDetails(id_type, id_number, date);

          }

          else if (this.selected_option === this.translate.instant('COMMON.Sagia License')) {

            id_type = "S";

            if (this.PreliminaryRequestModalsForm.method == "add") {

              id_number = this.PreliminaryRequestModalsForm.inputs[2].value;
              date = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.PreliminaryRequestModalsForm.inputs[7].value);

            }

            else if (this.PreliminaryRequestModalsForm.method == "edit") {

              id_number = this.PreliminaryRequestModalsForm.inputs[2].value;
              date = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.PreliminaryRequestModalsForm.inputs[3].value);

            }

            this.getRepresentativeDetails(id_type, id_number, date);

          }

          else if (this.selected_option === this.translate.instant('COMMON.GCC ID')) {

            id_type = "G";
            id_number = this.PreliminaryRequestModalsForm.inputs[2].value;
            date = "14091220";

            this.getRepresentativeDetails(id_type, id_number, date);

          }

          break;

        case 2:

          var flag = 0;

          if (this.PreliminaryRequestModalsForm.inputs[10])
            if (this.PreliminaryRequestModalsForm.inputs[10].form_number == this.PreliminaryRequestModalsForm.form_number &&
              this.PreliminaryRequestModalsForm.inputs[10].visible == true)
              if (this.PreliminaryRequestModalsForm.passport_number_list)
                for (var i = 0; (i < this.PreliminaryRequestModalsForm.passport_number_list.length) && flag == 0; i++)
                  if (this.PreliminaryRequestModalsForm.passport_number_list[i] == this.PreliminaryRequestModalsForm.inputs[10].value)
                    flag = 1;

          if (flag == 0) {

            this.PreliminaryRequestModalsForm.buttons[1].handler(this.PreliminaryRequestModalsForm);

            if (!this.PreliminaryRequestModalsForm.api)
              this.activeModal.close();

          }

          else
            this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.PassportNumberExists'));

          break;

        default:
          break;

      }

    }

    else if (flag == 1) {

      // if (flagged_type == "select" || flagged_type == "radio")
      //   this.commonService.showFailureToast("Select the " + flagged_name + " !");

      // else if (flagged_type == "checkbox")
      //   this.commonService.showFailureToast("Check the " + flagged_name + " !");

      // else
      //   this.commonService.showFailureToast("Enter the " + flagged_name + " !");

      this.commonService.showFailureToast(this.translate.instant('COMMON.EnterAllMandatoryFields'));

    }

    else {

      if (flag == 2)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.EnterValidEmail'));

      else if (flag == 3)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ChooseAttachment'));

      // else if (flag == 4)
      //   this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.NationalIdTenDigits'));

      else if (flag == 5)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.PassportNumberEightCharacters'));

      else if (flag == 6)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.PassportNumberStartLetter'));

      // else if (flag == 7)
      //   this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.IqamaIdTenDigits'));

      // else if (flag == 8)
      //   this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.NationalIdTenDigits'));

      // else if (flag == 9)
      //   this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.IqamaIdTenDigits'));

      else if (flag == 10)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.SagiaLicenseTenToFifteenDigits'));

      else if (flag == 11)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.GCCId15Digits'));

      else if (flag == 12)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.NationalityForeignInvestor'));

      // else if (flag == 13)
      //   this.commonService.showFailureToast("The Harmonized Code must contain a maximum of 10 digits !");

      else if (flag == 14)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.PassportExpiryDateNotPast'));

      // else if (flag == 15)
      //   this.commonService.showFailureToast("The Postal Code must contain " + this.postalCodeLength + " digits !");

      else if (flag == 16)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ShareholderPercentageHundred'));

      else if (flag == 17)
        this.commonService.showFailureToast(this.translate.instant('PRELIMINARY_REQUEST.ProposedPercentageHundred'));

      this.PreliminaryRequestModalsForm.inputs[flagged_id].validation_status = true;

    }

  }


  changeDivisionActivitySelectOption(selected_option, selected_id) {

    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
      if (this.PreliminaryRequestModalsForm.inputs[i].id == selected_id)
        this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

    for (var j = 0; j < 2; j++) {

      if (this.PreliminaryRequestModalsForm.inputs[j].id == "divisionName") {

        if (this.PreliminaryRequestModalsForm.inputs[j].selected != "") {

          var temp_id = "";
          var temp_array = [];

          for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs[j].dropdown.length; i++)
            if (this.PreliminaryRequestModalsForm.inputs[j].dropdown[i].divisionName === selected_option)
              temp_id = this.PreliminaryRequestModalsForm.inputs[j].dropdown[i].id;

          for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs[j + 1].dropdown.length; i++)
            if (this.PreliminaryRequestModalsForm.inputs[j + 1].dropdown[i].divisionId === temp_id)
              temp_array.push(this.PreliminaryRequestModalsForm.inputs[j + 1].dropdown[i].activityName);

          this.PreliminaryRequestModalsForm.inputs[j + 1].value = temp_array;

        }

      }

    }

  }

  changeCountryCitySelectOption(selected_option, city, selected_id) {

    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
      if (this.PreliminaryRequestModalsForm.inputs[i].id == selected_id)
        this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

    for (var j = 8; j < 10; j++) {

      if (this.PreliminaryRequestModalsForm.inputs[j].id == "nationality") {

        var index = 13;
        // var zipCodeIndex = 18;

        var temp_key = "";
        var temp_array = [];

        // var postalCodeLength = 0;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs[j].dropdown.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[j].dropdown[i].nameAr === selected_option||this.PreliminaryRequestModalsForm.inputs[j].dropdown[i].nameEn === selected_option) {

            temp_key = this.PreliminaryRequestModalsForm.inputs[j].dropdown[i].countryKey;
            // postalCodeLength = parseInt(this.PreliminaryRequestModalsForm.inputs[j].dropdown[i].postalCodeLen);

          }

        if (j == 8) {

          index = 13;
          // zipCodeIndex = 18;

        }

        else if (j == 9) {

          index = 15;
          // zipCodeIndex = 20;

        }

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs[index].dropdown.length; i++)
       {   
         if (this.PreliminaryRequestModalsForm.inputs[index].dropdown[i].countryKey === temp_key)
        // console.log(this.PreliminaryRequestModalsForm.inputs[index].dropdown[i].countryKey)
          {
            if(this.commonService.defaultLanguage === 'ar')
          temp_array.push(this.PreliminaryRequestModalsForm.inputs[index].dropdown[i].cityNameAr);
          else
          temp_array.push(this.PreliminaryRequestModalsForm.inputs[index].dropdown[i].cityNameEn);
          }
        this.PreliminaryRequestModalsForm.inputs[index].value = temp_array;

        this.PreliminaryRequestModalsForm.inputs[index].selected = city;
       }
        // this.PreliminaryRequestModalsForm.inputs[zipCodeIndex].postalCodeLength = postalCodeLength;

      }

    }

  }

  changeSelectOptionCombo(selected_option, selected_id) {
    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
      if (this.PreliminaryRequestModalsForm.inputs[i].id == selected_id && this.PreliminaryRequestModalsForm.inputs[i].combo && this.PreliminaryRequestModalsForm.inputs[i].combo === true)
        this.PreliminaryRequestModalsForm.inputs[i].validation_status_unit = false;
  }

  changeSelectOption(selected_option, selected_id) {
    //Peter added
    if (selected_option === "No Objection Letter" && selected_id === "type_of_document") {
      this.PreliminaryRequestModalsForm.inputs[1].id = "NoObjectionLetter";
      this.PreliminaryRequestModalsForm.inputs[1].name = this.translate.instant('PRELIMINARY_REQUEST.NoObjectionLetter');
    } else if (selected_option != "No Objection Letter" && selected_id === "type_of_document") {
      this.PreliminaryRequestModalsForm.inputs[1].id = "attachment";
      this.PreliminaryRequestModalsForm.inputs[1].name = this.translate.instant('PRELIMINARY_REQUEST.Attachments');
    }
    //Peter added

    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
      if (this.PreliminaryRequestModalsForm.inputs[i].id == selected_id)
        this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

    switch (selected_option) {

      case this.translate.instant('COMMON.Individual'):

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

            this.investor_type_code_list=[];
            for (var i = 0; i < this.investor_type_list.length; i++)
            this.investor_type_code_list.push(this.translate.instant('COMMON.'+ this.investor_type_list[i].type));
      
            this.PreliminaryRequestModalsForm.inputs[1].value=this.investor_type_code_list;

        if (this.PreliminaryRequestModalsForm.inputs[0].id == "proInd") {

          this.PreliminaryRequestModalsForm.inputs[0].form_number = 1;

          if (this.PreliminaryRequestModalsForm.inputs[0].selected == "Yes")
            this.PreliminaryRequestModalsForm.inputs[11].form_number = 1;

          else
            this.PreliminaryRequestModalsForm.inputs[11].form_number = 2;

        }

        if (this.PreliminaryRequestModalsForm.inputs[1].id == "investorType")
          this.selected_radio = this.PreliminaryRequestModalsForm.inputs[1].selected;

        else if (this.PreliminaryRequestModalsForm.inputs[2].id == "investorType")
          this.selected_radio = this.PreliminaryRequestModalsForm.inputs[2].selected;

        this.changeRadioOption(this.selected_radio);

        this.selected_option = selected_option;

        break;

      case this.translate.instant('COMMON.Company'):

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crIssueDate")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "crIssueDate"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;
            this.company_type_code_list=[];
            for (var i = 0; i < this.company_type_list.length; i++)
            this.company_type_code_list.push(this.translate.instant('COMMON.'+ this.company_type_list[i].type));
      
            this.PreliminaryRequestModalsForm.inputs[1].value=this.company_type_code_list;

            
        if (this.PreliminaryRequestModalsForm.inputs[0].id == "proInd") {

          this.PreliminaryRequestModalsForm.inputs[0].form_number = 1;

          if (this.PreliminaryRequestModalsForm.inputs[0].selected == "Yes")
            this.PreliminaryRequestModalsForm.inputs[11].form_number = 1;

          else
            this.PreliminaryRequestModalsForm.inputs[11].form_number = 2;

        }

        this.selected_option = selected_option;

        break;

      case this.translate.instant('COMMON.Sagia License'):

        this.selected_option = selected_option;

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "License Date")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "License Date"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        break;

      case this.translate.instant('COMMON.National ID'):
      case this.translate.instant('COMMON.Iqama'):

        this.selected_option = selected_option;

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "Date of Birth" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "تاريخ الميلاد")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].name == "Date of Birth"||
            this.PreliminaryRequestModalsForm.inputs[i].name == "تاريخ الميلاد"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        break;

      case  this.translate.instant('COMMON.GCC ID'):

        this.selected_option = selected_option;

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "idType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "idNumber"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        break;

      case "Yes":

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "proCapacity" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "proPercentage")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = this.PreliminaryRequestModalsForm.form_number;

        break;

      case "No":

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "proCapacity" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "proPercentage")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = this.PreliminaryRequestModalsForm.form_number == 1 ? 2 : 1;

        break;

      default:
        break;

    }
  }

  changeRadioOption(selected_radio) {
    switch (selected_radio) {

      case this.translate.instant('COMMON.Saudi National'):

        this.selected_radio = selected_radio;

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "nationalId" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "date")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "nationalId" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "date"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        if (this.PreliminaryRequestModalsForm.inputs[0].id == "proInd")
          this.PreliminaryRequestModalsForm.inputs[0].form_number = 1;

        if (this.PreliminaryRequestModalsForm.inputs[11].id == "proPercentage" &&
          this.PreliminaryRequestModalsForm.inputs[0].selected == "Yes")
          this.PreliminaryRequestModalsForm.inputs[11].form_number = 1;

        if (this.PreliminaryRequestModalsForm.inputs[0].id == "shareHolderType")
          this.selected_option = this.PreliminaryRequestModalsForm.inputs[0].selected;

        else if (this.PreliminaryRequestModalsForm.inputs[1].id == "shareHolderType")
          this.selected_option = this.PreliminaryRequestModalsForm.inputs[1].selected;

        break;

      case this.translate.instant('COMMON.Foreigner'):

        this.selected_radio = selected_radio;

        this.PreliminaryRequestModalsForm.form_number = 2;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "passportNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "passportExpiryDate" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

            // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||

            this.PreliminaryRequestModalsForm.inputs[i].id == "emailId")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "passportNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "passportExpiryDate" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "name" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "nationality" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "percentage" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "city" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "phoneNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "faxNo" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "street" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "zipCode" ||

            // this.PreliminaryRequestModalsForm.inputs[i].id == "financialStatementAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "RealEstateAttachment" ||
            // this.PreliminaryRequestModalsForm.inputs[i].id == "StockPortfolioAttachment" ||

            this.PreliminaryRequestModalsForm.inputs[i].id == "emailId"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        if (this.PreliminaryRequestModalsForm.inputs[0].id == "proInd")
          this.PreliminaryRequestModalsForm.inputs[0].form_number = 2;

        if (this.PreliminaryRequestModalsForm.inputs[11].id == "proPercentage" &&
          this.PreliminaryRequestModalsForm.inputs[0].selected == "Yes")
          this.PreliminaryRequestModalsForm.inputs[11].form_number = 2;

        break;

      case this.translate.instant('COMMON.Resident'):

        this.selected_radio = selected_radio;

        this.PreliminaryRequestModalsForm.form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "iqamaNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "date")
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 1;

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (!(this.PreliminaryRequestModalsForm.inputs[i].id == "shareHolderType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "investorType" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "iqamaNumber" ||
            this.PreliminaryRequestModalsForm.inputs[i].id == "date"))
            this.PreliminaryRequestModalsForm.inputs[i].form_number = 2;

        if (this.PreliminaryRequestModalsForm.inputs[0].id == "proInd")
          this.PreliminaryRequestModalsForm.inputs[0].form_number = 1;

        if (this.PreliminaryRequestModalsForm.inputs[11].id == "proPercentage" &&
          this.PreliminaryRequestModalsForm.inputs[0].selected == "Yes")
          this.PreliminaryRequestModalsForm.inputs[11].form_number = 1;

        if (this.PreliminaryRequestModalsForm.inputs[0].id == "shareHolderType")
          this.selected_option = this.PreliminaryRequestModalsForm.inputs[0].selected;

        else if (this.PreliminaryRequestModalsForm.inputs[1].id == "shareHolderType")
          this.selected_option = this.PreliminaryRequestModalsForm.inputs[1].selected;


        break;

      default:
        break;

    }

  }

  onFileChange(event, selected_id) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {

      format = this.files[i].name.split('.');

      format_length = format.length;

      if (this.files[i].size > this.commonService.documentSizeLimits.documentSize10MB) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.Thesizeofeachchosenfileshouldbeamaximumof10MB!'));
        event.target.value = '';

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id === selected_id) {

            this.PreliminaryRequestModalsForm.inputs[i].file = "";
            this.PreliminaryRequestModalsForm.inputs[i].validation_status = true;

          }

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('COMMON.FormatOfFile'));
        event.target.value = '';

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id === selected_id) {

            this.PreliminaryRequestModalsForm.inputs[i].file = "";
            this.PreliminaryRequestModalsForm.inputs[i].validation_status = true;

          }

        break;

      }

      else if (i === (this.files.length - 1)) {

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id === selected_id) {

            this.PreliminaryRequestModalsForm.inputs[i].file = this.files;
            this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

          }

      }

    }

  }

  onOpenHarmonizedCodePopUp(harmonized_code_pop_up, field) {
    if (field === "HSCode") {

      this.fieldForSearchInput = field;

      this.searchText = "";

      this.harmonized_code_pop_up_array = [];

      for (var i = 0; (i < this.harmonized_code_pop_up_original_array.length) && i < 100; i++)
        this.harmonized_code_pop_up_array.push(this.harmonized_code_pop_up_original_array[i]);

      let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
      delete options.size;
      this.HarmonizedCodePopUpReference = this.modalService.open(harmonized_code_pop_up, options);
    } else if (field === "mainActivity") {
      this.fieldForSearchInput = field;

      this.searchText = "";

      this.main_activity_pop_up_array = [];

      for (var i = 0; (i < this.main_activity_pop_up_original_array.length) && i < 100; i++)
        this.main_activity_pop_up_array.push(this.main_activity_pop_up_original_array[i]);

      let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
      delete options.size;
      this.HarmonizedCodePopUpReference = this.modalService.open(harmonized_code_pop_up, options);
    } else if (field === "subActivity") {
      if (this.PreliminaryRequestModalsForm.inputs[this.commonService.findIndexFromId(this.PreliminaryRequestModalsForm.inputs, "divisionName")].eventData && this.PreliminaryRequestModalsForm.inputs[this.commonService.findIndexFromId(this.PreliminaryRequestModalsForm.inputs, "divisionName")].eventData.id) {
        this.fieldForSearchInput = field;

        this.searchText = "";

        // this.sub_activity_pop_up_array = [];
        if (this.sub_activity_pop_up_array && this.sub_activity_pop_up_array.length === 0)
          for (var i = 0; (i < this.sub_activity_pop_up_original_array.length) && i < 100; i++)
            this.sub_activity_pop_up_array.push(this.sub_activity_pop_up_original_array[i]);

        for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
          if (this.PreliminaryRequestModalsForm.inputs[i].id == "divisionName") {
            var temp_division = this.PreliminaryRequestModalsForm.inputs[this.commonService.findIndexFromId(this.PreliminaryRequestModalsForm.inputs, "divisionName")].eventData.id;
            this.PreliminaryRequestModalsForm.inputs[i + 1].value = _.filter(this.sub_activity_pop_up_original_array, function (num) { return num.divisionId === temp_division });
            this.sub_activity_pop_up_array = this.PreliminaryRequestModalsForm.inputs[i + 1].value;

          }

        let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
        delete options.size;
        this.HarmonizedCodePopUpReference = this.modalService.open(harmonized_code_pop_up, options);
      } else {
        this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.ChooseMainActivity'));
      }
    }

  }

  onSearchHarmonizedCodePopUpItem(field) {

    if (field === "HSCode") {
      var temp_array = [];

      for (var i = 0; i < this.harmonized_code_pop_up_original_array.length; i++) {

        if (this.harmonized_code_pop_up_original_array[i].hsDespEn && this.harmonized_code_pop_up_original_array[i].hsCode)
          if (this.harmonized_code_pop_up_original_array[i].hsCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
            this.harmonized_code_pop_up_original_array[i].hsDespEn.toLowerCase().includes(this.searchText.toLowerCase()) ||
            this.harmonized_code_pop_up_original_array[i].hsDespAr.toLowerCase().includes(this.searchText.toLowerCase())
            )
            temp_array.push(this.harmonized_code_pop_up_original_array[i])

      }

      this.harmonized_code_pop_up_array = [];

      for (var i = 0; (i < temp_array.length) && i < 100; i++)
        this.harmonized_code_pop_up_array.push(temp_array[i]);
    } else if (field === "mainActivity") {
      var temp_array = [];

      for (var i = 0; i < this.main_activity_pop_up_original_array.length; i++) {

        if (this.main_activity_pop_up_original_array[i].divisionName && this.main_activity_pop_up_original_array[i].id)
          if (this.main_activity_pop_up_original_array[i].id.toLowerCase().includes(this.searchText.toLowerCase()) ||
          this.main_activity_pop_up_original_array[i].divisionNameAr.toLowerCase().includes(this.searchText.toLowerCase()) ||

            this.main_activity_pop_up_original_array[i].divisionName.toLowerCase().includes(this.searchText.toLowerCase()))
            temp_array.push(this.main_activity_pop_up_original_array[i])

      }
      this.main_activity_pop_up_array = [];

      for (var i = 0; (i < temp_array.length) && i < 100; i++)
        this.main_activity_pop_up_array.push(temp_array[i]);
    } else if (field === "subActivity") {
      var temp_array = [];
      var sub_activity_pop_up_original_array1 = [];
      var temp_division_id = this.PreliminaryRequestModalsForm.inputs[this.commonService.findIndexFromId(this.PreliminaryRequestModalsForm.inputs, "divisionName")].eventData.id;

      sub_activity_pop_up_original_array1 = _.filter(this.sub_activity_pop_up_original_array, function (num) { return num.divisionId === temp_division_id });

      for (var i = 0; i < sub_activity_pop_up_original_array1.length; i++) {

        if (sub_activity_pop_up_original_array1[i].activityName && sub_activity_pop_up_original_array1[i].activityId)
          if (sub_activity_pop_up_original_array1[i].activityId.toLowerCase().includes(this.searchText.toLowerCase()) ||
          sub_activity_pop_up_original_array1[i].activityNameAr.toLowerCase().includes(this.searchText.toLowerCase()) ||
            sub_activity_pop_up_original_array1[i].activityName.toLowerCase().includes(this.searchText.toLowerCase()))
            temp_array.push(sub_activity_pop_up_original_array1[i])

      }

      this.sub_activity_pop_up_array = [];

      for (var i = 0; (i < temp_array.length) && i < 100; i++)
        this.sub_activity_pop_up_array.push(temp_array[i]);

    }
  }

  onResetHarmonizedCodePopUpSearch(field) {

    if (field === "HSCode") {
      this.searchText = "";

      this.harmonized_code_pop_up_array = [];

      for (var i = 0; (i < this.harmonized_code_pop_up_original_array.length) && i < 100; i++)
        this.harmonized_code_pop_up_array.push(this.harmonized_code_pop_up_original_array[i]);
    } else if (field === "mainActivity") {
      this.searchText = "";

      this.main_activity_pop_up_array = [];

      for (var i = 0; (i < this.main_activity_pop_up_original_array.length) && i < 100; i++)
        this.main_activity_pop_up_array.push(this.main_activity_pop_up_original_array[i]);
    } else if (field === "subActivity") {
      this.searchText = "";

      this.sub_activity_pop_up_array = [];

      for (var i = 0; (i < this.sub_activity_pop_up_original_array.length) && i < 100; i++)
        this.sub_activity_pop_up_array.push(this.sub_activity_pop_up_original_array[i]);
    }

  }

  onClickHarmonizedCodePopUpItem(harmonized_code_item, field) {
    if (field === "HSCode") {
      for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
        if (this.PreliminaryRequestModalsForm.inputs[i].id == "hsCode") {

          this.PreliminaryRequestModalsForm.inputs[i].selected = harmonized_code_item.hsCode + " - " + this.commonService.defaultLanguage === 'en'? harmonized_code_item.hsDespEn: harmonized_code_item.hsDespAr;
          this.PreliminaryRequestModalsForm.inputs[i].selectedId = harmonized_code_item.hsCode;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

        }
      // else if (this.PreliminaryRequestModalsForm.inputs[i].id == "productName")
      //   if (this.PreliminaryRequestModalsForm.inputs[i].value == "" || this.PreliminaryRequestModalsForm.inputs[i].product_type == "proposed") {

      //     this.PreliminaryRequestModalsForm.inputs[i].value = harmonized_code_item.hsDespEn;

      this.HarmonizedCodePopUpReference.close();
      
    $(document.body).toggleClass("modal-open");
    } else if (field === "mainActivity") {
      for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
        if (this.PreliminaryRequestModalsForm.inputs[i].id == "divisionName") {

          this.PreliminaryRequestModalsForm.inputs[i].selected = this.commonService.defaultLanguage === 'en'? harmonized_code_item.divisionName: harmonized_code_item.divisionNameAr;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;
          this.PreliminaryRequestModalsForm.inputs[i].eventData = { divisionName: this.commonService.defaultLanguage === 'en'?harmonized_code_item.divisionName:harmonized_code_item.divisionNameAr, id: harmonized_code_item.id };

          this.PreliminaryRequestModalsForm.inputs[i + 1].selected = "";
          this.PreliminaryRequestModalsForm.inputs[i + 1].value = _.filter(this.sub_activity_pop_up_original_array, function (num) { return num.divisionId === harmonized_code_item.id });
          this.sub_activity_pop_up_array = this.PreliminaryRequestModalsForm.inputs[i + 1].value;

        }

      this.HarmonizedCodePopUpReference.close();
      
    $(document.body).toggleClass("modal-open");
    } else if (field === "subActivity") {
      for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
        if (this.PreliminaryRequestModalsForm.inputs[i].id == "activityName") {

          this.PreliminaryRequestModalsForm.inputs[i].selected = this.commonService.defaultLanguage === 'en'?harmonized_code_item.activityName:harmonized_code_item.activityNameAr;
          this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

        }

      this.HarmonizedCodePopUpReference.close();
      
    $(document.body).toggleClass("modal-open");
    }
  }

  onCloseHarmonizedCodePopUp() {

    this.HarmonizedCodePopUpReference.close();
    
    $(document.body).toggleClass("modal-open");

  }

  onInputChange(id) {

    for (var i = 0; i < this.PreliminaryRequestModalsForm.inputs.length; i++)
      if (this.PreliminaryRequestModalsForm.inputs[i].id == id)
        this.PreliminaryRequestModalsForm.inputs[i].validation_status = false;

  }

  closeModal() {
  

    this.activeModal.close();
    
  }

  checkGregDate(dateArray) {

    var gregDate = new Date(dateArray.year, dateArray.month - 1, dateArray.day);

    var today = new Date();

    if (today >= gregDate)
      return true;

    else
      return false;

  }

  resolveError() {

    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));
    this.spinnerService.hide();

  }

}