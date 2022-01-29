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

router.post(
    "/validateLandLoanAdminLogin",
    (req, res) => {


        const data = {
            "UserName": req.body.UserName,
            "Password": req.body.Password
        };

        let url = apisJson.validateLandLoanAdminLogin
        axios({
            method: 'get',
            url,
            data
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
                console.log("result is :", response);

                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error Getting Requests Status type ", error);
                res.json(ReqMess);
            });
    });

router.post(
    "/GetRequestsStatusByNationalIdAndServiceIds",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        console.log('here is the bynatservice', req.body);


        const data = {
            "NationalId": req.body.nationalId,
            "ServiceId": req.body.serviceId
        };
        //let url = apisJson.GetRequestsStatusByNationalIdAndServiceId + '?NationalId=' + req.body.nationalId + '?ServiceId=' + req.body.serviceId;
        //let url = `${apisJson.GetRequestsStatusByNationalIdAndServiceId}?NationalId=${req.body.nationalId}?ServiceId=${req.body.serviceId}`;
        let url = apisJson.GetRequestsStatusByNationalIdAndServiceId
        axios({
            method: 'get',
            url,
            data
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
                console.log("result is :", response);

                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error Getting Requests Status type ", error);
                res.json(ReqMess);
            });
    });

router.post(
    "/GetRequestsStatusByNationalId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = `${apisJson.GetRequestsStatusByNationalId}?NationalId=${req.body.nationalId}`;
        axios({
            method: 'get',
            url,
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
                console.log("result is :", response);

                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error Getting Requests Status type ", error);
                res.json(ReqMess);
            });
    });
router.post("/getPrevPRQLoanDetForCopy",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const custProfId = req.body.customerProfileId;

        let url = apisJson.getPrevPRQLoanDetForCopy.replace("custProfId", custProfId);
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
                logger.error("Error while getting rejected requests", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting rejected requests" });
            });
    }
);
router.post("/getPrevLoanDetForUse",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const prevReqId = req.body.prevReqId;
        const currReqId = req.body.currReqId;

        let url = apisJson.getPrevLoanDetForUse.replace("prevReqId", prevReqId).replace("currReqId", currReqId);
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
                logger.error("Error while getting rejected requests", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting rejected requests" });
            });
    }
);
router.post("/getLicDetBasedOnPrevReq",
    passport.authenticate("jwt", { session: false }),
    (req, res) => { 

        const prevReqId = req.body.prevReqId;

        let url = apisJson.getLicDetBasedOnPrevReq.replace("prevReqId", prevReqId);
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
                logger.error("Error while getting rejected requests", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting rejected requests" });
            });
    }
);
router.post("/getMyCasesMaster",
    passport.authenticate("jwt", { session: false }),
    (req, res) => { 
 
        let url = apisJson.getMyCasesMaster;
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
                logger.error("Error while master cases", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting master cases" });
            });
    }
);
router.post("/getSendRequest",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const customerProfileId = req.body.customerProfileId;
        const type = req.body.requestType;
        let productType=req.body.productType;
        if(!productType)
        productType="A";
        // const serviceId = req.body.serviceId
        // if (customerProfileId != 0)
        //     res.status(400).json({ MessType: 'E', error: true, username: "Customer ProfileId is not empty." });

        let url = apisJson.sendRequest.replace("customerProfileId", customerProfileId).replace('requestType', type).replace('customerId', decryptedUserId);
        // console.log(url)
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                console.log(response);
                if ((type === "NLOA" || type === "APRE"  || type === "NPRE") && response.data.length > 0) {
                    const tempRequests = [];
                    for (let i = 0; response.data.length > i; i++)
                        tempRequests.push(response.data[i].RequestId);
 
                    filterRequestsBasedOnProduct(tempRequests, req.body.serviceId, response.data, res,productType);
                }
                else
                    res.send(response.data);


            })
            .catch(function (error) {
                logger.error("Send request info by customer profile Id ", error);
                res.json({ MessType: 'E', error: true, message: "Get Send Request Failed !" });
            });
    }
);

