import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class nonBorrowingCertificateService {

  constructor(private http: HttpClient) { }

  getNonBorrowingCertificateInitialFinal(loanid, iorf, factoryid) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/nonBorrowingCertificate/getNonBorrowingCertificateInitialFinal', {
          LoanId: loanid,
          IorF: iorf,
          FactoryId: factoryid
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getNonBorrowingCertificate(crid, crdate) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/nonBorrowingCertificate/getNonBorrowingCertificate', {
          cr_number: crid,
          cr_date: crdate
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getNonBorrowingCertificateRequests() {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/nonBorrowingCertificate/getNonBorrowingCertificateRequests', {
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }


  postExceptions(screen, operation, userid, username, customerprofileid){

    return new Promise((resolve, reject) => {
      this.http
      .post('/api/nonBorrowingCertificate/postExceptions', {
        screen: screen,
        operation: operation,
        userid: userid,
        username: username,
        customerprofileid: customerprofileid,
      })
      .subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
      });
}

}
