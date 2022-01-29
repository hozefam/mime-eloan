import { Component, OnInit, Injectable, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, interval } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CommunicationsService } from "../../services/communications.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CustomerProfileService } from "../../services/customer-profile.service";
import { CommonService } from "../../services/common.service";
import { LoanApplicationService } from '../../services/loan-application.service';
import { ToastrService } from 'ngx-toastr';
import { RCYQuestService } from '../../services/rcy-questionnaire.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = ['Muharram', 'Safar', "Rabi' I", "Rabi' al Thani", 'Jumada I', 'Jumada al-akhir', 'Rajab', "Sha'aban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", "Dhu al-Hijjah"];

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
  selector: 'rcy-questionnaire',
  templateUrl: './rcy-questionnaire.component.html',
  styleUrls: ['./rcy-questionnaire.component.scss']
})
export class RcyQuestionnaireComponent implements OnInit {

  RCYLoanNumber: any = 0;
  documents = {};
  //TODO: reset
  sysUserServiceId = null;
  GenInfoPer = 0;
  MarkInfoPer = 0;
  TechInfoPer = 0;
  FinInfoPer = 0;
  RCJInfoPer = 0;
  RCJQuesPer = 0;
  ChecklistPer = 0;
  LandLoanRequestStatus: any = 0;

  add_edit_delete_show = true;
  /* RCY START */

  is_waste = false;
  private subscription: Subscription;
  private timer: Observable<any>;
  answers = []
  env_answers = {}
  questions = []
  countries = []
  typeMaterialText = {
    quantity: 0,
    type: ""
  }
  noRecord: boolean = false;
  settings_type_material = {
    noDataMessage: "No materials Found",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    actions: {
      position: "right",
      add: true,
      edit: true,
      delete: true,
    },

    columns: {
      type: {
        title: "Material Name",
        type: "string",

      },
      quantity: {
        title: "Quantity",
        type: "int"

      }

    }
  };
  settings_type_material_3 = {
    noDataMessage: "No materials Found",
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    actions: {
      position: "right",
      add: false,
      edit: true,
      delete: false,
    },

    columns: {
      type: {
        title: "Material Name",
        type: "string",
        editable: false
      },
      quantity: {
        title: "Quantity",
        type: "int"

      }

    }
  };
  q7_object = [];
  q20_object = [];
  q1_object = [];
  q3_object = [];
  q4_object = [];
  q5_object = [];
  q8_object = [];
  q9_object = [];
  q15_object = [];
  q10_object = [];
  q11_object = [];
  q13_object = [];
  questionsObjects = new Array(17);
  translate: any;
  /* RCY END */

  panelStep = 1;
  type_material_source_length = 0;
  type_material_3_source_length = 6;

  type_material_source: LocalDataSource;
  type_material_3_source: LocalDataSource;

  allPanelsExpanded = false;
  startedFilling = 0;
  requestId = 0;
  statusCode = "";
  ownersList = [];
  ownersListNames = [];
  nonSaudiOwnersListNames = [];

  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  adminuser: any = {};
  RCYPreliminaryRequestNumber: any = 0;
  RCYSysuserServiceId: any = 0;

