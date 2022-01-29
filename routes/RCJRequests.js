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
    "/GetRCJRequests", (req, res) => {

        const data = {
            "ServiceId": req.body.serviceId,
            "StatusId":req.body.statusId
        };

        let url = apisJson.GetRCJRequests
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
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Get RCJ Request Data failed" }] };
                logger.error("Error Getting RCj Requests", error);
                res.json(ReqMess);
            });
    });



router.post(
    '/GetLookupStatus',
    (req, res) => {


        let url = `${apisJson.GetLookupStatus}?ServiceId=${req.body.serviceId}`;
        axios({
            method: 'get',
            url,
           // data
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
                console.log("result is :", response);

                res.send(response.data);
            })
            .catch(function (error) {
        
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error Getting Status Requests ", error);
                res.json(ReqMess);
            });
    });
module.exports = router;