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

router.post("/getLoanMachineryDropdown",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const finplanid = req.body.data.finplanid;
        
        let url = apisJson.loanMachineryDropdownGet.replace("finplanid", finplanid);
        
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
        .then(function(response) {
            res.send(response.data);
        })
        .catch(function(error) {
            res.json({ MessType: 'E', error: true, message: "Getting Loan Machinery Dropdown Failed !" });
        });

    });

router.post("/getMarketingInformation", 
passport.authenticate("jwt", { session: false }),(req, res) => {

    const user = req.user;
    
    const decryptedUserId = cryptr.decrypt(user.userId);

    const customerId = decryptedUserId;

    const projectId = req.body.data.projectId;
    
    const customerProfile = req.body.data.customerProfile;

    let url = apisJson.loanGetMarketingInformation.replace("projectId", projectId).replace("customerId", customerId).replace("customerProfile", customerProfile);
    
    axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
        .then(function(response) {
            res.send(response.data);
        })
        .catch(function(error) {
            res.json({ MessType: 'E', error: true, message: "Getting Marketing Information Failed !" });
        });

});

router.post("/postMarketingInformation", 
passport.authenticate("jwt", { session: false }),(req, res) => {

    const user = req.user;
    
    const decryptedUserId = cryptr.decrypt(user.userId);

    req.body.CustomerId = decryptedUserId;

    const data = JSON.stringify(req.body);
    
    let url = apisJson.loanPostMarketingInformation;

    axios({
            method: 'post',
            url,
            data: data,
            auth: config.sidfAuthentication,
            headers: {
            'Content-Type' : 'application/json;charset=UTF-8'
            }
        })
        .then(function(response) {
            res.send(response.data);
        })
        .catch(function(error) {
            res.json({ MessType: 'E', error: true, message: "Posting Marketing Information Failed" });
        });

});

module.exports = router;