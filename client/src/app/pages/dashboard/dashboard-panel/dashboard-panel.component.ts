import { Component, OnInit } from '@angular/core';
import { _ } from 'underscore';
import { DashboardRequestService } from '../../../services/dashboard-request.service';

@Component({
  selector: 'dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements OnInit {

  requests: Array<any>;
  npre: any;
  nloa: any;
  comr: any;

  constructor(private RequestService: DashboardRequestService) { }

  ngOnInit() {

      this.requests = this.RequestService.getRequests();
      this.npre = _.where(this.requests, { RequestCode: "NPRE" });
      this.nloa = _.where(this.requests, { RequestCode: "NLOA" });
      this.comr = _.where(this.requests, { RequestCode: "COMR" });

  }

}
