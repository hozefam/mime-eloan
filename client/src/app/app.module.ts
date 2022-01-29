/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ThemeModule } from "./@theme/theme.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouteGuard } from "./route-guard.service";
import { NbAuthJWTInterceptor } from "@nebular/auth"; //NB_AUTH_TOKEN_INTERCEPTOR_FILTER
import{CKEditorModule}from 'ng2-ckeditor';
//import { NbAuthJWTInterceptor, NB_AUTH_TOKEN_INTERCEPTOR_FILTER} from "@nebular/auth";
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { HomeComponent } from './pages/home/home.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { FaqComponent } from "./pages/faq/faq.component";
import { TopmenuComponent } from './pages/topmenu/Topmenu.component';

import { NbStepperModule, NbSelectModule } from '@nebular/theme';
import { ToastrModule } from 'ngx-toastr';
import { SignupOtpModalComponent } from './pages/signup/signup-otp-modal/signup-otp-modal.component';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ComponentsModule } from './components/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ServiceDescriptionComponent } from "./pages/service-description/service-description.component";
import { ServiceConditionsComponent } from "./pages/service-conditions/service-conditions.component";
import { AdminAreaLoginComponent } from "./AdminArea/login/login.component";
//import { AdminDashboardComponent } from './AdminArea/admin-dashboard/admin-dashboard.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent, SignupOtpModalComponent, ForgotpasswordComponent, ContactUsComponent,TopmenuComponent,FaqComponent,AboutusComponent,SitemapComponent, HomeComponent,
    ServiceDescriptionComponent, ServiceConditionsComponent, AdminAreaLoginComponent
    //, AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbStepperModule,
    NbSelectModule, ComponentsModule,
    CKEditorModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ShowHidePasswordModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [SignupOtpModalComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: "/" },
    RouteGuard,
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
    // { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: (req) => false}
  ]
})
export class AppModule { }
