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

router.post("/getCommonComments",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        id = req.body.id;
        type = req.body.type;

        let url = apisJson.commonCommentsGet.replace("ID", id).replace("TYPE", type);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.info(error);
                res.json({ MessType: 'E', error: true, message: "Getting Common Comments Failed !" });
            });

    });

router.post("/postCommonComments",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        const data = JSON.stringify(req.body);
        
        let url = apisJson.commonCommentsPost;

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
                res.json({ MessType: 'E', error: true, message: "Posting Common Comments Failed !" });
            });

    });

module.exports = router;