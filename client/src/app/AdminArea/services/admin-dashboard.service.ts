import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: "root"
})

export class AdminDashboardService {

  constructor(private http: HttpClient) { }


  GetRequestCountbyStatus() {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admindashboard/GetRequestCountbyStatus", {}).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }



  getDataStatistics(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admindashboard/GetStatistics", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getDataChart(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admindashboard/GetLoanDataByServicesIdChart", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
}
