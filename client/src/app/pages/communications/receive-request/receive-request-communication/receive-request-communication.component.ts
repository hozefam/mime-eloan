import { CommonService } from '../../../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerProfileService } from "../../../../services/customer-profile.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ChatService } from './chat.service';
import { NbChatModule } from '@nebular/theme';
import { CommunicationsService } from "../../../../services/communications.service";
import { _ } from 'underscore';
import * as _l from 'lodash';
//import * as _s from 'underscore.string';
import { CommonCommentsService } from '../../../../services/common-comments.service';
import { ErrorsHandler } from '../../../../services/errors-handler.service';
import { ReceiveRequestCommunicationModalComponent } from './receive-request-communication-modal/receive-request-communication-modal.component';

@Component({
  selector: 'receive-request-communication',
  templateUrl: './receive-request-communication.component.html',
  styleUrls: ['./receive-request-communication.component.scss'],
  providers: [ChatService]
})

export class ReceiveRequestCommunication implements OnInit {
  documentStruc;

  configForCkEditor = {};

  documentIndex = 0;

  documentNames = [];

  documentIds = [];

  files = [];
  currentComment = "";
  isGenComments = false;
  isPrqComments = false;
  allpanelsexpanded = true;
  activeType = "LOAN";
  translate: any;
  messages: any[];
  communication = 0;
  subject = 0;
  comp_date = 0;
  req_desc = 0;
  project_id = 0;
  request_type = "";
  comments_text = "";
  received_requests_selects = [];

  messages_generalInfo: any[];
  messages_marketingInfo: any[];
  messages_technicalInfo: any[];
  messages_financialInfo: any[];
  selectedIndex;
  selectedrequests: any[];
  comm_id = 0;
  req_section = 0;
  comment_text = 0;
  user_id = 0;
  req_sub_section = 0;

  request_generalInfo: any = [];
  request_marketingInfo: any = [];
  request_technicalInfo: any = [];
  request_financialInfo: any = [];

