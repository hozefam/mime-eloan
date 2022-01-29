import { AbstractControl } from '@angular/forms';
import { actionType } from './../model/actionType.enum';
import { AdminUserService } from './../services/admin-User.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { Router, ActivatedRoute, ActivationEnd, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RCYRequestsService } from "../../services/rcyrequests.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { User } from './../model/admin_User.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-users_changePassword',
  templateUrl: './users_changePassword.component.html',
  styleUrls: ['./users_changePassword.component.scss']
})
export class UserChangePasswordComponent implements OnInit {

  translate = this.commonService.returnTranslate();
  source: any = [];
  adminuser: any = {};
  delete_User:boolean=false;
  IsEdit:boolean=false;
  display: boolean = false;
  displaydl: boolean = false;
  modalTitle:string="";
  btnmodalTitle:string="";
  user:User=new User();
  actionType:actionType;
  userRole:any;
  changePasswordForm:FormGroup;

  constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService, private adminUserService: AdminUserService,
    private customerProfileService: CustomerProfileService,
    protected localStorage: LocalStorage,
    private router: Router,fb: FormBuilder) {
      this.changePasswordForm = fb.group({
        'old_password': [null, Validators.required],
        'new_password': [null, Validators.required],
        'confirm_new_password': [null, [Validators.required, this.passwordMatch]] 
    });
     }

  ngOnInit() {
    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      this.adminuser = data;
      this.user.UserName=data.UserName;
      this.user.Role=data.Role;
    });

  }
  passwordMatch(control: AbstractControl){
    
    let paswd = control.root.get('new_password');
    if(paswd && control.value != paswd.value){
     return {
         passwordMatch: false
     };   
    }
    return null;
}

changePassword(value){
    if(this.changePasswordForm.valid){
      this.changePass(value);
    }
}
  changePass(value) {
    
    this.spinnerService.show();
    this.user.Password=value.new_password;
    try {
      this.adminUserService
        .UserChangePass(this.user).then((requests:any) => {
          if (requests){
                      
            if( requests.Cofinancers != null && requests.Cofinancers[0].MessType === "E") {
              this.commonService.showFailureToast(requests.Cofinancers[0].MessText);
        }
          else{this.commonService.showSuccessToast(requests.Message);  this.router.navigateByUrl('/admin-login');}
        }}), err => this.commonService.showFailureToast(err);
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
    this.spinnerService.hide();
  }




  
}
