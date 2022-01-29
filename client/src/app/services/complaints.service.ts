import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ComplaintsService {
  constructor(
    private http: HttpClient
  ) {}

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.http
        .post("/api/users/getAllUsers", {
          client: "kschool",
          id: 1
        })
        .subscribe(
          (res: any) => {
            return resolve(res.users);
          },
          err => reject(err)
        );
    });
  }

  // registerUser(obj){
  //   return new Promise((resolve,reject) => {
  //   this.http.post("/api/users/createNewUser" , obj).subscribe((res:any)=>{});
  //   });
  // }
  
}
