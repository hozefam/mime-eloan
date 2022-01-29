import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { _ } from 'underscore';
import { DashboardRequestService } from '../../services/dashboard-request.service';
import { CommunicationsService } from "../../services/communications.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  requests:Array<any>;
  npre:  number=0;
  nloa:   number=0;
  comr:   number=0;
  date=new Date();
  options: any = {};
  hidechatdiv = true;
  surveyUrl:string;
  themeSubscription: any;
  constructor(private router: Router,private RequestService: DashboardRequestService,private communicationsService: CommunicationsService,private customerProfileService:CustomerProfileService, private toastr: ToastrService,private theme: NbThemeService) {
    // setTimeout(() => {
    //   this.getSendRequests();
    // }, 300);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      // console.log(event.url);
      this.ngOnInit();
    });
   } 
  ngOnInit() {
    
    setTimeout(() => {
      this.getSendRequests();
    }, 200);
  }

  openChatForm(){
    this.hidechatdiv = false;
  }

  closeChatForm(){
    this.hidechatdiv = true;
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
      this.requests = requestsData;
      var prqResult= _.filter(this.requests, function(item){
        return item.RequestCode=="NPRE" || item.RequestCode=="APRE";
     });//_.where(this.requests, { RequestCode: "NPRE" });
     this.npre =prqResult.length;
      var loanResult = _.filter(this.requests, function(item){
        return item.RequestCode=="NLOA" || item.RequestCode=="NLOC";
     });//_.where(this.requests, { RequestCode: "NLOA" });
     this.nloa =loanResult.length;
      var comrResult= _.where(this.requests, { RequestCode: "COMR" });
      this.comr =comrResult.length;
     
      this.bindPieChart();
      
    this.communicationsService
    .getCRMSurveyURL()
    .then(requests => (this.bindCRMURL(requests)), err => err);     
    }
    catch(err){

    }
  }
  bindCRMURL(response){
    var bpId=this.customerProfileService.currentCustomerProfile.bpId;
    this.surveyUrl=response.crmUrl+bpId;
  }
  bindPieChart(){
    var chartData =[];
    // chartData.push({name:"ALL",value:this.requests.length });
    if(this.requests.length >0){
      chartData.push({name:"PRQ",value:this.npre });
      chartData.push({name:"LOAN",value:this.nloa });
      chartData.push({name:"COMR",value:this.comr });
    }
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        color: ["rgb(0, 110, 66)", "rgb(107, 140, 56)", "rgb(193, 162, 65)"],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [ 'PRQ', 'LOAN', 'COMR'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Requests',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data:chartData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    // this.themeSubscription.unsubscribe();
  }

  handleDateChange(event){
    
  }

}
