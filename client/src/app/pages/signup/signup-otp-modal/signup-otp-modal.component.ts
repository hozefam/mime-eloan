import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from "../../../services/authenticate.service";
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'signup-otp-modal',
  templateUrl: './signup-otp-modal.component.html',
  styleUrls: ['./signup-otp-modal.component.scss']
})
export class SignupOtpModalComponent implements OnInit {

  //public number1: string = "0";
 
  SignupOtpModalForm:any = {};  
  signupOTPResponse:any={};
  valid: any;
  textOrPassword = "password";
  icontype = "ion-ios-eye";

  constructor(private activeModal: NgbActiveModal, private authenticateService: AuthenticateService, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  onSubmit(value){
    //var ng = this.SignupOtpModalForm = true;
    //this.activeModal.close();
    // return true;
if(value === 1)
{
    let data = {
      nationalityId: this.SignupOtpModalForm.nationalityId,
      typeofnationality:this.SignupOtpModalForm.typeofnationality,
      action:this.SignupOtpModalForm.action,
      otp_gen:"N",
      otp_ver:"N",
      wasselcall:"N",
      signupPhoneOTP: this.SignupOtpModalForm.inputs[0].value,
      emailId:"N",
      nationalityIdDob:this.SignupOtpModalForm.nationalityIdDob,
      licNum:"I",
      licVal:"N",
      usrId: this.SignupOtpModalForm.usrId,
      crnumber:"N",
      date:"N"

    }
    if(this.SignupOtpModalForm.inputs[0].value!=""){
      this.spinnerService.show();
      this.authenticateService.validateSignUp(data).then(res => {
        this.signupOTPResponse = res;
        // if(true){
        if(this.signupOTPResponse.ReqMess[0].MessType=='S'){
          this.spinnerService.hide();
          this.valid = true;
          this.showSuccessToast(this.signupOTPResponse.ReqMess[0].MessText);
          this.SignupOtpModalForm.buttons[0].handler(this.valid,this.signupOTPResponse); 
          this.activeModal.close();
   
        }
            else{
              this.spinnerService.hide();
              this.valid = false;
              this.showFailureToast(this.signupOTPResponse.ReqMess[0].MessText);
            }

        });
    }
    else{
      this.showFailureToast("Enter OTP to proceed.");
    }
  }
  else if(value ===2){
    
    this.SignupOtpModalForm.buttons[0].handler(); 
    this.activeModal.close();


  }

  }

  
  closeModal() {
    this.activeModal.close();
  }

  OnPasswordToggle(){
    if(this.textOrPassword == "password"){
      this.textOrPassword = "text";
      this.icontype = "ion-ios-eye";
    }
    else{
      this.textOrPassword = "password";
      this.icontype = "ion-ios-eye";
    }
      }


  showSuccessToast(message) {
    this.toastr.success(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });
  }

  showFailureToast(message) {
    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });
  }

}
