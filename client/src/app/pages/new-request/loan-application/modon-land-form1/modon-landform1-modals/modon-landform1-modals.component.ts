import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from "../../../../../services/common.service";
import { DocumentListComponent } from '../../../../../components/document-list/document-list.component';
import { CustomerProfileService } from "../../../../../services/customer-profile.service";
import { ProjInfoService } from '../../../../../services/project-information.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
//import { ProjectOwnershipGuarantorsModalsComponent } from '../project-ownership-guarantors-modals/project-ownership-guarantors-modals.component';

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
  selector: 'modon-landform1-modals',
  templateUrl: './modon-landform1-modals.component.html',
  styleUrls: ['./modon-landform1-modals.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class ModalLandForm1ModalsComponent implements OnInit {

  guaranteeType = false;

  modonaldnformModalsForm: any = {};

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  translate: any;

  constructor(public commonService: CommonService, private activeModal: NgbActiveModal, private calendar: NgbCalendar,
    private customerProfileService: CustomerProfileService, private projInfoService: ProjInfoService,
    private spinnerService: Ng4LoadingSpinnerService, private modalService: NgbModal) {

    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 100, month: 12, day: 31 };

    this.translate = this.commonService.returnTranslate();

  }

  files: any = [];

  CofinsType_list = [];

  CofinsType_Desc_list = [];

  country_list = [];

  country_name_list = [];

  position_list = [];

  position_desc_list = [];

  ExtidType_list = [];

  ExtidType_Desc_list = [];

  @ViewChild('identifier') identifier: DocumentListComponent;

  ngOnInit() {

    for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++) {

      this.modonaldnformModalsForm.inputs[i]["validation_status"] = false;

      if (this.modonaldnformModalsForm.inputs[i].id == "Type" &&
        ((this.modonaldnformModalsForm.inputs[i].selected &&
          this.modonaldnformModalsForm.inputs[i].selected == "Corporate") ||
          (this.modonaldnformModalsForm.inputs[i].value &&
            this.modonaldnformModalsForm.inputs[i].value == "Corporate")))
        this.guaranteeType = true;

    }

    if (this.customerProfileService.loanDropdowns.Country) {

      this.country_list = this.customerProfileService.loanDropdowns.Country;

      for (var i = 0; i < this.country_list.length; i++)
        this.country_name_list.push(this.country_list[i].Name);

    }

    if (this.customerProfileService.loanDropdowns.ExtidType) {

      this.ExtidType_list = this.customerProfileService.loanDropdowns.ExtidType;

      for (var i = 0; i < this.ExtidType_list.length; i++)
        this.ExtidType_Desc_list.push(this.ExtidType_list[i].Desc);

    }

    if (this.customerProfileService.loanDropdowns.GuarPosition) {

      this.position_list = this.customerProfileService.loanDropdowns.GuarPosition;

      for (var i = 0; i < this.position_list.length; i++)
        this.position_desc_list.push(this.position_list[i].Desc);

    }

    if (this.customerProfileService.loanDropdowns.GuarType) {

      this.CofinsType_list = this.customerProfileService.loanDropdowns.GuarType;

      for (var i = 0; i < this.CofinsType_list.length; i++)
        this.CofinsType_Desc_list.push(this.CofinsType_list[i].Desc);

    }

  }

  onSubmit() {
    console.log('papa');
console.log(this.modonaldnformModalsForm.inputs)
    if (this.modonaldnformModalsForm.buttons[0].name === this.translate.instant('COMMON.Next')) {

      if (this.modonaldnformModalsForm.inputs[0].value != "") {

        this.spinnerService.show();

        var check_ExternalId_post_data = {

          "Origin": "CP",
          "CustomerId": "",
          "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
          "IdNo": this.modonaldnformModalsForm.inputs[0].value,
          "_cpmment": "Id type can be C or N",
          "IdType": "X",
          "Dob": ""

        };

        this.projInfoService
          .checkExternalId(check_ExternalId_post_data)
          .then((res) => (this.resolveCheckExternalId(res)), err => this.resolveError());

      }

      else {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EnterIdNumber'));
        this.modonaldnformModalsForm.inputs[0].validation_status = true;

      }

    }

    else {

      var flag = 0;

      // var flagged_name = "", flagged_type = "";

      var flagged_id = 0;

      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++) {

        this.modonaldnformModalsForm.inputs[i].validation_status = false;

        if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          this.modonaldnformModalsForm.inputs[i].type == "file_single" && this.modonaldnformModalsForm.inputs[i].required === "true" && ((!this.modonaldnformModalsForm.documents && this.files.length == 0) || (this.modonaldnformModalsForm.documents && this.modonaldnformModalsForm.documents.documentList.length == 0 && this.files.length == 0))) {

          flag = 1;
          this.modonaldnformModalsForm.inputs[i].validation_status = true;

        }

        if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          this.modonaldnformModalsForm.inputs[i].type != "file_single" &&
          this.modonaldnformModalsForm.inputs[i].required === "true" &&
          this.modonaldnformModalsForm.inputs[i].type != "select" &&
          this.modonaldnformModalsForm.inputs[i].type != "cc_select" &&
          (this.modonaldnformModalsForm.inputs[i].value === "" ||
            this.modonaldnformModalsForm.inputs[i].value === "NaN" ||
            this.modonaldnformModalsForm.inputs[i].value === null ||
            !this.modonaldnformModalsForm.inputs[i].value)) {

          flag = 1;
          this.modonaldnformModalsForm.inputs[i].validation_status = true;
          // flagged_name = this.modonaldnformModalsForm.inputs[i].name;
          // flagged_type = this.modonaldnformModalsForm.inputs[i].type;

        }

        if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          this.modonaldnformModalsForm.inputs[i].type != "file_single" &&
          this.modonaldnformModalsForm.inputs[i].required === "true" &&
          (this.modonaldnformModalsForm.inputs[i].type === "select" ||
            this.modonaldnformModalsForm.inputs[i].type === "cc_select") &&
          (this.modonaldnformModalsForm.inputs[i].selected === "" ||
            this.modonaldnformModalsForm.inputs[i].selected === null ||
            !this.modonaldnformModalsForm.inputs[i].selected)) {

          flag = 1;
          this.modonaldnformModalsForm.inputs[i].validation_status = true;
          // flagged_name = this.modonaldnformModalsForm.inputs[i].name;
          // flagged_type = this.modonaldnformModalsForm.inputs[i].type;

        }

        else if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          flag != 1 && this.modonaldnformModalsForm.inputs[i].required === "true" && this.modonaldnformModalsForm.inputs[i].type === "email" && !emailRegex.test(this.modonaldnformModalsForm.inputs[i].value ? this.modonaldnformModalsForm.inputs[i].value.toLowerCase() : "")) {

          flag = 2;
          flagged_id = i;

        }

        else if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          flag != 1 && this.modonaldnformModalsForm.inputs[i].id === "Percent" && this.modonaldnformModalsForm.inputs[i].value > 100) {

          flag = 3;
          flagged_id = i;

        }

        else if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          flag != 1 && this.modonaldnformModalsForm.inputs[i].id === "SharePercentage" && this.modonaldnformModalsForm.inputs[i].value > 100) {

          flag = 4;
          flagged_id = i;

        }

        else if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          flag != 1 && this.modonaldnformModalsForm.inputs[i].id === "PurchaseDate" &&
          this.checkGregDate(this.commonService.returnDateArrayFromGregDateString(this.modonaldnformModalsForm.inputs[i].value))) {

          flag = 5;
          flagged_id = i;

        }

        else if ((!this.modonaldnformModalsForm.form_number || !this.modonaldnformModalsForm.inputs[i].form_number || (this.modonaldnformModalsForm.form_number && this.modonaldnformModalsForm.inputs[i].form_number && this.modonaldnformModalsForm.inputs[i].form_number === this.modonaldnformModalsForm.form_number)) &&
          flag != 1 && this.modonaldnformModalsForm.inputs[i].id === "MarketDate" &&
          this.checkGregDate(this.commonService.returnDateArrayFromGregDateString(this.modonaldnformModalsForm.inputs[i].value))) {

          flag = 6;
          flagged_id = i;

        }

        else if (flag != 1 && this.modonaldnformModalsForm.total_guar_percent && this.modonaldnformModalsForm.inputs[i].id === "Percent") {

          var total_guar_percent = this.modonaldnformModalsForm.total_guar_percent + parseFloat(this.modonaldnformModalsForm.inputs[i].value);

          if (total_guar_percent > 100) {

            flag = 7;
            flagged_id = i;

          }

        }

      }

      if (flag == 0) {

        this.modonaldnformModalsForm.buttons[0].handler(this.modonaldnformModalsForm);

        if (!this.modonaldnformModalsForm.api)
          this.activeModal.close();

      }

      else if (flag == 1) {

        // if (flagged_type == "select")
        //   this.commonService.showFailureToast("Select the " + flagged_name + " !");

        // else
        //   this.commonService.showFailureToast("Enter the " + flagged_name + " !");

        this.commonService.showFailureToast(this.translate.instant('COMMON.EnterAllMandatoryFields'));

      }

      else if (flag == 2) {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.EnterValidEmail'));

        this.modonaldnformModalsForm.inputs[flagged_id].validation_status = true;

      }

      else if (flag == 3) {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.GuaranteePercentage100'));

        this.modonaldnformModalsForm.inputs[flagged_id].validation_status = true;

      }

      else if (flag == 4) {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.ShareholdingPercentage100'));

        this.modonaldnformModalsForm.inputs[flagged_id].validation_status = true;

      }

      else if (flag == 5) {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.PurchaseDateNotFuture'));

        this.modonaldnformModalsForm.inputs[flagged_id].validation_status = true;

      }

      else if (flag == 6) {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.MarketValuationDateNoFuture'));

        this.modonaldnformModalsForm.inputs[flagged_id].validation_status = true;

      }

      else if (flag == 7) {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.GuaranteePercentageOfGuarantors1') + total_guar_percent + this.translate.instant('PROJECT_INFORMATION.GuaranteePercentageOfGuarantors2'));

        this.modonaldnformModalsForm.inputs[flagged_id].validation_status = true;

      }

      // else if (flag == 3)
      //   this.commonService.showFailureToast("Choose an Attachment !");

    }

  }

  resolveCheckExternalId(result) {

    if (result.MessType == "E") {

      if (result.Status && result.Status[0].BP == "null") {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.BPNotFound'));

        this.spinnerService.hide();

        let projectOwnershipGuarantorsModalParams = {

          header: this.translate.instant('PROJECT_INFORMATION.AddBusinessPartner'),

          filter: false,

          inputs: [

            {
              id: "Externalid",
              name: this.translate.instant('PROJECT_INFORMATION.IDNumber'),
              type: "text_disabled",
              value: this.modonaldnformModalsForm.inputs[0].value,
              required: "true",
            },
            {
              id: "Extidtype",
              name: this.translate.instant('PROJECT_INFORMATION.IDType'),
              type: "select",
              value: this.ExtidType_Desc_list,
              dropdown: this.ExtidType_list,
              selected: "",
              required: "true",
            },
            {
              id: "Firstname",
              name: this.translate.instant('PROJECT_INFORMATION.FirstName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Lastname",
              name: this.translate.instant('PROJECT_INFORMATION.LastName'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Street",
              name: this.translate.instant('PROJECT_INFORMATION.Street'),
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
              id: "City",
              name: this.translate.instant('PROJECT_INFORMATION.City'),
              type: "text",
              value: "",
              required: "true",
            },
            {
              id: "Country",
              name: this.translate.instant('PROJECT_INFORMATION.Country'),
              type: "select",
              value: this.country_name_list,
              dropdown: this.country_list,
              selected: "",
              required: "true",
            },
            {
              id: "Zip",
              name: this.translate.instant('PROJECT_INFORMATION.PostalCode'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "Phone1",
              name: this.translate.instant('PROJECT_INFORMATION.PhoneNumber'),
              type: "number",
              value: "",
              required: "true",
            },
            {
              id: "Fax",
              name: this.translate.instant('PROJECT_INFORMATION.FaxNumber'),
              type: "number",
              value: "",
            },
            {
              id: "Mail",
              name: this.translate.instant('PROJECT_INFORMATION.EmailID'),
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

                this.modonaldnformModalsForm.inputs[0].value = modal_data.inputs[0].value;

                this.modonaldnformModalsForm.inputs[0].type = "text_disabled";

                this.modonaldnformModalsForm.inputs[1].form_number = 1;

                this.modonaldnformModalsForm.inputs[2].form_number = 1;

                this.modonaldnformModalsForm.inputs[3].form_number = 1;

                this.modonaldnformModalsForm.inputs[4].form_number = 1;

                this.modonaldnformModalsForm.buttons[0].name = this.translate.instant('COMMON.Save');

              }

            }
          ]
        };

      //  let modalReference = this.modalService.open(ProjectOwnershipGuarantorsModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
       // modalReference.componentInstance.projectOwnershipGuarantorsModalsForm = projectOwnershipGuarantorsModalParams;

      }

      else {

        this.commonService.showFailureToast(result.MessText);
        this.spinnerService.hide();

      }

    }

    else {

      this.modonaldnformModalsForm.inputs[1].form_number = 1;

      this.modonaldnformModalsForm.inputs[2].form_number = 1;

      this.modonaldnformModalsForm.inputs[3].form_number = 1;

      this.modonaldnformModalsForm.inputs[4].form_number = 1;

      this.modonaldnformModalsForm.buttons[0].name = this.translate.instant('COMMON.Save');

      this.commonService.showSuccessToast(this.translate.instant('PROJECT_INFORMATION.BPFoundEnterRemaining'));

      this.spinnerService.hide();

    }

  }

  checkGregDate(dateArray) {

    var gregDate = new Date(dateArray.year, dateArray.month - 1, dateArray.day);

    var today = new Date();

    if (today < gregDate)
      return true;

    else
      return false;

  }

  onInputChange(id) {

    for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++)
      if (this.modonaldnformModalsForm.inputs[i].id == id) {

        this.modonaldnformModalsForm.inputs[i].validation_status = false;

        if (id == "Quantity") {

          var product = 1;

          product *= +this.modonaldnformModalsForm.inputs[i].value;
          product *= +this.modonaldnformModalsForm.inputs[i + 1].value;

          this.modonaldnformModalsForm.inputs[i + 2].value = product;

        }

      }

  }

  onSelectChange(id, selected_option) {

    for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++)
      if (this.modonaldnformModalsForm.inputs[i].id == id) {

        this.modonaldnformModalsForm.inputs[i].validation_status = false;

        if (id == "InvestmentType") {

          if (selected_option == this.translate.instant('COMMON.Stock Options')) {

            this.modonaldnformModalsForm.inputs[3].form_number = 2;

            this.modonaldnformModalsForm.inputs[4].form_number = 1;
            this.modonaldnformModalsForm.inputs[5].form_number = 1;
            this.modonaldnformModalsForm.inputs[6].form_number = 1;

          }

          else if (selected_option == this.translate.instant('COMMON.Others')) {

            this.modonaldnformModalsForm.inputs[3].form_number = 1;

            this.modonaldnformModalsForm.inputs[4].form_number = 2;
            this.modonaldnformModalsForm.inputs[5].form_number = 2;
            this.modonaldnformModalsForm.inputs[6].form_number = 2;

          }

        }

        else if (id = "Type") {

          if (this.modonaldnformModalsForm.inputs[i].selected == "Corporate")
            this.guaranteeType = true;

          else
            this.guaranteeType = false;

        }

      }

  }

  onFileChange(event, selected_id) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {

      format = this.files[i].name.split('.');

      format_length = format.length;

      if (this.files[i].size > 5242880) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.SizeOfFile'));
        event.target.value = '';

        for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++)
          if (this.modonaldnformModalsForm.inputs[i].id == selected_id) {

            this.modonaldnformModalsForm.inputs[i].file = "";
            this.modonaldnformModalsForm.inputs[i].validation_status = true;

          }

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('PROJECT_INFORMATION.FormatOfFile'));
        event.target.value = '';

        for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++)
          if (this.modonaldnformModalsForm.inputs[i].id == selected_id) {

            this.modonaldnformModalsForm.inputs[i].file = "";
            this.modonaldnformModalsForm.inputs[i].validation_status = true;

          }

        break;

      }

      else if (i === (this.files.length - 1)) {

        for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++)
          if (this.modonaldnformModalsForm.inputs[i].id == selected_id) {

            this.modonaldnformModalsForm.inputs[i].file = this.files;
            this.modonaldnformModalsForm.inputs[i].validation_status = false;

          }

      }

    }

  }
 
  changeCountryCitySelectOption(selected_option, city, selected_id) {

    for (var i = 0; i < this.modonaldnformModalsForm.inputs.length; i++)
      if (this.modonaldnformModalsForm.inputs[i].id == selected_id)
        this.modonaldnformModalsForm.inputs[i].validation_status = false;

    var temp_key = "";
    var temp_array = [];

    if (this.modonaldnformModalsForm.inputs[4].id == "Country") {

      for (var i = 0; i < this.modonaldnformModalsForm.inputs[4].dropdown.length; i++)
        if ((this.modonaldnformModalsForm.inputs[4].dropdown[i].Name &&
          this.modonaldnformModalsForm.inputs[4].dropdown[i].Name === selected_option) ||
          (this.modonaldnformModalsForm.inputs[4].dropdown[i].nameEn &&
            this.modonaldnformModalsForm.inputs[4].dropdown[i].nameEn === selected_option) ||
            (this.modonaldnformModalsForm.inputs[4].dropdown[i].nameAr &&
              this.modonaldnformModalsForm.inputs[4].dropdown[i].nameAr === selected_option) ||
              (this.modonaldnformModalsForm.inputs[4].dropdown[i].DescAr &&
                this.modonaldnformModalsForm.inputs[4].dropdown[i].DescAr === selected_option)
              
              )
              
          temp_key = this.modonaldnformModalsForm.inputs[4].dropdown[i].Code ?
            this.modonaldnformModalsForm.inputs[4].dropdown[i].Code :
            this.modonaldnformModalsForm.inputs[4].dropdown[i].countryKey ?
              this.modonaldnformModalsForm.inputs[4].dropdown[i].countryKey : "";

      for (var i = 0; i < this.modonaldnformModalsForm.inputs[5].dropdown.length; i++)
        if ((this.modonaldnformModalsForm.inputs[5].dropdown[i].Country &&
          this.modonaldnformModalsForm.inputs[5].dropdown[i].Country === temp_key) ||
          (this.modonaldnformModalsForm.inputs[5].dropdown[i].countryKey &&
            this.modonaldnformModalsForm.inputs[5].dropdown[i].countryKey == temp_key)){
              if(this.commonService.defaultLanguage === 'en')
              temp_array.push(this.modonaldnformModalsForm.inputs[5].dropdown[i].City ?
            this.modonaldnformModalsForm.inputs[5].dropdown[i].City :
            this.modonaldnformModalsForm.inputs[5].dropdown[i].cityNameEn ?
              this.modonaldnformModalsForm.inputs[5].dropdown[i].cityNameEn : "");
              else
              temp_array.push(this.modonaldnformModalsForm.inputs[5].dropdown[i].City ?
                this.modonaldnformModalsForm.inputs[5].dropdown[i].City :
                this.modonaldnformModalsForm.inputs[5].dropdown[i].cityNameAr ?
                  this.modonaldnformModalsForm.inputs[5].dropdown[i].cityNameAr : this.modonaldnformModalsForm.inputs[5].dropdown[i].DescAr);
          }

      this.modonaldnformModalsForm.inputs[5].value = temp_array;

      this.modonaldnformModalsForm.inputs[5].selected = city;

    }

  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
      return false;

    return true;

  }

  onngmodelchange(input, modonaldnformModalsForm) {

    input.value = input.value.replace("SAR", "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');

    input.value = input.value == "" ? "" : parseFloat(input.value).toFixed(4);

    for (var i = 0; i < modonaldnformModalsForm.inputs.length; i++)
      if (input.id === modonaldnformModalsForm.inputs[i].id) {

        modonaldnformModalsForm.inputs[i].value = input.value;

        var product = 1;

        if (input.id == "MarketPrice") {

          product *= +this.modonaldnformModalsForm.inputs[i].value;
          product *= +this.modonaldnformModalsForm.inputs[i - 1].value;

          this.modonaldnformModalsForm.inputs[i + 1].value = product;

        }

      }

  }

  closeModal() {
    this.activeModal.close();
  }

  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

}