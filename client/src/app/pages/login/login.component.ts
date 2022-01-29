import { Component, OnInit } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from "../../services/authenticate.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { CustomerProfileService } from "../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { CommonService } from './../../services/common.service';
 
declare var $: any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  loginResponse: any = {};
  forgotPasswordGenOTPResponse: any = {};
  modalReference: any = [];
  inputOTP: string = "";
  next1 = false;
  footerYear = 0;
  hresend: boolean = true;

  selectedLang = "en";
  timeLeft: number = 300;
  timeLeftformat = 'OTP expires in 5 min';
  interval;

  textOrPassword1 = "password";
  icontype1 = "ion-ios-eye";
  textOrPassword = "password";
  icontype = "ion-ios-eye";
  customerProfiles: any = [];
  current_direction = 'rtl';
  constructor(private authService: NbAuthService, public commonService: CommonService, private router: Router, private modalService: NgbModal, private authenticateService: AuthenticateService, private translate: TranslateService, private toastr: ToastrService, protected localStorage: LocalStorage, private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService, private directionService: NbLayoutDirectionService) {
    // this language will be used as a fallback when a translation isn't found in the current language
   

  

    this.authService.logout("email").subscribe(result => {
      let message, error;
      if (result.isSuccess()) {
        message = result.getMessages();
      }
      else {
        error = result.getErrors();
      }
    });
  }

  ngOnInit() {
    
    this.localStorage.getItem('lang').subscribe(lan => {
      
      if(lan=='ar')
      {
        
        this.onLangChange('ar'); 
      }
      else
      { 
        this.onLangChange('en'); 
      }
    });
    $(".searchForm__buttonIcon").on("click", function (e) {
      $(".searchForm").addClass("active");
      e.stopPropagation()
      });
      
      $(document).on("click", function (e) {
      if ($(e.target).is(".searchForm__input,.searchForm__buttonSearch") === false) {
      $(".searchForm").removeClass("active");
      }
      }); 
    console.log('papa');
    console.log(this.selectedLang);
    var curDate = new Date();
    var footerYear1 = curDate.getFullYear();
    this.footerYear = footerYear1;
    this.commonService.currentProfiles.subscribe(customerProfiles => this.customerProfiles = customerProfiles);
    
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  OnPasswordToggle1() {
    if (this.textOrPassword1 === "password") {
      this.textOrPassword1 = "text";
      this.icontype1 = "ion-eye-disabled";
    }
    else {
      this.textOrPassword1 = "password";
      this.icontype1 = "ion-ios-eye";
    }
  }

  OnPasswordToggle() {
    if (this.textOrPassword === "password") {
      this.textOrPassword = "text";
      this.icontype = "ion-eye-disabled";
    }
    else {
      this.textOrPassword = "password";
      this.icontype = "ion-ios-eye";
    }
  }


  get loginData() {
    return this.loginForm.controls;
  }

  login(content) {
    this.next1 = true;
    this.inputOTP = "";
    let data = {
      username: this.loginForm.value.userName,
      password: this.loginForm.value.password,
      otp: "N"
    }
    if (this.loginForm.invalid) {
      this.showFailureToast(this.translate.instant('LOGIN.emsgEntertheUserIDandPassword'), this.translate.instant('LOGIN.TITLE'));
      return true;


    }
    else if (this.loginForm.value.userName.match(/^[0-9]+$/) === null) {

      this.showFailureToast(this.translate.instant('LOGIN.EnterValidUserID'), null);
      return true;

    }
    else {
      this.spinnerService.show();
      this.timeLeft = 300;
      this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin5min');
      if (this.loginForm.value.userName != "" && this.loginForm.value.password != "") {
        this.authenticateService.validateLogin(data).then(res => {
          this.loginResponse = res;
          if (this.loginResponse.MessType == 'S') {
            if (this.loginResponse.CustExist == undefined) {
              this.startTimer();
              this.spinnerService.hide();
              // this.timeLeft = 20;
              this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm' });

            } else if (this.loginResponse.CustExist == 'X') {
              this.customerProfileService.setSignUpType('E');
              this.customerProfileService.setLoginDataForExistingUser(this.loginResponse.UserId, this.loginResponse.Dob);
              this.spinnerService.hide();
              this.closeTimer();
              // var errorMessage = this.loginResponse.MessText == undefined ? this.translate.instant('LOGIN.emsgSomethingwentwrong') : this.loginResponse.MessText;
              // this.showFailureToast(errorMessage);

              this.goSignup('2');
            }


            // this.spinnerService.hide();
            // this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm' });
          }
          else {
            this.spinnerService.hide();
            const errorMessage = this.loginResponse.MessText == undefined ? this.translate.instant('LOGIN.emsgSomethingwentwrong') : this.loginResponse.MessText == "Invalid Username/Password" ? this.translate.instant('LOGIN.emsgWrongCompination') : this.loginResponse.MessText;
            this.showFailureToast(errorMessage, this.translate.instant('LOGIN.TITLE'));
          }

        });
      }
    }
  }

  // goSignup(){
  //   this.router.navigateByUrl("/signup");
  // }
  goSignup(navId) {
    if (navId == 1) {
      this.customerProfileService.setSignUpType('N');
      this.router.navigateByUrl('signup/0');
    }
    if (navId == '2') {
      this.router.navigateByUrl('signup/0');
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft - minutes * 60;

        this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin') + ' ' + minutes + ' ' + this.translate.instant('COMMON_TIMER.min') + ' : ' + seconds + ' ' + this.translate.instant('COMMON_TIMER.sec');

      } else {

        this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpired');
        this.closeTimer();
        this.hresend = false;

      }
    }, 1000)

  }

  closeTimer() {

    clearInterval(this.interval);

  }

  onOTPVerify() {
    if (this.inputOTP != "") {
      let data = {
        username: this.loginForm.value.userName,
        password: "N",
        otp: this.inputOTP
      }
      this.localStorage.setItem("CurrentUserNationalId", data.username).subscribe();
      this.localStorage.setItem("CurrentUserNationalIdLoanApplication", data.username).subscribe();
      this.localStorage.removeItem('AdminLoginData').subscribe(() => { });
      this.spinnerService.show();

      this.authService.authenticate('email', data).subscribe((result: any) => {
        const resultInfo = result.getResponse().body;
        if (resultInfo && resultInfo.success) {
          this.modalReference.close();
          this.closeTimer();
          if (resultInfo.userInfo.CustProfile != undefined) {

            // this.customerProfileService.selectedCustomerDetails = resultInfo.userInfo;

            this.localStorage.setItem('custDetails', resultInfo.userInfo).subscribe(() => {

              this.localStorage.setItem('custProfile', resultInfo.userInfo.CustProfile).subscribe(() => {
                // Done
                var redirect = result.getRedirect();
                if (redirect) {
                  this.showToastMessage(this.translate.instant('LOGIN.emsgLoginSuccessful'), this.translate.instant('LOGIN.TITLE'));
                  setTimeout(() => {
                    //   this.spinnerService.hide();
                    return this.router.navigateByUrl('/pages/client-dashboard');
                  }, 0);
                }
              }, (error) => {
                alert(error);
              });

            }, (error) => {
              alert(error);
            });

          } else {
            this.spinnerService.hide();
            this.showFailureToast(this.translate.instant('LOGIN.emsgTheCustomerProfileismissing'), this.translate.instant('LOGIN.TITLE'));
          }
        }
        else {
          this.spinnerService.hide();
          this.showFailureToast(this.translate.instant('LOGIN.emsgTheOTPisIncorrect'), this.translate.instant('LOGIN.TITLE'));
          // this.toastr.success( "OTP wrong",'Login',{
          //   timeOut: 1000,
          //   positionClass:'toast-top-center'
          // });
        }
      }, err => { alert(err) });
    }
    else {
      this.showFailureToast(this.translate.instant('LOGIN.emsgEntertheOTP'), this.translate.instant('LOGIN.TITLE'));
    }
  }
  OnResendClick() {

    this.next1 = true;
    this.inputOTP = '';
    const data = {
      username: this.loginForm.value.userName,
      password: this.loginForm.value.password,
      otp: 'N',
    }

    this.spinnerService.show();
    this.timeLeft = 300;
    this.timeLeftformat = this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin5min');
    if (this.loginForm.value.userName != '' && this.loginForm.value.password != '') {
      this.authenticateService.validateLogin(data).then(res => {
        this.loginResponse = res;
        if (this.loginResponse.MessType == 'S') {
          this.hresend = true;
          this.startTimer();
          this.spinnerService.hide();
          //this.timeLeft = 20;

          //this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm' });

        }
        else {
          this.spinnerService.hide();
          this.closeTimer();
          const errorMessage = this.loginResponse.MessText == undefined ? this.translate.instant('LOGIN.emsgSomethingwentwrong') : this.loginResponse.MessText;
          this.showFailureToast(errorMessage, null);
        }

      });

    }

  }

  onClose() {
    this.closeTimer();
    this.modalReference.close();
  }
  onLangChange(selectedValue) {

    this.localStorage.setItem('lang', selectedValue).subscribe(() => {

      this.translate.use(selectedValue);

      this.translate.get('dir').subscribe(res => {
        this.directionService.setDirection(res == 'rtl' ? NbLayoutDirection.RTL : NbLayoutDirection.LTR);
        //window.location.reload(); 
      });
      

    }, (error) => {

      alert(error)

    });

    this.commonService.setTranslate(selectedValue);

  }

  getForgotPasswordOTP() {



    //console.log("hi, welcome");
    let data = {
      username: this.loginForm.value.userName,
      password: "FORGOT",
      otp: "FORGOT"
    }
    if (this.loginForm.value.userName != "") {
      this.authenticateService.validateLogin(data).then(res => {
        this.forgotPasswordGenOTPResponse = res;
        if (this.forgotPasswordGenOTPResponse.MessType == 'S') {
          this.showToastMessage(this.forgotPasswordGenOTPResponse.MessText, this.translate.instant('LOGIN.TITLE'));
          // this.router.navigate(['/forgotpassword'],  { queryParams: { page: 1 } });
          this.router.navigate(['/forgotpassword'], { queryParams: { username: this.loginForm.value.userName } });

        }
        else {
          this.showFailureToast(this.forgotPasswordGenOTPResponse.MessText, this.translate.instant('LOGIN.ForgotPassword'));

        }

      });
    }
    else {
      this.showFailureToast(this.translate.instant('LOGIN.emsgEntertheuserId'), this.translate.instant('LOGIN.ForgotPassword'));
    }

  }
  openPrivacyPolicy(privacycontent) {

    this.modalReference = this.modalService.open(privacycontent, { backdrop: 'static', size: 'lg' });
  }
  searchtxt:any="";
