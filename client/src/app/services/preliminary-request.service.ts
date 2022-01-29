import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})

export class PreliminaryRequestService {

  constructor(
    private http: HttpClient
  ) { }

  GetCRnformation(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/GetCRInformationBuyCRNo', {
          data
        })
        .subscribe(
          (res: any) => {

            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getMCIDetails(license_type, id_number, dob, purpose) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getMCIDetails", {
          license_type: license_type,
          id_number: id_number,
          dob: dob,
          purpose: purpose
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }
  GetModonCites(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/ModonGetCityByIL', {
          data,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  
  GetCrCites() {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/preliminaryRequest/Get_City',{})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }



  getOwnerDetails(shareholder_type, investor_type, id_type, id_number, dob) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getOwnerDetails", {
          shareholder_type: shareholder_type,
          investor_type: investor_type,
          id_type: id_type,
          id_number: id_number,
          dob: dob
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getRepresentativeDetails(id_type, id_number, dob) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getRepresentativeDetails", {
          id_type: id_type,
          id_number: id_number,
          dob: dob
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getPreliminaryRequestInfo() {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getPreliminaryRequestInfo", {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getPreliminaryRequestCountryList() {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getPreliminaryRequestCountryList", {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  postPreliminaryRequest(data) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/postPreliminaryRequest", data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }
  postPreliminaryRequestProducts(data) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/postProductsPRQ", data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  postAfterPreliminaryRequest(ProjectId) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/postAfterPreliminaryRequest", { ProjectId: ProjectId })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  getPRQDetailsByRequestId(customerProfileId, requestId) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getPRQDetailsByRequestId", {
          customerProfileId: customerProfileId,
          requestId: requestId
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  getHSCodeList() {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getHSCodeList", {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  getUserTypeInfo() {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getUserTypeInfo", {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }

  postOwnersBP(data) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/postOwnersBP", data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  postOwnersAddInfo(data) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/postOwnersAddInfo", data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }
  getPreliminaryRequestInfoSecond(profileType) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/preliminaryRequest/getPreliminaryRequestInfoSecond", {
          profileType: profileType
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