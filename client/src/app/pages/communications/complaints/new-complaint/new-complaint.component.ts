import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AuthenticateService } from "../../../../services/authenticate.service";
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonService } from './../../../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { _ } from 'underscore';
import * as _l from 'lodash'; 
import { CommunicationsService } from "../../../../services/communications.service";
import { FinancialInformationModalsComponent } from '../../../new-request/loan-application/financial-information/financial-information-modals/financial-information-modals.component';

@Component({
  selector: 'new-complaint',
  templateUrl: './new-complaint.component.html',
  styleUrls: ['./new-complaint.component.scss']
})

export class NewComplaintComponent implements OnInit {

  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  reason_visible = true;
  next1 = false;

  // msgpurpose_list = "Complaints|Enquiry|Suggestions".split("|");
  msgpurpose_list: any = [];
  msgpurpose = "";
  msgPurposeSelected = "";

  // reason_list = "Select Message Purpose".split("|");
  reason_list_master: any = [];
  reason_list: any = [];
  reason = "";
  reasonOptionSelected = "";

  username: any;
  complaintFinalResponse: any = {};

  cancelModalReference: any;

  is_msgPurposeSelected: boolean = false;
  is_reasonOptionSelected: boolean = false;
  is_mobnumber_valid: boolean = false;
  is_telnumber_valid: boolean = false;

  dataFromLocStor: any = {}

  translate: any;

  complaintForm = new FormGroup({
    inputName: new FormControl('', Validators.required),
    inputmobcode: new FormControl('00966', Validators.required),
    inputmobile: new FormControl('', Validators.required),
    inputtelcode: new FormControl('00966'),
    inputtelephone: new FormControl(''),
    inputFactoryName: new FormControl(''),
    msgPurposeSelected: new FormControl(''),
    reasonOptionSelected: new FormControl(''),
    inputEmail: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    inputSubject: new FormControl('', Validators.required),
    inputmessage: new FormControl('', Validators.required)
  });
  countryList: any;
  selectedmobcode = '00966';
  selectedtelcode = '00966';

  activity_datalog: any = {};
  type_datalog: any = {};

  constructor(private modalService: NgbModal, public commonService: CommonService,
    private route: ActivatedRoute, private authenticateService: AuthenticateService,
    private router: Router, private customerProfileService: CustomerProfileService,
    private spinnerService: Ng4LoadingSpinnerService, protected localStorage: LocalStorage,
    private CommunicationsService: CommunicationsService) { 
      
   // this.activity_datalog = this.commonService.dataLogKey.MyCases;
   // this.type_datalog = this.commonService.dataLogKey.Type;
    }

