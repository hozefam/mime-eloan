import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor() { }

   idValidator(idlength : number):ValidatorFn{
 
    return (control: AbstractControl): { [key: string]: boolean } | null => {
    
      const idvalue: string = control.value;
      
      if(control.value !== '' && control.value !== "undefined"){
      if(control.value && (isNaN(control.value.length) || idvalue === '' || idvalue.length === idlength)){
        return null;
      }
      else{
        return{ 'idValidator': true };
      }
    }
    else
    return{ 'idValidator': false };
    };
  }

  idValidator2(min : number, max : number):ValidatorFn{
 
    return (control: AbstractControl): { [key: string]: boolean } | null => {
    
      const idvalue: string = control.value;
      
      if(control.value !== '' && control.value !== "undefined"){
      if(control.value && (isNaN(control.value.length) || idvalue === '' || (idvalue.length > min && idvalue.length < max))){
        return null;
      }
      else{
        return{ 'idValidator2': true };
      }
    }
    else
    return{ 'idValidator2': false };
    };
  }

  // static idValidator(idlength : number):ValidatorFn {
 
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {

  //  if(control && control.value != null && control.value != "undefined" && control.value != ''){
  //     const idvalue: string = control.value;
      
  //       console.log(control.value);
  //     if(idvalue === '' || idvalue.length === idlength){
  //       return null;
  //     }
  //     else{
  //       return{ 'idValidator': true};
  //     }}
  //   };
  // }

//   static idValidator(idlength: number): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//         if (control.value !== undefined && (isNaN(control.value) || control.value === idlength)) {
//             return { 'idvalid': true };
//         }
//         return { 'idvalid': false };
//     };
// }

}
