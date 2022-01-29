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

// @route   GET users/getAll
// @desc    Login User / Returning JWT Token
// @access  Public

var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post("/getLoanDropdowns",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loanDropdownsGet;

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting Loan Dropdowns Failed !" });
            });

    });


router.post("/initiateLoanApplication",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        req.body.CustomerId = decryptedUserId;

        const data = JSON.stringify(req.body);

        let url = apisJson.loanProjectInformationInitiateLoan;

        axios({
            method: 'post',
            url,
            data: data,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Initiating Loan Application Failed !" });
            });

    });

router.post("/getProjectInformation",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        customerId = decryptedUserId;

        requestId = req.body.requestId;

        bpId = req.body.bpId;

        let url = apisJson.loanProjectInformationGet.replace("requestId", requestId).replace("bpId", bpId).replace("customerId", customerId);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting Project Information Failed !" });
            });

    });


router.post("/getProjectKPMRInformation",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        var customerId = decryptedUserId;

        var bpId = req.body.bpId;

        var profileId = req.body.profileId;

        let url = apisJson.loanProjectKPMRInformationGet.replace("bpId", bpId).replace("customerId", customerId).replace("profileId", profileId);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting Project KPMR Information Failed !" });
            });

    });

router.post("/postProjectInformation",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        req.body.CustomerId = decryptedUserId;

        const data = JSON.stringify(req.body);

        let url = apisJson.loanProjectInformationPost;

        axios({
            method: 'post',
            url,
            data: data,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Posting Project Information Failed !" });
            });

    });

router.post("/postProjectAssetInformation",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        req.body.CustomerId = decryptedUserId;

        const data = JSON.stringify(req.body);

        let url = apisJson.loanProjectAssetInformationPost;

        axios({
            method: 'post',
            url,
            data: data,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, MessText: "Posting Project Asset Information Failed !" });
            });

    });

router.post("/postProjectKPMRInformation",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        req.body.CustomerId = decryptedUserId;

        let url = apisJson.loanProjectKPMRInformationPost;

        const data = JSON.stringify(req.body);

        axios({
            method: 'post',
            url,
            data: data,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Posting Project KPMR Information Failed !" });
            });

    });

router.post("/submitLoanApplication",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        req.body.CustomerId = decryptedUserId;

        const data = JSON.stringify(req.body);

        let url = apisJson.loanProjectInformationPost;

        axios({
            method: 'post',
            url,
            data: data,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Submitting Loan Application Failed !" });
            });

    });

router.post("/getBpExternalId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const externalid = req.body.data.externalid
        //const externalid = 1010174633

        let url = apisJson.loanProjectGetBpExternalId
            .replace("externalid", externalid);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {  // TODO: Error in Prodaction 
               // res.json({ MessType: 'E', error: true, MessText: "Getting Factory Cr Failed !" });
            });

    });

router.post(
    "/guarantors",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loanProjectPostGuarantors;

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
                res.json({ cofinancier: [{ MessType: 'E', error: true, MessText: "cofinancier post failed" }] });
            });
    }
);

router.post(
    "/checkExternalId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;

        const decryptedUserId = cryptr.decrypt(user.userId);

        req.body.CustomerId = decryptedUserId;

        const data = JSON.stringify(req.body);

        let url = apisJson.loanProjectPostcheckExternalId;

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
                res.json({ cofinancier: [{ MessType: 'E', error: true, MessText: "External ID check post failed" }] });
            });
    }
);

module.exports = router;