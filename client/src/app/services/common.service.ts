import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { introJs } from 'intro.js/intro.js';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { _ } from 'underscore';
import * as _l from 'lodash';
const tour_en = introJs().setOptions({
  showProgress: true,
  exitOnEsc: true,
  exitOnOverlayClick: false,
  disableInteraction: true,
  nextLabel: 'Next &rarr;',
  prevLabel: '&larr; Previous',
  skipLabel: 'Close',
  doneLabel: 'Done',
});

const tour_ar = introJs().setOptions({
  showProgress: true,
  exitOnEsc: true,
  exitOnOverlayClick: false,
  disableInteraction: true,
  nextLabel: '&rarr; التالى',
  prevLabel: 'سابق &larr;',
  skipLabel: 'قريب',
  doneLabel: 'فعله',
});

@Injectable({
  providedIn: 'root',
})

export class CommonService {

  //Currency for Technical
  currencyType: any = [
    {
      "Code": "ADP",
      "Name": "Andorran Peseta --> (Old --> EUR)",
      "NameAr": "Andorran Peseta --> (Old --> EUR)",
      "IsoNumber": 20
    },
    {
      "Code": "AED",
      "Name": "United Arab Emirates Dirham",
      "NameAr": "United Arab Emirates Dirham",
      "IsoNumber": 784,
      "Decimals": 2
    },
    {
      "Code": "AFA",
      "Name": "Afghani (Old)",
      "NameAr": "Afghani (Old)",
      "IsoNumber": 4
    },
    {
      "Code": "AFN",
      "Name": "Afghani",
      "NameAr": "Afghani",
      "IsoNumber": 971,
      "Decimals": 2
    },
    {
      "Code": "ALL",
      "Name": "Albanian Lek",
      "NameAr": "Albanian Lek",
      "IsoNumber": 8,
      "Decimals": 2
    },
    {
      "Code": "AMD",
      "Name": "Armenian Dram",
      "NameAr": "Armenian Dram",
      "IsoNumber": 51,
      "Decimals": 2
    },
    {
      "Code": "ANG",
      "Name": "West Indian Guilder",
      "NameAr": "West Indian Guilder",
      "IsoNumber": 532,
      "Decimals": 2
    },
    {
      "Code": "AOA",
      "Name": "Angolanische Kwanza",
      "NameAr": "Angolanische Kwanza",
      "IsoNumber": 973,
      "Decimals": 2
    },
    {
      "Code": "AON",
      "Name": "Angolan New Kwanza (Old)",
      "NameAr": "Angolan New Kwanza (Old)",
      "IsoNumber": 24,
      "Decimals": 2
    },
    {
      "Code": "AOR",
      "Name": "Angolan Kwanza Reajustado (Old)",
      "NameAr": "Angolan Kwanza Reajustado (Old)",
      "IsoNumber": 982,
      "Decimals": 2
    },
    {
      "Code": "ARS",
      "Name": "Argentine Peso",
      "NameAR": "Argentine Peso",
      "IsoNumber": 32,
      "Decimals": 2
    },
    {
      "Code": "ATS",
      "Name": "Austrian Schilling (Old --> EUR)",
      "NameAr": "Austrian Schilling (Old --> EUR)",
      "IsoNumber": 40,
      "Decimals": 2
    },
    {
      "Code": "AUD",
      "Name": "Australian Dollar",
      "NameAr": "Australian Dollar",
      "IsoNumber": 36,
      "Decimals": 2
    },
    {
      "Code": "AWG",
      "Name": "Aruban Florin",
      "NameAr": "Aruban Florin",
      "IsoNumber": 533,
      "Decimals": 2
    },
    {
      "Code": "AZM",
      "Name": "Azerbaijani Manat (Old)",
      "NameAr": "Azerbaijani Manat (Old)",
      "IsoNumber": 31,
      "Decimals": 2
    },
    {
      "Code": "AZN",
      "Name": "Azerbaijani Manat",
      "NameAr": "Azerbaijani Manat",
      "IsoNumber": 944,
      "Decimals": 2
    },
    {
      "Code": "BAM",
      "Name": "Bosnia and Herzegovina Convertible Mark",
      "NameAr": "Bosnia and Herzegovina Convertible Mark",
      "IsoNumber": 977,
      "Decimals": 2
    },
    {
      "Code": "BBD",
      "Name": "Barbados Dollar",
      "NameAr": "Barbados Dollar",
      "IsoNumber": 52,
      "Decimals": 2
    },
    {
      "Code": "BDT",
      "Name": "Bangladesh Taka",
      "IsoNumber": 50,
      "Decimals": 2
    },
    {
      "Code": "BEF",
      "Name": "Belgian Franc (Old --> EUR)",
      "NameAr": "Belgian Franc (Old --> EUR)",
      "IsoNumber": 56
    },
    {
      "Code": "BGN",
      "Name": "Bulgarian Lev",
      "NameAr": "Bulgarian Lev",
      "IsoNumber": 975,
      "Decimals": 2
    },
    {
      "Code": "BHD",
      "Name": "Bahraini Dinar",
      "NameAr": "Bahraini Dinar",
      "IsoNumber": 48,
      "Decimals": 3
    },
    {
      "Code": "BIF",
      "Name": "Burundi Franc",
      "NameAr": "Burundi Franc",
      "IsoNumber": 108
    },
    {
      "Code": "BMD",
      "Name": "Bermudan Dollar",
      "NameAr": "Bermudan Dollar",
      "IsoNumber": 60,
      "Decimals": 2
    },
    {
      "Code": "BND",
      "Name": "Brunei Dollar",
      "NameAr": "Brunei Dollar",
      "IsoNumber": 96,
      "Decimals": 2
    },
    {
      "Code": "BOB",
      "Name": "Boliviano",
      "NameAr": "Boliviano",
      "IsoNumber": 68,
      "Decimals": 2
    },
    {
      "Code": "BRL",
      "Name": "Brazilian Real",
      "NameAr": "Brazilian Real",
      "IsoNumber": 986,
      "Decimals": 2
    },
    {
      "Code": "BSD",
      "Name": "Bahaman Dollar",
      "NameAr": "Bahaman Dollar",
      "IsoNumber": 44,
      "Decimals": 2
    },
    {
      "Code": "BTN",
      "Name": "Bhutan Ngultrum",
      "NameAr": "Bhutan Ngultrum",
      "IsoNumber": 64,
      "Decimals": 2
    },
    {
      "Code": "BWP",
      "Name": "Botswana Pula",
      "NameAr": "Botswana Pula",
      "IsoNumber": 72,
      "Decimals": 2
    },
    {
      "Code": "BYB",
      "Name": "Belarusian Ruble (Old)",
      "NameAr": "Belarusian Ruble (Old)",
      "IsoNumber": 112
    },
    {
      "Code": "BYR",
      "Name": "Belarusian Ruble",
      "NameAr": "Belarusian Ruble",
      "IsoNumber": 974
    },
    {
      "Code": "BZD",
      "Name": "Belize Dollar",
      "NameAr": "Belize Dollar",
      "IsoNumber": 84,
      "Decimals": 2
    },
    {
      "Code": "CAD",
      "Name": "Canadian Dollar",
      "NameAr": "Canadian Dollar",
      "IsoNumber": 124,
      "Decimals": 2
    },
    {
      "Code": "CDF",
      "Name": "Congolese Franc",
      "NameAr": "Congolese Franc",
      "IsoNumber": 976,
      "Decimals": 2
    },
    {
      "Code": "CFP",
      "Name": "French Franc (Pacific Islands)",
      "NameAr": "French Franc (Pacific Islands)",
      "IsoNumber": 953,
      "Decimals": 2
    },
    {
      "Code": "CHF",
      "Name": "Swiss Franc",
      "NameAr": "Swiss Franc",
      "IsoNumber": 756,
      "Decimals": 2
    },
    {
      "Code": "CLP",
      "Name": "Chilean Peso",
      "NameAr": "Chilean Peso",
      "IsoNumber": 152
    },
    {
      "Code": "CNY",
      "Name": "Chinese Renminbi",
      "NameAr": "Chinese Renminbi",
      "IsoNumber": 156,
      "Decimals": 2
    },
    {
      "Code": "COP",
      "Name": "Colombian Peso",
      "NameAr": "Colombian Peso",
      "IsoNumber": 170
    },
    {
      "Code": "CRC",
      "Name": "Costa Rica Colon",
      "NameAr": "Costa Rica Colon",
      "IsoNumber": 188,
      "Decimals": 2
    },
    {
      "Code": "CSD",
      "Name": "Serbian Dinar (Old)",
      "NameAr": "Serbian Dinar (Old)",
      "IsoNumber": 891,
      "Decimals": 2
    },
    {
      "Code": "CUC",
      "Name": "Peso Convertible",
      "IsoNumber": 931,
      "Decimals": 2
    },
    {
      "Code": "CUP",
      "Name": "Cuban Peso",
      "NameAr": "Cuban Peso",
      "IsoNumber": 192,
      "Decimals": 2
    },
    {
      "Code": "CVE",
      "Name": "Cape Verde Escudo",
      "NameAr": "Cape Verde Escudo",
      "IsoNumber": 132,
      "Decimals": 2
    },
    {
      "Code": "CYP",
      "Name": "Cyprus Pound  (Old --> EUR)",
      "NameAr": "Cyprus Pound  (Old --> EUR)",
      "IsoNumber": 196,
      "Decimals": 2
    },
    {
      "Code": "CZK",
      "Name": "Czech Krona",
      "NameAr": "Czech Krona",
      "IsoNumber": 203,
      "Decimals": 2
    },
    {
      "Code": "DEM",
      "Name": "German Mark    (Old --> EUR)",
      "NameAr": "German Mark    (Old --> EUR)",
      "IsoNumber": 280,
      "Decimals": 2
    },
    {
      "Code": "DEM",
      "Name": "(Internal) German Mark (3 dec.places)",
      "NameAr": "(Internal) German Mark (3 dec.places)",
      "IsoNumber": 280,
      "Decimals": 2
    },
    {
      "Code": "DJF",
      "Name": "Djibouti Franc",
      "NameAr": "Djibouti Franc",
      "IsoNumber": 262
    },
    {
      "Code": "DKK",
      "Name": "Danish Krone",
      "NameAr": "Danish Krone",
      "IsoNumber": 208,
      "Decimals": 2
    },
    {
      "Code": "DOP",
      "Name": "Dominican Peso",
      "NameAr": "Dominican Peso",
      "IsoNumber": 214,
      "Decimals": 2
    },
    {
      "Code": "DZD",
      "Name": "Algerian Dinar",
      "NameAr": "Algerian Dinar",
      "IsoNumber": 12,
      "Decimals": 2
    },
    {
      "Code": "ECS",
      "Name": "Ecuadorian Sucre (Old --> USD)",
      "NameAr": "Ecuadorian Sucre (Old --> USD)",
      "IsoNumber": 218
    },
    {
      "Code": "EEK",
      "Name": "Estonian Krone (Old --> EUR)",
      "NameAr": "Estonian Krone (Old --> EUR)",
      "IsoNumber": 233,
      "Decimals": 2
    },
    {
      "Code": "EGP",
      "Name": "Egyptian Pound",
      "NameAr": "Egyptian Pound",
      "IsoNumber": 818,
      "Decimals": 2
    },
    {
      "Code": "ERN",
      "Name": "Eritrean Nafka",
      "NameAr": "Eritrean Nafka",
      "IsoNumber": 232,
      "Decimals": 2
    },
    {
      "Code": "ESP",
      "Name": "Spanish Peseta (Old --> EUR)",
      "NameAr": "Spanish Peseta (Old --> EUR)",
      "IsoNumber": 724
    },
    {
      "Code": "ETB",
      "Name": "Ethiopian Birr",
      "NameAr": "Ethiopian Birr",
      "IsoNumber": 230,
      "Decimals": 2
    },
    {
      "Code": "EUR",
      "Name": "European Euro",
      "NameAr": "ArEuropean Euro",
      "IsoNumber": 978,
      "Decimals": 2
    },
    {
      "Code": "EUR",
      "Name": "European Euro",
      "NameAr": "European Euro",
      "IsoNumber": 978,
      "Decimals": 2
    },
    {
      "Code": "FIM",
      "Name": "Finnish Markka (Old --> EUR)",
      "NameAr": "Finnish Markka (Old --> EUR)",
      "IsoNumber": 246,
      "Decimals": 2
    },
    {
      "Code": "FJD",
      "Name": "Fiji Dollar",
      "NameAr": "Fiji Dollar",
      "IsoNumber": 242,
      "Decimals": 2
    },
    {
      "Code": "FKP",
      "Name": "Falkland Pound",
      "NameAr": "Falkland Pound",
      "IsoNumber": 238,
      "Decimals": 2
    },
    {
      "Code": "FRF",
      "Name": "French Franc (Old --> EUR)",
      "NameAr": "French Franc (Old --> EUR)",
      "IsoNumber": 250,
      "Decimals": 2
    },
    {
      "Code": "GBP",
      "Name": "British Pound",
      "NameAr": "British Pound",
      "IsoNumber": 826,
      "Decimals": 2
    },
    {
      "Code": "GEL",
      "Name": "Georgian Lari",
      "NameAr": "Georgian Lari",
      "IsoNumber": 981,
      "Decimals": 2
    },
    {
      "Code": "GHC",
      "Name": "Ghanaian Cedi (Old)",
      "NameAr": "Ghanaian Cedi (Old)",
      "IsoNumber": 288,
      "Decimals": 2
    },
    {
      "Code": "GHS",
      "Name": "Ghanian Cedi",
      "NameAr": "Ghanian Cedi",
      "IsoNumber": 936,
      "Decimals": 2
    },
    {
      "Code": "GIP",
      "Name": "Gibraltar Pound",
      "NameAr": "Gibraltar Pound",
      "IsoNumber": 292,
      "Decimals": 2
    },
    {
      "Code": "GMD",
      "Name": "Gambian Dalasi",
      "NameAr": "Gambian Dalasi",
      "IsoNumber": 270,
      "Decimals": 2
    },
    {
      "Code": "GNF",
      "Name": "Guinean Franc",
      "NameAr": "Guinean Franc",
      "IsoNumber": 324
    },
    {
      "Code": "GRD",
      "Name": "Greek Drachma (Old --> EUR)",
      "NameAr": "Greek Drachma (Old --> EUR)",
      "IsoNumber": 300
    },
    {
      "Code": "GTQ",
      "Name": "Guatemalan Quetzal",
      "NameAr": "Guatemalan Quetzal",
      "IsoNumber": 320,
      "Decimals": 2
    },
    {
      "Code": "GWP",
      "Name": "Guinea Peso (Old --> SHP)",
      "NameAr": "Guinea Peso (Old --> SHP)",
      "IsoNumber": 624,
      "Decimals": 2
    },
    {
      "Code": "GYD",
      "Name": "Guyana Dollar",
      "NameAr": "Guyana Dollar",
      "IsoNumber": 328,
      "Decimals": 2
    },
    {
      "Code": "HKD",
      "Name": "Hong Kong Dollar",
      "IsoNumber": 344,
      "Decimals": 2
    },
    {
      "Code": "HNL",
      "Name": "Honduran Lempira",
      "IsoNumber": 340,
      "Decimals": 2
    },
    {
      "Code": "HRK",
      "Name": "Croatian Kuna",
      "IsoNumber": 191,
      "Decimals": 2
    },
    {
      "Code": "HTG",
      "Name": "Haitian Gourde",
      "IsoNumber": 332,
      "Decimals": 2
    },
    {
      "Code": "HUF",
      "Name": "Hungarian Forint",
      "IsoNumber": 348
    },
    {
      "Code": "IDR",
      "Name": "Indonesian Rupiah",
      "IsoNumber": 360
    },
    {
      "Code": "IEP",
      "Name": "Irish Punt (Old --> EUR)",
      "IsoNumber": 372,
      "Decimals": 2
    },
    {
      "Code": "ILS",
      "Name": "Israeli Scheckel",
      "IsoNumber": 376,
      "Decimals": 2
    },
    {
      "Code": "INR",
      "Name": "Indian Rupee",
      "IsoNumber": 356,
      "Decimals": 2
    },
    {
      "Code": "IQD",
      "Name": "Iraqui Dinar",
      "IsoNumber": 368,
      "Decimals": 3
    },
    {
      "Code": "IRR",
      "Name": "Iranian Rial",
      "IsoNumber": 364,
      "Decimals": 2
    },
    {
      "Code": "ISK",
      "Name": "Iceland Krona",
      "IsoNumber": 352
    },
    {
      "Code": "ITL",
      "Name": "Italian Lira (Old --> EUR)",
      "IsoNumber": 380
    },
    {
      "Code": "JMD",
      "Name": "Jamaican Dollar",
      "IsoNumber": 388,
      "Decimals": 2
    },
    {
      "Code": "JOD",
      "Name": "Jordanian Dinar",
      "IsoNumber": 400,
      "Decimals": 3
    },
    {
      "Code": "JPY",
      "Name": "Japanese Yen",
      "IsoNumber": 392
    },
    {
      "Code": "KES",
      "Name": "Kenyan Shilling",
      "IsoNumber": 404,
      "Decimals": 2
    },
    {
      "Code": "KGS",
      "Name": "Kyrgyzstan Som",
      "IsoNumber": 417,
      "Decimals": 2
    },
    {
      "Code": "KHR",
      "Name": "Cambodian Riel",
      "IsoNumber": 116,
      "Decimals": 2
    },
    {
      "Code": "KMF",
      "Name": "Comoros Franc",
      "IsoNumber": 174
    },
    {
      "Code": "KPW",
      "Name": "North Korean Won",
      "IsoNumber": 408,
      "Decimals": 2
    },
    {
      "Code": "KRW",
      "Name": "South Korean Won",
      "IsoNumber": 410
    },
    {
      "Code": "KWD",
      "Name": "Kuwaiti Dinar",
      "IsoNumber": 414,
      "Decimals": 3
    },
    {
      "Code": "KYD",
      "Name": "Cayman Dollar",
      "IsoNumber": 136,
      "Decimals": 2
    },
    {
      "Code": "KZT",
      "Name": "Kazakstanian Tenge",
      "IsoNumber": 398,
      "Decimals": 2
    },
    {
      "Code": "LAK",
      "Name": "Laotian Kip",
      "IsoNumber": 418
    },
    {
      "Code": "LBP",
      "Name": "Lebanese Pound",
      "IsoNumber": 422,
      "Decimals": 2
    },
    {
      "Code": "LKR",
      "Name": "Sri Lankan Rupee",
      "IsoNumber": 144,
      "Decimals": 2
    },
    {
      "Code": "LRD",
      "Name": "Liberian Dollar",
      "IsoNumber": 430,
      "Decimals": 2
    },
    {
      "Code": "LSL",
      "Name": "Lesotho Loti",
      "IsoNumber": 426,
      "Decimals": 2
    },
    {
      "Code": "LTL",
      "Name": "Lithuanian Lita",
      "IsoNumber": 440,
      "Decimals": 2
    },
    {
      "Code": "LUF",
      "Name": "Luxembourg Franc (Old --> EUR)",
      "IsoNumber": 442
    },
    {
      "Code": "LVL",
      "Name": "Latvian Lat",
      "IsoNumber": 428,
      "Decimals": 2
    },
    {
      "Code": "LYD",
      "Name": "Libyan Dinar",
      "IsoNumber": 434,
      "Decimals": 3
    },
    {
      "Code": "MAD",
      "Name": "Moroccan Dirham",
      "IsoNumber": 504,
      "Decimals": 2
    },
    {
      "Code": "MDL",
      "Name": "Moldavian Leu",
      "IsoNumber": 498,
      "Decimals": 2
    },
    {
      "Code": "MGA",
      "Name": "Madagascan Ariary",
      "IsoNumber": 969,
      "Decimals": 2
    },
    {
      "Code": "MGF",
      "Name": "Madagascan Franc (Old",
      "IsoNumber": 450
    },
    {
      "Code": "MKD",
      "Name": "Macedonian Denar",
      "IsoNumber": 807,
      "Decimals": 2
    },
    {
      "Code": "MMK",
      "Name": "Myanmar Kyat",
      "IsoNumber": 104,
      "Decimals": 2
    },
    {
      "Code": "MNT",
      "Name": "Mongolian Tugrik",
      "IsoNumber": 496,
      "Decimals": 2
    },
    {
      "Code": "MOP",
      "Name": "Macao Pataca",
      "IsoNumber": 446,
      "Decimals": 2
    },
    {
      "Code": "MRO",
      "Name": "Mauritanian Ouguiya",
      "IsoNumber": 478,
      "Decimals": 2
    },
    {
      "Code": "MTL",
      "Name": "Maltese Lira (Old --> EUR)",
      "IsoNumber": 470,
      "Decimals": 2
    },
    {
      "Code": "MUR",
      "Name": "Mauritian Rupee",
      "IsoNumber": 480,
      "Decimals": 2
    },
    {
      "Code": "MVR",
      "Name": "Maldive Rufiyaa",
      "IsoNumber": 462,
      "Decimals": 2
    },
    {
      "Code": "MWK",
      "Name": "Malawi Kwacha",
      "IsoNumber": 454,
      "Decimals": 2
    },
    {
      "Code": "MXN",
      "Name": "Mexican Pesos",
      "IsoNumber": 484,
      "Decimals": 2
    },
    {
      "Code": "MYR",
      "Name": "Malaysian Ringgit",
      "IsoNumber": 458,
      "Decimals": 2
    },
    {
      "Code": "MZM",
      "Name": "Mozambique Metical (Old)",
      "IsoNumber": 508
    },
    {
      "Code": "MZN",
      "Name": "Mozambique Metical",
      "IsoNumber": 943,
      "Decimals": 2
    },
    {
      "Code": "NAD",
      "Name": "Namibian Dollar",
      "IsoNumber": 516,
      "Decimals": 2
    },
    {
      "Code": "NGN",
      "Name": "Nigerian Naira",
      "IsoNumber": 566,
      "Decimals": 2
    },
    {
      "Code": "NIO",
      "Name": "Nicaraguan Cordoba Oro",
      "IsoNumber": 558,
      "Decimals": 2
    },
    {
      "Code": "NLG",
      "Name": "Dutch Guilder (Old --> EUR)",
      "IsoNumber": 528,
      "Decimals": 2
    },
    {
      "Code": "NOK",
      "Name": "Norwegian Krone",
      "IsoNumber": 578,
      "Decimals": 2
    },
    {
      "Code": "NPR",
      "Name": "Nepalese Rupee",
      "IsoNumber": 524,
      "Decimals": 2
    },
    {
      "Code": "NZD",
      "Name": "New Zealand Dollars",
      "IsoNumber": 554,
      "Decimals": 2
    },
    {
      "Code": "NZD",
      "Name": "New Zealand Dollars",
      "IsoNumber": 554,
      "Decimals": 2
    },
    {
      "Code": "OMR",
      "Name": "Omani Rial",
      "IsoNumber": 512,
      "Decimals": 3
    },
    {
      "Code": "PAB",
      "Name": "Panamanian Balboa",
      "IsoNumber": 590,
      "Decimals": 2
    },
    {
      "Code": "PEN",
      "Name": "Peruvian New Sol",
      "IsoNumber": 604,
      "Decimals": 2
    },
    {
      "Code": "PGK",
      "Name": "Papua New Guinea Kina",
      "IsoNumber": 598,
      "Decimals": 2
    },
    {
      "Code": "PHP",
      "Name": "Philippine Peso",
      "IsoNumber": 608,
      "Decimals": 2
    },
    {
      "Code": "PKR",
      "Name": "Pakistani Rupee",
      "IsoNumber": 586,
      "Decimals": 2
    },
    {
      "Code": "PLN",
      "Name": "Polish Zloty (new)",
      "IsoNumber": 985,
      "Decimals": 2
    },
    {
      "Code": "PTE",
      "Name": "Portuguese Escudo (Old --> EUR)",
      "IsoNumber": 620
    },
    {
      "Code": "PYG",
      "Name": "Paraguayan Guarani",
      "IsoNumber": 600
    },
    {
      "Code": "QAR",
      "Name": "Qatar Rial",
      "IsoNumber": 634,
      "Decimals": 2
    },
    {
      "Code": "RMB",
      "Name": "Chinese Yuan Renminbi",
      "IsoNumber": 156,
      "Decimals": 2
    },
    {
      "Code": "ROL",
      "Name": "Romanian Leu (Old)",
      "IsoNumber": 642
    },
    {
      "Code": "RON",
      "Name": "Romanian Leu",
      "IsoNumber": 946,
      "Decimals": 2
    },
    {
      "Code": "RSD",
      "Name": "Serbian Dinar",
      "IsoNumber": 941,
      "Decimals": 2
    },
    {
      "Code": "RUB",
      "Name": "Russian Ruble",
      "IsoNumber": 643,
      "Decimals": 2
    },
    {
      "Code": "RWF",
      "Name": "Rwandan Franc",
      "IsoNumber": 646
    },
    {
      "Code": "SAR",
      "Name": "Saudi Riyal",
      "IsoNumber": 682,
      "Decimals": 2
    },
    {
      "Code": "SBD",
      "Name": "Solomon Islands Dollar",
      "IsoNumber": 90,
      "Decimals": 2
    },
    {
      "Code": "SCR",
      "Name": "Seychelles Rupee",
      "IsoNumber": 690,
      "Decimals": 2
    },
    {
      "Code": "SDD",
      "Name": "Sudanese Dinar (Old)",
      "IsoNumber": 736,
      "Decimals": 2
    },
    {
      "Code": "SDG",
      "Name": "Sudanese Pound",
      "IsoNumber": 938,
      "Decimals": 2
    },
    {
      "Code": "SDP",
      "Name": "Sudanese Pound (until 1992)",
      "IsoNumber": 736,
      "Decimals": 2
    },
    {
      "Code": "SEK",
      "Name": "Swedish Krona",
      "IsoNumber": 752,
      "Decimals": 2
    },
    {
      "Code": "SGD",
      "Name": "Singapore Dollar",
      "IsoNumber": 702,
      "Decimals": 2
    },
    {
      "Code": "SHP",
      "Name": "St.Helena Pound",
      "IsoNumber": 654,
      "Decimals": 2
    },
    {
      "Code": "SIT",
      "Name": "Slovenian Tolar (Old --> EUR)",
      "IsoNumber": 705,
      "Decimals": 2
    },
    {
      "Code": "SKK",
      "Name": "Slovakian Krona (Old --> EUR)",
      "IsoNumber": 703,
      "Decimals": 2
    },
    {
      "Code": "SLL",
      "Name": "Sierra Leone Leone",
      "IsoNumber": 694,
      "Decimals": 2
    },
    {
      "Code": "SOS",
      "Name": "Somalian Shilling",
      "IsoNumber": 706,
      "Decimals": 2
    },
    {
      "Code": "SRD",
      "Name": "Surinam Dollar",
      "IsoNumber": 968,
      "Decimals": 2
    },
    {
      "Code": "SRG",
      "Name": "Surinam Guilder (Old)",
      "IsoNumber": 740,
      "Decimals": 2
    },
    {
      "Code": "SSP",
      "Name": "South Sudanese Pound",
      "IsoNumber": 728,
      "Decimals": 2
    },
    {
      "Code": "STD",
      "Name": "Sao Tome / Principe Dobra",
      "IsoNumber": 678,
      "Decimals": 2
    },
    {
      "Code": "SVC",
      "Name": "El Salvador Colon",
      "IsoNumber": 222,
      "Decimals": 2
    },
    {
      "Code": "SYP",
      "Name": "Syrian Pound",
      "IsoNumber": 760,
      "Decimals": 2
    },
    {
      "Code": "SZL",
      "Name": "Swaziland Lilangeni",
      "IsoNumber": 748,
      "Decimals": 2
    },
    {
      "Code": "THB",
      "Name": "Thailand Baht",
      "IsoNumber": 764,
      "Decimals": 2
    },
    {
      "Code": "TJR",
      "Name": "Tajikistani Ruble (Old)",
      "IsoNumber": 762
    },
    {
      "Code": "TJS",
      "Name": "Tajikistani Somoni",
      "IsoNumber": 972,
      "Decimals": 2
    },
    {
      "Code": "TMM",
      "Name": "Turkmenistani Manat (Old)",
      "IsoNumber": 795
    },
    {
      "Code": "TMT",
      "Name": "Turkmenistani Manat",
      "IsoNumber": 934,
      "Decimals": 2
    },
    {
      "Code": "TND",
      "Name": "Tunisian Dinar",
      "IsoNumber": 788,
      "Decimals": 3
    },
    {
      "Code": "TOP",
      "Name": "Tongan Pa'anga",
      "IsoNumber": 776,
      "Decimals": 2
    },
    {
      "Code": "TPE",
      "Name": "Timor Escudo --> USD",
      "IsoNumber": 626
    },
    {
      "Code": "TRL",
      "Name": "Turkish Lira (Old)",
      "IsoNumber": 792
    },
    {
      "Code": "TRY",
      "Name": "Turkish Lira",
      "IsoNumber": 949,
      "Decimals": 2
    },
    {
      "Code": "TTD",
      "Name": "Trinidad and Tobago Dollar",
      "IsoNumber": 780,
      "Decimals": 2
    },
    {
      "Code": "TWD",
      "Name": "New Taiwan Dollar",
      "IsoNumber": 901
    },
    {
      "Code": "TZS",
      "Name": "Tanzanian Shilling",
      "IsoNumber": 834,
      "Decimals": 2
    },
    {
      "Code": "UAH",
      "Name": "Ukraine Hryvnia",
      "IsoNumber": 980,
      "Decimals": 2
    },
    {
      "Code": "UGX",
      "Name": "Ugandan Shilling",
      "IsoNumber": 800
    },
    {
      "Code": "USD",
      "Name": "United States Dollar",
      "IsoNumber": 840,
      "Decimals": 2
    },
    {
      "Code": "USD",
      "Name": "(Internal) United States Dollar (5 Dec.)",
      "IsoNumber": 840,
      "Decimals": 2
    },
    {
      "Code": "UYU",
      "Name": "Uruguayan Peso",
      "IsoNumber": 858,
      "Decimals": 2
    },
    {
      "Code": "UZS",
      "Name": "Uzbekistan Som",
      "IsoNumber": 860,
      "Decimals": 2
    },
    {
      "Code": "VEB",
      "Name": "Venezuelan Bolivar (Old)",
      "IsoNumber": 862,
      "Decimals": 2
    },
    {
      "Code": "VEF",
      "Name": "Venezuelan Bolivar",
      "IsoNumber": 937,
      "Decimals": 2
    },
    {
      "Code": "VND",
      "Name": "Vietnamese Dong",
      "IsoNumber": 704
    },
    {
      "Code": "VUV",
      "Name": "Vanuatu Vatu",
      "IsoNumber": 548
    },
    {
      "Code": "WST",
      "Name": "Samoan Tala",
      "IsoNumber": 882,
      "Decimals": 2
    },
    {
      "Code": "XAF",
      "Name": "Gabon CFA Franc BEAC",
      "IsoNumber": 950
    },
    {
      "Code": "XCD",
      "Name": "East Carribean Dollar",
      "IsoNumber": 951,
      "Decimals": 2
    },
    {
      "Code": "XEU",
      "Name": "European Currency Unit (E.C.U.)",
      "IsoNumber": 954,
      "Decimals": 2
    },
    {
      "Code": "XOF",
      "Name": "Benin CFA Franc BCEAO",
      "IsoNumber": 952
    },
    {
      "Code": "XPF",
      "Name": "CFP Franc",
      "IsoNumber": 953
    },
    {
      "Code": "YER",
      "Name": "Yemeni Ryal",
      "IsoNumber": 886,
      "Decimals": 2
    },
    {
      "Code": "YUM",
      "Name": "New Yugoslavian Dinar (Old)",
      "IsoNumber": 891,
      "Decimals": 2
    },
    {
      "Code": "ZAR",
      "Name": "South African Rand",
      "IsoNumber": 710,
      "Decimals": 2
    },
    {
      "Code": "ZMK",
      "Name": "Zambian Kwacha (Old)",
      "IsoNumber": 894,
      "Decimals": 2
    },
    {
      "Code": "ZMW",
      "Name": "Zambian Kwacha (New)",
      "IsoNumber": 967,
      "Decimals": 2
    },
    {
      "Code": "ZRN",
      "Name": "Zaire (Old)",
      "IsoNumber": 180,
      "Decimals": 2
    },
    {
      "Code": "ZWD",
      "Name": "Zimbabwean Dollar (Old)",
      "IsoNumber": 716,
      "Decimals": 2
    },
    {
      "Code": "ZWL",
      "Name": "Zimbabwean Dollar (New)",
      "IsoNumber": 932,
      "Decimals": 2
    },
    {
      "Code": "ZWN",
      "Name": "Zimbabwean Dollar (Old)",
      "IsoNumber": 942,
      "Decimals": 2
    },
    {
      "Code": "ZWR",
      "Name": "Zimbabwean Dollar (Old)",
      "IsoNumber": 935,
      "Decimals": 2
    }
  ];

