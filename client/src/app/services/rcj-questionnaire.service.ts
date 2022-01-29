import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../services/common.service";

@Injectable({
  providedIn: "root"
})

export class RCJQuestService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  submitRequest(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCJ/sendRCJQuestionnaire", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getQuestionnair(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCJ/getRCJQuestionnaire", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getQuestionnaireType(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCJ/getRCJQuestionnaireType", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
}
