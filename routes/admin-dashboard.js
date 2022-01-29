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
    "/GetRequestCountbyStatus", (req, res) => {
        let url = apisJson.GetRequestCountbyStatus
        axios({
            method: 'get',
            url,
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Get RCJ Request Data failed" }] };
                logger.error("Error Getting Data Count  Request status", error);
                res.json(ReqMess);
            });
    });



router.post(
    "/GetStatistics", (req, res) => {

        const data = {
            "ServiceId": req.body.serviceId,
      "loadId" : req.body.loadId,
          "fromdate" : req.body.fromCreationDate,
            "todate" : req.body.toCreationDate,
            "fromreqamount":req.body.fromAmount,
            "toreqamount":req.body.toAmount,
            "city":req.body.city,
        };

        let url = apisJson.admin_dashboardGetStatistics
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
        "/GetCityLookup", (req, res) => {
    
         
    
            let url = apisJson.GetCityLookup
            axios({
                method: 'get',
                url,
               
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
    '/GetLoanDataByServicesIdChart',
    (req, res) => {

        const data = {
            "ServiceId": req.body.serviceId,
            "Month": req.body.month,
            "Year": req.body.year,
            
        };

        let url = apisJson.admin_dashboardGetChart
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
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed "+this.data }] };
                logger.error("Error while get chart data ", error);
                res.json(ReqMess);
            });
    });
module.exports = router;