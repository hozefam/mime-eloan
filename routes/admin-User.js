const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require("axios");
const logger = require("../config/logger").logger;
const passport = require("passport");
const _ = require("underscore");
const apis = require("../model/apis");
const Cryptr = require('cryptr');

var apisJson = {};
apisJson = JSON.parse(apis.apisList());


router.post(
    "/GetUsers", (req, res) => {
        let url = apisJson.GetAdminUsers
        axios({
            method: 'get',
            url,
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                console.log(error);
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Error while get User data" }] };
                logger.error("Error while get User data", error);
                res.json(ReqMess);
            });
    });

    router.post(
        '/DeleteUser',
        (req, res) => {
            const data = {
               
                "Passowrd": req.body.Password,
                "UserName": req.body.UserName,
                "Role": req.body.Role,
                "NationalId": req.body.NationalId,
               
            };
            let url = apisJson.DeleteAdminUser
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
                    var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Error while Delete User data "+this.data }] };
                    logger.error("Error while Delete User data ", error);
                    res.json(ReqMess);
                });
        });
        

        router.post(
            '/UserChangePasswod',
            (req, res) => {
        
                const data = {
                    "Passowrd": req.body.Password,
                    "UserName": req.body.UserName,
                    "Role": req.body.Role,
                };
        
                let url = apisJson.UpdateAdminUserPass
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
                        var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Error while User change Password  "+this.data }] };
                        logger.error("Error while User change Password data ", error);
                        res.json(ReqMess);
                    });
            });


router.post(
    '/AddUser',
    (req, res) => {

        const data = {
           
            "Passowrd": req.body.Password,
            "UserName": req.body.UserName,
            "Role": req.body.Role,
            "NationalId": req.body.NationalId,
        };

        let url = apisJson.AddAdminUser
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
                var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed "+this.data }] };
                logger.error("Error while Add User data ", error);
                res.json(ReqMess);
            });
    });
module.exports = router;