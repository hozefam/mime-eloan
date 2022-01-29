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

// router.post("/getLoanTechnicalByLoanId",
//     passport.authenticate("jwt", { session: false }), (req, res) => {
//         var loanId = req.body.loanId;
//         var profileId = req.body.profileId;

//         var user = req.user;
//         var decryptedCustomerId = cryptr.decrypt(user.userId);
//         if (loanId <= 0)
//             res.status(400).json({ MessType: 'E', error: true, username: "Loan id is not empty" });
//         if (profileId < 0)
//             res.status(400).json({ MessType: 'E', error: true, username: "Customer profile id is not empty" });
//         if (decryptedCustomerId === '')
//             res.status(400).json({ MessType: 'E', error: true, username: "Customer id is not empty" });

//         let url = apisJson.loanGetTechnical.replace("loanId", loanId).replace('customerId', decryptedCustomerId).replace("profileId", profileId);

//         axios({
//                 method: 'get',
//                 url,
//                 auth: config.sidfAuthentication
//             })
//             .then(function(response) {
//                 res.send(response.data);
//             })
//             .catch(function(error) {
//                 logger.error("Loan Technical info by loan id ", error);
//                 res.json({ MessType: 'E', error: true, MessText: "Loan Technical info failed" });
//             });

//     });

router.post(
    "/postLoanTechnical",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url = apisJson.loanPOSTTechnical;
        var data = req.body;
        var user = req.user;
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        data.CustomerId = decryptedCustomerId;
        data = JSON.stringify(req.body);
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
            .then(function(response) {
                // console.log(response.data);
                res.send(response.data);
            })
            .catch(function(error) {
                logger.error("Error in create technical Api, ", error);
                res.json({ MessType: 'E', error: true, MessText: "Technical Component creation failed" });
            });
    }
);

router.post("/getManfacProducts",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        var customerProfileId = req.body.customerProfileId;
        var finPlanId = req.body.finPlanId;
        var SentReqId = req.body.SentRequestId;

        var user = req.user;
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        let url = apisJson.getManfacProducts.replace("finPlanId", finPlanId).replace("sentReqId", SentReqId);
        console.log(url);
        logger.info(url);
        if (finPlanId != undefined) {

            axios({
                    method: 'get',
                    url,
                    auth: config.sidfAuthentication
                })
                .then(function(response) {
                    logger.info(response.data)
                    res.send(response.data);
                })
                .catch(function(error) {
                    logger.info("Failed !", error);
                    res.json({ MessType: 'E', error: true, MessText: "Getting Machinery Stages / Production Lines Failed !" });
                });
        } else {
            logger.info("Id Undefined");
            res.json({ MessType: 'E', error: true, MessText: "Getting Machinery Stages / Production Lines Failed !" });
        }

    });


router.post(
    "/postManfacProducts",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url = apisJson.postManfacProducts;
        var data = req.body;
        var user = req.user;
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        data.CustomerId = decryptedCustomerId;
        data = JSON.stringify(req.body);
        console.log(data);
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
                // console.log(response.data);
                logger.info(response.data);
                res.send(response.data);
            })
            .catch(function(error) {
                logger.error("Machinery Stages / Production Lines Creation Failed, ", error);
                res.json({ MessType: 'E', error: true, MessText: "Machinery Stages / Production Lines Creation Failed" });
            });
    }
);

router.post("/getLoanTechnicalComponent",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        var customerProfileId = req.body.customerProfileId;
        var finPlanId = req.body.finPlanId;
        var SentReqId =  req.body.SentRequestId;

        var user = req.user;
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        let url = apisJson.loanGETTechnicalComponent.replace("customerProfileId", customerProfileId).replace("finPlanId", finPlanId).replace("customerId", decryptedCustomerId).replace("SentRequestId", SentReqId);
        console.log(url);
        if (customerProfileId != undefined && finPlanId != undefined && decryptedCustomerId != undefined) {
            axios({
                    method: 'get',
                    url,
                    auth: config.sidfAuthentication
                })
                .then(function(response) {
                    logger.info(response.data);
                    res.send(response.data);
                })
                .catch(function(error) {
                    logger.info("Getting Technical Components Failed !", error);
                    res.json({ MessType: 'E', error: true, MessText: "Getting Technical Components Failed !" });
                });
        } else {
            logger.info("Id Undefined");
            res.json({ MessType: 'E', error: true, MessText: "Getting Technical Components Failed !" });
        }

    });


router.post("/getLoanTechnicalComponentCategories",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loanGETComponentCategories;
        // console.log(url);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                logger.info(response.data)
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info("Getting Technical Components Categories Failed !", error);
                res.json({ MessType: 'E', error: true, MessText: "Getting Technical Component Categories Failed !" });
            });

    });

router.post("/postChecklistRequest",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        var user = req.user;
        var decryptedUserId = cryptr.decrypt(user.userId);

        var data = {
            "Origin": "CP",
            "CustomerId": decryptedUserId,
            "ProfileId": req.body.cust_prof_id,
            "SentReqId": req.body.loan_request_id,
            "Indicator": "CHECKLIST",
            "IsLoanSumbit": "X"
        };

        console.log("req" + req);

        //var data = req.body.comments;

        let url = apisJson.postChecklistRequest;

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
                res.json({ MessType: 'E', error: true, MessText: "Error while retrieving" });
            });

    });

module.exports = router;