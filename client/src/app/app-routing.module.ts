import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HomeComponent } from "./pages/home/home.component";
import { SitemapComponent } from "./pages/sitemap/sitemap.component";
import { AboutusComponent } from "./pages/aboutus/aboutus.component";
import { FaqComponent } from "./pages/faq/faq.component";
import { TopmenuComponent } from "./pages/topmenu/topmenu.component";
import { AdminAreaLoginComponent } from "./AdminArea/login/login.component";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import{CKEditorModule}from 'ng2-ckeditor';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from "@nebular/auth";
import { RouteGuard } from "./route-guard.service";
import { ServiceDescriptionComponent } from './pages/service-description/service-description.component';
import { ServiceConditionsComponent } from './pages/service-conditions/service-conditions.component';


const routes: Routes = [
  {
    path: "pages",
    loadChildren: "app/pages/pages.module#PagesModule",
    canActivate: [RouteGuard],
    canActivateChild: [RouteGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: "AdminArea",
    loadChildren: "app/AdminArea/admin.module#AdminModule",
    // canActivate: [RouteGuard],
    // canActivateChild: [RouteGuard],
    // runGuardsAndResolvers: 'always',
    //component: AdminAreaLoginComponent
  },

  {
    path: "admin-login",
    component: AdminAreaLoginComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup/:id",
    component: SignupComponent
  },
  {
    path: "forgotpassword",
    component: ForgotpasswordComponent
  },
  {
    path: "contactus",
    component: ContactUsComponent
  },
  {
    path: "home",
    component: HomeComponent
  }, 
  {
    path: "sitemap",
    component: SitemapComponent
  },
  {
    path: "about",
    component: AboutusComponent
  },
  {
    path: "faq",
    component: FaqComponent
  },
  {
    path: "product-description/:id",
    component: ServiceDescriptionComponent
  },
  {
    path: "product-conditions/:id",
    component: ServiceConditionsComponent
  },
  // {
  //   path: "Admin-Dashboard",
  //   component: AdminDashboardComponent
  // },

  // {
  //   path: "auth",
  //   component: NbAuthComponent,
  //   children: [
  //     {
  //       path: "",
  //       component: LoginComponent
  //     },
  //     {
  //       path: "login",
  //       component: LoginComponent
  //     },
  //     {
  //       path: "register",
  //       component: NbRegisterComponent
  //     },
  //     {
  //       path: "logout",
  //       component: NbLogoutComponent
  //     },
  //     {
  //       path: "request-password",
  //       component: NbRequestPasswordComponent
  //     },
  //     {
  //       path: "reset-password",
  //       component: NbResetPasswordComponent
  //     }
  //   ]
  // },
  // {
  //   path: "mine",
  //   loadChildren: "app/pages/login/login.module"
  // },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "login" }
];

const config: ExtraOptions = {
  useHash: false,
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [CKEditorModule,RouterModule.forRoot(routes, config)],
  exports: [RouterModule,CKEditorModule]
})
export class AppRoutingModule { }
