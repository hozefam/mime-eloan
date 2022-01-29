import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { ThemeModule } from "../@theme/theme.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { UsersComponent } from './users/users.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MyLoansComponent } from './my-loans/my-loans.component';
import { CommunicationsComponent } from './communications/communications.component';
import { ComplaintsComponent } from './communications/complaints/complaints.component';
import { ComplaintsModalComponent } from './communications/complaints/complaints-modal/complaints-modal.component';
import { ReceiveRequestCommunicationModalComponent } from './communications/receive-request/receive-request-communication/receive-request-communication-modal/receive-request-communication-modal.component';
import {MatSelectModule} from '@angular/material/select';
import { NewRequestComponent } from './new-request/new-request.component';
import { PreliminaryRequestComponent } from './new-request/preliminary-request/preliminary-request.component';
import { PreliminaryRequestModalsComponent } from './new-request/preliminary-request/preliminary-request-modals/preliminary-request-modals.component';
import { LoanApplicationComponent } from './new-request/loan-application/loan-application.component';
import { LoanApplicationProjectInformationComponent } from './new-request/loan-application/project-information/project-information.component';
import { LoanApplicationMarketingInformationComponent } from './new-request/loan-application/marketing-information/marketing-information.component';
import { MarketingInformationModalsComponent } from './new-request/loan-application/marketing-information/marketing-information-modals/marketing-information-modals.component';
import { FinancialInformationModalsComponent } from './new-request/loan-application/financial-information/financial-information-modals/financial-information-modals.component';
import { LoanApplicationTechnicalInformationComponent } from './new-request/loan-application/technical-information/technical-information.component';
import { LoanApplicationFinancialInformationComponent } from './new-request/loan-application/financial-information/financial-information.component';
import { LoanApplicationRCJInformationComponent } from './new-request/loan-application/rcj-information/rcj-information.component';
import { LoanApplicationRCJQuestionnaireComponent } from './new-request/loan-application/rcj-questionnaire/rcj-questionnaire.component';
import { LoanApplicationRCYInformationComponent } from './new-request/loan-application/rcy-information/rcy-information.component';
import { LoanApplicationRCYQuestionnaireComponent } from './new-request/loan-application/rcy-questionnaire/rcy-questionnaire.component';
import{CKEditorModule}from 'ng2-ckeditor';
import { LoanApplicationChecklistComponent } from './new-request/loan-application/checklist/checklist.component';
import { RepresentationLetterComponent } from './new-request/representation-letter/representation-letter.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CertificateRequestsComponent } from './certificate-requests/certificate-requests.component';
import { NoObliCertComponent } from './certificate-requests/no-obli-cert/no-obli-cert.component';
import { NoBorrowCertComponent } from './certificate-requests/no-borrow-cert/no-borrow-cert.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
//
// import { ShowHidePasswordModule } from 'ngx-show-hide-password';
//import { LoginComponent } from './login/login.component';
import { ProjectOwnershipModalsComponent } from './new-request/loan-application/project-information/project-ownership-modals/project-ownership-modals.component';
import { ModalLandForm1ModalsComponent } from './new-request/loan-application/modon-land-form1/modon-landform1-modals/modon-landform1-modals.component';
import { ProjectOwnershipGuarantorsModalsComponent } from './new-request/loan-application/project-information/project-ownership-guarantors-modals/project-ownership-guarantors-modals.component';

import { MatExpansionModule, MatIconModule, MatCheckboxModule, MatButtonModule, MatInputModule, MatButtonToggleModule, MatTooltipModule, MatFormFieldModule } from '@angular/material';
import { NbChatModule, NbAccordionModule, NbAlertModule, NbCheckboxModule, NbStepperModule, NbListModule, NbSelectModule, NbProgressBarModule, NbCalendarModule, NbSpinnerModule } from '@nebular/theme';
import { NewComplaintComponent } from './communications/complaints/new-complaint/new-complaint.component';
import { TranslateModule } from '@ngx-translate/core';
import { SendRequestComponent } from './communications/send-request/send-request.component';
import { TechInfoModalsComponent } from "./new-request/loan-application/technical-information/tech-info-modals/tech-info-modals.component";
import { MachQuotModalsComponent } from "./new-request/loan-application/technical-information/machinery-quotation-modals/machinery-quotation-modals.component";

import { ReceiveRequestComponent } from './communications/receive-request/receive-request.component';
import { CreateLoanComponent } from './new-request/loan-application/create-loan/create-loan.component';
import { CreatePrqComponent } from './new-request/preliminary-request/create-prq/create-prq.component';

import { ReceiveRequestCommunication } from './communications/receive-request/receive-request-communication/receive-request-communication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardPanelComponent } from './dashboard/dashboard-panel/dashboard-panel.component';
import { DashboardTransactionsComponent } from './dashboard/dashboard-transactions/dashboard-transactions.component';
import { DashboardCalenderComponent } from './dashboard/dashboard-calender/dashboard-calender.component';
import { DashboardRatingComponent } from './dashboard/dashboard-rating/dashboard-rating.component';
import { DashboardNewsComponent } from './dashboard/dashboard-news/dashboard-news.component';
import { ComponentsModule } from '../components/components.module';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxEditorModule } from 'ngx-editor';
import { MatDividerModule } from '@angular/material/divider';

import { DocumentViewComponent } from './communications/receive-request/document-view/document-view.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';

