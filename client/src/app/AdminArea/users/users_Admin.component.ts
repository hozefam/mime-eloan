import { actionType } from './../model/actionType.enum';
import { AdminUserService } from './../services/admin-User.service';
import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";
import { Router, ActivatedRoute, ActivationEnd, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RCYRequestsService } from "../../services/rcyrequests.service";
import { CustomerProfileService } from "../../services/customer-profile.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { User } from './../model/admin_User.model';
@Component({
    selector: 'app-users_Admin',
    templateUrl: './users_Admin.component.html',
    styleUrls: ['./users_Admin.component.scss']
})
export class UserAdminComponent implements OnInit {

    translate = this.commonService.returnTranslate();
    source: any = [];
    adminuser: any = {};
    delete_User: boolean = false;
    IsEdit: boolean = false;
    display: boolean = false;
    displaydl: boolean = false;
    modalTitle: string = "";
    btnmodalTitle: string = "";
    user: User = new User();
    actionType: actionType;
    userRole: any;
    constructor(private commonService: CommonService, private activatedRoute: ActivatedRoute,
        private spinnerService: Ng4LoadingSpinnerService, private adminUserService: AdminUserService,
        private customerProfileService: CustomerProfileService,
        protected localStorage: LocalStorage,
        private router: Router) { }
    Roles: any[] = [
        { id: 1, Value_Ar: "الادمن", Value_En: "Admin" },
        { id: 10, Value_Ar: "موظف الصندوق", Value_En: "SIDF Employee" },
        { id: 20, Value_Ar: "مدن", Value_En: "Modon" },
        { id: 30, Value_Ar: "موظف جبيل", Value_En: "RCJ Employee" },
        { id: 40, Value_Ar: "موظف ينبع", Value_En: "RCY Employee" }
    ];
    ngOnInit() {
        this.localStorage.getItem('AdminLoginData').subscribe((data) => {
            this.adminuser = data;

            this.getDataUsers();

        });
    }

    settings = {
        // hideSubHeader: true,

        noDataMessage: this.translate.instant('User.NoUsers'),
        mode: "external",
        edit: {
            editButtonContent: '<i class="nb-edit"  title="Edit"></i>',
        },
        delete: {
            deleteButtonContent: '<i class="nb-trash" title="delete"></i>',

        },
        add: {
            addButtonContent: '<i class="nb-plus" title="Add"></i>',

        },




        actions: {
            position: 'right',
            add: true,
            edit: false,
            editable: false,
            columnTitle: '',
        },



        columns: {
            /*   Id: {
              show:false
              }, */
            UserName: {
                title: this.translate.instant('User.UserName'),
                type: "string",
                editable: false
            },
            Role: {
                title: this.translate.instant('User.Role'),
                type: "string",
                editable: false,
                valuePrepareFunction: (role) => {
                    if (role) {
                        var rol = this.Roles.find(x => x.id == role);
                        if (rol) {
                            return this.translate.currentLang == "ar" ? rol.Value_Ar : rol.Value_En;
                        }
                        else { return null; }
                    }
                    return null;
                },
            },

        }
    };
    onSearch(query: string = '') {
        this.source.setFilter([
            {
                field: 'UserName',
                search: query
            },
            {
                field: 'Role',
                search: query
            },

        ], false);
        // second parameter specifying whether to perform 'AND' or 'OR' search 
        // (meaning all columns should contain search query or at least one)
        // 'AND' by default, so changing to 'OR' by setting false here

    }
    getDataUsers() {
        this.spinnerService.show();
        try {
            this.adminUserService
                .getDataUsers().then((requests) => {
                    if (requests)
                        this.source = requests;

                }), err => this.commonService.showFailureToast(err);
        } catch (err) {
            this.spinnerService.hide();
            this.commonService.showFailureToast(err);
        }
        this.spinnerService.hide();
    }
    AddUser() {

        this.spinnerService.show();
        this.user.Role = this.userRole;
        if (!this.checkValiddata()) {
            return this.commonService.showFailureToast("Please Fill All Data")
        }

        try {
            this.adminUserService
                .AddUser(this.user).then((requests) => {
                    if (requests)
                        //  this.source = requests;
                        this.display = false;
                }), err => this.commonService.showFailureToast(err);
        } catch (err) {
            this.spinnerService.hide();
            this.commonService.showFailureToast(err);
        }
        this.spinnerService.hide();
    }


    deleteUser() {

        this.spinnerService.show();


        try {
            this.adminUserService
                .DeleteUser(this.user).then((requests) => {
                    if (requests)
                        //  this.source = requests;
                        this.displaydl = false;
                }), err => this.commonService.showFailureToast(err);
        } catch (err) {
            this.spinnerService.hide();
            this.commonService.showFailureToast(err);
        }
        this.spinnerService.hide();
    }
    checkValiddata() {

        if (this.user && this.user.UserName && this.user.Password && this.user.Role) {
            return true;
        }
        return false;
    }
    onEdit(event) {
        this.display = true;
        this.actionType = actionType.Edit;
        this.btnmodalTitle = this.translate.instant('User.Edit');
        this.modalTitle = this.translate.instant('User.Edit_User');

        this.user = event.data;

    }

    onAdd(event) {
        this.display = true;
        this.actionType = actionType.Add;
        this.btnmodalTitle = this.translate.instant('User.Add');
        this.modalTitle = this.translate.instant('User.Add_User');

    }
    onDelete(event) {
        this.displaydl = true;
        this.actionType = actionType.Delete;
        this.btnmodalTitle = this.translate.instant('User.Delete');
        this.modalTitle = this.translate.instant('User.Delete_User');

        this.user = event.data;
    }
    closedialoge() {

        this.user = new User();
        this.getDataUsers();
    }
    onclickBtn() {
        switch (this.actionType) {
            case actionType.Add: {
                this.AddUser();
                break;
            }
            case actionType.Edit: {
                this.AddUser();
                break;
            }
            case actionType.Delete: {
                this.deleteUser();
                break;
            }
        }
    }

}