  constructor(private communicationsService: CommunicationsService, private spinnerService: Ng4LoadingSpinnerService, private calendar: NgbCalendar, private loanApplicationService: LoanApplicationService,
    private customerProfileService: CustomerProfileService, private commonService: CommonService,
    private rcyQuestService: RCYQuestService, private toastr: ToastrService, private modalService: NgbModal,
    private router: Router, protected localStorage: LocalStorage, private route: ActivatedRoute) {

    this.minDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };
    this.maxDate = { year: this.calendar.getToday().year + 20, month: 12, day: 31 };
    this.translate = this.commonService.returnTranslate();

  }

  files: any = [];

  onFileChange(event) {
    this.files = event.target.files;
  }
  public ngOnDestroy() {
    if (this.subscription && this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      var RCYLoanNumber = params['RCYLoanNumber'];
      var RCYPreliminaryRequestNumber = params['RCYPreliminaryRequestNumber'];
      var RCYSysuserServiceId = params['RCYSysuserServiceId'];

      if (RCYLoanNumber) {
        this.RCYLoanNumber = this.customerProfileService.getDecryptString(RCYLoanNumber);
        this.RCYPreliminaryRequestNumber = this.customerProfileService.getDecryptString(RCYPreliminaryRequestNumber);
        this.RCYSysuserServiceId = this.customerProfileService.getDecryptString(RCYSysuserServiceId);

      }
    });

    this.localStorage.getItem('AdminLoginData').subscribe((data) => {
      this.adminuser = data;
      if (this.adminuser == null) {
        this.router.navigateByUrl('/admin-login');
      }
    });
    var obj = {
      "requestId": this.RCYLoanNumber
    };

    if (this.RCYLoanNumber == null || this.RCYLoanNumber == 0)
      this.router.navigateByUrl('/admin-login');
    else {
      this.rcyQuestService.getAdminRCYQuestionnaireType(obj).then(res => {
        console.log('resonse ' + res);
        this.is_waste = <boolean>res;
        if (this.RCYLoanNumber == 0)
          this.router.navigateByUrl('/AdminArea');
        else {
          /* RCY */
          this.type_material_source = new LocalDataSource();
          this.type_material_3_source = new LocalDataSource([{
            type: 'Arsenic',
            code: 'QuestEnvCriteriaLaf3$$1',
            quantity: 0
          },
          {
            type: 'Mercury',
            code: 'QuestEnvCriteriaLaf3$$2',
            quantity: 0
          }, {
            type: 'Cyanide',
            code: 'QuestEnvCriteriaLaf3$$3',
            quantity: 0
          }, {
            type: 'Phosgene',
            code: 'QuestEnvCriteriaLaf3$$4',
            quantity: 0
          }, {
            type: 'Methyl isocyanate',
            code: 'QuestEnvCriteriaLaf3$$5',
            quantity: 0
          }, {
            type: 'Others',
            code: 'QuestEnvCriteriaLaf3$$6',
            quantity: 0
          }
          ]);
        }
        //TODO: check if there's data
        this.getRCYQuestionnaire();

      }).catch(function (e) {
        // handle errors in processing or in error.
        console.log('resonse ' + e)
      });;
    }
  }

  getRCYQuestionnaire() {
    try {
      var obj = {
        "requestId": this.RCYLoanNumber,
      };
      this.rcyQuestService
        .getAdminQuestionnair(obj)
        .then((res) => (this.resolveRCYSurvey(res)), err => (this.getProjectInformationError(err)));
    }
    catch (err) {
      this.spinnerService.hide();
      this.commonService.showFailureToast(err);
    }
  }

  getProjectInformationError(err) {
    this.spinnerService.hide();
    this.commonService.showFailureToast(err);
  }

  resolveRCYSurvey(res) {
    if (res == null) {
      this.commonService.showFailureToast("لا يوجد بيانات");
      this.spinnerService.hide();
    }
    else {
      if (res.Cofinancers != null && res.Cofinancers[0].MessType === "E") {
        this.noRecord = true;
        this.spinnerService.hide();
      }
      else {
        try {

          if (this.is_waste) {
            for (var i = 1; i <= 20; i++) {
              let inputs = {
                "SysUserServiceId": res[0].SysUserServiceId,
                "RCY_RequestId": null,
                "Truthy1": null,
                "Truthy2": null,
                "QuestionId": i,
                "TypeOfMaterialText": null,
                "TypeOfIndustrialWaste": null,
                "Quantity": null,
                "LiquidQuantity": null,
                "TextAnswer1": (i == 19) ? { year: 0, month: 0, day: 0 } : null,
                "TextAnswer2": (i == 19) ? { year: 0, month: 0, day: 0 } : null,
                "NumberOfPointSource": null,
                "Country": null,
                "City": null,
                "NumberOfPlants": null,
                "HeavyFuelOilLaf": null,
                "CrudeOilLaf": null,
                "Used": null,
                "Recycled": null,
                "Incineration": (i == 20) ? false : null,
                "Physical": (i == 20) ? false : null,
                "Landfill": (i == 20) ? false : null,
                "IndustrialWasteManagement": (i == 1) ? false : null,
                "IndustrialWasteRecycling": (i == 1) ? true : null,
                "WasteOil": (i == 7) ? false : null,
                "Caustic": (i == 7) ? false : null,
                "Catalyst": (i == 7) ? false : null,
                "Gypsum": (i == 7) ? false : null,
                "RedMud": (i == 7) ? false : null,
                "Phosphogypsum": (i == 7) ? false : null,
                "SteelDust": (i == 7) ? false : null,
                "OtherWaste": (i == 7) ? false : null,
              };
              this.answers.push(inputs);
            }

            this.questions = [
              {
                Code: "Q1",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ1"),
                Type: "Radio_1"
              },
              {
                Code: "Q2",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ2"),
                Type: "Truth"
              },
              {
                Code: "Q3",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ3"),
                Type: "Truth"
              },
              {
                Code: "Q4",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ4"),
                Type: "Year"
              },
              {
                Code: "Q5",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ5"),
                Type: "Year"
              },
              {
                Code: "Q6",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ6"),
                Type: "Text"
              },
              {
                Code: "Q7",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ7"),
                Type: "Table_1"
              },
              {
                Code: "Q8",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ8"),
                Type: "Truth"
              },
              {
                Code: "Q9",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ9"),
                Type: "Truth"
              },
              {
                Code: "Q10",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ10"),
                Type: "Year"
              },
              {
                Code: "Q11",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ11"),
                Type: "Truth_Text"
              },
              {
                Code: "Q12",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ12"),
                Type: "Truth_Text"
              },
              {
                Code: "Q13",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ13"),
                Type: "Text"
              },
              {
                Code: "Q14",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ14"),
                Type: "Radio_2"
              },
              {
                Code: "Q15",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ15"),
                Type: "Text"
              },
              {
                Code: "Q16",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ16"),
                Type: "Text"
              },
              {
                Code: "Q17",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ17"),
                Type: "Text"
              },
              {
                Code: "Q18",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ18"),
                Type: "Truth_Text_Truth"
              },
              {
                Code: "Q19",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ19"),
                Type: "Text_Text"
              },
              {
                Code: "Q20",
                Category: "waste",
                Question: this.translate.instant("RCJ_Questionnaire.WasteQ20"),
                Type: "Table_2"
              },
            ]
            this.q7_object = [{
              name: this.translate.instant('RCJ_Questionnaire.WasteOilSludge'),
              value: false,
              code: 'WasteOil'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.SpentCaustic'),
              value: false,
              code: 'Caustic'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.SpentCatalyst'),
              value: false,
              code: 'Catalyst'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.Gypsum'),
              value: false,
              code: 'Gypsum'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.RedMud'),
              value: false,
              code: 'RedMud'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.Phosphogypsum'),
              value: false,
              code: 'Phosphogypsum'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.SteelDustFromRlectricArcFurnace'),
              value: false,
              code: 'SteelDust'
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.AnyOtherIndustrialWaste'),
              value: false,
              code: 'OtherWaste'
            },
            ]


            this.q20_object = [
              {
                name: this.translate.instant('RCJ_Questionnaire.Incineration'),
                value: false,
                code: 'Incineration'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.PhysicalChemicalPretreatment'),
                value: false,
                code: 'Physical'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Landfill'),
                value: false,
                code: 'Landfill'
              }
            ]
          }
          else {
            for (var i = 21; i <= 37; i++) {
              let inputs = {
                "SysUserServiceId": res[0].SysUserServiceId,
                "RCY_RequestId": null,
                "Truthy1": null,
                "Truthy2": null,
                "QuestionId": i,
                "TypeOfMaterialText": null,
                "TypeOfIndustrialWaste": null,
                "Quantity": null,
                "LiquidQuantity": null,
                "TextAnswer1": null,
                "TextAnswer2": null,
                "NumberOfPointSource": null,
                "Country": null,
                "City": null,
                "NumberOfPlants": null,
                "HeavyFuelOilLaf": null,
                "CrudeOilLaf": null,
                "Used": null,
                "Recycled": null,
                "Incineration": null,
                "Physical": null,
                "Landfill": null,
                "IndustrialWasteManagement": null,
                "IndustrialWasteRecycling": null,
                "WasteOil": null,
                "Caustic": null,
                "Catalyst": null,
                "Gypsum": null,
                "RedMud": null,
                "Phosphogypsum": null,
                "SteelDust": null,
                "OtherWaste": null,
              };
              this.answers.push(inputs);
            }
            this.questions = [
              {
                Code: "Q1",
                Category: "env",
                Question: "Does the facility use or generate any radioactive materials?",
                Type: "Truth_TypeM_Quantity"
              },
              {
                Code: "Q2",
                Category: "env",
                Question: "Does the facility operation involve generation of more than 100 tons/day of solid or semisolid industrial waste materials?",
                Type: "Truth_Used_Text"
              },
              {
                Code: "Q3",
                Category: "env",
                Question: "Does the facility use or generate highly toxic materials?",
                Type: "Truth_TypeM_Quantity"
              },
              {
                Code: "Q4",
                Category: "env",
                Question: "Does the facility involve hazardous materials which difficult to be handled?",
                Type: "Truth_TypeM_Quantity"

              },
              {
                Code: "Q5",
                Category: "env",
                Question: "Does the facility use or generate carcinogenic materials?",
                Type: "Truth_TypeM_Quantity"
              },
              {
                Code: "Q6",
                Category: "env",
                Question: "Does the facility generate wastewater containing more than 2,000mg/l of TDS (total dissolved solids)? ",
                Type: "Truth_Quantity"

              },
              {
                Code: "Q7",
                Category: "env",
                Question: "Does the facility operation involve generation of wastewater which cannot be pretreated to comply with Royal Commission Environmental Regulations (RCER) pretreatment standards?",
                Type: "Truth_Quantity"

              },
              {
                Code: "Q8",
                Category: "env",
                Question: "Does the facility use crude oil or heavy fuel oil as fuels in the boilers or heaters?",
                Type: "Truth_Crud_Quantity"

              },
              {
                Code: "Q9",
                Category: "env",
                Question: "Does the facility operation involve bulk material handling of raw materials or products which are fine powder or dust in nature?",
                Type: "Truth_TypeM_Quantity"
              },
              {
                Code: "Q10",
                Category: "env",
                Question: "Does the facility have point sources emitting more than 100 tons/year (before the use of abatement equipment) of any air pollutant?",
                Type: "Truth_Point_Quantity"

              },
              {
                Code: "Q11",
                Category: "env",
                Question: "Does the facility have point sources emitting more than 10 tons/year (before the use of abatement equipment) of any hazardous air pollutant?",
                Type: "Truth_Point_Quantity"

              },
              {
                Code: "Q12",
                Category: "env",
                Question: "Does the plant use any technology that has not been used elsewhere? ",
                Type: "Truth_Text"

              },
              {
                Code: "Q13",
                Category: "env",
                Question: "Are the plants built in Saudi Arabia or in other parts of the world using the same technology? ",
                Type: "Truth_Country_Location_NumberPlant"

              },
              {
                Code: "Q14",
                Category: "env",
                Question: "Has the promoter identified the technology supplier for their project?",
                Type: "Truth_Text"
              },
              {
                Code: "Q15",
                Category: "env",
                Question: "Does the facility operation involve trucking of solid/liquid/waste materials or bulk raw – solid or liquid materials or products?",
                Type: "Truth_TypeM_Quantity_Liquid"
              },
              {
                Code: "Q16",
                Category: "env",
                Question: "Provide a two page summary explaining the process description in detail starting from raw material until final product is obtained including all pollution sources and the control measures adopted. ",
                Type: "Text"
              },
              // TODO: Handle Attachment
              // {
              //     Code: "Q17",
              //     Category: "env",
              //     Question: "Provide the detailed process flow diagram(s) for the technology process (to be submitted by the applicant as attachment). ",
              //     Type: "Attachment"

              // },
            ];

            this.countries = [{
              id: 92,
              country: "جمهورية كوريا"
            },
            {
              id: 93,
              country: "رومانيا"
            },
            {
              id: 94,
              country: "الاتحاد الروسي"
            },
            {
              id: 95,
              country: "المملكة العربية السعودية"
            }];
            this.q1_object = [{
              name: "",
              quantity: 0,
              code: null
            },
            ];

            this.q3_object = [
              {
                name: this.translate.instant('RCJ_Questionnaire.Arsenic'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf3$$1'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Mercury'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf3$$2'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Cyanide'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf3$$3'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Phosgene'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf3$$4'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.MethylIsocyanate'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf3$$5'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Others'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf3$$6'
              },
            ];

            this.q4_object = [
              {
                name: this.translate.instant('RCJ_Questionnaire.HF'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf4$$1'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Acrylonitrile'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf4$$2'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.CarbonDisulfide '),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf4$$3'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.OToluidine'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf4$$4'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Tetrahydrofuran'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf4$$5'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Others'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf4$$6'
              },
            ];

            this.q5_object = [
              {
                name: this.translate.instant('RCJ_Questionnaire.Benzene'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$1'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.CarbonTetraChloride'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$2'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.VinylChloride'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$3'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Hydrazine'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$4'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.PCBs'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$5'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.HexaValentChromiumCompounds'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$6'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Others'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf5$$7'
              },
            ];

            this.q8_object = [{
              name: this.translate.instant('RCJ_Questionnaire.Boiler'),
              quantity: 0,
              codeCrud: 'CrudeOilLaf$$1',
              codeHeavy: 'HeavyFuelOilLaf$$1',
              value: true
            },
            {
              name: this.translate.instant('RCJ_Questionnaire.Heater'),
              quantity: 0,
              codeCrud: 'CrudeOilLaf$$2',
              codeHeavy: 'HeavyFuelOilLaf$$2',
              value: true
            },];

            this.q9_object = [
              {
                name: this.translate.instant('RCJ_Questionnaire.Bulk'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf9$$1'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.FinePowderDust'),
                quantity: 0,
                code: 'QuestEnvCriteriaLaf9$$2'
              },
            ];

            this.q11_object = [{
              numberOfPointSource: "",
              quantity: 0,
            }];
            this.q10_object = [{
              numberOfPointSource: "",
              quantity: 0,
            }];
            this.q13_object = [
              {
                numberOfPlants: "",
                country: "",
                location: "",
                id: 0
              }
            ];


            this.q15_object = [
              {
                name: this.translate.instant('RCJ_Questionnaire.Raw'),
                quantity: 0,
                liquidQuantity: 0,
                code: 'QuestEnvCriteriaLaf15$$1'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.Product'),
                quantity: 0,
                liquidQuantity: 0,
                code: 'QuestEnvCriteriaLaf15$$2'
              },
              {
                name: this.translate.instant('RCJ_Questionnaire.waste'),
                quantity: 0,
                liquidQuantity: 0,
                code: 'QuestEnvCriteriaLaf15$$3'
              },
            ];

            console.log('ques', this.questions);
            this.questionsObjects[0] = this.q1_object;
            this.questionsObjects[2] = this.q3_object;
            this.questionsObjects[3] = this.q4_object;
            this.questionsObjects[4] = this.q5_object;
            this.questionsObjects[8] = this.q9_object;
            this.questionsObjects[14] = this.q15_object;
            console.log('ques', this.questionsObjects);

          }
          //todo handle data
          if (res.length <= 1) {

            this.answers.forEach(answer => {
              answer.SysUserServiceId = res[0].SysUserServiceId;
              answer.RCY_RequestId = res[0].RequestId;
            })
          }
          else {
            var new_answers = []
            if (this.is_waste) {
              let SplittedTextAnswer1 = res[18].TextAnswer1.split("-", 3);
              let SplittedTextAnswer2 = res[18].TextAnswer2.split("-", 3);
              // let CommenceDate = { 'year': SplittedTextAnswer1[0], 'month': SplittedTextAnswer1[1], 'day': SplittedTextAnswer1[2] } ;
              let CommenceDate = { year: Number(SplittedTextAnswer1[0]), month: Number(SplittedTextAnswer1[1]), day: Number(SplittedTextAnswer1[2]) };
              let CompletionDate = { year: Number(SplittedTextAnswer2[0]), month: Number(SplittedTextAnswer2[1]), day: Number(SplittedTextAnswer2[2]) };

              // let CompletionDate = { year: this.calendar.getToday().year - 100, month: 1, day: 1 };

              for (var i = 1; i <= 20; i++) {
                let inputs = {
                  "SysUserServiceId": res[i - 1].SysUserServiceId,
                  "RCY_RequestId": res[i - 1].RCY_RequestId,
                  "Truthy1": res[i - 1].Truthy1,
                  "Truthy2": res[i - 1].Truthy2,
                  "QuestionId": i,
                  "TypeOfMaterialText": res[i - 1].TypeOfMaterialText,
                  "TypeOfIndustrialWaste": res[i - 1].TypeOfIndustrialWaste,
                  "Quantity": res[i - 1].Quantity,
                  "LiquidQuantity": res[i - 1].LiquidQuantity,
                  "TextAnswer1": (i == 19) ? CommenceDate : res[i - 1].TextAnswer1,
                  "TextAnswer2": (i == 19) ? CompletionDate : res[i - 1].TextAnswer2,
                  "NumberOfPointSource": res[i - 1].NumberOfPointSource,
                  "Country": res[i - 1].Country,
                  "City": res[i - 1].City,
                  "NumberOfPlants": res[i - 1].NumberOfPlants,
                  "HeavyFuelOilLaf": res[i - 1].HeavyFuelOilLaf,
                  "CrudeOilLaf": res[i - 1].CrudeOilLaf,
                  "Used": res[i - 1].Used,
                  "Recycled": res[i - 1].Recycled,
                  "Incineration": (i == 20) ? res[i - 1].Incineration : null,
                  "Physical": (i == 20) ? res[i - 1].Physical : null,
                  "Landfill": (i == 20) ? res[i - 1].Landfill : null,
                  "IndustrialWasteManagement": (i == 1) ? res[i - 1].IndustrialWasteManagement : null,
                  "IndustrialWasteRecycling": (i == 1) ? res[i - 1].IndustrialWasteRecycling : null,
                  "WasteOil": (i == 7) ? res[i - 1].WasteOil : null,
                  "Caustic": (i == 7) ? res[i - 1].Caustic : null,
                  "Catalyst": (i == 7) ? res[i - 1].Catalyst : null,
                  "Gypsum": (i == 7) ? res[i - 1].Gypsum : null,
                  "RedMud": (i == 7) ? res[i - 1].RedMud : null,
                  "Phosphogypsum": (i == 7) ? res[i - 1].Phosphogypsum : null,
                  "SteelDust": (i == 7) ? res[i - 1].SteelDust : null,
                  "OtherWaste": (i == 7) ? res[i - 1].OtherWaste : null,
                };
                new_answers.push(inputs);
              }
              //this.q7_object[0].value =  new_answers[6]["WasteOil"];
              this.q7_object.forEach(element => {
                element.value = new_answers[6][element.code];
                // switch(element.value){
                //   case "WasteOil":
                //      element.value = new_answers[6].WasteOil
                // }
                // new_answers[6].wh
                //  element.value = new_answers[6][element.code] ;
              });

              this.q20_object.forEach(element => {
                element.value = new_answers[19][element.code];
              });
              this.commonService.showSuccessToast("تم تحميل بيانات الإستبيان بنجاح");

            }
            else {
              for (var i = 21; i <= 37; i++) {
                let inputs = {
                  "SysUserServiceId": res[i - 21].SysUserServiceId,
                  "RCY_RequestId": res[i - 21].RCY_RequestId,
                  "Truthy1": res[i - 21].Truthy1,
                  "Truthy2": res[i - 21].Truthy2,
                  "QuestionId": i,
                  "TypeOfMaterialText": res[i - 21].TypeOfMaterialText,
                  "TypeOfIndustrialWaste": res[i - 21].TypeOfIndustrialWaste,
                  "Quantity": res[i - 21].Quantity,
                  "LiquidQuantity": res[i - 21].LiquidQuantity,
                  "TextAnswer1": res[i - 21].TextAnswer1,
                  "TextAnswer2": res[i - 21].TextAnswer2,
                  "NumberOfPointSource": res[i - 21].NumberOfPointSource,
                  "Country": res[i - 21].Country,
                  "City": res[i - 21].City,
                  "NumberOfPlants": res[i - 21].NumberOfPlants,
                  "HeavyFuelOilLaf": res[i - 21].HeavyFuelOilLaf,
                  "CrudeOilLaf": res[i - 21].CrudeOilLaf,
                  "Used": res[i - 21].Used,
                  "Recycled": res[i - 21].Recycled,
                  "Incineration": res[i - 21].Incineration,
                  "Physical": res[i - 21].Physical,
                  "Landfill": res[i - 21].Landfill,
                  "IndustrialWasteManagement": res[i - 21].IndustrialWasteManagement,
                  "IndustrialWasteRecycling": res[i - 21].IndustrialWasteRecycling,
                  "WasteOil": res[i - 21].WasteOil,
                  "Caustic": res[i - 21].Caustic,
                  "Catalyst": res[i - 21].Catalyst,
                  "Gypsum": res[i - 21].Gypsum,
                  "RedMud": res[i - 21].RedMud,
                  "Phosphogypsum": res[i - 21].Phosphogypsum,
                  "SteelDust": res[i - 21].SteelDust,
                  "OtherWaste": res[i - 21].OtherWaste,
                };
                new_answers.push(inputs);
              }



              // })
              this.answers = new_answers;
              //handle object data
              for (var i = 17; i <= res.length - 1; i++) {
                switch (res[i].QuestionId) {
                  case 21:
                    //todo
                    if (this.q1_object[0].name == "") {
                      this.q1_object = [];
                    }
                    let item = {
                      name: res[i].TypeOfMaterialText,
                      quantity: Number(res[i].Quantity),
                      code: null
                    };

                    this.q1_object.push(item);
                    break;
                  case 23:
                    this.q3_object.forEach(element => {
                      if (res[i].TypeOfMaterialText == element.code) {
                        element.quantity = Number(res[i].Quantity)
                      }
                    });

                    break;
                  case 24:
                    this.q4_object.forEach(element => {
                      if (res[i].TypeOfMaterialText == element.code) {
                        element.quantity = Number(res[i].Quantity)
                      }
                    });
                    break;
                  case 25:
                    this.q5_object.forEach(element => {
                      if (res[i].TypeOfMaterialText == element.code) {
                        element.quantity = Number(res[i].Quantity)
                      }
                    });
                    break;
                  case 28:
                    // handle crude
                    this.q8_object.forEach(element => {
                      if (res[i].HeavyFuelOilLaf == element.codeHeavy) {
                        element.quantity = Number(res[i].Quantity)
                        element.value = res[i].Truthy1
                      }
                    });
                    break;
                  case 29:
                    this.q9_object.forEach(element => {
                      if (res[i].TypeOfMaterialText == element.code) {
                        element.quantity = Number(res[i].Quantity)
                      }
                    });
                    break;
                  case 31:
                    if (this.q10_object[0].numberOfPointSource == "") {
                      this.q10_object = [];
                    }
                    let item_q10_object = {
                      numberOfPointSource: res[i].NumberOfPointSource,
                      quantity: Number(res[i].Quantity),
                    };

                    this.q10_object.push(item_q10_object);
                    break;
                  case 32:
                    if (this.q11_object[0].numberOfPointSource == "") {
                      this.q11_object = [];
                    }
                    let item_q11_object = {
                      numberOfPointSource: res[i].NumberOfPointSource,
                      quantity: Number(res[i].Quantity),
                    };

                    this.q11_object.push(item_q11_object);
                    break;
                  case 34:
                    if (this.q13_object[0].numberOfPlants == "") {
                      this.q13_object = [];
                    }
                    let item_q13_object = {
                      numberOfPlants: res[i].NumberOfPlants,
                      country: Number(res[i].Country),
                      location: res[i].City,
                      id: this.q13_object.length > 0 ? this.q13_object.length : 0
                    };
                    this.q13_object.push(item_q13_object);
                    break;

                  case 35:
                    this.q15_object.forEach(element => {
                      if (res[i].TypeOfMaterialText == element.code) {
                        element.quantity = Number(res[i].Quantity);
                        element.liquidQuantity = Number(res[i].LiquidQuantity);
                      }
                    });
                    break;
                }
              }

              console.log('ques', this.questions);
              this.questionsObjects[0] = this.q1_object;
              this.questionsObjects[2] = this.q3_object;
              this.questionsObjects[3] = this.q4_object;
              this.questionsObjects[4] = this.q5_object;
              this.questionsObjects[8] = this.q9_object;
              this.questionsObjects[14] = this.q15_object;
              this.commonService.showSuccessToast("تم تحميل بيانات الإستبيان بنجاح");

            }



          }
          // res.body.forEach(element => {

          // });

        }

        catch (err) {
          this.spinnerService.hide();
          this.commonService.showFailureToast(err);
        }
      }
    }
  }

  onClickLoanApplicationTab(tab_number) {

    switch (tab_number) {

      case 4:
        this.router.navigate(['/AdminArea/rcy-investerinformation'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;

      case 5:
        this.router.navigate(['/AdminArea/rcy-information'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;

      case 6:
        this.router.navigate(['/AdminArea/rcy-questionnaire'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;

      case 7:
        this.router.navigate(['/AdminArea/rcy-action'], { queryParams: { RCYLoanNumber: this.customerProfileService.getEncryptedString(String(this.RCYLoanNumber)), RCYSysuserServiceId: this.customerProfileService.getEncryptedString(String(this.RCYSysuserServiceId)), RCYPreliminaryRequestNumber: this.customerProfileService.getEncryptedString(String(this.RCYPreliminaryRequestNumber)) } });
        break;
    }
  }
}
