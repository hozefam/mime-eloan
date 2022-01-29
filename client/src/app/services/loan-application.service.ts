import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class LoanApplicationService {
  
  constructor(
    private http: HttpClient
  ) {}

  getLoanMachineryDropdown(finplanid) {

    var data = {
      finplanid: "",
    };

    data.finplanid = finplanid;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanMarketing/getLoanMachineryDropdown", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getMarketingInformation(projectId, customerProfile) {
    
    var data = {
      projectId: "",
      customerProfile: ""
    };

    data.projectId = projectId;

    data.customerProfile = customerProfile;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanMarketing/getMarketingInformation", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
         },
          err => reject(err)
        );
    });
  }

  postMarketingInformation(data){

    return new Promise((resolve,reject) => {
    this.http
    .post("/api/loanMarketing/postMarketingInformation", data)
    .subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });
    
  }

  getBpExternalId(externalid) {

    var data = {
      externalid: "",
    };

    data.externalid = externalid;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanFinancial/getBpExternalId", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
 }

  getcofinancier(FinPlanId, requestId){

    var data = {
      FinPlanId: "",
      requestId: ""
    };

    data.FinPlanId = FinPlanId;
    data.requestId = requestId;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanFinancial/getcofinancier", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  
  getAssetStatement(bpId, profileId, requestId) {
    
    var data = {
      bpId: "",
      profileId: "",
      requestId: ""
    };

    data.bpId = bpId;

    data.profileId = profileId;

    data.requestId = requestId;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanFinancial/getAssetStatementInfoByBPId", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
    
  }

  
  getLiabilityStatement(bpId, profileId, requestId) {
    
    var data = {
      bpId: "",
      profileId: "",
      requestId: ""
    };

    data.bpId = bpId;

    data.profileId = profileId;

    data.requestId = requestId;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanFinancial/getLiabilitiesStatementInfoByBPId", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
    
  }

  getIncomeStatement(bpId, profileId, requestId) {
    
    var data = {
      bpId: "",
      profileId: "",
      requestId: ""
    };

    data.bpId = bpId;

   data.profileId = profileId;

    data.requestId = requestId;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanFinancial/getIncomeStatementInfoByBPId", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
    
  }
  
  
  getFinancialFlow(bpId) {
    
    var data = {
      bpId: "",
      // profileId: "",
      // requestId:""
    };

    data.bpId = bpId;

    // data.profileId = profileId;

    // data.requestId = requestId;

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/loanFinancial/getFlowStatementInfoByBPId", {
          data: data
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
    
  }

  postcofinancier(obj){
    return new Promise((resolve,reject) => {
      this.http.post("/api/loanFinancial/cofinancier", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });
  }

  createBpRelation(obj){
    return new Promise((resolve,reject) => {
      this.http.post("/api/loanFinancial/createBpRelation", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });
  }

  postAssetStatement(obj){
    return new Promise((resolve,reject) => {
    this.http.post("/api/loanFinancial/assetStatement", obj).subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });
 }

  postLiabilitiesStatement(obj){
    return new Promise((resolve,reject) => {
    this.http.post("/api/loanFinancial/liabilitiesStatement", obj).subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });
  }

  postIncomeStatement(obj){
    return new Promise((resolve,reject) => {
    this.http.post("/api/loanFinancial/incomeStatement", obj).subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });
  }

  postFlowStatement(obj){
    return new Promise((resolve,reject) => {
    this.http.post("/api/loanFinancial/flowStatement", obj).subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });
  }


}
