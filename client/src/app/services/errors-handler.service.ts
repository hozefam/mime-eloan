import { Injectable, Injector, ErrorHandler } from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import { nonBorrowingCertificateService } from '../services/non-BorrowingCertificate.service'
import { CustomerProfileService } from '../services/customer-profile.service'
import { CommonService } from '../services/common.service'
@Injectable({
  providedIn: 'root',
})
export class ErrorsHandler extends ErrorHandler{
    userId = '';
    userName = '';
    profileId = '';
    temp5;
  constructor(
    private injector: Injector) {
    super();
  }

  handleError(error: Error) {
    super.handleError(error);
    // Log Errors in file
    // console.log("Log error");
    const customerProfileService = this.injector.get(CustomerProfileService);
    const NonBorrowingCertificateService = this.injector.get(nonBorrowingCertificateService);
    const commonService = this.injector.get(CommonService);
    var pageUrl = this.getPath();
    if(pageUrl != "/login")
      NonBorrowingCertificateService.postExceptions(pageUrl, (this.findBrowser() + " : " + error.message + "------" + error.stack), customerProfileService.currentCustomerProfile.UserId
        , customerProfileService.currentCustomerProfile.UserName, customerProfileService.currentCustomerProfile.customerProfileId)
    commonService.showFailureToast("Something went wrong, please try again later");
    
    console.log('Via Custom Error Handler: ' + error.toString());
         // / Log Errors in file

  }

  handleTryCatch(defaulterror, errorMessage){
    // Log Errors in file
    const customerProfileService = this.injector.get(CustomerProfileService);
    const NonBorrowingCertificateService = this.injector.get(nonBorrowingCertificateService);
    const commonService = this.injector.get(CommonService);
      var pageUrl = this.getPath();
      NonBorrowingCertificateService.postExceptions(pageUrl, (this.findBrowser() +" : " + defaulterror.message + "------" + defaulterror.stack + "-----" + errorMessage), customerProfileService.currentCustomerProfile.UserId
        , customerProfileService.currentCustomerProfile.UserName, customerProfileService.currentCustomerProfile.customerProfileId)
    // commonService.showFailureToast("Something went wrong, please try again later");
     console.log('Via Custom Error Handler: ' + defaulterror.message);
         // / Log Errors in file
  }

  private getPath(): string {
    const location = this.injector.get(LocationStrategy);
    return location instanceof PathLocationStrategy ? location.path() : '';
}

findBrowser() {
  var ua= navigator.userAgent, tem,
  M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
      tem= ua.match(/\b(OPR|Edge?)\/(\d+)/);
      if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
  }
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M.join(' ');
}


}
