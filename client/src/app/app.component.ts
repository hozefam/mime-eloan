/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import {TranslateService} from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet><ng4-loading-spinner  [threshold]="1000" [timeout]="30000" [template]="template"  [zIndex]="9999"></ng4-loading-spinner>',
  // [loadingText]="\'Please wait...\'"
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private translate: TranslateService, private spinnerService: Ng4LoadingSpinnerService) {
     // this language will be used as a fallback when a translation isn't found in the current language
    //  translate.addLangs(['en', 'fr','ar']);
    //  translate.setDefaultLang('en');
 
    //  // the lang to use, if the lang isn't available, it will use the current loader to get them
    //  const browserLang = translate.getBrowserLang();
    //  translate.use(browserLang.match(/en|fr|ar/) ? browserLang : 'en');
  }
  template: string ='<img  src="assets/images/loading.gif" class="spinLoading"/>'
  ngOnInit() {
    this.analytics.trackPageViews();
  }
}
