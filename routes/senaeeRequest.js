const sql = require("mssql/msnodesqlv8")
const  pool = new sql.ConnectionPool({
    database: "UniPortal_DEV2",
    server: "SQL-SRVRDEV",
    driver: "msnodesqlv8",
    options: {
      trustedConnection: true
    }
  }) ; 
    

  function addPreliminaryRequest (BuPartner , PreliminaryId  , PriliminaryRequestID ,ProjectId , NationalId ,internalStatus   ){  
    const req= pool.request(); //
    req.input("BuPartner" , sql.BigInt , BuPartner   ); 
   
    req.input("PreliminaryId" , sql.BigInt , PreliminaryId   )
    req.input("PriliminaryRequestID"  ,sql.BigInt , PriliminaryRequestID   )
    req.input("ProjectId" , sql.BigInt , ProjectId   )
    req.input("NationalId"  ,sql.BigInt , NationalId   )
    req.input("internalStatus" , sql.Int , internalStatus   )
    req.excute("CRM_Request_Insert" , function (res  , error ) {
            console.log(res.returnValue)
    } ); 
  }
  
module.exports.addPreliminaryRequest = addPreliminaryRequest;