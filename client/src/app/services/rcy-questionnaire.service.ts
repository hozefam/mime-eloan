import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../services/common.service";

@Injectable({
  providedIn: "root"
})

export class RCYQuestService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  submitRequest(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCY/sendRCYQuestionnaire", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getQuestionnair(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCY/getRCYQuestionnaire", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  //
  getAdminQuestionnair(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCY/getAdminQuestionnair", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getQuestionnaireType(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCY/getRCYQuestionnaireType", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  getAdminRCYQuestionnaireType(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCY/getAdminRCYQuestionnaireType", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
}
