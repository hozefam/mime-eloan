import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/common.service";
import { DocumentListComponent } from '../../../../../components/document-list/document-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'marketing-information-modals',
  templateUrl: './marketing-information-modals.component.html',
  styleUrls: ['./marketing-information-modals.component.scss']
})

export class MarketingInformationModalsComponent implements OnInit {

  @ViewChildren('smartTable') smartTable: QueryList<ElementRef>

  MarketingInformationModalsForm: any = {};

  deleteCancelModalReference: any;

  files: any = [];

  deleteModalReference: any;

  current_date: any;

  current_year = "";

  selected_year = "";

  selected_type = "";

  selected_region = "";

  translate: any;

  @ViewChild('identifier') identifier: DocumentListComponent;

  constructor(private modalService: NgbModal, public commonService: CommonService, private activeModal: NgbActiveModal, private toastr: ToastrService) {

    this.translate = this.commonService.returnTranslate();

  }

  ngOnInit() {

    for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
      if (!this.MarketingInformationModalsForm.inputs[i].id_1)
        this.MarketingInformationModalsForm.inputs[i]["validation_status"] = false;
      else {

        this.MarketingInformationModalsForm.inputs[i]["validation_status_1"] = false;
        this.MarketingInformationModalsForm.inputs[i]["validation_status_2"] = false;

      }

    this.current_date = new Date();

    this.current_year = this.current_date.getFullYear().toString();

  }

  onSubmit() {

    var table_temp_source_1 = [], table_temp_source_2 = [];

    if (this.MarketingInformationModalsForm.tables) {

      this.MarketingInformationModalsForm.tables[0].source.getAll().then((res) => {

        table_temp_source_1 = res;

        if (this.MarketingInformationModalsForm.tables[1]) {

          this.MarketingInformationModalsForm.tables[1].source.getAll().then((res1) => {

            table_temp_source_2 = res1;

            this.onSubmitComplete(0, table_temp_source_1, table_temp_source_2);

          });

        }

        else if (!(this.MarketingInformationModalsForm.tables[0].heading == "Product Production Lines Section"))
          this.onSubmitComplete(1, table_temp_source_1, []);

        else
          this.onSubmitComplete(2, table_temp_source_1, []);

      });

    }

    else
      this.onSubmitComplete(3, [], []);

  }

