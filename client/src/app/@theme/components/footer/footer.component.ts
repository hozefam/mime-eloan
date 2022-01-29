import { Component } from "@angular/core";

@Component({
  selector: "ngx-footer",
  styleUrls: ["./footer.component.scss"],
  template: `
    <span class="created-by">KLearn <b>© Kaar Technologies 2018</b></span>
    <div class="socials">        
      <a href="https://www.facebook.com/KlearnSales/" target="_blank" class="ion ion-logo-facebook"></a>
      <a href="https://www.linkedin.com/pulse/enrich-technology-pvt-ltd-proud-introduce-its-klearn-system-tec/" target="_blank" class="ion ion-logo-linkedin"></a>
      <a href="https://www.instagram.com/klearn_sales/" target="_blank" class="ion ion-logo-instagram"></a>
      <a href="https://www.youtube.com/channel/UCFk-DJgUydO5QvYvsLnrfVA/featured?view_as=subscriber" target="_blank" class="ion ion-logo-youtube"></a>      
    </div>
  `
})
export class FooterComponent {}
