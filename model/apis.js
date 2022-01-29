const config = require('config');

module.exports.apisList = () => {

    const apis = {

        login: config.sidfHostUrl + "/cpLogin/UserID/Password/OTP",
        register: config.sidfHostUrl + "/cpLogin/UserID/Password/OTP",

        signupCountryList: config.sidfHostUrl + "/parameters?q=Countries",
        signupResidentCitizen: config.sidfHostUrl + "/custReg/ID/TYPE/ACTION/OTP_GEN/OTP_VER/WASSELCALL/PHONE/EMAIL/DOB/LIC_NUM/LIC_VAL/USRID/crnumber/date",
        signupFinalData: config.sidfHostUrl + "/regInfo",

        contactUsFinalData: config.sidfHostUrl + "/contactUs",
        getMyComplaints: config.sidfHostUrl + "/myCases/profileId-customerId",

        viewCustomerProfile: config.sidfHostUrl + "/profile/customerNumber",
        EditCustomerProfile: config.sidfHostUrl + "/profile",
        ivrService: config.sidfHostUrl + "/profileIvr",

        prelReqGetMCI: config.sidfHostUrl + "/prq/FactoryDetails/licenseType/idNumber/dob/customerId/purpose",
        prelReqGetInfoSecond: config.sidfHostUrl + "/prq/SearchHelpByProfile/profileType",
        prelReqGetOwnerDet: config.sidfHostUrl + "/prq/OwnersDetails/shareHolderType/investorType/idType/idNumber/dob",
        prelReqGetRepDet: config.sidfHostUrl + "/prq/RepresentativeDetails/idType/idNumber/dob",
        prelReqGetInfo: config.sidfHostUrl + "/prq/SectorSearchHelp/userId",
        prelReqPostDetails: config.sidfHostUrl + "/prq/prqDetails",
        prelReqAfterPost: config.sidfHostUrl + "/projects/ProjectId/checklist/Project_Preparation/0/start",
        prelReqGetDetails: config.sidfHostUrl + "/prq/prqDetails/prelReqId/1/1",
        prelReqDetailsByRequestId: config.sidfHostUrl + "/prq/prqDetails/requestId/CP/customerId/profileId",
        prelReqGetHSCodeList: config.sidfHostUrl + "/prq/HsCode/N/N",
        prelReqOwnersBP: config.sidfHostUrl + "/prq/OwnersDetails",
        prelReqOwnersAddInfo: config.sidfHostUrl + "/prq/OwnersAddInfo",
        prelReqPostProducts: config.sidfHostUrl + "/prq/ProductDetails",

        loanDropdownsGet: config.sidfHostUrl + "/masterInfos/all",

        loanProjectInformationInitiateLoan: config.sidfHostUrl + "/loanAppGenInfo",
        loanProjectInformationGet: config.sidfHostUrl + "/loanAppGenInfo/requestId/bpId/CP/customerId",
        loanProjectKPMRInformationGet: config.sidfHostUrl + "/bpManagement/bpId/CP/customerId/profileId",
        loanProjectInformationPost: config.sidfHostUrl + "/loanAppGenInfo",
        loanProjectAssetInformationPost: config.sidfHostUrl + "/asset",
        loanProjectKPMRInformationPost: config.sidfHostUrl + "/bpManagement",
        loanProjectGetBpExternalId: config.sidfHostUrl + "/bpRelations/externalid&SIDF04",
        loanProjectPostGuarantors: config.sidfHostUrl + "/projGuarantors",
        loanProjectPostcheckExternalId: config.sidfHostUrl + "/iDStatus",


        loanFinancialgetBpExternalId: config.sidfHostUrl + "/bpRelations/externalid&SIDF02",
        loancreateBpRelation: config.sidfHostUrl + "/bpRelations",
        loanFinancialCofinancier: config.sidfHostUrl + "/cofins/FinPlanId&requestId",
        loancofinancier: config.sidfHostUrl + "/cofins",
        loanIncomeStatement: config.sidfHostUrl + "/finstat",
        loanGetIncomeStatementByBPId: config.sidfHostUrl + "/finstat/bpNum&requestId/CP/customerId/profileId",
        loanAssetStatement: config.sidfHostUrl + "/finAssetStats",
        loanGetAssetStatementByBPId: config.sidfHostUrl + "/finAssetStats/bpNum&requestId/CP/customerId/profileId",
        loanLiabilitiesStatement: config.sidfHostUrl + "/finLiabStats",
        loanGetLiabilitiesStatementByBPId: config.sidfHostUrl + "/finLiabStats/bpNum&requestId/CP/customerId/profileId",
        loanFlowStatement: config.sidfHostUrl + "/finFlowStats",
        loanGetFlowStatementByBPId: config.sidfHostUrl + "/finFlowStats/bpNum/UP",

        loanMachineryDropdownGet: config.sidfHostUrl + "/masterInfos/Machineries*fid=finplanid",
        loanGetMarketingInformation: config.sidfHostUrl + "/product/projectId/CP/customerId/customerProfile",
        loanPostMarketingInformation: config.sidfHostUrl + "/product",
        sendRequest: config.sidfHostUrl + "/sendRequests/customerProfileId/requestType-customerId",
        getPrevLoanDetForUse:config.sidfHostUrl + "/loanApplication/copy/prevReqId&currReqId", 
        getPrevPRQLoanDetForCopy:config.sidfHostUrl + "/loanApplication/copy/requestList/custProfId", 
        getLicDetBasedOnPrevReq:config.sidfHostUrl + "/loanApplication/copy/prevReqId", 
        getMyCasesMaster:config.sidfHostUrl + "/masterInfos/MyCase/MyCase", 

        loanGetTechnical: config.sidfHostUrl + "/technicalInfos/loanId/CP/customerId/profileId",
        loanPOSTTechnical: config.sidfHostUrl + "/technicalInfos",
        loanGETTechnicalComponent: config.sidfHostUrl + "/technicalInfos/finPlanId/CP&SentRequestId/customerId/customerProfileId",
        loanGETComponentCategories: config.sidfHostUrl + "/parameters/componentCategories",
        createDocumentIdForUpload: config.sidfHostUrl + "/projects/entityId/checklist/operationName/0/complete",
        uploadDocumentByDocumentId: config.sidfHostUrl + "/projects/entityId/checklist/operationName/documentId/upload/DocumentDefId",
        getDocumentsByEntityId: config.sidfHostUrl + "/typeIP/entityId/checklist/operationName/",
        deleteDocumentByDocumentId: config.sidfHostUrl + "/projects/entityId/checklist/operationName/refId/documents/documentId",

        downloadDocumentsURL: config.sidfHostUrl + "/projects/entityId/checklist/SIDFPreparationDocuments/refId/documents/documentId/fileName",
        downloadDocumentsBase64URL: config.sidfHostUrl + "/projects/display/checklist/entityId/refId/documentId/fileName",
        downloadDocumentsPublicURL: config.downloadDocmHostURL + "/projects/checklist/entityId/refId/documentId/fileName",

        dashBoardFeedback: config.sidfHostUrl + "/feedbacks",
        getDashBoardFeedback: config.sidfHostUrl + "/feedbacks/customerId",
        getCommunReceivedRequests: config.sidfHostUrl + "/myClient/profileId-RECR-customerId",

        getReceivedRequestCommMess: config.sidfHostUrl + "/myClient/profileId-NLOA-SCOM",
        postReceivedRequestCommMess: config.sidfHostUrl + "/comReq",

        postChecklistRequest: config.sidfHostUrl + "/loanAppGenInfo",

        crmSurveyUrl: "https://swdd.sidf.gov.sa:222/sap/bc/bsp/sap/zcrm_svy_wb/survey.htm?cmd=svyPresGet&conid=SIDF_CONNECTOR_SQR_500&applid=CRM_SURVEY_ACTIVITY&svyid=ZSIDF_WEBSITESURVEY_CSS1&vers=0000000001&parid=CRM_SVY_PARAMREAL_ZCRM_SVY_WB.XML&lang=EN&BP_ID=",

        getReceivedRequest: config.sidfHostUrl + "/recReq/profileId-PROF-CP-customerId",
        postReceivedRequest: config.sidfHostUrl + "/myClient/",

        postManfacProducts: config.sidfHostUrl + "/prodLines",
        getManfacProducts: config.sidfHostUrl + "/prodLines/finPlanId&sentReqId",

        myLoansGet: config.sidfHostUrl + "/myLoans/profileId-customerId",

        myLoansContractorGet: config.sidfHostUrl + "/myLoansContracts/ProjectId-Contractors",
        postMyLoanContractors: config.sidfHostUrl + "/myLoansContracts",

        myLoansContractsGet: config.sidfHostUrl + "/myLoansContracts/LoanId-Contracts",
        myLoansPaymentsGet: config.sidfHostUrl + "/myLoansContracts/ContractId-Payments",
        myLoansInvoiceGet: config.sidfHostUrl + "/myLoansContracts/PaymtId-Invoices",
        myLoansInvoiceItemList: config.sidfHostUrl + "/claims/sentReqId&LoanId&FinPlanId",
        postMyLoanContracts: config.sidfHostUrl + "/myLoansContracts",
        myLoansAgreementsGet: config.sidfHostUrl + "/myLoansContracts/LoanId-All",

        postClaimData: config.sidfHostUrl + "/claims",
        myLoansExceptionCategoryGet: config.sidfHostUrl + "/masterInfos/ExceptionCategories&CP",

        myLoansInsuranceGet: config.sidfHostUrl + "/insuranceMain/ProjId-PROJ",
        myLoansInsurancePost: config.sidfHostUrl + "/insuranceMain",

        myLoansAfadQuestionnaireGet: config.sidfHostUrl + "/afadSurvey/loanId",
        myLoansAfadQuestionnairePost: config.sidfHostUrl + "/afadSurvey",

        myLoansLoanUpdateConditionsGet: config.sidfHostUrl + "/cpLoanCondition/LoanId",
        myLoansLoanUpdateConditionsPost: config.sidfHostUrl + "/",

        getAttachmentPaymentsCategories: config.sidfHostUrl + "/insuranceMaster/all",

        commonCommentsGet: config.sidfHostUrl + "/recReq/ID-TYPE-CP",
        commonCommentsPost: config.sidfHostUrl + "/recReq",

        getAmendmentsListProjectorLoan: config.sidfHostUrl + "/amendmentHead/LoanorProjectId-LoanorProject",
        postAmendmentsListProjectorLoan: config.sidfHostUrl + "/amendmentHead",

        getNonBorrowingCertificate: config.sidfHostUrl + "/generalReport/CCERT-crid-customerId-crDate",
        operations: config.sidfHostUrl + "/operations",
        disbursement: config.sidfHostUrl + "/disbursementProcesses",

        getRepresentativesList: config.sidfHostUrl + "/customerProfile/profileId/customerId",
        postRepresentativesList: config.sidfHostUrl + "/customerProfile/List",
        getRepresentativesListUsingId: config.sidfHostUrl + "/customerProfile/List/idNumber/profileId/idType",

        myLoansLoanUpdateConditionsCommentsGet: config.sidfHostUrl + "/conditionComm/LoanId",
        myLoansLoanUpdateConditionsCommentsPost: config.sidfHostUrl + "/conditionComm",
        users: config.backEndUrl + "/Users",
        rcj: config.backEndUrl + "/RCJRequest",
        LandLoanPreliminary: config.backEndUrl + "/Preliminary",
        rcjQuestionnaire: config.backEndUrl + "/RCJQuestionnaire",
        getrcjQuestionnaireType: config.backEndUrl + "/RCJQuestionnaire/GetQuestionnaireType",
        checkValidECA: config.backEndUrl + "/Preliminary/CheckValidECALicense",
        LandLoanRequest: config.backEndUrl + "/LandLoanRequest",
        ModonLandForm5: config.backEndUrl + "/ModonLandForm5",
        ModonLandForm6: config.backEndUrl + "/ModonLandForm6/Get_Modon",
        ModonLandForm4: config.backEndUrl + "/ModonLandForm4",
        ModonLandForm3: config.backEndUrl + "/ModonLandForm3",
        ModonLandForm2: config.backEndUrl + "/ModonLandForm2",
        ModonLandForm1: config.backEndUrl + "/ModonLandForm1",

        Modon_Equipment: config.backEndUrl + "/Modon_Equipment/Get",
        Get_MODONLookUP: config.backEndUrl + "/LandLoanAPI/Get_MODONLookUP",
        Get_MODONTableAll: config.backEndUrl + "/LandLoanAPI/Get_MODONTableAll",
        GetClientDetails: config.backEndUrl + "/LandLoanAPI/GetClientDetails",
        GetModonLandForm1: config.backEndUrl + "/ModonLandForm1/Get",
        GetMimProducts: config.backEndUrl + "/LandLoanAPI/GetMimProducts",
        
        SaveModon_Equipment: config.backEndUrl + "/Modon_Equipment/Post",
        SaveModonLandForm1: config.backEndUrl + "/ModonLandFormTab/Post",
        SaveModon_ProductsDetails: config.backEndUrl + "/Modon_ProductsDetails/Post",
        SaveModon_Contact_Details: config.backEndUrl + "/Modon_Contact_Details/Post", 
        SaveModon_Documents: config.backEndUrl + "/Modon_Documents/Post",
        SaveModon_ImportingDetails: config.backEndUrl + "/Modon_ImportingDetails/Post",
        SaveModon_ExportingCountries: config.backEndUrl + "/Modon_ExportingCountries/Post",
        SaveModon_RawMaterialsDetails: config.backEndUrl + "/Modon_RawMaterialsDetails/Post",
        SaveModon_Products_List: config.backEndUrl + "/Modon_Products_List/Post", 
        SaveModon_ManufacturingTechnology: config.backEndUrl + "/Modon_ManufacturingTechnology/Post",
        DeleteData: config.backEndUrl + "/LandLoanAPI/DeleteData",

        ModonPreliminery: config.backEndUrl + "/ModonPreliminery",
        ModonSubActivities: config.backEndUrl + "/ModonSubActivity",
        ECARequest: config.backEndUrl + "/ECARequest",
        factoryLoan: config.backEndUrl + "/FactoryLoan2",
        rcy: config.backEndUrl + "/RCYRequest",
        rcyQuestionnaire: config.backEndUrl + "/RCYQuestionnaire",
        getrcyQuestionnaireType: config.backEndUrl + "/RCYQuestionnaire/GetQuestionnaireType",
        GetRequestsStatusByNationalId: config.backEndUrl + "/LandLoanAPI/GetDataByNatID",
        GetRequestsStatusByNationalIdAndServiceId: config.backEndUrl + "/LandLoanAPI/GetLoanDataByNatID",
        UpdatePreliminaryRequestStatusByLastStatus: config.backEndUrl + "/LandLoanAPI/UpdateStatus",
        UpdateLandLoanStatusByLastStatus: config.backEndUrl + "/LandLoanAPI/UpdateStatus",
        validateLandLoanAdminLogin: config.backEndUrl + "/AdminLogin/ValidateAdminLogin",
        GetRCYRequests: config.backEndUrl + "/AdminLogin/GetLoanDataByServicesId",
        GetRCJRequests: config.backEndUrl + "/LandLoanAPI/GetLoanDataByServicesIdALL",
        rcyInvesterInformation: config.backEndUrl + "/RCYInvesterInformation/GetAdinInvesterInformation",
        UpdateStatusApproveReject: config.backEndUrl + "/LandLoanAPI/UpdateStatus",
        ExportToExcelsheet: config.backEndUrl + "/LandLoanAPI/GetRCYClientDataINeXCEL",
        ILModonCity: "https://e.modon.gov.sa/prdsidfapi/sidf/GetCityNameForm2_ByILNumber",
        checkCityAvailability: "https://e.modon.gov.sa/prdsidfapi/sidf/CheckCityAreaAvailability",
        finalSubmit: config.backEndUrl + "/FinalSubmit",
        preliminary: config.backEndUrl + "/Preliminary/Get_ILCityMap",
        requestStatistic: config.backEndUrl + "/ClientDashboard",
        admin_dashboardGetStatistics: config.backEndUrl + "/LandLoanAPI/GetLoanDataCountByServicesIdALL",
       
        GetCityLookup: config.backEndUrl + "/LandLoanAPI/GetCityLookup",
        
        GetRequestCountbyStatus: config.backEndUrl + "/LandLoanAPI/GetRequestCountbyStatus",

        admin_dashboardGetChart: config.backEndUrl + "/LandLoanAPI/GetLoanDataByServicesIdALLCOUNT",
        GetLookupStatus: config.backEndUrl + "/LandLoanAPI/GetStatusLookup",
        CRInformation: "https://eservices.sidf.gov.sa/SIDFMobileApplicationServices/api/ExternalService/GetCRInfoByCRNo",
   
        GetAdminUsers: config.backEndUrl + "/LandLoanAPI/GetALLUser",
        AddAdminUser: config.backEndUrl + "/LandLoanAPI/AddUser",
        DeleteAdminUser: config.backEndUrl + "/LandLoanAPI/DeleteUser",
        UpdateAdminUserPass: config.backEndUrl + "/LandLoanAPI/UpdateUser",
        
   
    }
    // downloadDocumentsURL: config.sidfHostUrl + "/projects/entityId/checklist/SIDFPreparationDocuments/refId/documents/documentId/fileName",
    return JSON.stringify(apis);

};