import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticateService } from "../../services/authenticate.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {TranslateService} from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {


  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  reason_visible = true;
  next1 = false;

  msgpurpose_list = "Complaints|Enquiry|Suggestions|Am I eligible to get an Industrial Loan".split("|");
  msgpurpose = "";
  msgPurposeSelected = "";

  reason_list = "Select Message Purpose".split("|");
  reason = "";
  reasonOptionSelected = "";
  footerYear = 0;

  username: any;
  contactUsFinalResponse:any={};

  selectedLang = "en";
  Show = false;


  contactUsForm = new FormGroup({
    inputName: new FormControl('',Validators.required),
    inputmobcode: new FormControl('00966',Validators.required),
    inputmobile: new FormControl('',Validators.required),
    inputtelcode: new FormControl('00966'),
    inputtelephone: new FormControl(''),
    inputFactoryName: new FormControl(''),
    msgPurposeSelected:new FormControl(''),
    reasonOptionSelected:new FormControl(''),
    inputEmail: new FormControl('',[Validators.required, Validators.pattern(this.emailPattern)]),
    inputSubject: new FormControl('',Validators.required),
    inputmessage: new FormControl('',Validators.required)
});

  
  

  constructor(private route: ActivatedRoute,  private authenticateService: AuthenticateService, private router: Router, private toastr: ToastrService,private customerProfileService:CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService, public translate: TranslateService,protected localStorage: LocalStorage,private directionService: NbLayoutDirectionService) {
     // this language will be used as a fallback when a translation isn't found in the current language
     this.selectedLang = this.translate.currentLang!=undefined?this.translate.currentLang:"ar";
   }

  ngOnInit() {
    
    this.selectedLang = this.translate.currentLang!=undefined?this.translate.currentLang:"ar";
    this.onLangChange(this.selectedLang);
    var curDate = new Date();
    var footerYear1 = curDate.getFullYear();
    this.footerYear = footerYear1;

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
            var username= params['username'];
            if(username!='')
              username=this.customerProfileService.getDecryptString(username);
            this.username = username;
        // console.log(this.username);
      });
  }

  get contactUsData(){
    return this.contactUsForm.controls;
  }

  navigatetoLogin(){

    this.router.navigateByUrl("/login");
    
  }

  onMessagePurposeSelect(){
    this.reasonOptionSelected="";
    if(this.msgPurposeSelected === "Complaints" || this.msgPurposeSelected === "الشكاوي"){
      this.reason_visible = true;
      if(this.selectedLang === "en")
      this.reason_list = "|Loan General|Loan-Disbursement|Loan-Collections|Non-borrowing certificate|Technical|HR|New Product|General Complaints|Anti-Corruption".split("|");
      else
      this.reason_list = "|مكافحة الفساد|الشكاوي العامة|منتج جديد|الموارد البشرية|فني|شهادة عدم اقتراض|تحصيل القرض|صرف القرض|القرض بشكل عام".split("|");
    }
    else if(this.msgPurposeSelected === "Enquiry" || this.msgPurposeSelected === "استعلام"){

      this.reason_visible = true;
      if(this.selectedLang === "en")
      this.reason_list ="|Non-borrowing certificate|Loan Eligibility|Loan Process|Career Enquiry|New Product|General".split("|");
      else
      this.reason_list ="|عام|منتج جديد|الاستعلام عن المهنة|معالجة القرض|اهلية القرض|شهادة عدم اقتراض".split("|");
    }
    else if(this.msgPurposeSelected === "Suggestions" || this.msgPurposeSelected === "مقترحات"){

      this.reason_visible = true;
      if(this.selectedLang === "en")
      this.reason_list ="|Loan|Non-Borrowing certificates|New Product|Other".split("|");
      else
      this.reason_list ="|اخرى|منتج جديد|شهادة عدم اقتراض|قرض".split("|");
      
    }
    else{

      this.reason_visible = false;

    }
  }

  onCancel(){
    this.router.navigateByUrl("/login");
  }

  onSend(){
    this.next1 = true;
    console.log(this.msgPurposeSelected);
    if (this.contactUsForm.invalid) {

      this.showFailureToast('Please fill all the mandatory fields','Contact Us');
      return true;
      
    }
    else if(this.msgPurposeSelected.trim() ===''){
      this.showFailureToast('Please select the message purpose','Contact Us');
      return true;
    }
    else if(this.reasonOptionSelected.trim() ==='' && this.msgPurposeSelected != "Am I eligible to get an Industrial Loan" && this.msgPurposeSelected != "هل انا مؤهل للحصول على قرض صناعي"){
      this.showFailureToast('Please select the reason','Contact Us');
      return true;
    }
    else{
      var finalData = {

        "Id":this.username,
        "Name":this.contactUsForm.value.inputName,
        "MobNum": this.contactUsForm.value.inputmobcode + this.contactUsForm.value.inputmobile,
        "TelNum": this.contactUsForm.value.inputtelcode + this.contactUsForm.value.inputtelephone,
        "FactoryName":this.contactUsForm.value.inputFactoryName,
        "EmailId":this.contactUsForm.value.inputEmail,
        "Subject":this.contactUsForm.value.inputSubject,
        "MessText":this.contactUsForm.value.inputmessage,
        "MessPurpose":this.msgPurposeSelected,
        "MessPurpose2":this.reasonOptionSelected,
        "ResType":"",
        "ResText":"",
        "CustProfileId":""
      }

      let data = finalData;

      if(finalData){
        this.spinnerService.show();
        this.authenticateService.submitContactUs(data).then(res => {
          this.contactUsFinalResponse = res;
          if(this.contactUsFinalResponse.ResType=='2'){
  
            this.showSuccessToast(this.contactUsFinalResponse.ResText,'Contact Us');
            this.contactUsForm.reset();
            this.spinnerService.hide()
            this.router.navigateByUrl("/login");           
          }
          else{
            this.spinnerService.hide()
            this.showFailureToast(this.contactUsFinalResponse.ResText,'Contact Us');
          }
  
          });
      }

      //console.log(JSON.stringify(finalData));

    }

  }

  onLangChange(selectedValue){ 
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(selectedValue);
this.selectedLang =selectedValue;
    
    
    this.localStorage.setItem('lang', selectedValue).subscribe(() => {
     // Done
    //this.selectedLang = this.translate.currentLang;

    var temp = [];
if(this.selectedLang === "ar"){
     temp.push("");
     temp.push("الشكاوي");
     temp.push("استعلام");
     temp.push("مقترحات");
     temp.push("هل انا مؤهل للحصول على قرض صناعي");
     
     this.msgpurpose_list = temp;

     this.reason_list = " تحديد غرض الرسالة ".split("|");
}
else{
  this.msgpurpose_list = "Complaints|Enquiry|Suggestions|Am I Eligible to get an Industrial Loan".split("|");
  this.msgpurpose = "";
  this.msgPurposeSelected = "";

  this.reason_list = "Select Message Purpose".split("|");
  this.reason = "";
  this.reasonOptionSelected = "";
}
this.translate.get('dir').subscribe(res => { 
  this.directionService.setDirection(res=='rtl'?NbLayoutDirection.RTL:NbLayoutDirection.LTR);
});
     
   }, (error) => {
     alert(error)
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(selectedValue);
 });

 }

  showSuccessToast(message,heading) {
    this.toastr.success(message, heading, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }

  showFailureToast(message,heading) {
    this.toastr.error(message, heading, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }

}
