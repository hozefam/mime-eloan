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
const userManger = require("./landLoanUsers");
const cryptr = new Cryptr(config.cpKey);

var refreshTokens = {};
var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post(
    "/validateLandLoanAdminLogin",
    (req, res) => {


        const data = {
            "UserName": req.body.UserName,
            "Password": req.body.Password
        };

        let url = apisJson.validateLandLoanAdminLogin
        axios({
            method: 'get',
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
                logger.error("Error Getting Requests Status type ", error);
                res.json(ReqMess);
            });
    });

router.post("/validateLogin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const otp = req.body.otp;
    if (!username)
        res.status(400).json({ MessType: 'E', error: true, username: "Username is required" });
    if (!password)
        res.status(400).json({ MessType: 'E', error: true, password: "Password is required" });

    let url = apisJson.login.replace("UserID", username).replace("Password", password).replace("OTP", otp);
    // axios
    //     .get(
    //         url, {}, {
    //             auth: {
    //                 username: config.username,
    //                 password: config.password
    //             }
    //         }
    //     )
    //     .then(function(response) {
    //         console.log(response.data.output);
    //         res.json(response);
    //     }).catch(function(error) {
    //         logger.error(error);
    //         res.json({ error: true, message: "Login failed" });
    //     });
    axios({
        method: 'get',
        url,
        auth: config.sidfAuthentication
    })
        .then(function (response) {
            console.log(response);
            res.send(response.data);
        })
        .catch(function (error) {
            console.log(error);

            logger.error("Login with password ", error);
            res.json({ MessType: 'E', error: true, message: "Login failed" });
        });

});
// @route   GET auth/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const otp = req.body.otp;
    if (!username)
        res.status(400).json({ error: true, username: "Username is required" });
    if (!otp)
        res.status(400).json({ error: true, password: "Password is required" });
    let url = apisJson.login.replace("UserID", username).replace("Password", password).replace("OTP", otp);
    // console.log(url);
    axios({
        method: 'get',
        url,
        auth: config.sidfAuthentication
    })
        .then(function (response) {
            if (response.data.MessType == "S") {
                console.log("DATA: " + response.data);
                request = userManger.userLogin(response.data.LoginId, response.data.UserId);
                request.then((res2) => {
                    if (JSON.parse(res2.data).message != 'S')
                        return res.json({ success: false, MessType: 'E', error: true, message: "Login Faild  " })
                    var encryptUserId = cryptr.encrypt(response.data.UserId);
                    const decryptedString = cryptr.decrypt(encryptUserId);
                    // console.log(decryptedString);
                    // Sign Token
                    let payload = {
                        firstname: response.data.Name,
                        name: response.data.Name,
                        email: response.data.Email,
                        userId: encryptUserId,
                        UserIdType: response.data.UserIdType,
                        LoginId: response.data.LoginId
                    };

                    payload.description = "SIDF";
                    payload.id = 1;

                    payload.refreshToken = randtoken.uid(256);
                    refreshTokens[payload.refreshToken] = {
                        userId: encryptUserId,
                        timestamp: moment()
                    };
                    var userInfoResult = response.data;
                    userInfoResult.UserId = encryptUserId;
                    jwt.sign(payload, config.tokenKey, { expiresIn: '1d' }, (err, token) => {
                        if (!err)
                            res.json({
                                success: true,
                                token: token,
                                userInfo: userInfoResult
                            });
                        else {
                            logger.error(err);
                            res.json({ success: false, MessType: 'E', error: true, message: "Login OTP failed" });
                        }
                    });
                    //res.send(response.data);
                })
            } else {
                res.json({ success: false, message: "Login OTP failed" });
            }
        })
        .catch(function (error) {
            logger.error(error);
            res.json({ success: false, MessType: 'E', error: true, message: "Login OTP failed" });
        });



});