  //Settings for modal
  modalOptions: any = {
    backdrop: "static",
    keyboard: false,
    container: 'nb-layout',
    size: "lg"
  };

  //Values will have 1 MB extra 
  documentSizeLimits = {
    documentSize5MB: 6291456,
    documentSize10MB: 11534336,
    documentSize50MB: 52428800,
    documentSize100MB: 105906176
  };

  configForCkEditor = {
    uiColor: '#ffffff',
    toolbarGroups: [{ name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
    { name: 'links' }, { name: 'insert' },
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
    { name: 'styles' },
    { name: 'colors' }],
    skin: 'kama',
    resize_enabled: false,
    removePlugins: 'elementspath,save,magicline,smiley',
    extraPlugins: 'divarea,justify,indentblock,colordialog',
    colorButton_foreStyle: {
      element: 'font',
      attributes: { 'color': '#(color)' }
    },
    height: 130,
    removeDialogTabs: 'image:advanced;link:advanced',
    removeButtons: 'Subscript,Superscript,Anchor,Source,Table',
    format_tags: 'p;h1;h2;h3;pre;div',
  };

  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  saveByteArray(data, name) {
    //  console.log(data);
    // let a = document.createElement("a");
    // document.body.appendChild(a);
    // var blob = new Blob(data, { type: "application/octet-stream" });
    // var url = window.URL.createObjectURL(blob);
    // a.href = url;
    // a.download = name;
    // a.click();
    // URL.revokeObjectURL(url);
    var blob = new Blob(data, { type: "application/octet-stream" });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
      window.navigator.msSaveOrOpenBlob(blob, name);
    } else { // chrome
      // const blob = new Blob([blob], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
    }
    this.showSuccessToast(this.translate.instant('COMMON.DownloadingDocument'));
    //var removeUnsafe = url.replace('unsafe:','');
    //let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //let downloadtag = "<a download='" + name + "' href='" + sanitizedUrl + "'>" + name + "</a>";
    // let downloadtag = "<a id='down' href='#' onclick='clickDownloadTable('', ''); return false;'>" + name + "</a>";
    // let downloadtag = "<div id='temp' onclick='clickDownloadTable('" + url + "', '" + name + "')'>" + name +"</div>"
    // this.documentStruc["certificate"] = downloadtag;
    // //let temp = {url, name}
    this.spinnerService.hide();
    //return temp;
  }

