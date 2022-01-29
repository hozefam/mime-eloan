import { Component, Output , EventEmitter  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MENU_ITEMS } from './pages-menu';
import { Router } from '@angular/router';
import { NbMenuItem } from "@nebular/theme";
import { createElementCssSelector } from '../../../node_modules__/@angular/compiler';

@Component({
  selector: 'ngx-pages',
  template: `
 <ngx-sample-layout>
   <nb-menu  [items]="menu"></nb-menu>
   <router-outlet></router-outlet>

 </ngx-sample-layout>    
 <footer class="footer_Wrapper ">
 <div class="container">
   <div class="row">
	 <div class="col-12 col-lg-6">
	   <div class="row">
		 <div class="col-12 col-lg-6">
		   <figure>
			 <object data="./assets/images/footericon.svg"></object>
		   </figure>
 
		 </div>
		 <div class="col-12 col-lg-6">
		   <p class="mb-4 text-light text-opacity">روابط سريعة</p>
		   <ul class="footer_list">
			 <li><a href="/index.html" class="text-light text-opacity">الصفحة الرئيسية</a> </li>
			 <li><a href="/index.html" class="text-light text-opacity">عن المبادرة</a> </li>
			 <li><a href="/index.html" class="text-light text-opacity">اسئلة شائعة</a> </li>
			 <li><a href="/index.html" class="text-light text-opacity">اتصل بنا</a> </li>
		   </ul>
		 </div>
	   </div>
 
	 </div>
	 <div class="col-12 col-lg-6">
	   <div class="row">
		 <div class="col-12 col-lg-6">
		   <p class="mb-4 text-light text-opacity">السياسات والشروط</p>
		   <ul class="footer_list">
 
			 <li><a href="/index.html" class="text-light text-opacity">
				 الأحكام والشروط</a> </li>
 
		   </ul>
		 </div>
	   
 
	   </div>
 
	 </div>
   </div>
 </div>
 </footer> 
  `,
styleUrls:['./pages-menu.component.scss']
})
export class PagesComponent {
  menu = MENU_ITEMS;
   logedInHomePage : boolean = false ; 
  
  constructor(private router: Router ,private translate: TranslateService) {
    this.logedInHomePage =  (this.router.url.toString().includes('ihome') ) ?true : false; 
     console.log(this.router.url.toString())
  } 
  ngOnInit()
	{
		this.menu = MENU_ITEMS;
		this.translate.onLangChange.subscribe( event => this.translateMenuItems() );
		this.translateMenuItems();
	}

	translateMenuItems()
	{
		console.log('menu');
		console.log(this.menu);
		this.menu.forEach( item =>
			
			{
				if(item.children){
					this.translateMenuItem( item );
					item.children.forEach( item2 => this.translateMenuItem( item2 ));
				}
				else
				this.translateMenuItem( item );
			});
	}

	translateMenuItem( menuItem: NbMenuItem )
	{
    
    
		menuItem.title = this.translate.instant( menuItem.data );
	}
}
