import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { RepresentativesListService } from "./../../../services/representativesList.service";
import { CustomerProfileService } from "../../../services/customer-profile.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from "../../../services/common.service";
import { _ } from 'underscore';
import { RepresentativesModalsComponent } from './representatives-modals/representatives-modals.component';

@Component({
  selector: 'representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.scss']
})
export class RepresentativesComponent implements OnInit {
  translate: any;

  showTour = true;

  tour_en: any;

  tour_ar: any;

  isEdit = '';
  selectedRepresentativeId;
  selectedRepresentativeBpName;
  representativeDropDown = [];
  customerProfileData;

  temp;
  ProfileId;
  ProfileName;
  idtypearray = [
    { Code: "1", Text: "National ID" },
    // {Code: "2", Text: "SAGIA License NO"}];
    { Code: "3", Text: "GCC National ID" },
    { Code: "4 ", Text: "IQAMA Id" }];
  idtypearray_text;

  settings_representatives: any;
  // settings_representatives = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",

  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete Representative"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit Representative"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: false,
  //     delete: false,
  //     columnTitle: "Actions"
  //   },
  //   columns: {

  //     // buPartner: {
  //     //   title: "Business Partner ID",
  //     //   type: "number",
  //     //   editable: false
  //     // },
  //     idNumber: {
  //       title: "ID",
  //       type: "text",
  //       editable: false
  //     },
  //     name: {
  //       title: "Name",
  //       type: "text",
  //       editable: false
  //     },
  //     mobile: {
  //       title: "Mobile",
  //       type: "text",
  //       editable: false
  //     },
  //     emailId: {
  //       title: "Email ID",
  //       type: "text",
  //       editable: false
  //     },
  //     status: {
  //       title: "Status",
  //       type: "text",
  //       editable: false
  //     },
  //   }
  // };
  // settings_representatives_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: "لاتوجد بيانات",

  //   mode: "external",

  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف النواب"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تحرير النواب"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: false,
  //     delete: false,
  //     columnTitle: "أفعال",
  //   },
  //   columns: {

  //     // buPartner: {
  //     //   title: "Business Partner ID",
  //     //   type: "number",
  //     //   editable: false
  //     // },
  //     idNumber: {
  //       title: "هوية شخصية",
  //       type: "text",
  //       editable: false
  //     },
  //     name: {
  //       title: "اسم",
  //       type: "text",
  //       editable: false
  //     },
  //     mobile: {
  //       title: "الهاتف الخلوي",
  //       type: "text",
  //       editable: false
  //     },
  //     emailId: {
  //       title: "عنوان الايميل",
  //       type: "text",
  //       editable: false
  //     },
  //     status: {
  //       title: "الحالة",
  //       type: "text",
  //       editable: false
  //     },
  //   }
  // };
  // settings_representatives_isEdit = {
  //   hideSubHeader: true,

  //   noDataMessage: "No Data Found",

  //   mode: "external",

  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="Delete Representative"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="Edit Representative"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: false,
  //     delete: true,
  //     columnTitle: "Actions"
  //   },
  //   columns: {
  //     idNumber: {
  //       title: "ID",
  //       type: "text",
  //       editable: false
  //     },
  //     name: {
  //       title: "Name",
  //       type: "text",
  //       editable: false
  //     },
  //     mobile: {
  //       title: "Mobile",
  //       type: "text",
  //       editable: false
  //     },
  //     emailId: {
  //       title: "Email ID",
  //       type: "text",
  //       editable: false
  //     },
  //     status: {
  //       title: "Status",
  //       type: "text",
  //       editable: false
  //     },
  //   }
  // };
  settings_representatives_isEdit: any;
  // settings_representatives_isEdit_ar = {
  //   hideSubHeader: true,

  //   noDataMessage: "لاتوجد بيانات",

  //   mode: "external",

  //   delete: {
  //     deleteButtonContent: '<i class="nb-trash" title="حذف النواب"></i>',
  //   },
  //   edit: {
  //     editButtonContent: '<i class="nb-edit" title="تحرير النواب"></i>',
  //   },

