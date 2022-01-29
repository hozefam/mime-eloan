import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from "../../../services/users.service";

@Component({
  selector: 'new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  newUserForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    mobileNo: new FormControl(''),
    status: new FormControl('')
  });

  constructor(private userService: UsersService) { }

  ngOnInit() {
  }
  // closeModal() {
  //   this.activeModal.close();
  // }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    // this.userService
    //     .registerUser(this.newUserForm.value);
  }
}
