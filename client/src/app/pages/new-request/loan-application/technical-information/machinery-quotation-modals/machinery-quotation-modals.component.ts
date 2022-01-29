import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoanApplicationTechnicalInformationComponent } from '../technical-information.component'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommunicationsService } from "../../../../../services/communications.service";
import { CommonService } from "../../../../../services/common.service";
import { CustomerProfileService } from "../../../../../services/customer-profile.service";

@Component({
  selector: 'machinery-quotation-modals',
  templateUrl: './machinery-quotation-modals.component.html',
  styleUrls: ['./machinery-quotation-modals.component.scss']
})

export class MachQuotModalsComponent implements OnInit {

  validation_status = 'false';
  translate: any;
  eventofclick = [];
  machQuotModalsForm: any = {};
  documents = {};
  documentStructure = {};
  statusCode = "";

  spinner_status = false;
  spinner_status_2 = false;

  // uom_text = [];

  files: any = [];
  //machinery_quotation_localdatasource_delete_array: any = [];

  constructor(private customerProfileService: CustomerProfileService, public commonService: CommonService, private communicationsService: CommunicationsService, private Ng4LoadingSpinnerService: Ng4LoadingSpinnerService, private activeModal: NgbActiveModal, private toastr: ToastrService) {
    this.translate = this.commonService.returnTranslate();
  }

  ngOnInit() {
    this.statusCode = this.customerProfileService.statusCode;
    for(var i=0; i<this.machQuotModalsForm.inputs.length; i++)
      this.machQuotModalsForm.inputs[i]["validation_status"] = 'false';
    console.log("Mach Quot");
  }


