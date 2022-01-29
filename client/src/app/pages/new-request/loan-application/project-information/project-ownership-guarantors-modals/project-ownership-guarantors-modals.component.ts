import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/common.service";
import { CustomerProfileService } from "../../../../../services/customer-profile.service";
import { ProjInfoService } from '../../../../../services/project-information.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LoanApplicationService } from '../../../../../services/loan-application.service';

@Component({
  selector: 'project-ownership-guarantors-modals',
  templateUrl: './project-ownership-guarantors-modals.component.html',
  styleUrls: ['./project-ownership-guarantors-modals.component.scss']
})

export class ProjectOwnershipGuarantorsModalsComponent implements OnInit {

  projectOwnershipGuarantorsModalsForm: any = {};

  constructor(private commonService: CommonService, private activeModal: NgbActiveModal, private toastr: ToastrService, private customerProfileService: CustomerProfileService, private projInfoService: ProjInfoService, private spinnerService: Ng4LoadingSpinnerService,
    private loanApplicationService: LoanApplicationService, private modalService: NgbModal) { }

  ngOnInit() { }

  onSubmit() {

    var flag = 0;

    var flagged_name = "", flagged_type = "";

    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (var i = 0; ((i < this.projectOwnershipGuarantorsModalsForm.inputs.length) && (flag == 0)); i++) {

      if (this.projectOwnershipGuarantorsModalsForm.inputs[i].required === "true" &&
        this.projectOwnershipGuarantorsModalsForm.inputs[i].type != "select" &&
        (this.projectOwnershipGuarantorsModalsForm.inputs[i].value === "" ||
          this.projectOwnershipGuarantorsModalsForm.inputs[i].value === null ||
          !this.projectOwnershipGuarantorsModalsForm.inputs[i].value)) {

        flag = 1;
        flagged_name = this.projectOwnershipGuarantorsModalsForm.inputs[i].name;
        flagged_type = this.projectOwnershipGuarantorsModalsForm.inputs[i].type;

      }

      else if (this.projectOwnershipGuarantorsModalsForm.inputs[i].required === "true" &&
        this.projectOwnershipGuarantorsModalsForm.inputs[i].type === "select" &&
        (this.projectOwnershipGuarantorsModalsForm.inputs[i].selected === "" ||
          this.projectOwnershipGuarantorsModalsForm.inputs[i].selected === null ||
          !this.projectOwnershipGuarantorsModalsForm.inputs[i].selected)) {

        flag = 1;
        flagged_name = this.projectOwnershipGuarantorsModalsForm.inputs[i].name;
        flagged_type = this.projectOwnershipGuarantorsModalsForm.inputs[i].type;

      }

      else if (this.projectOwnershipGuarantorsModalsForm.inputs[i].required === "true" && this.projectOwnershipGuarantorsModalsForm.inputs[i].type === "email" && !emailRegex.test(this.projectOwnershipGuarantorsModalsForm.inputs[i].value ? this.projectOwnershipGuarantorsModalsForm.inputs[i].value.toLowerCase() : ""))
        flag = 2;

    }

    if (flag == 0) {

      this.spinnerService.show();

      var extidtype_desc = "", country_desc = "";

      var extidtype_list = this.projectOwnershipGuarantorsModalsForm.inputs[1].dropdown.find((o) => o.Desc === this.projectOwnershipGuarantorsModalsForm.inputs[1].selected);
      if (extidtype_list)
        extidtype_desc = extidtype_list.Id;

      var country_list = this.projectOwnershipGuarantorsModalsForm.inputs[7].dropdown.find((o) => o.Name === this.projectOwnershipGuarantorsModalsForm.inputs[7].selected);
      if (country_list)
        country_desc = country_list.Code;

      var source_of_finance_new_partner_source_data_array = {};

      var relations_source_data = { Externalidp: this.customerProfileService.loanArray.FactoryCr, Operation: "C", Relationtype: "SIDF04" };

      var source_of_finance_new_partner_source_data = {
        Externalid: this.projectOwnershipGuarantorsModalsForm.inputs[0].value, Extidtype: extidtype_desc, Firstname: this.projectOwnershipGuarantorsModalsForm.inputs[2].value, Lastname: this.projectOwnershipGuarantorsModalsForm.inputs[3].value, Street: this.projectOwnershipGuarantorsModalsForm.inputs[4].value,
        Area: this.projectOwnershipGuarantorsModalsForm.inputs[5].value, City: this.projectOwnershipGuarantorsModalsForm.inputs[6].value, Country: country_desc, Zip: this.projectOwnershipGuarantorsModalsForm.inputs[8].value, Phone1: this.projectOwnershipGuarantorsModalsForm.inputs[9].value, Fax: this.projectOwnershipGuarantorsModalsForm.inputs[10].value,
        Mail: this.projectOwnershipGuarantorsModalsForm.inputs[11].value, Relations: [relations_source_data], Operation: "C"
      };

      source_of_finance_new_partner_source_data_array = source_of_finance_new_partner_source_data;

      //create NEW PARTNER 
      console.log(source_of_finance_new_partner_source_data_array);

      var result;

      this.loanApplicationService
        .createBpRelation(source_of_finance_new_partner_source_data_array)
        .then(res => {

          console.log(res);

          result = res;

          if (result) {

            if (result.MessType) {

              if (result.MessType === "S") {


                this.projectOwnershipGuarantorsModalsForm.buttons[0].handler(this.projectOwnershipGuarantorsModalsForm);

                this.spinnerService.hide();
                this.activeModal.close();
                this.commonService.showSuccessToast("Partner created successfully");

              }

              else
                this.resolveError(result);

            }

            else
              this.resolveError(result);

          }

          else
            this.resolveError(result);

        });

    }

    else if (flag == 1) {

      if (flagged_type == "select")
        this.commonService.showFailureToast("Select the " + flagged_name + " !");

      else
        this.commonService.showFailureToast("Enter the " + flagged_name + " !");

    }

    else if (flag == 2)
      this.commonService.showFailureToast("Enter a valid Email ID !");

  }

  resolveError(res) {

    console.log(res);

    this.spinnerService.hide();
    //this.modalReference.close();
    if (res) {

      if (res.MessText)
        this.commonService.showFailureToast(res.MessText);

      else
        this.commonService.showFailureToast("Enter valid details");

    }

    else
      this.commonService.showFailureToast("Enter valid details");

  }

  numberOnly(event): boolean {

    //  this.flag_temp = 1;
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onngmodelchange(input, projectOwnershipGuarantorsModalsForm) {
    input.value = parseInt(input.value.replace(/[^0-9\.]/g, ''), 10);
    input.value = input.value.toFixed(2) + "";
    for (var i = 0; i < projectOwnershipGuarantorsModalsForm.inputs.length; i++) {
      if (input.id === projectOwnershipGuarantorsModalsForm.inputs[i].id) {
        projectOwnershipGuarantorsModalsForm.inputs[i].value = input.value;
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}