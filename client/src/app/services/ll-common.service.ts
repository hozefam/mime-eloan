import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LLCommonService {

  constructor() { }

  async getBase64Image(input)  { 
    try{
         let reader = new FileReader();
         if (input.target.files && input.target.files.length > 0) {
           let file = input.target.files[0];
            reader.readAsDataURL(file);
                return reader.onload =   (e) => { 
                  let inputFile =   reader.result.toString();  
                    return  inputFile.split(',')[1]; 
           };
          }
          return "0" ; 
       } 
  catch (err){ 
       console.log(err);  
       return  "0" ; 
    }
  }
}
 