import { Component, OnInit, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupOtpModalComponent } from "./signup-otp-modal/signup-otp-modal.component";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticateService } from "../../services/authenticate.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CustomValidationService } from "../../services/custom-validation.service";
import { CommonService } from '../../services/common.service';
import { CommunicationsService } from "../../services/communications.service";
import {TranslateService} from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { CustomerProfileService } from '../../services/customer-profile.service'; 
import { NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n, NgbModule } from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
// const MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
//   'ذو القعدة', 'ذو الحجة'];
const MONTHS = ['Muharram', 'Safar',"Rabi' I","Rabi' al Thani", 'Jumada I', 'Jumada al-akhir', 'Rajab', "Sha'aban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", "Dhu al-Hijjah"];


@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {

  getWeekdayShortName(weekday: number) {
    return WEEKDAYS[weekday - 1];
  }

  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicI18n }
  ]
})

export class SignupComponent implements OnInit {


  //@ViewChild('hjValidityDate') hjValidityDate:HijriCustomComponent;
  showRegisterationForm:boolean = false;
  isRegisteredUser = '';
  textOrPassword = "password";
  footerYear = 0;
  signUpResponse: any = {};
  signUpFinalResponse: any = {};
  documentuploadresponse: any = {};
  signUpPhoneEmailOTPResponse: any = {};
  nationalityId: any;
  nationalOrIqamaId = "N";
  typeofnationality: string;
  consutancyCrNumb: "N";
  consutancyCrDate: string = "N";
  passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$";
  emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;//"^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  passportPattern = /^[a-zA-Z][a-zA-Z0-9]{7}/;
  spanClickcount = 0;
  modalReference: any = [];
  disabledAgreement: boolean = true;
  isExistingCustomer: boolean = false;
  next1 = false;
  countryList = [];
  selectedCountry = "";
  selectedType = "E";
  selectedcommType = "A";
  type_of_url = "";
  type_of_url_array = [];
  shareholderNameList = [];
  selectedShareholderName = "";
  files: any = [];
  selectedlang = "ar";
  hresend: boolean = true;

  hprogress: boolean = true;
  strength = 0;

  timeLeft: number = 300;
  timeLeftformat = 'OTP expires in 5 min';
  interval;
  firstStep: boolean = true;
  secondStep: boolean = false;
  thirdStep: boolean = false;
  fourthStep: boolean = false;
  fifthStep: boolean = false;


  // FOR RADIO BUTTON 
  hIsResidentHidden: boolean = false;
  hIsForeignInvestorHidden: boolean = true;
  hIsGccHidden: boolean = true;
  hIsNationalId: boolean = false;
  hIsIqamaId: boolean = true;

  // FOR FOREIGN INVESTOR DROPDOWN

  hIsForeignInvestorDropdown: boolean = true;

  // FOR PASSPORT IN GCC

  hIsGccNationalPassportInfo: boolean = true;

  //FOR CONSULTANCY FIELDS

  hIsConsultancy: boolean = true;

  //FOR STEPS OF CONTROL
  hIsStep1: boolean = false;
  hIsStep2: boolean = true;
  hIsStep3: boolean = true;
  hIsStep4: boolean = true;
  hIsStep5: boolean = true;

  isS1Active: boolean = true;
  isS2Active: boolean = false;
  isS3Active: boolean = false;
  isS4Active: boolean = false;
  isS5Active: boolean = false;

  step1Shift = new FormGroup({
    radiosStep1: new FormControl('ResidentCitizen'),


  });

  s11FormGroup: FormGroup;
  s12FormGroup: FormGroup;
  s13FormGroup: FormGroup;
  s2FormGroup: FormGroup;
  s3FormGroup: FormGroup;
  s4FormGroup: FormGroup;
  s5FormGroup: FormGroup;


  constructor(private fb: FormBuilder, private calendar: NgbCalendar, private commonService: CommonService, private idval: CustomValidationService, private modalService: NgbModal, private toastr: ToastrService,
    private route: ActivatedRoute, private authenticateService: AuthenticateService, private router: Router, private spinnerService: Ng4LoadingSpinnerService, private communicationsService: CommunicationsService,
    private translate: TranslateService,protected localStorage: LocalStorage, private directionService: NbLayoutDirectionService, private customerProfileService: CustomerProfileService) {
  
      this.minDate={year:this.calendar.getToday().year-100, month:1,day:1};
      this.maxDate={year:this.calendar.getToday().year+20, month:12,day:31};

      // this language will be used as a fallback when a translation isn't found in the current language
     this.translate.addLangs(['en','ar']);
     this.translate.setDefaultLang('ar');
     
    
    }

  minDate:NgbDateStruct;
  maxDate:NgbDateStruct;

