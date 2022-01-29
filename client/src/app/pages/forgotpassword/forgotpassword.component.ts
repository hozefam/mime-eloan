import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthenticateService } from "../../services/authenticate.service";
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TranslateService } from '@ngx-translate/core';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';

@Component({
  selector: 'forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$";
  ForgotPasswordForm: FormGroup;
  
forgotPasswordResponse:any={};
username: any;
next1 = false;

textOrPassword1 = "password";
textOrPassword2 = "password";
textOrPassword3 = "password";
icontype1 = "ion-ios-eye";
icontype2 = "ion-ios-eye";
icontype3 = "ion-ios-eye";


  constructor(private fb: FormBuilder,private route: ActivatedRoute, private router: Router, private authenticateService: AuthenticateService, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService,private translate: TranslateService,protected localStorage: LocalStorage, private directionService: NbLayoutDirectionService) {

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.addLangs(['en', 'fr', 'ar']);
    this.translate.setDefaultLang('ar');
    

   }

  ngOnInit() {
    this.ForgotPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: [''],
      forgotPasswordOtp: ['', Validators.required]
  }, { validator:  this.checkPasswords});

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.username = params['username'];
      });
  }

  onLangChange(selectedValue) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(selectedValue);

    this.translate.get('dir').subscribe(res => { 
      this.directionService.setDirection(res=='rtl'?NbLayoutDirection.RTL:NbLayoutDirection.LTR);
    });

    this.localStorage.setItem('lang', selectedValue).subscribe(() => {
      // Done
    }, (error) => {
      alert(error)
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(selectedValue);
    });

  }
  
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.value.newPassword;
    let confirmPass = group.value.confirmPassword;

    return pass === confirmPass ? null : { notSame: true }
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

  OnPasswordToggle3(){
    if(this.textOrPassword3 == "password"){
      this.textOrPassword3 = "text";
      this.icontype3 = "ion-ios-eye";
    }
    else{
      this.textOrPassword3 = "password";
      this.icontype3 = "ion-ios-eye";
    }
      }

  get forgotpasswordData(){
    return this.ForgotPasswordForm.controls;
  }

  navigatetoLogin(){

    this.router.navigateByUrl("/login");
    
  }

  onForgotPasswordOTPVerify(){

    this.spinnerService.show();
    this.next1 = true;
    if (this.ForgotPasswordForm.invalid) {

      this.showFailureToast('Please check the password validation/OTP','Forgot Password');
      this.spinnerService.hide();
      return true;
      
    }
    else{
    let data = {
      username: this.username,
      password: this.ForgotPasswordForm.value.newPassword,
      otp: this.ForgotPasswordForm.value.forgotPasswordOtp
    }
    if(this.ForgotPasswordForm.value.newPassword!=""){
      this.authenticateService.validateLogin(data).then(res => {
        this.forgotPasswordResponse = res;
        if(this.forgotPasswordResponse.MessType=='2'){
          this.spinnerService.hide();
          this.showSuccessToast(this.forgotPasswordResponse.MessText,'Forgot Password');
          this.router.navigateByUrl("/login");
         
        }
            else{
              this.spinnerService.hide();
              this.showFailureToast(this.forgotPasswordResponse.MessText,'Forgot Password');
            }

        });
    }
  }
  }
  showSuccessToast(message,heading) {
    this.toastr.success(message, heading, {
      timeOut: 1000,
      positionClass: 'toast-top-center',
    });
  }

  showFailureToast(message,heading) {
    this.toastr.error(message, heading, {
      timeOut: 1000,
      positionClass: 'toast-top-center',
    });
  }
}
