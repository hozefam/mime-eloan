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


router.post("/getMyLoanAgreement", 
passport.authenticate("jwt", { session: false }),(req, res) => {

    
    const LoanId = req.body.data.LoanId;
    

    let url = apisJson.myLoansAgreementsGet
                .replace("LoanId", LoanId);
    //  console.log(url);
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
            res.json({ MessType: 'E', error: true, MsgText: "Getting My Loans - Agreements Failed" });
        });

});

// router.post("/getMyLoanContracts", 
// passport.authenticate("jwt", { session: false }),(req, res) => {

    
//     const LoanId = req.body.data.LoanId;
    

//     let url = apisJson.myLoansContractsGet
//                 .replace("LoanId", LoanId);
//     // console.log(url);
//     axios({
//             method: 'get',
//             url,
//             auth: config.sidfAuthentication
//         })
//         .then(function(response) {
//             res.send(response.data);
//         })
//         .catch(function(error) {
//             logger.info(error);
//             var err =  "Getting My Loans - Contracts Failed";
//             res.json(err);
//         });

// });


// router.post("/getMyLoanPayments", 
// passport.authenticate("jwt", { session: false }),(req, res) => {

    
//     const ContractId = req.body.data.ContractId;
    

//     let url = apisJson.myLoansPaymentsGet
//                 .replace("ContractId", ContractId);
//     // console.log(url);
//     axios({
//             method: 'get',
//             url,
//             auth: config.sidfAuthentication
//         })
//         .then(function(response) {
//             res.send(response.data);
//         })
//         .catch(function(error) {
//             logger.info(error);
//             var err =  "Getting My Loans - Payments Failed";
//             res.json(err);
//         });

// });


// router.post("/getMyLoanInvoice", 
// passport.authenticate("jwt", { session: false }),(req, res) => {

    
//     const PaymtId = req.body.data.PaymtId;
    

//     let url = apisJson.myLoansInvoiceGet
//                 .replace("PaymtId", PaymtId);
//     // console.log(url);
//     axios({
//             method: 'get',
//             url,
//             auth: config.sidfAuthentication
//         })
//         .then(function(response) {
//             res.send(response.data);
//         })
//         .catch(function(error) {
//             logger.info(error);
//             var err =  "Getting My Loans - Invoice Failed";
//             res.json(err);
//         });

// });


router.post("/postMyLoanContracts", 
passport.authenticate("jwt", { session: false }),(req, res) => {

    // const user = req.user;
    // const decryptedUserId = cryptr.decrypt(user.userId);

    // if(req.body.Contracts){
    //     req.body.Contracts[0]["UserId"] = decryptedUserId;
    // }
    // else if(req.body.Payments){
    //     req.body.Payments[0]["UserId"] = decryptedUserId;
    // }
    // else if(req.body.Invoices){
    //     req.body.Invoices[0]["UserId"] = decryptedUserId;
    // }
    
    const data = JSON.stringify(req.body);
    
    let url = apisJson.postMyLoanContracts;
// console.log(data);
// console.log(url);
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
            logger.info(error);
            res.json({ MessType: 'E', error: true, MessText: "Post My Loans - Agreements Failed" });
        });

});

router.post("/getLoanTechnicalComponentCategories",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.loanGETComponentCategories;
        // console.log(url);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                // logger.info(response.data)
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info("Getting Technical Components Categories Failed !", error);
                res.json({ MessType: 'E', error: true, MessText: "Getting Technical Component Categories Failed !" });
            });

    });


    router.post("/getInvoiceItemsArray", 
    passport.authenticate("jwt", { session: false }),(req, res) => {

    
    const sentReqId = req.body.data.sentReqId;
    const LoanId = req.body.data.LoanId;
    const FinPlanId = req.body.data.FinPlanId;
    
    
    let url = apisJson.myLoansInvoiceItemList
                .replace("sentReqId", sentReqId)
                .replace("LoanId", LoanId)
                .replace("FinPlanId", FinPlanId);
    //  console.log(url);
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
            res.json({ MessType: 'E', error: true, MessText: "Getting Invoice Item List Failed !" });
        });

});

router.post("/getAttachmentPaymentsCategories",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = apisJson.getAttachmentPaymentsCategories;
        // console.log(url);

        axios({
                method: 'get',
                url,
                auth: config.sidfAuthentication
            })
            .then(function(response) {
                // logger.info(response.data)
                res.send(response.data);
            })
            .catch(function(error) {
                logger.info("Getting Technical Components Categories Failed !", error);
                res.json({ MessType: 'E', error: true, MessText: "Getting Contracts DropDown Failed !" });
            });

    });





module.exports = router;