  ngOnInit() {


    //Controls for all forms

    // this.route.params.subscribe(params => {
    //   console.log(params) //log the entire params object
    //   console.log(params['id']) //log the value of id
    // });

    this.route.params.subscribe(params => {
      this.type_of_url = params['id'];
      this.type_of_url_array = this.type_of_url.split('$');
      //this.normalorCrm = params['id'] ; //log the value of id
      // console.log(this.type_of_url_array);
    });

    var curDate = new Date();
    var footerYear1 = curDate.getFullYear();
    this.footerYear = footerYear1;

    this.s11FormGroup = this.fb.group({

      nationalId: ['', [Validators.required, this.idval.idValidator(10)]],
      radiosStep11: new FormControl('NationalId'),
      nationalIdDob: ['', Validators.required],
      consultancyName: ['', Validators.required],
      crNumber: ['', [Validators.required, this.idval.idValidator(10)]],
      crExpiry: ['', Validators.required],
    });

    this.s12FormGroup = this.fb.group({

      sagiaId: ['', [Validators.required, this.idval.idValidator2(9, 16)]],
      sagiaIdValidity: ['', Validators.required],
      consultancyName: ['', Validators.required],
      crNumber: ['', [Validators.required, this.idval.idValidator(10)]],
      crExpiry: ['', Validators.required],
    });

    this.s13FormGroup = this.fb.group({

      gccNationalId: ['', [Validators.required, this.idval.idValidator(10)]],
      gccNationalIdProof: ['', Validators.required],
      consultancyName: ['', Validators.required],
      crNumber: ['', [Validators.required, this.idval.idValidator(10)]],
      crExpiry: ['', Validators.required],
    });

    this.s2FormGroup = this.fb.group({

      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      telephoneNumberCode: ['+966', Validators.required],
      telephoneNumber: ['', Validators.required],
      firstNameEng: ['', Validators.required],
      middleNameEng: ['', Validators.required],
      lastNameEng: ['', Validators.required],
      passportNumber: ['', [Validators.required, Validators.pattern(this.passportPattern)]],
      passportExpiry: ['', Validators.required]

    });

    this.s3FormGroup = this.fb.group({

      buildingNumber: ['', Validators.required],
      unitNumber: ['', Validators.required],
      additionalNumber: [''],
      street: ['', Validators.required],
      neighbourhood: [''],
      city: ['', Validators.required],
      zipCode: ['', Validators.required]


    });

    this.s4FormGroup = this.fb.group({


      phoneOtp: ['', Validators.required],
      emailOtp: ['', Validators.required]


    });

    this.s5FormGroup = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });

    this.getCountryList();
    this.s11FormGroup.value.nationalIdDob = this.calendar.getToday();
   // this.onLangChange(this.selectedlang);
    if (this.customerProfileService.signUpUserType === 'E') {
      this.isExistingCustomer = true;
      this.s11FormGroup.controls['nationalId'].setValue(this.customerProfileService.loginCurrentUserId);
      const year = parseInt(this.customerProfileService.loginCurrentDate.slice(0, 4));
      const month = parseInt(this.customerProfileService.loginCurrentDate.slice(4, 6));
      const day = parseInt(this.customerProfileService.loginCurrentDate.slice(6, 8));
      this.s11FormGroup.controls['nationalIdDob'].setValue({ year: year, month: month, day: day });
    }
  }

  get residentCitizenData() {
    return this.s11FormGroup.controls;
  }

  get foreignInvestorData() {
    return this.s12FormGroup.controls;
  }

  get gccNationalData() {
    return this.s13FormGroup.controls;
  }
  get step2Data() {
    return this.s2FormGroup.controls;
  }

  get step3Data() {
    return this.s3FormGroup.controls;
  }

  get step4Data() {
    return this.s4FormGroup.controls;
  }

  get step5Data() {
    return this.s5FormGroup.controls;
  }

  //Function for only number to be typed

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  onlyArabic(event) {

    if (!/^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/.test((event.target.value.replace(/ /g,'')))) {
      event.target.value = '';
      this.showFailureToast(this.translate.instant('SIGNUP.OnlyArbictextcanbeEntered'));
    }
  }

  onlyEnglish(event) {

    if (!/^[A-Za-z_ ]+$/.test((event.target.value))) {
      event.target.value = '';
      this.showFailureToast(this.translate.instant('SIGNUP.OnlyEnglishtextcanbeEntered'));
    }
  }


  ValidateAlpha(evt) : boolean{
        const charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 123) &&
        (charCode !== 32) && (charCode > 0x0600 || charCode < 0x06FF)) {
        return false;
         }
            return true;
    }

  onKey(event) {
    let DobVal = event;
    if (DobVal.length === 4 || DobVal.length === 7) {
      this.s11FormGroup.controls['nationalIdDob'].setValue(DobVal + '/');
    }
  }

  OnPasswordToggle() {
    if (this.textOrPassword == "password") {
      this.textOrPassword = "text";
    }
    else {
      this.textOrPassword = "password";
    }
  }

  getCountryList() {
    this.authenticateService
      .signUpCountryList()
      .then((countryList: any) => (this.countryList = countryList.Countries), err => console.log(err));

  }

  // For the span click 

  onFirstSpanClick(event) {
    {

      if (this.spanClickcount === 1) {

        this.modalReference = this.modalService.open(event, { backdrop: 'static', size: 'sm' });

      }

      //  this.showSuccessToast("MCI Details retrieved successfully !");

    }

  }

  onSecondSpanClick(event) {
    if (this.secondStep) {
      this.hIsStep1 = true;
      this.hIsStep2 = false;
      this.hIsStep3 = true;
      this.hIsStep4 = true;
      this.hIsStep5 = true;
      this.isS1Active = false; this.isS2Active = true;
      this.isS3Active = false; this.isS4Active = false;
      this.isS5Active = false;


    }



  }

  onThirdSpanClick(event) {
    if (this.thirdStep) {
      this.hIsStep1 = true;
      this.hIsStep2 = true;
      this.hIsStep3 = false;
      this.hIsStep4 = true;
      this.hIsStep5 = true;
      this.isS1Active = false; this.isS2Active = false;
      this.isS3Active = true; this.isS4Active = false;
      this.isS5Active = false;


    }

  }

  onFourthSpanClick(event) {
    if (this.fourthStep) {
      this.hIsStep1 = true;
      this.hIsStep2 = true;
      this.hIsStep3 = true;
      this.hIsStep4 = false;
      this.hIsStep5 = true;
      this.isS1Active = false; this.isS2Active = false;
      this.isS3Active = false; this.isS4Active = true;
      this.isS5Active = false;


    }

  }

  onFifthSpanClick(event) {
    if (this.fifthStep) {
      this.hIsStep1 = true;
      this.hIsStep2 = true;
      this.hIsStep3 = true;
      this.hIsStep4 = true;
      this.hIsStep5 = false;
      this.isS1Active = false; this.isS2Active = false;
      this.isS3Active = false; this.isS4Active = false;
      this.isS5Active = true;

    }

  }

  // End of the span click

  // Controls for radio button

  onChangeradio(event) {
    //  alert(event.target.id);
    if (event.target.id == "radioResidentCitizen") {
      this.s12FormGroup.reset();
      this.s13FormGroup.reset();
      this.hIsResidentHidden = false;
      this.hIsForeignInvestorHidden = true;
      this.hIsGccHidden = true;
      if (this.selectedType === "C")
        this.hIsConsultancy = false;
      else
        this.hIsConsultancy = true;
    }
    else if (event.target.id == "radioForeignInvestor") {
      this.s11FormGroup.reset();
      this.s13FormGroup.reset();
      this.hIsResidentHidden = true;
      this.hIsForeignInvestorHidden = false;
      this.hIsGccHidden = true;
      if (this.selectedType === "C")
        this.hIsConsultancy = false;
      else
        this.hIsConsultancy = true;
    }
    else {
      this.s11FormGroup.reset();
      this.s12FormGroup.reset();
      this.hIsResidentHidden = true;
      this.hIsForeignInvestorHidden = true;
      this.hIsGccHidden = false;
      if (this.selectedType === "C")
        this.hIsConsultancy = false;
      else
        this.hIsConsultancy = true;
    }

  }

  onChangeradio1(event) {
    //  alert(event.target.id);
    if (event.target.id == "radioNationalId") {

      this.hIsNationalId = false;
      this.hIsIqamaId = true;
      this.nationalOrIqamaId = "N";

    }
    else if (event.target.id == "radioIqamaId") {

      this.hIsNationalId = true;
      this.hIsIqamaId = false;
      this.nationalOrIqamaId = "IQ";

    }
  }

  onChangeType(selectedType) {
    this.selectedType = selectedType;
    if (this.selectedType === "C") {
      this.hIsConsultancy = false;

      this.s11FormGroup.controls['consultancyName'].reset();
      this.s11FormGroup.controls['crNumber'].reset();
      this.s11FormGroup.controls['crExpiry'].reset();

      this.s12FormGroup.controls['consultancyName'].reset();
      this.s12FormGroup.controls['crNumber'].reset();
      this.s12FormGroup.controls['crExpiry'].reset();

      this.s13FormGroup.controls['consultancyName'].reset();
      this.s13FormGroup.controls['crNumber'].reset();
      this.s13FormGroup.controls['crExpiry'].reset();
    }
    else {
      this.hIsConsultancy = true;

      this.s11FormGroup.controls['consultancyName'].reset();
      this.s11FormGroup.controls['crNumber'].reset();
      this.s11FormGroup.controls['crExpiry'].reset();

      this.s12FormGroup.controls['consultancyName'].reset();
      this.s12FormGroup.controls['crNumber'].reset();
      this.s12FormGroup.controls['crExpiry'].reset();

      this.s13FormGroup.controls['consultancyName'].reset();
      this.s13FormGroup.controls['crNumber'].reset();
      this.s13FormGroup.controls['crExpiry'].reset();
    }
  }

  onChangeType1(selectedcommType){
    this.selectedcommType = selectedcommType;
  }

  leftPad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }





  // End of Controls for radio button

  // Start of Controls for Next and Previous button
  //STEP 1
  onFirstPreClick(event) {

    //alert(JSON.stringify(this.s11FormGroup.value.nationalIdDob));

    this.router.navigateByUrl("/login");

  }
  onFirstNextClick(event) {

    // alert(this.s12FormGroup.value.sagiaIdValidity.replace(/-/g,""));
    // console.log(this.);
    if (this.step1Shift.get('radiosStep1').value == "ResidentCitizen") {
      this.next1 = true;
      this.hIsForeignInvestorDropdown = true;
      this.hIsGccNationalPassportInfo = true;
      this.s2FormGroup.controls['telephoneNumberCode'].setValue("+966");
      this.nationalityId = this.s11FormGroup.value.nationalId;
      this.typeofnationality = "SAUDI";
      this.selectedCountry = "SA";
      var dobnatid: string = "" + this.s11FormGroup.value.nationalIdDob.year + this.leftPad(this.s11FormGroup.value.nationalIdDob.month, 2) + this.leftPad(this.s11FormGroup.value.nationalIdDob.day, 2);

      if (this.hIsConsultancy === true) {
        this.s11FormGroup.controls.consultancyName.setErrors(null);
        this.s11FormGroup.controls.crNumber.setErrors(null);
        this.s11FormGroup.controls.crExpiry.setErrors(null);
        this.consutancyCrNumb = "N";
        this.consutancyCrDate = "N";

      }
      else {

        var crvalidity: string = "" + this.s11FormGroup.value.crExpiry.year + this.leftPad(this.s11FormGroup.value.crExpiry.month, 2) + this.leftPad(this.s11FormGroup.value.crExpiry.day, 2);

        this.consutancyCrNumb = this.s11FormGroup.value.crNumber;
        this.consutancyCrDate = crvalidity;
      }

      if (this.s11FormGroup.invalid) {

        return true;
      }
      else {
        
        this.spinnerService.show();
        let data = {
          nationalityId: this.s11FormGroup.value.nationalId,
          typeofnationality: this.typeofnationality,
          action: "SENDOTP",
          otp_gen: "N",
          otp_ver: "N",
          wasselcall: "N",
          signupPhoneOTP: "N",
          emailId: "N",
          nationalityIdDob: "N",
          licNum: "N",
          licVal: "N",
          usrId: "N",
          crnumber: this.consutancyCrNumb,
          date: this.consutancyCrDate
        }
        // console.log(data);

        if (this.s11FormGroup.value.nationalId != "") {

          this.authenticateService.validateSignUp(data).then(res => {

            this.signUpResponse = res;

            //console.log(this.signUpResponse.ReqMess.length);  

            if (this.signUpResponse.ReqMess[0].MessType == 'S') {

              this.spinnerService.hide();
              this.showSuccessToast(this.signUpResponse.ReqMess[0].MessText);
              //var dob:string=this.s11FormGroup.value.nationalIdDob;
              let signupotpModalParams = {

                header:  this.translate.instant('SIGNUP.OTPVerification'),
                method: "nicotp",
                nationalityId: this.s11FormGroup.value.nationalId,
                typeofnationality: this.typeofnationality,
                action: "NICVEROTP",
                nationalityIdDob: dobnatid,
                usrId: this.nationalOrIqamaId,

                inputs: [
                  {
                    id: "nidOtp",
                    name: "",
                    type: "password",
                    value: "",
                    required: "true",
                  }
                ],
                buttons: [
                  {
                    name: "Submit",
                    type: "Submit",
                    action : 1 ,

                    handler: (valid, data) => {

                      //console.log(data);

                      this.next1 = true;
                      if (valid == true) {

                        //console.log (JSON.stringify(this.s11FormGroup.value));
                        //console.log(data);

                        this.spanClickcount = 1;
                        this.next1 = false;
                        this.hIsStep1 = true;
                        this.hIsStep2 = false;

                        this.secondStep = true;

                        this.isS1Active = false;
                        // data.BasicData = []
                        // data.AddressData =  [];
                        // data.AddressData[0] ={
                        //   BuildNo: '',
                        //   UnitNo: '',
                        //   AddNo: '',
                        //   Street:'',
                        //   Neighbour: '',
                        //   City: '',
                        //   Zip: ''
                        // } 
                        // data.BasicData[0] = {
                        //   FirstName: 'دانيه',
                        //   MiddleName: 'عبدالله',
                        //   LastName: 'الدوسري',
                        //   Email : '',
                        //   PhoneNumber: ''                         
                        // }
                        this.isS2Active = true;
                        {
                          if (data.BasicData[0].FirstName != undefined)
                            this.s2FormGroup.controls['firstName'].setValue(data.BasicData[0].FirstName);

                          if (data.BasicData[0].MiddleName != undefined)
                            this.s2FormGroup.controls['middleName'].setValue(data.BasicData[0].MiddleName);

                          if (data.BasicData[0].LastName != undefined)
                            this.s2FormGroup.controls['lastName'].setValue(data.BasicData[0].LastName);

                            if (data.BasicData[0].FirstNameEn !== undefined)
                            this.s2FormGroup.controls['firstNameEng'].setValue(data.BasicData[0].FirstNameEn);

                          if (data.BasicData[0].MiddleNameEn !== undefined)
                            this.s2FormGroup.controls['middleNameEng'].setValue(data.BasicData[0].MiddleNameEn);

                          if (data.BasicData[0].LastNameEn !== undefined)
                            this.s2FormGroup.controls['lastNameEng'].setValue(data.BasicData[0].LastNameEn);
                          if (data.BasicData[0].Email != undefined)
                            this.s2FormGroup.controls['emailId'].setValue(data.BasicData[0].Email);

                          if (data.BasicData[0].PhoneNumber != undefined)
                            this.s2FormGroup.controls['telephoneNumber'].setValue(data.BasicData[0].PhoneNumber);

                          // -------------------------------------

                          if (data.AddressData[0].BuildNo != undefined)
                            this.s3FormGroup.controls['buildingNumber'].setValue(data.AddressData[0].BuildNo);

                          if (data.AddressData[0].UnitNo != undefined)
                            this.s3FormGroup.controls['unitNumber'].setValue(data.AddressData[0].UnitNo);

                          if (data.AddressData[0].AddNo != undefined)
                            this.s3FormGroup.controls['additionalNumber'].setValue(data.AddressData[0].AddNo);

                          if (data.AddressData[0].Street != undefined)
                            this.s3FormGroup.controls['street'].setValue(data.AddressData[0].Street);

                          if (data.AddressData[0].Neighbour != undefined)
                            this.s3FormGroup.controls['neighbourhood'].setValue(data.AddressData[0].Neighbour);

                          if (data.AddressData[0].City != undefined)
                            this.s3FormGroup.controls['city'].setValue(data.AddressData[0].City);

                          if (data.AddressData[0].Zip != undefined)
                            this.s3FormGroup.controls['zipCode'].setValue(data.AddressData[0].Zip);

                        }
                        //this.spinnerService.hide();
                      }


                    }
                  }
                ]
              };

              let signupotpModal = this.modalService.open(SignupOtpModalComponent, { size: 'sm', backdrop: 'static' });
              signupotpModal.componentInstance.SignupOtpModalForm = signupotpModalParams;

            }
            else {
              this.spinnerService.hide();
              this.showFailureToast(this.signUpResponse.ReqMess[0].MessText);
              //console.log(this.signUpResponse.ReqMess[0].MessText);
            }

          });
        }


      }



    }

    else if (this.step1Shift.get('radiosStep1').value == "ForeignInvestor") {
      this.next1 = true;
      this.nationalityId = this.s12FormGroup.value.sagiaId;
      this.typeofnationality = "SAGIA";
      this.s2FormGroup.controls['telephoneNumberCode'].setValue("+966");
      this.hIsGccNationalPassportInfo = true;

      const tt = new Date(this.s12FormGroup.value.sagiaIdValidity);
      const month = tt.getMonth() + 1;
      const year = tt.getFullYear();
      const day = tt.getDate();

      var sagiaIdValidityDatesend: string = "" + year + this.leftPad(month, 2) + this.leftPad(day, 2);

      if (this.hIsConsultancy === true) {
        this.s12FormGroup.controls.consultancyName.setErrors(null);
        this.s12FormGroup.controls.crNumber.setErrors(null);
        this.s12FormGroup.controls.crExpiry.setErrors(null);
        this.consutancyCrNumb = "N";
        this.consutancyCrDate = "N";

      }
      else {

        var crvalidity: string = "" + this.s12FormGroup.value.crExpiry.year + this.leftPad(this.s12FormGroup.value.crExpiry.month, 2) + this.leftPad(this.s12FormGroup.value.crExpiry.day, 2);

        this.consutancyCrNumb = this.s12FormGroup.value.crNumber;
        this.consutancyCrDate = crvalidity;
      }

      if (this.s12FormGroup.invalid) {

        return true;
      }
      else {
        this.hIsForeignInvestorDropdown = false;
        this.spinnerService.show();
        let data = {
          nationalityId: this.nationalityId,
          typeofnationality: this.typeofnationality,
          action: "SAGIADATA",
          otp_gen: "N",
          otp_ver: "N",
          wasselcall: "N",
          signupPhoneOTP: "N",
          emailId: "N",
          nationalityIdDob: sagiaIdValidityDatesend,
          licNum: "N",
          licVal: "N",
          usrId: "N",
          crnumber: this.consutancyCrNumb,
          date: this.consutancyCrDate
        }
        if (this.s12FormGroup.value.sagiaId != "") {

          //console.log(data);
          this.authenticateService.validateSignUp(data).then(res => {
            this.signUpResponse = res;

             //console.log(this.signUpResponse);
            if (this.signUpResponse.ReqMess[0].MessType == 'S') {

              if (Object.keys(this.signUpResponse).length === 5 && Object.keys(this.signUpResponse.RegShareHolder).length != 0) {

                this.shareholderNameList = this.signUpResponse.RegShareHolder;
                this.selectedShareholderName = this.signUpResponse.RegShareHolder[0].FullName;

              }
              else {
                this.selectedShareholderName = "No ShareHolders";
              }

              this.showSuccessToast(this.signUpResponse.ReqMess[0].MessText);
              this.spanClickcount = 1;
              this.next1 = false;
              this.hIsStep1 = true;
              this.hIsStep2 = false;

              this.secondStep = true;

              this.secondStep = true;

              this.isS1Active = false;
              this.isS2Active = true;

              if (this.signUpResponse.BasicData[0].FirstName != undefined)
                this.s2FormGroup.controls['firstName'].setValue(this.signUpResponse.BasicData[0].FirstName);

              if (this.signUpResponse.BasicData[0].MiddleName != undefined)
                this.s2FormGroup.controls['middleName'].setValue(this.signUpResponse.BasicData[0].MiddleName);

              if (this.signUpResponse.BasicData[0].LastName != undefined)
                this.s2FormGroup.controls['lastName'].setValue(this.signUpResponse.BasicData[0].LastName);

              if (this.signUpResponse.BasicData[0].Email != undefined)
                this.s2FormGroup.controls['emailId'].setValue(this.signUpResponse.BasicData[0].Email);

              if (this.signUpResponse.BasicData[0].PhoneNumber != undefined)
                this.s2FormGroup.controls['telephoneNumber'].setValue(this.signUpResponse.BasicData[0].PhoneNumber)

              // -----------------------------------------------------

              if (this.signUpResponse.AddressData[0].BuildNo != undefined)
                this.s3FormGroup.controls['buildingNumber'].setValue(this.signUpResponse.AddressData[0].BuildNo);

              if (this.signUpResponse.AddressData[0].UnitNo != undefined)
                this.s3FormGroup.controls['unitNumber'].setValue(this.signUpResponse.AddressData[0].UnitNo);

              if (this.signUpResponse.AddressData[0].AddNo != undefined)
                this.s3FormGroup.controls['additionalNumber'].setValue(this.signUpResponse.AddressData[0].AddNo);

              if (this.signUpResponse.AddressData[0].Street != undefined)
                this.s3FormGroup.controls['street'].setValue(this.signUpResponse.AddressData[0].Street);

              if (this.signUpResponse.AddressData[0].Neighbour != undefined)
                this.s3FormGroup.controls['neighbourhood'].setValue(this.signUpResponse.AddressData[0].Neighbour);

              if (this.signUpResponse.AddressData[0].City != undefined)
                this.s3FormGroup.controls['city'].setValue(this.signUpResponse.AddressData[0].City);

              if (this.signUpResponse.AddressData[0].Zip != undefined)
                this.s3FormGroup.controls['zipCode'].setValue(this.signUpResponse.AddressData[0].Zip);

              this.spinnerService.hide();

            }
            else {
              this.spinnerService.hide();
              this.showFailureToast(this.signUpResponse.ReqMess[0].MessText);
            }

          });
        }

      }

    }
    else if (this.step1Shift.get('radiosStep1').value == "GCCNational") {
      this.hIsForeignInvestorDropdown = true;
      this.hIsGccNationalPassportInfo = false;
      this.nationalityId = this.s13FormGroup.value.gccNationalId;
      this.typeofnationality = "GCC";
      this.s2FormGroup.controls['telephoneNumberCode'].setValue("+966");
      this.next1 = true;

      if (this.hIsConsultancy === true) {
        this.s13FormGroup.controls.consultancyName.setErrors(null);
        this.s13FormGroup.controls.crNumber.setErrors(null);
        this.s13FormGroup.controls.crExpiry.setErrors(null);
        this.consutancyCrNumb = "N";
        this.consutancyCrDate = "N";

      }
      //console.log(this.s13FormGroup.value.gccNationalIdProof);

      if (this.s13FormGroup.invalid) {

        return true;

      }
      else {
        if (this.selectedType === "C") {

          this.consutancyCrNumb = this.s13FormGroup.value.crNumber;

          var crvalidity: string = "" + this.s13FormGroup.value.crExpiry.year + this.leftPad(this.s13FormGroup.value.crExpiry.month, 2) + this.leftPad(this.s13FormGroup.value.crExpiry.day, 2);
          this.consutancyCrDate = crvalidity;
        }

          this.spinnerService.show();

          let data = {
            nationalityId: this.s13FormGroup.value.gccNationalId,
            typeofnationality: this.typeofnationality,
            action: "N",
            otp_gen: "N",
            otp_ver: "N",
            wasselcall: "N",
            signupPhoneOTP: "N",
            emailId: "N",
            nationalityIdDob: "N",
            licNum: "N",
            licVal: "N",
            usrId: "N",
            crnumber: this.consutancyCrNumb,
            date: this.consutancyCrDate
          }

          //console.log(data);

          if (this.s13FormGroup.value.gccNationalId != "") {

            this.authenticateService.validateSignUp(data).then(res => {
              //console.log(res);
              this.signUpResponse = res;
              if(this.signUpResponse.ReqMess)
              if (this.signUpResponse.ReqMess[0].MessType == 'S') {

                this.spinnerService.hide();
                //this.showSuccessToast(this.signUpResponse.ReqMess[0].MessText);

                this.spanClickcount = 1;
                this.next1 = false;
                this.hIsStep1 = true;
                this.hIsStep2 = false;

                this.secondStep = true;

                this.secondStep = true;

                this.isS1Active = false;
                this.isS2Active = true;
        
              }
              else {
                this.spinnerService.hide();
                this.showFailureToast(this.signUpResponse.ReqMess[0].MessText);
                //console.log(this.signUpResponse.ReqMess[0].MessText);
              }

            });
          }

        }
      
    }


  }

  //STEP 2
  onSecondPreClick(event) {

    if (this.spanClickcount == 1) {

      this.modalReference = this.modalService.open(event, { backdrop: 'static', size: 'sm' });

    }

  }

  onSecondNextClick(event) {
    console.log(event);
    this.next1 = true;


    if (this.step1Shift.get('radiosStep1').value != "GCCNational") {

      this.s2FormGroup.controls.passportNumber.setErrors(null);
      this.s2FormGroup.controls.passportExpiry.setErrors(null);

    }
    //console.log(this.s2FormGroup);
    if (this.s2FormGroup.invalid) {
      return true;
    }
    else {
      if (this.s2FormGroup.value.telephoneNumberCode.search('966') != -1) {
        if (this.s2FormGroup.value.telephoneNumber.search('5') != 0) {
          this.showFailureToast(this.translate.instant('SIGNUP.validMobile'));
          return true;
        }
      }
     
      if (this.step1Shift.get('radiosStep1').value === "GCCNational") {
        const passportvaliditydate = new Date(this.s2FormGroup.value.passportExpiry);
        const currentDate = new Date();
        if (passportvaliditydate <= currentDate ) {
          this.showFailureToast('Please enter the valid Passport Expiry Date');
          return true;
        }
      }
      // if(this.step1Shift.get('radiosStep1').value == "ResidentCitizen")
      this.selectedCountry = "SA";
      //console.log(JSON.stringify(this.s11FormGroup.value) + JSON.stringify(this.s2FormGroup.value));
      this.next1 = false;
      this.hIsStep2 = true;
      this.hIsStep3 = false;

      this.thirdStep = true;

      this.isS2Active = false;
      this.isS3Active = true;
    }
  }

  //STEP 3
  onThirdPreClick(event) {
    this.hIsStep2 = false;
    this.hIsStep3 = true;

    this.isS2Active = true;
    this.isS3Active = false;


  }
  onThirdNextClick(event) {
    this.next1 = true;
    if (this.s3FormGroup.invalid) {
      return true;
    } else if (this.selectedCountry === '') {
      this.showFailureToast( this.translate.instant("SIGNUP.validCountry"));
      return true;
    }
      else
      {
        if(this.selectedCountry === 'SA' || this.selectedCountry === 'KW' || this.selectedCountry === 'AE' || this.selectedCountry === 'BH' || this.selectedCountry === 'QA')
        {
          if(parseInt(this.s3FormGroup.value.zipCode).toString().length != 5){
            this.showFailureToast( this.translate.instant("SIGNUP.validZip"));
            return true;
          }
        }
      this.spinnerService.show();
      var telephoneNumber = this.s2FormGroup.value.telephoneNumber.replace(/^0+/, '');
      // Code for generating phone and email OTP
      let data = {
        nationalityId: this.nationalityId,
        typeofnationality: "SAUDI",
        action: "SENDGENOTP",
        otp_gen: "N",
        otp_ver: "N",
        wasselcall: "N",
        signupPhoneOTP: this.s2FormGroup.value.telephoneNumberCode + "" + telephoneNumber,
        emailId: this.s2FormGroup.value.emailId,
        nationalityIdDob: "N",
        licNum: "N",
        licVal: "N",
        usrId: "N",
        crnumber: "N",
        date: "N"
      }
      if (this.s2FormGroup.value.emailId != "") {
        this.authenticateService.validateSignUp(data).then(res => {
          this.signUpPhoneEmailOTPResponse = res;
          //console.log(this.signUpPhoneEmailOTPResponse)
          if (this.signUpPhoneEmailOTPResponse.ReqMess[0].MessType == 'S') {
            this.spinnerService.hide();
            this.showSuccessToast(this.signUpPhoneEmailOTPResponse.ReqMess[0].MessText);
            this.hIsStep3 = true;
            this.hIsStep4 = false;

            this.fourthStep = true;

            this.isS3Active = false;
            this.isS4Active = true;
            this.next1 = false;
            //console.log(this.selectedCountry);
          }
          else {
            this.spinnerService.hide();
            this.showFailureToast(this.signUpPhoneEmailOTPResponse.ReqMess[0].MessText);
          }

        });
      }
    }
  }


  


  //STEP 4
  onFourthPreClick(event) {

    this.s4FormGroup.reset();
    this.s5FormGroup.reset();
    this.hIsStep3 = false;
    this.hIsStep4 = true;

    this.isS3Active = true;
    this.isS4Active = false;

  }

  onFourthNextClick(event) {

    this.next1 = true;
    if (this.s4FormGroup.invalid) {

      return true;
    }
    else {
//start
      this.spinnerService.show();
      //Code for verifying phone and email OTP

      let data = {
        nationalityId: this.nationalityId,
        typeofnationality: "SAUDI",
        action: "NICVEROTP",
        otp_gen: "N",
        otp_ver: "BOTH",
        wasselcall: "N",
        signupPhoneOTP: this.s4FormGroup.value.phoneOtp,
        emailId: this.s4FormGroup.value.emailOtp,
        nationalityIdDob: "N",
        licNum: "N",
        licVal: "N",
        usrId: "N",
        crnumber: "N",
        date: "N"
      }
      //console.log(data)
      if (this.s4FormGroup.value.phoneOtp != "") {
        this.authenticateService.validateSignUp(data).then(res => {
          this.signUpPhoneEmailOTPResponse = res;
          //console.log(this.signUpPhoneEmailOTPResponse)
          if (this.signUpPhoneEmailOTPResponse.ReqMess[0].MessType == 'S') {
            this.spinnerService.hide();
            this.showSuccessToast(this.signUpPhoneEmailOTPResponse.ReqMess[0].MessText);
            this.hIsStep4 = true;
            this.hIsStep5 = false;

            this.fifthStep = true;

            this.isS4Active = false;
            this.isS5Active = true;
            this.next1 = false;
          }
          else {
            this.spinnerService.hide();
            this.showFailureToast(this.signUpPhoneEmailOTPResponse.ReqMess[0].MessText);
          }

        });
      }

//end
    }
  }


  //STEP 5
  onFifthPreClick(event) {
    this.hIsStep4 = false;
    this.hIsStep5 = true;

    this.isS4Active = true;
    this.isS5Active = false;

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.value.password;
    let confirmPass = group.value.confirmPassword;

    return pass === confirmPass ? null : { notSame: true }
  }

  passStrength(event) {

    this.hprogress = false;
    let strnth = 0;


    if (event.target.value.match(/[a-zA-Z][a-zA-Z]+/)) {

      strnth += 1;

    }
    if (event.target.value.match(/[0-9][0-9]+/)) {

      strnth += 1;

    }


    if (event.target.value.match(/[!@$%#^&*()]+/)) {

      strnth += 1;

    }
    if (event.target.value.length >= 8) {

      strnth += 1;

    }


    if (event.target.value.length >= 10) {

      strnth += 1;

    }

    switch (strnth) {

      case 0: { this.strength = 0; }
        break;

      case 1: { this.strength = 20; }
        break;

      case 2: { this.strength = 40; }
        break;

      case 3: { this.strength = 60; }
        break;

      case 4: { this.strength = 80; }
        break;

      case 5: { this.strength = 100; }
        break;


    }



  }

  onFifthSubmitClick(event) {
    //console.log(this.s5FormGroup);
    this.next1 = true;

    if (this.s5FormGroup.invalid) {
      this.showFailureToast(this.translate.instant('SIGNUP.validPassword'));
      return true;
    } else {
      //old to new
      //this.modalReference = this.modalService.open(event, { backdrop: 'static', size: 'lg' });

      //NEW CODE
      

      var tempId = "", tempDob: string = "", tempFile = "", tempCitType = "", tempSagiaVal = "",tempgccprof = "", tempgccid ="";
      var tempPassportNumber = "", tempPassportExpiry = "", tempsagiaid = "", tempnatid = "", tempnatdob = "";
      var tempConsultantName = "", tempCrNumber = "", tempCrExpiry = "", tempselectedtype = "";
      var tempfirstname = "",  tempmiddlename = "",  templastname = "", tempneighbour = "",  tempemail = "", tempzipcode = "";;
      var tempphone = "", tempbno = "",  tempuno = "",  tempano = "",  tempano = "", tempstreet = "", tempCity = "", tempCountry = "";
      var tempfirstnameEng = "", tempmiddlenameEng = "", templastnameEng = "", tempcommtype = "";

      if(this.selectedType === "E")
      {
        if(this.selectedlang === "en")
          tempselectedtype = "Employee";
        else
          tempselectedtype = "موظف";
      }
      else if(this.selectedType === "S")
      {
        if(this.selectedlang === "en")
          tempselectedtype = "Shareholder";
        else
          tempselectedtype = "مساهم";
      }
      else
      {
        if(this.selectedlang === "en")
          tempselectedtype = "Consultancy Company";
        else
          tempselectedtype = "شركة استشارية";
      }

      if(this.selectedcommType === "A")
      {
        if(this.selectedlang === "en")
          tempcommtype = "Arabic";
        else
          tempcommtype = "العربية";
      }
      else
      {
        if(this.selectedlang === "en")
          tempcommtype = "English";
        else
          tempcommtype = "الإنكليزية";
      }

      if (this.step1Shift.get('radiosStep1').value == "ResidentCitizen") {
  
  
        tempnatid = this.s11FormGroup.value.nationalId;

  
        var dobnatid: string = "" + this.s11FormGroup.value.nationalIdDob.year +"/"+ this.leftPad(this.s11FormGroup.value.nationalIdDob.month, 2) +"/"+ this.leftPad(this.s11FormGroup.value.nationalIdDob.day, 2);
        tempDob = dobnatid;

  
        tempfirstname = this.s2FormGroup.value.firstName;
        tempmiddlename = this.s2FormGroup.value.middleName;
        templastname = this.s2FormGroup.value.lastName;
        tempemail = this.s2FormGroup.value.emailId;
        tempphone =this.s2FormGroup.value.telephoneNumberCode + this.s2FormGroup.value.telephoneNumber;
        tempfirstnameEng = this.s2FormGroup.value.firstNameEng;
        tempmiddlenameEng = this.s2FormGroup.value.middleNameEng;
        templastnameEng = this.s2FormGroup.value.lastNameEng;
        tempbno = this.s3FormGroup.value.buildingNumber;
        tempuno = this.s3FormGroup.value.unitNumber;
        tempano = this.s3FormGroup.value.additionalNumber;
        tempneighbour = this.s3FormGroup.value.neighbourhood;
        tempstreet = this.s3FormGroup.value.street;
        tempCity = this.s3FormGroup.value.city;
        tempzipcode = this.s3FormGroup.value.zipCode;
  
        tempCitType = "1";
        if (this.selectedType === "C") {
          var crValidityDate: string = this.consutancyCrDate;
  
          tempConsultantName = this.s11FormGroup.value.consultancyName;
          tempCrNumber = this.s11FormGroup.value.crNumber;
          tempCrExpiry = crValidityDate
        }
  
      }
      else if (this.step1Shift.get('radiosStep1').value == "ForeignInvestor") {

        tempsagiaid = this.s12FormGroup.value.sagiaId;
  
        tempfirstname = this.s2FormGroup.value.firstName;
        tempmiddlename = this.s2FormGroup.value.middleName;
        templastname = this.s2FormGroup.value.lastName;
        tempemail = this.s2FormGroup.value.emailId;
        tempphone =this.s2FormGroup.value.telephoneNumberCode + this.s2FormGroup.value.telephoneNumber;
        tempfirstnameEng = this.s2FormGroup.value.firstNameEng;
        tempmiddlenameEng = this.s2FormGroup.value.middleNameEng;
        templastnameEng = this.s2FormGroup.value.lastNameEng;
        tempbno = this.s3FormGroup.value.buildingNumber;
        tempuno = this.s3FormGroup.value.unitNumber;
        tempano = this.s3FormGroup.value.additionalNumber;
        tempstreet = this.s3FormGroup.value.street;
        tempCity = this.s3FormGroup.value.city;
        tempzipcode = this.s3FormGroup.value.zipCode
  
        const tt = new Date(this.s12FormGroup.value.sagiaIdValidity);
        const month = tt.getMonth() + 1;
        const year = tt.getFullYear();
        const day = tt.getDate();
  
        var sagiaIdValidityDate: string = "" + year +"/"+ this.leftPad(month, 2) +"/"+ this.leftPad(day, 2);
        tempSagiaVal = sagiaIdValidityDate;
  
        tempCitType = "2";
        if (this.selectedType === "C") {
  
          tempConsultantName = this.s12FormGroup.value.consultancyName;
          tempCrNumber = this.s12FormGroup.value.crNumber;
          tempCrExpiry = this.s13FormGroup.value.crExpiry.year +"/"+ this.leftPad(this.s13FormGroup.value.crExpiry.month, 2) +"/"+ this.leftPad(this.s12FormGroup.value.crExpiry.day, 2);
        }
  
      }
      else if (this.step1Shift.get('radiosStep1').value == "GCCNational") {

        tempgccid = this.s13FormGroup.value.gccNationalId;
        tempgccprof = this.s13FormGroup.value.gccNationalIdProof;
  
        tempfirstname = this.s2FormGroup.value.firstName;
        tempmiddlename = this.s2FormGroup.value.middleName;
        templastname = this.s2FormGroup.value.lastName;
        tempemail = this.s2FormGroup.value.emailId;
        tempphone =this.s2FormGroup.value.telephoneNumberCode + this.s2FormGroup.value.telephoneNumber;
        tempfirstnameEng = this.s2FormGroup.value.firstNameEng;
        tempmiddlenameEng = this.s2FormGroup.value.middleNameEng;
        templastnameEng = this.s2FormGroup.value.lastNameEng;
        tempbno = this.s3FormGroup.value.buildingNumber;
        tempuno = this.s3FormGroup.value.unitNumber;
        tempano = this.s3FormGroup.value.additionalNumber;
        tempneighbour = this.s3FormGroup.value.neighbourhood;
        tempstreet = this.s3FormGroup.value.street;
        tempCity = this.s3FormGroup.value.city;
        tempzipcode = this.s3FormGroup.value.zipCode;
        
  
        const tt = new Date(this.s2FormGroup.value.passportExpiry);
        const month = tt.getMonth() + 1;
        const year = tt.getFullYear();
        const day = tt.getDate();
  
        var passportDate: string = year +"/"+ this.leftPad(month, 2) + "/"+this.leftPad(day, 2);
  
        tempPassportNumber = this.s2FormGroup.value.passportNumber;
        tempPassportExpiry = passportDate;
  
        if (this.selectedType === "C") {
    
          tempConsultantName = this.s13FormGroup.value.consultancyName;
          tempCrNumber = this.s13FormGroup.value.crNumber;
          tempCrExpiry = this.s13FormGroup.value.crExpiry.year +"/"+ this.leftPad(this.s13FormGroup.value.crExpiry.month, 2) +"/"+ this.leftPad(this.s13FormGroup.value.crExpiry.day, 2);
        }
  
      }
  
      if (this.selectedlang === "en") {
        let signupotpModalParams = {

          header: "PREVIEW DETAILS",
          method: "previewDetails",


          inputs: [
            {
              id: "national id",
              name: "ID Number",
              value: tempnatid,
            },
            {
              id: "nationaldob",
              name: "Date of Birth",
              value: tempDob,
            },
            {
              id: "sagiaId",
              name: "SAGIA License Number",
              value: tempsagiaid,
            },
            {
              id: "sagiaVali",
              name: "License Validity Date",
              value: tempSagiaVal,
            },
            {
              id: "gccNumber",
              name: "GCC Number ID",
              value: tempgccid,
            },
            {
              id: "idproof",
              name: "ID Proof",
              value: tempgccprof,
            },
            {
              id: "typeofUser",
              name: "Type of User",
              value: tempselectedtype,
            },
            {
              id: "consultancyName",
              name: "Consultancy Name",
              value: tempConsultantName,
            },
            {
              id: "crNumber",
              name: "CR Number",
              value: tempCrNumber,
            },
            {
              id: "CrExpiry",
              name: "CR Expiry",
              value: tempCrExpiry
            },
            {
              id: "firstname",
              name: "First Name",
              value: tempfirstname,
            },
            {
              id: "middlename",
              name: "Middle Name",
              value: tempmiddlename,
            },
            {
              id: "lastname",
              name: "Last Name",
              value: templastname,
            },
            {
              id: "email",
              name: "Email ID",
              value: tempemail,
            },
            {
              id: "telephone",
              name: "Telephone Number",
              value: tempphone,
            },
            {
              id: "firstNameEng",
              name: "First Name (In English)",
              value: tempfirstnameEng,
            },
            {
              id: "middleNameEng",
              name: "Middle Name (In English)",
              value: tempmiddlenameEng,
            },
            {
              id: "lastNameEng",
              name: "Last Name (In English)",
              value: templastnameEng,
            },
            {
              id: "commtype",
              name: "Communication Language",
              value: tempcommtype,
            },
            {
              id: "passportNum",
              name: "Passport Number",
              value: tempPassportNumber,
            },
            {
              id: "passportExpiry",
              name: "Passport Expiry",
              value: tempPassportExpiry,
            },
            {
              id: "buildingNumber",
              name: "Building Number",
              value: tempbno,
            },
            {
              id: "unitNumber",
              name: "Unit Number",
              value: tempuno,
            },
            {
              id: "addntNumber",
              name: "Additional Number",
              value: tempano,
            },
            {
              id: "street",
              name: "Street",
              value: tempstreet,
            },
            {
              id: "neighbourhood",
              name: "Neighbourhood",
              value: tempneighbour,
            },
            {
              id: "city",
              name: "City",
              value: tempCity,
            },
            {
              id: "zipcode",
              name: "Zip Code",
              value: tempzipcode,
            },
          ],
          buttons: [
            {
              name: "Submit",
              type: "Submit",
              action: 2,

              handler: () => {


                this.next1 = true;


                this.modalReference = this.modalService.open(event, { backdrop: 'static', size: 'lg' });

              }
            }
          ]
        };

        let signupotpModal = this.modalService.open(SignupOtpModalComponent, { size: 'lg', backdrop: 'static' });
        signupotpModal.componentInstance.SignupOtpModalForm = signupotpModalParams;
      }
      else{

        let signupotpModalParams = {

          header: "التفاصيل",
          method: "previewDetails",


          inputs: [
            {
              id: "national id",
              name: "رقم معرف",
              value: tempnatid,
            },
            {
              id: "nationaldob",
              name: "تاريخ الولادة",
              value: tempDob,
            },
            {
              id: "sagiaId",
              name: "رقم ترخيص الهي~ة العامة للاستثمار",
              value: tempsagiaid,
            },
            {
              id: "sagiaVali",
              name: "تاريخ صلاحية الترخيص",
              value: tempSagiaVal,
            },
            {
              id: "gccNumber",
              name: "الهوية الوطنية لدول مجلس التعاون الخليجي",
              value: tempgccid,
            },
            {
              id: "idproof",
              name: "اثبات الهوية المدنية",
              value: tempgccprof,
            },
            {
              id: "typeofUser",
              name: "نوع المستخدم",
              value: tempselectedtype,
            },
            {
              id: "consultancyName",
              name: "اسم استشاري",
              value: tempConsultantName,
            },
            {
              id: "crNumber",
              name: "رقم السجل التجاري",
              value: tempCrNumber,
            },
            {
              id: "CrExpiry",
              name: "تاريخ انتهاء السجل التجاري",
              value: tempCrExpiry
            },
            {
              id: "firstname",
              name: "الاسم الاول",
              value: tempfirstname,
            },
            {
              id: "middlename",
              name: "اسم الأب",
              value: tempmiddlename,
            },
            {
              id: "lastname",
              name: "أسم العائلة",
              value: templastname,
            },
            {
              id: "email",
              name: "البريد الإلكتروني",
              value: tempemail,
            },
            {
              id: "telephone",
              name: "رقم الهاتف",
              value: tempphone,
            },
            {
              id: "firstNameEng",
              name: "الاسم الأول باللغة العربية",
              value: tempfirstnameEng,
            },
            {
              id: "middleNameEng",
              name: "الاسم باللغة العربية",
              value: tempmiddlenameEng,
            },
            {
              id: "lastNameEng",
              name: "الاسم الأخير باللغة العربية",
              value: templastnameEng,
            },
            {
              id: "commtype",
              name: "لغة الاتصال",
              value: tempcommtype,
            },
            {
              id: "passportNum",
              name: "رقم جواز السفر",
              value: tempPassportNumber,
            },
            {
              id: "passportExpiry",
              name: "انتهاء صلاحية جواز السفر",
              value: tempPassportExpiry,
            },
            {
              id: "buildingNumber",
              name: "رقم المبنى",
              value: tempbno,
            },
            {
              id: "unitNumber",
              name: "رقم الوحدة",
              value: tempuno,
            },
            {
              id: "addntNumber",
              name: "رقم اضافي",
              value: tempano,
            },
            {
              id: "street",
              name: "الشارع",
              value: tempstreet,
            },
            {
              id: "neighbourhood",
              name: "الحي",
              value: tempneighbour,
            },
            {
              id: "city",
              name: "المدينة",
              value: tempCity,
            },
            {
              id: "zipcode",
              name: "الرمز البريدي",
              value: tempzipcode,
            },
          ],
          buttons: [
            {
              name: "تقديم",
              type: "Submit",
              action: 2,

              handler: () => {


                this.next1 = true;


                this.modalReference = this.modalService.open(event, { backdrop: 'static', size: 'lg' });

              }
            }
          ]
        };

        let signupotpModal = this.modalService.open(SignupOtpModalComponent, { size: 'lg', backdrop: 'static' });
        signupotpModal.componentInstance.SignupOtpModalForm = signupotpModalParams;

      }
    }
  }

  closeModal() {
    this.modalReference.close();
  }

  changeCheckTerms(event) {

    this.disabledAgreement = !event.returnValue;
    // console.log(event.returnValue);
  }


  regSubmit() {

    this.modalReference.close();
    this.spinnerService.show();

    var tempId = "", tempDob: string = "", tempFile = "", tempCitType = "";
    var tempPassportNumber = "", tempPassportExpiry = "";
    var tempConsultantName = "", tempCrNumber = "", tempCrExpiry = "";


    if (this.step1Shift.get('radiosStep1').value == "ResidentCitizen") {


      tempId = this.s11FormGroup.value.nationalId;

      var dobnatid: string = "" + this.s11FormGroup.value.nationalIdDob.year + this.leftPad(this.s11FormGroup.value.nationalIdDob.month, 2) + this.leftPad(this.s11FormGroup.value.nationalIdDob.day, 2);
      tempDob = dobnatid;

      if(this.nationalOrIqamaId === "N")
      tempCitType = "1";
      else
      tempCitType = "4";

      if (this.selectedType === "C") {
        var crValidityDate: string = this.consutancyCrDate;

        tempConsultantName = this.s11FormGroup.value.consultancyName;
        tempCrNumber = this.s11FormGroup.value.crNumber;
        tempCrExpiry = crValidityDate
      }

    }
    else if (this.step1Shift.get('radiosStep1').value == "ForeignInvestor") {

      tempId = this.s12FormGroup.value.sagiaId;

      const tt = new Date(this.s12FormGroup.value.sagiaIdValidity);
      const month = tt.getMonth() + 1;
      const year = tt.getFullYear();
      const day = tt.getDate();

      var sagiaIdValidityDate: string = "" + year + this.leftPad(month, 2) + this.leftPad(day, 2);
      tempDob = sagiaIdValidityDate;

      tempCitType = "2";
      if (this.selectedType === "C") {
        var crValidityDate: string = this.consutancyCrDate;

        tempConsultantName = this.s12FormGroup.value.consultancyName;
        tempCrNumber = this.s12FormGroup.value.crNumber;
        tempCrExpiry = crValidityDate
      }

    }
    else if (this.step1Shift.get('radiosStep1').value == "GCCNational") {


      tempId = this.s13FormGroup.value.gccNationalId;
      tempFile = this.s13FormGroup.value.gccNationalIdProof;
      tempCitType = "3";

      const tt = new Date(this.s2FormGroup.value.passportExpiry);
      const month = tt.getMonth() + 1;
      const year = tt.getFullYear();
      const day = tt.getDate();

      var passportDate: string = "" + year + this.leftPad(month, 2) + this.leftPad(day, 2);

      tempPassportNumber = this.s2FormGroup.value.passportNumber;
      tempPassportExpiry = passportDate;

      if (this.selectedType === "C") {
        var crValidityDate: string = this.consutancyCrDate;

        tempConsultantName = this.s13FormGroup.value.consultancyName;
        tempCrNumber = this.s13FormGroup.value.crNumber;
        tempCrExpiry = crValidityDate
      }

    }

    var lead = this.type_of_url_array[1];
    if (lead === undefined) {
      lead = "0";
    }
    var telephoneNumber = this.s2FormGroup.value.telephoneNumber.replace(/^0+/, '');
    var finalData = {

      "Id": tempId,
      "CitType": tempCitType,
      "Dob": tempDob,
      "IdProof": tempFile,
      "FirstName": this.s2FormGroup.value.firstName,
      "MiddleName": this.s2FormGroup.value.middleName,
      "LastName": this.s2FormGroup.value.lastName,
      "Email": this.s2FormGroup.value.emailId,
      "PhoneCode": this.s2FormGroup.value.telephoneNumberCode,
      "CommLanguage": this.selectedcommType,
      "FirstNameEn":this.s2FormGroup.value.firstNameEng,
      "MiddleNameEn":this.s2FormGroup.value.middleNameEng,
      "LastNameEn":this.s2FormGroup.value.lastNameEng,
      "Phone": telephoneNumber,
      "Password": this.s5FormGroup.value.password,
      "BuildNo": this.s3FormGroup.value.buildingNumber,
      "UnitNo": this.s3FormGroup.value.unitNumber,
      "AddNo": this.s3FormGroup.value.additionalNumber,
      "Street": this.s3FormGroup.value.street,
      "Neighbour": this.s3FormGroup.value.neighbourhood,
      "City": this.s3FormGroup.value.city,
      "Zip": this.s3FormGroup.value.zipCode,
      "UserType": this.selectedType,
      "Country": this.selectedCountry,
      "BpId": this.type_of_url_array[0],
      "LeadNum": lead,
      "PassportNum": tempPassportNumber,
      "PassportExpiry": tempPassportExpiry,
      "ConsultancyName": tempConsultantName,
      "CRNumber": tempCrNumber,
      "CRExpiry": tempCrExpiry

    }

    let data = finalData;

    //console.log(data);
    if(finalData){
      
      this.authenticateService.signUp(data).then(res => {
        this.signUpFinalResponse = res;
        //console.log(this.signUpFinalResponse);
        if(this.signUpFinalResponse.CitType=='S'){
          
          if (this.step1Shift.get('radiosStep1').value === "GCCNational"){

            var uploadfilepost = {
                
                "documentDefId": "121",
                "entityId": this.signUpFinalResponse.BpId,
                "entityName": "Project",
                "RelatedEntityId": "",
                "RelatedEntityName": "",
                "operationType": "r"

              }

            //this.http.post
            this.communicationsService.uploadSignUpDocumentService(this.files , uploadfilepost).then(requests =>{

              this.documentuploadresponse = requests;
              if(this.documentuploadresponse.MessType)
              if(this.documentuploadresponse.MessType === "S"){

                this.spinnerService.hide();

                this.showSuccessToast(this.signUpFinalResponse.Id);

                this.router.navigateByUrl("/login");

              }
              else{
                this.showSuccessToast(this.documentuploadresponse.message);
              }
              
            } );

          }
          else{

          this.spinnerService.hide();

          this.showSuccessToast(this.signUpFinalResponse.Id);
          this.router.navigateByUrl("/login");

          }
        }
            else{
              this.spinnerService.hide();
              this.showFailureToast(this.signUpFinalResponse.Id);
            }

        });
    }


  }

  onFifthCancelClick(event) {
    this.s11FormGroup.reset();
    this.s2FormGroup.reset();
    this.hIsStep5 = true;
    this.hIsStep1 = false;

    this.isS5Active = false;
    this.isS1Active = true;

    this.firstStep = true;
    this.secondStep = false;
    this.thirdStep = false;
    this.fourthStep = false;
    this.fifthStep = false;

  }

  onSpan1ClickVerify() {

    this.hIsConsultancy = true;
    this.s11FormGroup.reset(); this.s12FormGroup.reset(); this.s13FormGroup.reset();
    this.s2FormGroup.reset();
    // this.s13FormGroup.controls['crNumber'].reset();
    // this.s13FormGroup.controls['crNumber'].reset();
    // this.s13FormGroup.controls['crNumber'].reset();
    // this.s13FormGroup.controls['crNumber'].reset();
    this.s3FormGroup.reset();
    this.s4FormGroup.reset();
    this.s5FormGroup.reset();
    this.modalReference.close();
    this.firstStep = true; this.secondStep = false;
    this.thirdStep = false; this.fourthStep = false;
    this.fifthStep = false;
    this.hIsStep1 = false;
    this.hIsStep2 = true;
    this.hIsStep3 = true;
    this.hIsStep4 = true;
    this.hIsStep5 = true;
    this.isS1Active = true; this.isS2Active = false;
    this.isS3Active = false; this.isS4Active = false;
    this.isS5Active = false;
    if (this.selectedType === "C")
      this.hIsConsultancy = false;
    else
      this.hIsConsultancy = true;


  }

  onChangeSagia() {

    for (var i = 0; i < this.shareholderNameList.length; i++) {
      if (this.shareholderNameList[i].FullName === this.selectedShareholderName) {

        if (this.shareholderNameList[i].FirstName != undefined)
          this.s2FormGroup.controls['firstName'].setValue(this.shareholderNameList[i].FirstName);

        if (this.shareholderNameList[i].MiddleName != undefined)
          this.s2FormGroup.controls['middleName'].setValue(this.shareholderNameList[i].MiddleName);

        if (this.shareholderNameList[i].LastName != undefined)
          this.s2FormGroup.controls['lastName'].setValue(this.shareholderNameList[i].LastName);
      }
    }
  }

  onFileChange(event) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (let i = 0; i < this.files.length; i++) {
      format = this.files[i].name.split('.');

      format_length = format.length;

      if (this.files[i].size > 5242880) {

        this.showFailureToast(this.translate.instant('COMMON.Thesizeofeachchosenfileshouldbeamaximumof5MB'));
        event.target.value = '';
        break;

      } else if (format[format_length - 1] === 'exe' || format[format_length - 1] === 'dll' || format[format_length - 1] === 'js') {

        this.showFailureToast(this.translate.instant('COMMON.Theformatofoneofthechosenfilesisnotsupported'));
        event.target.value = '';
        break;

      } else if (i === (this.files.length - 1)) {


        this.files = event.target.files;

        const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
        
        if (!isIEOrEdge)
          this.s13FormGroup.value.gccNationalIdProof = this.files[0].name;


        if (isIEOrEdge){
          this.s13FormGroup.controls['gccNationalIdProof'].setErrors(null);
          this.s13FormGroup.controls['gccNationalIdProof'].setValue(this.files[0].name);
        }

      }

    }

  }

  onLangChange(selectedValue){ 
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(selectedValue);

    this.translate.get('dir').subscribe(res => { 
      this.directionService.setDirection(res=='rtl'?NbLayoutDirection.RTL:NbLayoutDirection.LTR);
    });

    this.localStorage.setItem('lang', selectedValue).subscribe(() => {
     // Done
     this.selectedlang = this.translate.currentLang;
   }, (error) => {
     alert(error)
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(selectedValue);
 });

 }
 startTimer() {
  this.interval = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft - minutes * 60;

      this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin') + ' ' + minutes + ' ' + this.translate.instant('COMMON_TIMER.min') + ' : ' + seconds + ' ' + this.translate.instant('COMMON_TIMER.sec');

    } else {

      this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpired');
      this.closeTimer();
      this.hresend = false;

    }
  }, 1000)

}

