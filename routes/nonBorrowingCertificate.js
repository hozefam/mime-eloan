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
var fs = require('fs');

var refreshTokens = {};
var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post(
    "/getNonBorrowingCertificateInitialFinal",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const LoanId = req.body.LoanId;
        const IorF = req.body.IorF;
        const FactoryId = req.body.FactoryId;
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let url = apisJson.getNonBorrowingCertificateInitialFinal
        .replace("LoanId", LoanId)
        .replace("customerId", decryptedUserId)
        .replace("IorF", IorF)
        .replace("FactoryId", FactoryId);
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
            var err = "Getting Certificate Failed";
            res.json(err);
        });
    }
);

router.post("/getNonBorrowingCertificate",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        // const profileId = req.body.data.profileId;
        // const LoanorProject = req.body.data.LoanorProject;
        const cr_number = req.body.cr_number;
        const cr_date = req.body.cr_date;

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let url = apisJson.getNonBorrowingCertificate
            .replace("crid", cr_number)
            .replace("customerId", decryptedUserId)
            .replace("crDate", cr_date);
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
                var err = "Getting Certificate Failed";
                res.json(err);
            });

    });

router.post("/getNonBorrowingCertificateRequests",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        let url = apisJson.getNonBorrowingCertificateRequests
            .replace("customerId", decryptedUserId);
        // console.log(url);
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
                var err = "Getting Non Borrowing Certificate Requests Failed";
                res.json(err);
            });

    });


router.post(
    "/postExceptions",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url = "/assets/images";
        var screen = req.body.screen;
        var operation = req.body.operation;
        var userid = req.body.userid;
        var username = req.body.username;
        var customerprofileid = req.body.customerprofileid;

        var user = req.user;
        var date = new Date;
        var data = {
            Screen: screen,
            Operation: operation,
            Date: (date.getDate() + "-") + (+date.getMonth() + 1 + "-") + (date.getFullYear() + ""),
            Time: (date.getHours() + "-") + (date.getMinutes() + "-") + (date.getSeconds() + ""),
            CustomerId: customerprofileid,
            username: username,
            userid: userid
        };
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        data.CustomerId = decryptedCustomerId;
        // = JSON.stringify(req.body);
        console.log(data + "");
        console.log(JSON.stringify(data));
        var filepath = "Logs/" + data.CustomerId + " Date(" + data.Date + ") Time(" + data.Time + ").txt";

        fs.writeFile(filepath, JSON.stringify(data), (err) => {
            if (err) throw err;
            console.log("The file was succesfully saved!");
        })
    }
);
module.exports = router;