import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  // // {
  // //   title: "Dashboard",
  // //   icon: "nb-home",
  // //   link: "/pages/dashboard",

  // // },
  // {
  //   title: "Users",
  //   icon: "nb-person",
  //   link: "/pages/users"
  // },
  // {
  //   title: "Communications",
  //   icon: "nb-email",

  //   children: [
  //     {
  //       title: "Send Request",
  //       link: "/pages/communications/send-request"
  //     },
  //     {
  //       title: "Inbox",
  //       link: "/pages/communications/receive-request"
  //     },
  //     {
  //       title: "My Cases",
  //       link: "/pages/communications/complaints"
  //     }
  //   ]
  // },
  {
    title: "لوحة الخدمات",
    data:"DASHBOARD.Services",
    icon: "nb-home",
    link: "/pages/client-dashboard",
    home: true
  },
  {
    title: "الطلبات المبدئية",
    icon: "nb-edit",
    data:"COMMON.ApprovedPreliminaryRequest",
    home: false,
    children: [
      {
      title: " ",
      data:"DASHBOARD.LLI",
      icon: "nb-paper-plane",
      home: false,
      link: "/pages/new-request/preliminary-request",
    },
    {
      title: " ",
      data:"DASHBOARD.LlLogistic",
      icon: "nb-paper-plane",
      home: false,
    
    link: "/pages/new-request/preliminary-request/12",
    }
     
]
  },
  {
    title: "التواصل",
   icon: "nb-volume-high",
   data:"DASHBOARD.Communications",
   children: [
          {
          title: "البريد الوارد",
          data:"HOME.inbox",
          icon: "nb-email",
          home: false,
          link: "/pages/communications/receive-request",
        },
        {
          title: "الطلبات المرسله",
          data:"DASHBOARD.SendRequest",
          icon: "nb-paper-plane",
          home: false,
          link: "/pages/communications/send-request",
        }
        ,
        {
          title: " طلباتي",
          data:"DASHBOARD.MyCases",
          icon: "nb-compose ",
          home: false,
          link: "/pages/communications/complaints",
        }
  ]
  },
  {
    title: "طلبات القروض",
    data:"HOME.LoandRequests",
    link: "/pages/new-request/loan-application/0",
    icon: "nb-bar-chart",
    home: false
    
  }/*, 
  {
    title: " أرض وقرض مدن",
    data:"HOME.LModonTitle",
    link: "/pages/new-request/loan-application/7",
    icon: "nb-compose",
    home: false
    
  }/*, 
  {
    title: "مصنع وقرض مدن",
    data:"HOME.FModonTitle",
    icon: "nb-compose",
    link: "/pages/new-request/loan-application/8"
  }
  ,
  
  {
    title: "طلبات أرض وقرض الجبيل",
    data:"HOME.JubailRequestedLandLoan",
    icon: "nb-compose",
    link: "/pages/new-request/loan-application/9"
  }
  ,
  {
    title: "طلبات أرض وقرض ينبع",
    data:"HOME.YanbuRequestedLandLoan",
    icon: "nb-compose",
    link: "/pages/new-request/loan-application/10"
  }
  ,
  {
    title: "أرض وقرض هيئة المدن والمناطق الإقتصادية الخاصة",
    data:"HOME.llsza",
    icon: "nb-compose",
    link: "/pages/new-request/loan-application/11"
  }
 */

  // {
  //   title: "أرض وقرض الهيئة الملكية بالجبيل",
  //   icon: "nb-plus-circled",
  //   children: [
  //     {
  //       title: "الطلبات المبدئية أرض وقرض الهيئة الملكية بالجبيل ",
  //       link: "/pages/new-request/preliminary-request/9",
  //       home: true
  //     },
  //     {
  //       title: "طلبات أرض وقرض الهيئة الملكية بالجبيل",
  //       link: "/pages/new-request/loan-application/9"
  //     }
  //     // {
  //     //   title: "Representation Letter",
  //     //   link: "/pages/new-request/representation-letter"
  //     // }
  //   ]
  // },
  //  {
  //    title: "طلبات أرض وقرض هيئة المدن الإقتصادية",
  //   //  icon: "nb-plus",
  //   link: "/pages/new-request/loan-application/11",
  //   icon: "nb-compose",
  //   home: false
  //  children: [
  //   //  {
  //   //    title: "الطلبات المبدئية أرض وقرض هيئة المدن الإقتصادية ",
  //   //    link: "/pages/new-request/preliminary-request/11",
  //   //    home: false
  //   //          },
  //    {
  //      title: "طلبات أرض وقرض هيئة المدن الإقتصادية",
  //      link: "/pages/new-request/loan-application/11",
  //      home: false
  //    }
  // {
  //   title: "Representation Letter",
  //   link: "/pages/new-request/representation-letter"
  // }
  //  ]
  //  },
  // // {
  // //   title: "أرض وقرض RCY",
  // //   icon: "nb-plus-circled",
  // //   children: [
  // //     {
  // //       title: "الطلبات المبدئية أرض وقرض RCY ",
  // //       link: "/pages/new-request/preliminary-request/10",
  // //       home: true
  // //     },
  // //     {
  // //       title: "طلبات أرض وقرض RCY",
  // //       link: "/pages/new-request/loan-application/10"
  // //     }
  // //     // {
  // //     //   title: "Representation Letter",
  // //     //   link: "/pages/new-request/representation-letter"
  // //     // }
  // //   ]
  // // },
  // {
  //   title: "مصنع وقرض مدن",
  //   icon: "nb-plus-circled",
  //   children: [
  //     {
  //       title: "طلبات المبدئية مصنع وقرض",
  //       link: "/pages/new-request/preliminary-request/8",
  //       home: true
  //     },
  //     {
  //       title: "مصنع وقرض مدن",
  //       link: "/pages/new-request/loan-application/8"
  //     }
  //     // {
  //     //   title: "Representation Letter",
  //     //   link: "/pages/new-request/representation-letter"
  //     // }
  //   ]
  // },


 
  
];