closeTimer() {

  clearInterval(this.interval);

}

OnResendClick() {

  this.spinnerService.show();
  this.timeLeft = 300;
  this.timeLeftformat = this.translate.instant('COMMON_TIMER.OTPexpiresin5min');

  const telephoneNumber = this.s2FormGroup.value.telephoneNumber.replace(/^0+/, '');

  // Code for generating phone and email OTP
  const data = {
    nationalityId: this.nationalityId,
    typeofnationality: 'SAUDI',
    action: 'SENDGENOTP',
    otp_gen: 'N',
    otp_ver: 'N',
    wasselcall: 'N',
    signupPhoneOTP: this.s2FormGroup.value.telephoneNumberCode + '' + telephoneNumber,
    emailId: this.s2FormGroup.value.emailId,
    nationalityIdDob: 'N',
    licNum: 'N',
    licVal: 'N',
    usrId: 'N',
    crnumber: 'N',
    date: 'N',
  }


  if (this.s2FormGroup.value.emailId !== '') {
    this.authenticateService.validateSignUp(data).then(res => {
      this.signUpPhoneEmailOTPResponse = res;

      if (this.signUpPhoneEmailOTPResponse.ReqMess[0].MessType === 'S') {
        this.hresend = true;
        this.startTimer();
        this.spinnerService.hide();
        this.showSuccessToast(this.signUpPhoneEmailOTPResponse.ReqMess[0].MessText);

      } else {
        this.spinnerService.hide();
        this.showFailureToast(this.signUpPhoneEmailOTPResponse.ReqMess[0].MessText);
      }

    });
  }

}
showSuccessToast(message) {
    this.toastr.success(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });
  }

  showFailureToast(message) {
    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });
  }

  navigatetoLogin(event){

    this.modalReference = this.modalService.open(event, { backdrop: 'static', size: 'sm' });
    
  }

  onnavigateConfirm(){

    this.modalReference.close()
    this.router.navigateByUrl("/login");

  }


}
