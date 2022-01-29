import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'service-conditions',
  templateUrl: './service-conditions.component.html',
  styleUrls: ['./service-conditions.component.scss']
})
export class ServiceConditionsComponent implements OnInit {

  constructor(private router :ActivatedRoute ) { }
  serviceId ="7"; 
  ngOnInit() {
    let id =  this.router.snapshot.paramMap.get("id");  
    if (id) 
    this.serviceId = id; 
  }

}
