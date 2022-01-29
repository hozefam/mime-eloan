import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) { }

  validateLandLoanAdminLogin(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/auth/validateLandLoanAdminLogin', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  validateLogin(obj) {
    return new Promise((resolve, reject) => {
      this.http.post("/api/auth/validateLogin", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  validateSignUp(obj) {
    return new Promise((resolve, reject) => {
      this.http.post("/api/auth/validateSignUp", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  signUp(obj) {
    return new Promise((resolve, reject) => {
      this.http.post("/api/auth/signUp", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  uploadDocumentSignup(obj) {
    return new Promise((resolve, reject) => {
      this.http.post("/api/documentUpload/signUpUploadDocuments", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getCustomerProfile(obj) {
    return new Promise((resolve, reject) => {
      this.http.post('/api/auth/getCustomerProfile', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  signUpCountryList() {
    return new Promise((resolve, reject) => {
      this.http.post("/api/auth/signUpCountryList", {}
      ).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  editMobileOrEmailOrBasicData(ProfId, MobileOrEmailOrData, Indicator) {

    let data;

    if (Indicator == 'SM') {
      data = {

        ProfId: '',
        Mobile: '',
        Indicator: '',

      };
      data.ProfId = ProfId;
      data.Mobile = MobileOrEmailOrData;
      data.Indicator = Indicator;
    }
    else if (Indicator == 'SE') {
      data = {

        ProfId: '',
        Email: '',
        Indicator: '',

      };
      data.ProfId = ProfId;
      data.Email = MobileOrEmailOrData;
      data.Indicator = Indicator;
    }
    else if (Indicator == 'UB') {
      data = ProfId;
      data.Indicator = Indicator;
    }

    return new Promise((resolve, reject) => {
      this.http
        .post('/api/auth/editMobileOrEmailOrBasicData', {
          data: data,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  verifyMobileOrEmailOtp(ProfId, MobileOrEmail, MobileOrEmailOtp, Indicator) {

    let data;

    if (Indicator == 'VM') {
      data = {

        ProfId: '',
        Mobile: '',
        MobOtp: '',
        Indicator: '',

      };
      data.ProfId = ProfId;
      data.Mobile = MobileOrEmail;
      data.MobOtp = MobileOrEmailOtp
      data.Indicator = Indicator;
    }
    else if (Indicator == 'VE') {
      data = {

        ProfId: '',
        Email: '',
        EmailOtp: '',
        Indicator: '',

      };
      data.ProfId = ProfId;
      data.Email = MobileOrEmail;
      data.EmailOtp = MobileOrEmailOtp
      data.Indicator = Indicator;
    }

    return new Promise((resolve, reject) => {
      this.http
        .post('/api/auth/verifyMobileOrEmailOtp', {
          data: data,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  changePasswordService(profileId, OldPass, NewPass) {

    const data = {

      OldPass: '',
      NewPass: '',
      ProfId: '',
      Indicator: '',
    };

    data.OldPass = OldPass;
    data.NewPass = NewPass;
    data.ProfId = profileId;
    data.Indicator = 'PC';

    return new Promise((resolve, reject) => {
      this.http
        .post('/api/auth/changePasswordService', {
          data: data,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  submitContactUs(obj) {
    return new Promise((resolve, reject) => {
      this.http.post("/api/auth/submitContactUs", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
}
