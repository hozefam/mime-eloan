const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require("axios");
const logger = require("../config/logger").logger;
const passport = require("passport");
const _ = require("underscore");
const apis = require("../model/apis");
const Cryptr = require('cryptr');

var apisJson = {};
apisJson = JSON.parse(apis.apisList());


router.post(
    "/GetRCYRequests", (req, res) => {

        const data = {
            "ServiceId": req.body.serviceId
        };

        let url = apisJson.GetRCYRequests
        axios({
            method: 'get',
            url,
            data
        })
            .then(function (response) {

                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Get RCY Request Data failed" }] };
                logger.error("Error Getting RCY Requests", error);
                res.json(ReqMess);
            });
    });

//ExportToExcelsheet
router.post(
    '/ExportToExcelsheet',
    (req, res) => {

        // const data = {
        //     "PreliminaryRequestNumber": req.body.PreliminaryRequestNumber
        // };

        let url = `${apisJson.ExportToExcelsheet}?PreliminaryRequestNumber=${req.body.PreliminaryRequestNumber}`;

        axios({
            method: 'get',
            url
        })
            .then(function (response) {
                console.log("result is :", response);

                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error while update status ", error);
                res.json(ReqMess);
            });
    });

router.post(
    '/UpdateStatusApproveReject',
    (req, res) => {

        const data = {
            "SIDFPreliminaryID": req.body.SIDFPreliminaryID,
            "SIDFRequestNo": req.body.SIDFRequestNo,
            "StatusId": req.body.StatusId,
            "RejectionReason": req.body.RejectionReason
        };

        let url = apisJson.UpdateStatusApproveReject
        axios({
            method: 'post',
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
                logger.error("Error while update status ", error);
                res.json(ReqMess);
            });
    });
module.exports = router;