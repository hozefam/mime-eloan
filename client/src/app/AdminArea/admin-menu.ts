import { NbMenuItem } from "@nebular/theme";
import { AdminUserService } from "./services/admin-User.service";
import { Router } from "@angular/router";
/* export const MENU_ITEMS: NbMenuItem[] = [

 

  
]; */
export  class meuclass{
  MENU_ITEMS: NbMenuItem[]=[];
 
  constructor(private userservice:AdminUserService) {
    this.ceateMenue();
  }

  someFunc(): NbMenuItem[] {
    return this.MENU_ITEMS;
}
  ceateMenue(){
   
  

 this.userservice.isAuth().subscribe(
  ((data:any) => {
  
  if (data&&(data.Role==0||data.Role==1||data.Role==10))
  {
    this.MENU_ITEMS.push({title: " حالات الطلبات", icon: "nb-home",link: "/AdminArea/SummaryStatus"
   ,home: true});
 }
 if (data&&(data.Role==0||data.Role==1||data.Role==10||data.Role==30))
  {
    this.MENU_ITEMS.push( {
      title: " لوحة خدمات جبيل",
      icon: "nb-home",
      link: "/AdminArea/Admin-Dashboard-RCJ",
      home: true
    });
    this.MENU_ITEMS.push({
    title: " طلبات الهيئة الملكية في جبيل",
    icon: "nb-plus-circled",
    link: "/AdminArea/rcj-requests/9",
    home: false
  });

 }
 if (data&&(data.Role==0||data.Role==1||data.Role==10||data.Role==40))
 {
  this.MENU_ITEMS.push( {
    title: "طلبات الهيئة الملكية في ينبع",
    icon: "nb-edit",
    link: "/AdminArea/rcy-requests/10",
    home: false
  });
  this.MENU_ITEMS.push( {
    title: " لوحة خدمات ينبع",
    icon: "nb-home",
    link: "/AdminArea/Admin-Dashboard-RCY",
    home: true
  });
}
if (data&&(data.Role==0||data.Role==1))
   {
    this.MENU_ITEMS.push({ title: "المستخدمين",
      icon: "nb-plus-circled",link: "/AdminArea/users",home: false});
  }
  this.MENU_ITEMS.push( 
    {
      title: "تغيير كلمة المرور",
      icon: "nb-plus-circled",
      link: "/AdminArea/changePassword",
      home: false
    });


  }));
  
  }
}
