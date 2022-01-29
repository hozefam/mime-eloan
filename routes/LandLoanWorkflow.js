const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require("passport");
const apis = require("../model/apis");
var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post(
  '/UpdateLandLoanStatusByLastStatus',
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    const data = {
      "SIDFPreliminaryID": req.body.SIDFPreliminaryID,
      "SIDFRequestNo": req.body.SIDFRequestNo,
      "StatusId": req.body.StatusId
    };

    let url = apisJson.UpdateLandLoanStatusByLastStatus
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

router.post(
  '/UpdatePreliminaryRequestStatusByLastStatus',
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    const data = {
      "SIDFPreliminaryID": req.body.SIDFPreliminaryID,
      "SIDFRequestNo": req.body.SIDFRequestNo,
      "StatusId": req.body.StatusId
    };

    let url = apisJson.UpdatePreliminaryRequestStatusByLastStatus
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

router.post('/landLoanPreliminaryRequest', passport.authenticate("jwt", { session: false }), (req, res) => {

  let url = apisJson.LandLoanPreliminary;
  const user = req.user;
  const data = JSON.stringify(req.body);
  req.body['LoginId'] = req.user.LoginId;
  console.log("data", data);
  console.log("eq", req.body);
  axios({
    method: "post",
    url,
    data: req.body,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then((result) => {

      res.send(result);
    }).catch((err) => {

    });

});

// router.post('/checkValidECA' ,passport.authenticate("jwt", { session: false }),(req , res)=>{  It came like this  i am Innocent  


router.post('/finalSubmit', passport.authenticate("jwt", { session: false }), (req, res) => {

  let url = apisJson.finalSubmit + "/" + req.body.requestId;




  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then((result) => {

      res.send(result.data);
    }).catch((err) => {
      res.status(500).send({ message: "E" });
    });

});

router.post('/landLoanRequest', passport.authenticate("jwt", { session: false }), (req, res) => {

  let url = apisJson.LandLoanRequest;
  const user = req.user;
  const data = JSON.stringify(req.body);
  req.body['LoginId'] = req.user.LoginId;
  console.log("data", data);
  console.log("eq", req.body);
  axios({
    method: "post",
    url,
    data: req.body,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then((result) => {

      res.send(result);
    }).catch((err) => {
      res.status(500);
    });

});




module.exports = router;