const axios = require("axios"); 
const config = require("config");
const apis = require("../model/apis"); 

var apisJson = {};
apisJson = JSON.parse(apis.apisList());

const postUser = async  (obj)=> { 
    try { 
      return await axios.post(apisJson.users, obj , { 
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        } }); 
    }
    catch (error ){ 
    console.error(error);
    }
  } 
  
 const  registerUser = async  (obj)=> { 
  return await postUser(obj) 
 }   

const postUserLogin = async (id , userId) => { 
 try {
   console.log(`${apisJson.users}?id=${id}&userId=${userId}`);
      return await axios.get(`${apisJson.users}?id=${id}&userId=${userId}`)
 } catch (error) {
   console.error(error) 
 }
}


 
 const userLogin = async  (id , userId)=> { 
  return await postUserLogin(id , userId);
 } 
// const userLogin = async (id ) => { 
//     return await postLogin()
// }users
  
module.exports =    {   registerUser  , 
                                    userLogin } 
 