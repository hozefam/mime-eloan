import { AdminRouteGuard } from './services/adminRoute-guard.service';

import { RouterModule, Routes, CanActivate } from "@angular/router";
import { NgModule } from "@angular/core";

import { AdminComponent } from "./admin.component";
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RCYRequestsComponent } from './rcy-requests/rcy-requests.component';
import { RcyInformationComponent } from './rcy-information/rcy-information.component';
import { RcyQuestionnaireComponent } from './rcy-questionnaire/rcy-questionnaire.component';
import { RcyInvesterinformationComponent } from './rcy-investerinformation/rcy-investerinformation.component';
import { RcyActionComponent } from './rcy-action/rcy-action.component';
import { RCJRequestsComponent } from "./rcj/rcj-requests.component";
import { UserAdminComponent } from './users/users_Admin.component';
import { SummaryStatusRequestsComponent } from './summaryStatus/summaryStatus.component';
import { UserChangePasswordComponent } from './changePassword/users_changePassword.component';



const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "Admin-Dashboard-RCJ",
        component: AdminDashboardComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 30, 10], serviceid: 9 }


      },
      {
        path: "Admin-Dashboard-RCY",
        component: AdminDashboardComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 10, 40], serviceid: 10 }


      },
      {
        path: "rcy-requests/:serviceId",
        component: RCYRequestsComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 40, 10] }
      },

      {
        path: "rcy-investerinformation",
        component: RcyInvesterinformationComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 40, 10] }
      },
      {
        path: "rcy-information",
        component: RcyInformationComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 10, 40] }
      },
      {
        path: "rcy-questionnaire",
        component: RcyQuestionnaireComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 10, 40] }
      },
      {
        path: "rcy-action",
        component: RcyActionComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 10, 40] }
      },
      {
        path: "rcj-requests/:serviceId",
        component: RCJRequestsComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 30, 10] }
      },
      {
        path: "users",
        component: UserAdminComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1] }
      },
      {
        path: "SummaryStatus",
        component: SummaryStatusRequestsComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 10] }
      },
      {
        path: "changePassword",
        component: UserChangePasswordComponent

      },

      {
        path: "rcj-requests/:serviceId/:selectedStatus",
        component: RCJRequestsComponent,
        canActivate: [AdminRouteGuard],
        data: { roles: [0, 1, 10, 30] }
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
