import { Component, OnInit,ViewEncapsulation  } from "@angular/core";
import { UsersService } from "../../services/users.service";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NewUserComponent } from "./new-user/new-user.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
  source: any = [];
  closeResult: string;
  modalReference: any;
  constructor(private userService: UsersService, private modalService: NgbModal, private toastr: ToastrService) {}

  ngOnInit() {
    this.getUser();
  }

  showToastSuccess() {
    this.toastr.success('Hello Welcome!', 'Toastr fun!',{
      timeOut: 1000,
      positionClass:'toast-bottom-center'
    });
  }

  settings = {
    noDataMessage: "No user found",
    actions:{
      add:false,
      edit:false,
      delete:false,
      position: "right",
      custom:[
        {
          title: '<i class="ion-search" aria-hidden="true"></i>',
          name: 'view'
        },
        {
          title: '<i class="ion-edit" aria-hidden="true"></i>',
          name: 'edit'
        },
        {
          title: '<i class="ion-trash-a" aria-hidden="true"></i>',
          name: 'delete'
        },
      ],

    },
    columns: {
      
      user_id: {
        title: "User ID",
        type: "number",
        width: "10%",
        editable: false
      },
      contact: {
        title: "Mobile No",
        type: "string",
        editable: false
      },
      first_name: {
        title: "First Name",
        type: "string",
        editable: false
      },
      last_name: {
        title: "Last Name",
        type: "string",
        editable: false
      },
      userType: {
        title: "User Type",
        type: "string",
        editable: false,
        filter: {
          type: "list",
          config: {
            list: [
              { value: "Teacher", title: "Teacher" },
              { value: "Admin", title: "Admin" },
              {
                value: "Parent",
                title: "Parent"
              },
              {
                value: "Driver",
                title: "Driver"
              }
            ]
          }
        }
      },
      email: {
        title: "E-mail",
        type: "string",
        editable: false
      },
      is_active: {
        title: "Status",
        type: "string",
        width: "10%",
        valuePrepareFunction: val => {
          if (val) return "Active";
          else return "Inactive";
        },
        filter: {
          type: "list",
          config: {
            list: [
              { value: "1", title: "Active" },
              { value: "0", title: "InActive" }
            ]
          }
        },
        editable: false
      }
    }
  };

  getUser() {
    this.userService
      .getAllUsers()
      .then(users => (this.source = users), err => console.log(err));
  }

  createNewUserModel(){
    //console.log("sss");
    this.modalService.open(NewUserComponent, { size: 'lg', container: 'nb-layout' });
   }

   onCustom(event){
    alert(`Custom event '${event.action}' fired on row №: ${event.data.user_id}`)
  }

  openBackDropCustomClass(content) {

    this.modalReference = this.modalService.open(content);

  }

  onClose(){
    this.modalReference.close();
  }

}
