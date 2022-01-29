import { Component, OnInit } from '@angular/core';
import { CommunicationsService } from "../../../services/communications.service";
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'no-obli-cert',
  templateUrl: './no-obli-cert.component.html',
  styleUrls: ['./no-obli-cert.component.scss']
})
export class NoObliCertComponent implements OnInit {

  files:any;
  constructor(private communicationsService: CommunicationsService) { }

  ngOnInit() {
  }
  uploadForm = new FormGroup ({
    file1: new FormControl(),
});
  onFileChange(event){
    this.files = event.target.files;
  }
  upload(){
    // alert(this.files.length);
    // let formdata = new FormData();
    //     console.log(this.uploadForm)
        
    // this.communicationsService.uploadDocument(this.files).then(requests => (console.log(requests)), err => (console.log(err)));
  }
}
