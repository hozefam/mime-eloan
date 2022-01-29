const axios = require("axios"); 
const config = require("config");
const apis = require("../model/apis"); 

var apisJson = {};
apisJson = JSON.parse(apis.apisList());

const getSurvey = async  (sysUserServiceId)=> { 
  try { 
    return await axios.get(`${apisJson.rcjQuestionnaire}?sysUserServiceId=${sysUserServiceId}`)

    // return await axios.get(`${apisJson.rcj}?requestId=${requestId}`)
    return await axios.get(apisJson.rcjQuestionnaire, sysUserServiceId , { 
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      } }); 
  }
  catch (error ){ 
  console.error(error);
  }
}
const getRequest = async  (sysUserServiceId, res)=> {
  try {
    url = `${apisJson.rcj}?sysUserService=${sysUserServiceId}`;
    axios({
      method: 'get',
      url,
      //auth: config.sidfAuthentication
  })
      .then(function (response) {
        console.log("result is :" , response);   

          res.send(response.data);
      })
      .catch(function (error) {
          console.log(error);
          var ReqMess = { Cofinancers: [{ MessType: 'E', error: true, MessText: "Cofinancers failed" }] };
          logger.error("Cofinancers info by BP Id ", error);
          res.json(ReqMess);
      });
  //   console.log('sysUserServiceId:'+sysUserServiceId)
    
  //       const a =  await axios.get(`${apisJson.rcj}?sysUserService=${sysUserServiceId}`,
  //       {headers: {
  //         'Content-Type': 'application/json;charset=UTF-8'
  //     }}) 
  //       console.log("result is :" , a);   
  //       return a ; 
  // } catch (error) {
  //   console.error(error) 
  // } 
  // try { 
  //   // return await axios.get(`${apisJson.rcj}?requestId=${requestId}`)
  //   return await axios.get(apisJson.rcj, sysUserServiceId , { 
  //     }); 
      
  }
  catch (error ){ 
  console.error(error);
  }
}
const postRequest = async  (obj)=> { 
  try { 
    return await axios.post(apisJson.rcj, obj , { 
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      } }); 
  }
  catch (error ){ 
  console.error(error);
  }
}

   
const postQuestionnaire = async  (obj)=> { 
  try { 
    return await axios.post(apisJson.rcjQuestionnaire, obj , { 
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      } }); 
  }
  catch (error ){ 
  console.error(error);
  }
}
const  sendRCJQuestionnaire = async  (obj)=> { 
  return await postQuestionnaire(obj) 
 }   

const  sendRCJ = async  (obj)=> { 
  return await postRequest(obj) 
 }   
 const  getRCJ = async  (sysUserServiceId)=> { 
  return await getRequest(sysUserServiceId) 
 }   

 const getQuestionnaireType = async (sysUserServiceId) => { 
  try {
    console.log(`${apisJson.getrcjQuestionnaireType}?requestId=${sysUserServiceId}`);
        const a =  await axios.get(`${apisJson.getrcjQuestionnaireType}?requestId=${sysUserServiceId}`,
        {headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      }}) 
        console.log("a == " , a);   
        return a ; 
  } catch (error) {
    console.error(error) 
  }
 }

const  getRCJQuestionnaireType = async  (sysUserServiceId)=> { 
  return await getQuestionnaireType(sysUserServiceId) 
 }   

 const getRCJQuestionnaire = async  (requestId)=> { 
  return await getSurvey(requestId) 
 }   
//   router.post("/" , passport.authenticate("jwt", { session: false }),(req, res) => {

//       pool.connect().then(()=>{ 
//         const reqSQL= pool.request(); //
//         reqSQL.input("sysUserServiceId" , sql.BigInt , req.sysUserServiceId   ); 
//         reqSQL.input("WebSite" , sql.NVarChar(50) , req.WebSite   )
//         reqSQL.input("Province"  ,sql.BigInt , req.Province   )
//         reqSQL.input("BusinessNationality" , sql.BigInt , req.BusinessNationality   )
//         reqSQL.input("BusinessWebSite"  ,sql.BigInt , req.BusinessWebSite   )
//         reqSQL.input("Position" , sql.Int , req.Position   )
//         reqSQL.input("InvesterTelephone" , sql.Int , req.InvesterTelephone   )
//         reqSQL.input("Ext" , sql.Int , req.Ext   )
//         reqSQL.input("Mobile" , sql.Int , req.Mobile   )
//         reqSQL.input("Location" , sql.NVarChar(50) , req.Location   )
//         reqSQL.input("ProjectClassification" , sql.NVarChar(50) , req.ProjectClassification   )
//         reqSQL.input("TotalAreaRequired" , sql.Int , req.TotalAreaRequired   )
//         reqSQL.input("Power" , sql.Int , req.Power   )
//         reqSQL.input("PotableWater" , sql.Int , req.PotableWater   )
//         reqSQL.input("SanitaryWasteWater" , sql.NVarChar(50) , req.SanitaryWasteWater   )
//         reqSQL.input("MunicipalWaste" , sql.NVarChar(50) , req.MunicipalWaste   )
//         reqSQL.input("HazardousWaste" , sql.NVarChar(50) , req.HazardousWaste   )
//         reqSQL.input("IndustrialNonHazWaste" , sql.NVarChar(50) , req.SanitaryWasteWater   )
//         reqSQL.input("MaterialLaf" , sql.NVarChar(50) , req.MunicipalWaste   )
//         reqSQL.input("Source" , sql.NVarChar(50) , req.HazardousWaste   )
//         reqSQL.execute("Insert_RCJ" , function (res  , error ) {
//                 console.log('data',res)
//                 console.log('error',error)
  
//         } ); 
//     }).then(result => {
//         console.dir(result)
//     }).catch(err => {
//         // ... error checks
//         console.log('err',err)
//     });
//     // const user = req.user;
    
//     // const decryptedUserId = cryptr.decrypt(user.userId);

//     // req.body.CustomerId = decryptedUserId;

//     // const data = JSON.stringify(req.body);

//     // let url = apisJson.RCJiNFO;

//     // axios({
//     //     method: 'post',
//     //     url,
//     //     data: data,
//     //     auth: config.sidfAuthentication,
//     //     headers: {
//     //     'Content-Type' : 'application/json;charset=UTF-8'
//     //     }
//     // })
//     pool.close();            


// });
  

module.exports = {sendRCJ, sendRCJQuestionnaire, getRCJQuestionnaireType, getRCJ, getRCJQuestionnaire };

//module.exports =router;
