import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
const cryptrKey = 'KSidf@2018';


@Injectable({
  providedIn: 'root',
})
export class CustomerProfileService {


  loginCurrentUserId: any = 0;

  loginCurrentDate: any = 0;

  signUpUserType: any = '';

  currentCustomerProfile: any = {};

  // currentCustomerDetails: any = {};

  loanRequestId: any = 0;

  currentUser: any = {};

  LandLoanRequestStatus: any = 0;
  PreliminaryRequestStatus: any = 0;
  PreliminaryRequestLastStatus: any = 0;
  LandLoanRequestLastStatus: any = 0;
  LandLoanRequestProjectId: any = 0;
  PreliminaryRequestNumber: any = 0;

  loanPercentageValues = {

    GenInfoPer: 0,
    MarkInfoPer: 0,
    TechInfoPer: 0,
    FinInfoPer: 0,
    ChecklistPer: 0,
    PerDenom: 0
  };

  communication: any = 0;
  selectedIndex: any = 0;

  statusCode: any = '';

  commentsFrom: any = '';

  commentArray: any = {};

  commentArrayExists: any = false;

  loanArray: any = {};

  loanDropdowns: any = {};

  agreementDropdowns: any = {};

  myLoanCurrentProjectId: any = 0;

  myLoanCurrentLoanId: any = 0;

  myLoanCurrentProjectFinPlanId: any = 0;

  myLoanCurrentLoanSendRequestId: any = 0;

  myLoanCurrentProjectName: any = '';

  myLoanCurrentLoanIdName: any = '';

  projectProfileId: any = '';

  RCYLoanNumber: any = 0;
  RCYSysuserServiceId: any = 0;
  RCYPreliminaryRequestNumber: any = 0;
  constructor() { }

  setCurrentUser(user) {

    this.currentUser = user;

  }

  selectedCusotmerProfile(customer) {
    // console.log(customer);
    this.currentCustomerProfile = { customerProfileId: customer.split(';')[0], bpId: customer.split(';')[1] };
  }

  setProjectProfileId(projectProfileId) {

    this.projectProfileId = projectProfileId;

  }

  setUserIdName(userid, username) {
    this.currentCustomerProfile['UserId'] = userid;
    this.currentCustomerProfile['UserName'] = username;

  }

  setLoginDataForExistingUser(loginCurrentUserId, loginCurrentDate) {

    this.loginCurrentUserId = loginCurrentUserId;
    this.loginCurrentDate = loginCurrentDate;

  }

  setSignUpType(signUpUserType) {

    this.signUpUserType = signUpUserType;

  }

  // selectedCustomerDetails(customerDetails) {
  //   // console.log(customer);
  //   this.currentCustomerDetails = customerDetails;
  // }

  getEncryptedString(value) {
    return crypto.DES.encrypt(value, cryptrKey);
  }

  getDecryptString(value) {
    let result = '';
    try {
      let bytes = crypto.DES.decrypt(value, cryptrKey);
      result = bytes.toString(crypto.enc.Utf8);
    } catch (err) {

    }
    return result;
  }

  setLoanRequestId(loanRequestId) {

    this.loanRequestId = loanRequestId;

  }

  setLoanPercentageValues(loanPercentageValues) {

    this.loanPercentageValues = loanPercentageValues;

  }

  setStatusCode(statusCode) {

    this.statusCode = statusCode;

  }

  setCommentsFrom(commentsFrom) {

    this.commentsFrom = commentsFrom;

  }

  setCommentArray(commentArray) {

    this.commentArray = commentArray;

    this.setCommentArrayExists(true);

  }

  setCommentArrayExists(commentArrayExists) {

    this.commentArrayExists = commentArrayExists;

  }

  setLoanArray(loanArray) {

    this.loanArray = loanArray;

  }

  setmyLoanCurrentProjectName(myLoanCurrentProjectName) {

    this.myLoanCurrentProjectName = myLoanCurrentProjectName;

  }

  setmyLoanCurrentLoanIdName(myLoanCurrentLoanIdName) {

    this.myLoanCurrentLoanIdName = myLoanCurrentLoanIdName;

  }

  setmyLoanCurrentProjectId(myLoanCurrentProjectId) {

    this.myLoanCurrentProjectId = myLoanCurrentProjectId;

  }

  setmyLoanCurrentLoanId(myLoanCurrentLoanId) {

    this.myLoanCurrentLoanId = myLoanCurrentLoanId;

  }
  setmyLoanCurrentClaimId(myLoanCurrentClaimId){

    this.setmyLoanCurrentClaimId=myLoanCurrentClaimId;
  }
  setmyLoanCurrentProjectFinPlanId(myLoanCurrentProjectFinPlanId) {

    this.myLoanCurrentProjectFinPlanId = myLoanCurrentProjectFinPlanId;

  }

  setmyLoanCurrentLoanSentRequestId(myLoanCurrentLoanSendRequestId) {

    this.myLoanCurrentLoanSendRequestId = myLoanCurrentLoanSendRequestId;

  }

  setLoanDropdowns(loanDropdowns) {

    this.loanDropdowns = loanDropdowns;

  }

  setAgreementDropdowns(agreementDropdowns) {

    this.agreementDropdowns = agreementDropdowns;

  }

  setCommunication(comm, index) {

    this.communication = comm;
    this.selectedIndex = index;

  }

  setLanLoanRequestStatus(LandLoanRequestStatus) {
    this.LandLoanRequestStatus = LandLoanRequestStatus;
  }

  setLandLoanRequestLastStatus(LandLoanLastStatusId) {
    this.LandLoanRequestLastStatus = LandLoanLastStatusId
  }

  setLandLoanRequestProjectId(LandLoanProjectId) {
    this.LandLoanRequestProjectId = LandLoanProjectId;
  }

  setPreliminaryRequestStatus(PreliminaryRequestStatus) {
    this.PreliminaryRequestStatus = PreliminaryRequestStatus;
  }
  setPreliminaryRequestLastStatus(LastStatusId) {
    this.PreliminaryRequestLastStatus = LastStatusId
  }
  SetPreliminaryRequestNumber(PreliminaryNumber) {
    this.PreliminaryRequestNumber = PreliminaryNumber;
  }
  setRCYLoanNumber(loanRequestNumber) {
    this.RCYLoanNumber = loanRequestNumber
  }

  setSysuserServiceId(SysuserServiceId) {
    this.RCYSysuserServiceId = SysuserServiceId;
  }
  setRCYPreliminaryRequest(RCYPreliminaryRequestNumber) {
    this.RCYPreliminaryRequestNumber = RCYPreliminaryRequestNumber;
  }
}
