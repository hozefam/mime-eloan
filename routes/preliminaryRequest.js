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
const senaeeRequest = require('./senaeeRequest')
const cryptr = new Cryptr(config.cpKey);


// @route   GET users/getAll
// @desc    Login User / Returning JWT Token
// @access  Public




var apisJson = {};
apisJson = JSON.parse(apis.apisList());


router.post('/Get_City', passport.authenticate("jwt", { session: false }), (req, res) => {

    let url = apisJson.preliminary ; 
  
  
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
  

router.post("/getMCIDetails",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);

        if (req.body.id_number.toString().length === 10 && req.body.id_number.toString().startsWith('4')) {
            req.body.license_type = "MI";
        }
        license_type = req.body.license_type;

        id_number = req.body.id_number;

        dob = req.body.dob;

        purpose = req.body.purpose;

        let url = apisJson.prelReqGetMCI.replace("licenseType", license_type).replace("idNumber", id_number).replace("dob", dob).replace("customerId", decryptedUserId).replace("purpose", purpose);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({
                    Type: "remoteErrors",
                    Title: "Service Errors",
                    OccurredAt: "2018-11-03T16:17:49",
                    ErrorMessages: [{
                        Type: "error",
                        Message: "Getting MCI Details Failed !",
                        OccurredAt: "2018-11-03T16:17:49"
                    }]
                });
            });

    });

router.post("/getOwnerDetails",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        shareholder_type = req.body.shareholder_type;

        investor_type = req.body.investor_type;

        id_type = req.body.id_type;

        investor_type = req.body.investor_type;

        id_type = req.body.id_type;

        id_number = req.body.id_number;

        dob = req.body.dob;

        let url = apisJson.prelReqGetOwnerDet.replace("shareHolderType", shareholder_type).replace("investorType", investor_type).
            replace("idType", id_type).replace("idNumber", id_number).replace("dob", dob);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({
                    Type: "remoteErrors",
                    Title: "Service Errors",
                    OccurredAt: "2018-11-03T16:32:52",
                    ErrorMessages: [{
                        Type: "error",
                        Message: "Getting Owner Details Failed !",
                        OccurredAt: "2018-11-03T16:32:52"
                    }]
                });
            });

    });

router.post("/getRepresentativeDetails",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        id_type = req.body.id_type;

        id_number = req.body.id_number;

        dob = req.body.dob;

        let url = apisJson.prelReqGetRepDet.replace("idType", id_type).replace("idNumber", id_number).replace("dob", dob);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({
                    Type: "remoteErrors",
                    Title: "Service Errors",
                    OccurredAt: "2018-11-03T16:34:29",
                    ErrorMessages: [{
                        Type: "error",
                        Message: "Getting Representative Details Failed !",
                        OccurredAt: "2018-11-03T16:34:29"
                    }]
                });
            });

    });

router.post("/getPreliminaryRequestInfo",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        let url = apisJson.prelReqGetInfo.replace("userId", decryptedUserId);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                // logger.info(response.data)
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting Preliminary Request Information Failed !" });
            });

    });


router.post("/getPreliminaryRequestCountryList",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.signupCountryList;

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                // logger.info(response.data)
                res.send(response.data);
            })
            .catch(function (error) {
                logger.info("Getting Country List Failed !", error);
                res.json({ MessType: 'E', error: true, message: "Getting Country List Failed !" });
            });

    });


router.post("/postPreliminaryRequest",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        if (req.body.UserProfile.length > 0) {
            req.body.UserProfile[0].customerNo = decryptedUserId;
        }

        const data = JSON.stringify(req.body);
        console.log(data);
        let url = apisJson.prelReqPostDetails;

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
                // logger.info(response.data)
                console.log("res ", response);
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({
                    PreliminaryId: "",
                    MsgId: "E",
                    MsgText: "Posting Preliminary Request Failed !"
                });
            });

    });

