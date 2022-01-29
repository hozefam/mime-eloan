import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../services/common.service";

@Injectable({
  providedIn: "root"
})

export class ProjInfoService {

  constructor(private http: HttpClient, private commonService: CommonService) {}

  initiateLoanApplication(data){

    return new Promise((resolve,reject) => {
      this.http
      .post("/api/projectInformation/initiateLoanApplication", data)
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });

  }
  
  getLoanDropdowns() {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/projectInformation/getLoanDropdowns", {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getProjectInformation(requestId, bpId) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/projectInformation/getProjectInformation", {
          requestId: requestId,
          bpId: bpId
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getProjectKPMRInformation(bpId, profileId) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/projectInformation/getProjectKPMRInformation", {
          bpId: bpId,
          profileId: profileId
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }
  
  postProjectInformation(data){

    return new Promise((resolve,reject) => {
      this.http
      .post("/api/projectInformation/postProjectInformation", data)
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });

  }

  postProjectAssetInformation(data){

    return new Promise((resolve,reject) => {
      this.http
      .post("/api/projectInformation/postProjectAssetInformation", data)
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });

  }

  postProjectKPMRInformation(data){

    return new Promise((resolve,reject) => {
      this.http
      .post("/api/projectInformation/postProjectKPMRInformation", data)
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });

  }
  
  submitLoanApplication(data){

    return new Promise((resolve,reject) => {
    this.http
    .post("/api/projectInformation/submitLoanApplication", data)
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
        .post("/api/projectInformation/getBpExternalId", {
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
  
  postGuarantors(obj){
    return new Promise((resolve,reject) => {
      this.http.post("/api/projectInformation/guarantors", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });
  }

  checkExternalId(obj){
    return new Promise((resolve,reject) => {
      this.http.post("/api/projectInformation/checkExternalId", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
      });
  }

}
