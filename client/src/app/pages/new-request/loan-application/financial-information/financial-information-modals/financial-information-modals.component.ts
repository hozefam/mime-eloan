import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DocumentListComponent } from '../../../../../components/document-list/document-list.component';


@Component({
  selector: 'financial-information-modal',
  templateUrl: './financial-information-modals.component.html',
  styleUrls: ['./financial-information-modals.component.scss']
})

export class FinancialInformationModalsComponent implements OnInit {

  @ViewChild('identifier') identifier: DocumentListComponent;

  FinancialInformationModalsForm: any = {};

  files: any = [];

  documents: any;

  selected_value = "";

  editFlag = 0;

  findflag = 0;

  negativeflag = 0;

  constructor(private activeModal: NgbActiveModal, private toastr: ToastrService) { }

  ngOnInit() { }


  //Function for only number to be typed

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if(charCode != 45)
      return false;
      else
      return true;
    }
    return true;

  }

  onChangeSelect(selected_value) {
    //console.log("xcv");
    this.editFlag = 0;

    this.findflag = 0;


    this.selected_value = selected_value;

    if (this.FinancialInformationModalsForm.method === "add" && this.FinancialInformationModalsForm.data_settings.columns["year_" + this.selected_value])
      this.showFailureToast("The details of the Year " + this.selected_value + " already exists !");

    if(this.FinancialInformationModalsForm.method === "add_normal"){
     // console.log(selected_value);
      if(selected_value != "Others"){
        this.FinancialInformationModalsForm.inputs[3].required = "false";
      }
      else{
        this.FinancialInformationModalsForm.inputs[3].required = "true";
      }
    }

    if ((this.FinancialInformationModalsForm.method === "edit" || this.FinancialInformationModalsForm.method === "edit_change") && this.FinancialInformationModalsForm.data_settings.columns["year_" + this.selected_value]) {
      //new
      // for(var i =0; i < this.FinancialInformationModalsForm.yearArray.length; i++){
      //   if(this.FinancialInformationModalsForm.yearArray[i] === this.selected_value){
      //     this.findflag = i;
      //   }
      // }

      // if(this.findflag < this.FinancialInformationModalsForm.guIdArray.length){

      console.log(this.FinancialInformationModalsForm.yearArray);
      console.log(this.FinancialInformationModalsForm.guIdArray);

      for (var i = 0; i < this.FinancialInformationModalsForm.yearArray.length; i++) {
        if (this.FinancialInformationModalsForm.yearArray[i] === this.selected_value) {
          var guidIdNo = i;
        }
      }
      console.log(guidIdNo);

      var searchguId = this.FinancialInformationModalsForm.guIdArray[guidIdNo];

      console.log(searchguId);

      console.log(this.FinancialInformationModalsForm.documentjson.documentList);



      var documentArray = [];

      for (var i = 0; i < this.FinancialInformationModalsForm.documentjson.documentList.length; i++) {

        if (parseInt(this.FinancialInformationModalsForm.documentjson.documentList[i].RelatedEntityId) === parseInt(searchguId)) {
          console.log(this.FinancialInformationModalsForm.documentjson.documentList[i]);
          // if(guisearch_list)
          console.log("hi");
          this.FinancialInformationModalsForm.documentjson.documentList[i]["docUrl"] = this.FinancialInformationModalsForm.documentjson.url
            .replace("entityId", this.FinancialInformationModalsForm.documentjson.documentList[i].EntityId)
            .replace("refId", this.FinancialInformationModalsForm.documentjson.documentList[i].RefId)
            .replace("documentId", this.FinancialInformationModalsForm.documentjson.documentList[i].DocumentId)
            .replace("fileName", this.FinancialInformationModalsForm.documentjson.documentList[i].FileName)
          documentArray.push(this.FinancialInformationModalsForm.documentjson.documentList[i]);

        }
      }
      //console.log(documentArray);

      this.documents = {
        "url": this.FinancialInformationModalsForm.documentjson.url,
        "documentList": documentArray
      };

      console.log(this.documents);
      //new
      for (var i = 0; i < this.FinancialInformationModalsForm.data_source.length; i++)
        if (this.FinancialInformationModalsForm.data_source[i]["year_" + this.selected_value] != undefined)
          this.FinancialInformationModalsForm.inputs[i + 1].value = this.FinancialInformationModalsForm.data_source[i]["year_" + this.selected_value].replace("SAR ", "").replace(/,/g, "");
        else
          this.FinancialInformationModalsForm.inputs[i + 1].value = 0;

      this.FinancialInformationModalsForm.method = "edit_change";

    }

    else if ((this.FinancialInformationModalsForm.method === "edit" || this.FinancialInformationModalsForm.method === "edit_change") && !this.FinancialInformationModalsForm.data_settings.columns["year_" + this.selected_value]) {

      this.showFailureToast("The Details of the selected Year does not exist !");
      this.editFlag = 1;
      this.FinancialInformationModalsForm.method = "edit";

    }

    if ((this.FinancialInformationModalsForm.method === "delete") && !this.FinancialInformationModalsForm.data_settings.columns["year_" + this.selected_value]) {

      this.showFailureToast("The Details of the selected Year does not exist !");
      this.FinancialInformationModalsForm.method = "delete";

    }

  }

  parseTextToInt(event) {
    this.FinancialInformationModalsForm.inputs[1].value = this.FinancialInformationModalsForm.inputs[1].value.replace('SAR ', "").replace(/,/g, "");
  }


  calculateFinanceSum() {


    if (this.FinancialInformationModalsForm.val_indices) {

      for (var i = 0; i < (this.FinancialInformationModalsForm.val_indices.length); i++) {

        if (this.FinancialInformationModalsForm.val_indices[i].action === "add") {

          var sumVal = 0;

          for (var j = 0; j < (this.FinancialInformationModalsForm.val_indices[i].values.length - 1); j++)
            if (this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value == "")
              sumVal += 0;

            else {

              this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value =
                this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value.toString();

              this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value =
                this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value.replace("SAR ", "").replace(/,/g, "");

              this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value =
                parseFloat(this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value);

              sumVal += this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value;

            }
          // if(sumVal<0){
          //   this.showFailureToast("The fields cannot be negative(-) !")
          // }

          if (this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[this.FinancialInformationModalsForm.val_indices[i].values.length - 1]].type == "number_disabled")
            this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[this.FinancialInformationModalsForm.val_indices[i].values.length - 1]].value = sumVal;

        }

        else if (this.FinancialInformationModalsForm.val_indices[i].action === "sub") {

          var subVal = 0;

          for (var j = 0; j < (this.FinancialInformationModalsForm.val_indices[i].values.length - 1); j++)
            if (this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value === "")
              subVal += 0;

            else {

              this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value =
                this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value.toString();

              this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value =
                this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value.replace("SAR ", "").replace(/,/g, "");

              this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value =
                parseFloat(this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value);

              if (j === 0)
                subVal += this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value;

              else
                subVal -= (this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value);

              //console.log(parseFloat(this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value));   

              // if(subVal<0){

              //   this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[j]].value = 0;
              //   this.showFailureToast("The fields cannot be negative(-)");

              // }
            }

          //if(subVal>0)
          if (this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[this.FinancialInformationModalsForm.val_indices[i].values.length - 1]].type == "number_disabled")
            this.FinancialInformationModalsForm.inputs[this.FinancialInformationModalsForm.val_indices[i].values[this.FinancialInformationModalsForm.val_indices[i].values.length - 1]].value = subVal;
        }

      }
    }
  }

  onFileChange(event, input_name) {

    this.files = event.target.files;
    console.log(this.files);
    console.log(input_name);
    for (var i = 0; i < this.FinancialInformationModalsForm.inputs.length; i++)
      if (this.FinancialInformationModalsForm.inputs[i].name === input_name) {
        this.FinancialInformationModalsForm.inputs[i].file = this.files;
        console.log(this.FinancialInformationModalsForm.inputs[i].file);
      }
  }

  onSubmit() {
    //console.log(this.FinancialInformationModalsForm);
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var varchartest = /^[a-zA-Z0-9\b]+$/

    var flag = 0;

    for (var i = 0; i < this.FinancialInformationModalsForm.inputs.length; i++) {

      if (this.FinancialInformationModalsForm.inputs[i].required == "true" && ((this.FinancialInformationModalsForm.inputs[i].value == "" || this.FinancialInformationModalsForm.inputs[i].value == undefined) && this.FinancialInformationModalsForm.inputs[i].value != "0")) {
        flag = 1;
      }

      if (this.FinancialInformationModalsForm.inputs[i].required == "true" && (this.FinancialInformationModalsForm.inputs[i].value < 0 && this.FinancialInformationModalsForm.inputs[i].id != "Othexp" && this.FinancialInformationModalsForm.inputs[i].id != "retearn")) {
        flag = 2;
      }

      if (flag == 1) {

        i = this.FinancialInformationModalsForm.inputs.length;

        this.showFailureToast("The required fields cannot be empty !")

      }

      if (flag == 2) {

        i = this.FinancialInformationModalsForm.inputs.length;

        if(!(this.FinancialInformationModalsForm.page === "Income" || this.FinancialInformationModalsForm.page === "Liabilities")){

            this.showFailureToast("The amount must be greater than 0, Please check your entries !");

        }
        else if(this.FinancialInformationModalsForm.page === "Income"){

            this.showFailureToast("Only Other Indirect Expenses can have negative value. Other amount must be greater than 0, Please check your entries !");
        
          }
        else{
          this.showFailureToast("Only Retained Earnings can have negative value. Other amount must be greater than 0, Please check your entries !");
        }
      }

    }

    if (flag == 0) {

      if (this.FinancialInformationModalsForm.method == "add_normal") {

        if (!this.FinancialInformationModalsForm.inputs[0].selected) {

          if (this.FinancialInformationModalsForm.inputs[0].value.length < 1 && this.FinancialInformationModalsForm.inputs[0].value.length > 15)
            this.showFailureToast("External ID must be between 1 and 15 characters");

          else if (!varchartest.test(this.FinancialInformationModalsForm.inputs[0].value))
            this.showFailureToast("Enter a valid External ID !");


          else if (!emailRegex.test(this.FinancialInformationModalsForm.inputs[11].value))
            this.showFailureToast("Enter a valid Email ID !");

          else {
            this.FinancialInformationModalsForm.buttons[0].handler(this.FinancialInformationModalsForm);
            this.activeModal.close();
          }

        }
        else {
          this.FinancialInformationModalsForm.buttons[0].handler(this.FinancialInformationModalsForm);
          this.activeModal.close();
        }

      }
      else {

        if (this.selected_value === "")
          this.showFailureToast("Select a Year !");

        else if (this.FinancialInformationModalsForm.method == "add" &&
          this.FinancialInformationModalsForm.data_settings.columns["year_" + this.selected_value]) {
          this.showFailureToast("The details of the Year " + this.selected_value + " already exists !");

        }
        else if (this.editFlag == 1)
          this.showFailureToast("The Details of the selected Year does not exist !");

        else {

          this.FinancialInformationModalsForm.buttons[0].handler(this.FinancialInformationModalsForm);
          this.activeModal.close();

        }

      }
    }

  }

  closeModal() {
    this.activeModal.close();
  }

  showFailureToast(message) {
    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });
  }

}