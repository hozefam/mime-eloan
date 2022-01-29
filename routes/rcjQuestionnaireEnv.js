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

const sql = require("mssql/msnodesqlv8")
const  pool = new sql.ConnectionPool({
    database: "UniPortal_DEV2",
    server: "SQL-SRVRDEV",
    driver: "msnodesqlv8",
    options: {
      trustedConnection: true
    }
  }) ; 
  
  function getQuestions(){
    // var s = "select top 1 id, name, type, crdate from sysobjects so where so.type='U'";
    // console.log(s);
    // var q = conn.query(s, function (err, res) {
    //     assert.ifError(err);
    //     console.log("res.length = " + res.length);
    //     console.log(res);
    // });
  }
  function getLookups(Type = 'CrudeOilLaf', Lang = 'EN'){
    const req= pool.request(); //
    req.input("@LookupType" , sql.NVarChar , Type   ); 
    req.input("@Lang" , sql.NVarChar , Lang   ); 
    
    req.excute("GET_LOOKUPS" , function (res  , error ) {
            console.log(res);
            return res;
    } ); 
    // var s = "select top 1 id, name, type, crdate from sysobjects so where so.type='U'";
    // console.log(s);
    // var q = conn.query(s, function (err, res) {
    //     assert.ifError(err);
    //     console.log("res.length = " + res.length);
    //     console.log(res);
    // });
  }
  function addRCJQuestionnaireEnv (
      //TODO: add RCJ fields from enviromental questionnaire
      RCJAnsewersArray
   ){  
    // RCJAnsewersArray.forEach(answer => {
    //     const req= pool.request(); 
    //     //TODO: assign each field
    //     req.input("SysUserServiceId" , sql.BigInt , answer.SysUserServiceId); 
    //     req.input("RCJ_RequestId" , sql.BigInt , answer.RCJ_RequestId); 
    //     req.input("QuestionId" , sql.BigInt , answer.QuestionId); 

    //     req.input("Truthy1" , sql.Bit , answer.Truthy1); 
    //     req.input("Truthy2" , sql.Bit , answer.Truthy2); 
    //     req.input("TypeOfMaterialText" , sql.NVarChar , answer.TypeOfMaterialText); 
    //     req.input("TypeOfIndustrialWaste" , sql.NVarChar , answer.TypeOfIndustrialWaste); 
    //     req.input("Quantity" , sql.NVarChar , answer.Truthy1); 
    //     req.input("LiquidQuantity" , sql.NVarChar , answer.Truthy2); 
    //     req.input("TextAnswer1" , sql.NVarChar , answer.QuestionId); 
    //     req.input("TextAnswer2" , sql.NVarChar , answer.TextAnswer2); 
    //     req.input("NumberOfPointSource" , sql.NVarChar , answer.NumberOfPointSource); 
    //     req.input("Country" , sql.NVarChar , answer.Country); 
    //     req.input("City" , sql.NVarChar , answer.City); 
    //     req.input("NumberOfPlants" , sql.NVarChar , answer.NumberOfPlants); 
    //     req.input("HeavyFuelOilLaf" , sql.NVarChar , answer.HeavyFuelOilLaf); 
    //     req.input("CrudeOilLaf" , sql.NVarChar , answer.CrudeOilLaf); 
    //     req.input("Used" , sql.Bit , answer.Used); 
    //     req.input("Recycled" , sql.Bit , answer.Recycled); 
    //     req.input("Incineration" , sql.Bit , answer.Incineration); 
    //     req.input("Physical" , sql.Bit , answer.Physical); 
    //     req.input("Landfill" , sql.Bit , answer.Landfill); 
    //     req.input("IndustrialWasteManagement" , sql.Bit , answer.IndustrialWasteManagement); 
    //     req.input("IndustrialWasteRecycling" , sql.Bit , answer.IndustrialWasteRecycling); 
    //     req.input("WasteOil" , sql.Bit , answer.WasteOil); 
    //     req.input("Caustic" , sql.Bit , answer.Caustic); 
    //     req.input("Catalyst" , sql.Bit , answer.Catalyst); 
    //     req.input("Gypsum" , sql.Bit , answer.Gypsum); 
    //     req.input("RedMud" , sql.Bit , answer.RedMud); 
    //     req.input("Phosphogypsum" , sql.Bit , answer.Phosphogypsum); 
    //     req.input("SteelDust" , sql.Bit , answer.SteelDust); 
    //     req.input("OtherWaste" , sql.Bit , answer.OtherWaste); 
    //     //TODO: call procedure that inserts those fields in table RCJ_Request
    //     req.excute("RCJ_Response_Request_Insert" , function (res  , error ) {
    //             console.log(res.returnValue)
    //     } );          
    //    });

  }

  //TODO: Add lookups API
module.exports.addRCJQuestionnaireEnv = addRCJQuestionnaireEnv;