import { Component, Input, OnInit } from "@angular/core";

import { NbMenuService, NbSidebarService } from "@nebular/theme";
import { AnalyticsService } from "../../../@core/utils/analytics.service";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { filter, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { CommonService } from './../../../services/common.service';
import { rootRenderNodes } from "@angular/core/src/view";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html"
})

export class HeaderComponent implements OnInit {

  @Input()
  position = "normal";

  user: any = {};
  adminuser: any = {};
  userMenuSubscription: any;
  userAdminMenuSubscription: any;
  customerList: any = [];
  currentCustomer: any = {};
  ddlLanguages: any;
  defaultLanguage = { value: "ar", name: "AR" };
  userMenu = [{ title: "الملف الشخصي" }, { title: "تسجيل خروج" }];
  userMenuEn = [{ title: "Profile" }, { title: "Log out" }];
  userAdminMenu = [{ title: "Log out" }];
  languages = [{ value: "en", name: "EN" }, { value: "ar", name: "AR" }];
  customerProfiles: any = [];
  message: string;
  language:any="";
  constructor(

    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private customerProfileService: CustomerProfileService,
    private analyticsService: AnalyticsService,
    private authService: NbAuthService,
    private nbMenuService: NbMenuService,
    private router: Router,
    private translate: TranslateService,
    protected localStorage: LocalStorage,
    public commonService: CommonService,
    private directionService: NbLayoutDirectionService
    // private customerSerivce: CustomerService
  ) {

    this.handleUserMenu();

    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {

        this.user = token.getPayload();
        // if (this.user.userTypeId == 1) {
        // this.customerService.getCustomerList().then(res => {
        //   this.customerList = res;
        // });
        // } //else this.customerSerivce.selectCusotmer(this.user);

      }
    });

    this.localStorage.getItem('custProfile').subscribe((data) => {

      // alert(data); // null
      this.customerProfiles = data;

      if (this.customerProfiles != null) {

        if (this.customerProfiles.length > 0) {
this.selectedcustomerProfile={"BpName":data[0].BpName,"BpNum":data[0].BpNum,"CustomerProfile":data[0].CustomerProfile};
          // alert(data[0].CustomerProfile)
          this.setLSforProfile(data[0].CustomerProfile + ";" + data[0].BpNum);

        }

      }

    });

    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      this.adminuser = data;
      var test = this.user;
      if (this.adminuser != null || this.adminuser != undefined || this.adminuser != 'undefined')
        this.handleUserAdminMenu();
      else {
        this.router.navigateByUrl('/admin-login');
      }
    });
  }

  handleUserAdminMenu() {

    this.userAdminMenuSubscription = this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "useradmin-menu"),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        switch (title) {
          case "Log out":
            if (this.userAdminMenuSubscription) this.logOutAdmin();
            break;
        }
      });
  }
  // selectCustomer(customer) {
  //   this.currentCustomer = customer;
  //   this.customerSerivce.selectCusotmer(customer);
  //   this.router.navigateByUrl("/pages");
  // }

  handleUserMenu() {
    setTimeout(() => {
      this.commonService.setTranslate(this.translate.currentLang);
    }, 2000);
    this.userMenuSubscription = this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === "user-menu"),
        map(({ item: { title } }) => title)
      )
      .subscribe(title => {
        switch (title) {
          case "Profile":
            this.router.navigateByUrl('pages/customer-profile');
            this.customerProfileService.setCurrentUser(this.user);
            break;
          case "Log out":
            if (this.userMenuSubscription) this.logOut();
            break;
          case "الملف الشخصي":
          this.router.navigateByUrl('pages/customer-profile');
          this.customerProfileService.setCurrentUser(this.user);
          break;
          case "تسجيل خروج":
            if (this.userMenuSubscription) this.logOut();
            break;
        }
      });
  }

  logOutAdmin() {

    this.localStorage.removeItem('AdminLoginData').subscribe(() => { });
    this.router.navigateByUrl('/admin-login');
  }
  logOut() {
    this.localStorage.removeItem('custProfile').subscribe(() => { });
    this.localStorage.removeItem('AdminLoginData').subscribe(() => { });

    //this.localStorage.removeItem('lang').subscribe(() => { });
    // this.localStorage.removeItem('selCustProf').subscribe(() => {});
    this.authService.logout("email").subscribe(result => {

      let message, error;

      if (result.isSuccess()) {
        message = result.getMessages();
      } else {
        error = result.getErrors();
      }

      var redirect = result.getRedirect();

      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, 300);
      }

    });

  }

  ngOnInit() {
    this.commonService.currentProfiles.subscribe(customerProfiles => this.customerProfiles = customerProfiles);
    
    this.localStorage.getItem("lang").subscribe((data) => {
      this.language= data;
    })
    if(this.language!='ar'&& this.language!='en')
    this.language='ar';
    this.localStorage.setItem('lang', this.language).subscribe(() => {

      this.translate.use(this.language);

      this.translate.get('dir').subscribe(res => {
        this.directionService.setDirection(res == 'rtl' ? NbLayoutDirection.RTL : NbLayoutDirection.LTR);
      });

    }, (error) => {

      alert(error)

    });

    this.commonService.setTranslate('ar');
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    return false;
  }

  // toggleSettings(): boolean {
  //   this.sidebarService.toggle(false, "settings-sidebar");
  //   return false;
  // }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent("startSearch");
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
  selectedcustomerProfile:any;
  onCustProfileChange1(selValue){
    console.log(this.selectedcustomerProfile);
    console.log(selValue.CustomerProfile);
    this.setLSforProfile(selValue.CustomerProfile + ";" + selValue.BpNum);
  }
  onCustProfileChange(selValue) {

    console.log("changed customer value ");
    this.setLSforProfile(selValue);
    // window.location.reload(); 
  }

  setLSforProfile(profile) {

    if (profile != undefined)
      this.customerProfileService.selectedCusotmerProfile(profile);


    //  this.localStorage.setItem('selCustProf',profile).subscribe(() => {
    //    // Done
    //    }, (error) => {
    //      alert(error);
    //  });
    this.router.navigateByUrl('pages/client-dashboard');
    // this.router.navigateByUrl(this.router.url);

  }

  redirectToHomePage() {
    // this.router.navigateByUrl("/ihome");
  }
  receiveMessage($event) {

    this.message = $event
    console.log(this.message);

  }

}