  returnTour(language) {
    return language == 'en' ? tour_en : tour_ar;
  }

  dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  pendingDocumentsListComm: { grouped: any; unique: any; };
  defaultLanguage: any = 'ar';
  customerProfiles: any = [];
  dataLogKey: any;
  private profileSource = new BehaviorSubject(this.customerProfiles);
  currentProfiles = this.profileSource.asObservable();


  constructor(private spinnerService: Ng4LoadingSpinnerService,private router: Router, private toastr: ToastrService, private translate: TranslateService) {

    this.translate.addLangs(['en', 'fr', 'ar']);
    this.translate.setDefaultLang(this.defaultLanguage);

  }

  returnEnglishTour() {
    return tour_en;
  }

  returnArabicTour() {
    return tour_ar;
  }

  changeMessage(profilesList: Array<any>) {
    this.profileSource.next(profilesList)
  }

  setTranslate(language) {

    this.defaultLanguage = language;

    this.translate.use(this.defaultLanguage);

  }

  returnTranslate() {
    return this.translate;
  }

  validateHijriDate(hijriDate) {

    let date: string = '';

    if (hijriDate != null) {
      let convertDate = hijriDate.year + '-' + this.leftPad(hijriDate.month, 2) + '-' + this.leftPad(hijriDate.day, 2);
      if (this.dateRegex.test(convertDate))
        date = convertDate;
    }

    return date;

  }

