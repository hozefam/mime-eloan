import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { CommunicationsService } from '../../../../services/communications.service'
import { LocalDataSource } from 'ng2-smart-table';
import { _ } from 'underscore';
import { RepresentativesListService } from "../../../../services/representativesList.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
//import { truncate } from 'fs';


@Component({
  selector: 'representatives-modals',
  templateUrl: './representatives-modals.component.html',
  styleUrls: ['./representatives-modals.component.scss']
})

export class RepresentativesModalsComponent implements OnInit {

  @ViewChildren('smartTable') smartTable: QueryList<ElementRef>

  AnnualCapacity_temp;
  ShiftPerDay_temp;
  DaysPerYear_temp;
  PercentageEfficiency_temp;

  validation_status = 'false';
  translate: any;
  Quantity_temp = null;
  SingleCost_temp = null;

  Quantity_temp2 = null;
  SingleCost_temp2 = null;

  formattedAmount = null;
  flag_temp = 0;

  techInfoModalsForm: any = {};
  
  RepresentativesModalsForm: any = {};

  files: any = [];

  documents = {};

  documents2 = [];

  representativesTableDocuments = { url: "", documentList: [] };

  documentsTableDocuments = { url: "", documentList: [] };

  //@ViewChild('form') form;

  constructor(private RepresentativesListService: RepresentativesListService, private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService, private communicationsService: CommunicationsService, public commonService: CommonService, private activeModal: NgbActiveModal, private toastr: ToastrService) {
    this.translate = this.commonService.returnTranslate();
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    for (var i = 0; i < this.RepresentativesModalsForm.inputs.length; i++)
    this.RepresentativesModalsForm.inputs[i]["validation_status"] = 'false';
  }


  onngmodelchange(input, techInfoModalsForm) {
  
  }

