import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { UserRequestStatisticService } from '../../services/user-request-statistic.service'; 
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CustomerProfileService } from "../../services/customer-profile.service";
import {  NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';
import { CommunicationsService } from "../../services/communications.service";
@Component({
  selector: 'client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {

  constructor(private localStorage: LocalStorage,private communicationsService: CommunicationsService,private customerProfileService:CustomerProfileService , private router :Router , private userRequestStatisticService: UserRequestStatisticService   , private spinnerService: Ng4LoadingSpinnerService) {


    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
     // console.log(event.url);
      if(event.url=='/pages/client-dashboard')
      this.ngOnInit();
    });
   }
 
   requests:any; 
   lastrequests:Array<any>;
  ngOnInit() {
   //  this.getUserRequestStatistic() 
     //this.spinnerService.hide();
     setTimeout(() => {
      this.getSendRequests();
    }, 200);
  }
  getSendRequests() {
    // alert("SSS"+this.customerProfileService.currentCustomerProfile.customerProfileId);
    if(this.customerProfileService.currentCustomerProfile.customerProfileId!= undefined){
      this.communicationsService
      .getSendRequestInfo(this.customerProfileService.currentCustomerProfile.customerProfileId,'ALL')
      .then(requests => (this.bindRequsets(requests)), err => err);
      // this.sendMessage();
    }
  }
  bindRequsets(requestsData){
    try{
      // alert(requestsData.length)
      this.lastrequests = requestsData;
     
    }
    catch(err){

    }
  }
  setProductId(id: number){ 
    console.log("setting service id ", id );
    this.localStorage.setItem("serviceId" , id ).subscribe(()=>{});
    this.router.navigateByUrl("/pages/new-request/preliminary-request"); 
  }  
   

  getUserRequestStatistic(){ 
    this.userRequestStatisticService.getUserRequestsStatistics().subscribe((val=>  {this.requests = val; 
     let a = this.requests;
    }) , error=> {
  console.error("getting statistics ERROR" , error) ; 
      } );  
    
  }

}
