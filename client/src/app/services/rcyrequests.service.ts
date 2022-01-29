import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _ } from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class RCYRequestsService {

  constructor(private http: HttpClient) { }

  GetRCYRequests(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/RCYRequests/GetRCYRequests', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  UpdateStatusApproveReject(obj) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/RCYRequests/UpdateStatusApproveReject', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  ExportToExcelsheet(obj) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/RCYRequests/ExportToExcelsheet', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

}
