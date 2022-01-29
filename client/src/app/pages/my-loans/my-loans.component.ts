import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.scss']
})
export class MyLoansComponent implements OnInit {
  panelOpenState = false;
  // message:string;
  customerProfiles:any=[];
  // htmlContent='<p><strong>afshsdjfasdf</strong></p><p>sdfsdf<strong><span class="ql-cursor">﻿</span></strong></p>';
  constructor(private commonService:CommonService,protected localStorage: LocalStorage) { }

  ngOnInit() {
    // this.commonService.currentMessage.subscribe(message => this.message = message)
  }

  newMessage() {
    this.localStorage.getItem('custProfile').subscribe((data) => {
      // alert(data); // null
      this.customerProfiles=data;
      if(this.customerProfiles!=null){        
        if(this.customerProfiles.length>0){
          // alert(data[0].CustomerProfile)
          // this.setLSforProfile(data[0].CustomerProfile+";"+data[0].BpNum);
          this.customerProfiles.push({BpName:"rrr",CustomerProfile:"000111",BpNum:"000111"});
          this.commonService.changeMessage(this.customerProfiles);          
        }
      }

    });
    setTimeout(() => {      
      this.localStorage.setItem('custProfile', this.customerProfiles).subscribe(() => {
      });
    }, 100);
  }

}
