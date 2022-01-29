import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: 'root'
})

export class RepresentativesListService {

  constructor(private http: HttpClient, private commonService: CommonService) { }

  getRepresentativesList(profileid) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/representativesList/getRepresentativesList", {
          ProfileId: profileid
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  getRepresentativesListUsingId(profileid, idNumber, idType) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/representativesList/getRepresentativesListUsingId", {
          ProfileId: profileid,
          idNumber: idNumber,
          idType: idType
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

  postRepresentativesList(data) {

    return new Promise((resolve, reject) => {
      this.http
        .post("/api/representativesList/postRepresentativesList", data)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err)
        );
    });

  }

}