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

var refreshTokens = {};
var apisJson = {};
apisJson = JSON.parse(apis.apisList());


router.post(
    "/generateIvrService",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const Indicator = req.body.Indicator;

        data = {ProfileId: decryptedUserId, Indicator: Indicator};

        let url = apisJson.ivrService;
        // console.log(data);
// console.log(url);
        axios({
                method: 'post',
                url,
                auth: config.sidfAuthentication,
                data: data,
                headers: {
                'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error in IVR Generation" });
            });
    }
);


router.post(
    "/verifyIvrOtpService",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const Indicator = req.body.Indicator;
        const IvrCode = req.body.IvrCode;
        const Otp = req.body.Otp;

        data = {ProfileId: decryptedUserId, Indicator: Indicator, IvrCode:IvrCode, Otp: Otp};

        let url = apisJson.ivrService;
        // console.log(data);

        axios({
                method: 'post',
                url,
                auth: config.sidfAuthentication,
                data: data,
                headers: {
                'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error in IVR Generation" });
            });
    }
);


router.post(
    "/resetIvrService",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        const Indicator = req.body.Indicator;
        const IvrCode = req.body.IvrCode;
        const OldIvrCode = req.body.OldIvrCode;

        data = {ProfileId: decryptedUserId, Indicator: Indicator, IvrCode:IvrCode, OldIvrCode: OldIvrCode};
// console.log(data);
        let url = apisJson.ivrService;

        axios({
                method: 'post',
                url,
                auth: config.sidfAuthentication,
                data: data,
                headers: {
                'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .then(function(response) {
                res.send(response.data);
            })
            .catch(function(error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error in IVR Generation" });
            });
    }
);

module.exports = router;