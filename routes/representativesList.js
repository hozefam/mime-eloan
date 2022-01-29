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

router.post("/getRepresentativesList",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        const ProfileId = req.body.ProfileId;
        var user = req.user;
        var decryptedCustomerId = cryptr.decrypt(user.userId);
        // console.log(decryptedCustomerId);
        let url = apisJson.getRepresentativesList.replace("profileId", ProfileId).replace("customerId", decryptedCustomerId);
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
                var err = "Getting Representatives List Failed";
                res.json(err);
            });

    });

router.post("/getRepresentativesListUsingId",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        const ProfileId = req.body.ProfileId;
        const idNumber = req.body.idNumber;
        const idType = req.body.idType;


        let url = apisJson.getRepresentativesListUsingId
            .replace("profileId", ProfileId).replace("idNumber", idNumber).replace("idType", idType);

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
                var err = "Getting Representatives List Failed";
                res.json(err);
            });

    });

router.post("/postRepresentativesList",
    passport.authenticate("jwt", { session: false }), (req, res) => {


        const data = JSON.stringify(req.body);

        let url = apisJson.postRepresentativesList;

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

                var err = "Posting Representatives List Using ID Failed";
                res.json(err);
            });

    });



module.exports = router;