  onngmodelchange(input) {
    // input.value = parseInt(input.value.replace(/[^0-9\.]/g, ''), 10);
    // input.value = input.value.toFixed(2) + "";
    input.validation_status = 'false';
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  removeDisabled(modal_data) {
    modal_data.inputs[1].type = "text";
    modal_data.inputs[2].type = "text";
    modal_data.inputs[3].type = "number";
    modal_data.inputs[4].type = "select";
    modal_data.inputs[4].value = modal_data.uom_text;
    modal_data.inputs[5].type = "text";
    modal_data.inputs[6].type = "text";
    //modal_data.inputs[7].type = "text";
    modal_data.inputs[7].disabled = "false";
    modal_data.inputs[8].disabled = "false";
    modal_data.inputs[9].disabled = "false";
  }


  onView(event, table) {
    //console.log("User row select");
    let machQuotModalsForm = table;

    table.inputs[0].value = event.data.MachineName;
    table.inputs[0].type = "text_disabled";

    table.inputs[1].value = event.data.Manufacturer;
    table.inputs[1].type = "text_disabled";

    table.inputs[2].value = event.data.OriginCountry;
    table.inputs[2].type = "text_disabled";

    table.inputs[3].value = event.data.Capacity;
    table.inputs[3].type = "text_disabled";

    table.inputs[4].value = event.data.CapacityUOM;
    table.inputs[4].type = "text_disabled";

    table.inputs[5].value = event.data.TotalCost;
    table.inputs[5].type = "text_disabled";

    table.inputs[6].value = event.data.CostIndex;
    table.inputs[6].type = "text_disabled";

    // table.inputs[7].value = event.data.SelectedStat;
    // table.inputs[7].type = "text_disabled";

    table.inputs[7].disabled = "true";
    table.inputs[8].disabled = "true";
    table.inputs[9].disabled = "true";

    machQuotModalsForm.buttons[0].state = "disabled";

    if (event.data.GuiId) {
      // this.Ng4LoadingSpinnerService.show();

      this.documentStructure = {};

      this.spinner_status = true;
      this.communicationsService.getDocumentService(machQuotModalsForm.requestId, "p").then(requests => {

        this.documentStructure = this.commonService.returnViewDocumentJson(requests);

        // console.log(this.documentStructure);

        this.machQuotModalsForm["documentjson"] = this.documentStructure;


        var searchguId = event.data.GuiId;

        var documentArray = [];

        for (var i = 0; i < this.machQuotModalsForm.documentjson.documentList.length; i++) {

          if (parseInt(this.machQuotModalsForm.documentjson.documentList[i].RelatedEntityId) === parseInt(searchguId)) {
            //     console.log(this.machQuotModalsForm.documentjson.documentList[i]);
            // if(guisearch_list)
            //  console.log("hi");
            this.machQuotModalsForm.documentjson.documentList[i]["docUrl"] = this.machQuotModalsForm.documentjson.url
              .replace("entityId", this.machQuotModalsForm.documentjson.documentList[i].EntityId)
              .replace("refId", this.machQuotModalsForm.documentjson.documentList[i].RefId)
              .replace("documentId", this.machQuotModalsForm.documentjson.documentList[i].DocumentId)
              .replace("fileName", this.machQuotModalsForm.documentjson.documentList[i].FileName)
            documentArray.push(this.machQuotModalsForm.documentjson.documentList[i]);

          }

        }

        this.documents = {
          "url": this.machQuotModalsForm.documentjson.url,
          "documentList": documentArray
        };
        //this.machQuotModalsForm.inputs[7].value = this.documents["documentList"][0].FileName;

        //this.Ng4LoadingSpinnerService.hide();
        this.spinner_status = false;

      });
      // }
    }
    else {
      this.documents = {};
    }
  }

  onSubmit(button, machQuotModalsForm, event) {

    var flag = 0;
    /*
        for(var i = 0; i < this.machQuotModalsForm.inputs.length; i++) {
          
          if(this.machQuotModalsForm.inputs[i].required == "true" && this.machQuotModalsForm.inputs[i].value == "")
            flag = 1;
          
          if(flag == 1) {
    
            i = this.machQuotModalsForm.inputs.length;
    
            this.showFailureToast("The required fields cannot be empty !")
    
          }
    
        }
        */

    if (button.true_name == "Edit") {
      console.log(this.documents);
      let technicaltableinfoModalParams = machQuotModalsForm;
      var flag2 = 0;
      for (var i = 0; i < +technicaltableinfoModalParams.inputs.length - 1; i++) {
        if ((technicaltableinfoModalParams.inputs[i].type === "file_multiple" || technicaltableinfoModalParams.inputs[i].type === "file_single") && technicaltableinfoModalParams.inputs[i].required === "true") {
          if (technicaltableinfoModalParams.inputs[i].value === "") {
            if (this.documents["documentList"].length === 0) {
              //this.commonService.showFailureToast("Submit " + technicaltableinfoModalParams.inputs[i].name);
              technicaltableinfoModalParams.inputs[i].validation_status = 'true';
            }
            if(this.documents["documentList"].length > 0){
              flag = flag + 1;
            }
          }
          else{
            flag = flag + 1;
          }
        }
        else if (technicaltableinfoModalParams.inputs[i].type === "select") {
          if (technicaltableinfoModalParams.inputs[i].selected === "" && technicaltableinfoModalParams.inputs[i].required != "false") {
            //this.commonService.showFailureToast("Select " + technicaltableinfoModalParams.inputs[i].name);
            technicaltableinfoModalParams.inputs[i].validation_status = 'true';
          }
        }
        // else {

          if (technicaltableinfoModalParams.inputs[i].value != "" && technicaltableinfoModalParams.inputs[i].required != "false" && technicaltableinfoModalParams.inputs[i].required != "false" && technicaltableinfoModalParams.inputs[i].type != "file_multiple" && technicaltableinfoModalParams.inputs[i].type != "file_single") {
            flag = flag + 1;
          }
          if (technicaltableinfoModalParams.inputs[i].value === "" && technicaltableinfoModalParams.inputs[i].required != "false"&& technicaltableinfoModalParams.inputs[i].required != "false" && technicaltableinfoModalParams.inputs[i].type != "file_multiple" && technicaltableinfoModalParams.inputs[i].type != "file_single") {
            //this.commonService.showFailureToast("Enter " + technicaltableinfoModalParams.inputs[i].name);
            technicaltableinfoModalParams.inputs[i].validation_status = 'true';
          }
          if (technicaltableinfoModalParams.inputs[i].required === "true") {
            flag2 = flag2 + 1;
          }
     //   }
      }
      if (flag === flag2) {
        technicaltableinfoModalParams.buttons[0].state = "null";
        technicaltableinfoModalParams.buttons[1].state = "disabled";
        this.machQuotModalsForm = technicaltableinfoModalParams;
        this.spinner_status = true;
        this.machQuotModalsForm.buttons[1].handler(this.machQuotModalsForm, this.eventofclick, this.documents["documentList"].length);
        this.spinner_status = this.machQuotModalsForm.spinner_status;
        this.documents = {};
        this.closeModal(machQuotModalsForm);
     //   this.activeModal.close();
      }
      else {
         this.showFailureToast("Enter all the mandatory fields");
      }


    }
    else if (button.true_name == "Add") {
      let flag = 0;
      var comp_temp = 0;
      let technicaltableinfoModalParams = machQuotModalsForm;
      for (var i = 0; i < technicaltableinfoModalParams.inputs.length; i++) {
        if ((technicaltableinfoModalParams.inputs[i].type === "file_multiple" || technicaltableinfoModalParams.inputs[i].type === "file_single") && technicaltableinfoModalParams.inputs[i].required === "true") {
          if (technicaltableinfoModalParams.inputs[i].value === "") {
            //this.commonService.showFailureToast("Submit " + technicaltableinfoModalParams.inputs[i].name);
            technicaltableinfoModalParams.inputs[i].validation_status = 'true';
          }
          else{
            flag = flag + 1;
          }
        }
         if (technicaltableinfoModalParams.inputs[i].type === "select" && technicaltableinfoModalParams.inputs[i].required === "true") {
          if (technicaltableinfoModalParams.inputs[i].selected === "" && technicaltableinfoModalParams.inputs[i].required != "false") {
           // this.commonService.showFailureToast("Select " + technicaltableinfoModalParams.inputs[i].name);
           technicaltableinfoModalParams.inputs[i].validation_status = 'true';
          }   
        }
        //else {
          if (technicaltableinfoModalParams.inputs[i].value != "" && technicaltableinfoModalParams.inputs[i].required != "false" && technicaltableinfoModalParams.inputs[i].type != "file_multiple" && technicaltableinfoModalParams.inputs[i].type != "file_single") {
            flag = flag + 1;
          }
          if (technicaltableinfoModalParams.inputs[i].value === "" && technicaltableinfoModalParams.inputs[i].required != "false" && technicaltableinfoModalParams.inputs[i].type != "file_multiple" && technicaltableinfoModalParams.inputs[i].type != "file_single") {
            //this.commonService.showFailureToast("Enter " + technicaltableinfoModalParams.inputs[i].name);
            technicaltableinfoModalParams.inputs[i].validation_status = 'true';
          }
          if (technicaltableinfoModalParams.inputs[i].required != "false") {
            comp_temp = comp_temp + 1;
          }
        //}
      }

      if (flag === comp_temp) {
        this.spinner_status = true;
        this.machQuotModalsForm.buttons[0].handler(this.machQuotModalsForm);
        this.spinner_status = false;
        this.closeModal(machQuotModalsForm);
      }
      else {
         this.showFailureToast("Enter all the mandatory fields");
        //technicaltableinfoModalParams.inputs[i].validation_status = 'true';
      }
      this.documents = {};
      //  this.activeModal.close();
    }
    else if (button.true_name == "Clear") {
      machQuotModalsForm.buttons[0].state = "null";
      machQuotModalsForm.buttons[1].state = "disabled";
      this.documents = {};
      this.machQuotModalsForm.buttons[4].handler(this.machQuotModalsForm);
    }
    else {
      //machQuotModalsForm.modal_data.event_old2 =event;
      this.machQuotModalsForm.buttons[2].handler(this.machQuotModalsForm);
      this.activeModal.close();
    }
    // console.log("Edit ...");

  }

  closeModal(machQuotModalsForm) {
    this.machQuotModalsForm.buttons[2].handler(this.machQuotModalsForm);
    this.activeModal.close();
  }
  onCreatePanel() {
    // console.log("sdfsd");
  }

  showFailureToast(message) {
    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });
  }

  onDelete(delete_cancel_modal, event, name, machQuotModalsForm) {
    // console.log("XYZ");
    machQuotModalsForm.tables[0].source.remove(event.data);
    if (event.data.QuotId != undefined) {
      event.data["Operation"] = "D";
      this.machQuotModalsForm.buttons[3].handler(event.data, machQuotModalsForm);
      this.documents = {};
      // this.machinery_quotation_localdatasource_delete_array.push(event.data);
    }
  }

  //   let editButton ={
  //     name: "Edit",
  //     type: "Submit",
  //     class: "btn-success",
  //     handler: (modal_data) => {  
  //   }
  // };
  // technicaltableinfoModalParams.buttons.push(editButton);

  onEdit(event, machQuotModalsForm, item) {
    // console.log("evejskdn");
    let technicaltableinfoModalParams = machQuotModalsForm;
    this.removeDisabled(technicaltableinfoModalParams);

    technicaltableinfoModalParams.buttons[0].state = "null";

    //var Total_Cost = (event.data.TotalCost).slice(0, -1);
    var Total_Cost = parseInt(event.data.TotalCost);
    technicaltableinfoModalParams.inputs[0].value = event.data.MachineName;
    technicaltableinfoModalParams.inputs[1].value = event.data.Manufacturer;
    technicaltableinfoModalParams.inputs[2].value = event.data.OriginCountry;
    technicaltableinfoModalParams.inputs[3].value = event.data.Capacity;
    technicaltableinfoModalParams.inputs[4].selected = event.data.CapacityUOM;
    technicaltableinfoModalParams.inputs[5].value = Total_Cost;
    technicaltableinfoModalParams.inputs[6].value = event.data.CostIndex;
    // technicaltableinfoModalParams.inputs[7].value = event.data.SelectedStat;

    technicaltableinfoModalParams.buttons[0].state = "disabled";
    technicaltableinfoModalParams.buttons[1].state = "null";
    technicaltableinfoModalParams.buttons[1].event_old = event;
    this.eventofclick = event;
    technicaltableinfoModalParams.buttons[0].event = event;
    this.machQuotModalsForm = technicaltableinfoModalParams;

    // if(typsel === 'Machinery and Equipments' || typsel === "Building and Civil Works"){
    if (event.data.GuiId) {
      // this.Ng4LoadingSpinnerService.show();
      this.spinner_status = true;
      this.documentStructure = {};

      this.communicationsService.getDocumentService(machQuotModalsForm.requestId, "p").then(requests => {

        this.documentStructure = this.commonService.returnViewDocumentJson(requests);

        ///console.log(this.documentStructure);

        this.machQuotModalsForm["documentjson"] = this.documentStructure;


        var searchguId = event.data.GuiId;

        var documentArray = [];

        for (var i = 0; i < this.machQuotModalsForm.documentjson.documentList.length; i++) {

          if (parseInt(this.machQuotModalsForm.documentjson.documentList[i].RelatedEntityId) === parseInt(searchguId)) {
            // console.log(this.machQuotModalsForm.documentjson.documentList[i]);
            // if(guisearch_list)
            // console.log("hi");
            this.machQuotModalsForm.documentjson.documentList[i]["docUrl"] = this.machQuotModalsForm.documentjson.url
              .replace("entityId", this.machQuotModalsForm.documentjson.documentList[i].EntityId)
              .replace("refId", this.machQuotModalsForm.documentjson.documentList[i].RefId)
              .replace("documentId", this.machQuotModalsForm.documentjson.documentList[i].DocumentId)
              .replace("fileName", this.machQuotModalsForm.documentjson.documentList[i].FileName)
            documentArray.push(this.machQuotModalsForm.documentjson.documentList[i]);

          }
        }

        this.documents = {
          "url": this.machQuotModalsForm.documentjson.url,
          "documentList": documentArray
        };


        //this.Ng4LoadingSpinnerService.hide();
        this.spinner_status = false;

      });
      // }
    }
    else {
      this.documents = {};
    }
  }

  onFileChange(event, input_name, machQuotModalsForm) {
    //console.log("file change");
    this.files = event.target.files;

    for (var i = 0; i < machQuotModalsForm.inputs.length; i++)
      if (machQuotModalsForm.inputs[i].name === input_name)
        machQuotModalsForm.inputs[i].file = this.files;

  }

}
