import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from "../../services/authenticate.service";
import { CommonService } from "../../services/common.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { CommunicationsService } from "./../../services/communications.service";
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import 'rxjs/add/operator/toPromise';
// import { Http, ResponseContentType } from '@angular/http';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { LocalStorage } from'@ngx-pwa/local-storage';
import { _ } from 'underscore';

@Component({
  selector: 'customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {

  selectedRepresentativeId;
  selectedRepresentativeBpName;
  representativeDropDown = [];
  customerProfileData;
  spinner_status = true;
  requestId = 0;

  image_default = "../../../assets/images/avtr.jpg";
  imageData: any;

  profile_picture_get = {};
  profile_picture_refId = "";
  profile_picture_documentId = "";

  ReadOnly1 = true;
  ReadOnly2 = true;
  ReadOnly3 = true;

  basicDet_icon = "nb nb-edit";
  address_icon = "nb nb-edit"; 
  address_icon1 = "nb nb-edit";

  hide_close = true;
  hide_close1 = true;
  hide_close2 = true;
  date="";
  icon_normal = "color : #35619a;"
  icon_success = "color : #60b99f;"

  UserId = ""

  FirstName = "";
  MiddleName = "";
  LastName = "";

  FirstNameEn = "";
  MiddleNameEn = "";
  LastNameEn = "";

  UserType = "";
  IdType = "";

  Email = "";

  Mobile = "";

  BuildNum = "";
  City = "";
  Street = "";
  Zip = "";
  AddNum = "";
  UnitNum = "";
  Neighbour = "";
  ProfId ="";

  CRExpDay ="";
  CRExpMonth ="";
  CRExpYear ="";

  Crdate = "";

  PassExpDay =""; 
  PassExpMonth ="";
  PassExpYear ="";

  PassNum ="";
  PassDate: any;

  commomDisabled = true;

  hMobileOTP = true;
  hEmailOTP = true;

  MobileHidden = true;
  EmailHidden = true;

  hConsultancy = true;

  passportDateDisabled = true;

  hGcc = true;
  hNational = true;
  hSagia = true;

  mobileOTP ="";
  emailOTP = "";

  icontype1 = "ion-ios-eye";
  icontype2 = "ion-ios-eye";

  textOrPassword1 = "password";
  textOrPassword2 = "password";

  hresend: boolean = true;
  hresend1: boolean = true;

  timeLeft: number = 300;
  timeLeftformat = "OTP expires in 5 min";
  interval;

  timeLeft1: number = 300;
  timeLeftformat1 = "OTP expires in 5 min";
  interval1;

  translate: any;

  editTitle = "Edit";
  cancelTitle = "Cancel";

  editTitleAr = "تعديل";
  cancelTitleAr = "الغاء";

  constructor(protected localStorage: LocalStorage, private router: Router, private httpClient: HttpClient, private communicationsService: CommunicationsService, private authenticateService: AuthenticateService, public commonService: CommonService,
    private customerProfileService: CustomerProfileService, private modalService: NgbModal, private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {

      this.translate = this.commonService.returnTranslate();
     }

  ngOnInit() {
    console.log("Cust Prof");
    this.getCustomerProfile();
    this.requestId = this.customerProfileService.loanRequestId;

  }


  onlyArabic(event){
   
    if (!/^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/.test((event.target.value.replace(/ /g,''))))
     {
       event.target.value = "";
       this.commonService.showFailureToast("Only Arbic text can be Entered");
    }
  }

  onlyEnglish(event){
   
    if (!/^[A-Za-z_ ]+$/.test((event.target.value)))
     {
       event.target.value = "";
       this.commonService.showFailureToast("Only English text can be Entered");
    }
  }

  ValidateAlpha(evt) : boolean{
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123) && (charCode != 32) && (charCode > 0x0600 || charCode < 0x06FF))
     {
    return false;
     }
        return true;
}

ValidateAlphaArabic(e) : boolean{
var unicode=e.charCode? e.charCode : e.keyCode
if (unicode!=8){ //if the key isn't the backspace key (which we should allow)
  if (( unicode>48 || unicode<57) && (unicode != 32)  && (unicode < 0x0600 || unicode > 0x06FF)) //if not a number or arabic
    return false //disable key press
}
}

  getCustomerProfile() {
    this.Ng4LoadingSpinnerService.show();
    this.authenticateService.getCustomerProfile(this.customerProfileService.currentUser)
      .then((res) => (this.resolveCustomerProfile(res), 
      this.Ng4LoadingSpinnerService.hide(),
      this.getDocuments())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());

  }

  resolveCustomerProfile(res) {
//  console.log(res);
// res.PassExpDate = "20171202";
    this.FirstName = res.FirstName ? res.FirstName : "";
    this.MiddleName = res.MiddleName ? res.MiddleName : "";
    this.LastName = res.LastName ? res.LastName : "";

    this.FirstNameEn = res.FirstNameEn ? res.FirstNameEn : "";
    this.MiddleNameEn = res.MiddleNameEn ? res.MiddleNameEn : "";
    this.LastNameEn = res.LastNameEn ? res.LastNameEn : "";

    this.Email = res.Email ? res.Email : "";

    this.Mobile = res.Mobile ? res.Mobile : "";

    // this.ProfId = res.ProfId ? res.ProfId : "";

    this.UserId = res.OldPass ? res.OldPass : "";

    this.UserType = res.UserType ? res.UserType : "";
    this.IdType = res.IdType ? res.IdType : "";

    this.CRExpYear = res.CrExpDate ? res.CrExpDate.slice(0,4) : "";
    this.CRExpMonth = res.CrExpDate ? res.CrExpDate.slice(4,6) : "";
    this.CRExpDay = res.CrExpDate ? res.CrExpDate.slice(6,8) : "";


    this.PassExpYear = res.PassExpDate ? res.PassExpDate.slice(0,4) : "";
    this.PassExpMonth = res.PassExpDate ? res.PassExpDate.slice(4,6) : "";
    this.PassExpDay = res.PassExpDate ? res.PassExpDate.slice(6,8) : "";

    this.PassDate = new Date();
    this.PassDate.setFullYear(this.PassExpYear);
    this.PassDate.setMonth(+this.PassExpMonth - 1);
    this.PassDate.setDate(this.PassExpDay);


    this.PassNum = res.PassportNum ? res.PassportNum : "";

    

    if (res.ProfileAddress && res.ProfileAddress.length > 0) {

      this.BuildNum = res.ProfileAddress[0].BuildNum ? res.ProfileAddress[0].BuildNum : "";
      this.City = res.ProfileAddress[0].City ? res.ProfileAddress[0].City : "";
      this.Street = res.ProfileAddress[0].StreetName ? res.ProfileAddress[0].StreetName : "";
      this.Zip = res.ProfileAddress[0].Zip ? res.ProfileAddress[0].Zip : "";
      this.AddNum = res.ProfileAddress[0].AddNum ? res.ProfileAddress[0].AddNum : "";
      this.UnitNum = res.ProfileAddress[0].UnitNum ? res.ProfileAddress[0].UnitNum : "";
      this.Neighbour =  res.ProfileAddress[0].Neighbour ? res.ProfileAddress[0].Neighbour : "";

    }

    else {

      this.BuildNum = "";
      this.City = "";
      this.Street = "";
      this.Zip = "";

    }

    if(res.UserType != "")
    {
      if(res.UserType === "C")
      {
        this.hConsultancy = false;
      }
    }

    if(res.IdType != "")
    {
      if(res.IdType === "3")
      {
         this.hGcc = false;
      }
    }

  }



  open() {
    // this.modalService.open(ProfileModalComponent);
    const activeModal = this.modalService.open(ProfileModalComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.modalHeader = 'Profile Edit';
    // console.log("PSW" + this.ProfId);
    // activeModal.componentInstance.profileId = this.ProfId;
  }

  open2(event, optName) {
    
    //  console.log(this.PassExpYear + ""+this.CRExpMonth+""+this.PassExpDay);


    if(optName === "changePass"){



      let options: any = {
        size: "dialog-centered"
      };
        // this.modalService.open(ProfileModalComponent);
        const activeModal = this.modalService.open(ProfileModalComponent, options );
        activeModal.componentInstance.modalHeader = this.translate.instant('MY_PROFILE.ChangePassword');
        // console.log("PSW" + this.ProfId);
        // activeModal.componentInstance.profileId = this.ProfId;
        activeModal.componentInstance.method = "changePass";

      // let options: any = {
      //   size: "dialog-centered"
      // };
        // this.modalService.open(ProfileModalComponent);
        // const activeModal = this.modalService.open(IvrManagementModalComponent, options );
        // activeModal.componentInstance.modalHeader = 'Generate IVR Passcode';
        // activeModal.componentInstance.method = "generateNewIvr";
        // console.log("PSW" + this.ProfId);
        // activeModal.componentInstance.profileId = this.ProfId;

    }

    // else if(optName === "resetIvr"){

    //   let options: any = {
    //     size: "dialog-centered"
    //   };
    //     // this.modalService.open(ProfileModalComponent);
    //     const activeModal = this.modalService.open(IvrManagementModalComponent, options );
    //     activeModal.componentInstance.modalHeader = 'Reset IVR Passcode';
    //     // console.log("PSW" + this.ProfId);
    //     activeModal.componentInstance.method = "resetIvr";

    // }

  }

  basicDetEdit() {
    
    this.basicDet_icon = "nb nb-checkmark";
    this.hide_close = false;
    this.ReadOnly1 = false;
    this.editTitle = "Save";
    this.editTitleAr = "حفظ";

    if(this.IdType != "")
    {
      if(this.IdType === "3")
      {
         this.passportDateDisabled = false;
      }
    }

  }

  saveBasicDet() {

    //Save API call here 
    // console.log(this.PassNum);
    //  console.log(this.PassDate);
    // this.PassDate=this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.PassDate);
    this.editTitle = "Edit";
    this.editTitleAr = "تعديل";
    this.PassExpYear = ('000' + (this.PassDate.getFullYear())).slice(-4);
    this.PassExpMonth = ('0' + (this.PassDate.getMonth()+1)).slice(-2);
    this.PassExpDay = ('0' + (this.PassDate.getDate())).slice(-2);
    // this.Crdate = this.commonService.returnDateStringWithoutHyphenFromGregDateString(this.Crdate);
    // console.log(this.PassDate);
    var data = {

      // "ProfId": this.ProfId,
      "FirstName": this.FirstName,
      "MiddleName": this.MiddleName,
      "LastName": this.LastName,
      "PassportNum": this.PassNum,
      "PassExpDate": this.PassExpYear + this.PassExpMonth + this.PassExpDay,
      "FirstNameEn": this.FirstNameEn,
      "MiddleNameEn": this.MiddleNameEn,
      "IdType": this.IdType,
      "LastNameEn": this.LastNameEn,
      "ProfileAddress": [
          {
              // "ProfId": this.ProfId,
              "BuildNum": this.BuildNum,
              "StreetName": this.Street,
              "Neighbour": this.Neighbour,
              "City": this.City,
              "Zip": this.Zip,
              "AddNum": this.AddNum,
              "UnitNum":this.UnitNum
          }
      ]

  }
  // console.log(data);


  if(this.IdType != "")
    {
      if(this.IdType === "3")
      {
         this.passportDateDisabled = true;
      }
    }

  this.Ng4LoadingSpinnerService.show();

  this.authenticateService.editMobileOrEmailOrBasicData(data,"","UB")
  .then((res) => (this.resolveEditCustomerProfile(res,"updateBasic"), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());
 

  }

  closeBasicDet(){
    this.ReadOnly1 = true;
    this.hide_close = true;
    this.basicDet_icon = "nb nb-edit";
    this.passportDateDisabled = true;
    this.editTitle = "Edit";
    this.editTitleAr = "تعديل";


    this.getCustomerProfile();
  }

  addressEdit() {

    this.MobileHidden = false;
    this.address_icon = "nb nb-checkmark"; 
    this.ReadOnly2 = false;
    this.hide_close1 = false;
    this.editTitle = "Save";
    this.editTitleAr = "حفظ";
  }

  saveAddress() {

    this.closeTimer();
    this.editTitle = "Edit";
    this.editTitleAr = "تعديل";
    //Save Address call here

    this.Ng4LoadingSpinnerService.show();

    this.timeLeft = 300;
    this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin5min');

    this.authenticateService.editMobileOrEmailOrBasicData("",this.Mobile,"SM")
      .then((res) => (this.resolveEditCustomerProfile(res,"ChangeMobile"), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());

  }

  closeAddress(){
    this.ReadOnly2 = true;
    this.address_icon = "nb nb-edit"; 
    this.hide_close1 = true;
    this.MobileHidden = true;
    this.hMobileOTP = true;
    this.editTitle = "Edit";
    this.editTitleAr = "تعديل";
    this.mobileOTP="";

    this.getCustomerProfile();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } 
    return true;
  }


  addressEdit1() {

    
    this.EmailHidden = false;
    this.address_icon1 = "nb nb-checkmark"; 
    this.ReadOnly3 = false;
    this.hide_close2 = false;
    this.editTitle = "Save";
    this.editTitleAr = "حفظ";
  }

  saveAddress1() {
    this.editTitle = "Edit";
    this.editTitleAr = "تعديل";
    this.closeTimer1();
    //Save Address call here
    this.Ng4LoadingSpinnerService.show();

    this.timeLeft1 = 300;
    this.timeLeftformat1 = this.translate.instant('COMMON_TIMER.OTPexpiresin5min');

    this.authenticateService.editMobileOrEmailOrBasicData("",this.Email,"SE")
    .then((res) => (this.resolveEditCustomerProfile(res,"ChangeEmail"), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());
   

  }

  closeAddress1(){

    this.ReadOnly3 = true;
    this.address_icon1 = "nb nb-edit"; 
    this.hide_close2 = true;
    this.EmailHidden = true;
    this.hEmailOTP = true;
    this.editTitle = "Edit";
    this.editTitleAr = "تعديل";

    this.emailOTP = "";

    this.getCustomerProfile();
  }

  OnPasswordToggle1(){
    if(this.textOrPassword1 == "password"){
      this.textOrPassword1 = "text";
      this.icontype1 = "ion-ios-eye";
    }
    else{
      this.textOrPassword1 = "password";
      this.icontype1 = "ion-ios-eye";
    }
      }

  OnPasswordToggle2(){
    if(this.textOrPassword2 == "password"){
      this.textOrPassword2 = "text";
      this.icontype2 = "ion-ios-eye";
    }
    else{
      this.textOrPassword2 = "password";
      this.icontype2 = "ion-ios-eye";
    }
      }

  verifyOTP(type){
// console.log(type);
    this.Ng4LoadingSpinnerService.show();

    if(type == "mobile"){
// console.log(this.mobileOTP);
      this.authenticateService.verifyMobileOrEmailOtp("",this.Mobile,this.mobileOTP,"VM")
      .then((res) => (this.resolveEditCustomerProfile(res,"verifyMobile"), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());
    
    }
    else if(type == "email"){

      this.authenticateService.verifyMobileOrEmailOtp("",this.Email,this.emailOTP,"VE")
      .then((res) => (this.resolveEditCustomerProfile(res,"verifyEmail"), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());
    
    }

  }

  resolveEditCustomerProfile(res , TabNmae){
    // console.log(res);

      if(TabNmae == "ChangeMobile"){

        if(res.MessType == "S")
        {


        this.commonService.showSuccessToast(res.MessText);

        this.hresend = true;
        this.ReadOnly2 = true;
        this.hide_close1 = false;
        this.address_icon = ""; 

        this.hMobileOTP = false;

        // this.getCustomerProfile();
        
        this.startTimer();
        

        }
        else{
          this.commonService.showFailureToast(res.MessText);
          this.getCustomerProfile();
          this.closeTimer();
        }

      }

      else if(TabNmae == "verifyMobile"){

        if(res.MessType == "S"){

          this.commonService.showSuccessToast(res.MessText);

          this.hMobileOTP = true;
          this.MobileHidden = true;

          this.hide_close1 = true;
          this.address_icon = "nb nb-edit"; 

          this.mobileOTP = "";
        
          this.getCustomerProfile();
          this.closeTimer();

        }
        else{
          this.commonService.showFailureToast(res.MessText);
          // this.getCustomerProfile();
        }

      }

      else if(TabNmae == "ChangeEmail"){

        if(res.MessType == "S"){
          
          this.commonService.showSuccessToast(res.MessText);

          this.hresend1 = true;

          this.ReadOnly3 = true;
          this.hide_close2 = false;
          this.address_icon1 = ""; 

          this.hEmailOTP = false;

          // this.getCustomerProfile();
          this.startTimer1();

        }
        else{
          this.commonService.showFailureToast(res.MessText);
          this.getCustomerProfile();
          this.closeTimer1();
        }

      }

      else if(TabNmae == "verifyEmail"){

        if(res.MessType == "S"){
          
          this.commonService.showSuccessToast(res.MessText);

          this.hEmailOTP = true;

          this.EmailHidden = true;

          this.hide_close2 = true;
          this.address_icon1 = "nb nb-edit"; 

          this.emailOTP = "";
        
          this.getCustomerProfile();
          this.closeTimer1();

        }
        else{
          this.commonService.showFailureToast(res.MessText);
          // this.getCustomerProfile();
        }

      }

      else if(TabNmae == "updateBasic"){

        if(res.MessType == "S"){
          
          this.commonService.showSuccessToast(res.MessText);
          
          this.ReadOnly1 = true;
          this.basicDet_icon = "nb nb-edit";
          this.hide_close = true;
          
          this.getCustomerProfile();
        
        }

        
        else{
          this.commonService.showFailureToast(res.MessText);
          this.getCustomerProfile();
        }
      }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        var minutes = Math.floor(this.timeLeft / 60);
        var seconds = this.timeLeft - minutes * 60;

        this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin') + ' ' + minutes + ' ' +  this.translate.instant('COMMON_TIMER.min') + ' : ' + seconds + ' ' +  this.translate.instant('COMMON_TIMER.sec');
        
      } else {
        
        this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpired');
        this.closeTimer();
        this.hresend = false;
        
      }
    },1000)
    
  }

  startTimer1() {
    this.interval1 = setInterval(() => {
      if(this.timeLeft1 > 0) {
        this.timeLeft1--;
        var minutes1 = Math.floor(this.timeLeft1 / 60);
        var seconds1 = this.timeLeft1 - minutes1 * 60;

        this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin') + ' ' + minutes1 + ' ' +  this.translate.instant('COMMON_TIMER.min') + ' : ' + seconds1 + ' ' +  this.translate.instant('COMMON_TIMER.sec');
        
      } else {
        
        this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpired');
        this.closeTimer1();
        this.hresend1 = false;
        
      }
    },1000)
    
  }

  closeTimer(){

    clearInterval(this.interval);

  }

  closeTimer1(){

    clearInterval(this.interval1);

  }

  changeProfilePicture(event, file) {
    // console.log(event);
    // console.log(file);
  }

  onInputImageChange(event) {
    // console.log(event);
    let format;
    let format_length;
    
    let files = event.target.files;
    if(files.length != 0){
    var data = {
      documentDefId: 391,
      entityId: this.UserId,
      entityName: "Project",
     // RelatedEntityId: this.UserId,
     // RelatedEntityName: "technicalInfos",
      operationType: "l"
    };
    //let profilePicGet = this.profile_picture_get;
   if (files && this.profile_picture_get["documentList"] && this.profile_picture_get["documentList"].length === 0){
    this.Ng4LoadingSpinnerService.show();
     this.uploadDocumentFunction(files, data);
   } else if (files && this.profile_picture_get["documentList"].length > 0) {
   // this.deleteDocuments(this.profile_picture_get["documentList"][0].RefId, this.profile_picture_get["documentList"][0].DocumentId)
   this.Ng4LoadingSpinnerService.show();
    this.communicationsService.deleteDocumentService({
      entityId: this.UserId,
      refId: this.profile_picture_get["documentList"][0].RefId,
      documentId: this.profile_picture_get["documentList"][0].DocumentId,
      operationType: 'p'
    })
      .then(response => (this.uploadDocumentFunction(files, data)), err => (this.commonService.showFailureToast(err),  this.Ng4LoadingSpinnerService.hide()));
   }
  }

  }

  uploadDocumentFunction(file, data) {
    var temp;
    this.communicationsService.uploadDocumentService(file, data)
      .then(requests => (
        (
          temp = this.onDocumentUpload(requests)
        ), err => (this.commonService.showFailureToast(this.translate.instant('COMMON.DocumentSubmissionFailed')),
          this.Ng4LoadingSpinnerService.hide(),
          this.spinner_status = false)));
    return temp;
  }

  // onDocumentUpload(requests) {

  //   if (requests.MessType == "S") {
  //     return ("S");
  //   }
  //   else {
  //     this.commonService.showFailureToast(requests.message);
  //     return ("E");
  //   }
  // }
  onDocumentUpload(requests) {

    if (requests.MessType == "S") {
      // console.log(requests);
      this.communicationsService.downloadDocumentService(requests.data.documentList[0].EntityId,requests.data.documentList[0].RefId,requests.data.documentList[0].DocumentId,"l", requests.data.documentList[0].FileName)
      .then(response => (this.base64Image(response)), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide(), this.spinner_status = false));
      return ("S");
    }

    else {
      this.commonService.showFailureToast(requests.message);
      this.Ng4LoadingSpinnerService.hide();
      this.spinner_status = false;
      return ("E");
    }
  }
  base64Image(res){
    if(res.MessType === "S"){
    this.image_default = "data:image/png;base64," + res.result;
    this.spinner_status = false;
    this.Ng4LoadingSpinnerService.hide();
    }
    else {
      // this.commonService.showFailureToast("Unable to load profile picture");
      this.spinner_status = false;
       this.Ng4LoadingSpinnerService.hide();
    }
  }
  getDocuments() {
    //this.Ng4LoadingSpinnerService.show();

   let documentStructure = {};
   let technicaltableinfoModalParams;

    this.communicationsService.getDocumentService(this.UserId, "l").then(requests => {

      documentStructure = this.commonService.returnViewDocumentJson(requests);

      // console.log(this.documentStructure);

      this.profile_picture_get = documentStructure;
      if(this.profile_picture_get["documentList"] && this.profile_picture_get["documentList"][0]){
      this.profile_picture_refId = this.profile_picture_get["documentList"][0].RefId ? this.profile_picture_get["documentList"][0].RefId : undefined;
      this.profile_picture_documentId = this.profile_picture_get["documentList"][0].DocumentId ? this.profile_picture_get["documentList"][0].DocumentId : undefined;
      let profile_picture_entityid = this.profile_picture_get["documentList"][0].EntityId ? this.profile_picture_get["documentList"][0].EntityId : undefined;
      let profile_picture_filename = this.profile_picture_get["documentList"][0].FileName ? this.profile_picture_get["documentList"][0].FileName : undefined;
      // let image_temp = "";
      // image_temp= this.profile_picture_get["url"]
      // .replace("refId", this.profile_picture_get["documentList"][0].RefId)
      // .replace("entityId", this.profile_picture_get["documentList"][0].EntityId)
      // .replace("documentId", this.profile_picture_get["documentList"][0].DocumentId)
      // .replace("fileName", this.profile_picture_get["documentList"][0].FileName)

     // this.Ng4LoadingSpinnerService.show();
     if(profile_picture_entityid && this.profile_picture_refId && this.profile_picture_documentId && profile_picture_filename){
      this.communicationsService.downloadDocumentService(this.profile_picture_get["documentList"][0].EntityId, this.profile_picture_get["documentList"][0].RefId, this.profile_picture_get["documentList"][0].DocumentId,"l", this.profile_picture_get["documentList"][0].FileName)
      .then(response => (this.base64Image(response)), err => this.commonService.showFailureToast(err));
     } else {
      // this.commonService.showWarningToast("No Profile Picture Found");
      this.spinner_status = false;
       this.Ng4LoadingSpinnerService.hide();
     }
      //var temp = window.URL.revokeObjectURL('https://LMS_DEV:init@123@sidfpodev.sidf.gov.sa:50001/lms-service/rest/projects/987654321/checklist/SIDFPreparationDocuments/4330/documents/3115/1.png')

      //var temp2 = this.httpClient.get(this.image_default, { responseType: 'blob' });
      // this.http.get(this.image_default, {
      //   responseType: ResponseContentType.Blob
      // })
      //   .toPromise()
      //   .then((res: any) => {
      //     let blob = new Blob([res._body], {
      //       type: res.headers.get("Content-Type")
      //     });
  
      //     let urlCreator = window.URL;
      //     this.imageData = this.sanitizer.bypassSecurityTrustUrl(
      //         urlCreator.createObjectURL(blob));
      //   });
      } else {
        // this.commonService.showWarningToast("No Profile Picture Found");
        this.spinner_status = false;
         this.Ng4LoadingSpinnerService.hide();
       }
    });
  
  
  }

  deleteDocuments(refId, documentId){
    this.Ng4LoadingSpinnerService.show();
    this.communicationsService.deleteDocumentService({
      entityId: this.UserId,
      refId: refId,
      documentId: documentId,
      operationType: 'p'
    })
      .then(response => (this.Ng4LoadingSpinnerService.hide()), err => this.commonService.showFailureToast(err));
  }

  changeSpinner(){
    this.spinner_status = false;
  }

  navigateToRepresentatives(){
    this.router.navigateByUrl('pages/customer-profile/representatives');
  }
}
