import { Component, OnInit, ViewChild } from '@angular/core';
import { Form5Service } from '../../services/form5.service';
import { Options, LabelType } from 'ng5-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { RCJAdminDashboardComponent } from '../rcj/rcjAdmin-dashboard/rcjAdmin-dashboard.component';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(RCJAdminDashboardComponent) rcjAdminStatus: RCJAdminDashboardComponent;
  fromAmount: number; toAmount: number;
  sub: any;
  translate = this.commonService.returnTranslate();
  toCreationDate: Date;
  fromCreationDate: Date;
  textToshow: string = "... More"
  isshow: boolean = false;
  cmonth: string; cyear: string;
  minValue: number = 0;
  maxValue: number = 1000000;
  startedFilling = 0;
  options: Options = {
    floor: 0,

    ceil: 100000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>from: </b>  SAR ' + value;
        case LabelType.High:
          return '<b>to: </b>  SAR ' + value;
        default:
          return 'SAR' + value;
      }
    }
  };


  constructor(route: ActivatedRoute, private commonService: CommonService, private spinnerService: Ng4LoadingSpinnerService, private adminservice: AdminDashboardService, private cityservice: Form5Service, private router: Router, protected localStorage: LocalStorage) {
    this.translate = this.commonService.returnTranslate();

    this.sub = route.data.subscribe(a => {
      this.serviceId = a['serviceid']
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  public brandPrimary = '#20a8d8';
  public brandSuccess = '#4dbd74';
  public brandInfo = '#63c2de';
  public brandWarning = '#f8cb00';
  public brandDanger = '#f86c6b';

  // dropdown buttons
  public status: { isopen } = { isopen: false };
  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  // convert Hex to RGBA
  public convertHex(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
    return rgba;
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }




  // mainChart

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public mainChartElements = 4;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    }/* ,
    {
      data: this.mainChartData3,
      label: 'BEP'
    } */
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['الإسبوع الاول', 'الإسبوع الثاني', 'الإسبوع الثالث', 'الإسبوع الرابع'];

  // public mainChartLabels: Array<any> = [ 'Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value: any) {
            return value;//.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 7,
          stepSize: Math.ceil(40 / 7),
          max: 60
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: this.convertHex(this.brandInfo, 10),
      borderColor: this.brandInfo,
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: this.brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';




  // sparkline charts


  serviceId: any;
  amount: any = 0;
  city: any;
  CreationDatechart: Date = new Date();
  Cities: any;
  ngOnInit(): void {
    //this.Cities=this.cityservice.region;
    this.GeCityData();
    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      if (data) {

        //this.serviceId= data.ServiceId ;

        var obj = {
          "serviceId": this.serviceId,
        };
        this.getDataStatistics(obj);

        this.getDatachart();
      }
      else {
        this.router.navigateByUrl('/admin-login');
      }
    });

  }
  getMainChart(data) {
    // generate random values for mainChart
    /*  this.mainChartData1=[]as Array<number>;
     this.mainChartData2=[]as Array<number>; */

    if ((data && data.length > 0)) {

      this.cmonth = data[0].Month_Name; this.cyear = data[0].Year;
      for (let i = 1; i <= this.mainChartElements; i++) {

        this.mainChartData1.push(data[0]['Count_Of_Current_Month_Week_' + i]);
        this.mainChartData2.push(data[0]['Count_Of_Previous_Month_Week_' + i]);
        //this.mainChartData3.push(65);
      }
    }


  }

  GeCityData() {

    try {
      this.cityservice
        .GetCityLookup().then((requests) => {
          if (requests)
            this.Cities = requests;
        }), err => this.commonService.showFailureToast(err);
    } catch (err) {

      this.commonService.showFailureToast(err);
    }

  }

  SearchData() {
    if (this.amount && this.amount.length > 0) {
      this.fromAmount = this.amount[0]; this.toAmount = this.amount[1];
    }

    var obj = {
      "serviceId": this.serviceId,
      "fromAmount": this.fromAmount,
      "toAmount": this.toAmount,
      "fromCreationDate": (this.fromCreationDate),
      "toCreationDate": (this.toCreationDate),
      "city": this.city,
      "loadId": '1'
    };

    this.getDataStatistics(obj);
  }

  getDataStatistics(obj) {
    this.spinnerService.show();
    try {
      this.adminservice
        .getDataStatistics(obj).then((requests) => {
          if (requests)
            this.rcjAdminStatus.data = requests;
          this.spinnerService.hide();
        }), err => this.commonService.showFailureToast(err);
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  getDatachart() {
    var obj = {
      "serviceId": this.serviceId,
      "month": this.CreationDatechart.getUTCMonth() + 1,
      "year": this.CreationDatechart.getFullYear(),
    };

    this.spinnerService.show();
    try {

      this.adminservice
        .getDataChart(obj).then((requests) => {
          if (requests)
            this.getMainChart(requests);
          this.spinnerService.hide();
        }), err => this.commonService.showFailureToast(err);
    } catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }

  }

  Reset() {
    this.city = null;
    this.toCreationDate = this.fromCreationDate = null; this.fromAmount = this.toAmount = null; this.minValue = this.amount = 0, this.maxValue = 100000
    var obj = {
      "serviceId": this.serviceId,
    };
    this.getDataStatistics(obj);
  }


  getDayAriaLabel(date) {
    if (date) {
      return `${date.month}-${date.day}-${date.year}`;

    }
    return null;
  }

}
