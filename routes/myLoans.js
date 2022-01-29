const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require("axios");
const moment = require("moment");
const querystring = require("querystring");
const logger = require("../config/logger").logger;
const db = require("../config/database");
const passport = require("passport");
const _ = require("underscore");
const randtoken = require("rand-token");
const apis = require("../model/apis");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.cpKey);

var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post("/getMyLoans",
    passport.authenticate("jwt", { session: false }), (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const profileId = req.body.data.profileId;

        let url = apisJson.myLoansGet.replace("profileId", profileId).replace('customerId', decryptedUserId);
        //  console.log(url)
        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans Failed" });
            });

    });

router.post("/getAmendmentsListProjectorLoan",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const LoanorProject = req.body.data.LoanorProject;
        const LoanorProjectId = req.body.data.LoanorProjectId;

        let url = apisJson.getAmendmentsListProjectorLoan.replace("LoanorProjectId", LoanorProjectId).replace("LoanorProject", LoanorProject);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Contracts Failed" });
            });

    });

router.post(
    "/postAmendmentsListProjectorLoan",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.postAmendmentsListProjectorLoan;
        var data = req.body;

        var user = req.user;
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        data.AmendmentReq[0]["CustNumber"] = decryptedCustomerId;

        logger.info(url);

        axios({
                method: 'post',
                url,
                auth: config.sidfAuthentication,
                data: data,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            })
            .then(function(response) {
                logger.info(response.data);
                res.send(response.data);
            })
            .catch(function(error) {
                logger.error("Amendments List Creation / Updation Failed, ", error);
                res.json({ MessType: 'E', error: true, message: "Amendments List Creation / Updation Failed" });
            });
    }
);


router.post("/getInsuranceData",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const ProjId = req.body.data.InsId;

        let url = apisJson.myLoansInsuranceGet
            .replace("ProjId", ProjId);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Insurance Failed" });
            });

    });

// POST Ins
router.post("/postInsurance",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let data = req.body;

        data.Id = data.Id + "-" + decryptedUserId;

        data = JSON.stringify(req.body);

        let url = apisJson.myLoansInsurancePost;

        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MessType: 'E', error: true, MessText: "Post Of My Loans - Insurance Failed" });
            });

    });


router.post("/getMortgagedFADropdown",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const DropdownName = req.body.data.DropdownName;

        let url = apisJson.myLoansMortgagedFAGetDropdown.replace("DropdownName", DropdownName);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Mortgaged Fixed Assets Component Dropdown Failed" });
            });

    });

router.post("/getMortgagedFA",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const LoanId = req.body.data.LoanId;

        const GetType = req.body.data.GetType;

        let url = apisJson.myLoansMortgagedFAGet.replace("GetType", GetType).replace("LoanId", LoanId);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MsgId: 'E', error: true, MsgText: "Getting My Loans - Mortgaged Fixed Assets Failed" });
            });

    });

router.post("/postMortgagedFA",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        data = JSON.stringify(req.body);

        let url = apisJson.myLoansMortgagedFAPost;

        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MsgId: 'E', error: true, MsgText: "Post Of My Loans - Mortgaged Fixed Assets Failed" });
            });

    });

router.post("/getAfadQuestionnaire",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const loanId = req.body.data.loanId;

        let url = apisJson.myLoansAfadQuestionnaireGet.replace("loanId", loanId);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - AFAD Questionnaire Failed" });
            });

    });

router.post("/postAfadQuestionnaire",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        data = JSON.stringify(req.body);

        let url = apisJson.myLoansAfadQuestionnairePost;

        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                res.json({ MessType: 'E', error: true, MessText: "Post Of My Loans - AFAD Questionnaire Failed" });
            });

    });

// Get Loan Update Conditions
router.post("/getLoanUpdateConditionsData",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const LoanId = req.body.data.LoanId;

        let url = apisJson.myLoansLoanUpdateConditionsGet.replace("LoanId", LoanId);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                var err = "Getting My Loans - Loan Update Conditions Failed";
                res.json(err);
                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Loan Update Conditions Failed" });
            });

    });

// POST Loan Update Conditions
router.post("/postLoanUpdateConditions",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let data = req.body;

        data.Id = data.Id + "-" + decryptedUserId;

        data = JSON.stringify(req.body);

        let url = apisJson.myLoansLoanUpdateConditionsPost;

        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Post of My Loans - Loan Update Conditions Failed" });
            });

    })

//Get Conditions Comments
router.post("/getLoanConditionsComments",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const LoanId = req.body.data.LoanId;

        let url = apisJson.myLoansLoanUpdateConditionsCommentsGet.replace("LoanId", LoanId);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Loan Update Conditions Comments Failed" });
            });

    });
//Post Conditions Comments
router.post("/postLoanConditionsComments",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let data = req.body;

        data.Id = data.Id + "-" + decryptedUserId;

        data = JSON.stringify(req.body);

        let url = apisJson.myLoansLoanUpdateConditionsCommentsPost;

        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Post of My Loans - Loan Update Conditions Comments Failed" });
            });

    })

router.post("/postClaimData",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        const data = JSON.stringify(req.body);

        let url = apisJson.postClaimData;
        // console.log(data);
        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Post of My Loans - Claims Failed" });
            });

    });

router.post("/getExceptionCategory",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        let url = apisJson.myLoansExceptionCategoryGet;

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                var err = "Getting My Loans - Claims Exception Category Failed";
                res.json(err);
                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Claims Exception Category Failed" });
            });

    });

router.post("/getProjectFinancial",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const LoanId = req.body.data.LoanId;
        const Type = req.body.data.Type;
        const state = req.body.data.state;

        let url;

        if (state === "1")
            url = apisJson.myLoansFinancialStatementAssetGet.replace("LoanId", LoanId).replace("Type", Type);

        else if (state === "2")
            url = apisJson.myLoansFinancialStatementLiabGet.replace("LoanId", LoanId).replace("Type", Type);

        else if (state === "3")
            url = apisJson.myLoansFinancialStatementIncomeGet.replace("LoanId", LoanId).replace("Type", Type);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Get Financial Statements Failed" });
            });

    });

router.post("/postFinancialStatements",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const data = JSON.stringify(req.body.data);
        var state = req.body.state;

        let url;

        if (state === "1")
            url = apisJson.myLoanFinancialDataAssetPost;
        else if (state === "2")
            url = apisJson.myLoanFinancialDataLiabPost;
        else if (state === "3")
            url = apisJson.myLoanFinancialDataIncomePost;

        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Post of My Loans - Post Financial Statements Failed" });
            });

    });

router.post("/getInvoiceCategories",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        let url = apisJson.myLoansInvoiceCategoryGet;

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);
                var err = "Getting My Loans - Contracts Invoice Categories Failed";
                res.json(err);
                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Contracts Invoice Categories Failed" });
            });

    });

router.post("/getAuditDetails",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const ProjId = req.body.data.ProjId;
        // const ProjId = 0000001110;

        let url;

        url = apisJson.myLoansAuditDetailsGet.replace("ProjId", ProjId);
        console.log(url);
        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Getting My Loans - Get Audit Details Failed" });
            });

    });

router.post("/postAuditDetails",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const data = JSON.stringify(req.body);

        console.log(data);

        let url;

        url = apisJson.myLoansAuditDetailsPost;

        console.log(url);
        axios({
                method: 'post',
                url,
                data: data,
                auth: config.sidfAuthentication,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info(error);

                res.json({ MessType: 'E', error: true, MessText: "Post of My Loans - Post Audit Details Failed" });
            });

    });



module.exports = router;