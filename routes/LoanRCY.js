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
const rcyManger = require("./rcyInformation");
const cryptr = new Cryptr(config.cpKey);

var refreshTokens = {};
var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post(
  "/getRCY",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log('rcy ' + JSON.stringify(req.body));
    console.log("inside getRCY  request ID: " + req.body.requestId);
    let url = `${apisJson.rcy}?loanRequestNumber=${req.body.requestId}`;
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
        logger.error("error getting request info", error);
        res.json(ReqMess);
      });

  })
  ;

router.post(
  "/getAdminRCY",
  (req, res) => {
    console.log('rcy ' + JSON.stringify(req.body));
    console.log("inside getRCY  request ID: " + req.body.requestId);
    let url = `${apisJson.rcy}?loanRequestNumber=${req.body.requestId}`;
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
        logger.error("error getting request info", error);
        res.json(ReqMess);
      });

  })
  ;

router.post('/sendRCY', passport.authenticate("jwt", { session: false }), async (req, res) => {

  let url = apisJson.rcy;
  const user = req.user;
  //  const data = JSON.stringify(req.body);
  // req.body['LoginId'] = req.user.LoginId;
  // console.log("data" , data ); 
  // console.log("eq" ,req.body );
  //  console.log("eq" ,req.body.data ); 
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


router.post('/sendRCYQuestionnaire', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log("in post");
  let url = apisJson.rcyQuestionnaire;
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
  "/getRCYQuestionnaireType",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let url = `${apisJson.getrcyQuestionnaireType}?requestId=${req.body.requestId}`;
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
        logger.error("Error getting questionnaire type ", error);
        res.json(ReqMess);
      });

  });

//
router.post(
  "/getAdminRCYQuestionnaireType",
  (req, res) => {
    let url = `${apisJson.getrcyQuestionnaireType}?requestId=${req.body.requestId}`;
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
        logger.error("Error getting questionnaire type ", error);
        res.json(ReqMess);
      });

  });

router.post(
  "/getRCYQuestionnaire",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("inside getRCYQuestionnaire  request ID: " + req.body.requestId);
    console.log('rcy ' + req + ' ' + res);


    let url = `${apisJson.rcyQuestionnaire}?requestId=${req.body.requestId}`;
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
        logger.error("Error getting questionnaire data ", error);
        res.json(ReqMess);
      });



  });
//
router.post(
  "/getAdminQuestionnair",
  (req, res) => {

    let url = `${apisJson.rcyQuestionnaire}?requestId=${req.body.requestId}`;
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
        logger.error("Error getting questionnaire data ", error);
        res.json(ReqMess);
      });

  });

router.post(
  "/getAdminRcyInvesterInformation",
  (req, res) => {

    let url = `${apisJson.rcyInvesterInformation}?RCYSysuserServiceId=${req.body.RCYSysuserServiceId}`;
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
        logger.error("Error getting Invester Information data ", error);
        res.json(ReqMess);
      });
  });

module.exports = router;