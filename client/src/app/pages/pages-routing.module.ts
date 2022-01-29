// import { NoBorrowCertComponent } from './certificate-requests/no-borrow-cert/no-borrow-cert.component';
// import { NoObliCertComponent } from './certificate-requests/no-obli-cert/no-obli-cert.component';
// import { RepresentationLetterComponent } from './new-request/representation-letter/representation-letter.component';
// import { LoanApplicationComponent } from './new-request/loan-application/loan-application.component';
// import { PreliminaryRequestComponent } from './new-request/preliminary-request/preliminary-request.component';
// import { NewRequestComponent } from './new-request/new-request.component';
// import { ComplaintsComponent } from './communications/complaints/complaints.component';
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { UsersComponent } from "./users/users.component";
import { MyLoansComponent } from "./my-loans/my-loans.component";
import { ComplaintsComponent } from "./communications/complaints/complaints.component";
import { PreliminaryRequestComponent } from "./new-request/preliminary-request/preliminary-request.component";
import { LoanApplicationComponent } from "./new-request/loan-application/loan-application.component";
import { LoanApplicationProjectInformationComponent } from "./new-request/loan-application/project-information/project-information.component";
import { LoanApplicationMarketingInformationComponent } from './new-request/loan-application/marketing-information/marketing-information.component';
import { LoanApplicationTechnicalInformationComponent } from './new-request/loan-application/technical-information/technical-information.component';
import { LoanApplicationFinancialInformationComponent } from './new-request/loan-application/financial-information/financial-information.component';
import { LoanApplicationRCJInformationComponent } from './new-request/loan-application/rcj-information/rcj-information.component';
import { LoanApplicationRCJQuestionnaireComponent } from './new-request/loan-application/rcj-questionnaire/rcj-questionnaire.component';
import { LoanApplicationRCYInformationComponent } from './new-request/loan-application/rcy-information/rcy-information.component';
import { LoanApplicationRCYQuestionnaireComponent } from './new-request/loan-application/rcy-questionnaire/rcy-questionnaire.component';
import { LoanApplicationChecklistComponent } from './new-request/loan-application/checklist/checklist.component';
import { RepresentationLetterComponent } from "./new-request/representation-letter/representation-letter.component";
import { NoObliCertComponent } from "./certificate-requests/no-obli-cert/no-obli-cert.component";
import { NoBorrowCertComponent } from "./certificate-requests/no-borrow-cert/no-borrow-cert.component";
import { SendRequestComponent } from './communications/send-request/send-request.component';
import { ReceiveRequestComponent } from './communications/receive-request/receive-request.component';
import { CreateLoanComponent } from './new-request/loan-application/create-loan/create-loan.component';
import { CreatePrqComponent } from "./new-request/preliminary-request/create-prq/create-prq.component";
import { ReceiveRequestCommunication } from "./communications/receive-request/receive-request-communication/receive-request-communication.component";
import { NewComplaintComponent } from './communications/complaints/new-complaint/new-complaint.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { ModonLandForm1Component } from './new-request/loan-application/modon-land-form1/modon-land-form1.component';
import { ModonLandLogisticFormComponent } from './new-request/loan-application/modon-land-logistic-form/modon-land-logistic-form.component';
import { ModonLandForm2Component } from './new-request/loan-application/modon-land-form2/modon-land-form2.component';

import { FactoryLoanComponent } from './new-request/loan-application/factory-loan/factory-loan.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { RepresentativesComponent } from './customer-profile/representatives/representatives.component';

//import { DocumentsDialogComponent } from './communications/receive-request/documents/documents.component';
// import { LoginComponent } from './login/login.component';ReceiveRequestCommunication

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "users",
        component: UsersComponent
      },
      // {
      //   path: "login",
      //   component: LoginComponent
      // },
      {
        path: "client-dashboard",
        component: ClientDashboardComponent
      },
      {
        path: "my-loans",
        component: MyLoansComponent
      },
      {
        path: "communications/complaints",
        component: ComplaintsComponent
      },
      {
        path: "communications/complaints/new-complaint/new-complaint.component",
        component: NewComplaintComponent
      },
      {
        path: "communications/send-request",
        component: SendRequestComponent
      },
      {
        path: "communications/receive-request",
        component: ReceiveRequestComponent
      },
      {
        path: "communications/receive-request/receive-request-communication/receive-request-communication",
        component: ReceiveRequestCommunication
      },
      // {
      //   path: "communications/receive-request/documents/documents",
      //   component: DocumentsDialogComponent
      // },
      {
        path: "new-request/preliminary-request",
        component: PreliminaryRequestComponent,

      },
      {
        path: "new-request/loan-application/create-loan",
        component: CreateLoanComponent
      },
      {
        path: "new-request/preliminary-request/:serviceId",
        component: PreliminaryRequestComponent,

      },
      {
        path: "new-request/preliminary-request/create-prq/create-prq",
        component: CreatePrqComponent,
      },

      {
        path: "customer-profile",
        component: CustomerProfileComponent
      },
      {
        path: "customer-profile/representatives",
        component: RepresentativesComponent
      },

      {
        path: "new-request/loan-application/0/create-loan",
        component: CreateLoanComponent
      },
      {
        path: "new-request/loan-application/project-information",
        component: LoanApplicationProjectInformationComponent
      },
      {
        path: "new-request/loan-application/marketing-information",
        component: LoanApplicationMarketingInformationComponent
      },
      {
        path: "new-request/loan-application/technical-information",
        component: LoanApplicationTechnicalInformationComponent
      },
      {
        path: "new-request/loan-application/financial-information",
        component: LoanApplicationFinancialInformationComponent
      },
      {
        path: "new-request/loan-application/land-form1",
        component: ModonLandForm1Component
      },
      {
        path: "new-request/loan-application/land-logistic-form",
        component: ModonLandLogisticFormComponent
      },
      {
        path: "new-request/loan-application/land-form2",
        component: ModonLandForm2Component
      },
      {
        path: "new-request/loan-application/factory-loan",
        component: FactoryLoanComponent
      },
      {
        path: "new-request/loan-application/rcj-information",
        component: LoanApplicationRCJInformationComponent
      },
      {
        path: "new-request/loan-application/rcj-questionnaire",
        component: LoanApplicationRCJQuestionnaireComponent
      },
      {
        path: "new-request/loan-application/rcy-information",
        component: LoanApplicationRCYInformationComponent
      },
      {
        path: "new-request/loan-application/rcy-questionnaire",
        component: LoanApplicationRCYQuestionnaireComponent
      },
      {
        path: "new-request/loan-application/checklist",
        component: LoanApplicationChecklistComponent
      },
      {
        path: "new-request/representation-letter",
        component: RepresentationLetterComponent
      },
      {
        path: "new-request/loan-application/:serviceId",
        component: LoanApplicationComponent
      },

      {
        path: "certificate-requests/no-borrow-cert",
        component: NoBorrowCertComponent
      },
      {
        path: "certificate-requests/no-borrow-cert",
        component: NoBorrowCertComponent
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "**",
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
