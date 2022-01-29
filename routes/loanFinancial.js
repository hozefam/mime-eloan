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

router.post("/getBpExternalId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const externalid = req.body.data.externalid
        //const externalid = 1010174633

        let url = apisJson.loanFinancialgetBpExternalId
            .replace("externalid", externalid);
        console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                console.log("Getting Factory Cr Failed !", error);
                res.json({ MessType: 'E', error: true, MessText: "Getting Factory Cr Failed !" });
            });

    });

router.post("/getcofinancier",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        //const FinPlanId = 450;
        const FinPlanId = req.body.data.FinPlanId;
        const requestId = req.body.data.requestId;

        let url = apisJson.loanFinancialCofinancier
            .replace("FinPlanId", FinPlanId)
            .replace("requestId", requestId);
        console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Cofinancers info by BP Id ", error);
                res.json(ReqMess);
            });

    });

router.post(
    "/cofinancier",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loancofinancier;

        var data = req.body;

        console.log(url);
        data = JSON.stringify(data);
        console.log(data);
        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { cofinancier: [{ MessType: 'E', error: true, MessText: "cofinancier post failed" }] };
                logger.error("Error in cofinancier Api, ", error);
                res.json(ReqMess);
            });
    }
);

router.post(
    "/createBpRelation",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loancreateBpRelation;

        var data = req.body;

        data = JSON.stringify(data);

        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { cofinancier: [{ MessType: 'E', error: true, MessText: "cofinancier post failed" }] };
                logger.error("Error in cofinancier Api, ", error);
                res.json(ReqMess);
            });
    }
);


router.post(
    "/incomeStatement",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loanIncomeStatement;

        var data = req.body;

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        data.Customerid = decryptedUserId;

        data = JSON.stringify(data);

        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Incstat: [{ MessType: 'E', error: true, MessText: "Income statement failed" }] };
                logger.error("Error in income statement Api, ", error);
                res.json(ReqMess);
            });
    }
);

router.post("/getIncomeStatementInfoByBPId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const bpNum = req.body.data.bpId;
        const customerId = decryptedUserId;
        const profileId = req.body.data.profileId;
        const requestId = req.body.data.requestId

        let url = apisJson.loanGetIncomeStatementByBPId
            .replace("bpNum", bpNum)
            .replace("customerId", customerId)
            .replace("requestId", requestId)
            .replace("profileId", profileId);
        //console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Incstat: [{ MessType: 'E', error: true, MessText: "Income statement failed" }] };
                logger.error("Income statement info by BP Id ", error);
                res.json(ReqMess);
            });

    });

router.post(
    "/assetStatement",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url = apisJson.loanAssetStatement;

        var data = req.body;

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        data.Customerid = decryptedUserId;

        data = JSON.stringify(data);
        //console.log(data);
        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Assetstat: [{ MessType: 'E', error: true, MessText: "Asset statement failed" }] };
                logger.error("Error in Create asset statement Api, ", error);
                res.json(ReqMess);
            });
    }
);


router.post("/getAssetStatementInfoByBPId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const bpNum = req.body.data.bpId;
        const customerId = decryptedUserId;
        const profileId = req.body.data.profileId;
        const requestId = req.body.data.requestId

        let url = apisJson.loanGetAssetStatementByBPId
            .replace("bpNum", bpNum)
            .replace("customerId", customerId)
            .replace("requestId", requestId)
            .replace("profileId", profileId);
        //console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Assetstat: [{ MessType: 'E', error: true, MessText: "Asset statement info failed" }] };
                logger.error("Asset statement info by BP Id ", error);
                res.json(ReqMess);
            });

    });

router.post(
    "/liabilitiesStatement",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url = apisJson.loanLiabilitiesStatement;

        var data = req.body;

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        data.Customerid = decryptedUserId;

        data = JSON.stringify(data);

        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
            .then(function (response) {

                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Liabstat: [{ MessType: 'E', error: true, MessText: "Liabilities statement Failed" }] };
                logger.error("Error in loan Liabilities statement Api, ", error);
                res.json(ReqMess);
            });
    }
);



router.post("/getLiabilitiesStatementInfoByBPId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const bpNum = req.body.data.bpId;
        const customerId = decryptedUserId;
        const profileId = req.body.data.profileId;
        const requestId = req.body.data.requestId

        let url = apisJson.loanGetLiabilitiesStatementByBPId
            .replace("bpNum", bpNum)
            .replace("customerId", customerId)
            .replace("requestId", requestId)
            .replace("profileId", profileId);
        //console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Liabstat: [{ MessType: 'E', error: true, MessText: "Liabilities statement info failed" }] };
                logger.error("Liabilities statement info by BP Id ", error);
                res.json(ReqMess);
            });

    });

router.post(
    "/flowStatement",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url = apisJson.loanFlowStatement;

        var data = req.body;

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        data.Customerid = decryptedUserId;

        data = JSON.stringify(data);

        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: data,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Flowstat: [{ MessType: 'E', error: true, MessText: "Flow statement Failed" }] };
                logger.error("Error in loan Flow statement Api, ", error);
                res.json(ReqMess);
            });
    }
);



router.post("/getFlowStatementInfoByBPId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const bpNum = req.body.data.bpId;
        // const bpNum = 2016;
        // const customerId = decryptedUserId;
        // const profileId = req.body.data.profileId;
        // const requestId = req.body.data.requestId

        let url = apisJson.loanGetFlowStatementByBPId
            .replace("bpNum", bpNum);
        //console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                var ReqMess = { Flowstat: [{ MessType: 'E', error: true, MessText: "Flow statement info failed" }] };
                logger.error("FLow statement info by BP Id ", error);
                res.json(ReqMess);
            });

    });


module.exports = router;