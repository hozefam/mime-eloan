import { AdminRouteGuard } from './services/adminRoute-guard.service';
import { NgModule } from "@angular/core";

import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { ThemeModule } from "../@theme/theme.module";
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { MatExpansionModule, MatIconModule, MatCheckboxModule, MatButtonModule, MatInputModule, MatButtonToggleModule, MatTooltipModule, MatFormFieldModule } from '@angular/material';
import { NbChatModule, NbAccordionModule, NbAlertModule, NbCheckboxModule, NbListModule, NbSelectModule, NbProgressBarModule, NbCalendarModule, NbSpinnerModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ChartsModule } from 'ng2-charts';


import { ComponentsModule } from '../components/components.module';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxEditorModule } from 'ngx-editor';
import { MatDividerModule } from '@angular/material/divider';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RCYRequestsComponent } from './rcy-requests/rcy-requests.component';
import { RcyInformationComponent } from './rcy-information/rcy-information.component';
import { RcyQuestionnaireComponent } from './rcy-questionnaire/rcy-questionnaire.component';
import { RcyInvesterinformationComponent } from './rcy-investerinformation/rcy-investerinformation.component';
import { RcyActionComponent } from './rcy-action/rcy-action.component';
import { WINDOW_PROVIDERS } from './window.providers';
import { SampleService } from './services';
import { RCJRequestsComponent } from "./rcj/rcj-requests.component";
import { Ng5SliderModule } from "ng5-slider";
import { RCJAdminDashboardComponent } from "./rcj/rcjAdmin-dashboard/rcjAdmin-dashboard.component";
import { UserAdminComponent } from './users/users_Admin.component';
import { DialogModule } from 'primeng/dialog';
import { SummaryStatusRequestsComponent } from './summaryStatus/summaryStatus.component';
import { UserChangePasswordComponent } from './changePassword/users_changePassword.component';


//import { NbSpinnerModule } from 

const ADMIN_COMPONENTS = [AdminComponent];

@NgModule({
  imports: [
    AdminRoutingModule, Ng5SliderModule,
    ThemeModule, ChartsModule,
    Ng2SmartTableModule,
    MatExpansionModule,
    MatButtonModule, MatInputModule, MatButtonToggleModule, MatTooltipModule, MatFormFieldModule,
    MatIconModule,
    NbChatModule,
    NbAccordionModule,
    NbAlertModule,
    MatCheckboxModule,
    NbCheckboxModule,
    NbListModule,
    TranslateModule,
    NbSelectModule,
    NbProgressBarModule, NbCalendarModule, ComponentsModule, NbSpinnerModule,
    NgxEchartsModule,
    NgxEditorModule,
    MatDividerModule,
    AngularMultiSelectModule, DialogModule,
    BsDatepickerModule.forRoot()
  ],

  declarations: [...ADMIN_COMPONENTS, AdminDashboardComponent, RCYRequestsComponent,
    RcyInformationComponent, RcyQuestionnaireComponent, RcyInvesterinformationComponent,
    RcyActionComponent, RCJRequestsComponent, RCJAdminDashboardComponent,
    UserAdminComponent,
    SummaryStatusRequestsComponent, UserChangePasswordComponent

  ],
  providers: [WINDOW_PROVIDERS, SampleService, AdminRouteGuard],
  entryComponents: []

})
export class AdminModule { } 