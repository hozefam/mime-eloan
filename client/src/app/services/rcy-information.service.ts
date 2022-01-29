import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})

export class RCYInfoService {

  constructor(private http: HttpClient) { }
  AttachmentExtentionTypes = ["jpg", "png", "pdf"];

  submitRequest(obj) {
    return new Promise((resolve, reject) => {
      this.http.post("/api/loanRCY/sendRCY", obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }
  getRequest(data) {

    return new Promise((resolve, reject) => {

      this.http.post("/api/loanRCY/getRCY", data).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  getAdminRequest(data) {

    return new Promise((resolve, reject) => {

      this.http.post("/api/loanRCY/getAdminRCY", data).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  getAdminRcyInvesterInformation(data) {

    return new Promise((resolve, reject) => {

      this.http.post("/api/loanRCY/getAdminRcyInvesterInformation", data).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err)
      );
    });
  }

  sources = [{"code" : "SourceLaf$$1" ,"value_ar" : "محلي" , "value_en" : "Local"} ,
            {"code" : "SourceLaf$$2" ,"value_ar" : "دولي" , "value_en" : "International"}];

  contries = [{ "code": "CountryLaf$$1", "value_ar": "افغانستان", "value_en": "Afghanistan" },
  { "code": "CountryLaf$$2", "value_ar": "البانيا", "value_en": "Albania" },
  { "code": "CountryLaf$$3", "value_ar": "الجيرا", "value_en": "Algeria" },
  { "code": "CountryLaf$$4", "value_ar": "ساموا الأمريكية", "value_en": "American Samoa" },
  { "code": "CountryLaf$$5", "value_ar": "اندورا", "value_en": "Andorra" },
  { "code": "CountryLaf$$6", "value_ar": "انقولا", "value_en": "Angola" },
  { "code": "CountryLaf$$7", "value_ar": "انجيلا", "value_en": "Anguilla" },
  { "code": "CountryLaf$$8", "value_ar": "انتيجا", "value_en": "Antigua & Barbuda" },
  { "code": "CountryLaf$$9", "value_ar": "الارجنتين", "value_en": "Argentina" },
  { "code": "CountryLaf$$10", "value_ar": "أرمينيا", "value_en": "Armenia" },
  { "code": "CountryLaf$$11", "value_ar": "أستراليا", "value_en": "Australia" },
  { "code": "CountryLaf$$12", "value_ar": "النمسا", "value_en": "Austria" },
  { "code": "CountryLaf$$13", "value_ar": "أذربيجان", "value_en": "Azerbaijan" },
  { "code": "CountryLaf$$14", "value_ar": "جزر البهاما", "value_en": "Bahamas" },
  { "code": "CountryLaf$$15", "value_ar": "البحرين", "value_en": "Bahrain" },
  { "code": "CountryLaf$$16", "value_ar": "بنغلاديش", "value_en": "Bangladesh" },
  { "code": "CountryLaf$$17", "value_ar": "بربادوس", "value_en": "Barbados" },
  { "code": "CountryLaf$$18", "value_ar": "بيلاروس", "value_en": "Belarus" },
  { "code": "CountryLaf$$19", "value_ar": "بلجيكا", "value_en": "Belgium" },
  { "code": "CountryLaf$$20", "value_ar": "بليز", "value_en": "Belize" },
  { "code": "CountryLaf$$21", "value_ar": "بنن", "value_en": "Benin" },
  { "code": "CountryLaf$$22", "value_ar": "بوتان", "value_en": "Bhutan" },
  { "code": "CountryLaf$$23", "value_ar": "بوليفيا (دولة - المتعددة القوميات)", "value_en": "Bolivia" },
  { "code": "CountryLaf$$24", "value_ar": "البوسنة والهرسك", "value_en": "Bosnia and Herzegovina" },
  { "code": "CountryLaf$$25", "value_ar": "بوتسوانا", "value_en": "Botswana" },
  { "code": "CountryLaf$$26", "value_ar": "البرازيل", "value_en": "Brazil" },
  { "code": "CountryLaf$$27", "value_ar": "بلغاريا", "value_en": "Bulgaria" },
  { "code": "CountryLaf$$28", "value_ar": "الكاميرون", "value_en": "Cameroon" },
  { "code": "CountryLaf$$29", "value_ar": "كندا", "value_en": "Canada" },
  { "code": "CountryLaf$$30", "value_ar": "جمهورية أفريقيا الوسطى", "value_en": "Central African Republic" },
  { "code": "CountryLaf$$31", "value_ar": "تشاد", "value_en": "Chad" },
  { "code": "CountryLaf$$32", "value_ar": "شيلي", "value_en": "Chile" },
  { "code": "CountryLaf$$33", "value_ar": "الصين", "value_en": "China" },
  { "code": "CountryLaf$$34", "value_ar": "كولومبيا", "value_en": "Colombia" },
  { "code": "CountryLaf$$35", "value_ar": "جزر القمر", "value_en": "Comoros" },
  { "code": "CountryLaf$$36", "value_ar": "الكونغو", "value_en": "Congo" },
  { "code": "CountryLaf$$37", "value_ar": "كوستاريكا", "value_en": "Costa Rica" },
  { "code": "CountryLaf$$38", "value_ar": "كرواتيا", "value_en": "Croatia" },
  { "code": "CountryLaf$$39", "value_ar": "قبرص", "value_en": "Cyprus" },
  { "code": "CountryLaf$$40", "value_ar": "تشيكيا", "value_en": "Czechia" },
  { "code": "CountryLaf$$41", "value_ar": "جمهورية كوريا الشعبية الديمقراطية", "value_en": "Democratic People's Republic of Korea" },
  { "code": "CountryLaf$$42", "value_ar": "الدانمرك", "value_en": "Denmark" },
  { "code": "CountryLaf$$43", "value_ar": "جيبوتي", "value_en": "Djibouti" },
  { "code": "CountryLaf$$44", "value_ar": "إكوادور", "value_en": "Ecuador" },
  { "code": "CountryLaf$$45", "value_ar": "مصر", "value_en": "Egypt" },
  { "code": "CountryLaf$$46", "value_ar": "غينيا الاستوائية", "value_en": "Equatorial Guinea" },
  { "code": "CountryLaf$$47", "value_ar": "إثيوبيا", "value_en": "Ethiopia" },
  { "code": "CountryLaf$$48", "value_ar": "فنلندا", "value_en": "Finland" },
  { "code": "CountryLaf$$49", "value_ar": "فرنسا", "value_en": "France" },
  { "code": "CountryLaf$$50", "value_ar": "ألمانيا", "value_en": "Germany" },
  { "code": "CountryLaf$$51", "value_ar": "غانا", "value_en": "Ghana" },
  { "code": "CountryLaf$$52", "value_ar": "اليونان", "value_en": "Greece" },
  { "code": "CountryLaf$$53", "value_ar": "هنغاريا", "value_en": "Hungary" },
  { "code": "CountryLaf$$54", "value_ar": "آيسلندا", "value_en": "Iceland" },
  { "code": "CountryLaf$$55", "value_ar": "الهند", "value_en": "India" },
  { "code": "CountryLaf$$56", "value_ar": "إندونيسيا", "value_en": "Indonesia" },
  { "code": "CountryLaf$$57", "value_ar": "إيران", "value_en": "Iran" },
  { "code": "CountryLaf$$58", "value_ar": "العراق", "value_en": "Iraq" },
  { "code": "CountryLaf$$59", "value_ar": "آيرلندا", "value_en": "Ireland" },
  { "code": "CountryLaf$$60", "value_ar": "إيطاليا", "value_en": "Italy" },
  { "code": "CountryLaf$$61", "value_ar": "جامايكا", "value_en": "Jamaica" },
  { "code": "CountryLaf$$62", "value_ar": "اليابان", "value_en": "Japan" },
  { "code": "CountryLaf$$63", "value_ar": "الأردن", "value_en": "Jordan" },
  { "code": "CountryLaf$$64", "value_ar": "كازاخستان", "value_en": "Kazakhstan" },
  { "code": "CountryLaf$$65", "value_ar": "كينيا", "value_en": "Kenya" },
  { "code": "CountryLaf$$66", "value_ar": "الكويت", "value_en": "Kuwait" },
  { "code": "CountryLaf$$67", "value_ar": "لبنان", "value_en": "Lebanon" },
  { "code": "CountryLaf$$68", "value_ar": "ليبريا", "value_en": "Liberia" },
  { "code": "CountryLaf$$69", "value_ar": "ليبيا", "value_en": "Libya" },
  { "code": "CountryLaf$$70", "value_ar": "ماليزيا", "value_en": "Malaysia" },
  { "code": "CountryLaf$$71", "value_ar": "ملديف", "value_en": "Maldives" },
  { "code": "CountryLaf$$72", "value_ar": "مالي", "value_en": "Mali" },
  { "code": "CountryLaf$$73", "value_ar": "موريتانيا", "value_en": "Mauritania" },
  { "code": "CountryLaf$$74", "value_ar": "المكسيك", "value_en": "Mexico" },
  { "code": "CountryLaf$$75", "value_ar": "منغوليا", "value_en": "Mongolia" },
  { "code": "CountryLaf$$76", "value_ar": "الجبل الأسود", "value_en": "Montenegro" },
  { "code": "CountryLaf$$77", "value_ar": "المغرب", "value_en": "Morocco" },
  { "code": "CountryLaf$$78", "value_ar": "نيبال", "value_en": "Nepal" },
  { "code": "CountryLaf$$79", "value_ar": "هولندا", "value_en": "Netherlands" },
  { "code": "CountryLaf$$80", "value_ar": "نيوزيلندا", "value_en": "New Zealand" },
  { "code": "CountryLaf$$81", "value_ar": "النيجر", "value_en": "Niger" },
  { "code": "CountryLaf$$82", "value_ar": "نيجيريا", "value_en": "Nigeria" },
  { "code": "CountryLaf$$83", "value_ar": "النرويج", "value_en": "Norway" },
  { "code": "CountryLaf$$84", "value_ar": "عمان", "value_en": "Oman" },
  { "code": "CountryLaf$$85", "value_ar": "باكستان", "value_en": "Pakistan" },
  { "code": "CountryLaf$$86", "value_ar": "باراغواي", "value_en": "Paraguay" },
  { "code": "CountryLaf$$87", "value_ar": "بيرو", "value_en": "Peru" },
  { "code": "CountryLaf$$88", "value_ar": "الفلبين", "value_en": "Philippines" },
  { "code": "CountryLaf$$89", "value_ar": "بولندا", "value_en": "Poland" },
  { "code": "CountryLaf$$90", "value_ar": "البرتغال", "value_en": "Portugal" },
  { "code": "CountryLaf$$91", "value_ar": "قطر", "value_en": "Qatar" },
  { "code": "CountryLaf$$92", "value_ar": "جمهورية كوريا", "value_en": "Republic of Korea" },
  { "code": "CountryLaf$$93", "value_ar": "رومانيا", "value_en": "Romania" },
  { "code": "CountryLaf$$94", "value_ar": "الاتحاد الروسي", "value_en": "Russian Federation" },
  { "code": "CountryLaf$$95", "value_ar": "المملكة العربية السعودية", "value_en": "Saudi Arabia" },
  { "code": "CountryLaf$$96", "value_ar": "السنغال", "value_en": "Senegal" },
  { "code": "CountryLaf$$97", "value_ar": "سنغافورة", "value_en": "Singapore" },
  { "code": "CountryLaf$$98", "value_ar": "الصومال", "value_en": "Somalia" },
  { "code": "CountryLaf$$99", "value_ar": "جنوب أفريقيا", "value_en": "South Africa" },
  { "code": "CountryLaf$$100", "value_ar": "جنوب السودان", "value_en": "South Sudan" },
  { "code": "CountryLaf$$101", "value_ar": "إسبانيا", "value_en": "Spain" },
  { "code": "CountryLaf$$102", "value_ar": "سري لانكا", "value_en": "Sri Lanka" },
  { "code": "CountryLaf$$103", "value_ar": "السودان", "value_en": "Sudan" },
  { "code": "CountryLaf$$104", "value_ar": "سوازيلند", "value_en": "Swaziland" },
  { "code": "CountryLaf$$105", "value_ar": "السويد", "value_en": "Sweden" },
  { "code": "CountryLaf$$106", "value_ar": "سويسرا", "value_en": "Switzerland" },
  { "code": "CountryLaf$$107", "value_ar": "الجمهورية العربية السورية", "value_en": "Syrian" },
  { "code": "CountryLaf$$108", "value_ar": "طاجيكستان", "value_en": "Tajikistan" },
  { "code": "CountryLaf$$109", "value_ar": "تايلند", "value_en": "Thailand" },
  { "code": "CountryLaf$$110", "value_ar": "تونس", "value_en": "Tunisia" },
  { "code": "CountryLaf$$111", "value_ar": "تركيا", "value_en": "Turkey" },
  { "code": "CountryLaf$$112", "value_ar": "تركمانستان", "value_en": "Turkmenistan" },
  { "code": "CountryLaf$$113", "value_ar": "أوغندا", "value_en": "Uganda" },
  { "code": "CountryLaf$$114", "value_ar": "أوكرانيا", "value_en": "Ukraine" },
  { "code": "CountryLaf$$115", "value_ar": "الإمارات العربية المتحدة", "value_en": "United Arab Emirates" },
  { "code": "CountryLaf$$116", "value_ar": "المملكة المتحدة البريطانيا", "value_en": "United Kingdom" },
  { "code": "CountryLaf$$117", "value_ar": "الولايات المتحدة الأمريكية", "value_en": "United States of America" },
  { "code": "CountryLaf$$118", "value_ar": "أوروغواي", "value_en": "Uruguay" },
  { "code": "CountryLaf$$119", "value_ar": "أوزبكستان", "value_en": "Uzbekistan" },
  { "code": "CountryLaf$$120", "value_ar": "فنزويلا (جمهورية - البوليفارية)", "value_en": "Venezuela" },
  { "code": "CountryLaf$$121", "value_ar": "فييت نام", "value_en": "Viet Nam" },
  { "code": "CountryLaf$$122", "value_ar": "اليمن", "value_en": "Yemen" },
  { "code": "CountryLaf$$123", "value_ar": "زامبيا", "value_en": "Zambia" },
  { "code": "CountryLaf$$124", "value_ar": "زمبابوي", "value_en": "Zimbabwe" },
  { "code": "CountryLaf$$125", "value_ar": "فلسطين", "value_en": "Palestine" }
  ];

}