async function filterRequestsBasedOnProduct(data, serviceId, originalRequests, res,productType) {
    url = apisJson.LandLoanRequest + "/RequestsFilter?serviceId=" + serviceId+"&productType="+productType
    await axios({
        method: "put",
        url,
        data
    }).then(response => {
        // for
        const result = originalRequests.filter(s => response.data.includes(s.RequestId))

        console.log(result);

        res.send(result);
    }).catch(error => {
        console.log(error);
    });

};

router.post("/postDashBoardFeedback",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        const data = {
            "CustomerNo": decryptedUserId,
            "Rating": req.body.rating,
            "Comments": req.body.comments,
            "LandLoanFlag":req.body.landLoanFlag

        };

        console.log(data);

        let url = apisJson.dashBoardFeedback;

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
                res.json({ MessType: 'E', error: true, message: "Error while saving the rating." });
            });

    });

router.post("/getDashBoardFeedback",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let url = apisJson.getDashBoardFeedback.replace("customerId", decryptedUserId);
        // console.log(url)
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error("Error while getting rating info  by customer id", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting rating details" });
            });
    }
);

 

router.post("/getCommunReceivedRequests",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const customerProfileId = req.body.customerProfileId;

        let url = apisJson.getCommunReceivedRequests.replace("profileId", customerProfileId).replace("customerId", decryptedUserId);
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
                logger.error("Error while getting communication request details", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting communication request details" });
            });
    }
);

router.post("/getReceivedRequestCommMess",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const customerProfileId = parseInt(req.body.customerProfileId);

        let url = apisJson.getReceivedRequestCommMess.replace("profileId", customerProfileId);
        console.log(url);
        console.log(req);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error("Error while getting communication request details", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting communication request details" });
            });
    }
);

router.post("/getReceivedRequest",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const customerProfileId = parseInt(req.body.customerProfileId);

        let url = apisJson.getReceivedRequest.replace("profileId", customerProfileId).replace("customerId", decryptedUserId);
        console.log(url);
        // console.log(req);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error("Error while getting received request details", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting received request details" });
            });
    }
);

router.post("/postReceivedRequest",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const data = req.body.data_temp;

        console.log("req" + req);
        console.log(data);

        //const data = req.body.comments;

        //  let url = apisJson.postReceivedRequestCommMess;
        let url = apisJson.postReceivedRequest;

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
                res.json({ MessType: 'E', error: true, message: "Error while saving the comments" });
            });

    });

router.post("/postReceivedRequestCommMess",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const data = {
            // "CustomerNo": decryptedUserId,
            // "Rating": req.body.rating,
            // "Comments": req.body.comments,

            "ProjId": req.body.project_id,
            "ReqType": req.body.request_type,
            "TaskInstId": "1",
            "CommReqComment": [{
                "RequestSection": "TECIN",
                "RequestSubSection": "TEBUI",
                "CommentText": req.body.comments_text,
                "UserId": decryptedUserId,
                "IsVisible": req.body.cust_prof_id
            }]
        };

        console.log("req" + req);

        //const data = req.body.comments;

        let url = apisJson.postReceivedRequestCommMess;

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
                res.json({ MessType: 'E', error: true, message: "Error while saving the comments" });
            });

    });


router.post("/getCRMSurveyURL",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({ MessType: 'S', error: false, crmUrl: apisJson.crmSurveyUrl });
    }
);

router.post("/getAllComplaints",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const customerProfileId = req.body.customerProfileId;
        let url = apisJson.getMyComplaints.replace("profileId", customerProfileId).replace("customerId", decryptedUserId);
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
                logger.error("Error while getting complaints", error);
                res.json({ MessType: 'E', error: true, message: "Error while getting compaints" });
            });
    }
);

module.exports = router;