router.post("/validateSignUp", (req, res) => {

    const nationalId = req.body.nationalityId;
    const typeofnationality = req.body.typeofnationality;
    const action = req.body.action;
    const otp_gen = req.body.otp_gen;
    const otp_ver = req.body.otp_ver;
    const wasselcall = req.body.wasselcall;
    const signupPhoneOTP = req.body.signupPhoneOTP;
    const emailId = req.body.emailId;
    const nationalityIdDob = req.body.nationalityIdDob;
    const licNum = req.body.licNum;
    const licVal = req.body.licVal;
    const usrId = req.body.usrId;
    const crname = req.body.crnumber;
    const crdate = req.body.date;

    if (nationalId == "")
        res.status(400).json({ error: true, username: "National ID is required" });

    let url = apisJson.signupResidentCitizen
        .replace("ID", nationalId)
        .replace("TYPE", typeofnationality)
        .replace("ACTION", action)
        .replace("OTP_GEN", otp_gen)
        .replace("OTP_VER", otp_ver)
        .replace("WASSELCALL", wasselcall)
        .replace("PHONE", signupPhoneOTP)
        .replace("EMAIL", emailId)
        .replace("DOB", nationalityIdDob)
        .replace("LIC_NUM", licNum)
        .replace("LIC_VAL", licVal)
        .replace("USRID", usrId)
        .replace("crnumber", crname)
        .replace("date", crdate);
    axios({
        method: 'get',
        url,
        auth: config.sidfAuthentication
    })
        .then(function (response) {
            res.send(response.data);
            //console.log(response);
        })
        .catch(function (error) {
            var ReqMess = { ReqMess: [{ MessType: 'E', error: true, MessText: 'Sign Up failed' }] };
            logger.error(error);
            res.json(ReqMess);
        });

});


router.post("/signUp", (req, res) => {

    //console.log(req.body);

    const SignUpData = JSON.stringify(req.body);

    //console.log("djsidj"+nationalId);
    if (!SignUpData)
        res.status(400).json({ error: true, SignUpData: "SignUp Data id required" });

    let url = apisJson.signupFinalData


    axios({
        method: 'post',
        url,
        auth: config.sidfAuthentication,
        data: SignUpData,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
        .then(function (response) {
            console.log("response: " + response);
            if (response.data.Id == "User Created Successfully") {
                const LLregistration = userManger.registerUser(SignUpData);
                LLregistration.then((res2) => {
                    if (JSON.parse(res2.data).message != 'S')
                        return res.json({ MessType: 'E', error: true, message: "Sign Up failed " })

                    res.send(response.data);
                })
            }
            else {
                res.send(response.data);
            }

            //console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            res.json({ MessType: 'E', error: true, MessText: "Sign Up failed" });
        });

});


router.post("/submitContactUs", (req, res) => {

    //console.log(req.body);

    const ContactUsData = JSON.stringify(req.body);
    // console.log(ContactUsData)
    if (!ContactUsData)
        res.status(400).json({ error: true, ContactUsData: "ContactUs Data is required" });

    let url = apisJson.contactUsFinalData;
    axios({
        method: 'post',
        url,
        auth: config.sidfAuthentication,
        data: ContactUsData,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
        .then(function (response) {
            res.send(response.data);
            // console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            logger.error("Contact us error : ", error);
            res.json({ ResType: '1', error: true, ResText: "Contact Us failed" });
        });

});


router.post("/signUpCountryList", (req, res) => {


    let url = apisJson.signupCountryList

    //console.log(url);
    axios({
        method: 'get',
        url,
        auth: config.sidfAuthentication
    })
        .then(function (response) {
            res.send(response.data);
            //console.log(response.data);
        })
        .catch(function (error) {
            logger.error(error);
            res.json({ MessType: 'E', error: true, message: "country fetch failed" });
        });

});



router.post(
    "/getCustomerProfile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        let url = apisJson.viewCustomerProfile.replace("customerNumber", decryptedUserId);
        // console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error while getting customer profile" });
            });
    }
);

router.post(
    "/editMobileOrEmailOrBasicData",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        // console.log("edit");
        let editCustomerProfile = req.body.data;
        // console.log(req.body.data)
        let url = apisJson.EditCustomerProfile;
        // console.log(url);
        editCustomerProfile.ProfId = decryptedUserId;
        if (editCustomerProfile.Indicator == 'UB') {
            if (editCustomerProfile.ProfileAddress.length > 0)
                editCustomerProfile.ProfileAddress[0].ProfId = decryptedUserId;
        }
        // console.log(editCustomerProfile);
        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: editCustomerProfile,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error while editing Mobile Number" });
            });
    }
);


