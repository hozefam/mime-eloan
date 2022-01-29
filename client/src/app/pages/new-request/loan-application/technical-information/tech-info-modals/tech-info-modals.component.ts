import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoanApplicationTechnicalInformationComponent } from '../technical-information.component'
import { CommonService } from './../../../../../services/common.service';
import { CommunicationsService } from '../../../../../services/communications.service'
import { LocalDataSource } from 'ng2-smart-table';
import { _ } from 'underscore';

@Component({
  selector: 'tech-info-modals',
  templateUrl: './tech-info-modals.component.html',
  styleUrls: ['./tech-info-modals.component.scss']
})

export class TechInfoModalsComponent implements OnInit {

  @ViewChildren('smartTable') smartTable: QueryList<ElementRef>

  CurrencyList = [];

  AnnualCapacity_temp;
  ShiftPerDay_temp;
  DaysPerYear_temp;
  PercentageEfficiency_temp;

  validation_status = 'false';
  translate: any;
  Quantity_temp = null;
  SingleCost_temp = null;
  ForeignCost_temp = null;
  discount_temp = null;

  Quantity_temp2 = null;
  SingleCost_temp2 = null;

  formattedAmount = null;
  flag_temp = 0;

  techInfoModalsForm: any = {};

  files: any = [];

  documents = {};

  documents2 = [];

  representativesTableDocuments = { url: "", documentList: [] };

  documentsTableDocuments = { url: "", documentList: [] };

  //@ViewChild('form') form;

  constructor(private communicationsService: CommunicationsService, public commonService: CommonService,
    private activeModal: NgbActiveModal, private toastr: ToastrService) {
    this.translate = this.commonService.returnTranslate();
  }

  ngOnDestroy() {
    if (this.techInfoModalsForm.alert === "true - BC - B" && this.techInfoModalsForm.operation === "View") {
      this.techInfoModalsForm.inputs[4].settings.actions.add = true;
      this.techInfoModalsForm.inputs[4].settings.actions.edit = true;
      this.techInfoModalsForm.inputs[4].settings.actions.delete = true;
      this.techInfoModalsForm.inputs[4].settings.hideSubHeader = false;
    }
  }

