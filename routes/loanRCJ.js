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
const rcjManger = require("./rcjInformation");
const cryptr = new Cryptr(config.cpKey);

var refreshTokens = {};
var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post(
    "/getRCJ",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        console.log('rcj ' + JSON.stringify(req.body) );
        console.log("inside getRCJ  request ID: "+req.body.requestId);
        let url = `${apisJson.rcj}?loanRequestNumber=${req.body.requestId}`;
        axios({
            method: 'get',
            url,
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
              console.log("result is :" , response);   
      
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("error getting request info", error);
                res.json(ReqMess);
            });

    })
    ;

    router.post('/sendRCJ', passport.authenticate("jwt", { session: false }), async (req, res) => {

        let url = apisJson.rcj;
        const user = req.user;
      
        const RequestData = JSON.stringify(req.body);
      
      
        axios({
          method: "post",
          url,
          data: RequestData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((result) => {
            console.log(result);
            res.send(result.data);
          }).catch((err) => {
            console.log(err);
          });
      
      })
      

      router.post('/sendRCJQuestionnaire', passport.authenticate("jwt", { session: false }), async (req, res) => {
        console.log("in post"  ); 
        let url = apisJson.rcjQuestionnaire;
        const user = req.user;
        const RequestData = JSON.stringify(req.body);
      
      
        axios({
          method: "post",
          url,
          data: RequestData,
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((result) => {
            console.log(result);
            res.send(result.data);
          }).catch((err) => {
            console.log(err);
          });
      
      })

router.post(
    "/getRCJQuestionnaireType",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url =`${apisJson.getrcjQuestionnaireType}?requestId=${req.body.requestId}`;
        axios({
            method: 'get',
            url,
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
              console.log("result is :" , response);   
      
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error getting questionnaire type ", error);
                res.json(ReqMess);
            });

    });
router.post(
    "/getRCJQuestionnaire",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        console.log("inside getRCJQuestionnaire  request ID: "+req.body.requestId);
        console.log('rcj ' + req + ' ' + res);


        let url =`${apisJson.rcjQuestionnaire}?requestId=${req.body.requestId}`;
        axios({
            method: 'get',
            url,
            //auth: config.sidfAuthentication
        })
            .then(function (response) {
              console.log("result is :" , response);   
      
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
                logger.error("Error getting questionnaire data ", error);
                res.json(ReqMess);
            });


    });
module.exports = router;