Search(){
  //window.open("https://www.sidf.gov.sa/ar/Search/Pages/SearchResults.aspx?u=https://www.sidf.gov.sa&k="+this.searchtxt,"_blank");
  $('.pace-done').removeHighlight().highlight(this.searchtxt);
}
  getContactUs() {

    /*if (this.loginForm.value.userName != "") {
      this.router.navigate(['/contactus'], { queryParams: { username: this.customerProfileService.getEncryptedString(this.loginForm.value.userName) } });
    }
    else {
      this.router.navigateByUrl("/contactus");
    }*/ 
    if(this.commonService.defaultLanguage==='ar')
    window.open("https://www.sidf.gov.sa/ar/Pages/ContactUs.aspx","_blank");
    else
    window.open("https://www.sidf.gov.sa/en/Pages/ContactUs.aspx","_blank");
  }
  getPrivacy(){
    if(this.commonService.defaultLanguage==='ar')
    window.open("https://www.sidf.gov.sa/ar/Pages/Privacy_Policy.aspx","_blank");
    else
    window.open("https://www.sidf.gov.sa/en/Pages/Privacy_Policy.aspx","_blank");
  }
  getFaq(){
    if(this.commonService.defaultLanguage==='ar')
    window.open("https://www.sidf.gov.sa/ar/InvestorsInformation/Pages/InvestorsFAQ.aspx","_blank");
    else
    window.open("https://www.sidf.gov.sa/en/InvestorsInformation/Pages/InvestorsFAQ.aspx","_blank");
  }
  getTerm(){
    if(this.commonService.defaultLanguage==='ar')
    window.open("https://www.sidf.gov.sa/ar/Pages/TermsOfUse.aspx","_blank");
    else
    window.open("https://www.sidf.gov.sa/en/Pages/TermsOfUse.aspx","_blank");
  }
  showToastMessage(message, heading) {
    this.toastr.success(message, heading, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }

  showFailureToast(message, heading) {
    this.toastr.error(message, heading, {
      timeOut: 5000,
      positionClass: 'toast-top-center',
    });
  }
}