router.post(
    "/verifyMobileOrEmailOtp",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        // console.log("verify," + decryptedUserId);
        let profileOtpData = req.body.data;
        // console.log(req.body.data)
        let url = apisJson.EditCustomerProfile;
        // console.log(url);
        profileOtpData.ProfId = decryptedUserId;
        // console.log(profileOtpData);
        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: profileOtpData,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error while editing Mobile Number" });
            });
    }
);

router.post(
    "/changePasswordService",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        // console.log("password," + decryptedUserId);
        let changePasswordDetails = req.body.data;
        // console.log(req.body.data)
        let url = apisJson.EditCustomerProfile;
        // console.log(url);
        changePasswordDetails.ProfId = decryptedUserId;
        // console.log(changePasswordDetails);
        axios({
            method: 'post',
            url,
            auth: config.sidfAuthentication,
            data: changePasswordDetails,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error while changing Password" });
            });
    }
);
router.post(
    "/getCustomerProfile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const user = req.user;
        const decryptedUserId = cryptr.decrypt(user.userId);
        let url = apisJson.viewCustomerProfile.replace("customerNumber", decryptedUserId);
        // console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
        })
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                logger.error(error);
                res.json({ MessType: 'E', error: true, message: "Error while getting customer profile" });
            });
    }
);

router.post("/refreshToken", (req, res) => {
    // console.log("refresh");
    // logger.error("refresh");
    try {
        let payload = req.body;
        // logger.info(payload);
        if (payload.refreshToken == "" || payload.refreshToken == undefined) {
            var token = payload.data.token;
            // logger.info(token);
            // var verifyDecoded = jwt.verify(token, config.tokenKey);
            var decoded = jwt.decode(token, { complete: true });
            // logger.info(decoded);
            payload = decoded.payload;
        }
        let refreshToken = payload.refreshToken;
        // logger.info(refreshToken);
        var existToken = refreshTokens[payload.refreshToken];
        // logger.info(existToken);
        if (existToken != undefined) {
            // console.log("SS" + refreshTokens[payload.refreshToken].userId + "," + payload.userId);
            // console.log("time" + moment().diff(refreshTokens[refreshToken].timestamp, "minutes"));
            // var userIdExist = cryptr.decrypt(refreshTokens[refreshToken].userId);
            // var userIdRefresh = cryptr.decrypt(payload.userId);
            // console.log(userIdExist.trim() + "," + userIdRefresh);
            // logger.info(refreshTokens);
            // logger.info(payload);
            if (
                refreshToken in refreshTokens &&
                refreshTokens[refreshToken].userId.trim() == payload.userId.trim() &&
                moment().diff(refreshTokens[refreshToken].timestamp, "minutes") < 75
            ) {
                delete refreshTokens[refreshToken];
                delete payload.exp;
                delete payload.iat;
                payload.refreshToken = randtoken.uid(256);
                refreshTokens[payload.refreshToken] = {
                    userId: payload.userId,
                    timestamp: moment()
                };
                jwt.sign(payload, config.tokenKey, { expiresIn: 3600 }, (err, token) => { //expiresIn: "1d"
                    if (!err) {
                        res.json({
                            success: true,
                            token: token
                        });
                    } else {
                        logger.error(err);
                        if (refreshToken in refreshTokens) delete refreshTokens[refreshToken];
                        res.status(401).json({ error: true, message: "Failed to generate token" });
                        // res.json({ error: true, message: "Failed to generate token" });
                    }
                });
            } else {
                logger.error("Invalid token request");
                if (refreshToken in refreshTokens) delete refreshTokens[refreshToken];
                res.status(401).json({ error: true, message: "Invalid token request" });
                // res.json({ error: true, message: "Invalid token request" });
            }
        } else {
            logger.error("Invalid request");
            // if (refreshToken in refreshTokens) delete refreshTokens[refreshToken];
            res.status(401).json({ error: true, message: "Invalid token request" });
            // res.json({ error: true, message: "Invalid token request" });
        }
    } catch (err) {
        logger.error("Error Failed to generate token " + err);
        res.json({ error: true, message: "Failed to generate token" });
    }
});

module.exports = router;