  ngOnInit() {


    this.translate = this.commonService.returnTranslate();

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        var username = params['username'];
        if (username != '')
          username = this.customerProfileService.getDecryptString(username);
        this.username = username;
        // console.log(this.username);
      });

    this.getDataFromService();
    this.setUserData();

    if (this.commonService.defaultLanguage === 'en') {
      // this.msgpurpose_list = "Complaints|Enquiry|Suggestions".split("|");
      // this.reason_list = "Select Message Purpose".split("|");
    } else {
      // this.msgpurpose_list = "شكاوي|تحقيق|اقتراحات".split("|");
      // this.reason_list = "Select Message Purpose".split("|");
      // this.msgpurpose_list = "Complaints|Enquiry|Suggestions".split("|");
      // this.reason_list = "Select Message Purpose".split("|");
    }

  //  this.commonService.userDataLogging(this.activity_datalog.MYCASES_CREATE, this.type_datalog.START, {});

  }

  setUserData() {

    console.log('setUserData');

    this.localStorage.getItem('custDetails').subscribe((data) => {
      // alert(data); // null
      // console.log(data);
      this.dataFromLocStor = data;
      var phone = data.Phone.replace('+966', '');
      this.complaintForm.controls['inputName'].setValue(data.Name);
      this.complaintForm.controls['inputEmail'].setValue(data.Email);
      this.complaintForm.controls['inputmobile'].setValue(phone);

      this.complaintForm.controls['inputmobcode'].setValue('00966');

      // selectedmobcode = '00966';
      // selectedtelcode = '00966';

    });

    // if(this.customerProfileService.selectedCustomerDetails){
    // if(this.customerProfileService.selectedCustomerDetails['Name'] != undefined)
    // this.complaintForm.controls['inputName'].setValue(this.customerProfileService.selectedCustomerDetails['Name']);
    // if(this.customerProfileService.selectedCustomerDetails['Email'] != undefined)
    // this.complaintForm.controls['inputEmail'].setValue(this.customerProfileService.selectedCustomerDetails['Email']);
    // if(this.customerProfileService.selectedCustomerDetails['Phone'] != undefined)
    // this.complaintForm.controls['inputmobile'].setValue(this.customerProfileService.selectedCustomerDetails['Phone']);
    // }
  }

  get complaintData() {
    return this.complaintForm.controls;
  }

  onMessagePurposeSelect() {

    this.reasonOptionSelected = "";

    this.is_msgPurposeSelected = false;
    // if (this.commonService.defaultLanguage === 'en') {
    //ENGLISH
    // if (this.msgPurposeSelected === "Z2") {
    //   this.reason_visible = true;
    //   this.reason_list = "|Loan General|Loan-Disbursement|Loan-Collections|Non-borrowing certificate|Technical|HR|New Product|General Complaints|Anti-Corruption".split("|");
    //   this.reason_list = _l.filter(this.reason_list_master, function(num) { return num.PurpId == this.msgPurposeSelected})
    // }
    // else if (this.msgPurposeSelected === "Z1") {

    //   this.reason_visible = true;
    //   this.reason_list = "|Non-borrowing certificate|Loan Eligibility|Loan Process|Career Enquiry|New Product|General".split("|");

    // }
    // else if (this.msgPurposeSelected === "Z3") {

    //   this.reason_visible = true;
    //   this.reason_list = "|Loan|Non-Borrowing certificates|New Product|Other".split("|");

    // }
    if (this.msgPurposeSelected) {

      this.reason_visible = true;
      let that = this;
      this.reason_list = _l.filter(this.reason_list_master, function (num) { return num.PurpId == that.msgPurposeSelected })

    }
    else {

      this.reason_visible = false;

    }
    // }
    // else {
    //ARABIC
    //   if (this.msgPurposeSelected === "اقتراحات" || this.msgPurposeSelected === "Complaints") { //complaints
    //     this.reason_visible = true;
    //     this.reason_list = "|Loan General|Loan-Disbursement|Loan-Collections|Non-borrowing certificate|Technical|HR|New Product|General Complaints|Anti-Corruption".split("|");
    //     // this.reason_list = "|القرض العام|صرف قرض|تحصيلات القروض|شهادة عدم اقتراض|تقني|الموارد البشرية|منتج جديد|الشكاوى العامة|مكافحة الفساد".split("|");

    //   }
    //   else if (this.msgPurposeSelected === "تحقيق" || this.msgPurposeSelected === "Enquiry") { //enquiry

    //     this.reason_visible = true;
    //     this.reason_list = "|Non-borrowing certificate|Loan Eligibility|Loan Process|Career Enquiry|New Product|General".split("|");
    //     // this.reason_list = "|شهادة عدم اقتراض|أهلية القرض|عملية القرض|الاستفسار الوظيفي|منتج جديد|جنرال لواء".split("|");

    //   }
    //   else if (this.msgPurposeSelected === "شكاوي" || this.msgPurposeSelected === "Suggestions") { //suggestions

    //     this.reason_visible = true;
    //     this.reason_list = "|Loan|Non-Borrowing certificates|New Product|Other".split("|");
    //     // this.reason_list = "|قرض|شهادة عدم اقتراض|منتج جديد|آخر".split("|");

    //   }
    //   else {

    //     this.reason_visible = false;

    //   }
    // }

  }

  onreasonOptionSelect() {
    this.is_reasonOptionSelected = false;
  }

  onSend() {

    this.next1 = true;

    // console.log(this.complaintForm);
    // console.log(this.msgPurposeSelected);

    if (this.complaintForm.invalid) {

      if (this.msgPurposeSelected.trim() === '')
        this.is_msgPurposeSelected = true;

      if (this.reasonOptionSelected.trim() === '')
        this.is_reasonOptionSelected = true;

      this.commonService.showFailureToast(this.translate.instant('CONTACTUS.emsgPleasefillallthemandatoryfields'));
      return true;
    }

    else if (this.msgPurposeSelected.trim() === '') {
      this.is_msgPurposeSelected = true;
      this.commonService.showFailureToast("Select the Message Purpose !");
      return true;
    }

    else if (this.reasonOptionSelected.trim() === '') {
      this.is_reasonOptionSelected = true;
      this.commonService.showFailureToast("Select the Reason !");
      return true;
    }

    else if (!this.validateMobNo()) {
      this.is_mobnumber_valid = true;
      this.commonService.showFailureToast(this.translate.instant('CONTACTUS.Pleaseentervalidmobilenumber'));
    }

    else if (this.complaintForm.value.inputtelephone && this.complaintForm.value.inputtelcode && 
      !this.commonService.validMobTelNoOnCount('Tel', this.complaintForm.value.inputtelephone, this.complaintForm.value.inputtelcode)) {
      this.is_telnumber_valid = true;
      this.commonService.showFailureToast(this.translate.instant('CONTACTUS.Pleaseentervalidtelephonenumber'));
    }

    else {

      var finalData = {

        "Id": this.username,
        "Name": this.complaintForm.value.inputName,
        "MobNum": this.complaintForm.value.inputmobcode + this.complaintForm.value.inputmobile,
        "TelNum": this.complaintForm.value.inputtelcode + this.complaintForm.value.inputtelephone,
        "FactoryName": this.complaintForm.value.inputFactoryName,
        "EmailId": this.complaintForm.value.inputEmail,
        "Subject": this.complaintForm.value.inputSubject,
        "MessText": this.complaintForm.value.inputmessage,
        "MessPurpose": this.msgPurposeSelected,
        "MessPurpose2": this.reasonOptionSelected,
        "ResType": "",
        "ResText": "",
        "ProfileId": this.customerProfileService.currentCustomerProfile.customerProfileId,
        "BpId": this.customerProfileService.currentCustomerProfile.bpId
      }

      let data = finalData;

      if (finalData) {
        this.spinnerService.show();
        this.authenticateService.submitContactUs(data).then(res => {
          this.complaintFinalResponse = res;
          if (this.complaintFinalResponse.ResType == '2') {

            this.commonService.showSuccessToast(this.commonService.returnTextBasedOnLangIfExist(this.complaintFinalResponse,'ResText','ResTextAr'));
            this.complaintForm.reset();
            this.spinnerService.hide()
            this.next1 = false;
            this.router.navigateByUrl('pages/communications/complaints');

           // this.commonService.userDataLogging(this.activity_datalog.MYCASES_CREATE_SUBMIT, this.type_datalog.CLICK, {});
          }
          else {
            this.spinnerService.hide()
            this.commonService.showFailureToast(this.commonService.returnTextBasedOnLangIfExist(this.complaintFinalResponse,'ResText','ResTextAr'));
          }

        });
      }

      //console.log(JSON.stringify(finalData));

    }

  }

  onCancel(cancel_modal) {
    let options = JSON.parse(JSON.stringify(this.commonService.modalOptions));
    delete options.size;
    this.cancelModalReference = this.modalService.open(cancel_modal, options);

  }

  onCancelConfirm() {

    this.router.navigateByUrl('pages/communications/complaints');

    //this.commonService.userDataLogging(this.activity_datalog.MYCASES_CREATE_CANCEL, this.type_datalog.CLICK, {});

    this.cancelModalReference.close();

  }

  onCloseCancelModal() {

    this.cancelModalReference.close();

  }


  getCountryList() {
    this.authenticateService
      .signUpCountryList()
      .then((countryList: any) => (this.countryList = countryList.Countries));

  }

  sortCountryKey(list) {
    var formatted = _.each(list, function (num) {
      return num.CountryKey = parseInt(num.CountryKey);
    });

    var sorted = _l.sortBy(formatted, 'CountryKey');
    var uniqueCodes = _l.uniq(sorted, 'CountryKey');

    var that = this;
    var finalList = _.each(uniqueCodes, function (num) {
      return num.CountryKey = that.getNumberWithLeadZero(num.CountryKey);
    });

    return finalList;
  }

  getNumberWithLeadZero(num) {
    var s = String(num);
    while (s.length < (5 || 4)) { s = "0" + s; }
    return s;
  }

  getDataFromService() {
    this.getCountryList();
    this.getCasesDefinitions();
  }

  getCasesDefinitions() {
    this.spinnerService.show();
    this.CommunicationsService
      .getMyCasesMaster()
      .then((res: any) => {
        this.resolveCasesDefinitions(res);
      });
  }

  resolveCasesDefinitions(res) {
    this.spinnerService.hide();
    this.msgpurpose_list = res.MyCasesPurp;
    this.reason_list_master = res.MyCasesReason;
  }

  validateMobNo() {
    let valToRet = false;
    if (_l.isNaN(+this.complaintForm.value.inputmobile)) {
      if (this.complaintForm.value.inputmobile == this.dataFromLocStor.Phone) {
        valToRet = true;
      }
    } else {
      valToRet = this.commonService.validMobTelNoOnCount('Mob', this.complaintForm.value.inputmobile, this.complaintForm.value.inputmobcode)
    }
    return valToRet;
  }
}