router.post("/postAfterPreliminaryRequest",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let ProjectId = req.body.ProjectId;
        let url = apisJson.prelReqAfterPost.replace("ProjectId", ProjectId);

        let data = {
            "Id": 0,
            "Definition": {
                "Id": "358",
                "Code": "ProjectPreparation",
                "Name": "Project Preparation",
                "Type": "P",
                "Description": "Project Preparation",
                "IsMandatory": false,
                "IsManualStartAllowed": true,
                "SingleOccurrence": false,
                "SingleInstance": true,
                "ValidatePerProcess": false,
                "ProcessName": "oms~process~project~core:Preparation",
                "ProcessRootContext": "ProjectCoreContext",
                "IsAutoCalculated": false,
                "CanRead": false,
                "CanStart": false,
                "CanCancel": false,
                "CanResume": false
            },
            "Status": "R",
            "EntityName": "Project",
            "No": 1,
            "HasRelatedEntity": false,
            "HasDependant": false,
            "HasDocuments": false,
            "HasProcesses": true,
            "ShowProcesses": false,
            "ShowDocuments": false,
            "Loading": true,
            "ShowProcessPopover": false,
            "Name": "Project Preparation",
            "ActionEnabled": true,
            "InComplete": true,
            "HasDecisions": false,
            "ShowUpload": false,
            "ShowAction": true,
            "ShowDecisionInput": false,
            "ShowDecisionText": false,
            "ShowComment": false,
            "CanEditComment": false,
            "ShowInfo": true,
            "EntityId": ProjectId
        };

        // {
        //     "Id": 0,
        //     "Definition": {
        //         "Id": "358",
        //         "Code": "ProjectPreparation"
        //     },
        //     "EntityId": ProjectId,
        //     "EntityName": "projects"
        // };
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
                // logger.info(response.data)
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({
                    PreliminaryId: "",
                    MsgId: "E",
                    MsgText: "Posting After Save Preliminary Request Failed !"
                });
            });

    });


router.post("/getPRQDetailsByRequestId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        var requestId = req.body.requestId;
        var profileId = req.body.customerProfileId;
        const user = req.user;
        var decryptedUserId = cryptr.decrypt(user.userId);
        // customer id & profile id need to pass reverse order
        let url = apisJson.prelReqDetailsByRequestId.replace("requestId", requestId).replace("profileId", decryptedUserId).replace("customerId", profileId);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                // logger.info(response.data)
                res.send(response.data);

            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting Preliminary Request Failed !" });
            });

    });

router.post("/getUserTypeInfo",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const user = req.user;

        try {
            res.json({ MessType: 'S', error: false, message: "Success", UserIdType: user.UserIdType, LoginId: user.LoginId });
        } catch (err) {
            res.json({ MessType: 'E', error: true, message: "Getting User Type Information Failed !" });
        }

    });

router.post("/getHSCodeList",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.prelReqGetHSCodeList;

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                // logger.info(response.data)
                res.send(response.data);

            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting HS Code List Failed !" });
            });

    });

router.post("/postProductsPRQ",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const data = JSON.stringify(req.body);

        let url = apisJson.prelReqPostProducts;

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
                res.json({
                    PreliminaryId: "",
                    msgId: "E",
                    msgText: "Posting Preliminary Request Products Failed !"
                });
            });

    });

router.post("/postOwnersBP",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const data = JSON.stringify(req.body);

        let url = apisJson.prelReqOwnersBP;

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
                res.json({
                    PreliminaryId: "",
                    msgId: "E",
                    msgText: "Posting Preliminary Request Owners BP Creation Failed !"
                });
            });

    });

router.post("/postOwnersAddInfo",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const data = JSON.stringify(req.body);

        let url = apisJson.prelReqOwnersAddInfo;

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
                res.json({
                    PreliminaryId: "",
                    msgId: "E",
                    msgText: "Posting Preliminary Request Add Owners Information Failed !"
                });
            });

    });
router.post("/getPreliminaryRequestInfoSecond",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        profileType = req.body.profileType;
        switch (profileType) {
            case 7:
                profileType = 24;
                break;

            default:
                break;
        }

        let url = apisJson.prelReqGetInfoSecond.replace("profileType", profileType);

        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Getting Preliminary Request Dropdowns Failed !" });
            });

    });

module.exports = router;