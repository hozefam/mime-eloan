import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { _ } from 'underscore';

import { DashboardRequestService } from '../../../services/dashboard-request.service';
import { CommunicationsService } from "../../../services/communications.service";
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { CommonService } from "../../../services/common.service";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'dashboard-transactions',
  templateUrl: './dashboard-transactions.component.html',
  styleUrls: ['./dashboard-transactions.component.scss']
})
export class DashboardTransactionsComponent implements OnInit {

  alive = true;
  currentTheme='default';
  @Input() requests:Array<any>;
  type = 'ALL';
  types:any= ['All', 'Preliminary','Loan','Received Requests'];

  
  header : boolean;
  width : string;
  date = new Date();
lang =this.translate.currentLang;
  constructor(private commonService:CommonService,private translate: TranslateService,private RequestService: DashboardRequestService,private communicationsService: CommunicationsService,private customerProfileService:CustomerProfileService) { 
    
    this.getUserActivity(this.type);
    this.header = false;
    this.width = "26rem";
  }

  ngOnInit() {
    
    
  }

  getUserActivity(selectedType : string){
    this.type = selectedType;
  }

  ngOnDestroy() {
    this.alive = false;
  }

  handleDateChange(date: Date){
    console.log(date);
  }
}
