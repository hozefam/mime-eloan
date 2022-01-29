import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NbLayoutDirectionService, NbLayoutDirection } from '@nebular/theme';

declare var $: any;
@Component({
  selector: 'Faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  languages = [{ value: "en", name: "EN" }, { value: "ar", name: "AR" }];
  customerProfiles: any = [];
  selectedLang = 'ar';
  current_direction = 'rtl';
  constructor(
    private translate: TranslateService,
    protected localStorage: LocalStorage,
    public commonService: CommonService,
    private directionService: NbLayoutDirectionService

  ) { }
  searchtxt:any="";
  Search(){
    //window.open("https://www.sidf.gov.sa/ar/Search/Pages/SearchResults.aspx?u=https://www.sidf.gov.sa&k="+this.searchtxt,"_blank");
    $('#page-wrap').removeHighlight().highlight(this.searchtxt);
  }
  ngOnInit() {
    $(".searchForm__buttonIcon").on("click", function (e) {
      $(".searchForm").addClass("active");
      e.stopPropagation()
      });
      
      $(document).on("click", function (e) {
      if ($(e.target).is(".searchForm__input,.searchForm__buttonSearch") === false) {
      $(".searchForm").removeClass("active");
      }
      });
    this.commonService.currentProfiles.subscribe(customerProfiles => this.customerProfiles = customerProfiles);
    
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
