const express = require('express'); 
const router = express.Router();
const axios = require('axios'); 
const passport = require("passport");
const apis = require("../model/apis"); 
var apisJson = {};
apisJson = JSON.parse(apis.apisList());
router.post('/getECARequest' ,passport.authenticate("jwt", { session: false }),(req , res)=>{  
 
    let url = `${apisJson.ECARequest}?requestId=${req.body.requestId}`;
  
    const data = JSON.stringify(req.body);
    console.log('data'+data)
  
      axios({ 
          method:"get", 
           url, 
           headers: {
               'Content-Type': 'application/json;charset=UTF-8'
           } 
      }) 
      .then((result) => {
          
        res.send(result.data);
      }).catch((err) => {
        console.log(err);
  
      });
       
    })  
    router.post('/checkValidECA' ,passport.authenticate("jwt", { session: false }),(req , res)=>{ 
    
     let url = `${apisJson.checkValidECA}?ECAlicense=${req.body.eca_license}`;
   
     const data = JSON.stringify(req.body);
     console.log('data'+data)
     console.log('body'+req.body.eca_license)
   
       axios({ 
           method:"get", 
            url, 
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            } 
       }) 
       .then((result) => {
           
         res.send(result.data);
       }).catch((err) => {
         console.log(err);
   
       });
        
     })  
  
    module.exports = router; 