import { ServiceDescriptionComponent } from './service-description/service-description.component';
import { ServiceConditionsComponent } from './service-conditions/service-conditions.component';
import { ModonLandForm1Component } from './new-request/loan-application/modon-land-form1/modon-land-form1.component';
import { ModonLandLogisticFormComponent } from './new-request/loan-application/modon-land-logistic-form/modon-land-logistic-form.component';
import { ModonLandForm2Component } from './new-request/loan-application/modon-land-form2/modon-land-form2.component';
import { SmartTableDatepickerRenderComponent } from './new-request/loan-application/marketing-information/marketing-information.component';
import { SmartTableDatepickerComponent } from './new-request/loan-application/marketing-information/marketing-information.component';

import { FactoryLoanComponent } from './new-request/loan-application/factory-loan/factory-loan.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { RepresentativesComponent } from './customer-profile/representatives/representatives.component';
import { ProfileModalComponent } from "./customer-profile/profile-modal/profile-modal.component";
import { RepresentativesModalsComponent } from "./customer-profile/representatives/representatives-modals/representatives-modals.component";
//import { NbSpinnerModule } from 
import {DropdownModule} from 'primeng/primeng';
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,DropdownModule,
    CKEditorModule,
    MiscellaneousModule,
    MatSelectModule,
    Ng2SmartTableModule,
    MatExpansionModule,
    MatButtonModule, MatInputModule, MatButtonToggleModule, MatTooltipModule, MatFormFieldModule,
    MatIconModule,
    NbChatModule,
    NbAccordionModule,
    NbAlertModule,
    MatCheckboxModule,
    NbCheckboxModule,
    NbStepperModule,
    NbListModule,
    TranslateModule,
    NbSelectModule,
    NbProgressBarModule, NbCalendarModule, ComponentsModule, NbSpinnerModule,
    NgxEchartsModule,
    NgxEditorModule,
    MatDividerModule,
    AngularMultiSelectModule,
    BsDatepickerModule.forRoot()
  ],

  declarations: [...PAGES_COMPONENTS, UsersComponent, MyLoansComponent, CommunicationsComponent,
    ComplaintsComponent,ComplaintsModalComponent,ReceiveRequestCommunicationModalComponent, NewRequestComponent, PreliminaryRequestComponent, SmartTableDatepickerComponent, PreliminaryRequestModalsComponent,
    LoanApplicationComponent, LoanApplicationProjectInformationComponent, LoanApplicationMarketingInformationComponent, MarketingInformationModalsComponent,
    LoanApplicationTechnicalInformationComponent, LoanApplicationFinancialInformationComponent, LoanApplicationRCJInformationComponent, LoanApplicationRCJQuestionnaireComponent, LoanApplicationChecklistComponent,
    RepresentationLetterComponent, CertificateRequestsComponent, SmartTableDatepickerRenderComponent, NoObliCertComponent, NoBorrowCertComponent,

    NewUserComponent, TopmenuComponent,NewComplaintComponent, FinancialInformationModalsComponent,ModalLandForm1ModalsComponent, ProjectOwnershipModalsComponent, ProjectOwnershipGuarantorsModalsComponent, TechInfoModalsComponent, SendRequestComponent, MachQuotModalsComponent, ReceiveRequestComponent, CreateLoanComponent, CreatePrqComponent, ReceiveRequestCommunication, DocumentViewComponent, DashboardComponent, DashboardPanelComponent, DashboardTransactionsComponent, DashboardCalenderComponent, DashboardRatingComponent, DashboardNewsComponent, ClientDashboardComponent,ModonLandLogisticFormComponent, ModonLandForm1Component, ModonLandForm2Component, FactoryLoanComponent, CustomerProfileComponent, RepresentativesComponent
    , LoanApplicationFinancialInformationComponent, LoanApplicationRCJInformationComponent, LoanApplicationRCJQuestionnaireComponent, LoanApplicationRCYInformationComponent, LoanApplicationRCYQuestionnaireComponent, LoanApplicationChecklistComponent,
    RepresentationLetterComponent, CertificateRequestsComponent, SmartTableDatepickerRenderComponent, NoObliCertComponent, NoBorrowCertComponent,

    NewUserComponent, NewComplaintComponent, FinancialInformationModalsComponent,ModalLandForm1ModalsComponent, ProjectOwnershipModalsComponent, ProjectOwnershipGuarantorsModalsComponent, TechInfoModalsComponent, SendRequestComponent, MachQuotModalsComponent, ReceiveRequestComponent, CreateLoanComponent, CreatePrqComponent, ReceiveRequestCommunication, DocumentViewComponent, DashboardComponent, DashboardPanelComponent, DashboardTransactionsComponent, DashboardCalenderComponent, DashboardRatingComponent, DashboardNewsComponent, ClientDashboardComponent,ModonLandLogisticFormComponent, ModonLandForm1Component, ModonLandForm2Component, FactoryLoanComponent, CustomerProfileComponent, RepresentativesComponent
    , ProfileModalComponent, RepresentativesModalsComponent
    // ServiceConditionsComponent, ServiceDescriptionComponent
  ],

  entryComponents: [NewUserComponent,TopmenuComponent, PreliminaryRequestModalsComponent,ModalLandForm1ModalsComponent, ProjectOwnershipModalsComponent, ProjectOwnershipGuarantorsModalsComponent, TechInfoModalsComponent, MachQuotModalsComponent, MarketingInformationModalsComponent, FinancialInformationModalsComponent, DocumentViewComponent, RepresentativesModalsComponent]

})
export class PagesModule { } 