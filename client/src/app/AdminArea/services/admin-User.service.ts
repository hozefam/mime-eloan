import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LocalStorage } from "@ngx-pwa/local-storage";


@Injectable({
  providedIn: "root"
})

export class AdminUserService {
  constructor(protected localStorage: LocalStorage,private http: HttpClient) { }


  getDataUsers() {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admin/GetUsers", {}).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  AddUser(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admin/AddUser", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  isAuth(){
    
    return this.localStorage.getItem("AdminLoginData");
    } 
  





  UserChangePass(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admin/UserChangePasswod", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }


  DeleteUser(obj) {

    return new Promise((resolve, reject) => {
      this.http.post("/api/admin/DeleteUser", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
}
