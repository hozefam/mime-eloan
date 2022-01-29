const express = require('express');
const router  = express.Router(); 
const config = require("config");
const axios = require("axios");
const passport = require("passport");
const apis = require("../model/apis");
var apisJson = {};
apisJson = JSON.parse(apis.apisList());
router.post('/userRequestsStatistic', passport.authenticate("jwt", {
            session: false
        }), (req, res) => {
            const userId = req.user["LoginId"]; 
            let url = `${apisJson.requestStatistic}?nationalId=${userId}`; 
             
     
   axios({
    method:'get', 
    url, 
      
     headers: {
         'Content-Type': 'application/json'
     } 
   }).then(result => { 
      res.send(result.data)
   }).catch( error => {
    console.log("error in userRequestsStatistic" , error); 
   })


         
}); 




module.exports = router;