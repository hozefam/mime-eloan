import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactoryLoanService {

  constructor( private http : HttpClient) { }

  checkCityAvailability<Observable> (data ){ 
    return  this.http.post<Observable>("/api/factoryloan/CheckCityAreaAvailability" , data  )
  } 
  factoryInfo<Observable> (data){ 
   return this.http.post<Observable>('/api/factoryloan/FactoryInfo', data); 
  }
  
  nationalSource = [
{"code":"297","value":"	أبها"}
,{"code":"298","value":"	الأحساء"}
,{"code":"299","value":"	عرعر"}
,{"code":"300","value":"	عسير"}
,{"code":"301","value":"	الدوادمي"}
,{"code":"302","value":"	Al_baha"}
,{"code":"303","value":"	الدمام"}
,{"code":"304","value":"	الظهران"}
,{"code":"305","value":"	ضبا"}
,{"code":"306","value":"	القريات"}
,{"code":"307","value":"	حائل"}
,{"code":"308","value":"	حقل"}
,{"code":"309","value":"	جازان"}
,{"code":"310","value":"	جدة"}
,{"code":"311","value":"	الجوف"}
,{"code":"312","value":"	الجبيل"}
,{"code":"313","value":"	خميس"}
,{"code":"314","value":"	الخرج"}
,{"code":"315","value":"	مكة المكرمة"}
,{"code":"316","value":"	المدينة المنورة"}
,{"code":"317","value":"	نجران"}
,{"code":"318","value":"	القصيم"}
,{"code":"319","value":"	رابغ"}
,{"code":"320","value":"	رفحاء"}
,{"code":"321","value":"	الرياض"}
,{"code":"322","value":"	شرورة"}
,{"code":"323","value":"	سدير"}
,{"code":"324","value":"	Shaqra"}
,{"code":"325","value":"	تبوك"}
,{"code":"326","value":"	الطايف"}
,{"code":"327","value":"	أملج"}
,{"code":"328","value":"	ينبع"}
,{"code":"329","value":"	الزلفي"}
,{"code":"330","value":"	وادي الدواسر"}
,{"code":"1200","value":"	الخبر"}
  ]; 

  readyFactoryCities =[ 
{"code":"568" , "value":"عسيـــر"}
,{"code":"570" , "value":"تبوك"}
,{"code":"571" , "value":"حائل"}
,{"code":"572" , "value":"نجران"}
,{"code":"573" , "value":"جدة الثانية"}
,{"code":"574" , "value":"سدير "}
,{"code":"575" , "value":"الخرج"}
,{"code":"576" , "value":"جازان"}
,{"code":"577" , "value":"عرعر"}
,{"code":"578" , "value":"الرياض الثانية"}
,{"code":"579" , "value":"الزلفي"}
,{"code":"582" , "value":"القصيم الثانية"}
,{"code":"583" , "value":"الرياض الثالثة"}
,{"code":"585" , "value":"جدة الثالثة"}
,{"code":"586" , "value":"واحه مدن بجدة"}
,{"code":"587" , "value":"جدة الأولى"}
,{"code":"588" , "value":"الدمام الثالثة"}
,{"code":"589" , "value":"شقراء"}
,{"code":"591" , "value":"حفر الباطن"}
,{"code":"594" , "value":"الدمام الثانية"}
,{"code":"596" , "value":"القصيم الأولى"}
,{"code":"598" , "value":"المدينة المنورة"}
,{"code":"1145" , "value":"واحة مدن بالأحساء"}
,{"code":"1190" , "value":"اخرى"}

  ]; 


}
