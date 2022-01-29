import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { promise } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class LlPreliminaryRequestService {

  constructor(private http: HttpClient) { }

  UpdateLandLoanStatusByLastStatus(data) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/LandLoan/UpdateLandLoanStatusByLastStatus', data).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  };

  UpdatePreliminaryRequestStatusByLastStatus(data) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/LandLoan/UpdatePreliminaryRequestStatusByLastStatus', data).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  };

  postLandLoanPreliminartyRequest(data): Observable<any> {
    return this.http.post<any>("/api/LandLoan/landLoanPreliminaryRequest", data);
  }

  checkValidECA(eca_license) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/eca/checkValidECA", {
          eca_license: eca_license
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });
  }
  getECARequest(requestId) {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/eca/getECARequest", {
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
  Services = [
    { "CRM_code": "24", "LL_code": 7, "name": "ارض وقرض مدن" },
    { "CRM_code": "38", "LL_code": 11, "name": "ارض وقرض هيئة المدن الإقتصادية" },
    { "CRM_code": "25", "LL_code": 8, "name": "مصنع وقرض مدن" },
    { "CRM_code": "35", "LL_code": 9, "name": "ارض وقرض الجبيل" },
    { "CRM_code": "36", "LL_code": 10, "name": "ارض وقرض ينبع" },
    /** TODO: Update the LL service code */
    { "CRM_code": "37", "LL_code": 12, "name": "ارض وقرض سبارك" },
    { "CRM_code": "51", "LL_code": 12, "name": "ارض وقرض خدمات لوجيسستيه" },
    { "CRM_code": "52", "LL_code": 13, "name": "ارض وقرض خدمات لوجيسستيه" },
    { "CRM_code": "53", "LL_code": 14, "name": "ارض وقرض خدمات لوجيسستيه" },
    { "CRM_code": "54", "LL_code": 15, "name": "ارض وقرض خدمات لوجيسستيه" },
  ];



}
