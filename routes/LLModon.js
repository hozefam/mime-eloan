const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require("passport");
const apis = require("../model/apis");
var apisJson = {};
apisJson = JSON.parse(apis.apisList());

router.post('/GetCRInformationBuyCRNo', passport.authenticate("jwt", { session: false }), async (req, res) => {
  debugger;

  //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

  const user = req.user;
  const data = JSON.stringify(req.body.data);
  // req.body['LoginId'] = req.user.LoginId;

  console.log("data", data);
  console.log("eq", req.body);
  let url = apisJson.CRInformation + '?crnumber=' + req.body.data.crnumber;
  axios({
    method: "Get",
    url,
    //data,
    headers: {
      'Content-Type': 'application/json',
      'SIDF-ApiKey': '5C93618F583D7738628CA647A76AA'
    },
  })
    .then((result) => {
      console.log("res", result);
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    });

});

router.post('/ModonLandForm5', passport.authenticate("jwt", { session: false }), async (req, res) => {

  let url = apisJson.ModonLandForm5;
  const user = req.user;
  //  const data = JSON.stringify(req.body);
  // req.body['LoginId'] = req.user.LoginId;
  // console.log("data" , data ); 
  // console.log("eq" ,req.body );
  //  console.log("eq" ,req.body.data ); 



  axios({
    method: "post",
    url,
    data: req.body.data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})

router.post('/ModonLandForm5_GET', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
  let url = apisJson.ModonLandForm5 + '/' + req.body.data;
  const user = req.user;
  //  const data = JSON.stringify(req.body);
  // req.body['LoginId'] = req.user.LoginId;
  // console.log("data" , data ); 
  // console.log("eq" ,req.body );
  //  console.log("eq" ,req.body.data ); 



  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})


router.post('/Modon_EquipmentGet', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.Modon_Equipment + '?id=' + req.body.data;
  const user = req.user; 


  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})

router.post('/Get_MODONLookUP', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.Get_MODONLookUP;
  const user = req.user; 


  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})

router.post('/Get_MODONTableAll', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.Get_MODONTableAll+ '?id=' + req.body.data;
  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})


router.post('/GetModonLandForm1', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.GetModonLandForm1+ '?id=' + req.body.data;
  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})


router.post('/GetClientDetails', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.GetClientDetails+ '?nationalid=' + req.body.data;
  axios({
    method: "get",
    url,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})

router.post('/Modon_EquipmentPost', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_Equipment;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});


router.post('/SaveModonLandForm1', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModonLandForm1;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});


router.post('/SaveModon_ProductsDetails', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_ProductsDetails;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});

router.post('/SaveModon_Contact_Details', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_Contact_Details;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});



router.post('/SaveModon_Documents', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_Documents;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});


router.post('/SaveModon_ImportingDetails', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_ImportingDetails;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});



router.post('/SaveModon_ExportingCountries', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_ExportingCountries;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});


router.post('/SaveModon_RawMaterialsDetails', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_RawMaterialsDetails;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});


router.post('/SaveModon_Products_List', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_Products_List;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});


router.post('/SaveModon_ManufacturingTechnology', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.SaveModon_ManufacturingTechnology;
  const user = req.user;
  const data = JSON.stringify(req.body.data); 
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    }, 
  }).then((result) => { 
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    }); 
});
router.post('/GetMimProducts', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.GetMimProducts+ '?crNumber=' + req.body.crNumber+'&lang='+ req.body.lang;
  axios({
    method: "get",
    url,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

});
router.post('/DeleteData', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
 
  let url =   apisJson.DeleteData+ '?type=' + req.body.type+'&Id='+ req.body.id;
  axios({
    method: "delete",
    url,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})


router.post('/ModonLandForm6_GET', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log(req);
  let url = apisJson.ModonLandForm6 + '/' + req.body.data;
  const user = req.user;
  //  const data = JSON.stringify(req.body);
  // req.body['LoginId'] = req.user.LoginId;
  // console.log("data" , data ); 
  // console.log("eq" ,req.body );
  //  console.log("eq" ,req.body.data ); 



  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})
router.post('/ModonLandForm6', passport.authenticate("jwt", { session: false }), (req, res) => {

  let url = apisJson.ModonLandForm6;
  const user = req.user;
  //   const data = JSON.stringify(req.body);
  // req.body['LoginId'] = req.user.LoginId;
  //console.log("data" , data ); 
  //   console.log("eq" ,req.body );
  axios({
    method: "post",
    url,
    data: req.body.data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((result) => {
      console.log(result);
      res.send(result.data);
    }).catch((err) => {
      console.log(err);
    });

})


router.post('/ModonSubActivities', passport.authenticate("jwt", { session: false }), (req, res) => {

  let url = apisJson.ModonSubActivities + "/" + req.body.data;
  const user = req.user;
  const data = JSON.stringify(req.body);

  axios({
    method: "get",
    url,

    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then((result) => {
      console.log(result.data);
      res.send(result.data);
    }).catch((err) => {

    });

})
router.post('/ModonGetCityByIL', passport.authenticate("jwt", { session: false }), (req, res) => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  let url = apisJson.ILModonCity;
  const user = req.user;
  const data = JSON.stringify(req.body.data);
  // req.body['LoginId'] = req.user.LoginId;
  console.log(url);
  console.log("data", data);
  console.log("eq", req.body);
  axios({
    method: "post",
    url,
    data,
    headers: {
      'Content-Type': 'application/json'
    },



  })
    .then((result) => {
      console.log("res", result);
      res.send(result.data);
    }).catch((err) => {
      console.log("error ", err);
    });

});

router.post('/checkValidECA', passport.authenticate("jwt", { session: false }), (req, res) => {

  let url = `${apisJson.checkValidECA}?ECAlicense=${req.body.eca_license}`;

  const data = JSON.stringify(req.body);
  console.log('data' + data)
  console.log('body' + req.body.eca_license)

  axios({
    method: "get",
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