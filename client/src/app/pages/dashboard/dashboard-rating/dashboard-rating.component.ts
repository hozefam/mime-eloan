import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationsService } from "../../../services/communications.service";
@Component({
  selector: 'dashboard-rating',
  templateUrl: './dashboard-rating.component.html',
  styleUrls: ['./dashboard-rating.component.scss']
})
export class DashboardRatingComponent implements OnInit {

  constructor(private spinnerService: Ng4LoadingSpinnerService, private toastr: ToastrService,private communicationsService: CommunicationsService) { }

  // @Output() private ratingUpdated = new EventEmitter();

  ratingArr = [];
  rating: number = 5;
  color: string = "accent";
  message:string ="";
  ngOnInit() {

    for (let index = 0; index < 5; index++) {
      this.ratingArr.push(index);
    }
    this.getRating();
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  onClick(updatedRating:number) {  
    this.rating = updatedRating;
    // this.ratingUpdated.emit(updatedRating);
    return false;
  }

  onSubmit(){  
    if(this.message==""){
      this.showFailureToast("Please eneter the message","Dashboard");
      return true;
    }
    if(this.message!="" && this.rating>0){
      this.saveDashBoardFeedback();
    }
  }
  getRating(){
    this.communicationsService.getDashBoardFeedback()
    .then(response => (this.bindCustomerRateResponse(response)), err => err);
  }
  
  bindCustomerRateResponse(res){
    // alert(JSON.stringify(res);
    if(res.Rating!=undefined)
      this.rating =res.Rating;
  }
  saveDashBoardFeedback(){
    this.communicationsService.saveDashBoardFeedback(this.rating,this.message)
    .then(response => (this.postRateResponse(response)), err => err);
  }
  postRateResponse(res){
    // alert("post"+JSON.stringify(res);
    this.showSuccessToast("تم تقديم التقييم بنجاح","");
    this.message="";
  }
  showSuccessToast(message,heading) {
    this.toastr.success(message, heading, {
      timeOut: 1000,
      positionClass: 'toast-bottom-center',
    });
  }

  showFailureToast(message,heading) {
    this.toastr.error(message, heading, {
      timeOut: 1000,
      positionClass: 'toast-bottom-center',
    });
  }
}
