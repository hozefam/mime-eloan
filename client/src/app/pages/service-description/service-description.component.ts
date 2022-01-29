import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonService } from "../../services/common.service";
import { LocalStorage } from '@ngx-pwa/local-storage';
import {TranslateService} from '@ngx-translate/core';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';
@Component({
  selector: 'service-description',
  templateUrl: './service-description.component.html',
  styleUrls: ['./service-description.component.scss']
})
export class ServiceDescriptionComponent implements OnInit {
  translate: any;
  constructor(private translateService: TranslateService, private router: ActivatedRoute,private directionService: NbLayoutDirectionService, public commonService: CommonService, private localStorage:LocalStorage) { 

    this.translate = this.commonService.returnTranslate();
  }
  serviceId = "7";

  ngOnInit() {
    let id = this.router.snapshot.paramMap.get("id");
    if (id)
      this.serviceId = id;
  }
  onLangChange(selectedValue) {

    this.localStorage.setItem('lang', selectedValue).subscribe(() => {

      this.translate.use(selectedValue);

      this.translate.get('dir').subscribe(res => {
        this.directionService.setDirection(res == 'rtl' ? NbLayoutDirection.RTL : NbLayoutDirection.LTR);
        //window.location.reload(); 
      });
      

    }, (error) => {

      alert(error)

    });

    this.commonService.setTranslate(selectedValue);

  }
}