  numberOnly(event): boolean {

    this.flag_temp = 1;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
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

setValidationStatus(i, RepresentativesModalsForm) {
  RepresentativesModalsForm.inputs[i].validation_status = "true";
  return ""
}
  onSubmit(button, RepresentativesModalsForm) {
    if(button.true_name === "getDetails"){
      var profileId_temp = RepresentativesModalsForm.ProfileId;
      var idNumber_temp = RepresentativesModalsForm.inputs[1].value === "" ? this.setValidationStatus(1, RepresentativesModalsForm) : RepresentativesModalsForm.inputs[1].value;
      var idType_temp = RepresentativesModalsForm.inputs[0].selected != "" ? this.findCodefromText(RepresentativesModalsForm.inputs[0].selected, RepresentativesModalsForm.idtypearray) : this.setValidationStatus(0, RepresentativesModalsForm);
      if(profileId_temp && idNumber_temp && idType_temp){
      this.Ng4LoadingSpinnerService.show();
            this.RepresentativesListService//profileid, idNumber, idType
            .getRepresentativesListUsingId(profileId_temp, idNumber_temp, idType_temp)
            .then(res => (
              // console.log(res),
              this.bindGetRepListById(res, RepresentativesModalsForm),
              this.Ng4LoadingSpinnerService.hide()
              ), 
            err => (
              this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong')),
              this.Ng4LoadingSpinnerService.hide()
              ));
            }
            else {
              this.commonService.showFailureToast(this.translate.instant('COMMON.Enterallthemandatoryfields'));
            }
      }
      if(button.true_name === "confirmDetails"){
        var flag_mandat = 0;
        var flag_check = 0;
        for(var i=0; i<RepresentativesModalsForm.inputs.length; i++){
          if(RepresentativesModalsForm.inputs[i].required === "true"){
            flag_mandat = flag_mandat + 1;
          }
          if(RepresentativesModalsForm.inputs[i].required === "true" && ( RepresentativesModalsForm.inputs[i].type === "checkbox" ? (RepresentativesModalsForm.inputs[i].value == true || RepresentativesModalsForm.inputs[i].value == false) : RepresentativesModalsForm.inputs[i].value != "" ) && (RepresentativesModalsForm.inputs[i].selected ? (RepresentativesModalsForm.inputs[i].selected === "" ? false : true) : true)){
            flag_check =  flag_check + 1;
          } else {
            this.RepresentativesModalsForm.inputs[i]["validation_status"] = 'true';
          }
        }
        if(flag_mandat === flag_check){
          var isPrimaryCheck = "";
          if(RepresentativesModalsForm.inputs[5].value === true){
            isPrimaryCheck = "X";
          }
        var post_data = {
          "profileId": RepresentativesModalsForm.ProfileId,
          "idType": this.findCodefromText(RepresentativesModalsForm.inputs[0].selected, RepresentativesModalsForm.idtypearray),
          "idNumber": RepresentativesModalsForm.inputs[1].value,
          "name": RepresentativesModalsForm.inputs[2].value,
          "emailId": RepresentativesModalsForm.inputs[3].value,
          "mobile": RepresentativesModalsForm.inputs[4].value,
          "isPrimary": isPrimaryCheck,
          "updStatus":"C"
        };
        
        this.Ng4LoadingSpinnerService.show();
        this.RepresentativesListService//profileid, idNumber, idType
        .postRepresentativesList(post_data)
        .then(res => (
          // console.log(res),
          this.Ng4LoadingSpinnerService.hide(),
          this.handlepostRepList(res)
          ), 
        err => (
          this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong')),
          this.Ng4LoadingSpinnerService.hide()
          ));
      }
      else {
        this.commonService.showFailureToast(this.translate.instant('COMMON.Enterallthemandatoryfields'));
      }
    } 
    //this.techInfoModalsForm.buttons[0].handler(this.techInfoModalsForm);
    }

    handlepostRepList(res) {
      if(res.msgId === "S"){
        this.commonService.showSuccessToast(res.msgText);
        this.activeModal.close();
        this.techInfoModalsForm.buttons[2].handler(this.techInfoModalsForm);
      } else if (res.msgId === "E"){
        this.commonService.showFailureToast(res.msgText);
      }
    }

    findCodefromText(idType, array) {
      var temp = _.find(array, {Text: idType});
      return temp.Code;
    }

    bindGetRepListById(res, RepresentativesModalsForm) {
      if(res.msgId === "S") {
        for(var i = 0; i<RepresentativesModalsForm.inputs.length; i++){
          // if(RepresentativesModalsForm.inputs[i]["id"] === "idType"){
          //   RepresentativesModalsForm.inputs[i]["hideable"] = true;
          //   RepresentativesModalsForm.inputs[i]["visible"] = false;
          // }
          if(RepresentativesModalsForm.inputs[i]["id"] === "name"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = res.name;
            RepresentativesModalsForm.inputs[i]["type"] = "text_disabled";
          }
          if(RepresentativesModalsForm.inputs[i]["id"] === "emailId"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = res.emailId;
            RepresentativesModalsForm.inputs[i]["type"] = "text_disabled";
          }
          if(RepresentativesModalsForm.inputs[i]["id"] === "mobile"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = res.mobile;
            RepresentativesModalsForm.inputs[i]["type"] = "text_disabled";
            RepresentativesModalsForm.buttons[0]["state"] = "hidden";
            RepresentativesModalsForm.buttons[1]["state"] = "null";
          }
          if(RepresentativesModalsForm.inputs[i]["id"] === "isPrimary"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;

            if(res.isPrimary && res.isPrimary === 'X')
            RepresentativesModalsForm.inputs[i]["value"] = true;
            else
            RepresentativesModalsForm.inputs[i]["value"] = false;

            RepresentativesModalsForm.inputs[i]["type"] = "checkbox";
            RepresentativesModalsForm.buttons[0]["state"] = "hidden";
            RepresentativesModalsForm.buttons[1]["state"] = "null";
          }
        }
      } else if (res.msgId === "I") {
        this.commonService.showWarningToast(res.msgText);
        for(var i = 0; i<RepresentativesModalsForm.inputs.length; i++){
          if(RepresentativesModalsForm.inputs[i]["id"] === "name"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = "";
            RepresentativesModalsForm.inputs[i]["type"] = "text";
          }
          if(RepresentativesModalsForm.inputs[i]["id"] === "emailId"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = "";
            RepresentativesModalsForm.inputs[i]["type"] = "text";
          }
        if(RepresentativesModalsForm.inputs[i]["id"] === "mobile"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = "";
            RepresentativesModalsForm.inputs[i]["type"] = "number";
            RepresentativesModalsForm.buttons[0]["state"] = "hidden";
            RepresentativesModalsForm.buttons[1]["state"] = "null";
          }

        if(RepresentativesModalsForm.inputs[i]["id"] === "isPrimary"){
            RepresentativesModalsForm.inputs[i]["hideable"] = false;
            RepresentativesModalsForm.inputs[i]["visible"] = true;
            RepresentativesModalsForm.inputs[i]["value"] = false;
            RepresentativesModalsForm.inputs[i]["type"] = "checkbox";
            RepresentativesModalsForm.buttons[0]["state"] = "hidden";
            RepresentativesModalsForm.buttons[1]["state"] = "null";
          }
        }
      }
      else{
        this.commonService.showFailureToast(res.msgText);
      }
    }

    closeModal() {
      this.activeModal.close();
    }
    onCreatePanel() {
      
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

    onChangeEdit(input, techInfoModalsForm, event){
  
    }

    onChange(input, RepresentativesModalsForm, event) {
     // for(var i = 0; i<RepresentativesModalsForm.inputs.length; i++){
        input.validation_status = "false";
        if(input["id"] === "idType"){
          if(event === this.translate.instant('PRELIMINARY_REQUEST.NationalId')){
          RepresentativesModalsForm.inputs[1]["hideable"] = false;
          RepresentativesModalsForm.inputs[1]["visible"] = true;
          RepresentativesModalsForm.inputs[1]["name"] = this.translate.instant('PRELIMINARY_REQUEST.NationalId');
          RepresentativesModalsForm.inputs[1]["value"] = "";
          RepresentativesModalsForm.buttons[0]["state"] = "null";
          RepresentativesModalsForm.buttons[1]["state"] = "hidden";

          
          RepresentativesModalsForm.inputs[2]["hideable"] = true;
          RepresentativesModalsForm.inputs[2]["visible"] = false;

          RepresentativesModalsForm.inputs[3]["hideable"] = true;
          RepresentativesModalsForm.inputs[3]["visible"] = false;

          RepresentativesModalsForm.inputs[4]["hideable"] = true;
          RepresentativesModalsForm.inputs[4]["visible"] = false;

          RepresentativesModalsForm.inputs[5]["hideable"] = true;
          RepresentativesModalsForm.inputs[5]["visible"] = false;
          } 
          else if(event === this.translate.instant('SIGNUP.lGCCNationalID')){
            RepresentativesModalsForm.inputs[1]["hideable"] = false;
            RepresentativesModalsForm.inputs[1]["visible"] = true;
            RepresentativesModalsForm.inputs[1]["name"] = this.translate.instant('SIGNUP.lGCCNationalID');
            RepresentativesModalsForm.inputs[1]["value"] = "";
            RepresentativesModalsForm.buttons[0]["state"] = "null";
            RepresentativesModalsForm.buttons[1]["state"] = "hidden";

            
            RepresentativesModalsForm.inputs[2]["hideable"] = true;
            RepresentativesModalsForm.inputs[2]["visible"] = false;

            RepresentativesModalsForm.inputs[3]["hideable"] = true;
            RepresentativesModalsForm.inputs[3]["visible"] = false;

            RepresentativesModalsForm.inputs[4]["hideable"] = true;
            RepresentativesModalsForm.inputs[4]["visible"] = false;

            RepresentativesModalsForm.inputs[5]["hideable"] = true;
            RepresentativesModalsForm.inputs[5]["visible"] = false;
            }
            else if(event === this.translate.instant('SIGNUP.lIqamaID')){
            RepresentativesModalsForm.inputs[1]["hideable"] = false;
            RepresentativesModalsForm.inputs[1]["visible"] = true;
            RepresentativesModalsForm.inputs[1]["name"] = this.translate.instant('SIGNUP.lIqamaID');
            RepresentativesModalsForm.inputs[1]["value"] = "";
            RepresentativesModalsForm.buttons[0]["state"] = "null";
            RepresentativesModalsForm.buttons[1]["state"] = "hidden";

            
            RepresentativesModalsForm.inputs[2]["hideable"] = true;
            RepresentativesModalsForm.inputs[2]["visible"] = false;

            RepresentativesModalsForm.inputs[3]["hideable"] = true;
            RepresentativesModalsForm.inputs[3]["visible"] = false;

            RepresentativesModalsForm.inputs[4]["hideable"] = true;
            RepresentativesModalsForm.inputs[4]["visible"] = false;

            RepresentativesModalsForm.inputs[5]["hideable"] = true;
            RepresentativesModalsForm.inputs[5]["visible"] = false;

            } else {
            RepresentativesModalsForm.inputs[1]["hideable"] = true;
            RepresentativesModalsForm.inputs[1]["visible"] = false;

            RepresentativesModalsForm.inputs[2]["hideable"] = true;
            RepresentativesModalsForm.inputs[2]["visible"] = false;

            RepresentativesModalsForm.inputs[3]["hideable"] = true;
            RepresentativesModalsForm.inputs[3]["visible"] = false;

            RepresentativesModalsForm.inputs[4]["hideable"] = true;
            RepresentativesModalsForm.inputs[4]["visible"] = false;

            RepresentativesModalsForm.inputs[5]["hideable"] = true;
            RepresentativesModalsForm.inputs[5]["visible"] = false;
          }
        }

        if(input["id"] === "isPrimary"){
          RepresentativesModalsForm.inputs[5]["value"] = !RepresentativesModalsForm.inputs[5]["value"];
        }
      //}
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
        if (this.files[i].size > 99000000) {
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

          if (parseInt(this.techInfoModalsForm.documentjson.documentList[i].RelatedEntityId) === parseInt(searchguId)) {
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
        //  if(temp[0] === "Edit" && this.techInfoModalsForm.typselcode === 'FU'){
        //   this.techInfoModalsForm.inputs[6].file = 
        // }
      }
    }
    onDeleteConfirm(event): void {
      if(window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  removeSAR(value) {
    var temp = value.replace(/[^\d.-]/g, '');
    return (parseInt(temp).toFixed(2) + "");
  }

}