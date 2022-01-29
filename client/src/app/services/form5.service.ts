import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class Form5Service {

  constructor(private http:HttpClient) { }

  AttachmentExtentionTypes=["jpg","png","pdf"];
  SubmitFormData(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/ModonLandForm5', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  SaveModonLandForm1(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModonLandForm1', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  SaveModon_ExportingCountries(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_ExportingCountries', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  SaveModon_Products_List(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_Products_List', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  SaveModon_ManufacturingTechnology(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_ManufacturingTechnology', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  GetCityLookup() {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/admindashboard/GetCityLookup', {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  
  GetForm5Data(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/ModonLandForm5_GET ', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  GetModon_Equipment(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/Modon_EquipmentGet', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  GetClientDetails(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/GetClientDetails', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  Get_MODONLookUP(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/Get_MODONLookUP', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  Get_MODONTableAll(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/Get_MODONTableAll', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  
  SubmitModon_Equipment(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/Modon_EquipmentPost', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  SubmitModon_ImportingDetails(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_ImportingDetails', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  SubmitModon_Productdetails(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_ProductsDetails', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  SaveModon_Documents(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_Documents', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  
  SubmitModon_RawMaterialsDetails(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_RawMaterialsDetails', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  
  SubmitModon_Contact_Details(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/SaveModon_Contact_Details', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  GetForm6Data(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/ModonLandForm6_GET ', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  
  
  SubmitForm6Data(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/ModonLandForm6', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 
  GetModonSubActivities(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/ModonSubActivities', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }  
  GetModonLandForm1(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/GetModonLandForm1', {
          data ,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }  
  GetMimProducts(crNumber,lang) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/GetMimProducts', {
          crNumber:crNumber ,lang:lang
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  DeleteData(type,id) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/modon/DeleteData', {
          type:type ,id:id
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  } 

region = [
 {"code":"627" , "value":"	الرياض"}
 ,{"code":"628" , "value":"	القصيم"}
 ,{"code":"629" , "value":"	مكة المكرمة"}
 ,{"code":"630" , "value":"	المدينة المنورة"}
 ,{"code":"631" , "value":"	حائل"}
 ,{"code":"632" , "value":"	الجوف"}
 ,{"code":"633" , "value":"	تبوك"}
 ,{"code":"634" , "value":"	الحدود الشمالية"}
 ,{"code":"635" , "value":"	ابها"}
 ,{"code":"636" , "value":"	جازان"}
 ,{"code":"637" , "value":"	نجران"}
 ,{"code":"638" , "value":"	الباحة"}
 ,{"code":"639" , "value":"	الشرقية"}

]

 contries =  [{"code":"640", "value":	"أفغانستان" }
 ,{"code":"641", "value":"	ألباني"}
 ,{"code":"642", "value":"	الجزائر"}
 ,{"code":"643", "value":"	أندورا"}
 ,{"code":"644", "value":"	أنغولا"}
 ,{"code":"645", "value":"	أنتيغوا"}
 ,{"code":"646", "value":"	الأرجنتين"}
 ,{"code":"647", "value":"	أرمينيا"}
 ,{"code":"648", "value":"	أستراليا"}
 ,{"code":"649", "value":"	النمسا"}
 ,{"code":"650", "value":"	أذربيجان"}
 ,{"code":"651", "value":"	جزر البهاما"}
 ,{"code":"652", "value":"	البحرين"}
 ,{"code":"653", "value":"	بنغلاديش"}
 ,{"code":"654", "value":"	بربادوس"}
 ,{"code":"655", "value":"	روسيا البيضاء"}
 ,{"code":"656", "value":"	بلجيكا"}
 ,{"code":"657", "value":"	بليز"}
 ,{"code":"658", "value":"	بنين"}
 ,{"code":"659", "value":"	بوتان"}
 ,{"code":"660", "value":"	بوليفيا"}
 ,{"code":"661", "value":"	البوسنة و الهرسك"}
 ,{"code":"662", "value":"	بوتسوانا"} 
 ,{"code":"663", "value":"	البرازيل"}
 ,{"code":"664", "value":"	بروناي"} 
 ,{"code":"665", "value":"	بلغاريا"}
 ,{"code":"666", "value":"	فاسو"}
 ,{"code":"667", "value":"	بوروندي"}
 ,{"code":"668", "value":"	كمبوديا"}
 ,{"code":"669", "value":"	الكاميرون"}
 ,{"code":"670", "value":"	كندا"}
 ,{"code":"671", "value":"	الرأس الأخضر"}
 ,{"code":"672", "value":"	معدل تقييم أفريقيا الوسطى"}
 ,{"code":"673", "value":"	تشاد"}
 ,{"code":"674", "value":"	تشيلي"}
 ,{"code":"675", "value":"	الصين"}
 ,{"code":"676", "value":"	كولومبيا"}
 ,{"code":"677", "value":"	جزر القمر"}
 ,{"code":"678", "value":"	الكونغو"}
 ,{"code":"679", "value":"	كوستاريكا"}
 ,{"code":"680", "value":"	كرواتيا"}
 ,{"code":"681", "value":"	كوبا"}
 ,{"code":"682", "value":"	قبرص"}
 ,{"code":"683", "value":"	جمهورية التشيك"}
 ,{"code":"684", "value":"	الدنمارك"}
 ,{"code":"685", "value":"	جيبوتي"}
 ,{"code":"686", "value":"	دومينيكا"}
 ,{"code":"687", "value":"	جمهورية الدومينيكان"}
 ,{"code":"688", "value":"	تيمور الشرقية"}
 ,{"code":"689", "value":"	الاكوادور"}
 ,{"code":"690", "value":"	مصر"}
 ,{"code":"691", "value":"	السلفادور"}
 ,{"code":"692", "value":"	غينيا الاستوائية"}
 ,{"code":"693", "value":"	إريتريا"}
 ,{"code":"694", "value":"	استونيا"}
 ,{"code":"695", "value":"	أثيوبيا"}
 ,{"code":"696", "value":"	فيجي"}
 ,{"code":"697", "value":"	فنلندا"}
 ,{"code":"698", "value":"	فرنسا"}
 ,{"code":"699", "value":"	الغابون"}
 ,{"code":"700", "value":"	غامبيا"}
 ,{"code":"701", "value":"	جورجيا"}
 ,{"code":"702", "value":"	ألمانيا"}
 ,{"code":"703", "value":"	غانا"}
 ,{"code":"704", "value":"	يونان"}
 ,{"code":"705", "value":"	غرينادا"}
 ,{"code":"706", "value":"	غواتيمالا"}
 ,{"code":"707", "value":"	غينيا"}
 ,{"code":"708", "value":"	غينيا بيساو"}
 ,{"code":"709", "value":"	غيانا"}
 ,{"code":"710", "value":"	هايتي"}
 ,{"code":"711", "value":"	هندوراس"}
 ,{"code":"712", "value":"	هنغاريا"}
 ,{"code":"713", "value":"	أيسلندا"}
 ,{"code":"714", "value":"	الهند"}
 ,{"code":"715", "value":"	أندونيسيا"}
 ,{"code":"716", "value":"	ايران"}
 ,{"code":"717", "value":"	العراق"}
 ,{"code":"718", "value":"	أيرلندا {جمهورية}"}
 ,{"code":"720", "value":"	إيطاليا" }
 ,{"code":"721", "value":"	ساحل العاج"}
 ,{"code":"722", "value":"	جامايكا"}
 ,{"code":"723", "value":"	اليابان"}
 ,{"code":"724", "value":"	الأردن"}
 ,{"code":"725", "value":"	الأردن"}
 ,{"code":"726", "value":"	كينيا"}
 ,{"code":"727", "value":"	كيريباتي"}
 ,{"code":"728", "value":"	كوريا الشمالية"}
 ,{"code":"729", "value":"	كوريا الجنوبية"}
 ,{"code":"730", "value":"	كوسوفو"}
 ,{"code":"731", "value":"	الكويت"}
 ,{"code":"732", "value":"	قرغيزستان"}
 ,{"code":"733", "value":"	لاوس"}
 ,{"code":"734", "value":"	لاتفيا"}
 ,{"code":"735", "value":"	لبنان"}
 ,{"code":"736", "value":"	ليسوتو"}
 ,{"code":"737", "value":"	ليبيريا"}
 ,{"code":"738", "value":"	ليبيا"}
 ,{"code":"739", "value":"	ليختنشتاين"}
 ,{"code":"740", "value":"	ليتوانيا"}
 ,{"code":"741", "value":"	لوكسمبورغ"}
 ,{"code":"742", "value":"	مقدونيا"}
 ,{"code":"743", "value":"	مدغشقر"}
 ,{"code":"744", "value":"	ملاوي"}
 ,{"code":"745", "value":"	ماليزيا"}
 ,{"code":"746", "value":"	جزر المالديف"}
 ,{"code":"747", "value":"	مالي"}
 ,{"code":"748", "value":"	مالطا"}
 ,{"code":"749", "value":"	جزر مارشال"}
 ,{"code":"750", "value":"	موريتانيا"}
 ,{"code":"751", "value":"	موريشيوس"}
 ,{"code":"752", "value":"	المكسيك"}
 ,{"code":"753", "value":"	ميكرونيزيا" }
 ,{"code":"754", "value":"	مولدوفا"}
 ,{"code":"755", "value":"	موناكو"}
 ,{"code":"756", "value":"	منغوليا"}
 ,{"code":"757", "value":"	الجبل الأسود"}
 ,{"code":"758", "value":"	مغربي"}
 ,{"code":"759", "value":"	موزمبيق"}
 ,{"code":"760", "value":"	ميانمار، بورما"}
 ,{"code":"761", "value":"	ناميبيا"}
 ,{"code":"762", "value":"	ناورو"}
 ,{"code":"763", "value":"	نيبال"}
 ,{"code":"764", "value":"	هولندا"}
 ,{"code":"765", "value":"	نيوزيلندا"}
 ,{"code":"766", "value":"	نيكاراغوا"}
 ,{"code":"767", "value":"	النيجر"}
 ,{"code":"768", "value":"	نيجيريا"}
 ,{"code":"769", "value":"	النرويج"}
 ,{"code":"770", "value":"	عمان"}
 ,{"code":"771", "value":"	باكستان"}
 ,{"code":"772", "value":"	فلسطين"}
 ,{"code":"773", "value":"	بالاو"}
 ,{"code":"774", "value":"	بناما"}
 ,{"code":"775", "value":"	بابوا غينيا الجديدة"}
 ,{"code":"776", "value":"	باراغواي"}
 ,{"code":"777", "value":"	بيرو"}
 ,{"code":"778", "value":"	الفلبين"}
 ,{"code":"779", "value":"	بولندا"}
 ,{"code":"780", "value":"	البرتغال"}
 ,{"code":"781", "value":"	قطر"}
 ,{"code":"782", "value":"	رومانيا"}
 ,{"code":"783", "value":"	الاتحاد الروسي"}
 ,{"code":"784", "value":"	رواندا"}
 ,{"code":"785", "value":"	سانت كيتس ونيفيس"}
 ,{"code":"786", "value":"	سانت لوسيا"}
 ,{"code":"787", "value":"	سانت فنسنت وجزر غرينادين"}
 ,{"code":"788", "value":"	ساموا"}
 ,{"code":"789", "value":"	سان مارينو"}
 ,{"code":"790", "value":"	ساو تومي وبرينسيبي"}
 ,{"code":"791", "value":"	المملكة العربية السعودية"}
 ,{"code":"792", "value":"	السنغال"}
 ,{"code":"793", "value":"	صربيا"}
 ,{"code":"794", "value":"	سيشيل"}
 ,{"code":"795", "value":"	سيراليون"}
 ,{"code":"796", "value":"	سنغافورة"}
 ,{"code":"797", "value":"	سلوفاكيا"}
 ,{"code":"798", "value":"	سلوفينيا"}
 ,{"code":"799", "value":"	جزر سليمان"}
 ,{"code":"800", "value":"	الصومال"}
 ,{"code":"801", "value":"	جنوب أفريقيا"}
 ,{"code":"802", "value":"	جنوب السودان"}
 ,{"code":"803", "value":"	إسبانيا"}
 ,{"code":"804", "value":"	سري لانكا"}
 ,{"code":"805", "value":"	سودان"}
 ,{"code":"806", "value":"	سورينام"}
 ,{"code":"807", "value":"	سوازيلاند"}
 ,{"code":"808", "value":"	السويد"}
 ,{"code":"809", "value":"	سويسرا"}
 ,{"code":"810", "value":"	سوريا"}
 ,{"code":"811", "value":"	تايوان"}
 ,{"code":"812", "value":"	طاجيكستان"}
 ,{"code":"813", "value":"	تنزانيا"}
 ,{"code":"814", "value":"	تايلاند"}
 ,{"code":"815", "value":"	توغو"}
 ,{"code":"816", "value":"	تونغا"}
 ,{"code":"817", "value":"	ترينيداد وتوباجو"}
 ,{"code":"818", "value":"	تونس"}
 ,{"code":"819", "value":"	تركيا"}
 ,{"code":"820", "value":"	تركمانستان"}
 ,{"code":"821", "value":"	توفالو"}
 ,{"code":"822", "value":"	أوغندا"}
 ,{"code":"823", "value":"	أوكرانيا"}
 ,{"code":"824", "value":"	الإمارات العربية المتحدة"}
 ,{"code":"825", "value":"	المملكة المتحدة"}
 ,{"code":"826", "value":"	الولايات المتحدة"}
 ,{"code":"827", "value":"	أوروغواي"}
 ,{"code":"828", "value":"	أوزبكستان"}
 ,{"code":"829", "value":"	فانواتو"}
 ,{"code":"830", "value":"	مدينة الفاتيكان"}
 ,{"code":"831", "value":"	فنزويلا"}
 ,{"code":"832", "value":"	فيتنام"}
 ,{"code":"833", "value":"	يمني"}
 ,{"code":"834", "value":"	زامبيا"}
 ,{"code":"835", "value":"	زيمبابوي"}]
  
 PollutionType = [  {"code": "252" , "value": "عالي التلوث"} , 
 {"code": "255" , "value": "متوسط التلوث"}
 ,{"code": "256" , "value": "غير ملوث"}
];
 

IndustryType = [
  {"code":"620", "value":"	أولي"}
  ,{"code":"621", "value":"	ثانوي"}
  ,{"code":"622", "value":"	مساند"}

] ;
ManufacturingMethod = [
 {"code":"0" , "value":"	تجميعي"}
,{"code":"1" , "value":"	تحويلي"}
,{"code":"2" , "value":"	خفيف"}
,{"code":"3" , "value":"	ثقيل"}
]
  
ManufacturingId  = [  
 {"code": "0", "value": "	آلي"}
,{"code": "1", "value": "	نصف آالي"}
,{"code": "2", "value": "	يدوي"}
]  

Supplier = [ 
   {"code":"297" , "value":"	أبها"}
,{"code":"298" , "value":"	الأحساء"}
,{"code":"299" , "value":"	عرعر"}
,{"code":"300" , "value":"	عسير"}
,{"code":"301" , "value":"	الدوادمي"}
,{"code":"302" , "value":"	Al_baha"}
,{"code":"303" , "value":"	الدمام"}
,{"code":"304" , "value":"	الظهران"}
,{"code":"305" , "value":"	ضبا"}
,{"code":"306" , "value":"	القريات"}
,{"code":"307" , "value":"	حائل"}
,{"code":"308" , "value":"	حقل"}
,{"code":"309" , "value":"	جازان"}
,{"code":"310" , "value":"	جدة"}
,{"code":"311" , "value":"	الجوف"}
,{"code":"312" , "value":"	الجبيل"}
,{"code":"313" , "value":"	خميس"}
,{"code":"314" , "value":"	الخرج"}
,{"code":"315" , "value":"	مكة المكرمة"}
,{"code":"316" , "value":"	المدينة المنورة"}
,{"code":"317" , "value":"	نجران"}
,{"code":"318" , "value":"	القصيم"}
,{"code":"319" , "value":"	رابغ"}
,{"code":"320" , "value":"	رفحاء"}
,{"code":"321" , "value":"	الرياض"}
,{"code":"322" , "value":"	شرورة"}
,{"code":"323" , "value":"	سدير"}
,{"code":"324" , "value":"	Shaqra"}
,{"code":"325" , "value":"	تبوك"}
,{"code":"326" , "value":"	الطايف"}
,{"code":"327" , "value":"	أملج"}
,{"code":"328" , "value":"	ينبع"}
,{"code":"329" , "value":"	الزلفي"}
,{"code":"330" , "value":"	وادي الدواسر"}
,{"code":"1200" , "value": "	الخبر"} 
]; 

activeties = [ 
{"code":"232", "value":"	مواد غذائية ومشروبات"}
,{"code":"272", "value":"	منسوجات وملابس وجلود"}
,{"code":"273", "value":"	منتجات خشبية وأثاث"}
,{"code":"274", "value":"	ورق ومنتجاته وطباعة ونشر"}
,{"code":"275", "value":"	منتجات كيماوية وبلاستيكية"}
,{"code":"276", "value":"	مواد بناء وخزف وزجاج"}
,{"code":"277", "value":"	الصناعات المعدنية الأساسية"}
,{"code":"278", "value":"	منتجات معدنية مصنعة وماكينات ومعدات"}
,{"code":"279", "value":"	منتجات معدنية مصنعة وماكينات ومعدات"}
,{"code":"280", "value":"	أخرى"}
,{"code":"283", "value":"	غير محدد"}
,{"code":"905", "value":"	صناعة المنتجات الغذائية"}
,{"code":"906", "value":"	صُنع المشروبات"}
,{"code":"907", "value":"	صُنع المنسوجات"}
,{"code":"908", "value":"	صُنع الملبوسات"}
,{"code":"909", "value":"	صُنع المنتجات الجلدية والمنتجات ذات الصلة"}
,{"code":"910", "value":"	صُنع الخشب ومنتجات الخشب والفلين، باستثناء الأثاث؛ صُنع أصناف من القش ومواد الضفر"}
,{"code":"911", "value":"	صُنع الورق ومنتجات الورق"}
,{"code":"912", "value":"	الطباعة"}
,{"code":"913", "value":"	صُنع فحم الكوك والمنتجات النفطية المكررة"}
,{"code":"914", "value":"	صُنع المواد الكيميائية والمنتجات الكيميائية"}
,{"code":"915", "value":"	صُنع المنتجات الصيدلانية"}
,{"code":"916", "value":"	صُنع منتجات المطاط والبلاستك"}
,{"code":"917", "value":"	صُنع منتجات المعادن اللافلزية الأخرى"}
,{"code":"918", "value":"	صُنع الفلّزات القاعدية"}
,{"code":"919", "value":"	صُنع منتجات المعادن المشكَّلة، باستثناء الآلات والمعدات"}
,{"code":"920", "value":"	صُنع الحواسيب والمنتجات الإلكترونية والبصرية"}
,{"code":"921", "value":"	صُنع المعدات الكهربائية"}
,{"code":"922", "value":"	صُنع الآلات والمعدات غير المصنّفة في موضع آخر"}
,{"code":"923", "value":"	صُنع المركبات ذات المحرّكات والمركبات المقطورة ونصف المقطورة"}
,{"code":"924", "value":"	صُنع معدات النقل الأخرى"}
,{"code":"925", "value":"	صُنع الأثاث"}
,{"code":"926", "value":"	الصناعات التحويلية الأخرى"}
] ;  

productUnit  = [
{"code":"85","value":"	مليمتر"},
{"code":"86","value":"	سنتيمتر"},
{"code":"87","value":"	متر طولي"},
{"code":"88","value":"	كيلومتر"},
{"code":"90","value":"	بوصه"},
{"code":"91","value":"	قدم"},
{"code":"92","value":"	علبة"},
{"code":"93","value":"	عبوه"},
{"code":"94","value":"	درزن"},
{"code":"95","value":"	رطل"},
{"code":"96","value":"	غرام"},
{"code":"97","value":"	كيلوغرام"},
{"code":"98","value":"	طن"},
{"code":"99","value":"	طن مترى"},
{"code":"100","value":"	مليلتر"},
{"code":"101","value":"	سنتيلتر"},
{"code":"102","value":"	لتر"},
{"code":"103","value":"	جالون"},
{"code":"104","value":"	برميل"},
{"code":"105","value":"	متر مكعب"},
{"code":"106","value":"	قرص"},
{"code":"109","value":"	زجاجه"},
{"code":"110","value":"	انبوبه"},
{"code":"111","value":"	تانك"},
{"code":"112","value":"	حبة"},
{"code":"113","value":"	درزن"},
{"code":"114","value":"	طقم"},
{"code":"115","value":"	ربطة"},
{"code":"116","value":"	كرتون"},
{"code":"117","value":"	اسطوانه"},
{"code":"118","value":"	قالب"},
{"code":"119","value":"	زوج"},
{"code":"120","value":"	صندوق"},
{"code":"122","value":"	متر مربع"},
{"code":"123","value":"	قدم مربع"},
{"code":"124","value":"	كيس"},
{"code":"125","value":"	ظرف"},
{"code":"127","value":"	قطعه"},
{"code":"128","value":"	طبق"},
{"code":"129","value":"	وحدة"},
{"code":"130","value":"	خط"},
{"code":"131","value":"	قارورة"},
{"code":"132","value":"	لوح"},
{"code":"133","value":"	تنكه"},
{"code":"134","value":"	بوصه مربعه"},
{"code":"135","value":"	ساعة عمل"},
{"code":"136","value":"	مولد"},
{"code":"137","value":"	غطاء"},
{"code":"138","value":"	ماكينة"},
{"code":"139","value":"	غرفة"},
{"code":"140","value":"	جهاز"},
{"code":"141","value":"	نظام"},
{"code":"142","value":"	مجموعة"},
{"code":"143","value":"	كيلو واط"},
{"code":"144","value":"	ميجاوات / ساعة"},
{"code":"145","value":"	غير معرف"}
]

}

