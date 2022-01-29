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
import { CommunicationsService } from "../../services/communications.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AdminAreaLoginComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  loginResponse: any = [];
  modalReference: any = [];
  footerYear = 0;
  forgotPasswordGenOTPResponse: any = {};
  textOrPassword1 = "password";
  icontype1 = "ion-ios-eye";
  textOrPassword = "password";
  icontype = "ion-ios-eye";
  customerProfiles: any = [];
  current_direction = 'rtl';
  constructor(private communicationsService: CommunicationsService, private authService: NbAuthService, private commonService: CommonService, private router: Router, private modalService: NgbModal, private authenticateService: AuthenticateService, private translate: TranslateService, private toastr: ToastrService
    , protected localStorage: LocalStorage, private customerProfileService: CustomerProfileService, private spinnerService: Ng4LoadingSpinnerService, private directionService: NbLayoutDirectionService) {

  }

  ngOnInit() {
    console.log(this.translate);
    var curDate = new Date();
    var footerYear1 = curDate.getFullYear();
    this.footerYear = footerYear1;
    this.commonService.currentProfiles.subscribe(customerProfiles => this.customerProfiles = customerProfiles);
     
  }



  get loginData() {
    return this.loginForm.controls;
  }

  VerifyLogin() {

    this.localStorage.removeItem('custProfile').subscribe(() => { });
    this.localStorage.removeItem('AdminLoginData').subscribe(() => { });

    this.localStorage.removeItem('lang').subscribe(() => { });
    // this.localStorage.removeItem('selCustProf').subscribe(() => {});
    this.authService.logout("email").subscribe(result => {

      // let message, error;

      // if (result.isSuccess()) {
      //   message = result.getMessages();
      // } else {
      //   error = result.getErrors();
      // }

      // var redirect = result.getRedirect();

      // if (redirect) {
      //   setTimeout(() => {
      //     return this.router.navigateByUrl(redirect);
      //   }, 300);
      // }

    });

    let data = {
      UserName: this.loginForm.value.userName,
      Password: this.loginForm.value.password
    }
    if (this.loginForm.invalid) {
      this.showFailureToast(this.translate.instant('LOGIN.emsgEntertheUserIDandPassword'), this.translate.instant('LOGIN.TITLE'));
      return true;


    }
    else {
      this.spinnerService.show();
      if (this.loginForm.value.userName != "" && this.loginForm.value.password != "") {

        this.communicationsService.validateLandLoanAdminLogin(data).then((res) => {
          this.loginResponse = res;

          if (this.loginResponse.length != 0) {

            this.commonService.showSuccessToast(this.translate.instant('LOGIN.emsgLoginSuccessful'));
           
            this.localStorage.setItem("AdminLoginData", this.loginResponse[0]).subscribe(() => {
              this.router.navigateByUrl('/AdminArea');
              this.spinnerService.hide();
            });
          }
          else {
            this.spinnerService.hide();
            //const errorMessage = this.loginResponse.MessText == "Invalid User Name / Password" ? this.translate.instant('LOGIN.emsgWrongCompination') : this.loginResponse.MessText;
            //this.loginResponse.MessText == undefined ? this.translate.instant('LOGIN.emsgSomethingwentwrong') :
            this.commonService.showFailureToast(this.translate.instant('اسم المستخدم او كلمة المرور غير صحيحة'));
          }

        });
      }
    }
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
