import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRequestStatisticService {

  constructor(private http : HttpClient ) { }
  
 getUserRequestsStatistics(){ 
  return this.http.post("/api/clientDashboard/userRequestsStatistic", ""); 
 }

}
