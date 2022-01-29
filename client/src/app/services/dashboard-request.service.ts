import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardRequestService {


  private requests = [

      {
          "RequestId": 2000000129,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Save Draft",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000130,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000131,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Save Draft",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000132,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Save Draft",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000137,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Save Draft",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000138,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Save Draft",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000139,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000140,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000141,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Save Draft",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000142,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000143,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000144,
          "CreatedDate": "03.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "03.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000151,
          "CreatedDate": "04.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "04.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      },
      {
          "RequestId": 2000000162,
          "CreatedDate": "05.11.2018",
          "ProjectNameEn": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "ProjectNameAr": "مصنع الشركة السعودية العربيه للزجاج المحدودة",
          "CustomerNo": "1231231238",
          "RequestType": "New Preliminary Request",
          "RequestCode" : "NPRE",
          "RequestDate": "05.11.2018",
          "RequestStatus": "Approval in Progress",
          "RequestDescription": "Preliminary Request",
          "CustomerProfileNo": 1356
      }


  ]

  constructor() { }

  getRequests() {
    return this.requests;
  }
}