  onSubmitComplete(type, table_temp_source_1, table_temp_source_2) {

    var flag = 0;

    var table_name = "";

    var flagged_id = 0;

    // var flagged_name = "", flagged_type = "";

    for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++) {

      this.MarketingInformationModalsForm.inputs[i].validation_status = false;

      if (this.MarketingInformationModalsForm.inputs[i].validation_status_1) {

        this.MarketingInformationModalsForm.inputs[i].validation_status_1 = false;
        this.MarketingInformationModalsForm.inputs[i].validation_status_2 = false;

      }

      if (this.MarketingInformationModalsForm.inputs[i].type == "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].type != 'table' &&
        this.MarketingInformationModalsForm.inputs[i].required == "true" && ((!this.MarketingInformationModalsForm.documents && this.files.length == 0) || (this.MarketingInformationModalsForm.documents && this.MarketingInformationModalsForm.documents.documentList.length == 0 && this.files.length == 0))) {

        flag = 1;
        this.MarketingInformationModalsForm.inputs[i].validation_status = true;

      }

      if (this.MarketingInformationModalsForm.inputs[i].type != "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].required === "true" &&
        this.MarketingInformationModalsForm.inputs[i].type != 'select' &&
        this.MarketingInformationModalsForm.inputs[i].type != 'table' &&
        this.MarketingInformationModalsForm.inputs[i].type != 'text_cost' &&
        this.MarketingInformationModalsForm.inputs[i].type != 'number_disabled' &&
        this.MarketingInformationModalsForm.inputs[i].type != 'text_cost_range' &&
        ((this.MarketingInformationModalsForm.inputs[i].value === "") ||
          this.MarketingInformationModalsForm.inputs[i].value === null ||
          !this.MarketingInformationModalsForm.inputs[i].value)) {

        flag = 1;
        this.MarketingInformationModalsForm.inputs[i].validation_status = true;
        // flagged_name = this.MarketingInformationModalsForm.inputs[i].name;
        // flagged_type = this.MarketingInformationModalsForm.inputs[i].type;

      }

      if (this.MarketingInformationModalsForm.inputs[i].type != "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].type != 'table' &&
        this.MarketingInformationModalsForm.inputs[i].required === "true" &&
        this.MarketingInformationModalsForm.inputs[i].type === 'text_cost' &&
        ((this.MarketingInformationModalsForm.inputs[i].value === "" ||
          this.MarketingInformationModalsForm.inputs[i].value === null ||
          !this.MarketingInformationModalsForm.inputs[i].value) ||
          (this.MarketingInformationModalsForm.inputs[i].UOM_selected === "" ||
            this.MarketingInformationModalsForm.inputs[i].UOM_selected === null ||
            !this.MarketingInformationModalsForm.inputs[i].UOM_selected))) {

        flag = 1;
        this.MarketingInformationModalsForm.inputs[i].validation_status = true;
        // flagged_name = this.MarketingInformationModalsForm.inputs[i].name;
        // flagged_type = this.MarketingInformationModalsForm.inputs[i].type;

      }

      if (this.MarketingInformationModalsForm.inputs[i].type != "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].type != 'table' &&
        this.MarketingInformationModalsForm.inputs[i].required === "true" &&
        this.MarketingInformationModalsForm.inputs[i].type === 'text_cost_range' &&
        ((this.MarketingInformationModalsForm.inputs[i].value_1 === "" ||
          this.MarketingInformationModalsForm.inputs[i].value_1 === null ||
          !this.MarketingInformationModalsForm.inputs[i].value_1) ||
          (this.MarketingInformationModalsForm.inputs[i].UOM_selected === "" ||
            this.MarketingInformationModalsForm.inputs[i].UOM_selected === null ||
            !this.MarketingInformationModalsForm.inputs[i].UOM_selected))) {

        flag = 1;
        this.MarketingInformationModalsForm.inputs[i].validation_status_1 = true;
        // flagged_name = this.MarketingInformationModalsForm.inputs[i].name;
        // flagged_type = this.MarketingInformationModalsForm.inputs[i].type;

      }

      if (this.MarketingInformationModalsForm.inputs[i].type != "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].type != 'table' &&
        this.MarketingInformationModalsForm.inputs[i].required === "true" &&
        this.MarketingInformationModalsForm.inputs[i].type === 'text_cost_range' &&
        ((this.MarketingInformationModalsForm.inputs[i].value_2 === "" ||
          this.MarketingInformationModalsForm.inputs[i].value_2 === null ||
          !this.MarketingInformationModalsForm.inputs[i].value_2) ||
          (this.MarketingInformationModalsForm.inputs[i].UOM_selected === "" ||
            this.MarketingInformationModalsForm.inputs[i].UOM_selected === null ||
            !this.MarketingInformationModalsForm.inputs[i].UOM_selected))) {

        flag = 1;
        this.MarketingInformationModalsForm.inputs[i].validation_status_2 = true;
        // flagged_name = this.MarketingInformationModalsForm.inputs[i].name;
        // flagged_type = this.MarketingInformationModalsForm.inputs[i].type;

      }

      if (this.MarketingInformationModalsForm.inputs[i].type != "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].type != 'table' &&
        this.MarketingInformationModalsForm.inputs[i].required == "true" &&
        this.MarketingInformationModalsForm.inputs[i].type === 'select' &&
        this.MarketingInformationModalsForm.inputs[i].visible === true &&
        (this.MarketingInformationModalsForm.inputs[i].selected === "" ||
          this.MarketingInformationModalsForm.inputs[i].selected === null ||
          !this.MarketingInformationModalsForm.inputs[i].selected)) {

        flag = 1;
        this.MarketingInformationModalsForm.inputs[i].validation_status = true;
        // flagged_name = this.MarketingInformationModalsForm.inputs[i].name;
        // flagged_type = this.MarketingInformationModalsForm.inputs[i].type;

      }

      else if (flag != 1 && this.MarketingInformationModalsForm.inputs[i].type != "file_multiple" &&
        this.MarketingInformationModalsForm.inputs[i].type === 'table' &&
        this.MarketingInformationModalsForm.inputs[i].required == "true" &&
        this.MarketingInformationModalsForm.inputs[i].source_length == 0) {

        flag = 2;
        table_name = this.MarketingInformationModalsForm.inputs[i].heading;
        // flagged_name = this.MarketingInformationModalsForm.inputs[i].heading;
        // flagged_type = this.MarketingInformationModalsForm.inputs[i].type;

      }

      else if (flag != 1 && this.MarketingInformationModalsForm.inputs[i].id === "Percent" && this.MarketingInformationModalsForm.inputs[i].value > 100) {

        flag = 3;
        flagged_id = i;

      }

      else if (flag != 1 && this.MarketingInformationModalsForm.inputs[i].id === "MarketShare" && this.MarketingInformationModalsForm.inputs[i].value > 100) {

        flag = 4;
        flagged_id = i;

      }

    }

