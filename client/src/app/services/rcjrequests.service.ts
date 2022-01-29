import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _ } from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class RCJRequestsService {

  constructor(private http: HttpClient) { }

  GetRCJRequests(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/RCJRequests/GetRCJRequests',obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  GetRCJRequestStatus(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/RCJRequests/GetLookupStatus', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }


  ExportToExcelsheet(obj) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/RCJRequests/ExportToExcelsheet', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

}
