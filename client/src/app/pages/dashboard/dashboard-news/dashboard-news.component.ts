import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-news',
  templateUrl: './dashboard-news.component.html',
  styleUrls: ['./dashboard-news.component.scss']
})
export class DashboardNewsComponent implements OnInit {

  constructor() { }

  news = [];

  private sampleNews = {
    title: "Fan of Angular-In-Depth and my writings? Support us on Twitter!",
    link: "htpp://www.google.com",
    text: "A few weeks ago I ran a poll on Twitter to understand why Angular account has 280k followers on Twitter while Angular-In-Depth has only a fraction of that on Medium (11k). The poll showed that 50% of those who responded don’t use Medium, 17% find stories too complicated, 27% have no time to read and there are people (7%) who find stories not interesting."
  }

  ngOnInit() {

      for(var i = 0; i < 3; i++){
          this.news.push(this.sampleNews);
      }

  }

}
