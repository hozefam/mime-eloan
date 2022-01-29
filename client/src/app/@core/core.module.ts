import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbAuthModule,
  NbPasswordAuthStrategy,
  NbAuthJWTToken
} from "@nebular/auth";
import { NbSecurityModule, NbRoleProvider } from "@nebular/security";
import { of as observableOf } from "rxjs";

import { throwIfAlreadyLoaded } from "./module-import-guard";
import { DataModule } from "./data/data.module";
import { AnalyticsService } from "./utils/analytics.service";

const socialLinks = [];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf("guest");
  }
}

export const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: "email",
        baseEndpoint: "",
        login: {
          // ...
          endpoint: "/api/auth/login",
          method: "post",
          redirect: {
            success: "pages",
            failure: null
          },
          defaultMessages: ["You have been successfully logged in."],
          defaultErrors: ["Login combination is not correct, please try again."]
        },
        token: {
          class: NbAuthJWTToken,
          key: "token"
        },
        refreshToken: {
          endpoint: "/api/auth/refreshToken",
          method: "post",
          redirect: {
            failure: "/auth/login"
          },
          defaultErrors: ["Something went wrong, please try again."],
          defaultMessages: ["Your token has been successfully refreshed."]
        },
        logout: {
          alwaysFail: false,
          endpoint: "",
          method: "",
          redirect: {
            success: "/auth/login",
            failure: null
          },
          defaultErrors: ["Something went wrong, please try again."],
          defaultMessages: ["You have been successfully logged out."]
        }
      })
    ],
    forms: {
      login: {
        socialLinks: socialLinks
      }
    }
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: "*"
      },
      user: {
        parent: "guest",
        create: "*",
        edit: "*",
        remove: "*"
      }
    }
  }).providers,

  {
    provide: NbRoleProvider,
    useClass: NbSimpleRoleProvider
  },
  AnalyticsService
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS]
    };
  }
}
