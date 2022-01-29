const express = require('express'); 
const router = express.Router(); 
const config = require('config'); 
const passport = require("passport");
const apis = require("../model/apis");
const Cryptr = require('cryptr');
const axios = require("axios");

const cryptr = new Cryptr(config.cpKey);
var apisJson = {};
apisJson = JSON.parse(apis.apisList());  

router.post('/CheckCityAreaAvailability' , (req , res) =>{  
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' 
   console.log(req); 
    url = apisJson.checkCityAvailability; 
    axios({
       method:'post', 
       url, 
        data : req.body , 
        headers: {
            'Content-Type': 'application/json'
        } 
    }).then((response)=> { 
   
        if(!response )
        return res.send({message: "لا توجد مساحة متوفرة في المدينة المختارة " , code:"E"})
        if(response.data.result ==="Not Avaialbe" )
        return res.send({message: "لا توجد مساحة متوفرة في المدينة المختارة " , code:"N"}) 
        return res.send({message: " توجد مساحة متوفرة في المدينة المختارة " , code:"S"}) 
    }).catch((error)=> { 
        return res.send({message: "لا توجد مساحة متوفرة في المدينة المختارة " , code:"E"})
    })
 
});  

router.post("/FactoryInfo" , passport.authenticate("jwt", { session: false }) , (req , res)=>{
    let url=apisJson.factoryLoan;
    let method = "post"; 
    if (req.body.method && req.body.method  ==="get"){ 
        url += `/${req.body.id}`; 
        req.body = null ; 
        method = "get"
    } 

    console.log(url) ;
    
  axios({
      method:method,
      data : req.body , 
      url,
      headers: {
        'Content-Type': 'application/json'
    }  
  }).then (result => { 
    console.log(result); 
    res.send(result.data); 
  }).catch(error=> { 
    console.log(error); 
    res.send({message: "F"});  
  }) ; 

})
 


module.exports = router ;  