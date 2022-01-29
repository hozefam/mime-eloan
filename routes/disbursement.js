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

router.post(
    "/createDisbursement",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        let url_disbursement = apisJson.disbursement;
        let url_operation = apisJson.operations;
        var data = req.body;

        /* const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        data.Customerid = decryptedUserId; */

        let opeartion_id = data.OperationId;
        data = JSON.stringify(data);
        // console.log(url_operation + "/" + opeartion_id + "?withDetails=true");
        // ==============================================================================================================
        // CALL 1 
        // Get the OPERATION / Loan ID
        // ==============================================================================================================
        axios({
                method: 'get',
                url: url_operation + "/" + opeartion_id + "?withDetails=true",
                auth: config.sidfAuthentication,
                data: data,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            })
            .then(function(response) {
                // console.log("Operation Data Fetched" + response.data);
                var create_disb_req = req.body;
                var Operation = response.data;
                create_disb_req.Operation = Operation;
                create_disb_req.Profile = "LoanDisbursement";
                logger.info("Create Disbursement Payload");
                // console.log(create_disb_req);

                var Disbursmenet = {}; //final json out put
                // ==============================================================================================================
                // CALL 2 
                // Creation of Disbursement Request 
                // ==============================================================================================================
                return axios({
                        method: 'post',
                        url: url_disbursement + "/" + "?autoCreateRequest=true",
                        auth: config.sidfAuthentication,
                        data: JSON.stringify(create_disb_req),
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                        }
                    })
                    .then(function(response) {
                        // console.log("=================DISB REQ RESP================\n");
                        // console.log(JSON.stringify(response.data));
                        logger.info("Created Disbursement Request for the ID " + response.data.Id);
                        if (response.data.Disbursements.length > 0) {
                            var resultCall1 = response.data.Disbursements;
                            Disbursmenet.DisbursmenetId = resultCall1.length > 0 ? resultCall1[0].DisbursementProcessId : "";

                            Disbursmenet.MessType = "S";
                            Disbursmenet.MessText = "Success"

                            Disbursmenet.DisbursmenetRequestId = resultCall1[0].Requests.length > 0 ? resultCall1[0].Requests[0].Id : "";
                            if (resultCall1[0].Requests.length > 0)
                                Disbursmenet.DisbAllocationsId = resultCall1[0].Requests[0].Allocations.length > 0 ? resultCall1[0].Requests[0].Allocations[0].Id : "";
                        }

                        // ==============================================================================================================
                        // CALL 3 
                        // Get Checklist of the generated disbursemnt request ID to get the payload for the BPM Trigger.
                        // ==============================================================================================================
                        return axios({
                                method: 'get',
                                url: url_disbursement + "/" + response.data.Id + "/checklist/Project_Implementation?relatedEntityName=DisbursementProcess&relatedEntityId=" + response.data.Id,
                                auth: config.sidfAuthentication,
                                headers: {
                                    'Content-Type': 'application/json;charset=UTF-8',
                                }
                            })
                            .then(function(response) {
                                logger.info("Get Checklist Response " + JSON.stringify(response.data[0]));
                                // ==============================================================================================================
                                // CALL 4
                                // Start BPM
                                // ==============================================================================================================
                                // console.log(url_disbursement + "/" + response.data[0].EntityId + "/checklist/" + response.data[0].Id + "/0/start");
                                // Status = I for create but not start. 
                                // Status = R for create and Start 
                                response.data[0].Status = 'R';
                                return axios({
                                        method: 'post',
                                        url: url_disbursement + "/" + response.data[0].EntityId + "/checklist/" + response.data[0].Id + "/0/start",
                                        data: JSON.stringify(response.data[0]),
                                        headers: {
                                            'Content-Type': 'application/json;charset=UTF-8',
                                        },
                                        auth: config.sidfAuthentication
                                    })
                                    .then(function(response) {
                                        // console.log("=================BPM PROCESS START================\n");
                                        // console.log(JSON.stringify(response.data));
                                        Disbursmenet.EntityId = response.data.EntityId;
                                        res.send(Disbursmenet);
                                    })
                                    .catch(function(error) {
                                        logger.error("Start BPM Failed", error);
                                        // console.log("Start BPM Failed", error);
                                        res.json({ MessType: 'E', error: true, message: "Start BPM Failed" });
                                    });
                            })
                            .catch(function(error) {
                                var ReqMess = {  MessType: 'E', error: true, MessText: "Get Checklist Failed"  };
                                //console.log("Console Logger error");
                                // console.log("Error in Get Checklist Api, ", error);
                                logger.error("Error in Get Checklist Api, ", error);
                                res.json(ReqMess);
                            });
                    })
                    .catch(function(error) {
                        var ReqMess = {  MessType: 'E', error: true, MessText: "Disbursement Request Creation Failed"  };
                        //console.log("Console Logger error");
                        // console.log("Error in Create Disbursement Api, ", error);
                        logger.error("Error in Create Disbursement Api, ", error);
                        res.json(ReqMess);
                    });
            })
            .catch(function(error) {
                var ReqMess = { MessType: 'E', error: true, MessText: "Loan Id Not correct" };
                logger.error("Error in Create Disbursement, Loan ID not correct ", error);
                res.json(ReqMess);
            });
    }
);

module.exports = router;