  //   actions: {
  //     position: "right",
  //     add: false,
  //     edit: false,
  //     delete: true,
  //     columnTitle: "أفعال",
  //   },
  //   columns: {
  //     idNumber: {
  //       title: "هوية شخصية",
  //       type: "text",
  //       editable: false
  //     },
  //     name: {
  //       title: "اسم",
  //       type: "text",
  //       editable: false
  //     },
  //     mobile: {
  //       title: "الهاتف الخلوي",
  //       type: "text",
  //       editable: false
  //     },
  //     emailId: {
  //       title: "عنوان الايميل",
  //       type: "text",
  //       editable: false
  //     },
  //     status: {
  //       title: "الحالة",
  //       type: "text",
  //       editable: false
  //     },
  //   }
  // };
  source_representatives = new LocalDataSource;
  deleteCancelModalReference: any;

  constructor(private translateService: TranslateService, public commonService: CommonService, private modalService: NgbModal, private customerProfileService: CustomerProfileService, private RepresentativesListService: RepresentativesListService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService, private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService, protected localStorage: LocalStorage, private directionService: NbLayoutDirectionService) {
    this.translate = this.commonService.returnTranslate();

    this.tour_en = this.commonService.returnEnglishTour();
    this.tour_ar = this.commonService.returnArabicTour();
    this.initTableSettings();
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      // console.log(event.lang);
      this.initTableSettings();
    });
    this.localStorage.getItem('custProfile').subscribe((data) => {
      // console.log("psw" + data);
      this.customerProfileData = data;
      this.bindRepresentativeDropDowns();
      this.selectedRepresentativeId = this.customerProfileService.currentCustomerProfile.customerProfileId;
      this.selectedRepresentativeBpName = (_.find(this.customerProfileData, { CustomerProfile: this.selectedRepresentativeId })).BpName;
    })
  }

  ngOnInit() {

    this.ProfileId = this.customerProfileService.currentCustomerProfile.customerProfileId;
    this.getRepresentativeListFunc();
  }

  initTableSettings(): void {
    console.log(this.isEdit);
    this.settings_representatives = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

      mode: "external",

      delete: {
        deleteButtonContent: '<i class="nb-trash" title="Delete Representative"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="Edit Representative"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: false,
        columnTitle: "Actions"
      },

      columns: {

        // buPartner: {
        //   title: "Business Partner ID",
        //   type: "number",
        //   editable: false
        // },
        idNumber: {
          title: this.translate.instant('COMMON.Id'),
          type: "text",
          editable: false
        },
        name: {
          title: this.translate.instant('COMMUNICATIONS.Name'),
          type: "text",
          editable: false
        },
        mobile: {
          title: this.translate.instant('COMMON.MobileNumber'),
          type: "text",
          editable: false
        },
        emailId: {
          title: this.translate.instant('COMMON.EmailId'),
          type: "text",
          editable: false
        },
        isPrimary: {
          title: this.translate.instant('COMMON.IsPrimary'),
          type: "text",
          editable: false
        },
        status: {
          title: this.translate.instant('COMMON.Status'),
          type: "text",
          editable: false
        },
      }
    };
    this.settings_representatives_isEdit = {
      hideSubHeader: true,

      noDataMessage: this.translate.instant('COMMON.NoDataFound'),

      mode: "external",

      delete: {
        deleteButtonContent: '<i class="nb-trash" title="Delete Representative"></i>',
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="Edit Representative"></i>',
      },

      actions: {
        position: "right",
        add: false,
        edit: false,
        delete: true,
        columnTitle: this.translate.instant('COMMON.Actions')
      },
      columns: {
        idNumber: {
          title: this.translate.instant('COMMON.Id'),
          type: "text",
          editable: false
        },
        name: {
          title: this.translate.instant('COMMUNICATIONS.Name'),
          type: "text",
          editable: false
        },
        mobile: {
          title: this.translate.instant('COMMON.MobileNumber'),
          type: "text",
          editable: false
        },
        emailId: {
          title: this.translate.instant('COMMON.EmailId'),
          type: "text",
          editable: false
        },
        isPrimary: {
          title: this.translate.instant('COMMON.IsPrimary'),
          type: "text",
          editable: false
        },
        status: {
          title: this.translate.instant('COMMON.Status'),
          type: "text",
          editable: false
        },
      }
    };
  };


  bindRepresentativeDropDowns() {
    for (var i = 0; i < this.customerProfileData.length; i++)
      this.representativeDropDown.push({ BpName: this.customerProfileData[i]["BpName"], CustomerProfile: this.customerProfileData[i]["CustomerProfile"] });

  }

  onRepresentativeChange(event) {
    var temp_selected = _.find(this.customerProfileData, { BpName: event });
    this.ProfileId = temp_selected.CustomerProfile;
    this.getRepresentativeListFunc();
  }

  getRepresentativeListFunc() {
    this.Ng4LoadingSpinnerService.show();
    this.RepresentativesListService
      .getRepresentativesList(this.ProfileId)
      .then(res => (
        // console.log(res),
        this.loadRepresentativesListSource(res),
        this.Ng4LoadingSpinnerService.hide()
      ),
        err => (
          this.Ng4LoadingSpinnerService.hide()
        ));
  }

  loadRepresentativesListSource(res) {
    if (res) {
      if (res.profileList) {

        for (var i = 0; i < res.profileList.length; i++) {

          if (res.profileList[i].isPrimary && res.profileList[i].isPrimary === 'X') {
            res.profileList[i]['isPrimary'] = "Yes";
          }
          else {
            res.profileList[i]['isPrimary'] = "No";
          }
        }
        this.source_representatives.load(res.profileList);
      }
      if (res.isEdit) {
        this.isEdit = res.isEdit;
      }
      else {
        this.isEdit = '';
      }
    }
  }

  onAddRepresentatives() {
    this.idtypearray = [
      { Code: "1", Text: this.translate.instant('PRELIMINARY_REQUEST.NationalId') },
      // {Code: "2", Text: "SAGIA License NO"}];
      { Code: "3", Text: this.translate.instant('SIGNUP.lGCCNationalID') },
      { Code: "4 ", Text: this.translate.instant('SIGNUP.lIqamaID') }];
    this.idtypearray_text = _.pluck(this.idtypearray, 'Text');
    // console.log("Hi");
    let RepresentativesModalParams = {};
    RepresentativesModalParams = {

      header: this.translate.instant('MY_PROFILE.AddRepresentatives'),
      idtypearray: this.idtypearray,
      ProfileId: this.ProfileId,
      inputs: [

        {
          id: "idType",
          name: this.translate.instant('MY_PROFILE.ChooseIDType'),
          type: "select",
          selected: "",
          value: this.idtypearray_text,
          required: "true",
          visible: true,
          hideable: false,
        },
        {
          id: "NationalId",
          name: this.translate.instant('MY_PROFILE.ID'),
          type: "number",
          value: "",
          required: "true",
          visible: false,
          hideable: true,
        },
        {
          id: "name",
          name: this.translate.instant('MY_PROFILE.Name'),
          type: "text",
          value: "",
          required: "true",
          visible: false,
          hideable: true,
        },
        {
          id: "emailId",
          name: this.translate.instant('MY_PROFILE.EmailID'),
          type: "text",
          value: "",
          required: "true",
          visible: false,
          hideable: true,
        },
        {
          id: "mobile",
          name: this.translate.instant('MY_PROFILE.MobileNumber'),
          type: "number",
          value: "",
          required: "true",
          visible: false,
          hideable: true,
        },
        {
          id: "isPrimary",
          name: this.translate.instant('COMMON.IsPrimary'),
          type: "checkbox",
          value: false,
          required: "true",
          visible: false,
          hideable: true,
        }


      ],
      buttons: [
        {
          name: this.translate.instant('MY_PROFILE.GetDetails'),
          type: "button",
          class: "btn-success",
          state: "null",
          true_name: "getDetails",

          handler: (modal_data) => {

          }
        },
        {
          name: this.translate.instant('MY_PROFILE.ConfirmRepresentative'),
          type: "button",
          class: "btn-success",
          state: "hidden",
          true_name: "confirmDetails",

          handler: (modal_data) => {

          }
        },
        {
          name: this.translate.instant('MY_PROFILE.ConfirmRepresentative'),
          type: "button",
          class: "btn-success",
          state: "hidden",
          true_name: "refreshTable",

          handler: (modal_data) => {
            this.getRepresentativeListFunc();
          }
        }
      ]
    };


    let techInfoModal = this.modalService.open(RepresentativesModalsComponent, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    techInfoModal.componentInstance.techInfoModalsForm = RepresentativesModalParams;
    techInfoModal.componentInstance.RepresentativesModalsForm = RepresentativesModalParams;
  }

  onDeleteRepresentatives(event, delete_cancel_modal) {
    this.deleteCancelModalReference = this.modalService.open(delete_cancel_modal);
    this.deleteCancelModalReference.table_name_display = this.translate.instant('MY_PROFILE.Representative');
    this.deleteCancelModalReference.action = this.translate.instant('COMMON.Delete');
    this.deleteCancelModalReference.event = event;
  }

  onCloseDeleteCancelModal() {

    if (this.deleteCancelModalReference.action === this.translate.instant('COMMON.Delete')) {

      this.deleteCancelModalReference.close();

      this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Deletioncancelled') + "!");

    }

    else if (this.deleteCancelModalReference.action == 'Cancel') {

      this.deleteCancelModalReference.close();

    }


  }

  onDeleteConfirm() {
    this.onDeleteRepresentativesFunction();
  }

  onDeleteRepresentativesFunction() {
    var event = this.deleteCancelModalReference.event;
    var post_data = {
      "profileId": event.data.profileId ? event.data.profileId : "",
      "idType": event.data.idType ? event.data.idType : "",
      "idNumber": event.data.idNumber ? event.data.idNumber : "",
      "name": event.data.name ? event.data.name : "",
      "emailId": event.data.emailId ? event.data.emailId : "",
      "mobile": event.data.mobile ? event.data.mobile : "",
      "updStatus": "D"
    }
    // console.log(post_data);
    this.Ng4LoadingSpinnerService.show();
    this.RepresentativesListService
      .postRepresentativesList(post_data)
      .then(res => (
        // console.log(res),
        this.getRepresentativeListFunc(),
        this.deleteCancelModalReference.close(),
        this.Ng4LoadingSpinnerService.hide()
      ),
        err => (
          this.Ng4LoadingSpinnerService.hide()
        ));
  }

  handlePostSuccess(res) {
    if (res.msgId === "S")
      this.commonService.showSuccessToast(res.msgText);
    else if (res.msgId === "E")
      this.commonService.showSuccessToast(res.msgText);
  }

  findCodefromText(idType) {
    var temp = _.find(this.idtypearray, { Text: idType });
    return temp.Code;
  }

  toCustomerProfile() {
    this.router.navigateByUrl('/pages/customer-profile');
  }

  startTour() {

    // this.allPanelsExpanded = true;
    var temp_options = [
      {
        element: '#tourStep1',
        intro: this.translate.instant('MY_PROFILE.ChooseProfile')
      },
      {
        element: '#tourStep4',
        intro: this.translate.instant('MY_PROFILE.NavigatetoMyProfile')
      }
    ];
    if (this.isEdit == 'X') {
      temp_options.splice(1, 0, {
        element: '#tourStep2',
        intro: this.translate.instant('MY_PROFILE.AddRepresentatives')
      });
      temp_options.splice(2, 0, {
        element: '#tourStep3',
        intro: this.translate.instant('MY_PROFILE.RepresentativesListYoucanviewanddeletethem')
      });
    }


  }

  handleOnExitTour() {

    window.location.hash = "#" + "startTour";
    //this.ex = false;
    //this.panelStep = 1;

  }
}