    if (flag == 0 && (type == 0 || type == 1)) {

      var tables_year_1 = this.MarketingInformationModalsForm.tables[0].settings.columns.Year.editor.config.list[0];
      var tables_year_2 = this.MarketingInformationModalsForm.tables[0].settings.columns.Year.editor.config.list[1];
      var tables_year_3 = this.MarketingInformationModalsForm.tables[0].settings.columns.Year.editor.config.list[2];

      var tables_year_1_count = 0, tables_year_2_count = 0, tables_year_3_count = 0;

      for (var i = 0; i < table_temp_source_1.length; i++)
        if (table_temp_source_1[i].Year == tables_year_1.value)
          tables_year_1_count++;
        else if (table_temp_source_1[i].Year == tables_year_2.value)
          tables_year_2_count++;
        else if (table_temp_source_1[i].Year == tables_year_3.value)
          tables_year_3_count++;

      if (tables_year_1_count == 0 || tables_year_2_count == 0 || tables_year_3_count == 0) {

        this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TableYearInfo1') + this.MarketingInformationModalsForm.tables[0].heading +
          this.translate.instant('MARKETING_INFORMATION.TableYearInfo2'));

        flag = 5;

      }

    }

    if (flag == 0 && type == 0 && this.MarketingInformationModalsForm.inputs[5].value == true && table_temp_source_2.length == 0) {

      this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TableDetails1') + this.MarketingInformationModalsForm.tables[1].heading + this.translate.instant('MARKETING_INFORMATION.TableDetails2'));
      flag = 6;

    }

    if (flag == 0 && type == 2 && table_temp_source_1.length == 0) {

      this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TableDetails1') + this.MarketingInformationModalsForm.tables[0].heading + this.translate.instant('MARKETING_INFORMATION.TableDetails2'));
      flag = 7;

    }

    if (flag == 0) {

      this.MarketingInformationModalsForm.buttons[0].handler(this.MarketingInformationModalsForm);
      this.activeModal.close();

    }

    else if (flag == 1) {

      // if (flagged_type == "select")
      //   this.commonService.showFailureToast("Select the " + flagged_name + " !");

      // else if (flagged_type == "text_cost")
      //   this.commonService.showFailureToast("Enter the " + flagged_name + " and its Unit !");

      // else if (flagged_type == "text_cost_range")
      //   this.commonService.showFailureToast("Enter the " + flagged_name + " Range Values and its Unit !");

      // else
      //   this.commonService.showFailureToast("Enter the " + flagged_name + " !");

      this.commonService.showFailureToast(this.translate.instant('COMMON.EnterAllMandatoryFields'));

    }

    else if (flag == 2)
      this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.TableDetails1') + table_name + this.translate.instant('MARKETING_INFORMATION.TableDetails2'));

    else if (flag == 3) {

      this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.PercentageCannot100'));

      this.MarketingInformationModalsForm.inputs[flagged_id].validation_status = true;

    }

    else if (flag == 4) {

      this.commonService.showFailureToast(this.translate.instant('MARKETING_INFORMATION.PercentageCannotGreater100'));

      this.MarketingInformationModalsForm.inputs[flagged_id].validation_status = true;

    }

    // else if (flag == 2)
    //   this.commonService.showFailureToast("Choose an Attachment !");

  }

  onInputChange(id) {

    for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
      if (this.MarketingInformationModalsForm.inputs[i].id == id)
        this.MarketingInformationModalsForm.inputs[i].validation_status = false;

  }

  onInputChangeRange(id) {

    for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
      if (this.MarketingInformationModalsForm.inputs[i].id_1 == id)
        this.MarketingInformationModalsForm.inputs[i].validation_status_1 = false;
      else if (this.MarketingInformationModalsForm.inputs[i].id_2 == id)
        this.MarketingInformationModalsForm.inputs[i].validation_status_2 = false;

  }

  onCheckboxChange(value) {

    this.MarketingInformationModalsForm.tables[1].visible = value;
    this.MarketingInformationModalsForm.inputs[1].validation_status = false;

  }

  // checkLocalExport() {

  //   if (this.MarketingInformationModalsForm.inputs[3])
  //     if (this.MarketingInformationModalsForm.inputs[3].id == "LocalQuantity") {

  //       if (this.selected_type == "Local") {

  //         var year_local_local_value = this.MarketingInformationModalsForm.inputs[3].sum_local.find((o) => o.year == this.selected_year);
  //         if (year_local_local_value)
  //           this.MarketingInformationModalsForm.inputs[3].value = year_local_local_value.sum;

  //       }

  //       else if (this.selected_type == "Export") {

  //         var year_local_export_value = this.MarketingInformationModalsForm.inputs[3].sum_import.find((o) => (o.year == this.selected_year && o.region == this.selected_region));
  //         if (year_local_export_value)
  //           this.MarketingInformationModalsForm.inputs[3].value = year_local_export_value.sum;

  //       }

  //     }

  //   if (this.MarketingInformationModalsForm.inputs[4])
  //     if (this.MarketingInformationModalsForm.inputs[4].id == "ImportQuantity") {

  //       if (this.selected_type == "Local") {

  //         var year_export_local_value = this.MarketingInformationModalsForm.inputs[4].sum_local.find((o) => o.year == this.selected_year);
  //         if (year_export_local_value)
  //           this.MarketingInformationModalsForm.inputs[4].value = year_export_local_value.sum;

  //       }

  //       else if (this.selected_type == "Export") {

  //         var year_export_import_value = this.MarketingInformationModalsForm.inputs[4].sum_import.find((o) => (o.year == this.selected_year && o.region == this.selected_region));
  //         if (year_export_import_value)
  //           this.MarketingInformationModalsForm.inputs[4].value = year_export_import_value.sum;

  //       }

  //     }

  //   if (this.MarketingInformationModalsForm.inputs[5])
  //     if (this.MarketingInformationModalsForm.inputs[5].id == "ExportQuantity") {
  //       this.MarketingInformationModalsForm.inputs[5].value =
  //         this.MarketingInformationModalsForm.inputs[3].value + this.MarketingInformationModalsForm.inputs[4].value;

  //     }

  // }

  changeSelectOption(selected_id, selected_option) {

    for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
      if (this.MarketingInformationModalsForm.inputs[i].id == selected_id)
        this.MarketingInformationModalsForm.inputs[i].validation_status = false;

    if (selected_id == "Year") {

      if (selected_option == this.current_year) {

        if (this.MarketingInformationModalsForm.inputs[1].id == "Month")
          this.MarketingInformationModalsForm.inputs[1].visible = true;

      }

      else {

        if (this.MarketingInformationModalsForm.inputs[1].id == "Month")
          this.MarketingInformationModalsForm.inputs[1].visible = false;

      }

      this.selected_year = selected_option;

      // this.checkLocalExport();

    }

    else if (selected_id == "Type") {

      if (selected_option == "Local") {

        if (this.MarketingInformationModalsForm.inputs[1].id == "Region")
          this.MarketingInformationModalsForm.inputs[1].visible = false;

        if (this.MarketingInformationModalsForm.inputs[2])
          if (this.MarketingInformationModalsForm.inputs[2].id == "CompetitorName")
            this.MarketingInformationModalsForm.inputs[2].value = this.MarketingInformationModalsForm.inputs[2].dropdown_1;

      }

      else {

        if (this.MarketingInformationModalsForm.inputs[1].id == "Region")
          this.MarketingInformationModalsForm.inputs[1].visible = true;

        if (this.MarketingInformationModalsForm.inputs[2])
          if (this.MarketingInformationModalsForm.inputs[2].id == "CompetitorName")
            this.MarketingInformationModalsForm.inputs[2].value = this.MarketingInformationModalsForm.inputs[2].dropdown_2;

      }

      this.selected_type = selected_option;

      // this.checkLocalExport();

    }

    else if (selected_id == "Region") {

      this.selected_region = selected_option;

      // this.checkLocalExport();

    }

  }

  onFileChange(event, input_id) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (var i = 0; i < this.files.length; i++) {

      format = this.files[i].name.split('.');

      format_length = format.length;

      if (this.files[i].size > 5242880) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.SizeOfFile'));
        event.target.value = '';

        for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
          if (this.MarketingInformationModalsForm.inputs[i].id === input_id) {

            this.MarketingInformationModalsForm.inputs[i].file = "";
            this.MarketingInformationModalsForm.inputs[i].validation_status = true;

          }

        break;

      }

      else if (format[format_length - 1] === "exe" || format[format_length - 1] === "dll" || format[format_length - 1] === "js") {

        this.commonService.showFailureToast(this.translate.instant('COMMON.FormatOfFile'));
        event.target.value = '';

        for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
          if (this.MarketingInformationModalsForm.inputs[i].id === input_id) {

            this.MarketingInformationModalsForm.inputs[i].file = "";
            this.MarketingInformationModalsForm.inputs[i].validation_status = true;

          }

        break;

      }

      else if (i === (this.files.length - 1)) {

        for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
          if (this.MarketingInformationModalsForm.inputs[i].id === input_id) {

            this.MarketingInformationModalsForm.inputs[i].file = this.files;
            this.MarketingInformationModalsForm.inputs[i].validation_status = false;

          }

      }

    }

  }

  onAdd(event) {

    event.confirm.resolve();

    if (this.MarketingInformationModalsForm.inputs[3].id == "TotalExport") {

      this.MarketingInformationModalsForm.inputs[2].source_length = this.MarketingInformationModalsForm.inputs[2].source_length + 1;

      var sum = 0;

      sum += parseFloat(event.newData.Export);

      for (var i = 0; i < event.source.data.length; i++)
        sum += parseFloat(event.source.data[i].Export);

      this.MarketingInformationModalsForm.inputs[3].value = sum;

      this.calculateValueSum(3);

    }

  }

  onTableAdd(table) {

    this.smartTable.toArray().forEach(tableElement => {

      if (tableElement["settings"].noDataMessage == table.settings.noDataMessage) {

        tableElement["grid"]["createFormShown"] = true;
        tableElement["grid"].getNewRow();

      }

    });

  }

  onEdit(event) {

    event.confirm.resolve();

    if (this.MarketingInformationModalsForm.inputs[3].id == "TotalExport") {

      var sum = parseFloat(this.MarketingInformationModalsForm.inputs[3].value);

      sum -= parseFloat(event.data.Export);

      sum += parseFloat(event.newData.Export);

      this.MarketingInformationModalsForm.inputs[3].value = sum;

      this.calculateValueSum(3);

    }

  }

  onDelete(event, table_name, delete_modal) {

    this.deleteModalReference = this.modalService.open(delete_modal);
    this.deleteModalReference.event = event;
    this.deleteModalReference.table_name = table_name;
    this.deleteModalReference.action = this.translate.instant('COMMON.Delete');

  }

  onDeleteConfirm() {

    this.deleteModalReference.event.confirm.resolve();

    if (this.MarketingInformationModalsForm.inputs[3].id == "TotalExport") {

      this.MarketingInformationModalsForm.inputs[2].source_length = this.MarketingInformationModalsForm.inputs[2].source_length - 1;

      var sum = parseFloat(this.MarketingInformationModalsForm.inputs[3].value);

      sum -= parseFloat(this.deleteModalReference.event.data.Export);

      this.MarketingInformationModalsForm.inputs[3].value = sum;

      this.calculateValueSum(3);

    }

    this.deleteModalReference.close();

  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)
      return false;

    return true;

  }

  parseTextToInt() {

    this.MarketingInformationModalsForm.inputs[3].value = this.MarketingInformationModalsForm.inputs[3].value.replace('SAR', "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');
    this.MarketingInformationModalsForm.inputs[4].value_1 = this.MarketingInformationModalsForm.inputs[4].value_1.replace('SAR', "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');
    this.MarketingInformationModalsForm.inputs[4].value_2 = this.MarketingInformationModalsForm.inputs[4].value_2.replace('SAR', "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');
    this.MarketingInformationModalsForm.inputs[5].value_1 = this.MarketingInformationModalsForm.inputs[5].value_1.replace('SAR', "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');
    this.MarketingInformationModalsForm.inputs[5].value_3 = this.MarketingInformationModalsForm.inputs[5].value_2.replace('SAR', "").replace(/\s/g, "").replace(/[^0-9\.]/g, '');

  }

  calculateValueSum(id) {

    for (var i = 0; i < this.MarketingInformationModalsForm.inputs.length; i++)
      if (this.MarketingInformationModalsForm.inputs[i].id == id)
        this.MarketingInformationModalsForm.inputs[i].validation_status = false;

    if (this.MarketingInformationModalsForm.val_indices) {

      var sum = 0;

      for (var i = 0; i < (this.MarketingInformationModalsForm.val_indices.length - 1); i++)
        if (this.MarketingInformationModalsForm.inputs[this.MarketingInformationModalsForm.val_indices[i]].value == "")
          sum += 0;
        else
          sum += parseFloat(this.MarketingInformationModalsForm.inputs[this.MarketingInformationModalsForm.val_indices[i]].value);

      if (this.MarketingInformationModalsForm.inputs[this.MarketingInformationModalsForm.val_indices[this.MarketingInformationModalsForm.val_indices.length - 1]].type == "number_disabled")
        this.MarketingInformationModalsForm.inputs[this.MarketingInformationModalsForm.val_indices[this.MarketingInformationModalsForm.val_indices.length - 1]].value = sum;

    }

  }

  closeModal() {
    this.activeModal.close();
  }

  onCloseDeleteModal() {

    this.deleteModalReference.close();

  }

}