  ngOnInit() {
    //currencyType
    this.CurrencyList = this.commonService.currencyType;
    console.log("Tech Info Modal");
    // if(this.techInfoModalsForm.requestId != undefined){
    // this.communicationsService.getDocumentService(this.techInfoModalsForm.requestId, "p")
    // .then(requests => (
    if (this.techInfoModalsForm.typselcode === "ME" && this.techInfoModalsForm.operation === "View") {
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.actions.add = false;
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.actions.edit = false;
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.actions.delete = false;
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.hideSubHeader = true;
    } else if (this.techInfoModalsForm.typselcode === "ME") {
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.actions.add = false;
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.actions.edit = true;
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.actions.delete = false;
      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "bidAnalysis")].settings.hideSubHeader = true;
    }
    if (this.techInfoModalsForm.alert === "true - BC - B" && this.techInfoModalsForm.operation === "View") {
      this.techInfoModalsForm.inputs[4].settings.actions.add = false;
      this.techInfoModalsForm.inputs[4].settings.actions.edit = false;
      this.techInfoModalsForm.inputs[4].settings.actions.delete = false;
      this.techInfoModalsForm.inputs[4].settings.hideSubHeader = true;
    }
    var temp = this.techInfoModalsForm.header.split(" ");
    if (temp[0] != this.translate.instant('TECHNICAL_INFORMATION.add') && this.techInfoModalsForm.documentjson != undefined)
      this.resolveDocuments(this.techInfoModalsForm);
    if (temp[0] === this.translate.instant('TECHNICAL_INFORMATION.Edit') && this.techInfoModalsForm.typselcode === 'ME') {
      // if(input.id==="TechSpecInc"){
      if (this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechSpecInc")].selected === "No") {
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].hideable = false;
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].required = "true";
      } else {
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].hideable = true;
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].required = "false";
      }
      // }
      // if(input.id==="SourceOrigin"){
      if (this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "SourceOrigin")].selected === "Import") {
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].hideable = false;
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].required = "true";
      } else {
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].hideable = true;
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].required = "false";
      }
      //}
    }
    // if(temp[0] === this.translate.instant('TECHNICAL_INFORMATION.Edit') && this.techInfoModalsForm.typselcode === 'FU'){

    // }
    //  err => (console.log(err)));
    //}
    for (var i = 0; i < this.techInfoModalsForm.inputs.length; i++)
      this.techInfoModalsForm.inputs[i]["validation_status"] = 'false';
  }


  onngmodelchange(input, techInfoModalsForm) {
    if (input.cost === "true")
      input.value = input.value.replace("SAR", "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');
    // var temp = this.techInfoModalsForm.header.split(" ");
    // input.value = (+input.value.replace(/[^0-9\.]/g, ''), 10);
    // input.value = input.value.toFixed(2) + "";
    // for (var i = 0; i < techInfoModalsForm.inputs.length; i++) {
    //   if (input.id === techInfoModalsForm.inputs[i].id) {
    //     techInfoModalsForm.inputs[i].value = input.value;
    //   }
    // }
  }

  numberOnly(event): boolean {

    this.flag_temp = 1;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  onTableAdd(table) {

    this.smartTable.toArray().forEach(tableElement => {

      if (tableElement["settings"].noDataMessage == table.settings.noDataMessage) {

        tableElement["grid"]["createFormShown"] = true;
        tableElement["grid"].getNewRow();

      }

    });

  }


  onSubmit(button, techInfoModalsForm) {
    var flag = 0;

    /*
        for(var i = 0; i < this.techInfoModalsForm.inputs.length; i++) {
          
          if(this.techInfoModalsForm.inputs[i].required == "true" && this.techInfoModalsForm.inputs[i].value == "")
            flag = 1;
          
          if(flag == 1) {
    
            i = this.techInfoModalsForm.inputs.length;
    
            this.showFailfureToast("The required fields cannot be empty !")
    
          }
    
        }
        */
    //console.log("Clicked");
    if (button.trueName === "add_bcw" || button.trueName === "edit_bcw") {
      var list_floor = [];
      for (var i = 0; i < techInfoModalsForm.inputs[5].source.data.length; i++)
        list_floor.push(techInfoModalsForm.inputs[5].source.data[i].Floor);

      // console.log(_.min(list_floor));
      // console.log(_.max(list_floor));
      // console.log(_.range(+_.min(list_floor), (+_.max(list_floor)+1),1));
      var range = _.range(+_.min(list_floor), (+_.max(list_floor) + 1), 1);
      var flag_range = 0;
      for (var i = 0; i < techInfoModalsForm.inputs[5].source.data.length; i++) {
        if (_.indexOf(range, +techInfoModalsForm.inputs[5].source.data[i].Floor) != -1)
          flag_range = flag_range + 1;
      }
      if (flag_range === range.length) {
        this.techInfoModalsForm.buttons[0].handler(this.techInfoModalsForm);
        this.activeModal.close();
      } else {
        this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Pleasespecifyallthefloors!'));
      }
    }
    //here
    else if (button.trueName === "CreateBCW") {
      this.techInfoModalsForm.inputs[0].validation_status = 'false';
      this.techInfoModalsForm.inputs[1].validation_status = 'false';
      if (techInfoModalsForm.inputs[0].selected) {
        if (techInfoModalsForm.inputs[1].hideable === false && techInfoModalsForm.inputs[1].value === "") {
          this.techInfoModalsForm.inputs[1].validation_status = 'true';
        }
        else {
          this.techInfoModalsForm.buttons[0].handler(techInfoModalsForm);
          this.activeModal.close();
        }
      }
      else {
        this.techInfoModalsForm.inputs[0].validation_status = 'true';
      }
    }
    else if (button.trueName === "CreateBCW") {
      this.techInfoModalsForm.inputs[0].validation_status = 'false';
      this.techInfoModalsForm.inputs[1].validation_status = 'false';
      if (techInfoModalsForm.inputs[0].selected) {
        if (techInfoModalsForm.inputs[1].hideable === false && techInfoModalsForm.inputs[1].value === "") {
          this.techInfoModalsForm.inputs[1].validation_status = 'true';
        }
        else {
          this.techInfoModalsForm.buttons[0].handler(techInfoModalsForm);
          this.activeModal.close();
        }
      }
      else {
        this.techInfoModalsForm.inputs[0].validation_status = 'true';
      }
    }
    else if (button.name == "Add Quotation") {
      //console.log("Add quot");
      this.techInfoModalsForm.buttons[1].handler(this.techInfoModalsForm);
      // this.activeModal.close();
    }
    else if (flag == 0) {

      let flag1 = 0;
      var temp_req = 0;
      var temp = this.techInfoModalsForm.header.split(" ");
      let technicaltableinfoModalParams = techInfoModalsForm;
      for (var i = 0; i < technicaltableinfoModalParams.inputs.length; i++) {
        this.techInfoModalsForm.inputs[i].validation_status = 'false';
        if (technicaltableinfoModalParams.inputs[i].type != "select") {
          if (technicaltableinfoModalParams.inputs[i].type === "file_multiple" || technicaltableinfoModalParams.inputs[i].type === "file_single") {
            if (technicaltableinfoModalParams.inputs[i].file === "" && technicaltableinfoModalParams.inputs[i].required === "true") {
              if ((temp[4] === this.translate.instant('TECHNICAL_INFORMATION.Attachments') && this.techInfoModalsForm.alert == "true - BCW - Attachment") || (temp[0] === this.translate.instant('TECHNICAL_INFORMATION.Edit') && (this.techInfoModalsForm.typselcode === "RA" || this.techInfoModalsForm.typselcode === "KN" || this.techInfoModalsForm.typselcode === "VE" || this.techInfoModalsForm.typselcode === "IT" || this.techInfoModalsForm.typselcode === "PR" || this.techInfoModalsForm.typselcode === "SA"))) {
                if (this.documents["documentList"].length > 0) {
                  flag1 = flag1 + 1;
                }
              }
              if (this.techInfoModalsForm.alert === "true - BCW - Attachment" && technicaltableinfoModalParams.inputs[i].required === "true") {
                if (this.documents["documentList"]) {
                  var flag_temp = 0;
                  for (var o = 0; o < this.documents["documentList"].length; o++) {
                    if (this.documents["documentList"][o].DocumentDefId === "392") {
                      flag1 = flag1 + 1;
                      flag_temp = 1;
                    }
                  }
                  if (flag_temp === 0) {
                    // this.showFailureToast("Submit " + technicaltableinfoModalParams.inputs[i].name);
                    this.techInfoModalsForm.inputs[i].validation_status = 'true';
                  }

                }
              }
              if (temp[0] === this.translate.instant('TECHNICAL_INFORMATION.Edit') && (this.techInfoModalsForm.typselcode === "ME")) {
                if (this.documents["documentList"].length != 0) {
                  for (var j = 0; j < this.documents["documentList"].length; j++) {

                    if (this.techInfoModalsForm.inputs[i].id === "MachineryLayoutAttachment" && this.documents["documentList"][j].DocumentDefName === "Machinery Layout") {
                      flag1 = flag1 + 1;
                      break;
                    } else if (this.techInfoModalsForm.inputs[i].id === "MachineryQuotationAttachment" && this.documents["documentList"][j].DocumentDefName === "Machinery Quotation") {
                      flag1 = flag1 + 1;
                      break;
                    } else if (this.techInfoModalsForm.inputs[i].id === "CustomClearanceAttachment" && this.documents["documentList"][j].DocumentDefName === "Custom Clearance") {
                      flag1 = flag1 + 1;
                      break;
                    } else if (this.techInfoModalsForm.inputs[i].id === "TechnicalSpecification" && this.documents["documentList"][j].DocumentDefName === "Technical Specification") {
                      flag1 = flag1 + 1;
                      break;
                    } else if (j === (this.documents["documentList"].length - 1)) {
                      this.techInfoModalsForm.inputs[i].validation_status = 'true';
                    }


                  }
                } else {
                  this.techInfoModalsForm.inputs[i].validation_status = 'true';
                }
              }

            }
            else if (technicaltableinfoModalParams.inputs[i].file != "" && technicaltableinfoModalParams.inputs[i].required === "true") {
              flag1 = flag1 + 1;
            }
            if (temp[0] === this.translate.instant('TECHNICAL_INFORMATION.add') && technicaltableinfoModalParams.inputs[i].file === "" && technicaltableinfoModalParams.inputs[i].required === "true" && this.techInfoModalsForm.alert != "true - BCW - Attachment") {
              // this.showFailureToast("Submit " + technicaltableinfoModalParams.inputs[i].name);
              this.techInfoModalsForm.inputs[i].validation_status = 'true';
            }
            // else{
            //   this.showFailureToast("Submit " + technicaltableinfoModalParams.inputs[i].name);
            // }
          }
          else {
            if ((technicaltableinfoModalParams.inputs[i].value != "") && technicaltableinfoModalParams.inputs[i].required === "true" && (technicaltableinfoModalParams.inputs[i].hideable === undefined ? true : (technicaltableinfoModalParams.inputs[i].hideable ? false : true))) {
              flag1 = flag1 + 1;
            }
            if ((technicaltableinfoModalParams.inputs[i].value === "") && technicaltableinfoModalParams.inputs[i].required === "true" && (technicaltableinfoModalParams.inputs[i].hideable === undefined ? true : (technicaltableinfoModalParams.inputs[i].hideable ? false : true))) {
              // this.showFailureToast("Enter " + technicaltableinfoModalParams.inputs[i].name);
              this.techInfoModalsForm.inputs[i].validation_status = 'true';
            }
            if (technicaltableinfoModalParams.inputs[i].id === "ProdLineMachinery") {
              if ((technicaltableinfoModalParams.inputs[i].value.length === 0) && technicaltableinfoModalParams.inputs[i].required === "true" && (technicaltableinfoModalParams.inputs[i].hideable === undefined ? true : (technicaltableinfoModalParams.inputs[i].hideable ? false : true))) {
                this.techInfoModalsForm.inputs[i].validation_status = 'true';
              }
            }
          }
        }
        else if (technicaltableinfoModalParams.inputs[i].type === "select") {
          if (technicaltableinfoModalParams.inputs[i].selected != "" && technicaltableinfoModalParams.inputs[i].required === "true") {
            flag1 = flag1 + 1;
          }
          if (technicaltableinfoModalParams.inputs[i].selected === "" && technicaltableinfoModalParams.inputs[i].required === "true") {
            // this.showFailureToast("Select " + technicaltableinfoModalParams.inputs[i].name);
            this.techInfoModalsForm.inputs[i].validation_status = 'true';
          }
        }
        //var temp_hideable = technicaltableinfoModalParams.inputs[i].hideable ? technicaltableinfoModalParams.inputs[i].hideable : true;
        var temp_hideable = (technicaltableinfoModalParams.inputs[i].hideable === undefined ? true : (technicaltableinfoModalParams.inputs[i].hideable ? false : true));
        if (technicaltableinfoModalParams.inputs[i].required === "true" && temp_hideable)
          temp_req = temp_req + 1;
      }
      if (flag1 === temp_req) {
        if (button.trueName === "add_bcw_2" || button.trueName === "edit_bcw_2") {
          var list_floor = [];
          for (var i = 0; i < techInfoModalsForm.inputs[4].source.data.length; i++)
            list_floor.push(techInfoModalsForm.inputs[4].source.data[i].Floor);
          var range = _.range(+_.min(list_floor), (+_.max(list_floor) + 1), 1);
          var flag_range = 0;
          for (var i = 0; i < techInfoModalsForm.inputs[4].source.data.length; i++) {
            if (_.indexOf(range, +techInfoModalsForm.inputs[4].source.data[i].Floor) != -1)
              flag_range = flag_range + 1;
          }
          if (flag_range === range.length) {
            this.techInfoModalsForm.buttons[0].handler(this.techInfoModalsForm);
            this.activeModal.close();
          } else {
            this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Pleasespecifyallthefloors!'));
          }
        }
        else {
          this.techInfoModalsForm.buttons[0].handler(this.techInfoModalsForm);
          this.activeModal.close();
        }
      }
      else {
        // this.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.PleaseEnterMandatoryFields'));
        this.showFailureToast(this.translate.instant('CLAIMS.PleaseEnterallmandatoryfields'));
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }
  onCreatePanel() {
    //  console.log("sdfsd");
  }

  showFailureToast(message) {
    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
      enableHtml: true,
      // type: 'trustedHtml'
    });
  }

  onDelete(event) {

    if (window.confirm('Are you sure?'))
      event.confirm.resolve();
    else
      event.confirm.reject();

  }

  onChangeEdit(input, techInfoModalsForm, event) {
    if (techInfoModalsForm.typselcode === "BC") {
      if (event.newData.Floor != "" && event.newData.Area != "") {
        if (isNaN(event.newData.Floor) === false && isNaN(event.newData.Area) === false) {
          if (event.newData.Floor != "0") {
            if (event.newData.Area != "0") {
              //  if(_.findWhere(input.source.data, {Floor: event.newData.Floor}) === undefined){
              event.confirm.resolve(event.newData);
              //}
              //else
              // this.commonService.showFailureToast("Floor already exists");
            }
            else {
              this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Areashouldbegreaterthan0'));
            }
            // event.confirm.resolve(event.newData);
          }
          else {
            this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.FloorNo.shouldbegreaterthan0'));
          }

        } else {
          this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.InvalidEntry'));
        }
      }
      else {
        this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.InvalidEntry'));
      }
    }
    if (techInfoModalsForm.typselcode === "ME") {
      event.confirm.resolve(event.newData);
    }
  }

  onChange(input, techInfoModalsForm, event) {

    if (input.id == "TotalCostCurr" && techInfoModalsForm.typselcode === "KN") {

      var tempCurrencyKey = "";
      input.selected = event;
      var temp_Currency_list = this.CurrencyList.find((o) => o.Name == this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TotalCostCurr")].selected);
      if (temp_Currency_list)
        tempCurrencyKey = temp_Currency_list.Code;

      this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Currency")].currency = tempCurrencyKey + " ";
    }
    // console.log("Tech info ");
    if (input.id === "Checkbox_Fees") {
      input.value = !input.value;
      if (input.value === true) {
        techInfoModalsForm.inputs[3].hideable = false;
        techInfoModalsForm.inputs[3].required = "true";
        techInfoModalsForm.inputs[4].hideable = false;
        techInfoModalsForm.inputs[4].required = "true";
      }
      else if (input.value === false) {
        techInfoModalsForm.inputs[3].hideable = true;
        techInfoModalsForm.inputs[3].required = "false";
        techInfoModalsForm.inputs[4].hideable = true;
        techInfoModalsForm.inputs[4].required = "false";
      }

    }
    if (techInfoModalsForm.isProdMachExtra === "Y" && techInfoModalsForm.isLogistics != true) {

      //   if(input.id === "AnnualCapacity"){
      if (input.id === "Rate") {
        this.AnnualCapacity_temp = input.value;
      } else if (techInfoModalsForm.inputs[2].value != "") {
        this.AnnualCapacity_temp = techInfoModalsForm.inputs[2].value;
      }
      if (input.id === "ShiftPerDay") {
        this.ShiftPerDay_temp = input.value;
      } else if (techInfoModalsForm.inputs[5].value != "") {
        this.ShiftPerDay_temp = techInfoModalsForm.inputs[5].value;
      }
      if (input.id === "DaysPerYear") {
        this.DaysPerYear_temp = input.value;
      } else if (techInfoModalsForm.inputs[6].value != "") {
        this.DaysPerYear_temp = techInfoModalsForm.inputs[6].value;
      }
      if (input.id === "PercentageEfficiency") {
        if (input.value <= 100)
          this.PercentageEfficiency_temp = (+input.value / 100);
        else {
          this.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.EnterValidPercentage'));
          techInfoModalsForm.inputs[7].value = "";
        }
      } else if (techInfoModalsForm.inputs[7].value != "") {
        this.PercentageEfficiency_temp = (+techInfoModalsForm.inputs[7].value / 100);
      }
      if (this.AnnualCapacity_temp != null && this.ShiftPerDay_temp != null && this.DaysPerYear_temp != null && this.PercentageEfficiency_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.AnnualCapacity_temp * +this.ShiftPerDay_temp * +this.DaysPerYear_temp * +this.PercentageEfficiency_temp + "";
        technicaltableinfoModalParams.inputs[8].value = parseFloat(temp).toFixed(2) + "";
      }
      if (input.id === "ProdLineMachinery") {
        if (input.value.length != 0)
          input.validation_status = "false";
      }
      //   }
    }
    // this.validation_status = 'true';
    if (techInfoModalsForm.isBcw === "Y") {
      if (input.id === "isCost") {
        if (event === "No") {
          techInfoModalsForm.inputs[1].hideable = true;
          techInfoModalsForm.inputs[2].hideable = true;
          techInfoModalsForm.inputs[3].hideable = true;
        } else if (event === "Yes") {
          techInfoModalsForm.inputs[1].hideable = false;
          techInfoModalsForm.inputs[2].hideable = false;
          techInfoModalsForm.inputs[3].hideable = false;
        }
      }
    }

    if (techInfoModalsForm.alert === "true - BC - B") {
      if (input.id === "ItemDesc") {
        if (event === "Others") {
          techInfoModalsForm.inputs[3].hideable = false;
          techInfoModalsForm.inputs[3].required = "true";
        } else {
          techInfoModalsForm.inputs[3].hideable = true;
          techInfoModalsForm.inputs[3].required = "false";
          techInfoModalsForm.inputs[3].value = "";
        }
      }
      if (input.id === "FloorArea") {
        if (event.newData.Floor != "" && event.newData.Area != "") {
          if (isNaN(event.newData.Floor) === false && isNaN(event.newData.Area) === false) {
            if (event.newData.Floor != "0") {
              if (event.newData.Area != "0") {
                //   var temp_floor = (event.newData.Floor + " ");
                //  // event.newData.Floor = event.newData.Floor + " ";
                //   console.log(_.findWhere(input.source.data, {Floor: event.newData.Floor}));
                //   console.log(_.findWhere(input.source.data, {Floor: temp_floor}));
                if (_.findWhere(input.source.data, { Floor: event.newData.Floor }) === undefined) {
                  event.confirm.resolve(event.newData);
                }
                else
                  this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Flooralreadyexists'));
              }
              else {
                this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.Areashouldbegreaterthan0'));
              }
              // event.confirm.resolve(event.newData);
            }
            else {
              this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.FloorNo.shouldbegreaterthan0'));
            }

          } else {
            this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.InvalidEntry'));
          }
        }
        else {
          this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.InvalidEntry'));
        }
      }
    }

    //this.techInfoModalsForm.inputs[].validation_status = 'true';
    input.validation_status = 'false';
    var header = techInfoModalsForm.header.split(" ");
    //var operation = header[0];
    var operation = techInfoModalsForm.operation;
    //if (techInfoModalsForm.header === "Add Vehicles" || techInfoModalsForm.header === "Edit Vehicles" || techInfoModalsForm.header === "Add Furnitures" || techInfoModalsForm.header === "Edit Furnitures") {
    if ((operation === "Add" || operation === "Edit") && techInfoModalsForm.typselcode === "VE") {
      if (input.id === "Quantity") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[2].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[2].value;
      }
      if (input.id === "SingleCost") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[4].value != "") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[4].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[5].value = parseFloat(temp).toFixed(2) + "";
      }
      if (input.id === "VehicleType") {
        // if (event === "Others") {
        //   techInfoModalsForm.inputs[1].required = "true";
        // }
        // else {
        //   techInfoModalsForm.inputs[1].required = "false";
        // }
      }
    }

    if ((operation === "Add" || operation === "Edit") && techInfoModalsForm.typselcode === "FU") {
      if (input.id === "Quantity") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[1].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[1].value;
      }
      if (input.id === "SingleCost") {
        techInfoModalsForm.inputs[3].value = this.removeSAR(techInfoModalsForm.inputs[3].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[3].value != "") {
        techInfoModalsForm.inputs[3].value = this.removeSAR(techInfoModalsForm.inputs[3].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[3].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[4].value = parseFloat(temp).toFixed(2) + "";
      }

      // if(input.id === "VehicleType"){
      //   if (event === "Others") {
      //    // techInfoModalsForm.inputs[18].hideable = false;
      //     techInfoModalsForm.inputs[1].required = "true";
      //   } else {
      //    // techInfoModalsForm.inputs[18].hideable = true;
      //     techInfoModalsForm.inputs[1].required = "false";
      //   }
      // }
    }
    //  if (techInfoModalsForm.header === "Add Machinery and Equipments" || techInfoModalsForm.header === "Edit Machinery and Equipments") {
    if ((operation === "Add" || operation === "Edit") && (techInfoModalsForm.typselcode === "ME")) {
      if (input.id === "Quantity") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Quantity")].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Quantity")].value;
      }
      if (input.id === "Cost") {
        techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Cost")].value = this.removeSAR(techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Cost")].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Cost")].value != "") {
        techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Cost")].value = this.removeSAR(techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Cost")].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "Cost")].value;
      }
      if (input.id === "ForeignCost") {
        techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].value = this.removeSAR(techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].value);
        this.ForeignCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].value != "") {
        techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].value = this.removeSAR(techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].value);
        this.ForeignCost_temp = techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TotalCost")].value = parseFloat(temp).toFixed(2) + "";
      }
      if (this.Quantity_temp != null && this.ForeignCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.ForeignCost_temp) + "";
        technicaltableinfoModalParams.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TotalForeignCost")].value = parseFloat(temp).toFixed(2) + "";
      }
      if (input.id == "ForeignCurrency") {

        var tempCurrencyKey = "";
        input.selected = event;
        var temp_Currency_list = this.CurrencyList.find((o) => o.Name == this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCurrency")].selected);
        if (temp_Currency_list)
          tempCurrencyKey = temp_Currency_list.Code;

        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "ForeignCost")].currency = tempCurrencyKey + " ";
        this.techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TotalForeignCost")].currency = tempCurrencyKey + " ";
      }
      if (input.id === "TechSpecInc") {
        if (event === "No") {
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].hideable = false;
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].required = "true";
        } else {
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].hideable = true;
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "TechnicalSpecification")].required = "false";
        }
      }
      if (input.id === "SourceOrigin") {
        if (event === "Import") {
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].hideable = false;
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].required = "true";
        } else {
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].hideable = true;
          techInfoModalsForm.inputs[this.findIndexFromId(this.techInfoModalsForm.inputs, "CustomClearanceAttachment")].required = "false";
        }
      }

    }

    //if (techInfoModalsForm.header === "Edit Information Technology" || techInfoModalsForm.header === "Add Information Technology") {
    if ((operation === "Add" || operation === "Edit") && (techInfoModalsForm.typselcode === "IT")) {
      if (input.id === "Quantity") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[3].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[3].value;
      }
      if (input.id === "SingleCost") {
        techInfoModalsForm.inputs[5].value = this.removeSAR(techInfoModalsForm.inputs[5].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[5].value != "") {
        techInfoModalsForm.inputs[5].value = this.removeSAR(techInfoModalsForm.inputs[5].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[5].value;
      }
      if (input.id === "Discount") {
        if (input.value > 100 || input.value < 0) {
          let technicaltableinfoModalParams = techInfoModalsForm;
          this.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.EnterValidPercentage'));
          technicaltableinfoModalParams.inputs[7].value = "";
        } else {
          this.discount_temp = input.value;
        }
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[6].value = parseFloat(temp).toFixed(2) + "";
      }

      if (this.Quantity_temp != null && this.SingleCost_temp != null && this.discount_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp_discount = (parseFloat(technicaltableinfoModalParams.inputs[6].value) * parseFloat(this.discount_temp)) / 100;
        technicaltableinfoModalParams.inputs[8].value = +technicaltableinfoModalParams.inputs[6].value - temp_discount;
      } else {
        let technicaltableinfoModalParams = techInfoModalsForm;
        technicaltableinfoModalParams.inputs[8].value = technicaltableinfoModalParams.inputs[6].value;
      }
    }

    //if (techInfoModalsForm.header === "Add Raw Materials" || techInfoModalsForm.header === "Edit Raw Materials") {
    if ((operation === "Add" || operation === "Edit") && (techInfoModalsForm.typselcode === "RA")) {
      if (input.id === "RawMatQuanPerUomProd") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[2].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[2].value;
      }
      if (input.id === "RawMatCostUom") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[4].value != "") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[4].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[5].value = parseFloat(temp).toFixed(2) + "";
        //   value.toString();
      }
    }


    // if (techInfoModalsForm.header === "Add Man Power" || techInfoModalsForm.header === "Edit Man Power") {
    if ((operation === "Add" || operation === "Edit") && (techInfoModalsForm.typselcode === "MA")) {
      if (input.id === "NoPositions") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[3].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[3].value;
      }
      if (input.id === "BasicMonthSal") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[4].value != "") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[4].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[5].value = parseFloat(temp).toFixed(2) + "";
      }


      // if(input.id === "TotalCostMonthSal"){
      //   this.Quantity_temp2 = input.value;
      // }
      // if(input.id === "AddBenefPerc"){
      //   this.SingleCost_temp2 = input.value;
      // }
      if (input.id === "AddBenefPerc") {
        //  console.log("dkbfkajh");
        if (input.value > 100 || input.value < 0) {
          let technicaltableinfoModalParams = techInfoModalsForm;
          this.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.EnterValidPercentage'));
          technicaltableinfoModalParams.inputs[6].value = "";
        }
        else {
          this.SingleCost_temp2 = input.value;
        }
      }
      let technicaltableinfoModalParams = techInfoModalsForm;
      if (this.SingleCost_temp2 != null) {
        if (technicaltableinfoModalParams.inputs[5].value != "") {
          var SingleCost_temp3 = (parseFloat(technicaltableinfoModalParams.inputs[5].value) * parseFloat(this.SingleCost_temp2)) / 100;
          var temp = +technicaltableinfoModalParams.inputs[5].value + +SingleCost_temp3 + "";
          technicaltableinfoModalParams.inputs[7].value = parseFloat(temp).toFixed(2) + "";
        }
      }

    }

    // if (techInfoModalsForm.header === "Add Utilities" || techInfoModalsForm.header === "Edit Utilities") {
    if ((operation === "Add" || operation === "Edit") && (techInfoModalsForm.typselcode === "UT")) {
      if (input.id === "TotalUse") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[3].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[3].value;
      }
      if (input.id === "UnitPrice") {
        techInfoModalsForm.inputs[2].value = this.removeSAR(techInfoModalsForm.inputs[2].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[2].value != "") {
        techInfoModalsForm.inputs[2].value = this.removeSAR(techInfoModalsForm.inputs[2].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[2].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[4].value = parseFloat(temp).toFixed(2) + "";
        //var total_cost_temp = parseFloat(event.data.TotalCost).toFixed(2) + "";
      }
    }

    //if (techInfoModalsForm.header === "Add Safety" || techInfoModalsForm.header === "Edit Safety") {
    if ((operation === "Add" || operation === "Edit") && (techInfoModalsForm.typselcode === "SA")) {
      if (input.id === "Quantity") {
        this.Quantity_temp = input.value;
      } else if (techInfoModalsForm.inputs[2].value != "") {
        this.Quantity_temp = techInfoModalsForm.inputs[2].value;
      }
      if (input.id === "SingleCost") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = input.value;
      } else if (techInfoModalsForm.inputs[4].value != "") {
        techInfoModalsForm.inputs[4].value = this.removeSAR(techInfoModalsForm.inputs[4].value);
        this.SingleCost_temp = techInfoModalsForm.inputs[4].value;
      }
      if (this.Quantity_temp != null && this.SingleCost_temp != null) {
        let technicaltableinfoModalParams = techInfoModalsForm;
        var temp = +this.removeSAR(this.Quantity_temp) * +this.removeSAR(this.SingleCost_temp) + "";
        technicaltableinfoModalParams.inputs[5].value = parseFloat(temp).toFixed(2) + "";
        //var total_cost_temp = parseFloat(event.data.TotalCost).toFixed(2) + "";
      }
    }


    // if(techInfoModalsForm.header === "Add Machinery and Equipments" || techInfoModalsForm.header === "Edit Machinery and Equipments")
    // {
    //   if(input.id === "Cost"){
    //     let technicaltableinfoModalParams = techInfoModalsForm;
    //     technicaltableinfoModalParams.inputs[9].value = this.convertToDec(input);
    //   }
    //   if(input.id === "TotalCost"){
    //     let technicaltableinfoModalParams = techInfoModalsForm;
    //     technicaltableinfoModalParams.inputs[11].value = this.convertToDec(input);
    //   }
    // }
    //console.log("uashdjasdhkjl");



  }

  convertToDec(input) {
    //console.log("asdfasd");
    var temp2;
    temp2 = Number(input.value).toFixed(2);
    temp2 = "SAR " + temp2;
    return temp2;
  }

  onFileChange(event, input_name, techInfoModalsForm1, input) {
    //  console.log("file change");

    let format;
    let format_length;
    if (input.type === "file_multiple" || input.type === "file_single") {
      // console.log("Files");
    }
    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {
      format = this.files[i].name.split('.');
      format_length = format.length;
      if (this.files[i].size > this.commonService.documentSizeLimits.documentSize100MB) {
        this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.FileSizeShouldBeLesserThan100MB'));
        event.target.value = '';
        break;
      }
      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {
        this.commonService.showFailureToast(this.translate.instant('TECHNICAL_INFORMATION.FileFormatNotSupported'));
        event.target.value = '';
        break;
      }
      else if (i === (this.files.length - 1)) {
        for (var i = 0; i < techInfoModalsForm1.inputs.length; i++) {
          if (techInfoModalsForm1.inputs[i].name === input_name) {
            techInfoModalsForm1.inputs[i].file = this.files;
            input.validation_status = 'false';
          }
        }
      }
    }


  }



  resolveDocuments(techInfoModalsForm) {
    var temp = this.techInfoModalsForm.header.split(" ");
    var operation = techInfoModalsForm.operation;
    if (this.techInfoModalsForm.event) {
      var searchguId = this.techInfoModalsForm.event.data.GuiId;
    }
    else if (techInfoModalsForm.GuiId != 0) {
      var searchguId = techInfoModalsForm.GuiId;
    }

    if (searchguId) {
      var documentArray = [];

      for (var i = 0; i < this.techInfoModalsForm.documentjson.documentList.length; i++) {

        if ((+this.techInfoModalsForm.documentjson.documentList[i].RelatedEntityId) === (+searchguId)) {
          // console.log(this.techInfoModalsForm.documentjson.documentList[i]);
          // if(guisearch_list)
          //console.log("hi");
          this.techInfoModalsForm.documentjson.documentList[i]["docUrl"] = this.techInfoModalsForm.documentjson.url
            .replace("entityId", this.techInfoModalsForm.documentjson.documentList[i].EntityId)
            .replace("refId", this.techInfoModalsForm.documentjson.documentList[i].RefId)
            .replace("documentId", this.techInfoModalsForm.documentjson.documentList[i].DocumentId)
            .replace("fileName", this.techInfoModalsForm.documentjson.documentList[i].FileName)
          documentArray.push(this.techInfoModalsForm.documentjson.documentList[i]);

        }
      }

      this.documents = {
        "url": this.techInfoModalsForm.documentjson.url,
        "documentList": documentArray,
        "method": ""
      };
      if (operation === "View") {
        this.documents["method"] = "view";
      }
      var sno = [];
      var document_name = [];
      var document_type = [];
      var doc_temp = {};
      var temp;
      for (var i = 0; i < documentArray.length; i++) {
        //var documents2_temp = {"sno": i, "documentname": documentArray[i].FileName};
        document_name = documentArray[i].FileName;
        document_type = documentArray[i].DocumentDefName;
        doc_temp = { "documentname": document_name, "documenttype": document_type };
        this.documents2.push(doc_temp);
      }
      //this.documents2 = {"sno": sno, "documentname": document_name};
      //  if(temp[0] === this.translate.instant('TECHNICAL_INFORMATION.Edit') && this.techInfoModalsForm.typselcode === 'FU'){
      //   this.techInfoModalsForm.inputs[6].file = 
      // }
    }
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  removeSAR(value) {
    var temp = value.replace(/[^\d.-]/g, '');
    return (parseInt(temp).toFixed(2) + "");
  }

  findIndexFromId(array, id) {
    if (array && array.length != 0 && (id + "") != "") {
      return _.findIndex(array, function (num) { return (num.id + "") === id });
    } else {
      return -1;
    }
  }

}