import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandloanRequestService {

  constructor(private http:HttpClient) {
    

   }

  createLandLoanRequest(obj :any ):Observable<any> { 
    return this.http.post<Observable<any>>("/api/LandLoan/landLoanRequest" , obj);
  }
  finalSubmit(data) :  Observable<any> {  
    return this.http.post<Observable<any>>("/api/LandLoan/finalSubmit" , data)
  }
}
