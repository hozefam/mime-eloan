import { Component, Output, EventEmitter } from '@angular/core';

import { meuclass } from './admin-menu';
import { Router } from '@angular/router';
import { AdminUserService } from './services/admin-User.service';
//import { SampleService } from './services';


@Component({
  selector: 'ngx-admin',
  template: `
 <ngx-sample-layout>
   <nb-menu  [items]="menu"></nb-menu>
   <router-outlet></router-outlet>
 </ngx-sample-layout>   
  `,
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminComponent {
  menu= new meuclass(this.userservice).someFunc();
  logedInHomePage: boolean = false;
  hostName: string;
  constructor(private router: Router,private userservice:AdminUserService) {
    this.logedInHomePage = (this.router.url.toString().includes('ihome')) ? true : false;

    console.log(this.router.url.toString())
  }
}
