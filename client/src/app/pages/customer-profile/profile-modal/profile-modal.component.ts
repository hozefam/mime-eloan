import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateService } from "../../../services/authenticate.service";
import { CommonService } from "../../../services/common.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'ngx-profile-modal',
  templateUrl: 'profile-modal.component.html',
  styleUrls: ['profile-modal.component.scss'],
})
export class ProfileModalComponent {

  modalHeader: string;
  modalContent = `FORM TO EDIT HERE`;
  currentPassword = "";
  newPassword = "";
  // profileId;

  translate: any;

  

  icontype1 = "ion-ios-eye";
  icontype2 = "ion-ios-eye";
  icontype3 = "ion-ios-eye";

  confirmPassword ="";

  textOrPassword1 = "password";
  textOrPassword2 = "password";
  textOrPassword3 = "password";

  strength = 0;

  hprogress: boolean = true;

  constructor(private authenticateService: AuthenticateService, public commonService: CommonService, private activeModal: NgbActiveModal,
    private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService) {

      this.translate = this.commonService.returnTranslate();
      // console.log("hi");
     }

  changePassword(){
    // console.log("hi");
   var  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!*?&])[A-Za-z0-9@#$!*?&]{8,}$/;
    // console.log(this.profileId)
if(passwordPattern.test(this.newPassword)){
    if(this.confirmPassword == this.newPassword){
      
    this.Ng4LoadingSpinnerService.show();
    if(this.currentPassword && this.newPassword)
     this.authenticateService.changePasswordService("", this.currentPassword,this.newPassword)
      .then((res) => (this.resolveChangePassword(res), this.Ng4LoadingSpinnerService.hide())), err => (this.commonService.showFailureToast(err), this.Ng4LoadingSpinnerService.hide());

    }
    else{
      this.commonService.showFailureToast("Passwords didn't match!!");
    }
  }
  else{
    this.commonService.showFailureToast("Enter a Valid Password to change");
  }
  
}

  resolveChangePassword(res){
    if(res.MessType === "S"){

      this.commonService.showSuccessToast(res.MessText);

      this.closeModal();

      this.Ng4LoadingSpinnerService.hide();
    }
    else{

      this.commonService.showFailureToast(res.MessText);

      this.Ng4LoadingSpinnerService.hide();
    }

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

  passStrength(event){
        //console.log(event);
       //  console.log(event.target.value);
        //console.log(event.keyCode);
       this.hprogress = false;
        var strnth = 0;
       
       
         if(event.target.value.match(/[a-zA-Z][a-zA-Z]+/)){
       
           strnth += 1;
               
          }
          if(event.target.value.match(/[0-9][0-9]+/)){
       
           strnth += 1;
               
          }
       
         if(event.target.value.match(/[!@$%#^&*()]+/)){
       
           strnth += 1;
         
         }
         if(event.target.value.length >= 8){
       
           strnth += 1;
         //console.log(this.strength)
         }
         if(event.target.value.length >= 10){
       
           strnth += 1;
         
         }
       
       switch (strnth){
       
               case 0:{ this.strength = 0;}
               break;
       
               case 1:{ this.strength = 20;}
               break;
       
               case 2:{ this.strength = 40;}
               break;
       
               case 3: {this.strength = 60;}
               break;
       
               case 4: {this.strength = 80;}
               break;
       
               case 5: {this.strength = 100;}
               break;
       
               
       }
       
         
       
      }

  closeModal() {
    this.activeModal.close();
  }
}