  post_mess_geninfo = "";
  post_mess_markinfo = "";
  post_mess_techinfo = "";
  post_mess_fininfo = "";
  customer_profile_id;
  //project_info_comments = {isInbox: true, hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIGEN", commentDetails: {}, commentArray: [] };
  general_information_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIGEN", commentDetails: {}, commentArray: [] };
  project_profile_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIPRO", commentDetails: {}, commentArray: [] };
  project_ownership_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIOWN", commentDetails: {}, commentArray: [] };
  guarantors_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIGUA", commentDetails: {}, commentArray: [] };
  real_estates_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIRES", commentDetails: {}, commentArray: [] };
  list_of_companies_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PICOM", commentDetails: {}, commentArray: [] };
  other_investments_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIINV", commentDetails: {}, commentArray: [] };
  bank_details_comments_loan = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIBNK", commentDetails: {}, commentArray: [] };
  kpmr_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIKEY", commentDetails: {}, commentArray: [] };
  assetDetails_comments_loan = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONPI", SubSectionCode: "PIAST", commentDetails: {}, commentArray: [] };
  //
  //marketing information
  product_details_comments_marketing = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIPRO", commentDetails: {}, commentArray: [] };
  sponsor_product_sales__comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MISPO", commentDetails: {}, commentArray: [] };
  target_market_region_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MITAR", commentDetails: {}, commentArray: [] };
  target_market_segments_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MITMS", commentDetails: {}, commentArray: [] };
  factories_target_market_region_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIFAC", commentDetails: {}, commentArray: [] };
  import_competitors_market_region_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIIMP", commentDetails: {}, commentArray: [] };
  historical_product_demand_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIPDE", commentDetails: {}, commentArray: [] };
  expected_sales_volume_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIEXS", commentDetails: {}, commentArray: [] };
  targeted_end_users_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIENU", commentDetails: {}, commentArray: [] };
  sponsor_proposed_price_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIPRI", commentDetails: {}, commentArray: [] };
  major_competitor_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MICOM", commentDetails: {}, commentArray: [] };
  distribution_and_marketing_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "MIDIS", commentDetails: {}, commentArray: [] };
  //
  //Technical information
  me_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEMAC", commentDetails: {}, commentArray: [] };
  bcw_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEBCW", commentDetails: {}, commentArray: [] };
  ve_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEVEH", commentDetails: {}, commentArray: [] };
  fu_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEFUR", commentDetails: {}, commentArray: [] };
  it_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEIFT", commentDetails: {}, commentArray: [] };
  pr_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEPRE", commentDetails: {}, commentArray: [] };
  ra_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TERAW", commentDetails: {}, commentArray: [] };
  ma_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEMAN", commentDetails: {}, commentArray: [] };
  ut_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEUTI", commentDetails: {}, commentArray: [] };
  sa_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TESAF", commentDetails: {}, commentArray: [] };
  kh_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONTE", SubSectionCode: "TEKHA", commentDetails: {}, commentArray: [] };
  manufac_stages_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "TEMST", commentDetails: {}, commentArray: [] };
  prod_line_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONMI", SubSectionCode: "TEPRD", commentDetails: {}, commentArray: [] };
  //
  //Financial 
  // source_of_finance_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "PIGEN", commentDetails: {}, commentArray: [] };
  asset_statement_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FIBAL", commentDetails: {}, commentArray: [] };
  liabilities_statement_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FILEQ", commentDetails: {}, commentArray: [] };
  income_statement_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "FIINC", commentDetails: {}, commentArray: [] };
  // financial_flow_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NLOA", SectionCode: "LONFI", SubSectionCode: "PIGUA", commentDetails: {}, commentArray: [] };
  //

  //PRQ
  special_program_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRPRG", SubSectionCode: "PRPRG", commentDetails: {}, commentArray: [] };
  sector_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRSEC", SubSectionCode: "PRSEC", commentDetails: {}, commentArray: [] };
  license_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRLIC", SubSectionCode: "PRLIC", commentDetails: {}, commentArray: [] };
  company_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRCMD", SubSectionCode: "PRCMD", commentDetails: {}, commentArray: [] };
  product_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRPRO", SubSectionCode: "PRPRO", commentDetails: {}, commentArray: [] };
  ownership_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PROWN", SubSectionCode: "PROWN", commentDetails: {}, commentArray: [] };
  authorized_person_details_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRPER", SubSectionCode: "PRPER", commentDetails: {}, commentArray: [] };
  bank_details_comments_prq = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRBAN", SubSectionCode: "PRBAN", commentDetails: {}, commentArray: [] };
  real_estates_comments_prq = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRREL", SubSectionCode: "PRREL", commentDetails: {}, commentArray: [] };
  list_of_companies_comments_prq = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRCOM", SubSectionCode: "PRCOM", commentDetails: {}, commentArray: [] };
  other_investments_comments_prq = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRINV", SubSectionCode: "PRINV", commentDetails: {}, commentArray: [] };
  documents_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRDOC", SubSectionCode: "PRDOC", commentDetails: {}, commentArray: [] };
  asset_details_comments_prq = { hasComments: false, anyOpenComments: false, PrqOrLoan: "NPRE", SectionCode: "PRAST", SubSectionCode: "PRAST", commentDetails: {}, commentArray: [] };

  //GENC
  general_section_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "GENC", SectionCode: "GENC", SubSectionCode: "GENC", commentDetails: {}, commentArray: [] };

  //CLAIM
  claims_section_comments = { hasComments: false, anyOpenComments: false, PrqOrLoan: "CLAI", SectionCode: "CLAI", SubSectionCode: "CLAI", commentDetails: {}, commentArray: [] };

  statusCode = "Q";
  comments = [];

  temp;
  temp_route;
  type;
  CommId;
  SentReqId;

  //Comments 
  commentsFrom = "";
  commentArray = {};
  commentArrayExists = 0;

  //Loan Application heading

  documentDownloadUrl = "";

  consideredAsGENC = false;
  actualTypeGENC = "";
  headingForConsideredAsGENC = "";
  LoanId: string;
  afadReviewList: any;
  afadReviewFinalList: any = [];
  groupedElements: any;
  uniqueElements: any;

  activity_datalog: any = {};
  type_datalog: any = {};

  constructor(private errorsHandler: ErrorsHandler, private commonCommentsService: CommonCommentsService,
    private spinnerService: Ng4LoadingSpinnerService, public commonService: CommonService, private route: ActivatedRoute,
    private toastr: ToastrService, private router: Router, private customerProfileService: CustomerProfileService,
    protected chatService: ChatService, private NbChatModule: NbChatModule, private communicationsService: CommunicationsService,
    private modalService: NgbModal) {

   // this.activity_datalog = this.commonService.dataLogKey.Inbox;
    //this.type_datalog = this.commonService.dataLogKey.Type;

    this.translate = this.commonService.returnTranslate();
  }

  ngOnDestroy() {
    //this.commonService.userDataLogging(this.activity_datalog.INBOX_COMMENTS_PAGE, this.type_datalog.END, {});
  }

  ngOnInit() {
    this.headingForConsideredAsGENC = this.translate.instant('RECEIVE_REQUEST.GeneralCommunication');
    this.configForCkEditor = this.commonService.configForCkEditor;
    this.communicationsService
      .getDocumentDownloadUrl()
      .then((res) => (this.resolveDocumentDownloadUrl(res)), err => this.resolveError());

    //this.commonService.userDataLogging(this.activity_datalog.INBOX_COMMENTS_PAGE, this.type_datalog.START, {});

  }

  resolveDocumentDownloadUrl(res) {
    try {
      if (res.MessType == "S") {

        this.documentDownloadUrl = res.documentDownloadUrl;

        this.temp = this.route.queryParams;

        if (this.temp.getValue().type)
          this.type = this.customerProfileService.getDecryptString(this.temp.getValue().type);

        if (this.temp.getValue().CommId)
          this.CommId = this.customerProfileService.getDecryptString(this.temp.getValue().CommId);

        if (this.temp.getValue().SentReqId)
          this.SentReqId = this.customerProfileService.getDecryptString(this.temp.getValue().SentReqId);

        if (this.temp.getValue().LoanId)
          this.LoanId = this.customerProfileService.getDecryptString(this.temp.getValue().LoanId);

        if (this.type != "NPRE" && this.type != "NLOA" && this.type != "GENC" && this.type != "CLAI") {
          this.actualTypeGENC = this.type;
          this.type = "GENC";
          this.consideredAsGENC = true;


        }

        if (this.type === "NPRE") {

          this.activeType = "PRQ";
          this.special_program_details_comments["heading"] = 'PRELIMINARY_REQUEST.SpecialProgram';
          this.sector_details_comments["heading"] = 'PRELIMINARY_REQUEST.sectorDetails';
          this.license_details_comments["heading"] = 'PRELIMINARY_REQUEST.licenseDetails';
          this.company_details_comments["heading"] = 'PRELIMINARY_REQUEST.companyDetails';
          this.product_details_comments["heading"] = 'PRELIMINARY_REQUEST.mciOrProposedProducts';
          this.ownership_details_comments["heading"] = 'PRELIMINARY_REQUEST.mciOrProposedOwnerships';
          this.real_estates_comments_prq["heading"] = 'PROJECT_INFORMATION.ListofRealEstatesOwned';
          this.list_of_companies_comments_prq["heading"] = 'PROJECT_INFORMATION.ListofCompanies';
          this.other_investments_comments_prq["heading"] = 'PROJECT_INFORMATION.OtherInvestments';
          this.authorized_person_details_comments["heading"] = 'PRELIMINARY_REQUEST.authorizedPerson';
          this.bank_details_comments_prq["heading"] = 'PRELIMINARY_REQUEST.bankDetails';
          this.documents_comments["heading"] = 'PRELIMINARY_REQUEST.documents';
          this.asset_details_comments_prq["heading"] = 'PRELIMINARY_REQUEST.AssetDetails';

          this.comments.push(this.special_program_details_comments);
          this.comments.push(this.sector_details_comments);
          this.comments.push(this.license_details_comments);
          this.comments.push(this.company_details_comments);
          this.comments.push(this.product_details_comments);
          this.comments.push(this.ownership_details_comments);
          this.comments.push(this.real_estates_comments_prq);
          this.comments.push(this.list_of_companies_comments_prq);
          this.comments.push(this.other_investments_comments_prq);
          this.comments.push(this.authorized_person_details_comments);
          this.comments.push(this.bank_details_comments_prq);
          this.comments.push(this.documents_comments);
          this.comments.push(this.asset_details_comments_prq);

        }

        else if (this.type === "NLOA") {

          this.activeType = "LOAN";

          //Project information
          this.general_information_comments["heading"] = 'PROJECT_INFORMATION.GeneralInformation';
          this.project_profile_comments["heading"] = 'PROJECT_INFORMATION.ProjectProfile';
          this.project_ownership_comments["heading"] = 'PROJECT_INFORMATION.ProjectOwnership';
          this.guarantors_comments["heading"] = 'PROJECT_INFORMATION.Guarantors';
          this.real_estates_comments["heading"] = 'PROJECT_INFORMATION.ListofRealEstatesOwned'
          this.list_of_companies_comments["heading"] = 'PROJECT_INFORMATION.ListofCompanies';
          this.other_investments_comments["heading"] = 'PROJECT_INFORMATION.OtherInvestments';
          this.bank_details_comments_loan["heading"] = 'PROJECT_INFORMATION.BankDetails';
          this.kpmr_comments["heading"] = 'PROJECT_INFORMATION.KeyProfessionalManagementResources';
          this.assetDetails_comments_loan["heading"] = 'PRELIMINARY_REQUEST.AssetDetails';

          this.comments.push({ MainHeading: "COMMON.ProjectInformation", SectionComments: [], panelExpandedState: true });
          this.comments[0]["SectionComments"].push(this.general_information_comments);
          this.comments[0]["SectionComments"].push(this.project_profile_comments);
          this.comments[0]["SectionComments"].push(this.project_ownership_comments);
          this.comments[0]["SectionComments"].push(this.guarantors_comments);
          this.comments[0]["SectionComments"].push(this.real_estates_comments);
          this.comments[0]["SectionComments"].push(this.list_of_companies_comments);
          this.comments[0]["SectionComments"].push(this.other_investments_comments);
          this.comments[0]["SectionComments"].push(this.bank_details_comments_loan);
          this.comments[0]["SectionComments"].push(this.kpmr_comments);
          this.comments[0]["SectionComments"].push(this.assetDetails_comments_loan);
          //
          //Marketing 
          this.product_details_comments_marketing["heading"] = 'MARKETING_INFORMATION.ProductDetails';
          this.sponsor_product_sales__comments["heading"] = 'MARKETING_INFORMATION.SponsorProductSales';
          this.target_market_region_comments["heading"] = 'MARKETING_INFORMATION.TargetMarketRegionOrCountries';
          this.target_market_segments_comments["heading"] = 'MARKETING_INFORMATION.TargetMarketSegments';
          this.factories_target_market_region_comments["heading"] = 'MARKETING_INFORMATION.FactoriesinTargetMarketRegionOrCountries';
          this.import_competitors_market_region_comments["heading"] = 'MARKETING_INFORMATION.ImportCompetitorsinTargetMarketRegionOrCountries';
          this.historical_product_demand_comments["heading"] = 'MARKETING_INFORMATION.HistoricalProductDemand';
          this.expected_sales_volume_comments["heading"] = 'MARKETING_INFORMATION.ExpectedSalesVolume';
          this.targeted_end_users_comments["heading"] = 'MARKETING_INFORMATION.TargetedEndUsers';
          this.sponsor_proposed_price_comments["heading"] = 'MARKETING_INFORMATION.SponsorProposedPrice';
          this.major_competitor_comments["heading"] = 'MARKETING_INFORMATION.MajorCompetitorMarketShare';
          this.distribution_and_marketing_comments["heading"] = 'MARKETING_INFORMATION.DistributionandMarketingActivities';

          this.comments.push({ MainHeading: "COMMON.MarketingInformation", SectionComments: [], panelExpandedState: true });
          this.comments[1]["SectionComments"].push(this.product_details_comments_marketing);
          this.comments[1]["SectionComments"].push(this.sponsor_product_sales__comments);
          this.comments[1]["SectionComments"].push(this.target_market_region_comments);
          this.comments[1]["SectionComments"].push(this.target_market_segments_comments);
          this.comments[1]["SectionComments"].push(this.factories_target_market_region_comments);
          this.comments[1]["SectionComments"].push(this.import_competitors_market_region_comments);
          this.comments[1]["SectionComments"].push(this.historical_product_demand_comments);
          this.comments[1]["SectionComments"].push(this.expected_sales_volume_comments);
          this.comments[1]["SectionComments"].push(this.targeted_end_users_comments);
          this.comments[1]["SectionComments"].push(this.sponsor_proposed_price_comments);
          this.comments[1]["SectionComments"].push(this.major_competitor_comments);
          this.comments[1]["SectionComments"].push(this.distribution_and_marketing_comments);
          //  
          //Technical information
          this.me_comments["heading"] = 'TECHNICAL_INFORMATION.MachineryandEquipments';
          this.bcw_comments["heading"] = 'TECHNICAL_INFORMATION.BuildingandCivilworks';
          this.ve_comments["heading"] = 'TECHNICAL_INFORMATION.Vehicles';
          this.fu_comments["heading"] = 'TECHNICAL_INFORMATION.furnitures';
          this.it_comments["heading"] = 'TECHNICAL_INFORMATION.InfoTech';
          this.pr_comments["heading"] = 'TECHNICAL_INFORMATION.Pre-operationalcosts';
          this.ra_comments["heading"] = 'TECHNICAL_INFORMATION.rawmaterials';
          this.ma_comments["heading"] = 'TECHNICAL_INFORMATION.manpower';
          this.ut_comments["heading"] = 'TECHNICAL_INFORMATION.utilities';
          this.sa_comments["heading"] = 'TECHNICAL_INFORMATION.safety';
          this.kh_comments["heading"] = 'TECHNICAL_INFORMATION.knowhowagreements';
          this.manufac_stages_comments["heading"] = 'TECHNICAL_INFORMATION.ManufacturingStages';
          this.prod_line_comments["heading"] = 'TECHNICAL_INFORMATION.InstalledCapacities';

          this.comments.push({ MainHeading: "COMMON.TechnicalInformation", SectionComments: [], panelExpandedState: true });
          this.comments[2]["SectionComments"].push(this.me_comments);
          this.comments[2]["SectionComments"].push(this.bcw_comments);
          this.comments[2]["SectionComments"].push(this.ve_comments);
          this.comments[2]["SectionComments"].push(this.fu_comments);
          this.comments[2]["SectionComments"].push(this.it_comments);
          this.comments[2]["SectionComments"].push(this.pr_comments);
          this.comments[2]["SectionComments"].push(this.ra_comments);
          this.comments[2]["SectionComments"].push(this.ma_comments);
          this.comments[2]["SectionComments"].push(this.ut_comments);
          this.comments[2]["SectionComments"].push(this.sa_comments);
          this.comments[2]["SectionComments"].push(this.kh_comments);
          this.comments[2]["SectionComments"].push(this.manufac_stages_comments);
          this.comments[2]["SectionComments"].push(this.prod_line_comments);
          //

          //Financial Information
          this.asset_statement_comments["heading"] = 'FINANCIAL_INFORMATION.BalanceSheetAssets';
          this.liabilities_statement_comments["heading"] = 'FINANCIAL_INFORMATION.BalanceSheetLiabilities';
          this.income_statement_comments["heading"] = 'FINANCIAL_INFORMATION.IncomeStatement';

          this.comments.push({ MainHeading: "COMMON.FinancialInformation", SectionComments: [], panelExpandedState: true });
          this.comments[3]["SectionComments"].push(this.asset_statement_comments);
          this.comments[3]["SectionComments"].push(this.liabilities_statement_comments);
          this.comments[3]["SectionComments"].push(this.income_statement_comments);
          //

        }

        else if (this.type === "GENC") {
          var headingTemp = this.translate.instant('RECEIVE_REQUEST.GeneralCommunication');
          this.activeType = "GENC";
          if (this.consideredAsGENC) {
            headingTemp = this.customerProfileService.commentArray.RecReqComm[0].SentReqTypeDesc;

            if (this.actualTypeGENC === "AUD") {
              this.afadReviewList = this.customerProfileService.commentArray.RecReqComm[0].AfadReview;
              this.resolveAFADReviewList();
            }

            // if(this.actualTypeGENC === "AUD")
            //   headingTemp = "AFAD Audit Report Communication";
            // else if(this.actualTypeGENC === "SIVA")
            //   headingTemp = "Site Visit Report AFAD Communication";
            // else if(this.actualTypeGENC === "PRR")
            //   headingTemp = "Project Review Report Communication";
            // else if(this.actualTypeGENC === "PCAL")
            //   headingTemp = "Project Cost Audit Communication";
          }
          this.general_section_comments["heading"] = headingTemp;
          this.comments.push(this.general_section_comments);

        } else if (this.type === "CLAI") {
          this.activeType = "CLAI";
          this.claims_section_comments["heading"] = this.translate.instant('RECEIVE_REQUEST.ClaimsCommunication');
          this.comments.push(this.claims_section_comments);
        }

        console.log("comm");
        var communicationid = this.customerProfileService.communication.CommID;
        this.comm_id = communicationid;
        var selectedrequests = this.customerProfileService.communication;
        this.customer_profile_id = this.customerProfileService.currentCustomerProfile.customerProfileId;

        this.commentsFrom = "L";
        this.commentArrayExists = this.customerProfileService.commentArrayExists;
        this.commentArray = this.customerProfileService.commentArray;

        if (this.commentArrayExists && !this.consideredAsGENC)
          this.resolveCommonComments(this.type);
        else if (this.commentArrayExists && this.consideredAsGENC)
          this.resolveCommonComments(this.actualTypeGENC);


      }
    } catch (err) {
      this.spinnerService.hide();
      var errorMessage = this.translate.instant('COMMON.SomethingWentWrong') + ". " + this.translate.instant('COMMON.TryAgainLater');
      this.commonService.showFailureToast(errorMessage);
      this.errorsHandler.handleTryCatch(err, errorMessage);
    }
  }


  showRequestInfoError(err) {
    //this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  }

  resolveCommonComments(type) {

    try {

      var resolvedCommentArray = [], resolvedCommentArray_1 = [], resolvedCommentArray_2 = [];

      if (this.commentsFrom == "L") {

        resolvedCommentArray_1 = _.where(this.commentArray["RecReqComm"], { SentReqType: type, CommReqStatus: "O" });
        resolvedCommentArray_1 = resolvedCommentArray_1[0] ? resolvedCommentArray_1[0] : [];

        resolvedCommentArray_2 = _.where(this.commentArray["RecReqComm"], { SentReqType: type, CommReqStatus: "C" });

        if (resolvedCommentArray_2 && resolvedCommentArray_2.length > 0) {

          resolvedCommentArray_2 = resolvedCommentArray_2[0];

          if (resolvedCommentArray_2["RecReqSection"] && resolvedCommentArray_2["RecReqSection"].length > 0)
            for (var i = 0; i < resolvedCommentArray_2["RecReqSection"].length; i++) {
              if (resolvedCommentArray_1.length === 0) {
                resolvedCommentArray_1 = JSON.parse(JSON.stringify(resolvedCommentArray_2));
              }
              else
                resolvedCommentArray_1["RecReqSection"].push(resolvedCommentArray_2["RecReqSection"][i]);
            }

        }

      }

      else {

        resolvedCommentArray_1 = _.where(this.commentArray["RecReqComm"], { SentReqType: type, CommReqStatus: "O" });
        resolvedCommentArray_1 = resolvedCommentArray_1[0];

      }

      resolvedCommentArray = resolvedCommentArray_1;

      if (this.type === "NPRE") {
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.special_program_details_comments, this.special_program_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.sector_details_comments, this.sector_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.license_details_comments, this.license_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.company_details_comments, this.company_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.product_details_comments, this.product_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.ownership_details_comments, this.ownership_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.real_estates_comments_prq, this.real_estates_comments_prq.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.list_of_companies_comments_prq, this.list_of_companies_comments_prq.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.other_investments_comments_prq, this.other_investments_comments_prq.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.authorized_person_details_comments, this.authorized_person_details_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.bank_details_comments_prq, this.bank_details_comments_prq.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.documents_comments, this.documents_comments.SectionCode);
        this.resolveCommonCommentsTypesPRQ(resolvedCommentArray, this.asset_details_comments_prq, this.asset_details_comments_prq.SectionCode);
        this.isComments();
      }


      else if (this.type === "NLOA") {
        //Project Information
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.general_information_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.project_profile_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.project_ownership_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.guarantors_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.real_estates_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.list_of_companies_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.other_investments_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.bank_details_comments_loan, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.kpmr_comments, "LONPI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.assetDetails_comments_loan, "LONPI");
        //
        //Marketing information
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.product_details_comments_marketing, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.sponsor_product_sales__comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.target_market_region_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.target_market_segments_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.factories_target_market_region_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.import_competitors_market_region_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.historical_product_demand_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.expected_sales_volume_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.targeted_end_users_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.sponsor_proposed_price_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.major_competitor_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.distribution_and_marketing_comments, "LONMI");
        //
        //Technical information
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.me_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.bcw_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.ve_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.fu_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.it_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.pr_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.ra_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.ma_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.ut_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.sa_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.kh_comments, "LONTE");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.manufac_stages_comments, "LONMI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.prod_line_comments, "LONMI");

        //
        //Financial information
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.asset_statement_comments, "LONFI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.liabilities_statement_comments, "LONFI");
        this.resolveCommonCommentsTypes(resolvedCommentArray, this.income_statement_comments, "LONFI");
        //
        this.isComments();
      }

      else if (this.type === "GENC") {
        if (!this.consideredAsGENC)
          this.resolveCommonCommentsTypesGENC(resolvedCommentArray, this.general_section_comments, "GENC");
        else if (this.consideredAsGENC)
          this.resolveCommonCommentsTypesGENC(resolvedCommentArray, this.general_section_comments, this.actualTypeGENC);
      }

      else if (this.type === "CLAI") {
        this.resolveCommonCommentsTypesCLAI(resolvedCommentArray, this.claims_section_comments, "CLAI");
      }

    }

    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  isComments() {

    if (this.type === "NLOA") {
      for (var i = 0; i < this.comments.length; i++) {
        var flag = 0;
        for (var j = 0; j < this.comments[i].SectionComments.length; j++) {
          if (this.comments[i].SectionComments[j]["hasComments"] === false) {
            flag = flag + 1
          }
        }
        if (flag === this.comments[i].SectionComments.length)
          this.comments[i]["isComments"] = false;
        else
          this.comments[i]["isComments"] = true;
      }
    } else if (this.type === "NPRE") {
      var flag = 0;
      for (var i = 0; i < this.comments.length; i++) {
        if (this.comments[i].hasComments === false)
          flag = flag + 1;
      }
      if (this.comments.length === flag)
        this.isPrqComments = true;
      else
        this.isPrqComments = false;
    }
  }

  resolveCommonCommentsTypes(resolvedCommentArray, technical_type, ReqSection) {

    if (resolvedCommentArray["RecReqSection"])
      for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

        if (resolvedCommentArray["RecReqSection"][i].ReqSec == ReqSection && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == technical_type.SubSectionCode) {

            technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: technical_type.SectionCode, ReqSubSec: technical_type.SubSectionCode });

            technical_type.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            technical_type.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            technical_type.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            technical_type.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];

            technical_type.commentDetails["DeadLineDate"] = technical_type.commentArray[0]["DeadLineDate"];
            technical_type.commentDetails["GuiId"] = technical_type.commentArray[0]["GuiId"];
            technical_type.commentDetails["DefId"] = technical_type.commentArray[0]["DefId"];
            technical_type.commentDetails["ReqSec"] = technical_type.commentArray[0]["ReqSec"];
            technical_type.commentDetails["ReqSecDesc"] = technical_type.commentArray[0]["ReqSecDesc"];
            technical_type.commentDetails["ReqStatus"] = technical_type.commentArray[0]["ReqStatus"];
            technical_type.commentDetails["ReqStatusDesc"] = technical_type.commentArray[0]["ReqStatusDesc"];
            technical_type.commentDetails["ReqSubSec"] = technical_type.commentArray[0]["ReqSubSec"];
            technical_type.commentDetails["ReqSubSecDesc"] = technical_type.commentArray[0]["ReqSubSecDesc"];
            technical_type.commentDetails["SectionId"] = technical_type.commentArray[0]["SectionId"];

            var openComments = technical_type.commentArray.find((o) => o.ReqStatus == "O");

            if (openComments)
              technical_type.anyOpenComments = true;
            else
              technical_type.anyOpenComments = false;

            technical_type.commentArray = technical_type.commentArray[0]["RecReqComment"];

            technical_type.hasComments = true;
          }
        }
      }
  }

  resolveCommonCommentsTypesPRQ(resolvedCommentArray, technical_type, ReqSection) {

    if (resolvedCommentArray["RecReqSection"])
      for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

        if (resolvedCommentArray["RecReqSection"][i].ReqSec == ReqSection && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == technical_type.SubSectionCode) {

            technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: technical_type.SectionCode, ReqSubSec: technical_type.SubSectionCode });

            technical_type.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            technical_type.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            technical_type.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            technical_type.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];

            technical_type.commentDetails["DeadLineDate"] = technical_type.commentArray[0]["DeadLineDate"];
            technical_type.commentDetails["GuiId"] = technical_type.commentArray[0]["GuiId"];
            technical_type.commentDetails["DefId"] = technical_type.commentArray[0]["DefId"];
            technical_type.commentDetails["ReqSec"] = technical_type.commentArray[0]["ReqSec"];
            technical_type.commentDetails["ReqSecDesc"] = technical_type.commentArray[0]["ReqSecDesc"];
            technical_type.commentDetails["ReqStatus"] = technical_type.commentArray[0]["ReqStatus"];
            technical_type.commentDetails["ReqStatusDesc"] = technical_type.commentArray[0]["ReqStatusDesc"];
            technical_type.commentDetails["ReqSubSec"] = technical_type.commentArray[0]["ReqSubSec"];
            technical_type.commentDetails["ReqSubSecDesc"] = technical_type.commentArray[0]["ReqSubSecDesc"];
            technical_type.commentDetails["SectionId"] = technical_type.commentArray[0]["SectionId"];

            var openComments = technical_type.commentArray.find((o) => o.ReqStatus == "O");

            if (openComments)
              technical_type.anyOpenComments = true;
            else
              technical_type.anyOpenComments = false;

            technical_type.commentArray = technical_type.commentArray[0]["RecReqComment"];

            technical_type.hasComments = true;
          }
        }
      }
  }

  resolveCommonCommentsTypesGENC(resolvedCommentArray, technical_type, ReqSection) {

    if (resolvedCommentArray["RecReqSection"])
      for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

        if (resolvedCommentArray["RecReqSection"][i].ReqSec == ReqSection && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == technical_type.SubSectionCode || this.consideredAsGENC) {

            if (!this.consideredAsGENC)
              technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: technical_type.SectionCode, ReqSubSec: technical_type.SubSectionCode });
            else
              technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: this.actualTypeGENC });

            technical_type.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            technical_type.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            technical_type.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            technical_type.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];

            technical_type.commentDetails["DeadLineDate"] = technical_type.commentArray[0]["DeadLineDate"];
            technical_type.commentDetails["GuiId"] = technical_type.commentArray[0]["GuiId"];
            technical_type.commentDetails["DefId"] = technical_type.commentArray[0]["DefId"];
            technical_type.commentDetails["ReqSec"] = technical_type.commentArray[0]["ReqSec"];
            technical_type.commentDetails["ReqSecDesc"] = technical_type.commentArray[0]["ReqSecDesc"];
            technical_type.commentDetails["ReqStatus"] = technical_type.commentArray[0]["ReqStatus"];
            technical_type.commentDetails["ReqStatusDesc"] = technical_type.commentArray[0]["ReqStatusDesc"];
            technical_type.commentDetails["ReqSubSec"] = technical_type.commentArray[0]["ReqSubSec"];
            technical_type.commentDetails["ReqSubSecDesc"] = technical_type.commentArray[0]["ReqSubSecDesc"];
            technical_type.commentDetails["SectionId"] = technical_type.commentArray[0]["SectionId"];

            var openComments = technical_type.commentArray.find((o) => o.ReqStatus == "O");

            if (openComments)
              technical_type.anyOpenComments = true;
            else
              technical_type.anyOpenComments = false;

            technical_type.commentArray = technical_type.commentArray[0]["RecReqComment"];

            technical_type.hasComments = true;
          }
        }
      }
  }

  resolveCommonCommentsTypesCLAI(resolvedCommentArray, technical_type, ReqSection) {

    if (resolvedCommentArray["RecReqSection"])
      for (var i = 0; i < resolvedCommentArray["RecReqSection"].length; i++) {

        if (resolvedCommentArray["RecReqSection"][i].ReqSec == ReqSection && resolvedCommentArray["RecReqSection"][i].RecReqComment && resolvedCommentArray["RecReqSection"][i].RecReqComment.length > 0) {

          if (resolvedCommentArray["RecReqSection"][i].ReqSubSec == technical_type.SubSectionCode) {

            technical_type.commentArray = _.where(resolvedCommentArray["RecReqSection"], { ReqSec: technical_type.SectionCode, ReqSubSec: technical_type.SubSectionCode });

            technical_type.commentDetails["CommId"] = resolvedCommentArray["CommId"];
            technical_type.commentDetails["SentReqId"] = resolvedCommentArray["SentReqId"];
            technical_type.commentDetails["SentReqType"] = resolvedCommentArray["SentReqType"];
            technical_type.commentDetails["SubDeadLine"] = resolvedCommentArray["SubDeadLine"];

            technical_type.commentDetails["DeadLineDate"] = technical_type.commentArray[0]["DeadLineDate"];
            technical_type.commentDetails["GuiId"] = technical_type.commentArray[0]["GuiId"];
            technical_type.commentDetails["ReqSec"] = technical_type.commentArray[0]["ReqSec"];
            technical_type.commentDetails["ReqSecDesc"] = technical_type.commentArray[0]["ReqSecDesc"];
            technical_type.commentDetails["ReqStatus"] = technical_type.commentArray[0]["ReqStatus"];
            technical_type.commentDetails["ReqStatusDesc"] = technical_type.commentArray[0]["ReqStatusDesc"];
            technical_type.commentDetails["ReqSubSec"] = technical_type.commentArray[0]["ReqSubSec"];
            technical_type.commentDetails["ReqSubSecDesc"] = technical_type.commentArray[0]["ReqSubSecDesc"];
            technical_type.commentDetails["SectionId"] = technical_type.commentArray[0]["SectionId"];

            var openComments = technical_type.commentArray.find((o) => o.ReqStatus == "O");

            if (openComments)
              technical_type.anyOpenComments = true;
            else
              technical_type.anyOpenComments = false;

            // technical_type.commentArray = technical_type.commentArray[0]["RecReqComment"];

            technical_type.hasComments = true;
          }
        }
      }
  }

  submit_comment(event) {

    // console.log(this.project_id);

    if (this.post_mess_geninfo != "" || this.post_mess_markinfo != "" || this.post_mess_techinfo != "" || this.post_mess_fininfo != "") {

      var comments_text_temp = this.comments_text;
      //  console.log(comments_text_temp);
      var cust_prof_id = this.customerProfileService.currentCustomerProfile.customerProfileId;
      // var postdata = {
      //   "ProjId":this.project_id,
      //   "ReqType": "NLOA",
      //   "TaskInstId":"1",
      //   "CommReqComment":[{
      //     "RequestSection":"TECIN",
      //     "RequestSubSection":"TEBUI",
      //     "CommentText":this.comments_text,
      //     "UserId":"100000",
      //     "IsVisible":"277"
      //   }]
      // };comm_id, req_section, comment_text, user_id, req_sub_section, cust_prof_id
      //console.log(this.project_id);
      var commid_temp = this.request_generalInfo.MyClientComm[0].CommunicationId;

      var data_temp = {
        "UserName": "CP",
        "MyClient": [
          {
            "CommID": commid_temp,
            "MyClientComm": []
          }]
      };

      if (this.post_mess_geninfo) {

        //console.log(this.request_generalInfo.MyClientComm);

        var req_section_temp = this.request_generalInfo.MyClientComm[0].RequestSection;
        var comment_text_temp = this.post_mess_geninfo;
        var user_id_temp = this.request_generalInfo.MyClientComm[0].UserId;
        var req_subsection_temp = this.request_generalInfo.MyClientComm[0].RequestSubSection;
        var data_temp2 = {
          "CommunicationId": commid_temp,
          "RequestSection": req_section_temp,
          "CommentText": comment_text_temp,
          "UserId": this.customer_profile_id,
          "RequestSubSection": req_subsection_temp
        }
        data_temp.MyClient[0].MyClientComm.push(data_temp2);

      }

      if (this.post_mess_markinfo) {

        // console.log(this.request_marketingInfo.MyClientComm);

        var req_section_temp = this.request_marketingInfo.MyClientComm[0].RequestSection;
        var comment_text_temp = this.post_mess_markinfo;
        var user_id_temp = this.request_marketingInfo.MyClientComm[0].UserId;
        var req_subsection_temp = this.request_marketingInfo.MyClientComm[0].RequestSubSection;
        var data_temp2 = {
          "CommunicationId": commid_temp,
          "RequestSection": req_section_temp,
          "CommentText": comment_text_temp,
          "UserId": this.customer_profile_id,
          "RequestSubSection": req_subsection_temp
        }
        data_temp.MyClient[0].MyClientComm.push(data_temp2);

      }
      if (this.post_mess_techinfo) {

        //console.log(this.request_technicalInfo.MyClientComm);

        var req_section_temp = this.request_technicalInfo.MyClientComm[0].RequestSection;
        var comment_text_temp = this.post_mess_techinfo;
        var user_id_temp = this.request_technicalInfo.MyClientComm[0].UserId;
        var req_subsection_temp = this.request_technicalInfo.MyClientComm[0].RequestSubSection;
        var data_temp2 = {
          "CommunicationId": commid_temp,
          "RequestSection": req_section_temp,
          "CommentText": comment_text_temp,
          "UserId": this.customer_profile_id,
          "RequestSubSection": req_subsection_temp
        }
        data_temp.MyClient[0].MyClientComm.push(data_temp2);

      }

      if (this.post_mess_fininfo) {

        // console.log(this.request_financialInfo.MyClientComm);

        var req_section_temp = this.request_financialInfo.MyClientComm[0].RequestSection;
        var comment_text_temp = this.post_mess_fininfo;
        var user_id_temp = this.request_financialInfo.MyClientComm[0].UserId;
        var req_subsection_temp = this.request_financialInfo.MyClientComm[0].RequestSubSection;
        var data_temp2 = {
          "CommunicationId": commid_temp,
          "RequestSection": req_section_temp,
          "CommentText": comment_text_temp,
          "UserId": this.customer_profile_id,
          "RequestSubSection": req_subsection_temp
        }
        data_temp.MyClient[0].MyClientComm.push(data_temp2);

      }

      var err_temp;

      this.communicationsService.postReceivedRequest(data_temp)
        .then((res) =>
        (
          // this.refresh_comments(),
          this.commonService.showSuccessToast(this.translate.instant('RECEIVE_REQUEST.CommentsSubmittedSuccessfully')),
          this.comments_text = ""),
          err =>
            err_temp = err
        );

    }

    else {
      this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.EnterComments'));
    }

  }

  setPanelExpandedState() {
    for (var i = 0; i < this.comments.length; i++) {
      this.comments[i]["panelExpandedState"] = true;
    }
  }

  onDownload() {

    let printContents, popupWin;

    this.allpanelsexpanded = true;

    //this.commonService.userDataLogging(this.activity_datalog.INBOX_COMMENTS_PRINT, this.type_datalog.CLICK, {});

    if (this.type === "NLOA") {
      this.setPanelExpandedState();
      var print_section = 'print-section-loan';
    }

    if (this.type === "NPRE")
      var print_section = 'print-section-prq';

    if (this.type === "GENC")
      var print_section = 'print-section-genc';

    if (this.type === "CLAI")
      var print_section = 'print-section-clai';

    printContents = document.getElementById(print_section).innerHTML;
    //this.allpanelsexpanded = false;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
    <html>
    <head>
    <style>
    .chat-text {
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: right;
    }
    </style>
    </head>
    <body onload="window.print();window.close()">${printContents}</body>
    </html>`
    );

    popupWin.document.close();

  }

  getDocument(document) {

    // var docUrl = this.documentDownloadUrl;

    // docUrl = docUrl.replace("entityId", this.SentReqId)
    //   .replace("refId", document.GuiId)
    //   .replace("documentId", document.FileId)
    //   .replace("fileName", document.CommentText);

    // window.open(docUrl);
    this.documentView(document);

   // this.commonService.userDataLogging(this.activity_datalog.INBOX_DOC_VIEW, this.type_datalog.CLICK, {});
  }


  documentView(document) {
    this.documentStruc = document;
    this.spinnerService.show();
    this.communicationsService.downloadDocumentService(this.commentArray["RecReqComm"] ? this.commentArray["RecReqComm"][0]["CommId"] : "",
      document.DefId, document.FileId, 'l', document.CommentText)
      .then(response => (
        this.handleFileDownload(response)
      ),
        err => (this.commonService.showFailureToast(err), this.spinnerService.hide()));
  }

  handleFileDownload(res) {
    console.log("Handle File Download");

    let fileName = this.documentStruc.CommentText ? this.documentStruc.CommentText : "file";
    if (res) {
      if (res.result != undefined) {
        var buffer = this.commonService.base64ToArrayBuffer(res.result);
        this.commonService.saveByteArray([buffer], fileName);
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }
  }


  // Post Comments 
  onSubmitComment() {

    if (this.currentComment == "")
      this.commonService.showFailureToast(this.translate.instant('RECEIVE_REQUEST.EnterComments'));

    else {

      this.spinnerService.show();

      var commentPostData = {
        "RecReqComm": [
          {
            "CommId": this.comments[0].commentDetails.CommId,
            "SentReqId": this.comments[0].commentDetails.SentReqId,
            "SentReqType": this.comments[0].commentDetails.SentReqType,
            "SubDeadLine": this.comments[0].commentDetails.SubDeadLine,
            "RecReqSection": [
              {
                "SectionId": this.comments[0].commentDetails.SectionId,
                "CommId": this.comments[0].commentDetails.CommId,
                "DeadLineDate": this.comments[0].commentDetails.DeadLineDate,
                "ReqSec": this.comments[0].commentDetails.ReqSec,
                "ReqSubSec": this.comments[0].commentDetails.ReqSubSec,
                "ReqStatus": this.comments[0].commentDetails.ReqStatus,
                "RecReqComment": [
                  {
                    "CommentText": this.currentComment,
                    "Indicator": "CP"
                  }
                ]
              }
            ]
          }
        ]
      }

      if (this.consideredAsGENC) {
        commentPostData["Indicator"] = "COMMENT";
      }

      this.commonCommentsService.postCommonComments(commentPostData)
        .then((res) => (this.resolvePostCommonComments(res))), err => (this.commonService.showFailureToast(err), this.spinnerService.hide());

     // this.commonService.userDataLogging(this.activity_datalog.INBOX_COMMENTS_SUBMIT, this.type_datalog.CLICK, {});

    }

  }

  resolvePostCommonComments(res) {

    if (res.MessType == "S")
      this.updateCommonComments(res);

    else {

      this.spinnerService.hide();
      this.commonService.showFailureToast(res.MessText);

    }

  }

  updateCommonComments(res) {

    var temp_comments = {
      PrqOrLoan: this.comments[0].PrqOrLoan,
      SectionCode: this.comments[0].SectionCode,
      SubSectionCode: this.comments[0].SubSectionCode,
      anyOpenComments: this.comments[0].anyOpenComments,
      commentArray: [],
      commentDetails: this.comments[0].commentDetails,
      hasComments: this.comments[0].hasComments
    };

    var current_comment = {
      CommentId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentId,
      CommentText: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentText,
      CommentedBy: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentedBy,
      Indicator: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].Indicator,
      SectionId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].SectionId,
      TimeStamp: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].TimeStamp
    };

    temp_comments.commentArray.push(current_comment);

    for (var i = 0; i < this.comments[0].commentArray.length; i++)
      temp_comments.commentArray.push(this.comments[0].commentArray[i]);

    this.comments[0] = temp_comments;


    var temp_comments_array = this.customerProfileService.commentArray;

    for (var i = 0; i < temp_comments_array.RecReqComm.length; i++)
      if (temp_comments_array.RecReqComm[i].SentReqType == temp_comments.commentDetails.SentReqType &&
        temp_comments_array.RecReqComm[i].CommReqStatus == temp_comments.commentDetails.ReqStatus)
        for (var j = 0; j < temp_comments_array.RecReqComm[i].RecReqSection.length; j++)
          if (temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSec == temp_comments.commentDetails.ReqSec &&
            temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSubSec == temp_comments.commentDetails.ReqSubSec)
            temp_comments_array.RecReqComm[i].RecReqSection[j].RecReqComment = temp_comments.commentArray;

    this.customerProfileService.setCommentArray(temp_comments_array);

    if (this.files.length == 0) {

      this.currentComment = "";

      this.commonService.showSuccessToast(res.MessText);

      this.spinnerService.hide();

    }

    else {

      for (var i = 0; i < this.files.length; i++)
        this.documentNames.push(this.files[i].name);

      var data = {
        documentDefId: 121,
        entityId: this.comments[0].commentDetails.CommId,
        entityName: "Project",
        RelatedEntityId: "",
        RelatedEntityName: "product",
        operationType: "l"
      };

      this.communicationsService.uploadDocumentService(this.files, data)
        .then(requests => (this.onDocumentUpload(requests)), err => this.resolveError());

    }

  }

  onDocumentUpload(requests) {

    if (requests.MessType == "S") {

      this.documentIndex = 0;

      for (var i = 0; i < requests.data.documentList.length; i++)
        this.documentIds.push(requests.data.documentList[i].DocumentId);

      this.onDocumentUploadResolve();

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }

  onDocumentUploadResolve() {

    var commentPostData = {
      "RecReqComm": [
        {
          "CommId": this.comments[0].commentDetails.CommId,
          "SentReqId": this.comments[0].commentDetails.SentReqId,
          "SentReqType": this.comments[0].commentDetails.SentReqType,
          "SubDeadLine": this.comments[0].commentDetails.SubDeadLine,
          "RecReqSection": [
            {
              "SectionId": this.comments[0].commentDetails.SectionId,
              "CommId": this.comments[0].commentDetails.CommId,
              "DeadLineDate": this.comments[0].commentDetails.DeadLineDate,
              "ReqSec": this.comments[0].commentDetails.ReqSec,
              "ReqSubSec": this.comments[0].commentDetails.ReqSubSec,
              "ReqStatus": this.comments[0].commentDetails.ReqStatus,
              "RecReqComment": [
                {
                  "CommentText": this.documentNames[this.documentIndex],
                  "IsFile": "X",
                  "DefId": "121",
                  "FileId": this.documentIds[this.documentIndex],
                  "Indicator": "CP"
                }
              ]
            }
          ]
        }
      ]
    }

    if (this.consideredAsGENC) {
      commentPostData["Indicator"] = "COMMENT";
    }

    this.commonCommentsService.postCommonComments(commentPostData)
      .then((res) => (this.resolvePostCommonCommentsDocuments(res))), err => (this.commonService.showFailureToast(err), this.spinnerService.hide());

  }

  resolvePostCommonCommentsDocuments(res) {

    if (res.MessType == "S")
      this.updateCommonCommentsDocuments(res);

    else {

      this.spinnerService.hide();
      this.commonService.showFailureToast(res.MessText);

    }

  }

  updateCommonCommentsDocuments(res) {

    var temp_comments = {
      PrqOrLoan: this.comments[0].PrqOrLoan,
      SectionCode: this.comments[0].SectionCode,
      SubSectionCode: this.comments[0].SubSectionCode,
      anyOpenComments: this.comments[0].anyOpenComments,
      commentArray: [],
      commentDetails: this.comments[0].commentDetails,
      hasComments: this.comments[0].hasComments
    };

    var current_comment = {
      CommentId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentId,
      CommentText: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentText,
      CommentedBy: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentedBy,
      Indicator: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].Indicator,
      SectionId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].SectionId,
      IsFile: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].IsFile,
      DefId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].DefId,
      FileId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].FileId,
      TimeStamp: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].TimeStamp
    };

    temp_comments.commentArray.push(current_comment);

    for (var i = 0; i < this.comments[0].commentArray.length; i++)
      temp_comments.commentArray.push(this.comments[0].commentArray[i]);

    this.comments[0] = temp_comments;


    var temp_comments_array = this.customerProfileService.commentArray;

    for (var i = 0; i < temp_comments_array.RecReqComm.length; i++)
      if (temp_comments_array.RecReqComm[i].SentReqType == temp_comments.commentDetails.SentReqType &&
        temp_comments_array.RecReqComm[i].CommReqStatus == temp_comments.commentDetails.ReqStatus)
        for (var j = 0; j < temp_comments_array.RecReqComm[i].RecReqSection.length; j++)
          if (temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSec == temp_comments.commentDetails.ReqSec &&
            temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSubSec == temp_comments.commentDetails.ReqSubSec)
            temp_comments_array.RecReqComm[i].RecReqSection[j].RecReqComment = temp_comments.commentArray;

    this.customerProfileService.setCommentArray(temp_comments_array);

    this.documentIndex++;

    if (this.documentIndex < this.files.length)
      this.onDocumentUploadResolve();

    else {

      this.currentComment = "";

      this.files = [];

      (<HTMLInputElement>document.getElementById('fileUpload')).value = "";

      this.commonService.showSuccessToast(res.MessText);

      this.spinnerService.hide();

    }

  }

  onFileChange(event) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {

      format = this.files[i].name.split('.');

      format_length = format.length;

      if (this.files[i].size > this.commonService.documentSizeLimits.documentSize5MB) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.Thesizeofeachchosenfileshouldbeamaximumof5MB!'));
        event.target.value = '';

        this.files = [];

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('COMMON.Theformatofoneofthechosenfilesisnotsupported!'));
        event.target.value = '';

        this.files = [];

        break;

      }

    }

  }


  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

  onBack() {
   // this.commonService.userDataLogging(this.activity_datalog.INBOX_COMMENTS_PAGE_BACK, this.type_datalog.CLICK, {});
    this.router.navigateByUrl('/pages/communications/receive-request');
  }

  onClickType(type) {

    if (type === "PRR") {
      this.router.navigate(['/pages/my-loans/afad-questionnaire'], { queryParams: { 'id': this.customerProfileService.getEncryptedString(this.LoanId), 'type': this.customerProfileService.getEncryptedString('Loan') } });
    }
    else if (type === "AUD") {
      this.router.navigate(['/pages/my-loans'], { queryParams: { 'id': this.customerProfileService.getEncryptedString(this.LoanId), 'sentReqId': this.customerProfileService.getEncryptedString(this.SentReqId), 'type': this.customerProfileService.getEncryptedString('Loan'), 'identifier': this.customerProfileService.getEncryptedString('PendingDoc') } });
      // this.router.navigateByUrl('/pages/my-loans/contracts');
    }

  }

  resolveAFADReviewList() {
    var tempArr = {
      grouped: [],
      unique: []
    };
    if (this.afadReviewList != undefined) {
      if (this.afadReviewList.length > 0) {
        this.groupedElements = _.groupBy(this.afadReviewList, 'Operation');
        this.uniqueElements = _l.uniqBy(this.afadReviewList, 'Operation');

        tempArr = {
          grouped: this.groupedElements,
          unique: this.uniqueElements
        }

        this.commonService.setPendingDocuments(tempArr);
      }
      else {
        this.commonService.setPendingDocuments(tempArr);
      }
    }
    else {
      this.commonService.setPendingDocuments(tempArr);
    }



    // var temp = _.each(uniqueElements, function(num) {
    //   tempArr = {
    //     name: num.Operation,
    //     value: groupedElements[num.Operation]
    //   }
    //   this.afadReviewFinalList.push(tempArr);
    // })

    // for(var i = 0; i < uniqueElements.length; i++) {
    //   tempArr = {
    //     name: uniqueElements[i].Operation,
    //     value: groupedElements[uniqueElements[i].Operation]
    //   }
    //   this.afadReviewFinalList.push(tempArr);
    // }
    // console.log(this.afadReviewFinalList);
  }

  onAFADReviewClick(type) {


    if (type === "AUD") {
      console.log("Open Modal");


      let receiveRequestCommunicationModalParams = {
        from: "COMM",
        mode: "0",
        header: this.translate.instant('COMMUNICATIONS.ViewPendingDocuments'),
        // reviews: this.afadReviewFinalList,
        grouped: this.commonService.pendingDocumentsListComm != undefined ? this.commonService.pendingDocumentsListComm.grouped : [],
        unique: this.commonService.pendingDocumentsListComm != undefined ? this.commonService.pendingDocumentsListComm.unique : [],

        // buttons: [
        //   {
        //     name: this.translate.instant('COMMON.SaveAsDraft'),
        //     type: "button",
        //     class: "btn-success",
        //     true_name: "draft",

        //     handler: (modal_data) => {}
        //   }
        // ]
      };

      let receiveRequestCommunicationModal = this.modalService.open(ReceiveRequestCommunicationModalComponent, this.commonService.modalOptions);
      receiveRequestCommunicationModal.componentInstance.ReceiveRequestCommunicationModalsForm = receiveRequestCommunicationModalParams;
    }


  }

}
