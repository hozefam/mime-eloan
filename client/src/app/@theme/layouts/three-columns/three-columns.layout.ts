import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators/takeWhile';

// TODO: move layouts into the framework
@Component({
  selector: 'ngx-three-columns-layout',
  styleUrls: ['./three-columns.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive >
        <nb-sidebar-header *ngIf="currentTheme !== 'corporate'">
          <a target="_blank" href="http://sidfcrmdev.sidf.gov.sa:8000/sap/bc/bsp/sap/crm_svy_server/survey.htm?sap-client=100&applid=CRM_SURVEY_ACTIVITY&svyid=ZSIDF_WEBSITESURVEY&vers=0000000002&lang=EN&parid=ZZCRM_SVY_BSP_SYSTEMPARAM" class="btn btn-hero-success main-btn">
            <i class="ion ion-social-github"></i> <span>Survey</span>
          </a>
        </nb-sidebar-header>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="small">
      </nb-layout-column>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-column class="small">
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class ThreeColumnsLayoutComponent implements OnDestroy {

  private alive = true;

  currentTheme: string;

  constructor(protected themeService: NbThemeService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
