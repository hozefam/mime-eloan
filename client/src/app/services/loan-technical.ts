import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class LoanTechnicalService {
  
  constructor(
    private http: HttpClient
  ) {}

  postManfacProducts(data){

    return new Promise((resolve,reject) => {
      this.http
      .post("/api/loanTechnical/postManfacProducts", data)
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });
}

getManfacProducts(customerProfileId, finPlanId, SentRequestId){
    
  return new Promise((resolve,reject) => {
    this.http
    .post("/api/loanTechnical/getManfacProducts", 
    { 
      customerProfileId:customerProfileId,
      finPlanId:finPlanId,
      SentRequestId: SentRequestId
    }
    )
    .subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });

}

  postTechInfoComponent(data){

    return new Promise((resolve,reject) => {
      this.http
      .post("/api/loanTechnical/postLoanTechnical", data)
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });
}



getTechInfoComponent(customerProfileId, finPlanId, SentRequestId, isClaims){
    
  return new Promise((resolve,reject) => {
    this.http
    .post("/api/loanTechnical/getLoanTechnicalComponent", 
    { 
      customerProfileId:customerProfileId,
      finPlanId:finPlanId,
      SentRequestId:SentRequestId,
      isClaims: isClaims
    }
    )
    .subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });

}
getTechInfoComponentCategories(){
    
  return new Promise((resolve,reject) => {
    this.http
    .post("/api/loanTechnical/getLoanTechnicalComponentCategories", {})
    .subscribe(
      (res: any) => {
        return resolve(res);
      },
      err => reject(err)
    );
    });

    }


    postChecklistRequest(cust_prof_id, loan_request_id) {
      // console.log(customerProfileId);
      return new Promise((resolve, reject) => {
        this.http
          .post("/api/loanTechnical/postChecklistRequest", {
            cust_prof_id : cust_prof_id,
            loan_request_id :  loan_request_id
          })
          .subscribe(
            (res: any) => {
              return resolve(res);
            },
            err => reject(err)
          );
      });
    }
    
}