  validateGregorianDate(date) {

    let status: boolean = false;

    if (date != null) {
      status = this.dateRegex.test(date);
    }

    return status;

  }

  leftPad(num, size) {

    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;

  }

  replaceDate(strDate) {

    return strDate.replace(/-/g, '');

  }

  showSuccessToast(message) {

    this.toastr.success(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });

  }

  showFailureToast(message) {

    this.toastr.error(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });

  }

  showWarningToast(message) {

    this.toastr.warning(message, '', {
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
    });


  }

  validMobTelNoOnCount(Id, Num, CountryCode) {
    let valToRet = false;
    let NumStr = Num + "";
    if (Id == 'Mob') {
       if (+CountryCode == 966) {
          if (NumStr.length == 9) {
             valToRet = true;
          }
       } else {
          if (NumStr.length >= 8 && NumStr.length <= 12) {
             valToRet = true;
          }
       }
    } else if (Id == 'Tel') {
       if (+CountryCode == 966) {
          if (NumStr.length == 9) {
             valToRet = true;
          }
       } else {
          if (NumStr.length >= 8 && NumStr.length <= 12) {
             valToRet = true;
          }
       }
    }
    return valToRet;
 }
  sliceString(stringData) {

    return stringData.slice(0, 4) + '-' + stringData.slice(4, 6) + '-' + stringData.slice(6);

  }

  returnDateStringFromDateStringWithoutHyphen(dateStringWithoutHyphen) {

    let dateArray = { year: 0, month: 0, day: 0 };

    dateArray.year = parseInt(dateStringWithoutHyphen.slice(0, 4));

    switch (dateStringWithoutHyphen.length) {

      case 8:

        dateArray.month = parseInt(dateStringWithoutHyphen.slice(4, 6));
        dateArray.day = parseInt(dateStringWithoutHyphen.slice(6));

        break;

      case 6:
      default:

        dateArray.month = parseInt('0' + dateStringWithoutHyphen.slice(4, 5));
        dateArray.day = parseInt('0' + dateStringWithoutHyphen.slice(5));

        break;

    }

    return ('000' + dateArray.year).slice(-4) + '-' + ('0' + dateArray.month).slice(-2) + '-' + ('0' + dateArray.day).slice(-2);

  }

  returnDateStringWithoutHyphenFromDateString(dateString) {

    return dateString.replace(/-/g, '');

  }

  returnGregDateStringFromDateString(dateString) {

    let dateStringWithoutHyphen = dateString.replace(/-/g, '');

    let dateArray = { year: 0, month: 0, day: 0 };

    dateArray.year = parseInt(dateStringWithoutHyphen.slice(0, 4));

    switch (dateStringWithoutHyphen.length) {

      case 8:

        dateArray.month = parseInt(dateStringWithoutHyphen.slice(4, 6));
        dateArray.day = parseInt(dateStringWithoutHyphen.slice(6));

        break;

      case 6:
      default:

        dateArray.month = parseInt('0' + dateStringWithoutHyphen.slice(4, 5));
        dateArray.day = parseInt('0' + dateStringWithoutHyphen.slice(5));

        break;

    }

    let gregDateString = new Date(Date.UTC(dateArray.year, dateArray.month - 1, dateArray.day));

    return gregDateString;

  }

  returnDateArrayFromDateStringWithoutHyphen(dateString) {

    let dateArray = { year: 0, month: 0, day: 0 };

    dateArray.year = parseInt(dateString.slice(0, 4));

    switch (dateString.length) {

      case 8:

        dateArray.month = parseInt(dateString.slice(4, 6));
        dateArray.day = parseInt(dateString.slice(6));

        break;

      case 6:
      default:

        dateArray.month = parseInt('0' + dateString.slice(4, 5));
        dateArray.day = parseInt('0' + dateString.slice(5));

        break;

    }

    return dateArray;

  }

  returnDateArrayFromGregDateString(gregDateString) {

    let dateVal = new Date(gregDateString);

    let yearVal = dateVal.getFullYear();
    let monthVal = dateVal.getMonth() + 1;
    let dayVal = dateVal.getDate();

    let dateArray = { year: yearVal, month: monthVal, day: dayVal };

    return dateArray;

  }

  returnDateStringWithoutHyphenFromGregDateString(gregDateString) {

    let dateVal = new Date(gregDateString);

    let yearVal = dateVal.getFullYear();
    let monthVal = dateVal.getMonth() + 1;
    let dayVal = dateVal.getDate();

    let dateArray = { year: yearVal, month: monthVal, day: dayVal };

    return ('000' + dateArray.year).slice(-4) + ('0' + dateArray.month).slice(-2) + ('0' + dateArray.day).slice(-2);

  }

  returnDateStringFromGregDateString(gregDateString) {

    let dateVal = new Date(gregDateString);

    let yearVal = dateVal.getFullYear();
    let monthVal = dateVal.getMonth() + 1;
    let dayVal = dateVal.getDate();

    let dateArray = { year: yearVal, month: monthVal, day: dayVal };

    return ('000' + dateArray.year).slice(-4) + '-' + ('0' + dateArray.month).slice(-2) + '-' + ('0' + dateArray.day).slice(-2);

  }

  returnGregDateStringFromDateArray(dateArray) {

    let gregDateString = new Date(Date.UTC(dateArray.year, dateArray.month - 1, dateArray.day));

    return gregDateString;

  }

  returnDateStringWithoutHyphenFromDateArray(dateArray) {

    return ('000' + dateArray.year).slice(-4) + ('0' + dateArray.month).slice(-2) + ('0' + dateArray.day).slice(-2);

  }

  returnDateStringFromDateArray(dateArray) {

    return ('000' + dateArray.year).slice(-4) + '-' + ('0' + dateArray.month).slice(-2) + '-' + ('0' + dateArray.day).slice(-2);

  }

  returnGregDateStringFromDateStringWithoutHyphen(dateString) {

    let year = 0, month = 0, day = 0;

    year = parseInt(dateString.slice(0, 4));

    switch (dateString.length) {

      case 8:

        month = parseInt(dateString.slice(4, 6));
        day = parseInt(dateString.slice(6));

        break;

      case 6:
      default:

        month = parseInt('0' + dateString.slice(4, 5));
        day = parseInt('0' + dateString.slice(5));

        break;

    }

    let gregDateString = new Date(Date.UTC(year, month, day));

    return gregDateString.toString();

  }

  returnISODateStringFromDateStringWithoutHyphen(dateString) {

    let year = '', month = '', day = '';

    year = dateString.slice(0, 4);

    switch (dateString.length) {

      case 8:

        month = dateString.slice(4, 6);
        day = dateString.slice(6);

        break;

      case 6:
      default:

        month = '0' + dateString.slice(4, 5);
        day = '0' + dateString.slice(5);

        break;

    }

    let isoDateString = year.toString() + '-' + month.toString() + '-' + day.toString() + 'T00:00:00.000Z';

    return isoDateString;

  }

  returnValueStringFromSARString(SARString) {

    SARString = SARString.replace(/,/g, '');

    let string_array = [];

    string_array = SARString.split(' ');

    if (string_array[1])
      SARString = string_array[1];

    return SARString;

  }

  sortArray(property) {

    let sortOrder = 1;

    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function (a, b) {

      if (sortOrder == -1)
        return b[property].localeCompare(a[property]);
      else
        return a[property].localeCompare(b[property]);

    }

  }

  returnRandomNumber() {

    let rand_num = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return (rand_num);

  }

  returnUploadGet(Docstructure) {

    let url = Docstructure.downloadDocumentUrl;

    let document_array = {
      'url': url,
      'documentList': [],
    };

    for (let i = 0; i < Docstructure.result.length; i++) {

      let EntityId = Docstructure.result[i].EntityId;
      let RefId = Docstructure.result[i].Id;

      if (RefId === undefined) {
        RefId = 0;
      }

      for (let j = 0; j < Docstructure.result[j].Documents.length; j++) {

        let DocumentId = Docstructure.result[i].Documents[j].Id;
        let FileName = Docstructure.result[i].Documents[j].FileName;

        let temp_documentList = {
          'EntityId': EntityId,
          'RefId': RefId,
          'DocumentId': DocumentId,
          'FileName': FileName,
        };

        document_array.documentList.push(temp_documentList);

      }

    }
  }

  returnViewDocumentJson(docstructure) {

    let finalJsonData = {};

    let documentListArray = [];

    for (let i = 0; i < docstructure.result.length; i++) {

      for (let j = 0; j < docstructure.result[i].Documents.length; j++) {

        let data = {

          'EntityId': docstructure.result[i].EntityId,
          'RefId': docstructure.result[i].Id,
          'RelatedEntityId': docstructure.result[i].RelatedEntityId,
          'DocumentId': docstructure.result[i].Documents[j].Id,
          'DocumentDefId': docstructure.result[i].Documents[j].Definition.Id,
          'DocumentDefName': docstructure.result[i].Documents[j].Definition.Name,
          'FileName': docstructure.result[i].Documents[j].FileName,

        }

        documentListArray.push(data);

      }

    }

    finalJsonData = {

      'url': docstructure.downloadDocumentUrl,
      'documentList': documentListArray,

    };

    return finalJsonData;

  }

  downLoadFile(data: any, type: string, fileName: string) {

    if (data.MessType == 'S') {

      // alert(data.result);
      let blob = new Blob([data.result], { type: type });
      let url = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.download = fileName;
      anchor.href = url;
      anchor.click();
      // var pwa = window.open(url);
      // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      //     alert( 'Please disable your Pop-up blocker and try again.');
      // }

    }

  }

  numberToNumberWithCommas(value) {

    let result = value.toString().split('.');
    result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result.join('.');

  }

  numberWithCommasToNumber(value) {

    let result = value;
    result = result.split(',').join('');
    return result;

  }

  findIndexFromId(array, id) {
    if (array && array.length != 0 && (id + "") != "") {
      return _.findIndex(array, function (num) { return (num.id + "") === id });
    } else {
      return -1;
    }
  }

  findCodeFromName(list, name, listId, listName) {
    var unit = list.find((o) => o[listName] == name);
    if (unit)
      return unit[listId];
    else
      return "";
  }

  findNameFromCode(list, id, listId, listName) {
    var unit = list.find((o) => o[listId] == id);
    if (unit)
      return unit[listName];
    else
      return "";
  }
  yyyymmddDateFormatter(date) {
    //From YYYYMMDD to  YYYY/MM/DD
    if (_.isNumber(date)) {
       date = date + "";
    }
    if (date != "" && date.length === 8) {
       var year = date.substr(0, 4);
       var month = date.substr(4, 2);
       var day = date.substr(6, 2);
       date = year + "-" + month + "-" + day;
       return date;
    } else {
       return date;
    }
 }

  returnTextBasedOnLangIfExist(obj, enKey, arKey) {
    let valToRet = _l.get(obj, enKey, '');
    if (this.defaultLanguage == 'ar' && _l.get(obj, arKey, '')) {
       valToRet = _l.get(obj, arKey, '');
    }

    // If value is empty then show the lang whichever has content
    if (valToRet == '') {
       if (_l.get(obj, enKey, ''))
          valToRet = _l.get(obj, enKey, '');
       else if (_l.get(obj, arKey, ''))
          valToRet = _l.get(obj, arKey, '');
    }
    return valToRet;
 }
 
 
 returnDate_ddmmyyyyToyyyymmdd_WithSlash(Dateval) {

  var indexOfDot = Dateval.trim().indexOf(".");

  var temp_Dateval = Dateval.replace(/\./g, "").replace(/\//g, "").replace(/\-/g, "");

  var dateString = "";

  if (temp_Dateval.length == 8) {
     if (indexOfDot == 2) {
        dateString = temp_Dateval.slice(4) + "/" + temp_Dateval.slice(2, 4) + "/" + temp_Dateval.slice(0, 2);
     }
     else {
        dateString = temp_Dateval.slice(0, 4) + "/" + temp_Dateval.slice(4, 6) + "/" + temp_Dateval.slice(6);
     }

  }
  else {
     var temp_DateArr = temp_Dateval.split(" ");
     dateString = temp_DateArr[0].slice(4) + "/" + temp_DateArr[0].slice(2, 4) + "/" + temp_DateArr[0].slice(0, 2) + " " + temp_DateArr[1];
  }


  return dateString;
}
setPendingDocuments(list) {
  this.pendingDocumentsListComm = {
     grouped: list.grouped,
     unique: list.unique
  }
}
navToPrevPageBreadcrumbs(navToUrl) {
  this.router.navigateByUrl(navToUrl);
}
 returnDateArrayFromDateString(dateString) {

    var dateArray = { year: 0, month: 0, day: 0 };

    dateArray.year = parseInt(dateString.slice(0, 4));

    switch (dateString.length) {

      case 8:

        dateArray.month = parseInt(dateString.slice(4, 6));
        dateArray.day = parseInt(dateString.slice(6));

        break;

      case 6:
      default:

        dateArray.month = parseInt("0" + dateString.slice(4, 5));
        dateArray.day = parseInt("0" + dateString.slice(5));

        break;

    }

    return dateArray;

  }

}
